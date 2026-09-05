#include "BackendClient.h"
#include "core/DeviceIdentity.h"
#include <QClipboard>
#include <QGuiApplication>
#include <QNetworkRequest>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QTimer>
#include <functional>
#include <QDesktopServices>
#include <QFileInfo>

BackendClient::BackendClient(QObject *parent) : QObject(parent)
{
    m_nam.setTransferTimeout(30000);

    // Periodic reachability probe — paused while the app is backgrounded.
    m_pingTimer.setInterval(15000);
    connect(&m_pingTimer, &QTimer::timeout, this, &BackendClient::ping);
    m_pingTimer.start();
    connect(qApp, &QGuiApplication::applicationStateChanged, this,
            [this](Qt::ApplicationState state) {
                if (state == Qt::ApplicationActive)
                    m_pingTimer.start();
                else
                    m_pingTimer.stop();
            });
    QTimer::singleShot(200, this, &BackendClient::ping);
    QTimer::singleShot(400, this, &BackendClient::fetchAppVersion);
}

void BackendClient::setBaseUrl(const QString &url)
{
    QString u = url.trimmed();
    while (u.endsWith(QLatin1Char('/')))
        u.chop(1);
    if (u.isEmpty())
        u = QStringLiteral("http://127.0.0.1:3874");
    if (!u.startsWith(QLatin1String("http://")) && !u.startsWith(QLatin1String("https://")))
        u = QStringLiteral("http://") + u;
    // Production hosts must not use plaintext HTTP (loopback only exception)
    const QUrl parsed(u);
    const QString host = parsed.host();
    const bool loopback = host == QLatin1String("127.0.0.1")
                          || host == QLatin1String("localhost")
                          || host == QLatin1String("::1");
    if (!loopback && parsed.scheme() == QLatin1String("http")) {
        u = u;
        u.replace(QLatin1String("http://"), QLatin1String("https://"));
    }
    if (m_baseUrl == u) return;
    m_baseUrl = u;
    emit baseUrlChanged();
    ping();
}

void BackendClient::setAccessToken(const QString &token)
{
    m_accessToken = token;
}

QString BackendClient::deviceId() const
{
    return DeviceIdentity::deviceId();
}

QNetworkRequest BackendClient::makeRequest(const QString &path) const
{
    QNetworkRequest req{QUrl(m_baseUrl + path)};
    req.setHeader(QNetworkRequest::ContentTypeHeader, QStringLiteral("application/json"));
    req.setRawHeader("Accept", "application/json");
    req.setRawHeader("X-Frontend-Id", "livemorph");
    req.setRawHeader("X-Client-Product", "livemorph");
    req.setRawHeader("X-Device-Id", DeviceIdentity::deviceId().toUtf8());
    req.setRawHeader("X-App-Version", DeviceIdentity::appVersion().toUtf8());
    req.setHeader(QNetworkRequest::UserAgentHeader, DeviceIdentity::userAgent());
    if (!m_accessToken.isEmpty())
        req.setRawHeader("Authorization", QByteArray("Bearer ") + m_accessToken.toUtf8());
    return req;
}

void BackendClient::get(const QString &path, const std::function<void(const QJsonObject &)> &ok)
{
    QNetworkRequest req = makeRequest(path);
    req.setTransferTimeout(30000); // 30s — production hangs should fail fast
    auto *reply = m_nam.get(req);
    connect(reply, &QNetworkReply::finished, this, [this, reply, path, ok]() {
        reply->deleteLater();
        const QByteArray raw = reply->readAll();
        const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        const bool netErr = reply->error() != QNetworkReply::NoError
                            && reply->error() != QNetworkReply::ContentNotFoundError
                            && reply->error() != QNetworkReply::AuthenticationRequiredError
                            && reply->error() != QNetworkReply::ContentAccessDenied;
        // Treat pure transport failures as offline; HTTP 4xx/5xx still mean host is reachable
        if (netErr && status == 0) {
            if (m_reachable) {
                m_reachable = false;
                emit reachableChanged();
            }
            emit requestFailed(path, reply->errorString());
            return;
        }
        if (status >= 400 || (reply->error() != QNetworkReply::NoError && status >= 400)) {
            QString err = reply->errorString();
            const auto doc = QJsonDocument::fromJson(raw);
            if (doc.isObject()) {
                const QString m = doc.object().value(QStringLiteral("message")).toString();
                if (!m.isEmpty()) err = m;
            }
            if (!m_reachable) {
                m_reachable = true;
                emit reachableChanged();
            }
            emit requestFailed(path, err.isEmpty() ? tr("HTTP %1").arg(status) : err);
            return;
        }
        if (!m_reachable) {
            m_reachable = true;
            emit reachableChanged();
        }
        const auto doc = QJsonDocument::fromJson(raw);
        ok(doc.isObject() ? doc.object() : QJsonObject{});
    });
}

