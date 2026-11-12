#include "BackendClient.h"
#include "core/DeviceIdentity.h"
#include <QClipboard>
#include <QDesktopServices>
#include <QFileInfo>
#include <QGuiApplication>
#include <QJsonArray>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonParseError>
#include <QNetworkRequest>
#include <QSettings>
#include <QStandardPaths>
#include <QTimer>
#include <QPointer>
#include <QFile>
#include <QDateTime>
#include <functional>

namespace {
// Cap for JSON API responses — anything bigger is a hostile/garbage body, not
// a legitimate payload (bootstrap/catalog are a few hundred KiB at most).
constexpr qint64 kMaxJsonBytes = 10LL * 1024 * 1024;

// Abort the transfer as soon as the streamed body crosses the cap, so a huge
// response is dropped before it is fully buffered into memory.
void guardReplySize(QNetworkReply *reply, const QString &path)
{
	QObject::connect(reply, &QNetworkReply::downloadProgress, reply,
	                 [reply, path](qint64 received, qint64) {
		                 if (received > kMaxJsonBytes && !reply->property("lmSizeCap").toBool()) {
			                 reply->setProperty("lmSizeCap", true);
			                 qWarning() << "BackendClient: response over size cap, aborting" << path;
			                 reply->abort();
			         }
	                 });
}
} // namespace

BackendClient::BackendClient(QObject* parent) : QObject(parent) {
	m_nam.setTransferTimeout(30000);

	// A failed update-manifest fetch must not wedge downloadUpdate() forever.
	connect(this, &BackendClient::requestFailed, this, [this](const QString& path, const QString&) {
		if (path.contains(QStringLiteral("update/check")))
			m_updateCheckInFlight = false;
	});

	// Periodic reachability probe — paused while the app is backgrounded.
	m_pingTimer.setInterval(15000);
	connect(&m_pingTimer, &QTimer::timeout, this, &BackendClient::ping);
	m_pingTimer.start();
	connect(qApp, &QGuiApplication::applicationStateChanged, this,
	        [this](Qt::ApplicationState state) {
		        if (state == Qt::ApplicationActive)
			        m_pingTimer.start();
		        else
			        m_pingTimer.stop();
	        });
	QTimer::singleShot(200, this, &BackendClient::ping);
	QTimer::singleShot(400, this, &BackendClient::fetchAppVersion);
}

void BackendClient::setBaseUrl(const QString& url) {
	QString u = url.trimmed();
	while (u.endsWith(QLatin1Char('/')))
		u.chop(1);
	if (u.isEmpty())
		u = QStringLiteral("http://127.0.0.1:3874");
	if (!u.startsWith(QLatin1String("http://")) && !u.startsWith(QLatin1String("https://")))
		u = QStringLiteral("http://") + u;
	// Production hosts must not use plaintext HTTP (loopback only exception)
	const QUrl parsed(u);
	const QString host = parsed.host();
	const bool loopback = host == QLatin1String("127.0.0.1") ||
	                      host == QLatin1String("localhost") || host == QLatin1String("::1");
	if (!loopback && parsed.scheme() == QLatin1String("http"))
		u.replace(QLatin1String("http://"), QLatin1String("https://"));
	if (m_baseUrl == u)
		return;
	m_baseUrl = u;
	// Cached WS endpoints belong to the OLD host — clear them so the balance
	// and realtime sockets are re-derived from the new base URL.
	m_balanceWsUrl.clear();
	m_realtimeWsUrl.clear();
	emit baseUrlChanged();
	ping();
}

bool BackendClient::isTrustedDownloadHost(const QString &host) const {
    static const QStringList kTrusted = {
        QStringLiteral("livemorph.com"), QStringLiteral("www.livemorph.com"),
    };
    const QString h = host.toLower();
    if (kTrusted.contains(h))
        return true;
    const QString apiHost = QUrl(m_baseUrl).host().toLower();
    return !apiHost.isEmpty() && h == apiHost;
}

bool BackendClient::parseJsonObject(const QByteArray& raw, QJsonObject& out) {
	if (raw.trimmed().isEmpty())
		return false;
	QJsonParseError err{};
	const auto doc = QJsonDocument::fromJson(raw, &err);
	if (err.error != QJsonParseError::NoError || !doc.isObject())
		return false;
	out = doc.object();
	return true;
}

QString BackendClient::translatedServerError(int status, const QByteArray& body) {
	QString code;
	QString rawMsg;
	const auto doc = QJsonDocument::fromJson(body);
	if (doc.isObject()) {
		const auto o = doc.object();
		rawMsg = o.value(QStringLiteral("message")).toString();
		code = o.value(QStringLiteral("error")).toString();
	}
	if (status == 429 || code == QLatin1String("rate_limited"))
		return tr("Too many attempts — please wait");
	if (status == 402 || code == QLatin1String("insufficient_credits") || code == QLatin1String("payment_required"))
		return tr("Insufficient credits");
	if (code == QLatin1String("unauthorized") || (status == 401 && code.isEmpty()))
		return tr("Invalid credentials");
	if (code == QLatin1String("forbidden"))
		return tr("This action is not allowed");
	if (code == QLatin1String("not_found"))
		return tr("Not found");
	if (code == QLatin1String("bad_request"))
		return tr("Invalid request");
	if (code == QLatin1String("conflict"))
		return tr("Conflict — please try again");
	if (code == QLatin1String("internal"))
		return tr("Server error — please try again later");
	if (!rawMsg.isEmpty())
		return rawMsg; // unknown code: better the raw text than nothing
	return tr("Request failed — HTTP %1").arg(status);
}

