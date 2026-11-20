#include <QtTest/QtTest>
#include <QGuiApplication>
#include <QClipboard>
#include <QTcpServer>
#include <QTcpSocket>
#include <QPointer>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QUrlQuery>
#include <QCryptographicHash>
#include <QSettings>
#include <QStandardPaths>
#include <QFile>
#include <QFileInfo>

#include "services/BackendClient.h"
#include "services/WebRtcSignalingClient.h"
#include "core/ConfigManager.h"
#include "core/SecureStore.h"
#include "core/AuthManager.h"
#include "core/SessionManager.h"
#include "core/AppController.h"
#include "core/RecordingManager.h"
#include "core/VirtualCameraHelper.h"
#include "models/CharacterCatalogModel.h"
#include "StreamServer.h"
#include "GstRtcPeer.h"
#include "loopback_api.h"

class FrontendIntegrationTest : public QObject {
    Q_OBJECT
private slots:
    void init() {
        QSettings(QStringLiteral("LiveMorph"), QStringLiteral("LiveMorph")).clear();
        SecureStore::remove(QStringLiteral("access"));
        SecureStore::remove(QStringLiteral("refresh"));
        SecureStore::remove(QStringLiteral("userId"));
        SecureStore::remove(QStringLiteral("email"));
        qunsetenv("LIVEMORPH_API_URL");
    }

    void reachability_failure_is_known() {
        QTcpServer closedPort;
        QVERIFY(closedPort.listen(QHostAddress::LocalHost, 0));
        const quint16 port = closedPort.serverPort();
        closedPort.close();
        BackendClient client;
        client.setBaseUrl(QStringLiteral("http://127.0.0.1:%1").arg(port));
        QTRY_VERIFY_WITH_TIMEOUT(client.reachableKnown(), 5000);
        QVERIFY(!client.reachable());
    }

    void malformed_json_is_not_a_successful_bootstrap() {
        LoopbackApi api;
        QVERIFY(api.start());
        api.responder = [](const RecordedRequest &request) {
            if (request.path == QLatin1String("/api/v1/bootstrap"))
                return MockResponse{200, "not-json", 0};
            return MockResponse{200, R"({"version":"1.8.0"})", 0};
        };
        BackendClient client;
        client.setBaseUrl(api.baseUrl());
        QSignalSpy loaded(&client, &BackendClient::bootstrapLoaded);
        QSignalSpy failed(&client, &BackendClient::requestFailed);
        client.fetchBootstrap();
        QTRY_VERIFY_WITH_TIMEOUT(!failed.isEmpty(), 5000);
        QCOMPARE(loaded.count(), 0);
        QCOMPARE(failed.first().at(0).toString(), QStringLiteral("/api/v1/bootstrap"));
    }

    void stale_download_response_cannot_replace_newer_model() {
        LoopbackApi api;
        QVERIFY(api.start());
        int downloadRequests = 0;
        api.responder = [&downloadRequests](const RecordedRequest &request) {
            if (request.path == QLatin1String("/api/v1/downloads/list")) {
                ++downloadRequests;
                if (downloadRequests == 1)
                    return MockResponse{200, R"({"downloads":[{"id":"old"}]})", 200};
                return MockResponse{200, R"({"downloads":[{"id":"new"}]})", 0};
            }
            return MockResponse{200, R"({"version":"1.8.0"})", 0};
        };
        BackendClient client;
        client.setBaseUrl(api.baseUrl());
        client.fetchDownloads();
        client.fetchDownloads();
        QTRY_COMPARE_WITH_TIMEOUT(client.downloadsModel().size(), 1, 5000);
        QCOMPARE(client.downloadsModel().first().toMap().value(QStringLiteral("id")).toString(),
                 QStringLiteral("new"));
        QTest::qWait(300);
        QCOMPARE(client.downloadsModel().first().toMap().value(QStringLiteral("id")).toString(),
                 QStringLiteral("new"));
        QVERIFY(!client.downloadsLoading());
    }

