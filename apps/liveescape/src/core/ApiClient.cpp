#include "ApiClient.h"
#include "WebSocketClient.h"

#include <functional>
#include <QJsonArray>
#include <QJsonDocument>
#include <QJsonObject>
#include <QNetworkCookie>
#include <QNetworkCookieJar>
#include <QNetworkReply>
#include <QNetworkRequest>
#include <QUrl>
#include <QUrlQuery>
#include <QTimer>
#if SS_HAS_WEBSOCKETS

#endif

namespace {
constexpr auto kDefaultBase = "http://127.0.0.1:3874";
}

ApiClient::ApiClient(QObject *parent)
    : QObject(parent)
    , m_baseUrl(QString::fromLatin1(kDefaultBase))
{
    m_nam.setCookieJar(new QNetworkCookieJar(&m_nam));
    connect(this, &ApiClient::refreshSucceeded, this, &ApiClient::onRefreshSucceededHandler);
    connect(this, &ApiClient::refreshFailed, this, &ApiClient::onRefreshFailedHandler);
}

QString ApiClient::wsBaseUrl() const
{
    if (!m_wsUrlOverride.isEmpty())
        return m_wsUrlOverride;
    // Derive from HTTP base when server has not yet pushed bootstrap
    QUrl u(m_baseUrl);
    const QString scheme = (u.scheme() == QLatin1String("https")) ? QStringLiteral("wss")
                                                                   : QStringLiteral("ws");
    QString host = u.host();
    if (host.isEmpty())
        host = QStringLiteral("127.0.0.1");
    const int port = u.port();
    if (port > 0)
        return QStringLiteral("%1://%2:%3").arg(scheme, host).arg(port);
    return QStringLiteral("%1://%2").arg(scheme, host);
}

void ApiClient::setBaseUrl(const QString &url)
{
    QString cleaned = url.trimmed();
    while (cleaned.endsWith(QLatin1Char('/')))
        cleaned.chop(1);
    if (cleaned.isEmpty())
        return;
    if (!cleaned.startsWith(QLatin1String("http://")) && !cleaned.startsWith(QLatin1String("https://")))
        cleaned = QStringLiteral("http://") + cleaned;
    const QUrl parsed(cleaned);
    const QString host = parsed.host();
    const bool loopback = host == QLatin1String("127.0.0.1")
                          || host == QLatin1String("localhost")
                          || host == QLatin1String("::1");
    if (!loopback && parsed.scheme() == QLatin1String("http"))
        cleaned.replace(QLatin1String("http://"), QLatin1String("https://"));
    if (cleaned == m_baseUrl)
        return;
    m_baseUrl = cleaned;
    emit baseUrlChanged();
}

void ApiClient::setLicenseCredentials(const QString &accessKey, const QString &userId,
                                      const QString &deviceId)
{
    m_accessKey = accessKey;
    m_userId = userId;
    if (!deviceId.trimmed().isEmpty())
        m_deviceId = deviceId.trimmed();
}

void ApiClient::setDeviceId(const QString &deviceId)
{
    if (!deviceId.trimmed().isEmpty())
        m_deviceId = deviceId.trimmed();
}

void ApiClient::clearLicenseCredentials()
{
    m_accessKey.clear();
    m_userId.clear();
    m_deviceId.clear();
}

void ApiClient::setBearerToken(const QString &accessToken)
{
    m_bearerToken = accessToken.trimmed();
}

void ApiClient::clearBearerToken()
{
    m_bearerToken.clear();
}

void ApiClient::beginRequest()
{
    if (++m_busyCount == 1)
        emit busyChanged();
}

void ApiClient::endRequest()
{
    if (m_busyCount > 0 && --m_busyCount == 0)
        emit busyChanged();
}

QVariantMap ApiClient::toMap(const QJsonObject &o) { return o.toVariantMap(); }

QString ApiClient::extractError(const QJsonObject &o, const QString &fallback)
{
    if (o.contains(QStringLiteral("error")))
        return o.value(QStringLiteral("error")).toString(fallback);
    if (o.contains(QStringLiteral("message")))
        return o.value(QStringLiteral("message")).toString(fallback);
    return fallback;
}

QNetworkRequest ApiClient::makeRequest(const QString &path, bool licenseAuth) const
{
    QNetworkRequest req{QUrl(m_baseUrl + path)};
    req.setHeader(QNetworkRequest::ContentTypeHeader, QStringLiteral("application/json"));
    req.setRawHeader("Accept", "application/json");
    req.setRawHeader("X-Frontend-Id", "liveescape");
    req.setRawHeader("X-Client-Product", "liveescape");
    req.setTransferTimeout(20000);
    // Unified backend JWT (from /auth/login|signup)
    if (!m_bearerToken.isEmpty())
        req.setRawHeader("Authorization", QByteArray("Bearer ") + m_bearerToken.toUtf8());
    // Device id on every call so activation/streaming can bind consistently
    if (!m_deviceId.isEmpty())
        req.setRawHeader("x-device-id", m_deviceId.toUtf8());
    if (licenseAuth) {
        if (!m_accessKey.isEmpty())
            req.setRawHeader("x-access-key", m_accessKey.toUtf8());
        if (!m_userId.isEmpty())
            req.setRawHeader("x-user-id", m_userId.toUtf8());
    }
    return req;
}

