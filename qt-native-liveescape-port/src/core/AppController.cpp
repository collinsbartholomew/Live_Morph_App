#include "AppController.h"
#include "ApiClient.h"
#include "SessionManager.h"
#include "MachineIdProvider.h"
#include "UpdateChecker.h"
#include "StreamController.h"
#include "WebSocketClient.h"
#include "I18nManager.h"

#include <QCoreApplication>
#include <QTimer>
#include <QClipboard>
#include <QGuiApplication>
#include <QDesktopServices>
#include <QFileDialog>
#include <QFile>
#include <QFileInfo>
#include <QUrl>
#include <QUrlQuery>
#include <QStandardPaths>
#include <QSettings>
#include <QSysInfo>
#include <QDir>
#include <QDateTime>
#include <QJsonArray>
#include <QRegularExpression>

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
    connect(m_session, &SessionManager::creditsExhausted, this, [this]() {
        // Reference lock screen: streaming is blocked until the user tops up.
        showLock(tr("CREDITS EXHAUSTED"),
                 QStringLiteral("Your Smoke Screen credit balance has reached zero. "
                                "All streaming has been stopped automatically.\n\n"
                                "You can dismiss this message to keep using the app UI, "
                                "but streaming stays blocked until you top up."),
                 true);
    });
    // Force update: block all UI when a mandatory update is required
    connect(m_updater, &UpdateChecker::forceUpdateRequired, this, [this](const QString &version, const QString &url) {
        m_forceUpdateVersion = version;
        m_forceUpdateUrl = url;
        m_showForceUpdate = true;
        emit modalChanged();
    });
    connect(m_updater, &UpdateChecker::downloadProgressChanged, this, [this]() { emit downloadProgressChanged(); });
    connect(m_updater, &UpdateChecker::downloadingChanged, this, [this]() { emit downloadProgressChanged(); });
    connect(m_updater, &UpdateChecker::downloadReady, this, [this](const QString &path) {
        toast(tr("Installer ready — launching and quitting."), QStringLiteral("ok"));
        QDesktopServices::openUrl(QUrl::fromLocalFile(path));
#if defined(Q_OS_WIN) || defined(Q_OS_MAC)
        // macOS/Windows: launch installer, quit — installer replaces the app.
        QCoreApplication::quit();
#endif
    });
    connect(m_updater, &UpdateChecker::downloadFailed, this, [this](const QString &e) {
        toast(tr("Download failed: %1").arg(e), QStringLiteral("error"));
    });
    // Manual update checks report their outcome; the silent boot check does not.
    connect(m_updater, &UpdateChecker::checkFinished, this, [this](bool forceUpdate) {
        if (!m_manualUpdateCheck)
            return;
        m_manualUpdateCheck = false;
        if (!forceUpdate)
            toast(tr("You are up to date"), QStringLiteral("ok"));
        // forceUpdate == true → forceUpdateRequired already shows the blocker.
    });
    connect(m_updater, &UpdateChecker::checkFailed, this, [this]() {
        if (!m_manualUpdateCheck)
            return;
        m_manualUpdateCheck = false;
        toast(tr("Update check failed — check your connection"), QStringLiteral("error"));
    });

    // Gate enforcer (reference startGateEnforcer): every second re-evaluate the
    // required gate so stale entitlement/credit state can never persist, and
    // re-sync credits with the server every 30s.
    m_gateTimer = new QTimer(this);
    m_gateTimer->setInterval(1000);
    connect(m_gateTimer, &QTimer::timeout, this, &AppController::enforceGateRequirement);
    m_gateTimer->start();
    m_lastCreditSync.start();
}

double AppController::activationAmountUsd() const
{
    const double v = m_paymentGateway.value(QStringLiteral("activation_amount_usd")).toDouble();
    return v > 0 ? v : 75.0;
}

