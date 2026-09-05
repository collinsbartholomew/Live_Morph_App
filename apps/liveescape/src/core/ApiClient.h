#pragma once

#include <QObject>
#include <QString>
#include <QNetworkAccessManager>
#include <QNetworkCookieJar>
#include <QJsonObject>
#include <QVariantMap>
#include <QVariantList>
#include <functional>

class QWebSocket;

/**
 * HTTP client for the unified platform API (LiveMorph Actix host + Live Escape routes).
 * Base URL from LIVEESCAPE_API_URL env var or set via setBaseUrl().
 * Identity: X-Frontend-Id: liveescape
 * Auth: Bearer JWT (access_token) + optional license headers (x-access-key, x-user-id, x-device-id).
 */
class ApiClient : public QObject
{
    Q_OBJECT
    Q_PROPERTY(bool reachable READ reachable NOTIFY reachableChanged)
    Q_PROPERTY(QString baseUrl READ baseUrl WRITE setBaseUrl NOTIFY baseUrlChanged)
    Q_PROPERTY(QString wsBaseUrl READ wsBaseUrl NOTIFY baseUrlChanged)
    Q_PROPERTY(QString realtimeWsUrl READ realtimeWsUrl NOTIFY baseUrlChanged)
    Q_PROPERTY(QString configRevision READ configRevision NOTIFY bootstrapChanged)
    Q_PROPERTY(QVariantMap lastBootstrap READ lastBootstrap NOTIFY bootstrapChanged)
    Q_PROPERTY(bool busy READ busy NOTIFY busyChanged)

public:
    explicit ApiClient(QObject *parent = nullptr);

    QString baseUrl() const { return m_baseUrl; }
    QString wsBaseUrl() const;
    QString realtimeWsUrl() const { return m_realtimeWsUrl; }
    QString configRevision() const { return m_configRevision; }
    QVariantMap lastBootstrap() const { return m_lastBootstrap; }
    Q_INVOKABLE void fetchBootstrap();
    void setBaseUrl(const QString &url);
    void setUserEmail(const QString &email);
    bool busy() const { return m_busyCount > 0; }

    void setLicenseCredentials(const QString &accessKey, const QString &userId, const QString &deviceId);
    void setDeviceId(const QString &deviceId);
    void clearLicenseCredentials();
    void setBearerToken(const QString &accessToken);
    void clearBearerToken();
    bool reachable() const { return m_reachable; }
    QString bearerToken() const { return m_bearerToken; }
    void setRefreshToken(const QString &refreshToken);
    QString refreshToken() const { return m_refreshToken; }
    Q_INVOKABLE void refreshSession();
    Q_INVOKABLE void connectBalanceSocket();
    Q_INVOKABLE void disconnectBalanceSocket();

    // ── Auth ──────────────────────────────────────────────
    Q_INVOKABLE void login(const QString &email, const QString &password, const QString &deviceId);
    Q_INVOKABLE void registerUser(const QString &name, const QString &email, const QString &password,
                                  const QString &deviceId, bool acceptedTerms,
                                  const QString &phone = {}, const QString &referralCode = {});
    Q_INVOKABLE void logout();
    Q_INVOKABLE void logoutAll();
    Q_INVOKABLE void requestPasswordReset(const QString &email);
    Q_INVOKABLE void completePasswordReset(const QString &token, const QString &newPassword, const QString &email);

    // ── License ───────────────────────────────────────────
    Q_INVOKABLE void validateKey(const QString &accessKey, const QString &deviceId, const QString &userId);
    Q_INVOKABLE void lookupKey(const QString &accessKey);

    // ── Credits ───────────────────────────────────────────
    Q_INVOKABLE void fetchCredits();
    Q_INVOKABLE void burnCredits(double credits);
    Q_INVOKABLE void addCredits(double amount);

    // ── Settings / platform ───────────────────────────────
    Q_INVOKABLE void ping();
    Q_INVOKABLE void resolveApiEndpoint();
    Q_INVOKABLE void fetchFeatureFlags();
    Q_INVOKABLE void fetchPlans();
    Q_INVOKABLE void fetchPlatformSettings();
    Q_INVOKABLE void fetchPaymentGateway();
    Q_INVOKABLE void fetchDashboardMaintenance();
    Q_INVOKABLE void fetchDashboardNotification();
    Q_INVOKABLE void fetchCreditBurnRate();
    Q_INVOKABLE void fetchStreamingAvailability();
    Q_INVOKABLE void checkVersion(const QString &version, const QString &platform);

    // ── Streaming ─────────────────────────────────────────
    Q_INVOKABLE void fetchEngineKey();
    Q_INVOKABLE void rotateEngineKey();
    Q_INVOKABLE void startStreamingSession(const QVariantMap &body);
    Q_INVOKABLE void endStreamingSession(const QVariantMap &body);
    Q_INVOKABLE void fetchBackgroundPresets();
    Q_INVOKABLE void selectBackground(const QString &presetId, const QString &prompt = {});

