#pragma once

#include <QObject>
#include <QVideoSink>
#include <QVideoFrame>
#include <QImage>
#include <QString>
#include <QJsonObject>

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
 *   setStunServer() / setTurnServer() / setDirection()
 *   start()                     -> collects ICE, negotiates, emits offerReady(sdp)
 *   [signaling sends sdp upstream, receives answer:]
 *   setRemoteAnswer(sdp)        -> applies answer
 *   addRemoteIce(mline, cand)   -> applies trickled remote candidates
 *   on_ice_candidate           -> emits localIceCandidate(mline, cand)
 *   pushFrame(QVideoFrame)     -> feeds camera frames (send direction)
 *   decoded remote frames      -> videoSink() -> QML VideoOutput
 *
 * Modes:
 *   SendRecv : camera out + remote in (LiveMorph camera morph)
 *   RecvOnly : remote in only (LiveEscape image-driven morph)
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

    explicit GstRtcPeer(QObject *parent = nullptr);
    ~GstRtcPeer() override;

    QVideoSink *videoSink() const;
    QString connectionState() const;
    QString iceState() const;
    bool isRunning() const;
    Direction direction() const;

    // -- configuration (call before start) --
    void setStunServer(const QString &url);   // e.g. "stun://stun.l.google.com:19302"
    void setTurnServer(const QString &url);   // e.g. "turn://user:pass@host:3478"
    void setDirection(Direction direction);

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
    /// Emitted on the worker thread for each decoded remote frame (morph output).
    void frameReady(const QImage &image);

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