QString AppController::fmtActivationUsd() const
{
    const double n = activationAmountUsd();
    const double rounded = qRound(n * 100.0) / 100.0;
    if (rounded == qRound(rounded))
        return QStringLiteral("$%1").arg(qRound(rounded));
    return QStringLiteral("$%1").arg(rounded, 0, 'f', 2);
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

MODAL_SETTER(setShowPlanGate, m_showPlanGate)
MODAL_SETTER(setShowUpgradeGate, m_showUpgrade)

void AppController::setShowAccountModal(bool v)
{
    if (m_showAccount == v)
        return;
    m_showAccount = v;
    if (v)
        loadPayoutDetails();
    emit modalChanged();
}
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
MODAL_SETTER(setShowExpiry, m_showExpiry)

void AppController::setScreen(Screen s)
{
    // Auth / license gates so screens cannot be skipped. Starter Pack users
    // stream without a full license until credits run out (reference
    // getGateRequirement: starter users skip the access gate entirely).
    const bool starter = m_session->starterPack();
    if (s == Screen::Dashboard) {
        if (!m_session->authenticated()) {
            s = Screen::Auth;
        } else if (!m_session->licensed() && !starter) {
            s = Screen::AccessGate;
        }
    } else if (s == Screen::AccessGate) {
        if (!m_session->authenticated())
            s = Screen::Auth;
        else if (m_session->licensed() || starter)
            s = Screen::Dashboard;
    }

    if (m_screen == s) return;
    m_screen = s;
    emit screenChanged();
    if (s == Screen::Dashboard) {
        // Expired license routes to the expiry modal before the dashboard is
        // usable (reference getGateRequirement 'expiry' hides mainApp).
        if (m_session->licensed() && m_session->licenseExpired() && !m_showExpiry) {
            m_showExpiry = true;
            emit modalChanged();
        }
        maybeShowFirstRun();
    }
}

QVariantList AppController::fallbackPlans() const
{
    const auto make = [](const char *id, const char *name, double dollars, int credits,
                         const char *time, bool popular, const QStringList &features) {
        QVariantMap m;
        m.insert(QStringLiteral("id"), QString::fromLatin1(id));
        m.insert(QStringLiteral("name"), QString::fromLatin1(name));
        m.insert(QStringLiteral("dollars"), dollars);
        m.insert(QStringLiteral("credits"), credits);
        m.insert(QStringLiteral("timeLabel"), QString::fromLatin1(time));
        m.insert(QStringLiteral("popular"), popular);
        m.insert(QStringLiteral("features"), features);
        return m;
    };
    return {
        make("test", "Test", 0.5, 50, "~25 sec", false,
             {QStringLiteral("Full AI engine access"), QStringLiteral("OBS / Theatre mode")}),
        make("starter", "Starter", 20.0, 1000, "~8 min", false,
             {QStringLiteral("Full AI engine access"), QStringLiteral("All presets included"), QStringLiteral("OBS / Theatre mode")}),
        make("pro", "Pro", 60.0, 5000, "~42 min", true,
             {QStringLiteral("Full AI engine access"), QStringLiteral("All presets included"), QStringLiteral("OBS / Theatre mode"), QStringLiteral("Priority Support")}),
        make("premium", "Premium", 150.0, 10000, "~83 min", false,
             {QStringLiteral("Full AI engine access"), QStringLiteral("All presets included"), QStringLiteral("OBS / Theatre mode"), QStringLiteral("Priority Support")}),
        make("elite", "Elite", 550.0, 50000, "~417 min", false,
             {QStringLiteral("Full AI engine access"), QStringLiteral("All presets included"), QStringLiteral("OBS / Theatre mode"), QStringLiteral("Priority Support")}),
    };
}

void AppController::wireApi()
{
    connect(m_api, &ApiClient::refreshSucceeded, this, [this](const QVariantMap &payload) {
        const QString tok = payload.value(QStringLiteral("access_token")).toString();
        if (!tok.isEmpty())
            m_api->setBearerToken(tok);
        const QString rt = payload.value(QStringLiteral("refresh_token")).toString();
        if (!rt.isEmpty())
            m_session->setRefreshToken(rt);
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
        const QString created = user.value(QStringLiteral("created_at")).toString();
        if (!created.isEmpty())
            m_session->setMemberSince(created);
        // Unified API returns access_token (JWT); legacy used session_token
        QString token = payload.value(QStringLiteral("access_token")).toString();
        if (token.isEmpty())
            token = payload.value(QStringLiteral("session_token")).toString();
        if (!token.isEmpty())
            m_api->setBearerToken(token);
        // Account switch: drop the previous account's license entitlement so a
        // key stored for user A can never auto-admit user B (Electron clears
        // account state on every auth success). Same-account re-login keeps it;
        // boot revalidation confirms server-side anyway.
        if (m_session->authenticated() && !m_session->email().isEmpty()
            && !email.isEmpty() && m_session->email() != email) {
            m_session->clearLicenseState();
            m_api->clearLicenseCredentials();
        }
        m_session->setUser(email, name, id, token);
        const QString rt = payload.value(QStringLiteral("refresh_token")).toString();
        if (!rt.isEmpty())
            m_session->setRefreshToken(rt);
        m_api->setUserEmail(email);
        m_api->setLicenseCredentials(m_session->accessKey(), m_session->userId(),
                                     m_machineId->deviceId());
        toast(tr("Signed in"), QStringLiteral("ok"));
        if (m_session->licensed())
            enterAppAfterAuth();
        else
            setScreen(Screen::AccessGate);
    });

    connect(m_api, &ApiClient::loginFailed, this, [this](const QString &msg) {
        toast(msg.isEmpty() ? QStringLiteral("Login failed") : msg, QStringLiteral("error"));
    });

    connect(m_api, &ApiClient::passwordResetSucceeded, this, [this]() {
        toast(tr("Password updated — you can sign in"), QStringLiteral("ok"));
        m_pendingResetToken.clear();
        emit pendingResetTokenChanged();
        emit passwordResetCompleted();
    });

    connect(m_api, &ApiClient::passwordResetRequested, this, [this]() {
        toast(tr("If an account exists, a reset link was sent"), QStringLiteral("ok"));
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
        // A brand-new account starts with no entitlement: always drop any
        // license key left over from a previous account on this device.
        m_session->clearLicenseState();
        m_api->clearLicenseCredentials();
        const QString created = user.value(QStringLiteral("created_at")).toString();
        if (!created.isEmpty())
            m_session->setMemberSince(created);
        m_session->setUser(user.value(QStringLiteral("email")).toString(),
                           name,
                           user.value(QStringLiteral("id")).toString(),
                           token);
        const QString rt = payload.value(QStringLiteral("refresh_token")).toString();
        if (!rt.isEmpty())
            m_session->setRefreshToken(rt);
        m_api->setUserEmail(m_session->email());
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
            m_freeCreditsTimeEst = QStringLiteral("≈ %1 min at standard burn").arg(int(bonus / m_session->burnRatePerSecond() / 60.0) > 0 ? int(bonus / m_session->burnRatePerSecond() / 60.0) : 1);
            // Defer the celebration until after the first-run tour completes
            // (reference: tour finishes, then the free-credits popup appears).
            m_pendingFreeCredits = bonus;
        }
        toast(tr("Account created"), QStringLiteral("ok"));
        setScreen(Screen::AccessGate);
        m_lastRegEmail.clear();
        m_lastRegPass.clear();
        // Referral consumed by this signup — retire the stored code
        // (Electron keeps ss_referred_by_v1 only until attach succeeds).
        if (!m_pendingReferralCode.isEmpty()) {
            m_pendingReferralCode.clear();
            QSettings s(QStringLiteral("SmokeScreen"), QStringLiteral("Smoke Screen"));
            s.remove(QStringLiteral("referred_by"));
            emit pendingReferralCodeChanged();
        }
    });

    connect(m_api, &ApiClient::registerFailed, this, [this](const QString &msg) {
        // Electron parity: a 409 "already registered" signup transparently
        // falls back to login with the same credentials (doSignup).
        static const QRegularExpression alreadyRe(
            QStringLiteral("already|exists|registered|duplicate"),
            QRegularExpression::CaseInsensitiveOption);
        if (!m_lastRegEmail.isEmpty() && alreadyRe.match(msg).hasMatch()) {
            toast(tr("Account already exists. Signing you in…"), QStringLiteral("info"));
            const QString email = m_lastRegEmail;
            const QString pass = m_lastRegPass;
            m_lastRegEmail.clear();
            m_lastRegPass.clear();
            m_api->login(email, pass, m_machineId->deviceId());
            return;
        }
        m_lastRegEmail.clear();
        m_lastRegPass.clear();
        toast(msg.isEmpty() ? QStringLiteral("Registration failed") : msg, QStringLiteral("error"));
    });

    connect(m_api, &ApiClient::keyValidated, this, [this](const QVariantMap &access) {
        m_session->setAccess(access);
        m_api->setLicenseCredentials(m_session->accessKey(), m_session->userId(),
                                     m_machineId->deviceId());
        if (m_activationError.isEmpty()) { /* nothing to clear visually */ }
        else { m_activationError.clear(); emit sessionUiChanged(); }
        if (access.contains(QStringLiteral("free_credits"))) {
            const double fc = access.value(QStringLiteral("free_credits")).toDouble();
            if (fc > 0) {
                m_freeCreditsAmount = fc;
                m_freeCreditsTimeEst = QStringLiteral("≈ %1 min at standard burn").arg(int(fc / m_session->burnRatePerSecond() / 60.0) > 0 ? int(fc / m_session->burnRatePerSecond() / 60.0) : 1);
                m_pendingFreeCredits = fc;
            }
        }
        if (m_bootLicenseCheck) {
            // Silent boot revalidation: entitlement confirmed, no UI churn.
            m_bootLicenseCheck = false;
            return;
        }
        toast(tr("License activated"), QStringLiteral("ok"));
        enterAppAfterAuth();
    });

    connect(m_api, &ApiClient::keyValidationFailed, this, [this](const QString &msg) {
        if (m_bootLicenseCheck) {
            // Server rejected the stored key at boot — clear the stale
            // entitlement so the user is routed through the access gate.
            m_bootLicenseCheck = false;
            m_session->clearLicenseState();
            m_api->clearLicenseCredentials();
            if (msg.contains(QStringLiteral("expired"), Qt::CaseInsensitive)) {
                m_showExpiry = true;
                emit modalChanged();
            } else {
                toast(msg.isEmpty() ? tr("License no longer valid")
                                    : msg, QStringLiteral("error"));
            }
            if (m_session->authenticated() && m_screen == Screen::Dashboard)
                setScreen(Screen::AccessGate);
            return;
        }
        // Inline red feedback under the key input (Electron #akeyErr) in
        // addition to the toast — the reserved 14px gutter keeps the layout
        // from jumping.
        if (!msg.isEmpty() && m_showExpiry == false) {
            m_activationError = msg;
            emit sessionUiChanged();
        }
        if (msg.contains(QStringLiteral("expired"), Qt::CaseInsensitive)) {
            m_showExpiry = true;
            emit modalChanged();
            return;
        }
        toast(msg.isEmpty() ? QStringLiteral("Invalid access key") : msg, QStringLiteral("error"));
    });

    connect(m_api, &ApiClient::creditsLoaded, this, [this](const QVariantMap &c) {
        m_session->applyCreditsMap(c);
        m_creditsSynced = true;
        // Positive balance clears the session exhaustion acknowledgment so a
        // future exhaustion re-shows the lock (reference syncCreditsFromServer).
        if (m_session->creditsRemaining() > 0)
            m_creditsAck = false;
        // Boot-time exhaustion lock (Electron isCreditsExhaustionLockScenario):
        // a user who burned their balance and restarted the app must not land
        // in the Dashboard unimpeded. Only accounts with ledger activity lock
        // (total/used > 0) — never-funded accounts simply have nothing to stream.
        // Starter Pack users get the mandatory Starter Lock instead.
        if (!m_bootCreditsChecked) {
            m_bootCreditsChecked = true;
            if (m_session->starterPack()) {
                if (m_session->creditsRemaining() <= 0.0)
                    showStarterLockScreen();
            } else if (m_session->licensed() && m_session->authenticated()
                       && m_session->creditsRemaining() <= 0.0
                       && (m_session->creditsUsed() > 0.0 || m_session->creditsTotal() > 0)) {
                showLock(tr("CREDITS EXHAUSTED"),
                         QStringLiteral("Your Smoke Screen credit balance has reached zero. "
                                        "Streaming stays blocked until you top up."),
                         true);
            }
        }
    });
    connect(m_api, &ApiClient::creditsFailed, this, [this](const QString &e) {
        const QString msg = e.isEmpty() ? QStringLiteral("Could not redeem credit key") : e;
        // Inline error under PayModal key input (Electron #keyErr) when the
        // payment modal is visible; otherwise fall back to a toast.
        if (m_showPay) {
            m_keyRedeemError = msg;
            emit keyRedeemErrorChanged();
            emit sessionUiChanged();
        }
        toast(msg, QStringLiteral("error"));
    });
    connect(m_api, &ApiClient::payoutDetailsLoaded, this, [this](const QVariantMap &d) {
        // ApiClient unwraps the backend's {details:{...}} envelope; the map
        // is already the flat payout record (empty when none on file).
        m_payoutDetails = d;
        emit payoutChanged();
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

    connect(m_api, &ApiClient::activationPlansLoaded, this, [this](const QVariantList &list) {
        if (!list.isEmpty()) {
            m_activationPlans = list;
        } else {
            // Reference gate grid fallback (Starter/Creator/Pro annual license).
            m_activationPlans = QVariantList{
                QVariantMap{{"id", "starter"}, {"name", "Starter"}, {"dollars", 20.0}, {"credits", 300.0}, {"timeLabel", "~2.5 min"}, {"popular", false}},
                QVariantMap{{"id", "creator"}, {"name", "Creator"}, {"dollars", 75.0}, {"credits", 500.0}, {"timeLabel", "~4 min"}, {"popular", true}},
                QVariantMap{{"id", "pro"}, {"name", "Pro"}, {"dollars", 120.0}, {"credits", 2000.0}, {"timeLabel", "~17 min"}, {"popular", false}},
            };
        }
        emit activationPlansChanged();
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
        // Starter Pay picker shows "Loading payment options…" until the gateway
        // config arrives (reference openStarterPayModal + starterPayLoadingMsg).
        if (m_starterPayLoading) {
            m_starterPayLoading = false;
            emit modalChanged();
        }
        emit platformChanged();
        emit paymentFlagsChanged();
    });

    connect(m_api, &ApiClient::paymentInitiated, this, [this](const QVariantMap &p) {
        m_paymentReference.clear(); // new payment; clear stale reference
        m_paymentPollCount = 0;
        // Payment init answered — release the Starter Pay button lock.
        if (m_starterPayLoading) {
            m_starterPayLoading = false;
            emit modalChanged();
        }
        // Capture the order reference from the init response so the poll loop can
        // verify the authoritative order instead of falling back to starter status.
        const QString oid = p.value(QStringLiteral("order_id")).toString();
        const QString ref = p.value(QStringLiteral("reference")).toString();
        if (!oid.isEmpty())
            m_paymentReference = oid;
        else if (!ref.isEmpty())
            m_paymentReference = ref;
        const QString url = p.value(QStringLiteral("authorization_url")).toString();
        const QString alt = p.value(QStringLiteral("payment_url")).toString();
        const QString checkout = p.value(QStringLiteral("checkout_url")).toString();
        const QString openUrl = !url.isEmpty() ? url : (!alt.isEmpty() ? alt : checkout);

        // Crypto path: show in-app wallet/QR + TX proof form (no forced browser)
        const bool isCrypto = p.contains(QStringLiteral("wallet_address"))
                              || p.contains(QStringLiteral("address"))
                              || p.contains(QStringLiteral("pay_address"))
                              || p.value(QStringLiteral("method")).toString() == QLatin1String("crypto")
                              || p.contains(QStringLiteral("qr_code"));
        if (isCrypto) {
            m_cryptoCheckout = p;
            m_showPay = false;
            m_showCrypto = true;
            emit paymentStatusChanged();
            emit modalChanged();
            toast(tr("Send the exact amount shown — then submit the pre-filled Payment ID"), QStringLiteral("info"));
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
            toast(tr("Complete payment in your browser, then return here"), QStringLiteral("info"));
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
        // Complete status vocabulary across the backend's order stores:
        //  - payments/orders: pending|paid|provisioning|provisioned|failed…
        //  - starter-pack/status: approved|pending|rejected|none
        //  - NOWPayments: waiting|confirming|sending|partially_paid|finished|confirmed…
        const bool paid = s.value(QStringLiteral("paid")).toBool()
                          || status == QLatin1String("success")
                          || status == QLatin1String("successful")
                          || status == QLatin1String("completed")
                          || status == QLatin1String("confirmed")
                          || status == QLatin1String("provisioned")
                          || status == QLatin1String("paid")
                          || status == QLatin1String("approved")
                          || status == QLatin1String("finished");
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
            toast(tr("Payment confirmed — credits unlocked"), QStringLiteral("ok"));
            refreshCredits();
            if (m_session->licensed())
                enterAppAfterAuth();
        }
    });

    connect(m_api, &ApiClient::paymentFailed, this, [this](const QString &e) {
        // Release the Starter Pay button lock even when no payment UI is visible.
        if (m_starterPayLoading) {
            m_starterPayLoading = false;
            emit modalChanged();
        }
        // Silent while no payment UI is visible: the 6s poll keeps running to
        // auto-confirm when the user returns from the hosted checkout, but a
        // closed modal must not spray an error toast every 6 seconds.
        if (!m_showPayStatus && !m_showCrypto && !m_showPay)
            return;
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

    // Feature flags drive server-controlled free-credit gating for brand-new
    // users (reference: /public/feature-flags free_credits_enabled + amount).
    connect(m_api, &ApiClient::featureFlagsLoaded, this, [this](const QVariantMap &flags) {
        m_featureFreeCreditsEnabled = flags.value(QStringLiteral("free_credits_enabled")).toBool();
        m_featureFreeCreditsAmount = flags.value(QStringLiteral("free_credits_amount")).toDouble();
        m_featureReferralEnabled = flags.value(QStringLiteral("referral_enabled")).toBool();
        const double rc = flags.value(QStringLiteral("referral_credits")).toDouble();
        m_featureReferralCredits = rc > 0 ? rc : 100.0;
        emit platformChanged();
    });

    connect(m_api, &ApiClient::maintenanceResult, this, [this](bool blocked, const QString &msg) {
        if (blocked) {
            toast(msg, QStringLiteral("error"));
            setScreen(Screen::Maintenance);
            return;
        }
        // Reference bootApp: starter reconcile → key lookup → route.
        resolveEntitlementAtBoot();
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
        // Close the balance WS too — the server deliberately kicked us; without
        // this the client's auto-reconnect re-joins the same channel immediately.
        m_ws->disconnectFromServer();
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
        // Stop ALL background polling — the session is gone; unauthenticated
        // 60s notification GETs would keep firing otherwise.
        if (m_notifTimer) m_notifTimer->stop();
        if (m_payPollTimer) m_payPollTimer->stop();
        // Close all modals
    m_showAccount = m_showPlanGate = m_showUpgrade = m_showPay = false;
    m_showTutorials = m_showTour = m_showBg = m_showAbuse = m_showNotification = false;
    m_showConsent = m_showWelcome = m_showFreeCredits = m_showCrypto = m_showPayStatus = false;
    m_showAdmin = false;
    emit modalChanged();
    showLock(tr("STORAGE RESET"),
                 QStringLiteral("Your local session was cleared by the server for security.\nSign in again to continue."),
                 false);
    // IMPORTANT: clearSession() wiped `seen_reset_token` — on next boot
    // reconcileServerDirectives would treat the same still-active server
    // directive as NEW and fire this lock screen a second time. Re-fetch and
    // persist the current token NOW so the next boot reconciles cleanly.
    m_api->getJson(QStringLiteral("/api/v1/public/storage-reset-token"), false,
        [](const QJsonObject &o) {
            QSettings s(QStringLiteral("SmokeScreen"), QStringLiteral("Smoke Screen"));
            s.setValue(QStringLiteral("seen_reset_token"),
                       o.value(QStringLiteral("token")).toString().trimmed());
        },
        [](const QString &) { /* offline — directive re-fires once on next boot */ });
    });
    connect(m_ws, &WebSocketClient::forceLogout, this, [this]() {
        if (m_payPollTimer) m_payPollTimer->stop();
        if (m_notifTimer) m_notifTimer->stop();
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
    emit modalChanged();
    showLock(tr("SIGNED OUT"),
                 QStringLiteral("You were signed out from another device or by an administrator.\nSign in again to continue."),
                 false);
    // Persist the current logout token so the next boot doesn't re-fire.
    m_api->getJson(QStringLiteral("/api/v1/public/logout-token"), false,
        [](const QJsonObject &o) {
            QSettings s(QStringLiteral("SmokeScreen"), QStringLiteral("Smoke Screen"));
            s.setValue(QStringLiteral("seen_logout_token"),
                       o.value(QStringLiteral("token")).toString().trimmed());
        },
        [](const QString &) { /* offline — directive re-fires once on next boot */ });
    });
    connect(m_ws, &WebSocketClient::dashboardNotification, this, [this](const QVariantMap &n) {
        m_notification = n;
        m_showNotification = true;
        emit notificationChanged();
        emit modalChanged();
    });
    connect(m_ws, &WebSocketClient::configUpdate, this, [this](const QString &) {
        m_api->fetchBootstrap();
    });
}


void AppController::startRealtime()
{
    // Starter Pack users stream without a full license until credits run out.
    if ((!m_session->licensed() && !m_session->starterPack()) || m_session->userId().isEmpty())
        return;
    // Every (re)connect pulls the CURRENT access token from ApiClient — the
    // balance WS must survive silent JWT refreshes (access TTL 900s).
    m_ws->setTokenProvider([this]() { return m_api->bearerToken(); });
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
    // Reference polls the announcement endpoint every 60s while on the dashboard.
    if (!m_notifTimer) {
        m_notifTimer = new QTimer(this);
        m_notifTimer->setInterval(60000);
        connect(m_notifTimer, &QTimer::timeout, this, [this]() {
            if (m_screen == Screen::Dashboard)
                m_api->fetchDashboardNotification();
        });
    }
    m_notifTimer->start();
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
    if (m_session->licensed() && m_session->licenseExpired()) {
        if (!m_showExpiry) {
            m_showExpiry = true;
            emit modalChanged();
        }
        return;
    }
    if (!m_session->consentGiven()) {
        if (!m_showConsent) {
            m_showConsent = true;
            emit modalChanged();
        }
        return;
    }
    QSettings s(QStringLiteral("SmokeScreen"), QStringLiteral("Smoke Screen"));
    // Reference advanceFirstRunSequence: a single guided dashboard tour, then
    // the free-credits popup. The welcome explainer and the old 7-step plan
    // onboarding are no longer auto-shown.
    if (!s.value(QStringLiteral("tour_done")).toBool()) {
        startTour();
        return;
    }
    maybeShowFreeCredits();
}

void AppController::maybeShowFreeCredits()
{
    // Server-controlled fallback for brand-new users who did not receive a
    // registration/key bonus. Only granted once, and only when the backend's
    // feature flags explicitly enable it (reference dashboard.html lines 8462+).
    QSettings s(QStringLiteral("SmokeScreen"), QStringLiteral("Smoke Screen"));
    const bool granted = s.value(QStringLiteral("free_credits_granted"), false).toBool();
    if (m_pendingFreeCredits <= 0 && !granted && m_featureFreeCreditsEnabled
        && m_featureFreeCreditsAmount > 0) {
        m_pendingFreeCredits = m_featureFreeCreditsAmount;
        m_freeCreditsAmount = m_featureFreeCreditsAmount;
        if (m_session->burnRatePerSecond() > 0) {
            const double minutes = m_featureFreeCreditsAmount / m_session->burnRatePerSecond() / 60.0;
            m_freeCreditsTimeEst = QStringLiteral("≈ %1 min at standard burn")
                                        .arg(int(minutes) > 0 ? int(minutes) : 1);
        }
    }
    if (m_pendingFreeCredits > 0) {
        s.setValue(QStringLiteral("free_credits_granted"), true);
        // First-run credits popup is the terminal step: suppress the separate
        // welcome explainer (reference advanceFirstRunSequence sets LS.WELCOMED).
        s.setValue(QStringLiteral("welcome_done"), true);
        m_pendingFreeCredits = 0.0;
        m_showFreeCredits = true;
        emit modalChanged();
    }
}

void AppController::boot()
{
    setScreen(Screen::Preloader);
    m_session->setDeviceId(m_machineId->deviceId());
    m_api->setDeviceId(m_machineId->deviceId());

    // Referral persistence (Electron ss_referred_by_v1): a ref code captured
    // from a deep link survives restarts until consumed by a signup.
    {
        QSettings s(QStringLiteral("SmokeScreen"), QStringLiteral("Smoke Screen"));
        m_pendingReferralCode = s.value(QStringLiteral("referred_by")).toString().toUpper();
    }

    // Consent gate (reference bootApp step 6): blocks until accepted, shown
    // over whatever screen the boot flow resolves to underneath.
    if (!m_session->consentGiven()) {
        m_showConsent = true;
        emit modalChanged();
    }

    // Gate blocker is shown by default (m_showGateBlocker = true)
    // It will be hidden once boot sequence completes

    // Restore persisted JWT into ApiClient so authenticated requests work on restart
    if (!m_session->sessionToken().isEmpty())
        m_api->setBearerToken(m_session->sessionToken());
    if (!m_session->refreshToken().isEmpty())
        m_api->setRefreshToken(m_session->refreshToken());

    // Boot sequence: resolve API → version → maintenance → plans/settings → feature flags
    m_api->resolveApiEndpoint();
    // Reconcile directives AFTER the endpoint resolves — resolveApiEndpoint is
    // async and may rebase the URL from bootstrap; firing reconcile immediately
    // sends the directive GETs to the compile-time default host (127.0.0.1).
    connect(m_api, &ApiClient::apiEndpointResolved, this, [this]() {
        reconcileServerDirectives();
        revalidateLicenseAtBoot();
    }, Qt::SingleShotConnection);
    QTimer::singleShot(400, this, [this]() {
        m_api->ping();
        m_updater->check();
    });
    QTimer::singleShot(600, this, [this]() {
        m_api->fetchPlans();
        m_api->fetchActivationPlans();
    });
    QTimer::singleShot(800, this, [this]() {
        m_api->fetchPaymentGateway();
        m_api->fetchDashboardMaintenance();
    });
    QTimer::singleShot(1000, this, [this]() {
        m_api->fetchFeatureFlags();
        m_api->fetchStreamingAvailability();
    });

    // Hide gate blocker after a brief delay to ensure first paint is complete
    QTimer::singleShot(800, this, [this]() {
        setShowGateBlocker(false);
    });
}

// Electron boot revalidates the stored license against the server on every
// start (dashboard.html POST /keys/validate). Without this, a revoked or
// reassigned key persists as valid client-side until some other server call
// fails. A failed check clears the entitlement and routes to the gate.
void AppController::revalidateLicenseAtBoot()
{
    if (!m_session->authenticated() || m_session->accessKey().isEmpty())
        return;
    m_bootLicenseCheck = true;
    m_api->validateKey(m_session->accessKey(), m_machineId->deviceId(), m_session->userId());
}

// Reconcile one-shot server directives (storage-reset / force-logout) at boot so
// an admin-issued reset takes effect even if the app was offline when the WS push
// fired (reference dashboard.html ensureStorageResetToken / ensureLogoutToken).
void AppController::reconcileServerDirectives()
{
    QSettings s(QStringLiteral("SmokeScreen"), QStringLiteral("Smoke Screen"));
    const QString lastReset = s.value(QStringLiteral("seen_reset_token")).toString();
    const QString lastLogout = s.value(QStringLiteral("seen_logout_token")).toString();

    m_api->getJson(QStringLiteral("/api/v1/public/storage-reset-token"), false,
        [this, lastReset](const QJsonObject &o) {
            const QString token = o.value(QStringLiteral("token")).toString().trimmed();
            QSettings s(QStringLiteral("SmokeScreen"), QStringLiteral("Smoke Screen"));
            if (!token.isEmpty() && token != lastReset) {
                // New reset directive since last boot → clear local session.
                m_ws->disconnectFromServer();
                m_stream->disconnectEngine();
                m_session->clearSession();
                m_api->clearLicenseCredentials();
                s.clear();
                s.setValue(QStringLiteral("seen_reset_token"), token);
                showLock(tr("STORAGE RESET"),
                         QStringLiteral("Your local session was cleared by the server for security.\nSign in again to continue."),
                         false);
                // Consume the one-shot directive server-side — without the ACK
                // it stays pending forever and re-fires on every fresh install.
                m_api->postJson(QStringLiteral("/api/v1/public/storage-reset"), {}, false,
                                nullptr, nullptr);
            } else {
                s.setValue(QStringLiteral("seen_reset_token"), token);
            }
        },
        [](const QString &) { /* offline — directive handled on next boot */ });

    m_api->getJson(QStringLiteral("/api/v1/public/logout-token"), false,
        [this, lastLogout](const QJsonObject &o) {
            const QString token = o.value(QStringLiteral("token")).toString().trimmed();
            QSettings s(QStringLiteral("SmokeScreen"), QStringLiteral("Smoke Screen"));
            if (!token.isEmpty() && token != lastLogout) {
                m_ws->disconnectFromServer();
                m_stream->disconnectEngine();
                m_session->clearSession();
                m_api->clearLicenseCredentials();
                showLock(tr("SIGNED OUT"),
                         QStringLiteral("You were signed out from another device or by an administrator.\nSign in again to continue."),
                         false);
                // ACK the one-shot directive so it is retired server-side.
                m_api->postJson(QStringLiteral("/api/v1/public/logout"), {}, false,
                                nullptr, nullptr);
            }
            s.setValue(QStringLiteral("seen_logout_token"), token);
        },
        [](const QString &) { /* offline — directive handled on next boot */ });
}

// ── Boot entitlement resolution + gate enforcer ─────────────────────────────

bool AppController::creditsSynced() const
{
    // Reference: window._creditsSynced || getCredStart() > 0 || getCredUsed() > 0.
    return m_creditsSynced || m_session->creditsTotal() > 0 || m_session->creditsUsed() > 0.0;
}

void AppController::syncCreditsWithServer()
{
    if (!m_session->authenticated())
        return;
    if (!m_session->licensed() && !m_session->starterPack())
        return;
    m_api->fetchCredits();
}

// Electron-parity gate enforcer (dashboard.html startGateEnforcer): every
// second re-evaluate the required gate so stale entitlement/credit state can
// never persist, and re-validate credits with the server every 30s.
void AppController::enforceGateRequirement()
{
    if (m_lastCreditSync.isValid() && m_lastCreditSync.elapsed() >= 30000) {
        m_lastCreditSync.restart();
        syncCreditsWithServer();
    }

    // Mid-purchase flows own the UI — never tear them down (reference treats
    // planGate/payModal/starterPayModal as one flow; the account modal is
    // allowed over the dashboard).
    if (m_showPlanGate || m_showPay || m_showStarterPay || m_showUpgrade)
        return;
    if (m_showForceUpdate)
        return;
    if (m_showAccount && m_screen == Screen::Dashboard)
        return;
    if (!m_session->authenticated()) {
        if (m_screen != Screen::Auth && m_screen != Screen::Preloader)
            setScreen(Screen::Auth);
        return;
    }

    // Starter Pack users never see the access gate — only the mandatory
    // starter lock once their credits are exhausted.
    if (m_session->starterPack() && !m_session->licensed()) {
        if (m_session->creditsRemaining() <= 0.0 && creditsSynced()) {
            showStarterLockScreen();
        } else {
            if (m_showStarterLock) {
                m_showStarterLock = false;
                emit modalChanged();
            }
            if (m_screen != Screen::Dashboard)
                setScreen(Screen::Dashboard);
        }
        return;
    }

    if (!m_session->licensed()) {
        if (m_screen != Screen::AccessGate && m_screen != Screen::Preloader)
            setScreen(Screen::AccessGate);
        return;
    }

    // Licensed users: expiry wins, then the ack-gated exhaustion lock.
    if (m_session->licenseExpired()) {
        if (!m_showExpiry) {
            m_showExpiry = true;
            emit modalChanged();
        }
        return;
    }
    if (m_showExpiry) {
        m_showExpiry = false;
        emit modalChanged();
    }

    const bool exhausted = m_session->creditsRemaining() <= 0.0
                           && (m_session->creditsTotal() > 0 || m_session->creditsUsed() > 0.0);
    if (exhausted && !m_creditsAck) {
        if (!m_showLock) {
            showLock(tr("CREDITS EXHAUSTED"),
                     QStringLiteral("Your Smoke Screen credit balance has reached zero. "
                                    "Streaming stays blocked until you top up."),
                     true);
        }
    } else if (!exhausted && m_creditsAck) {
        m_creditsAck = false;
    }

    if (m_screen != Screen::Dashboard && m_screen != Screen::Preloader)
        setScreen(Screen::Dashboard);
}

void AppController::showStarterLockScreen()
{
    if (m_showStarterLock)
        return;
    m_showStarterLock = true;
    emit modalChanged();
}

// Mark a returning user (server-restored license or existing starter pack) as
// already onboarded so first-run modals never stack (reference bootApp
// licenseJustLookedUp branch).
void AppController::markEstablishedUser()
{
    QSettings s(QStringLiteral("SmokeScreen"), QStringLiteral("Smoke Screen"));
    s.setValue(QStringLiteral("free_credits_granted"), true);
    s.setValue(QStringLiteral("welcome_done"), true);
    s.setValue(QStringLiteral("onboarding_done"), true);
    s.setValue(QStringLiteral("tour_done"), true);
}

void AppController::applyStarterStatus(const QVariantMap &d)
{
    const QString status = d.value(QStringLiteral("status")).toString();
    if (status.isEmpty() || status == QLatin1String("none"))
        return;
    QSettings s(QStringLiteral("SmokeScreen"), QStringLiteral("Smoke Screen"));
    if (status == QLatin1String("approved")) {
        const bool fresh = s.value(QStringLiteral("starter_at")).toString().isEmpty();
        m_session->setStarterPack(true);
        const QString ref = d.value(QStringLiteral("order_id")).toString();
        if (!ref.isEmpty())
            s.setValue(QStringLiteral("starter_ref"), ref);
        if (fresh)
            s.setValue(QStringLiteral("starter_at"), QDateTime::currentDateTimeUtc().toString(Qt::ISODate));
        s.setValue(QStringLiteral("starter_crypto_pending"), false);
        // Adopt the pack credits when the local ledger is empty (this backend
        // returns the pack credit amount; usage reconciles via /credits).
        const double credits = d.value(QStringLiteral("credits")).toDouble();
        if (credits > 0 && m_session->creditsTotal() <= 0) {
            m_session->applyCreditsMap(QVariantMap{
                {QStringLiteral("total"), credits},
                {QStringLiteral("used"), 0.0},
                {QStringLiteral("remaining"), credits},
            });
        }
        // Toast only on a brand-new grant — quiet on device-switch logins.
        if (fresh && s.value(QStringLiteral("starter_granted_toasted"), false).toBool() == false) {
            s.setValue(QStringLiteral("starter_granted_toasted"), true);
            toast(tr("Starter Pack approved — %1 credits unlocked.")
                      .arg(int(credits > 0 ? credits : 500)),
                  QStringLiteral("ok"));
        }
    } else if (status == QLatin1String("rejected")) {
        s.setValue(QStringLiteral("starter_crypto_pending"), false);
        if (!s.value(QStringLiteral("starter_rejected_seen"), false).toBool()) {
            s.setValue(QStringLiteral("starter_rejected_seen"), true);
            toast(tr("Your starter pack payment was rejected. Please contact support."),
                  QStringLiteral("error"));
        }
    }
    // pending → nothing; the picker shows the under-review notice.
}

void AppController::resolveEntitlementAtBoot()
{
    if (!m_session->authenticated()) {
        setScreen(Screen::Auth);
        return;
    }
    if (m_session->licensed()) {
        enterAppAfterAuth();
        return;
    }
    // Starter-pack reconciliation first — the server is the source of truth
    // across devices and storage wipes (reference syncStarterPackStatus).
    m_api->getJson(QStringLiteral("/api/v1/starter-pack/status?email=")
                       + QUrl::toPercentEncoding(m_session->email()),
                   false,
        [this](const QJsonObject &o) {
            applyStarterStatus(o.toVariantMap());
            continueEntitlementAfterStarter();
        },
        [this](const QString &) { continueEntitlementAfterStarter(); });
}

void AppController::continueEntitlementAfterStarter()
{
    if (!m_session->accessKey().isEmpty()) {
        routeAfterEntitlement();
        return;
    }
    // No local key — restore a server-issued key for this user/device
    // (reference POST /keys/lookup).
    const QJsonObject body{
        {QStringLiteral("user_id"), m_session->userId()},
        {QStringLiteral("device_id"), m_machineId->deviceId()},
    };
    m_api->postJson(QStringLiteral("/api/v1/keys/lookup"), body, false,
        [this](const QJsonObject &o) {
            const QVariantMap d = o.toVariantMap();
            if (d.value(QStringLiteral("found")).toBool()
                && !d.value(QStringLiteral("expired")).toBool()) {
                m_session->setAccess(d);
                m_api->setLicenseCredentials(m_session->accessKey(), m_session->userId(),
                                             m_machineId->deviceId());
            }
            routeAfterEntitlement();
        },
        [this](const QString &) { routeAfterEntitlement(); });
}

void AppController::routeAfterEntitlement()
{
    if (m_session->starterPack() && !m_session->licensed()) {
        if (m_session->creditsRemaining() <= 0.0 && creditsSynced()) {
            setScreen(Screen::Dashboard);
            showStarterLockScreen();
        } else {
            enterAppAfterAuth();
        }
        return;
    }
    if (m_session->licensed()) {
        enterAppAfterAuth();
        return;
    }
    // Brand-new user with nothing on file: the retired get-started choice
    // aliases straight to the access gate (reference showGetStartedModal).
    setScreen(Screen::AccessGate);
}

bool AppController::starterRepurchaseBlocked()
{
    if (!m_session->starterPack())
        return false;
    const QString msg = tr("You already have the Starter Pack. Activate your %1 license to continue.")
                            .arg(fmtActivationUsd());
    m_starterPayError = msg;
    m_showStarterPay = false;
    m_showGetStarted = false;
    emit modalChanged();
    // promptActivationBeforeTopUp(): warn + the gate enforcer routes to the
    // access gate on its next tick.
    toast(tr("Activate your %1 license before purchasing credit top-ups. "
             "Starter Pack credits are for trial use only.")
              .arg(fmtActivationUsd()),
          QStringLiteral("warn"));
    return true;
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
        toast(tr("Enter email and password"), QStringLiteral("error"));
        return;
    }
    m_api->login(email.trimmed(), password, m_machineId->deviceId());
}

void AppController::registerUser(const QString &email, const QString &password,
                                 const QString &name, const QString &phone,
                                 const QString &refCode)
{
    if (email.trimmed().isEmpty() || password.isEmpty()) {
        toast(tr("Email and password required"), QStringLiteral("error"));
        return;
    }
    // Client-side format guard mirrors Electron's `^[^\s@]+@[^\s@]+\.[^\s@]+$`
    static const QRegularExpression emailRe(QStringLiteral("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"));
    if (!emailRe.match(email.trimmed()).hasMatch()) {
        toast(tr("Enter a valid email address"), QStringLiteral("error"));
        return;
    }
    if (password.size() < 8) {
        toast(tr("Password must be at least 8 characters"), QStringLiteral("error"));
        return;
    }
    // Remember credentials for the 409 already-registered auto-login fallback.
    m_lastRegEmail = email.trimmed();
    m_lastRegPass = password;
    // Referral priority chain (Electron getSignupReferralCode): field value
    // wins; otherwise fall back to the persisted deep-link code.
    QString ref = refCode.trimmed().toUpper();
    if (ref.isEmpty())
        ref = m_pendingReferralCode;
    m_api->registerUser(name.trimmed(), email.trimmed(), password, m_machineId->deviceId(),
                        true, phone.trimmed(), ref);
}

void AppController::requestPasswordReset(const QString &email)
{
    if (email.trimmed().isEmpty()) {
        toast(tr("Enter your email"), QStringLiteral("error"));
        return;
    }
    m_resetEmail = email.trimmed();
    m_api->requestPasswordReset(m_resetEmail);
}

void AppController::completePasswordReset(const QString &token, const QString &newPassword, const QString &email)
{
    if (token.trimmed().isEmpty()) {
        toast(tr("Enter the reset token from your email"), QStringLiteral("error"));
        return;
    }
    if (newPassword.size() < 8) {
        toast(tr("Password must be at least 8 characters"), QStringLiteral("error"));
        return;
    }
    const QString useEmail = email.trimmed().isEmpty() ? m_resetEmail : email.trimmed();
    m_api->completePasswordReset(token.trimmed(), newPassword, useEmail);
}

void AppController::activateKey(const QString &key)
{
    const QString k = key.trimmed().toUpper();
    // Typing again clears the previous inline error (Electron clears #akeyErr
    // on input).
    if (!m_activationError.isEmpty()) {
        m_activationError.clear();
        emit sessionUiChanged();
    }
    if (k.isEmpty()) {
        toast(tr("Enter your access key"), QStringLiteral("error"));
        return;
    }
    m_api->validateKey(k, m_machineId->deviceId(), m_session->userId());
}

void AppController::payActivation(const QString &planId, const QString &method)
{
    if (planId.isEmpty()) {
        toast(tr("Select a plan first"), QStringLiteral("error"));
        return;
    }
    const QString m = method.isEmpty() ? QStringLiteral("paystack") : method;
    m_api->activationPay(planId, m);
}

void AppController::selectBackground(const QString &presetId, const QString &prompt)
{
    if (presetId.isEmpty()) return;
    m_api->selectBackground(presetId, prompt);
    if (!prompt.isEmpty())
        m_stream->setPrompt(prompt);
    else
        m_stream->applyPreset(presetId);
}

void AppController::logout()
{
    if (m_payPollTimer) m_payPollTimer->stop();
    if (m_notifTimer) m_notifTimer->stop();
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
    emit modalChanged();
    setScreen(Screen::Auth);
    toast(tr("Signed out"), QStringLiteral("info"));
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
        toast(tr("Copied to clipboard"), QStringLiteral("ok"));
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
    toast(tr("Unknown plan"), QStringLiteral("error"));
}

void AppController::selectUpgradePlan(const QString &planId)
{
    // Use the discounted upgrade price so the PayModal reflects the real charge.
    for (const QVariant &v : upgradeTargets()) {
        const QVariantMap t = v.toMap();
        if (t.value(QStringLiteral("id")).toString() == planId) {
            m_selectedPlan = t;
            emit selectedPlanChanged();
            m_showUpgrade = false;
            m_showPay = true;
            emit modalChanged();
            return;
        }
    }
    toast(tr("Upgrade not available for your plan"), QStringLiteral("error"));
}

void AppController::startCheckout(const QString &method)
{
    const QString planId = m_selectedPlan.value(QStringLiteral("id")).toString();
    if (planId.isEmpty()) {
        toast(tr("Select a plan first"), QStringLiteral("warn"));
        return;
    }

    // Explicit upgrade flow: Upgrade-modal targets carry the discounted
    // `original_dollars` marker. Route by intent, never by plan id (the id
    // "pro"/"creator" also names credit packs).
    if (m_selectedPlan.contains(QStringLiteral("original_dollars"))) {
        m_api->upgradePay(planId, method, m_selectedPlan);
        return;
    }

    // Unlicensed / trial flow → starter pack.
    if (!m_session->licensed()) {
        m_api->starterPackPay(m_session->email(), method, m_selectedPlan);
        return;
    }

    // Licensed users: credit top-up (method selects paystack/flutterwave/crypto).
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
    // Offline — polling can't succeed; still count the tick so the cap
    // applies (otherwise the timer wakes every 6s forever on a dead network).
    if (!m_api->reachable()) {
        m_paymentPollCount++;
        return;
    }
    // Prefer the Paystack reference parsed from the checkout callback, which
    // maps to an order via /payments/orders/{id}. Fall back to email-based
    // starter-pack status for legacy flows.
    if (!m_paymentReference.isEmpty()) {
        m_paymentPollCount++;
        // After 3 polls (18s), trigger server-side provider verification in
        // case the webhook is unreachable (common in local dev). The poll
        // continues afterwards — one-shot verify with no follow-up leaves the
        // modal stuck on "VERIFYING…" with polling silently dead.
        if (m_paymentPollCount == 3)
            m_api->verifyOrder(m_paymentReference, m_paymentReference);
        m_api->fetchOrderStatus(m_paymentReference);
        return;
    }
    const QString email = m_session->email();
    if (email.isEmpty()) {
        toast(tr("No account email for payment status"), QStringLiteral("warn"));
        if (m_payPollTimer) m_payPollTimer->stop();
        return;
    }
    // The email path must also count or the >=10 cap never applies here
    // (infinite 6s polling otherwise).
    m_paymentPollCount++;
    m_api->starterPackStatus(email);
}

void AppController::submitCryptoProof(const QString &txId, const QString &proofPath)
{
    QString tx = txId.trimmed();
    if (tx.isEmpty()) {
        // The checkout's Payment ID is what the backend matches — fall back
        // to the reference captured at payment init before failing.
        tx = m_paymentReference;
    }
    if (tx.isEmpty()) {
        toast(tr("Missing Payment ID — re-open the crypto checkout"), QStringLiteral("error"));
        return;
    }
    const QString email = m_session->email();
    const QString planId = m_selectedPlan.value(QStringLiteral("id")).toString();
    // QML may not forward the picked proof path; fall back to the stored path.
    if (m_cryptoProofImage.isEmpty()) {
        QString path = proofPath;
        if (path.isEmpty())
            path = m_cryptoCheckout.value(QStringLiteral("proof_path")).toString();
        if (!path.isEmpty()) {
            const QFileInfo fi(path);
            if (fi.size() > 4 * 1024 * 1024) {
                toast(QStringLiteral("⚠ Image must be under 4MB."), QStringLiteral("error"));
                return;
            }
            QFile f(path);
            if (f.open(QIODevice::ReadOnly))
                m_cryptoProofImage = f.readAll().toBase64();
        }
    }
    if (m_cryptoProofImage.isEmpty()) {
        toast(QStringLiteral("⚠ Upload a payment proof image."), QStringLiteral("error"));
        return;
    }
    m_api->submitCryptoProof(email, tx, planId, QString::fromLatin1(m_cryptoProofImage));
    toast(tr("Crypto proof submitted — pending review"), QStringLiteral("ok"));
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
    emit selectedPlanChanged();
    emit modalChanged();
}

QVariantList AppController::upgradeTargets() const
{
    // Reference (dashboard.html UPGRADE_TARGETS): discounted, credits carry over.
    // starter → Creator $50 (strike $75) / Pro $100 (strike $120)
    // creator → Pro $40 (strike $120)
    // pro     → none
    QVariantList out;
    const QString plan = m_session ? m_session->plan().toLower() : QStringLiteral("starter");
    if (plan == QLatin1String("starter")) {
        out.append(QVariantMap{{"id", "creator"}, {"name", "Creator"},
                               {"dollars", 50.0}, {"original_dollars", 75.0},
                               {"credits", 500.0}, {"timeLabel", "~4 min"},
                               {"desc", "Unlock the full creator suite"},
                               {"features", QStringList{"Creator Program", "15% Referral Commission", "Background Change"}}});
        out.append(QVariantMap{{"id", "pro"}, {"name", "Pro"},
                               {"dollars", 100.0}, {"original_dollars", 120.0},
                               {"credits", 2000.0}, {"timeLabel", "~17 min"},
                               {"desc", "Maximum credits & support"},
                               {"features", QStringList{"Everything in Creator", "1-on-1 Setup Call", "Priority Support"}}});
    } else if (plan == QLatin1String("creator")) {
        out.append(QVariantMap{{"id", "pro"}, {"name", "Pro"},
                               {"dollars", 40.0}, {"original_dollars", 120.0},
                               {"credits", 2000.0}, {"timeLabel", "~17 min"},
                               {"desc", "Maximum credits & support"},
                               {"features", QStringList{"Everything in Creator", "1-on-1 Setup Call", "Priority Support"}}});
    }
    return out;
}

bool AppController::ensureStreamConsent()
{
    // One-time stream consent gate (reference #streamConsentModal).
    QSettings s(QStringLiteral("SmokeScreen"), QStringLiteral("Smoke Screen"));
    if (s.value(QStringLiteral("stream_consent"), false).toBool())
        return true;
    m_pendingConnectAfterConsent = true;
    m_showStreamConsent = true;
    emit modalChanged();
    return false;
}

void AppController::setShowStreamConsent(bool v)
{
    if (m_showStreamConsent == v)
        return;
    m_showStreamConsent = v;
    emit modalChanged();
}

void AppController::acceptStreamConsent()
{
    QSettings s(QStringLiteral("SmokeScreen"), QStringLiteral("Smoke Screen"));
    s.setValue(QStringLiteral("stream_consent"), true);
    m_showStreamConsent = false;
    emit modalChanged();
    // Auto-resume the connect the user was trying to start before consent
    // interrupted it (reference: _pendingConnectAfterConsent in dashboard.html).
    if (m_pendingConnectAfterConsent) {
        m_pendingConnectAfterConsent = false;
        if (!m_stream->live() && !m_stream->connecting())
            m_stream->connectEngine();
    }
}

void AppController::declineStreamConsent()
{
    m_pendingConnectAfterConsent = false;
    m_showStreamConsent = false;
    emit modalChanged();
}

void AppController::clearKeyRedeemError()
{
    if (!m_keyRedeemError.isEmpty()) {
        m_keyRedeemError.clear();
        emit keyRedeemErrorChanged();
        emit sessionUiChanged();
    }
}

void AppController::redeemCreditKey(const QString &key)
{
    const QString k = key.trimmed().toUpper();
    // Clear the previous inline error on retype.
    if (!m_keyRedeemError.isEmpty()) {
        m_keyRedeemError.clear();
        emit keyRedeemErrorChanged();
        emit sessionUiChanged();
    }
    if (k.isEmpty()) {
        toast(tr("Enter a credit key"), QStringLiteral("error"));
        return;
    }
    m_api->redeemCreditKey(k);
}

void AppController::savePayoutDetails(const QString &accountName, const QString &bankName,
                                      const QString &accountNumber, const QString &routing,
                                      const QString &country)
{
    QVariantMap d{
        {QStringLiteral("account_name"), accountName},
        {QStringLiteral("bank_name"), bankName},
        {QStringLiteral("account_number"), accountNumber},
        {QStringLiteral("routing_number"), routing},
        {QStringLiteral("country"), country},
    };
    m_api->savePayoutDetails(d);
    toast(tr("Payout details saved"), QStringLiteral("ok"));
}

void AppController::loadPayoutDetails()
{
    m_api->getPayoutDetails();
}

void AppController::acceptConsent()
{
    // Reference acceptConsent(): persist consent and resume the boot flow.
    // (Welcome/first-run chain fires later when entering the dashboard.)
    m_session->setConsent(true);
    m_showConsent = false;
    emit modalChanged();
}

void AppController::dismissWelcome()
{
    // Reference dismissWelcome: persist + hide only (no chained modals).
    QSettings s(QStringLiteral("SmokeScreen"), QStringLiteral("Smoke Screen"));
    s.setValue(QStringLiteral("welcome_done"), true);
    m_showWelcome = false;
    emit modalChanged();
}

void AppController::dismissFreeCredits()
{
    m_showFreeCredits = false;
    emit modalChanged();
    // Reference dismissFreeCredits: the welcome explainer follows only when it
    // has not been shown/suppressed yet.
    QSettings s(QStringLiteral("SmokeScreen"), QStringLiteral("Smoke Screen"));
    if (!s.value(QStringLiteral("welcome_done")).toBool()) {
        m_showWelcome = true;
        emit modalChanged();
    }
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
    // Session-scoped acknowledgment (reference sessionStorage
    // ss_credits_exhausted_ack): the lock stays suppressed until credits
    // return, then the flag resets.
    m_creditsAck = true;
    m_showLock = false;
    emit modalChanged();
    toast(tr("Credits exhausted acknowledged. Streaming remains blocked until you buy more credits."),
          QStringLiteral("warn"));
}

namespace {
constexpr int kTourStepCount = 13;
}

void AppController::startTour()
{
    m_tourStep = 0;
    m_showTour = true;
    emit tourChanged();
    emit modalChanged();
}

void AppController::nextTourStep()
{
    if (m_tourStep >= kTourStepCount) {
        closeTour();
        return;
    }
    ++m_tourStep;
    emit tourChanged();
}

void AppController::prevTourStep()
{
    if (m_tourStep <= 0) return;
    --m_tourStep;
    emit tourChanged();
}

void AppController::closeTour()
{
    QSettings s(QStringLiteral("SmokeScreen"), QStringLiteral("Smoke Screen"));
    s.setValue(QStringLiteral("tour_done"), true);
    m_showTour = false;
    m_tourStep = 0;
    emit tourChanged();
    emit modalChanged();
    maybeShowFreeCredits();
}

void AppController::submitAbuseReport(const QString &details)
{
    if (details.trimmed().isEmpty()) {
        toast(tr("Please describe the issue"), QStringLiteral("warn"));
        return;
    }
    m_api->createSupportTicket(QStringLiteral("Abuse report"), details.trimmed());
    m_showAbuse = false;
    emit modalChanged();
    toast(tr("Report submitted — thank you"), QStringLiteral("ok"));
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
    if (m_session->licensed() || m_session->starterPack())
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
        toast(tr("Enter an engine key"), QStringLiteral("error"));
        return;
    }
    if (adminSecret.trimmed().isEmpty()) {
        toast(tr("Admin secret required"), QStringLiteral("error"));
        return;
    }
    m_api->adminSaveEngineKey(key.trimmed(), adminSecret.trimmed());
}

void AppController::adminSetCredits(double total, const QString &adminSecret)
{
    if (total < 1 || !std::isfinite(total)) {
        toast(tr("Enter a valid credit amount"), QStringLiteral("error"));
        return;
    }
    if (adminSecret.trimmed().isEmpty()) {
        toast(tr("Admin secret required"), QStringLiteral("error"));
        return;
    }
    m_api->adminSetCredits(total, adminSecret.trimmed(), m_session->email());
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
    const QFileInfo fi(path);
    // Reference guard: proof images must be under 4MB.
    if (fi.size() > 4 * 1024 * 1024) {
        m_starterCryptoProofName = fi.fileName();
        m_cryptoProofImage.clear();
        m_cryptoProofError = QStringLiteral("⚠ Image must be under 4MB.");
        emit cryptoChanged();
        return;
    }
    QFile f(path);
    if (!f.open(QIODevice::ReadOnly)) {
        m_cryptoProofError = QStringLiteral("⚠ Could not read file.");
        emit cryptoChanged();
        return;
    }
    // Reference uploads the proof as a base64 data image (proof_image).
    m_cryptoProofImage = f.readAll().toBase64();
    f.close();
    m_starterCryptoProofName = fi.fileName();
    m_cryptoProofError.clear();
    m_cryptoCheckout.insert(QStringLiteral("proof_path"), path);
    emit cryptoChanged();
    emit paymentStatusChanged();
    toast(tr("Proof image selected"), QStringLiteral("ok"));
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
    const QString dir = movies + QStringLiteral("/Smoke Screen");
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
                toast(tr("Failed to obtain reset token"), QStringLiteral("error"));
                return;
            }
            QJsonObject body{{QStringLiteral("token"), token}};
            m_api->postJson(QStringLiteral("/api/v1/public/storage-reset"), body, false,
                [this](const QJsonObject &) {
                    // clear local settings
                    QSettings s(QStringLiteral("SmokeScreen"), QStringLiteral("Smoke Screen"));
                    s.clear();
                    m_session->clearSession();
                    toast(tr("Local storage reset complete"), QStringLiteral("ok"));
                    showLock(tr("STORAGE RESET"), QStringLiteral("Local data cleared. Please restart the app."), true);
                },
                [this](const QString &e) {
                    toast(tr("Storage reset failed: %1").arg(e), QStringLiteral("error"));
                });
        },
        [this](const QString &e) {
            toast(tr("Storage reset failed: %1").arg(e), QStringLiteral("error"));
        });
}

