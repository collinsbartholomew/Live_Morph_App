#include "AuthManager.h"
#include "DeviceIdentity.h"
#include <QWebSocket>
#include <QUrlQuery>
#include <QJsonDocument>
#include <QJsonObject>
#include <QDesktopServices>
#include <QUrl>
#include "ConfigManager.h"
#include "services/BackendClient.h"
#include "SecureStore.h"

#include <QNetworkRequest>
#include <QNetworkReply>
#include <QSettings>
#include <QDateTime>
#include <QTimer>
#include <QtGlobal>

static QString apiRoot(BackendClient *b)
{
    if (b && !b->baseUrl().isEmpty())
        return b->baseUrl();
    return QStringLiteral("http://127.0.0.1:3874");
}

static void applyIdentityHeaders(QNetworkRequest &req, BackendClient *backend)
{
    req.setHeader(QNetworkRequest::ContentTypeHeader, QStringLiteral("application/json"));
    req.setRawHeader("Accept", "application/json");
    req.setRawHeader("X-Frontend-Id", "livemorph");
    req.setRawHeader("X-Client-Product", "livemorph");
    req.setRawHeader("X-Device-Id", DeviceIdentity::deviceId().toUtf8());
    req.setRawHeader("X-App-Version", DeviceIdentity::appVersion().toUtf8());
    req.setHeader(QNetworkRequest::UserAgentHeader, DeviceIdentity::userAgent());
    if (backend && !backend->accessToken().isEmpty())
        req.setRawHeader("Authorization", QByteArray("Bearer ") + backend->accessToken().toUtf8());
    req.setTransferTimeout(30000);
}

AuthManager::AuthManager(ConfigManager *config, BackendClient *backend, QObject *parent)
    : QObject(parent)
    , m_config(config)
    , m_backend(backend)
{
    m_nam.setTransferTimeout(30000);
    m_refreshTimer.setSingleShot(true);
    connect(&m_refreshTimer, &QTimer::timeout, this, &AuthManager::refreshTokens);

    m_otpCooldownTimer.setInterval(1000);
    connect(&m_otpCooldownTimer, &QTimer::timeout, this, [this]() {
        m_otpCooldownSecs = qMax(0, m_otpCooldownSecs - 1);
        emit otpCooldownChanged();
        if (m_otpCooldownSecs <= 0)
            m_otpCooldownTimer.stop();
    });

    m_rateLimitTimer.setInterval(1000);
    connect(&m_rateLimitTimer, &QTimer::timeout, this, [this]() {
        m_rateLimitSecs = qMax(0, m_rateLimitSecs - 1);
        emit rateLimitedChanged();
        if (m_rateLimitSecs <= 0) {
            m_rateLimited = false;
            m_rateLimitTimer.stop();
            emit rateLimitedChanged();
        }
    });

    restoreSession();
    if (m_backend) {
        connect(m_backend, &BackendClient::reachableChanged, this, [this]() {
            if (!m_backend || !m_backend->reachable() || m_googleAvailable)
                return;
            const QString base = apiRoot(m_backend);
            QNetworkRequest streq{QUrl(base + QStringLiteral("/api/v1/auth/oauth/google/status"))};
            applyIdentityHeaders(streq, m_backend);
            auto *reply = m_nam.get(streq);
            connect(reply, &QNetworkReply::finished, this, [this, reply]() {
                reply->deleteLater();
                if (reply->error() != QNetworkReply::NoError) return;
                const auto doc = QJsonDocument::fromJson(reply->readAll());
                const bool en = doc.object().value(QStringLiteral("enabled")).toBool();
                if (en != m_googleAvailable) {
                    m_googleAvailable = en;
                    emit googleAvailableChanged();
                }
            });
        });
    }

}

void AuthManager::setLoading(bool v)
{
    if (m_loading == v) return;
    m_loading = v;
    emit isLoadingChanged();
}

void AuthManager::setError(const QString &msg)
{
    if (m_error == msg) return;
    m_error = msg;
    emit errorMessageChanged();
}

