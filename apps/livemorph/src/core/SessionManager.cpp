#include "SessionManager.h"
#include "AuthManager.h"
#include "ConfigManager.h"
#include "CameraManager.h"
#include "services/BackendClient.h"
#include "services/WebRtcSignalingClient.h"
#include "GstRtcPeer.h"

#include <QJsonObject>
#include <QUrl>
#include <QtGlobal>

SessionManager::SessionManager(AuthManager *auth, ConfigManager *config, BackendClient *backend,
                               WebRtcSignalingClient *signaling,
                               QObject *parent)
    : QObject(parent)
    , m_auth(auth)
    , m_config(config)
    , m_backend(backend)
    , m_signaling(signaling)
{
    m_tickTimer.setInterval(100);
    connect(&m_tickTimer, &QTimer::timeout, this, &SessionManager::tickFrame);

    m_cooldownTimer.setInterval(1000);
    connect(&m_cooldownTimer, &QTimer::timeout, this, [this]() {
        if (m_cooldownSec > 0) {
            --m_cooldownSec;
            emit cooldownChanged();
            if (m_cooldownSec == 0) {
                m_cooldownTimer.stop();
                setStatus(Status::Idle, tr("Ready"));
            } else {
                setStatus(Status::Cooldown, tr("Cooldown %1s").arg(m_cooldownSec));
            }
        }
    });

    wireSignaling();
}

void SessionManager::wireSignaling()
{
    if (!m_signaling)
        return;

    connect(m_signaling, &WebRtcSignalingClient::connectedChanged, this, [this]() {
        m_signalingConnected = m_signaling->isConnected();
        emit signalingConnectedChanged();
        if (m_signalingConnected && m_active) {
            setStatus(Status::Connected, tr("Signaling live · %1").arg(engineLabel()));
            // Create native GStreamer peer and let it create the SDP offer
            createNativePeer();
            // Apply character / prompt to live session
            pushActiveTargetsToProvider();
        }
    });

    connect(m_signaling, &WebRtcSignalingClient::sessionIdChanged, this, [this]() {
        m_realtimeSessionId = m_signaling->sessionId();
        emit realtimeSessionIdChanged();
    });

    connect(m_signaling, &WebRtcSignalingClient::answerReceived, this, [this](const QString &sdp) {
        if (m_peer)
            m_peer->setRemoteAnswer(sdp);
        emit remoteAnswerReceived(sdp);
    });

    connect(m_signaling, &WebRtcSignalingClient::iceCandidateReceived, this, [this](const QJsonObject &c) {
        if (m_peer && !c.isEmpty()) {
            m_peer->addRemoteIce(
                c.value(QStringLiteral("sdpMLineIndex")).toInt(),
                c.value(QStringLiteral("candidate")).toString());
        }
        emit remoteIceCandidateReceived(c);
    });

    connect(m_signaling, &WebRtcSignalingClient::iceRestartRequested, this, [this](const QJsonObject &) {
        emit remoteIceRestartRequested();
    });

    connect(m_signaling, &WebRtcSignalingClient::errorOccurred, this, [this](const QString &msg) {
        if (msg.contains(QStringLiteral("insufficient_credits"), Qt::CaseInsensitive)
            || msg.contains(QStringLiteral("platform_budget"), Qt::CaseInsensitive)) {
            setStatus(Status::InsufficientCredits, tr("Out of credits"));
            stopSession();
            emit error(msg.contains(QStringLiteral("platform_budget"), Qt::CaseInsensitive)
                           ? tr("Service capacity exhausted — try again later")
                           : tr("Insufficient credits — session ended"));
            return;
        }
        // Transient reconnect notices — do not tear down the session
        if (msg.contains(QStringLiteral("reconnect"), Qt::CaseInsensitive)) {
            setStatus(Status::Connecting, msg);
            return;
        }
        setStatus(Status::Error, msg);
        emit error(msg);
    });

    connect(m_signaling, &WebRtcSignalingClient::generatingChanged, this, [this]() {
        if (m_signaling->isGenerating() && m_active)
            setStatus(Status::Generating, tr("Morphing…"));
    });

    connect(m_signaling, &WebRtcSignalingClient::generationSecondsChanged, this, [this]() {
        emit elapsedChanged();
    });
}