void BackendClient::setAccessToken(const QString& token) {
	m_accessToken = token;
	// Bump on every call with a non-empty token: a refresh that returns the
	// identical JWT is still a completed refresh, and 401-retries must reissue.
	if (!token.isEmpty())
		++m_tokenEpoch;
}

QString BackendClient::deviceId() const {
	return DeviceIdentity::deviceId();
}

QNetworkRequest BackendClient::makeRequest(const QString& path) const {
	QNetworkRequest req{QUrl(m_baseUrl + path)};
	req.setHeader(QNetworkRequest::ContentTypeHeader, QStringLiteral("application/json"));
	req.setRawHeader("Accept", "application/json");
	req.setRawHeader("X-Frontend-Id", "livemorph");
	req.setRawHeader("X-Client-Product", "livemorph");
	req.setRawHeader("X-Device-Id", DeviceIdentity::deviceId().toUtf8());
	req.setRawHeader("X-App-Version", DeviceIdentity::appVersion().toUtf8());
	req.setHeader(QNetworkRequest::UserAgentHeader, DeviceIdentity::userAgent());
	// Never follow redirects on authenticated API calls — a 3xx to another
	// host must not carry the Bearer token with it. The API does not redirect.
	req.setAttribute(QNetworkRequest::RedirectPolicyAttribute,
	                 QNetworkRequest::ManualRedirectPolicy);
	if (!m_accessToken.isEmpty())
		req.setRawHeader("Authorization", QByteArray("Bearer ") + m_accessToken.toUtf8());
	return req;
}

void BackendClient::get(const QString& path, const std::function<void(const QJsonObject&)>& ok) {
    getAuth(path, ok, false);
}

// Electron parity: on 401, refresh the session then retry the request once
// (index lt(): auth.refreshSession() + one re-invoke) instead of failing it.
void BackendClient::getAuth(const QString& path, const std::function<void(const QJsonObject&)>& ok, bool retriedAuth) {
	// Client-side rate limit (Electron getProfile 30/60s class) — read-only
	// GETs that hammer the proxy are dropped with a 429-style local failure.
	if (!retriedAuth && !bucketFor(path).tryAcquire()) {
		emit requestFailed(path, tr("Too many requests — try again in a moment"));
		return;
	}
	QNetworkRequest req = makeRequest(path);
	req.setTransferTimeout(30000); // 30s — production hangs should fail fast
	auto* reply = m_nam.get(req);
	guardReplySize(reply, path);
	connect(reply, &QNetworkReply::finished, this, [this, reply, path, ok, retriedAuth]() {
		reply->deleteLater();
		const QByteArray raw = reply->readAll();
		const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
		if (reply->property("lmSizeCap").toBool()) {
			emit requestFailed(path, tr("Response too large"));
			return;
		}
		// Treat pure transport failures as offline; HTTP 3xx/4xx/5xx still mean host is reachable
		const bool transportFail = (status == 0 && reply->error() != QNetworkReply::NoError);
		if (transportFail) {
			if (m_reachable) {
				setReachable(false);
			}
			emit requestFailed(path, reply->errorString());
			return;
		}
		if (status == 401 && !retriedAuth) {
			emit authenticationExpired();
			retryOnTokenRotation(
			    [this, path, ok]() { getAuth(path, ok, true); },
			    [this, path]() { emit requestFailed(path, tr("Authentication expired — sign in again")); });
			return;
		}
		// (A retried 401 falls through to the generic error path below, which
		// reports it once — re-emitting authenticationExpired there would start
		// a refresh storm.)
		if (reply->error() != QNetworkReply::NoError || status >= 300) {
			const QString err = translatedServerError(status, raw);
			if (!m_reachable) {
				setReachable(true);
			}
			emit requestFailed(path, err);
			return;
		}
		if (!m_reachable) {
			setReachable(true);
		}
		QJsonObject obj;
		if (raw.trimmed().isEmpty()) {
			ok(QJsonObject{}); // 204-style empty success stays an empty object
		} else if (!parseJsonObject(raw, obj)) {
			emit requestFailed(path, tr("Malformed response from server"));
			return;
		} else {
			ok(obj);
		}
	});
}

void BackendClient::post(const QString& path, const QJsonObject& body,
                         const std::function<void(const QJsonObject&)>& ok) {
    postAuth(path, body, ok, false);
}

void BackendClient::postAuth(const QString& path, const QJsonObject& body,
                             const std::function<void(const QJsonObject&)>& ok, bool retriedAuth) {
	// Client-side rate limit (Electron initPayment 5/300s class).
	if (!retriedAuth && !bucketFor(path).tryAcquire()) {
		emit requestFailed(path, tr("Too many requests — try again in a moment"));
		return;
	}
	QNetworkRequest req = makeRequest(path);
	req.setTransferTimeout(45000); // payments / verify may be slower
	auto* reply = m_nam.post(req, QJsonDocument(body).toJson(QJsonDocument::Compact));
	guardReplySize(reply, path);
	connect(reply, &QNetworkReply::finished, this, [this, reply, path, body, ok, retriedAuth]() {
		reply->deleteLater();
		const QByteArray raw = reply->readAll();
		const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
		if (reply->property("lmSizeCap").toBool()) {
			emit requestFailed(path, tr("Response too large"));
			return;
		}
		const bool transportFail = (status == 0 && reply->error() != QNetworkReply::NoError);
		if (transportFail) {
			if (m_reachable) {
				setReachable(false);
			}
			emit requestFailed(path, reply->errorString());
			return;
		}
		if (status == 401 && !retriedAuth) {
			emit authenticationExpired();
			retryOnTokenRotation(
			    [this, path, body, ok]() { postAuth(path, body, ok, true); },
			    [this, path]() { emit requestFailed(path, tr("Authentication expired — sign in again")); });
			return;
		}
		if (reply->error() != QNetworkReply::NoError || status >= 300) {
			const QString err = translatedServerError(status, raw);
			if (!m_reachable) {
				setReachable(true);
			}
			emit requestFailed(path, err);
			return;
		}
		if (!m_reachable) {
			setReachable(true);
		}
		QJsonObject obj;
		if (raw.trimmed().isEmpty()) {
			ok(QJsonObject{});
		} else if (!parseJsonObject(raw, obj)) {
			emit requestFailed(path, tr("Malformed response from server"));
			return;
		} else {
			ok(obj);
		}
	});
}

