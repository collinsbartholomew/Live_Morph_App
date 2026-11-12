#pragma once

#include <QObject>
#include <QString>
#include <QImage>
#include <QThread>
#include <QMutex>
#include <atomic>

struct MorphRecorderImpl;

/**
 * Worker that owns the Gst pipeline and does all per-frame work (pixel
 * conversion + appsrc push) OFF the GUI thread. MorphRecorder keeps a
 * latest-wins mailbox: at most one append is in flight, newer frames replace
 * a queued one.
 */
class MorphRecorderWorker : public QObject
{
    Q_OBJECT
public:
    explicit MorphRecorderWorker(MorphRecorderImpl *impl, QObject *parent = nullptr)
        : QObject(parent), m_impl(impl) {}
public slots:
    void append(const QImage &img);
    bool closeImpl(QString *err);
signals:
    void appended();
private:
    MorphRecorderImpl *m_impl;
};

// MorphRecorder — encodes the decoded morph-output frames (from the AI engine)
// to a local file via a small GStreamer appsrc pipeline. Mirrors Electron's
// MediaRecorder-on-RemoteStream behavior: the saved file contains the morphed
// output, not the camera.
//
// Lifecycle: open(path) → appendFrame(qimage)… → close().
// Caps are set lazily from the FIRST appended frame (actual size + fps), so
// recordings work at any output resolution (standard 960x540, HD 1280x720).
//
// All per-frame work runs on a dedicated worker thread (see MorphRecorderWorker);
// appendFrame() only stashes the latest frame in a mailbox.
class MorphRecorder : public QObject
{
    Q_OBJECT
public:
    explicit MorphRecorder(QObject *parent = nullptr) : QObject(parent) {}
    ~MorphRecorder() override;

    bool open(const QString &path, int fps = 30, int bitrateKbps = 4000, QString *err = nullptr);
    // Extension matching the encoder the pipeline will actually pick (x264→mp4,
    // vp8/webm fallback→webm), so the saved file is always playable.
    static QString containerExtension();
    bool active() const { return m_open; }
    void appendFrame(const QImage &img);
    bool close(QString *err = nullptr);

private slots:
    void onAppended();

private:
    void dispatchPending();

    MorphRecorderImpl *m_impl = nullptr;
    bool m_open = false;

    QThread m_thread;
    MorphRecorderWorker *m_worker = nullptr;
    QMutex m_pendingMutex;
    QImage m_pending;
    bool m_pendingSet = false;
    std::atomic<bool> m_busy{false};
};
