#include "StreamServer.h"

#include <QBuffer>
#include <QHostAddress>
#include <QImageWriter>
#include <QPointer>
#include <QRandomGenerator>
#include <QTcpSocket>
#include <QTimer>

StreamServer::StreamServer(QObject *parent)
    : QObject(parent)
{
    connect(&m_server, &QTcpServer::newConnection, this, &StreamServer::onNewConnection);
    // Precompute the multipart part prefix (only Content-Length varies per frame).
    m_partPrefix = "--" + m_boundary + "\r\nContent-Type: image/jpeg\r\nContent-Length: ";
    // JPEG encode runs on a worker thread — the GUI thread only broadcasts.
    m_encoder = new StreamEncoder();
    m_encoder->moveToThread(&m_encodeThread);
    connect(m_encoder, &StreamEncoder::encoded, this, &StreamServer::onEncoded);
    m_encodeThread.start();
}

StreamServer::~StreamServer()
{
    stop();
    m_encodeThread.quit();
    // Encode work is bounded (<=1280x720 JPEG), so an unbounded wait always
    // joins; deleting the encoder while its thread still runs would be a
    // use-after-free (and a qFatal in ~QThread on a running thread).
    m_encodeThread.wait();
    delete m_encoder;
}

void StreamEncoder::encode(const QImage &frame)
{
    QImage out = frame;
    if (out.width() > 1280 || out.height() > 720)
        out = out.scaled(1280, 720, Qt::KeepAspectRatio, Qt::FastTransformation);
    QByteArray jpeg;
    QBuffer buf(&jpeg);
    buf.open(QIODevice::WriteOnly);
    QImageWriter w(&buf, "jpeg");
    w.setQuality(65); // lower CPU/bandwidth for OBS MJPEG
    if (w.write(out))
        emit encoded(jpeg);
    else
        // Empty payload signals failure — must still be emitted, otherwise the
        // mailbox busy-flag never clears and the stream freezes on the last frame.
        emit encoded(QByteArray());
}

QString StreamServer::url() const
{
    if (!m_running)
        return {};
    // Report the actually bound port (fallback ports differ from m_port).
    const quint16 actual = m_server.serverPort();
    return QStringLiteral("http://127.0.0.1:%1/stream?token=%2")
        .arg(QString::number(actual > 0 ? actual : quint16(m_port)), m_authToken);
}