void AppController::loadDownloads(const QString &accessKey)
{
    QString path = QStringLiteral("/api/v1/downloads/list");
    if (!accessKey.isEmpty())
        path += QStringLiteral("?access_key=%1").arg(QUrl::toPercentEncoding(accessKey));
    m_api->getJson(path, false,
        [this](const QJsonObject &o) {
            QJsonArray arr = o.value(QStringLiteral("downloads")).toArray();
            if (arr.isEmpty())
                arr = o.value(QStringLiteral("items")).toArray();
            m_downloads.clear();
            for (const auto &v : arr)
                m_downloads.append(v.toObject().toVariantMap());
            emit downloadsChanged();
        },
        [this](const QString &e) {
            toast(tr("Failed to load downloads: %1").arg(e), QStringLiteral("error"));
        });
}

void AppController::openDownloads()
{
    setShowDownloads(true);
    loadDownloads();
}

void AppController::closeDownloads()
{
    setShowDownloads(false);
}

void AppController::setShowDownloads(bool v)
{
    if (m_showDownloads == v) return;
    m_showDownloads = v;
    emit modalChanged();
}

void AppController::renewLicense()
{
    m_showExpiry = false;
    emit modalChanged();
    openExternal(QStringLiteral("https://smokescreenapp.com"));
}

