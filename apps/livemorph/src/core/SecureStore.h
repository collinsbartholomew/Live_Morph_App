#pragma once

#include <QString>
#include <QByteArray>

/**
 * Token / secret storage for the desktop client only.
 *
 * Priority:
 *  1. OS credential store when available (Windows DPAPI, macOS Keychain via Security)
 *  2. Local file under AppLocalData/secure (0700 dir, 0600 files) obfuscated with a
 *     key stretched from a random per-install 0600 key file (Linux/macOS fallback).
 *     Note: on Linux this is keyed obfuscation, not OS-keyring encryption — the key
 *     file lives next to the blobs, so same-user processes can recover it. A libsecret
 *     integration would be the proper upgrade path.
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
