#include "WebRtcSignalingClient.h"
#include "core/DeviceIdentity.h"
#include <QDebug>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonValue>
#include <QNetworkRequest>
#include <QTimer>
#include <QUrl>
#include <QUrlQuery>
#include <QtGlobal>

namespace {
// Signaling frames are small JSON messages; anything over this cap is dropped
// before parsing so a hostile server cannot exhaust memory via one huge frame.
constexpr qint64 kMaxSignalFrameBytes = 1LL * 1024 * 1024;
// Hard ceiling on the socket's buffered incoming data (8 MiB) — oversized
// frames make QWebSocket error out instead of buffering forever.
constexpr qint64 kMaxSocketBufferBytes = 8LL * 1024 * 1024;
// Client-side cap for outgoing set_image payloads (the proxy rejects WS frames
// above MAX_BODY_BYTES anyway; base64 inflates ~33%).
constexpr int kMaxImageDataChars = 6 * 1024 * 1024;

bool isLoopbackHost(const QString &host)
{
	return host == QLatin1String("127.0.0.1") || host == QLatin1String("localhost")
	       || host == QLatin1String("::1") || host == QLatin1String("[::1]");
}
} // namespace

WebRtcSignalingClient::WebRtcSignalingClient(QObject* parent) : QObject(parent) {
	m_socket.setReadBufferSize(kMaxSocketBufferBytes);
	connect(&m_socket, &QWebSocket::connected, this, &WebRtcSignalingClient::onConnected);
	connect(&m_socket, &QWebSocket::disconnected, this, &WebRtcSignalingClient::onDisconnected);
	connect(&m_socket, &QWebSocket::textMessageReceived, this,
	        &WebRtcSignalingClient::onTextMessage);
#if QT_VERSION >= QT_VERSION_CHECK(6, 5, 0)
	connect(&m_socket, &QWebSocket::errorOccurred, this, &WebRtcSignalingClient::onSocketError);
#else
	connect(&m_socket, QOverload<QAbstractSocket::SocketError>::of(&QWebSocket::error), this,
	        &WebRtcSignalingClient::onSocketError);
#endif
	m_reconnectTimer.setSingleShot(true);
	connect(&m_reconnectTimer, &QTimer::timeout, this, [this]() {
		if (m_userDisconnect || m_wsBase.isEmpty())
			return;
		// Take the token at dial time, not the one captured at the original
		// connect — a rotated JWT must not be replayed after a drop.
		const QString tok = m_tokenProvider ? m_tokenProvider() : m_token;
		if (tok.isEmpty())
			return;
		m_token = tok;
		connectToProxy(m_wsBase, tok, m_model, m_tier);
	});
	// App-level keepalive: the proxy drops any client silent for 90s, and
	// QWebSocket sends no protocol pings by itself. Ping every 30s so idle
	// sessions (long generations without prompt changes) stay alive.
	m_pingTimer.setInterval(30000);
	connect(&m_pingTimer, &QTimer::timeout, this, [this]() {
		if (m_connected)
			sendJson({{QStringLiteral("type"), QStringLiteral("ping")}});
	});
}

void WebRtcSignalingClient::connectToProxy(const QString& wsBaseUrl, const QString& token,
                                           const QString& model, const QString& tier) {
	m_userDisconnect = false;
	// m_autoReconnect is a sticky policy flag (setAutoReconnect) — do NOT reset
	// it here, or one explicit reconnect silently disables auto-reconnect.
	m_wsBase = wsBaseUrl;
	m_token = token;
	m_model = model.isEmpty() ? QStringLiteral("lucy-2.1") : model;
	m_tier = tier.isEmpty() ? QStringLiteral("standard") : tier;
	m_reconnectTimer.stop();

	if (m_socket.state() != QAbstractSocket::UnconnectedState) {
		// Close without scheduling reconnect from this intentional re-open.
		// Keep m_userDisconnect set until AFTER the new open() and restore it
		// on the next event-loop turn — close() delivers disconnected()
		// asynchronously, and restoring synchronously could let that late
		// signal arm the reconnect ladder on top of the fresh connection.
		const bool prev = m_userDisconnect;
		m_userDisconnect = true;
		m_socket.close();
		QTimer::singleShot(0, this, [this, prev]() { m_userDisconnect = prev; });
	}

	QUrl url(wsBaseUrl);
	// Accept http(s) base and map to ws(s); anything else is rejected so a
	// misconfigured base URL can never open a non-WebSocket connection.
	if (url.scheme() == QLatin1String("http"))
		url.setScheme(QStringLiteral("ws"));
	else if (url.scheme() == QLatin1String("https"))
		url.setScheme(QStringLiteral("wss"));
	else if (url.scheme() != QLatin1String("ws") && url.scheme() != QLatin1String("wss")) {
		m_lastError = tr("Unsupported signaling URL scheme: %1").arg(url.scheme());
		emit errorOccurred(m_lastError, QString());
		return;
	}
	if (!url.isValid() || url.host().isEmpty()) {
		m_lastError = tr("Invalid signaling URL");
		emit errorOccurred(m_lastError, QString());
		return;
	}
	// The JWT rides in the Authorization header — plaintext ws:// to a remote
	// host would expose it on the wire. Only loopback may use ws://.
	if (url.scheme() == QLatin1String("ws") && !isLoopbackHost(url.host())) {
		m_lastError = tr("Refusing plaintext signaling to non-loopback host %1").arg(url.host());
		emit errorOccurred(m_lastError, QString());
		return;
	}

	QUrlQuery q;
	// Do NOT put JWT in the query string (logs/proxies). Auth via Authorization header.
	q.addQueryItem(QStringLiteral("product"), QStringLiteral("livemorph"));
	q.addQueryItem(QStringLiteral("frontend_id"), QStringLiteral("livemorph"));
	q.addQueryItem(QStringLiteral("model"), m_model);
	q.addQueryItem(QStringLiteral("tier"), m_tier);
	q.addQueryItem(QStringLiteral("device_id"), DeviceIdentity::deviceId());
	url.setQuery(q);

	// Ensure path hits realtime endpoint if caller passed origin only
	if (url.path().isEmpty() || url.path() == QLatin1String("/"))
		url.setPath(QStringLiteral("/api/v1/realtime"));

	m_lastError.clear();
	m_sessionId.clear();
	m_generating = false;
	m_generationSeconds = 0;
	emit sessionIdChanged();
	emit generatingChanged();
	emit generationSecondsChanged();

	QNetworkRequest req{url};
	if (!token.isEmpty())
		req.setRawHeader("Authorization", QByteArray("Bearer ") + token.toUtf8());
	m_socket.open(req);
}