void BackendClient::post(const QString &path, const QJsonObject &body,
                         const std::function<void(const QJsonObject &)> &ok)
{
    QNetworkRequest req = makeRequest(path);
    req.setTransferTimeout(45000); // payments / verify may be slower
    auto *reply = m_nam.post(req, QJsonDocument(body).toJson(QJsonDocument::Compact));
    connect(reply, &QNetworkReply::finished, this, [this, reply, path, ok]() {
        reply->deleteLater();
        const QByteArray raw = reply->readAll();
        const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        const bool transportFail = (status == 0 && reply->error() != QNetworkReply::NoError);
        if (transportFail) {
            if (m_reachable) {
                m_reachable = false;
                emit reachableChanged();
            }
            emit requestFailed(path, reply->errorString());
            return;
        }
        if (reply->error() != QNetworkReply::NoError || status >= 400) {
            QString err = reply->errorString();
            const auto doc = QJsonDocument::fromJson(raw);
            if (doc.isObject()) {
                const auto o = doc.object();
                const QString m = o.value(QStringLiteral("message")).toString();
                if (!m.isEmpty()) err = m;
                else {
                    const QString e = o.value(QStringLiteral("error")).toString();
                    if (!e.isEmpty()) err = e;
                }
            }
            if (!m_reachable) {
                m_reachable = true;
                emit reachableChanged();
            }
            emit requestFailed(path, err.isEmpty() ? tr("HTTP %1").arg(status) : err);
            return;
        }
        if (!m_reachable) {
            m_reachable = true;
            emit reachableChanged();
        }
        const auto doc = QJsonDocument::fromJson(raw);
        ok(doc.isObject() ? doc.object() : QJsonObject{});
    });
}

void BackendClient::fetchPaymentPackages()
{
    QNetworkRequest req = makeRequest(QStringLiteral("/api/v1/payments/packages"));
    req.setTransferTimeout(15000);
    auto *reply = m_nam.get(req);
    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        reply->deleteLater();
        const QByteArray raw = reply->readAll();
        const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        if ((reply->error() != QNetworkReply::NoError && status == 0) || status >= 400) {
            emit requestFailed(QStringLiteral("/api/v1/payments/packages"), reply->errorString());
            return;
        }
        if (!m_reachable) { m_reachable = true; emit reachableChanged(); }
        const auto doc = QJsonDocument::fromJson(raw);
        QVariantList list;
        if (doc.isArray()) {
            for (const auto &v : doc.array())
                list.append(v.toVariant());
        } else if (doc.isObject()) {
            const auto obj = doc.object();
            const auto arr = obj.value(QStringLiteral("packages")).toArray();
            for (const auto &v : arr)
                list.append(v.toVariant());
            if (obj.contains(QStringLiteral("providers"))) {
                QStringList prov;
                for (const auto &v : obj.value(QStringLiteral("providers")).toArray())
                    prov.append(v.toString());
                if (!prov.isEmpty() && prov != m_paymentProviders) {
                    m_paymentProviders = prov;
                    emit paymentProvidersChanged();
                }
            }
        }
        emit paymentPackagesReceived(list);
        m_paymentPackages = list;
        emit paymentPackagesChanged();
    });
}

void BackendClient::createPaymentOrder(const QString &packageKey, const QString &provider)
{
    QJsonObject body{
        {QStringLiteral("package_key"), packageKey},
        {QStringLiteral("provider"), provider},
        {QStringLiteral("product"), QStringLiteral("livemorph")},
        {QStringLiteral("device_id"), DeviceIdentity::deviceId()},
    };
    post(QStringLiteral("/api/v1/payments/orders"), body, [this](const QJsonObject &o) {
        emit paymentOrderCreated(o.toVariantMap());
    });
}