// ── SettingsScreen actions (production readiness) ──

void AppController::checkForUpdates()
{
    // The boot-time check stays silent; a manual check reports the outcome.
    m_manualUpdateCheck = true;
    m_updater->check();
}

void AppController::saveProfile(const QString &name, const QString &phone)
{
    if (name.trimmed().isEmpty()) {
        toast(tr("Name cannot be empty"), QStringLiteral("error"));
        return;
    }
    QJsonObject body{{QStringLiteral("name"), name.trimmed()},
                     {QStringLiteral("phone"), phone.trimmed()}};
    m_api->postJson(QStringLiteral("/api/v1/user/profile"), body, true,
        [this, name, phone](const QJsonObject &) {
            m_session->setDisplayName(name.trimmed());
            m_session->setPhone(phone.trimmed());
            toast(tr("Profile saved"), QStringLiteral("ok"));
        },
        [this](const QString &e) {
            toast(e.isEmpty() ? tr("Could not save profile") : e, QStringLiteral("error"));
        });
}

void AppController::changePassword(const QString &currentPassword, const QString &newPassword)
{
    if (currentPassword.isEmpty()) {
        toast(tr("Enter your current password"), QStringLiteral("error"));
        return;
    }
    if (newPassword.size() < 8) {
        toast(tr("New password must be at least 8 characters"), QStringLiteral("error"));
        return;
    }
    QJsonObject body{{QStringLiteral("current_password"), currentPassword},
                     {QStringLiteral("new_password"), newPassword}};
    m_api->postJson(QStringLiteral("/api/v1/auth/change-password"), body, true,
        [this](const QJsonObject &) {
            toast(tr("Password updated"), QStringLiteral("ok"));
        },
        [this](const QString &e) {
            toast(e.isEmpty() ? tr("Could not change password") : e, QStringLiteral("error"));
        });
}

