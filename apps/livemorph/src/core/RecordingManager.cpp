#include "RecordingManager.h"
#include "CameraManager.h"
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
                                   CameraManager *camera, QObject *parent)
    : QObject(parent), m_config(config), m_backend(backend), m_camera(camera)
{
    m_outputDir = QStandardPaths::writableLocation(QStandardPaths::MoviesLocation)
                  + QStringLiteral("/LiveMorph");
    QDir().mkpath(m_outputDir);

    if (m_backend) {
        connect(m_backend, &BackendClient::recordingsDirectoryReceived, this, [this](const QString &path) {
            if (!path.isEmpty()) setOutputDirectory(path);
        });
        connect(m_backend, &BackendClient::recordingStarted, this, [this](const QVariantMap &) {
            // backend ack
        });
        connect(m_backend, &BackendClient::recordingStopped, this, [this](const QVariantMap &r) {
            const QString p = r.value(QStringLiteral("path")).toString();
            if (!p.isEmpty()) {
                m_lastPath = p;
                emit lastRecordingChanged();
                emit recordingSaved(p);
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
    const QString name = QStringLiteral("LiveMorph_%1.%2")
                             .arg(QDateTime::currentDateTime().toString(QStringLiteral("yyyyMMdd_HHmmss")), ext);
    m_currentPath = m_outputDir + QLatin1Char('/') + name;

    // Frontend-owned: record local camera via Qt Multimedia (not a backend encode job).
    if (m_camera) {
        const QString path = m_camera->startLocalRecording(m_currentPath);
        if (path.isEmpty()) {
            setError(tr("Could not start local camera recording"));
            emit recordingFailed(m_lastError);
            return;
        }
        m_currentPath = path;
    }

    m_recording = true;
    m_timer.start();
    emit isRecordingChanged();
    emit recordingStarted(m_currentPath);

    // Open frame sidecar file once for the duration of the recording
    m_frameFile.setFileName(m_currentPath + QStringLiteral(".frames"));
    m_frameFile.open(QIODevice::WriteOnly | QIODevice::Truncate);

    // Optional metadata notify only — backend must not be required to encode.
    if (m_backend && m_backend->reachable()) {
        QVariantMap payload{
            {QStringLiteral("output_dir"), m_outputDir},
            {QStringLiteral("extension"), ext},
            {QStringLiteral("character"), characterId},
            {QStringLiteral("path"), m_currentPath},
            {QStringLiteral("source"), QStringLiteral("local_camera")},
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
}

void RecordingManager::stopRecording(const QString &reason)
{
    if (!m_recording) return;
    if (m_tickTimer)
        m_tickTimer->stop();
    // Close the frame sidecar file before stopping the camera
    if (m_frameFile.isOpen())
        m_frameFile.close();
    if (m_camera)
        m_camera->stopLocalRecording();
    m_recording = false;
    m_lastPath = m_currentPath;
    m_currentPath.clear();
    emit isRecordingChanged();
    emit lastRecordingChanged();
    emit recordingStopped(m_lastPath);
    emit elapsedChanged();

    if (m_backend)
        m_backend->stopRecording(reason);

    // Auto-finalize after stop
    QTimer::singleShot(300, this, &RecordingManager::finalizeRecording);
}

void RecordingManager::finalizeRecording()
{
    if (m_backend)
        m_backend->finalizeRecording();
    if (!m_lastPath.isEmpty()) {
        emit recordingFinalized(m_lastPath);
        emit recordingSaved(m_lastPath);
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
    const auto files = dir.entryInfoList({QStringLiteral("*.mp4.part"), QStringLiteral("*.tmp.mp4")},
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
    QString dest = m_outputDir + QLatin1Char('/') + fi.completeBaseName() + QStringLiteral(".mp4");
    QFile::rename(path, dest);
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
    const auto files = dir.entryInfoList({QStringLiteral("*.mp4")}, QDir::Files, QDir::Time);
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

void RecordingManager::pushChunk(const QByteArray &data)
{
    if (!m_recording || data.isEmpty() || !m_frameFile.isOpen())
        return;
    const quint32 n = quint32(data.size());
    m_frameFile.write(reinterpret_cast<const char *>(&n), 4);
    m_frameFile.write(data);
}
