#include "UpdateChecker.h"
#include "ApiClient.h"

#include <QCoreApplication>
#include <QSysInfo>
#include <QNetworkRequest>
#include <QStandardPaths>
#include <QFileInfo>
#include <QProcess>
#include <QDesktopServices>
#include <QUrl>

UpdateChecker::UpdateChecker(ApiClient *api, QObject *parent)
    : QObject(parent)
    , m_api(api)
{
    connect(m_api, &ApiClient::versionCheckResult, this,
            [this](bool force, const QString &latest, const QString &url) {
                if (force)
                    emit forceUpdateRequired(latest, url.isEmpty()
                        ? QStringLiteral("https://smokescreenapp.com/#download")
                        : url);
                emit checkFinished(force);
            });
    // Stall watchdog: abort + surface an error if the installer download
    // makes no progress within 60s of starting.
    connect(&m_deadline, &QTimer::timeout, this, [this]() {
        if (m_downloading && m_reply) {
            m_reply->abort();
        }
    });
}

void UpdateChecker::check()
{
#if defined(Q_OS_WIN)
    const QString platform = QStringLiteral("windows");
#elif defined(Q_OS_MACOS)
    const QString platform = QStringLiteral("macos");
#else
    const QString platform = QStringLiteral("linux");
#endif
    m_api->checkVersion(QCoreApplication::applicationVersion(), platform);
}

void UpdateChecker::cancelDownload()
{
    m_deadline.stop();
    if (m_reply) {
        m_reply->abort();
        m_reply->deleteLater();
        m_reply = nullptr;
    }
    m_downloading = false;
    m_progress = 0;
    emit downloadingChanged();
    emit downloadProgressChanged();
}

void UpdateChecker::downloadAndInstall(const QString &url)
{
    if (m_downloading || url.isEmpty())
        return;
    cancelDownload();
    m_downloading = true;
    m_progress = 0;
    emit downloadingChanged();

    const QString dir = QStandardPaths::writableLocation(QStandardPaths::DownloadLocation);
    const QString fname = QUrl(url).fileName().isEmpty()
        ? QStringLiteral("SmokeScreen-update.tmp") : QUrl(url).fileName();
    m_destPath = dir + QStringLiteral("/") + fname;
    QFile::remove(m_destPath);

    m_reply = m_nam.get(QNetworkRequest(QUrl(url)));
    // Stall watchdog: without a deadline a hung installer download sits at 0%
    // forever (QNetworkAccessManager has no transfer-level stall detection).
    m_deadline.setSingleShot(true);
    m_deadline.setInterval(60000);
    m_deadline.start();
    QFile *f = new QFile(m_destPath, this);
    if (!f->open(QIODevice::WriteOnly)) {
        emit downloadFailed(tr("Could not open destination file"));
        cancelDownload();
        f->deleteLater();
        return;
    }

    connect(m_reply, &QNetworkReply::readyRead, this, [this, f]() {
        f->write(m_reply->readAll());
    });
    connect(m_reply, &QNetworkReply::downloadProgress, this, [this](qint64 got, qint64 total) {
        if (total > 0) {
            const int pct = int((got * 100) / total);
            if (pct != m_progress) {
                m_progress = pct;
                emit downloadProgressChanged();
            }
        }
    });
    connect(m_reply, &QNetworkReply::finished, this, [this, f]() {
        const int status = m_reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        if (m_reply->error() != QNetworkReply::NoError) {
            emit downloadFailed(m_reply->errorString());
            cancelDownload();
            f->close();
            QFile::remove(m_destPath);
            return;
        }
        f->close();
        if (status >= 400) {
            emit downloadFailed(tr("Download failed: HTTP %1").arg(status));
            cancelDownload();
            QFile::remove(m_destPath);
            return;
        }
        emit downloadReady(m_destPath);
        cancelDownload();
    });
}

