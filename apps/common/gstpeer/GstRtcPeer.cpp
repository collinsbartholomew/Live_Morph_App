#include "GstRtcPeer.h"

#include <QImage>
#include <QDebug>
#include <QPair>
#include <QMutex>
#include <QMutexLocker>
#include <QVideoFrameFormat>

#include <gst/gst.h>
#include <gst/sdp/sdp.h>
#include <gst/webrtc/webrtc.h>
#include <gst/video/video-info.h>
#include <gst/video/video-frame.h>
#include <gst/app/gstappsink.h>
#include <gst/app/gstappsrc.h>

#include <cstring>
#include <functional>
#include <mutex>

namespace {

std::once_flag g_gstInitOnce;

void ensureGstInit()
{
    std::call_once(g_gstInitOnce, []() {
        gst_init(nullptr, nullptr);
    });
}

struct PendingFrame
{
    GstRtcPeerImpl *owner = nullptr;
    QVideoFrame frame; // implicit shared w/ the source camera frame
};

} // namespace

// ---------------------------------------------------------------------------
// Impl — worker-thread state. All pointers are touched only from the worker
// thread (via g_main_context_invoke) except during construction/teardown.
// ---------------------------------------------------------------------------
struct GstRtcPeerImpl
{
    GstRtcPeer *q = nullptr;
    GMainContext *ctx = nullptr;
    GMainLoop *loop = nullptr;

    GstElement *pipeline = nullptr;
    GstElement *webrtc = nullptr;
    GstElement *appsrc = nullptr;   // send branch (input frames)
    GstElement *appsink = nullptr;  // receive branch
    GstElement *capsFilter = nullptr;    // "prefilter": resolution caps
    GstElement *rateFilter = nullptr;    // "ratefilter": framerate caps
    GstElement *vp8enc = nullptr;        // named encoder for live bitrate knobs

    bool sendVideo = true;
    bool recvVideo = true;
    bool offerCreated = false;
    bool remoteDescriptionSet = false;

    QString stun;
    QString turn;

    // Quality ladder (desired send-side output parameters)
    int qWidth = 1280;
    int qHeight = 720;
    int qFps = 30;
    int qBitrateKbps = 2500;
    bool qualityDirty = false; // set by setQuality — applied on worker

    // Pending camera frame mailbox (single-slot; latest wins)
    QMutex frameMutex;
    QVideoFrame pendingFrame;
    bool hasPendingFrame = false;

    // Decoded-frame accounting (stats window + stall watchdog)
    guint64 windowDecodedFrames = 0;
    guint64 windowDecodedBytes = 0;
    guint64 decodedFramesTotal = 0;

    std::atomic<bool> running{false};

    // State caches written by the worker's notify handlers — the public
    // getters read these instead of touching worker-owned elements from the
    // GUI thread (TOCTOU guard against workerStop nulling them mid-read).
    std::atomic<int> connStateCache{0}; // GstWebRTCPeerConnectionState
    std::atomic<int> iceStateCache{0};  // GstWebRTCICEConnectionState

    // Periodic 2s stat pump on the worker context
    guint statsSourceId = 0;

    // Bus watch source, attached to the WORKER context (the default GLib
    // context is never iterated in a Qt app — a watch there would never fire).
    GSource *busWatch = nullptr;

    // Stall watchdog state
    guint64 lastDecodedProbe = 0;
    int stallTicks = 0;
    bool stallEmitted = false;

    // Signal emitters (set from constructor so they may `emit`).
    std::function<void(const QString &)> emitOfferSdp;
    std::function<void(int, const QString &)> emitLocalIce;
    std::function<void()> emitConnChanged;
    std::function<void()> emitIceChanged;
    std::function<void()> emitRunningChanged;
    std::function<void(const QString &)> emitError;
    std::function<void(const QVariantMap &)> emitStats;
    std::function<void()> emitStall;
};