void BackendClient::verifyPaymentOrder(const QString &orderId, const QString &reference)
{
    QJsonObject body{{QStringLiteral("order_id"), orderId}};
    if (!reference.isEmpty())
        body.insert(QStringLiteral("reference"), reference);
    post(QStringLiteral("/api/v1/payments/orders/verify"), body, [this](const QJsonObject &o) {
        emit paymentOrderVerified(o.toVariantMap());
    });
}

void BackendClient::fetchOrderStatus(const QString &orderId)
{
    if (orderId.isEmpty())
        return;
    get(QStringLiteral("/api/v1/payments/orders/%1").arg(orderId), [this](const QJsonObject &o) {
        emit paymentOrderStatusReceived(o.toVariantMap());
        // Also surface as verified when already provisioned so existing handlers work
        const QString st = o.value(QStringLiteral("status")).toString();
        if (st == QLatin1String("provisioned") || o.value(QStringLiteral("provisioned")).toBool())
            emit paymentOrderVerified(o.toVariantMap());
    });
}

void BackendClient::fetchCreditsBalance()
{
    get(QStringLiteral("/api/v1/credits/balance"), [this](const QJsonObject &o) {
        emit creditsBalanceReceived(o.toVariantMap());
    });
}

void BackendClient::ping()
{
    get(QStringLiteral("/api/v1/health"), [this](const QJsonObject &obj) {
        if (!m_reachable) {
            m_reachable = true;
            emit reachableChanged();
        }
        const QString v = obj.value(QStringLiteral("version")).toString();
        if (!v.isEmpty() && v != m_appVersion) {
            m_appVersion = v;
            emit appVersionChanged();
        }
        // Secondary: refresh catalog/version endpoints can lag — health is authoritative for up
        Q_UNUSED(obj);
    });
}

void BackendClient::fetchAppVersion()
{
    ping();
}

void BackendClient::startStream()
{
    post(QStringLiteral("/api/v1/stream/start"), {}, [this](const QJsonObject &o) {
        emit streamStarted(o.toVariantMap());
    });
}

void BackendClient::stopStream()
{
    post(QStringLiteral("/api/v1/stream/stop"), {}, [this](const QJsonObject &o) {
        emit streamStopped(o.toVariantMap());
    });
}

void BackendClient::getStreamUrl()
{
    get(QStringLiteral("/api/v1/stream/url"), [this](const QJsonObject &o) {
        emit streamUrlReceived(o.value(QStringLiteral("url")).toString());
    });
}

void BackendClient::getStreamStatus()
{
    get(QStringLiteral("/api/v1/stream/status"), [this](const QJsonObject &o) {
        emit streamStatusReceived(o.toVariantMap());
    });
}

void BackendClient::startVirtualCamera(const QString &streamId)
{
    QJsonObject body;
    if (!streamId.isEmpty())
        body.insert(QStringLiteral("stream_id"), streamId);
    post(QStringLiteral("/api/v1/vc/start"), body, [this](const QJsonObject &o) {
        emit virtualCameraStarted(o.toVariantMap());
    });
}

void BackendClient::stopVirtualCamera()
{
    post(QStringLiteral("/api/v1/vc/stop"), {}, [this](const QJsonObject &o) {
        emit virtualCameraStopped(o.toVariantMap());
    });
}

void BackendClient::getVirtualCameraStatus()
{
    get(QStringLiteral("/api/v1/vc/status"), [this](const QJsonObject &o) {
        emit virtualCameraStatusReceived(o.toVariantMap());
    });
}

void BackendClient::startRecording(const QVariantMap &payload)
{
    post(QStringLiteral("/api/v1/recording/start"),
         QJsonObject::fromVariantMap(payload),
         [this](const QJsonObject &o) { emit recordingStarted(o.toVariantMap()); });
}

void BackendClient::stopRecording(const QString &reason)
{
    QJsonObject body{{QStringLiteral("reason"), reason}};
    post(QStringLiteral("/api/v1/recording/stop"), body, [this](const QJsonObject &o) {
        emit recordingStopped(o.toVariantMap());
    });
}

void BackendClient::finalizeRecording()
{
    post(QStringLiteral("/api/v1/recording/finalize"), {}, [this](const QJsonObject &o) {
        emit recordingFinalized(o.toVariantMap());
    });
}

