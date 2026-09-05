#include "StreamController.h"
#include "DecartSignalingClient.h"
#include "SessionManager.h"
#include "ApiClient.h"
#include "GstRtcPeer.h"

#include <QDateTime>
#include <QDir>
#include <QUrl>
#include <QImage>
#include <QStandardPaths>
#include <QCryptographicHash>
#include <QFile>
#include <QJsonDocument>
#include <QJsonObject>

StreamController::StreamController(SessionManager *session, ApiClient *api,
                                   DecartSignalingClient *decart, QObject *parent)
    : QObject(parent)
    , m_session(session)
    , m_api(api)
    , m_decart(decart)
{
    if (m_decart) {
        connect(m_decart, &DecartSignalingClient::connectionChanged, this, [this]() {
            emit stateChanged();
        });
        connect(m_decart, &DecartSignalingClient::generatingChanged, this, [this]() {
            emit stateChanged();
        });
        connect(m_decart, &DecartSignalingClient::generationStarted, this, [this]() {
            m_loaderText.clear();
            emit stateChanged();
            emit statusMessage(QStringLiteral("AI generation started"), QStringLiteral("ok"));
        });
        connect(m_decart, &DecartSignalingClient::generationEnded, this,
                [this](double, const QString &reason) {
            emit statusMessage(QStringLiteral("Generation ended: %1").arg(reason),
                               QStringLiteral("info"));
        });
        connect(m_decart, &DecartSignalingClient::signalingError, this,
                [this](const QString &e) {
            emit statusMessage(e, QStringLiteral("error"));
        });
    }
    m_presetNames = {
        QStringLiteral("Cozy coffee shop"), QStringLiteral("Neon cyberpunk city"),
        QStringLiteral("Minimal white studio"), QStringLiteral("Tropical beach sunset"),
        QStringLiteral("Dark cinematic office"), QStringLiteral("Anime soft lighting"),
        QStringLiteral("Luxury hotel lobby"), QStringLiteral("Forest rain window"),
    };

    m_burnTimer.setInterval(1000);
    connect(&m_burnTimer, &QTimer::timeout, this, &StreamController::onBurnTick);

    // CONNECT watchdog: if the engine never answers, bail out so the button re-enables
    m_connectWatchdog.setSingleShot(true);
    m_connectWatchdog.setInterval(20000);
    connect(&m_connectWatchdog, &QTimer::timeout, this, [this]() {
        if (m_connecting) {
            m_connecting = false;
            m_session->setConnected(false);
            emit stateChanged();
            emit statusMessage(QStringLiteral("Connection timed out — check your network and retry"),
                               QStringLiteral("error"));
        }
    });

    connect(m_session, &SessionManager::creditsExhausted, this, [this]() {
        disconnectEngine();
        emit statusMessage(QStringLiteral("Credits ran out — session stopped. Buy more to continue."), QStringLiteral("warn"));
    });

    connect(m_api, &ApiClient::sessionStarted, this, [this](const QVariantMap &s) {
        m_connectWatchdog.stop();
        m_connecting = false;
        m_live = true;
        m_paused = false;
        m_sessionId = s.value(QStringLiteral("session_id")).toString();
        if (m_sessionId.isEmpty())
            m_sessionId = QUuid::createUuid().toString(QUuid::WithoutBraces);
        m_engineKey = s.value(QStringLiteral("engine_key")).toString();
        // Prefer server-provided realtime_url for Decart proxy
        const QString rt = s.value(QStringLiteral("realtime_url")).toString();
        if (!rt.isEmpty()) {
            m_signalingUrl = rt;
            emit stateChanged();
        }
        m_session->setConnected(true);
        setQuality(m_quality);
        // (Re)connect signaling with authoritative URL; reference face is sent
        // AFTER the SDP answer arrives (Decart requires set_image after answer).
        startDecartSignaling();
        m_burnTimer.start();
        emit stateChanged();
        emit statusMessage(QStringLiteral("Connected to AI engine"), QStringLiteral("ok"));
    });

    connect(m_api, &ApiClient::sessionFailed, this, [this](const QString &e) {
        m_connectWatchdog.stop();
        m_connecting = false;
        m_live = false;
        m_session->setConnected(false);
        emit stateChanged();
        emit statusMessage(e.isEmpty() ? QStringLiteral("Failed to start session") : e,
                           QStringLiteral("error"));
    });

    connect(m_api, &ApiClient::sessionEnded, this, [this](const QVariantMap &) {
        m_burnTimer.stop();
        m_connecting = false;
        m_live = false;
        m_paused = false;
        m_session->setConnected(false);
        m_latencyText = QStringLiteral("—");
        m_connQuality = QStringLiteral("—");
        emit latencyChanged();
        emit stateChanged();
    });

    connect(m_api, &ApiClient::backgroundPresetsLoaded, this, [this](const QVariantList &list) {
        setBackgroundPresets(list);
    });

    connect(m_api, &ApiClient::backgroundSelected, this, [this](const QVariantMap &r) {
        const QString prompt = r.value(QStringLiteral("prompt")).toString();
        if (!prompt.isEmpty())
            setPrompt(prompt);
        emit statusMessage(QStringLiteral("Background updated"), QStringLiteral("ok"));
    });

    connect(m_api, &ApiClient::engineKeyLoaded, this, [this](const QVariantMap &k) {
        m_engineKey = k.value(QStringLiteral("engine_key")).toString();
        emit stateChanged();
    });
}

