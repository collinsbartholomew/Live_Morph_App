#include "DecartSignalingClient.h"
#include <QUrlQuery>
#include <QNetworkRequest>
#include <QDebug>

DecartSignalingClient::DecartSignalingClient(QObject *parent)
    : QObject(parent)
{
    connect(&m_ws, &QWebSocket::connected, this, &DecartSignalingClient::onConnected);
    connect(&m_ws, &QWebSocket::disconnected, this, &DecartSignalingClient::onDisconnected);
    connect(&m_ws, &QWebSocket::textMessageReceived, this, &DecartSignalingClient::onTextMessage);
    connect(&m_ws, &QWebSocket::errorOccurred, this, &DecartSignalingClient::onError);
}

void DecartSignalingClient::connectToProxy(const QString &wsBaseUrl,
                                           const QString &token,
                                           const QString &model)
{
    disconnectFromProxy();
    m_token = token;
    QUrl url(wsBaseUrl);
    if (url.path().isEmpty() || url.path() == QLatin1String("/"))
        url.setPath(QStringLiteral("/api/v1/realtime"));
    QUrlQuery q;
    q.addQueryItem(QStringLiteral("product"), QStringLiteral("liveescape"));
    q.addQueryItem(QStringLiteral("frontend_id"), QStringLiteral("liveescape"));
    q.addQueryItem(QStringLiteral("model"), model.isEmpty() ? QStringLiteral("lucy-2.5") : model);
    url.setQuery(q);
    QNetworkRequest req(url);
    // The proxy requires a JWT; user identity comes from the token's `sub` claim.
    if (!token.isEmpty())
        req.setRawHeader("Authorization", QByteArray("Bearer ") + token.toUtf8());
    qInfo() << "[DecartSignaling] connecting" << url.toString(QUrl::RemoveQuery);
    m_ws.open(req);
}

void DecartSignalingClient::disconnectFromProxy()
{
    if (m_ws.state() == QAbstractSocket::ConnectedState
        || m_ws.state() == QAbstractSocket::ConnectingState)
        m_ws.close();
    if (m_connected) {
        m_connected = false;
        emit connectionChanged();
    }
    if (m_generating) {
        m_generating = false;
        emit generatingChanged();
    }
}

void DecartSignalingClient::sendJson(const QJsonObject &obj)
{
    if (!m_connected) {
        setErr(QStringLiteral("Not connected to signaling proxy"));
        return;
    }
    m_ws.sendTextMessage(QString::fromUtf8(QJsonDocument(obj).toJson(QJsonDocument::Compact)));
}

void DecartSignalingClient::sendOffer(const QString &sdp)
{
    sendJson(QJsonObject{{QStringLiteral("type"), QStringLiteral("offer")},
                         {QStringLiteral("sdp"), sdp}});
}

void DecartSignalingClient::sendIceCandidate(const QVariantMap &candidate)
{
    QJsonObject c;
    if (candidate.isEmpty()) {
        sendJson(QJsonObject{{QStringLiteral("type"), QStringLiteral("ice-candidate")},
                             {QStringLiteral("candidate"), QJsonValue::Null}});
        return;
    }
    c.insert(QStringLiteral("candidate"), candidate.value(QStringLiteral("candidate")).toString());
    c.insert(QStringLiteral("sdpMLineIndex"), candidate.value(QStringLiteral("sdpMLineIndex")).toInt());
    c.insert(QStringLiteral("sdpMid"), candidate.value(QStringLiteral("sdpMid")).toString());
    if (candidate.contains(QStringLiteral("usernameFragment")))
        c.insert(QStringLiteral("usernameFragment"),
                 candidate.value(QStringLiteral("usernameFragment")).toString());
    sendJson(QJsonObject{{QStringLiteral("type"), QStringLiteral("ice-candidate")},
                         {QStringLiteral("candidate"), c}});
}

void DecartSignalingClient::sendIceComplete()
{
    sendIceCandidate({});
}

void DecartSignalingClient::sendPrompt(const QString &prompt, bool enhance)
{
    sendJson(QJsonObject{{QStringLiteral("type"), QStringLiteral("prompt")},
                         {QStringLiteral("prompt"), prompt},
                         {QStringLiteral("enhance_prompt"), enhance}});
}

void DecartSignalingClient::sendReferenceImageBase64(const QString &base64,
                                                     const QString &prompt,
                                                     bool enhance)
{
    QJsonObject o{{QStringLiteral("type"), QStringLiteral("set_image")},
                  {QStringLiteral("image_data"), base64},
                  {QStringLiteral("enhance_prompt"), enhance}};
    if (!prompt.isEmpty())
        o.insert(QStringLiteral("prompt"), prompt);
    sendJson(o);
}

void DecartSignalingClient::sendRawJson(const QString &json)
{
    if (!m_connected) {
        setErr(QStringLiteral("Not connected"));
        return;
    }
    m_ws.sendTextMessage(json);
}

void DecartSignalingClient::onConnected()
{
    m_connected = true;
    m_lastError.clear();
    emit connectionChanged();
    emit lastErrorChanged();
}

void DecartSignalingClient::onDisconnected()
{
    m_connected = false;
    emit connectionChanged();
}

void DecartSignalingClient::onError(QAbstractSocket::SocketError)
{
    setErr(m_ws.errorString());
}

void DecartSignalingClient::setErr(const QString &e)
{
    m_lastError = e;
    emit lastErrorChanged();
    emit signalingError(e);
}

void DecartSignalingClient::onTextMessage(const QString &message)
{
    emit messageReceived(message);
    const QJsonObject o = QJsonDocument::fromJson(message.toUtf8()).object();
    const QString type = o.value(QStringLiteral("type")).toString();

    if (type == QLatin1String("answer")) {
        emit answerReceived(o.value(QStringLiteral("sdp")).toString());
    } else if (type == QLatin1String("ice-candidate")) {
        const QJsonValue c = o.value(QStringLiteral("candidate"));
        if (c.isNull() || c.isUndefined()) {
            emit remoteIceCandidate({});
        } else {
            emit remoteIceCandidate(c.toObject().toVariantMap());
        }
    } else if (type == QLatin1String("session_id")) {
        m_sessionId = o.value(QStringLiteral("session_id")).toString();
        emit sessionIdChanged();
    } else if (type == QLatin1String("prompt_ack")) {
        emit promptAck(o.value(QStringLiteral("success")).toBool(),
                       o.value(QStringLiteral("error")).toString());
    } else if (type == QLatin1String("set_image_ack")) {
        emit imageAck(o.value(QStringLiteral("success")).toBool(),
                      o.value(QStringLiteral("error")).toString());
    } else if (type == QLatin1String("generation_started")) {
        m_generating = true;
        emit generatingChanged();
        emit generationStarted();
    } else if (type == QLatin1String("generation_tick")) {
        emit generationTick(o.value(QStringLiteral("seconds")).toDouble());
    } else if (type == QLatin1String("generation_ended")) {
        m_generating = false;
        emit generatingChanged();
        emit generationEnded(o.value(QStringLiteral("seconds")).toDouble(),
                             o.value(QStringLiteral("reason")).toString());
    } else if (type == QLatin1String("error")) {
        setErr(o.value(QStringLiteral("error")).toString());
    } else if (type == QLatin1String("ice-restart")) {
        // Viewport / WebRTC layer should restart ICE with turn_config if present
        emit messageReceived(message);
    }
}