    void update_check_reports_client_version_and_platform() {
        LoopbackApi api;
        QVERIFY(api.start());
        api.responder = [](const RecordedRequest &) {
            return MockResponse{200, R"({"update_available":false,"latest_version":"1.8.0"})", 0};
        };
        BackendClient client;
        client.setBaseUrl(api.baseUrl());
        QSignalSpy result(&client, &BackendClient::updateCheckResult);
        client.checkUpdates();
        QTRY_COMPARE_WITH_TIMEOUT(result.count(), 1, 5000);
        const auto requests = api.requestsFor(QStringLiteral("/api/v1/update/check"));
        QCOMPARE(requests.size(), 1);
        const auto body = QJsonDocument::fromJson(requests.first().body).object();
        QCOMPARE(body.value(QStringLiteral("version")).toString(), DeviceIdentity::appVersion());
        QVERIFY(!body.value(QStringLiteral("platform")).toString().isEmpty());
    }

    void pending_payment_is_not_a_verified_success() {
        LoopbackApi api;
        QVERIFY(api.start());
        api.responder = [](const RecordedRequest &request) {
            if (request.path == QLatin1String("/api/v1/payments/orders/verify"))
                return MockResponse{200, R"({"order_id":"order-1","status":"pending","crypto_status":"confirmed","in_flight":false})", 0};
            return MockResponse{200, R"({"version":"1.8.0"})", 0};
        };
        BackendClient client;
        client.setBaseUrl(api.baseUrl());
        QSignalSpy status(&client, &BackendClient::paymentOrderStatusReceived);
        QSignalSpy verified(&client, &BackendClient::paymentOrderVerified);
        client.verifyPaymentOrder(QStringLiteral("order-1"));
        QTRY_COMPARE_WITH_TIMEOUT(status.count(), 1, 5000);
        QTest::qWait(50);
        QCOMPARE(verified.count(), 0);
    }

    void provisioned_payment_emits_status_and_success() {
        LoopbackApi api;
        QVERIFY(api.start());
        api.responder = [](const RecordedRequest &request) {
            if (request.path == QLatin1String("/api/v1/payments/orders/verify"))
                return MockResponse{200, R"({"order_id":"order-1","status":"provisioned","credits":100,"balance":{"credit_balance":100,"bonus_balance":0}})", 0};
            return MockResponse{200, R"({"version":"1.8.0"})", 0};
        };
        BackendClient client;
        client.setBaseUrl(api.baseUrl());
        QSignalSpy status(&client, &BackendClient::paymentOrderStatusReceived);
        QSignalSpy verified(&client, &BackendClient::paymentOrderVerified);
        client.verifyPaymentOrder(QStringLiteral("order-1"));
        QTRY_COMPARE_WITH_TIMEOUT(status.count(), 1, 5000);
        QTRY_COMPARE_WITH_TIMEOUT(verified.count(), 1, 5000);
    }

    void controller_enums_are_validated() {
        ConfigManager config;
        BackendClient backend;
        AuthManager auth(&config, &backend);
        WebRtcSignalingClient signaling;
        SessionManager session(&auth, &config, &backend, &signaling);
        AppController controller(&auth, &session, nullptr, nullptr, &config, nullptr, nullptr, &backend);
        controller.setSwapMode(QStringLiteral("invalid"));
        QCOMPARE(controller.swapMode(), QStringLiteral("character"));
        controller.setSwapMode(QStringLiteral("scene"));
        QCOMPARE(controller.swapMode(), QStringLiteral("scene"));
        controller.setRealtimeProvider(QStringLiteral("fal"));
        QCOMPARE(controller.realtimeProvider(), QStringLiteral("decart"));
        controller.setSwapTier(QStringLiteral("invalid"));
        QCOMPARE(controller.swapTier(), QStringLiteral("standard"));
        controller.setHdAvailable(true);
        controller.setSwapTier(QStringLiteral("hd"));
        QCOMPARE(controller.swapTier(), QStringLiteral("hd"));
        QVERIFY(session.hdActive());
    }

    void persisted_and_server_models_are_validated() {
        ConfigManager config;
        config.setValue(QStringLiteral("decart/model"), QStringLiteral("not a model"));
        QCOMPARE(config.defaultModel(), QStringLiteral("lucy-2.6"));
        config.setServerDefaultModel(QStringLiteral("also not a model"));
        QCOMPARE(config.defaultModel(), QStringLiteral("lucy-2.6"));
        config.setValue(QStringLiteral("decart/model"), QStringLiteral("lucy-2.1"));
        QCOMPARE(config.defaultModel(), QStringLiteral("lucy-2.1"));
        config.setServerDefaultModel(QStringLiteral("lucy-2.5"));
        config.setValue(QStringLiteral("decart/model"), QString());
        QCOMPARE(config.defaultModel(), QStringLiteral("lucy-2.5"));
    }