void StreamController::setBackgroundPresets(const QVariantList &list)
{
    m_bgPresets = list;
    if (!list.isEmpty()) {
        m_presetNames.clear();
        for (const QVariant &v : list) {
            const QVariantMap m = v.toMap();
            const QString n = m.value(QStringLiteral("name")).toString();
            if (!n.isEmpty())
                m_presetNames.append(n);
        }
    }
    emit presetsChanged();
}

void StreamController::setQuality(const QString &q)
{
    if (m_quality == q)
        return;
    m_quality = q;
    emit qualityChanged();
    if (m_live) {
        if (q == QLatin1String("high")) {
            m_latencyText = QStringLiteral("~180 ms");
            m_connQuality = QStringLiteral("HQ");
        } else if (q == QLatin1String("performance")) {
            m_latencyText = QStringLiteral("~60 ms");
            m_connQuality = QStringLiteral("FAST");
        } else {
            m_latencyText = QStringLiteral("~110 ms");
            m_connQuality = QStringLiteral("BAL");
        }
        emit latencyChanged();
    }
}

void StreamController::setPrompt(const QString &p)
{
    if (m_prompt == p)
        return;
    m_prompt = p;
    emit promptChanged();
    if (m_live && m_liveUpdate)
        applyPrompt();
}

void StreamController::setLiveUpdate(bool v)
{
    if (m_liveUpdate == v) return;
    m_liveUpdate = v;
    emit prefsChanged();
}

void StreamController::setEnhance(bool v)
{
    if (m_enhance == v) return;
    m_enhance = v;
    emit prefsChanged();
}

void StreamController::connectEngine()
{
    if (m_live || m_connecting)
        return;
    if (!m_session->streamingEnabled()) {
        emit statusMessage(QStringLiteral("Streaming is temporarily unavailable — try again later"), QStringLiteral("warn"));
        return;
    }
    if (m_session->creditsRemaining() <= 0) {
        emit statusMessage(QStringLiteral("No credits left — buy a pack to start streaming"), QStringLiteral("warn"));
        return;
    }
    if (m_refPath.isEmpty()) {
        emit statusMessage(QStringLiteral("Add a reference face photo before connecting"), QStringLiteral("warn"));
        return;
    }

    m_connecting = true;
    m_loaderText = QStringLiteral("CONNECTING TO ENGINE…");
    m_sessionId = QUuid::createUuid().toString(QUuid::WithoutBraces);
    emit stateChanged();
    m_connectWatchdog.start();

    QVariantMap body;
    body.insert(QStringLiteral("user_id"), m_session->userId());
    body.insert(QStringLiteral("access_key"), m_session->accessKey());
    body.insert(QStringLiteral("session_id"), m_sessionId);
    body.insert(QStringLiteral("consent_given"), m_session->consentGiven());
    body.insert(QStringLiteral("consent_timestamp"),
                QDateTime::currentDateTimeUtc().toString(Qt::ISODate));
    QString faceHash;
    if (!m_refPath.isEmpty()) {
        QFile f(m_refPath);
        if (f.open(QIODevice::ReadOnly)) {
            faceHash = QString::fromLatin1(
                QCryptographicHash::hash(f.readAll(), QCryptographicHash::Sha256).toHex());
        }
    }
    if (!faceHash.isEmpty())
        body.insert(QStringLiteral("face_upload_hash"), faceHash);
    else
        body.insert(QStringLiteral("face_upload_hash"), QVariant());
    body.insert(QStringLiteral("mode"), m_prompt.isEmpty() ? QStringLiteral("face")
                                                           : QStringLiteral("style"));
    if (!m_prompt.isEmpty())
        body.insert(QStringLiteral("prompt"), m_prompt);

    m_api->startStreamingSession(body);
    // Decart signaling starts after sessionStarted (uses server realtime_url when present)
}

