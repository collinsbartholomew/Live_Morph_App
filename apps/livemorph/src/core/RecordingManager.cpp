#include "RecordingManager.h"
#include "CameraManager.h"
#include "SessionManager.h"
#include "MorphRecorder.h"
#include <QFile>
#include "ConfigManager.h"
#include "../services/BackendClient.h"
#include <QStandardPaths>
#include <QDir>
#include <QFileInfo>
#include <QDateTime>
#include <QDesktopServices>
#include <QTimer>
#include <QVariantMap>

RecordingManager::RecordingManager(ConfigManager *config, BackendClient *backend,
                                   CameraManager *camera, SessionManager *session, QObject *parent)
    : QObject(parent), m_config(config), m_backend(backend), m_camera(camera), m_session(session)
{
    m_outputDir = QStandardPaths::writableLocation(QStandardPaths::MoviesLocation)
                  + QStringLiteral("/LiveMorph");
    // MoviesLocation can be empty on minimal systems — fall back to ~/Videos
    // or the home dir rather than writing to a root-level "/LiveMorph".
    if (QStandardPaths::writableLocation(QStandardPaths::MoviesLocation).isEmpty())
        m_outputDir = QStandardPaths::writableLocation(QStandardPaths::HomeLocation)
                      + QStringLiteral("/Videos/LiveMorph");
    QDir().mkpath(m_outputDir);

    // Morph output frames → MorphRecorder (MP4 via GStreamer). Electron parity:
    // recording captures the REMOTE morph stream, not the camera.
    if (m_session) {
        connect(m_session, &SessionManager::morphFrameReady, this, &RecordingManager::onMorphFrame);
    }

    // Camera-path recordings finalize asynchronously (QMediaRecorder::stop
    // returns before the muxer closes the file). Promote the ".part" temp
    // only once the recorder reports StoppedState; surface failures either
    // way so a dead encoder cannot tick a phantom "recording" forever.
    if (m_camera) {
        connect(m_camera, &CameraManager::localRecordingStopped,
                this, [this](const QString &) {
            if (m_cameraFinalizePending) {
                m_cameraFinalizePending = false;
                if (promoteTempFile())
                    emit recordingSaved(m_lastPath);
                else
                    emit recordingFailed(m_lastError.isEmpty()
                                             ? tr("Recording kept as .part — recover it from Settings")
                                             : m_lastError);
                listRecent();
                return;
            }
            // Recording ended without stopRecording() — camera unplugged or
            // stopped mid-record. Finalize the session here.
            if (m_recording && m_captureSource == CaptureSource::Camera) {
                if (m_tickTimer) m_tickTimer->stop();
                if (m_maxDurationTimer) m_maxDurationTimer->stop();
                m_recording = false;
                m_lastPath = m_currentPath;
                m_currentPath.clear();
                emit isRecordingChanged();
                emit lastRecordingChanged();
                emit recordingStopped(m_lastPath);
                emit elapsedChanged();
                if (promoteTempFile())
                    emit recordingSaved(m_lastPath);
                else
                    emit recordingFailed(m_lastError.isEmpty()
                                             ? tr("Recording kept as .part — recover it from Settings")
                                             : m_lastError);
                if (m_backend && m_backend->reachable())
                    m_backend->stopRecording(QStringLiteral("camera_stopped"));
                listRecent();
            }
        });
        connect(m_camera, &CameraManager::localRecordingFailed,
                this, [this](const QString &msg) {
            if (m_cameraFinalizePending) {
                // Failed while finalizing a stop.
                m_cameraFinalizePending = false;
                setError(msg);
                emit recordingFailed(msg);
                return;
            }
            // Failed at start / mid-recording (device unplugged etc.).
            if (m_recording && m_captureSource == CaptureSource::Camera) {
                setError(tr("Camera recording failed: %1").arg(msg));
                stopRecording(QStringLiteral("camera_error"));
            }
        });
    }

    if (m_backend) {
        connect(m_backend, &BackendClient::recordingsDirectoryReceived, this, [this](const QString &path) {
            if (!path.isEmpty()) setOutputDirectory(path);
        });
        connect(m_backend, &BackendClient::recordingStarted, this, [this](const QVariantMap &) {
            // backend ack
        });
        connect(m_backend, &BackendClient::recordingStopped, this, [this](const QVariantMap &r) {
            // Backend echo only — recordingSaved is emitted locally in
            // stopRecording() so the toast works offline and never doubles.
            const QString p = r.value(QStringLiteral("path")).toString();
            if (!p.isEmpty() && p != m_lastPath) {
                m_lastPath = p;
                emit lastRecordingChanged();
            }
        });
        connect(m_backend, &BackendClient::recordingFinalized, this, [this](const QVariantMap &r) {
            const QString p = r.value(QStringLiteral("path"), m_lastPath).toString();
            emit recordingFinalized(p);
            listRecent();
        });
        connect(m_backend, &BackendClient::requestFailed, this, [this](const QString &ep, const QString &err) {
            if (ep.contains(QLatin1String("recording"))) {
                setError(err);
                emit recordingFailed(err);
            }
        });
    }

    QTimer::singleShot(500, this, [this]() {
        if (m_backend) m_backend->getRecordingsDirectory();
        listRecent();
        scanOrphans();
    });
}