void ApiClient::handleReply(QNetworkReply *reply, const OkFn &onOk, const ErrFn &onErr,
                            const RetryFn &retry)
{
    reply->deleteLater();
    endRequest();
    const QByteArray raw = reply->readAll();

    // 401 interceptor: attempt one token refresh then RE-ISSUE the original
    // request once. Before this fix the request was never retried, so any call
    // hitting a 401 would silently hang the UI waiting for a callback.
    if (reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt() == 401
        && !m_refreshToken.isEmpty() && !m_refreshInFlight) {
        if (m_retryInProgress) {
            // The retried request 401'd again — surface the error instead of looping.
            m_retryInProgress = false;
            m_refreshInFlight = false;
            onErr(QStringLiteral("Authentication failed"));
            return;
        }
        if (!m_pendingRetry) {
            m_refreshInFlight = true;
            m_pendingRetry = true;
            m_retryInProgress = true;
            m_retryFn = retry;
            m_retryErr = onErr;
            refreshSession();
        } else {
            onErr(QStringLiteral("Authentication failed"));
        }
        return;
    }
    m_refreshInFlight = false;

    if (reply->error() != QNetworkReply::NoError) {
        QJsonDocument doc = QJsonDocument::fromJson(raw);
        if (doc.isObject()) {
            onErr(extractError(doc.object(), reply->errorString()));
        } else {
            onErr(reply->errorString());
        }
        return;
    }
    QJsonDocument doc = QJsonDocument::fromJson(raw);
    if (!doc.isObject()) {
        // Some endpoints may return arrays
        if (doc.isArray()) {
            QJsonObject wrap;
            wrap.insert(QStringLiteral("_array"), doc.array());
            onOk(wrap);
            return;
        }
        onErr(QStringLiteral("Invalid server response"));
        return;
    }
    const QJsonObject obj = doc.object();
    // Backend success dialects: {ok:true,...}, {success:true,...}, or plain data
    // (e.g. {found:false}). Error dialect: {error:"...",message:"..."} or an
    // explicit ok/success=false. Presence of "message" alone is NOT an error
    // (password-reset and support tickets return {ok:true,message:"..."}).
    const bool hasErrorField = obj.contains(QStringLiteral("error"));
    const bool okExplicitlyFalse = obj.contains(QStringLiteral("ok"))
                                   && !obj.value(QStringLiteral("ok")).toBool();
    const bool successExplicitlyFalse = obj.contains(QStringLiteral("success"))
                                        && !obj.value(QStringLiteral("success")).toBool();
    if (hasErrorField || okExplicitlyFalse || successExplicitlyFalse) {
        onErr(extractError(obj, QStringLiteral("Request failed")));
        return;
    }
    onOk(obj);
}

void ApiClient::onRefreshSucceededHandler(const QVariantMap &payload)
{
    Q_UNUSED(payload);
    m_refreshInFlight = false;
    m_pendingRetry = false;
    if (auto fn = std::move(m_retryFn)) {
        m_retryFn = {};
        fn();
    }
}

void ApiClient::onRefreshFailedHandler(const QString &message)
{
    m_refreshInFlight = false;
    m_pendingRetry = false;
    m_retryInProgress = false;
    m_retryFn = {};
    if (auto fn = std::move(m_retryErr)) {
        m_retryErr = {};
        fn(message);
    }
}

void ApiClient::getJson(const QString &path, bool licenseAuth, const OkFn &onOk, const ErrFn &onErr)
{
    beginRequest();
    QNetworkReply *reply = m_nam.get(makeRequest(path, licenseAuth));
    connect(reply, &QNetworkReply::finished, this, [this, reply, path, licenseAuth, onOk, onErr]() {
        handleReply(reply, onOk, onErr, [this, path, licenseAuth, onOk, onErr]() {
            beginRequest();
            QNetworkReply *r = m_nam.get(makeRequest(path, licenseAuth));
            connect(r, &QNetworkReply::finished, this, [this, r, onOk, onErr]() {
                handleReply(r, onOk, onErr);
            });
        });
    });
}

