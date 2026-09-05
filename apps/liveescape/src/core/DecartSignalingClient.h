#pragma once

#include <QObject>
#include <QWebSocket>
#include <QJsonObject>
#include <QJsonDocument>
#include <QTimer>
#include <QVariantMap>

/**
 * Qt client for YOUR backend's Decart WS signaling proxy
 *   ws(s)://host/v1/realtime?product=liveescape&frontend_id=liveescape&model=
 *   Authorization: Bearer <jwt>
 *
 * Forwards offer/answer/ICE/prompt/set_image JSON.
 * Does NOT carry media — WebRTC is peer-to-peer with Decart.
 */
class DecartSignalingClient : public QObject
{
    Q_OBJECT
    Q_PROPERTY(bool connected READ connected NOTIFY connectionChanged)
    Q_PROPERTY(QString lastError READ lastError NOTIFY lastErrorChanged)
    Q_PROPERTY(QString sessionId READ sessionId NOTIFY sessionIdChanged)
    Q_PROPERTY(bool generating READ generating NOTIFY generatingChanged)

public:
    explicit DecartSignalingClient(QObject *parent = nullptr);

    bool connected() const { return m_connected; }
    QString lastError() const { return m_lastError; }
    QString sessionId() const { return m_sessionId; }
    bool generating() const { return m_generating; }

    Q_INVOKABLE void connectToProxy(const QString &wsBaseUrl,
                                    const QString &token,
                                    const QString &model = QStringLiteral("lucy-2.5"));
    Q_INVOKABLE void disconnectFromProxy();
    Q_INVOKABLE void sendOffer(const QString &sdp);
    Q_INVOKABLE void sendIceCandidate(const QVariantMap &candidate);
    Q_INVOKABLE void sendIceComplete();
    Q_INVOKABLE void sendPrompt(const QString &prompt, bool enhance = true);
    Q_INVOKABLE void sendReferenceImageBase64(const QString &base64PngOrJpeg,
                                              const QString &prompt = {},
                                              bool enhance = true);
    Q_INVOKABLE void sendRawJson(const QString &json);

signals:
    void connectionChanged();
    void lastErrorChanged();
    void sessionIdChanged();
    void generatingChanged();
    void answerReceived(const QString &sdp);
    void remoteIceCandidate(const QVariantMap &candidate);
    void promptAck(bool success, const QString &error);
    void imageAck(bool success, const QString &error);
    void generationStarted();
    void generationTick(double seconds);
    void generationEnded(double seconds, const QString &reason);
    void signalingError(const QString &message);
    /// Raw message for WebEngine bridge
    void messageReceived(const QString &json);

private slots:
    void onConnected();
    void onDisconnected();
    void onTextMessage(const QString &message);
    void onError(QAbstractSocket::SocketError error);

private:
    void sendJson(const QJsonObject &obj);
    void setErr(const QString &e);

    QWebSocket m_ws;
    bool m_connected = false;
    bool m_generating = false;
    QString m_lastError;
    QString m_sessionId;
    QString m_token;
};