    void secure_store_roundtrip_and_tamper_rejection() {
        const QString secret = QStringLiteral("audit-secret-token");
        SecureStore::write(QStringLiteral("integration"), secret);
        QCOMPARE(SecureStore::read(QStringLiteral("integration")), secret);
        const QString path = QStandardPaths::writableLocation(QStandardPaths::AppLocalDataLocation)
                             + QStringLiteral("/secure/")
                             + QString::fromLatin1(QCryptographicHash::hash("integration", QCryptographicHash::Sha256).toHex());
        QFile file(path);
        QVERIFY(file.open(QIODevice::ReadOnly));
        QByteArray blob = file.readAll();
        file.close();
        QVERIFY(!blob.contains(secret.toUtf8()));
#ifdef LIVEMORPH_HAVE_OPENSSL
        blob[blob.size() - 1] = blob.at(blob.size() - 1) ^ 0x01;
        QVERIFY(file.open(QIODevice::WriteOnly | QIODevice::Truncate));
        QCOMPARE(file.write(blob), blob.size());
        file.close();
        QVERIFY(SecureStore::read(QStringLiteral("integration")).isEmpty());
#endif
        SecureStore::remove(QStringLiteral("integration"));
        QVERIFY(SecureStore::read(QStringLiteral("integration")).isEmpty());
    }

    void build_env_url_wins_over_legacy_setting() {
        QSettings settings(QStringLiteral("LiveMorph"), QStringLiteral("LiveMorph"));
        settings.setValue(QStringLiteral("api/baseUrl"), QStringLiteral("http://127.0.0.1:3874"));
        ConfigManager config;
        QCOMPARE(config.apiBaseUrl(), QStringLiteral(LIVEMORPH_API_BASE_URL));
    }

    void api_url_rejects_credentials_query_and_fragment() {
        ConfigManager config;
        config.setApiBaseUrl(QStringLiteral("https://user:pass@example.com/api?x=1#fragment"));
        QCOMPARE(config.apiBaseUrl(), QStringLiteral(LIVEMORPH_API_BASE_URL));
        config.setApiBaseUrl(QStringLiteral("http://example.com"));
        QCOMPARE(config.apiBaseUrl(), QStringLiteral("https://example.com"));
        config.setApiBaseUrl(QStringLiteral("http://127.0.0.1:9000"));
        QCOMPARE(config.apiBaseUrl(), QStringLiteral("http://127.0.0.1:9000"));
        ConfigManager persisted;
        QCOMPARE(persisted.apiBaseUrl(), QStringLiteral("http://127.0.0.1:9000"));
    }

