#include "AppController.h"
#include "ApiClient.h"
#include "SessionManager.h"
#include "MachineIdProvider.h"
#include "UpdateChecker.h"
#include "StreamController.h"
#include "WebSocketClient.h"

#include <QCoreApplication>
#include <QTimer>
#include <QClipboard>
#include <QGuiApplication>
#include <QDesktopServices>
#include <QFileDialog>
#include <QUrl>
#include <QUrlQuery>
#include <QStandardPaths>
#include <QSettings>
#include <QSysInfo>
#include <QDir>
#include <QDateTime>

AppController::AppController(ApiClient *api, SessionManager *session,
                             MachineIdProvider *machineId, UpdateChecker *updater,
                             StreamController *stream, WebSocketClient *ws, QObject *parent)
    : QObject(parent)
    , m_api(api)
    , m_session(session)
    , m_machineId(machineId)
    , m_updater(updater)
    , m_stream(stream)
    , m_ws(ws)
{
    m_session->setDeviceId(m_machineId->deviceId());
    m_api->setDeviceId(m_machineId->deviceId());
    m_plans = fallbackPlans();
    m_payPollTimer = new QTimer(this);
    m_payPollTimer->setInterval(6000); // payment status; avoid tight loops
    connect(m_payPollTimer, &QTimer::timeout, this, &AppController::pollPaymentStatus);
    wireApi();
    wireWs();
    connect(m_stream, &StreamController::statusMessage, this,
            [this](const QString &msg, const QString &kind) { toast(msg, kind); });
    connect(m_session, &SessionManager::sessionChanged, this, &AppController::sessionUiChanged);
    connect(m_session, &SessionManager::creditsChanged, this, &AppController::sessionUiChanged);
}

QString AppController::screen() const
{
    switch (m_screen) {
    case Screen::Preloader:   return QStringLiteral("preloader");
    case Screen::Auth:        return QStringLiteral("auth");
    case Screen::AccessGate:  return QStringLiteral("accessGate");
    case Screen::Dashboard:   return QStringLiteral("dashboard");
    case Screen::Maintenance: return QStringLiteral("maintenance");
    }
    return QStringLiteral("preloader");
}

QString AppController::appVersion() const
{
    return QCoreApplication::applicationVersion();
}

QString AppController::expiryBannerText() const
{
    if (m_session->creditsRemaining() <= 0 && m_session->licensed())
        return QStringLiteral("Credits depleted — tap to buy more");
    if (m_session->creditsRemaining() > 0 && m_session->creditsRemaining() < 50)
        return QStringLiteral("Low credits (%1 left) — top up to avoid interruption")
            .arg(int(m_session->creditsRemaining()));
    return {};
}

QString AppController::expiryBannerKind() const
{
    if (m_session->creditsRemaining() <= 0) return QStringLiteral("urgent");
    if (m_session->creditsRemaining() < 50) return QStringLiteral("warn");
    return {};
}

#define MODAL_SETTER(name, member) \
void AppController::name(bool v) { if (member == v) return; member = v; emit modalChanged(); }

MODAL_SETTER(setShowAccountModal, m_showAccount)
MODAL_SETTER(setShowPlanGate, m_showPlanGate)
MODAL_SETTER(setShowUpgradeGate, m_showUpgrade)
MODAL_SETTER(setShowPayModal, m_showPay)
MODAL_SETTER(setShowTutorials, m_showTutorials)
MODAL_SETTER(setShowTour, m_showTour)
MODAL_SETTER(setShowConsent, m_showConsent)
MODAL_SETTER(setShowWelcome, m_showWelcome)
MODAL_SETTER(setShowBgPanel, m_showBg)
MODAL_SETTER(setShowAbuseReport, m_showAbuse)
MODAL_SETTER(setShowNotification, m_showNotification)
MODAL_SETTER(setShowCryptoProof, m_showCrypto)
MODAL_SETTER(setShowPaymentStatus, m_showPayStatus)

void AppController::setScreen(Screen s)
{
    // Auth / license gates so screens cannot be skipped
    if (s == Screen::Dashboard) {
        if (!m_session->authenticated()) {
            s = Screen::Auth;
        } else if (!m_session->licensed()) {
            s = Screen::AccessGate;
        }
    } else if (s == Screen::AccessGate) {
        if (!m_session->authenticated())
            s = Screen::Auth;
        else if (m_session->licensed())
            s = Screen::Dashboard;
    }

    if (m_screen == s) return;
    m_screen = s;
    emit screenChanged();
    if (s == Screen::Dashboard)
        maybeShowFirstRun();
}

QVariantList AppController::fallbackPlans() const
{
    const auto make = [](const char *id, const char *name, double dollars, int credits,
                         const char *time, bool popular) {
        QVariantMap m;
        m.insert(QStringLiteral("id"), QString::fromLatin1(id));
        m.insert(QStringLiteral("name"), QString::fromLatin1(name));
        m.insert(QStringLiteral("dollars"), dollars);
        m.insert(QStringLiteral("credits"), credits);
        m.insert(QStringLiteral("timeLabel"), QString::fromLatin1(time));
        m.insert(QStringLiteral("popular"), popular);
        return m;
    };
    return {
        make("test", "Test", 0.5, 50, "~25 sec", false),
        make("starter", "Starter", 20.0, 1000, "~8 min", false),
        make("pro", "Pro", 60.0, 5000, "~42 min", true),
        make("premium", "Premium", 150.0, 10000, "~83 min", false),
        make("elite", "Elite", 550.0, 50000, "~417 min", false),
    };
}

