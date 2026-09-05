#pragma once

#include <QObject>
#include <QElapsedTimer>
#include <atomic>
#include <QString>
#include <QStringList>
#include <QCamera>
#include <QMediaCaptureSession>
#include <QMediaRecorder>
#include <QVideoSink>
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
    Q_PROPERTY(bool mirrored READ mirrored WRITE setMirrored NOTIFY mirroredChanged)
    Q_PROPERTY(QObject* videoSink READ videoSink CONSTANT)
    Q_PROPERTY(bool isRecording READ isRecording NOTIFY isRecordingChanged)

public:
    explicit CameraManager(QObject *parent = nullptr);
    ~CameraManager() override;

    bool isActive() const { return m_active; }
    bool isRecording() const { return m_recording; }
    QStringList availableDevices() const { return m_deviceNames; }
    QString currentDeviceId() const { return m_currentId; }
    QString currentDeviceName() const;
    bool mirrored() const { return m_mirrored; }
    void setMirrored(bool v);
    QObject *videoSink() const { return m_sink; }

public slots:
    void refreshDevices();
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
    void currentDeviceChanged();
    void mirroredChanged();
    void frameReady(const QImage &frame);
    void error(const QString &message);
    void localRecordingStarted(const QString &path);
    void localRecordingStopped(const QString &path);
    void localRecordingFailed(const QString &message);

private:
    void setupCamera();
    void ensureRecorder();

    QCamera *m_camera = nullptr;
    QMediaCaptureSession m_session;
    QMediaRecorder *m_recorder = nullptr;
    QVideoSink *m_sink = nullptr;
    bool m_active = false;
    bool m_recording = false;
    bool m_mirrored = true;
    QString m_currentId;
    QStringList m_deviceIds;
    QStringList m_deviceNames;
    QString m_recordPath;
    QElapsedTimer m_frameThrottle;
    std::atomic_bool m_frameEmitPending{false};
    static constexpr int kMinFrameIntervalMs = 33; // ~30 FPS
};
