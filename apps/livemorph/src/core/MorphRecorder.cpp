#include "MorphRecorder.h"
#include <QDebug>
#include <QFile>
#include <QThread>
#include <atomic>
#include <mutex>
#include <gst/gst.h>
#include <gst/app/gstappsrc.h>

// Records morph output to MP4 (x264 + mp4mux) when the -ugly/-libav plugins
// are present, otherwise falls back to WebM (vp8 + webmmux) which ship with
// the -good set that GstRtcPeer already requires. Caps are set lazily from the
// first appended frame, so any output resolution records correctly.
struct MorphRecorderImpl
{
    GstElement *pipeline = nullptr;
    GstElement *appsrc = nullptr;
    // Read by the worker thread (append) and written by the GUI thread
    // (close) — must be atomic to avoid a data race.
    std::atomic<bool> running{false};
    std::atomic<bool> closing{false}; // set by close() — worker appends become no-ops
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
    // gst_init is idempotent; MorphRecorder must not rely on a GstRtcPeer
    // having been constructed first.
    static std::once_flag gstOnce;
    std::call_once(gstOnce, []() { gst_init(nullptr, nullptr); });
    GstElementFactory *f = gst_element_factory_find(name);
    if (f) {
        gst_object_unref(f);
        return true;
    }
    return false;
}

QString MorphRecorder::containerExtension()
{
    return (hasElement("x264enc") && hasElement("mp4mux")) ? QStringLiteral("mp4")
                                                           : QStringLiteral("webm");
}

bool MorphRecorder::open(const QString &path, int fps, int bitrateKbps, QString *err)
{
    if (m_open) {
        if (err) *err = QStringLiteral("recorder already active");
        return false;
    }

    if (!m_impl)
        m_impl = new MorphRecorderImpl();

    // fps comes from the session tier (standard=24, hd=30) so recordings play
    // back at real speed; clamped defensively.
    m_impl->fps = qBound(1, fps, 120);

    // Bitrate from the user's Quality setting (Electron: Standard ~20 MB/min,
    // High ~30 MB/min) — clamped defensively.
    const int kbps = qBound(500, bitrateKbps, 20000);

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
            "bitrate=%1 key-int-max=60 "
            "! h264parse ! mp4mux streamable=true ! filesink name=sink")
            .arg(kbps);
    } else {
        pipe = QStringLiteral(
            "appsrc name=src is-live=true format=time "
            "! queue max-size-buffers=4 leaky=downstream "
            "! videoconvert ! vp8enc deadline=1 target-bitrate=%1 keyframe-max-dist=60 "
            "! webmmux ! filesink name=sink")
            .arg(kbps * 1000);
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

    // Per-frame work (convert + appsrc push) runs on a dedicated worker
    // thread — the GUI thread only stashes frames in a latest-wins mailbox.
    m_worker = new MorphRecorderWorker(m_impl);
    m_worker->moveToThread(&m_thread);
    connect(m_worker, &MorphRecorderWorker::appended, this, &MorphRecorder::onAppended);
    m_thread.start();
    return true;
}

void MorphRecorder::appendFrame(const QImage &img)
{
    if (!m_open || !m_impl || img.isNull())
        return;
    // Latest-wins mailbox: if an append is in flight, just replace the queued
    // frame — the worker picks up the newest when it finishes.
    {
        QMutexLocker l(&m_pendingMutex);
        m_pending = img;
        m_pendingSet = true;
    }
    if (!m_busy.exchange(true))
        dispatchPending();
}

void MorphRecorder::dispatchPending()
{
    QImage img;
    {
        QMutexLocker l(&m_pendingMutex);
        if (!m_pendingSet)
            return;
        img = m_pending;
        m_pendingSet = false;
    }
    if (m_worker)
        QMetaObject::invokeMethod(m_worker, "append", Qt::QueuedConnection, Q_ARG(QImage, img));
}

void MorphRecorder::onAppended()
{
    // Worker finished one append — chain the next pending frame, if any.
    QMutexLocker l(&m_pendingMutex);
    if (m_pendingSet) {
        l.unlock();
        dispatchPending();
    } else {
        m_busy.store(false);
    }
}

