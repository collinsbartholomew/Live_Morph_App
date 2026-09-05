#include "AppController.h"
#include <QSystemTrayIcon>
#include <QTimer>
#include <QIcon>
#include <QUrl>
#include <QUrlQuery>
#include "AuthManager.h"
#include "SessionManager.h"
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
    connect(m_auth, &AuthManager::signedIn, this, [this]() {
        setCurrentPage(QStringLiteral("dashboard"));
        emit notification(tr("Signed in"), QStringLiteral("success"));
        if (m_auth)
            m_auth->refreshProfile();
        // Start camera only after successful auth when user opted in
        if (m_config && m_config->startWithCamera() && m_camera && !m_camera->isActive())
            m_camera->start();
    });
    connect(m_auth, &AuthManager::signedOut, this, [this]() {
        if (m_session && m_session->isActive())
            m_session->stopSession();
        if (m_recording && m_recording->isRecording())
            m_recording->stopRecording(QStringLiteral("sign-out"));
        if (m_camera && m_camera->isActive())
            m_camera->stop();
        setCurrentPage(QStringLiteral("auth"));
        emit notification(tr("Signed out"), QStringLiteral("info"));
    });
    connect(m_auth, &AuthManager::authenticatedChanged, this, [this]() {
        if (!m_auth->isAuthenticated() && kAuthedPages.contains(m_currentPage))
            setCurrentPage(QStringLiteral("auth"));
        else if (m_auth->isAuthenticated() && m_currentPage == QLatin1String("auth"))
            setCurrentPage(QStringLiteral("dashboard"));
    });
    connect(m_auth, &AuthManager::errorMessageChanged, this, [this]() {
        const QString e = m_auth->errorMessage();
        if (!e.isEmpty())
            emit notification(e, QStringLiteral("error"));
    });

    if (m_session) {
        connect(m_session, &SessionManager::error, this, [this](const QString &msg) {
            emit notification(msg, QStringLiteral("error"));
        });
        connect(m_session, &SessionManager::sessionStarted, this, [this]() {
            emit notification(tr("Morph session started"), QStringLiteral("success"));
            // Auto-record when enabled in settings
            if (m_config && m_config->autoRecord() && m_recording && !m_recording->isRecording()) {
                m_recording->startRecording(m_session->activeCharacterId());
            }
        });
        connect(m_session, &SessionManager::sessionStopped, this, [this]() {
            if (m_config && m_config->autoRecord() && m_recording && m_recording->isRecording()) {
                m_recording->stopRecording(QStringLiteral("session-end"));
            }
        });
    }

    // Recording events are transient + contextual (with a "Reveal" action), so they
    // are surfaced from QML directly rather than double-emitted here.

    QMetaObject::invokeMethod(this, [this]() {
        m_isReady = true;
        emit isReadyChanged();
        if (m_auth->isAuthenticated())
            setCurrentPage(QStringLiteral("dashboard"));
        else
            setCurrentPage(QStringLiteral("auth"));
    }, Qt::QueuedConnection);
}

void AppController::setCurrentPage(const QString &page)
{
    QString target = page;
    if (!m_auth->isAuthenticated() && kAuthedPages.contains(target))
        target = QStringLiteral("auth");
    if (m_auth->isAuthenticated() && target == QLatin1String("auth"))
        target = QStringLiteral("dashboard");
    if (m_currentPage == target)
        return;
    m_currentPage = target;
    emit currentPageChanged();
}

void AppController::setSwapMode(const QString &mode)
{
    if (m_swapMode == mode)
        return;
    m_swapMode = mode;
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
    m_swapTier = tier;
    if (m_session)
        m_session->setHdActive(tier == QLatin1String("hd"));
    emit swapTierChanged();
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

void AppController::openHelp()
{
    emit helpRequested();
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
    if (!m_auth || !m_auth->isAuthenticated()) {
        emit errorOccurred(tr("Not signed in"), tr("Please sign in to start morphing."));
        setCurrentPage(QStringLiteral("auth"));
        return;
    }
    if ((m_auth->creditBalance() + m_auth->bonusBalance()) <= 0.0) {
        emit errorOccurred(tr("Insufficient credits"), tr("Buy more credits to continue."));
        openBuyCredits();
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

void AppController::notify(const QString &message, const QString &type)
{
    emit notification(message, type.isEmpty() ? QStringLiteral("info") : type);
}


void AppController::showOsNotification(const QString &title, const QString &body)
{
    if (!QSystemTrayIcon::isSystemTrayAvailable()) {
        emit notification(body.isEmpty() ? title : (title + ": " + body), QStringLiteral("info"));
        return;
    }
    // Transient tray icon for one-shot notification
    auto *tray = new QSystemTrayIcon(this);
    tray->setIcon(QIcon(QStringLiteral(":/qt/qml/LiveMorph/resources/assets/livemorph-icon.png")));
    tray->show();
    tray->showMessage(title, body, QSystemTrayIcon::Information, 5000);
    QObject::connect(tray, &QSystemTrayIcon::messageClicked, tray, &QObject::deleteLater);
    QTimer::singleShot(6000, tray, &QObject::deleteLater);
}

void AppController::handleDeepLink(const QString &url)
{
    emit deepLinkReceived(url);
    const QUrl u(url);
    const QString path = u.path();
    const QUrlQuery q(u);
    // livemorph://auth/callback?token=... or https://host/payments/callback?reference=
    if (path.contains(QLatin1String("payments")) || q.hasQueryItem(QStringLiteral("reference"))) {
        const QString ref = q.queryItemValue(QStringLiteral("reference"));
        const QString order = q.queryItemValue(QStringLiteral("order_id"));
        if (!order.isEmpty()) {
            // Client can verify
            emit notification(tr("Payment return detected — verifying…"), QStringLiteral("info"));
        } else if (!ref.isEmpty()) {
            emit notification(tr("Payment reference received"), QStringLiteral("info"));
        }
        setShowBuyCredits(true);
    } else if (path.contains(QLatin1String("oauth"))
               || q.hasQueryItem(QStringLiteral("ticket"))) {
        const QString err = q.queryItemValue(QStringLiteral("error"));
        if (!err.isEmpty()) {
            emit notification(tr("Google sign-in failed: %1").arg(err), QStringLiteral("error"));
            navigateTo(QStringLiteral("auth"));
            return;
        }
        const QString ticket = q.queryItemValue(QStringLiteral("ticket"));
        if (!ticket.isEmpty() && m_auth) {
            emit notification(tr("Completing Google sign-in…"), QStringLiteral("info"));
            m_auth->exchangeOAuthTicket(ticket);
            return;
        }
        // Tokens in query strings are rejected (history/logs exposure)
        emit notification(tr("OAuth callback missing ticket"), QStringLiteral("error"));
        navigateTo(QStringLiteral("auth"));
        return;
    } else if (path.contains(QLatin1String("auth")) || path.contains(QLatin1String("login"))) {
        navigateTo(QStringLiteral("auth"));
    } else if (path.contains(QLatin1String("credits")) || path.contains(QLatin1String("buy"))) {
        setShowBuyCredits(true);
    }
    emit notification(tr("Opened link"), QStringLiteral("info"));
}