// ---------------------------------------------------------------------------
// GStreamer / GLib callbacks.
// ---------------------------------------------------------------------------
namespace {

void onOfferCreated(GstPromise *promise, gpointer userData)
{
    auto *im = static_cast<GstRtcPeerImpl *>(userData);
    const GstStructure *reply = gst_promise_get_reply(promise);
    GstWebRTCSessionDescription *offer = nullptr;
    gst_structure_get(reply, "offer", GST_TYPE_WEBRTC_SESSION_DESCRIPTION, &offer, nullptr);
    gst_promise_unref(promise);

    if (!offer || !offer->sdp) {
        if (offer)
            gst_webrtc_session_description_free(offer);
        im->emitError(QStringLiteral("Failed to create SDP offer"));
        return;
    }

    GstPromise *local = gst_promise_new();
    g_signal_emit_by_name(im->webrtc, "set-local-description", offer, local);
    gst_promise_interrupt(local);
    gst_promise_unref(local);

    gchar *text = gst_sdp_message_as_text(offer->sdp);
    if (text) {
        im->emitOfferSdp(QString::fromUtf8(text));
        g_free(text);
    }
    im->offerCreated = true;
    gst_webrtc_session_description_free(offer);
}

void onNegotiationNeeded(GstElement *, gpointer userData)
{
    auto *im = static_cast<GstRtcPeerImpl *>(userData);
    if (im->offerCreated)
        return;
    GstPromise *promise = gst_promise_new_with_change_func(onOfferCreated, im, nullptr);
    g_signal_emit_by_name(im->webrtc, "create-offer", nullptr, promise);
}

void onLocalIceCandidate(GstElement *, guint mlineIndex, gchar *candidate, gpointer userData)
{
    auto *im = static_cast<GstRtcPeerImpl *>(userData);
    if (candidate)
        im->emitLocalIce(static_cast<int>(mlineIndex), QString::fromUtf8(candidate));
}

void onConnectionStateNotify(GObject *, GParamSpec *, gpointer userData)
{
    auto *im = static_cast<GstRtcPeerImpl *>(userData);
    if (im->webrtc) {
        GstWebRTCPeerConnectionState s = GST_WEBRTC_PEER_CONNECTION_STATE_NEW;
        g_object_get(im->webrtc, "connection-state", &s, nullptr);
        im->connStateCache.store(static_cast<int>(s), std::memory_order_relaxed);
    }
    im->emitConnChanged();
}

void onIceStateNotify(GObject *, GParamSpec *, gpointer userData)
{
    auto *im = static_cast<GstRtcPeerImpl *>(userData);
    if (im->webrtc) {
        GstWebRTCICEConnectionState s = GST_WEBRTC_ICE_CONNECTION_STATE_NEW;
        g_object_get(im->webrtc, "ice-connection-state", &s, nullptr);
        im->iceStateCache.store(static_cast<int>(s), std::memory_order_relaxed);
    }
    im->emitIceChanged();
}

gboolean onBusMessage(GstBus *, GstMessage *msg, gpointer userData)
{
    auto *im = static_cast<GstRtcPeerImpl *>(userData);
    switch (GST_MESSAGE_TYPE(msg)) {
    case GST_MESSAGE_ERROR: {
        GError *err = nullptr;
        gchar *dbg = nullptr;
        gst_message_parse_error(msg, &err, &dbg);
        QString text = err ? QString::fromUtf8(err->message) : QStringLiteral("GStreamer error");
        qWarning() << "GstRtcPeer ERROR:" << text << (dbg ? dbg : "");
        im->emitError(text);
        g_clear_error(&err);
        g_free(dbg);
        break;
    }
    default:
        break;
    }
    return TRUE;
}

GstFlowReturn onNewSample(GstAppSink *appsink, gpointer userData)
{
    auto *im = static_cast<GstRtcPeerImpl *>(userData);
    GstSample *sample = nullptr;
    g_signal_emit_by_name(appsink, "pull-sample", &sample);
    if (!sample)
        return GST_FLOW_OK;

    GstBuffer *buf = gst_sample_get_buffer(sample);
    GstMapInfo info;
    if (buf && gst_buffer_map(buf, &info, GST_MAP_READ)) {
        GstCaps *scaps = gst_sample_get_caps(sample);
        GstVideoInfo vinfo;
        if (scaps && gst_video_info_from_caps(&vinfo, scaps)
            && vinfo.finfo->format == GST_VIDEO_FORMAT_RGB) {
            // One deep copy, then shared: QImage is implicitly shared, so both
            // the sink frame and the frameReady emission view the same bytes.
            QImage img(static_cast<const uchar *>(info.data), vinfo.width, vinfo.height,
                       vinfo.stride[0], QImage::Format_RGB888);
            const QImage owned = img.copy();  // exactly ONE deep copy
            im->windowDecodedFrames++;
            im->windowDecodedBytes += info.size;
            im->decodedFramesTotal++;
            if (im->q->videoSink())
                im->q->videoSink()->setVideoFrame(QVideoFrame(owned));
            // Tee the decoded morph frame to OBS (MJPEG), vcam and recording.
            emit im->q->frameReady(owned);
        }
        gst_buffer_unmap(buf, &info);
    }
    gst_sample_unref(sample);
    return GST_FLOW_OK;
}

void onDecodebinPadAdded(GstElement *, GstPad *pad, gpointer userData)
{
    auto *im = static_cast<GstRtcPeerImpl *>(userData);
    GstCaps *caps = gst_pad_get_current_caps(pad);
    if (!caps)
        caps = gst_pad_query_caps(pad, nullptr);
    if (!caps)
        return;
    const char *name = gst_structure_get_name(gst_caps_get_structure(caps, 0));
    if (!name || !g_str_has_prefix(name, "video/x-raw")) {
        gst_caps_unref(caps);
        return;
    }
    gst_caps_unref(caps);

    if (im->appsink) {
        // only one receive stream supported
        return;
    }

    GstElement *conv = gst_element_factory_make("videoconvert", nullptr);
    GstElement *filt = gst_element_factory_make("capsfilter", nullptr);
    GstElement *sink = gst_element_factory_make("appsink", nullptr);

    GstCaps *fcaps = gst_caps_from_string("video/x-raw,format=RGB");
    g_object_set(filt, "caps", fcaps, nullptr);
    gst_caps_unref(fcaps);
    // Latest-frame-wins receive: never queue stale decoded frames.
    g_object_set(sink, "emit-signals", TRUE, "sync", FALSE,
                 "max-buffers", 1, "drop", TRUE, nullptr);

    gst_bin_add_many(GST_BIN(im->pipeline), conv, filt, sink, nullptr);
    if (!gst_element_link_many(conv, filt, sink, nullptr)) {
        qWarning() << "GstRtcPeer: failed to link receive chain";
        return;
    }
    for (GstElement *e : {conv, filt, sink})
        gst_element_sync_state_with_parent(e);

    im->appsink = sink;
    g_signal_connect(sink, "new-sample", G_CALLBACK(onNewSample), im);

    GstPad *sinkpad = gst_element_get_static_pad(conv, "sink");
    if (gst_pad_link(pad, sinkpad) != GST_PAD_LINK_OK)
        qWarning() << "GstRtcPeer: failed to link decodebin -> videoconvert";
    gst_object_unref(sinkpad);
    // NOTE: `pad` came from the pad-added signal (transfer-none) — the element
    // owns that reference. Never unref it here.
}

void onPadAdded(GstElement *, GstPad *pad, gpointer userData)
{
    auto *im = static_cast<GstRtcPeerImpl *>(userData);
    GstCaps *caps = gst_pad_get_current_caps(pad);
    if (!caps)
        caps = gst_pad_query_caps(pad, nullptr);
    if (!caps)
        return;
    const char *name = gst_structure_get_name(gst_caps_get_structure(caps, 0));
    if (!name || !g_str_has_prefix(name, "video/")) {
        gst_caps_unref(caps);
        return;
    }
    gst_caps_unref(caps);

    GstElement *decodebin = gst_element_factory_make("decodebin", nullptr);
    g_signal_connect(decodebin, "pad-added", G_CALLBACK(onDecodebinPadAdded), im);
    gst_bin_add(GST_BIN(im->pipeline), decodebin);
    gst_element_sync_state_with_parent(decodebin);

    GstPad *sinkpad = gst_element_get_static_pad(decodebin, "sink");
    if (gst_pad_link(pad, sinkpad) != GST_PAD_LINK_OK)
        qWarning() << "GstRtcPeer: failed to link webrtc -> decodebin";
    gst_object_unref(sinkpad);
    // NOTE: `pad` is transfer-none from the pad-added signal — element owns it.
}

// ---------------------------------------------------------------------------
// Webrtcbin stats callback: parse RTT from nested stat structures.
// ---------------------------------------------------------------------------
gboolean collectRttCb(GQuark, const GValue *value, gpointer userData)
{
    auto *rttMs = static_cast<double *>(userData);
    if (!GST_VALUE_HOLDS_STRUCTURE(value))
        return TRUE;
    const GstStructure *st = gst_value_get_structure(value);
    if (!st)
        return TRUE;

    // candidate-pair: "current-round-trip-time" (seconds, gdouble)
    gdouble r = 0;
    if (gst_structure_get_double(st, "current-round-trip-time", &r) && r >= 0) {
        *rttMs = r * 1000.0;
        return TRUE;
    }
    // remote-inbound-rtp: "round-trip-time" (RTCP XR, 1/65536 s) — convert
    guint64 rt = 0;
    if (gst_structure_get(st, "round-trip-time", G_TYPE_UINT64, &rt, nullptr))
        *rttMs = (double)rt * 1000.0 / 65536.0;
    return TRUE;
}

void onGetStats(GstPromise *promise, gpointer data)
{
    auto *im = static_cast<GstRtcPeerImpl *>(data);
    const GstStructure *stats = gst_promise_get_reply(promise);
    double rttMs = -1;
    if (stats)
        gst_structure_foreach(stats, collectRttCb, &rttMs);
    gst_promise_unref(promise);

    QVariantMap m;
    if (rttMs >= 0)
        m.insert(QStringLiteral("rtt_ms"), rttMs);
    // fps and bandwidth derive from the worker-side counters (exact).
    m.insert(QStringLiteral("fps_in"), im->windowDecodedFrames / 2.0);
    m.insert(QStringLiteral("kbps_in"), (im->windowDecodedBytes * 8 / 2) / 1000.0);
    im->windowDecodedFrames = 0;
    im->windowDecodedBytes = 0;
    im->emitStats(m);
}

gboolean periodicStats(gpointer userData)
{
    auto *im = static_cast<GstRtcPeerImpl *>(userData);
    if (!im->webrtc || !im->pipeline)
        return G_SOURCE_CONTINUE;

    GstPromise *promise = gst_promise_new_with_change_func(onGetStats, im, nullptr);
    g_signal_emit_by_name(im->webrtc, "get-stats", nullptr, promise);

    // Stall watchdog: after negotiation, if the total decoded-frame counter
    // hasn't advanced for 3 consecutive polls (~6s), the engine stalled.
    if (im->offerCreated && im->remoteDescriptionSet) {
        if (im->decodedFramesTotal == im->lastDecodedProbe) {
            if (++im->stallTicks >= 3 && !im->stallEmitted) {
                im->stallEmitted = true;
                im->emitStall();
            }
        } else {
            im->stallTicks = 0;
            im->stallEmitted = false;
        }
        im->lastDecodedProbe = im->decodedFramesTotal;
    }
    return G_SOURCE_CONTINUE;
}

// ---------------------------------------------------------------------------
// Worker operations.
// ---------------------------------------------------------------------------

gboolean workerStart(gpointer userData)
{
    auto *im = static_cast<GstRtcPeerImpl *>(userData);
    if (im->pipeline)
        return G_SOURCE_REMOVE;

    QString stunPart = !im->stun.isEmpty() ? QStringLiteral(" stun-server=%1").arg(im->stun)
                                           : QString();
    QString turnPart = !im->turn.isEmpty() ? QStringLiteral(" turn-server=%1").arg(im->turn)
                                           : QString();

    QString desc;
    if (im->sendVideo) {
        // Send chain: appsrc (from camera mailbox) → convert → scale to the
        // quality-ladder resolution → rate-limit to target fps → VP8 encode →
        // RTP → webrtcbin. RTCP feedback (NACK/PLI/FIR) is EXPOSED via caps so
        // webrtcbin advertises them in the SDP — remote peers then send PLI
        // keyframe requests after packet loss, which vp8enc honors via the
        // forwarding rtcp-fb caps: recovery without our intervention.
        desc = QStringLiteral("webrtcbin name=webrtc") + stunPart + turnPart
            + QStringLiteral(
            " appsrc name=appsrc is-live=true format=time do-timestamp=true "
            "! queue max-size-buffers=2 leaky=downstream "
            "! videoconvert "
            "! videoscale "
            "! capsfilter name=prefilter "
            "! videorate "
            "! capsfilter name=ratefilter "
            "! vp8enc name=vp8enc deadline=1 target-bitrate=%1 keyframe-max-dist=60 "
            "! rtpvp8pay name=pay0 pt=96 "
            "! application/x-rtp,media=video,encoding-name=VP8,payload=96,rtcp-fb-nack=true,rtcp-fb-nack-pli=true,rtcp-fb-ccm-fir=true "
            "! webrtc. ")
            .arg(im->qBitrateKbps * 1000);
    } else {
        desc = QStringLiteral("webrtcbin name=webrtc") + stunPart + turnPart;
    }

    GError *parseErr = nullptr;
    im->pipeline = gst_parse_launch(desc.toUtf8().constData(), &parseErr);
    if (!im->pipeline) {
        const QString detail = parseErr
            ? QString::fromUtf8(parseErr->message)
            : QStringLiteral("unknown gst_parse_launch failure");
        qWarning() << "GstRtcPeer pipeline parse failed:" << detail;
        im->emitError(QStringLiteral("Failed to build GStreamer pipeline: %1").arg(detail));
        g_clear_error(&parseErr);
        return G_SOURCE_REMOVE;
    }
    g_clear_error(&parseErr);

    im->webrtc = gst_bin_get_by_name(GST_BIN(im->pipeline), "webrtc");
    if (im->sendVideo) {
        im->appsrc = gst_bin_get_by_name(GST_BIN(im->pipeline), "appsrc");
        im->capsFilter = gst_bin_get_by_name(GST_BIN(im->pipeline), "prefilter");
        im->rateFilter = gst_bin_get_by_name(GST_BIN(im->pipeline), "ratefilter");
        im->vp8enc = gst_bin_get_by_name(GST_BIN(im->pipeline), "vp8enc");

        // Seed the quality ladder caps
        GstCaps *resCaps = gst_caps_new_simple("video/x-raw",
                                               "width", G_TYPE_INT, im->qWidth,
                                               "height", G_TYPE_INT, im->qHeight,
                                               nullptr);
        if (im->capsFilter) g_object_set(im->capsFilter, "caps", resCaps, nullptr);
        gst_caps_unref(resCaps);

        GstCaps *fpsCaps = gst_caps_new_simple("video/x-raw",
                                               "framerate", GST_TYPE_FRACTION, im->qFps, 1,
                                               nullptr);
        if (im->rateFilter) g_object_set(im->rateFilter, "caps", fpsCaps, nullptr);
        gst_caps_unref(fpsCaps);
    }

    if (!im->sendVideo && im->recvVideo) {
        GstCaps *caps = gst_caps_from_string(
            "application/x-rtp,media=video,encoding-name=VP8,clock-rate=90000");
        g_signal_emit_by_name(im->webrtc, "add-transceiver",
                              GST_WEBRTC_RTP_TRANSCEIVER_DIRECTION_RECVONLY, caps);
        gst_caps_unref(caps);
    }

    g_signal_connect(im->webrtc, "on-negotiation-needed", G_CALLBACK(onNegotiationNeeded), im);
    g_signal_connect(im->webrtc, "on-ice-candidate", G_CALLBACK(onLocalIceCandidate), im);
    g_signal_connect(im->webrtc, "pad-added", G_CALLBACK(onPadAdded), im);
    g_signal_connect(im->webrtc, "notify::connection-state", G_CALLBACK(onConnectionStateNotify), im);
    g_signal_connect(im->webrtc, "notify::ice-connection-state", G_CALLBACK(onIceStateNotify), im);

    GstBus *bus = gst_pipeline_get_bus(GST_PIPELINE(im->pipeline));
    im->busWatch = gst_bus_create_watch(bus);
    g_source_set_callback(im->busWatch, (GSourceFunc)onBusMessage, im, nullptr);
    g_source_attach(im->busWatch, im->ctx);
    g_source_unref(im->busWatch);
    gst_object_unref(bus);

    if (gst_element_set_state(im->pipeline, GST_STATE_PLAYING) == GST_STATE_CHANGE_FAILURE) {
        im->emitError(QStringLiteral("Pipeline failed to reach PLAYING"));
        // Zombie-peer guard: release everything so a future start() works
        // instead of no-oping forever against a dead pipeline.
        if (im->busWatch) {
            g_source_destroy(im->busWatch);
            im->busWatch = nullptr;
        }
        if (im->statsSourceId) {
            GSource *src = g_main_context_find_source_by_id(im->ctx, im->statsSourceId);
            if (src) g_source_destroy(src);
            im->statsSourceId = 0;
        }
        gst_object_unref(im->pipeline);
        im->pipeline = nullptr;
        im->webrtc = nullptr;
        im->appsrc = nullptr;
        im->appsink = nullptr;
        im->capsFilter = nullptr;
        im->rateFilter = nullptr;
        im->vp8enc = nullptr;
        im->running.store(false);
        im->emitRunningChanged();
        return G_SOURCE_REMOVE;
    }

    // Start the periodic stats + stall watchdog pump (2s cadence on the worker).
    if (!im->statsSourceId) {
        im->statsSourceId = g_timeout_add_seconds_full(G_PRIORITY_DEFAULT, 2,
                                                       periodicStats, im, nullptr);
    }

    im->running.store(true);
    im->emitRunningChanged();
    return G_SOURCE_REMOVE;
}

gboolean workerStop(gpointer userData)
{
    auto *im = static_cast<GstRtcPeerImpl *>(userData);
    if (im->pipeline) {
        if (im->busWatch) {
            g_source_destroy(im->busWatch);
            im->busWatch = nullptr;
        }
        if (im->statsSourceId) {
            GSource *src = g_main_context_find_source_by_id(im->ctx, im->statsSourceId);
            if (src) g_source_destroy(src);
            im->statsSourceId = 0;
        }
        // Graceful drain: EOS the send branch, give the engine up to ~250ms to
        // flush the encoder tail (best-effort; non-blocking teardown).
        if (im->appsrc)
            gst_app_src_end_of_stream(GST_APP_SRC(im->appsrc));
        gst_element_set_state(im->pipeline, GST_STATE_NULL);
        gst_object_unref(im->pipeline);
        // Release the gst_bin_get_by_name() references (each +1 ref — leaking
        // them keeps whole elements finalized-never for the process lifetime).
        if (im->webrtc) gst_object_unref(im->webrtc);
        if (im->appsrc) gst_object_unref(im->appsrc);
        if (im->capsFilter) gst_object_unref(im->capsFilter);
        if (im->rateFilter) gst_object_unref(im->rateFilter);
        if (im->vp8enc) gst_object_unref(im->vp8enc);
        im->pipeline = nullptr;
        im->webrtc = nullptr;
        im->appsrc = nullptr;
        im->appsink = nullptr;
        im->capsFilter = nullptr;
        im->rateFilter = nullptr;
        im->vp8enc = nullptr;
        im->offerCreated = false;
        im->remoteDescriptionSet = false;
        im->stallTicks = 0;
        im->stallEmitted = false;
        im->lastDecodedProbe = 0;
    }
    im->running.store(false);
    im->emitRunningChanged();
    return G_SOURCE_REMOVE;
}

gboolean workerShutdown(gpointer userData)
{
    workerStop(userData);
    auto *im = static_cast<GstRtcPeerImpl *>(userData);
    if (im->loop)
        g_main_loop_quit(im->loop);
    return G_SOURCE_REMOVE;
}

gboolean workerSetAnswer(gpointer userData)
{
    auto *data = static_cast<QPair<GstRtcPeerImpl *, QString> *>(userData);
    GstRtcPeerImpl *im = data->first;
    const QByteArray sdpBytes = data->second.toUtf8();
    delete data;

    GstSDPMessage *sdp = nullptr;
    if (gst_sdp_message_new_from_text(sdpBytes.constData(), &sdp) != GST_SDP_OK || !sdp) {
        im->emitError(QStringLiteral("Failed to parse remote answer SDP"));
        return G_SOURCE_REMOVE;
    }

    GstWebRTCSessionDescription *answer =
        gst_webrtc_session_description_new(GST_WEBRTC_SDP_TYPE_ANSWER, sdp);
    GstPromise *promise = gst_promise_new();
    g_signal_emit_by_name(im->webrtc, "set-remote-description", answer, promise);
    gst_promise_interrupt(promise);
    gst_promise_unref(promise);
    gst_webrtc_session_description_free(answer);
    im->remoteDescriptionSet = true;
    return G_SOURCE_REMOVE;
}

gboolean workerAddIce(gpointer userData)
{
    auto *data = static_cast<QPair<GstRtcPeerImpl *, QJsonObject> *>(userData);
    GstRtcPeerImpl *im = data->first;
    const int mline = data->second.value(QStringLiteral("sdpMLineIndex")).toInt(0);
    const QString cand = data->second.value(QStringLiteral("candidate")).toString();
    delete data;

    if (!cand.isEmpty())
        g_signal_emit_by_name(im->webrtc, "add-ice-candidate", mline, cand.toUtf8().constData());
    return G_SOURCE_REMOVE;
}

// -- Send-path: zero-copy single-plane wrap ----------------------------------

// Qt surface format -> GStreamer format, when tightly mappable in one plane.
static GstVideoFormat gstFormatForQtPixelFormat(QVideoFrameFormat::PixelFormat f)
{
    // Single-plane formats that map 1:1 onto a GStreamer video format.
    switch (f) {
    case QVideoFrameFormat::Format_RGBA8888:      return GST_VIDEO_FORMAT_RGBA;
    case QVideoFrameFormat::Format_RGBX8888:      return GST_VIDEO_FORMAT_RGBx;
    case QVideoFrameFormat::Format_BGRA8888:
    case QVideoFrameFormat::Format_BGRA8888_Premultiplied: return GST_VIDEO_FORMAT_BGRA;
    case QVideoFrameFormat::Format_BGRX8888:      return GST_VIDEO_FORMAT_BGRx;
    case QVideoFrameFormat::Format_ARGB8888:
    case QVideoFrameFormat::Format_ARGB8888_Premultiplied: return GST_VIDEO_FORMAT_ARGB;
    case QVideoFrameFormat::Format_XRGB8888:      return GST_VIDEO_FORMAT_xRGB;
    case QVideoFrameFormat::Format_ABGR8888:      return GST_VIDEO_FORMAT_ABGR;
    case QVideoFrameFormat::Format_XBGR8888:      return GST_VIDEO_FORMAT_xBGR;
    default: return GST_VIDEO_FORMAT_UNKNOWN;
    }
}

struct FrameHolder {
    QVideoFrame frame; // keeps the source alive while GStreamer reads its pages
};

void freeFrameHolder(gpointer p)
{
    if (!p) return;
    auto *h = static_cast<FrameHolder *>(p);
    if (h->frame.isMapped())
        h->frame.unmap();
    delete h;
}

gboolean workerPushFrame(gpointer userData)
{
    std::unique_ptr<PendingFrame> data(static_cast<PendingFrame *>(userData));
    GstRtcPeerImpl *im = data->owner;
    if (!im->appsrc)
        return G_SOURCE_REMOVE;

    // Live quality reconfig — apply any pending ladder change first.
    if (im->qualityDirty) {
        im->qualityDirty = false;
        GstCaps *resCaps = gst_caps_new_simple("video/x-raw",
                    "width", G_TYPE_INT, im->qWidth,
                    "height", G_TYPE_INT, im->qHeight, nullptr);
        if (im->capsFilter) g_object_set(im->capsFilter, "caps", resCaps, nullptr);
        gst_caps_unref(resCaps);
        GstCaps *fpsCaps = gst_caps_new_simple("video/x-raw",
                    "framerate", GST_TYPE_FRACTION, im->qFps, 1, nullptr);
        if (im->rateFilter) g_object_set(im->rateFilter, "caps", fpsCaps, nullptr);
        gst_caps_unref(fpsCaps);
        if (im->vp8enc)
            g_object_set(im->vp8enc, "target-bitrate", im->qBitrateKbps * 1000, nullptr);
    }

    // IMPORTANT: QVideoFrame::map() is a per-instance side effect, so the frame
    // must be moved into the holder BEFORE mapping. Only the holder's copy is
    // ever mapped; unmapping happens in freeFrameHolder when GStreamer's buffer
    // is done with it (via destroy-notify), never on a local temporary.
    auto *hold = new FrameHolder{std::move(data->frame)}; // C++ move: no CPU copy
    if (!hold->frame.map(QVideoFrame::ReadOnly)) {
        delete hold;
        return G_SOURCE_REMOVE;
    }
    QVideoFrame &frame = hold->frame;

    const int w = frame.width();
    const int h = frame.height();
    const QVideoFrameFormat::PixelFormat pf = frame.surfaceFormat().pixelFormat();
    GstVideoFormat gstFmt = gstFormatForQtPixelFormat(pf);

    if (gstFmt != GST_VIDEO_FORMAT_UNKNOWN && frame.planeCount() == 1) {
        // Zero-copy: wrap the plane bytes directly. The FrameHolder keeps the
        // mapped page alive until GStreamer is done with the buffer.
        const gsize sz = frame.mappedBytes(0);
        GstBuffer *buf = gst_buffer_new_wrapped_full(GST_MEMORY_FLAG_READONLY,
                                          (gpointer)frame.bits(0), sz, 0, sz,
                                          hold, freeFrameHolder);
        // Update appsrc caps in-place (format/width/height/fps) when they change
        GstCaps *need = gst_caps_new_simple("video/x-raw",
                    "format", G_TYPE_STRING, gst_video_format_to_string(gstFmt),
                    "width", G_TYPE_INT, w,
                    "height", G_TYPE_INT, h,
                    "framerate", GST_TYPE_FRACTION, im->qFps, 1, nullptr);
        GstCaps *cur = nullptr;
        g_object_get(im->appsrc, "caps", &cur, nullptr);
        if (!cur || !gst_caps_is_equal(cur, need))
            gst_app_src_set_caps(GST_APP_SRC(im->appsrc), need);
        if (cur) gst_caps_unref(cur);
        gst_caps_unref(need);

        gst_app_src_push_buffer(GST_APP_SRC(im->appsrc), buf);
        return G_SOURCE_REMOVE;
    }

    // -- Fallback: convert through QImage once (on this worker thread, not UI) --
    QImage img = frame.toImage();
    freeFrameHolder(hold); // release mapping; we have our own copy now
    if (img.isNull()) return G_SOURCE_REMOVE;
    if (img.format() != QImage::Format_RGB888)
        img = img.convertToFormat(QImage::Format_RGB888);

    GstCaps *need = gst_caps_new_simple("video/x-raw",
                    "format", G_TYPE_STRING, "RGB",
                    "width", G_TYPE_INT, img.width(),
                    "height", G_TYPE_INT, img.height(),
                    "framerate", GST_TYPE_FRACTION, im->qFps, 1, nullptr);
    GstCaps *cur = nullptr;
    g_object_get(im->appsrc, "caps", &cur, nullptr);
    if (!cur || !gst_caps_is_equal(cur, need))
        gst_app_src_set_caps(GST_APP_SRC(im->appsrc), need);
    if (cur) gst_caps_unref(cur);
    gst_caps_unref(need);

    const gsize size = static_cast<gsize>(img.bytesPerLine()) * img.height();
    GstBuffer *buf2 = gst_buffer_new_allocate(nullptr, size, nullptr);
    GstMapInfo info;
    gst_buffer_map(buf2, &info, GST_MAP_WRITE);
    std::memcpy(info.data, img.constBits(), size);
    gst_buffer_unmap(buf2, &info);

    gst_app_src_push_buffer(GST_APP_SRC(im->appsrc), buf2);
    return G_SOURCE_REMOVE;
}

// Deliver the latest pending camera frame (mailbox) — one worker invocation
// per burst, drops stale frames automatically.
gboolean workerDeliverPending(gpointer userData)
{
    auto *im = static_cast<GstRtcPeerImpl *>(userData);
    QVideoFrame frame;
    {
        QMutexLocker l(&im->frameMutex);
        if (im->hasPendingFrame) {
            frame = std::move(im->pendingFrame);
            im->pendingFrame = QVideoFrame();
            im->hasPendingFrame = false;
        }
    }
    if (frame.isValid()) {
        auto *data = new PendingFrame{im, frame};
        workerPushFrame(data); // process inline on the worker thread
    }
    return G_SOURCE_REMOVE;
}

} // namespace