void AppController::deleteAccount()
{
    m_api->postJson(QStringLiteral("/api/v1/user/delete"), {}, true,
        [this](const QJsonObject &) {
            // Full local wipe — mirrors logout + storage reset.
            m_ws->disconnectFromServer();
            m_stream->disconnectEngine();
            m_session->clearSession();
            m_api->clearLicenseCredentials();
            QSettings s(QStringLiteral("SmokeScreen"), QStringLiteral("Smoke Screen"));
            s.clear();
            setShowSettings(false);
            setScreen(Screen::Auth);
            toast(tr("Account deleted"), QStringLiteral("ok"));
        },
        [this](const QString &e) {
            toast(e.isEmpty() ? tr("Could not delete account") : e, QStringLiteral("error"));
        });
}

void AppController::clearCache()
{
    // Wipe non-essential local state: HTTP cache dir + derived settings keys.
    // Session/entitlement keys are deliberately preserved.
    bool ok = false;
    const QStringList cacheDirs = {
        QStandardPaths::writableLocation(QStandardPaths::CacheLocation),
        QStandardPaths::writableLocation(QStandardPaths::GenericCacheLocation)
            + QStringLiteral("/Smoke Screen"),
    };
    for (const QString &dir : cacheDirs) {
        if (QDir(dir).exists() && QDir(dir).removeRecursively())
            ok = true;
    }
    QSettings s(QStringLiteral("SmokeScreen"), QStringLiteral("Smoke Screen"));
    s.remove(QStringLiteral("presets_cache"));
    s.remove(QStringLiteral("bg_cache"));
    s.remove(QStringLiteral("recent_prompts"));
    s.remove(QStringLiteral("downloads_cache"));
    s.sync();
    toast(ok ? tr("Cache cleared") : tr("Nothing to clear"), QStringLiteral("ok"));
}

