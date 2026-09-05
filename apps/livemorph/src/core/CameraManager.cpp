#include "CameraManager.h"
#include <QMediaDevices>
#include <QCameraDevice>
#include <QVideoFrame>
#include <QMediaFormat>
#include <QFileInfo>
#include <QDir>
#include <QMetaObject>
#include <utility>

CameraManager::CameraManager(QObject *parent)
    : QObject(parent)
{
    m_sink = new QVideoSink(this);
    m_session.setVideoSink(m_sink);

    m_frameThrottle.start();
    connect(m_sink, &QVideoSink::videoFrameChanged, this, [this](const QVideoFrame &frame) {
        if (!frame.isValid()) return;
        // Cap emission rate — camera may deliver 60+ FPS; downstream MJPEG/OBS only needs ~30
        if (m_frameThrottle.isValid() && m_frameThrottle.elapsed() < kMinFrameIntervalMs)
            return;
        // Drop if previous frame still queued (prevents backlog under load)
        if (m_frameEmitPending.load(std::memory_order_relaxed))
            return;
        QImage img = frame.toImage();
        if (img.isNull()) return;
        m_frameThrottle.restart();
        m_frameEmitPending.store(true, std::memory_order_relaxed);
        // Move image into queued slot (no extra .copy())
        QMetaObject::invokeMethod(this, [this, img = std::move(img)]() mutable {
            m_frameEmitPending.store(false, std::memory_order_relaxed);
            emit frameReady(img);
        }, Qt::QueuedConnection);
    });

    // Hotplug: camera unplug/replug
    auto *devs = new QMediaDevices(this);
    connect(devs, &QMediaDevices::videoInputsChanged, this, [this]() {
        const QString prev = m_currentId;
        refreshDevices();
        if (m_deviceIds.isEmpty()) {
            if (m_active)
                stop();
            m_currentId.clear();
            emit currentDeviceChanged();
            emit error(tr("No camera available"));
            return;
        }
        if (!prev.isEmpty() && m_deviceIds.contains(prev))
            return; // still present
        // Previous device gone — switch to first available
        setCurrentDeviceId(m_deviceIds.first());
        // setCurrentDeviceId already handles stop/start if camera was active
    });

    refreshDevices();
    if (!m_deviceIds.isEmpty())
        setCurrentDeviceId(m_deviceIds.first());
}

CameraManager::~CameraManager()
{
    stopLocalRecording();
    stop();
}

QString CameraManager::currentDeviceName() const
{
    const int idx = m_deviceIds.indexOf(m_currentId);
    return (idx >= 0 && idx < m_deviceNames.size()) ? m_deviceNames.at(idx) : QString();
}

void CameraManager::setMirrored(bool v)
{
    if (m_mirrored == v) return;
    m_mirrored = v;
    emit mirroredChanged();
}

void CameraManager::refreshDevices()
{
    m_deviceIds.clear();
    m_deviceNames.clear();
    for (const QCameraDevice &dev : QMediaDevices::videoInputs()) {
        m_deviceIds << QString::fromUtf8(dev.id());
        m_deviceNames << (dev.description().isEmpty() ? tr("Camera %1").arg(m_deviceNames.size() + 1)
                                                     : dev.description());
    }
    emit devicesChanged();
}

void CameraManager::setCurrentDeviceId(const QString &id)
{
    if (m_currentId == id) return;
    const bool wasActive = m_active;
    if (wasActive) stop();
    m_currentId = id;
    emit currentDeviceChanged();
    if (wasActive) start();
}

void CameraManager::setupCamera()
{
    if (m_camera) {
        m_camera->deleteLater();
        m_camera = nullptr;
    }
    if (m_currentId.isEmpty()) return;

    QCameraDevice chosen;
    for (const QCameraDevice &dev : QMediaDevices::videoInputs()) {
        if (QString::fromUtf8(dev.id()) == m_currentId) {
            chosen = dev;
            break;
        }
    }
    if (chosen.isNull()) return;

    m_camera = new QCamera(chosen, this);
    m_session.setCamera(m_camera);
}

void CameraManager::ensureRecorder()
{
    if (m_recorder)
        return;
    m_recorder = new QMediaRecorder(this);
    m_session.setRecorder(m_recorder);
    connect(m_recorder, &QMediaRecorder::errorOccurred, this, [this](QMediaRecorder::Error, const QString &err) {
        emit localRecordingFailed(err);
        emit error(err);
    });
    connect(m_recorder, &QMediaRecorder::recorderStateChanged, this, [this](QMediaRecorder::RecorderState st) {
        const bool rec = (st == QMediaRecorder::RecordingState);
        if (m_recording != rec) {
            m_recording = rec;
            emit isRecordingChanged();
        }
        if (st == QMediaRecorder::StoppedState && !m_recordPath.isEmpty()) {
            emit localRecordingStopped(m_recordPath);
        }
    });
}

void CameraManager::start()
{
    if (m_active) return;
    setupCamera();
    if (!m_camera) {
        emit error(tr("No camera available"));
        return;
    }
    m_camera->start();
    m_active = true;
    emit isActiveChanged();
}

void CameraManager::stop()
{
    if (m_recording)
        stopLocalRecording();
    if (!m_active) return;
    if (m_camera)
        m_camera->stop();
    m_active = false;
    emit isActiveChanged();
}

QImage CameraManager::grabFrame() const
{
    if (!m_sink) return {};
    const QVideoFrame f = m_sink->videoFrame();
    return f.isValid() ? f.toImage() : QImage{};
}

QString CameraManager::startLocalRecording(const QString &outputPath)
{
    if (outputPath.isEmpty()) {
        emit localRecordingFailed(tr("No output path"));
        return {};
    }
    if (!m_active)
        start();
    if (!m_active) {
        emit localRecordingFailed(tr("Camera not active"));
        return {};
    }
    ensureRecorder();
    QDir().mkpath(QFileInfo(outputPath).absolutePath());
    m_recordPath = outputPath;
    m_recorder->setOutputLocation(QUrl::fromLocalFile(outputPath));
    QMediaFormat fmt;
    fmt.setFileFormat(QMediaFormat::MPEG4);
    fmt.setVideoCodec(QMediaFormat::VideoCodec::H264);
    m_recorder->setMediaFormat(fmt);
    m_recorder->setQuality(QMediaRecorder::HighQuality);
    m_recorder->record();
    if (m_recorder->recorderState() == QMediaRecorder::RecordingState
        || m_recorder->error() == QMediaRecorder::NoError) {
        m_recording = true;
        emit isRecordingChanged();
        emit localRecordingStarted(outputPath);
        return outputPath;
    }
    emit localRecordingFailed(m_recorder->errorString());
    return {};
}

void CameraManager::stopLocalRecording()
{
    if (!m_recorder)
        return;
    if (m_recorder->recorderState() != QMediaRecorder::StoppedState)
        m_recorder->stop();
    m_recording = false;
    emit isRecordingChanged();
}