// ---------------------------------------------------------------------------
// GstRtcPeer public implementation.
// ---------------------------------------------------------------------------

static gpointer workerMain(gpointer userData)
{
    auto *im = static_cast<GstRtcPeerImpl *>(userData);
    im->loop = g_main_loop_new(im->ctx, FALSE);
    g_main_loop_run(im->loop);
    g_main_loop_unref(im->loop);
    im->loop = nullptr;
    return nullptr;
}

GstRtcPeer::GstRtcPeer(QObject *parent)
    : QObject(parent)
    , m_impl(std::make_unique<GstRtcPeerImpl>())
{
    ensureGstInit();

    m_impl->q = this;
    m_impl->ctx = g_main_context_new();

    m_sink = new QVideoSink(this);

    // Wire signal emitters (lambdas may `emit` because they are member scope).
    m_impl->emitOfferSdp = [this](const QString &s) { emit offerReady(s); };
    m_impl->emitLocalIce = [this](int m, const QString &c) { emit localIceCandidate(m, c); };
    m_impl->emitConnChanged = [this]() { emit connectionStateChanged(); };
    m_impl->emitIceChanged = [this]() { emit iceStateChanged(); };
    m_impl->emitRunningChanged = [this]() { emit runningChanged(); };
    m_impl->emitError = [this](const QString &msg) { emit errorOccurred(msg); };
    m_impl->emitStats = [this](const QVariantMap &m) { emit statsUpdated(m); };
    m_impl->emitStall = [this]() { emit stallDetected(); };

    m_thread = std::thread(workerMain, m_impl.get());
}

