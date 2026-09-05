#include "MachineIdProvider.h"

#include <QCryptographicHash>
#include <QFile>
#include <QStandardPaths>

#if defined(Q_OS_WIN)
#  include <windows.h>
#elif defined(Q_OS_MACOS)
#  include <IOKit/IOKitLib.h>
#  include <CoreFoundation/CoreFoundation.h>
#endif

MachineIdProvider::MachineIdProvider(QObject *parent)
    : QObject(parent)
{
    m_cachedId = buildStableId(rawMachineSeed());
    if (m_cachedId.trimmed().isEmpty()) {
        m_cachedId = QCryptographicHash::hash(
            QByteArray("LiveEscape-empty-seed"), QCryptographicHash::Sha256).toHex().toUpper();
    }
}

QString MachineIdProvider::deviceId() const
{
    if (m_cachedId.trimmed().isEmpty())
        return QStringLiteral("FALLBACK-DEVICE");
    return m_cachedId;
}

QString MachineIdProvider::rawMachineSeed() const
{
#if defined(Q_OS_WIN)
    HKEY hKey = nullptr;
    if (RegOpenKeyExW(HKEY_LOCAL_MACHINE,
                      L"SOFTWARE\\Microsoft\\Cryptography",
                      0, KEY_READ | KEY_WOW64_64KEY, &hKey) == ERROR_SUCCESS) {
        wchar_t buf[256] = {};
        DWORD size = sizeof(buf);
        DWORD type = 0;
        if (RegQueryValueExW(hKey, L"MachineGuid", nullptr, &type,
                             reinterpret_cast<LPBYTE>(buf), &size) == ERROR_SUCCESS
            && type == REG_SZ) {
            RegCloseKey(hKey);
            return QString::fromWCharArray(buf).trimmed();
        }
        RegCloseKey(hKey);
    }
#elif defined(Q_OS_MACOS)
    io_service_t service = IOServiceGetMatchingService(
        kIOMainPortDefault, IOServiceMatching("IOPlatformExpertDevice"));
    if (service) {
        CFTypeRef uuidRef = IORegistryEntryCreateCFProperty(
            service, CFSTR("IOPlatformUUID"), kCFAllocatorDefault, 0);
        IOObjectRelease(service);
        if (uuidRef) {
            CFStringRef cfStr = static_cast<CFStringRef>(uuidRef);
            char buf[128] = {};
            if (CFStringGetCString(cfStr, buf, sizeof(buf), kCFStringEncodingUTF8)) {
                CFRelease(uuidRef);
                return QString::fromUtf8(buf).trimmed();
            }
            CFRelease(uuidRef);
        }
    }
#elif defined(Q_OS_LINUX)
    for (const char *path : {"/etc/machine-id", "/var/lib/dbus/machine-id"}) {
        QFile f(QString::fromLatin1(path));
        if (f.open(QIODevice::ReadOnly | QIODevice::Text)) {
            const QString id = QString::fromUtf8(f.readAll()).trimmed();
            if (!id.isEmpty())
                return id;
        }
    }
#endif
    return QStandardPaths::writableLocation(QStandardPaths::HomeLocation);
}

QString MachineIdProvider::buildStableId(const QString &seed)
{
    const QByteArray hash = QCryptographicHash::hash(
        seed.toUtf8(), QCryptographicHash::Sha256).toHex().toUpper();
    return QStringLiteral("SS-%1-%2-%3")
        .arg(QString::fromLatin1(hash.mid(0, 4)))
        .arg(QString::fromLatin1(hash.mid(4, 4)))
        .arg(QString::fromLatin1(hash.mid(8, 4)));
}
