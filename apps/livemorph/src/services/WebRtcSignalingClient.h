#pragma once

#include <QObject>
#include <QString>
#include <QUrl>
#include <QWebSocket>
#include <QTimer>
#include <QJsonObject>
#include <QJsonDocument>
#include <QAbstractSocket>

/**
 * WebRtcSignalingClient — Decart signaling over our Rust proxy.
 *
 * Connects to: ws://host:port/api/v1/realtime?token=<jwt>&model=<model>
 * Forwards offer / answer / ice-candidate / prompt / set_image JSON.
 * Does NOT carry video — that is peer-to-peer WebRTC to Decart.
 *
 * Pair with a native WebRTC stack (libwebrtc / libdatachannel) that:
 *  - creates RTCPeerConnection
 *  - adds local camera track
 *  - emits SDP offer → call sendOffer()
 *  - on answerReceived → setRemoteDescription
 *  - on iceCandidateReceived → addIceCandidate
 *  - on remote track → bind to Stage VideoOutput / QVideoSink
 */
class WebRtcSignalingClient : public QObject
{
    Q_OBJECT
    Q_PROPERTY(bool connected READ isConnected NOTIFY connectedChanged)
    Q_PROPERTY(QString sessionId READ sessionId NOTIFY sessionIdChanged)
    Q_PROPERTY(QString lastError READ lastError NOTIFY errorOccurred)
    Q_PROPERTY(bool generating READ isGenerating NOTIFY generatingChanged)
    Q_PROPERTY(double generationSeconds READ generationSeconds NOTIFY generationSecondsChanged)

public:
    explicit WebRtcSignalingClient(QObject *parent = nullptr);

    bool isConnected() const { return m_connected; }
    QString sessionId() const { return m_sessionId; }
    QString lastError() const { return m_lastError; }
    bool isGenerating() const { return m_generating; }
    double generationSeconds() const { return m_generationSeconds; }

public slots:
    /// token = JWT access token from AuthManager; model e.g. "lucy-2.1"
    void connectToProxy(const QString &wsBaseUrl, const QString &token, const QString &model);
    void disconnectFromProxy();
    void setAutoReconnect(bool enabled);

    void sendOffer(const QString &sdp);
    void sendIceCandidate(const QJsonObject &candidate); // null object = end-of-candidates
    void sendPrompt(const QString &prompt, bool enhancePrompt = true);
    void sendSetImage(const QString &base64Image, const QString &prompt = {}, bool enhancePrompt = true);
    void sendClearImage();

signals:
    void connectedChanged();
    void sessionIdChanged();
    void errorOccurred(const QString &message);
    void generatingChanged();
    void generationSecondsChanged();

    void answerReceived(const QString &sdp);
    void iceCandidateReceived(const QJsonObject &candidate); // empty/null = end
    void iceRestartRequested(const QJsonObject &turnConfig);
    void promptAck(bool success, const QString &error);
    void setImageAck(bool success, const QString &error);
    void generationStarted();
    void generationTick(double seconds);
    void generationEnded(double seconds, const QString &reason);

private slots:
    void onConnected();
    void onDisconnected();
    void onTextMessage(const QString &message);
    void onSocketError(QAbstractSocket::SocketError error);

private:
    void sendJson(const QJsonObject &obj);
    void handleMessage(const QJsonObject &obj);

    QWebSocket m_socket;
    QTimer m_reconnectTimer;
    QString m_wsBase;
    QString m_token;
    QString m_model;
    bool m_autoReconnect = true;
    bool m_userDisconnect = false;
    int m_reconnectAttempt = 0;
    bool m_connected = false;
    bool m_generating = false;
    double m_generationSeconds = 0.0;
    QString m_sessionId;
    QString m_lastError;
};
