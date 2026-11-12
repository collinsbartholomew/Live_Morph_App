#pragma once

#include <QObject>
#include <QElapsedTimer>
#include <QPointer>
#include <atomic>
#include <QString>
#include <QStringList>
#include <QCamera>
#include <QMediaCaptureSession>
#include <QMediaRecorder>
#include <QVideoSink>
#include <QVideoFrame>
#include <QImage>
#include <QUrl>

/**
 * Local camera only. Morph video is owned by GStreamer WebRTC peer.
 * Optional QMediaRecorder records the *camera input* to a local file — not a
 * server-side encode job.
 */
class CameraManager : public QObject
{
    Q_OBJECT
    Q_PROPERTY(bool isActive READ isActive NOTIFY isActiveChanged)
    Q_PROPERTY(QStringList availableDevices READ availableDevices NOTIFY devicesChanged)
    Q_PROPERTY(QString currentDeviceId READ currentDeviceId WRITE setCurrentDeviceId NOTIFY currentDeviceChanged)
    Q_PROPERTY(QString currentDeviceName READ currentDeviceName NOTIFY currentDeviceChanged)
    Q_PROPERTY(QString currentMicName READ currentMicName NOTIFY currentDeviceChanged)
    Q_PROPERTY(bool mirrored READ mirrored WRITE setMirrored NOTIFY mirroredChanged)
    Q_PROPERTY(QObject* videoSink READ videoSink CONSTANT)
    Q_PROPERTY(QObject* mirrorVideoSink READ mirrorVideoSink CONSTANT)
    Q_PROPERTY(bool isRecording READ isRecording NOTIFY isRecordingChanged)
    Q_PROPERTY(double lastFrameMs READ lastFrameMs NOTIFY lastFrameMsChanged)
    Q_PROPERTY(int deviceCount READ deviceCount NOTIFY devicesChanged)
    Q_PROPERTY(QString lastError READ lastError NOTIFY lastErrorChanged)

public:
    explicit CameraManager(QObject *parent = nullptr);
    ~CameraManager() override;

    bool isActive() const { return m_active; }
    bool isRecording() const { return m_recording; }
    double lastFrameMs() const { return m_lastFrameMs.load(std::memory_order_relaxed); }
    Q_INVOKABLE QString deviceIdAt(int i) const { return m_deviceIds.value(i); }
    QStringList availableDevices() const { return m_deviceNames; }
    QString currentDeviceId() const { return m_currentId; }
    int deviceCount() const { return m_deviceNames.size(); }
    // Frame conversion is EXPENSIVE (software color transform). The per-frame
    // QImage path only runs while a consumer is registered (swap session,
    // recording). Idle camera = zero conversions.
    Q_INVOKABLE void addFrameConsumer();
    Q_INVOKABLE void removeFrameConsumer();
    // On-demand snapshot for the connecting-overlay freeze frame (PNG data
    // URL of the current sink frame, scaled). Cost incurred only when called.
    Q_INVOKABLE QString snapshotDataUrl(int maxWidth = 640) const;
    QString lastError() const { return m_lastError; }
    QString currentDeviceName() const;
    QString currentMicName() const;
    bool mirrored() const { return m_mirrored; }
    void setMirrored(bool v);
    QObject *videoSink() const { return m_sink; }
    QObject *mirrorVideoSink() const { return m_mirrorSink; }
    Q_INVOKABLE void bindVideoOutput(QObject *output);
    Q_INVOKABLE void bindMirrorVideoOutput(QObject *output);

public slots:
    Q_INVOKABLE void refreshDevices();
    void start();
    void stop();
    void setCurrentDeviceId(const QString &id);
    QImage grabFrame() const;

    /** Local file recording of camera (frontend-owned). Returns output path or empty. */
    QString startLocalRecording(const QString &outputPath);
    void stopLocalRecording();

signals:
    void isActiveChanged();
    void isRecordingChanged();
    void devicesChanged();
    void lastErrorChanged();
    void currentDeviceChanged();
    void mirroredChanged();
    // Zero-copy frame for the WebRTC peer (QVideoFrame is implicitly shared).
    void frameReady(const QVideoFrame &frame);
    void error(const QString &message);
    void localRecordingStarted(const QString &path);
    void localRecordingStopped(const QString &path);
    void localRecordingFailed(const QString &message);
    void lastFrameMsChanged();

private:
    void setupCamera();
    void ensureRecorder();

    QCamera *m_camera = nullptr;
    QMediaCaptureSession m_session;
    QMediaRecorder *m_recorder = nullptr;
    QVideoSink *m_sink = nullptr;
    QVideoSink *m_mirrorSink = nullptr;
    // Internal sink of the currently bound mirror (PiP) VideoOutput — owned
    // by that output; the mirror sink forwards frames into it.
    QPointer<QVideoSink> m_mirrorTargetSink;
    // The single live mirror-forward connection — rebinds disconnect the old
    // one so repeated bindMirrorVideoOutput calls don't stack lambdas.
    QMetaObject::Connection m_mirrorForwardConn;
    bool m_active = false;
    bool m_recording = false;
    bool m_mirrored = true;
    QString m_currentId;
    QStringList m_deviceIds;
    QStringList m_deviceNames;
    std::atomic<int> m_frameConsumers{0};
    QString m_lastError;
    QString m_recordPath;
    QElapsedTimer m_frameThrottle;
    std::atomic_bool m_frameEmitPending{false};
    std::atomic<qint64> m_lastFrameMs{0}; // for PiP INPUT-LOST watchdogs
    static constexpr int kMinFrameIntervalMs = 33; // ~30 FPS
};