void BackendClient::fetchPaymentPackages() {
	QNetworkRequest req = makeRequest(QStringLiteral("/api/v1/payments/packages"));
	req.setTransferTimeout(15000);
	auto* reply = m_nam.get(req);
	guardReplySize(reply, QStringLiteral("/api/v1/payments/packages"));
	connect(reply, &QNetworkReply::finished, this, [this, reply]() {
		reply->deleteLater();
		const QByteArray raw = reply->readAll();
		const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
		if (reply->property("lmSizeCap").toBool()) {
			emit requestFailed(QStringLiteral("/api/v1/payments/packages"), tr("Response too large"));
			return;
		}
		const bool transportFail = (status == 0 && reply->error() != QNetworkReply::NoError);
		if (transportFail) {
			// Same reachability semantics as get()/post(): transport failure ⇒
			// offline (these previously left m_reachable stale-true).
			if (m_reachable) {
				setReachable(false);
			}
			emit requestFailed(QStringLiteral("/api/v1/payments/packages"), reply->errorString());
			return;
		}
		if (status >= 300) {
			// HTTP error still proves the host is reachable.
			if (!m_reachable) {
				setReachable(true);
			}
			emit requestFailed(QStringLiteral("/api/v1/payments/packages"), reply->errorString());
			return;
		}
		if (!m_reachable) {
			setReachable(true);
		}
		const auto doc = QJsonDocument::fromJson(raw);
		QVariantList list;
		if (doc.isArray()) {
			for (const auto& v : doc.array())
				list.append(v.toVariant());
		} else if (doc.isObject()) {
			const auto obj = doc.object();
			const auto arr = obj.value(QStringLiteral("packages")).toArray();
			for (const auto& v : arr)
				list.append(v.toVariant());
			if (obj.contains(QStringLiteral("providers"))) {
				QStringList prov;
				for (const auto& v : obj.value(QStringLiteral("providers")).toArray())
					prov.append(v.toString());
				if (!prov.isEmpty() && prov != m_paymentProviders) {
					m_paymentProviders = prov;
					emit paymentProvidersChanged();
				}
			}
		}
		m_paymentPackages = list;
		emit paymentPackagesReceived(list);
		emit paymentPackagesChanged();
	});
}

void BackendClient::createPaymentOrder(const QString& packageKey, const QString& provider) {
	QJsonObject body{
	    {QStringLiteral("package_key"), packageKey},
	    {QStringLiteral("provider"), provider},
	    {QStringLiteral("product"), QStringLiteral("livemorph")},
	    {QStringLiteral("device_id"), DeviceIdentity::deviceId()},
	};
	post(QStringLiteral("/api/v1/payments/orders"), body,
	     [this](const QJsonObject& o) { emit paymentOrderCreated(o.toVariantMap()); });
}

void BackendClient::verifyPaymentOrder(const QString& orderId, const QString& reference) {
	QJsonObject body{{QStringLiteral("order_id"), orderId}};
	if (!reference.isEmpty())
		body.insert(QStringLiteral("reference"), reference);
	post(QStringLiteral("/api/v1/payments/orders/verify"), body,
	     [this](const QJsonObject& o) { emit paymentOrderVerified(o.toVariantMap()); });
}

void BackendClient::fetchOrderStatus(const QString& orderId) {
	if (orderId.isEmpty())
		return;
	const QString enc = QString::fromUtf8(QUrl::toPercentEncoding(orderId));
	get(QStringLiteral("/api/v1/payments/orders/%1").arg(enc), [this](const QJsonObject& o) {
		emit paymentOrderStatusReceived(o.toVariantMap());
		// Also surface as verified when already provisioned so existing handlers work
		const QString st = o.value(QStringLiteral("status")).toString();
		if (st == QLatin1String("provisioned") || o.value(QStringLiteral("provisioned")).toBool())
			emit paymentOrderVerified(o.toVariantMap());
	});
}

void BackendClient::cancelPaymentOrder(const QString& orderId) {
	if (orderId.isEmpty())
		return;
	QJsonObject body{{QStringLiteral("order_id"), orderId}};
	post(QStringLiteral("/api/v1/payments/orders/cancel"), body,
	     [this](const QJsonObject& o) { emit paymentOrderCancelled(o.toVariantMap()); });
}

void BackendClient::fetchCreditsBalance() {
	get(QStringLiteral("/api/v1/credits/balance"),
	    [this](const QJsonObject& o) { emit creditsBalanceReceived(o.toVariantMap()); });
}

void BackendClient::fetchUserCharacters() {
	get(QStringLiteral("/api/v1/characters/mine"), [this](const QJsonObject& o) {
		emit userCharactersReceived(
		    o.value(QStringLiteral("characters")).toArray().toVariantList());
	});
}