    void signaling_uses_backend_contract() {
        LoopbackApi api;
        QVERIFY(api.start());
        WebRtcSignalingClient client;
        QSignalSpy sessionChanged(&client, &WebRtcSignalingClient::sessionIdChanged);
        QSignalSpy tick(&client, &WebRtcSignalingClient::generationTick);
        QSignalSpy error(&client, &WebRtcSignalingClient::errorOccurred);
        client.connectToProxy(api.baseUrl(), QStringLiteral("access-token"),
                              QStringLiteral("lucy-2.6"), QStringLiteral("standard"));
        QTRY_VERIFY_WITH_TIMEOUT(!api.requestsFor(QStringLiteral("/api/v1/realtime")).isEmpty(), 5000);
        const auto request = api.requestsFor(QStringLiteral("/api/v1/realtime")).first();
        QCOMPARE(request.headers.value(QStringLiteral("authorization")), QByteArray("Bearer access-token"));
        const QUrlQuery query(QUrl(request.target));
        QCOMPARE(query.queryItemValue(QStringLiteral("product")), QStringLiteral("livemorph"));
        QCOMPARE(query.queryItemValue(QStringLiteral("frontend_id")), QStringLiteral("livemorph"));
        QCOMPARE(query.queryItemValue(QStringLiteral("model")), QStringLiteral("lucy-2.6"));
        QCOMPARE(query.queryItemValue(QStringLiteral("tier")), QStringLiteral("standard"));
        QVERIFY(!query.hasQueryItem(QStringLiteral("token")));

        api.sendJson(QStringLiteral("/api/v1/realtime"), {
            {QStringLiteral("type"), QStringLiteral("session_id")},
            {QStringLiteral("session_id"), QStringLiteral("session-1")},
        });
        QTRY_COMPARE_WITH_TIMEOUT(client.sessionId(), QStringLiteral("session-1"), 5000);
        QVERIFY(sessionChanged.count() >= 1);
        api.sendJson(QStringLiteral("/api/v1/realtime"), {
            {QStringLiteral("type"), QStringLiteral("generation_tick")},
            {QStringLiteral("seconds"), 4.5},
        });
        QTRY_COMPARE_WITH_TIMEOUT(tick.count(), 1, 5000);
        QCOMPARE(tick.first().at(0).toDouble(), 4.5);

        client.sendPrompt(QStringLiteral("test prompt"), false);
        QTRY_VERIFY_WITH_TIMEOUT(!api.m_textMessages.isEmpty(), 5000);
        const auto prompt = api.m_textMessages.last().second;
        QCOMPARE(prompt.value(QStringLiteral("type")).toString(), QStringLiteral("prompt"));
        QCOMPARE(prompt.value(QStringLiteral("prompt")).toString(), QStringLiteral("test prompt"));
        QCOMPARE(prompt.value(QStringLiteral("enhance_prompt")).toBool(), false);

        client.sendSetImage(QStringLiteral("data:image/jpeg;base64,YWJj"), QStringLiteral("image prompt"));
        QTRY_COMPARE_WITH_TIMEOUT(api.m_textMessages.size(), 2, 5000);
        const auto image = api.m_textMessages.last().second;
        QCOMPARE(image.value(QStringLiteral("type")).toString(), QStringLiteral("set_image"));
        QCOMPARE(image.value(QStringLiteral("image_data")).toString(), QStringLiteral("YWJj"));

        api.sendJson(QStringLiteral("/api/v1/realtime"), {
            {QStringLiteral("type"), QStringLiteral("error")},
            {QStringLiteral("error"), QStringLiteral("insufficient_credits")},
            {QStringLiteral("code"), QStringLiteral("insufficient_credits")},
        });
        QTRY_COMPARE_WITH_TIMEOUT(error.count(), 1, 5000);
        QCOMPARE(error.first().at(1).toString(), QStringLiteral("insufficient_credits"));
        client.disconnectFromProxy();
    }