qint64 RecordingManager::elapsedMs() const
{
    return m_recording ? m_timer.elapsed() : 0;
}

void RecordingManager::setOutputDirectory(const QString &dir)
{
    if (m_outputDir == dir || dir.isEmpty()) return;
    m_outputDir = dir;
    QDir().mkpath(m_outputDir);
    emit outputDirectoryChanged();
}

void RecordingManager::setError(const QString &e)
{
    if (m_lastError == e) return;
    m_lastError = e;
    emit lastErrorChanged();
}

void RecordingManager::clearError()
{
    setError({});
}

void RecordingManager::startRecording(const QString &characterId)
{
    if (m_recording) return;
    clearError();
    if (m_outputDir.isEmpty() || !QDir().mkpath(m_outputDir)) {
        setError(tr("Recording folder is not writable"));
        emit recordingFailed(m_lastError);
        return;
    }

    const QString ext = (m_config && !m_config->recordingExtension().isEmpty())
                            ? m_config->recordingExtension()
                            : QStringLiteral("mp4");
    // Millisecond precision: a stop+start within the same second must not
    // silently overwrite the previous recording.
    const QString name = QStringLiteral("LiveMorph_%1.%2")
                             .arg(QDateTime::currentDateTime().toString(QStringLiteral("yyyyMMdd_HHmmsszzz")), ext);
    m_currentPath = m_outputDir + QLatin1Char('/') + name;
    m_captureSource = CaptureSource::None;

    // Morph output path (Electron parity): record the remote transformed stream.
    // If no session is live and no camera exists, refuse — recording with no
    // recorder "succeeds" a file that is never created (silent fake save).
    if (m_session && m_session->isActive()) {
        if (!m_morphRec) m_morphRec = new MorphRecorder();
        // fps from the session tier: standard=24, hd=30 (recordings play at
        // real speed instead of hardcoding 30 → slow-motion standard files).
        const int fps = m_session->hdActive() ? 30 : 24;
        // MorphRecorder owns its ".part" sibling internally and renames to
        // the final path on clean close — pass the FINAL path here.
        QString recErr;
        if (!m_morphRec->open(m_currentPath, fps, &recErr)) {
            setError(tr("Recorder pipeline failed to start: %1").arg(recErr));
            delete m_morphRec;
            m_morphRec = nullptr;
            emit recordingFailed(m_lastError);
            return;
        }
        m_captureSource = CaptureSource::Morph;
        m_tempPath.clear();
    } else if (m_camera) {
        // Camera path: RecordingManager owns the ".part" temp (QMediaRecorder
        // cannot rename on our behalf).
        m_tempPath = m_currentPath + QStringLiteral(".part");
        const QString path = m_camera->startLocalRecording(m_tempPath);
        if (path.isEmpty()) {
            setError(tr("Could not start local camera recording"));
            m_tempPath.clear();
            emit recordingFailed(m_lastError);
            return;
        }
        m_captureSource = CaptureSource::Camera;
    } else {
        setError(tr("Nothing to record — start a morph session first"));
        emit recordingFailed(m_lastError);
        return;
    }

    m_recording = true;
    m_timer.start();
    emit isRecordingChanged();
    emit recordingStarted(m_currentPath);

    // Optional metadata notify only — backend must not be required to encode.
    if (m_backend && m_backend->reachable()) {
        QVariantMap payload{
            {QStringLiteral("output_dir"), m_outputDir},
            {QStringLiteral("extension"), ext},
            {QStringLiteral("character"), characterId},
            {QStringLiteral("path"), m_currentPath},
            {QStringLiteral("source"), m_morphRec ? QStringLiteral("morph_stream") : QStringLiteral("local_camera")},
        };
        m_backend->startRecording(payload);
    }

    if (!m_tickTimer) {
        m_tickTimer = new QTimer(this);
        connect(m_tickTimer, &QTimer::timeout, this, [this]() {
            if (m_recording)
                emit elapsedChanged();
        });
    }
    m_tickTimer->start(500); // UI elapsed only; 2 Hz is enough

    // Electron parity: 45-minute hard cap on recording duration
    if (!m_maxDurationTimer) {
        m_maxDurationTimer = new QTimer(this);
        m_maxDurationTimer->setSingleShot(true);
        connect(m_maxDurationTimer, &QTimer::timeout, this, [this]() {
            if (m_recording) {
                setError(tr("Recording stopped — 45 minute limit reached"));
                stopRecording(QStringLiteral("max_duration"));
            }
        });
    }
    m_maxDurationTimer->start(45 * 60 * 1000);
}