void AppController::logoutAllDevices()
{
    // ApiClient::logoutAll POSTs /auth/logout_all then emits logoutSucceeded,
    // which performs the full local sign-out + route to the auth screen.
    m_api->logoutAll();
}

void AppController::copyDebugLog()
{
    // Copy the most recent log file (or a session summary when none exists)
    // so support requests can include diagnostics without file access.
    const QString logDir = QStandardPaths::writableLocation(QStandardPaths::AppDataLocation)
                           + QStringLiteral("/logs");
    QString latestPath;
    QDateTime latestTime;
    QDir d(logDir);
    const auto entries = d.entryInfoList(QStringList() << QStringLiteral("*.log"),
                                         QDir::Files, QDir::Time);
    if (!entries.isEmpty()) {
        latestPath = entries.first().absoluteFilePath();
        latestTime = entries.first().lastModified();
    }
    if (!latestPath.isEmpty() && latestTime.isValid()) {
        QFile f(latestPath);
        if (f.open(QIODevice::ReadOnly)) {
            const QByteArray raw = f.readAll();
            f.close();
            // Trim to the tail so a huge log does not swamp the clipboard.
            const QByteArray tail = raw.size() > 20000 ? raw.right(20000) : raw;
            copyToClipboard(QString::fromUtf8(tail));
            toast(tr("Recent log copied"), QStringLiteral("ok"));
            return;
        }
    }
    // Fallback: inline session summary.
    const QString summary = QStringLiteral(
        "Smoke Screen %1\nDevice: %2\nUser: %3\nScreen: %4\nCredits: %5 used / %6 remaining\n")
        .arg(appVersion(), deviceId(), m_session->email(), screen())
        .arg(m_session->creditsUsed()).arg(m_session->creditsRemaining());
    copyToClipboard(summary);
    toast(tr("Session summary copied"), QStringLiteral("ok"));
}