void BackendClient::createUserCharacter(const QString& name, const QString& prompt,
                                        const QString& imageUrl) {
	QJsonObject body{{QStringLiteral("name"), name}, {QStringLiteral("prompt"), prompt}};
	if (!imageUrl.isEmpty())
		body.insert(QStringLiteral("image_url"), imageUrl);
	post(QStringLiteral("/api/v1/characters/mine"), body, [this](const QJsonObject& o) {
		emit userCharacterCreated(o.value(QStringLiteral("character")).toObject().toVariantMap());
	});
}

void BackendClient::updateUserCharacter(const QString& id, const QString& name,
                                        const QString& prompt, bool isFavorite) {
	QJsonObject body;
	if (!name.isEmpty())
		body.insert(QStringLiteral("name"), name);
	if (!prompt.isEmpty())
		body.insert(QStringLiteral("prompt"), prompt);
	body.insert(QStringLiteral("is_favorite"), isFavorite);
	const QString enc = QString::fromUtf8(QUrl::toPercentEncoding(id));
	put(QStringLiteral("/api/v1/characters/mine/%1").arg(enc), body, [this](const QJsonObject& o) {
		emit userCharacterUpdated(o.value(QStringLiteral("character")).toObject().toVariantMap());
	});
}

void BackendClient::deleteUserCharacter(const QString& id) {
	const QString enc = QString::fromUtf8(QUrl::toPercentEncoding(id));
	del(QStringLiteral("/api/v1/characters/mine/%1").arg(enc),
	    [this](const QJsonObject& o) { emit userCharacterDeleted(o.toVariantMap()); });
}

void BackendClient::put(const QString& path, const QJsonObject& body,
                        const std::function<void(const QJsonObject&)>& ok) {
    putAuth(path, body, ok, false);
}

void BackendClient::putAuth(const QString& path, const QJsonObject& body,
                            const std::function<void(const QJsonObject&)>& ok, bool retriedAuth) {
	QNetworkRequest req = makeRequest(path);
	req.setTransferTimeout(30000);
	auto* reply =
	    m_nam.sendCustomRequest(req, "PUT", QJsonDocument(body).toJson(QJsonDocument::Compact));
	guardReplySize(reply, path);
	connect(reply, &QNetworkReply::finished, this, [this, reply, path, body, ok, retriedAuth]() {
		reply->deleteLater();
		const QByteArray raw = reply->readAll();
		const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
		if (reply->property("lmSizeCap").toBool()) {
			emit requestFailed(path, tr("Response too large"));
			return;
		}
		const bool transportFail = (status == 0 && reply->error() != QNetworkReply::NoError);
		if (transportFail) {
			if (m_reachable) {
				setReachable(false);
			}
			emit requestFailed(path, reply->errorString());
			return;
		}
		if (status == 401 && !retriedAuth) {
			emit authenticationExpired();
			retryOnTokenRotation(
			    [this, path, body, ok]() { putAuth(path, body, ok, true); },
			    [this, path]() { emit requestFailed(path, tr("Authentication expired — sign in again")); });
			return;
		}
		if (reply->error() != QNetworkReply::NoError || status >= 300) {
			const QString err = translatedServerError(status, raw);
			if (!m_reachable) {
				setReachable(true);
			}
			emit requestFailed(path, err);
			return;
		}
		if (!m_reachable) {
			setReachable(true);
		}
		QJsonObject obj;
		if (raw.trimmed().isEmpty()) {
			ok(QJsonObject{});
		} else if (!parseJsonObject(raw, obj)) {
			emit requestFailed(path, tr("Malformed response from server"));
			return;
		} else {
			ok(obj);
		}
	});
}

void BackendClient::del(const QString& path, const std::function<void(const QJsonObject&)>& ok) {
    delAuth(path, ok, false);
}

void BackendClient::delAuth(const QString& path, const std::function<void(const QJsonObject&)>& ok,
                            bool retriedAuth) {
	QNetworkRequest req = makeRequest(path);
	req.setTransferTimeout(15000);
	auto* reply = m_nam.sendCustomRequest(req, "DELETE");
	guardReplySize(reply, path);
	connect(reply, &QNetworkReply::finished, this, [this, reply, path, ok, retriedAuth]() {
		reply->deleteLater();
		const QByteArray raw = reply->readAll();
		const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
		if (reply->property("lmSizeCap").toBool()) {
			emit requestFailed(path, tr("Response too large"));
			return;
		}
		const bool transportFail = (status == 0 && reply->error() != QNetworkReply::NoError);
		if (transportFail) {
			if (m_reachable) {
				setReachable(false);
			}
			emit requestFailed(path, reply->errorString());
			return;
		}
		if (status == 401 && !retriedAuth) {
			emit authenticationExpired();
			retryOnTokenRotation(
			    [this, path, ok]() { delAuth(path, ok, true); },
			    [this, path]() { emit requestFailed(path, tr("Authentication expired — sign in again")); });
			return;
		}
		if (reply->error() != QNetworkReply::NoError || status >= 300) {
			const QString err = translatedServerError(status, raw);
			if (!m_reachable) {
				setReachable(true);
			}
			emit requestFailed(path, err);
			return;
		}
		if (!m_reachable) {
			setReachable(true);
		}
		QJsonObject obj;
		if (raw.trimmed().isEmpty()) {
			ok(QJsonObject{});
		} else if (!parseJsonObject(raw, obj)) {
			emit requestFailed(path, tr("Malformed response from server"));
			return;
		} else {
			ok(obj);
		}
	});
}