void StreamController::disconnectEngine()
{
    m_connectWatchdog.stop();
    stopDecartSignaling();
    m_burnTimer.stop();
    if (m_live || m_connecting) {
        QVariantMap body;
        body.insert(QStringLiteral("session_id"), m_sessionId);
        body.insert(QStringLiteral("user_id"), m_session->userId());
        body.insert(QStringLiteral("access_key"), m_session->accessKey());
        m_api->endStreamingSession(body);
    }
    m_connecting = false;
    m_live = false;
    m_paused = false;
    if (m_recording) {
        if (m_recordTimer)
            m_recordTimer->stop();
        if (m_recordFallbackTimer)
            m_recordFallbackTimer->stop();
        m_recording = false;
        emit recordingChanged();
    }
    if (m_frozen) {
        m_frozen = false;
        emit frozenChanged();
    }
    m_session->setConnected(false);
    m_latencyText = QStringLiteral("—");
    m_connQuality = QStringLiteral("—");
    emit latencyChanged();
    emit stateChanged();
}

void StreamController::pauseEffect()
{
    if (!m_live) return;
    m_paused = true;
    m_burnTimer.stop();
    emit stateChanged();
    emit statusMessage(QStringLiteral("Effect paused"), QStringLiteral("info"));
}

void StreamController::resumeEffect()
{
    if (!m_live) return;
    m_paused = false;
    m_burnTimer.start();
    emit stateChanged();
    emit statusMessage(QStringLiteral("Effect resumed"), QStringLiteral("ok"));
}

void StreamController::toggleRecording()
{
    if (!m_live && !m_recording) {
        emit statusMessage(QStringLiteral("Connect before recording"), QStringLiteral("warn"));
        return;
    }
    if (!m_recording) {
        const QString base = QStandardPaths::writableLocation(QStandardPaths::MoviesLocation)
                             + QStringLiteral("/LiveEscape");
        QDir().mkpath(base);
        m_recordDir = base + QStringLiteral("/rec_")
                      + QDateTime::currentDateTime().toString(QStringLiteral("yyyyMMdd_hhmmss"));
        QDir().mkpath(m_recordDir);
        m_recordFrameIndex = 0;
        m_recordMp4Path.clear();
        m_preferMp4 = true;
        m_recording = true;
        emit recordingChanged();
        // Prefer QML MediaRecorder; if no MP4 path after 2s, fall back to PNG sequence
        if (!m_recordFallbackTimer) {
            m_recordFallbackTimer = new QTimer(this);
            m_recordFallbackTimer->setSingleShot(true);
            connect(m_recordFallbackTimer, &QTimer::timeout, this, [this]() {
                if (!m_recording || !m_recordMp4Path.isEmpty())
                    return;
                m_preferMp4 = false;
                if (!m_recordTimer) {
                    m_recordTimer = new QTimer(this);
                    m_recordTimer->setInterval(500);
                    connect(m_recordTimer, &QTimer::timeout, this, [this]() {
                        if (m_recording && m_recordMp4Path.isEmpty())
                            emit frameGrabRequested(QStringLiteral("record"));
                    });
                }
                m_recordTimer->start();
                emit statusMessage(QStringLiteral("Recording (PNG sequence fallback)"), QStringLiteral("info"));
            });
        }
        m_recordFallbackTimer->start(2000);
        emit statusMessage(QStringLiteral("Recording started"), QStringLiteral("ok"));
    } else {
        if (m_recordTimer)
            m_recordTimer->stop();
        if (m_recordFallbackTimer)
            m_recordFallbackTimer->stop();
        m_recording = false;
        emit recordingChanged();
        if (!m_recordMp4Path.isEmpty()) {
            emit statusMessage(QStringLiteral("Recording saved → %1").arg(m_recordMp4Path),
                               QStringLiteral("ok"));
            emit snapshotTaken(m_recordMp4Path);
        } else {
            QFile meta(m_recordDir + QStringLiteral("/recording.json"));
            if (meta.open(QIODevice::WriteOnly | QIODevice::Truncate)) {
                QJsonObject o;
                o.insert(QStringLiteral("frames"), m_recordFrameIndex);
                o.insert(QStringLiteral("session_id"), m_sessionId);
                o.insert(QStringLiteral("fps"), 2);
                o.insert(QStringLiteral("format"), QStringLiteral("png"));
                o.insert(QStringLiteral("note"),
                         QStringLiteral("PNG sequence — ffmpeg -framerate 2 -i frame_%06d.png -c:v libx264 -pix_fmt yuv420p out.mp4"));
                meta.write(QJsonDocument(o).toJson(QJsonDocument::Indented));
            }
            emit statusMessage(
                QStringLiteral("Recording saved (%1 frames) → %2")
                    .arg(m_recordFrameIndex)
                    .arg(m_recordDir),
                QStringLiteral("ok"));
            emit snapshotTaken(m_recordDir);
        }
    }
}

