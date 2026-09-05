#pragma once

#include <QObject>
#include <QTcpServer>
#include <QTcpSocket>
#include <QImage>
#include <QList>
#include <QByteArray>
#include <QString>
#include <QElapsedTimer>

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
    Q_PROPERTY(QString url READ url NOTIFY runningChanged)
    Q_PROPERTY(int clientCount READ clientCount NOTIFY clientCountChanged)
    Q_PROPERTY(QString mode READ mode NOTIFY modeChanged)
    Q_PROPERTY(bool virtualCameraActive READ virtualCameraActive NOTIFY modeChanged)

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
    void pausedChanged();
    void portChanged();
    void clientCountChanged();
    void modeChanged();
    void error(const QString &message);

private slots:
    void onNewConnection();

private:
    void broadcastJpeg(const QByteArray &jpeg);

    QElapsedTimer m_pushClock;
    qint64 m_minFrameIntervalMs = 33; // ~30 FPS cap for OBS

    QTcpServer m_server;
    QList<QTcpSocket *> m_clients;
    QByteArray m_boundary = "livemorphframe";
    int m_port = 4789;
    bool m_running = false;
    bool m_paused = false;
    QString m_mode = QStringLiteral("obs");
};
