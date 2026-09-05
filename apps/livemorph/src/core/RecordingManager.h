#pragma once

#include <QObject>
#include <QString>
#include <QStringList>
#include <QUrl>
#include <QElapsedTimer>
#include <QTimer>
#include <QVariantList>
#include <QVariantMap>
#include <QFile>

class ConfigManager;
class BackendClient;
class CameraManager;

class RecordingManager : public QObject
{
    Q_OBJECT
    Q_PROPERTY(bool isRecording READ isRecording NOTIFY isRecordingChanged)
    Q_PROPERTY(qint64 elapsedMs READ elapsedMs NOTIFY elapsedChanged)
    Q_PROPERTY(QString outputDirectory READ outputDirectory WRITE setOutputDirectory NOTIFY outputDirectoryChanged)
    Q_PROPERTY(QString lastRecordingPath READ lastRecordingPath NOTIFY lastRecordingChanged)
    Q_PROPERTY(QVariantList recentRecordings READ recentRecordings NOTIFY recentRecordingsChanged)
    Q_PROPERTY(QVariantList orphanRecordings READ orphanRecordings NOTIFY orphanRecordingsChanged)
    Q_PROPERTY(QString lastError READ lastError NOTIFY lastErrorChanged)
    Q_PROPERTY(bool hasOrphans READ hasOrphans NOTIFY orphanRecordingsChanged)

public:
    explicit RecordingManager(ConfigManager *config, BackendClient *backend,
                            CameraManager *camera = nullptr, QObject *parent = nullptr);

    bool isRecording() const { return m_recording; }
    qint64 elapsedMs() const;
    QString outputDirectory() const { return m_outputDir; }
    void setOutputDirectory(const QString &dir);
    QString lastRecordingPath() const { return m_lastPath; }
    QVariantList recentRecordings() const { return m_recent; }
    QVariantList orphanRecordings() const { return m_orphans; }
    QString lastError() const { return m_lastError; }
    bool hasOrphans() const { return !m_orphans.isEmpty(); }

public slots:
    void startRecording(const QString &characterId = {});
    void stopRecording(const QString &reason = QStringLiteral("user"));
    void finalizeRecording();
    void revealLastRecording();
    void revealPath(const QString &path);
    void pickOutputDirectory(const QString &path); // set from QML FileDialog
    void scanOrphans();
    void recoverOrphan(const QString &path);
    void dismissOrphan(const QString &path);
    void listRecent();
    void clearError();
    void pushChunk(const QByteArray &data); // frame/audio chunk while recording

signals:
    void isRecordingChanged();
    void elapsedChanged();
    void outputDirectoryChanged();
    void lastRecordingChanged();
    void recentRecordingsChanged();
    void orphanRecordingsChanged();
    void lastErrorChanged();
    void recordingStarted(const QString &path);
    void recordingStopped(const QString &path);
    void recordingFinalized(const QString &path);
    void recordingSaved(const QString &path);   // toast trigger
    void recordingFailed(const QString &message);

private:
    void setError(const QString &e);
    ConfigManager *m_config = nullptr;
    BackendClient *m_backend = nullptr;
    CameraManager *m_camera = nullptr;
    bool m_recording = false;
    QString m_outputDir;
    QString m_lastPath;
    QString m_currentPath;
    QString m_lastError;
    QElapsedTimer m_timer;
    QTimer *m_tickTimer = nullptr;
    QFile m_frameFile;
    QVariantList m_recent;
    QVariantList m_orphans;
};