void AppController::wireApi()
{
    connect(m_api, &ApiClient::balanceUpdated, this, [this](const QVariantMap &bal) {
        if (m_session)
            m_session->applyCreditsMap(bal);
    });
    connect(m_api, &ApiClient::balanceForceDisconnect, this, [this](const QString &reason) {
        toast(reason.isEmpty() ? QStringLiteral("Credits depleted") : reason, QStringLiteral("error"));
        if (m_stream)
            m_stream->disconnectEngine();
    });
    connect(m_api, &ApiClient::refreshSucceeded, this, [this](const QVariantMap &payload) {
        const QString tok = payload.value(QStringLiteral("access_token")).toString();
        if (!tok.isEmpty())
            m_api->setBearerToken(tok);
        const QString rt = payload.value(QStringLiteral("refresh_token")).toString();
        if (!rt.isEmpty())
            m_session->setRefreshToken(rt);
        m_api->connectBalanceSocket();
    });

    connect(m_api, &ApiClient::loginSucceeded, this, [this](const QVariantMap &payload) {
        QVariantMap user = payload.value(QStringLiteral("user")).toMap();
        if (user.isEmpty())
            user = payload;
        const QString email = user.value(QStringLiteral("email")).toString();
        QString name = user.value(QStringLiteral("name")).toString();
        if (name.isEmpty())
            name = user.value(QStringLiteral("display_name")).toString();
        const QString id = user.value(QStringLiteral("id")).toString();
        // Unified API returns access_token (JWT); legacy used session_token
        QString token = payload.value(QStringLiteral("access_token")).toString();
        if (token.isEmpty())
            token = payload.value(QStringLiteral("session_token")).toString();
        if (!token.isEmpty())
            m_api->setBearerToken(token);
        m_session->setUser(email, name, id, token);
        const QString rt = payload.value(QStringLiteral("refresh_token")).toString();
        if (!rt.isEmpty())
            m_session->setRefreshToken(rt);
        m_api->setLicenseCredentials(m_session->accessKey(), m_session->userId(),
                                     m_machineId->deviceId());
        m_api->connectBalanceSocket();
        toast(QStringLiteral("Signed in"), QStringLiteral("ok"));
        if (m_session->licensed())
            enterAppAfterAuth();
        else
            setScreen(Screen::AccessGate);
    });

    connect(m_api, &ApiClient::loginFailed, this, [this](const QString &msg) {
        toast(msg.isEmpty() ? QStringLiteral("Login failed") : msg, QStringLiteral("error"));
    });

    connect(m_api, &ApiClient::passwordResetSucceeded, this, [this]() {
        toast(QStringLiteral("Password updated — you can sign in"), QStringLiteral("ok"));
    });

    connect(m_api, &ApiClient::passwordResetRequested, this, [this]() {
        toast(QStringLiteral("If an account exists, a reset link was sent"), QStringLiteral("ok"));
    });

    connect(m_api, &ApiClient::registerSucceeded, this, [this](const QVariantMap &payload) {
        QVariantMap user = payload.value(QStringLiteral("user")).toMap();
        if (user.isEmpty())
            user = payload;
        QString name = user.value(QStringLiteral("name")).toString();
        if (name.isEmpty())
            name = user.value(QStringLiteral("display_name")).toString();
        QString token = payload.value(QStringLiteral("access_token")).toString();
        if (token.isEmpty())
            token = payload.value(QStringLiteral("session_token")).toString();
        if (!token.isEmpty())
            m_api->setBearerToken(token);
        m_session->setUser(user.value(QStringLiteral("email")).toString(),
                           name,
                           user.value(QStringLiteral("id")).toString(),
                           token);
        const QString rt = payload.value(QStringLiteral("refresh_token")).toString();
        if (!rt.isEmpty())
            m_session->setRefreshToken(rt);
        m_api->connectBalanceSocket();
        // Signup bonus credits celebration — backend puts credits inside user object
        QVariantMap credits = payload.value(QStringLiteral("credits")).toMap();
        double bonus = credits.value(QStringLiteral("remaining")).toDouble();
        if (bonus <= 0)
            bonus = credits.value(QStringLiteral("total")).toDouble();
        if (bonus <= 0) {
            // Fallback: compute from user's balance fields
            bonus = user.value(QStringLiteral("credit_balance")).toDouble()
                    + user.value(QStringLiteral("bonus_balance")).toDouble();
        }
        if (bonus > 0) {
            m_freeCreditsAmount = bonus;
            m_freeCreditsTimeEst = QStringLiteral("≈ %1 min at standard burn").arg(int(bonus / 2.0 / 60.0) > 0 ? int(bonus / 2.0 / 60.0) : 1);
            m_showFreeCredits = true;
            emit modalChanged();
        }
        toast(QStringLiteral("Account created"), QStringLiteral("ok"));
        setScreen(Screen::AccessGate);
    });

    connect(m_api, &ApiClient::registerFailed, this, [this](const QString &msg) {
        toast(msg.isEmpty() ? QStringLiteral("Registration failed") : msg, QStringLiteral("error"));
    });

    connect(m_api, &ApiClient::keyValidated, this, [this](const QVariantMap &access) {
        m_session->setAccess(access);
        m_api->setLicenseCredentials(m_session->accessKey(), m_session->userId(),
                                     m_machineId->deviceId());
        if (access.contains(QStringLiteral("free_credits"))) {
            const double fc = access.value(QStringLiteral("free_credits")).toDouble();
            if (fc > 0) {
                m_freeCreditsAmount = fc;
                m_freeCreditsTimeEst = QStringLiteral("≈ %1 min at standard burn").arg(int(fc / 2.0 / 60.0) > 0 ? int(fc / 2.0 / 60.0) : 1);
                m_showFreeCredits = true;
                emit modalChanged();
            }
        }
        toast(QStringLiteral("License activated"), QStringLiteral("ok"));
        enterAppAfterAuth();
    });

    connect(m_api, &ApiClient::keyValidationFailed, this, [this](const QString &msg) {
        toast(msg.isEmpty() ? QStringLiteral("Invalid access key") : msg, QStringLiteral("error"));
    });

    connect(m_api, &ApiClient::creditsLoaded, this, [this](const QVariantMap &c) {
        m_session->applyCreditsMap(c);
    });
    connect(m_api, &ApiClient::creditsBurned, this, [this](const QVariantMap &c) {
        m_session->applyCreditsMap(c);
    });
    connect(m_api, &ApiClient::burnRateLoaded, m_session, &SessionManager::setBurnRate);

    connect(m_api, &ApiClient::plansLoaded, this, [this](const QVariantList &list) {
        if (!list.isEmpty()) {
            m_plans = list;
            emit plansChanged();
        }
    });

    connect(m_api, &ApiClient::backgroundPresetsLoaded, this, [this](const QVariantList &list) {
        m_bgPresets = list;
        emit bgPresetsChanged();
        m_stream->setBackgroundPresets(list);
    });

    connect(m_api, &ApiClient::paymentGatewayLoaded, this, [this](const QVariantMap &g) {
        m_paymentGateway = g;
        // Derive payment-method availability from the server gateway config
        // (flutterwave/crypto are disabled unless the backend reports them).
        m_payFlutterwave = g.value(QStringLiteral("flutterwave")).toBool();
        m_payCrypto = g.value(QStringLiteral("crypto")).toBool();
        emit platformChanged();
        emit paymentFlagsChanged();
    });

    connect(m_api, &ApiClient::paymentInitiated, this, [this](const QVariantMap &p) {
        m_paymentReference.clear(); // new payment; clear stale reference
        m_paymentPollCount = 0;
        const QString url = p.value(QStringLiteral("authorization_url")).toString();
        const QString alt = p.value(QStringLiteral("payment_url")).toString();
        const QString checkout = p.value(QStringLiteral("checkout_url")).toString();
        const QString openUrl = !url.isEmpty() ? url : (!alt.isEmpty() ? alt : checkout);

        // Crypto path: show in-app wallet/QR + TX proof form (no forced browser)
        const bool isCrypto = p.contains(QStringLiteral("wallet_address"))
                              || p.contains(QStringLiteral("address"))
                              || p.value(QStringLiteral("method")).toString() == QLatin1String("crypto")
                              || p.contains(QStringLiteral("qr_code"));
        if (isCrypto) {
            m_cryptoCheckout = p;
            m_showPay = false;
            m_showCrypto = true;
            emit paymentStatusChanged();
            emit modalChanged();
            toast(QStringLiteral("Send crypto then paste your TX ID"), QStringLiteral("info"));
            if (m_payPollTimer) m_payPollTimer->start();
            return;
        }

        // Card / hosted gateways: open in system browser (no WebEngine needed)
        if (!openUrl.isEmpty()) {
            QDesktopServices::openUrl(QUrl(openUrl));
            m_paymentStatus = p;
            m_showPay = false;
            m_showPayStatus = true;
            emit paymentStatusChanged();
            emit modalChanged();
            toast(QStringLiteral("Complete payment in your browser, then return here"), QStringLiteral("info"));
            if (m_payPollTimer) m_payPollTimer->start();
            return;
        }

        // Instant provision / no URL (dev)
        const QString newKey = p.value(QStringLiteral("access_key")).toString();
        if (!newKey.isEmpty()) {
            m_session->setAccess(p);
            m_api->setLicenseCredentials(m_session->accessKey(), m_session->userId(),
                                         m_machineId->deviceId());
        }
        m_paymentStatus = p;
        m_showPay = false;
        m_showPayStatus = true;
        emit paymentStatusChanged();
        emit modalChanged();
        if (m_payPollTimer) m_payPollTimer->start();
        refreshCredits();
    });

    connect(m_api, &ApiClient::paymentStatusLoaded, this, [this](const QVariantMap &s) {
        m_paymentStatus = s;
        emit paymentStatusChanged();
        const QString status = s.value(QStringLiteral("status")).toString().toLower();
        const bool paid = s.value(QStringLiteral("paid")).toBool()
                          || status == QLatin1String("success")
                          || status == QLatin1String("completed")
                          || status == QLatin1String("confirmed");
        if (paid) {
            if (m_payPollTimer) m_payPollTimer->stop();
            m_paymentReference.clear();
            m_paymentPollCount = 0;
            const QString newKey = s.value(QStringLiteral("access_key")).toString();
            if (!newKey.isEmpty()) {
                m_session->setAccess(s);
                m_api->setLicenseCredentials(m_session->accessKey(), m_session->userId(),
                                             m_machineId->deviceId());
            }
            m_showCrypto = false;
            m_showPayStatus = false;
            emit modalChanged();
            toast(QStringLiteral("Payment confirmed — credits unlocked"), QStringLiteral("ok"));
            refreshCredits();
            if (m_session->licensed())
                enterAppAfterAuth();
        }
    });

    connect(m_api, &ApiClient::paymentFailed, this, [this](const QString &e) {
        toast(e.isEmpty() ? QStringLiteral("Payment failed") : e, QStringLiteral("error"));
    });

    connect(m_api, &ApiClient::referralEarnedLoaded, this, [this](double v) {
        m_session->setReferralEarned(v);
    });
    connect(m_api, &ApiClient::referralCodeLoaded, this, [this](const QString &code) {
        m_session->setReferralCode(code);
    });

    connect(m_api, &ApiClient::dashboardNotification, this, [this](const QVariantMap &n) {
        if (n.isEmpty()) return;
        m_notification = n;
        m_showNotification = true;
        emit notificationChanged();
        emit modalChanged();
    });

    connect(m_api, &ApiClient::streamingAvailabilityLoaded, this, [this](bool enabled) {
        m_session->setStreamingEnabled(enabled);
    });

    connect(m_api, &ApiClient::maintenanceResult, this, [this](bool blocked, const QString &msg) {
        if (blocked) {
            toast(msg, QStringLiteral("error"));
            setScreen(Screen::Maintenance);
            return;
        }
        if (m_session->licensed())
            enterAppAfterAuth();
        else if (m_session->authenticated())
            setScreen(Screen::AccessGate);
        else
            setScreen(Screen::Auth);
    });

    connect(m_api, &ApiClient::logoutSucceeded, this, [this]() {
        m_ws->disconnectFromServer();
        m_stream->disconnectEngine();
        m_session->logout();
        m_api->clearLicenseCredentials();
        setScreen(Screen::Auth);
    });

    connect(m_api, &ApiClient::adminActionSucceeded, this, [this](const QString &msg) {
        toast(msg, QStringLiteral("ok"));
        m_showAdmin = false;
        emit modalChanged();
        m_api->fetchCredits();
    });
    connect(m_api, &ApiClient::adminActionFailed, this, [this](const QString &e) {
        toast(e.isEmpty() ? QStringLiteral("Admin action failed") : e, QStringLiteral("error"));
    });
}