void RecordingManager::onMorphFrame(const QImage &img)
{
    if (m_morphRec && m_recording)
        m_morphRec->appendFrame(img);
}

bool RecordingManager::stopCapture()
{
    bool drained = true;
    if (m_morphRec) {
        QString recErr;
        drained = m_morphRec->close(&recErr);
        if (!drained)
            setError(recErr);
        delete m_morphRec;
        m_morphRec = nullptr;
        // MorphRecorder renamed its ".part" → final path itself on clean drain.
    }
    if (m_camera && m_captureSource == CaptureSource::Camera) {
        // Async: QMediaRecorder::stop() returns before the file is closed.
        // Promotion is deferred to localRecordingStopped (or the 5s watchdog
        // in stopRecording) so the rename never races the muxer.
        m_camera->stopLocalRecording();
    }
    return drained;
}

// Rename the camera ".part" temp to its final name. Returns false when the
// rename fails — the ".part" stays behind for orphan recovery.
bool RecordingManager::promoteTempFile()
{
    if (m_tempPath.isEmpty())
        return m_lastPath.isEmpty() ? false : QFile::exists(m_lastPath);
    if (m_tempPath == m_lastPath)
        return true;
    QFile::remove(m_lastPath);
    if (QFile::rename(m_tempPath, m_lastPath)) {
        m_tempPath.clear();
        return true;
    }
    setError(tr("Could not finalize recording — kept as .part for recovery"));
    m_tempPath.clear();
    return false;
}

void RecordingManager::stopRecording(const QString &reason)
{
    if (!m_recording) return;
    if (m_tickTimer)
        m_tickTimer->stop();
    if (m_maxDurationTimer)
        m_maxDurationTimer->stop();
    const bool savedClean = stopCapture();
    m_recording = false;
    m_lastPath = m_currentPath;
    m_currentPath.clear();
    emit isRecordingChanged();
    emit lastRecordingChanged();
    emit recordingStopped(m_lastPath);
    emit elapsedChanged();

    if (m_captureSource == CaptureSource::Camera) {
        // Wait for QMediaRecorder's StoppedState to promote + toast; a 5s
        // watchdog finalizes anyway if the state change never arrives.
        m_cameraFinalizePending = true;
        QTimer::singleShot(5000, this, [this]() {
            if (!m_cameraFinalizePending)
                return;
            m_cameraFinalizePending = false;
            if (promoteTempFile())
                emit recordingSaved(m_lastPath);
            else
                emit recordingFailed(m_lastError.isEmpty()
                                         ? tr("Recording kept as .part — recover it from Settings")
                                         : m_lastError);
            listRecent();
        });
    } else {
        // Local-first save confirmation — the file is already on disk (or kept
        // as .part for orphan recovery). Do not depend on the backend echo.
        if (savedClean)
            emit recordingSaved(m_lastPath);
        else
            emit recordingFailed(m_lastError.isEmpty()
                                    ? tr("Recording kept as .part — recover it from Settings")
                                    : m_lastError);
    }

    if (m_backend && m_backend->reachable())
        m_backend->stopRecording(reason);

    // Auto-finalize after stop
    QTimer::singleShot(300, this, &RecordingManager::finalizeRecording);
}