void AuthManager::clearError()
{
    setError({});
}

void AuthManager::resetOtpFlow()
{
    m_otpSent = false;
    m_pendingEmail.clear();
    m_otpCooldownSecs = 0;
    m_otpCooldownTimer.stop();
    emit otpSentChanged();
    emit otpCooldownChanged();
    clearError();
}

void AuthManager::signInWithGoogle()
{
    clearError();
    if (!m_backend || !m_backend->reachable()) {
        setError(tr("Backend offline — cannot start Google sign-in"));
        return;
    }
    setLoading(true);
    const QString base = apiRoot(m_backend);
    QNetworkRequest req{QUrl(base + QStringLiteral("/api/v1/auth/oauth/google/start"))};
    applyIdentityHeaders(req, m_backend);
    auto *reply = m_nam.get(req);
    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        reply->deleteLater();
        setLoading(false);
        if (reply->error() != QNetworkReply::NoError) {
            handleHttpError(reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt(),
                            reply->readAll());
            if (m_error.isEmpty())
                setError(reply->errorString());
            return;
        }
        const auto doc = QJsonDocument::fromJson(reply->readAll());
        const auto o = doc.object();
        const QString url = o.value(QStringLiteral("authorization_url")).toString();
        m_googleOAuthState = o.value(QStringLiteral("state")).toString();
        if (url.isEmpty()) {
            setError(tr("Google sign-in unavailable"));
            return;
        }
        emit googleOAuthStarted(url);
        QDesktopServices::openUrl(QUrl(url));
        // Poll backend for OAuth ticket (fallback for when livemorph:// deep link is not registered)
        startGooglePoll();
    });
}

void AuthManager::startGooglePoll()
{
    m_googlePollTimer.setInterval(2000);
    // Disconnect any previous poll connection to prevent stacking
    if (m_googlePollConnection)
        disconnect(m_googlePollConnection);
    m_googlePollConnection = connect(&m_googlePollTimer, &QTimer::timeout, this, [this]() {
        if (m_googleOAuthState.isEmpty()) return;
        const QString base = apiRoot(m_backend);
        QUrl url(base + QStringLiteral("/api/v1/auth/oauth/google/poll"));
        QUrlQuery q;
        q.addQueryItem(QStringLiteral("state"), m_googleOAuthState);
        url.setQuery(q);
        QNetworkRequest req{url};
        applyIdentityHeaders(req, m_backend);
        auto *reply = m_nam.get(req);
        connect(reply, &QNetworkReply::finished, this, [this, reply]() {
            reply->deleteLater();
            if (reply->error() != QNetworkReply::NoError) return;
            const auto doc = QJsonDocument::fromJson(reply->readAll());
            const auto o = doc.object();
            const QString ticket = o.value(QStringLiteral("ticket")).toString();
            if (ticket.isEmpty()) return;
            // Got the ticket — stop polling and exchange it
            m_googlePollTimer.stop();
            m_googleOAuthState.clear();
            exchangeOAuthTicket(ticket);
        });
    });
    m_googlePollTimer.start();
    // Auto-stop after 5 minutes
    QTimer::singleShot(300000, &m_googlePollTimer, &QTimer::stop);
}

void AuthManager::applyOAuthTokens(const QString &accessToken, const QString &refreshToken,
                                   qint64 expiresIn, const QString &email)
{
    if (accessToken.isEmpty()) {
        setError(tr("OAuth failed — missing token"));
        return;
    }
    m_accessToken = accessToken;
    m_refreshToken = refreshToken;
    if (!email.isEmpty())
        m_email = email;
    m_authenticated = true;
    pushTokenToBackend();
    persistSession();
    startRefreshTimer(expiresIn > 0 ? expiresIn : 3600);
    emit tokensChanged();
    emit authenticatedChanged();
    emit signedIn();
    refreshProfile();
}