void WebRtcSignalingClient::disconnectFromProxy() {
	m_userDisconnect = true;
	m_autoReconnect = false;
	m_reconnectTimer.stop();
	m_pingTimer.stop();
	m_reconnectAttempt = 0;
	// Reset session-scoped counters — stale generationSeconds kept the
	// elapsed/cost display ticking with the previous session's values.
	m_generationSeconds = 0.0;
	m_generating = false;
	m_sessionId.clear();
	emit generationSecondsChanged();
	emit generatingChanged();
	emit sessionIdChanged();
	if (m_socket.state() != QAbstractSocket::UnconnectedState)
		m_socket.close();
}

void WebRtcSignalingClient::setAutoReconnect(bool enabled) {
	m_autoReconnect = enabled;
}

void WebRtcSignalingClient::setTokenProvider(std::function<QString()> provider) {
	m_tokenProvider = std::move(provider);
}

void WebRtcSignalingClient::sendOffer(const QString& sdp) {
	sendJson({{QStringLiteral("type"), QStringLiteral("offer")}, {QStringLiteral("sdp"), sdp}});
}

void WebRtcSignalingClient::sendIceCandidate(const QJsonObject& candidate) {
	QJsonObject o{{QStringLiteral("type"), QStringLiteral("ice-candidate")}};
	if (candidate.isEmpty())
		o.insert(QStringLiteral("candidate"), QJsonValue::Null);
	else
		o.insert(QStringLiteral("candidate"), candidate);
	sendJson(o);
}

void WebRtcSignalingClient::sendPrompt(const QString& prompt, bool enhancePrompt) {
	// The proxy drops prompts over 4000 chars (prompt_too_long) — clamp here so
	// a long paste is truncated instead of rejected mid-session.
	QString p = prompt;
	if (p.length() > 3500)
		p = p.left(3500);
	sendJson({{QStringLiteral("type"), QStringLiteral("prompt")},
	          {QStringLiteral("prompt"), p},
	          {QStringLiteral("enhance_prompt"), enhancePrompt}});
}

void WebRtcSignalingClient::sendSetImage(const QString& base64Image, const QString& prompt,
                                         bool enhancePrompt) {
	QString p = prompt;
	if (p.length() > 3500)
		p = p.left(3500);
	if (base64Image.length() > kMaxImageDataChars) {
		m_lastError = tr("Reference image too large — not sent");
		emit errorOccurred(m_lastError, QString());
		return;
	}
	QJsonObject o{
	    {QStringLiteral("type"), QStringLiteral("set_image")},
	    {QStringLiteral("image_data"), base64Image},
	    {QStringLiteral("enhance_prompt"), enhancePrompt},
	};
	if (!p.isEmpty())
		o.insert(QStringLiteral("prompt"), p);
	sendJson(o);
}

void WebRtcSignalingClient::sendClearImage() {
	sendJson({{QStringLiteral("type"), QStringLiteral("set_image")},
	          {QStringLiteral("image_data"), QJsonValue::Null}});
}

void WebRtcSignalingClient::sendJson(const QJsonObject& obj) {
	if (!m_connected) {
		m_lastError = QStringLiteral("signaling not connected");
		emit errorOccurred(m_lastError, QString());
		return;
	}
	m_socket.sendTextMessage(QString::fromUtf8(QJsonDocument(obj).toJson(QJsonDocument::Compact)));
}