GstRtcPeer::~GstRtcPeer()
{
    m_stopping.store(true);
    if (m_impl->ctx) {
        g_main_context_invoke(m_impl->ctx, workerShutdown, m_impl.get());
        g_main_context_wakeup(m_impl->ctx);
    }
    if (m_thread.joinable())
        m_thread.join();
    if (m_impl->ctx) {
        g_main_context_unref(m_impl->ctx);
        m_impl->ctx = nullptr;
    }
}

GstRtcPeer::QualityPreset GstRtcPeer::presetFor(const QString &name)
{
    const QString n = name.trimmed().toLower();
    if (n == QLatin1String("high") || n == QLatin1String("hd"))
        return {1280, 720, 30, 2500};
    if (n == QLatin1String("balanced"))
        return {960, 540, 30, 1500};
    if (n == QLatin1String("performance"))
        return {960, 540, 24, 800};
    if (n == QLatin1String("standard"))
        return {960, 540, 24, 1200};
    if (n == QLatin1String("smooth"))
        return {1280, 720, 30, 2000};
    // Unknown names: safe 720p30 mid-range
    return {1280, 720, 30, 2000};
}

QVideoSink *GstRtcPeer::videoSink() const { return m_sink; }

QString GstRtcPeer::connectionState() const
{
    // Read the worker-cached atomic — never g_object_get on the worker-owned
    // element from the GUI thread (race with workerStop teardown).
    if (!m_impl->running.load())
        return QStringLiteral("new");
    switch (static_cast<GstWebRTCPeerConnectionState>(
                m_impl->connStateCache.load(std::memory_order_relaxed))) {
    case GST_WEBRTC_PEER_CONNECTION_STATE_CONNECTING: return QStringLiteral("connecting");
    case GST_WEBRTC_PEER_CONNECTION_STATE_CONNECTED: return QStringLiteral("connected");
    case GST_WEBRTC_PEER_CONNECTION_STATE_DISCONNECTED: return QStringLiteral("disconnected");
    case GST_WEBRTC_PEER_CONNECTION_STATE_FAILED: return QStringLiteral("failed");
    case GST_WEBRTC_PEER_CONNECTION_STATE_CLOSED: return QStringLiteral("closed");
    case GST_WEBRTC_PEER_CONNECTION_STATE_NEW: return QStringLiteral("new");
    }
    return QStringLiteral("new");
}