void AppController::openLogFolder()
{
    const QString logDir = QStandardPaths::writableLocation(QStandardPaths::AppDataLocation)
                           + QStringLiteral("/logs");
    QDir().mkpath(logDir);
    QDesktopServices::openUrl(QUrl::fromLocalFile(logDir));
}

// ── I18n routing ─────────────────────────────────────────────────────────────

void AppController::setI18nManager(I18nManager *i18n)
{
    if (m_i18n == i18n) return;
    m_i18n = i18n;
    if (m_i18n) {
        connect(m_i18n, &I18nManager::languageChanged, this, [this]() {
            emit i18nChanged();
        });
    }
    emit i18nChanged();
}

QStringList AppController::i18nLanguages() const
{
    return m_i18n ? m_i18n->availableLanguages() : QStringList{QStringLiteral("en")};
}

QString AppController::i18nLanguage() const
{
    return m_i18n ? m_i18n->language() : QStringLiteral("en");
}

void AppController::i18nSetLanguage(const QString &lang)
{
    if (m_i18n)
        m_i18n->setLanguage(lang);
}

void AppController::setShowOnboarding(bool v)
{
    if (m_showOnboarding == v) return;
    m_showOnboarding = v;
    emit modalChanged();
}

void AppController::setShowGateBlocker(bool v)
{
    if (m_showGateBlocker == v) return;
    m_showGateBlocker = v;
    emit modalChanged();
}

void AppController::setShowGetStarted(bool v)
{
    if (m_showGetStarted == v) return;
    m_showGetStarted = v;
    emit modalChanged();
}

void AppController::setShowStarterPay(bool v)
{
    if (m_showStarterPay == v) return;
    m_showStarterPay = v;
    emit modalChanged();
}

void AppController::setShowSettings(bool v)
{
    if (m_showSettings == v) return;
    m_showSettings = v;
    emit modalChanged();
}

void AppController::completeOnboarding()
{
    QSettings s(QStringLiteral("SmokeScreen"), QStringLiteral("Smoke Screen"));
    s.setValue(QStringLiteral("onboarding_done"), true);
    m_showOnboarding = false;
    emit modalChanged();
    // Continue the first-run chain: tour → free credits
    if (!s.value(QStringLiteral("tour_done")).toBool())
        startTour();
    else
        maybeShowFreeCredits();
}

void AppController::downloadForceUpdate()
{
    if (m_updater && !m_forceUpdateUrl.isEmpty())
        m_updater->downloadAndInstall(m_forceUpdateUrl);
}

int AppController::downloadProgress() const
{
    return m_updater ? m_updater->downloadProgress() : 0;
}

bool AppController::downloading() const
{
    return m_updater && m_updater->downloading();
}

/// Handle liveescape:// deep links delivered by the OS or from the payment
/// callback. Supported paths (mirrors Electron's in-page URL handling):
///   liveescape://payments/return?reference=XYZ   → poll verify the order
///   liveescape://credits or /buy                  → open top-up sheet
///   liveescape://access                            → open plan activation
void AppController::handleDeepLink(const QString &url)
{
    const QUrl u(url);
    const QString host = u.host();
    const QString path = u.path();
    const QUrlQuery q(u);
    const QString ref = q.queryItemValue(QStringLiteral("reference"));

    // Referral capture (Electron ?ref=CODE parity): a deep link carrying a ref
    // param pre-fills the signup referral field and persists it.
    const QString referral = q.queryItemValue(QStringLiteral("ref")).trimmed();
    if (!referral.isEmpty()) {
        m_pendingReferralCode = referral.toUpper();
        QSettings s(QStringLiteral("SmokeScreen"), QStringLiteral("Smoke Screen"));
        s.setValue(QStringLiteral("referred_by"), m_pendingReferralCode);
        emit pendingReferralCodeChanged();
    }

    // Generic: any host that looks like payments or credits triggers the flow.
    if (host == QLatin1String("payments") ||
        path.startsWith(QLatin1String("/payments"))) {
        if (!ref.isEmpty()) {
            // Restart payment polling with the callback reference.
            m_paymentReference = ref;
            m_paymentPollCount = 0;
            if (m_payPollTimer && !m_payPollTimer->isActive())
                m_payPollTimer->start();
            toast(tr("Payment return received — verifying…"), QStringLiteral("info"));
            pollPaymentStatus();
            // Reference flow → the payment STATUS modal, not the purchase form.
            m_showPayStatus = true;
        } else {
            m_showPay = true;
        }
        emit modalChanged();
        return;
    }

    if (host == QLatin1String("credits") || host == QLatin1String("buy")) {
        m_showPay = true;
        emit modalChanged();
        return;
    }

    if (host == QLatin1String("access") || path.startsWith(QLatin1String("/access"))) {
        m_showPlanGate = true;
        emit modalChanged();
        return;
    }

    if (host == QLatin1String("auth") || path.startsWith(QLatin1String("/auth"))) {
        goTo(QStringLiteral("auth"));
        return;
    }

    // Password-reset deep link: liveescape://reset?token=… (Electron parity:
    // dashboard.html ?token= URL param routes to showResetPassword(token)).
    if (host == QLatin1String("reset") || path.startsWith(QLatin1String("/reset"))) {
        const QString token = q.queryItemValue(QStringLiteral("token")).trimmed();
        if (!token.isEmpty()) {
            m_pendingResetToken = token;
            emit pendingResetTokenChanged();
        }
        goTo(QStringLiteral("auth"));
        return;
    }

    // Google OAuth deep link: liveescape://oauth/callback?ticket=…
    if (host == QLatin1String("oauth") || path.startsWith(QLatin1String("/oauth"))) {
        const QString ticket = q.queryItemValue(QStringLiteral("ticket")).trimmed();
        const QString error  = q.queryItemValue(QStringLiteral("error")).trimmed();
        if (!error.isEmpty()) {
            toast(tr("Google sign-in failed: %1").arg(error), QStringLiteral("error"));
            return;
        }
        if (!ticket.isEmpty()) {
            // Stop any active poll; exchange the ticket for JWTs.
            if (m_oauthPollTimer && m_oauthPollTimer->isActive())
                m_oauthPollTimer->stop();
            m_oauthTicket = ticket;
            m_oauthState.clear();
            m_oauthExchanging = true;
            m_api->googleOAuthExchange(
                ticket,
                [this](const QJsonObject &o) {
                    m_oauthTicket.clear();
                    m_oauthExchanging = false;
                    const QVariantMap payload = o.toVariantMap();
                    QVariantMap user = payload.value(QStringLiteral("user")).toMap();
                    if (user.isEmpty()) user = payload;
                    const QString email = user.value(QStringLiteral("email")).toString();
                    QString name = user.value(QStringLiteral("name")).toString();
                    if (name.isEmpty())
                        name = user.value(QStringLiteral("display_name")).toString();
                    const QString id = user.value(QStringLiteral("id")).toString();
                    QString tok = payload.value(QStringLiteral("access_token")).toString();
                    if (tok.isEmpty())
                        tok = payload.value(QStringLiteral("session_token")).toString();
                    if (!tok.isEmpty())
                        m_api->setBearerToken(tok);
                    if (m_session->authenticated() && !m_session->email().isEmpty()
                        && !email.isEmpty() && m_session->email() != email) {
                        m_session->clearLicenseState();
                        m_api->clearLicenseCredentials();
                    }
                    m_session->setUser(email, name, id, tok);
                    const QString rt = payload.value(QStringLiteral("refresh_token")).toString();
                    if (!rt.isEmpty()) m_session->setRefreshToken(rt);
                    m_api->setUserEmail(email);
                    m_api->setLicenseCredentials(m_session->accessKey(), m_session->userId(),
                                                 m_machineId->deviceId());
                    toast(tr("Signed in with Google"), QStringLiteral("ok"));
                    if (m_session->licensed())
                        enterAppAfterAuth();
                    else
                        setScreen(Screen::AccessGate);
                },
                [this](const QString &e) {
                    m_oauthTicket.clear();
                    m_oauthExchanging = false;
                    toast(tr("Google sign-in failed: %1").arg(e), QStringLiteral("error"));
                });
            return;
        }
    }
}

// ── Get Started / Starter Pack flow ──

void AppController::getStartedActivate()
{
    // Reference showGetStartedModal: the "Try First" choice screen is retired;
    // every activation path lands straight on the access gate.
    m_showGetStarted = false;
    m_showPlanGate = false;
    emit modalChanged();
    setScreen(Screen::AccessGate);
}

void AppController::getStartedTryFirst()
{
    if (starterRepurchaseBlocked())
        return;
    m_showGetStarted = false;
    m_showStarterPay = true;
    m_starterPayError.clear();
    // Picker shows "Loading payment options…" until the gateway config arrives
    // (reference openStarterPayModal resets to the loading state on every open).
    m_starterPayLoading = true;
    emit modalChanged();
    m_api->fetchPaymentGateway();
}

