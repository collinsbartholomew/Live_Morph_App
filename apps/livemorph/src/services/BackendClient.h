#pragma once

#include <QObject>
#include <QString>
#include <QStringList>
#include <QVariantMap>
#include <QVariantList>
#include "../core/DeviceIdentity.h"
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QUrl>
#include <QJsonObject>
#include <QNetworkRequest>
#include <functional>
#include <QTimer>

/**
 * HTTP client for the LiveMorph Rust backend.
 * Base URL is set at startup from LIVEMORPH_API_URL env var or Settings.
 * Mirrors every /api/v1 route used by the original Electron preload.
 */
class BackendClient : public QObject
{
    Q_OBJECT
    // READ-only on purpose: QML must never repoint the HTTP client (the JWT
    // rides in the Authorization header). C++ (main.cpp) drives setBaseUrl()
    // from the validated Config.apiBaseUrl.
    Q_PROPERTY(QString baseUrl READ baseUrl NOTIFY baseUrlChanged)
    Q_PROPERTY(bool reachable READ reachable NOTIFY reachableChanged)
    // True once the first ping completed (success OR failure) — gates the
    // offline banner so it doesn't flash on every cold start.
    Q_PROPERTY(bool reachableKnown READ reachableKnown NOTIFY reachableChanged)
    Q_PROPERTY(QString appVersion READ appVersion NOTIFY appVersionChanged)
    Q_PROPERTY(QStringList paymentProviders READ paymentProviders NOTIFY paymentProvidersChanged)
    Q_PROPERTY(QVariantList paymentPackages READ paymentPackages NOTIFY paymentPackagesChanged)
    Q_PROPERTY(QString deviceId READ deviceId CONSTANT)
    Q_PROPERTY(bool streamingUnavailable READ streamingUnavailable NOTIFY streamingAvailabilityChanged)
    Q_PROPERTY(bool maintenance READ maintenance NOTIFY maintenanceChanged)
    Q_PROPERTY(QVariantList backgroundPresets READ backgroundPresets NOTIFY backgroundPresetsChanged)
    Q_PROPERTY(QVariantList downloadsModel READ downloadsModel NOTIFY downloadsChanged)
    Q_PROPERTY(bool downloadsLoading READ downloadsLoading NOTIFY downloadsLoadingChanged)
    Q_PROPERTY(bool freeCreditsEnabled READ freeCreditsEnabled NOTIFY featureFlagsChanged)
    Q_PROPERTY(double freeCreditsAmount READ freeCreditsAmount NOTIFY featureFlagsChanged)
    Q_PROPERTY(double creditsPerSecond READ creditsPerSecond NOTIFY bootstrapChanged)
    Q_PROPERTY(double minCreditsToStart READ minCreditsToStart NOTIFY bootstrapChanged)
    Q_PROPERTY(double hdMultiplier READ hdMultiplier NOTIFY bootstrapChanged)
    Q_PROPERTY(int updateProgress READ updateProgress NOTIFY updateProgressChanged)
    Q_PROPERTY(bool updateDownloading READ updateDownloading NOTIFY updateProgressChanged)
    Q_PROPERTY(QString updateDownloadedPath READ updateDownloadedPath NOTIFY updateProgressChanged)
    // ICE servers from GET /webrtc/ice-servers — ops can rotate TURN creds
    // server-side without a client release. NOTE: turnUser/turnCredential are
    // deliberately NOT Q_PROPERTY — a server-issued TURN secret must not be
    // readable from QML (injected/compromised QML could exfiltrate it). C++
    // getters below remain for SessionManager.
    Q_PROPERTY(QStringList iceServerUrls READ iceServerUrls NOTIFY iceServersChanged)

public:
    explicit BackendClient(QObject *parent = nullptr);

