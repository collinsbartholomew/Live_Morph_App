#include "BackendClient.h"
#include "core/DeviceIdentity.h"
#include <QClipboard>
#include <QDesktopServices>
#include <QFileInfo>
#include <QGuiApplication>
#include <QJsonArray>
#include <QJsonDocument>
#include <QJsonObject>
#include <QNetworkRequest>
#include <QStandardPaths>
#include <QTimer>
#include <QFile>
#include <QDateTime>
#include <functional>

BackendClient::BackendClient(QObject* parent) : QObject(parent) {
	m_nam.setTransferTimeout(30000);

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
	emit baseUrlChanged();
	ping();
}

void BackendClient::setAccessToken(const QString& token) {
	m_accessToken = token;
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
	connect(reply, &QNetworkReply::finished, this, [this, reply, path, ok, retriedAuth]() {
		reply->deleteLater();
		const QByteArray raw = reply->readAll();
		const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
		const bool netErr = reply->error() != QNetworkReply::NoError &&
		                    reply->error() != QNetworkReply::ContentNotFoundError &&
		                    reply->error() != QNetworkReply::AuthenticationRequiredError &&
		                    reply->error() != QNetworkReply::ContentAccessDenied;
		// Treat pure transport failures as offline; HTTP 4xx/5xx still mean host is reachable
		if (netErr && status == 0) {
			if (m_reachable) {
				m_reachable = false;
				emit reachableChanged();
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
		if (status == 401)
			emit authenticationExpired();
		if (status >= 400 || (reply->error() != QNetworkReply::NoError && status >= 400)) {
			QString err = reply->errorString();
			const auto doc = QJsonDocument::fromJson(raw);
			if (doc.isObject()) {
				const QString m = doc.object().value(QStringLiteral("message")).toString();
				if (!m.isEmpty())
					err = m;
			}
			if (!m_reachable) {
				m_reachable = true;
				emit reachableChanged();
			}
			emit requestFailed(path, err.isEmpty() ? tr("HTTP %1").arg(status) : err);
			return;
		}
		if (!m_reachable) {
			m_reachable = true;
			emit reachableChanged();
		}
		const auto doc = QJsonDocument::fromJson(raw);
		ok(doc.isObject() ? doc.object() : QJsonObject{});
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
	connect(reply, &QNetworkReply::finished, this, [this, reply, path, body, ok, retriedAuth]() {
		reply->deleteLater();
		const QByteArray raw = reply->readAll();
		const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
		const bool transportFail = (status == 0 && reply->error() != QNetworkReply::NoError);
		if (transportFail) {
			if (m_reachable) {
				m_reachable = false;
				emit reachableChanged();
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
		if (status == 401)
			emit authenticationExpired();
		if (reply->error() != QNetworkReply::NoError || status >= 400) {
			QString err = reply->errorString();
			const auto doc = QJsonDocument::fromJson(raw);
			if (doc.isObject()) {
				const auto o = doc.object();
				const QString m = o.value(QStringLiteral("message")).toString();
				if (!m.isEmpty())
					err = m;
				else {
					const QString e = o.value(QStringLiteral("error")).toString();
					if (!e.isEmpty())
						err = e;
				}
			}
			if (!m_reachable) {
				m_reachable = true;
				emit reachableChanged();
			}
			emit requestFailed(path, err.isEmpty() ? tr("HTTP %1").arg(status) : err);
			return;
		}
		if (!m_reachable) {
			m_reachable = true;
			emit reachableChanged();
		}
		const auto doc = QJsonDocument::fromJson(raw);
		ok(doc.isObject() ? doc.object() : QJsonObject{});
	});
}

void BackendClient::fetchPaymentPackages() {
	QNetworkRequest req = makeRequest(QStringLiteral("/api/v1/payments/packages"));
	req.setTransferTimeout(15000);
	auto* reply = m_nam.get(req);
	connect(reply, &QNetworkReply::finished, this, [this, reply]() {
		reply->deleteLater();
		const QByteArray raw = reply->readAll();
		const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
		const bool transportFail = (status == 0 && reply->error() != QNetworkReply::NoError);
		if (transportFail) {
			// Same reachability semantics as get()/post(): transport failure ⇒
			// offline (these previously left m_reachable stale-true).
			if (m_reachable) {
				m_reachable = false;
				emit reachableChanged();
			}
			emit requestFailed(QStringLiteral("/api/v1/payments/packages"), reply->errorString());
			return;
		}
		if (status >= 400) {
			emit requestFailed(QStringLiteral("/api/v1/payments/packages"), reply->errorString());
			return;
		}
		if (!m_reachable) {
			m_reachable = true;
			emit reachableChanged();
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
		emit paymentPackagesReceived(list);
		m_paymentPackages = list;
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
	get(QStringLiteral("/api/v1/payments/orders/%1").arg(orderId), [this](const QJsonObject& o) {
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
	put(QStringLiteral("/api/v1/characters/mine/%1").arg(id), body, [this](const QJsonObject& o) {
		emit userCharacterUpdated(o.value(QStringLiteral("character")).toObject().toVariantMap());
	});
}

void BackendClient::deleteUserCharacter(const QString& id) {
	del(QStringLiteral("/api/v1/characters/mine/%1").arg(id),
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
	connect(reply, &QNetworkReply::finished, this, [this, reply, path, body, ok, retriedAuth]() {
		reply->deleteLater();
		const QByteArray raw = reply->readAll();
		const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
		const bool transportFail = (status == 0 && reply->error() != QNetworkReply::NoError);
		if (transportFail) {
			if (m_reachable) {
				m_reachable = false;
				emit reachableChanged();
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
		if (status == 401)
			emit authenticationExpired();
		if (reply->error() != QNetworkReply::NoError || status >= 400) {
			QString err = reply->errorString();
			const auto doc = QJsonDocument::fromJson(raw);
			if (doc.isObject()) {
				const auto o = doc.object();
				const QString m = o.value(QStringLiteral("message")).toString();
				if (!m.isEmpty())
					err = m;
			}
			if (!m_reachable) {
				m_reachable = true;
				emit reachableChanged();
			}
			emit requestFailed(path, err.isEmpty() ? tr("HTTP %1").arg(status) : err);
			return;
		}
		if (!m_reachable) {
			m_reachable = true;
			emit reachableChanged();
		}
		const auto doc = QJsonDocument::fromJson(raw);
		ok(doc.isObject() ? doc.object() : QJsonObject{});
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
	connect(reply, &QNetworkReply::finished, this, [this, reply, path, ok, retriedAuth]() {
		reply->deleteLater();
		const QByteArray raw = reply->readAll();
		const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
		const bool transportFail = (status == 0 && reply->error() != QNetworkReply::NoError);
		if (transportFail) {
			if (m_reachable) {
				m_reachable = false;
				emit reachableChanged();
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
		if (status == 401)
			emit authenticationExpired();
		if (reply->error() != QNetworkReply::NoError || status >= 400) {
			QString err = reply->errorString();
			const auto doc = QJsonDocument::fromJson(raw);
			if (doc.isObject()) {
				const auto o = doc.object();
				const QString m = o.value(QStringLiteral("message")).toString();
				if (!m.isEmpty())
					err = m;
			}
			if (!m_reachable) {
				m_reachable = true;
				emit reachableChanged();
			}
			emit requestFailed(path, err.isEmpty() ? tr("HTTP %1").arg(status) : err);
			return;
		}
		if (!m_reachable) {
			m_reachable = true;
			emit reachableChanged();
		}
		const auto doc = QJsonDocument::fromJson(raw);
		ok(doc.isObject() ? doc.object() : QJsonObject{});
	});
}

// Wait for AuthManager to rotate the access token (it calls setAccessToken on
// refresh, triggered by authenticationExpired) and re-issue the request once.
// Polls every 200ms; gives up after 10s and fires giveUp so callers still see
// a terminal failure instead of hanging.
void BackendClient::retryOnTokenRotation(const std::function<void()>& reissue,
                                         const std::function<void()>& giveUp) {
	const QString staleToken = m_accessToken;
	auto* poll = new QTimer(this);
	poll->setInterval(200);
	connect(poll, &QTimer::timeout, this, [this, poll, staleToken, reissue]() {
		if (!m_accessToken.isEmpty() && m_accessToken != staleToken) {
			poll->stop();
			poll->deleteLater();
			reissue();
		}
	});
	// Bounded wait: a dead refresh must not leak the poll timer forever.
	QTimer* killer = new QTimer(this);
	killer->setSingleShot(true);
	connect(killer, &QTimer::timeout, this, [poll, giveUp, killer]() {
		killer->deleteLater();
		if (poll->isActive()) {
			poll->stop();
			poll->deleteLater();
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
	// Electron initPayment: 5 per 5 minutes.
	if (path.startsWith(QLatin1String("/api/v1/payments/orders")))
		return m_payBucket;
	return m_defaultBucket;
}

void BackendClient::ping() {
	get(QStringLiteral("/api/v1/health"), [this](const QJsonObject& obj) {
		if (!m_reachable) {
			m_reachable = true;
			emit reachableChanged();
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

void BackendClient::fetchAppVersion() {
	ping();
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
		if (!url.isEmpty())
			openExternal(url);
		emit updateCheckResult(o.toVariantMap());
	});
}

void BackendClient::fetchCatalog() {
	QNetworkRequest req = makeRequest(QStringLiteral("/api/v1/catalog"));
	req.setTransferTimeout(15000);
	auto* reply = m_nam.get(req);
	connect(reply, &QNetworkReply::finished, this, [this, reply]() {
		reply->deleteLater();
		const QByteArray raw = reply->readAll();
		const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
		const bool transportFail = (status == 0 && reply->error() != QNetworkReply::NoError);
		if (transportFail) {
			if (m_reachable) {
				m_reachable = false;
				emit reachableChanged();
			}
			emit requestFailed(QStringLiteral("/api/v1/catalog"), reply->errorString());
			return;
		}
		if (status >= 400) {
			emit requestFailed(QStringLiteral("/api/v1/catalog"), reply->errorString());
			return;
		}
		if (!m_reachable) {
			m_reachable = true;
			emit reachableChanged();
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
	// Allow web + our deep link scheme only
	if (scheme != QLatin1String("http") && scheme != QLatin1String("https") &&
	    scheme != QLatin1String("livemorph") && scheme != QLatin1String("mailto")) {
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
		// Only adopt bootstrap api_base if LIVEMORPH_API_URL is not set.
		// The env var is the single source of truth for deployment overrides.
		if (qgetenv("LIVEMORPH_API_URL").isEmpty()) {
			QString api = ep.value(QStringLiteral("api_base")).toString();
			if (!api.isEmpty())
				setBaseUrl(api);
		}
		m_balanceWsUrl = ep.value(QStringLiteral("balance_ws")).toString();
		m_realtimeWsUrl = ep.value(QStringLiteral("realtime_ws")).toString();
		m_configRevision = o.value(QStringLiteral("config_revision")).toString();
		// Cache credit-rate config from bootstrap
		const QJsonObject credits = o.value(QStringLiteral("credits")).toObject();
		m_creditsPerSecond = credits.value(QStringLiteral("credits_per_second")).toDouble(0.0);
		m_minCreditsToStart = credits.value(QStringLiteral("min_credits_to_start")).toDouble(0.0);
		m_hdMultiplier = credits.value(QStringLiteral("hd_multiplier")).toDouble(1.0);
		// Maintenance flag from bootstrap (replaces separate /dashboard-maintenance call)
		const QJsonObject ui = o.value(QStringLiteral("ui")).toObject();
		const bool maint = ui.value(QStringLiteral("maintenance")).toBool(false);
		if (m_maintenance != maint) { m_maintenance = maint; emit maintenanceChanged(); }
		emit bootstrapChanged();
		emit bootstrapLoaded(m_lastBootstrap);
	});
}

void BackendClient::fetchDownloads() {
	get(QStringLiteral("/api/v1/downloads/list"), [this](const QJsonObject& o) {
		const QVariantList items = o.value(QStringLiteral("downloads")).toArray().toVariantList();
		if (m_downloadsModel == items)
			return;
		m_downloadsModel = items;
		emit downloadsChanged();
	});
}

void BackendClient::redeemCreditKey(const QString& key) {
	QJsonObject body{{QStringLiteral("credit_key"), key}};
	post(QStringLiteral("/api/v1/credits/add"), body,
	     [this](const QJsonObject& o) { emit creditKeyRedeemed(o.toVariantMap()); });
}

void BackendClient::cancelUpdateDownload() {
	if (m_downloadReply) {
		m_downloadReply->abort();
		m_downloadReply->deleteLater();
		m_downloadReply = nullptr;
	}
	if (m_updateDownloading || m_updateProgress != 0) {
		m_updateDownloading = false;
		m_updateProgress = 0;
		emit updateProgressChanged();
	}
}

void BackendClient::downloadUpdate() {
	if (m_updateDownloading)
		return;
	// First query the update manifest so we know the URL
	post(QStringLiteral("/api/v1/update/check"), {}, [this](const QJsonObject& o) {
		const QString url = o.value(QStringLiteral("download_url"))
		                        .toString(o.value(QStringLiteral("url")).toString());
		if (url.isEmpty()) {
			emit updateDownloadFailed(QStringLiteral("No download URL available"));
			return;
		}
		const QString dir = QStandardPaths::writableLocation(QStandardPaths::DownloadLocation);
		const QString fname = QUrl(url).fileName().isEmpty()
		                        ? QStringLiteral("livemorph-update.tmp") : QUrl(url).fileName();
		m_updateDownloadedPath = dir + QStringLiteral("/") + fname;
		QFile::remove(m_updateDownloadedPath);

		m_updateDownloading = true;
		m_updateProgress = 0;
		emit updateProgressChanged();

		m_downloadReply = m_nam.get(QNetworkRequest(QUrl(url)));
		QFile *f = new QFile(m_updateDownloadedPath, this);
		if (!f->open(QIODevice::WriteOnly)) {
			emit updateDownloadFailed(tr("Could not open destination file"));
			cancelUpdateDownload();
			f->deleteLater();
			return;
		}

		connect(m_downloadReply, &QNetworkReply::readyRead, this, [this, f]() {
			f->write(m_downloadReply->readAll());
		});
		connect(m_downloadReply, &QNetworkReply::downloadProgress, this,
		        [this](qint64 got, qint64 total) {
			if (total > 0) {
				const int pct = int((got * 100) / total);
				if (pct != m_updateProgress) {
					m_updateProgress = pct;
					emit updateProgressChanged();
				}
			}
		});
		connect(m_downloadReply, &QNetworkReply::finished, this, [this, f]() {
			// One QFile per attempt leaked until app exit — close AND free it
			// on every exit path.
			f->close();
			f->deleteLater();
			const int status = m_downloadReply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
			if (m_downloadReply->error() != QNetworkReply::NoError) {
				emit updateDownloadFailed(m_downloadReply->errorString());
				cancelUpdateDownload();
				QFile::remove(m_updateDownloadedPath);
				return;
			}
			if (status >= 400) {
				emit updateDownloadFailed(tr("HTTP %1").arg(status));
				cancelUpdateDownload();
				QFile::remove(m_updateDownloadedPath);
				return;
			}
			emit updateDownloaded(m_updateDownloadedPath);
			cancelUpdateDownload();
		});
	});
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          