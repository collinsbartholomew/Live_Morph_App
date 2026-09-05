#pragma once

#include <QString>
#include <QByteArray>

/**
 * Token / secret storage for the desktop client only.
 *
 * Priority:
 *  1. OS credential store when available (Windows DPAPI, macOS Keychain via Security,
 *     Linux Secret Service when Qt is built with linked helper — see .cpp)
 *  2. Encrypted local file under AppLocalData (AES-like via QCryptographicHash + XOR
 *     is NOT used in production path; we use DPAPI / Keychain)
 *
 * Never stores Decart API keys — those belong only on the backend proxy.
 */
class SecureStore
{
public:
    static void write(const QString &key, const QString &value);
    static QString read(const QString &key);
    static void remove(const QString &key);

    /** true when OS-backed store is in use */
    static bool isOsBacked();

private:
    static bool osWrite(const QString &key, const QString &value);
    static QString osRead(const QString &key);
    static bool osRemove(const QString &key);
    static void fileWrite(const QString &key, const QString &value);
    static QString fileRead(const QString &key);
    static void fileRemove(const QString &key);
    static QString filePath(const QString &key);
    static QByteArray protect(const QByteArray &plain);
    static QByteArray unprotect(const QByteArray &blob);
};