    QString baseUrl() const { return m_baseUrl; }
    void setBaseUrl(const QString &url);
    Q_INVOKABLE void fetchBootstrap();
    QString balanceWsUrl() const { return m_balanceWsUrl; }
    QString realtimeWsUrl() const { return m_realtimeWsUrl; }
    QString configRevision() const { return m_configRevision; }
    QVariantMap lastBootstrap() const { return m_lastBootstrap; }
    bool reachable() const { return m_reachable; }
    bool reachableKnown() const { return m_reachableKnown; }
    QString appVersion() const { return m_appVersion; }
    QStringList paymentProviders() const { return m_paymentProviders; }
    Q_INVOKABLE void fetchIceServers();
    QStringList iceServerUrls() const { return m_iceServerUrls; }
    QString turnUser() const { return m_turnUser; }
    QString turnCredential() const { return m_turnCredential; }
    QVariantList paymentPackages() const { return m_paymentPackages; }
    QString deviceId() const;
    QString accessToken() const { return m_accessToken; }
    void setAccessToken(const QString &token);
    /// Bumped on every setAccessToken() call with a non-empty token — lets
    /// 401-retries detect a completed refresh even when the JWT is identical.
    quint64 tokenEpoch() const { return m_tokenEpoch; }
    bool streamingUnavailable() const { return m_streamingUnavailable; }
    bool maintenance() const { return m_maintenance; }
    QVariantList backgroundPresets() const { return m_backgroundPresets; }
    QVariantList downloadsModel() const { return m_downloadsModel; }
    bool downloadsLoading() const { return m_downloadsLoading; }
    bool freeCreditsEnabled() const { return m_freeCreditsEnabled; }
    double freeCreditsAmount() const { return m_freeCreditsAmount; }
    double creditsPerSecond() const { return m_creditsPerSecond; }
    double minCreditsToStart() const { return m_minCreditsToStart; }
    double hdMultiplier() const { return m_hdMultiplier; }
    int updateProgress() const { return m_updateProgress; }
    bool updateDownloading() const { return m_updateDownloading; }
    QString updateDownloadedPath() const { return m_updateDownloadedPath; }

public slots:
    // Virtual camera
    void startVirtualCamera(const QString &streamId = {});
    void stopVirtualCamera();
    void getVirtualCameraStatus();

    // Recording
    void startRecording(const QVariantMap &payload);
    void stopRecording(const QString &reason = QStringLiteral("user"));
    void finalizeRecording();
    void getRecordingsDirectory();

    // Auth / app
    void clearAuthSession();
    void checkUpdates();
    void installUpdate();
    void downloadUpdate();
    void cancelUpdateDownload();
    void fetchAppVersion();
    void fetchCatalog();
    void openExternal(const QString &url);
    void copyToClipboard(const QString &text);
    void revealRecording(const QString &path);

    // Health
    void ping();

    // Payments
    void fetchPaymentPackages();
    void createPaymentOrder(const QString &packageKey, const QString &provider = QStringLiteral("paystack"));
    void verifyPaymentOrder(const QString &orderId, const QString &reference = {});
    void fetchOrderStatus(const QString &orderId);
    void cancelPaymentOrder(const QString &orderId);
    void fetchCreditsBalance();

    // Streaming / session
    void selectBackground(const QString &presetId, const QString &prompt = {});
    void fetchBackgroundPresets();
    void fetchStreamingAvailability();
    void fetchMaintenance();
    void fetchFeatureFlags();

    // User characters
    void fetchUserCharacters();
    void createUserCharacter(const QString &name, const QString &prompt, const QString &imageUrl = {});
    void updateUserCharacter(const QString &id, const QString &name, const QString &prompt, bool isFavorite = false);
    void deleteUserCharacter(const QString &id);

    // Downloads
    void fetchDownloads();

    // Credit keys
    void redeemCreditKey(const QString &key);

signals:
    void baseUrlChanged();
    /// A request hit a 401 — the AuthManager should refresh the access token.
    void authenticationExpired();
    void bootstrapLoaded(const QVariantMap &payload);
    void bootstrapChanged();
    void reachableChanged();
    void appVersionChanged();
    void paymentProvidersChanged();
    void paymentPackagesChanged();
    void iceServersChanged();

    void virtualCameraStarted(const QVariantMap &result);
    void virtualCameraStopped(const QVariantMap &result);
    void virtualCameraStatusReceived(const QVariantMap &status);

    void recordingStarted(const QVariantMap &result);
    void recordingStopped(const QVariantMap &result);
    void recordingFinalized(const QVariantMap &result);
    void recordingsDirectoryReceived(const QString &path);