void AppController::wireWs()
{
    connect(m_ws, &WebSocketClient::balanceUpdate, this, [this](const QVariantMap &c) {
        m_session->applyCreditsMap(c);
    });
    connect(m_ws, &WebSocketClient::forceDisconnect, this, [this](const QString &reason) {
        if (m_payPollTimer) m_payPollTimer->stop();
        m_stream->disconnectEngine();
        toast(reason.isEmpty() ? QStringLiteral("Disconnected by server") : reason,
              QStringLiteral("warn"));
    });
    connect(m_ws, &WebSocketClient::storageReset, this, [this]() {
        m_ws->disconnectFromServer();
        m_stream->disconnectEngine();
        if (m_stream->frozen())
            m_stream->toggleFreeze();
        m_session->clearSession();
        m_api->clearLicenseCredentials();
        // Close all modals
    m_showAccount = m_showPlanGate = m_showUpgrade = m_showPay = false;
    m_showTutorials = m_showTour = m_showBg = m_showAbuse = m_showNotification = false;
    m_showConsent = m_showWelcome = m_showFreeCredits = m_showCrypto = m_showPayStatus = false;
    m_showAdmin = false;
    m_showCheckoutWeb = false;
    m_checkoutUrl.clear();
    emit modalChanged();
    showLock(QStringLiteral("STORAGE RESET"),
                 QStringLiteral("Your local session was cleared by the server for security.\nSign in again to continue."),
                 false);
    });
    connect(m_ws, &WebSocketClient::forceLogout, this, [this]() {
        if (m_payPollTimer) m_payPollTimer->stop();
        m_paymentReference.clear();
        m_stream->disconnectEngine();
        m_ws->disconnectFromServer();
        if (m_stream->frozen())
            m_stream->toggleFreeze();
        m_session->clearSession();
        m_api->clearLicenseCredentials();
    m_showAccount = m_showPlanGate = m_showUpgrade = m_showPay = false;
    m_showTutorials = m_showTour = m_showBg = m_showAbuse = m_showNotification = false;
    m_showConsent = m_showWelcome = m_showFreeCredits = m_showCrypto = m_showPayStatus = false;
    m_showAdmin = false;
    m_showCheckoutWeb = false;
    m_checkoutUrl.clear();
    emit modalChanged();
    showLock(QStringLiteral("SIGNED OUT"),
                 QStringLiteral("You were signed out from another device or by an administrator.\nSign in again to continue."),
                 false);
    });
    connect(m_ws, &WebSocketClient::dashboardNotification, this, [this](const QVariantMap &n) {
        m_notification = n;
        m_showNotification = true;
        emit notificationChanged();
        emit modalChanged();
    });
}


