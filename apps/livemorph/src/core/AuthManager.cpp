#include "AuthManager.h"
#include "DeviceIdentity.h"
#include <QWebSocket>
#include <QRandomGenerator>
#include <QUrlQuery>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonParseError>
#include <QDesktopServices>
#include <QUrl>
#include <limits>
#include "ConfigManager.h"

namespace {
// Strict object parse: *ok is false when the body is non-empty garbage, so a
// malformed 200 can never be mistaken for a valid (empty) auth payload.
QJsonObject parseObjectOr(const QByteArray &raw, bool *ok = nullptr)
{
    QJsonParseError err{};
    const auto doc = QJsonDocument::fromJson(raw, &err);
    if (ok)
        *ok = (err.error == QJsonParseError::NoError && doc.isObject());
    return doc.isObject() ? doc.object() : QJsonObject{};
}
} // namespace
#include "services/BackendClient.h"
#include "SecureStore.h"

#include <QNetworkRequest>
#include <QNetworkReply>
#include <QSettings>
#include <QDateTime>
#include <QTimer>
#include <QRegularExpression>
#include <QtGlobal>
#include <QStandardPaths>
#include <QDir>
#include <QFile>
#include <QSaveFile>

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
    // Never follow redirects on authenticated calls — a 3xx to another host
    // must not carry the Bearer token with it.
    req.setAttribute(QNetworkRequest::RedirectPolicyAttribute,
                     QNetworkRequest::ManualRedirectPolicy);
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
        m_googleOAuthVerifier = o.value(QStringLiteral("code_verifier")).toString();
        if (url.isEmpty()) {
            setError(tr("Google sign-in unavailable"));
            return;
        }
        emit googleOAuthStarted(url);
        // Only http(s) — the URL comes from the backend; never open file://
        // or registered-handler schemes.
        const QUrl parsedUrl(url);
        if (parsedUrl.scheme() == QLatin1String("https") || parsedUrl.scheme() == QLatin1String("http"))
            QDesktopServices::openUrl(parsedUrl);
        else
            setError(tr("Refusing to open non-http OAuth URL"));
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
    m_googlePollAttempts = 0;
    m_googlePollConnection = connect(&m_googlePollTimer, &QTimer::timeout, this, [this]() {
        if (m_googleOAuthState.isEmpty()) return;
        // Auto-stop after ~5 minutes (150 × 2s)
        if (++m_googlePollAttempts > 150) {
            m_googlePollTimer.stop();
            m_googleOAuthState.clear();
            setError(tr("Google sign-in timed out — please try again"));
            return;
        }
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
    m_googlePollTimer.stop(); // single completion path — never double-exchange
    if (m_oauthExchangeInFlight) return; // a second ticket must not race the first
    m_oauthExchangeInFlight = true;
    clearError();
    if (ticket.isEmpty()) {
        m_oauthExchangeInFlight = false; // never wedge OAuth on a bad ticket
        setError(tr("Missing OAuth ticket"));
        return;
    }
    if (!m_backend) {
        m_oauthExchangeInFlight = false;
        setError(tr("Backend not available"));
        return;
    }
    setLoading(true);
    const QString base = apiRoot(m_backend);
    QNetworkRequest req{QUrl(base + QStringLiteral("/api/v1/auth/oauth/google/exchange"))};
    applyIdentityHeaders(req, m_backend);
    const QJsonObject body{
        {QStringLiteral("ticket"), ticket},
        {QStringLiteral("verifier"), m_googleOAuthVerifier},
    };
    auto *reply = m_nam.post(req, QJsonDocument(body).toJson(QJsonDocument::Compact));
    const quint64 epoch = m_authEpoch;
    connect(reply, &QNetworkReply::finished, this, [this, reply, epoch]() {
        reply->deleteLater();
        setLoading(false);
        m_oauthExchangeInFlight = false; // every completion path re-arms the guard
        if (epoch != m_authEpoch)
            return; // signed out mid-flight — do not resurrect state
        const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        const QByteArray raw = reply->readAll();
        if (reply->error() != QNetworkReply::NoError || status >= 300) {
            handleHttpError(status, raw);
            if (m_error.isEmpty())
                setError(tr("OAuth exchange failed"));
            return;
        }
        bool ok = false;
        const auto o = parseObjectOr(raw, &ok);
        if (!ok) {
            setError(tr("Invalid server response"));
            return;
        }
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
    m_balanceWsAttempts = 0; // fresh explicit connect: backoff restarts here only
    connectBalanceSocket();
}

void AuthManager::startRefreshTimer(qint64 expiresInSecs)
{
    // Refresh 60s before expiry (min 30s). Clamp into [30s, 30d] and into
    // int-ms range — a hostile or buggy expires_in (e.g. 2^31) must not
    // overflow QTimer::start(int).
    const qint64 secs = qBound<qint64>(30, expiresInSecs, 30LL * 24 * 3600);
    const qint64 ms = qMax(30LL, secs - 60) * 1000;
    m_refreshTimer.start(int(qMin<qint64>(ms, std::numeric_limits<int>::max())));
}

QString AuthManager::translatedServerError(int status, const QByteArray &body) const
{
    // The backend returns { "error": "<stable-code>", "message": "<english>" }.
    // The English message is NOT in the translation catalog, so map the stable
    // code to a local tr() string — otherwise server errors stay English in
    // every non-English UI. Shared mapping lives on BackendClient.
    return BackendClient::translatedServerError(status, body);
}

void AuthManager::handleHttpError(int status, const QByteArray &body)
{
    const QString msg = translatedServerError(status, body);
    if (status == 429) {
        m_rateLimited = true;
        m_rateLimitSecs = 60;
        m_rateLimitTimer.start();
        emit rateLimitedChanged();
    }
    setError(msg);
}

bool AuthManager::isValidEmail(const QString &email) const
{
    static const QRegularExpression re(
        QStringLiteral("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$"),
        QRegularExpression::CaseInsensitiveOption);
    return re.match(email.trimmed()).hasMatch();
}

void AuthManager::requestOtp(const QString &email)
{
    const QString e = email.trimmed().toLower();
    if (!isValidEmail(e)) {
        setError(tr("Enter a valid email address"));
        return;
    }
    if (m_rateLimited) {
        setError(tr("Too many attempts — wait %1s").arg(m_rateLimitSecs));
        return;
    }

    setLoading(true);
    clearError();
    if (m_pendingEmail != e) {
        m_pendingEmail = e;
        emit otpSentChanged(); // pendingEmail shares this NOTIFY
    }

    QNetworkRequest req{QUrl(apiRoot(m_backend) + QStringLiteral("/api/v1/auth/otp/request"))};
    applyIdentityHeaders(req, m_backend);

    const QJsonObject body{{QStringLiteral("email"), e}};
    auto *reply = m_nam.post(req, QJsonDocument(body).toJson(QJsonDocument::Compact));
    const quint64 epoch = m_authEpoch;

    connect(reply, &QNetworkReply::finished, this, [this, reply, e, epoch]() {
        reply->deleteLater();
        setLoading(false);
        if (epoch != m_authEpoch)
            return; // signed out mid-flight — do not resurrect OTP state
        const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        const QByteArray raw = reply->readAll();

        if (reply->error() != QNetworkReply::NoError && status == 0) {
            // Dev affordance: must be opted in EXPLICITLY at runtime — a
            // QT_DEBUG define shipped a local auth bypass in any debug build.
#ifndef NDEBUG
            if (qEnvironmentVariableIsSet("LIVEMORPH_DEV_AUTH")) {
                m_otpSent = true;
                m_otpCooldownSecs = 30;
                m_otpCooldownTimer.start();
                emit otpSentChanged();
                emit otpCooldownChanged();
                emit otpRequested(e);
                setError(tr("Backend offline — dev mode: any 6–8 digit code works"));
            } else
#endif
            {
                setError(tr("Cannot reach authentication server. Check your connection."));
            }
            return;
        }

        if (status >= 300) {
            handleHttpError(status, raw);
            return;
        }

        bool ok = false;
        const auto obj = parseObjectOr(raw, &ok);
        if (!ok) {
            setError(tr("Invalid server response"));
            return;
        }
        const int len = obj.value(QStringLiteral("code_length")).toInt(8);
        if (len >= 6 && len <= 12 && len != m_otpCodeLength) {
            m_otpCodeLength = len;
            emit otpCodeLengthChanged();
        }
        const int ttl = obj.value(QStringLiteral("expires_in")).toInt(600);
        m_otpSent = true;
        // qBound(min, value, max) — args were reversed (qBound(30,120,ttl)
        // made ttl the max). Clamp the server TTL into the 30..120 window.
        m_otpCooldownSecs = qBound(30, ttl > 0 ? qMin(ttl, 120) : 30, 120);
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
    const quint64 epoch = m_authEpoch;

    connect(reply, &QNetworkReply::finished, this, [this, reply, e, c, epoch]() {
        reply->deleteLater();
        setLoading(false);
        if (epoch != m_authEpoch)
            return; // signed out mid-flight — do not resurrect state
        const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        const QByteArray raw = reply->readAll();

        if (reply->error() != QNetworkReply::NoError && status == 0) {
            // Dev affordance behind an explicit runtime opt-in — fabricating
            // JWTs must never happen just because the build has debug defines.
#ifndef NDEBUG
            if (qEnvironmentVariableIsSet("LIVEMORPH_DEV_AUTH")
                && c.length() == m_otpCodeLength) {
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

        if (status >= 300) {
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
    // Backend hashes with bcrypt (72-byte truncation) and rejects > 72 bytes —
    // check bytes, not chars, so multibyte passwords can't pass here and 400 there.
    if (e.isEmpty() || password.isEmpty()
        || password.toUtf8().size() < 8 || password.toUtf8().size() > 72) {
        setError(tr("Valid email and password (8-72 bytes) required"));
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
    const quint64 epoch = m_authEpoch;

    connect(reply, &QNetworkReply::finished, this, [this, reply, epoch]() {
        reply->deleteLater();
        setLoading(false);
        if (epoch != m_authEpoch)
            return; // signed out mid-flight — do not resurrect state
        const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        const QByteArray raw = reply->readAll();
        if (status >= 300 || reply->error() != QNetworkReply::NoError) {
            if (status == 0)
                setError(tr("Cannot reach backend"));
            else
                handleHttpError(status, raw);
            return;
        }
        bool ok = false;
        const auto obj = parseObjectOr(raw, &ok);
        if (!ok) {
            setError(tr("Invalid server response"));
            return;
        }
        applyAuthResponse(obj);
    });
}

void AuthManager::signUp(const QString &email, const QString &password, const QString &displayName)
{
    const QString e = email.trimmed().toLower();
    if (e.isEmpty() || password.toUtf8().size() < 8 || password.toUtf8().size() > 72) {
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
        // The auth screen states "By continuing, you agree to our Terms of
        // Service" — the backend requires explicit consent on register.
        {QStringLiteral("accepted_terms"), true},
    };
    if (!displayName.trimmed().isEmpty())
        body.insert(QStringLiteral("display_name"), displayName.trimmed());
    body.insert(QStringLiteral("device_id"), DeviceIdentity::deviceId());

    auto *reply = m_nam.post(req, QJsonDocument(body).toJson(QJsonDocument::Compact));
    const quint64 epoch = m_authEpoch;

    connect(reply, &QNetworkReply::finished, this, [this, reply, epoch]() {
        reply->deleteLater();
        setLoading(false);
        if (epoch != m_authEpoch)
            return; // signed out mid-flight — do not resurrect state
        const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        const QByteArray raw = reply->readAll();
        if (status >= 300 || reply->error() != QNetworkReply::NoError) {
            if (status == 0)
                setError(tr("Cannot reach backend"));
            else
                handleHttpError(status, raw);
            return;
        }
        bool ok = false;
        const auto obj = parseObjectOr(raw, &ok);
        if (!ok) {
            setError(tr("Invalid server response"));
            return;
        }
        applyAuthResponse(obj);
    });
}

void AuthManager::requestPasswordReset(const QString &email)
{
    const QString e = email.trimmed().toLower();
    if (e.indexOf('@') < 1) {
        setError(tr("Enter your account email"));
        return;
    }
    setLoading(true);
    clearError();
    QNetworkRequest req{QUrl(apiRoot(m_backend) + QStringLiteral("/api/v1/auth/password-reset-request"))};
    applyIdentityHeaders(req, m_backend);
    const QJsonObject body{{QStringLiteral("email"), e}};
    auto *reply = m_nam.post(req, QJsonDocument(body).toJson(QJsonDocument::Compact));
    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        reply->deleteLater();
        setLoading(false);
        const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        reply->readAll();
        // Any 4xx/5xx is a failure — previously some 4xx (NoError) fell through
        // and reported "email sent" when nothing was sent.
        if (status == 0 || status >= 300 || reply->error() != QNetworkReply::NoError) {
            setError(tr("Cannot reach backend"));
            return;
        }
        emit passwordResetRequested();
    });
}

void AuthManager::completePasswordReset(const QString &token, const QString &email, const QString &password)
{
    if (token.trimmed().isEmpty() || password.toUtf8().size() < 8 || password.toUtf8().size() > 72) {
        setError(tr("Enter the code from the email and a new password (8+ chars)"));
        return;
    }
    setLoading(true);
    clearError();
    QNetworkRequest req{QUrl(apiRoot(m_backend) + QStringLiteral("/api/v1/auth/password-reset"))};
    applyIdentityHeaders(req, m_backend);
    QJsonObject body{
        {QStringLiteral("token"), token.trimmed()},
        {QStringLiteral("password"), password},
    };
    if (!email.trimmed().isEmpty())
        body.insert(QStringLiteral("email"), email.trimmed().toLower());
    auto *reply = m_nam.post(req, QJsonDocument(body).toJson(QJsonDocument::Compact));
    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        reply->deleteLater();
        setLoading(false);
        const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        const QByteArray raw = reply->readAll();
        if (status == 0) {
            setError(tr("Cannot reach backend"));
            return;
        }
        if (status >= 300) {
            handleHttpError(status, raw);
            return;
        }
        emit passwordResetComplete();
    });
}

void AuthManager::signOut()
{
    // Fence: invalidate every in-flight auth request (refreshProfile /
    // verifyOtp / exchangeOAuthTicket completing after sign-out would
    // otherwise re-apply tokens and re-login the user).
    m_authEpoch++;
    if (!m_refreshToken.isEmpty() && m_backend) {
        QNetworkRequest req{QUrl(apiRoot(m_backend) + QStringLiteral("/api/v1/auth/logout"))};
        applyIdentityHeaders(req, m_backend);
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

    // Backend route is GET /auth/me (JWT via Authorization header, no body).
    auto *reply = m_nam.get(req);
    const quint64 epoch = m_authEpoch;
    connect(reply, &QNetworkReply::finished, this, [this, reply, epoch]() {
        reply->deleteLater();
        if (epoch != m_authEpoch)
            return; // signed out mid-flight — do not resurrect state
        const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        if (status == 401) {
            refreshTokens();
            return;
        }
        if (reply->error() != QNetworkReply::NoError)
            return;
        bool ok = false;
        const auto obj = parseObjectOr(reply->readAll(), &ok);
        if (!ok)
            return; // malformed body — keep current profile, retry on next push
        applyUserObject(obj);
        persistSession();
    });
}

void AuthManager::refreshTokens()
{
    if (m_refreshToken.isEmpty() || m_refreshInFlight)
        return;
    m_refreshInFlight = true;

    QNetworkRequest req{QUrl(apiRoot(m_backend) + QStringLiteral("/api/v1/auth/refresh"))};
    applyIdentityHeaders(req, m_backend);
    req.setTransferTimeout(20000);

    const QJsonObject body{{QStringLiteral("refresh_token"), m_refreshToken}};
    auto *reply = m_nam.post(req, QJsonDocument(body).toJson(QJsonDocument::Compact));
    const quint64 epoch = m_authEpoch;

    connect(reply, &QNetworkReply::finished, this, [this, reply, epoch]() {
        reply->deleteLater();
        m_refreshInFlight = false;
        // Epoch check FIRST: a refresh completing after sign-out must not
        // re-arm the timer (it would fire forever on an empty session).
        if (epoch != m_authEpoch)
            return; // signed out mid-flight — do not resurrect state
        const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        const bool transportError = status == 0 && reply->error() != QNetworkReply::NoError;
        if (transportError) {
            // Offline / DNS / socket timeout — KEEP the session. The persisted
            // tokens are still valid; wiping them here would destroy the login
            // because of a Wi-Fi blip.
            setError(tr("Network offline — session kept, will retry"));
            // The timer already fired — re-arm it or one blip disables
            // proactive refresh forever (only a 401 would ever recover it).
            m_refreshTimer.start(30 * 1000);
            return;
        }
        if (status == 401 || status == 403) {
            // Server explicitly rejected the refresh token — session is dead.
            m_authEpoch++; // invalidate in-flight replies, not just the tokens
            clearSessionLocal();
            emit signedOut();
            return;
        }
        if (status >= 300 || reply->error() != QNetworkReply::NoError) {
            // Other server errors (5xx etc.) — keep session, retry later.
            m_refreshTimer.start(30 * 1000);
            return;
        }
        bool ok = false;
        const auto obj = parseObjectOr(reply->readAll(), &ok);
        if (!ok) {
            // Malformed 200 — must NOT clear the access token; keep session.
            m_refreshTimer.start(30 * 1000);
            return;
        }
        applyAuthResponse(obj);
    });
}

void AuthManager::applyBalance(double credits, double bonus)
{
    // Guard against NaN/inf/negative pushes: NaN comparisons are always false,
    // which would silently disable the insufficient-credits gates.
    if (!qIsFinite(credits) || credits < 0.0)
        credits = m_creditBalance;
    if (!qIsFinite(bonus) || bonus < 0.0)
        bonus = m_bonusBalance;
    if (m_creditBalance == credits && m_bonusBalance == bonus)
        return; // no-op pushes skip the expensive profileChanged + disk write
    m_creditBalance = credits;
    m_bonusBalance = bonus;
    emit profileChanged();
    // Throttle disk writes — live billing pushes arrive continuously; persist
    // at most once per 2s (shared member, not a function-static).
    const qint64 now = QDateTime::currentMSecsSinceEpoch();
    if (now - m_lastPersistMs > 2000) {
        m_lastPersistMs = now;
        persistSession();
    }
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
    // Throttle disk writes — persist roughly once per 2s of burn (shared
    // member so applyBalance + deductCredits share one budget).
    const qint64 now = QDateTime::currentMSecsSinceEpoch();
    if (now - m_lastPersistMs > 2000) {
        m_lastPersistMs = now;
        persistSession();
    }
}

void AuthManager::applyAuthResponse(const QJsonObject &obj)
{
    const bool wasAuthenticated = m_authenticated;
    // Only overwrite when the server actually sent the field — a response
    // without access_token (or a malformed one) must never clear the session.
    if (obj.contains(QStringLiteral("access_token")))
        m_accessToken = obj.value(QStringLiteral("access_token")).toString();
    const QString rt = obj.value(QStringLiteral("refresh_token")).toString();
    // Only overwrite the refresh token when the server actually sent one —
    // some responses carry access-only, and clobbering with "" would log out.
    if (!rt.isEmpty())
        m_refreshToken = rt;
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
    const double cb = user.value(QStringLiteral("credit_balance")).toDouble();
    const double bb = user.value(QStringLiteral("bonus_balance")).toDouble();
    m_creditBalance = (qIsFinite(cb) && cb >= 0.0) ? cb : 0.0;
    m_bonusBalance = (qIsFinite(bb) && bb >= 0.0) ? bb : 0.0;
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
    m_googlePollTimer.stop(); // a stale Google poll must not outlive the session
    m_otpCooldownTimer.stop();
    m_rateLimitTimer.stop();
    // A lockout must not survive sign-out / session clear — otherwise the
    // user is permanently locked out of OTP until the window closes.
    m_rateLimited = false;
    m_rateLimitSecs = 0;
    emit rateLimitedChanged();
    setError({}); // no stale error toast after sign-out
    m_googleOAuthState.clear();
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
    if (m_loading) return; // no double-tap on destructive actions
    if (m_accessToken.isEmpty()) {
        signOut();
        return;
    }
    QNetworkRequest req{QUrl(apiRoot(m_backend) + QStringLiteral("/api/v1/auth/logout_all"))};
    applyIdentityHeaders(req, m_backend);
    auto *reply = m_nam.post(req, QByteArrayLiteral("{}"));
    const quint64 epoch = m_authEpoch;
    connect(reply, &QNetworkReply::finished, this, [this, reply, epoch]() {
        reply->deleteLater();
        const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        const QByteArray raw = reply->readAll();
        // A network failure must NOT wipe the local session — only a real
        // server response (or a sign-out race) may clear it.
        if (status == 0 || reply->error() != QNetworkReply::NoError) {
            setError(tr("Cannot reach backend — session kept"));
            return;
        }
        if (epoch != m_authEpoch)
            return;
        if (status >= 300) {
            handleHttpError(status, raw);
            return;
        }
        clearSessionLocal();
        emit signedOut();
    });
}

void AuthManager::deleteAccount()
{
    if (m_loading) return;
    if (m_accessToken.isEmpty()) return;
    QNetworkRequest req{QUrl(apiRoot(m_backend) + QStringLiteral("/api/v1/auth/delete_account"))};
    applyIdentityHeaders(req, m_backend);
    auto *reply = m_nam.post(req, QByteArrayLiteral("{}"));
    const quint64 epoch = m_authEpoch;
    connect(reply, &QNetworkReply::finished, this, [this, reply, epoch]() {
        reply->deleteLater();
        const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        const QByteArray raw = reply->readAll();
        // Offline "delete account" must not log the user out locally — the
        // server still has the account.
        if (status == 0 || reply->error() != QNetworkReply::NoError) {
            setError(tr("Cannot reach backend — account NOT deleted, session kept"));
            return;
        }
        if (epoch != m_authEpoch)
            return;
        if (status >= 300) {
            handleHttpError(status, raw);
            return;
        }
        clearSessionLocal();
        emit signedOut();
    });
}

void AuthManager::exportData()
{
    if (m_loading) return;
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
        const QByteArray json = reply->readAll();

        // Write a copy to Downloads for the user to keep.
        const QString dir = QStandardPaths::writableLocation(QStandardPaths::DownloadLocation);
        const QString name = QStringLiteral("livemorph-export-%1.json")
                                 .arg(QDateTime::currentDateTime().toString(QStringLiteral("yyyyMMdd-HHmmss")));
        const QString path = QDir(dir).filePath(name);
        QSaveFile f(path);
        if (f.open(QIODevice::WriteOnly)) {
            // Personal data export — keep the file private to the owning user
            // from creation, and write atomically (temp + rename) so a crash
            // mid-write can never leave a truncated, world-readable export.
            f.setPermissions(QFileDevice::ReadOwner | QFileDevice::WriteOwner);
            f.write(json);
            if (f.commit()) {
                emit dataExported(path);
                // Don't retain the full PII export in the secure store once the
                // file copy exists.
                SecureStore::remove(QStringLiteral("last_export_json"));
            } else {
                emit dataExported({});
            }
        } else {
            emit dataExported({});
        }
        setError({});
        emit profileChanged();
    });
}


void AuthManager::connectBalanceSocket()
{
    if (m_accessToken.isEmpty() || !m_backend)
        return;
    if (!m_balanceSocket) {
        m_balanceSocket = new QWebSocket(QString(), QWebSocketProtocol::VersionLatest, this);
        // Cap the socket read buffer so a hostile/compromised backend cannot
        // stream unbounded WS frames into memory (mirrors the signaling socket).
        m_balanceSocket->setReadBufferSize(8 * 1024 * 1024);
        connect(m_balanceSocket, &QWebSocket::disconnected, this, [this]() {
            // Exponential backoff + jitter — matches the signaling ladder.
            if (m_accessToken.isEmpty() || !m_backend)
                return;
            const int attempt = ++m_balanceWsAttempts;
            if (attempt > 6) m_balanceWsAttempts = 6;
            const int base = qMin(30000, 2000 << (attempt - 1));
            const int delay = base/2 + QRandomGenerator::global()->bounded(base/2 + 1);
            QTimer::singleShot(delay, this, [this]() {
                if (!m_accessToken.isEmpty() && m_backend && m_balanceSocket
                    && m_balanceSocket->state() == QAbstractSocket::UnconnectedState)
                    connectBalanceSocket();
            });
        });
        connect(m_balanceSocket, &QWebSocket::errorOccurred, this, [this](QAbstractSocket::SocketError) {
            // QWebSocket does NOT emit disconnected() for a failed open() —
            // re-arm the retry ladder from here or it dies silently.
            if (m_balanceSocket && m_balanceSocket->state() != QAbstractSocket::ConnectedState) {
                const int attempt = ++m_balanceWsAttempts;
                if (attempt > 6) m_balanceWsAttempts = 6;
                const int base = qMin(30000, 2000 << (attempt - 1));
                const int delay = base/2 + QRandomGenerator::global()->bounded(base/2 + 1);
                QTimer::singleShot(delay, this, [this]() {
                    if (!m_accessToken.isEmpty() && m_backend && m_balanceSocket
                        && m_balanceSocket->state() == QAbstractSocket::UnconnectedState)
                        connectBalanceSocket();
                });
            }
        });
        connect(m_balanceSocket, &QWebSocket::textMessageReceived, this, [this](const QString &msg) {
            // Reject oversized frames before parsing (1 MiB cap).
            if (msg.size() > 1024 * 1024)
                return;
            const auto doc = QJsonDocument::fromJson(msg.toUtf8());
            if (!doc.isObject()) return;
            const QJsonObject o = doc.object();
            const QString type = o.value(QStringLiteral("type")).toString();
            if (type == QLatin1String("balance_update")) {
                // Server pushes credit_balance + bonus_balance directly
                // (realtime/balance_ws.rs). Parse those fields; only fall back
                // to total/credits heuristics (and then a profile fetch) if
                // the explicit fields are absent — the old heuristic kept a
                // stale local bonus against a pushed TOTAL, inflating the
                // displayed balance by the bonus amount on every push.
                const bool hasBal = o.contains(QStringLiteral("credit_balance"));
                if (hasBal) {
                    const double credits = o.value(QStringLiteral("credit_balance")).toDouble();
                    const double bonus = o.contains(QStringLiteral("bonus_balance"))
                        ? o.value(QStringLiteral("bonus_balance")).toDouble()
                        : m_bonusBalance;
                    applyBalance(credits, bonus);
                } else if (o.contains(QStringLiteral("credits")) || o.contains(QStringLiteral("total"))) {
                    const double credits = o.contains(QStringLiteral("credits"))
                        ? o.value(QStringLiteral("credits")).toDouble()
                        : o.value(QStringLiteral("total")).toDouble();
                    const double bonus = o.contains(QStringLiteral("bonus"))
                        ? o.value(QStringLiteral("bonus")).toDouble()
                        : 0.0;
                    applyBalance(credits - bonus, bonus);
                } else {
                    refreshProfile(); // malformed push — fall back to a fetch
                }
            } else if (type == QLatin1String("force_disconnect")) {
                // The backend sends a stable code — map it to a localized string
                // instead of showing the raw code to the user.
                const QString code = o.value(QStringLiteral("reason")).toString();
                const QString reason = code == QLatin1String("insufficient_credits")
                                           || code == QLatin1String("credits_exhausted")
                                       ? tr("Credits depleted")
                                       : code == QLatin1String("platform_budget_exhausted")
                                           ? tr("Service capacity exhausted — try again later")
                                           : code == QLatin1String("admin")
                                               ? tr("Session ended by an administrator")
                                               : code.isEmpty() ? tr("Session ended")
                                                                : code;
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
    const QUrl baseUrl(m_backend->baseUrl());
    bool useServer = false;
    if (!fromServer.isEmpty()) {
        // Only trust a server-pushed WS URL if it is same-host and TLS-matched —
        // otherwise a malicious backend could exfiltrate the Bearer JWT.
        const QUrl su(fromServer);
        const bool hostOk = !su.host().isEmpty() && su.host() == baseUrl.host();
        const bool schemeOk = baseUrl.scheme() == QLatin1String("https")
            ? su.scheme() == QLatin1String("wss")
            : (su.scheme() == QLatin1String("wss") || su.scheme() == QLatin1String("ws"));
        if (hostOk && schemeOk) {
            url = su;
            useServer = true;
        }
    }
    if (!useServer) {
        const QString scheme = (baseUrl.scheme() == QLatin1String("https")) ? QStringLiteral("wss") : QStringLiteral("ws");
        url = QUrl(QStringLiteral("%1://%2").arg(scheme, baseUrl.authority()));
        url.setPath(QStringLiteral("/api/v1/ws"));
    }
    QUrlQuery q;
    q.addQueryItem(QStringLiteral("product"), QStringLiteral("livemorph"));
    q.addQueryItem(QStringLiteral("frontend_id"), QStringLiteral("livemorph"));
    q.addQueryItem(QStringLiteral("device_id"), DeviceIdentity::deviceId());
    url.setQuery(q);
    QNetworkRequest req{url};
    if (!m_accessToken.isEmpty())
        req.setRawHeader("Authorization", QByteArray("Bearer ") + m_accessToken.toUtf8());
    // Only open when unconnected: re-opening an already-connected socket drops
    // and reconnects it on every token refresh (churn + stale-token window).
    if (m_balanceSocket->state() == QAbstractSocket::UnconnectedState)
        m_balanceSocket->open(req);
}

void AuthManager::disconnectBalanceSocket()
{
    if (m_balanceSocket) {
        m_balanceSocket->close();
        m_balanceSocket->deleteLater();
        m_balanceSocket = nullptr;
    }
}
