#pragma once

#include <QObject>
#include <QTcpServer>
#include <QTcpSocket>
#include <QImage>
#include <QList>
#include <QByteArray>
#include <QString>
#include <QElapsedTimer>
#include <QMutex>
#include <QThread>

/**
 * Encodes frames to JPEG on a dedicated worker thread (encoding 1280x720 at
 * 30fps costs ~5-15ms — far too much for the GUI thread). StreamServer keeps
 * a latest-wins mailbox, so at most one encode is in flight and stale frames
 * are dropped when the encoder is busy.
 */
class StreamEncoder : public QObject
{
    Q_OBJECT
public slots:
    void encode(const QImage &frame);
signals:
    void encoded(const QByteArray &jpeg);
};

/**
 * Local MJPEG multipart server for OBS Browser Source / "virtual camera" style output.
 * Matches original Electron VirtualCamera stream-server behavior:
 * start / stop / pause (hold server, stop frames) / resume.
 */
class StreamServer : public QObject
{
    Q_OBJECT
    Q_PROPERTY(bool running READ running NOTIFY runningChanged)
    Q_PROPERTY(bool paused READ paused NOTIFY pausedChanged)
    Q_PROPERTY(int port READ port WRITE setPort NOTIFY portChanged)
    Q_PROPERTY(QString url READ url NOTIFY urlChanged)
    Q_PROPERTY(int clientCount READ clientCount NOTIFY clientCountChanged)
    Q_PROPERTY(QString mode READ mode NOTIFY modeChanged)
    Q_PROPERTY(bool virtualCameraActive READ virtualCameraActive NOTIFY modeChanged) // re-emits runningChanged via modeChanged alias in stop()

public:
    explicit StreamServer(QObject *parent = nullptr);
    ~StreamServer() override;

    bool running() const { return m_running; }
    bool paused() const { return m_paused; }
    int port() const { return m_port; }
    void setPort(int p);
    QString url() const;
    int clientCount() const { return m_clients.size(); }
    QString mode() const { return m_mode; }

public slots:
    void start();
    void stop();
    void toggle();
    void pause();
    void resume();
    void pushFrame(const QImage &frame);
    void startAsVirtualCamera();
    void stopVirtualCamera();
    bool virtualCameraActive() const { return m_running && m_mode == QLatin1String("virtual-camera"); }
    Q_INVOKABLE bool isVirtualCameraActive() const { return virtualCameraActive(); }

signals:
    void runningChanged();
    void urlChanged();
    void pausedChanged();
    void portChanged();
    void clientCountChanged();
    void modeChanged();
    void error(const QString &message);

private slots:
    void onNewConnection();
    void onEncoded(const QByteArray &jpeg);

private:
    void broadcastJpeg(const QByteArray &jpeg);
    void dispatchEncode(const QImage &img);
    QByteArray statusJson() const;
    QByteArray obsHtml() const;

    QElapsedTimer m_pushClock;
    qint64 m_minFrameIntervalMs = 33; // ~30 FPS cap for OBS

    QTcpServer m_server;
    QList<QTcpSocket *> m_clients;
    QByteArray m_boundary = "livemorphframe";
    QByteArray m_partPrefix; // precomputed multipart part header (length varies per frame)
    QString m_authToken;     // per-run random token required on /stream, /status, /obs
    int m_port = 4789;
    bool m_running = false;
    bool m_paused = false;
    int m_handshaking = 0; // pre-request sockets counted against the client cap
    QString m_mode = QStringLiteral("obs");

    // Off-thread JPEG encode: latest-wins mailbox, one encode in flight max.
    QThread m_encodeThread;
    StreamEncoder *m_encoder = nullptr;
    QMutex m_pendingMutex;
    QImage m_pending;
    quint64 m_pendingSeq = 0;
    quint64 m_lastDispatchedSeq = 0;
    bool m_encodeBusy = false;
};
