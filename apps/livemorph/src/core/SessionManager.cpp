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
#include <QBuffer>
#include <QImage>
#include <QtGlobal>
#include <QDebug>
#include <QRegularExpression>
#include <QRandomGenerator>

namespace {
QString imageToBase64DataUrl(const QString &pathOrUrl)
{
    QString filePath = pathOrUrl;
    if (pathOrUrl.startsWith(QLatin1String("qrc:")))
        filePath = QStringLiteral(":") + pathOrUrl.mid(4);
    else if (pathOrUrl.startsWith(QLatin1String("file://")))
        filePath = QUrl(pathOrUrl).toLocalFile();

    // Hard byte cap on the source file, AND a cap on the encoded data URL:
    // the proxy rejects WS frames above MAX_BODY_BYTES (8 MiB default) and
    // base64 inflates ~33%, so an 8 MiB file would become an ~11 MiB frame.
    // Downscale until the encoded payload fits well under the frame cap.
    const QFileInfo fi(filePath);
    if (!fi.exists() || fi.size() > 8 * 1024 * 1024)
        return QString();

    QImage img;
    if (!img.load(filePath))
        return QString();

    constexpr int kMaxEncoded = 6 * 1024 * 1024; // chars of the data URL
    const bool wantPng = filePath.toLower().endsWith(QLatin1String(".png"));
    const int sides[] = {1024, 768, 576, 432, 324, 243, 182, 128};
    for (int side : sides) {
        QImage scaled = (img.width() > side || img.height() > side)
            ? img.scaled(side, side, Qt::KeepAspectRatio, Qt::SmoothTransformation)
            : img;
        // PNG only while it stays small — photos blow up as PNG.
        const bool png = wantPng && scaled.width() * scaled.height() <= 512 * 512;
        QByteArray buf;
        QBuffer buffer(&buf);
        buffer.open(QIODevice::WriteOnly);
        if (!scaled.save(&buffer, png ? "PNG" : "JPEG", png ? -1 : 80))
            return QString();
        const QByteArray b64 = buf.toBase64();
        const int prefixLen = png ? 22 : 23; // "data:image/png;base64," / "...jpeg..."
        if (prefixLen + b64.size() <= kMaxEncoded)
            return (png ? QStringLiteral("data:image/png;base64,")
                        : QStringLiteral("data:image/jpeg;base64,"))
                   + QString::fromLatin1(b64);
    }
    return QString();
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
                // Only clear a Cooldown status — never clobber an Error /
                // InsufficientCredits that landed while the countdown ran.
                if (m_status == Status::Cooldown)
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
                QString model = m_config ? m_config->defaultModel() : QStringLiteral("lucy-2.6");
                if (m_hd && (model.isEmpty() || model == QLatin1String("lucy-2.1")))
                    model = QStringLiteral("lucy-2.5");
                // Self-issued connect: the close of any previous socket must
                // not re-arm this timer mid-handshake.
                m_connectingProactively = true;
                m_reconnectTimer.stop();
                m_connectWatchdog.start(kConnectTimeoutMs); // re-arm on every reconnect attempt
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
    // Per-session cap: m_reconnectAttempts resets on every successful WS
    // connect, so it alone would let a persistently stalling engine loop
    // forever. m_sessionReconnects only resets in startSession().
    if (m_sessionReconnects >= kMaxReconnectAttempts) {
        m_wantReconnect = false;
        ++m_consecutiveSwapFailures;
        setStatus(Status::Error, tr("Reconnection failed"), ErrorKind::Connection);
        emit error(tr("Reconnection failed after %1 attempts").arg(kMaxReconnectAttempts));
        stopSession();
        return;
    }
    ++m_reconnectAttempts;
    ++m_sessionReconnects;
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
            m_reconnecting = false;
            emit reconnectingChanged();
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
            // The peer was recreated: the first-frame watchdog must start over,
            // otherwise a reconnected session that never decodes again looks
            // "active" (and bills) forever.
            m_frames = 0;
            m_timer.restart(); // watchdog window restarts with the new peer
            emit firstFrameChanged();
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

    connect(m_signaling, &WebRtcSignalingClient::iceRestartRequested, this, [this](const QJsonObject &turnCfg) {
        // Decart hands per-session TURN credentials via ice-restart (CGNAT
        // fallback). Apply them to the peer and restart ICE with a fresh offer.
        if (m_peer) {
            const QString server = turnCfg.value(QStringLiteral("server_url")).toString();
            const QString user = turnCfg.value(QStringLiteral("username")).toString();
            const QString cred = turnCfg.value(QStringLiteral("credential")).toString();
            if (!server.isEmpty()) {
                QString host = server.startsWith(QLatin1String("turn:"))
                    ? server.mid(5) : server;
                // The host goes into a gst_parse_launch URI verbatim — reject
                // anything that isn't a plain host[:port][?query] so a crafted
                // server_url can't inject pipeline elements (@, /, spaces...).
                static const QRegularExpression hostRe(
                    QStringLiteral("^[A-Za-z0-9.\\-\\[\\]:]+(\\?[!-~]*)?$"));
                if (!hostRe.match(host).hasMatch()) {
                    qWarning() << "SessionManager: rejecting malformed TURN server_url:" << server;
                } else {
                    QString url = QStringLiteral("turn://%1:%2@%3")
                        .arg(QString::fromUtf8(QUrl::toPercentEncoding(user)),
                             QString::fromUtf8(QUrl::toPercentEncoding(cred)), host);
                    m_peer->setTurnServer(url);
                    m_peer->restartIce();
                }
            }
        }
        emit remoteIceRestartRequested(turnCfg.toVariantMap());
    });

    // Transient auto-reconnect notice (not a real error) — drive the status line
    // from the dedicated signal instead of sniffing the error prose.
    connect(m_signaling, &WebRtcSignalingClient::reconnecting, this,
            [this](int delayMs) {
        if (m_active) {
            m_reconnecting = true;
            emit reconnectingChanged();
            setStatus(Status::Connecting,
                      tr("Signaling disconnected — reconnecting in %1s…").arg(delayMs / 1000));
        }
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
            setStatus(Status::InsufficientCredits, tr("Out of credits"), ErrorKind::Credits);
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
        // A 401 on the WS handshake means the access token expired mid-session
        // (15 min TTL). Refresh it, then let the normal reconnect ladder retry
        // with the fresh token instead of 401-looping forever.
        if (msg.contains(QStringLiteral("401"), Qt::CaseInsensitive)
            && m_auth && !m_auth->accessToken().isEmpty()) {
            qInfo() << "SessionManager: WS 401 — refreshing access token before retry";
            m_auth->refreshTokens();
        }
        // Connect-attempt failure (socket never opened) while a session is
        // active: the reconnect ladder owns this — keep the status at
        // Connecting and don't fire a toast / flip to Error between attempts.
        if (m_active && !m_signalingConnected) {
            m_connectingProactively = false;
            setStatus(Status::Connecting, msg);
            scheduleReconnect();
            return;
        }
        setStatus(Status::Error, msg, ErrorKind::Connection);
        emit error(msg);
    });

    connect(m_signaling, &WebRtcSignalingClient::queuePositionChanged, this,
            [this](int position, int queueSize) {
        m_queuePosition = position;
        m_queueSize = queueSize;
        emit queueChanged();
        if (m_active)
            setStatus(Status::Connecting,
                      tr("Queued: position %1 of %2").arg(position).arg(queueSize));
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
    // Aux sinks for popout/preview — registered so they receive the same
    // decoded frames as the main stage sink (a QVideoSink feeds one output).
    if (!m_popoutSink) {
        m_popoutSink = new QVideoSink(this);
        emit popoutVideoSinkChanged();
    }
    if (!m_previewSink) {
        m_previewSink = new QVideoSink(this);
        emit previewVideoSinkChanged();
    }
    m_peer->addAuxSink(m_popoutSink);
    m_peer->addAuxSink(m_previewSink);
    // Re-attach the window VideoOutput sinks as well: on reconnect the peer is
    // recreated, and bind*VideoOutput early-returns when the sink pointer is
    // unchanged, so without this the fresh peer would feed no stage/popout/
    // preview output (black video while billing).
    if (m_stageWindowSink) m_peer->addAuxSink(m_stageWindowSink);
    if (m_popoutWindowSink) m_peer->addAuxSink(m_popoutWindowSink);
    if (m_previewWindowSink) m_peer->addAuxSink(m_previewWindowSink);
    m_peer->setDirection(GstRtcPeer::Direction::SendRecv);

    // ICE servers come from the backend (GET /webrtc/ice-servers) so ops can
    // rotate TURN credentials server-side; fall back to public STUN + env TURN.
    // webrtcbin wants "stun://host:port" / "turn://user:pass@host" URI forms,
    // so normalize the RFC 7064 ICE urls ("stun:host:port", "turn:host?...").
    QString stun;
    QString turn;
    const QStringList ice = m_backend ? m_backend->iceServerUrls() : QStringList();
    for (const QString &u : ice) {
        if (u.startsWith(QLatin1String("stun:")))
            stun = QStringLiteral("stun://") + u.mid(5);
        else if (u.startsWith(QLatin1String("turn")))
            turn = u;
    }
    if (stun.isEmpty())
        stun = QStringLiteral("stun://stun.l.google.com:19302");
    m_peer->setStunServer(stun);
    // Build the turn://user:cred@host URI from the ICE url when the server
    // provides credentials (ICE: "turn:host:3478?transport=udp" →
    // webrtcbin: "turn://user:cred@host:3478?transport=udp").
    if (!turn.isEmpty() && m_backend && !m_backend->turnUser().isEmpty()) {
        QString rest = turn.startsWith(QLatin1String("turns:"))
            ? QStringLiteral("turns://") + turn.mid(6)
            : QStringLiteral("turn://") + turn.mid(5);
        const int schemeEnd = rest.indexOf(QLatin1String("://")) + 3;
        // Percent-encode the credentials: they go into a gst_parse_launch URI,
        // so a raw space/!/= would inject extra pipeline elements.
        rest.insert(schemeEnd,
                    QString::fromUtf8(QUrl::toPercentEncoding(m_backend->turnUser()))
                        + QLatin1Char(':')
                        + QString::fromUtf8(QUrl::toPercentEncoding(m_backend->turnCredential()))
                        + QLatin1Char('@'));
        turn = rest;
    }
    if (turn.isEmpty()) {
        QByteArray turnUrl = qgetenv("LIVEMORPH_TURN_URLS"); // canonical product name
        if (!turnUrl.isEmpty())
            turn = QString::fromUtf8(turnUrl);
    }
    if (!turn.isEmpty())
        m_peer->setTurnServer(turn);

    // Apply tier quality ladder: HD → 720p30 @ 2.5 Mbps; Standard → 540p24 @ 1.2 Mbps.
    // Electron morphme: Smooth (Decart) = 1280x720@30 camera-feed passthrough;
    // Standard = fal JPEG at 256px/24fps (budget realtime); our unified ladder favors
    // the same visual tier distinction.
    m_peer->setQualityPreset(m_hd ? QStringLiteral("hd") : QStringLiteral("standard"));

    connect(m_peer, &GstRtcPeer::offerReady, this, [this](const QString &sdp) {
        if (sender() != m_peer) return; // stale peer after reconnect
        if (m_signaling && m_signaling->isConnected())
            m_signaling->sendOffer(sdp);
    });

    connect(m_peer, &GstRtcPeer::localIceCandidate, this, [this](int mline, const QString &cand) {
        if (sender() != m_peer) return; // stale peer after reconnect
        if (m_signaling && m_signaling->isConnected()) {
            QJsonObject c;
            c.insert(QStringLiteral("candidate"), cand);
            c.insert(QStringLiteral("sdpMLineIndex"), mline);
            m_signaling->sendIceCandidate(c);
        }
    });

    connect(m_peer, &GstRtcPeer::errorOccurred, this, [this](const QString &e) {
        if (sender() != m_peer) return; // stale peer after reconnect
        emit error(QStringLiteral("WebRTC: %1").arg(e));
    });

    connect(m_peer, &GstRtcPeer::connectionStateChanged, this, [this]() {
        if (sender() != m_peer) return; // stale peer after reconnect
        if (m_peer) {
            const QString s = m_peer->connectionState();
            if (s == QLatin1String("connected"))
                setStatus(Status::Connected, tr("Media connected · %1").arg(engineLabel()));
            else if (s == QLatin1String("failed")) {
                ++m_consecutiveSwapFailures;
                setStatus(Status::Error, tr("WebRTC connection failed"), ErrorKind::Connection);
                // A failed ICE/DTLS state must not leave the session stuck
                // billing: route through the bounded reconnect ladder (which
                // recreates the peer) instead of waiting for the reaper.
                if (m_active && m_wantReconnect) {
                    m_connectingProactively = false;
                    scheduleReconnect();
                } else if (m_active) {
                    stopSession();
                    emit error(tr("WebRTC connection failed — session stopped"));
                }
            }
        }
    });

    connect(m_peer, &GstRtcPeer::iceStateChanged, this, [this]() {
        if (sender() != m_peer) return; // stale peer after reconnect
        if (m_peer && m_peer->iceState() == QLatin1String("checking"))
            setStatus(Status::Connecting, tr("ICE checking…"));
    });

    // Real RTT stats → connection status line + StatusBar latency chip
    // (Electron hides the latency component; we display it — improvement).
    connect(m_peer, &GstRtcPeer::statsUpdated, this, [this](const QVariantMap &s) {
        if (sender() != m_peer) return; // stale peer after reconnect
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
        if (sender() != m_peer) return; // stale peer after reconnect
        if (m_active) {
            setStatus(Status::Connecting, tr("Media stalled — reconnecting…"));
            m_wantReconnect = true;
            // Route through the exponential ladder — a bare start() with no
            // interval/count yielded an unbounded tight stall→reconnect loop
            // on a persistently stalling engine.
            scheduleReconnect();
        }
    });

    // Tee decoded morph frames out to OBS (MJPEG), vcam, popout/preview and recording.
    connect(m_peer, &GstRtcPeer::frameReady, this, [this](const QImage &img) {
        if (sender() != m_peer) return; // stale peer after reconnect
        // Count DECODED frames (Electron counts framesDecoded), not UI ticks —
        // a 100ms timer counted 10× the real fps. First frame also resets the
        // swap-failure ladder (Electron: success clears consecutiveSwapFailures).
        ++m_frames;
        if (m_frames == 1) {
            m_consecutiveSwapFailures = 0;
            m_connectWatchdog.stop();
            emit firstFrameChanged();
        }
        emit framesChanged();
        emit morphFrameReady(img);
    });

    m_peer->start();
    emit peerVideoSinkChanged();

    // Forward camera frames to the peer for SendRecv mode. Registering the
    // consumer turns ON the camera's per-frame emission; it turns back off in
    // destroyNativePeer so an idle camera never emits. The QVideoFrame is
    // passed zero-copy straight into the peer's worker mailbox.
    if (m_camera) {
        m_camera->addFrameConsumer();
        m_cameraFrameConsumer = true;
        connect(m_camera, &CameraManager::frameReady, m_peer, [this](const QVideoFrame &frame) {
            if (m_peer && m_active)
                m_peer->pushFrame(frame);
        });
    }
}

void SessionManager::destroyNativePeer()
{
    if (m_cameraFrameConsumer && m_camera) {
        m_camera->removeFrameConsumer();
        m_cameraFrameConsumer = false;
    }
    if (!m_peer)
        return;
    m_peer->removeAuxSink(m_popoutSink);
    m_peer->removeAuxSink(m_previewSink);
    if (m_stageWindowSink) m_peer->removeAuxSink(m_stageWindowSink);
    if (m_popoutWindowSink) m_peer->removeAuxSink(m_popoutWindowSink);
    if (m_previewWindowSink) m_peer->removeAuxSink(m_previewWindowSink);
    m_peer->stop();
    m_peer->deleteLater();
    m_peer = nullptr;
    emit peerVideoSinkChanged();
}

QVideoSink *SessionManager::peerVideoSink() const
{
    return m_peer ? m_peer->videoSink() : nullptr;
}

// Qt 6.12 reality: VideoOutput.videoSink is read-only and each VideoOutput
// owns its internal sink, so `sink.videoOutput = output` does not exist. The
// only working direction is to read the output's own sink and feed it. These
// helpers register that sink with the peer's frame fan-out.
static QVideoSink *sinkOfOutput(QObject *videoOutput)
{
    if (!videoOutput)
        return nullptr;
    return videoOutput->property("videoSink").value<QVideoSink *>();
}

void SessionManager::bindStageVideoOutput(QObject *videoOutput)
{
    QVideoSink *sink = sinkOfOutput(videoOutput);
    if (m_stageWindowSink == sink)
        return;
    if (m_peer && m_stageWindowSink)
        m_peer->removeAuxSink(m_stageWindowSink);
    m_stageWindowSink = sink;
    if (m_peer && m_stageWindowSink)
        m_peer->addAuxSink(m_stageWindowSink);
}

void SessionManager::bindPopoutVideoOutput(QObject *videoOutput)
{
    QVideoSink *sink = sinkOfOutput(videoOutput);
    if (m_popoutWindowSink == sink)
        return;
    if (m_peer && m_popoutWindowSink)
        m_peer->removeAuxSink(m_popoutWindowSink);
    m_popoutWindowSink = sink;
    if (m_peer && m_popoutWindowSink)
        m_peer->addAuxSink(m_popoutWindowSink);
}

void SessionManager::bindPreviewVideoOutput(QObject *videoOutput)
{
    QVideoSink *sink = sinkOfOutput(videoOutput);
    if (m_previewWindowSink == sink)
        return;
    if (m_peer && m_previewWindowSink)
        m_peer->removeAuxSink(m_previewWindowSink);
    m_previewWindowSink = sink;
    if (m_peer && m_previewWindowSink)
        m_peer->addAuxSink(m_previewWindowSink);
}

void SessionManager::unbindStageVideoOutput()
{
    if (m_peer && m_stageWindowSink)
        m_peer->removeAuxSink(m_stageWindowSink);
    m_stageWindowSink = nullptr;
}

void SessionManager::unbindPopoutVideoOutput()
{
    if (m_peer && m_popoutWindowSink)
        m_peer->removeAuxSink(m_popoutWindowSink);
    m_popoutWindowSink = nullptr;
}

void SessionManager::unbindPreviewVideoOutput()
{
    if (m_peer && m_previewWindowSink)
        m_peer->removeAuxSink(m_previewWindowSink);
    m_previewWindowSink = nullptr;
}

void SessionManager::setCameraManager(CameraManager *cam)
{
    m_camera = cam;
}

QString SessionManager::wsBaseUrl() const
{
    // Must hit /api/v1/realtime. Rebuild the URL from its parts so a base URL
    // with a path prefix (e.g. https://host/api) can't produce a doubled
    // /api/v1/api/v1/realtime path.
    QString base = m_backend ? m_backend->baseUrl() : QString();
    while (base.endsWith(QLatin1Char('/')))
        base.chop(1);
    QUrl url(base);
    if (url.scheme() == QLatin1String("https"))
        url.setScheme(QStringLiteral("wss"));
    else if (url.scheme() == QLatin1String("http"))
        url.setScheme(QStringLiteral("ws"));
    url.setPath(QStringLiteral("/api/v1/realtime"));
    return url.toString();
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

QString SessionManager::connectionQuality() const
{
    if (m_rttMs < 0)
        return QStringLiteral("unknown");
    return m_rttMs < 200 ? QStringLiteral("good")
         : m_rttMs < 500 ? QStringLiteral("fair")
         : QStringLiteral("poor");
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

void SessionManager::retranslateStatusText()
{
    // Only the Idle text is static; dynamic statuses (cooldown countdown,
    // reconnect attempts, …) re-emit through their own timers/events.
    if (m_status == Status::Idle)
        setStatus(Status::Idle, tr("Ready"));
}

void SessionManager::setStatus(Status s, const QString &text, ErrorKind kind)
{
    const QString newText = text.isEmpty() ? m_statusText : text;
    const ErrorKind newKind = (s == Status::Error || s == Status::InsufficientCredits) ? kind : ErrorKind::None;
    if (m_status == s && m_statusText == newText && m_errorKind == newKind)
        return; // no churn: skip the signal pair when nothing changed
    m_status = s;
    m_statusText = newText;
    m_errorKind = newKind;
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
        // Don't clobber an Error/InsufficientCredits status with Cooldown —
        // the error overlay must stay visible until the user acts on it.
        if (m_status != Status::Error && m_status != Status::InsufficientCredits)
            setStatus(Status::Cooldown, tr("Cooldown %1s").arg(seconds));
        m_cooldownTimer.start();
    }
}

void SessionManager::startSession(const QString &provider, const QString &tier)
{
    if (m_active)
        return;
    // Cooldown is not a silent no-op: tell the user why the CTA is inert.
    if (m_cooldownSec > 0) {
        emit error(tr("Cooldown — %1s remaining").arg(m_cooldownSec));
        return;
    }
    m_provider = provider;
    m_tier = tier;
    m_hd = (tier == QLatin1String("hd"));
    updateRates(); // needed BEFORE the gate: the minimum scales with the live rate

    // Electron start gate: at least rate×60 credits (120 @ 2/s) — one minute
    // of swap. The server's bootstrap minimum wins when it is HIGHER: a
    // client-side rate×60 guess passes but every connect lands in the
    // proxy's opaque pre-upgrade 402 otherwise.
    const double bootstrapMin = m_backend ? m_backend->minCreditsToStart() : 0.0;
    const double serverMin = bootstrapMin > 0.0
        ? bootstrapMin
        : m_creditsPerSec * 60.0;
    const double gateMin = qMax(serverMin, m_creditsPerSec * 60.0);
    const double totalCredits = m_auth
        ? (m_auth->creditBalance() + m_auth->bonusBalance())
        : 0.0;
    if (m_auth && totalCredits < gateMin) {
        setStatus(Status::InsufficientCredits, tr("Out of credits"), ErrorKind::Credits);
        emit error(tr("You need at least %1 credits (about 1 minute of swap) to start.")
                       .arg(qRound(gateMin)));
        return;
    }
    if (m_auth && m_auth->accessToken().isEmpty()) {
        emit error(tr("Sign in required"));
        return;
    }
    // Validate wiring BEFORE flipping m_active/sessionStarted — the else branch
    // below used to emit sessionStarted first, so AppController's auto-record
    // started a recording that nothing ever stopped.
    if (!m_signaling || !m_auth) {
        setStatus(Status::Error, tr("Signaling unavailable"), ErrorKind::Connection);
        emit error(tr("Realtime signaling client missing"));
        return;
    }

    m_frames = 0;
    emit firstFrameChanged(); // hasFrames back to false
    m_sessionReconnects = 0; // fresh session: reconnect budget resets here only
    m_active = true;
    m_lastElapsedNotifySec = -1;
    m_wantReconnect = true;
    m_reconnectAttempts = 0;
    m_connectingProactively = false;
    m_timer.restart();
    m_tickTimer.start();
    m_queuePosition = 0;
    m_queueSize = 0;
    emit queueChanged();
    setStatus(Status::Connecting, tr("Connecting to %1…").arg(engineLabel()));
    qInfo() << "SessionManager: startSession provider=" << provider << "tier=" << tier << "hd=" << m_hd;
    emit isActiveChanged();
    emit engineLabelChanged();
    emit sessionStarted();

    // Auth + credits gated above. JWT → Rust proxy WS → Decart (key stays on server).
    {
        // HD selects a higher-fidelity model; standard/smooth use the configured default.
        // (The Rust proxy validates the model against DECART_ALLOWED_MODELS.)
        QString model = m_config ? m_config->defaultModel() : QStringLiteral("lucy-2.6");
        if (m_hd && (model.isEmpty() || model == QLatin1String("lucy-2.1")))
            model = QStringLiteral("lucy-2.5");
        m_connectingProactively = true;
        m_reconnectTimer.stop();
        m_signaling->connectToProxy(wsBaseUrl(), m_auth->accessToken(), model, m_tier);
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
            if (!b64.isEmpty()) {
                m_signaling->sendSetImage(b64, prompt, m_enhance);
            } else if (!m_prompt.trimmed().isEmpty()) {
                // Image unreadable — the composed prompt still carries the
                // "character shown in the reference image" prefix, which
                // would reference an image the engine never received.
                // Send the RAW prompt instead and surface the failure.
                qWarning() << "SessionManager: reference image unreadable — sending raw prompt";
                m_signaling->sendPrompt(m_prompt.trimmed(), m_enhance);
                emit characterSwitchFailed();
            } else {
                qWarning() << "SessionManager: reference image unreadable and no prompt";
                emit characterSwitchFailed();
            }
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
    m_reconnecting = false;
    emit reconnectingChanged();
    m_reconnectAttempts = 0;
    m_reconnectTimer.stop();
    m_connectWatchdog.stop();
    m_tickTimer.stop();
    destroyNativePeer();
    if (m_signaling)
        m_signaling->disconnectFromProxy();
    if (m_status != Status::Error && m_status != Status::InsufficientCredits)
        setStatus(Status::Idle, tr("Ready"));
    emit isActiveChanged();
    emit sessionStopped();
    m_timer.invalidate(); // elapsedSec() kept counting after stop
    m_rttMs = -1;
    m_queuePosition = 0;
    m_queueSize = 0;
    emit queueChanged();
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
    // Always adopt the incoming prompt — otherwise switching to a character
    // with an empty prompt keeps the PREVIOUS character's prompt and the
    // composed prompt would mix both.
    const QString newPrompt = id.isEmpty() ? QString() : prompt;
    if (m_prompt != newPrompt) {
        m_prompt = newPrompt;
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
    // 10Hz tick, 1Hz notify: elapsedSec changes only when whole seconds
    // flip — re-evaluating QML string bindings at 10Hz was pure churn.
    const int secNow = static_cast<int>(elapsedSec());
    if (secNow != m_lastElapsedNotifySec) {
        m_lastElapsedNotifySec = secNow;
        emit elapsedChanged();
    }

    // Billing: the Rust proxy bills server-side via generation_tick — the
    // client NEVER burns locally (Electron burns via deduct-credits every
    // 10s; the old optimistic local burn drained the displayed balance during
    // connection failures until "Insufficient credits" misdiagnosed it).

    // First-frame watchdog (Electron Du = 35s): a live session that never
    // decodes a frame must not sit there billing "warmup" forever.
    if (m_signaling && m_signaling->isConnected() && m_frames == 0
        && m_timer.elapsed() > kFirstFrameTimeoutMs) {
        ++m_consecutiveSwapFailures;
        setStatus(Status::Error, tr("No video received — session ended"), ErrorKind::NoOutput);
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