void SessionManager::createNativePeer()
{
    if (m_peer)
        return;

    m_peer = new GstRtcPeer(this);
    m_peer->setDirection(GstRtcPeer::Direction::SendRecv);

    m_peer->setStunServer(QStringLiteral("stun://stun.l.google.com:19302"));
    if (const QByteArray turnUrl = qgetenv("LIVEESCAPE_TURN_URLS"); !turnUrl.isEmpty())
        m_peer->setTurnServer(QString::fromUtf8(turnUrl));

    connect(m_peer, &GstRtcPeer::offerReady, this, [this](const QString &sdp) {
        if (m_signaling && m_signaling->isConnected())
            m_signaling->sendOffer(sdp);
    });

    connect(m_peer, &GstRtcPeer::localIceCandidate, this, [this](int mline, const QString &cand) {
        if (m_signaling && m_signaling->isConnected()) {
            QJsonObject c;
            c.insert(QStringLiteral("candidate"), cand);
            c.insert(QStringLiteral("sdpMLineIndex"), mline);
            m_signaling->sendIceCandidate(c);
        }
    });

    connect(m_peer, &GstRtcPeer::errorOccurred, this, [this](const QString &e) {
        emit error(QStringLiteral("WebRTC: %1").arg(e));
    });

    connect(m_peer, &GstRtcPeer::connectionStateChanged, this, [this]() {
        if (m_peer) {
            const QString s = m_peer->connectionState();
            if (s == QLatin1String("connected"))
                setStatus(Status::Connected, tr("Media connected · %1").arg(engineLabel()));
            else if (s == QLatin1String("failed"))
                setStatus(Status::Error, tr("WebRTC connection failed"));
        }
    });

    connect(m_peer, &GstRtcPeer::iceStateChanged, this, [this]() {
        if (m_peer && m_peer->iceState() == QLatin1String("checking"))
            setStatus(Status::Connecting, tr("ICE checking…"));
    });

    // Tee decoded morph frames out to OBS (MJPEG), vcam, popout/preview and recording.
    connect(m_peer, &GstRtcPeer::frameReady, this, [this](const QImage &img) {
        emit morphFrameReady(img);
    });

    m_peer->start();
    emit peerVideoSinkChanged();

    // Forward camera frames to the peer for SendRecv mode
    if (m_camera) {
        connect(m_camera, &CameraManager::frameReady, m_peer, [this](const QImage &img) {
            if (m_peer && m_active)
                m_peer->pushFrame(QVideoFrame(img));
        });
    }
}

void SessionManager::destroyNativePeer()
{
    if (!m_peer)
        return;
    m_peer->stop();
    m_peer->deleteLater();
    m_peer = nullptr;
    emit peerVideoSinkChanged();
}

QVideoSink *SessionManager::peerVideoSink() const
{
    return m_peer ? m_peer->videoSink() : nullptr;
}

void SessionManager::setCameraManager(CameraManager *cam)
{
    m_camera = cam;
}

QString SessionManager::wsBaseUrl() const
{
    // Must hit /api/v1/realtime — bare host is a production footgun
    QString base = m_backend ? m_backend->baseUrl() : QString();
    while (base.endsWith(QLatin1Char('/')))
        base.chop(1);
    if (base.startsWith(QLatin1String("https://")))
        base.replace(0, 5, QStringLiteral("wss"));
    else if (base.startsWith(QLatin1String("http://")))
        base.replace(0, 4, QStringLiteral("ws"));
    if (!base.contains(QStringLiteral("/api/v1/realtime")))
        base += QStringLiteral("/api/v1/realtime");
    return base;
}

