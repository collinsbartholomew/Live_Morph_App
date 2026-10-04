#include "StreamController.h"
#include "DecartSignalingClient.h"
#include "SessionManager.h"
#include "ApiClient.h"
#include "GstRtcPeer.h"
#include "StreamServer.h"

#include <QDateTime>
#include <QDir>
#include <QUrl>
#include <QImage>
#include <QStandardPaths>
#include <QCryptographicHash>
#include <QFile>
#include <QJsonDocument>
#include <QJsonObject>
#include <QVideoFrame>
#include <QVideoSink>
#include <QMetaType>
#include <QGuiApplication>

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
            // Auto-reconnect on unexpected disconnect. Note: we deliberately
            // clear m_live here so the timer's !m_live gate passes on retries,
            // and so the stage freeze + reconnect-overlay surfaces visually.
            // Intentional teardowns (pause) must NOT re-arm reconnect — the
            // server keeps billing until the media/WS is actually gone.
            if (!m_decart->connected() && m_live && !m_connecting
                && !m_intentionalDisconnect) {
                m_burnTimer.stop();
                // Hold the last AI frame on stage while we reconnect — the
                // raw camera must never become the visible layer mid-session.
                emit frameGrabRequested(QStringLiteral("freeze"));
                m_live = false;
                m_connecting = false;
                m_session->setConnected(false);
                m_wantReconnect = true;
                m_reconnectTimer.start();
                emit stateChanged();
            }
        });
        connect(m_decart, &DecartSignalingClient::generatingChanged, this, [this]() {
            emit stateChanged();
        });
        connect(m_decart, &DecartSignalingClient::generationStarted, this, [this]() {
            m_loaderText.clear();
            emit stateChanged();
            emit statusMessage(tr("AI generation started"), QStringLiteral("ok"));
        });
        connect(m_decart, &DecartSignalingClient::generationEnded, this,
                [this](double, const QString &reason) {
            if (!m_live || m_intentionalDisconnect) {
                emit statusMessage(tr("Generation ended: %1").arg(reason),
                                   QStringLiteral("info"));
                return;
            }
            // The backend proxy bills the final charge and marks the session
            // ended on generation_ended but keeps our WS open — no close frame
            // ever arrives, so without this trigger the stage would sit dead
            // with local burn silently stopped. Electron treats generation end
            // as "always reconnect" (500ms).
            m_burnTimer.stop();
            // Freeze the last AI frame so the raw camera never bleeds through
            // while the session is silently re-established (Electron saves a
            // hold frame for exactly this purpose). QML answers asynchronously
            // via onFrameGrabbed → m_frozen=true.
            emit frameGrabRequested(QStringLiteral("freeze"));
            m_live = false;
            m_connecting = false;
            m_session->setConnected(false);
            m_wantReconnect = true;
            m_reconnectTimer.setInterval(500); // fast first retry (Electron: 500ms)
            m_reconnectTimer.start();
            emit stateChanged();
            emit statusMessage(tr("Stream reset by engine — reconnecting"),
                               QStringLiteral("info"));
        });
        connect(m_decart, &DecartSignalingClient::signalingError, this,
                [this](const QString &e) {
            emit statusMessage(e, QStringLiteral("error"));
        });
    }
    // ── Auto-reconnect on unexpected disconnect ──
    m_reconnectTimer.setSingleShot(true);
    m_reconnectTimer.setInterval(3000);
    connect(&m_reconnectTimer, &QTimer::timeout, this, [this]() {
        // Only the FIRST retry after an engine-side reset is fast (500ms,
        // Electron parity); subsequent retries back off to the normal 3s.
        m_reconnectTimer.setInterval(3000);
        // Abort auto-reconnect if the user is out of credits — a fresh session
        // would just fail (reference: reconnect re-checks credits in dashboard.html).
        if (m_session && m_session->creditsRemaining() <= 0.0) {
            m_wantReconnect = false;
            emit statusMessage(tr("Credits depleted — reconnect cancelled. Buy more to continue."), QStringLiteral("warn"));
            return;
        }
        if (m_wantReconnect && m_reconnectAttempts < kMaxReconnectAttempts && !m_live && !m_connecting) {
            m_reconnectAttempts++;
            emit statusMessage(tr("Reconnecting… attempt %1/%2").arg(m_reconnectAttempts).arg(kMaxReconnectAttempts), QStringLiteral("info"));
            emit stateChanged(); // surface reconnecting=true overlays
            // Full re-entry, not bare WS reconnect: new session id, new SDP offer,
            // so the server creates a fresh session row (backend WS accepts
            // session-less reconnects only in its own creation path).
            connectEngine();
        } else if (m_reconnectAttempts >= kMaxReconnectAttempts) {
            m_wantReconnect = false;
            emit stateChanged();
            emit statusMessage(tr("Reconnection failed. Tap to retry."), QStringLiteral("error"));
        }
    });

    m_presetNames = {
        QStringLiteral("Cozy coffee shop"), QStringLiteral("Neon cyberpunk city"),
        QStringLiteral("Minimal white studio"), QStringLiteral("Tropical beach sunset"),
        QStringLiteral("Dark cinematic office"), QStringLiteral("Anime soft lighting"),
        QStringLiteral("Luxury hotel lobby"), QStringLiteral("Forest rain window"),
    };

    m_burnTimer.setInterval(1000);
    connect(&m_burnTimer, &QTimer::timeout, this, &StreamController::onBurnTick);
    // Pause the local burn loop while backgrounded: ticking it re-evaluates
    // every credit binding on the dashboard for an invisible window. The
    // server keeps its authoritative ledger; the WS balance_update re-syncs
    // the local estimate on resume.
    connect(qApp, &QGuiApplication::applicationStateChanged, this,
            [this](Qt::ApplicationState state) {
        if (state == Qt::ApplicationActive) {
            if (m_live && !m_paused && !m_burnTimer.isActive())
                m_burnTimer.start();
        } else if (m_burnTimer.isActive()) {
            m_burnTimer.stop();
        }
    });

    // Local-camera fork for the MJPEG/OBS feed (SRC CAM / AI+CAM).
    m_cameraSink = new QVideoSink(this);
    connect(m_cameraSink, &QVideoSink::videoFrameChanged, this, &StreamController::onCameraVideoFrame);

    // CONNECT watchdog: if the engine never answers, bail out so the button re-enables
    m_connectWatchdog.setSingleShot(true);
    m_connectWatchdog.setInterval(20000);
    connect(&m_connectWatchdog, &QTimer::timeout, this, [this]() {
        if (m_connecting) {
            m_connecting = false;
            m_session->setConnected(false);
            emit stateChanged();
            emit statusMessage(tr("Connection timed out — check your network and retry"),
                               QStringLiteral("error"));
        }
    });

    connect(m_session, &SessionManager::creditsExhausted, this, [this]() {
        disconnectEngine();
        emit statusMessage(tr("Credits ran out — session stopped. Buy more to continue."), QStringLiteral("warn"));
    });

    connect(m_api, &ApiClient::sessionStarted, this, [this](const QVariantMap &s) {
        m_connectWatchdog.stop();
        m_connecting = false;
        m_live = true;
        m_paused = false;
        // A fresh live session supersedes any reconnect-time hold frame —
        // without this the stale freeze image would cover the new live video.
        if (m_frozen) {
            m_frozen = false;
            emit frozenChanged();
        }
        m_sessionId = s.value(QStringLiteral("session_id")).toString();
        if (m_sessionId.isEmpty())
            m_sessionId = QUuid::createUuid().toString(QUuid::WithoutBraces);
        m_engineKey = s.value(QStringLiteral("engine_key")).toString();
        // Seed the local balance + burn rate from the authoritative session
        // response ({credits:{total,remaining}, credits_per_second}) so the
        // UI countdown starts from the server's exact numbers instead of the
        // possibly-stale cached balance.
        if (s.contains(QStringLiteral("credits")))
            m_session->applyCreditsMap(s);
        if (s.contains(QStringLiteral("credits_per_second"))) {
            const double rate = s.value(QStringLiteral("credits_per_second")).toDouble();
            if (rate > 0)
                m_session->setBurnRate(rate);
        }
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
        emit statusMessage(tr("Connected to AI engine"), QStringLiteral("ok"));
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

    // Background presets are forwarded by AppController (single source of
    // truth) — a duplicate connection here double-emitted presetsChanged and
    // re-evaluated the QML Repeater twice per fetch.

    connect(m_api, &ApiClient::backgroundSelected, this, [this](const QVariantMap &r) {
        const QString prompt = r.value(QStringLiteral("prompt")).toString();
        const QString label = m_pendingBackgroundLabel;
        if (!prompt.isEmpty()) {
            // Authoritative server prompt — replace any local value once.
            if (m_prompt != prompt) {
                m_prompt = prompt;
                emit promptChanged();
            }
            // Electron's background apply bypasses the live-update toggle —
            // clicking APPLY is an explicit action, not passive typing.
            if (m_live)
                applyPrompt();
        }
        m_pendingBackgroundLabel.clear();
        emit backgroundApplied(true, label);
        emit statusMessage(tr("Background updated"), QStringLiteral("ok"));
    });

    connect(m_api, &ApiClient::backgroundApplyFailed, this, [this](const QString &e) {
        m_pendingBackgroundLabel.clear();
        emit backgroundApplied(false, QString());
        emit statusMessage(e.isEmpty() ? tr("Stream could not update — try again.")
                                       : e, QStringLiteral("error"));
    });

    connect(m_api, &ApiClient::iceServersLoaded, this, [this](const QVariantList &list) {
        if (!list.isEmpty())
            m_iceServers = list;
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
    // Map the UI tier to an encode ladder and push it into the live pipeline.
    // Electron's dropdown was dead UI — ours is real now.
    if (m_peer) {
        if (q == QLatin1String("high"))
            m_peer->setQualityPreset(QStringLiteral("high"));
        else if (q == QLatin1String("performance"))
            m_peer->setQualityPreset(QStringLiteral("performance"));
        else
            m_peer->setQualityPreset(QStringLiteral("balanced"));
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

void StreamController::setMode(const QString &m)
{
    const QString v = (m.compare(QLatin1String("style"), Qt::CaseInsensitive) == 0)
                          ? QStringLiteral("style")
                          : QStringLiteral("face");
    if (m_mode == v)
        return;
    m_mode = v;
    emit modeChanged();
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
        emit statusMessage(tr("Streaming is temporarily unavailable — try again later"), QStringLiteral("warn"));
        return;
    }
    if (m_session->creditsRemaining() <= 0) {
        emit statusMessage(tr("No credits left — buy a pack to start streaming"), QStringLiteral("warn"));
        return;
    }
    // Reference: STYLE mode needs only a prompt; FACE SWAP needs a reference face.
    if (m_mode == QLatin1String("face") && m_refPath.isEmpty()) {
        emit statusMessage(tr("Add a reference face photo before connecting"), QStringLiteral("warn"));
        return;
    }
    if (m_mode == QLatin1String("style") && m_prompt.trimmed().isEmpty()) {
        emit statusMessage(tr("Type a prompt first — STYLE mode transforms what you describe"), QStringLiteral("warn"));
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
    body.insert(QStringLiteral("mode"), m_mode);
    if (!m_prompt.isEmpty())
        body.insert(QStringLiteral("prompt"), m_prompt);

    // Fetch authoritative STUN/TURN from the backend so the peer negotiates
    // with the same ICE servers as the reference web client. Cached after the
    // first fetch — auto-reconnect cycles (up to 5) re-fetched the same static
    // config every attempt.
    if (m_iceServers.isEmpty())
        m_api->fetchIceServers();
    m_api->startStreamingSession(body);
    // Decart signaling starts after sessionStarted (uses server realtime_url when present)
}

void StreamController::disconnectEngine()
{
    m_connectWatchdog.stop();
    m_reconnectTimer.stop();
    // IMPORTANT: clear live/connecting BEFORE calling stopDecartSignaling().
    // disconnectFromProxy() emits connectionChanged synchronously, and the
    // ctor reconnect handler would otherwise re-arm an unintended reconnect
    // after explicit STOP. Ordering matters.
    const bool hadSession = m_live || m_connecting;
    m_session->setConnected(false);
    m_connecting = false;
    m_live = false;
    m_wantReconnect = false;
    m_reconnectAttempts = 0;
    stopDecartSignaling();
    m_burnTimer.stop();
    if (hadSession) {
        QVariantMap body;
        body.insert(QStringLiteral("session_id"), m_sessionId);
        body.insert(QStringLiteral("user_id"), m_session->userId());
        body.insert(QStringLiteral("access_key"), m_session->accessKey());
        m_api->endStreamingSession(body);
    }
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
    m_latencyText = QStringLiteral("—");
    m_connQuality = QStringLiteral("—");
    emit latencyChanged();
    emit stateChanged();
}

void StreamController::pauseEffect()
{
    if (!m_live || m_paused) return;
    m_paused = true;
    m_burnTimer.stop();
    // Stop local burn bookkeeping — the server is authoritative and its
    // balance_update pushes will correct any residue on resume.
    m_session->setConnected(false);
    // ACTUALLY stop the engine: tear down the Decart WS + WebRTC pipeline so
    // the backend proxy ends the server session (mark_session_ended +
    // final generation_ended charge). Until the media is gone the server keeps
    // billing via generation_tick — Electron's doPauseEffect fully disconnects
    // the RT engine for exactly this reason. The suppression flag stops this
    // intentional close from re-arming the auto-reconnect path.
    m_intentionalDisconnect = true;
    stopDecartSignaling();
    m_intentionalDisconnect = false;
    m_reconnectTimer.stop();
    emit stateChanged();
    emit statusMessage(tr("Effect paused — billing paused"), QStringLiteral("ok"));
}

void StreamController::resumeEffect()
{
    if (!m_live || !m_paused) return;
    m_paused = false;
    emit stateChanged();
    // The pause closed the WS — the backend marked that session ended on WS
    // close, so resume is a full re-entry (new server session + fresh SDP
    // negotiation), identical to the auto-reconnect path.
    m_live = false;
    m_connecting = false;
    m_loaderText = QStringLiteral("RESUMING…");
    connectEngine();
}

void StreamController::toggleRecording()
{
    if (!m_live && !m_recording) {
        emit statusMessage(tr("Connect before recording"), QStringLiteral("warn"));
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
                emit statusMessage(tr("Recording (PNG sequence fallback)"), QStringLiteral("info"));
            });
        }
        m_recordFallbackTimer->start(2000);
        emit statusMessage(tr("Recording started"), QStringLiteral("ok"));
    } else {
        if (m_recordTimer)
            m_recordTimer->stop();
        if (m_recordFallbackTimer)
            m_recordFallbackTimer->stop();
        m_recording = false;
        emit recordingChanged();
        if (!m_recordMp4Path.isEmpty()) {
            emit statusMessage(tr("Recording saved → %1").arg(m_recordMp4Path),
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
        emit statusMessage(tr("Connect before freezing"), QStringLiteral("warn"));
        return;
    }
    if (!m_frozen) {
        emit frameGrabRequested(QStringLiteral("freeze"));
        emit statusMessage(tr("Capturing freeze frame…"), QStringLiteral("info"));
    } else {
        m_frozen = false;
        emit frozenChanged();
        emit statusMessage(tr("Live resumed"), QStringLiteral("ok"));
    }
}

void StreamController::enterTheatre() { m_theatre = true; emit theatreChanged(); }
void StreamController::exitTheatre()
{
    m_theatre = false;
    // Centralized OBS teardown: BOTH exit paths (top-bar toggle and the red
    // EXIT OBS MODE button) must stop the MJPEG server — otherwise it keeps
    // serving frames (and the camera fork keeps converting toImage() at
    // 30fps) after the user has left OBS mode.
    if (m_mjpeg && m_mjpeg->running())
        m_mjpeg->stop();
    emit theatreChanged();
}

void StreamController::applyPreset(const QString &name)
{
    setPrompt(name);
    applyPrompt();
}

void StreamController::selectBackgroundPreset(const QString &presetId, const QString &prompt)
{
    // Do NOT apply a local prompt guess: the server returns the canonical
    // prompt in backgroundSelected, and applying twice (local guess + server
    // echo) restarts generation twice. The panel shows an applying state and
    // resolves via backgroundApplied().
    m_pendingBackgroundLabel = prompt;
    m_api->selectBackground(presetId, prompt);
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
        emit statusMessage(tr("Style updated"), QStringLiteral("ok"));
}

void StreamController::setReferenceFace(const QString &path)
{
    m_refPath = path;
    emit referenceChanged();
    emit statusMessage(tr("Reference face loaded"), QStringLiteral("ok"));
}

void StreamController::clearReferenceFace()
{
    m_refPath.clear();
    emit referenceChanged();
}

void StreamController::takeSnapshot()
{
    if (!m_live && !m_frozen) {
        emit statusMessage(tr("Connect to capture a snapshot"), QStringLiteral("warn"));
        return;
    }
    // Ask QML DecartViewport to grab the stage (real pixels)
    m_pendingSnapshot = true;
    emit frameGrabRequested(QStringLiteral("snapshot"));
    emit statusMessage(tr("Capturing frame…"), QStringLiteral("info"));
}

void StreamController::onFrameGrabbed(const QString &path, const QString &purpose)
{
    if (path.isEmpty() || !QFile::exists(path)) {
        emit statusMessage(tr("Frame capture failed"), QStringLiteral("error"));
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
            emit statusMessage(tr("Snapshot saved"), QStringLiteral("ok"));
        } else {
            m_lastFramePath = path;
            emit snapshotTaken(path);
            emit statusMessage(tr("Snapshot saved"), QStringLiteral("ok"));
        }
    } else if (purpose == QLatin1String("freeze")) {
        m_lastFramePath = path;
        emit lastFramePathChanged();
        if (!m_frozen) {
            m_frozen = true;
            emit frozenChanged();
        }
        emit statusMessage(tr("Frame frozen"), QStringLiteral("info"));
    } else if (purpose == QLatin1String("record") && m_recording) {
        // Append frame into recording folder as sequential PNG (fallback)
        const QString frame = m_recordDir + QStringLiteral("/frame_%1.png")
                                  .arg(m_recordFrameIndex, 6, 10, QChar('0'));
        QFile::remove(frame);
        QFile::copy(path, frame);
        ++m_recordFrameIndex;
    } else if (purpose == QLatin1String("mp4")) {
        // Guard: if the recorder delivers the mp4 path AFTER stop, don't say
        // "active" (recording ended) and don't clobber the frozen-frame
        // preview with the .mp4 path (DecartViewport would try to show it).
        m_recordMp4Path = path;
        m_preferMp4 = true;
        if (m_recordTimer)
            m_recordTimer->stop();
        if (m_recordFallbackTimer)
            m_recordFallbackTimer->stop();
        if (m_recording)
            emit statusMessage(tr("MP4 recording active: %1").arg(path), QStringLiteral("ok"));
        else
            emit statusMessage(tr("MP4 saved: %1").arg(path), QStringLiteral("ok"));
    }
}

void StreamController::sendReferenceFaceToDecart()
{
    if (!m_decart || !m_decart->connected())
        return;
    // FACE SWAP: reference image + prompt.
    if (!m_refPath.isEmpty()) {
        QFile f(m_refPath);
        if (f.open(QIODevice::ReadOnly)) {
            const QByteArray bytes = f.readAll();
            if (!bytes.isEmpty()) {
                const QString b64 = QString::fromLatin1(bytes.toBase64());
                const QString prompt = m_prompt.trimmed().isEmpty()
                                           ? QStringLiteral("face swap")
                                           : m_prompt.trimmed();
                m_decart->sendReferenceImageBase64(b64, prompt, m_enhance);
                emit statusMessage(tr("Reference face sent to engine"), QStringLiteral("ok"));
                return;
            }
        }
    }
    // STYLE mode (no reference face): push the prompt directly.
    if (!m_prompt.trimmed().isEmpty()) {
        m_decart->sendPrompt(m_prompt.trimmed(), m_enhance);
        emit statusMessage(tr("Style sent to engine"), QStringLiteral("ok"));
    }
}

void StreamController::loadBackgroundPresets()
{
    m_api->fetchBackgroundPresets();
}




void StreamController::onBurnTick()
{
    if (!m_live || m_paused)
        return;
    // Only burn while the engine is actually transforming — an idle-but-
    // connected session (no generation) would over-burn the local display
    // while the server charges nothing (generation_tick is the only charge).
    if (!decartGenerating())
        return;
    // Optimistic local burn only; server is source of truth via WS balance_update
    // and the backend proxy charges via generation_tick. Do NOT also call the
    // burn API endpoint — that would double-deduct credits.
    m_session->burnCreditsLocal(1.0);
    if (m_session->creditsRemaining() <= 0.0) {
        emit statusMessage(tr("Credits ran out — session stopped. Buy more to continue."), QStringLiteral("warn"));
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
    // Camera video must go upstream to the morph engine — Decart transforms
    // OUR webcam frames (reference: dashboard.html `S.client.realtime.connect(
    // S.stream, …)`). RecvOnly here means the engine gets NO input and morph
    // output never starts. SendRecv matches the Electron contract.
    m_peer->setDirection(GstRtcPeer::Direction::SendRecv);
    // Target 1280x720 @ 30fps upstream to match the Electron camera opts
    // ({ width: ideal:1280, height: ideal:720, frameRate: {ideal:30, max:30} }).
    m_peer->setQualityPreset(QStringLiteral("high"));

    // Authoritative ICE config from the backend (fallback: Google STUN below).
    applyIceConfig();

    if (m_peer->stunServer().isEmpty())
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
        emit statusMessage(tr("WebRTC: %1").arg(e), QStringLiteral("error"));
    });

    connect(m_peer, &GstRtcPeer::connectionStateChanged, this, [this]() {
        emit stateChanged();
    });

    // Real latency / quality from webrtcbin stats (Electron: real buffer-depth
    // latency; thresholds teal <200ms / gold <500ms / red >=500ms).
    connect(m_peer, &GstRtcPeer::statsUpdated, this, [this](const QVariantMap &s) {
        const double rtt = s.value(QStringLiteral("rtt_ms")).toDouble();
        if (rtt >= 0) {
            m_latencyText = QStringLiteral("%1 ms").arg(int(rtt));
            m_connQuality = rtt < 200 ? QStringLiteral("GOOD")
                          : rtt < 500 ? QStringLiteral("FAIR")
                                      : QStringLiteral("POOR");
        } else {
            const double fps = s.value(QStringLiteral("fps_in")).toDouble();
            m_latencyText = fps > 0 ? QStringLiteral("≈ %1 ms").arg(int(1000.0 / fps))
                                    : QStringLiteral("—");
            m_connQuality = fps > 20 ? QStringLiteral("GOOD")
                          : fps > 0  ? QStringLiteral("FAIR")
                                     : QStringLiteral("—");
        }
        emit latencyChanged();
    });

    // Media stall → nudge the engine into a fresh session (Electron parity:
    // auto-reconnect on disconnection; already driven by the DecartSignalingClient
    // reconnect timer, so this is just a status hint).
    connect(m_peer, &GstRtcPeer::stallDetected, this, [this]() {
        emit statusMessage(tr("Stream paused — media stalled"), QStringLiteral("warn"));
    });

    // Feed the local OBS/theatre MJPEG server with decoded AI output frames.
    if (m_mjpeg) {
        connect(m_peer, &GstRtcPeer::frameReady, m_mjpeg, [this](const QImage &img) {
            pushAiFrame(img);
        });
    }

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

void StreamController::applyIceConfig()
{
    if (!m_peer || m_iceServers.isEmpty())
        return;

    QString stun;
    QString turn;
    for (const QVariant &v : m_iceServers) {
        const QVariantMap m = v.toMap();
        // "urls" may be a single string or an array of strings.
        QVariantList urls;
        const QVariant u = m.value(QStringLiteral("urls"));
        if (u.typeId() == QMetaType::QString)
            urls.append(u);
        else
            urls = u.toList();

        const QString user = m.value(QStringLiteral("username")).toString();
        const QString pass = m.value(QStringLiteral("credential")).toString();

        for (const QVariant &uv : urls) {
            QString url = uv.toString().trimmed();
            if (url.isEmpty())
                continue;
            // Convert WebRTC scheme (stun:/turn:) to GStreamer URI (stun:///turn://).
            if (url.startsWith(QLatin1String("stun:"))) {
                if (stun.isEmpty())
                    stun = QStringLiteral("stun://") + url.mid(5);
            } else if (url.startsWith(QLatin1String("turn:"))) {
                if (turn.isEmpty()) {
                    QString host = url.mid(5);
                    // Inject user:pass when the server provides them separately.
                    if (!user.isEmpty() && !host.contains(QLatin1Char('@')))
                        host = user + (pass.isEmpty() ? QString() : QLatin1Char(':') + pass)
                               + QLatin1Char('@') + host;
                    turn = QStringLiteral("turn://") + host;
                }
            }
        }
    }

    if (!stun.isEmpty())
        m_peer->setStunServer(stun);
    if (!turn.isEmpty())
        m_peer->setTurnServer(turn);
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
            base = QStringLiteral("http://127.0.0.1:3874");
        QString ws = base;
        if (ws.startsWith(QLatin1String("https://")))
            ws.replace(0, 8, QStringLiteral("wss://"));
        else if (ws.startsWith(QLatin1String("http://")))
            ws.replace(0, 7, QStringLiteral("ws://"));
        while (ws.endsWith(QLatin1Char('/')))
            ws.chop(1);
        connectBase = ws + QStringLiteral("/api/v1/realtime");
        m_signalingUrl = connectBase;
    }
    const QString model = QStringLiteral("lucy-2.5");
    m_decart->connectToProxy(connectBase, m_session->sessionToken(), model);

    // Wire native peer ↔ signaling once signaling connects.
    // CRITICAL: disconnect any previous connections first — reconnection cycles
    // call startDecartSignaling repeatedly, and without disconnecting the old
    // QMetaObject::Connection handles, each session would stack a new set.
    disconnect(m_sigConnChanged);
    disconnect(m_sigConnAnswer);
    disconnect(m_sigConnIce);
    m_sigConnChanged = connect(m_decart, &DecartSignalingClient::connectionChanged, this, [this]() {
        if (m_decart->connected()) {
            startNativePeer();
            // Reconnected successfully — reset state
            m_reconnectAttempts = 0;
            m_wantReconnect = false;
            m_reconnectTimer.stop();
        }
    });

    m_sigConnAnswer = connect(m_decart, &DecartSignalingClient::answerReceived, this,
            [this](const QString &sdp) {
        if (m_peer)
            m_peer->setRemoteAnswer(sdp);
        // Send reference face AFTER the answer (Decart requires set_image after answer)
        sendReferenceFaceToDecart();
    });

    m_sigConnIce = connect(m_decart, &DecartSignalingClient::remoteIceCandidate, this,
            [this](const QVariantMap &cand) {
        if (m_peer && !cand.isEmpty()) {
            m_peer->addRemoteIce(
                cand.value(QStringLiteral("sdpMLineIndex")).toInt(),
                cand.value(QStringLiteral("candidate")).toString());
        }
    });

    if (!m_prompt.trimmed().isEmpty()) {
        // prompt applied after answer in typical flow; send early is OK per Decart docs
        m_decart->sendPrompt(m_prompt.trimmed(), m_enhance);
    }
    emit stateChanged();
}

void StreamController::stopDecartSignaling()
{
    stopNativePeer();
    disconnect(m_sigConnChanged);
    disconnect(m_sigConnAnswer);
    disconnect(m_sigConnIce);
    if (m_decart)
        m_decart->disconnectFromProxy();
    emit stateChanged();
}

// ── MJPEG / OBS feed (shared StreamServer) ─────────────────────────────
void StreamController::start(int port)
{
    if (!m_mjpeg) {
        m_mjpeg = new StreamServer(this);
        // If the peer is already live, wire its decoded frames into the server.
        if (m_peer) {
            connect(m_peer, &GstRtcPeer::frameReady, m_mjpeg, [this](const QImage &img) {
                pushAiFrame(img);
            });
        }
    }
    m_mjpeg->setPort(port > 0 ? port : 4789);
    if (!m_mjpeg->running()) {
        m_mjpeg->start();
    }
    // Connect error/runningChanged ONCE (outside the !running gate) — repeated
    // failed starts re-entered the block and duplicated the handlers.
    if (!m_mjpegConnected) {
        connect(m_mjpeg, &StreamServer::error, this,
                [this](const QString &e) { emit statusMessage(e, QStringLiteral("error")); });
        connect(m_mjpeg, &StreamServer::runningChanged, this, [this]() {
            m_feedRunning = m_mjpeg->running();
            if (m_feedRunning)
                m_feedUrl = m_mjpeg->url();
            emit feedChanged();
        });
        m_mjpegConnected = true;
    }
    m_feedRunning = m_mjpeg->running();
    m_feedUrl = m_mjpeg->url();
    emit feedChanged();
}

void StreamController::stop()
{
    if (m_mjpeg)
        m_mjpeg->stop();
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

// Route decoded AI frames into the MJPEG feed when the OBS source wants them.
void StreamController::pushAiFrame(const QImage &img)
{
    if (!m_mjpeg || !m_mjpeg->running() || img.isNull())
        return;
    if (m_feedMode == QLatin1String("camera"))
        return; // camera-only source: skip AI frames
    if (m_mjpeg->clientCount() <= 0)
        return; // no viewer connected — skip encode work
    m_mjpeg->pushFrame(img);
}

// Local camera frames (forked from the QML Camera via cameraSink). Pushed when
// the OBS source is "camera" or "both".
void StreamController::onCameraVideoFrame(const QVideoFrame &frame)
{
    // Upstream feed: while live, push camera frames into the WebRTC send track
    // so the morph engine can transform them (Electron: rt.connect(S.stream)).
    if (m_peer && m_peer->isRunning() && (m_live || m_connecting))
        m_peer->pushFrame(frame);

    // Local mirror to OBS/MJPEG fork (camera or camera+AI source modes).
    if (!m_mjpeg || !m_mjpeg->running())
        return;
    if (m_feedMode != QLatin1String("camera") && m_feedMode != QLatin1String("both"))
        return;
    // Skip the (expensive) QVideoFrame→QImage conversion when nobody is
    // watching — the server discards frames with zero clients anyway, so
    // converting at 30fps for no viewer was pure CPU waste.
    if (m_mjpeg->clientCount() <= 0)
        return;
    const QImage img = frame.toImage();
    if (img.isNull())
        return;
    m_mjpeg->pushFrame(img);
}

void StreamController::bindCameraSink(QVideoSink *sink)
{
    if (!sink || sink == m_cameraSink)
        return;
    // Screen transitions destroy/recreate the QML viewport (Loader swap) —
    // without disconnecting the previous sink's frame signal and watching for
    // its destruction, stale QMetaObject::Connections accumulate and
    // m_cameraSink can point at a destroyed QML object.
    if (m_cameraSink) {
        disconnect(m_cameraSink, &QVideoSink::videoFrameChanged,
                   this, &StreamController::onCameraVideoFrame);
    }
    m_cameraSink = sink;
    connect(sink, &QVideoSink::videoFrameChanged, this, &StreamController::onCameraVideoFrame);
    connect(sink, &QObject::destroyed, this, [this, sink](QObject *) {
        if (m_cameraSink == sink)
            m_cameraSink = nullptr;
        emit cameraSinkChanged();
    });
    emit cameraSinkChanged();
}

// ── Virtual Camera ──────────────────────────────────────────────────────────
void StreamController::startVirtualCamera()
{
    if (m_virtualCameraEnabled)
        return;
    m_virtualCameraEnabled = true;
    m_virtualCameraStatus = QStringLiteral("starting…");
    emit virtualCameraChanged();

    // The virtual camera is implemented as an MJPEG server on port 4789
    // that serves the AI output frames. Start the MJPEG server if not running.
    if (!m_mjpeg) {
        m_mjpeg = new StreamServer(this);
        if (m_peer) {
            connect(m_peer, &GstRtcPeer::frameReady, m_mjpeg, [this](const QImage &img) {
                pushAiFrame(img);
            });
        }
    }
    m_mjpeg->setPort(4789);
    if (!m_mjpeg->running()) {
        m_mjpeg->start();
    }
    m_feedRunning = m_mjpeg->running();
    m_feedUrl = m_mjpeg->url();
    m_virtualCameraStatus = QStringLiteral("active");
    emit virtualCameraChanged();
    emit feedChanged();
    emit statusMessage(tr("Virtual camera started at %1").arg(m_feedUrl), QStringLiteral("ok"));
}

void StreamController::stopVirtualCamera()
{
    if (!m_virtualCameraEnabled)
        return;
    if (m_mjpeg && m_mjpeg->running()) {
        m_mjpeg->stop();
    }
    m_virtualCameraEnabled = false;
    m_virtualCameraStatus = QStringLiteral("stopped");
    m_feedRunning = false;
    emit virtualCameraChanged();
    emit feedChanged();
    emit statusMessage(tr("Virtual camera stopped"), QStringLiteral("info"));
}

