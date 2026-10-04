#include "SessionManager.h"
#include "AuthManager.h"
#include "ConfigManager.h"
#include "CameraManager.h"
#include "services/BackendClient.h"
#include "services/WebRtcSignalingClient.h"
#include "GstRtcPeer.h"

#include <QJsonObject>
#include <QUrl>
#include <QFile>
#include <QFileInfo>
#include <QtGlobal>
#include <QDebug>
#include <QRandomGenerator>

namespace {
QString imageToBase64DataUrl(const QString &pathOrUrl)
{
    QString filePath = pathOrUrl;
    if (pathOrUrl.startsWith(QLatin1String("qrc:")))
        filePath = QStringLiteral(":") + pathOrUrl.mid(4);
    else if (pathOrUrl.startsWith(QLatin1String("file://")))
        filePath = QUrl(pathOrUrl).toLocalFile();

    QFile f(filePath);
    if (!f.open(QIODevice::ReadOnly))
        return QString();
    const QByteArray raw = f.readAll();
    if (raw.isEmpty())
        return QString();

    const QString lower = filePath.toLower();
    QString mime = QStringLiteral("image/webp");
    if (lower.endsWith(QLatin1String(".png")))
        mime = QStringLiteral("image/png");
    else if (lower.endsWith(QLatin1String(".jpg")) || lower.endsWith(QLatin1String(".jpeg")))
        mime = QStringLiteral("image/jpeg");
    else if (lower.endsWith(QLatin1String(".webp")))
        mime = QStringLiteral("image/webp");

    return QStringLiteral("data:") + mime + QStringLiteral(";base64,")
           + QString::fromLatin1(raw.toBase64());
}
} // namespace

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

    // Auto-reconnect: Electron ladder — 5 attempts, 1000ms × 2^(n-1) + 0–30%
    // jitter, capped at 10s. Interval is computed per attempt in
    // scheduleReconnect(); the fixed 3s re-arm on ANY close fed back into
    // itself and killed in-flight handshakes on slow networks.
    m_reconnectTimer.setSingleShot(true);
    connect(&m_reconnectTimer, &QTimer::timeout, this, [this]() {
        if (m_wantReconnect && m_reconnectAttempts <= kMaxReconnectAttempts && m_active) {
            setStatus(Status::Connecting, tr("Reconnecting… attempt %1/%2").arg(m_reconnectAttempts).arg(kMaxReconnectAttempts));
            if (m_signaling && m_auth) {
                QString model = m_config ? m_config->defaultModel() : QStringLiteral("lucy-2.1");
                if (m_hd && (model.isEmpty() || model == QLatin1String("lucy-2.1")))
                    model = QStringLiteral("lucy-2.5");
                // Self-issued connect: the close of any previous socket must
                // not re-arm this timer mid-handshake.
                m_connectingProactively = true;
                m_reconnectTimer.stop();
                m_signaling->connectToProxy(wsBaseUrl(), m_auth->accessToken(), model, m_tier);
            }
        }
    });

    // First-connect timeout: a proxy that never completes the WS handshake
    // used to leave the session "active" forever, draining nothing but hope.
    m_connectWatchdog.setSingleShot(true);
    connect(&m_connectWatchdog, &QTimer::timeout, this, [this]() {
        if (m_active && !m_signalingConnected) {
            qWarning() << "SessionManager: connect timeout — scheduling reconnect";
            scheduleReconnect();
        }
    });

    wireSignaling();
}

// Electron parity: exponential backoff 1000×2^(n-1) + 0–30% jitter (cap 10s),
// 5 attempts max, then the session fails.
void SessionManager::scheduleReconnect()
{
    if (!m_active || !m_wantReconnect)
        return;
    if (m_reconnectAttempts >= kMaxReconnectAttempts) {
        m_wantReconnect = false;
        ++m_consecutiveSwapFailures;
        setStatus(Status::Error, tr("Reconnection failed"));
        emit error(tr("Reconnection failed after %1 attempts").arg(kMaxReconnectAttempts));
        stopSession();
        return;
    }
    ++m_reconnectAttempts;
    const int base = qMin(10000, 1000 << (m_reconnectAttempts - 1));
    const int jitter = QRandomGenerator::global()->bounded(qMax(1, int(base * 0.3)));
    qInfo() << "SessionManager: reconnect attempt" << m_reconnectAttempts << "in" << base + jitter << "ms";
    m_reconnectTimer.start(base + jitter);
}

