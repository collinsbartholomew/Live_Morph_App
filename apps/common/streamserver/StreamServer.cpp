#include "StreamServer.h"

#include <QBuffer>
#include <QHostAddress>
#include <QImageWriter>
#include <QTcpSocket>
#include <QTimer>

StreamServer::StreamServer(QObject *parent)
    : QObject(parent)
{
    connect(&m_server, &QTcpServer::newConnection, this, &StreamServer::onNewConnection);
}

StreamServer::~StreamServer()
{
    stop();
}

QString StreamServer::url() const
{
    return m_running ? QStringLiteral("http://127.0.0.1:%1/stream").arg(m_port) : QString();
}

void StreamServer::setPort(int p)
{
    if (m_port == p)
        return;
    const bool was = m_running;
    if (was)
        stop();
    m_port = p;
    emit portChanged();
    if (was)
        start();
}

void StreamServer::start()
{
    if (m_running)
        return;
    // Try preferred port then a few alternates (edge case: port already in use)
    bool bound = false;
    const int preferred = m_port;
    for (int i = 0; i < 8; ++i) {
        const int tryPort = preferred + i;
        if (m_server.listen(QHostAddress::LocalHost, quint16(tryPort))) {
            if (tryPort != m_port) {
                m_port = tryPort;
                emit portChanged();
                emit error(tr("Port %1 busy — streaming on %2").arg(preferred).arg(tryPort));
            }
            bound = true;
            break;
        }
        m_server.close();
    }
    if (!bound) {
        emit error(tr("Stream server failed to bind near port %1: %2")
                       .arg(preferred)
                       .arg(m_server.errorString()));
        return;
    }
    m_running = true;
    m_paused = false;
    if (m_mode.isEmpty())
        m_mode = QStringLiteral("obs");
    emit runningChanged();
    emit pausedChanged();
    emit modeChanged();
}

void StreamServer::stop()
{
    for (QTcpSocket *s : m_clients) {
        s->disconnectFromHost();
        s->deleteLater();
    }
    m_clients.clear();
    m_server.close();
    const bool was = m_running;
    m_running = false;
    m_paused = false;
    if (was) {
        emit runningChanged();
        emit pausedChanged();
        emit clientCountChanged();
    }
}

void StreamServer::toggle()
{
    m_running ? stop() : start();
}

void StreamServer::pause()
{
    if (!m_running || m_paused)
        return;
    m_paused = true;
    emit pausedChanged();
}

void StreamServer::resume()
{
    if (!m_running || !m_paused)
        return;
    m_paused = false;
    emit pausedChanged();
}

void StreamServer::startAsVirtualCamera()
{
    m_mode = QStringLiteral("virtual-camera");
    emit modeChanged();
    if (!m_running)
        start();
    else if (m_paused)
        resume();
}

void StreamServer::stopVirtualCamera()
{
    if (m_mode == QLatin1String("virtual-camera")) {
        stop();
        m_mode = QStringLiteral("obs");
        emit modeChanged();
    }
}

