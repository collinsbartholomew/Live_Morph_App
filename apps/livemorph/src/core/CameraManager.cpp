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
#include <QBuffer>
#include <QByteArray>
#include <QSettings>
#include <QStandardPaths>
#include <cmath>

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

    // Mirror error() into a readable property for the stage's camera pill
    connect(this, &CameraManager::error, this, [this](const QString &message) {
        m_lastError = message;
        emit lastErrorChanged();
    });

    m_frameThrottle.start();
    connect(m_sink, &QVideoSink::videoFrameChanged, this, [this](const QVideoFrame &frame) {
        if (!frame.isValid()) return;
        // Live-track stamp for PiP INPUT-LOST watchdogs (any valid frame,
        // independent of the throttle below)
        // Live-track stamp for PiP INPUT-LOST watchdogs (any valid frame,
        // independent of the throttle below). Emit the NOTIFY on the
        // stale→fresh transition only (first frame / recovery) so QML
        // bindings can react without a 30Hz signal storm.
        const bool wasStale = m_lastFrameMs.load(std::memory_order_relaxed) <= 0;
        m_lastFrameMs.store(QDateTime::currentMSecsSinceEpoch(), std::memory_order_relaxed);
        if (wasStale)
            emit lastFrameMsChanged();
        // Skip the expensive conversion entirely when nobody consumes frames
        // (idle dashboard). The live timestamp above keeps the PiP watchdog fed.
        if (m_frameConsumers.load(std::memory_order_relaxed) <= 0)
            return;
        // Cap emission rate — camera may deliver 60+ FPS; downstream MJPEG/OBS only needs ~30
        if (m_frameThrottle.isValid() && m_frameThrottle.elapsed() < kMinFrameIntervalMs)
            return;
        // Drop if previous frame still queued (prevents backlog under load)
        if (m_frameEmitPending.load(std::memory_order_relaxed))
            return;
        // Pass the QVideoFrame straight through (implicitly shared, zero-copy):
        // GstRtcPeer::pushFrame mailboxes it to the worker thread, which does
        // any pixel conversion off the GUI thread. The old toImage() here cost
        // a full-frame RGB conversion at 30fps on the GUI thread.
        m_frameThrottle.restart();
        m_frameEmitPending.store(true, std::memory_order_relaxed);
        QMetaObject::invokeMethod(this, [this, frame]() mutable {
            m_frameEmitPending.store(false, std::memory_order_relaxed);
            emit frameReady(frame);
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

void CameraManager::addFrameConsumer()
{
    m_frameConsumers.fetch_add(1, std::memory_order_relaxed);
}

void CameraManager::removeFrameConsumer()
{
    int cur = m_frameConsumers.load(std::memory_order_relaxed);
    while (cur > 0 && !m_frameConsumers.compare_exchange_weak(cur, cur - 1,
                                                              std::memory_order_relaxed)) {
    }
}

QString CameraManager::snapshotDataUrl(int maxWidth) const
{
    if (!m_sink)
        return QString();
    QVideoFrame f = m_sink->videoFrame();
    if (!f.isValid())
        return QString();
    QImage img = f.toImage();
    if (img.isNull())
        return QString();
    if (maxWidth > 0 && img.width() > maxWidth)
        img = img.scaledToWidth(maxWidth, Qt::FastTransformation);
    QByteArray png;
    QBuffer buf(&png);
    buf.open(QIODevice::WriteOnly);
    img.save(&buf, "PNG");
    return QStringLiteral("data:image/png;base64,") + QString::fromLatin1(png.toBase64());
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
    return name.isEmpty() ? tr("Default microphone") : name;
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
    // Restore the persisted camera device if it is still present.
    const QString saved = QSettings(QStringLiteral("LiveMorph"), QStringLiteral("LiveMorph"))
                              .value(QStringLiteral("camera/deviceId")).toString();
    if (!saved.isEmpty() && m_deviceIds.contains(saved) && m_currentId != saved)
        setCurrentDeviceId(saved);
    emit devicesChanged();
}

void CameraManager::setCurrentDeviceId(const QString &id)
{
    if (m_currentId == id) return;
    const bool wasActive = m_active;
    if (wasActive) stop();
    m_currentId = id;
    QSettings(QStringLiteral("LiveMorph"), QStringLiteral("LiveMorph"))
        .setValue(QStringLiteral("camera/deviceId"), m_currentId);
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
    // Surface device errors (permission denied, busy, unplugged): without this
    // the stage showed a black "active" camera with no explanation.
    connect(m_camera, &QCamera::errorOccurred, this,
            [this](QCamera::Error, const QString &desc) {
        if (!desc.isEmpty()) {
            m_lastError = desc;
            emit lastErrorChanged();
            emit error(desc);
        }
        if (m_active) {
            m_active = false;
            emit isActiveChanged();
        }
        // Release the device — otherwise it stays held open until next start().
        if (m_camera)
            m_camera->stop();
    });
    connect(m_camera, &QCamera::activeChanged, this, [this](bool active) {
        if (!active && m_active) {
            m_active = false;
            emit isActiveChanged();
        }
    });
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
    // Qt 6.12: VideoOutput.videoSink is read-only and each VideoOutput owns
    // its internal sink (QVideoSink has no videoOutput property, so
    // setProperty("videoOutput", …) only created a dead dynamic property).
    // Correct direction: read the output's OWN sink and forward the mirror
    // sink's frames into it.
    QVideoSink *sink = output ? output->property("videoSink").value<QVideoSink *>() : nullptr;
    if (!sink || !m_mirrorSink)
        return;
    if (m_mirrorTargetSink == sink)
        return;
    m_mirrorTargetSink = sink;
    // Replace any previous forward connection so rebinding accumulates nothing.
    if (m_mirrorForwardConn)
        disconnect(m_mirrorForwardConn);
    m_mirrorForwardConn = connect(m_mirrorSink, &QVideoSink::videoFrameChanged, this,
            [this](const QVideoFrame &frame) {
        if (m_mirrorTargetSink && frame.isValid())
            m_mirrorTargetSink->setVideoFrame(frame);
    });
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
            const QString path = m_recordPath;
            // Clear immediately — a spurious later StoppedState transition
            // must not re-emit localRecordingStopped with the OLD recording's
            // path (RecordingManager would re-run finalize against stale paths).
            m_recordPath.clear();
            emit localRecordingStopped(path);
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
    // Containment: this slot is QML-reachable, and QMediaRecorder would
    // otherwise truncate/overwrite any user-writable file. Only allow paths
    // inside the user's home or a standard writable location. Resolve symlinks
    // on the longest existing ancestor so a symlink inside $HOME cannot pass
    // this lexical check.
    const QString clean0 = QDir::cleanPath(QFileInfo(outputPath).absoluteFilePath());
    QString existing = clean0;
    while (!existing.isEmpty() && !QFileInfo::exists(existing))
        existing = QFileInfo(existing).path();
    const QString canon = QFileInfo(existing).canonicalFilePath();
    const QString clean = canon.isEmpty() ? clean0 : canon + clean0.mid(existing.size());
    const QString home = QFileInfo(QDir::homePath()).canonicalFilePath();
    bool contained = !clean.isEmpty() && QDir(clean).isAbsolute()
                     && !home.isEmpty() && (clean == home || clean.startsWith(home + QLatin1Char('/')));
    if (!contained) {
        const QStringList stdDirs = {
            QStandardPaths::writableLocation(QStandardPaths::MoviesLocation),
            QStandardPaths::writableLocation(QStandardPaths::DocumentsLocation),
            QStandardPaths::writableLocation(QStandardPaths::DownloadLocation),
            QStandardPaths::writableLocation(QStandardPaths::AppLocalDataLocation),
        };
        for (const QString &d : stdDirs) {
            if (d.isEmpty()) continue;
            const QString cd = QFileInfo(d).canonicalFilePath();
            if (!cd.isEmpty() && (clean == cd || clean.startsWith(cd + QLatin1Char('/')))) {
                contained = true;
                break;
            }
        }
    }
    if (!contained) {
        emit localRecordingFailed(tr("Refusing to record outside the user's folders"));
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
    if (m_recording) {
        m_recording = false;
        emit isRecordingChanged();
    }
}