void WebRtcSignalingClient::onConnected() {
	m_reconnectAttempt = 0;
	m_reconnectTimer.stop();
	m_connected = true;
	m_pingTimer.start();
	emit connectedChanged();
}

void WebRtcSignalingClient::onDisconnected() {
	const bool was = m_connected;
	m_connected = false;
	m_pingTimer.stop();
	if (was)
		emit connectedChanged();
	if (m_generating) {
		m_generating = false;
		emit generatingChanged();
	}
	// The session died with the socket — don't let QML read a stale id.
	if (!m_sessionId.isEmpty()) {
		m_sessionId.clear();
		emit sessionIdChanged();
	}
	// Internal auto-reconnect is DISABLED by default: SessionManager owns the
	// reconnect policy (it recreates the peer for a fresh negotiation) and
	// both loops racing here killed in-flight handshakes on every retry.
	if (!m_userDisconnect && m_autoReconnect && !m_wsBase.isEmpty() && !m_token.isEmpty()) {
		m_reconnectAttempt = qMin(m_reconnectAttempt + 1, 6);
		const int delayMs = qMin(30000, 1000 * (1 << (m_reconnectAttempt - 1)));
		m_lastError = tr("Signaling disconnected — reconnecting in %1s…").arg(delayMs / 1000);
		emit reconnecting(delayMs); // transient notice, not a real error
		m_reconnectTimer.start(delayMs);
	}
}

void WebRtcSignalingClient::onTextMessage(const QString& message) {
	// Drop oversized frames before they are converted/parsed.
	if (message.size() > kMaxSignalFrameBytes) {
		qWarning() << "WebRtcSignalingClient: dropping oversized frame (" << message.size() << "chars)";
		return;
	}
	const auto doc = QJsonDocument::fromJson(message.toUtf8());
	if (!doc.isObject())
		return;
	handleMessage(doc.object());
}

void WebRtcSignalingClient::onSocketError(QAbstractSocket::SocketError) {
	m_lastError = m_socket.errorString();
	emit errorOccurred(m_lastError, QString());
}

void WebRtcSignalingClient::handleMessage(const QJsonObject& obj) {
	const QString type = obj.value(QStringLiteral("type")).toString();

	if (type == QLatin1String("answer")) {
		emit answerReceived(obj.value(QStringLiteral("sdp")).toString());
	} else if (type == QLatin1String("ice-candidate")) {
		const auto cand = obj.value(QStringLiteral("candidate"));
		if (cand.isNull() || cand.isUndefined())
			emit iceCandidateReceived({});
		else
			emit iceCandidateReceived(cand.toObject());
	} else if (type == QLatin1String("session_id")) {
		m_sessionId = obj.value(QStringLiteral("session_id")).toString();
		emit sessionIdChanged();
	} else if (type == QLatin1String("prompt_ack")) {
		emit promptAck(obj.value(QStringLiteral("success")).toBool(),
		               obj.value(QStringLiteral("error")).toString());
	} else if (type == QLatin1String("set_image_ack")) {
		emit setImageAck(obj.value(QStringLiteral("success")).toBool(),
		                 obj.value(QStringLiteral("error")).toString());
	} else if (type == QLatin1String("generation_started")) {
		m_generating = true;
		emit generatingChanged();
		emit generationStarted();
	} else if (type == QLatin1String("generation_tick")) {
		m_generationSeconds = obj.value(QStringLiteral("seconds")).toDouble();
		emit generationSecondsChanged();
		emit generationTick(m_generationSeconds);
	} else if (type == QLatin1String("generation_ended")) {
		m_generating = false;
		m_generationSeconds = obj.value(QStringLiteral("seconds")).toDouble();
		emit generatingChanged();
		emit generationSecondsChanged();
		emit generationEnded(m_generationSeconds, obj.value(QStringLiteral("reason")).toString());
	} else if (type == QLatin1String("ice-restart")) {
		emit iceRestartRequested(obj.value(QStringLiteral("turn_config")).toObject());
	} else if (type == QLatin1String("queue_position")) {
		// Decart-style queue telemetry (Electron Dashboard shows it in status)
		emit queuePositionChanged(obj.value(QStringLiteral("position")).toInt(),
		                          obj.value(QStringLiteral("queue_size")).toInt());
	} else if (type == QLatin1String("error") || type == QLatin1String("pong")) {
		if (type == QLatin1String("error")) {
			m_lastError = obj.value(QStringLiteral("error")).toString();
			// Structured code when the proxy provides one (e.g.
			// "insufficient_credits") — callers match the code first instead
			// of sniffing prose.
			emit errorOccurred(m_lastError, obj.value(QStringLiteral("code")).toString());
			// A server error ends any in-flight generation — otherwise the
			// UI would stay stuck in "generating" forever.
			if (m_generating) {
				m_generating = false;
				emit generatingChanged();
			}
		}
	}
}