void AuthManager::exchangeOAuthTicket(const QString &ticket)
{
    clearError();
    if (ticket.isEmpty()) {
        setError(tr("Missing OAuth ticket"));
        return;
    }
    if (!m_backend) {
        setError(tr("Backend not available"));
        return;
    }
    setLoading(true);
    const QString base = apiRoot(m_backend);
    QNetworkRequest req{QUrl(base + QStringLiteral("/api/v1/auth/oauth/google/exchange"))};
    applyIdentityHeaders(req, m_backend);
    const QJsonObject body{{QStringLiteral("ticket"), ticket}};
    auto *reply = m_nam.post(req, QJsonDocument(body).toJson(QJsonDocument::Compact));
    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        reply->deleteLater();
        setLoading(false);
        const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        const QByteArray raw = reply->readAll();
        if (reply->error() != QNetworkReply::NoError || status >= 400) {
            handleHttpError(status, raw);
            if (m_error.isEmpty())
                setError(tr("OAuth exchange failed"));
            return;
        }
        const auto doc = QJsonDocument::fromJson(raw);
        const auto o = doc.object();
        applyOAuthTokens(
            o.value(QStringLiteral("access_token")).toString(),
            o.value(QStringLiteral("refresh_token")).toString(),
            o.value(QStringLiteral("expires_in")).toVariant().toLongLong(),
            o.value(QStringLiteral("email")).toString());
        if (o.contains(QStringLiteral("user")))
            applyUserObject(o.value(QStringLiteral("user")).toObject());
    });
}


void AuthManager::pushTokenToBackend()
{
    if (m_backend)
        m_backend->setAccessToken(m_accessToken);
    connectBalanceSocket();
}

void AuthManager::startRefreshTimer(qint64 expiresInSecs)
{
    // Refresh 60s before expiry (min 30s)
    const int ms = static_cast<int>(qMax(30LL, expiresInSecs - 60) * 1000);
    m_refreshTimer.start(ms);
}

void AuthManager::handleHttpError(int status, const QByteArray &body)
{
    QString msg = tr("Request failed");
    const auto doc = QJsonDocument::fromJson(body);
    if (doc.isObject()) {
        const auto o = doc.object();
        msg = o.value(QStringLiteral("message")).toString(msg);
        if (msg.isEmpty())
            msg = o.value(QStringLiteral("error")).toString(msg);
    }
    if (status == 429) {
        m_rateLimited = true;
        m_rateLimitSecs = 60;
        m_rateLimitTimer.start();
        emit rateLimitedChanged();
        setError(msg.isEmpty() ? tr("Too many attempts — please wait") : msg);
    } else if (status == 401) {
        setError(msg.isEmpty() ? tr("Invalid credentials") : msg);
    } else if (status == 402) {
        setError(tr("Insufficient credits"));
    } else {
        setError(msg);
    }
}

void AuthManager::requestOtp(const QString &email)
{
    const QString e = email.trimmed().toLower();
    if (!e.contains(QLatin1Char('@'))) {
        setError(tr("Enter a valid email address"));
        return;
    }
    if (m_rateLimited) {
        setError(tr("Too many attempts — wait %1s").arg(m_rateLimitSecs));
        return;
    }

    setLoading(true);
    clearError();
    m_pendingEmail = e;

    QNetworkRequest req{QUrl(apiRoot(m_backend) + QStringLiteral("/api/v1/auth/otp/request"))};
    applyIdentityHeaders(req, m_backend);

    const QJsonObject body{{QStringLiteral("email"), e}};
    auto *reply = m_nam.post(req, QJsonDocument(body).toJson(QJsonDocument::Compact));

    connect(reply, &QNetworkReply::finished, this, [this, reply, e]() {
        reply->deleteLater();
        setLoading(false);
        const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        const QByteArray raw = reply->readAll();

        if (reply->error() != QNetworkReply::NoError && status == 0) {
#ifdef QT_DEBUG
            m_otpSent = true;
            m_otpCooldownSecs = 30;
            m_otpCooldownTimer.start();
            emit otpSentChanged();
            emit otpCooldownChanged();
            emit otpRequested(e);
            setError(tr("Backend offline — debug build: any 6–8 digit code works"));
#else
            setError(tr("Cannot reach authentication server. Check your connection."));
#endif
            return;
        }

        if (status >= 400) {
            handleHttpError(status, raw);
            return;
        }

        const auto doc = QJsonDocument::fromJson(raw);
        const auto obj = doc.object();
        const int len = obj.value(QStringLiteral("code_length")).toInt(8);
        if (len >= 6 && len <= 12 && len != m_otpCodeLength) {
            m_otpCodeLength = len;
            emit otpCodeLengthChanged();
        }
        const int ttl = obj.value(QStringLiteral("expires_in")).toInt(600);
        m_otpSent = true;
        m_otpCooldownSecs = qBound(30, 120, ttl > 0 ? qMin(ttl, 120) : 30);
        m_otpCooldownTimer.start();
        emit otpSentChanged();
        emit otpCooldownChanged();
        emit otpRequested(e);
        clearError();
    });
}

