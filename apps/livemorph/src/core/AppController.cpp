#include "AppController.h"
#include <QSystemTrayIcon>
#include <QTimer>
#include <QIcon>
#include <QUrl>
#include <QUrlQuery>
#include <QSettings>
#include "AuthManager.h"
#include "SessionManager.h"
#include "../services/BackendClient.h"
#include "CameraManager.h"
#include "RecordingManager.h"
#include "ConfigManager.h"
#include "models/CharacterCatalogModel.h"
#include "models/PresetModel.h"

#include <QCoreApplication>
#include <QMetaObject>

static const QStringList kAuthedPages = {
    QStringLiteral("dashboard"),
    QStringLiteral("buy-credits"),
    QStringLiteral("settings"),
};

AppController::AppController(AuthManager *auth,
                             SessionManager *session,
                             CameraManager *camera,
                             RecordingManager *recording,
                             ConfigManager *config,
                             CharacterCatalogModel *catalog,
                             PresetModel *presets,
                             QObject *parent)
    : QObject(parent)
    , m_auth(auth)
    , m_session(session)
    , m_camera(camera)
    , m_recording(recording)
    , m_config(config)
    , m_catalog(catalog)
    , m_presets(presets)
{
    // Restore the persisted engine tier (swapTier) across launches.
    {
        QSettings s(QStringLiteral("LiveMorph"), QStringLiteral("LiveMorph"));
        const QString saved = s.value(QStringLiteral("session/swapTier")).toString();
        if (!saved.isEmpty())
            m_swapTier = saved;
    }
    connect(m_auth, &AuthManager::signedIn, this, [this]() {
        setCurrentPage(QStringLiteral("dashboard"));
        emit notification(tr("Signed in"), QStringLiteral("success"), QString());
        if (m_auth)
            m_auth->refreshProfile();
        updateHdAvailability();
        // Start camera only after successful auth when user opted in
        if (m_config && m_config->startWithCamera() && m_camera && !m_camera->isActive())
            m_camera->start();
    });
    connect(m_auth, &AuthManager::profileChanged, this, &AppController::updateHdAvailability);
    // Bootstrap carries the server-side hd_multiplier — re-evaluate the HD gate
    // when it (re)loads instead of having a second, conflicting setter.
    if (m_auth && m_auth->backend())
        connect(m_auth->backend(), &BackendClient::bootstrapChanged, this, &AppController::updateHdAvailability);
    connect(m_auth, &AuthManager::signedOut, this, [this]() {
        if (m_session && m_session->isActive())
            m_session->stopSession();
        if (m_recording && m_recording->isRecording())
            m_recording->stopRecording(QStringLiteral("sign-out"));
        if (m_camera && m_camera->isActive())
            m_camera->stop();
        // Don't leave downloads/lock overlays up over the auth screen.
        setShowDownloads(false);
        setShowLockScreen(false);
        updateHdAvailability();
        setCurrentPage(QStringLiteral("auth"));
        emit notification(tr("Signed out"), QStringLiteral("info"), QString());
    });
    connect(m_auth, &AuthManager::authenticatedChanged, this, [this]() {
        if (!m_auth->isAuthenticated() && kAuthedPages.contains(m_currentPage))
            setCurrentPage(QStringLiteral("auth"));
        else if (m_auth->isAuthenticated() && m_currentPage == QLatin1String("auth"))
            setCurrentPage(QStringLiteral("dashboard"));
        // A payment deep link that arrived while signed out (cold start) is
        // persisted — verify it now that we have a token.
        if (m_auth->isAuthenticated() && m_auth->backend()) {
            QSettings s(QStringLiteral("LiveMorph"), QStringLiteral("LiveMorph"));
            const QString order = s.value(QStringLiteral("pending/paymentOrder")).toString();
            const QString ref = s.value(QStringLiteral("pending/paymentRef")).toString();
            if (!order.isEmpty()) {
                s.remove(QStringLiteral("pending/paymentOrder"));
                s.remove(QStringLiteral("pending/paymentRef"));
                emit notification(tr("Payment return detected — verifying…"), QStringLiteral("info"), QStringLiteral("payment"));
                m_auth->backend()->verifyPaymentOrder(order, ref);
            }
        }
    });
    connect(m_auth, &AuthManager::errorMessageChanged, this, [this]() {
        const QString e = m_auth->errorMessage();
        if (!e.isEmpty())
            emit notification(e, QStringLiteral("error"), QString());
    });

    if (m_session) {
        connect(m_session, &SessionManager::error, this, [this](const QString &msg) {
            emit notification(msg, QStringLiteral("error"), QString());
        });
        connect(m_session, &SessionManager::sessionStarted, this, [this]() {
            emit notification(tr("Morph session started"), QStringLiteral("success"), QString());
            // Auto-record when enabled in settings
            if (m_config && m_config->autoRecord() && m_recording && !m_recording->isRecording()) {
                m_recording->startRecording(m_session->activeCharacterId());
            }
        });
        connect(m_session, &SessionManager::sessionStopped, this, [this]() {
            // Both auto-record teardown AND any manual morph-stream recording:
            // a recording must not keep ticking on dead air after the session
            // dies (35s watchdog, force-disconnect, reconnect exhaustion).
            if (m_recording && m_recording->isRecording())
                m_recording->stopRecording(QStringLiteral("session-end"));
        });
    }

    // Recording events are transient + contextual (with a "Reveal" action), so they
    // are surfaced from QML directly rather than double-emitted here.

    QMetaObject::invokeMethod(this, [this]() {
        m_isReady = true;
        emit isReadyChanged();
        if (m_auth && m_auth->isAuthenticated())
            setCurrentPage(QStringLiteral("dashboard"));
        else
            setCurrentPage(QStringLiteral("auth"));
    }, Qt::QueuedConnection);
}

