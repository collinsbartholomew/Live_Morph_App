#include <QApplication>
#include <QGuiApplication>
#include <QScreen>
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
#include <QFontDatabase>

#include "core/AppController.h"
#include "core/Notifier.h"
#include "core/AuthManager.h"
#include "core/SessionManager.h"
#include "core/CameraManager.h"
#include "core/RecordingManager.h"
#include "core/ConfigManager.h"
#include "I18nManager.h"
#include "models/CharacterCatalogModel.h"
#include "models/PresetModel.h"
#include "services/BackendClient.h"
#include "services/WebRtcSignalingClient.h"
#include "StreamServer.h"
#include <QTimer>
#include "core/VirtualCameraHelper.h"

namespace {
QAtomicInt g_qmlVerifyError = 0;
QtMessageHandler g_prevMessageHandler = nullptr;

// In --verify-qml mode, watch for the runtime-only failures that break QML
// component creation. They surface through the "qml" logging category at
// warning-or-above; cmake/qmlcachegen cannot catch them.
void qmlVerifyMessageHandler(QtMsgType type, const QMessageLogContext &ctx, const QString &msg)
{
    if ((type == QtWarningMsg || type == QtCriticalMsg || type == QtFatalMsg)
        && (qstrcmp(ctx.category, "qml") == 0 || qstrcmp(ctx.category, "default") == 0)) {
        fprintf(stderr, "[qml-verify msg] %s: %s\n", ctx.category, msg.toUtf8().constData());
        if (msg.contains(QLatin1String("Cannot assign to non-existent"))
            || msg.contains(QLatin1String("is not a type"))
            || msg.contains(QLatin1String("Cannot create component"))
            || msg.contains(QLatin1String("object creation failed"))
            || msg.contains(QLatin1String("Required property"))) {
            g_qmlVerifyError.storeRelease(1);
        }
    }
    if (g_prevMessageHandler)
        g_prevMessageHandler(type, ctx, msg);
}
} // namespace