    void session_manager_runs_rest_then_websocket_and_ends_intent() {
        LoopbackApi api;
        QVERIFY(api.start());
        api.responder = [](const RecordedRequest &request) {
            if (request.path == QLatin1String("/api/v1/streaming/session-start"))
                return MockResponse{200, QStringLiteral("{\"session_id\":\"rest-session-1\",\"model\":\"lucy-2.6\",\"realtime_url\":\"ws://127.0.0.1/untrusted\"}").toUtf8(), 100};
            if (request.path == QLatin1String("/api/v1/webrtc/ice-servers"))
                return MockResponse{200, R"({"iceServers":[{"urls":"stun:127.0.0.1:3478"}]})", 0};
            if (request.path == QLatin1String("/api/v1/health"))
                return MockResponse{200, R"({"version":"1.8.0"})", 0};
            if (request.path == QLatin1String("/api/v1/auth/me"))
                return MockResponse{200, R"({"id":"user-1","email":"user@example.com","credit_balance":1000,"bonus_balance":0,"tier":"free"})", 0};
            return MockResponse{};
        };
        ConfigManager config;
        BackendClient backend;
        backend.setBaseUrl(api.baseUrl());
        AuthManager auth(&config, &backend);
        WebRtcSignalingClient signaling;
        signaling.setTokenProvider([&auth]() { return auth.accessToken(); });
        SessionManager session(&auth, &config, &backend, &signaling);
        session.setActiveCharacter(QStringLiteral("character-1"), QStringLiteral("Character"), {}, QStringLiteral("prompt"));
        auth.applyOAuthTokens(QStringLiteral("access-token"), QStringLiteral("refresh-token"), 900,
                              QStringLiteral("user@example.com"));
        auth.applyBalance(1000, 0);
        backend.fetchIceServers();
        QTRY_VERIFY_WITH_TIMEOUT(!backend.iceServerUrls().isEmpty(), 5000);
        QSignalSpy started(&session, &SessionManager::sessionStarted);
        session.startSession(QStringLiteral("decart"), QStringLiteral("standard"));
        QTRY_COMPARE_WITH_TIMEOUT(api.requestsFor(QStringLiteral("/api/v1/streaming/session-start")).size(), 1, 5000);
        QCOMPARE(api.requestsFor(QStringLiteral("/api/v1/realtime")).size(), 0);
        const auto startRequest = api.requestsFor(QStringLiteral("/api/v1/streaming/session-start")).first();
        const auto startBody = QJsonDocument::fromJson(startRequest.body).object();
        QCOMPARE(startBody.value(QStringLiteral("model")).toString(), QStringLiteral("lucy-2.6"));
        QCOMPARE(startBody.value(QStringLiteral("character_id")).toString(), QStringLiteral("character-1"));
        QCOMPARE(startBody.value(QStringLiteral("tier")).toString(), QStringLiteral("standard"));
        QCOMPARE(startRequest.headers.value(QStringLiteral("authorization")), QByteArray("Bearer access-token"));
        QTRY_COMPARE_WITH_TIMEOUT(api.requestsFor(QStringLiteral("/api/v1/realtime")).size(), 1, 5000);
        QTRY_COMPARE_WITH_TIMEOUT(started.count(), 1, 5000);
        auto lastPrompt = [&api]() {
            QString prompt;
            for (const auto &message : api.m_textMessages)
                if (message.second.value(QStringLiteral("type")).toString() == QLatin1String("prompt"))
                    prompt = message.second.value(QStringLiteral("prompt")).toString();
            return prompt;
        };
        session.setIdentityLockEnabled(false);
        session.setActivePrompt(QStringLiteral("base"));
        session.setScenePrompt(QStringLiteral("space station"));
        session.setSceneEnabled(true);
        QTRY_VERIFY_WITH_TIMEOUT(lastPrompt().contains(QStringLiteral("set in space station")), 5000);
        session.setSceneEnabled(false);
        QTRY_COMPARE_WITH_TIMEOUT(lastPrompt(), QStringLiteral("base"), 5000);
        session.setIdentityLockEnabled(true);
        QTRY_VERIFY_WITH_TIMEOUT(lastPrompt().contains(QStringLiteral("real face, identity")), 5000);
        session.setHdActive(true);
        QVERIFY(!session.hdActive());
        session.stopSession();
        QTRY_COMPARE_WITH_TIMEOUT(api.requestsFor(QStringLiteral("/api/v1/streaming/end")).size(), 1, 5000);
        const auto endBody = QJsonDocument::fromJson(api.requestsFor(QStringLiteral("/api/v1/streaming/end")).first().body).object();
        QCOMPARE(endBody.value(QStringLiteral("session_id")).toString(), QStringLiteral("rest-session-1"));
        QCOMPARE(endBody.value(QStringLiteral("reason")).toString(), QStringLiteral("client"));
        QVERIFY(!session.isActive());
    }

    void turn_urls_normalize_and_preserve_credentials() {
        LoopbackApi api;
        QVERIFY(api.start());
        api.responder = [](const RecordedRequest &request) {
            if (request.path == QLatin1String("/api/v1/streaming/session-start"))
                return MockResponse{200, R"({"session_id":"turn-rest-session","model":"lucy-2.6"})", 0};
            if (request.path == QLatin1String("/api/v1/webrtc/ice-servers"))
                return MockResponse{200, R"({"iceServers":[{"urls":"stun:127.0.0.1:3478"},{"urls":"turn:127.0.0.1:3478?transport=udp","username":"turn-user","credential":"turn-credential"}]})", 0};
            if (request.path == QLatin1String("/api/v1/health"))
                return MockResponse{200, R"({"version":"1.8.0"})", 0};
            return MockResponse{};
        };
        ConfigManager config;
        BackendClient backend;
        backend.setBaseUrl(api.baseUrl());
        AuthManager auth(&config, &backend);
        WebRtcSignalingClient signaling;
        SessionManager session(&auth, &config, &backend, &signaling);
        session.setActiveCharacter(QStringLiteral("character-1"));
        auth.applyOAuthTokens(QStringLiteral("access-token"), QStringLiteral("refresh-token"), 900);
        auth.applyBalance(1000, 0);
        backend.fetchIceServers();
        QTRY_COMPARE_WITH_TIMEOUT(backend.iceServerUrls().size(), 2, 5000);
        session.startSession(QStringLiteral("decart"), QStringLiteral("standard"));
        GstRtcPeer *peer = nullptr;
        QTRY_VERIFY_WITH_TIMEOUT((peer = session.findChild<GstRtcPeer *>()) != nullptr, 5000);
        QCOMPARE(peer->stunServer(), QStringLiteral("stun://127.0.0.1:3478"));
        QCOMPARE(peer->turnServer(), QStringLiteral("turn://turn-user:turn-credential@127.0.0.1:3478?transport=udp"));
        session.stopSession();
    }