void StreamController::toggleFreeze()
{
    if (!m_live && !m_frozen) {
        emit statusMessage(QStringLiteral("Connect before freezing"), QStringLiteral("warn"));
        return;
    }
    if (!m_frozen) {
        emit frameGrabRequested(QStringLiteral("freeze"));
        emit statusMessage(QStringLiteral("Capturing freeze frame…"), QStringLiteral("info"));
    } else {
        m_frozen = false;
        emit frozenChanged();
        emit statusMessage(QStringLiteral("Live resumed"), QStringLiteral("ok"));
    }
}

void StreamController::enterTheatre() { m_theatre = true; emit theatreChanged(); }
void StreamController::exitTheatre() { m_theatre = false; emit theatreChanged(); }

void StreamController::applyPreset(const QString &name)
{
    setPrompt(name);
    applyPrompt();
}

void StreamController::selectBackgroundPreset(const QString &presetId, const QString &name)
{
    if (!name.isEmpty())
        setPrompt(name);
    m_api->selectBackground(presetId, m_prompt);
}

void StreamController::applyPrompt()
{
    const QString p = m_prompt.trimmed();
    if (p.isEmpty()) return;
    m_recent.removeAll(p);
    m_recent.prepend(p);
    while (m_recent.size() > 8)
        m_recent.removeLast();
    emit recentChanged();
    if (m_decart && m_decart->connected())
        m_decart->sendPrompt(p, m_enhance);
    if (m_live)
        emit statusMessage(QStringLiteral("Style updated"), QStringLiteral("ok"));
}

void StreamController::setReferenceFace(const QString &path)
{
    m_refPath = path;
    emit referenceChanged();
    emit statusMessage(QStringLiteral("Reference face loaded"), QStringLiteral("ok"));
}

void StreamController::clearReferenceFace()
{
    m_refPath.clear();
    emit referenceChanged();
}

void StreamController::takeSnapshot()
{
    if (!m_live && !m_frozen) {
        emit statusMessage(QStringLiteral("Connect to capture a snapshot"), QStringLiteral("warn"));
        return;
    }
    // Ask QML DecartViewport to grab the stage (real pixels)
    m_pendingSnapshot = true;
    emit frameGrabRequested(QStringLiteral("snapshot"));
    emit statusMessage(QStringLiteral("Capturing frame…"), QStringLiteral("info"));
}