void ApiClient::postJson(const QString &path, const QJsonObject &body, bool licenseAuth,
                         const OkFn &onOk, const ErrFn &onErr)
{
    beginRequest();
    QNetworkReply *reply = m_nam.post(makeRequest(path, licenseAuth),
                                      QJsonDocument(body).toJson(QJsonDocument::Compact));
    connect(reply, &QNetworkReply::finished, this, [this, reply, path, body, licenseAuth, onOk, onErr]() {
        handleReply(reply, onOk, onErr, [this, path, body, licenseAuth, onOk, onErr]() {
            beginRequest();
            QNetworkReply *r = m_nam.post(makeRequest(path, licenseAuth),
                                          QJsonDocument(body).toJson(QJsonDocument::Compact));
            connect(r, &QNetworkReply::finished, this, [this, r, onOk, onErr]() {
                handleReply(r, onOk, onErr);
            });
        });
    });
}


void ApiClient::setRefreshToken(const QString &refreshToken)
{
    m_refreshToken = refreshToken.trimmed();
}

void ApiClient::refreshSession()
{
    if (m_refreshToken.isEmpty()) {
        emit refreshFailed(QStringLiteral("no refresh token"));
        return;
    }
    QJsonObject body{{QStringLiteral("refresh_token"), m_refreshToken}};
    // Shared LM-style refresh on unified host
    postJson(QStringLiteral("/api/v1/auth/refresh"), body, false,
             [this](const QJsonObject &o) {
                 const QString tok = o.value(QStringLiteral("access_token")).toString();
                 if (!tok.isEmpty())
                     setBearerToken(tok);
                 const QString rt = o.value(QStringLiteral("refresh_token")).toString();
                 if (!rt.isEmpty())
                     setRefreshToken(rt);
                 emit refreshSucceeded(toMap(o));
             },
             [this](const QString &e) { emit refreshFailed(e); });
}

// ── Auth ──────────────────────────────────────────────────

void ApiClient::login(const QString &email, const QString &password, const QString &deviceId)
{
    QJsonObject body{{QStringLiteral("email"), email},
                     {QStringLiteral("password"), password},
                     {QStringLiteral("device_id"), deviceId}};
    postJson(QStringLiteral("/api/v1/auth/login"), body, false,
             [this](const QJsonObject &o) {
                 const QString tok = o.value(QStringLiteral("access_token")).toString();
                 if (!tok.isEmpty())
                     setBearerToken(tok);
                 const QString rt = o.value(QStringLiteral("refresh_token")).toString();
                 if (!rt.isEmpty())
                     setRefreshToken(rt);
                 emit loginSucceeded(toMap(o));
             },
             [this](const QString &e) { emit loginFailed(e); });
}

void ApiClient::registerUser(const QString &name, const QString &email, const QString &password,
                             const QString &deviceId, bool acceptedTerms,
                             const QString &phone, const QString &referralCode)
{
    QJsonObject body{{QStringLiteral("name"), name},
                     {QStringLiteral("email"), email},
                     {QStringLiteral("password"), password},
                     {QStringLiteral("device_id"), deviceId},
                     {QStringLiteral("accepted_terms"), acceptedTerms}};
    if (!phone.isEmpty())
        body.insert(QStringLiteral("phone"), phone);
    if (!referralCode.isEmpty())
        body.insert(QStringLiteral("referral_code"), referralCode.toUpper());

    postJson(QStringLiteral("/api/v1/auth/register"), body, false,
             [this](const QJsonObject &o) {
                 const QString tok = o.value(QStringLiteral("access_token")).toString();
                 if (!tok.isEmpty())
                     setBearerToken(tok);
                 const QString rt = o.value(QStringLiteral("refresh_token")).toString();
                 if (!rt.isEmpty())
                     setRefreshToken(rt);
                 emit registerSucceeded(toMap(o));
             },
             [this](const QString &e) { emit registerFailed(e); });
}

void ApiClient::logout()
{
    // Backend requires {refresh_token} to revoke the session server-side
    // (auth.rs RefreshBody). Empty body yields 400 and leaves the 30-day
    // refresh token live in the DB.
    QJsonObject body;
    if (!m_refreshToken.isEmpty())
        body.insert(QStringLiteral("refresh_token"), m_refreshToken);
    postJson(QStringLiteral("/api/v1/auth/logout"), body, false,
             [this](const QJsonObject &) {
                 clearBearerToken();
                 emit logoutSucceeded();
             },
             [this](const QString &) {
                 clearBearerToken();
                 emit logoutSucceeded();
             });
}

void ApiClient::logoutAll()
{
    postJson(QStringLiteral("/api/v1/auth/logout_all"), {}, false,
             [this](const QJsonObject &) { emit logoutSucceeded(); },
             [this](const QString &) { emit logoutSucceeded(); });
}