void StreamServer::onNewConnection()
{
    while (QTcpSocket *sock = m_server.nextPendingConnection()) {
        // Parent to the server: pending sockets are cleaned by stop()/teardown
        // instead of lingering as orphans when a client connects and idles
        // (browser pre-connect, port scanner).
        sock->setParent(this);
        // Cap covers BOTH post-request stream clients and pre-request sockets
        if (m_clients.size() + m_handshaking >= 8) {
            sock->disconnectFromHost();
            sock->deleteLater();
            continue;
        }
        ++m_handshaking;
        // Request-line timeout: a half-open request must not hold a slot 5s+
        QTimer::singleShot(5000, this, [this, sock]() {
            if (!m_clients.contains(sock) && sock->state() != QAbstractSocket::UnconnectedState) {
                --m_handshaking;
                sock->disconnectFromHost();
                sock->deleteLater();
            }
        });
        // Read the HTTP request line so we can route /stream vs /obs vs /status
        // (reference main.js serves the same three paths for OBS workflows).
        connect(sock, &QTcpSocket::readyRead, this, [this, sock]() {
            if (!sock->canReadLine())
                return;
            const QByteArray line = sock->readLine();
            QByteArray path = QByteArrayLiteral("/stream");
            if (line.startsWith("GET ")) {
                const QList<QByteArray> parts = line.split(' ');
                if (parts.size() >= 2) {
                    QByteArray p = parts.at(1);
                    const int q = p.indexOf('?');
                    if (q >= 0)
                        p = p.left(q);
                    path = p;
                }
            }
            if (path == QByteArrayLiteral("/status")) {
                --m_handshaking;
                sock->write("HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n"
                            "Connection: close\r\nCache-Control: no-cache\r\n\r\n" +
                            statusJson());
                sock->disconnectFromHost();
                sock->deleteLater();
                return;
            }
            if (path == QByteArrayLiteral("/obs") || path == QByteArrayLiteral("/obs/")) {
                --m_handshaking;
                sock->write("HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8\r\n"
                            "Connection: close\r\nCache-Control: no-cache\r\n\r\n" +
                            obsHtml());
                sock->disconnectFromHost();
                sock->deleteLater();
                return;
            }
            // Default: /stream multipart (also tolerate empty path from raw sockets)
            --m_handshaking;
            const QByteArray hdr =
                "HTTP/1.0 200 OK\r\n"
                "Connection: close\r\n"
                "Cache-Control: no-cache, no-store\r\n"
                "Content-Type: multipart/x-mixed-replace; boundary=" + m_boundary + "\r\n\r\n";
            sock->write(hdr);
            m_clients.append(sock);
            disconnect(sock, &QTcpSocket::readyRead, this, nullptr);
            connect(sock, &QTcpSocket::disconnected, this, [this, sock]() {
                m_clients.removeOne(sock);
                sock->deleteLater();
                emit clientCountChanged();
            });
            emit clientCountChanged();
        });
        connect(sock, &QTcpSocket::disconnected, this, [this, sock]() {
            if (!m_clients.contains(sock))
                sock->deleteLater();
        });
    }
}

QByteArray StreamServer::statusJson() const
{
    return QByteArray("{\"active\":") + (m_running ? "true" : "false") +
        ",\"port\":" + QByteArray::number(m_port) +
        ",\"clients\":" + QByteArray::number(m_clients.size()) +
        ",\"mode\":\"" + m_mode.toUtf8() + "\"}";
}

QByteArray StreamServer::obsHtml() const
{
    const QByteArray streamUrl = "http://127.0.0.1:" + QByteArray::number(m_port) + "/stream";
    return QByteArrayLiteral(
               "<!DOCTYPE html><html><head><meta charset=utf-8><title>LiveMorph Stream</title>"
               "<style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:100%;height:100%;"
               "overflow:hidden;background:transparent}img{width:100%;height:100%;"
               "object-fit:contain;display:block}</style></head>"
               "<body><img src=\"") +
        streamUrl + "\" alt=\"LiveMorph Stream\"/></body></html>";
}

void StreamServer::pushFrame(const QImage &frame)
{
    if (!m_running || m_paused || m_clients.isEmpty() || frame.isNull())
        return;
    if (!m_pushClock.isValid())
        m_pushClock.start();
    if (m_pushClock.elapsed() < m_minFrameIntervalMs)
        return;
    m_pushClock.restart();
    // Downscale very large frames for OBS path (CPU + bandwidth)
    QImage out = frame;
    if (out.width() > 1280 || out.height() > 720)
        out = out.scaled(1280, 720, Qt::KeepAspectRatio, Qt::FastTransformation);
    QByteArray jpeg;
    QBuffer buf(&jpeg);
    buf.open(QIODevice::WriteOnly);
    QImageWriter w(&buf, "jpeg");
    w.setQuality(65); // lower CPU/bandwidth for OBS MJPEG
    if (!w.write(out))
        return;
    broadcastJpeg(jpeg);
}

void StreamServer::broadcastJpeg(const QByteArray &jpeg)
{
    QByteArray part;
    part += "--" + m_boundary + "\r\n";
    part += "Content-Type: image/jpeg\r\n";
    part += "Content-Length: " + QByteArray::number(jpeg.size()) + "\r\n\r\n";
    part += jpeg;
    part += "\r\n";
    for (QTcpSocket *s : m_clients) {
        if (s->state() != QAbstractSocket::ConnectedState)
            continue;
        // Drop frame if client is slow (prevents unbounded memory growth)
        if (s->bytesToWrite() > 512 * 1024)
            continue;
        s->write(part);
    }
}