    // ── Payments ──────────────────────────────────────────
    Q_INVOKABLE void starterPackPay(const QString &email, const QString &method, const QVariantMap &extra = {});
    Q_INVOKABLE void activationPay(const QString &planId, const QString &method, const QVariantMap &extra = {});
    Q_INVOKABLE void devActivate(const QString &planId);
    Q_INVOKABLE void upgradePay(const QString &planId, const QString &method, const QVariantMap &extra = {});
    Q_INVOKABLE void purchaseCredits(const QString &planId, const QString &method, const QVariantMap &extra = {});
    Q_INVOKABLE void starterPackStatus(const QString &email);
    Q_INVOKABLE void fetchOrderStatus(const QString &reference);
    Q_INVOKABLE void verifyOrder(const QString &orderId, const QString &reference = {});
    Q_INVOKABLE void submitCryptoProof(const QString &email, const QString &txId,
                                      const QString &planId = {}, const QString &proofPath = {});

    // ── Referral / creator / support ──────────────────────
    Q_INVOKABLE void getReferralCode(const QString &email);
    Q_INVOKABLE void attachReferral(const QString &email, const QString &deviceId, const QString &code);
    Q_INVOKABLE void getPayoutDetails();
    Q_INVOKABLE void savePayoutDetails(const QVariantMap &details);
    Q_INVOKABLE void createSupportTicket(const QString &subject, const QString &message);

    Q_INVOKABLE void adminSaveEngineKey(const QString &key, const QString &adminSecret);
    Q_INVOKABLE void adminSetCredits(double total, const QString &adminSecret, const QString &userEmail);

signals:
    void baseUrlChanged();
    void busyChanged();
    void reachableChanged();
    void bootstrapChanged();
    void networkError(const QString &message);
    void passwordResetSucceeded();
    void passwordResetRequested();
    void adminActionSucceeded(const QString &message);
    void adminActionFailed(const QString &message);

    void loginSucceeded(const QVariantMap &payload);
    void refreshSucceeded(const QVariantMap &payload);
    void refreshFailed(const QString &message);
    void balanceUpdated(const QVariantMap &payload);
    void balanceForceDisconnect(const QString &reason);
    void loginFailed(const QString &message);
    void registerSucceeded(const QVariantMap &payload);
    void registerFailed(const QString &message);
    void logoutSucceeded();
    void keyValidated(const QVariantMap &payload);
    void keyValidationFailed(const QString &message);
    void creditsLoaded(const QVariantMap &credits);
    void creditsBurned(const QVariantMap &credits);
    void creditsFailed(const QString &message);

    void apiEndpointResolved(const QString &url);
    void bootstrapLoaded(const QVariantMap &payload);
    void featureFlagsLoaded(const QVariantMap &flags);
    void plansLoaded(const QVariantList &plans);
    void platformSettingsLoaded(const QVariantMap &settings);
    void paymentGatewayLoaded(const QVariantMap &gateway);
    void maintenanceResult(bool blocked, const QString &message);
    void dashboardNotification(const QVariantMap &notification);
    void burnRateLoaded(double creditsPerSecond);
    void streamingAvailabilityLoaded(bool enabled);
    void versionCheckResult(bool forceUpdate, const QString &latest, const QString &downloadUrl);

    void engineKeyLoaded(const QVariantMap &keyInfo);
    void sessionStarted(const QVariantMap &session);
    void sessionEnded(const QVariantMap &result);
    void sessionFailed(const QString &message);
    void backgroundPresetsLoaded(const QVariantList &presets);
    void backgroundSelected(const QVariantMap &result);

    void paymentInitiated(const QVariantMap &payload);
    void paymentFailed(const QString &message);
    void paymentStatusLoaded(const QVariantMap &status);

    void referralCodeLoaded(const QString &code);
    void referralEarnedLoaded(double earned);
    void payoutDetailsLoaded(const QVariantMap &details);
    void supportTicketCreated(const QVariantMap &ticket);

private:
    using OkFn = std::function<void(const QJsonObject &)>;
    using ErrFn = std::function<void(const QString &)>;
    using ListOkFn = std::function<void(const QJsonArray &)>;

    void beginRequest();
    void applyBootstrap(const QJsonObject &o);
    void endRequest();
    QNetworkRequest makeRequest(const QString &path, bool licenseAuth) const;
    void getJson(const QString &path, bool licenseAuth, const OkFn &onOk, const ErrFn &onErr);
    void postJson(const QString &path, const QJsonObject &body, bool licenseAuth,
                  const OkFn &onOk, const ErrFn &onErr);
    void handleReply(QNetworkReply *reply, const OkFn &onOk, const ErrFn &onErr);
    static QVariantMap toMap(const QJsonObject &o);
    static QString extractError(const QJsonObject &o, const QString &fallback);

    QNetworkAccessManager m_nam;
    QString m_baseUrl;
    QString m_wsUrlOverride;
    QString m_realtimeWsUrl;
    QString m_configRevision;
    QVariantMap m_lastBootstrap;
    QString m_userEmail;
    QString m_accessKey;
    QString m_userId;
    QString m_deviceId;
    QString m_bearerToken;
    QString m_refreshToken;
    class QWebSocket *m_balanceSocket = nullptr;
    int m_busyCount = 0;
    bool m_reachable = false;
    bool m_refreshInFlight = false;
    bool m_pendingRetry = false;
};