    void rejected_session_start_never_opens_realtime() {
        LoopbackApi api;
        QVERIFY(api.start());
        api.responder = [](const RecordedRequest &request) {
            if (request.path == QLatin1String("/api/v1/streaming/session-start"))
                return MockResponse{402, R"({"error":"insufficient_credits","message":"insufficient credits"})", 0};
            if (request.path == QLatin1String("/api/v1/health"))
                return MockResponse{200, R"({"version":"1.8.0"})", 0};
            return MockResponse{};
        };
        ConfigManager config;
        BackendClient backend;
        backend.setBaseUrl(api.baseUrl());
        AuthManager auth(&config, &backend);
        WebRtcSignalingClient signaling;
        SessionManager session(&auth, &config, &backend, &signaling);
        session.setActiveCharacter(QStringLiteral("character-1"));
        auth.applyOAuthTokens(QStringLiteral("access-token"), QStringLiteral("refresh-token"), 900);
        auth.applyBalance(1000, 0);
        QSignalSpy error(&session, &SessionManager::error);
        session.startSession(QStringLiteral("decart"), QStringLiteral("standard"));
        QTRY_VERIFY_WITH_TIMEOUT(!session.isActive(), 5000);
        QTRY_COMPARE_WITH_TIMEOUT(error.count(), 1, 5000);
        QCOMPARE(api.requestsFor(QStringLiteral("/api/v1/realtime")).size(), 0);
        QCOMPARE(session.statusEnum(), SessionManager::Status::Error);
    }

    void cancelled_session_start_fences_late_success() {
        LoopbackApi api;
        QVERIFY(api.start());
        api.responder = [](const RecordedRequest &request) {
            if (request.path == QLatin1String("/api/v1/streaming/session-start"))
                return MockResponse{200, R"({"session_id":"late-rest-session","model":"lucy-2.6"})", 200};
            if (request.path == QLatin1String("/api/v1/health"))
                return MockResponse{200, R"({"version":"1.8.0"})", 0};
            return MockResponse{};
        };
        ConfigManager config;
        BackendClient backend;
        backend.setBaseUrl(api.baseUrl());
        AuthManager auth(&config, &backend);
        WebRtcSignalingClient signaling;
        SessionManager session(&auth, &config, &backend, &signaling);
        session.setActiveCharacter(QStringLiteral("character-1"));
        auth.applyOAuthTokens(QStringLiteral("access-token"), QStringLiteral("refresh-token"), 900);
        auth.applyBalance(1000, 0);
        session.startSession(QStringLiteral("decart"), QStringLiteral("standard"));
        QTRY_COMPARE_WITH_TIMEOUT(api.requestsFor(QStringLiteral("/api/v1/streaming/session-start")).size(), 1, 5000);
        session.stopSession();
        QTRY_COMPARE_WITH_TIMEOUT(api.requestsFor(QStringLiteral("/api/v1/streaming/end")).size(), 1, 5000);
        QCOMPARE(api.requestsFor(QStringLiteral("/api/v1/realtime")).size(), 0);
        const auto endBody = QJsonDocument::fromJson(api.requestsFor(QStringLiteral("/api/v1/streaming/end")).first().body).object();
        QCOMPARE(endBody.value(QStringLiteral("session_id")).toString(), QStringLiteral("late-rest-session"));
        QCOMPARE(endBody.value(QStringLiteral("reason")).toString(), QStringLiteral("superseded"));
    }