void RecordingManager::finalizeRecording()
{
    if (m_backend && m_backend->reachable())
        m_backend->finalizeRecording();
    if (!m_lastPath.isEmpty()) {
        // NOTE: recordingStopped already emitted recordingSaved; do NOT emit
        // it again here — double toast on every stop (main.qml shows both).
        emit recordingFinalized(m_lastPath);
    }
    listRecent();
}

void RecordingManager::revealLastRecording()
{
    revealPath(m_lastPath);
}

void RecordingManager::revealPath(const QString &path)
{
    if (path.isEmpty()) return;
    QDesktopServices::openUrl(QUrl::fromLocalFile(QFileInfo(path).absolutePath()));
}

void RecordingManager::pickOutputDirectory(const QString &path)
{
    if (!path.isEmpty())
        setOutputDirectory(path);
}

void RecordingManager::scanOrphans()
{
    m_orphans.clear();
    QDir dir(m_outputDir);
    // Generic ".part" glob: catches crashed morph recordings (<final>.part —
    // owned by MorphRecorder) AND legacy double-suffixed (<final>.part.part)
    // leftovers, regardless of the configured extension.
    const auto files = dir.entryInfoList({QStringLiteral("*.part"), QStringLiteral("*.tmp.mp4")},
                                          QDir::Files);
    for (const QFileInfo &fi : files) {
        m_orphans.append(QVariantMap{
            {QStringLiteral("path"), fi.absoluteFilePath()},
            {QStringLiteral("name"), fi.fileName()},
            {QStringLiteral("size"), fi.size()},
            {QStringLiteral("modified"), fi.lastModified().toString(Qt::ISODate)},
        });
    }
    emit orphanRecordingsChanged();
}

void RecordingManager::recoverOrphan(const QString &path)
{
    QFileInfo fi(path);
    if (!fi.exists()) return;
    // Strip the full temp suffix chain: "x.mp4.part.part" → "x.mp4";
    // "x.webm.part" → "x.webm"; "x.tmp.mp4" → "x" (ext re-added below).
    QString base = fi.fileName();
    while (base.endsWith(QLatin1String(".part")))
        base.chop(QStringLiteral(".part").size());
    if (base.endsWith(QLatin1String(".tmp.mp4")))
        base.chop(QStringLiteral(".tmp.mp4").size());
    bool hasExt = false;
    const QStringList knownExts = { QStringLiteral(".mp4"), QStringLiteral(".webm"),
                                     QStringLiteral(".mov"), QStringLiteral(".mkv") };
    for (const QString &e : knownExts) {
        if (base.endsWith(e, Qt::CaseInsensitive)) { hasExt = true; break; }
    }
    if (!hasExt)
        base += QStringLiteral(".mp4");
    QString dest = m_outputDir + QLatin1Char('/') + base;
    QFile::remove(dest);
    if (!QFile::rename(path, dest))
        return; // rename failed — orphan stays for a later attempt
    m_lastPath = dest;
    emit lastRecordingChanged();
    emit recordingSaved(dest);
    scanOrphans();
    listRecent();
}

void RecordingManager::dismissOrphan(const QString &path)
{
    QFile::remove(path);
    scanOrphans();
}

void RecordingManager::listRecent()
{
    m_recent.clear();
    QDir dir(m_outputDir);
    const auto files = dir.entryInfoList({QStringLiteral("*.mp4"), QStringLiteral("*.webm"),
                                           QStringLiteral("*.mov"), QStringLiteral("*.mkv")},
                                          QDir::Files, QDir::Time);
    int n = 0;
    for (const QFileInfo &fi : files) {
        if (++n > 20) break;
        m_recent.append(QVariantMap{
            {QStringLiteral("path"), fi.absoluteFilePath()},
            {QStringLiteral("name"), fi.fileName()},
            {QStringLiteral("size"), fi.size()},
            {QStringLiteral("modified"), fi.lastModified().toString(Qt::ISODate)},
        });
    }
    emit recentRecordingsChanged();
}