void StreamServer::setPort(int p)
{
    // Reject out-of-range ports instead of truncating via quint16 (70000 would
    // silently bind 4464 and the reported URL would be wrong).
    if (p < 1024 || p > 65535) {
        emit error(tr("Invalid stream port %1 — must be between 1024 and 65535").arg(p));
        return;
    }
    if (m_port == p)
        return;
    const bool was = m_running;
    if (was)
        stop();
    m_port = p;
    emit urlChanged();
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
        const int tryPort = qMin(preferred + i, 65535);
        if (m_server.listen(QHostAddress::LocalHost, quint16(tryPort))) {
            // Keep m_port as the CONFIGURED value — mutating it here would
            // silently overwrite the user's setting with the fallback port.
            // url()/statusJson()/obsHtml() report the actually bound port via
            // m_server.serverPort().
            if (tryPort != m_port)
                emit error(tr("Port %1 busy — streaming on %2").arg(preferred).arg(tryPort));
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
    // Per-process random token: the local MJPEG stream carries the user's
    // morphed video, so any local process must not fetch it unauthenticated.
    // Generate ONCE per process (not on every start) so a stop/start cycle
    // doesn't mint a new token and 401 the OBS Browser Source holding the old URL.
    if (m_authToken.isEmpty())
        m_authToken = QString::number(QRandomGenerator::global()->generate64(), 16)
                    + QString::number(QRandomGenerator::global()->generate64(), 16);
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
    // Pre-handshake sockets are parented to THIS object, not m_server —
    // findChildren on m_server misses them and they linger past stop().
    const auto pending = findChildren<QTcpSocket *>();
    for (QTcpSocket *s : pending) {
        s->disconnectFromHost();
        s->deleteLater();
    }
    m_handshaking = 0;
    m_server.close();
    const bool was = m_running;
    m_running = false;
    m_paused = false;
    if (was) {
        emit runningChanged();
        emit urlChanged();
        emit pausedChanged();
        emit clientCountChanged();
        emit modeChanged(); // virtualCameraActive depends on m_running too
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
        // Bound the request-line buffer: without a limit a local peer can make
        // us buffer unbounded data before the 5s handshake timeout fires.
        sock->setReadBufferSize(16 * 1024);
        // Cap covers BOTH post-request stream clients and pre-request sockets
        if (m_clients.size() + m_handshaking >= 8) {
            sock->disconnectFromHost();
            sock->deleteLater();
            continue;
        }
        ++m_handshaking;
        // Marks that the handshake slot has been released (request-line seen,
        // timeout, or pre-request disconnect). Prevents double-decrements and
        // slot leaks between the three release paths.
        sock->setProperty("handshakeDone", false);
        // Request-line timeout: a half-open request must not hold a slot 5s+.
        // QPointer guard — the socket may already be freed by an early
        // disconnect or a /status, /obs reply; never dereference raw sock.
        QPointer<QTcpSocket> guard(sock);
        QTimer::singleShot(5000, this, [this, guard]() {
            if (guard && guard->state() != QAbstractSocket::UnconnectedState
                && !m_clients.contains(guard)
                && !guard->property("handshakeDone").toBool()) {
                guard->setProperty("handshakeDone", true);
                --m_handshaking;
                guard->disconnectFromHost();
                guard->deleteLater();
            }
        });
        // Read the HTTP request line so we can route /stream vs /obs vs /status
        // (reference main.js serves the same three paths for OBS workflows).
        connect(sock, &QTcpSocket::readyRead, this, [this, sock]() {
            // Pipelined/extra data after the request line must never release the
            // handshake slot twice — a second release drives m_handshaking
            // negative and defeats the connection cap.
            if (sock->property("handshakeDone").toBool())
                return;
            if (!sock->canReadLine()) {
                // No newline within the bounded buffer: abusive or broken peer.
                if (sock->bytesAvailable() >= 16 * 1024) {
                    sock->setProperty("handshakeDone", true);
                    --m_handshaking;
                    sock->disconnectFromHost();
                    sock->deleteLater();
                }
                return;
            }
            sock->setProperty("handshakeDone", true);
            --m_handshaking;
            const QByteArray line = sock->readLine();
            QByteArray path = QByteArrayLiteral("/stream");
            QByteArray target;
            if (line.startsWith("GET ")) {
                const QList<QByteArray> parts = line.split(' ');
                if (parts.size() >= 2)
                    target = parts.at(1);
                const int q = target.indexOf('?');
                path = q >= 0 ? target.left(q) : target;
            }
            // Auth: every route requires the per-run token (?token=...) — the
            // /stream endpoint carries the user's morphed video frames.
            QByteArray reqToken;
            const int q = target.indexOf('?');
            if (q >= 0) {
                for (const QByteArray &kv : target.mid(q + 1).split('&')) {
                    const int eq = kv.indexOf('=');
                    if (eq > 0 && kv.left(eq) == "token")
                        reqToken = kv.mid(eq + 1);
                }
            }
            // Constant-time compare — a plain != would leak a timing oracle.
            const QByteArray want = m_authToken.toUtf8();
            quint8 diff = quint8(reqToken.size() ^ want.size());
            const int n = qMax(reqToken.size(), want.size());
            for (int i = 0; i < n; ++i) {
                const char a = i < reqToken.size() ? reqToken.at(i) : char(0);
                const char b = i < want.size() ? want.at(i) : char(0);
                diff |= quint8(uchar(a) ^ uchar(b));
            }
            if (diff != 0) {
                sock->write("HTTP/1.1 401 Unauthorized\r\nContent-Length: 0\r\nConnection: close\r\n\r\n");
                sock->disconnectFromHost();
                sock->deleteLater();
                return;
            }
            if (path == QByteArrayLiteral("/status")) {
                sock->write("HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n"
                            "Connection: close\r\nCache-Control: no-cache\r\n\r\n" +
                            statusJson());
                sock->disconnectFromHost();
                sock->deleteLater();
                return;
            }
            if (path == QByteArrayLiteral("/obs") || path == QByteArrayLiteral("/obs/")) {
                sock->write("HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8\r\n"
                            "Connection: close\r\nCache-Control: no-cache\r\n\r\n" +
                            obsHtml());
                sock->disconnectFromHost();
                sock->deleteLater();
                return;
            }
            // Default: /stream multipart (also tolerate empty path from raw sockets)
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
        // Pre-request disconnect: release the handshake slot the socket still
        // holds (a /status, /obs, or /stream socket already released its slot
        // in the readyRead branch — the property marks it done).
        connect(sock, &QTcpSocket::disconnected, this, [this, sock]() {
            if (!m_clients.contains(sock)) {
                if (!sock->property("handshakeDone").toBool())
                    --m_handshaking;
                sock->deleteLater();
            }
        });
    }
}

QByteArray StreamServer::statusJson() const
{
    const quint16 bp = m_server.serverPort();
    return QByteArray("{\"active\":") + (m_running ? "true" : "false") +
        ",\"port\":" + QByteArray::number(bp > 0 ? bp : quint16(m_port)) +
        ",\"clients\":" + QByteArray::number(m_clients.size()) +
        ",\"mode\":\"" + m_mode.toUtf8() + "\"}";
}

QByteArray StreamServer::obsHtml() const
{
    // /stream requires the per-run token; this page is itself token-gated, so
    // embedding the token here leaks nothing to unauthenticated peers.
    const quint16 bp = m_server.serverPort();
    const QByteArray streamUrl = "http://127.0.0.1:" + QByteArray::number(bp > 0 ? bp : quint16(m_port))
                                 + "/stream?token=" + m_authToken.toUtf8();
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

    // Latest-wins mailbox: if an encode is already in flight, just stash the
    // newest frame — the encoder picks it up when done. The JPEG encode itself
    // (the expensive part) runs on the worker thread, never here.
    QImage next;
    {
        QMutexLocker l(&m_pendingMutex);
        m_pending = frame;
        ++m_pendingSeq;
        if (m_encodeBusy)
            return;
        m_encodeBusy = true;
        m_lastDispatchedSeq = m_pendingSeq;
        next = m_pending;
    }
    dispatchEncode(next);
}

void StreamServer::dispatchEncode(const QImage &img)
{
    QMetaObject::invokeMethod(m_encoder, "encode", Qt::QueuedConnection, Q_ARG(QImage, img));
}

void StreamServer::onEncoded(const QByteArray &jpeg)
{
    if (jpeg.isEmpty()) {
        // Encode failed: release the mailbox slot and report, so later frames
        // still flow instead of stashing forever.
        emit error(tr("JPEG encode failed — frame dropped"));
    } else {
        // Broadcast on the GUI thread (non-blocking socket writes).
        broadcastJpeg(jpeg);
    }
    // Chain the next pending frame, if any.
    QImage next;
    {
        QMutexLocker l(&m_pendingMutex);
        if (m_pendingSeq > m_lastDispatchedSeq && !m_pending.isNull()) {
            m_lastDispatchedSeq = m_pendingSeq;
            next = m_pending;
        } else {
            m_encodeBusy = false;
            return;
        }
    }
    dispatchEncode(next);
}

void StreamServer::broadcastJpeg(const QByteArray &jpeg)
{
    QByteArray part;
    part.reserve(jpeg.size() + m_partPrefix.size() + 24);
    part += m_partPrefix;
    part += QByteArray::number(jpeg.size());
    part += "\r\n\r\n";
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