void AppController::setCurrentPage(const QString &page)
{
    QString target = page;
    const bool authed = m_auth && m_auth->isAuthenticated();
    if (!authed && kAuthedPages.contains(target))
        target = QStringLiteral("auth");
    if (authed && target == QLatin1String("auth"))
        target = QStringLiteral("dashboard");
    if (m_currentPage == target)
        return;
    m_currentPage = target;
    emit currentPageChanged();
}

void AppController::setCurrentPageForced(const QString &page)
{
    if (m_currentPage == page)
        return;
    m_currentPage = page;
    emit currentPageChanged();
}

void AppController::setSwapMode(const QString &mode)
{
    if (m_swapMode == mode)
        return;
    m_swapMode = mode;
    // Wire scene mode to SessionManager
    if (m_session) {
        m_session->setSceneEnabled(mode == QLatin1String("scene"));
    }
    emit swapModeChanged();
}

void AppController::setRealtimeProvider(const QString &provider)
{
    if (m_realtimeProvider == provider)
        return;
    m_realtimeProvider = provider;
    emit realtimeProviderChanged();
}

void AppController::setSwapTier(const QString &tier)
{
    if (m_swapTier == tier)
        return;
    // HD is gated to paid tiers (Electron parity: unlocks with a Starter+ pack).
    if (tier == QLatin1String("hd") && !m_hdAvailable)
        return;
    m_swapTier = tier;
    QSettings(QStringLiteral("LiveMorph"), QStringLiteral("LiveMorph"))
        .setValue(QStringLiteral("session/swapTier"), m_swapTier);
    if (m_session)
        m_session->setHdActive(tier == QLatin1String("hd"));
    emit swapTierChanged();
}

void AppController::setHdAvailable(bool available)
{
    if (m_hdAvailable == available)
        return;
    m_hdAvailable = available;
    if (!m_hdAvailable && m_swapTier == QLatin1String("hd")) {
        m_swapTier = QStringLiteral("standard");
        if (m_session)
            m_session->setHdActive(false);
        emit swapTierChanged();
    }
    emit hdAvailableChanged();
}