void ApiClient::requestPasswordReset(const QString &email)
{
    QJsonObject body{{QStringLiteral("email"), email}};
    postJson(QStringLiteral("/api/v1/auth/password-reset-request"), body, false,
             [this](const QJsonObject &) {
                 emit passwordResetRequested();
             },
             [this](const QString &e) { emit networkError(e); });
}
void ApiClient::completePasswordReset(const QString &token, const QString &newPassword, const QString &email)
{
    QJsonObject body{{QStringLiteral("token"), token},
                     {QStringLiteral("password"), newPassword},
                     {QStringLiteral("email"), email}};
    postJson(QStringLiteral("/api/v1/auth/password-reset"), body, false,
             [this](const QJsonObject &) {
                 emit passwordResetSucceeded();
             },
             [this](const QString &e) { emit networkError(e); });
}



// ── License ───────────────────────────────────────────────

void ApiClient::validateKey(const QString &accessKey, const QString &deviceId, const QString &userId)
{
    QJsonObject body{{QStringLiteral("access_key"), accessKey},
                     {QStringLiteral("key"), accessKey},
                     {QStringLiteral("device_id"), deviceId}};
    if (!userId.isEmpty())
        body.insert(QStringLiteral("user_id"), userId);

    postJson(QStringLiteral("/api/v1/keys/validate"), body, true,
             [this, accessKey, deviceId](const QJsonObject &o) {
                 // Only set credentials after server confirms validity
                 m_accessKey = accessKey;
                 m_deviceId = deviceId;
                 emit keyValidated(toMap(o));
             },
             [this](const QString &e) { emit keyValidationFailed(e); });
}

// ── Credits ───────────────────────────────────────────────

void ApiClient::lookupKey(const QString &accessKey)
{
    QJsonObject body{{QStringLiteral("access_key"), accessKey}};
    postJson(QStringLiteral("/api/v1/keys/lookup"), body, false,
             [this](const QJsonObject &o) { emit keyValidated(toMap(o)); },
             [this](const QString &e) { emit keyValidationFailed(e); });
}


void ApiClient::fetchCredits()
{
    getJson(QStringLiteral("/api/v1/credits/balance"), true,
            [this](const QJsonObject &o) { emit creditsLoaded(toMap(o)); },
            [this](const QString &e) { emit creditsFailed(e); });
}

void ApiClient::burnCredits(double credits)
{
    QJsonObject body{{QStringLiteral("amount"), credits}};
    postJson(QStringLiteral("/api/v1/credits/burn"), body, true,
             [this](const QJsonObject &o) { emit creditsBurned(toMap(o)); },
             [this](const QString &e) { emit creditsFailed(e); });
}

// ── Settings ──────────────────────────────────────────────

void ApiClient::addCredits(double amount)
{
    QJsonObject body{{QStringLiteral("amount"), amount}};
    postJson(QStringLiteral("/api/v1/credits/add"), body, true,
             [this](const QJsonObject &o) { emit creditsLoaded(toMap(o.value(QStringLiteral("balance")).toObject().isEmpty() ? o : o.value(QStringLiteral("balance")).toObject())); },
             [this](const QString &e) { emit creditsFailed(e); });
}


void ApiClient::resolveApiEndpoint()
{
    // Prefer full bootstrap (authoritative endpoints); fall back to legacy path
    fetchBootstrap();
}

void ApiClient::fetchBootstrap()
{
    // Try unified path first, then legacy api-endpoint resolver
    getJson(QStringLiteral("/api/v1/bootstrap"), false,
            [this](const QJsonObject &o) { applyBootstrap(o); },
            [this](const QString &) {
                getJson(QStringLiteral("/api/v1/settings/api-endpoint"), false,
                        [this](const QJsonObject &o) {
                            QString url = o.value(QStringLiteral("api_base")).toString();
                            if (url.isEmpty())
                                url = o.value(QStringLiteral("url")).toString();
                            if (!url.isEmpty())
                                setBaseUrl(url);
                            emit apiEndpointResolved(m_baseUrl);
                        },
                        [this](const QString &) { emit apiEndpointResolved(m_baseUrl); });
            });
}

void ApiClient::applyBootstrap(const QJsonObject &o)
{
    m_lastBootstrap = toMap(o);
    const QJsonObject ep = o.value(QStringLiteral("endpoints")).toObject();
    QString api = ep.value(QStringLiteral("api_base")).toString();
    if (api.isEmpty())
        api = o.value(QStringLiteral("api_base")).toString();
    if (!api.isEmpty())
        setBaseUrl(api);

    QString bal = ep.value(QStringLiteral("balance_ws")).toString();
    if (!bal.isEmpty()) {
        // store origin only for wsBaseUrl()
        QUrl u(bal);
        m_wsUrlOverride = QStringLiteral("%1://%2").arg(u.scheme(), u.authority());
        if (u.port() > 0)
            m_wsUrlOverride = QStringLiteral("%1://%2:%3").arg(u.scheme(), u.host()).arg(u.port());
    }
    m_realtimeWsUrl = ep.value(QStringLiteral("realtime_ws_alt")).toString();
    if (m_realtimeWsUrl.isEmpty())
        m_realtimeWsUrl = ep.value(QStringLiteral("realtime_ws")).toString();

    m_configRevision = o.value(QStringLiteral("config_revision")).toString();
    emit bootstrapChanged();
    emit bootstrapLoaded(m_lastBootstrap);
    emit apiEndpointResolved(m_baseUrl);
}

