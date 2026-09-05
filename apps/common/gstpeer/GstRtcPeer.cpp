#include "GstRtcPeer.h"

#include <QImage>
#include <QDebug>
#include <QPair>

#include <gst/gst.h>
#include <gst/sdp/sdp.h>
#include <gst/webrtc/webrtc.h>
#include <gst/video/video-info.h>
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
    GstElement *appsrc = nullptr;   // send branch
    GstElement *appsink = nullptr;  // receive branch

    bool sendVideo = true;
    bool recvVideo = true;
    bool offerCreated = false;
    bool remoteDescriptionSet = false;

    QString stun;
    QString turn;

    std::atomic<bool> running{false};

    // Signal emitters (set from constructor so they may `emit`).
    std::function<void(const QString &)> emitOfferSdp;
    std::function<void(int, const QString &)> emitLocalIce;
    std::function<void()> emitConnChanged;
    std::function<void()> emitIceChanged;
    std::function<void()> emitRunningChanged;
    std::function<void(const QString &)> emitError;
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
    static_cast<GstRtcPeerImpl *>(userData)->emitConnChanged();
}

void onIceStateNotify(GObject *, GParamSpec *, gpointer userData)
{
    static_cast<GstRtcPeerImpl *>(userData)->emitIceChanged();
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
            QImage img(static_cast<const uchar *>(info.data), vinfo.width, vinfo.height,
                       vinfo.stride[0], QImage::Format_RGB888);
            QVideoFrame frame(img.copy());
            if (im->q->videoSink())
                im->q->videoSink()->setVideoFrame(frame);
            // Tee the decoded morph frame to OBS (MJPEG), vcam and recording.
            emit im->q->frameReady(img.copy());
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
    if (!caps) {
        gst_object_unref(pad);
        return;
    }
    const char *name = gst_structure_get_name(gst_caps_get_structure(caps, 0));
    if (!name || !g_str_has_prefix(name, "video/x-raw")) {
        gst_caps_unref(caps);
        gst_object_unref(pad);
        return;
    }
    gst_caps_unref(caps);

    if (im->appsink) {
        // only one receive stream supported
        gst_object_unref(pad);
        return;
    }

    GstElement *conv = gst_element_factory_make("videoconvert", nullptr);
    GstElement *filt = gst_element_factory_make("capsfilter", nullptr);
    GstElement *sink = gst_element_factory_make("appsink", nullptr);

    GstCaps *fcaps = gst_caps_from_string("video/x-raw,format=RGB");
    g_object_set(filt, "caps", fcaps, nullptr);
    gst_caps_unref(fcaps);
    g_object_set(sink, "emit-signals", TRUE, "sync", FALSE, nullptr);

    gst_bin_add_many(GST_BIN(im->pipeline), conv, filt, sink, nullptr);
    if (!gst_element_link_many(conv, filt, sink, nullptr)) {
        qWarning() << "GstRtcPeer: failed to link receive chain";
        gst_object_unref(pad);
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
    gst_object_unref(pad);
}

void onPadAdded(GstElement *, GstPad *pad, gpointer userData)
{
    auto *im = static_cast<GstRtcPeerImpl *>(userData);
    GstCaps *caps = gst_pad_get_current_caps(pad);
    if (!caps)
        caps = gst_pad_query_caps(pad, nullptr);
    if (!caps) {
        gst_object_unref(pad);
        return;
    }
    const char *name = gst_structure_get_name(gst_caps_get_structure(caps, 0));
    if (!name || !g_str_has_prefix(name, "video/")) {
        gst_caps_unref(caps);
        gst_object_unref(pad);
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
    gst_object_unref(pad);
}

} // namespace

// ---------------------------------------------------------------------------
// Worker operations.
// ---------------------------------------------------------------------------
namespace {

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
        desc = QStringLiteral("webrtcbin name=webrtc") + stunPart + turnPart
            + QStringLiteral(
            " appsrc name=appsrc is-live=true format=time do-timestamp=true "
            "! queue max-size-buffers=2 leaky=downstream "
            "! videoconvert ! videoscale ! videorate "
            "! video/x-raw,framerate=24/1 "
            "! vp8enc name=vp8enc deadline=1 target-bitrate=2500000 keyframe-max-dist=60 "
            "! rtpvp8pay name=pay0 pt=96 "
            "! application/x-rtp,media=video,encoding-name=VP8,payload=96 "
            "! webrtc. ");
    } else {
        desc = QStringLiteral("webrtcbin name=webrtc") + stunPart + turnPart;
    }

    im->pipeline = gst_parse_launch(desc.toUtf8().constData(), nullptr);
    if (!im->pipeline) {
        im->emitError(QStringLiteral("Failed to build GStreamer pipeline"));
        return G_SOURCE_REMOVE;
    }

    im->webrtc = gst_bin_get_by_name(GST_BIN(im->pipeline), "webrtc");
    im->appsrc = gst_bin_get_by_name(GST_BIN(im->pipeline), "appsrc");

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
    gst_bus_add_watch(bus, onBusMessage, im);
    gst_object_unref(bus);

    if (gst_element_set_state(im->pipeline, GST_STATE_PLAYING) == GST_STATE_CHANGE_FAILURE) {
        im->emitError(QStringLiteral("Pipeline failed to reach PLAYING"));
        return G_SOURCE_REMOVE;
    }

    im->running.store(true);
    im->emitRunningChanged();
    return G_SOURCE_REMOVE;
}