    void catalogReceived(const QVariantList &entries);
    void updateCheckResult(const QVariantMap &result);
    void requestFailed(const QString &endpoint, const QString &error);
    void paymentPackagesReceived(const QVariantList &packages);
    void paymentOrderCreated(const QVariantMap &order);
    void paymentOrderVerified(const QVariantMap &result);
    void paymentOrderStatusReceived(const QVariantMap &status);
    void paymentOrderCancelled(const QVariantMap &result);
    void creditsBalanceReceived(const QVariantMap &balance);
    void streamingAvailabilityChanged();
    void maintenanceChanged();
    void userCharactersReceived(const QVariantList &characters);
    void userCharacterCreated(const QVariantMap &character);
    void userCharacterUpdated(const QVariantMap &character);
    void userCharacterDeleted(const QVariantMap &result);
    void backgroundPresetsChanged();
    void downloadsChanged();
    void downloadsLoadingChanged();
    void creditKeyRedeemed(const QVariantMap &result);
    void featureFlagsChanged();
    void updateProgressChanged();
    void updateDownloaded(const QString &path);
    void updateDownloadFailed(const QString &error);

public:
    /// Map a backend error body {"error": code, "message": english} + HTTP
    /// status to a local translatable string. The server message is English
    /// and NOT in the translation catalog, so the stable `error` code is mapped
    /// to tr() strings; the raw message is only a fallback for unknown codes.
    static QString translatedServerError(int status, const QByteArray &body);

private:
    QNetworkRequest makeRequest(const QString &path) const;
    /// Strict parse: false when the body is non-empty but not a JSON object
    /// (garbage must not be treated as an empty success payload).
    static bool parseJsonObject(const QByteArray &raw, QJsonObject &out);
    /// Update/download URLs may only come from our own hosts (API host or the
    /// product site) — never an arbitrary redirect target.
    bool isTrustedDownloadHost(const QString &host) const;
    // Central reachable setter — also marks the first ping as completed so
    // the offline banner can distinguish "not yet checked" from "offline".
    void setReachable(bool v);
    void get(const QString &path, const std::function<void(const QJsonObject &)> &ok);
    void post(const QString &path, const QJsonObject &body,
              const std::function<void(const QJsonObject &)> &ok);
    void put(const QString &path, const QJsonObject &body,
             const std::function<void(const QJsonObject &)> &ok);
    void del(const QString &path, const std::function<void(const QJsonObject &)> &ok);
    // 401 handling: emit authenticationExpired(), wait for AuthManager to
    // rotate the token (it calls setAccessToken), then re-issue ONCE.
    void getAuth(const QString &path, const std::function<void(const QJsonObject &)> &ok, bool retriedAuth);
    void postAuth(const QString &path, const QJsonObject &body,
                  const std::function<void(const QJsonObject &)> &ok, bool retriedAuth);
    void putAuth(const QString &path, const QJsonObject &body,
                 const std::function<void(const QJsonObject &)> &ok, bool retriedAuth);
    void delAuth(const QString &path, const std::function<void(const QJsonObject &)> &ok, bool retriedAuth);
    void retryOnTokenRotation(const std::function<void()> &reissue,
                              const std::function<void()> &giveUp);

    // Client-side rate limiting (Electron yi limiter parity): token-bucket per
    // action class. Payments 5/300s; everything else 30/60s default.
    struct RateBucket {
        int limit = 30;
        int windowMs = 60000;
        QList<qint64> stamps;
        bool tryAcquire();
    };
    RateBucket m_payBucket{5, 300000, {}};
    RateBucket m_defaultBucket{30, 60000, {}};
    // Order-status pollers (5s cadence during checkout) get their own generous
    // bucket so they never exhaust the default bucket shared with other GETs.
    RateBucket m_pollBucket{60, 60000, {}};
    RateBucket &bucketFor(const QString &path);

    QNetworkAccessManager m_nam;
    QTimer m_pingTimer;
    QString m_balanceWsUrl;
    QString m_realtimeWsUrl;
    QString m_configRevision;
    QVariantMap m_lastBootstrap;
    QString m_baseUrl = QStringLiteral("http://127.0.0.1:3874");
    bool m_reachable = false;
    bool m_reachableKnown = false;
    QString m_appVersion = DeviceIdentity::appVersion();
    QStringList m_paymentProviders{QStringLiteral("paystack")};
    QStringList m_iceServerUrls;
    QString m_turnUser;
    QString m_turnCredential;
    QVariantList m_paymentPackages;
    QString m_accessToken;
    quint64 m_tokenEpoch = 0;
    bool m_streamingUnavailable = false;
    bool m_maintenance = false;
    QVariantList m_backgroundPresets;
    QVariantList m_downloadsModel;
    bool m_downloadsLoading = false;
    quint64 m_downloadsReqGen = 0; // generation counter so a stale 30s fallback can't clear a newer request
    bool m_freeCreditsEnabled = false;
    double m_freeCreditsAmount = 0.0;
    double m_creditsPerSecond = 0.0;
    double m_minCreditsToStart = 0.0;
    double m_hdMultiplier = 1.0;
    QNetworkReply *m_downloadReply = nullptr;
    int m_updateProgress = 0;
    bool m_updateDownloading = false;
    bool m_updateCheckInFlight = false; // manifest request in flight (double-click guard)
    QString m_updateDownloadedPath;
};
