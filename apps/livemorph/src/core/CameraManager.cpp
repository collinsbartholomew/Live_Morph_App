#include "CameraManager.h"
#include <QMediaDevices>
#include <QAudioDevice>
#include <QCameraDevice>
#include <QVideoFrame>
#include <QMediaFormat>
#include <QFileInfo>
#include <QDir>
#include <QDateTime>
#include <QMetaObject>
#include <QDebug>
#include <cmath>
#include <utility>

CameraManager::CameraManager(QObject *parent)
    : QObject(parent)
{
    m_sink = new QVideoSink(this);
    m_session.setVideoSink(m_sink);

    // Mirror sink: fans the same frames out to secondary views (PiP) without
    // stealing the single QMediaCaptureSession video output — rebinding that
    // output between StageFrame and InputPiP made the stage preview go dark
    // whenever the PiP became visible (last-bind-wins).
    m_mirrorSink = new QVideoSink(this);
    connect(m_sink, &QVideoSink::videoFrameChanged, m_mirrorSink,
            [this](const QVideoFrame &frame) {
                if (m_mirrorSink && frame.isValid())
                    m_mirrorSink->setVideoFrame(frame);
            });

    m_frameThrottle.start();
    connect(m_sink, &QVideoSink::videoFrameChanged, this, [this](const QVideoFrame &frame) {
        if (!frame.isValid()) return;
        // Live-track stamp for PiP INPUT-LOST watchdogs (any valid frame,
        // independent of the throttle below)
        m_lastFrameMs.store(QDateTime::currentMSecsSinceEpoch(), std::memory_order_relaxed);
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

QString CameraManager::currentMicName() const
{
    const auto input = QMediaDevices::defaultAudioInput();
    const QString name = input.description();
    return name.isEmpty() ? QStringLiteral("Default microphone") : name;
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
    // Match the Electron capture contract: 1280x720, ~30fps (Electron:
    // getUserMedia({width:ideal:1280,height:ideal:720,frameRate:{ideal:30,max:30}})).
    QCameraFormat best;
    double bestScore = -1e9;
    const auto formats = chosen.videoFormats();
    for (const QCameraFormat &f : formats) {
        const QSize r = f.resolution();
        const float fps = f.maxFrameRate();
        const double ar = (r.height() > 0 ? double(r.width()) / r.height() : 0.0);
        const double score =
            -std::abs(r.width() * r.height() - 1280.0 * 720.0) / 1000.0
            - std::abs(ar - 16.0 / 9.0) * 500.0
            - std::abs(fps - 30.0) * 5.0;
        if (score > bestScore) {
            bestScore = score;
            best = f;
        }
    }
    if (!best.resolution().isEmpty()) {
        m_camera->setCameraFormat(best);
        qInfo() << "CameraManager: selected format" << best.resolution() << "fps" << best.maxFrameRate();
    }
    m_session.setCamera(m_camera);
}

void CameraManager::bindVideoOutput(QObject *output)
{
    if (output)
        m_session.setVideoOutput(output);
}

void CameraManager::bindMirrorVideoOutput(QObject *output)
{
    // QML VideoOutput.videoSink is writable at runtime (setVideoSink) but
    // treated as read-only by the AOT QML compiler — imperative property set
    // from C++ bypasses the static-typing warning while achieving the same bind.
    if (output)
        output->setProperty("videoSink", QVariant::fromValue(m_mirrorSink));
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
    // QMediaRecorder::record() is asynchronous — recorderState() will not yet
    // report RecordingState here, so state checks are meaningless this early.
    // Accept optimistically when no immediate error is set; real failures
    // arrive via errorOccurred → localRecordingFailed (RecordingManager
    // listens and stops the phantom session).
    if (m_recorder->error() != QMediaRecorder::NoError) {
        emit localRecordingFailed(m_recorder->errorString());
        return {};
    }
    emit localRecordingStarted(outputPath);
    return outputPath;
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