// Wait for AuthManager to rotate the access token (it calls setAccessToken on
// refresh, triggered by authenticationExpired) and re-issue the request once.
// Polls every 200ms; gives up after 10s and fires giveUp so callers still see
// a terminal failure instead of hanging.
void BackendClient::retryOnTokenRotation(const std::function<void()>& reissue,
                                         const std::function<void()>& giveUp) {
	// Watch the token epoch, not just the token string: a refresh that returns
	// the identical JWT still completed, and the retry must go through.
	const quint64 staleEpoch = m_tokenEpoch;
	auto* poll = new QTimer(this);
	poll->setInterval(200);
	QTimer* killer = new QTimer(this);
	killer->setSingleShot(true);

	connect(poll, &QTimer::timeout, this, [this, poll, killer, staleEpoch, reissue]() {
		if (!m_accessToken.isEmpty() && m_tokenEpoch != staleEpoch) {
			poll->stop();
			poll->deleteLater();
			// Kill the bounded-wait timer too — otherwise it fires on the
			// freed poll (use-after-free on every successful 401 retry).
			killer->stop();
			killer->deleteLater();
			reissue();
		}
	});
	// Bounded wait: a dead refresh must not leak the poll timer forever.
	// Use a QPointer: the success branch deleteLater()s the poll, so a raw
	// capture here would dereference freed memory when the killer fires.
	QPointer<QTimer> pollGuard = poll;
	connect(killer, &QTimer::timeout, this, [pollGuard, giveUp, killer]() {
		killer->deleteLater();
		if (pollGuard && pollGuard->isActive()) {
			pollGuard->stop();
			pollGuard->deleteLater();
			giveUp();
		}
	});
	poll->start();
	killer->start(10000);
}

bool BackendClient::RateBucket::tryAcquire() {
	const qint64 now = QDateTime::currentMSecsSinceEpoch();
	const qint64 cutoff = now - windowMs;
	for (int i = 0; i < stamps.size();) {
		if (stamps[i] <= cutoff)
			stamps.removeAt(i);
		else
			++i;
	}
	if (stamps.size() >= limit)
		return false;
	stamps.append(now);
	return true;
}

BackendClient::RateBucket &BackendClient::bucketFor(const QString &path) {
	// Creation/mutation endpoints keep Electron's initPayment limit: 5 per
	// 5 minutes. Status polls (GET /orders/{id}) use the default bucket —
	// routing them through the creation bucket made the 5s checkout pollers
	// self-throttle after ~25s and silently kill payment auto-detection.
	if (path == QLatin1String("/api/v1/payments/orders")
	    || path.endsWith(QLatin1String("/verify"))
	    || path.endsWith(QLatin1String("/cancel")))
		return m_payBucket;
	// Order-status polling gets its own bucket (60/60s) so a 5s poll cadence
	// never starves the default bucket shared by catalog/balance/profile GETs.
	if (path.startsWith(QLatin1String("/api/v1/payments/orders/")))
		return m_pollBucket;
	return m_defaultBucket;
}

void BackendClient::ping() {
	get(QStringLiteral("/api/v1/health"), [this](const QJsonObject& obj) {
		if (!m_reachable) {
			setReachable(true);
		}
		const QString v = obj.value(QStringLiteral("version")).toString();
		if (!v.isEmpty() && v != m_appVersion) {
			m_appVersion = v;
			emit appVersionChanged();
		}
		// Secondary: refresh catalog/version endpoints can lag — health is authoritative for up
		Q_UNUSED(obj);
	});
}

void BackendClient::setReachable(bool v) {
	if (m_reachable == v)
		return;
	m_reachable = v;
	m_reachableKnown = true;
	emit reachableChanged();
}

void BackendClient::fetchAppVersion() {
	ping();
}

void BackendClient::fetchIceServers() {
	get(QStringLiteral("/api/v1/webrtc/ice-servers"), [this](const QJsonObject& o) {
		const QJsonArray arr = o.value(QStringLiteral("iceServers")).toArray();
		QStringList urls;
		QString turnUser, turnCred;
		for (const QJsonValue &v : arr) {
			const QJsonObject e = v.toObject();
			const QString u = e.value(QStringLiteral("urls")).toString();
			if (u.isEmpty())
				continue;
			urls.append(u);
			if ((u.startsWith(QLatin1String("turn")))
			    && !e.value(QStringLiteral("username")).toString().isEmpty()) {
				turnUser = e.value(QStringLiteral("username")).toString();
				turnCred = e.value(QStringLiteral("credential")).toString();
			}
		}
		if (urls != m_iceServerUrls || turnUser != m_turnUser || turnCred != m_turnCredential) {
			m_iceServerUrls = urls;
			m_turnUser = turnUser;
			m_turnCredential = turnCred;
			emit iceServersChanged();
		}
	});
}

void BackendClient::selectBackground(const QString& presetId, const QString& prompt) {
	QJsonObject body;
	body.insert(QStringLiteral("preset_id"), presetId);
	if (!prompt.isEmpty())
		body.insert(QStringLiteral("prompt"), prompt);
	post(QStringLiteral("/api/v1/streaming/background-select"), body, [](const QJsonObject&) {});
}

void BackendClient::fetchBackgroundPresets() {
	get(QStringLiteral("/api/v1/streaming/background-presets"), [this](const QJsonObject& o) {
		const QVariantList presets = o.value(QStringLiteral("presets")).toArray().toVariantList();
		if (m_backgroundPresets == presets)
			return;
		m_backgroundPresets = presets;
		emit backgroundPresetsChanged();
	});
}