QString GstRtcPeer::iceState() const
{
    if (!m_impl->running.load())
        return QStringLiteral("new");
    switch (static_cast<GstWebRTCICEConnectionState>(
                m_impl->iceStateCache.load(std::memory_order_relaxed))) {
    case GST_WEBRTC_ICE_CONNECTION_STATE_CHECKING: return QStringLiteral("checking");
    case GST_WEBRTC_ICE_CONNECTION_STATE_CONNECTED: return QStringLiteral("connected");
    case GST_WEBRTC_ICE_CONNECTION_STATE_COMPLETED: return QStringLiteral("completed");
    case GST_WEBRTC_ICE_CONNECTION_STATE_FAILED: return QStringLiteral("failed");
    case GST_WEBRTC_ICE_CONNECTION_STATE_DISCONNECTED: return QStringLiteral("disconnected");
    case GST_WEBRTC_ICE_CONNECTION_STATE_CLOSED: return QStringLiteral("closed");
    case GST_WEBRTC_ICE_CONNECTION_STATE_NEW: return QStringLiteral("new");
    }
    return QStringLiteral("new");
}

bool GstRtcPeer::isRunning() const { return m_impl->running.load(); }
GstRtcPeer::Direction GstRtcPeer::direction() const { return m_direction; }

void GstRtcPeer::setStunServer(const QString &url)
{
    m_stun = url;
    m_impl->stun = url;
}

