#pragma once

#include <QObject>
#include <QSettings>
#include <QString>
#include <QVariantMap>
#include <QElapsedTimer>

class SessionManager : public QObject
{
    Q_OBJECT
    Q_PROPERTY(bool authenticated READ authenticated NOTIFY sessionChanged)
    Q_PROPERTY(bool licensed READ licensed NOTIFY sessionChanged)
    Q_PROPERTY(QString licenseStatus READ licenseStatus NOTIFY sessionChanged)
    Q_PROPERTY(QString plan READ plan NOTIFY sessionChanged)
    Q_PROPERTY(QString accessKey READ accessKey NOTIFY sessionChanged)
    Q_PROPERTY(QString licenseExpiry READ licenseExpiry NOTIFY sessionChanged)
    Q_PROPERTY(QString email READ email NOTIFY sessionChanged)
    Q_PROPERTY(QString displayName READ displayName NOTIFY sessionChanged)
    Q_PROPERTY(QString phone READ phone NOTIFY sessionChanged)
    Q_PROPERTY(QString userId READ userId NOTIFY sessionChanged)
    Q_PROPERTY(QString sessionToken READ sessionToken NOTIFY sessionChanged)
    Q_PROPERTY(QString refreshToken READ refreshToken NOTIFY sessionChanged)
    Q_PROPERTY(QString deviceId READ deviceId WRITE setDeviceId NOTIFY sessionChanged)
    Q_PROPERTY(double creditsRemaining READ creditsRemaining NOTIFY creditsChanged)
    Q_PROPERTY(double creditsUsed READ creditsUsed NOTIFY creditsChanged)
    Q_PROPERTY(qint64 creditsTotal READ creditsTotal NOTIFY creditsChanged)
    Q_PROPERTY(double burnRatePerSecond READ burnRatePerSecond NOTIFY burnRateChanged)
    Q_PROPERTY(bool connected READ connected WRITE setConnected NOTIFY connectedChanged)
    Q_PROPERTY(QString connectionStatus READ connectionStatus NOTIFY connectedChanged)
    Q_PROPERTY(bool consentGiven READ consentGiven NOTIFY sessionChanged)
    Q_PROPERTY(QString referralCode READ referralCode NOTIFY sessionChanged)
    Q_PROPERTY(double referralEarned READ referralEarned NOTIFY sessionChanged)
    Q_PROPERTY(bool streamingEnabled READ streamingEnabled NOTIFY platformChanged)
    Q_PROPERTY(bool starterPack READ starterPack NOTIFY sessionChanged)
    Q_PROPERTY(QString accessType READ accessType NOTIFY sessionChanged)
    Q_PROPERTY(QString memberSince READ memberSince NOTIFY sessionChanged)

public:
    explicit SessionManager(QObject *parent = nullptr);

    bool authenticated() const { return !m_email.isEmpty() || !m_userId.isEmpty(); }
    bool licensed() const { return !m_accessKey.isEmpty(); }
    QString licenseStatus() const {
        if (m_accessKey.isEmpty()) return QStringLiteral("unlicensed");
        return QStringLiteral("licensed");
    }
    QString plan() const { return m_plan; }
    QString accessKey() const { return m_accessKey; }
    QString licenseExpiry() const { return m_licenseExpiry; }
    Q_INVOKABLE bool licenseExpired() const;
    QString email() const { return m_email; }
    QString displayName() const { return m_displayName; }
    QString phone() const { return m_phone; }
    QString userId() const { return m_userId; }
    QString sessionToken() const { return m_sessionToken; }
    QString refreshToken() const { return m_refreshToken; }
    QString deviceId() const { return m_deviceId; }
    double creditsRemaining() const { return m_creditsRemaining; }
    double creditsUsed() const { return m_creditsUsed; }
    qint64 creditsTotal() const { return m_creditsTotal; }
    double burnRatePerSecond() const { return m_burnRate; }
    bool connected() const { return m_connected; }
    QString connectionStatus() const;
    bool consentGiven() const { return m_consent; }
    QString referralCode() const { return m_referralCode; }
    double referralEarned() const { return m_referralEarned; }
    bool streamingEnabled() const { return m_streamingEnabled; }
    bool starterPack() const { return m_starterPack; }
    QString accessType() const { return m_accessType; }
    QString memberSince() const { return m_memberSince; }

    void setDeviceId(const QString &id);
    void setConnected(bool v);

    Q_INVOKABLE bool hasFeature(const QString &featureName) const;
    Q_INVOKABLE void setUser(const QString &email, const QString &name, const QString &userId = {},
                             const QString &sessionToken = {});
    // Updates only the display name (profile edit) without touching tokens.
    Q_INVOKABLE void setDisplayName(const QString &name);
    // Updates only the phone number (profile edit).
    Q_INVOKABLE void setPhone(const QString &phone);
    void setRefreshToken(const QString &token);
    Q_INVOKABLE void setAccess(const QVariantMap &access);
    Q_INVOKABLE void setCredits(qint64 total, double used, double remaining, const QString &plan = {});
    Q_INVOKABLE void applyCreditsMap(const QVariantMap &credits);
    Q_INVOKABLE void setBurnRate(double creditsPerSecond);
    Q_INVOKABLE void setConsent(bool given);
    // Starter Pack entitlement flag (reference LS.STARTER_PACK). Starter users
    // stream without a full license until credits run out, then hit the
    // mandatory Starter Lock screen.
    Q_INVOKABLE void setStarterPack(bool v);
    // Account creation date (ISO) for the AccountModal "Member Since" row.
    Q_INVOKABLE void setMemberSince(const QString &iso);
    Q_INVOKABLE void setReferralCode(const QString &code);
    void setReferralEarned(double v);
    Q_INVOKABLE void setStreamingEnabled(bool enabled);
    Q_INVOKABLE void clearSession();
    // Clears only the license entitlement (access key / plan / expiry) while
    // keeping the signed-in user — used on account switches and when the
    // server rejects a previously stored key at boot.
    Q_INVOKABLE void clearLicenseState();
    Q_INVOKABLE void logout();
    Q_INVOKABLE void burnCreditsLocal(double seconds);
    Q_INVOKABLE void loadFromDisk();
    Q_INVOKABLE void saveToDisk();
    // 30s-throttled save for high-frequency paths (WS balance pushes, local
    // burn ticks). saveToDisk() stretches 3 SecureStore keys over 4096
    // SHA-256 rounds on the UI thread — calling it per balance_update (~1/s
    // while generating) stalled frames. Rare state changes keep the direct
    // save.
    void throttledSave();

signals:
    void sessionChanged();
    void creditsChanged();
    void burnRateChanged();
    void connectedChanged();
    void creditsExhausted();
    void platformChanged();

private:
    QSettings m_settings;
    QString m_email;
    QString m_displayName;
    QString m_phone;
    QString m_userId;
    QString m_sessionToken;
    QString m_refreshToken;
    QString m_accessKey;
    QString m_deviceId;
    QString m_plan = QStringLiteral("starter");
    QString m_licenseExpiry;
    QString m_referralCode;
    double m_referralEarned = 0;
    qint64 m_creditsTotal = 0;
    double m_creditsUsed = 0;
    double m_creditsRemaining = 0;
    double m_burnRate = 2.0;
    bool m_connected = false;
    bool m_consent = false;
    bool m_streamingEnabled = true;
    bool m_starterPack = false;
    QString m_accessType;
    QString m_memberSince;
    QElapsedTimer m_lastSaveTimer;
};