void AppController::startRealtime()
{
    if (!m_session->licensed() || m_session->userId().isEmpty())
        return;
    m_ws->connectToServer(m_api->wsBaseUrl(), m_session->userId(), m_session->accessKey(),
                          m_api->bearerToken());
    m_api->setUserEmail(m_session->email());
    m_api->fetchCredits();
    m_api->fetchCreditBurnRate();
    m_api->fetchStreamingAvailability();
    m_api->fetchBackgroundPresets();
    m_api->fetchDashboardNotification();
    if (!m_session->email().isEmpty())
        m_api->getReferralCode(m_session->email());
}

void AppController::enterAppAfterAuth()
{
    m_api->setLicenseCredentials(m_session->accessKey(), m_session->userId(),
                                 m_machineId->deviceId());
    setScreen(Screen::Dashboard);
    startRealtime();
}

void AppController::maybeShowFirstRun()
{
    QSettings s(QStringLiteral("LiveEscape"), QStringLiteral("LiveEscape"));
    if (!m_session->consentGiven()) {
        m_showConsent = true;
        emit modalChanged();
        return;
    }
    if (!s.value(QStringLiteral("welcome_done")).toBool()) {
        m_showWelcome = true;
        emit modalChanged();
    }
}

void AppController::boot()
{
    setScreen(Screen::Preloader);
    m_session->setDeviceId(m_machineId->deviceId());
    m_api->setDeviceId(m_machineId->deviceId());

    // Restore persisted JWT into ApiClient so authenticated requests work on restart
    if (!m_session->sessionToken().isEmpty())
        m_api->setBearerToken(m_session->sessionToken());
    if (!m_session->refreshToken().isEmpty())
        m_api->setRefreshToken(m_session->refreshToken());

    // Boot sequence: resolve API → version → maintenance → plans/settings
    m_api->resolveApiEndpoint();
    QTimer::singleShot(400, this, [this]() {
        m_api->ping();
        m_updater->check();
        m_api->fetchPlans();
        m_api->fetchPlatformSettings();
        m_api->fetchPaymentGateway();
        m_api->fetchFeatureFlags();
        m_api->fetchDashboardMaintenance();
    });
}