int main(int argc, char *argv[])
{
    // --verify-qml: headless self-test — loads the real UI, flips to the
    // dashboard page (forcing every dashboard component to instantiate) and
    // exits non-zero on any QML load error. Regression gate for the class of
    // runtime-only failures ("Cannot assign to non-existent property",
    // missing type imports) that cmake builds cannot catch.
    bool verifyQml = false;
    for (int i = 1; i < argc; ++i) {
        if (qstrcmp(argv[i], "--verify-qml") == 0) {
            verifyQml = true;
            qputenv("QT_QPA_PLATFORM", "offscreen");
            g_prevMessageHandler = qInstallMessageHandler(qmlVerifyMessageHandler);
        }
    }

    QApplication app(argc, argv);
    app.setOrganizationName(QStringLiteral("LiveMorph"));
    app.setOrganizationDomain(QStringLiteral("livemorph.com"));
    app.setApplicationName(QStringLiteral("LiveMorph"));
    app.setApplicationVersion(QStringLiteral("1.8.0"));
    app.setWindowIcon(QIcon(QStringLiteral(":/assets/livemorph-icon.png")));

    // Bundle the app font so it renders identically on every machine —
    // fontconfig-driven fallback was resolving "Inter" to Noto Sans.
    // Maple Mono is OFL-licensed; loaded from embedded resources.
    {
        const QStringList fonts = {
            QStringLiteral(":/fonts/MapleMono-Regular.ttf"),
            QStringLiteral(":/fonts/MapleMono-Light.ttf"),
            QStringLiteral(":/fonts/MapleMono-Bold.ttf"),
        };
        for (const QString &f : fonts) {
            const int id = QFontDatabase::addApplicationFont(f);
            if (id == -1)
                qWarning() << "Failed to load embedded font:" << f;
        }
    }

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
    auto *backend   = new BackendClient(&app);
    backend->setBaseUrl(config->apiBaseUrl());
    backend->fetchBootstrap();
    // fetchFeatureFlags() and fetchMaintenance() are redundant: bootstrap
    // already provides credits.hd_multiplier, ui.maintenance, and feature flags.
    backend->fetchStreamingAvailability();
    // BackendClient has its own internal 15s ping timer; no need for a second one.
    QObject::connect(config, &ConfigManager::apiBaseUrlChanged, backend, [backend, config]() {
        backend->setBaseUrl(config->apiBaseUrl());
        backend->ping();
    });
    auto *signaling = new WebRtcSignalingClient(&app);
    /* camera bound below */
    auto *auth      = new AuthManager(config, backend, &app);
    // A 401 from any backend request refreshes the access token so the app
    // recovers from an expired session instead of failing every call.
    QObject::connect(backend, &BackendClient::authenticationExpired, auth,
                     [auth]() { auth->refreshTokens(); });
    auto *session   = new SessionManager(auth, config, backend, signaling, &app);
    // Server-side force disconnect (credits depleted / revoked) stops the morph.
    QObject::connect(auth, &AuthManager::forceDisconnected, session, [session](const QString &) {
        if (session->isActive())
            session->stopSession();
    });
    auto *camera    = new CameraManager(&app);
    session->setCameraManager(camera);
    auto *recording = new RecordingManager(config, backend, camera, session, &app);
    auto *streamServer = new StreamServer(&app);
    auto *vcam = new VirtualCameraHelper(streamServer, &app);
    streamServer->setPort(config->streamPort());
    QObject::connect(config, &ConfigManager::streamPortChanged, streamServer, [streamServer, config]() {
        streamServer->setPort(config->streamPort());
    });
    auto *catalog   = new CharacterCatalogModel(&app);
    auto *presets   = new PresetModel(&app);
    auto *appCtrl   = new AppController(auth, session, camera, recording, config, catalog, presets, &app);
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

    // Enable HD tier selector when bootstrap advertises hd_multiplier > 1.
    QObject::connect(backend, &BackendClient::bootstrapLoaded, appCtrl,
                     [appCtrl](const QVariantMap &b) {
                         const QVariantMap credits = b.value(QStringLiteral("credits")).toMap();
                         const double hdMult = credits.value(QStringLiteral("hd_multiplier"), 1.0).toDouble();
                         appCtrl->setHdAvailable(hdMult > 1.0);
                     });

    QObject::connect(catalog, &CharacterCatalogModel::characterDeleteRequested, backend,
                     [backend](const QString &id) {
                         backend->deleteUserCharacter(id);
                     });

    // Camera mirror preference from settings
    camera->setMirrored(config->mirrorCamera());
    QObject::connect(config, &ConfigManager::mirrorCameraChanged, camera, [camera, config]() {
        camera->setMirrored(config->mirrorCamera());
    });

    // Morph (AI output) frames — the GStreamer tee — feed OBS MJPEG and vcam so
    // downstream captures the swapped output (not raw camera).
    QObject::connect(session, &SessionManager::morphFrameReady, streamServer,
                     [streamServer, vcam](const QImage &img) {
                         const bool needStream = streamServer->running();
                         const bool needVcam = vcam->active();
                         if (!needStream && !needVcam)
                             return;
                         if (needStream)
                             streamServer->pushFrame(img);
                         if (needVcam)
                             vcam->pushFrame(img);
                     });

    QQmlApplicationEngine engine;
    auto *i18n = new I18nManager(&engine, QStringLiteral("LiveMorph"),
                                   QStringLiteral(":/i18n/livemorph_en.ts"), &app);
    auto *ctx = engine.rootContext();
    ctx->setContextProperty(QStringLiteral("App"), appCtrl);
    ctx->setContextProperty(QStringLiteral("Auth"), auth);
    ctx->setContextProperty(QStringLiteral("Session"), session);
    ctx->setContextProperty(QStringLiteral("CameraCtrl"), camera);
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

    // Restore window geometry (Electron parity: saves/restores window size & position).
    // Guard on "width" — the save path never writes "geometry", so the old
    // contains("geometry") check made this whole block dead code. Clamp x/y
    // to the available screen so a unplugged monitor doesn't strand the window.
    if (engine.rootObjects().size() > 0) {
        auto *rootObj = engine.rootObjects().first();
        QSettings winSettings;
        winSettings.beginGroup(QStringLiteral("Window"));
        if (winSettings.contains("width")) {
            const int w = winSettings.value("width", 1280).toInt();
            const int h = winSettings.value("height", 800).toInt();
            int x = winSettings.value("x", -1).toInt();
            int y = winSettings.value("y", -1).toInt();
            const QList<QScreen *> screens = QGuiApplication::screens();
            bool onScreen = false;
            for (QScreen *s : screens) {
                const QRect g = s->availableGeometry();
                if (g.intersects(QRect(x, y, w, h))) { onScreen = true; break; }
            }
            if (!onScreen && !screens.isEmpty()) {
                const QRect primary = screens.first()->availableGeometry();
                x = primary.x() + 80;
                y = primary.y() + 80;
            }
            rootObj->setProperty("width", w);
            rootObj->setProperty("height", h);
            rootObj->setProperty("x", x);
            rootObj->setProperty("y", y);
        }
        winSettings.endGroup();
    }

    if (verifyQml) {
        QTimer::singleShot(1500, &app, [appCtrl]() {
            // Force every dashboard component (TopBar, WorkshopPanel →
            // UploadTab/CustomizeForm, PresetGrid, drawers, tour…) to load.
            appCtrl->setCurrentPage(QStringLiteral("dashboard"));
            QTimer::singleShot(1200, qApp, []() {
                const bool failed = g_qmlVerifyError;
                fprintf(stderr, "[qml-verify] %s\n", failed ? "FAIL" : "PASS");
                QCoreApplication::exit(failed ? 3 : 0);
            });
        });
    }
    QObject::connect(&app, &QCoreApplication::aboutToQuit, &app, [streamServer, vcam, session, recording, &engine]() {
        if (session && session->isActive())
            session->stopSession();
        if (recording && recording->isRecording())
            recording->stopRecording(QStringLiteral("quit"));
        if (vcam && vcam->active())
            vcam->stop();
        if (streamServer && streamServer->running())
            streamServer->stop();
        // Save window geometry
        if (engine.rootObjects().size() > 0) {
            auto *rootObj = engine.rootObjects().first();
            QSettings winSettings;
            winSettings.beginGroup(QStringLiteral("Window"));
            winSettings.setValue("width", rootObj->property("width").toInt());
            winSettings.setValue("height", rootObj->property("height").toInt());
            winSettings.setValue("x", rootObj->property("x").toInt());
            winSettings.setValue("y", rootObj->property("y").toInt());
            winSettings.endGroup();
        }
    });

    // Deep links from argv (protocol handler / second instance)
    for (const QString &arg : app.arguments()) {
        if (arg.startsWith(QLatin1String("livemorph://")) || arg.contains(QLatin1String("payments/callback")))
            appCtrl->handleDeepLink(arg);
    }

    return app.exec();
}