    void balance_socket_sends_keepalive() {
        LoopbackApi api;
        QVERIFY(api.start());
        api.responder = [](const RecordedRequest &) {
            return MockResponse{200, R"({"version":"1.8.0"})", 0};
        };
        ConfigManager config;
        BackendClient backend;
        backend.setBaseUrl(api.baseUrl());
        AuthManager auth(&config, &backend);
        auth.applyOAuthTokens(QStringLiteral("access-token"), QStringLiteral("refresh-token"), 900);
        QTRY_COMPARE_WITH_TIMEOUT(api.requestsFor(QStringLiteral("/api/v1/ws")).size(), 1, 5000);
        QWebSocket *socket = auth.findChild<QWebSocket *>();
        QVERIFY(socket);
        QTRY_COMPARE_WITH_TIMEOUT(socket->state(), QAbstractSocket::ConnectedState, 5000);
        QTRY_VERIFY_WITH_TIMEOUT([&api]() {
            return std::any_of(api.m_textMessages.cbegin(), api.m_textMessages.cend(), [](const auto &message) {
                return message.first == QLatin1String("/api/v1/ws")
                       && message.second.value(QStringLiteral("type")).toString() == QLatin1String("ping");
            });
        }(), 35000);
        auth.disconnectBalanceSocket();
    }

    void stream_url_masks_qml_secret_but_copy_preserves_function() {
        QTcpServer reservation;
        QVERIFY(reservation.listen(QHostAddress::LocalHost, 0));
        const quint16 port = reservation.serverPort();
        reservation.close();
        StreamServer server;
        server.setPort(port);
        server.start();
        QVERIFY(server.running());
        const QUrl full(server.url());
        const QString token = QUrlQuery(full).queryItemValue(QStringLiteral("token"));
        QVERIFY(token.size() >= 16);
        VirtualCameraHelper helper(&server);
        QCOMPARE(helper.obsBrowserSourceUrl(), server.urlDisplay());
        QVERIFY(!helper.obsBrowserSourceUrl().contains(token));
        helper.copyObsUrl();
        QCOMPARE(QGuiApplication::clipboard()->text(), server.url());

        QTcpSocket unauthorized;
        unauthorized.connectToHost(QHostAddress::LocalHost, port);
        QVERIFY(unauthorized.waitForConnected(1000));
        unauthorized.write("GET /stream HTTP/1.0\r\n\r\n");
        QTRY_VERIFY_WITH_TIMEOUT(unauthorized.bytesAvailable() > 0, 3000);
        QVERIFY(unauthorized.readAll().startsWith("HTTP/1.1 401"));
        unauthorized.disconnectFromHost();

        QTcpSocket authorized;
        authorized.connectToHost(QHostAddress::LocalHost, port);
        QVERIFY(authorized.waitForConnected(1000));
        const QByteArray target = full.path().toUtf8() + "?" + full.query().toUtf8();
        authorized.write("GET " + target + " HTTP/1.0\r\n\r\n");
        QTRY_VERIFY_WITH_TIMEOUT(authorized.bytesAvailable() > 0, 3000);
        QVERIFY(authorized.readAll().startsWith("HTTP/1.0 200"));
        authorized.disconnectFromHost();
        server.stop();
    }

    void orphan_recovery_never_clobbers_existing_recording() {
        ConfigManager config;
        BackendClient backend;
        RecordingManager manager(&config, &backend);
        const QString root = QStandardPaths::writableLocation(QStandardPaths::MoviesLocation)
                             + QStringLiteral("/LiveMorphAuditOrphan");
        struct Cleanup {
            QString path;
            ~Cleanup() { QDir(path).removeRecursively(); }
        } cleanup{root};
        QVERIFY(QDir().mkpath(root));
        manager.setOutputDirectory(root);
        const QString finalPath = root + QStringLiteral("/LiveMorph_existing.mp4");
        const QString partPath = finalPath + QStringLiteral(".part");
        auto write = [](const QString &path, const QByteArray &contents) {
            QFile file(path);
            if (!file.open(QIODevice::WriteOnly | QIODevice::Truncate))
                return false;
            return file.write(contents) == contents.size();
        };
        auto read = [](const QString &path) {
            QFile file(path);
            if (!file.open(QIODevice::ReadOnly))
                return QByteArray();
            return file.readAll();
        };
        QVERIFY(write(finalPath, "original"));
        QVERIFY(write(partPath, "orphan"));
        manager.recoverOrphan(partPath);
        QCOMPARE(read(finalPath), QByteArray("original"));
        QVERIFY(!manager.lastRecordingPath().isEmpty());
        QVERIFY(manager.lastRecordingPath() != finalPath);
        QCOMPARE(read(manager.lastRecordingPath()), QByteArray("orphan"));
    }

