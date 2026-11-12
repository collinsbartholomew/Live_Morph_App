#include <QDebug>
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

#if defined(Q_OS_UNIX)
#  include <fcntl.h>
#  include <sys/stat.h>
#  include <unistd.h>
#endif

namespace {
constexpr auto kService = "com.livemorph.desktop";

QString secureDir()
{
    return QStandardPaths::writableLocation(QStandardPaths::AppLocalDataLocation)
           + QStringLiteral("/secure");
}

// Create the vault dir private to the owning user (0700) on unix.
void ensurePrivateDir(const QString &path)
{
    QDir().mkpath(path);
#if defined(Q_OS_UNIX)
    ::chmod(QFile::encodeName(path), 0700);
#endif
}

// Random per-install key stored in a 0600 file. Unlike /etc/machine-id this
// is NOT world-readable, so blobs keyed on it are unreadable to other local
// users (the v3 scheme derived its key from the world-readable machine-id).
// Read /etc/machine-id style files (shared by the legacy v3 key and the
// non-empty fallback below).
QByteArray readMachineIdFiles()
{
    for (const char *p : {"/etc/machine-id", "/var/lib/dbus/machine-id"}) {
        QFile f(QString::fromLatin1(p));
        if (f.open(QIODevice::ReadOnly)) {
            const QByteArray v = f.readAll().trimmed();
            if (!v.isEmpty())
                return v;
        }
    }
    return {};
}

// Random per-install key stored in a 0600 file. Unlike /etc/machine-id this
// is NOT world-readable, so blobs keyed on it are unreadable to other local
// users. NEVER returns empty: an empty key would make the XOR below divide by
// zero, and returning an unwritten key would rotate it every process start and
// orphan all stored v4 blobs — so on any failure we fall back to a stable
// per-machine seed instead.
QByteArray privateKeyFile()
{
    static const QByteArray key = []() -> QByteArray {
        ensurePrivateDir(secureDir());
        const QString secretPath = secureDir() + QStringLiteral("/.machine-key");
#if defined(Q_OS_UNIX)
        // Existing readable key wins.
        {
            QFile sf(secretPath);
            if (sf.open(QIODevice::ReadOnly)) {
                const QByteArray v = sf.readAll().trimmed();
                sf.close();
                sf.setPermissions(QFileDevice::ReadOwner | QFileDevice::WriteOwner);
                if (!v.isEmpty())
                    return v;
            }
        }
        // Create with mode 0600 from the start (O_CREAT|O_EXCL) so there is
        // never a world-readable window between create and chmod.
        const int fd = ::open(QFile::encodeName(secretPath).constData(),
                              O_WRONLY | O_CREAT | O_EXCL, 0600);
        if (fd >= 0) {
            QByteArray rnd(32, 0);
            for (int i = 0; i < 32; ++i)
                rnd[i] = char(QRandomGenerator::global()->bounded(256));
            const QByteArray hex = rnd.toHex();
            const bool wrote = ::write(fd, hex.constData(), size_t(hex.size())) == hex.size();
            if (wrote)
                ::fsync(fd);
            ::close(fd);
            if (wrote)
                return hex;
            // Write failed (disk full / EIO): fall through to re-read in case
            // another process won the create race.
        }
        // Raced with another process creating it, or our write failed: read it.
        {
            QFile rf(secretPath);
            if (rf.open(QIODevice::ReadOnly)) {
                const QByteArray v = rf.readAll().trimmed();
                if (!v.isEmpty())
                    return v;
            }
        }
#else
        QFile sf(secretPath);
        if (sf.open(QIODevice::ReadOnly)) {
            const QByteArray v = sf.readAll().trimmed();
            if (!v.isEmpty()) {
                sf.close();
                // Tighten permissions in case an older version wrote it loosely.
                sf.setPermissions(QFileDevice::ReadOwner | QFileDevice::WriteOwner);
                return v;
            }
            sf.close();
        }
        QByteArray rnd(32, 0);
        for (int i = 0; i < 32; ++i)
            rnd[i] = char(QRandomGenerator::global()->bounded(256));
        const QByteArray hex = rnd.toHex();
        if (sf.open(QIODevice::WriteOnly | QIODevice::Truncate)) {
            sf.setPermissions(QFileDevice::ReadOwner | QFileDevice::WriteOwner);
            if (sf.write(hex) == hex.size())
                return hex;
            sf.close();
        }
#endif
        // Stable per-machine fallback so the key is never empty and never
        // silently rotates across processes.
        QByteArray fb = readMachineIdFiles();
        if (fb.isEmpty())
            fb = QSysInfo::machineUniqueId();
        if (fb.isEmpty())
            fb = QByteArrayLiteral("livemorph-local-fallback");
        return fb;
    }();
    return key;
}

// Cached machine id (legacy v3 key material — kept only to decrypt old blobs).
QByteArray cachedMachineId()
{
    static const QByteArray id = []() -> QByteArray {
        QByteArray v = readMachineIdFiles();
        if (v.isEmpty())
            v = privateKeyFile();
        return v;
    }();
    return id;
}

QByteArray stretch(const QByteArray &seed, const char *label)
{
    QByteArray mk = QCryptographicHash::hash(seed + QByteArray(label),
                                              QCryptographicHash::Sha256);
    for (int r = 0; r < 4096; ++r)
        mk = QCryptographicHash::hash(mk, QCryptographicHash::Sha256);
    return mk;
}

// v4 key: derived from the 0600 random file, not from machine-id.
QByteArray stretchedPrivateKey()
{
    static const QByteArray key = []() { return stretch(privateKeyFile(), "LiveMorph-v4"); }();
    return key;
}

// Stretched per-machine key (legacy v3), computed once per process.
QByteArray stretchedKey()
{
    static const QByteArray key = []() { return stretch(cachedMachineId(), "LiveMorph-v3"); }();
    return key;
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
    ensurePrivateDir(base);
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
    // Keychain is used via osWrite/osRead; if that fails, write() falls back
    // to fileWrite() — never store the secret as plaintext there: obfuscate
    // with the same app-private key scheme as Linux.
    {
        const QByteArray mk = stretchedPrivateKey();
        QByteArray out = plain;
        for (int i = 0; i < out.size(); ++i)
            out[i] = char(uchar(out[i]) ^ uchar(mk[i % mk.size()]));
        return QByteArray("v4") + out;
    }
#else
    // Linux: keyed with the app-private 0600 random file (v4). The older v3
    // scheme used the world-readable machine-id, which made the "encryption"
    // reversible by any local user; v3 blobs are still readable via unprotect.
    const QByteArray mk = stretchedPrivateKey();
    QByteArray out = plain;
    for (int i = 0; i < out.size(); ++i)
        out[i] = char(uchar(out[i]) ^ uchar(mk[i % mk.size()]));
    return QByteArray("v4") + out;
#endif
}

namespace {
QByteArray xorWith(QByteArray data, const QByteArray &mk)
{
    for (int i = 0; i < data.size(); ++i)
        data[i] = char(uchar(data[i]) ^ uchar(mk[i % mk.size()]));
    return data;
}
} // namespace

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
    if (!blob.isEmpty())
        qWarning("SecureStore: CryptUnprotectData failed for a %d-byte blob", int(blob.size()));
    return {};
#elif defined(Q_OS_MACOS)
    // macOS keychain read; file blobs use the same v4/v3 scheme as Linux.
    if (blob.startsWith("v4"))
        return xorWith(blob.mid(2), stretchedPrivateKey());
    if (blob.startsWith("v3"))
        return xorWith(blob.mid(2), stretchedKey());
    return blob;
#else
    if (blob.startsWith("v4")) {
        return xorWith(blob.mid(2), stretchedPrivateKey());
    }
    if (blob.startsWith("v3")) {
        return xorWith(blob.mid(2), stretchedKey());
    }
    // Legacy v2
    const QByteArray mk2 = QCryptographicHash::hash(
        (QSysInfo::machineUniqueId() + QStringLiteral("LiveMorph-v2")).toUtf8(),
        QCryptographicHash::Sha256);
    return xorWith(blob, mk2);
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
    // Never overwrite a good stored secret with an empty blob (e.g. DPAPI
    // failure on Windows returning {}) — that would silently log the user out.
    if (!value.isEmpty() && blob.isEmpty()) {
        qWarning("SecureStore: protect() failed for key %s, not overwriting", qPrintable(key));
        return;
    }
    QSaveFile f(filePath(key));
    if (!f.open(QIODevice::WriteOnly)) {
        qWarning("SecureStore: cannot open %s for writing", qPrintable(filePath(key)));
        return;
    }
    // Keep token files private to the owning user (0600) on all platforms.
    f.setPermissions(QFileDevice::ReadOwner | QFileDevice::WriteOwner);
    f.write(blob);
    if (!f.commit())
        qWarning("SecureStore: commit failed for key %s: %s", qPrintable(key), qPrintable(f.errorString()));
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