void BackendClient::getRecordingsDirectory()
{
    get(QStringLiteral("/api/v1/recordings/directory"), [this](const QJsonObject &o) {
        emit recordingsDirectoryReceived(o.value(QStringLiteral("directory")).toString());
    });
}

void BackendClient::clearAuthSession()
{
    post(QStringLiteral("/api/v1/auth/clear"), {}, [](const QJsonObject &) {});
}

void BackendClient::checkUpdates()
{
    post(QStringLiteral("/api/v1/update/check"), {}, [this](const QJsonObject &o) {
        emit updateCheckResult(o.toVariantMap());
    });
}

void BackendClient::installUpdate()
{
    // Frontend never installs binaries itself. Prefer last check payload download_url,
    // otherwise ask backend for the public download link and open in the browser/OS.
    post(QStringLiteral("/api/v1/update/check"), {}, [this](const QJsonObject &o) {
        const QString url = o.value(QStringLiteral("download_url")).toString(
            o.value(QStringLiteral("url")).toString());
        if (!url.isEmpty())
            openExternal(url);
        emit updateCheckResult(o.toVariantMap());
    });
}

void BackendClient::fetchCatalog()
{
    QNetworkRequest req = makeRequest(QStringLiteral("/api/v1/catalog"));
    req.setTransferTimeout(15000);
    auto *reply = m_nam.get(req);
    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        reply->deleteLater();
        const QByteArray raw = reply->readAll();
        const int status = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        if ((reply->error() != QNetworkReply::NoError && status == 0) || status >= 400) {
            emit requestFailed(QStringLiteral("/api/v1/catalog"), reply->errorString());
            return;
        }
        if (!m_reachable) { m_reachable = true; emit reachableChanged(); }
        const auto doc = QJsonDocument::fromJson(raw);
        QVariantList list;
        if (doc.isArray()) {
            for (const auto &v : doc.array())
                list.append(v.toObject().toVariantMap());
        } else if (doc.isObject()) {
            const auto arr = doc.object().value(QStringLiteral("characters")).toArray();
            for (const auto &v : arr)
                list.append(v.toObject().toVariantMap());
        }
        emit catalogReceived(list);
    });
}

void BackendClient::pauseStream()
{
    post(QStringLiteral("/api/v1/stream/stop"), {}, [this](const QJsonObject &o) {
        emit streamStopped(o.toVariantMap());
    });
}

void BackendClient::resumeStream()
{
    post(QStringLiteral("/api/v1/stream/start"), {}, [this](const QJsonObject &o) {
        emit streamStarted(o.toVariantMap());
    });
}

void BackendClient::openExternal(const QString &url)
{
    const QUrl u(url.trimmed());
    const QString scheme = u.scheme().toLower();
    // Allow web + our deep link scheme only
    if (scheme != QLatin1String("http") && scheme != QLatin1String("https")
        && scheme != QLatin1String("livemorph") && scheme != QLatin1String("mailto")) {
        emit requestFailed(QStringLiteral("openExternal"), tr("Blocked URL scheme: %1").arg(scheme));
        return;
    }
    QDesktopServices::openUrl(u);
}

void BackendClient::copyToClipboard(const QString &text)
{
    if (auto *clip = QGuiApplication::clipboard())
        clip->setText(text);
}

void BackendClient::revealRecording(const QString &path)
{
    if (path.isEmpty()) return;
    QDesktopServices::openUrl(QUrl::fromLocalFile(QFileInfo(path).absolutePath()));
}


void BackendClient::fetchBootstrap()
{
    get(QStringLiteral("/api/v1/bootstrap"), [this](const QJsonObject &o) {
        m_lastBootstrap = o.toVariantMap();
        const QJsonObject ep = o.value(QStringLiteral("endpoints")).toObject();
        QString api = ep.value(QStringLiteral("api_base")).toString();
        if (!api.isEmpty())
            setBaseUrl(api);
        m_balanceWsUrl = ep.value(QStringLiteral("balance_ws")).toString();
        m_realtimeWsUrl = ep.value(QStringLiteral("realtime_ws")).toString();
        m_configRevision = o.value(QStringLiteral("config_revision")).toString();
        emit bootstrapChanged();
        emit bootstrapLoaded(m_lastBootstrap);
    });
}
