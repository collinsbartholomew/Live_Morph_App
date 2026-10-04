#pragma once

#include <QObject>
#include <QVideoSink>
#include <QVideoFrame>
#include <QImage>
#include <QString>
#include <QJsonObject>
#include <QVariantMap>

#include <atomic>
#include <thread>
#include <memory>

#include <gst/gst.h>

struct GstRtcPeerImpl;

/**
 * GstRtcPeer — native WebRTC media client powered by GStreamer webrtcbin.
 *
 * Replaces the Qt WebEngine (Chromium) page that previously owned the WebRTC
 * session. Qt owns signaling (QWebSocket) and UI; this class owns the media
 * plane: ICE / DTLS / SRTP / RTP, plus codec encode (send) and decode
 * (receive).
 *
 * Threading: the GStreamer pipeline runs on a private worker thread with its
 * own GMainContext/GMainLoop (this Qt build has no GLib event-loop support).
 * Public methods are safe to call from any thread; Qt signals are emitted
 * from the worker (delivered to receivers via queued connections).
 *
 * Flow:
 *   setStunServer() / setTurnServer() / setDirection() / setQuality()
 *   start()                     -> collects ICE, negotiates, emits offerReady(sdp)
 *   [signaling sends sdp upstream, receives answer:]
 *   setRemoteAnswer(sdp)        -> applies answer
 *   addRemoteIce(mline, cand)   -> applies trickled remote candidates
 *   on_ice_candidate           -> emits localIceCandidate(mline, cand)
 *   pushFrame(QVideoFrame)     -> feeds camera frames (send direction)
 *   decoded remote frames      -> videoSink() -> QML VideoOutput
 *
 * Perf notes (zero-overhead design):
 *   - Send path is a single-slot mailbox (latest-wins): a new camera frame
 *     replaces any frame still waiting for the worker, so there is never an
 *     unbounded queue of stale frames and latency stays minimal under load.
 *   - For single-plane RGB-family pixel formats the mapped frame bytes are
 *     wrapped directly (zero pixel copies). Unsupported multi-plane formats
 *     fall back to a single RGB888 conversion performed on the GStreamer
 *     worker thread (off the UI thread).
 *   - The receive path deep-copies the decoded frame ONCE and hands the same
 *     QImage (implicitly shared) to both the QML sink and the consumer tee.
 *   - The reduce pipeline does all colorspace/scale on GStreamer's SIMD
 *     converters, not Qt.
 *
 *   Stats: a 2s worker-side stats loop polls webrtcbin get-stats (RTT etc.)
 *   and derivates decoded FPS / receive kbps from appsink counters. Emitted
 *   via statsUpdated(QVariantMap). A stall watchdog fires stallDetected when
 *   decoded frames stop advancing while the peer claims to be connected.
 *
 * Modes:
 *   SendRecv : camera out + remote in (LiveMorph camera morph, LE live morph)
 *   RecvOnly : remote in only
 *   SendOnly : camera out only
 */
class GstRtcPeer : public QObject
{
    Q_OBJECT
    Q_PROPERTY(QVideoSink *videoSink READ videoSink NOTIFY videoSinkChanged)
    Q_PROPERTY(QString connectionState READ connectionState NOTIFY connectionStateChanged)
    Q_PROPERTY(QString iceState READ iceState NOTIFY iceStateChanged)
    Q_PROPERTY(bool running READ isRunning NOTIFY runningChanged)

public:
    enum class Direction { SendRecv, RecvOnly, SendOnly };
    Q_ENUM(Direction)

    struct QualityPreset {
        int width = 1280;
        int height = 720;
        int fps = 30;
        int bitrateKbps = 2500;
    };

    explicit GstRtcPeer(QObject *parent = nullptr);
    ~GstRtcPeer() override;

    QVideoSink *videoSink() const;
    QString connectionState() const;
    QString iceState() const;
    bool isRunning() const;
    Direction direction() const;

    // -- configuration (set before start; live-reconfigurable afterwards) --
    void setStunServer(const QString &url);   // e.g. "stun://stun.l.google.com:19302"
    void setTurnServer(const QString &url);   // e.g. "turn://user:pass@host:3478"
    QString stunServer() const { return m_stun; }
    QString turnServer() const { return m_turn; }
    void setDirection(Direction direction);

    /**
     * Quality ladder shared by both frontends (maps their UI tier names to
     * encode geometry/rate). Returns the preset; unknown names default to a
     * balanced 720p30 ladder.
     *
     *   "high"        1280x720 @30, 2500 kbps   (LE High; Electron LE default)
     *   "balanced"     960x540 @30, 1500 kbps   (LE Balanced)
     *   "performance"  960x540 @24,  800 kbps   (LE Performance)
     *   "hd"          1280x720 @30, 2500 kbps   (LM HD tier)
     *   "standard"     960x540 @24, 1200 kbps   (LM Standard tier)
     *   "smooth"      1280x720 @30, 2000 kbps   (LM Smooth / decart tier)
     */
    static QualityPreset presetFor(const QString &name);

    /** Live-reconfigure the send ladder (resolution, fps cap, bitrate). */
    Q_INVOKABLE void setQuality(int width, int height, int fps, int bitrateKbps);
    /** Convenience: apply a named preset (see presetFor). */
    void setQualityPreset(const QString &name);

    // -- control (thread-safe) --
    Q_INVOKABLE void start();
    Q_INVOKABLE void stop();
    Q_INVOKABLE void setRemoteAnswer(const QString &sdp);
    Q_INVOKABLE void addRemoteIce(int sdpMLineIndex, const QString &candidate);
    Q_INVOKABLE void pushFrame(const QVideoFrame &frame);

signals:
    void offerReady(const QString &sdp);
    void localIceCandidate(int sdpMLineIndex, const QString &candidate);
    void connectionStateChanged();
    void iceStateChanged();
    void runningChanged();
    void videoSinkChanged();
    void errorOccurred(const QString &message);
    /// Emitted for each decoded remote frame (morph output).
    void frameReady(const QImage &image);
    /// Periodic transport stats: { rtt_ms, fps_in, kbps_in } (best-effort).
    void statsUpdated(const QVariantMap &stats);
    /// Fired when decoded frames stop advancing while connected (media stall).
    void stallDetected();

private:
    void runOnWorker(GSourceFunc fn, gpointer data, GDestroyNotify notify = nullptr);

    std::unique_ptr<GstRtcPeerImpl> m_impl;
    std::thread m_thread;
    QVideoSink *m_sink = nullptr;
    QString m_stun;
    QString m_turn;
    Direction m_direction = Direction::SendRecv;
    std::atomic<bool> m_stopping{false};
};