void ApiClient::fetchFeatureFlags()
{
    getJson(QStringLiteral("/api/v1/public/feature-flags"), false,
            [this](const QJsonObject &o) {
                // Backend wraps the flag map: {flags:{...},product}. Unwrap so
                // consumers can read top-level keys (referral_enabled etc.).
                const QJsonObject flags = o.value(QStringLiteral("flags")).toObject();
                emit featureFlagsLoaded(flags.isEmpty() ? toMap(o) : toMap(flags));
            },
            [this](const QString &) { emit featureFlagsLoaded({}); });
}

void ApiClient::fetchActivationPlans()
{
    getJson(QStringLiteral("/api/v1/settings/activation-plans"), false,
            [this](const QJsonObject &o) {
                QVariantList list;
                QJsonArray arr = o.value(QStringLiteral("plans")).toArray();
                if (arr.isEmpty() && o.contains(QStringLiteral("_array")))
                    arr = o.value(QStringLiteral("_array")).toArray();
                for (const QJsonValue &v : arr)
                    list.append(v.toObject().toVariantMap());
                emit activationPlansLoaded(list);
            },
            [this](const QString &) { emit activationPlansLoaded({}); });
}

void ApiClient::fetchPlans()
{
    getJson(QStringLiteral("/api/v1/settings/plans"), false,
            [this](const QJsonObject &o) {
                QVariantList list;
                QJsonArray arr = o.value(QStringLiteral("plans")).toArray();
                if (arr.isEmpty() && o.contains(QStringLiteral("_array")))
                    arr = o.value(QStringLiteral("_array")).toArray();
                for (const QJsonValue &v : arr)
                    list.append(v.toObject().toVariantMap());
                // Fallback: object map of plan_id → plan
                if (list.isEmpty()) {
                    for (auto it = o.begin(); it != o.end(); ++it) {
                        if (it.value().isObject()) {
                            QVariantMap m = it.value().toObject().toVariantMap();
                            if (!m.contains(QStringLiteral("id")))
                                m.insert(QStringLiteral("id"), it.key());
                            list.append(m);
                        }
                    }
                }
                emit plansLoaded(list);
            },
            [this](const QString &) { emit plansLoaded({}); });
}

void ApiClient::fetchPlatformSettings()
{
    getJson(QStringLiteral("/api/v1/settings/platform-settings"), false,
            [this](const QJsonObject &o) { emit platformSettingsLoaded(toMap(o)); },
            [this](const QString &) { emit platformSettingsLoaded({}); });
}

void ApiClient::fetchPaymentGateway()
{
    getJson(QStringLiteral("/api/v1/settings/payment-gateway"), false,
            [this](const QJsonObject &o) { emit paymentGatewayLoaded(toMap(o)); },
            [this](const QString &) { emit paymentGatewayLoaded({}); });
}

void ApiClient::fetchDashboardMaintenance()
{
    getJson(QStringLiteral("/api/v1/settings/dashboard-maintenance"), false,
            [this](const QJsonObject &o) {
                const bool blocked = o.value(QStringLiteral("maintenance")).toBool()
                                     || o.value(QStringLiteral("enabled")).toBool();
                const QString msg = o.value(QStringLiteral("message")).toString(
                    QStringLiteral("Live Escape is temporarily unavailable."));
                emit maintenanceResult(blocked, msg);
            },
            [this](const QString &) { emit maintenanceResult(false, {}); });
}

void ApiClient::fetchDashboardNotification()
{
    getJson(QStringLiteral("/api/v1/settings/dashboard-notification"), false,
            [this](const QJsonObject &o) { emit dashboardNotification(toMap(o)); },
            [this](const QString &) {});
}

void ApiClient::fetchCreditBurnRate()
{
    getJson(QStringLiteral("/api/v1/settings/credit-burn-rate"), false,
            [this](const QJsonObject &o) {
                const double rate = o.value(QStringLiteral("credits_per_second")).toDouble(2.0);
                emit burnRateLoaded(rate > 0 ? rate : 2.0);
            },
            [this](const QString &) { emit burnRateLoaded(2.0); });
}

void ApiClient::fetchStreamingAvailability()
{
    getJson(QStringLiteral("/api/v1/settings/streaming-availability"), false,
            [this](const QJsonObject &o) {
                emit streamingAvailabilityLoaded(o.value(QStringLiteral("available")).toBool());
            },
            [this](const QString &) { emit streamingAvailabilityLoaded(true); });
}