gboolean workerStop(gpointer userData)
{
    auto *im = static_cast<GstRtcPeerImpl *>(userData);
    if (im->pipeline) {
        gst_element_set_state(im->pipeline, GST_STATE_NULL);
        gst_object_unref(im->pipeline);
        im->pipeline = nullptr;
        im->webrtc = nullptr;
        im->appsrc = nullptr;
        im->appsink = nullptr;
        im->offerCreated = false;
        im->remoteDescriptionSet = false;
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

struct PushFrameData
{
    GstRtcPeerImpl *im;
    QImage image;
};

gboolean workerPushFrame(gpointer userData)
{
    std::unique_ptr<PushFrameData> data(static_cast<PushFrameData *>(userData));
    GstRtcPeerImpl *im = data->im;
    if (!im->appsrc)
        return G_SOURCE_REMOVE;

    const QImage &img = data->image;

    bool needSetCaps = true;
    GstCaps *cur = nullptr;
    g_object_get(im->appsrc, "caps", &cur, nullptr);
    if (cur) {
        GstStructure *s = gst_caps_get_structure(cur, 0);
        gint w = 0, h = 0;
        if (s && gst_structure_get_int(s, "width", &w) && gst_structure_get_int(s, "height", &h))
            needSetCaps = (w != img.width() || h != img.height());
        gst_caps_unref(cur);
    }
    if (needSetCaps) {
        GstCaps *nc = gst_caps_new_simple("video/x-raw",
                                          "format", G_TYPE_STRING, "RGB",
                                          "width", G_TYPE_INT, img.width(),
                                          "height", G_TYPE_INT, img.height(),
                                          "framerate", GST_TYPE_FRACTION, 24, 1,
                                          nullptr);
        gst_app_src_set_caps(GST_APP_SRC(im->appsrc), nc);
        gst_caps_unref(nc);
    }

    const gsize size = static_cast<gsize>(img.bytesPerLine()) * img.height();
    GstBuffer *buf = gst_buffer_new_allocate(nullptr, size, nullptr);
    GstMapInfo info;
    gst_buffer_map(buf, &info, GST_MAP_WRITE);
    std::memcpy(info.data, img.constBits(), size);
    gst_buffer_unmap(buf, &info);

    gst_app_src_push_buffer(GST_APP_SRC(im->appsrc), buf);
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
    g_main_context_ref(m_impl->ctx);

    m_sink = new QVideoSink(this);

    // Wire signal emitters (lambdas may `emit` because they are member scope).
    m_impl->emitOfferSdp = [this](const QString &s) { emit offerReady(s); };
    m_impl->emitLocalIce = [this](int m, const QString &c) { emit localIceCandidate(m, c); };
    m_impl->emitConnChanged = [this]() { emit connectionStateChanged(); };
    m_impl->emitIceChanged = [this]() { emit iceStateChanged(); };
    m_impl->emitRunningChanged = [this]() { emit runningChanged(); };
    m_impl->emitError = [this](const QString &msg) { emit errorOccurred(msg); };

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

QVideoSink *GstRtcPeer::videoSink() const { return m_sink; }

QString GstRtcPeer::connectionState() const
{
    if (!m_impl->webrtc)
        return QStringLiteral("new");
    GstWebRTCPeerConnectionState s = GST_WEBRTC_PEER_CONNECTION_STATE_NEW;
    g_object_get(m_impl->webrtc, "connection-state", &s, nullptr);
    switch (s) {
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
    if (!m_impl->webrtc)
        return QStringLiteral("new");
    GstWebRTCICEConnectionState s = GST_WEBRTC_ICE_CONNECTION_STATE_NEW;
    g_object_get(m_impl->webrtc, "ice-connection-state", &s, nullptr);
    switch (s) {
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
    QVideoFrame f = frame;
    if (!f.map(QVideoFrame::ReadOnly))
        return;
    QImage img = f.toImage();
    f.unmap();
    if (img.isNull())
        return;
    if (img.format() != QImage::Format_RGB888)
        img = img.convertToFormat(QImage::Format_RGB888);

    auto *data = new PushFrameData{m_impl.get(), img};
    runOnWorker(workerPushFrame, data,
                [](gpointer p) { delete static_cast<PushFrameData *>(p); });
}