void AppController::goTo(const QString &screenName)
{
    if (screenName == QLatin1String("auth")) setScreen(Screen::Auth);
    else if (screenName == QLatin1String("accessGate")) setScreen(Screen::AccessGate);
    else if (screenName == QLatin1String("dashboard")) setScreen(Screen::Dashboard);
    else if (screenName == QLatin1String("preloader")) setScreen(Screen::Preloader);
}

void AppController::login(const QString &email, const QString &password)
{
    if (email.trimmed().isEmpty() || password.isEmpty()) {
        toast(QStringLiteral("Enter email and password"), QStringLiteral("error"));
        return;
    }
    m_api->login(email.trimmed(), password, m_machineId->deviceId());
}

void AppController::registerUser(const QString &email, const QString &password,
                                 const QString &name, const QString &phone,
                                 const QString &refCode)
{
    if (email.trimmed().isEmpty() || password.isEmpty()) {
        toast(QStringLiteral("Email and password required"), QStringLiteral("error"));
        return;
    }
    if (password.size() < 8) {
        toast(QStringLiteral("Password must be at least 8 characters"), QStringLiteral("error"));
        return;
    }
    m_api->registerUser(name.trimmed(), email.trimmed(), password, m_machineId->deviceId(),
                        true, phone.trimmed(), refCode.trimmed());
}

void AppController::requestPasswordReset(const QString &email)
{
    if (email.trimmed().isEmpty()) {
        toast(QStringLiteral("Enter your email"), QStringLiteral("error"));
        return;
    }
    m_resetEmail = email.trimmed();
    m_api->requestPasswordReset(m_resetEmail);
}

void AppController::completePasswordReset(const QString &token, const QString &newPassword, const QString &email)
{
    if (token.trimmed().isEmpty()) {
        toast(QStringLiteral("Enter the reset token from your email"), QStringLiteral("error"));
        return;
    }
    if (newPassword.size() < 8) {
        toast(QStringLiteral("Password must be at least 8 characters"), QStringLiteral("error"));
        return;
    }
    const QString useEmail = email.trimmed().isEmpty() ? m_resetEmail : email.trimmed();
    m_api->completePasswordReset(token.trimmed(), newPassword, useEmail);
}