QString SessionManager::connectionStatus() const
{
    switch (m_status) {
    case Status::Idle: return QStringLiteral("idle");
    case Status::Connecting: return QStringLiteral("connecting");
    case Status::Connected: return QStringLiteral("connected");
    case Status::Generating: return QStringLiteral("generating");
    case Status::Cooldown: return QStringLiteral("cooldown");
    case Status::InsufficientCredits: return QStringLiteral("insufficient_credits");
    case Status::Error: return QStringLiteral("error");
    }
    return QStringLiteral("idle");
}

double SessionManager::elapsedSec() const
{
    if (m_signaling && m_signaling->generationSeconds() > 0)
        return m_signaling->generationSeconds();
    if (!m_active && !m_timer.isValid())
        return 0;
    return m_timer.elapsed() / 1000.0;
}

QString SessionManager::engineLabel() const
{
    const QString eng = m_provider == QLatin1String("fal") ? QStringLiteral("Fal") : QStringLiteral("Lucy");
    return eng + QStringLiteral(" · ") + (m_hd ? QStringLiteral("HD") : QStringLiteral("Standard"));
}

void SessionManager::setActivePrompt(const QString &p)
{
    if (m_prompt == p) return;
    m_prompt = p;
    emit activePromptChanged();
}

void SessionManager::setScenePrompt(const QString &p)
{
    if (m_scenePrompt == p) return;
    m_scenePrompt = p;
    emit scenePromptChanged();
}

void SessionManager::setActiveScene(const QString &s)
{
    if (m_scene == s) return;
    m_scene = s;
    emit activeSceneChanged();
}

void SessionManager::setSceneEnabled(bool v)
{
    if (m_sceneEnabled == v) return;
    m_sceneEnabled = v;
    emit sceneEnabledChanged();
}

void SessionManager::setIdentityLockEnabled(bool v)
{
    if (m_identityLock == v) return;
    m_identityLock = v;
    emit identityLockChanged();
}

void SessionManager::setHdActive(bool v)
{
    if (m_hd == v) return;
    m_hd = v;
    updateRates();
    emit hdActiveChanged();
    emit engineLabelChanged();
}

void SessionManager::setStatus(Status s, const QString &text)
{
    m_status = s;
    if (!text.isEmpty()) m_statusText = text;
    emit connectionStatusChanged();
    emit statusTextChanged();
}

void SessionManager::updateRates()
{
    m_creditsPerSec = m_hd ? 3.0 : 2.0;
    emit ratesChanged();
}

void SessionManager::applyCooldown(int seconds)
{
    m_cooldownSec = seconds;
    emit cooldownChanged();
    if (seconds > 0) {
        setStatus(Status::Cooldown, tr("Cooldown %1s").arg(seconds));
        m_cooldownTimer.start();
    }
}

void SessionManager::startSession(const QString &provider, const QString &tier)
{
    if (m_active || m_cooldownSec > 0) return;
    const double totalCredits = m_auth
        ? (m_auth->creditBalance() + m_auth->bonusBalance())
        : 0.0;
    if (m_auth && totalCredits <= 0.0) {
        setStatus(Status::InsufficientCredits, tr("Out of credits"));
        emit error(tr("Insufficient credits"));
        return;
    }
    if (m_auth && m_auth->accessToken().isEmpty()) {
        emit error(tr("Sign in required"));
        return;
    }

    m_provider = provider;
    m_tier = tier;
    m_hd = (tier == QLatin1String("hd"));
    updateRates();
    m_frames = 0;
    m_active = true;
    m_timer.restart();
    m_tickTimer.start();
    setStatus(Status::Connecting, tr("Connecting to %1…").arg(engineLabel()));
    emit isActiveChanged();
    emit engineLabelChanged();
    emit sessionStarted();

    // Auth + credits gated above. JWT → Rust proxy WS → Decart (key stays on server).
    if (m_signaling && m_auth) {
        const QString model = m_config ? m_config->defaultModel() : QStringLiteral("lucy-2.1");
        m_signaling->connectToProxy(wsBaseUrl(), m_auth->accessToken(), model);
    } else {
        setStatus(Status::Error, tr("Signaling unavailable"));
        m_active = false;
        m_tickTimer.stop();
        emit isActiveChanged();
        emit error(tr("Realtime signaling client missing"));
    }

    // Apply identity-lock default from config on new sessions
    if (m_config && m_config->identityLockDefault() && !m_identityLock) {
        m_identityLock = true;
        emit identityLockChanged();
    }
}