void BackendClient::fetchStreamingAvailability() {
	get(QStringLiteral("/api/v1/settings/streaming-availability"), [this](const QJsonObject& o) {
		const bool available = o.value(QStringLiteral("available")).toBool(true);
		const bool unavailable = !available;
		if (m_streamingUnavailable == unavailable)
			return;
		m_streamingUnavailable = unavailable;
		emit streamingAvailabilityChanged();
	});
}

void BackendClient::fetchMaintenance() {
	get(QStringLiteral("/api/v1/settings/dashboard-maintenance"), [this](const QJsonObject& o) {
		const bool v = o.value(QStringLiteral("maintenance")).toBool(false);
		if (m_maintenance == v)
			return;
		m_maintenance = v;
		emit maintenanceChanged();
	});
}

void BackendClient::fetchFeatureFlags() {
	get(QStringLiteral("/api/v1/public/feature-flags"), [this](const QJsonObject& o) {
		// Backend nests flags under {"flags": {...}, "product": "livemorph"}
		const QJsonObject flags = o.value(QStringLiteral("flags")).toObject();
		const bool enabled = flags.value(QStringLiteral("free_credits_enabled")).toBool(false);
		const double amount = flags.value(QStringLiteral("free_credits_amount")).toDouble(0.0);
		bool changed = false;
		if (m_freeCreditsEnabled != enabled) { m_freeCreditsEnabled = enabled; changed = true; }
		if (qAbs(m_freeCreditsAmount - amount) > 0.01) { m_freeCreditsAmount = amount; changed = true; }
		if (changed) emit featureFlagsChanged();
	});
}

void BackendClient::startVirtualCamera(const QString& streamId) {
	QJsonObject body;
	if (!streamId.isEmpty())
		body.insert(QStringLiteral("stream_id"), streamId);
	post(QStringLiteral("/api/v1/vc/start"), body,
	     [this](const QJsonObject& o) { emit virtualCameraStarted(o.toVariantMap()); });
}

void BackendClient::stopVirtualCamera() {
	post(QStringLiteral("/api/v1/vc/stop"), {},
	     [this](const QJsonObject& o) { emit virtualCameraStopped(o.toVariantMap()); });
}

void BackendClient::getVirtualCameraStatus() {
	get(QStringLiteral("/api/v1/vc/status"),
	    [this](const QJsonObject& o) { emit virtualCameraStatusReceived(o.toVariantMap()); });
}

void BackendClient::startRecording(const QVariantMap& payload) {
	post(QStringLiteral("/api/v1/recording/start"), QJsonObject::fromVariantMap(payload),
	     [this](const QJsonObject& o) { emit recordingStarted(o.toVariantMap()); });
}

void BackendClient::stopRecording(const QString& reason) {
	QJsonObject body{{QStringLiteral("reason"), reason}};
	post(QStringLiteral("/api/v1/recording/stop"), body,
	     [this](const QJsonObject& o) { emit recordingStopped(o.toVariantMap()); });
}

void BackendClient::finalizeRecording() {
	post(QStringLiteral("/api/v1/recording/finalize"), {},
	     [this](const QJsonObject& o) { emit recordingFinalized(o.toVariantMap()); });
}

void BackendClient::getRecordingsDirectory() {
	get(QStringLiteral("/api/v1/recordings/directory"), [this](const QJsonObject& o) {
		emit recordingsDirectoryReceived(o.value(QStringLiteral("directory")).toString());
	});
}

void BackendClient::clearAuthSession() {
	post(QStringLiteral("/api/v1/auth/clear"), {}, [](const QJsonObject&) {});
}

void BackendClient::checkUpdates() {
	post(QStringLiteral("/api/v1/update/check"), {},
	     [this](const QJsonObject& o) { emit updateCheckResult(o.toVariantMap()); });
}

void BackendClient::installUpdate() {
	// Frontend never installs binaries itself. Prefer last check payload download_url,
	// otherwise ask backend for the public download link and open in the browser/OS.
	post(QStringLiteral("/api/v1/update/check"), {}, [this](const QJsonObject& o) {
		const QString url = o.value(QStringLiteral("download_url"))
		                        .toString(o.value(QStringLiteral("url")).toString());
		// The URL comes from the server — only ever hand the OS an https URL,
		// never plain http or a registered-handler scheme.
		const QUrl qurl(url);
		if (!url.isEmpty() && qurl.scheme() == QLatin1String("https") && isTrustedDownloadHost(qurl.host()))
			openExternal(url);
		else if (!url.isEmpty())
			emit requestFailed(QStringLiteral("update/install"),
			                    tr("Refusing untrusted update URL"));
		emit updateCheckResult(o.toVariantMap());
	});
}

void BackendClient::fetchCatalog() {
	QNetworkRequest req = makeRequest(QStringLiteral("/api/v1/catalog"));
	req.setTransferTimeout(15000);
	auto* reply = m_nam.get(req);
	guardReplySize(reply, QStringLiteral("/api/v1/catalog"));
	connect(reply, &QNetworkReply::finished, this, [this, reply]() {
		reply->deleteLater();
		const QByteArray raw = reply->readAll();
		const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
		if (reply->property("lmSizeCap").toBool()) {
			emit requestFailed(QStringLiteral("/api/v1/catalog"), tr("Response too large"));
			return;
		}
		const bool transportFail = (status == 0 && reply->error() != QNetworkReply::NoError);
		if (transportFail) {
			if (m_reachable) {
				setReachable(false);
			}
			emit requestFailed(QStringLiteral("/api/v1/catalog"), reply->errorString());
			return;
		}
		if (status >= 300) {
			// HTTP error still proves the host is reachable.
			if (!m_reachable) {
				setReachable(true);
			}
			emit requestFailed(QStringLiteral("/api/v1/catalog"), reply->errorString());
			return;
		}
		if (!m_reachable) {
			setReachable(true);
		}
		const auto doc = QJsonDocument::fromJson(raw);
		QVariantList list;
		if (doc.isArray()) {
			for (const auto& v : doc.array())
				list.append(v.toObject().toVariantMap());
		} else if (doc.isObject()) {
			const auto arr = doc.object().value(QStringLiteral("characters")).toArray();
			for (const auto& v : arr)
				list.append(v.toObject().toVariantMap());
		}
		emit catalogReceived(list);
	});
}