void AuthManager::verifyOtp(const QString &email, const QString &code)
{
    const QString e = email.trimmed().toLower();
    const QString c = code.trimmed();
    if (c.length() != m_otpCodeLength) {
        setError(tr("Enter the full %1-digit code").arg(m_otpCodeLength));
        return;
    }
    for (const QChar ch : c) {
        if (!ch.isDigit()) {
            setError(tr("Code must be digits only"));
            return;
        }
    }

    setLoading(true);
    clearError();

    QNetworkRequest req{QUrl(apiRoot(m_backend) + QStringLiteral("/api/v1/auth/otp/verify"))};
    applyIdentityHeaders(req, m_backend);

    const QJsonObject body{
        {QStringLiteral("email"), e},
        {QStringLiteral("code"), c},
        {QStringLiteral("device_id"), DeviceIdentity::deviceId()},
    };
    auto *reply = m_nam.post(req, QJsonDocument(body).toJson(QJsonDocument::Compact));

    connect(reply, &QNetworkReply::finished, this, [this, reply, e, c]() {
        reply->deleteLater();
        setLoading(false);
        const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        const QByteArray raw = reply->readAll();

        if (reply->error() != QNetworkReply::NoError && status == 0) {
#ifdef QT_DEBUG
            if (c.length() == m_otpCodeLength) {
                QJsonObject user{
                    {QStringLiteral("id"), QStringLiteral("demo-") + e.section(QLatin1Char('@'), 0, 0)},
                    {QStringLiteral("email"), e},
                    {QStringLiteral("display_name"), e.section(QLatin1Char('@'), 0, 0)},
                    {QStringLiteral("credit_balance"), 100},
                    {QStringLiteral("bonus_balance"), 100},
                    {QStringLiteral("tier"), QStringLiteral("free")},
                };
                QJsonObject fake{
                    {QStringLiteral("access_token"), QStringLiteral("demo-access")},
                    {QStringLiteral("refresh_token"), QStringLiteral("demo-refresh")},
                    {QStringLiteral("expires_in"), 3600},
                    {QStringLiteral("user"), user},
                };
                applyAuthResponse(fake);
                return;
            }
#endif
            setError(tr("Cannot reach authentication server"));
            return;
        }

        if (status >= 400) {
            handleHttpError(status, raw);
            return;
        }

        const auto doc = QJsonDocument::fromJson(raw);
        if (!doc.isObject()) {
            setError(tr("Invalid server response"));
            return;
        }
        applyAuthResponse(doc.object());
    });
}

void AuthManager::signInWithEmail(const QString &email, const QString &password)
{
    const QString e = email.trimmed().toLower();
    if (e.isEmpty() || password.isEmpty()) {
        setError(tr("Email and password are required"));
        return;
    }

    setLoading(true);
    clearError();

    QNetworkRequest req{QUrl(apiRoot(m_backend) + QStringLiteral("/api/v1/auth/login"))};
    applyIdentityHeaders(req, m_backend);

    const QJsonObject body{
        {QStringLiteral("email"), e},
        {QStringLiteral("password"), password},
        {QStringLiteral("device_id"), DeviceIdentity::deviceId()},
    };
    auto *reply = m_nam.post(req, QJsonDocument(body).toJson(QJsonDocument::Compact));

    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        reply->deleteLater();
        setLoading(false);
        const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        const QByteArray raw = reply->readAll();
        if (status >= 400 || reply->error() != QNetworkReply::NoError) {
            if (status == 0)
                setError(tr("Cannot reach backend"));
            else
                handleHttpError(status, raw);
            return;
        }
        applyAuthResponse(QJsonDocument::fromJson(raw).object());
    });
}

