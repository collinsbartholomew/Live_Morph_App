#pragma once

class QWebSocket;

#include <QObject>
#include <QString>
#include <QVariantMap>
#include <QNetworkAccessManager>
#include <QTimer>

class ConfigManager;
class BackendClient;

/**
 * AuthManager — production JWT auth against the Rust backend.
 *
 * Flows:
 *  1) Magic link / OTP: requestOtp(email) → verifyOtp(email, code) → JWT
 *  2) Password:        signInWithEmail / signUp → JWT
 *  3) Restore:         access + refresh from QSettings; auto-refresh before expiry
 *
 * Tokens are pushed to BackendClient so all authenticated API calls carry Bearer.
 */
class AuthManager : public QObject
{
    Q_OBJECT
    Q_PROPERTY(bool isAuthenticated READ isAuthenticated NOTIFY authenticatedChanged)
    Q_PROPERTY(bool isLoading READ isLoading NOTIFY isLoadingChanged)
    Q_PROPERTY(bool googleAuthAvailable READ googleAuthAvailable NOTIFY googleAvailableChanged)
    Q_PROPERTY(QString errorMessage READ errorMessage NOTIFY errorMessageChanged)
    Q_PROPERTY(QString displayName READ displayName NOTIFY profileChanged)
    Q_PROPERTY(QString email READ email NOTIFY profileChanged)
    Q_PROPERTY(QString avatarUrl READ avatarUrl NOTIFY profileChanged)
    Q_PROPERTY(double creditBalance READ creditBalance NOTIFY profileChanged)
    Q_PROPERTY(double bonusBalance READ bonusBalance NOTIFY profileChanged)
    Q_PROPERTY(QString tier READ tier NOTIFY profileChanged)
    Q_PROPERTY(QString userId READ userId NOTIFY profileChanged)
    Q_PROPERTY(QString accessToken READ accessToken NOTIFY tokensChanged)
    Q_PROPERTY(bool otpSent READ otpSent NOTIFY otpSentChanged)
    Q_PROPERTY(int otpCooldownSecs READ otpCooldownSecs NOTIFY otpCooldownChanged)
    Q_PROPERTY(int otpCodeLength READ otpCodeLength NOTIFY otpCodeLengthChanged)
    Q_PROPERTY(bool rateLimited READ rateLimited NOTIFY rateLimitedChanged)
    Q_PROPERTY(int rateLimitSecs READ rateLimitSecs NOTIFY rateLimitedChanged)
    Q_PROPERTY(QString pendingEmail READ pendingEmail NOTIFY otpSentChanged)

public:
    explicit AuthManager(ConfigManager *config, BackendClient *backend, QObject *parent = nullptr);

    bool isAuthenticated() const { return m_authenticated; }
    bool googleAuthAvailable() const { return m_googleAvailable; }
    bool isLoading() const { return m_loading; }
    QString errorMessage() const { return m_error; }
    QString displayName() const { return m_displayName; }
    QString email() const { return m_email; }
    QString avatarUrl() const { return m_avatarUrl; }
    double creditBalance() const { return m_creditBalance; }
    double bonusBalance() const { return m_bonusBalance; }
    QString tier() const { return m_tier; }
    QString userId() const { return m_userId; }
    QString accessToken() const { return m_accessToken; }
    bool otpSent() const { return m_otpSent; }
    int otpCooldownSecs() const { return m_otpCooldownSecs; }
    int otpCodeLength() const { return m_otpCodeLength; }
    bool rateLimited() const { return m_rateLimited; }
    int rateLimitSecs() const { return m_rateLimitSecs; }
    QString pendingEmail() const { return m_pendingEmail; }

public slots:
    /// Step 1 of magic-link: POST /auth/otp/request
    void requestOtp(const QString &email);
    /// Step 2: POST /auth/otp/verify  { email, code }
    void verifyOtp(const QString &email, const QString &code);
    /// Password login: POST /auth/login
    void signInWithEmail(const QString &email, const QString &password);
    void signInWithGoogle();
    void applyOAuthTokens(const QString &accessToken, const QString &refreshToken,
                         qint64 expiresIn = 3600, const QString &email = {});
    void exchangeOAuthTicket(const QString &ticket);
    /// Register: POST /auth/register
    void signUp(const QString &email, const QString &password, const QString &displayName = {});
    void signOut();
    void logoutAllDevices();
    void deleteAccount();
    void exportData();
    void refreshProfile();
    void refreshTokens();
    void connectBalanceSocket();
    void disconnectBalanceSocket();
    void clearError();
    void resetOtpFlow();
    /// Apply balance after payment verify
    void applyBalance(double credits, double bonus);
    /** UI burn helper — updates balances; persists at most ~1/s */
    void deductCredits(double amount);

signals:
    void authenticatedChanged();
    void isLoadingChanged();
    void errorMessageChanged();
    void profileChanged();
    void tokensChanged();
    void otpSentChanged();
    void otpCooldownChanged();
    void otpCodeLengthChanged();
    void rateLimitedChanged();
    void signedIn();
    void signedOut();
    void forceDisconnected(const QString &reason);
    void otpRequested(const QString &email);
    void googleOAuthStarted(const QString &authorizationUrl);
    void googleAvailableChanged();

private:
    void setLoading(bool v);
    void setError(const QString &msg);
    void applyAuthResponse(const QJsonObject &obj);
    void applyUserObject(const QJsonObject &user);
    void persistSession();
    void restoreSession();
    void clearSessionLocal();
    void pushTokenToBackend();
    void startRefreshTimer(qint64 expiresInSecs);
    void handleHttpError(int status, const QByteArray &body);
    void startGooglePoll();

    ConfigManager *m_config = nullptr;
    BackendClient *m_backend = nullptr;
    QNetworkAccessManager m_nam;
    QTimer m_refreshTimer;
    QWebSocket *m_balanceSocket = nullptr;
    QTimer m_otpCooldownTimer;
    QTimer m_rateLimitTimer;
    QTimer m_googlePollTimer;
    QMetaObject::Connection m_googlePollConnection;

    bool m_authenticated = false;
    bool m_googleAvailable = false;
    bool m_refreshInFlight = false;
    bool m_loading = false;
    bool m_otpSent = false;
    int m_otpCooldownSecs = 0;
    int m_otpCodeLength = 8;
    bool m_rateLimited = false;
    int m_rateLimitSecs = 0;
    QString m_error;
    QString m_userId;
    QString m_email;
    QString m_pendingEmail;
    QString m_displayName;
    QString m_avatarUrl;
    QString m_accessToken;
    QString m_refreshToken;
    double m_creditBalance = 0;
    double m_bonusBalance = 0;
    QString m_tier = QStringLiteral("free");
    QString m_googleOAuthState;
};