void AppController::activateKey(const QString &key)
{
    const QString k = key.trimmed().toUpper();
    if (k.isEmpty()) {
        toast(QStringLiteral("Enter your access key"), QStringLiteral("error"));
        return;
    }
    m_api->validateKey(k, m_machineId->deviceId(), m_session->userId());
}

void AppController::payActivation(const QString &planId)
{
    if (planId.isEmpty()) {
        toast(QStringLiteral("Select a plan first"), QStringLiteral("error"));
        return;
    }
    m_api->activationPay(planId, QStringLiteral("paystack"));
}

void AppController::logout()
{
    if (m_payPollTimer) m_payPollTimer->stop();
    m_paymentReference.clear();
    m_ws->disconnectFromServer();
    m_stream->disconnectEngine();
    m_api->logout();
    m_session->logout();
    m_api->clearLicenseCredentials();
    m_showAccount = m_showPlanGate = m_showUpgrade = m_showPay = false;
    m_showTutorials = m_showTour = m_showBg = m_showAbuse = m_showNotification = false;
    m_showConsent = m_showWelcome = m_showFreeCredits = m_showCrypto = m_showPayStatus = false;
    m_showAdmin = false;
    m_showCheckoutWeb = false;
    m_checkoutUrl.clear();
    emit modalChanged();
    setScreen(Screen::Auth);
    toast(QStringLiteral("Signed out"), QStringLiteral("info"));
}

void AppController::toast(const QString &message, const QString &kind)
{
    m_toast = message;
    m_toastKind = kind;
    ++m_toastSeq;
    emit toastSeqChanged();
    emit toastChanged();
}

void AppController::clearToast()
{
    if (m_toast.isEmpty() && m_toastKind == QLatin1String("info"))
        return;
    m_toast.clear();
    m_toastKind = QStringLiteral("info");
    emit toastChanged();
}

QString AppController::deviceId() const
{
    return m_machineId->deviceId();
}

void AppController::copyToClipboard(const QString &text)
{
    if (auto *cb = QGuiApplication::clipboard()) {
        cb->setText(text);
        toast(QStringLiteral("Copied to clipboard"), QStringLiteral("ok"));
    }
}

void AppController::pickReferenceFace()
{
    const QString path = QFileDialog::getOpenFileName(
        nullptr, QStringLiteral("Select Reference Face"),
        QStandardPaths::writableLocation(QStandardPaths::PicturesLocation),
        QStringLiteral("Images (*.png *.jpg *.jpeg *.webp)"));
    if (!path.isEmpty())
        m_stream->setReferenceFace(path);
}

void AppController::selectPlan(const QString &planId)
{
    for (const QVariant &v : m_plans) {
        const QVariantMap m = v.toMap();
        if (m.value(QStringLiteral("id")).toString() == planId
            || m.value(QStringLiteral("name")).toString().toLower() == planId.toLower()) {
            m_selectedPlan = m;
            emit selectedPlanChanged();
            m_showPlanGate = false;
            m_showPay = true;
            emit modalChanged();
            return;
        }
    }
    toast(QStringLiteral("Unknown plan"), QStringLiteral("error"));
}

void AppController::startCheckout(const QString &method)
{
    const QString planId = m_selectedPlan.value(QStringLiteral("id")).toString();
    if (planId.isEmpty()) {
        toast(QStringLiteral("Select a plan first"), QStringLiteral("warn"));
        return;
    }

    // Starter / test packs without active license use starter-pack endpoints
    if (!m_session->licensed()
        || planId == QLatin1String("test")
        || planId == QLatin1String("starter")) {
        m_api->starterPackPay(m_session->email(), method, m_selectedPlan);
        return;
    }

    // Licensed users: credit purchase or upgrade
    if (planId == QLatin1String("creator") || planId == QLatin1String("pro"))
        m_api->upgradePay(planId, method, m_selectedPlan);
    else
        m_api->purchaseCredits(planId, method, m_selectedPlan);
}


void AppController::pollPaymentStatus()
{
    // Hard cap: stop polling after 10 attempts (~60s) to prevent infinite loops
    if (m_paymentPollCount >= 10) {
        if (m_payPollTimer) m_payPollTimer->stop();
        m_paymentPollCount = 0;
        return;
    }
    // Prefer the Paystack reference parsed from the checkout callback, which
    // maps to an order via /credits/order-status. Fall back to email-based
    // starter-pack status for legacy flows.
    if (!m_paymentReference.isEmpty()) {
        m_paymentPollCount++;
        // After 3 polls (18s), trigger server-side Paystack verification
        // in case the webhook is unreachable (common in local dev).
        if (m_paymentPollCount >= 3) {
            m_api->verifyOrder(m_paymentReference, m_paymentReference);
            if (m_payPollTimer) m_payPollTimer->stop();
            return;
        }
        m_api->fetchOrderStatus(m_paymentReference);
        return;
    }
    const QString email = m_session->email();
    if (email.isEmpty()) {
        toast(QStringLiteral("No account email for payment status"), QStringLiteral("warn"));
        return;
    }
    m_api->starterPackStatus(email);
}