void AppController::starterPayPaystack()
{
    if (starterRepurchaseBlocked())
        return;
    if (m_starterPayLoading) return;
    m_starterPayLoading = true;
    m_starterPayError.clear();
    emit modalChanged();
    m_api->starterPackPay(m_session->email(), QStringLiteral("paystack"));
}

void AppController::starterPayFlutterwave()
{
    if (starterRepurchaseBlocked())
        return;
    if (m_starterPayLoading) return;
    m_starterPayLoading = true;
    m_starterPayError.clear();
    emit modalChanged();
    m_api->starterPackPay(m_session->email(), QStringLiteral("flutterwave"));
}

void AppController::populateCryptoCoins()
{
    // Populate crypto coins from payment gateway (shared across all flows —
    // Electron parity: one _cryptoConfigGate drives starter/gate/upgrade/credits).
    m_cryptoCoins.clear();
    const QVariantMap gw = m_paymentGateway;
    const QVariantList coins = gw.value(QStringLiteral("crypto_coins")).toList();
    for (const QVariant &v : coins) {
        const QVariantMap m = v.toMap();
        m_cryptoCoins.append(QVariantMap{
            {"id", m.value(QStringLiteral("id")).toString()},
            {"symbol", m.value(QStringLiteral("symbol")).toString().toUpper()},
            {"name", m.value(QStringLiteral("name")).toString()},
            {"amount_usd", m.value(QStringLiteral("amount_usd")).toDouble()},
            {"address", m.value(QStringLiteral("address")).toString()},
            {"qr_code", m.value(QStringLiteral("qr_code")).toString()}
        });
    }
    if (!m_cryptoCoins.isEmpty()) {
        const QVariantMap firstCoin = m_cryptoCoins.first().toMap();
        m_selectedCryptoCoin = firstCoin.value(QStringLiteral("id")).toString();
    }
}

void AppController::showStarterCryptoPanel()
{
    populateCryptoCoins();
    m_cryptoFlow = QStringLiteral("starter");
    m_starterCryptoWalletVisible = false;
    m_starterCryptoPending = false;
    m_starterCryptoSubStatus.clear();
    m_starterCryptoProofName.clear();
    m_cryptoProofImage.clear();
    m_cryptoProofError.clear();
    emit cryptoChanged();
    m_showStarterPay = true; // keep modal open, panel shows inline
    emit modalChanged();
}

void AppController::showCryptoPanel(const QString &flow)
{
    populateCryptoCoins();
    m_cryptoFlow = flow;
    m_starterCryptoWalletVisible = false;
    m_cryptoPending = false;
    m_cryptoSubStatus.clear();
    m_starterCryptoProofName.clear();
    m_cryptoProofImage.clear();
    m_cryptoProofError.clear();
    emit cryptoChanged();
}

void AppController::selectCryptoCoin(const QString &coinId)
{
    if (m_selectedCryptoCoin == coinId) return;
    m_selectedCryptoCoin = coinId;
    // Update wallet display for selected coin
    for (const QVariant &v : m_cryptoCoins) {
        const QVariantMap m = v.toMap();
        if (m.value(QStringLiteral("id")).toString() == coinId) {
            m_starterCryptoAddress = m.value(QStringLiteral("address")).toString();
            m_starterCryptoQR = m.value(QStringLiteral("qr_code")).toString();
            m_starterCryptoWalletVisible = true;
            break;
        }
    }
    emit cryptoChanged();
}

void AppController::submitStarterCryptoProof(const QString &txId)
{
    submitCryptoProofFor(QStringLiteral("starter"), txId, QStringLiteral("starter"));
}

void AppController::submitCryptoProofFor(const QString &flow, const QString &txId, const QString &planId)
{
    const bool isStarter = flow == QLatin1String("starter");
    const QString tx = txId.trimmed();
    const auto setSub = [this, isStarter](const QString &s) {
        if (isStarter)
            m_starterCryptoSubStatus = s;
        else
            m_cryptoSubStatus = s;
        emit cryptoChanged();
    };
    // Reference guards (starterSubmitCrypto / gateSubmitCrypto), in order.
    if (starterRepurchaseBlocked()) {
        setSub(m_starterPayError);
        return;
    }
    if (m_selectedCryptoCoin.isEmpty()) {
        setSub(QStringLiteral("⚠ Select a coin first."));
        return;
    }
    if (tx.isEmpty()) {
        setSub(QStringLiteral("⚠ Enter your transaction ID."));
        return;
    }
    if (m_starterCryptoProofName.isEmpty() || m_cryptoProofImage.isEmpty()) {
        setSub(QStringLiteral("⚠ Upload a payment proof image."));
        return;
    }
    if (!m_cryptoProofError.isEmpty()) {
        setSub(m_cryptoProofError);
        return;
    }
    setSub(tr("Uploading proof..."));

    const QString email = m_session->email();
    m_api->submitCryptoProof(email, tx, planId, QString::fromLatin1(m_cryptoProofImage));
    QString ok;
    if (isStarter)
        ok = tr("✓ Payment submitted. We'll verify your transaction and activate your 500 credits within 24 hours.");
    else if (flow == QLatin1String("gate"))
        ok = tr("✓ Payment submitted. We'll verify your transaction and email your license key within 24 hours.");
    else if (flow == QLatin1String("upgrade"))
        ok = tr("✓ Payment submitted. We'll verify your transaction and apply your upgrade within 24 hours.");
    else
        ok = tr("✓ Payment submitted. We'll verify your transaction and add your credits within 24 hours.");
    if (isStarter) {
        m_starterCryptoPending = true;
        m_starterCryptoSubStatus = ok;
    } else {
        m_cryptoPending = true;
        m_cryptoSubStatus = ok;
    }
    emit cryptoChanged();
}

void AppController::starterLockActivate()
{
    // Reference starterLockActivate: drop the starter entitlement (and the
    // starter_pack key) so the activation flow lands on a clean access gate.
    m_showStarterLock = false;
    m_session->setStarterPack(false);
    if (m_session->accessType() == QLatin1String("starter_pack")) {
        m_session->clearLicenseState();
        m_api->clearLicenseCredentials();
    }
    emit modalChanged();
    setScreen(Screen::AccessGate);
}

void AppController::dismissPaySuccess()
{
    m_showPaySuccess = false;
    emit modalChanged();
}

// ── Google OAuth ────────────────────────────────────────────────────────────

void AppController::socialLogin(const QString &provider)
{
    if (provider != QLatin1String("google")) {
        toast(tr("%1 sign-in is not supported").arg(provider), QStringLiteral("error"));
        return;
    }
    if (m_oauthPollTimer && m_oauthPollTimer->isActive()) {
        toast(tr("Sign-in already in progress…"), QStringLiteral("info"));
        return;
    }
    toast(tr("Starting Google sign-in…"), QStringLiteral("info"));
    m_api->googleOAuthStart(
        [this, provider](const QJsonObject &o) {
            const QString authUrl = o.value(QStringLiteral("authorization_url")).toString();
            const QString state  = o.value(QStringLiteral("state")).toString();
            if (authUrl.isEmpty() || state.isEmpty()) {
                toast(tr("Failed to start Google sign-in"), QStringLiteral("error"));
                return;
            }
            m_oauthState = state;
            m_oauthTicket.clear();
            m_oauthPollCount = 0;
            m_oauthExchanging = false;
            // Open the system browser for the Google consent screen.
            QDesktopServices::openUrl(QUrl(authUrl));
            toast(tr("Complete sign-in in your browser…"), QStringLiteral("info"));
            // Start polling for the ticket (every 2 s, max 5 min).
            if (!m_oauthPollTimer) {
                m_oauthPollTimer = new QTimer(this);
                m_oauthPollTimer->setInterval(2000);
                connect(m_oauthPollTimer, &QTimer::timeout, this, [this]() {
                    if (m_oauthExchanging) return;
                    ++m_oauthPollCount;
                    if (m_oauthPollCount > 150) {          // 5 min
                        m_oauthPollTimer->stop();
                        m_oauthState.clear();
                        toast(tr("Sign-in timed out — please try again"), QStringLiteral("error"));
                        return;
                    }
                    m_api->googleOAuthPoll(
                        m_oauthState,
                        [this](const QJsonObject &o) {
                            const QString ticket = o.value(QStringLiteral("ticket")).toString();
                            if (ticket.isEmpty()) return;  // not ready yet
                            m_oauthPollTimer->stop();
                            m_oauthTicket = ticket;
                            m_oauthExchanging = true;
                            m_api->googleOAuthExchange(
                                ticket,
                                [this](const QJsonObject &o) {
                                    m_oauthState.clear();
                                    m_oauthTicket.clear();
                                    m_oauthExchanging = false;
                                    // Same handling as loginSucceeded.
                                    const QVariantMap payload = o.toVariantMap();
                                    QVariantMap user = payload.value(QStringLiteral("user")).toMap();
                                    if (user.isEmpty()) user = payload;
                                    const QString email = user.value(QStringLiteral("email")).toString();
                                    QString name = user.value(QStringLiteral("name")).toString();
                                    if (name.isEmpty())
                                        name = user.value(QStringLiteral("display_name")).toString();
                                    const QString id = user.value(QStringLiteral("id")).toString();
                                    QString tok = payload.value(QStringLiteral("access_token")).toString();
                                    if (tok.isEmpty())
                                        tok = payload.value(QStringLiteral("session_token")).toString();
                                    if (!tok.isEmpty())
                                        m_api->setBearerToken(tok);
                                    if (m_session->authenticated() && !m_session->email().isEmpty()
                                        && !email.isEmpty() && m_session->email() != email) {
                                        m_session->clearLicenseState();
                                        m_api->clearLicenseCredentials();
                                    }
                                    m_session->setUser(email, name, id, tok);
                                    const QString rt = payload.value(QStringLiteral("refresh_token")).toString();
                                    if (!rt.isEmpty()) m_session->setRefreshToken(rt);
                                    m_api->setUserEmail(email);
                                    m_api->setLicenseCredentials(m_session->accessKey(), m_session->userId(),
                                                                 m_machineId->deviceId());
                                    toast(tr("Signed in with Google"), QStringLiteral("ok"));
                                    if (m_session->licensed())
                                        enterAppAfterAuth();
                                    else
                                        setScreen(Screen::AccessGate);
                                },
                                [this](const QString &e) {
                                    m_oauthState.clear();
                                    m_oauthTicket.clear();
                                    m_oauthExchanging = false;
                                    toast(tr("Google sign-in failed: %1").arg(e), QStringLiteral("error"));
                                });
                        },
                        [this](const QString &e) {
                            m_oauthPollTimer->stop();
                            m_oauthState.clear();
                            m_oauthTicket.clear();
                            toast(tr("Google sign-in failed: %1").arg(e), QStringLiteral("error"));
                        });
                });
            }
            m_oauthPollCount = 0;
            m_oauthPollTimer->start();
        },
        [this](const QString &e) {
            toast(tr("Google sign-in unavailable: %1").arg(e), QStringLiteral("error"));
        });
}
