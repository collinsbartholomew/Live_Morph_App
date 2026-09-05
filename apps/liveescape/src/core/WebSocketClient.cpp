#include <QNetworkRequest>
#include "WebSocketClient.h"

#include <QGuiApplication>
#include <QJsonDocument>
#include <QJsonObject>
#include <QUrl>
#include <QUrlQuery>

WebSocketClient::WebSocketClient(QObject *parent)
    : QObject(parent)
{
    m_reconnectTimer.setSingleShot(true);
    connect(&m_reconnectTimer, &QTimer::timeout, this, [this]() {
        if (m_url.isEmpty())
            return;
#if SS_HAS_WEBSOCKETS
        if (m_socket) {
            if (m_socket->state() != QAbstractSocket::UnconnectedState)
                m_socket->close();
            QNetworkRequest req{QUrl(m_url)};
            if (!m_bearerToken.isEmpty())
                req.setRawHeader("Authorization", QByteArray("Bearer ") + m_bearerToken.toUtf8());
            m_socket->open(req);
        }
#endif
    });

    // Ping/pong keepalive: detect dead connections
    m_pingTimer.setInterval(kPingIntervalMs);
    connect(&m_pingTimer, &QTimer::timeout, this, &WebSocketClient::sendPing);

    // Pause keepalive + reconnect while the app is backgrounded (no idle traffic)
    connect(qApp, &QGuiApplication::applicationStateChanged, this,
            [this](Qt::ApplicationState state) {
                m_appActive = (state == Qt::ApplicationActive);
                if (m_appActive) {
                    if (m_connected)
                        m_pingTimer.start();
                    else if (!m_intentionalClose && !m_url.isEmpty())
                        scheduleReconnect();
                } else {
                    m_pingTimer.stop();
                    m_reconnectTimer.stop();
                }
            });

#if SS_HAS_WEBSOCKETS
    m_socket = new QWebSocket(QString(), QWebSocketProtocol::VersionLatest, this);
    connect(m_socket, &QWebSocket::connected, this, &WebSocketClient::onConnected);
    connect(m_socket, &QWebSocket::disconnected, this, &WebSocketClient::onDisconnected);
    connect(m_socket, &QWebSocket::textMessageReceived, this, &WebSocketClient::onTextMessage);
#if QT_VERSION >= QT_VERSION_CHECK(6, 5, 0)
    connect(m_socket, &QWebSocket::errorOccurred, this, [this](QAbstractSocket::SocketError) {
        emit connectionError(m_socket ? m_socket->errorString() : QStringLiteral("WS error"));
    });
#endif
#endif
}

WebSocketClient::~WebSocketClient()
{
    m_intentionalClose = true;
    m_reconnectTimer.stop();
#if SS_HAS_WEBSOCKETS
    if (m_socket)
        m_socket->close();
#endif
}

void WebSocketClient::connectToServer(const QString &wsBaseUrl, const QString &userId,
                                      const QString &accessKey, const QString &bearerToken)
{
    // Unified backend prefers JWT; legacy key pair still sent for compatibility
    if (bearerToken.isEmpty() && (userId.isEmpty() || accessKey.isEmpty()))
        return;

    QUrl url(wsBaseUrl + QStringLiteral("/ws"));
    QUrlQuery q;
    q.addQueryItem(QStringLiteral("product"), QStringLiteral("liveescape"));
    q.addQueryItem(QStringLiteral("frontend_id"), QStringLiteral("liveescape"));
    // Legacy key pair only if no bearer (avoid putting JWT in query)
    if (bearerToken.isEmpty()) {
        if (!userId.isEmpty())
            q.addQueryItem(QStringLiteral("user_id"), userId);
        if (!accessKey.isEmpty())
            q.addQueryItem(QStringLiteral("access_key"), accessKey);
    }
    url.setQuery(q);
    m_url = url.toString(); // URL without JWT
    m_bearerToken = bearerToken;
    m_intentionalClose = false;
    m_reconnectAttempt = 0;

#if SS_HAS_WEBSOCKETS
    if (m_socket->state() == QAbstractSocket::ConnectedState)
        m_socket->close();
    QNetworkRequest req{url};
    if (!bearerToken.isEmpty())
        req.setRawHeader("Authorization", QByteArray("Bearer ") + bearerToken.toUtf8());
    m_socket->open(req);
#else
    emit connectionError(QStringLiteral("Qt WebSockets module not available at build time"));
#endif
}

void WebSocketClient::disconnectFromServer()
{
    m_intentionalClose = true;
    m_reconnectTimer.stop();
    m_pingTimer.stop();
#if SS_HAS_WEBSOCKETS
    if (m_socket)
        m_socket->close();
#endif
    if (m_connected) {
        m_connected = false;
        emit connectedChanged();
    }
}

void WebSocketClient::onConnected()
{
    m_connected = true;
    m_reconnectAttempt = 0;
    m_pongReceived = true;
    m_pingTimer.start();
    emit connectedChanged();
}

void WebSocketClient::onDisconnected()
{
    m_pingTimer.stop();
    if (m_connected) {
        m_connected = false;
        emit connectedChanged();
    }
    if (!m_intentionalClose)
        scheduleReconnect();
}

void WebSocketClient::scheduleReconnect()
{
    if (!m_appActive)
        return;
    if (m_reconnectTimer.isActive())
        return;
    // Cap retries — give up instead of retrying forever in the background
    if (m_reconnectAttempt >= kMaxReconnectAttempts) {
        emit connectionError(QStringLiteral("Realtime connection lost — reconnect when back online"));
        return;
    }
    const int delay = qMin(kReconnectMaxMs, kReconnectMs * (1 << qMin(m_reconnectAttempt, 4)));
    ++m_reconnectAttempt;
    m_reconnectTimer.start(delay);
}

void WebSocketClient::onTextMessage(const QString &message)
{
    const QJsonDocument doc = QJsonDocument::fromJson(message.toUtf8());
    if (!doc.isObject())
        return;
    const QJsonObject obj = doc.object();
    const QString type = obj.value(QStringLiteral("type")).toString();
    const QJsonObject data = obj.value(QStringLiteral("data")).toObject();

    if (type == QLatin1String("pong")) {
        m_pongReceived = true;
        return;
    } else if (type == QLatin1String("balance_update")) {
        emit balanceUpdate(data.isEmpty() ? obj.toVariantMap() : data.toVariantMap());
    } else if (type == QLatin1String("force_disconnect")) {
        emit forceDisconnect(data.value(QStringLiteral("reason")).toString(
            obj.value(QStringLiteral("reason")).toString()));
    } else if (type == QLatin1String("storage_reset")) {
        emit storageReset();
    } else if (type == QLatin1String("force_logout")) {
        emit forceLogout();
    } else if (type == QLatin1String("dashboard_notification")) {
        emit dashboardNotification(data.isEmpty() ? obj.toVariantMap() : data.toVariantMap());
    }
}

void WebSocketClient::sendPing()
{
#if SS_HAS_WEBSOCKETS
    if (!m_connected || !m_socket)
        return;
    // If previous ping was not answered, the connection is dead
    if (!m_pongReceived) {
        m_pingTimer.stop();
        m_socket->close();
        return;
    }
    m_pongReceived = false;
    m_socket->sendTextMessage(QStringLiteral("{\"type\":\"ping\"}"));
#endif
}
