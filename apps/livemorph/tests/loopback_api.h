#pragma once

#include <QObject>
#include <QTcpServer>
#include <QTcpSocket>
#include <QPointer>
#include <QJsonDocument>
#include <QJsonObject>
#include <QUrl>
#include <QTimer>
#include <QCryptographicHash>
#include <functional>

struct MockResponse {
    int status = 200;
    QByteArray body = QByteArrayLiteral("{}");
    int delayMs = 0;
};

struct RecordedRequest {
    QString method;
    QString target;
    QString path;
    QHash<QString, QByteArray> headers;
    QByteArray body;
};

class LoopbackApi : public QObject {
public:
    explicit LoopbackApi(QObject *parent = nullptr) : QObject(parent) {
        connect(&m_server, &QTcpServer::newConnection, this, [this]() {
            while (QTcpSocket *socket = m_server.nextPendingConnection()) {
                socket->setParent(this);
                m_sockets.append(socket);
                socket->setProperty("buffer", QByteArray());
                connect(socket, &QTcpSocket::readyRead, this, [this, socket]() {
                    if (socket->property("websocket").toBool())
                        consumeWebSocket(socket);
                    else
                        consumeHttp(socket);
                });
                connect(socket, &QTcpSocket::disconnected, this, [this, socket]() {
                    m_sockets.removeAll(socket);
                    socket->deleteLater();
                });
            }
        });
    }

    bool start() {
        return m_server.listen(QHostAddress::LocalHost, 0);
    }

    QString baseUrl() const {
        return QStringLiteral("http://127.0.0.1:%1").arg(m_server.serverPort());
    }

    quint16 port() const {
        return m_server.serverPort();
    }

    void clearRequests() {
        m_requests.clear();
        m_textMessages.clear();
    }

    QList<RecordedRequest> requestsFor(const QString &path) const {
        QList<RecordedRequest> out;
        for (const auto &request : m_requests)
            if (request.path == path)
                out.append(request);
        return out;
    }

    void sendJson(const QString &path, const QJsonObject &object) {
        const QByteArray payload = QJsonDocument(object).toJson(QJsonDocument::Compact);
        for (QTcpSocket *socket : m_sockets) {
            if (!socket->property("websocket").toBool() || socket->property("path").toString() != path)
                continue;
            QByteArray frame;
            frame.append(char(0x81));
            if (payload.size() < 126) {
                frame.append(char(payload.size()));
            } else if (payload.size() <= 65535) {
                frame.append(char(126));
                const quint16 size = quint16(payload.size());
                frame.append(char(size >> 8));
                frame.append(char(size & 0xff));
            } else {
                frame.append(char(127));
                const quint64 size = quint64(payload.size());
                for (int shift = 56; shift >= 0; shift -= 8)
                    frame.append(char((size >> shift) & 0xff));
            }
            frame.append(payload);
            socket->write(frame);
        }
    }