void AppController::updateHdAvailability()
{
    const QString t = m_auth ? m_auth->tier().toLower() : QStringLiteral("free");
    // HD requires BOTH a server-side HD price ladder (bootstrap hd_multiplier
    // > 1) AND a paid user tier (starter / mid / pro); free/basic stay locked.
    // When the bootstrap is unknown (backend null) default to NOT available —
    // fail closed rather than reducing the gate to the tier string alone.
    const BackendClient *backend = m_auth ? m_auth->backend() : nullptr;
    const bool serverHd = backend ? backend->hdMultiplier() > 1.0 : false;
    const bool available = serverHd && !t.isEmpty() && t != QLatin1String("free") && t != QLatin1String("basic");
    if (m_hdAvailable == available)
        return;
    m_hdAvailable = available;
    if (!m_hdAvailable && m_swapTier == QLatin1String("hd")) {
        m_swapTier = QStringLiteral("standard");
        if (m_session)
            m_session->setHdActive(false);
        emit swapTierChanged();
    }
    emit hdAvailableChanged();
}

void AppController::setShowWhatsNew(bool v)
{
    if (m_showWhatsNew == v)
        return;
    m_showWhatsNew = v;
    emit showWhatsNewChanged();
}

void AppController::setShowSettings(bool v)
{
    if (m_showSettings == v)
        return;
    m_showSettings = v;
    emit showSettingsChanged();
}

void AppController::setShowBuyCredits(bool v)
{
    if (m_showBuyCredits == v)
        return;
    m_showBuyCredits = v;
    emit showBuyCreditsChanged();
}

void AppController::navigateTo(const QString &page)
{
    setCurrentPage(page);
}

void AppController::openSettings()
{
    setShowSettings(true);
}

void AppController::openBuyCredits()
{
    if (m_currentPage != QLatin1String("dashboard"))
        setCurrentPage(QStringLiteral("dashboard"));
    setShowBuyCredits(true);
}

void AppController::setShowTour(bool v)
{
    if (m_showTour == v)
        return;
    m_showTour = v;
    emit showTourChanged();
}

void AppController::setShowDownloads(bool v)
{
    if (m_showDownloads == v)
        return;
    m_showDownloads = v;
    emit showDownloadsChanged();
}

void AppController::setShowLockScreen(bool v)
{
    if (m_showLockScreen == v)
        return;
    m_showLockScreen = v;
    emit showLockScreenChanged();
    if (v)
        emit lockScreenChanged();
}

void AppController::openDownloads()
{
    setShowDownloads(true);
}

void AppController::closeDownloads()
{
    setShowDownloads(false);
}

void AppController::showLock(const QString &title, const QString &message, bool dismissable)
{
    m_lockTitle = title;
    m_lockMessage = message;
    m_lockDismissable = dismissable;
    m_lockReason = title.contains(QStringLiteral("CREDITS"), Qt::CaseInsensitive)
                      ? LockReason::Credits : LockReason::Security;
    // setShowLockScreen() early-returns when the lock is already up, so its
    // lockScreenChanged() never fires — a second lock (e.g. credits depleted
    // during a maintenance lock) would keep showing the FIRST title/message.
    emit lockScreenChanged();
    setShowLockScreen(true);
}

void AppController::dismissLockScreen()
{
    setShowLockScreen(false);
}

void AppController::openHelp()
{
    emit helpRequested();
}

void AppController::openAccountUsage()
{
    emit accountUsageRequested();
    setShowSettings(true);
}

void AppController::requestEscape()
{
    emit escapeRequested();
}

void AppController::modalOpened()
{
    ++m_openModals;
    emit openModalsChanged();
}

void AppController::modalClosed()
{
    if (m_openModals > 0)
        --m_openModals;
    emit openModalsChanged();
}