void GstRtcPeer::setTurnServer(const QString &url)
{
    m_turn = url;
    m_impl->turn = url;
}

void GstRtcPeer::setDirection(Direction direction)
{
    m_direction = direction;
    m_impl->sendVideo = (direction == Direction::SendRecv || direction == Direction::SendOnly);
    m_impl->recvVideo = (direction == Direction::SendRecv || direction == Direction::RecvOnly);
}

void GstRtcPeer::setQuality(int width, int height, int fps, int bitrateKbps)
{
    m_impl->qWidth = qMax(16, width);
    m_impl->qHeight = qMax(16, height);
    m_impl->qFps = qBound(1, fps, 120);
    m_impl->qBitrateKbps = qBound(50, bitrateKbps, 20000);
    m_impl->qualityDirty = true; // applied on the worker on next push
}

void GstRtcPeer::setQualityPreset(const QString &name)
{
    const QualityPreset p = presetFor(name);
    setQuality(p.width, p.height, p.fps, p.bitrateKbps);
}

void GstRtcPeer::runOnWorker(GSourceFunc fn, gpointer data, GDestroyNotify notify)
{
    g_main_context_invoke_full(m_impl->ctx, G_PRIORITY_DEFAULT, fn, data, notify);
}

void GstRtcPeer::start()
{
    if (isRunning())
        return;
    runOnWorker(workerStart, m_impl.get());
}