void SessionManager::pushActiveTargetsToProvider()
{
    if (!m_active)
        return;
    if (m_signaling && m_signaling->isConnected()) {
        if (!m_characterImage.isEmpty())
            m_signaling->sendSetImage(m_characterImage, m_prompt, true);
        else if (!m_prompt.isEmpty())
            m_signaling->sendPrompt(m_prompt, true);
        else if (!m_characterId.isEmpty())
            m_signaling->sendPrompt(m_characterId, true);
        return;
    }

}


void SessionManager::stopSession()
{
    if (!m_active) return;
    m_active = false;
    m_tickTimer.stop();
    destroyNativePeer();
    if (m_signaling)
        m_signaling->disconnectFromProxy();
    setStatus(Status::Idle, tr("Ready"));
    emit isActiveChanged();
    emit sessionStopped();
    emit elapsedChanged();
    applyCooldown(3);
    // Server is source of truth for balances after morph billing
    if (m_auth)
        m_auth->refreshProfile();
}

void SessionManager::setActiveCharacter(const QString &id, const QString &name,
                                        const QString &image, const QString &prompt)
{
    m_characterId = id;
    m_characterName = name.isEmpty() ? id : name;
    m_characterImage = image;
    if (!prompt.isEmpty()) {
        m_prompt = prompt;
        emit activePromptChanged();
    }
    emit activeCharacterChanged();
    if (m_active) {
        setStatus(Status::Generating, tr("Applying %1…").arg(m_characterName));
        if (m_signaling && m_signaling->isConnected()) {
            if (!m_characterImage.isEmpty())
                m_signaling->sendSetImage(m_characterImage, m_prompt, true);
            else if (!m_prompt.isEmpty())
                m_signaling->sendPrompt(m_prompt, true);
        }
    }
}

void SessionManager::commitPrompt(const QString &prompt)
{
    setActivePrompt(prompt);
    if (m_active && m_signaling && m_signaling->isConnected()) {
        setStatus(Status::Generating, tr("Updating prompt…"));
        m_signaling->sendPrompt(prompt, true);
    }
}

void SessionManager::onLocalOfferReady(const QString &sdp)
{
    if (m_signaling && m_signaling->isConnected())
        m_signaling->sendOffer(sdp);
}

void SessionManager::onLocalIceCandidate(const QJsonObject &candidate)
{
    if (m_signaling && m_signaling->isConnected())
        m_signaling->sendIceCandidate(candidate);
}

void SessionManager::tickFrame()
{
    if (!m_active) return;
    ++m_frames;
    emit framesChanged();
    emit elapsedChanged();

    // When proxy is live, server bills generation_tick — only refresh UI balance.
    // Offline/debug (no signaling): optimistic local burn for UX only.
    if (m_signaling && m_signaling->isConnected()) {
        if (m_auth && (m_frames % 50 == 0)) // ~5s
            m_auth->refreshProfile();
        return;
    }

    if (m_auth && m_creditsPerSec > 0.0) {
        const double burn = m_creditsPerSec * 0.1; // tick is 100ms
        m_auth->deductCredits(burn);
        if ((m_auth->creditBalance() + m_auth->bonusBalance()) <= 0.0) {
            setStatus(Status::InsufficientCredits, tr("Out of credits"));
            stopSession();
            emit error(tr("Insufficient credits — session ended"));
        }
    }
}

void SessionManager::reportError(const QString &message)
{
    setStatus(Status::Error, message);
    emit error(message);
}