void AppController::requestModalEscape()
{
    emit modalEscapeRequested();
}

void AppController::requestOpenNotifications()
{
    emit openNotificationsRequested();
}

void AppController::quitApp()
{
    if (m_session && m_session->isActive())
        m_session->stopSession();
    if (m_recording && m_recording->isRecording())
        m_recording->stopRecording(QStringLiteral("quit"));
    QCoreApplication::quit();
}

void AppController::startSwap()
{
    if (m_showLockScreen) {
        emit errorOccurred(tr("Session locked"), tr("Unlock the session to start a swap."));
        return;
    }
    if (!m_auth || !m_auth->isAuthenticated()) {
        emit errorOccurred(tr("Not signed in"), tr("Please sign in to start morphing."));
        setCurrentPage(QStringLiteral("auth"));
        return;
    }
    const double balance = m_auth->creditBalance() + m_auth->bonusBalance();
    if (balance <= 0.0) {
        emit errorOccurred(tr("Insufficient credits"), tr("Buy more credits to continue."));
        openBuyCredits();
        return;
    }
    // Gate: need at least rate×60 credits to start a session
    if (m_session) {
        const double minStart = m_session->creditsPerSecond() * 60.0;
        if (minStart > 0.0 && balance < minStart) {
            emit errorOccurred(tr("Low credits"),
                tr("Need at least %1 credits to start. Buy more credits.")
                    .arg(QString::number(minStart, 'f', 0)));
            openBuyCredits();
            return;
        }
    }
    // Electron avatarPrompt gate: no character picked → toast, no session
    if (m_session
        && m_session->activeCharacterId().isEmpty()
        && m_session->activePrompt().isEmpty()) {
        emit errorOccurred(tr("Pick a character"),
                           tr("Pick or upload a character before starting your swap."));
        return;
    }
    if (!m_session)
        return;
    m_session->startSession(m_realtimeProvider, m_swapTier);
}

void AppController::stopSwap()
{
    if (m_session)
        m_session->stopSession();
}

void AppController::toggleSwap()
{
    if (m_session && m_session->isActive())
        stopSwap();
    else
        startSwap();
}

void AppController::openPreview()
{
    emit previewRequested();
}

void AppController::openPopout()
{
    emit popoutRequested();
}

void AppController::notify(const QString &message, const QString &type, const QString &category)
{
    emit notification(message, type.isEmpty() ? QStringLiteral("info") : type, category);
}


void AppController::showOsNotification(const QString &title, const QString &body)
{
    // Settings ▸ General ▸ "Desktop notifications" gate (notifications/desktop)
    if (m_config) {
        const QVariant v = m_config->value(QStringLiteral("notifications/desktop"), true);
        const bool enabled = (v == true || v == QStringLiteral("true"));
        if (!enabled)
            return;
    }
    if (!QSystemTrayIcon::isSystemTrayAvailable()) {
        // No tray: do NOT re-emit notification() here — that signal feeds
        // Notifier::push, whose pushed() signal calls back into this method,
        // causing infinite recursion (stack overflow) on tray-less systems.
        // The in-app toast/center already display the item via Notifier itself.
        return;
    }
    // ONE persistent tray icon — creating/destroying an icon per notification
    // churned the notification area (ghost entries on some DEs).
    if (!m_tray) {
        m_tray = new QSystemTrayIcon(this);
        m_tray->setIcon(QIcon(QStringLiteral(":/assets/livemorph-icon.png")));
        m_tray->show();
    }
    m_tray->showMessage(title, body, QSystemTrayIcon::Information, 5000);
}

