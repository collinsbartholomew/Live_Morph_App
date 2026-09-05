#include <QApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQuickStyle>
#include <QDesktopServices>
#include <QMessageBox>
#include <QAbstractButton>
#include <QPushButton>
#include <QUrl>

#include "core/MachineIdProvider.h"
#include "core/ApiClient.h"
#include "core/SessionManager.h"
#include "core/AppController.h"
#include "core/UpdateChecker.h"
#include "core/StreamController.h"
#include "core/WebSocketClient.h"
#include "core/DecartSignalingClient.h"
#include <QtQml>

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);
    QCoreApplication::setApplicationName(QStringLiteral("Live Escape"));
    QCoreApplication::setOrganizationName(QStringLiteral("LiveEscape"));
    QCoreApplication::setOrganizationDomain(QStringLiteral("liveescapeapp.com"));
    QCoreApplication::setApplicationVersion(QStringLiteral("1.8.0"));

    QQuickStyle::setStyle(QStringLiteral("Basic"));

    // Optional override: LIVEESCAPE_API_URL=http://localhost:8881
    ApiClient api;
    if (const QByteArray env = qgetenv("LIVEESCAPE_API_URL"); !env.isEmpty())
        api.setBaseUrl(QString::fromUtf8(env));

    MachineIdProvider machineId;
    SessionManager session;
    UpdateChecker updater(&api);
    DecartSignalingClient decart;
    StreamController stream(&session, &api, &decart);
    WebSocketClient ws;
    AppController controller(&api, &session, &machineId, &updater, &stream, &ws);

    QObject::connect(&updater, &UpdateChecker::forceUpdateRequired,
                     &app, [&](const QString &latest, const QString &dlUrl) {
        QDesktopServices::openUrl(QUrl(dlUrl));
        QMessageBox box;
        box.setIcon(QMessageBox::Warning);
        box.setWindowTitle(QStringLiteral("Update Required"));
        box.setText(QStringLiteral("Update Required"));
        box.setInformativeText(
            QStringLiteral("v%1 is no longer supported.\nv%2 is required.\n\n"
                           "The download page has been opened in your browser.")
                .arg(QCoreApplication::applicationVersion(),
                     latest.isEmpty() ? QStringLiteral("latest") : latest));
        box.addButton(QStringLiteral("Download Update"), QMessageBox::AcceptRole);
        QAbstractButton *quitBtn =
            box.addButton(QStringLiteral("Quit"), QMessageBox::RejectRole);
        box.exec();
        QCoreApplication::quit();
    });

    QQmlApplicationEngine engine;
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

    QObject::connect(
        &engine, &QQmlApplicationEngine::objectCreationFailed,
        &app, []() { QCoreApplication::exit(-1); },
        Qt::QueuedConnection);

    engine.loadFromModule("LiveEscape", "Main");
    controller.boot();
    return app.exec();
}
