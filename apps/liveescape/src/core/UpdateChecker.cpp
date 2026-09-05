#include "UpdateChecker.h"
#include "ApiClient.h"

#include <QCoreApplication>
#include <QSysInfo>

UpdateChecker::UpdateChecker(ApiClient *api, QObject *parent)
    : QObject(parent)
    , m_api(api)
{
    connect(m_api, &ApiClient::versionCheckResult, this,
            [this](bool force, const QString &latest, const QString &url) {
                if (force)
                    emit forceUpdateRequired(latest, url.isEmpty()
                        ? QStringLiteral("https://liveescapeapp.com/#download")
                        : url);
                emit checkFinished(force);
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