void AppController::submitCryptoProof(const QString &txId, const QString &proofPath)
{
    const QString tx = txId.trimmed();
    if (tx.isEmpty()) {
        toast(QStringLiteral("Enter a transaction ID"), QStringLiteral("error"));
        return;
    }
    const QString email = m_session->email();
    const QString planId = m_selectedPlan.value(QStringLiteral("id")).toString();
    m_api->submitCryptoProof(email, tx, planId, proofPath);
    toast(QStringLiteral("Crypto proof submitted — pending review"), QStringLiteral("ok"));
    m_showCrypto = false;
    m_showPayStatus = true;
    emit modalChanged();
    if (m_payPollTimer)
        m_payPollTimer->start();
}

void AppController::openUpgradeFlow()
{
    m_showUpgrade = true;
    m_showPlanGate = false;
    emit modalChanged();
}

void AppController::acceptConsent()
{
    m_session->setConsent(true);
    m_showConsent = false;
    emit modalChanged();
    QSettings s(QStringLiteral("LiveEscape"), QStringLiteral("LiveEscape"));
    if (!s.value(QStringLiteral("welcome_done")).toBool()) {
        m_showWelcome = true;
        emit modalChanged();
    }
}

void AppController::dismissWelcome()
{
    QSettings s(QStringLiteral("LiveEscape"), QStringLiteral("LiveEscape"));
    s.setValue(QStringLiteral("welcome_done"), true);
    m_showWelcome = false;
    emit modalChanged();
}

void AppController::dismissFreeCredits()
{
    m_showFreeCredits = false;
    emit modalChanged();
}

void AppController::showLock(const QString &title, const QString &message, bool dismissable)
{
    m_lockTitle = title;
    m_lockMessage = message;
    m_lockDismissable = dismissable;
    m_showLock = true;
    emit modalChanged();
}

void AppController::dismissLockScreen()
{
    m_showLock = false;
    emit modalChanged();
}

void AppController::startTour()
{
    m_tourStep = 1;
    m_showTour = true;
    emit tourChanged();
    emit modalChanged();
}

void AppController::nextTourStep()
{
    if (m_tourStep >= 5) {
        closeTour();
        return;
    }
    ++m_tourStep;
    emit tourChanged();
}

void AppController::prevTourStep()
{
    if (m_tourStep <= 1) return;
    --m_tourStep;
    emit tourChanged();
}

void AppController::closeTour()
{
    QSettings s(QStringLiteral("LiveEscape"), QStringLiteral("LiveEscape"));
    s.setValue(QStringLiteral("tour_done"), true);
    m_showTour = false;
    m_tourStep = 0;
    emit tourChanged();
    emit modalChanged();
}

void AppController::submitAbuseReport(const QString &details)
{
    if (details.trimmed().isEmpty()) {
        toast(QStringLiteral("Please describe the issue"), QStringLiteral("warn"));
        return;
    }
    m_api->createSupportTicket(QStringLiteral("Abuse report"), details.trimmed());
    m_showAbuse = false;
    emit modalChanged();
    toast(QStringLiteral("Report submitted — thank you"), QStringLiteral("ok"));
}

void AppController::openExternal(const QString &url)
{
    const QUrl u(url.trimmed());
    const QString s = u.scheme().toLower();
    if (s != QLatin1String("http") && s != QLatin1String("https")
        && s != QLatin1String("mailto")) {
        emit statusMessage(tr("Blocked URL scheme"), QStringLiteral("error"));
        return;
    }
    QDesktopServices::openUrl(u);
}

void AppController::refreshCredits()
{
    if (m_session->licensed())
        m_api->fetchCredits();
}

void AppController::dismissNotification()
{
    m_showNotification = false;
    if (!m_notification.isEmpty()) {
        m_notification.clear();
        emit notificationChanged();
    }
    emit modalChanged();
}

QString AppController::notificationTitle() const
{
    const QString title = m_notification.value(QStringLiteral("title")).toString();
    return title.isEmpty() ? QStringLiteral("NOTIFICATION") : title;
}

QString AppController::notificationMessage() const
{
    QString msg = m_notification.value(QStringLiteral("message")).toString();
    if (msg.isEmpty())
        msg = m_notification.value(QStringLiteral("body")).toString();
    return msg;
}

void AppController::setShowAdminPanel(bool v)
{
    // Client UI only — server still enforces admin_secret on privileged APIs
    if (v && !(m_session && m_session->licensed())) {
        emit statusMessage(tr("Admin tools require a signed-in license"), QStringLiteral("error"));
        return;
    }
    if (m_showAdmin == v) return;
    m_showAdmin = v;
    emit modalChanged();
}

void AppController::adminSaveEngineKey(const QString &key, const QString &adminSecret)
{
    if (key.trimmed().isEmpty()) {
        toast(QStringLiteral("Enter an engine key"), QStringLiteral("error"));
        return;
    }
    if (adminSecret.trimmed().isEmpty()) {
        toast(QStringLiteral("Admin secret required"), QStringLiteral("error"));
        return;
    }
    m_api->adminSaveEngineKey(key.trimmed(), adminSecret.trimmed());
}