void AuthManager::signUp(const QString &email, const QString &password, const QString &displayName)
{
    const QString e = email.trimmed().toLower();
    if (e.isEmpty() || password.length() < 8) {
        setError(tr("Valid email and password (8+ chars) required"));
        return;
    }

    setLoading(true);
    clearError();

    QNetworkRequest req{QUrl(apiRoot(m_backend) + QStringLiteral("/api/v1/auth/register"))};
    applyIdentityHeaders(req, m_backend);

    QJsonObject body{
        {QStringLiteral("email"), e},
        {QStringLiteral("password"), password},
    };
    if (!displayName.trimmed().isEmpty())
        body.insert(QStringLiteral("display_name"), displayName.trimmed());
    body.insert(QStringLiteral("device_id"), DeviceIdentity::deviceId());

    auto *reply = m_nam.post(req, QJsonDocument(body).toJson(QJsonDocument::Compact));

    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        reply->deleteLater();
        setLoading(false);
        const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        const QByteArray raw = reply->readAll();
        if (status >= 400 || reply->error() != QNetworkReply::NoError) {
            if (status == 0)
                setError(tr("Cannot reach backend"));
            else
                handleHttpError(status, raw);
            return;
        }
        applyAuthResponse(QJsonDocument::fromJson(raw).object());
    });
}

void AuthManager::signOut()
{
    if (!m_refreshToken.isEmpty() && m_backend) {
        QNetworkRequest req{QUrl(apiRoot(m_backend) + QStringLiteral("/api/v1/auth/logout"))};
    applyIdentityHeaders(req, m_backend);
    // Prefer explicit token from AuthManager in case backend not yet pushed
    if (!m_accessToken.isEmpty())
        req.setRawHeader("Authorization", QByteArray("Bearer ") + m_accessToken.toUtf8());
    const QJsonObject body{{QStringLiteral("refresh_token"), m_refreshToken}};
        auto *reply = m_nam.post(req, QJsonDocument(body).toJson(QJsonDocument::Compact));
        connect(reply, &QNetworkReply::finished, reply, &QObject::deleteLater);
    }
    if (m_backend)
        m_backend->clearAuthSession();

    disconnectBalanceSocket();
    clearSessionLocal();
    emit signedOut();
}

void AuthManager::refreshProfile()
{
    if (m_accessToken.isEmpty())
        return;

    QNetworkRequest req{QUrl(apiRoot(m_backend) + QStringLiteral("/api/v1/auth/me"))};
    applyIdentityHeaders(req, m_backend);

    // Backend route is POST /auth/me
    auto *reply = m_nam.post(req, QByteArrayLiteral("{}"));
    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        reply->deleteLater();
        const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        if (status == 401) {
            refreshTokens();
            return;
        }
        if (reply->error() != QNetworkReply::NoError)
            return;
        applyUserObject(QJsonDocument::fromJson(reply->readAll()).object());
        persistSession();
    });
}