void GstRtcPeer::stop()
{
    m_stopping.store(true);
    runOnWorker(workerStop, m_impl.get());
}

void GstRtcPeer::setRemoteAnswer(const QString &sdp)
{
    if (sdp.trimmed().isEmpty())
        return;
    auto *data = new QPair<GstRtcPeerImpl *, QString>(m_impl.get(), sdp);
    runOnWorker(workerSetAnswer, data,
                [](gpointer p) { delete static_cast<QPair<GstRtcPeerImpl *, QString> *>(p); });
}

void GstRtcPeer::addRemoteIce(int sdpMLineIndex, const QString &candidate)
{
    if (candidate.isEmpty())
        return;
    QJsonObject o;
    o.insert(QStringLiteral("sdpMLineIndex"), sdpMLineIndex);
    o.insert(QStringLiteral("candidate"), candidate);
    auto *data = new QPair<GstRtcPeerImpl *, QJsonObject>(m_impl.get(), o);
    runOnWorker(workerAddIce, data,
                [](gpointer p) { delete static_cast<QPair<GstRtcPeerImpl *, QJsonObject> *>(p); });
}

void GstRtcPeer::pushFrame(const QVideoFrame &frame)
{
    // Latest-wins mailbox: overwrite whatever frame is still waiting — under
    // load the newest frame is always the one that gets encoded, latency is
    // bounded by exactly one frame period and the GLib queue never grows.
    QMutexLocker l(&m_impl->frameMutex);
    m_impl->pendingFrame = frame;
    m_impl->hasPendingFrame = true;
    runOnWorker(workerDeliverPending, m_impl.get());
}
