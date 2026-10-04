#pragma once

#include <QObject>
#include <QString>
#include <QTimer>
#include <QVariantMap>
#include <functional>

#if defined(QT_WEBSOCKETS_LIB) || __has_include(<QWebSocket>)
#  include <QWebSocket>
#  define SS_HAS_WEBSOCKETS 1
#else
#  define SS_HAS_WEBSOCKETS 0
class QWebSocket;
#endif

/**
 * WebSocket client for platform balance / control channel.
 * Unified host: ws://host:port/ws?token=<jwt>&product=liveescape&frontend_id=liveescape
 * Legacy: user_id + access_key (ignored by unified /ws if token present)
 * Messages: balance_update, force_disconnect, storage_reset, force_logout, dashboard_notification
 */
class WebSocketClient : public QObject
{
    Q_OBJECT
    Q_PROPERTY(bool connected READ connected NOTIFY connectedChanged)

public:
    explicit WebSocketClient(QObject *parent = nullptr);
    ~WebSocketClient() override;

    bool connected() const { return m_connected; }

    Q_INVOKABLE void connectToServer(const QString &wsBaseUrl, const QString &userId,
                                     const QString &accessKey,
                                     const QString &bearerToken = {});
    Q_INVOKABLE void disconnectFromServer();

    /// Supplies the CURRENT access token on every (re)connect attempt. The
    /// JWT access TTL is 900s — a reconnect that reuses the token captured at
    /// the original connect fails the handshake with 401 for the rest of the
    /// session. The provider lets ApiClient hand over its freshest token.
    void setTokenProvider(const std::function<QString()> &provider);

signals:
    void connectedChanged();
    void balanceUpdate(const QVariantMap &credits);
    void forceDisconnect(const QString &reason);
    void storageReset();
    void forceLogout();
    void dashboardNotification(const QVariantMap &notification);
    /// Server bumped CONFIG_REVISION — client should re-fetch /bootstrap.
    void configUpdate(const QString &revision);
    void connectionError(const QString &message);

private:
    void onConnected();
    void onDisconnected();
    void onTextMessage(const QString &message);
    void scheduleReconnect();
    void sendPing();

#if SS_HAS_WEBSOCKETS
    QWebSocket *m_socket = nullptr;
#endif
    QTimer m_reconnectTimer;
    QTimer m_pingTimer;
    QString m_url;
    QString m_bearerToken;
    std::function<QString()> m_tokenProvider;
    bool m_connected = false;
    bool m_intentionalClose = false;
    bool m_pongReceived = true;
    bool m_appActive = true;
    int m_reconnectAttempt = 0;
    static constexpr int kReconnectMs = 2500;
    static constexpr int kReconnectMaxMs = 30000;
    static constexpr int kPingIntervalMs = 30000;
    static constexpr int kPongTimeoutMs = 10000;
    static constexpr int kMaxReconnectAttempts = 12;
};
