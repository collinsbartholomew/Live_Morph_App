#include <QApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQuickStyle>
#include <QQuickWindow>
#include <QFontDatabase>
#include <QTimer>

#include "core/MachineIdProvider.h"
#include "core/ApiClient.h"
#include "core/SessionManager.h"
#include "core/AppController.h"
#include "core/UpdateChecker.h"
#include "core/StreamController.h"
#include "core/WebSocketClient.h"
#include "core/DecartSignalingClient.h"
#include "I18nManager.h"
#include <QtQml>

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);
    QCoreApplication::setApplicationName(QStringLiteral("Smoke Screen"));
    QCoreApplication::setOrganizationName(QStringLiteral("SmokeScreen"));
    QCoreApplication::setApplicationVersion(QStringLiteral("1.8.0"));

    // Typography: Maple Mono NF everywhere (single-family app font).
    QFontDatabase::addApplicationFont(QStringLiteral(":/fonts/MapleMono-NF-Regular.ttf"));
    QFontDatabase::addApplicationFont(QStringLiteral(":/fonts/MapleMono-NF-Medium.ttf"));
    QFontDatabase::addApplicationFont(QStringLiteral(":/fonts/MapleMono-NF-SemiBold.ttf"));
    QFontDatabase::addApplicationFont(QStringLiteral(":/fonts/MapleMono-NF-Bold.ttf"));

    QQuickStyle::setStyle(QStringLiteral("Basic"));

    // Optional override: SMOKE_API_URL=http://localhost:3874
    ApiClient api;
    if (const QByteArray env = qgetenv("SMOKE_API_URL"); !env.isEmpty())
        api.setBaseUrl(QString::fromUtf8(env));

    MachineIdProvider machineId;
    SessionManager session;
    UpdateChecker updater(&api);
    DecartSignalingClient decart;
    StreamController stream(&session, &api, &decart);
    WebSocketClient ws;
    QQmlApplicationEngine engine;
    I18nManager i18n(&engine, QStringLiteral("SmokeScreen"),
                      QStringLiteral(":/i18n/smokescreen_en.ts"));
    AppController controller(&api, &session, &machineId, &updater, &stream, &ws);
    controller.setI18nManager(&i18n);

    auto *ctx = engine.rootContext();
    ctx->setContextProperty(QStringLiteral("App"), &controller);
    ctx->setContextProperty(QStringLiteral("Session"), &session);
    ctx->setContextProperty(QStringLiteral("Api"), &api);
    ctx->setContextProperty(QStringLiteral("MachineId"), &machineId);
    ctx->setContextProperty(QStringLiteral("Stream"), &stream);
    ctx->setContextProperty(QStringLiteral("Mjpeg"), &stream);
    ctx->setContextProperty(QStringLiteral("Ws"), &ws);
    ctx->setContextProperty(QStringLiteral("Decart"), &decart);
    // Visual-regression mode: keep the -geometry window size (no maximize)
    ctx->setContextProperty(QStringLiteral("kNoMaximize"),
                            qEnvironmentVariableIsSet("SMOKE_NO_MAXIMIZE"));
    // Visual-regression aid: force a screen component for captures,
    // bypassing App routing guards (SMOKE_FORCE_SCREEN=accessGate|dashboard|auth)
    ctx->setContextProperty(QStringLiteral("kForceScreen"),
                            QString::fromUtf8(qgetenv("SMOKE_FORCE_SCREEN")));

    QObject::connect(
        &engine, &QQmlApplicationEngine::objectCreationFailed,
        &app, [](const QUrl &url) {
            qCritical().noquote() << "QML object creation failed for:" << url;
            QCoreApplication::exit(-1);
        },
        Qt::QueuedConnection);

    QObject::connect(
        &engine, &QQmlApplicationEngine::warnings,
        &app, [](const QList<QQmlError> &warnings) {
            for (const auto &w : warnings)
                qWarning().noquote() << "QML warning:" << w.toString();
        });

    engine.loadFromModule("SmokeScreen", "Main");
    controller.boot();

    // Visual-regression capture: SMOKE_CAPTURE_TO=/path.png grabs the window
    // after it settles (no compositor/X11 tooling needed). SMOKE_CAPTURE_QUIT=1
    // exits afterwards.
    if (const QByteArray capPath = qgetenv("SMOKE_CAPTURE_TO"); !capPath.isEmpty()) {
        QTimer::singleShot(3500, &app, [&engine, capPath]() {
            if (engine.rootObjects().isEmpty())
                return;
            if (auto *win = qobject_cast<QQuickWindow *>(engine.rootObjects().first())) {
                const QImage img = win->grabWindow();
                if (!img.isNull()) {
                    img.save(QString::fromUtf8(capPath));
                    qInfo().noquote() << "captured to" << QString::fromUtf8(capPath)
                                      << img.width() << "x" << img.height();
                }
            }
            if (qEnvironmentVariableIsSet("SMOKE_CAPTURE_QUIT"))
                QCoreApplication::quit();
        });
    }

    // `smokescreen://` deep links (?token=, ?ref=, ?api= equivalents)
    for (const QString &arg : app.arguments()) {
        if (arg.startsWith(QLatin1String("smokescreen://")))
            controller.handleDeepLink(arg);
    }
    return app.exec();
}
