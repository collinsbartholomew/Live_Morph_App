#include "MorphRecorder.h"
#include <QDebug>
#include <QFile>
#include <gst/gst.h>
#include <gst/app/gstappsrc.h>

// Records morph output to MP4 (x264 + mp4mux) when the -ugly/-libav plugins
// are present, otherwise falls back to WebM (vp8 + webmmux) which ship with
// the -good set that GstRtcPeer already requires. Caps are set lazily from the
// first appended frame, so any output resolution records correctly.
struct MorphRecorder::Impl
{
    GstElement *pipeline = nullptr;
    GstElement *appsrc = nullptr;
    bool running = false;
    bool capsSet = false;
    gint64 frameIndex = 0;
    int fps = 30;
    QString path;
    QString partPath;
};

MorphRecorder::~MorphRecorder()
{
    if (m_open)
        close();
}

static bool hasElement(const char *name)
{
    GstElementFactory *f = gst_element_factory_find(name);
    if (f) {
        gst_object_unref(f);
        return true;
    }
    return false;
}

bool MorphRecorder::open(const QString &path, int fps, QString *err)
{
    if (m_open) {
        if (err) *err = QStringLiteral("recorder already active");
        return false;
    }

    if (!m_impl)
        m_impl = new Impl();

    // fps comes from the session tier (standard=24, hd=30) so recordings play
    // back at real speed; clamped defensively.
    m_impl->fps = qBound(1, fps, 120);

    // Encoder/muxer selection at runtime (x264enc lives in gst-plugins-ugly —
    // NOT guaranteed present; vp8enc + webmmux ship in -good, always available
    // when GstRtcPeer works). mp4mux streamable=true produces fragmented MP4:
    // each fragment carries its own index, so a crash mid-record still leaves
    // a playable (truncated) file instead of a headerless husk.
    const bool h264 = hasElement("x264enc") && hasElement("mp4mux");
    QString pipe;
    if (h264) {
        pipe = QStringLiteral(
            "appsrc name=src is-live=true format=time "
            "! queue max-size-buffers=4 leaky=downstream "
            "! videoconvert ! x264enc tune=zerolatency speed-preset=veryfast "
            "bitrate=4000 key-int-max=60 "
            "! h264parse ! mp4mux streamable=true ! filesink name=sink");
    } else {
        pipe = QStringLiteral(
            "appsrc name=src is-live=true format=time "
            "! queue max-size-buffers=4 leaky=downstream "
            "! videoconvert ! vp8enc deadline=1 target-bitrate=4000000 keyframe-max-dist=60 "
            "! webmmux ! filesink name=sink");
    }

    GError *gerr = nullptr;
    m_impl->pipeline = gst_parse_launch(pipe.toUtf8().constData(), &gerr);
    if (!m_impl->pipeline) {
        if (err) *err = gerr ? QString::fromUtf8(gerr->message)
                             : QStringLiteral("pipeline parse failed");
        if (gerr) g_clear_error(&gerr);
        delete m_impl;
        m_impl = nullptr;
        return false;
    }

    m_impl->appsrc = gst_bin_get_by_name(GST_BIN(m_impl->pipeline), "src");

    // Bind the output file BEFORE going to PLAYING. We write to a ".part"
    // sibling and rename to the final name only after a clean EOS drain, so
    // RecordingManager::scanOrphans() can tell crashed recordings from
    // finished ones (the previous code never set a location at all — the
    // filesink errored out and no bytes ever hit disk).
    m_impl->path = path;
    m_impl->partPath = path + QStringLiteral(".part");
    QFile::remove(m_impl->partPath);
    GstElement *sink = gst_bin_get_by_name(GST_BIN(m_impl->pipeline), "sink");
    if (!sink) {
        if (err) *err = QStringLiteral("filesink not found in pipeline");
        if (m_impl->appsrc) gst_object_unref(m_impl->appsrc);
        gst_object_unref(m_impl->pipeline);
        delete m_impl;
        m_impl = nullptr;
        return false;
    }
    g_object_set(sink, "location", m_impl->partPath.toUtf8().constData(), nullptr);
    gst_object_unref(sink);

    if (gst_element_set_state(m_impl->pipeline, GST_STATE_PLAYING) == GST_STATE_CHANGE_FAILURE) {
        if (err) *err = QStringLiteral("pipeline failed to reach PLAYING");
        if (m_impl->appsrc) gst_object_unref(m_impl->appsrc);
        gst_object_unref(m_impl->pipeline);
        delete m_impl;
        m_impl = nullptr;
        return false;
    }

    m_impl->frameIndex = 0;
    m_impl->capsSet = false;
    m_impl->running = true;
    m_open = true;
    return true;
}

