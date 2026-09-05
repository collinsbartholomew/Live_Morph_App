#include "SecureStore.h"

#include <QStandardPaths>
#include <QDir>
#include <QFile>
#include <QSaveFile>
#include <QSysInfo>
#include <QCryptographicHash>
#include <QDataStream>
#include <QRandomGenerator>

#ifdef Q_OS_WIN
#  ifndef NOMINMAX
#    define NOMINMAX
#  endif
#  include <windows.h>
#  include <wincrypt.h>
#  pragma comment(lib, "Crypt32.lib")
#endif

#ifdef Q_OS_MACOS
#  include <Security/Security.h>
#endif

namespace {
constexpr auto kService = "com.livemorph.desktop";

// QSysInfo::machineUniqueId() is empty on Linux. Derive a stable machine secret
// so the XOR obfuscation key is per-machine (not a build-wide constant). This is
// still obfuscation, not encryption — prefer a keyring for high-value secrets.
QByteArray linuxMachineId()
{
    for (const char *p : {"/etc/machine-id", "/var/lib/dbus/machine-id"}) {
        QFile f(QString::fromLatin1(p));
        if (f.open(QIODevice::ReadOnly)) {
            const QByteArray id = f.readAll().trimmed();
            if (!id.isEmpty())
                return id;
        }
    }
    const QString base = QStandardPaths::writableLocation(QStandardPaths::AppLocalDataLocation)
                         + QStringLiteral("/secure");
    QDir().mkpath(base);
    const QString secretPath = base + QStringLiteral("/.machine-key");
    QFile sf(secretPath);
    if (sf.open(QIODevice::ReadOnly)) {
        const QByteArray v = sf.readAll().trimmed();
        if (!v.isEmpty())
            return v;
        sf.close();
    }
    QByteArray rnd(32, 0);
    for (int i = 0; i < 32; ++i)
        rnd[i] = char(QRandomGenerator::global()->bounded(256));
    const QByteArray hex = rnd.toHex();
    if (sf.open(QIODevice::WriteOnly | QIODevice::Truncate)) {
        sf.write(hex);
        sf.setPermissions(QFileDevice::ReadOwner | QFileDevice::WriteOwner);
        sf.close();
    }
    return hex;
}
} // namespace

bool SecureStore::isOsBacked()
{
#if defined(Q_OS_WIN) || defined(Q_OS_MACOS)
    return true;
#else
    // Linux: file vault under user data unless a keyring helper is integrated later
    return false;
#endif
}

QString SecureStore::filePath(const QString &key)
{
    const QString base = QStandardPaths::writableLocation(QStandardPaths::AppLocalDataLocation)
                         + QStringLiteral("/secure");
    QDir().mkpath(base);
    const QByteArray h = QCryptographicHash::hash(key.toUtf8(), QCryptographicHash::Sha256).toHex();
    return base + QLatin1Char('/') + QString::fromLatin1(h);
}

QByteArray SecureStore::protect(const QByteArray &plain)
{
#ifdef Q_OS_WIN
    QByteArray mutablePlain = plain;
    DATA_BLOB in{};
    in.pbData = reinterpret_cast<BYTE *>(mutablePlain.data());
    in.cbData = DWORD(mutablePlain.size());
    DATA_BLOB out{};
    if (CryptProtectData(&in, L"LiveMorph", nullptr, nullptr, nullptr, 0, &out)) {
        QByteArray blob(reinterpret_cast<const char *>(out.pbData), int(out.cbData));
        LocalFree(out.pbData);
        return blob;
    }
    return {};
#elif defined(Q_OS_MACOS)
    // Keychain used in osWrite/osRead — protect() unused on macOS path
    return plain;
#else
    // Linux: stretched machine-bound key (file mode 0600). Prefer libsecret when available.
    QByteArray mk = QCryptographicHash::hash(
        linuxMachineId() + QByteArray("LiveMorph-v3"),
        QCryptographicHash::Sha256);
    for (int r = 0; r < 4096; ++r)
        mk = QCryptographicHash::hash(mk, QCryptographicHash::Sha256);
    QByteArray out = plain;
    for (int i = 0; i < out.size(); ++i)
        out[i] = char(uchar(out[i]) ^ uchar(mk[i % mk.size()]));
    // Version prefix so unprotect can migrate v2→v3
    return QByteArray("v3") + out;
#endif
}

QByteArray SecureStore::unprotect(const QByteArray &blob)
{
#ifdef Q_OS_WIN
    QByteArray mutableBlob = blob;
    DATA_BLOB in{};
    in.pbData = reinterpret_cast<BYTE *>(mutableBlob.data());
    in.cbData = DWORD(mutableBlob.size());
    DATA_BLOB out{};
    if (CryptUnprotectData(&in, nullptr, nullptr, nullptr, nullptr, 0, &out)) {
        QByteArray plain(reinterpret_cast<const char *>(out.pbData), int(out.cbData));
        LocalFree(out.pbData);
        return plain;
    }
    return {};
#elif defined(Q_OS_MACOS)
    return blob;
#else
    auto xor_with = [](QByteArray data, const QByteArray &mk) {
        for (int i = 0; i < data.size(); ++i)
            data[i] = char(uchar(data[i]) ^ uchar(mk[i % mk.size()]));
        return data;
    };
    if (blob.startsWith("v3")) {
        QByteArray mk = QCryptographicHash::hash(
            linuxMachineId() + QByteArray("LiveMorph-v3"),
            QCryptographicHash::Sha256);
        for (int r = 0; r < 4096; ++r)
            mk = QCryptographicHash::hash(mk, QCryptographicHash::Sha256);
        return xor_with(blob.mid(2), mk);
    }
    // Legacy v2
    const QByteArray mk2 = QCryptographicHash::hash(
        (QSysInfo::machineUniqueId() + QStringLiteral("LiveMorph-v2")).toUtf8(),
        QCryptographicHash::Sha256);
    return xor_with(blob, mk2);
#endif
}