void AuthManager::refreshTokens()
{
    if (m_refreshToken.isEmpty() || m_refreshInFlight)
        return;
    m_refreshInFlight = true;

    // Safety: reset m_refreshInFlight after 30s if the reply never fires
    QTimer::singleShot(30000, this, [this]() {
        if (m_refreshInFlight) {
            m_refreshInFlight = false;
            refreshTokens();
        }
    });

    QNetworkRequest req{QUrl(apiRoot(m_backend) + QStringLiteral("/api/v1/auth/refresh"))};
    applyIdentityHeaders(req, m_backend);
    req.setTransferTimeout(20000);

    const QJsonObject body{{QStringLiteral("refresh_token"), m_refreshToken}};
    auto *reply = m_nam.post(req, QJsonDocument(body).toJson(QJsonDocument::Compact));

    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        reply->deleteLater();
        m_refreshInFlight = false;
        const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        if (status >= 400 || reply->error() != QNetworkReply::NoError) {
            clearSessionLocal();
            emit signedOut();
            return;
        }
        applyAuthResponse(QJsonDocument::fromJson(reply->readAll()).object());
    });
}

void AuthManager::applyBalance(double credits, double bonus)
{
    m_creditBalance = credits;
    m_bonusBalance = bonus;
    emit profileChanged();
    persistSession();
}

void AuthManager::deductCredits(double amount)
{
    if (amount <= 0.0) return;
    double credits = m_creditBalance;
    double bonus = m_bonusBalance;
    if (bonus >= amount) {
        bonus -= amount;
    } else {
        const double rest = amount - bonus;
        bonus = 0.0;
        credits = qMax(0.0, credits - rest);
    }
    m_creditBalance = credits;
    m_bonusBalance = bonus;
    emit profileChanged();
    // Throttle disk writes — persist roughly once per second of burn
    static qint64 lastPersistMs = 0;
    const qint64 now = QDateTime::currentMSecsSinceEpoch();
    if (now - lastPersistMs > 1000) {
        lastPersistMs = now;
        persistSession();
    }
}

void AuthManager::applyAuthResponse(const QJsonObject &obj)
{
    const bool wasAuthenticated = m_authenticated;
    m_accessToken = obj.value(QStringLiteral("access_token")).toString();
    m_refreshToken = obj.value(QStringLiteral("refresh_token")).toString();
    const qint64 expiresIn = obj.value(QStringLiteral("expires_in")).toInteger(900);

    applyUserObject(obj.value(QStringLiteral("user")).toObject());

    m_authenticated = !m_accessToken.isEmpty();
    m_otpSent = false;
    emit otpSentChanged();
    emit tokensChanged();
    emit authenticatedChanged();
    emit profileChanged();

    pushTokenToBackend();
    persistSession();
    startRefreshTimer(expiresIn);

    // Only announce a fresh sign-in — never on silent token refresh, which
    // previously re-fired the "Signed in" toast + navigation every ~10 min.
    if (m_authenticated && !wasAuthenticated)
        emit signedIn();
}

void AuthManager::applyUserObject(const QJsonObject &user)
{
    if (user.isEmpty())
        return;
    m_userId = user.value(QStringLiteral("id")).toString();
    m_email = user.value(QStringLiteral("email")).toString();
    m_displayName = user.value(QStringLiteral("display_name")).toString();
    if (m_displayName.isEmpty())
        m_displayName = m_email.section(QLatin1Char('@'), 0, 0);
    m_creditBalance = user.value(QStringLiteral("credit_balance")).toDouble();
    m_bonusBalance = user.value(QStringLiteral("bonus_balance")).toDouble();
    m_tier = user.value(QStringLiteral("tier")).toString(QStringLiteral("free"));
    emit profileChanged();
}

void AuthManager::persistSession()
{
    QSettings s(QStringLiteral("LiveMorph"), QStringLiteral("LiveMorph"));
    s.beginGroup(QStringLiteral("auth"));
    SecureStore::write(QStringLiteral("access"), m_accessToken);
    SecureStore::write(QStringLiteral("refresh"), m_refreshToken);
    s.remove(QStringLiteral("access")); // clear legacy plaintext
    s.remove(QStringLiteral("refresh"));
    SecureStore::write(QStringLiteral("userId"), m_userId);
    SecureStore::write(QStringLiteral("email"), m_email);
    s.setValue(QStringLiteral("displayName"), m_displayName);
    s.remove(QStringLiteral("userId"));
    s.remove(QStringLiteral("email"));
    s.setValue(QStringLiteral("credits"), m_creditBalance);
    s.setValue(QStringLiteral("bonus"), m_bonusBalance);
    s.setValue(QStringLiteral("tier"), m_tier);
    s.setValue(QStringLiteral("authenticated"), m_authenticated);
    s.endGroup();
}