void MorphRecorder::appendFrame(const QImage &img)
{
    if (!m_open || !m_impl || !m_impl->appsrc)
        return;
    QImage rgb = img.convertToFormat(QImage::Format_RGB888);
    if (rgb.isNull())
        return;

    // Lazy caps: size the recorder from the FIRST frame actually delivered
    // (standard tier decodes 960x540; HD 1280x720 — never assume). Fps came
    // from open() (session tier).
    if (!m_impl->capsSet) {
        GstCaps *caps = gst_caps_new_simple("video/x-raw",
                                            "format", G_TYPE_STRING, "RGB",
                                            "width", G_TYPE_INT, rgb.width(),
                                            "height", G_TYPE_INT, rgb.height(),
                                            "framerate", GST_TYPE_FRACTION,
                                            m_impl->fps, 1, nullptr);
        gst_app_src_set_caps(GST_APP_SRC(m_impl->appsrc), caps);
        gst_caps_unref(caps);
        m_impl->capsSet = true;
    }

    // Zero-copy wrap: the buffer references the QImage's bits (implicitly
    // shared with the frame) and unmaps on destroy. The previous
    // allocate+memcpy burned ~1.5MB/frame on the GUI thread at 24-30fps.
    const uchar *bits = rgb.constBits();
    const gsize size = static_cast<gsize>(rgb.sizeInBytes());
    GstBuffer *buf = gst_buffer_new_wrapped_full(GST_MEMORY_FLAG_READONLY,
                                                 const_cast<guchar *>(bits), size,
                                                 0, size, new QImage(rgb),
                                                 [](gpointer data) {
                                                     delete static_cast<QImage *>(data);
                                                     return;
                                                 });
    if (!buf)
        return;

    // Deterministic timestamps at the recorder's own fps — do-timestamp was
    // removed from the pipeline so these PTS actually survive (GStreamer
    // was overwriting them with wall-clock stamps).
    const GstClockTime duration = gst_util_uint64_scale(1, GST_SECOND,
                                                         m_impl->fps);
    GST_BUFFER_DURATION(buf) = duration;
    GST_BUFFER_PTS(buf) = gst_util_uint64_scale(m_impl->frameIndex, duration, 1);
    m_impl->frameIndex++;

    // Check the push result — a flushing/stalled pipeline must not tick a
    // phantom "recording" silently.
    const GstFlowReturn ret = gst_app_src_push_buffer(GST_APP_SRC(m_impl->appsrc), buf);
    if (ret != GST_FLOW_OK) {
        m_impl->frameIndex--; // don't advance time for a dropped frame
    }
}

bool MorphRecorder::close(QString *err)
{
    if (!m_impl) {
        if (err) *err = QStringLiteral("recorder not open");
        return false;
    }
    if (!m_impl->running) {
        if (err) *err = QStringLiteral("recorder already closed");
        return true;
    }

    // EOS drain: let the muxer flush index/table to disk. Capped at 1s —
    // normal drains finish in <100ms; a stalled encoder must not freeze the
    // GUI thread indefinitely.
    gst_app_src_end_of_stream(GST_APP_SRC(m_impl->appsrc));
    GstBus *bus = gst_element_get_bus(m_impl->pipeline);
    GstMessage *msg = gst_bus_timed_pop_filtered(bus, 1 * GST_SECOND,
                                                 GST_MESSAGE_EOS);
    const bool drained = (msg != nullptr);
    if (msg) gst_message_unref(msg);
    gst_object_unref(bus);

    gst_element_set_state(m_impl->pipeline, GST_STATE_NULL);
    if (m_impl->appsrc) gst_object_unref(m_impl->appsrc);
    gst_object_unref(m_impl->pipeline);
    m_impl->running = false;

    // Clean drain → promote the ".part" file to its final name. A crashed or
    // un-drained recording keeps the ".part" suffix so scanOrphans() finds
    // it; streamable fMP4 means such files are still playable once renamed.
    if (drained) {
        QFile::remove(m_impl->path);
        if (!QFile::rename(m_impl->partPath, m_impl->path) && err)
            *err = QStringLiteral("could not finalize recording file");
    } else if (err) {
        *err = QStringLiteral("muxer did not flush within 1s — kept as .part for recovery");
    }

    delete m_impl;
    m_impl = nullptr;
    m_open = false;
    return drained;
}