bool SecureStore::osWrite(const QString &key, const QString &value)
{
#ifdef Q_OS_MACOS
    const QByteArray acct = key.toUtf8();
    const QByteArray val = value.toUtf8();
    // Delete existing
    const void *keys[] = { kSecClass, kSecAttrService, kSecAttrAccount };
    const void *vals[] = { kSecClassGenericPassword,
                           CFStringCreateWithCString(nullptr, kService, kCFStringEncodingUTF8),
                           CFStringCreateWithCString(nullptr, acct.constData(), kCFStringEncodingUTF8) };
    CFDictionaryRef query = CFDictionaryCreate(nullptr, keys, vals, 3, nullptr, nullptr);
    SecItemDelete(query);
    CFRelease(query);

    const void *ak[] = { kSecClass, kSecAttrService, kSecAttrAccount, kSecValueData };
    CFStringRef svc = CFStringCreateWithCString(nullptr, kService, kCFStringEncodingUTF8);
    CFStringRef account = CFStringCreateWithCString(nullptr, acct.constData(), kCFStringEncodingUTF8);
    CFDataRef data = CFDataCreate(nullptr, reinterpret_cast<const UInt8 *>(val.constData()), val.size());
    const void *av[] = { kSecClassGenericPassword, svc, account, data };
    CFDictionaryRef add = CFDictionaryCreate(nullptr, ak, av, 4, nullptr, nullptr);
    const OSStatus st = SecItemAdd(add, nullptr);
    CFRelease(add); CFRelease(svc); CFRelease(account); CFRelease(data);
    return st == errSecSuccess;
#else
    Q_UNUSED(key); Q_UNUSED(value);
    return false;
#endif
}

QString SecureStore::osRead(const QString &key)
{
#ifdef Q_OS_MACOS
    const QByteArray acct = key.toUtf8();
    CFStringRef svc = CFStringCreateWithCString(nullptr, kService, kCFStringEncodingUTF8);
    CFStringRef account = CFStringCreateWithCString(nullptr, acct.constData(), kCFStringEncodingUTF8);
    const void *keys[] = { kSecClass, kSecAttrService, kSecAttrAccount, kSecReturnData, kSecMatchLimit };
    const void *vals[] = { kSecClassGenericPassword, svc, account, kCFBooleanTrue, kSecMatchLimitOne };
    CFDictionaryRef query = CFDictionaryCreate(nullptr, keys, vals, 5, nullptr, nullptr);
    CFTypeRef result = nullptr;
    const OSStatus st = SecItemCopyMatching(query, &result);
    CFRelease(query); CFRelease(svc); CFRelease(account);
    if (st != errSecSuccess || !result)
        return {};
    CFDataRef data = (CFDataRef)result;
    QString out = QString::fromUtf8(reinterpret_cast<const char *>(CFDataGetBytePtr(data)),
                                    int(CFDataGetLength(data)));
    CFRelease(result);
    return out;
#else
    Q_UNUSED(key);
    return {};
#endif
}

bool SecureStore::osRemove(const QString &key)
{
#ifdef Q_OS_MACOS
    const QByteArray acct = key.toUtf8();
    CFStringRef svc = CFStringCreateWithCString(nullptr, kService, kCFStringEncodingUTF8);
    CFStringRef account = CFStringCreateWithCString(nullptr, acct.constData(), kCFStringEncodingUTF8);
    const void *keys[] = { kSecClass, kSecAttrService, kSecAttrAccount };
    const void *vals[] = { kSecClassGenericPassword, svc, account };
    CFDictionaryRef query = CFDictionaryCreate(nullptr, keys, vals, 3, nullptr, nullptr);
    SecItemDelete(query);
    CFRelease(query); CFRelease(svc); CFRelease(account);
    return true;
#else
    Q_UNUSED(key);
    return false;
#endif
}

void SecureStore::fileWrite(const QString &key, const QString &value)
{
    const QByteArray blob = protect(value.toUtf8());
    QSaveFile f(filePath(key));
    if (!f.open(QIODevice::WriteOnly))
        return;
    // Keep token files private to the owning user (0600) on all platforms.
    f.setPermissions(QFileDevice::ReadOwner | QFileDevice::WriteOwner);
    f.write(blob);
    f.commit();
}

QString SecureStore::fileRead(const QString &key)
{
    QFile f(filePath(key));
    if (!f.open(QIODevice::ReadOnly))
        return {};
    const QByteArray plain = unprotect(f.readAll());
    return QString::fromUtf8(plain);
}

void SecureStore::fileRemove(const QString &key)
{
    QFile::remove(filePath(key));
}

void SecureStore::write(const QString &key, const QString &value)
{
    if (key.trimmed().isEmpty())
        return;
#ifdef Q_OS_WIN
    // DPAPI blob stored in AppLocalData
    fileWrite(key, value);
#elif defined(Q_OS_MACOS)
    if (!osWrite(key, value))
        fileWrite(key, value);
#else
    fileWrite(key, value);
#endif
}

QString SecureStore::read(const QString &key)
{
    if (key.trimmed().isEmpty())
        return {};
#ifdef Q_OS_MACOS
    const QString v = osRead(key);
    if (!v.isEmpty())
        return v;
#endif
    return fileRead(key);
}

void SecureStore::remove(const QString &key)
{
#ifdef Q_OS_MACOS
    osRemove(key);
#endif
    fileRemove(key);
}