void AppController::handleDeepLink(const QString &url)
{
    const QUrl u(url);
    // Never hand the query string to QML — callbacks can carry tokens.
    QUrl clean = u;
    clean.setQuery(QString());
    emit deepLinkReceived(clean.toString());
    const QUrlQuery q(u);
    // Origin allowlist: only our custom scheme or the configured API host may be
    // routed — this slot is QML-invokable, so it must not act on arbitrary URLs.
    if (u.scheme() != QLatin1String("livemorph")) {
        const QString apiHost = m_config ? QUrl(m_config->apiBaseUrl()).host() : QString();
        if (u.scheme() != QLatin1String("https") || apiHost.isEmpty() || u.host() != apiHost) {
            emit notification(tr("Ignored link (unrecognized origin)"), QStringLiteral("warning"), QString());
            return;
        }
    }
    // For custom schemes the first segment lands in the HOST, not the path.
    const QString host = u.host();
    const QString path = u.path();
    // livemorph://payments/callback?… or https://<api-host>/payments/callback?reference=
    if (host == QLatin1String("payments") || path.contains(QLatin1String("/payments"))
        || q.hasQueryItem(QStringLiteral("reference"))) {
        const QString ref = q.queryItemValue(QStringLiteral("reference"));
        const QString order = q.queryItemValue(QStringLiteral("order_id"));
        if (!order.isEmpty() && m_auth && m_auth->backend() && m_auth->isAuthenticated()) {
            // Returning from a hosted checkout — verify immediately instead of
            // waiting for the banner's poll.
            emit notification(tr("Payment return detected — verifying…"), QStringLiteral("info"), QStringLiteral("payment"));
            m_auth->backend()->verifyPaymentOrder(order, ref);
        } else if (!order.isEmpty()) {
            // Signed out (cold start via the protocol handler): persist the
            // order so it is verified right after sign-in.
            QSettings s(QStringLiteral("LiveMorph"), QStringLiteral("LiveMorph"));
            s.setValue(QStringLiteral("pending/paymentOrder"), order);
            s.setValue(QStringLiteral("pending/paymentRef"), ref);
            emit notification(tr("Payment reference received — will verify after sign-in"), QStringLiteral("info"), QStringLiteral("payment"));
        } else if (!ref.isEmpty()) {
            emit notification(tr("Payment reference received"), QStringLiteral("info"), QStringLiteral("payment"));
        }
        openBuyCredits(); // routes to the dashboard when authed, auth page otherwise
        return;
    } else if (host == QLatin1String("oauth")
               || q.hasQueryItem(QStringLiteral("ticket"))) {
        const QString err = q.queryItemValue(QStringLiteral("error"));
        if (!err.isEmpty()) {
            emit notification(tr("Google sign-in failed: %1").arg(err), QStringLiteral("error"), QString());
            navigateTo(QStringLiteral("auth"));
            return;
        }
        const QString ticket = q.queryItemValue(QStringLiteral("ticket"));
        if (!ticket.isEmpty() && m_auth) {
            // Anti session-fixation: the callback must echo the nonce we sent.
            const QString state = q.queryItemValue(QStringLiteral("state"));
            if (!m_auth->verifyGoogleState(state)) {
                emit notification(tr("Ignored sign-in link (security state mismatch)"), QStringLiteral("error"), QString());
                navigateTo(QStringLiteral("auth"));
                return;
            }
            emit notification(tr("Completing Google sign-in…"), QStringLiteral("info"), QString());
            m_auth->exchangeOAuthTicket(ticket);
            return;
        }
        // Tokens in query strings are rejected (history/logs exposure)
        emit notification(tr("OAuth callback missing ticket"), QStringLiteral("error"), QString());
        navigateTo(QStringLiteral("auth"));
        return;
    } else if (host == QLatin1String("auth") || host == QLatin1String("login")) {
        navigateTo(QStringLiteral("auth"));
        return;
    } else if (host == QLatin1String("credits") || host == QLatin1String("buy")) {
        openBuyCredits();
        return;
    }
    // Only emit generic notification if no specific handler matched
    emit notification(tr("Opened link"), QStringLiteral("info"), QString());
}