void AuthManager::restoreSession()
{
    QSettings s(QStringLiteral("LiveMorph"), QStringLiteral("LiveMorph"));
    s.beginGroup(QStringLiteral("auth"));
    m_accessToken = SecureStore::read(QStringLiteral("access"));
    m_refreshToken = SecureStore::read(QStringLiteral("refresh"));
    // migrate legacy plaintext if present
    if (m_accessToken.isEmpty()) {
        m_accessToken = s.value(QStringLiteral("access")).toString();
        m_refreshToken = s.value(QStringLiteral("refresh")).toString();
        if (!m_accessToken.isEmpty()) {
            SecureStore::write(QStringLiteral("access"), m_accessToken);
            SecureStore::write(QStringLiteral("refresh"), m_refreshToken);
            s.remove(QStringLiteral("access"));
            s.remove(QStringLiteral("refresh"));
        }
    }
    m_userId = SecureStore::read(QStringLiteral("userId"));
    m_email = SecureStore::read(QStringLiteral("email"));
    if (m_userId.isEmpty())
        m_userId = s.value(QStringLiteral("userId")).toString();
    if (m_email.isEmpty())
        m_email = s.value(QStringLiteral("email")).toString();
    m_displayName = s.value(QStringLiteral("displayName")).toString();
    m_creditBalance = s.value(QStringLiteral("credits"), 0).toDouble();
    m_bonusBalance = s.value(QStringLiteral("bonus"), 0).toDouble();
    m_tier = s.value(QStringLiteral("tier"), QStringLiteral("free")).toString();
    m_authenticated = s.value(QStringLiteral("authenticated"), false).toBool()
                      && !m_accessToken.isEmpty();
    s.endGroup();

    if (m_authenticated) {
        pushTokenToBackend();
        emit authenticatedChanged();
        emit profileChanged();
        emit tokensChanged();
        // Validate / refresh quietly
        QTimer::singleShot(500, this, &AuthManager::refreshProfile);
        startRefreshTimer(600); // try refresh in 10 min if no expires_in known
    }
}

void AuthManager::clearSessionLocal()
{
    m_refreshInFlight = false;
    m_authenticated = false;
    m_accessToken.clear();
    m_refreshToken.clear();
    m_userId.clear();
    m_email.clear();
    m_displayName.clear();
    m_creditBalance = 0;
    m_bonusBalance = 0;
    m_tier = QStringLiteral("free");
    m_otpSent = false;
    m_pendingEmail.clear();
    m_refreshTimer.stop();
    disconnectBalanceSocket();

    SecureStore::remove(QStringLiteral("access"));
    SecureStore::remove(QStringLiteral("refresh"));
    SecureStore::remove(QStringLiteral("userId"));
    SecureStore::remove(QStringLiteral("email"));
    SecureStore::remove(QStringLiteral("last_export_json"));
    QSettings s(QStringLiteral("LiveMorph"), QStringLiteral("LiveMorph"));
    s.remove(QStringLiteral("auth"));

    if (m_backend)
        m_backend->setAccessToken({});

    emit authenticatedChanged();
    emit profileChanged();
    emit tokensChanged();
    emit otpSentChanged();
}

void AuthManager::logoutAllDevices()
{
    if (m_accessToken.isEmpty()) {
        signOut();
        return;
    }
    QNetworkRequest req{QUrl(apiRoot(m_backend) + QStringLiteral("/api/v1/auth/logout_all"))};
    applyIdentityHeaders(req, m_backend);
    auto *reply = m_nam.post(req, QByteArrayLiteral("{}"));
    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        reply->deleteLater();
        clearSessionLocal();
        emit signedOut();
    });
}