void SessionManager::wireSignaling()
{
    if (!m_signaling)
        return;

    connect(m_signaling, &WebRtcSignalingClient::connectedChanged, this, [this]() {
        m_signalingConnected = m_signaling->isConnected();
        emit signalingConnectedChanged();
        if (m_signalingConnected && m_active) {
            qInfo() << "SessionManager: signaling connected, creating peer";
            setStatus(Status::Connected, tr("Signaling live · %1").arg(engineLabel()));
            // Reconnected successfully — reset state
            m_reconnectAttempts = 0;
            m_wantReconnect = true; // stay armed for future drops
            m_connectingProactively = false;
            m_reconnectTimer.stop();
            m_connectWatchdog.stop();
            // Recreate the peer: createNativePeer() early-returns when a peer
            // exists, and a surviving peer carries the DEAD negotiation
            // (offerCreated blocks renegotiation) → media dead while the UI
            // shows "connected". Tear down and build fresh for the new session.
            destroyNativePeer();
            createNativePeer();
            // Apply character / prompt to live session
            pushActiveTargetsToProvider();
        } else if (!m_signalingConnected && m_active && m_wantReconnect) {
            // Unexpected drop — unless WE closed the socket to reconnect
            // (the close of an in-flight handshake must not re-arm us).
            if (m_connectingProactively)
                return;
            qWarning() << "SessionManager: signaling disconnected unexpectedly";
            scheduleReconnect();
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

    // Electron stage.characterSwitchFailed: a rejected live character update
    // keeps the previous look running — warn, don't tear down.
    connect(m_signaling, &WebRtcSignalingClient::setImageAck, this,
            [this](bool ok, const QString &err) {
        if (!ok && m_active) {
            if (!err.isEmpty())
                qWarning() << "SessionManager: set_image rejected:" << err;
            emit characterSwitchFailed();
        }
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

    connect(m_signaling, &WebRtcSignalingClient::errorOccurred, this,
            [this](const QString &msg, const QString &code) {
        // Structured code match first (proxy sends "code"), prose fallback for
        // proxies that only stringify the error.
        const bool insufficient = code == QLatin1String("insufficient_credits")
            || code == QLatin1String("credits_exhausted")
            || code == QLatin1String("platform_budget")
            || msg.contains(QStringLiteral("insufficient_credits"), Qt::CaseInsensitive)
            || msg.contains(QStringLiteral("platform_budget"), Qt::CaseInsensitive);
        if (insufficient) {
            const bool budget = code == QLatin1String("platform_budget")
                || msg.contains(QStringLiteral("platform_budget"), Qt::CaseInsensitive);
            setStatus(Status::InsufficientCredits, tr("Out of credits"));
            stopSession();
            emit error(budget ? tr("Service capacity exhausted — try again later")
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
        // Connect-attempt failures never emit connectedChanged (the socket
        // was never open) — without this arm the session sat "active"
        // forever with the UI showing Connecting.
        if (m_active && !m_signalingConnected) {
            m_connectingProactively = false;
            scheduleReconnect();
        }
    });

    connect(m_signaling, &WebRtcSignalingClient::queuePositionChanged, this,
            [this](int position, int queueSize) {
        if (m_active)
            setStatus(Status::Connecting,
                      tr("Queued: position %1 of %2").arg(position).arg(qMax(position, queueSize)));
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

    // webrtcbin's stun-server property takes the "stun://host:port" URI form
    // (NOT the RFC 7064 "stun:host" ICE-URL form — that would fail to parse).
    m_peer->setStunServer(QStringLiteral("stun://stun.l.google.com:19302"));
    QByteArray turnUrl = qgetenv("LIVEMORPH_TURN_URLS"); // canonical product name
    if (turnUrl.isEmpty())
        turnUrl = qgetenv("LIVEESCAPE_TURN_URLS"); // legacy pre-rebrand name
    if (!turnUrl.isEmpty())
        m_peer->setTurnServer(QString::fromUtf8(turnUrl));

    // Apply tier quality ladder: HD → 720p30 @ 2.5 Mbps; Standard → 540p24 @ 1.2 Mbps.
    // Electron morphme: Smooth (Decart) = 1280x720@30 camera-feed passthrough;
    // Standard = fal JPEG at 256px/24fps (budget realtime); our unified ladder favors
    // the same visual tier distinction.
    m_peer->setQualityPreset(m_hd ? QStringLiteral("hd") : QStringLiteral("standard"));

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
            else if (s == QLatin1String("failed")) {
                ++m_consecutiveSwapFailures;
                setStatus(Status::Error, tr("WebRTC connection failed"));
            }
        }
    });

    connect(m_peer, &GstRtcPeer::iceStateChanged, this, [this]() {
        if (m_peer && m_peer->iceState() == QLatin1String("checking"))
            setStatus(Status::Connecting, tr("ICE checking…"));
    });

    // Real RTT stats → connection status line + StatusBar latency chip
    // (Electron hides the latency component; we display it — improvement).
    connect(m_peer, &GstRtcPeer::statsUpdated, this, [this](const QVariantMap &s) {
        const double rtt = s.value(QStringLiteral("rtt_ms")).toDouble();
        if (rtt >= 0 && m_active) {
            if (m_rttMs != rtt) {
                m_rttMs = rtt;
                emit statsChanged();
            }
            const QString q = rtt < 200 ? tr("good") : (rtt < 500 ? tr("fair") : tr("poor"));
            setStatus(m_active ? Status::Generating : m_status,
                      tr("%1 · %2ms").arg(engineLabel(), int(rtt)) + QStringLiteral(" · ") + q);
        }
    });

    // Stall watchdog → force reconnect (Electron fal HD: 3 identical frames → reset).
    connect(m_peer, &GstRtcPeer::stallDetected, this, [this]() {
        if (m_active) {
            setStatus(Status::Connecting, tr("Media stalled — reconnecting…"));
            m_wantReconnect = true;
            m_reconnectTimer.start();
        }
    });

    // Tee decoded morph frames out to OBS (MJPEG), vcam, popout/preview and recording.
    connect(m_peer, &GstRtcPeer::frameReady, this, [this](const QImage &img) {
        // Count DECODED frames (Electron counts framesDecoded), not UI ticks —
        // a 100ms timer counted 10× the real fps. First frame also resets the
        // swap-failure ladder (Electron: success clears consecutiveSwapFailures).
        ++m_frames;
        if (m_frames == 1) {
            m_consecutiveSwapFailures = 0;
            m_connectWatchdog.stop();
        }
        emit framesChanged();
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
    pushSceneToProvider();
}

void SessionManager::setActiveScene(const QString &s)
{
    if (m_scene == s) return;
    m_scene = s;
    emit activeSceneChanged();
    pushSceneToProvider();
}

void SessionManager::setSceneEnabled(bool v)
{
    if (m_sceneEnabled == v) return;
    m_sceneEnabled = v;
    emit sceneEnabledChanged();
    pushSceneToProvider();
}

// Electron prompt composition:
//  - reference image attached → "Turn the person into the character shown in
//    the reference image. <prompt>." prefix (bo Dashboard)
//  - identity lock on → ", while keeping the person's real face, identity,
//    and live background unchanged." suffix (wP index)
QString SessionManager::composedPrompt() const
{
    QString p = m_prompt.trimmed();
    if (!m_characterImage.isEmpty() && !p.isEmpty())
        p = QStringLiteral("Turn the person into the character shown in the reference image. %1.").arg(p);
    if (m_identityLock && !p.isEmpty())
        p += QStringLiteral(", while keeping the person's real face, identity, and live background unchanged.");
    return p;
}

// Scene mode composes the live prompt as "<prompt>, set in <scene>" (Electron
// OP composer — the "set in" prefix is skipped when the scene text already
// opens with its own location preposition).
void SessionManager::pushSceneToProvider()
{
    if (!m_active || !m_sceneEnabled || !m_signaling || !m_signaling->isConnected())
        return;
    QString prompt = composedPrompt();
    if (!m_scenePrompt.trimmed().isEmpty()) {
        QString scene = m_scenePrompt.trimmed();
        static const QStringList locationPrefixes = {
            QStringLiteral("in "), QStringLiteral("on "), QStringLiteral("at "),
            QStringLiteral("inside "), QStringLiteral("within "), QStringLiteral("under "),
            QStringLiteral("set in ")
        };
        bool hasPrefix = false;
        for (const QString &pre : locationPrefixes) {
            if (scene.startsWith(pre, Qt::CaseInsensitive)) { hasPrefix = true; break; }
        }
        if (!hasPrefix)
            scene.prepend(QStringLiteral("set in "));
        if (!prompt.isEmpty())
            prompt = prompt + QStringLiteral(", ") + scene;
        else
            prompt = scene;
    }
    if (prompt.trimmed().isEmpty())
        return;
    setStatus(Status::Generating, tr("Applying scene…"));
    m_signaling->sendPrompt(prompt.trimmed(), m_enhance);
}

void SessionManager::setIdentityLockEnabled(bool v)
{
    if (m_identityLock == v) return;
    m_identityLock = v;
    emit identityLockChanged();
}

void SessionManager::setEnhancePrompts(bool v)
{
    if (m_enhance == v) return;
    m_enhance = v;
    emit enhancePromptsChanged();
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
    const double base = m_backend ? m_backend->creditsPerSecond() : 2.0;
    const double mult = (m_hd && m_backend) ? m_backend->hdMultiplier() : 1.0;
    m_creditsPerSec = base * mult;
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
    m_provider = provider;
    m_tier = tier;
    m_hd = (tier == QLatin1String("hd"));
    updateRates(); // needed BEFORE the gate: the minimum scales with the live rate

    // Electron start gate: at least rate×60 credits (120 @ 2/s) — one minute
    // of swap. The old >0 gate let 1-credit sessions "start" then instantly
    // die on the server's own 402.
    const double totalCredits = m_auth
        ? (m_auth->creditBalance() + m_auth->bonusBalance())
        : 0.0;
    if (m_auth && totalCredits < m_creditsPerSec * 60.0) {
        setStatus(Status::InsufficientCredits, tr("Out of credits"));
        emit error(tr("You need at least %1 credits (about 1 minute of swap) to start.")
                       .arg(qRound(m_creditsPerSec * 60.0)));
        return;
    }
    if (m_auth && m_auth->accessToken().isEmpty()) {
        emit error(tr("Sign in required"));
        return;
    }

    m_frames = 0;
    m_active = true;
    m_wantReconnect = true;
    m_reconnectAttempts = 0;
    m_connectingProactively = false;
    m_timer.restart();
    m_tickTimer.start();
    setStatus(Status::Connecting, tr("Connecting to %1…").arg(engineLabel()));
    qInfo() << "SessionManager: startSession provider=" << provider << "tier=" << tier << "hd=" << m_hd;
    emit isActiveChanged();
    emit engineLabelChanged();
    emit sessionStarted();

    // Auth + credits gated above. JWT → Rust proxy WS → Decart (key stays on server).
    if (m_signaling && m_auth) {
        // HD selects a higher-fidelity model; standard/smooth use the configured default.
        // (The Rust proxy validates the model against DECART_ALLOWED_MODELS.)
        QString model = m_config ? m_config->defaultModel() : QStringLiteral("lucy-2.1");
        if (m_hd && (model.isEmpty() || model == QLatin1String("lucy-2.1")))
            model = QStringLiteral("lucy-2.5");
        m_connectingProactively = true;
        m_reconnectTimer.stop();
        m_signaling->connectToProxy(wsBaseUrl(), m_auth->accessToken(), model, m_tier);
    } else {
        setStatus(Status::Error, tr("Signaling unavailable"));
        m_active = false;
        m_tickTimer.stop();
        emit isActiveChanged();
        emit error(tr("Realtime signaling client missing"));
    }

    // Connect-timeout watchdog (15s): a proxy that never completes the
    // handshake gets a retry instead of an eternal "Connecting".
    m_connectWatchdog.start(kConnectTimeoutMs);

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
        const QString prompt = composedPrompt();
        if (!m_characterImage.isEmpty()) {
            const QString b64 = imageToBase64DataUrl(m_characterImage);
            if (!b64.isEmpty())
                m_signaling->sendSetImage(b64, prompt, m_enhance);
            else if (!prompt.isEmpty())
                m_signaling->sendPrompt(prompt, m_enhance);
        } else if (!prompt.isEmpty()) {
            m_signaling->sendPrompt(prompt, m_enhance);
        } else if (!m_characterId.isEmpty()) {
            m_signaling->sendPrompt(m_characterId, m_enhance);
        }
        return;
    }

}


void SessionManager::stopSession()
{
    if (!m_active) return;
    qInfo() << "SessionManager: stopSession elapsed=" << m_timer.elapsed() << "ms frames=" << m_frames;
    m_active = false;
    m_wantReconnect = false;
    m_connectingProactively = false;
    m_reconnectAttempts = 0;
    m_reconnectTimer.stop();
    m_connectWatchdog.stop();
    m_tickTimer.stop();
    destroyNativePeer();
    if (m_signaling)
        m_signaling->disconnectFromProxy();
    setStatus(Status::Idle, tr("Ready"));
    emit isActiveChanged();
    emit sessionStopped();
    m_timer.invalidate(); // elapsedSec() kept counting after stop
    m_rttMs = -1;
    emit statsChanged();
    emit elapsedChanged();
    // Base 3s cooldown (Qt extra) + Electron's swap-failure escalation ladder
    // (3rd failure: 15s, 4th: 60s, 5+: 300s).
    applyCooldown(qMax(3, swapFailureCooldown()));
    // Server is source of truth for balances after morph billing
    if (m_auth)
        m_auth->refreshProfile();
}

int SessionManager::swapFailureCooldown() const
{
    if (m_consecutiveSwapFailures <= 2) return 0;
    if (m_consecutiveSwapFailures == 3) return 15;
    if (m_consecutiveSwapFailures == 4) return 60;
    return 300;
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
            const QString prompt = composedPrompt();
            if (!m_characterImage.isEmpty()) {
                const QString b64 = imageToBase64DataUrl(m_characterImage);
                if (!b64.isEmpty())
                    m_signaling->sendSetImage(b64, prompt, m_enhance);
                else if (!prompt.isEmpty())
                    m_signaling->sendPrompt(prompt, m_enhance);
            } else if (!prompt.isEmpty()) {
                m_signaling->sendPrompt(prompt, m_enhance);
            }
        }
    }
}

void SessionManager::commitPrompt(const QString &prompt)
{
    setActivePrompt(prompt);
    if (m_active && m_signaling && m_signaling->isConnected()) {
        setStatus(Status::Generating, tr("Updating prompt…"));
        m_signaling->sendPrompt(composedPrompt(), m_enhance);
    }
}

void SessionManager::tickFrame()
{
    if (!m_active) return;
    emit elapsedChanged();

    // Billing: the Rust proxy bills server-side via generation_tick — the
    // client NEVER burns locally (Electron burns via deduct-credits every
    // 10s; the old optimistic local burn drained the displayed balance during
    // connection failures until "Insufficient credits" misdiagnosed it).

    // First-frame watchdog (Electron Du = 35s): a live session that never
    // decodes a frame must not sit there billing "warmup" forever.
    if (m_signaling && m_signaling->isConnected() && m_frames == 0
        && m_timer.elapsed() > kFirstFrameTimeoutMs) {
        ++m_consecutiveSwapFailures;
        setStatus(Status::Error, tr("No video received — session ended"));
        emit error(tr("No video received within %1s — ending session")
                       .arg(kFirstFrameTimeoutMs / 1000));
        stopSession();
        return;
    }

    // Keep-alive balance refresh (~60s): realtime balance_update pushes keep
    // the UI in sync between polls (Electron relies on the realtime profile
    // channel the same way).
    if (m_signaling && m_signaling->isConnected()) {
        if (m_auth && (++m_tickCount % 600 == 0))
            m_auth->refreshProfile();
    }
}

void SessionManager::reportError(const QString &message)
{
    setStatus(Status::Error, message);
    emit error(message);
}