void ApiClient::checkVersion(const QString &version, const QString &platform)
{
    QJsonObject body{{QStringLiteral("version"), version},
                     {QStringLiteral("platform"), platform}};
    postJson(QStringLiteral("/api/v1/update/check"), body, false,
             [this](const QJsonObject &o) {
                 emit versionCheckResult(
                     o.value(QStringLiteral("force")).toBool(),
                     o.value(QStringLiteral("latest_version")).toString(),
                     o.value(QStringLiteral("download_url")).toString());
             },
             [this](const QString &) {
                 emit versionCheckResult(false, {}, {});
             });
}

// ── Streaming ─────────────────────────────────────────────

void ApiClient::fetchEngineKey()
{
    getJson(QStringLiteral("/api/v1/settings/engine-key"), true,
            [this](const QJsonObject &o) { emit engineKeyLoaded(toMap(o)); },
            [this](const QString &e) { emit sessionFailed(e); });
}

void ApiClient::rotateEngineKey()
{
    postJson(QStringLiteral("/api/v1/settings/engine-key/next"), {}, true,
             [this](const QJsonObject &o) { emit engineKeyLoaded(toMap(o)); },
             [this](const QString &e) { emit sessionFailed(e); });
}

void ApiClient::fetchIceServers()
{
    getJson(QStringLiteral("/api/v1/webrtc/ice-servers"), false,
            [this](const QJsonObject &o) {
                QVariantList list;
                const QJsonArray arr = o.value(QStringLiteral("iceServers")).toArray();
                for (const QJsonValue &v : arr)
                    list.append(v.toObject().toVariantMap());
                emit iceServersLoaded(list);
            },
            [this](const QString &) { emit iceServersLoaded({}); });
}

void ApiClient::startStreamingSession(const QVariantMap &body)
{
    postJson(QStringLiteral("/api/v1/streaming/session-start"), QJsonObject::fromVariantMap(body), true,
             [this](const QJsonObject &o) { emit sessionStarted(toMap(o)); },
             [this](const QString &e) { emit sessionFailed(e); });
}

void ApiClient::endStreamingSession(const QVariantMap &body)
{
    postJson(QStringLiteral("/api/v1/streaming/end"), QJsonObject::fromVariantMap(body), true,
             [this](const QJsonObject &o) { emit sessionEnded(toMap(o)); },
             [this](const QString &) { emit sessionEnded({}); });
}

void ApiClient::fetchBackgroundPresets()
{
    getJson(QStringLiteral("/api/v1/streaming/background-presets"), true,
            [this](const QJsonObject &o) {
                QVariantList list;
                QJsonArray arr = o.value(QStringLiteral("presets")).toArray();
                if (arr.isEmpty() && o.contains(QStringLiteral("_array")))
                    arr = o.value(QStringLiteral("_array")).toArray();
                for (const QJsonValue &v : arr)
                    list.append(v.toObject().toVariantMap());
                emit backgroundPresetsLoaded(list);
            },
            [this](const QString &) { emit backgroundPresetsLoaded({}); });
}

void ApiClient::selectBackground(const QString &presetId, const QString &prompt)
{
    QJsonObject body{{QStringLiteral("preset_id"), presetId}};
    if (!prompt.isEmpty())
        body.insert(QStringLiteral("prompt"), prompt);
    postJson(QStringLiteral("/api/v1/streaming/background-select"), body, true,
             [this](const QJsonObject &o) { emit backgroundSelected(toMap(o)); },
             [this](const QString &e) { emit backgroundApplyFailed(e); });
}

// ── Payments ──────────────────────────────────────────────

void ApiClient::starterPackPay(const QString &email, const QString &method, const QVariantMap &extra)
{
    QJsonObject body = QJsonObject::fromVariantMap(extra);
    body.insert(QStringLiteral("email"), email);
    QString path = QStringLiteral("/api/v1/starter-pack/pay");
    if (method == QLatin1String("flutterwave"))
        path = QStringLiteral("/api/v1/starter-pack/pay-flutterwave");
    else if (method == QLatin1String("crypto"))
        path = QStringLiteral("/api/v1/starter-pack/pay-crypto");
    postJson(path, body, false,
             [this](const QJsonObject &o) { emit paymentInitiated(toMap(o)); },
             [this](const QString &e) { emit paymentFailed(e); });
}


void ApiClient::setUserEmail(const QString &email)
{
    m_userEmail = email.trimmed();
}

void ApiClient::activationPay(const QString &planId, const QString &method, const QVariantMap &extra)
{
    QJsonObject body = QJsonObject::fromVariantMap(extra);
    body.insert(QStringLiteral("plan_id"), planId);
    if (!m_userEmail.isEmpty())
        body.insert(QStringLiteral("email"), m_userEmail);
    QString path = QStringLiteral("/api/v1/activation/pay");
    if (method == QLatin1String("flutterwave"))
        path = QStringLiteral("/api/v1/activation/pay-flutterwave");
    else if (method == QLatin1String("crypto"))
        path = QStringLiteral("/api/v1/activation/pay-crypto");
    else if (method == QLatin1String("nowpayments"))
        path = QStringLiteral("/api/v1/activation/pay-nowpayments");
    postJson(path, body, true,
             [this](const QJsonObject &o) { emit paymentInitiated(toMap(o)); },
             [this](const QString &e) { emit paymentFailed(e); });
}