void AuthManager::deleteAccount()
{
    if (m_accessToken.isEmpty()) return;
    QNetworkRequest req{QUrl(apiRoot(m_backend) + QStringLiteral("/api/v1/auth/delete_account"))};
    applyIdentityHeaders(req, m_backend);
    auto *reply = m_nam.post(req, QByteArrayLiteral("{}"));
    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        reply->deleteLater();
        clearSessionLocal();
        emit signedOut();
    });
}

void AuthManager::exportData()
{
    if (m_accessToken.isEmpty()) return;
    QNetworkRequest req{QUrl(apiRoot(m_backend) + QStringLiteral("/api/v1/auth/export"))};
    applyIdentityHeaders(req, m_backend);
    auto *reply = m_nam.post(req, QByteArrayLiteral("{}"));
    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        reply->deleteLater();
        if (reply->error() != QNetworkReply::NoError) {
            setError(tr("Export failed"));
            return;
        }
        // Persist export in the secure vault (cleared on sign-out with other secrets)
        SecureStore::write(QStringLiteral("last_export_json"), QString::fromUtf8(reply->readAll()));
        setError({}); // clear
        // Reuse error channel as soft status is imperfect; emit profileChanged as ping
        emit profileChanged();
    });
}


void AuthManager::connectBalanceSocket()
{
    if (m_accessToken.isEmpty() || !m_backend)
        return;
    if (!m_balanceSocket) {
        m_balanceSocket = new QWebSocket(QString(), QWebSocketProtocol::VersionLatest, this);
        connect(m_balanceSocket, &QWebSocket::disconnected, this, [this]() {
            // Auto-reconnect after 5s unless explicitly disconnected
            if (m_accessToken.isEmpty() || !m_backend)
                return;
            QTimer::singleShot(5000, this, [this]() {
                if (!m_accessToken.isEmpty() && m_backend && m_balanceSocket
                    && m_balanceSocket->state() == QAbstractSocket::UnconnectedState)
                    connectBalanceSocket();
            });
        });
        connect(m_balanceSocket, &QWebSocket::textMessageReceived, this, [this](const QString &msg) {
            const auto doc = QJsonDocument::fromJson(msg.toUtf8());
            if (!doc.isObject()) return;
            const QJsonObject o = doc.object();
            const QString type = o.value(QStringLiteral("type")).toString();
            if (type == QLatin1String("balance_update")) {
                const double total = o.value(QStringLiteral("total")).toDouble(
                    o.value(QStringLiteral("credits")).toDouble());
                refreshProfile();
                Q_UNUSED(total);
            } else if (type == QLatin1String("force_disconnect")) {
                const QString reason = o.value(QStringLiteral("reason")).toString(tr("Credits depleted"));
                setError(reason);
                emit forceDisconnected(reason);
            } else if (type == QLatin1String("config_update") || type == QLatin1String("hello")) {
                if (m_backend)
                    m_backend->fetchBootstrap();
            }
        });
    }
    QUrl url;
    const QString fromServer = m_backend->balanceWsUrl();
    if (!fromServer.isEmpty()) {
        url = QUrl(fromServer);
    } else {
        QString base = m_backend->baseUrl();
        QUrl http(base);
        const QString scheme = (http.scheme() == QLatin1String("https")) ? QStringLiteral("wss") : QStringLiteral("ws");
        url = QUrl(QStringLiteral("%1://%2").arg(scheme, http.authority()));
        url.setPath(QStringLiteral("/ws"));
    }
    QUrlQuery q;
    q.addQueryItem(QStringLiteral("product"), QStringLiteral("livemorph"));
    q.addQueryItem(QStringLiteral("frontend_id"), QStringLiteral("livemorph"));
    q.addQueryItem(QStringLiteral("device_id"), DeviceIdentity::deviceId());
    url.setQuery(q);
    QNetworkRequest req{url};
    if (!m_accessToken.isEmpty())
        req.setRawHeader("Authorization", QByteArray("Bearer ") + m_accessToken.toUtf8());
    m_balanceSocket->open(req);
}

void AuthManager::disconnectBalanceSocket()
{
    if (m_balanceSocket)
        m_balanceSocket->close();
}