void MorphRecorderWorker::append(const QImage &img)
{
    if (!m_impl || !m_impl->appsrc || !m_impl->running || m_impl->closing) {
        emit appended();
        return;
    }
    QImage rgb = img.convertToFormat(QImage::Format_RGB888);
    if (rgb.isNull()) {
        emit appended();
        return;
    }

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
    // shared with the frame) and unmaps on destroy.
    const uchar *bits = rgb.constBits();
    const gsize size = static_cast<gsize>(rgb.sizeInBytes());
    GstBuffer *buf = gst_buffer_new_wrapped_full(GST_MEMORY_FLAG_READONLY,
                                                 const_cast<guchar *>(bits), size,
                                                 0, size, new QImage(rgb),
                                                 [](gpointer data) {
                                                     delete static_cast<QImage *>(data);
                                                     return;
                                                 });
    if (!buf) {
        emit appended();
        return;
    }

    // Deterministic timestamps at the recorder's own fps.
    const GstClockTime duration = gst_util_uint64_scale(1, GST_SECOND, m_impl->fps);
    GST_BUFFER_DURATION(buf) = duration;
    GST_BUFFER_PTS(buf) = gst_util_uint64_scale(m_impl->frameIndex, duration, 1);
    m_impl->frameIndex++;

    // Check the push result — a flushing/stalled pipeline must not tick a
    // phantom "recording" silently.
    const GstFlowReturn ret = gst_app_src_push_buffer(GST_APP_SRC(m_impl->appsrc), buf);
    if (ret != GST_FLOW_OK) {
        m_impl->frameIndex--; // don't advance time for a dropped frame
    }
    emit appended();
}

bool MorphRecorderWorker::closeImpl(QString *err)
{
    if (!m_impl)
        return false;
    // EOS drain: let the muxer flush index/table to disk. Capped at 1s —
    // normal drains finish in <100ms; a stalled encoder must not freeze the
    // worker (and the GUI thread waits on this via BlockingQueuedConnection).
    gst_app_src_end_of_stream(GST_APP_SRC(m_impl->appsrc));
    GstBus *bus = gst_element_get_bus(m_impl->pipeline);
    // Watch for EOS *or* ERROR — an erroring muxer never sends EOS, and the
    // old EOS-only wait always burned the full 1s timeout on pipeline errors.
    GstMessage *msg = gst_bus_timed_pop_filtered(bus, 1 * GST_SECOND,
                                                 (GstMessageType)(GST_MESSAGE_EOS | GST_MESSAGE_ERROR));
    bool drained = false;
    if (msg) {
        if (GST_MESSAGE_TYPE(msg) == GST_MESSAGE_ERROR) {
            GError *gerr = nullptr;
            gst_message_parse_error(msg, &gerr, nullptr);
            if (err)
                *err = gerr ? QString::fromUtf8(gerr->message)
                            : QStringLiteral("recorder pipeline error");
            if (gerr) g_clear_error(&gerr);
        } else {
            drained = true;
        }
        gst_message_unref(msg);
    }
    gst_object_unref(bus);

    gst_element_set_state(m_impl->pipeline, GST_STATE_NULL);
    if (m_impl->appsrc) gst_object_unref(m_impl->appsrc);
    gst_object_unref(m_impl->pipeline);
    m_impl->running = false;
    if (!drained && err)
        *err = QStringLiteral("muxer did not flush within 1s — kept as .part for recovery");
    return drained;
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

    // Stop accepting new frames before the drain so a queued append can never
    // touch the pipeline mid-teardown.
    m_impl->closing = true;

    // Drain + teardown on the worker thread (blocking invoke — the EOS wait
    // must not run on the GUI thread). If the thread is not spinning an event
    // loop, a blocking invoke would deadlock — call the impl directly instead
    // (no worker activity to race with in that state). Same guard when close()
    // is somehow re-entered FROM the worker thread itself.
    bool drained = false;
    QString workerErr;
    if (m_worker) {
        if (m_thread.isRunning() && QThread::currentThread() != m_worker->thread()) {
            QMetaObject::invokeMethod(m_worker, [&]() {
                drained = m_worker->closeImpl(&workerErr);
            }, Qt::BlockingQueuedConnection);
        } else {
            drained = m_worker->closeImpl(&workerErr);
        }
    }
    bool threadStopped = true;
    if (m_thread.isRunning()) {
        m_thread.quit();
        if (!m_thread.wait(3000)) {
            // Timed out: the worker may still hold m_impl — leak it rather than
            // free it under a live thread (use-after-free).
            threadStopped = false;
            qWarning() << "MorphRecorder: worker thread did not stop in time — leaking impl to avoid UAF";
            if (m_worker)
                m_worker->deleteLater();
            m_worker = nullptr;
        } else {
            delete m_worker;
            m_worker = nullptr;
        }
    } else {
        delete m_worker;
        m_worker = nullptr;
    }

    const QString path = m_impl->path;
    const QString partPath = m_impl->partPath;
    if (threadStopped)
        delete m_impl;
    m_impl = nullptr;
    m_open = false;

    // Clean drain → promote the ".part" file to its final name. A crashed or
    // un-drained recording keeps the ".part" suffix so scanOrphans() finds
    // it; streamable fMP4 means such files are still playable once renamed.
    if (drained) {
        QFile::remove(path);
        if (!QFile::rename(partPath, path) && err)
            *err = QStringLiteral("could not finalize recording file");
    } else if (err) {
        *err = workerErr.isEmpty()
            ? QStringLiteral("muxer did not flush within 1s — kept as .part for recovery")
            : workerErr;
    }
    return drained;
}
