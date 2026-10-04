#include <QApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQuickStyle>
#include <QFontDatabase>

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
    QCoreApplication::setApplicationName(QStringLiteral("Live Escape"));
    QCoreApplication::setOrganizationName(QStringLiteral("LiveEscape"));
    QCoreApplication::setOrganizationDomain(QStringLiteral("liveescapeapp.com"));
    QCoreApplication::setApplicationVersion(QStringLiteral("1.8.0"));

    // Bundled fonts — match the Electron theme (Inter + JetBrains Mono).
    QFontDatabase::addApplicationFont(QStringLiteral(":/fonts/Inter-Variable.ttf"));
    QFontDatabase::addApplicationFont(QStringLiteral(":/fonts/Rajdhani-Regular.ttf"));
    QFontDatabase::addApplicationFont(QStringLiteral(":/fonts/Rajdhani-Medium.ttf"));
    QFontDatabase::addApplicationFont(QStringLiteral(":/fonts/Rajdhani-SemiBold.ttf"));
    QFontDatabase::addApplicationFont(QStringLiteral(":/fonts/Rajdhani-Bold.ttf"));
    QFontDatabase::addApplicationFont(QStringLiteral(":/fonts/JetBrainsMono-Variable.ttf"));

    QQuickStyle::setStyle(QStringLiteral("Basic"));

    // Optional override: LIVEESCAPE_API_URL=http://localhost:3874
    ApiClient api;
    if (const QByteArray env = qgetenv("LIVEESCAPE_API_URL"); !env.isEmpty())
        api.setBaseUrl(QString::fromUtf8(env));

    MachineIdProvider machineId;
    SessionManager session;
    UpdateChecker updater(&api);
    DecartSignalingClient decart;
    StreamController stream(&session, &api, &decart);
    WebSocketClient ws;
    QQmlApplicationEngine engine;
    I18nManager i18n(&engine, QStringLiteral("LiveEscape"),
                      QStringLiteral(":/i18n/liveescape_en.ts"));
    AppController controller(&api, &session, &machineId, &updater, &stream, &ws);
    controller.setI18nManager(&i18n);

    // Force-update handling is owned by the QML ForceUpdateModal via
    // AppController (modal + download/quit buttons). No native dialog here.

    auto *ctx = engine.rootContext();
    ctx->setContextProperty(QStringLiteral("App"), &controller);
    ctx->setContextProperty(QStringLiteral("Session"), &session);
    ctx->setContextProperty(QStringLiteral("Api"), &api);
    ctx->setContextProperty(QStringLiteral("MachineId"), &machineId);
    ctx->setContextProperty(QStringLiteral("Stream"), &stream);
    // Alias for QML that expects Mjpeg controller (OBS/MJPEG path)
    ctx->setContextProperty(QStringLiteral("Mjpeg"), &stream);
    ctx->setContextProperty(QStringLiteral("Ws"), &ws);
    ctx->setContextProperty(QStringLiteral("Decart"), &decart);
    ctx->setContextProperty(QStringLiteral("I18n"), &i18n);

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

    engine.loadFromModule("LiveEscape", "Main");
    controller.boot();
    // Handle `liveescape://` deep links passed on the command line
    // (registered as URL protocol handler by the packaging scripts).
    for (const QString &arg : app.arguments()) {
        if (arg.startsWith(QLatin1String("liveescape://")))
            controller.handleDeepLink(arg);
    }
    return app.exec();
}