void StreamController::onFrameGrabbed(const QString &path, const QString &purpose)
{
    if (path.isEmpty() || !QFile::exists(path)) {
        emit statusMessage(QStringLiteral("Frame capture failed"), QStringLiteral("error"));
        m_pendingSnapshot = false;
        return;
    }
    if (purpose == QLatin1String("snapshot") || m_pendingSnapshot) {
        m_pendingSnapshot = false;
        // Move/copy into Pictures/LiveEscape with stable name
        const QString dir = QStandardPaths::writableLocation(QStandardPaths::PicturesLocation)
                            + QStringLiteral("/LiveEscape");
        QDir().mkpath(dir);
        const QString dest = dir + QStringLiteral("/snap_")
                             + QDateTime::currentDateTime().toString(QStringLiteral("yyyyMMdd_hhmmss"))
                             + QStringLiteral(".png");
        QFile::remove(dest);
        if (QFile::copy(path, dest) || QFile::rename(path, dest)) {
            m_lastFramePath = dest;
            emit snapshotTaken(dest);
            emit statusMessage(QStringLiteral("Snapshot saved"), QStringLiteral("ok"));
        } else {
            m_lastFramePath = path;
            emit snapshotTaken(path);
            emit statusMessage(QStringLiteral("Snapshot saved"), QStringLiteral("ok"));
        }
    } else if (purpose == QLatin1String("freeze")) {
        m_lastFramePath = path;
        emit lastFramePathChanged();
        if (!m_frozen) {
            m_frozen = true;
            emit frozenChanged();
        }
        emit statusMessage(QStringLiteral("Frame frozen"), QStringLiteral("info"));
    } else if (purpose == QLatin1String("record") && m_recording) {
        // Append frame into recording folder as sequential PNG (fallback)
        const QString frame = m_recordDir + QStringLiteral("/frame_%1.png")
                                  .arg(m_recordFrameIndex, 6, 10, QChar('0'));
        QFile::remove(frame);
        QFile::copy(path, frame);
        ++m_recordFrameIndex;
    } else if (purpose == QLatin1String("mp4")) {
        m_recordMp4Path = path;
        m_preferMp4 = true;
        if (m_recordTimer)
            m_recordTimer->stop();
        if (m_recordFallbackTimer)
            m_recordFallbackTimer->stop();
        m_lastFramePath = path;
        emit lastFramePathChanged();
        emit statusMessage(QStringLiteral("MP4 recording active: %1").arg(path), QStringLiteral("ok"));
    }
}

void StreamController::sendReferenceFaceToDecart()
{
    if (!m_decart || m_refPath.isEmpty() || !m_decart->connected())
        return;
    QFile f(m_refPath);
    if (!f.open(QIODevice::ReadOnly))
        return;
    const QByteArray bytes = f.readAll();
    if (bytes.isEmpty())
        return;
    const QString b64 = QString::fromLatin1(bytes.toBase64());
    const QString prompt = m_prompt.trimmed().isEmpty()
                               ? QStringLiteral("face swap")
                               : m_prompt.trimmed();
    m_decart->sendReferenceImageBase64(b64, prompt, m_enhance);
    emit statusMessage(QStringLiteral("Reference face sent to engine"), QStringLiteral("ok"));
}

void StreamController::loadBackgroundPresets()
{
    m_api->fetchBackgroundPresets();
}




void StreamController::onBurnTick()
{
    if (!m_live || m_paused)
        return;
    // Optimistic local burn only; server is source of truth via WS balance_update
    // and the backend proxy charges via generation_tick. Do NOT also call the
    // burn API endpoint — that would double-deduct credits.
    m_session->burnCreditsLocal(1.0);
    if (m_session->creditsRemaining() <= 0.0) {
        emit statusMessage(QStringLiteral("Credits ran out — session stopped. Buy more to continue."), QStringLiteral("warn"));
        disconnectEngine();
    }
}

bool StreamController::decartConnected() const
{
    return m_decart && m_decart->connected();
}

bool StreamController::decartGenerating() const
{
    return m_decart && m_decart->generating();
}

QVideoSink *StreamController::peerVideoSink() const
{
    return m_peer ? m_peer->videoSink() : nullptr;
}