void ApiClient::upgradePay(const QString &planId, const QString &method, const QVariantMap &extra)
{
    QJsonObject body = QJsonObject::fromVariantMap(extra);
    body.insert(QStringLiteral("plan_id"), planId);
    if (!m_userEmail.isEmpty())
        body.insert(QStringLiteral("email"), m_userEmail);
    QString path = QStringLiteral("/api/v1/upgrade/pay");
    if (method == QLatin1String("flutterwave"))
        path = QStringLiteral("/api/v1/upgrade/pay-flutterwave");
    else if (method == QLatin1String("crypto"))
        path = QStringLiteral("/api/v1/upgrade/pay-crypto");
    postJson(path, body, true,
             [this](const QJsonObject &o) { emit paymentInitiated(toMap(o)); },
             [this](const QString &e) { emit paymentFailed(e); });
}

void ApiClient::purchaseCredits(const QString &planId, const QString &method, const QVariantMap &extra)
{
    QJsonObject body = QJsonObject::fromVariantMap(extra);
    body.insert(QStringLiteral("plan_id"), planId);
    body.insert(QStringLiteral("method"), method);
    if (!m_userEmail.isEmpty())
        body.insert(QStringLiteral("email"), m_userEmail);
    QString path = QStringLiteral("/api/v1/credits/purchase");
    if (method == QLatin1String("flutterwave"))
        path = QStringLiteral("/api/v1/credits/purchase-flutterwave");
    postJson(path, body, true,
             [this](const QJsonObject &o) { emit paymentInitiated(toMap(o)); },
             [this](const QString &e) { emit paymentFailed(e); });
}

void ApiClient::starterPackStatus(const QString &email)
{
    getJson(QStringLiteral("/api/v1/starter-pack/status?email=") + QUrl::toPercentEncoding(email), false,
            [this](const QJsonObject &o) { emit paymentStatusLoaded(toMap(o)); },
            [this](const QString &e) { emit paymentFailed(e); });
}

void ApiClient::fetchOrderStatus(const QString &reference)
{
    // Unified backend: GET /payments/orders/{id} resolves by _id, with a
    // provider_ref fallback (Paystack reference / NOWPayments payment_id).
    getJson(QStringLiteral("/api/v1/payments/orders/") + QUrl::toPercentEncoding(reference), true,
            [this](const QJsonObject &o) { emit paymentStatusLoaded(toMap(o)); },
            [this](const QString &e) { emit paymentFailed(e); });
}

void ApiClient::verifyOrder(const QString &orderId, const QString &reference)
{
    QJsonObject body{{QStringLiteral("order_id"), orderId}};
    if (!reference.isEmpty())
        body.insert(QStringLiteral("reference"), reference);
    postJson(QStringLiteral("/api/v1/payments/orders/verify"), body, true,
             [this](const QJsonObject &o) { emit paymentStatusLoaded(toMap(o)); },
             [this](const QString &e) { emit paymentFailed(e); });
}

// ── Referral / creator / support ──────────────────────────

void ApiClient::getReferralCode(const QString &email)
{
    getJson(QStringLiteral("/api/v1/referral/my-code?email=") + QUrl::toPercentEncoding(email), false,
            [this](const QJsonObject &o) {
                emit referralCodeLoaded(o.value(QStringLiteral("code")).toString());
                emit referralEarnedLoaded(o.value(QStringLiteral("earned")).toDouble(
                    o.value(QStringLiteral("credits_earned")).toDouble(0)));
            },
            [this](const QString &) { emit referralCodeLoaded({}); });
}

void ApiClient::attachReferral(const QString &email, const QString &deviceId, const QString &code)
{
    QJsonObject body{{QStringLiteral("email"), email},
                     {QStringLiteral("device_id"), deviceId},
                     {QStringLiteral("code"), code}};
    postJson(QStringLiteral("/api/v1/referral/attach"), body, false,
             [this](const QJsonObject &) {},
             [this](const QString &e) { emit networkError(e); });
}

void ApiClient::getPayoutDetails()
{
    getJson(QStringLiteral("/api/v1/creator/payout-details"), false,
            [this](const QJsonObject &o) {
                // Backend wraps the record: {details:{...}|null, product}.
                const QJsonValue v = o.value(QStringLiteral("details"));
                emit payoutDetailsLoaded(v.isObject() ? toMap(v.toObject()) : QVariantMap{});
            },
            [this](const QString &) { emit payoutDetailsLoaded({}); });
}

