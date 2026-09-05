#include <QApplication>
#include <QGuiApplication>
#include <QtGlobal>
#include <QCoreApplication>
#include <QQmlApplicationEngine>
#include <QtQml>
#include <QQmlContext>
#include <QQuickStyle>
#include <QPalette>
#include <QColor>
#include <QIcon>
#include <QTranslator>
#include <QLocale>
#include <QBuffer>
#include <QImage>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonParseError>

#include "core/AppController.h"
#include "core/Notifier.h"
#include "core/AuthManager.h"
#include "core/SessionManager.h"
#include "core/CameraManager.h"
#include "core/RecordingManager.h"
#include "core/ConfigManager.h"
#include "core/I18nManager.h"
#include "models/CharacterCatalogModel.h"
#include "models/PresetModel.h"
#include "services/BackendClient.h"
#include "services/WebRtcSignalingClient.h"
#include "core/StreamServer.h"
#include <QTimer>
#include "core/VirtualCameraHelper.h"

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);
    app.setOrganizationName(QStringLiteral("LiveMorph"));
    app.setOrganizationDomain(QStringLiteral("livemorph.com"));
    app.setApplicationName(QStringLiteral("LiveMorph"));
    app.setApplicationVersion(QStringLiteral("1.8.0"));
    app.setWindowIcon(QIcon(QStringLiteral(":/assets/livemorph-icon.png")));

    QQuickStyle::setStyle(QStringLiteral("Basic"));

    // App-wide dark palette (stops light OS chrome bleeding into QML controls)
    QPalette dark;
    dark.setColor(QPalette::Window, QColor(0x08, 0x08, 0x0c));
    dark.setColor(QPalette::WindowText, QColor(0xed, 0xed, 0xf2));
    dark.setColor(QPalette::Base, QColor(0x14, 0x14, 0x1c));
    dark.setColor(QPalette::AlternateBase, QColor(0x0e, 0x0e, 0x14));
    dark.setColor(QPalette::Text, QColor(0xed, 0xed, 0xf2));
    dark.setColor(QPalette::Button, QColor(0x0e, 0x0e, 0x14));
    dark.setColor(QPalette::ButtonText, QColor(0xed, 0xed, 0xf2));
    dark.setColor(QPalette::Highlight, QColor(0x8b, 0x5c, 0xf6));
    dark.setColor(QPalette::HighlightedText, QColor(0x08, 0x08, 0x0c));
    dark.setColor(QPalette::PlaceholderText, QColor(0x6a, 0x6a, 0x7a));
    app.setPalette(dark);

    auto *config    = new ConfigManager(&app);
    fprintf(stderr, "config OK\n");
    auto *backend   = new BackendClient(&app);
    fprintf(stderr, "backend OK\n");
    backend->setBaseUrl(config->apiBaseUrl());
    backend->fetchBootstrap();
    // BackendClient has its own internal 15s ping timer; no need for a second one.
    QObject::connect(config, &ConfigManager::apiBaseUrlChanged, backend, [backend, config]() {
        backend->setBaseUrl(config->apiBaseUrl());
        backend->ping();
    });
    auto *signaling = new WebRtcSignalingClient(&app);
    fprintf(stderr, "signaling OK\n");
    /* camera bound below */
    auto *auth      = new AuthManager(config, backend, &app);
    auto *session   = new SessionManager(auth, config, backend, signaling, &app);
    // Server-side force disconnect (credits depleted / revoked) stops the morph.
    QObject::connect(auth, &AuthManager::forceDisconnected, session, [session](const QString &) {
        if (session->isActive())
            session->stopSession();
    });
    auto *camera    = new CameraManager(&app);
    session->setCameraManager(camera);
    auto *recording = new RecordingManager(config, backend, camera, &app);
    auto *streamServer = new StreamServer(&app);
    auto *vcam = new VirtualCameraHelper(streamServer, &app);
    streamServer->setPort(config->streamPort());
    QObject::connect(config, &ConfigManager::streamPortChanged, streamServer, [streamServer, config]() {
        streamServer->setPort(config->streamPort());
    });
    auto *catalog   = new CharacterCatalogModel(&app);
    auto *presets   = new PresetModel(&app);
    auto *appCtrl   = new AppController(auth, session, camera, recording, config, catalog, presets, &app);
    fprintf(stderr, "appCtrl OK\n");
    auto *notifier  = new Notifier(&app);

    // Single notification funnel: C++ signals → Notifier store → toast + center.
    QObject::connect(appCtrl, &AppController::notification, notifier,
                     [notifier](const QString &message, const QString &type) {
                         notifier->push(message, QString(), type, QString());
                     });
    QObject::connect(appCtrl, &AppController::errorOccurred, notifier,
                     [notifier](const QString &title, const QString &message) {
                         notifier->push(title, message, QStringLiteral("error"), QString());
                     });

    QObject::connect(streamServer, &StreamServer::error, appCtrl, [appCtrl](const QString &msg) {
        appCtrl->notify(msg, QStringLiteral("error"));
    });

    catalog->setHideStarters(!config->showBuiltinCharacters());
    QObject::connect(config, &ConfigManager::showBuiltinCharactersChanged, catalog, [catalog, config]() {
        catalog->setHideStarters(!config->showBuiltinCharacters());
    });

    QObject::connect(backend, &BackendClient::catalogReceived, catalog,
                     [catalog](const QVariantList &entries) {
                         catalog->loadFromBackend(entries);
                     });

    // Camera mirror preference from settings
    camera->setMirrored(config->mirrorCamera());
    QObject::connect(config, &ConfigManager::mirrorCameraChanged, camera, [camera, config]() {
        camera->setMirrored(config->mirrorCamera());
    });

    // Morph (AI output) frames — the GStreamer tee — feed OBS MJPEG, vcam and
    // the recording sidecar so downstream captures the swapped output (not raw camera).
    QObject::connect(session, &SessionManager::morphFrameReady, streamServer,
                     [streamServer, vcam, recording](const QImage &img) {
                         const bool needStream = streamServer->running();
                         const bool needVcam = vcam->active();
                         const bool needRec = recording->isRecording();
                         if (!needStream && !needVcam && !needRec)
                             return;
                         if (needStream)
                             streamServer->pushFrame(img);
                         if (needVcam)
                             vcam->pushFrame(img);
                         if (needRec) {
                             QByteArray j;
                             QBuffer b(&j);
                             b.open(QIODevice::WriteOnly);
                             img.save(&b, "JPG", 60);
                             recording->pushChunk(j);
                         }
                     });

    QQmlApplicationEngine engine;
    auto *i18n = new I18nManager(&engine, &app);
    auto *ctx = engine.rootContext();
    ctx->setContextProperty(QStringLiteral("App"), appCtrl);
    ctx->setContextProperty(QStringLiteral("Auth"), auth);
    ctx->setContextProperty(QStringLiteral("Session"), session);
    ctx->setContextProperty(QStringLiteral("Camera"), camera);
    ctx->setContextProperty(QStringLiteral("Recording"), recording);
    ctx->setContextProperty(QStringLiteral("StreamServer"), streamServer);
    ctx->setContextProperty(QStringLiteral("VirtualCamera"), vcam);

    // Backend VC API is intent-only; fulfill with local MJPEG StreamServer (Electron parity)
    QObject::connect(backend, &BackendClient::virtualCameraStarted, streamServer, [streamServer](const QVariantMap &) {
        streamServer->startAsVirtualCamera();
    });
    QObject::connect(backend, &BackendClient::virtualCameraStopped, streamServer, [streamServer](const QVariantMap &) {
        streamServer->stopVirtualCamera();
    });

    ctx->setContextProperty(QStringLiteral("Config"), config);
    engine.rootContext()->setContextProperty(QStringLiteral("I18n"), i18n);
    ctx->setContextProperty(QStringLiteral("Notifier"), notifier);
    ctx->setContextProperty(QStringLiteral("Catalog"), catalog);
    ctx->setContextProperty(QStringLiteral("Presets"), presets);
    ctx->setContextProperty(QStringLiteral("Backend"), backend);
    ctx->setContextProperty(QStringLiteral("Signaling"), signaling);

    qmlRegisterUncreatableType<AuthManager>("LiveMorph", 1, 0, "AuthManager", QStringLiteral("Singleton"));
    qmlRegisterUncreatableType<SessionManager>("LiveMorph", 1, 0, "SessionManager", QStringLiteral("Singleton"));
    qmlRegisterUncreatableType<CameraManager>("LiveMorph", 1, 0, "CameraManager", QStringLiteral("Singleton"));
    qmlRegisterUncreatableType<BackendClient>("LiveMorph", 1, 0, "BackendClient", QStringLiteral("Singleton"));

    // Signal connections must be registered BEFORE engine.load to avoid
    // missing early-fired signals during QML initialization.
    QObject::connect(backend, &BackendClient::paymentOrderVerified, auth,
                     [auth](const QVariantMap &result) {
                         const auto bal = result.value(QStringLiteral("balance")).toMap();
                         if (bal.contains(QStringLiteral("credit_balance"))) {
                             auth->applyBalance(bal.value(QStringLiteral("credit_balance")).toDouble(),
                                                bal.value(QStringLiteral("bonus_balance")).toDouble());
                         } else {
                             auth->refreshProfile();
                         }
                     });

    QObject::connect(backend, &BackendClient::creditsBalanceReceived, auth,
                     [auth](const QVariantMap &bal) {
                         auth->applyBalance(bal.value(QStringLiteral("credit_balance")).toDouble(),
                                            bal.value(QStringLiteral("bonus_balance")).toDouble());
                     });

    QObject::connect(auth, &AuthManager::signedIn, backend, [backend]() {
        backend->fetchCreditsBalance();
        backend->fetchCatalog();
        backend->fetchPaymentPackages();
    });

    QObject::connect(backend, &BackendClient::reachableChanged, backend, [backend]() {
        if (backend->reachable())
            backend->fetchCatalog();
    });

    const QUrl url(QStringLiteral("qrc:/qt/qml/LiveMorph/qml/main.qml"));
    QObject::connect(&engine, &QQmlApplicationEngine::objectCreationFailed,
                     &app, []() { QCoreApplication::exit(-1); },
                     Qt::QueuedConnection);
    engine.load(url);
    QObject::connect(&app, &QCoreApplication::aboutToQuit, &app, [streamServer, vcam, session, recording]() {
        if (session && session->isActive())
            session->stopSession();
        if (recording && recording->isRecording())
            recording->stopRecording(QStringLiteral("quit"));
        if (vcam && vcam->active())
            vcam->stop();
        if (streamServer && streamServer->running())
            streamServer->stop();
    });

    // Deep links from argv (protocol handler / second instance)
    for (const QString &arg : app.arguments()) {
        if (arg.startsWith(QLatin1String("livemorph://")) || arg.contains(QLatin1String("payments/callback")))
            appCtrl->handleDeepLink(arg);
    }

    return app.exec();
}
