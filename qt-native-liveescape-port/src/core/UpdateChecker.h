#pragma once

#include <QObject>
#include <QString>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QTimer>

class ApiClient;

class UpdateChecker : public QObject
{
    Q_OBJECT
    Q_PROPERTY(int downloadProgress READ downloadProgress NOTIFY downloadProgressChanged)
    Q_PROPERTY(bool downloading READ downloading NOTIFY downloadingChanged)
public:
    explicit UpdateChecker(ApiClient *api, QObject *parent = nullptr);

    Q_INVOKABLE void check();
    int downloadProgress() const { return m_progress; }
    bool downloading() const { return m_downloading; }
    Q_INVOKABLE void downloadAndInstall(const QString &url);
    Q_INVOKABLE void cancelDownload();

signals:
    void forceUpdateRequired(const QString &latestVersion, const QString &downloadUrl);
    void checkFinished(bool forceUpdate);
    void checkFailed();
    void downloadProgressChanged();
    void downloadingChanged();
    /// Fired when the installer is ready at a local path (open & quit).
    void downloadReady(const QString &path);
    void downloadFailed(const QString &error);

private:
    ApiClient *m_api = nullptr;
    QNetworkAccessManager m_nam;
    QNetworkReply *m_reply = nullptr;
    QTimer m_deadline;
    QString m_destPath;
    int m_progress = 0;
    bool m_downloading = false;
};