void BackendClient::openExternal(const QString& url) {
	const QUrl u(url.trimmed());
	const QString scheme = u.scheme().toLower();
	// Allow web + mailto only. The livemorph:// scheme is deliberately NOT
	// openable here — opening it via the OS handler spawns a second instance;
	// deep links arrive via argv / the single-instance socket instead.
	if (scheme != QLatin1String("http") && scheme != QLatin1String("https") &&
	    scheme != QLatin1String("mailto")) {
		emit requestFailed(QStringLiteral("openExternal"),
		                   tr("Blocked URL scheme: %1").arg(scheme));
		return;
	}
	QDesktopServices::openUrl(u);
}

void BackendClient::copyToClipboard(const QString& text) {
	if (auto* clip = QGuiApplication::clipboard())
		clip->setText(text);
}

void BackendClient::revealRecording(const QString& path) {
	if (path.isEmpty())
		return;
	QDesktopServices::openUrl(QUrl::fromLocalFile(QFileInfo(path).absolutePath()));
}

void BackendClient::fetchBootstrap() {
	get(QStringLiteral("/api/v1/bootstrap"), [this](const QJsonObject& o) {
		m_lastBootstrap = o.toVariantMap();
		const QJsonObject ep = o.value(QStringLiteral("endpoints")).toObject();
		// Adopt bootstrap api_base ONLY when neither the env override nor a
		// saved Settings URL exists AND the pushed URL is a real remote TLS
		// endpoint. A loopback default from the backend config must never
		// silently repoint desktop clients away from the user's saved setting
		// (which ConfigManager owns), and a compromised backend must not be
		// able to repoint the client (and its JWT) at an attacker host.
		const bool envOverride = !qgetenv("LIVEMORPH_API_URL").isEmpty();
		const bool hasSavedUrl = !QSettings(QStringLiteral("LiveMorph"), QStringLiteral("LiveMorph"))
		                             .value(QStringLiteral("api/baseUrl")).toString().isEmpty();
		if (!envOverride && !hasSavedUrl) {
			QString api = ep.value(QStringLiteral("api_base")).toString();
			const bool loopback = api.contains(QLatin1String("127.0.0.1"))
			                    || api.contains(QLatin1String("localhost"));
			// Only adopt a TLS remote endpoint — never plaintext, never loopback.
			if (!api.isEmpty() && !loopback && api.startsWith(QLatin1String("https://")))
				setBaseUrl(api);
		}
		m_balanceWsUrl = ep.value(QStringLiteral("balance_ws")).toString();
		m_realtimeWsUrl = ep.value(QStringLiteral("realtime_ws")).toString();
		m_configRevision = o.value(QStringLiteral("config_revision")).toString();
		// Cache credit-rate config from bootstrap. Guard against NaN/inf:
		// a hostile or buggy value must never reach the credits gate math
		// (NaN comparisons are always false, which would disable the gate).
		const QJsonObject credits = o.value(QStringLiteral("credits")).toObject();
		auto finiteOr = [](const QJsonValue &v, double fallback) {
			const double d = v.toDouble(fallback);
			return qIsFinite(d) && d >= 0.0 ? d : fallback;
		};
		m_creditsPerSecond = finiteOr(credits.value(QStringLiteral("credits_per_second")), 0.0);
		m_minCreditsToStart = finiteOr(credits.value(QStringLiteral("min_credits_to_start")), 0.0);
		m_hdMultiplier = finiteOr(credits.value(QStringLiteral("hd_multiplier")), 1.0);
		// Maintenance flag from bootstrap (replaces separate /dashboard-maintenance call)
		const QJsonObject ui = o.value(QStringLiteral("ui")).toObject();
		const bool maint = ui.value(QStringLiteral("maintenance")).toBool(false);
		if (m_maintenance != maint) { m_maintenance = maint; emit maintenanceChanged(); }
		emit bootstrapChanged();
		emit bootstrapLoaded(m_lastBootstrap);
	});
}

void BackendClient::fetchDownloads() {
	if (!m_downloadsLoading) {
		m_downloadsLoading = true;
		emit downloadsLoadingChanged();
	}
	const quint64 gen = ++m_downloadsReqGen;
	get(QStringLiteral("/api/v1/downloads/list"), [this](const QJsonObject& o) {
		const QVariantList items = o.value(QStringLiteral("downloads")).toArray().toVariantList();
		m_downloadsLoading = false;
		emit downloadsLoadingChanged();
		if (m_downloadsModel == items)
			return;
		m_downloadsModel = items;
		emit downloadsChanged();
	});
	// get() has no error callback — clear the flag on failure/timeout via the
	// shared failure signal and a hard 30s cap (matches the transfer timeout).
	// Generation-guarded so a stale timer can't clear a newer request's flag.
	QTimer::singleShot(30000, this, [this, gen]() {
		if (gen == m_downloadsReqGen && m_downloadsLoading) {
			m_downloadsLoading = false;
			emit downloadsLoadingChanged();
		}
	});
}

