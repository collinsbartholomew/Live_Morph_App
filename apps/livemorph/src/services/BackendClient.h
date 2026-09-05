#pragma once

#include <QObject>
#include <QString>
#include <QStringList>
#include <QVariantMap>
#include <QVariantList>
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
 * Mirrors every /api/v1/* route used by the original Electron preload.
 */
class BackendClient : public QObject
{
    Q_OBJECT
    Q_PROPERTY(QString baseUrl READ baseUrl WRITE setBaseUrl NOTIFY baseUrlChanged)
    Q_PROPERTY(bool reachable READ reachable NOTIFY reachableChanged)
    Q_PROPERTY(QString appVersion READ appVersion NOTIFY appVersionChanged)
    Q_PROPERTY(QStringList paymentProviders READ paymentProviders NOTIFY paymentProvidersChanged)
    Q_PROPERTY(QVariantList paymentPackages READ paymentPackages NOTIFY paymentPackagesChanged)
    Q_PROPERTY(QString deviceId READ deviceId CONSTANT)

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
    QString appVersion() const { return m_appVersion; }
    QStringList paymentProviders() const { return m_paymentProviders; }
    QVariantList paymentPackages() const { return m_paymentPackages; }
    QString deviceId() const;
    QString accessToken() const { return m_accessToken; }
    void setAccessToken(const QString &token);

public slots:
    // Stream
    void startStream();
    void stopStream();
    void getStreamUrl();
    void getStreamStatus();
    void pauseStream();
    void resumeStream();

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
    void fetchCreditsBalance();

signals:
    void baseUrlChanged();
    void bootstrapLoaded(const QVariantMap &payload);
    void bootstrapChanged();
    void reachableChanged();
    void appVersionChanged();
    void paymentProvidersChanged();
    void paymentPackagesChanged();

    void streamStarted(const QVariantMap &result);
    void streamStopped(const QVariantMap &result);
    void streamUrlReceived(const QString &url);
    void streamStatusReceived(const QVariantMap &status);

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
    void creditsBalanceReceived(const QVariantMap &balance);

private:
    QNetworkRequest makeRequest(const QString &path) const;
    void get(const QString &path, const std::function<void(const QJsonObject &)> &ok);
    void post(const QString &path, const QJsonObject &body,
              const std::function<void(const QJsonObject &)> &ok);

    QNetworkAccessManager m_nam;
    QTimer m_pingTimer;
    QString m_balanceWsUrl;
    QString m_realtimeWsUrl;
    QString m_configRevision;
    QVariantMap m_lastBootstrap;
    QString m_baseUrl = QStringLiteral("http://127.0.0.1:3874");
    bool m_reachable = false;
    QString m_appVersion = QStringLiteral("1.8.0");
    QStringList m_paymentProviders{QStringLiteral("paystack")};
    QVariantList m_paymentPackages;
    QString m_accessToken;
};
