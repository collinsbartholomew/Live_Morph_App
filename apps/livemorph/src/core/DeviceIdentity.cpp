#include "DeviceIdentity.h"
#include "SecureStore.h"

#include <QSysInfo>
#include <QUuid>
#include <QCoreApplication>
#include <QRegularExpression>

QString DeviceIdentity::deviceId()
{
    static QString cached;
    if (!cached.isEmpty())
        return cached;

    QString id = QString::fromUtf8(QSysInfo::machineUniqueId()).trimmed();
    // Sanitize header-safe
    id.replace(QRegularExpression(QStringLiteral("[^A-Za-z0-9._-]")), QStringLiteral("-"));
    if (id.size() < 8) {
        id = SecureStore::read(QStringLiteral("device_id"));
        if (id.size() < 8) {
            id = QUuid::createUuid().toString(QUuid::WithoutBraces);
            SecureStore::write(QStringLiteral("device_id"), id);
        }
    }
    cached = id;
    return cached;
}

QString DeviceIdentity::appVersion()
{
    const QString v = QCoreApplication::applicationVersion();
    return v.isEmpty() ? QStringLiteral("1.8.0") : v;
}

QString DeviceIdentity::userAgent()
{
    return QStringLiteral("LiveMorph/%1 (%2 %3)")
        .arg(appVersion(), QSysInfo::prettyProductName(), QSysInfo::currentCpuArchitecture());
}
