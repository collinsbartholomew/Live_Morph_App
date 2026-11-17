#pragma once

#include <QString>
#include <QByteArray>

/**
 * Token / secret storage for the desktop client only.
 *
 * Priority:
 *  1. OS credential store when available (Windows DPAPI, macOS Keychain via Security)
 *  2. Local file under AppLocalData/secure (0700 dir, 0600 files). On Linux with
 *     OpenSSL available this is AES-256-GCM (authenticated) keyed by a stretched
 *     random per-install 0600 key file; without OpenSSL it falls back to keyed
 *     obfuscation (legacy v4 blobs remain readable). Same-user processes can
 *     still read the key file — a libsecret/keyring integration is the proper
 *     OS-backed upgrade path.
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