    std::function<MockResponse(const RecordedRequest &)> responder;
    QList<RecordedRequest> m_requests;
    QList<QPair<QString, QJsonObject>> m_textMessages;

private:
    void consumeHttp(QTcpSocket *socket) {
        QByteArray buffer = socket->property("buffer").toByteArray();
        buffer.append(socket->readAll());
        const int headerEnd = buffer.indexOf("\r\n\r\n");
        if (headerEnd < 0) {
            if (buffer.size() > 64 * 1024)
                socket->disconnectFromHost();
            else
                socket->setProperty("buffer", buffer);
            return;
        }
        const QByteArray head = buffer.left(headerEnd);
        const QList<QByteArray> lines = head.split('\n');
        const QList<QByteArray> requestParts = lines.first().trimmed().split(' ');
        if (requestParts.size() < 3) {
            socket->disconnectFromHost();
            return;
        }
        RecordedRequest request;
        request.method = QString::fromLatin1(requestParts.at(0));
        request.target = QString::fromLatin1(requestParts.at(1));
        request.path = QUrl(request.target).path();
        for (int i = 1; i < lines.size(); ++i) {
            const QByteArray line = lines.at(i).trimmed();
            const int colon = line.indexOf(':');
            if (colon > 0)
                request.headers.insert(QString::fromLatin1(line.left(colon)).toLower(),
                                       line.mid(colon + 1).trimmed());
        }
        const int contentLength = request.headers.value(QStringLiteral("content-length"), "0").toInt();
        if (buffer.size() < headerEnd + 4 + contentLength) {
            socket->setProperty("buffer", buffer);
            return;
        }
        request.body = buffer.mid(headerEnd + 4, contentLength);
        m_requests.append(request);

        if (request.headers.value(QStringLiteral("upgrade")).toLower() == "websocket") {
            const QByteArray key = request.headers.value(QStringLiteral("sec-websocket-key"));
            const QByteArray accept = QCryptographicHash::hash(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
                                                                QCryptographicHash::Sha1).toBase64();
            const QByteArray response = "HTTP/1.1 101 Switching Protocols\r\n"
                                        "Upgrade: websocket\r\n"
                                        "Connection: Upgrade\r\n"
                                        "Sec-WebSocket-Accept: " + accept + "\r\n\r\n";
            socket->setProperty("websocket", true);
            socket->setProperty("path", request.path);
            socket->setProperty("buffer", QByteArray());
            socket->write(response);
            return;
        }

        MockResponse response = responder ? responder(request) : MockResponse{};
        QPointer<QTcpSocket> guard(socket);
        QTimer::singleShot(response.delayMs, this, [this, guard, response]() {
            if (!guard)
                return;
            static const QHash<int, QByteArray> reasons = {
                {200, "OK"}, {201, "Created"}, {204, "No Content"},
                {400, "Bad Request"}, {401, "Unauthorized"}, {402, "Payment Required"},
                {403, "Forbidden"}, {404, "Not Found"}, {409, "Conflict"},
                {429, "Too Many Requests"}, {500, "Internal Server Error"},
            };
            const QByteArray reason = reasons.value(response.status, "Response");
            const QByteArray raw = "HTTP/1.1 " + QByteArray::number(response.status) + " " + reason +
                                   "\r\nContent-Type: application/json\r\nContent-Length: " +
                                   QByteArray::number(response.body.size()) +
                                   "\r\nConnection: close\r\n\r\n" + response.body;
            guard->write(raw);
            guard->disconnectFromHost();
        });
    }

    void consumeWebSocket(QTcpSocket *socket) {
        QByteArray buffer = socket->property("wsbuffer").toByteArray();
        buffer.append(socket->readAll());
        qsizetype offset = 0;
        while (buffer.size() - offset >= 2) {
            const uchar first = uchar(buffer.at(offset));
            const uchar second = uchar(buffer.at(offset + 1));
            quint64 length = second & 0x7f;
            qsizetype header = 2;
            if (length == 126) {
                if (buffer.size() - offset < 4)
                    break;
                length = (uchar(buffer.at(offset + 2)) << 8) | uchar(buffer.at(offset + 3));
                header = 4;
            } else if (length == 127) {
                if (buffer.size() - offset < 10)
                    break;
                length = 0;
                for (int i = 0; i < 8; ++i)
                    length = (length << 8) | uchar(buffer.at(offset + 2 + i));
                header = 10;
            }
            const bool masked = (second & 0x80) != 0;
            const qsizetype maskSize = masked ? 4 : 0;
            if (length > 8 * 1024 * 1024 || buffer.size() - offset < header + maskSize + qint64(length))
                break;
            QByteArray payload = buffer.mid(offset + header + maskSize, qint64(length));
            if (masked) {
                const QByteArray mask = buffer.mid(offset + header, 4);
                for (qsizetype i = 0; i < payload.size(); ++i)
                    payload[i] = payload.at(i) ^ mask.at(i % 4);
            }
            const int opcode = first & 0x0f;
            if (opcode == 1) {
                const auto document = QJsonDocument::fromJson(payload);
                if (document.isObject())
                    m_textMessages.append({socket->property("path").toString(), document.object()});
            }
            offset += header + maskSize + qint64(length);
        }
        socket->setProperty("wsbuffer", buffer.mid(offset));
    }

    QTcpServer m_server;
    QList<QTcpSocket *> m_sockets;
};