    void user_character_crud_stays_synchronized() {
        CharacterCatalogModel model;
        model.load();
        QVariantMap server{
            {QStringLiteral("id"), QStringLiteral("server-1")},
            {QStringLiteral("name"), QStringLiteral("Local")},
            {QStringLiteral("prompt"), QStringLiteral("hello")},
            {QStringLiteral("image_url"), QString()},
            {QStringLiteral("is_favorite"), false},
        };
        model.mergeUserCharacters({server});
        const int serverIndex = model.indexOfId(QStringLiteral("server-1"));
        QVERIFY(serverIndex >= 0);
        QVERIFY(model.get(serverIndex).value(QStringLiteral("isUserOwned")).toBool());
        QSignalSpy create(&model, &CharacterCatalogModel::characterCreateRequested);
        const QString localId = model.addUserCharacter(QStringLiteral("Local"), {}, QStringLiteral("hello"));
        QVERIFY(localId.startsWith(QStringLiteral("preset-")));
        QCOMPARE(create.count(), 1);
        model.upsertUserCharacter(server);
        QCOMPARE(model.indexOfId(localId), -1);
        QVERIFY(model.indexOfId(QStringLiteral("server-1")) >= 0);
        QSignalSpy update(&model, &CharacterCatalogModel::characterUpdateRequested);
        model.renameCharacter(QStringLiteral("server-1"), QStringLiteral("Renamed"));
        QCOMPARE(update.count(), 1);
        QCOMPARE(update.first().at(0).toString(), QStringLiteral("server-1"));
        QCOMPARE(update.first().at(1).toString(), QStringLiteral("Renamed"));
        model.loadFromBackend({QVariantMap{
            {QStringLiteral("id"), QStringLiteral("global-1")},
            {QStringLiteral("name"), QStringLiteral("Global")},
            {QStringLiteral("prompt"), QStringLiteral("global prompt")},
            {QStringLiteral("category"), QStringLiteral("Fantasy")},
        }});
        QVERIFY(model.indexOfId(QStringLiteral("server-1")) >= 0);
        CharacterCatalogModel restored;
        restored.load();
        QVERIFY(restored.indexOfId(QStringLiteral("server-1")) >= 0);
        QSignalSpy deleted(&model, &CharacterCatalogModel::characterDeleteRequested);
        model.deleteCharacter(QStringLiteral("server-1"));
        QCOMPARE(deleted.count(), 1);
        const QString localOnly = model.addUserCharacter(QStringLiteral("Offline"), {}, QStringLiteral("offline prompt"));
        model.deleteCharacter(localOnly);
        QCOMPARE(deleted.count(), 1);
    }

    void offline_auth_never_uses_debug_bypass() {
        qputenv("LIVEMORPH_DEV_AUTH", "1");
        QTcpServer closedPort;
        QVERIFY(closedPort.listen(QHostAddress::LocalHost, 0));
        const quint16 port = closedPort.serverPort();
        closedPort.close();
        ConfigManager config;
        BackendClient backend;
        backend.setBaseUrl(QStringLiteral("http://127.0.0.1:%1").arg(port));
        AuthManager auth(&config, &backend);
        auth.requestOtp(QStringLiteral("user@example.com"));
        QTRY_VERIFY_WITH_TIMEOUT(!auth.errorMessage().isEmpty(), 5000);
        QVERIFY(!auth.otpSent());
        auth.verifyOtp(QStringLiteral("user@example.com"), QStringLiteral("12345678"));
        QTRY_VERIFY_WITH_TIMEOUT(!auth.errorMessage().isEmpty(), 5000);
        QVERIFY(!auth.isAuthenticated());
        QVERIFY(auth.accessToken().isEmpty());
        qunsetenv("LIVEMORPH_DEV_AUTH");
    }
};

int main(int argc, char **argv) {
    qputenv("QT_QPA_PLATFORM", "offscreen");
    QGuiApplication app(argc, argv);
    QCoreApplication::setOrganizationName(QStringLiteral("LiveMorphAudit"));
    QCoreApplication::setApplicationName(QStringLiteral("LiveMorphAudit"));
    QStandardPaths::setTestModeEnabled(true);
    FrontendIntegrationTest test;
    return QTest::qExec(&test, argc, argv);
}

#include "frontend_integration.moc"