void ApiClient::savePayoutDetails(const QVariantMap &details)
{
    postJson(QStringLiteral("/api/v1/creator/payout-details"), QJsonObject::fromVariantMap(details), false,
             [this](const QJsonObject &o) {
                 const QJsonValue v = o.value(QStringLiteral("details"));
                 emit payoutDetailsLoaded(v.isObject() ? toMap(v.toObject()) : QVariantMap{});
             },
             [this](const QString &e) { emit networkError(e); });
}

void ApiClient::redeemCreditKey(const QString &key)
{
    QJsonObject body{{QStringLiteral("credit_key"), key.trimmed()},
                     {QStringLiteral("user_id"), m_userId}};
    postJson(QStringLiteral("/api/v1/credits/add"), body, false,
             [this](const QJsonObject &o) { emit creditsLoaded(toMap(o)); },
             [this](const QString &e) { emit creditsFailed(e); });
}

void ApiClient::createSupportTicket(const QString &subject, const QString &message)
{
    QJsonObject body{{QStringLiteral("subject"), subject},
                     {QStringLiteral("message"), message}};
    postJson(QStringLiteral("/api/v1/support/tickets"), body, false,
             [this](const QJsonObject &o) { emit supportTicketCreated(toMap(o)); },
             [this](const QString &e) { emit networkError(e); });
}

void ApiClient::submitCryptoProof(const QString &email, const QString &txId,
                                  const QString &planId, const QString &proofPath)
{
    QJsonObject body{
        {QStringLiteral("email"), email},
        {QStringLiteral("tx_id"), txId},
        {QStringLiteral("transaction_id"), txId},
    };
    if (!planId.isEmpty())
        body.insert(QStringLiteral("plan_id"), planId);
    if (!proofPath.isEmpty())
        body.insert(QStringLiteral("proof_path"), proofPath);

    // Prefer dedicated confirm endpoint; fall back to status poll body
    postJson(QStringLiteral("/api/v1/starter-pack/confirm-crypto"), body, false,
             [this](const QJsonObject &o) { emit paymentStatusLoaded(toMap(o)); },
             [this, body](const QString &) {
                 // Fallback: activation crypto confirm if licensed
                 postJson(QStringLiteral("/api/v1/activation/confirm-crypto"), body, true,
                          [this](const QJsonObject &o) { emit paymentStatusLoaded(toMap(o)); },
                          [this](const QString &e) { emit paymentFailed(e); });
             });
}


void ApiClient::adminSaveEngineKey(const QString &key, const QString &adminSecret)
{
    QJsonObject body{
        {QStringLiteral("admin_secret"), adminSecret},
        {QStringLiteral("engine_key"), key}
    };
    postJson(QStringLiteral("/api/v1/settings/engine-key"), body, false,
             [this](const QJsonObject &) {
                 emit adminActionSucceeded(QStringLiteral("Engine key saved"));
             },
             [this](const QString &e) { emit adminActionFailed(e); });
}

void ApiClient::adminSetCredits(double total, const QString &adminSecret, const QString &userEmail)
{
    QJsonObject body{
        {QStringLiteral("admin_secret"), adminSecret},
        {QStringLiteral("user_email"), userEmail},
        {QStringLiteral("set_total"), total}
    };
    postJson(QStringLiteral("/api/v1/credits/add"), body, false,
             [this](const QJsonObject &o) {
                 emit adminActionSucceeded(QStringLiteral("Credits updated"));
                 // also surface balance if present
                 if (o.contains(QStringLiteral("balance")))
                     emit creditsLoaded(toMap(o.value(QStringLiteral("balance")).toObject()));
                 else
                     emit creditsLoaded(toMap(o));
             },
             [this](const QString &e) { emit adminActionFailed(e); });
}

void ApiClient::googleOAuthStart(const OkFn &onOk, const ErrFn &onErr)
{
    getJson(QStringLiteral("/api/v1/auth/oauth/google/start"), false, onOk, onErr);
}

void ApiClient::googleOAuthPoll(const QString &state, const OkFn &onOk, const ErrFn &onErr)
{
    getJson(QStringLiteral("/api/v1/auth/oauth/google/poll?state=") + state, false, onOk, onErr);
}

void ApiClient::googleOAuthExchange(const QString &ticket, const OkFn &onOk, const ErrFn &onErr)
{
    QJsonObject body{{QStringLiteral("ticket"), ticket}};
    postJson(QStringLiteral("/api/v1/auth/oauth/google/exchange"), body, false, onOk, onErr);
}

void ApiClient::ping()
{
    getJson(QStringLiteral("/api/v1/health"), false,
        [this](const QJsonObject &) {
            if (!m_reachable) { m_reachable = true; emit reachableChanged(); }
        },
        [this](const QString &) {
            if (m_reachable) { m_reachable = false; emit reachableChanged(); }
        });
}