void StreamController::startNativePeer()
{
    if (m_peer)
        return;

    m_peer = new GstRtcPeer(this);
    m_peer->setDirection(GstRtcPeer::Direction::RecvOnly);

    // Hardcoded Google STUN (matches backend fallback).
    // Production: fetch from /api/v1/webrtc/ice-servers (returns STUN list when
    // ICE_SERVERS_JSON is empty; add TURN there for NAT traversal).
    m_peer->setStunServer(QStringLiteral("stun://stun.l.google.com:19302"));

    // TURN override from env (production)
    if (const QByteArray turnUrl = qgetenv("LIVEESCAPE_TURN_URLS"); !turnUrl.isEmpty())
        m_peer->setTurnServer(QString::fromUtf8(turnUrl));

    connect(m_peer, &GstRtcPeer::offerReady, this, [this](const QString &sdp) {
        if (m_decart && m_decart->connected())
            m_decart->sendOffer(sdp);
    });

    connect(m_peer, &GstRtcPeer::localIceCandidate, this,
            [this](int mline, const QString &cand) {
        if (m_decart && m_decart->connected()) {
            QVariantMap m;
            m[QStringLiteral("sdpMLineIndex")] = mline;
            m[QStringLiteral("candidate")] = cand;
            m_decart->sendIceCandidate(m);
        }
    });

    connect(m_peer, &GstRtcPeer::errorOccurred, this, [this](const QString &e) {
        emit statusMessage(QStringLiteral("WebRTC: %1").arg(e), QStringLiteral("error"));
    });

    connect(m_peer, &GstRtcPeer::connectionStateChanged, this, [this]() {
        emit stateChanged();
    });

    m_peer->start();
    emit peerVideoSinkChanged();
}

void StreamController::stopNativePeer()
{
    if (!m_peer)
        return;
    m_peer->stop();
    m_peer->deleteLater();
    m_peer = nullptr;
    emit peerVideoSinkChanged();
}

void StreamController::startDecartSignaling()
{
    if (!m_decart || !m_session)
        return;
    QString connectBase;
    // Prefer server realtime_url if already set (may include query)
    if (m_signalingUrl.startsWith(QLatin1String("ws"))) {
        QUrl u(m_signalingUrl);
        connectBase = u.toString(QUrl::RemoveQuery);
        if (connectBase.endsWith(QLatin1Char('/')))
            connectBase.chop(1);
    } else {
        QString base = m_api ? m_api->baseUrl() : QString();
        if (base.isEmpty())
            base = QStringLiteral("http://127.0.0.1:8881");
        QString ws = base;
        if (ws.startsWith(QLatin1String("https://")))
            ws.replace(0, 8, QStringLiteral("wss://"));
        else if (ws.startsWith(QLatin1String("http://")))
            ws.replace(0, 7, QStringLiteral("ws://"));
        while (ws.endsWith(QLatin1Char('/')))
            ws.chop(1);
        connectBase = ws + QStringLiteral("/v1/realtime");
        m_signalingUrl = connectBase;
    }
    const QString model = QStringLiteral("lucy-2.5");
    m_decart->connectToProxy(connectBase, m_session->sessionToken(), model);

    // Wire native peer ↔ signaling once signaling connects
    connect(m_decart, &DecartSignalingClient::connectionChanged, this, [this]() {
        if (m_decart->connected())
            startNativePeer();
    }, Qt::UniqueConnection);

    connect(m_decart, &DecartSignalingClient::answerReceived, this,
            [this](const QString &sdp) {
        if (m_peer)
            m_peer->setRemoteAnswer(sdp);
        // Send reference face AFTER the answer (Decart requires set_image after answer)
        sendReferenceFaceToDecart();
    }, Qt::UniqueConnection);

    connect(m_decart, &DecartSignalingClient::remoteIceCandidate, this,
            [this](const QVariantMap &cand) {
        if (m_peer && !cand.isEmpty()) {
            m_peer->addRemoteIce(
                cand.value(QStringLiteral("sdpMLineIndex")).toInt(),
                cand.value(QStringLiteral("candidate")).toString());
        }
    }, Qt::UniqueConnection);

    if (!m_prompt.trimmed().isEmpty()) {
        // prompt applied after answer in typical flow; send early is OK per Decart docs
        m_decart->sendPrompt(m_prompt.trimmed(), m_enhance);
    }
    emit stateChanged();
}

void StreamController::stopDecartSignaling()
{
    stopNativePeer();
    if (m_decart)
        m_decart->disconnectFromProxy();
    emit stateChanged();
}

// ── MJPEG / OBS feed stubs ─────────────────────────────────────────────
void StreamController::start(int port)
{
    m_feedUrl = QStringLiteral("http://127.0.0.1:%1/stream").arg(port);
    m_feedRunning = true;
    emit feedChanged();
}

void StreamController::stop()
{
    m_feedRunning = false;
    emit feedChanged();
}

void StreamController::setFeedMode(const QString &mode)
{
    if (m_feedMode == mode)
        return;
    m_feedMode = mode;
    emit feedChanged();
}

