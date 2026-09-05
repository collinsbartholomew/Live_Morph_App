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
    Q_PROPERTY(QString email READ email NOTIFY sessionChanged)
    Q_PROPERTY(QString displayName READ displayName NOTIFY sessionChanged)
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
    QString email() const { return m_email; }
    QString displayName() const { return m_displayName; }
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

    void setDeviceId(const QString &id);
    void setConnected(bool v);

    Q_INVOKABLE bool hasFeature(const QString &featureName) const;
    Q_INVOKABLE void setUser(const QString &email, const QString &name, const QString &userId = {},
                             const QString &sessionToken = {});
    void setRefreshToken(const QString &token);
    Q_INVOKABLE void setAccess(const QVariantMap &access);
    Q_INVOKABLE void setCredits(qint64 total, double used, double remaining, const QString &plan = {});
    Q_INVOKABLE void applyCreditsMap(const QVariantMap &credits);
    Q_INVOKABLE void setBurnRate(double creditsPerSecond);
    Q_INVOKABLE void setConsent(bool given);
    Q_INVOKABLE void setReferralCode(const QString &code);
    void setReferralEarned(double v);
    Q_INVOKABLE void setStreamingEnabled(bool enabled);
    Q_INVOKABLE void clearSession();
    Q_INVOKABLE void logout();
    Q_INVOKABLE void burnCreditsLocal(double seconds);
    Q_INVOKABLE void loadFromDisk();
    Q_INVOKABLE void saveToDisk();

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
    QString m_userId;
    QString m_sessionToken;
    QString m_refreshToken;
    QString m_accessKey;
    QString m_deviceId;
    QString m_plan = QStringLiteral("starter");
    QString m_referralCode;
    double m_referralEarned = 0;
    qint64 m_creditsTotal = 0;
    double m_creditsUsed = 0;
    double m_creditsRemaining = 0;
    double m_burnRate = 0.5;
    bool m_connected = false;
    bool m_consent = false;
    bool m_streamingEnabled = true;
    QElapsedTimer m_lastSaveTimer;
};