void AppController::adminSetCredits(double total, const QString &adminSecret)
{
    if (total < 1 || !std::isfinite(total)) {
        toast(QStringLiteral("Enter a valid credit amount"), QStringLiteral("error"));
        return;
    }
    if (adminSecret.trimmed().isEmpty()) {
        toast(QStringLiteral("Admin secret required"), QStringLiteral("error"));
        return;
    }
    m_api->adminSetCredits(total, adminSecret.trimmed(), m_session->email());
}

void AppController::closeCheckoutWeb()
{
    m_showCheckoutWeb = false;
    m_checkoutUrl.clear();
    if (m_payPollTimer)
        m_payPollTimer->stop();
    emit modalChanged();
}

void AppController::onCheckoutCallback(const QString &url)
{
    // Extract the Paystack reference/trxref from the redirect URL so we can
    // poll the authoritative order status instead of guessing.
    const QUrl u(url);
    const QUrlQuery q(u.query());
    const QString reference = q.queryItemValue(QStringLiteral("reference")).trimmed();
    const QString trxref = q.queryItemValue(QStringLiteral("trxref")).trimmed();
    if (!reference.isEmpty())
        m_paymentReference = reference;
    else if (!trxref.isEmpty())
        m_paymentReference = trxref;

    m_showCheckoutWeb = false;
    m_showPayStatus = true;
    emit modalChanged();
    toast(QStringLiteral("Payment returned — verifying…"), QStringLiteral("info"));
    pollPaymentStatus();
    refreshCredits();
    if (m_payPollTimer)
        m_payPollTimer->start();
}

void AppController::pickCryptoProofImage()
{
    const QString path = QFileDialog::getOpenFileName(
        nullptr,
        QStringLiteral("Select crypto payment proof"),
        QStandardPaths::writableLocation(QStandardPaths::PicturesLocation),
        QStringLiteral("Images (*.png *.jpg *.jpeg *.webp);;All files (*)"));
    if (path.isEmpty())
        return;
    m_cryptoCheckout.insert(QStringLiteral("proof_path"), path);
    emit paymentStatusChanged();
    toast(QStringLiteral("Proof image selected"), QStringLiteral("ok"));
}

void AppController::captureReferenceFace()
{
    // Camera capture is driven from QML (DashboardScreen cameraPopup).
    // This entry point opens the same file picker as a fallback.
    pickReferenceFace();
}

QString AppController::captureImagePath(const QString &purpose) const
{
    const QString dir = QStandardPaths::writableLocation(QStandardPaths::TempLocation);
    return QDir(dir).filePath(QStringLiteral("ss_grab_%1_%2.png")
                                  .arg(purpose.isEmpty() ? QStringLiteral("frame") : purpose,
                                       QString::number(QDateTime::currentMSecsSinceEpoch())));
}

QString AppController::recordingPath() const
{
    const QString movies = QStandardPaths::writableLocation(QStandardPaths::MoviesLocation);
    const QString dir = movies + QStringLiteral("/LiveEscape");
    QDir().mkpath(dir);
    return dir + QStringLiteral("/rec_%1.mp4")
                     .arg(QString::number(QDateTime::currentMSecsSinceEpoch()));
}

void AppController::requestStorageReset()
{
    m_api->getJson(QStringLiteral("/api/v1/public/storage-reset-token"), false,
        [this](const QJsonObject &o) {
            const QString token = o.value(QStringLiteral("token")).toString();
            if (token.isEmpty()) {
                toast(QStringLiteral("Failed to obtain reset token"), QStringLiteral("error"));
                return;
            }
            QJsonObject body{{QStringLiteral("token"), token}};
            m_api->postJson(QStringLiteral("/api/v1/public/storage-reset"), body, false,
                [this](const QJsonObject &) {
                    // clear local settings
                    QSettings s(QStringLiteral("LiveEscape"), QStringLiteral("LiveEscape"));
                    s.clear();
                    m_session->clear();
                    toast(QStringLiteral("Local storage reset complete"), QStringLiteral("ok"));
                    showLock(QStringLiteral("STORAGE RESET"), QStringLiteral("Local data cleared. Please restart the app."), true);
                },
                [this](const QString &e) {
                    toast(QStringLiteral("Storage reset failed: %1").arg(e), QStringLiteral("error"));
                });
        },
        [this](const QString &e) {
            toast(QStringLiteral("Storage reset failed: %1").arg(e), QStringLiteral("error"));
        });
}

void AppController::loadDownloads(const QString &accessKey)
{
    QString path = QStringLiteral("/api/v1/downloads/list");
    if (!accessKey.isEmpty())
        path += QStringLiteral("?access_key=%1").arg(QUrl::toPercentEncoding(accessKey));
    m_api->getJson(path, false,
        [this](const QJsonObject &o) {
            QJsonArray arr = o.value(QStringLiteral("items")).toArray();
            if (arr.isEmpty()) {
                // try direct array
                arr = QJsonArray::fromString(o.toString());
            }
            m_downloads.clear();
            const auto ref = m_downloads;
            for (const auto &v : arr) {
                m_downloads.append(v.toObject().toVariantMap());
            }
            emit downloadsChanged();
        },
        [this](const QString &e) {
            toast(QStringLiteral("Failed to load downloads: %1").arg(e), QStringLiteral("error"));
        });
}