void BackendClient::redeemCreditKey(const QString& key) {
	QJsonObject body{{QStringLiteral("credit_key"), key}};
	post(QStringLiteral("/api/v1/credits/add"), body,
	     [this](const QJsonObject& o) { emit creditKeyRedeemed(o.toVariantMap()); });
}

void BackendClient::cancelUpdateDownload() {
	if (m_downloadReply) {
		QNetworkReply *r = m_downloadReply;
		m_downloadReply = nullptr; // clear first — abort() can re-enter finished()
		r->abort();
		r->deleteLater();
	}
	if (m_updateDownloading || m_updateProgress != 0) {
		m_updateDownloading = false;
		m_updateProgress = 0;
		emit updateProgressChanged();
	}
}

void BackendClient::downloadUpdate() {
	if (m_updateDownloading || m_updateCheckInFlight)
		return;
	// Set synchronously: a double-click before the manifest reply arrives must
	// not start two concurrent downloads to the same destination file.
	m_updateCheckInFlight = true;
	// First query the update manifest so we know the URL
	post(QStringLiteral("/api/v1/update/check"), {}, [this](const QJsonObject& o) {
		m_updateCheckInFlight = false;
		const QString url = o.value(QStringLiteral("download_url"))
		                        .toString(o.value(QStringLiteral("url")).toString());
		if (url.isEmpty()) {
			emit updateDownloadFailed(QStringLiteral("No download URL available"));
			return;
		}
		// Updates must come over TLS only — a plaintext URL lets a MITM serve a
		// malicious binary; the app never executes it, but still.
		const QUrl qurl(url);
		if (qurl.scheme() != QLatin1String("https") || !isTrustedDownloadHost(qurl.host())) {
			emit updateDownloadFailed(QStringLiteral("Refusing untrusted update download URL"));
			return;
		}
		constexpr qint64 kMaxUpdateBytes = 512LL * 1024 * 1024; // hard cap: 512 MiB
		const QString dir = QStandardPaths::writableLocation(QStandardPaths::DownloadLocation);
		// Sanitize the filename: fileName() can keep backslashes (Windows path
		// traversal) — reject those and any ".." segment, keep writes inside dir.
		QString fname = qurl.fileName();
		if (fname.isEmpty() || fname.contains(QLatin1Char('\\')) || fname.contains(QLatin1String("..")))
			fname = QStringLiteral("livemorph-update.tmp");
		m_updateDownloadedPath = dir + QStringLiteral("/") + fname;
		QFile::remove(m_updateDownloadedPath);
		const QString outPath = m_updateDownloadedPath; // capture: a newer attempt may overwrite the member

		m_updateDownloading = true;
		m_updateProgress = 0;
		emit updateProgressChanged();

		QNetworkRequest dlReq(qurl);
		dlReq.setTransferTimeout(600000); // 10 min — large update binaries on slow links
		// Manual redirects: the trusted-host check on the original URL is
		// defeated if Qt silently follows an https→https cross-host redirect,
		// so never auto-follow on the update download.
		dlReq.setAttribute(QNetworkRequest::RedirectPolicyAttribute, QNetworkRequest::ManualRedirectPolicy);
		m_downloadReply = m_nam.get(dlReq);
		QFile *f = new QFile(outPath, this);
		if (!f->open(QIODevice::WriteOnly)) {
			emit updateDownloadFailed(tr("Could not open destination file"));
			cancelUpdateDownload();
			f->deleteLater();
			return;
		}

		QNetworkReply *reply = m_downloadReply;
		// Enforce the byte cap on the raw stream too — downloadProgress can
		// lag readyRead on fast local mirrors.
		auto *received = new qint64(0);
		connect(reply, &QNetworkReply::readyRead, this, [reply, f, received, outPath, this]() {
			const QByteArray chunk = reply->readAll();
			*received += chunk.size();
			if (*received > kMaxUpdateBytes) {
				emit updateDownloadFailed(tr("Update file exceeds the 512 MiB cap — aborted"));
				cancelUpdateDownload();
				QFile::remove(outPath);
				return;
			}
			if (f->write(chunk) != chunk.size())
				qWarning() << "BackendClient: short write to" << outPath;
		});
		connect(m_downloadReply, &QNetworkReply::downloadProgress, this,
		        [this, outPath](qint64 got, qint64 total) {
			if (got > kMaxUpdateBytes) {
				emit updateDownloadFailed(tr("Update file exceeds the 512 MiB cap — aborted"));
				cancelUpdateDownload();
				QFile::remove(outPath);
				return;
			}
			if (total > 0) {
				const int pct = int((got * 100) / total);
				if (pct != m_updateProgress) {
					m_updateProgress = pct;
					emit updateProgressChanged();
				}
			}
		});
		connect(reply, &QNetworkReply::finished, this, [this, f, reply, outPath, received]() {
			// One QFile per attempt leaked until app exit — close AND free it
			// on every exit path. Capture `reply`: cancelUpdateDownload() nulls
			// the member, so reading m_downloadReply here could deref null.
			f->close();
			f->deleteLater();
			delete received;
			const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
			if (reply->error() != QNetworkReply::NoError) {
				emit updateDownloadFailed(reply->errorString());
				cancelUpdateDownload();
				QFile::remove(outPath);
				return;
			}
			if (status >= 300) {
				emit updateDownloadFailed(tr("HTTP %1").arg(status));
				cancelUpdateDownload();
				QFile::remove(outPath);
				return;
			}
			emit updateDownloaded(outPath);
			cancelUpdateDownload();
		});
	});
}
