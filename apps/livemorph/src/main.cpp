#include <QApplication>
#include <QBuffer>
#include <QColor>
#include <QCoreApplication>
#include <QDir>
#include <QFile>
#include <QFileInfo>
#include <QProcess>
#include <QFileSystemWatcher>
#include <QFontDatabase>
#include <QGuiApplication>
#include <QQmlEngine>
#include <QIcon>
#include <QImage>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonParseError>
#include <QLockFile>
#include <QLocalServer>
#include <QLocalSocket>
#include <QRandomGenerator>
#include <QSaveFile>
#include <QLocale>
#include <QPalette>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQuickStyle>
#include <QQuickWindow>
#include <QScreen>
#include <QStandardPaths>
#include <QTimer>
#include <QTranslator>
#include <QtGlobal>
#if defined(Q_OS_LINUX)
#include <sys/socket.h>
#include <unistd.h>
#endif
#include <QtQml>

#include "I18nManager.h"
#include "StreamServer.h"
#include "core/AppController.h"
#include "core/AuthManager.h"
#include "core/CameraManager.h"
#include "core/ConfigManager.h"
#include "core/DeviceIdentity.h"
#include "core/Notifier.h"
#include "core/RecordingManager.h"
#include "core/SessionManager.h"
#include "core/VirtualCameraHelper.h"
#include "models/CharacterCatalogModel.h"
#include "models/PresetModel.h"
#include "services/BackendClient.h"
#include "services/WebRtcSignalingClient.h"
#include <QTimer>
#include <functional>

namespace {
QAtomicInt g_qmlVerifyError = 0;
QtMessageHandler g_prevMessageHandler = nullptr;

// In --verify-qml mode, watch for the runtime-only failures that break QML
// component creation. They surface through the "qml" logging category at
// warning-or-above; cmake/qmlcachegen cannot catch them.
void qmlVerifyMessageHandler(QtMsgType type, const QMessageLogContext& ctx, const QString& msg) {
	if ((type == QtWarningMsg || type == QtCriticalMsg || type == QtFatalMsg) &&
	    (qstrcmp(ctx.category, "qml") == 0 || qstrcmp(ctx.category, "default") == 0)) {
		fprintf(stderr, "[qml-verify msg] %s: %s\n", ctx.category, msg.toUtf8().constData());
		if (msg.contains(QLatin1String("Cannot assign to non-existent")) ||
		    msg.contains(QLatin1String("is not a type")) ||
		    msg.contains(QLatin1String("Cannot create component")) ||
		    msg.contains(QLatin1String("object creation failed")) ||
		    msg.contains(QLatin1String("Required property")) ||
		    // JS runtime errors surfacing as qml-category warnings
		    msg.contains(QLatin1String("ReferenceError")) ||
		    msg.contains(QLatin1String("TypeError")) ||
		    msg.contains(QLatin1String("SyntaxError")) ||
		    msg.contains(QLatin1String("is not defined")) ||
		    msg.contains(QLatin1String("Cannot read propert")) ||
		    msg.contains(QLatin1String("Unable to assign"))) {
			g_qmlVerifyError.storeRelease(1);
		}
	}
	if (g_prevMessageHandler)
		g_prevMessageHandler(type, ctx, msg);
}
// --dev mode: print every Qt message (qInfo included) so hot-reload and QML
// errors are visible in the console.
void devMessageHandler(QtMsgType type, const QMessageLogContext& ctx, const QString& msg) {
	fprintf(stderr, "[%s] %s\n", ctx.category, msg.toUtf8().constData());
	Q_UNUSED(type)
}

// Single-instance deep-link forwarding: instance #2 connects to instance #1's
// local server and sends the per-install secret (first line) followed by one
// link per line. The secret lives in a 0600 file under AppLocalDataLocation,
// so on every platform only a process of the same OS user can read it — this
// is the portable replacement for the Linux-only SO_PEERCRED check.
QString instanceSecretPath()
{
	return QStandardPaths::writableLocation(QStandardPaths::AppLocalDataLocation)
	       + QStringLiteral("/single-instance.secret");
}

QString readInstanceSecret()
{
	QFile f(instanceSecretPath());
	if (!f.open(QIODevice::ReadOnly))
		return {};
	return QString::fromUtf8(f.readAll()).trimmed();
}

void writeInstanceSecret()
{
	QString secret = readInstanceSecret();
	if (secret.size() < 32) {
		QByteArray rnd(32, 0);
		for (int i = 0; i < rnd.size(); ++i)
			rnd[i] = char(QRandomGenerator::global()->bounded(256));
		secret = QString::fromLatin1(rnd.toHex());
	}
	QSaveFile f(instanceSecretPath());
	f.setPermissions(QFileDevice::ReadOwner | QFileDevice::WriteOwner);
	if (f.open(QIODevice::WriteOnly | QIODevice::Truncate)) {
		f.write(secret.toUtf8());
		f.commit();
	}
}

// Only our own scheme and the hosted payment-callback path on OUR API host
// are forwardable — never an arbitrary https host.
bool isForwardableLink(const QString &arg, const QString &apiHost)
{
	if (arg.startsWith(QLatin1String("livemorph://")))
		return true;
	const QUrl u(arg);
	if (u.scheme() != QLatin1String("https") || apiHost.isEmpty())
		return false;
	if (u.host().compare(apiHost, Qt::CaseInsensitive) != 0)
		return false;
	const QString p = u.path();
	return p == QLatin1String("/payments/callback")
	       || p.startsWith(QLatin1String("/api/v1/payments/callback"));
}

} // namespace

int main(int argc, char* argv[]) {
	// --verify-qml: headless self-test — loads the real UI, flips to the
	// dashboard page (forcing every dashboard component to instantiate) and
	// exits non-zero on any QML load error. Regression gate for the class of
	// runtime-only failures ("Cannot assign to non-existent property",
	// missing type imports) that cmake builds cannot catch.
	bool verifyQml = false;
	// --shot <dir>: headless screenshot pass — loads the UI offscreen, walks a
	// fixed list of UI states, and saves a PNG per state into <dir>.
	QString shotDir;
	// --dev: QML hot reload — load the UI from the SOURCE qml/ dir (not the
	// compiled qrc module) and reload the root whenever a .qml file changes.
	// C++ changes still need a rebuild; QML-only edits reload live.
	bool devMode = false;
	for (int i = 1; i < argc; ++i) {
		if (qstrcmp(argv[i], "--verify-qml") == 0) {
			verifyQml = true;
			qputenv("QT_QPA_PLATFORM", "offscreen");
			g_prevMessageHandler = qInstallMessageHandler(qmlVerifyMessageHandler);
		} else if (qstrcmp(argv[i], "--shot") == 0 && i + 1 < argc
		           && argv[i + 1][0] != '\0' && argv[i + 1][0] != '-') {
			// Require a real directory argument — never swallow a following flag.
			shotDir = QString::fromLocal8Bit(argv[++i]);
			qputenv("QT_QPA_PLATFORM", "offscreen");
		} else if (qstrcmp(argv[i], "--dev") == 0) {
			devMode = true;
			// Never serve stale compiled-QML disk cache in dev mode.
			qputenv("QML_DISABLE_DISK_CACHE", "1");
			g_prevMessageHandler = qInstallMessageHandler(devMessageHandler);
		}
	}
#ifndef NDEBUG
#else
	// --dev hot-reload loads QML from the on-disk source tree; in a Release build
	// that is local code execution if the dir is writable — keep it debug-only.
	devMode = false;
#endif
	// The CLI modes are mutually exclusive: --verify-qml exits early, so a
	// combined "--verify-qml --shot <dir>" would kill the shot walk.
	if (verifyQml) {
		shotDir.clear();
		devMode = false;
	}

	QApplication app(argc, argv);
	app.setOrganizationName(QStringLiteral("LiveMorph"));
	app.setOrganizationDomain(QStringLiteral("livemorph.com"));
	app.setApplicationName(QStringLiteral("LiveMorph"));
	app.setApplicationVersion(DeviceIdentity::APP_VERSION);
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
		for (const QString& f : fonts) {
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

	auto* config = new ConfigManager(&app);
	auto* backend = new BackendClient(&app);
	backend->setBaseUrl(config->apiBaseUrl());
	backend->fetchBootstrap();
	backend->fetchIceServers();
	// fetchFeatureFlags() and fetchMaintenance() are redundant: bootstrap
	// already provides credits.hd_multiplier, ui.maintenance, and feature flags.
	backend->fetchStreamingAvailability();
	// BackendClient has its own internal 15s ping timer; no need for a second one.
	auto* signaling = new WebRtcSignalingClient(&app);
	/* camera bound below */
	auto* auth = new AuthManager(config, backend, &app);
	// Signaling reconnects must dial with the CURRENT access token, not the
	// one captured at the original connect.
	signaling->setTokenProvider([auth]() { return auth->accessToken(); });
	// A 401 from any backend request refreshes the access token so the app
	// recovers from an expired session instead of failing every call.
	QObject::connect(backend, &BackendClient::authenticationExpired, auth,
	                 [auth]() { auth->refreshTokens(); });
	auto* session = new SessionManager(auth, config, backend, signaling, &app);
	// API URL change: re-point HTTP AND the WS sockets (they cache the old host).
	QObject::connect(config, &ConfigManager::apiBaseUrlChanged, backend, [backend, config, signaling, auth]() {
		backend->setBaseUrl(config->apiBaseUrl());
		backend->ping();
		auth->disconnectBalanceSocket();
		auth->connectBalanceSocket();
		// SessionManager's reconnect ladder re-dials with the new base URL.
		signaling->disconnectFromProxy();
	});
	// Server-side force disconnect (credits depleted / revoked) stops the morph.
	QObject::connect(auth, &AuthManager::forceDisconnected, session, [session](const QString&) {
		if (session->isActive())
			session->stopSession();
	});
	auto* camera = new CameraManager(&app);
	session->setCameraManager(camera);
	auto* recording = new RecordingManager(config, backend, camera, session, &app);
	auto* streamServer = new StreamServer(&app);
	auto* vcam = new VirtualCameraHelper(streamServer, &app);
	streamServer->setPort(config->streamPort());
	QObject::connect(config, &ConfigManager::streamPortChanged, streamServer,
	                 [streamServer, config]() { streamServer->setPort(config->streamPort()); });
	auto* catalog = new CharacterCatalogModel(&app);
	auto* presets = new PresetModel(&app);
	auto* appCtrl =
	    new AppController(auth, session, camera, recording, config, catalog, presets, &app);
	auto* notifier = new Notifier(&app);

	// Single notification funnel: C++ signals → Notifier store → toast + center.
	// Credit rates come from the bootstrap payload — refresh the session's
	// cached rates whenever the bootstrap (re)loads.
	QObject::connect(backend, &BackendClient::bootstrapChanged, session,
	                 [session]() { if (session) session->updateRates(); });
	QObject::connect(appCtrl, &AppController::notification, notifier,
	                 [notifier](const QString& message, const QString& type, const QString& category) {
		                 notifier->push(message, QString(), type, category);
	                 });
	QObject::connect(appCtrl, &AppController::errorOccurred, notifier,
	                 [notifier](const QString& title, const QString& message) {
		                 notifier->push(title, message, QStringLiteral("error"), QString());
	                 });
	// Server-side force disconnect also surfaces its reason as a toast.
	QObject::connect(auth, &AuthManager::forceDisconnected, notifier,
	                 [notifier](const QString& reason) {
		                 notifier->push(reason.isEmpty() ? QStringLiteral("Disconnected by server")
			                                             : reason,
			                                QString(), QStringLiteral("error"), QString());
	                 });

	// Settings ▸ General ▸ "Desktop notifications": mirror pushes to the OS
	// tray (gated inside showOsNotification on the notifications/desktop key).
	QObject::connect(notifier, &Notifier::pushed, appCtrl, [notifier, appCtrl](int id) {
		const QVariantMap item = notifier->itemById(id);
		const QString title = item.value(QStringLiteral("title")).toString();
		const QString body = item.value(QStringLiteral("body")).toString();
		if (!title.isEmpty())
			appCtrl->showOsNotification(title, body);
	});

	QObject::connect(streamServer, &StreamServer::error, appCtrl, [appCtrl](const QString& msg) {
		appCtrl->notify(msg, QStringLiteral("error"));
	});

	catalog->setHideStarters(!config->showBuiltinCharacters());
	QObject::connect(
	    config, &ConfigManager::showBuiltinCharactersChanged, catalog,
	    [catalog, config]() { catalog->setHideStarters(!config->showBuiltinCharacters()); });

	QObject::connect(backend, &BackendClient::catalogReceived, catalog,
	                 [catalog](const QVariantList& entries) { catalog->loadFromBackend(entries); });

	// HD availability is owned by AppController::updateHdAvailability (paid
	// tier AND server hd_multiplier > 1) — no separate bootstrap override here.

	// Adopt the server-advertised default model (bootstrap decart.default_model)
	// unless the user explicitly picked one in Settings.
	QObject::connect(backend, &BackendClient::bootstrapLoaded, config,
	                 [config](const QVariantMap& b) {
		                 config->setServerDefaultModel(
		                     b.value(QStringLiteral("decart")).toMap()
		                         .value(QStringLiteral("default_model")).toString());
	                 });

	QObject::connect(catalog, &CharacterCatalogModel::characterDeleteRequested, backend,
	                 [backend](const QString& id) { backend->deleteUserCharacter(id); });

	// Camera mirror preference from settings
	camera->setMirrored(config->mirrorCamera());
	QObject::connect(config, &ConfigManager::mirrorCameraChanged, camera,
	                 [camera, config]() { camera->setMirrored(config->mirrorCamera()); });

	// Morph (AI output) frames — the GStreamer tee — feed OBS MJPEG and vcam so
	// downstream captures the swapped output (not raw camera).
	QObject::connect(session, &SessionManager::morphFrameReady, streamServer,
	                 [streamServer, vcam](const QImage& img) {
		                 const bool needStream = streamServer->running();
		                 const bool needVcam = vcam->active();
		                 if (!needStream && !needVcam)
			                 return;
		                 if (needStream)
			                 streamServer->pushFrame(img);
		                 if (needVcam)
			                 vcam->pushFrame(img);
	                 });

	const char *uri = "LiveMorph";
	QQmlApplicationEngine engine;
	auto* i18n = new I18nManager(&engine, QStringLiteral("LiveMorph"),
	                             QStringLiteral(":/i18n/livemorph_en.ts"), &app);
	// C++-owned translatable strings (session status pill, …) are not QML
	// bindings, so engine->retranslate() alone cannot refresh them.
	QObject::connect(i18n, &I18nManager::languageChanged, session,
	                 [session]() { if (session) session->retranslateStatusText(); });
	// Managers are QML-registered singletons in the LiveMorph URI — QML uses
	// the identical identifiers (App, Auth, …) as before, but now with proper
	// type information for tooling and the QML compiler.
	qmlRegisterSingletonInstance<AppController>(uri, 1, 0, "App", appCtrl);
	qmlRegisterSingletonInstance<AuthManager>(uri, 1, 0, "Auth", auth);
	qmlRegisterSingletonInstance<SessionManager>(uri, 1, 0, "Session", session);
	qmlRegisterSingletonInstance<CameraManager>(uri, 1, 0, "CameraCtrl", camera);
	qmlRegisterSingletonInstance<RecordingManager>(uri, 1, 0, "Recording", recording);
	qmlRegisterSingletonInstance<StreamServer>(uri, 1, 0, "StreamServer", streamServer);
	qmlRegisterSingletonInstance<VirtualCameraHelper>(uri, 1, 0, "VirtualCamera", vcam);

	// Backend VC API is intent-only; fulfill with local MJPEG StreamServer (Electron parity)
	QObject::connect(backend, &BackendClient::virtualCameraStarted, streamServer,
	                 [streamServer](const QVariantMap&) { streamServer->startAsVirtualCamera(); });
	QObject::connect(backend, &BackendClient::virtualCameraStopped, streamServer,
	                 [streamServer](const QVariantMap&) { streamServer->stopVirtualCamera(); });

	qmlRegisterSingletonInstance<ConfigManager>(uri, 1, 0, "Config", config);
	qmlRegisterSingletonInstance<I18nManager>(uri, 1, 0, "I18n", i18n);
	qmlRegisterSingletonInstance<Notifier>(uri, 1, 0, "Notifier", notifier);
	qmlRegisterSingletonInstance<CharacterCatalogModel>(uri, 1, 0, "Catalog", catalog);
	qmlRegisterSingletonInstance<PresetModel>(uri, 1, 0, "Presets", presets);
	qmlRegisterSingletonInstance<BackendClient>(uri, 1, 0, "Backend", backend);
	qmlRegisterSingletonInstance<WebRtcSignalingClient>(uri, 1, 0, "Signaling", signaling);

	qmlRegisterUncreatableType<AuthManager>("LiveMorph", 1, 0, "AuthManager",
	                                        QStringLiteral("Singleton"));
	qmlRegisterUncreatableType<SessionManager>("LiveMorph", 1, 0, "SessionManager",
	                                           QStringLiteral("Singleton"));
	qmlRegisterUncreatableType<CameraManager>("LiveMorph", 1, 0, "CameraManager",
	                                          QStringLiteral("Singleton"));
	qmlRegisterUncreatableType<BackendClient>("LiveMorph", 1, 0, "BackendClient",
	                                          QStringLiteral("Singleton"));
	qmlRegisterUncreatableType<AppController>("LiveMorph", 1, 0, "AppController",
	                                          QStringLiteral("Singleton"));

	// Signal connections must be registered BEFORE engine.load to avoid
	// missing early-fired signals during QML initialization.
	QObject::connect(
	    backend, &BackendClient::paymentOrderVerified, auth, [auth](const QVariantMap& result) {
		    const auto bal = result.value(QStringLiteral("balance")).toMap();
		    if (bal.contains(QStringLiteral("credit_balance"))) {
			    auth->applyBalance(bal.value(QStringLiteral("credit_balance")).toDouble(),
				                   bal.value(QStringLiteral("bonus_balance")).toDouble());
		    } else {
			    auth->refreshProfile();
		    }
	    });

	QObject::connect(backend, &BackendClient::creditsBalanceReceived, auth,
	                 [auth](const QVariantMap& bal) {
		                 // Guard: a malformed/empty body must never zero the balance.
		                 if (!bal.contains(QStringLiteral("credit_balance")))
			                 return;
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

	// In --dev mode the UI loads from the source tree so a file watcher can
	// hot-reload it. The module resolves from a temp import root whose
	// "LiveMorph" entry is a symlink to the source qml/ dir (which carries
	// the qmldir). C++ types/singletons are registered above as usual.
	QUrl url(QStringLiteral("qrc:/qt/qml/LiveMorph/qml/main.qml"));
	QString devQmlDir;
	if (devMode) {
#ifdef LIVEMORPH_QML_SOURCE_DIR
		devQmlDir = QStringLiteral(LIVEMORPH_QML_SOURCE_DIR);
#else
		devQmlDir = QCoreApplication::applicationDirPath() + QStringLiteral("/../../qml");
#endif
		// Per-user temp root: a fixed /tmp path is world-writable, so another
		// user could pre-create the symlink and make us load THEIR qml.
		const QString tmpRoot = QStandardPaths::writableLocation(QStandardPaths::TempLocation)
		                        + QStringLiteral("/livemorph-dev-import-%1")
		                              .arg(QCoreApplication::applicationPid());
		QDir().mkpath(tmpRoot);
		const QString linkPath = tmpRoot + QStringLiteral("/LiveMorph");
		QFile::remove(linkPath);
		if (QFile::link(devQmlDir, linkPath)) {
			// Prepend (don't replace) so Qt's own qml modules stay resolvable.
			QStringList importPaths = engine.importPathList();
			importPaths.prepend(tmpRoot);
			engine.setImportPathList(importPaths);
			url = QUrl::fromLocalFile(linkPath + QStringLiteral("/main.qml"));
			qInfo() << "[dev] hot reload ON — watching" << devQmlDir;
		} else {
			// Symlink failed — keep the compiled qrc URL instead of crashing on
			// a dangling link.
			qWarning() << "[dev] failed to link" << devQmlDir << "->" << linkPath << "— using compiled QML";
		}
	}
	QObject::connect(
	    &engine, &QQmlApplicationEngine::objectCreationFailed, &app,
	    []() { QCoreApplication::exit(-1); }, Qt::QueuedConnection);

	QLockFile* instanceLock = nullptr; // released LAST on quit (after teardown)
	{
		const QString serverKey = QStringLiteral("livemorph-single-instance");
		// Authority for "another instance is running" is an exclusive lock file,
		// NOT the local socket: calling removeServer() on a failed listen() can
		// delete a concurrently-starting live instance's socket and let two
		// processes run (double OAuth exchange). QLockFile is stale-lock safe.
		const QString lockPath =
		    QStandardPaths::writableLocation(QStandardPaths::AppLocalDataLocation)
		    + QStringLiteral("/single-instance.lock");
		instanceLock = new QLockFile(lockPath);
		if (!instanceLock->tryLock(0)) {
			// Instance #2: forward deep links to instance #1, then exit. The
			// first line is the shared secret so instance #1 can verify the
			// sender is a same-user process (portable peer check).
			QLocalSocket probe;
			probe.connectToServer(serverKey);
			if (probe.waitForConnected(500)) {
				const QString secret = readInstanceSecret();
				if (!secret.isEmpty())
					probe.write(secret.toUtf8() + '\n');
				const QString apiHost = QUrl(config->apiBaseUrl()).host();
				for (const QString& arg : app.arguments()) {
					if (isForwardableLink(arg, apiHost)) {
						probe.write(arg.toUtf8() + '\n');
						probe.waitForBytesWritten(500);
					}
				}
			}
			probe.disconnectFromServer();
			return 0;
		}
		// Instance #1: publish the shared secret and own the socket name. Safe
		// to remove a stale socket here because we hold the authority lock.
		writeInstanceSecret();
		auto* lockServer = new QLocalServer(&app);
		QLocalServer::removeServer(serverKey); // stale socket after a crash
		if (!lockServer->listen(serverKey))
			return 0;
		const QString secret = readInstanceSecret();
		QObject::connect(
		    lockServer, &QLocalServer::newConnection, lockServer, [appCtrl, lockServer, secret, config]() {
		    // Compute the API host live — Settings can change apiBaseUrl at runtime.
		    const QString apiHost = QUrl(config->apiBaseUrl()).host();
			    while (QLocalSocket* client = lockServer->nextPendingConnection()) {
				    // Defense in depth on Linux: SO_PEERCRED proves same uid.
				    bool sameUser = true;
#if defined(Q_OS_LINUX)
				    {
					    const int fd = client->socketDescriptor();
					    struct ucred cred { 0, 0, 0 };
					    socklen_t len = sizeof(cred);
					    sameUser = fd >= 0
					        && getsockopt(fd, SOL_SOCKET, SO_PEERCRED, &cred, &len) == 0
					        && cred.uid == geteuid();
				    }
#endif
				    if (!sameUser) {
					    client->disconnectFromServer();
					    client->deleteLater();
					    continue;
				    }
				client->setProperty("authed", false);
				// Bound the pre-auth read buffer: a local peer must not make us
				// buffer unbounded data before the secret line arrives.
				client->setReadBufferSize(16 * 1024);
				QObject::connect(client, &QLocalSocket::disconnected, client,
				&QLocalSocket::deleteLater);
				QObject::connect(client, &QLocalSocket::readyRead, client, [client, appCtrl, secret, config]() {
					// Live API host (Settings can change it at runtime).
					const QString apiHost = QUrl(config->apiBaseUrl()).host();
					// Buffer until FULL lines are available — the secret line
					// may arrive split across segments, and a partial line must
					// never be compared against the secret.
					bool authed = client->property("authed").toBool();
					// No full line within the bounded buffer → abusive/broken peer.
					if (!client->canReadLine() && client->bytesAvailable() >= 16 * 1024) {
						client->disconnectFromServer();
						return;
					}
					while (client->canReadLine()) {
						    const QByteArray raw = client->readLine();
						    const QString line = QString::fromUtf8(raw).trimmed();
						    if (line.isEmpty())
							    continue;
						if (!authed) {
							// Constant-time compare — a plain == would leak a
							// timing oracle on the shared secret.
							const QByteArray a = line.toUtf8(), b = secret.toUtf8();
							quint8 diff = quint8(a.size() ^ b.size());
							const int n = qMax(a.size(), b.size());
							for (int i = 0; i < n; ++i) {
								const char x = i < a.size() ? a.at(i) : char(0);
								const char y = i < b.size() ? b.at(i) : char(0);
								diff |= quint8(uchar(x) ^ uchar(y));
							}
							if (diff == 0) {
								authed = true;
								client->setProperty("authed", true);
							} else {
								client->disconnectFromServer();
								return;
							}
							continue;
						}
						    if (isForwardableLink(line, apiHost))
							    QMetaObject::invokeMethod(
							        appCtrl, [appCtrl, line]() { appCtrl->handleDeepLink(line); },
							        Qt::QueuedConnection);
					    }
				    });
			    }
		    });
	}

	engine.load(url);

	// Dev hot reload: watch the source qml dir, debounce, reload the root.
	if (devMode && !devQmlDir.isEmpty()) {
		auto* watcher = new QFileSystemWatcher(&app);
		auto* debounce = new QTimer(&app);
		debounce->setSingleShot(true);
		debounce->setInterval(200);
		// Watch every subdir recursively.
		QStringList dirsToWatch{devQmlDir};
		for (int i = 0; i < dirsToWatch.size(); ++i) {
			const QFileInfoList entries = QDir(dirsToWatch[i]).entryInfoList(
			    QDir::Dirs | QDir::NoDotAndDotDot | QDir::NoSymLinks);
			for (const QFileInfo &e : entries)
				dirsToWatch.append(e.absoluteFilePath());
		}
		watcher->addPaths(dirsToWatch);
		QObject::connect(watcher, &QFileSystemWatcher::fileChanged, debounce,
		                 [debounce](const QString &path) {
			if (path.endsWith(QStringLiteral(".qml")))
				debounce->start();
		});
		QObject::connect(watcher, &QFileSystemWatcher::directoryChanged, debounce,
		                 [debounce, watcher, devQmlDir](const QString &path) {
			// New subdir/file appeared — (re)watch it so future edits reload.
			if (QFileInfo(path).isDir() && !watcher->directories().contains(path))
				watcher->addPath(path);
			debounce->start();
		});
		QObject::connect(debounce, &QTimer::timeout, &app, [&engine, url, devQmlDir]() {
			qInfo() << "[dev] QML changed — reloading";
			const auto roots = engine.rootObjects();
			for (QObject *o : roots)
				o->deleteLater();
			engine.clearComponentCache();
			engine.load(url);
		});
	}

	// Restore window geometry (Electron parity: saves/restores window size & position).
	// Guard on "width" — the save path never writes "geometry", so the old
	// contains("geometry") check made this whole block dead code. Clamp x/y
	// to the available screen so a unplugged monitor doesn't strand the window.
	if (engine.rootObjects().size() > 0) {
		auto* rootObj = engine.rootObjects().first();
		QSettings winSettings;
		winSettings.beginGroup(QStringLiteral("Window"));
		if (winSettings.contains("width")) {
			int w = winSettings.value("width", 1280).toInt();
			int h = winSettings.value("height", 800).toInt();
			int x = winSettings.value("x", -1).toInt();
			int y = winSettings.value("y", -1).toInt();
			// Never restore below the QML minimum size: a stale small geometry
			// (e.g. 800x640) is applied programmatically and bypasses the
			// window minimum, clipping the dashboard action bar.
			const int minW = rootObj->property("minimumWidth").toInt();
			const int minH = rootObj->property("minimumHeight").toInt();
			w = qMax(w, minW > 0 ? minW : 1024);
			h = qMax(h, minH > 0 ? minH : 640);
			const QList<QScreen*> screens = QGuiApplication::screens();
			// Clamp the restored size to the primary screen: a saved 4K
			// geometry must not leave this frameless window larger than the
			// display (title bar buttons would be unreachable). Never clamp
			// BELOW the QML minimum though — a sub-minimum window clips the
			// dashboard (programmatic setProperty bypasses the window min).
			if (!screens.isEmpty()) {
				const QRect primary = screens.first()->availableGeometry();
				w = qBound(minW > 0 ? minW : 1024, w, qMax(minW > 0 ? minW : 1024, primary.width()));
				h = qBound(minH > 0 ? minH : 640, h, qMax(minH > 0 ? minH : 640, primary.height()));
			}
			bool onScreen = false;
			for (QScreen* s : screens) {
				const QRect g = s->availableGeometry();
				if (g.intersects(QRect(x, y, w, h))) {
					onScreen = true;
					break;
				}
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
			// Forced: skips the unauthed→auth clamp so verify mode really
			// instantiates the dashboard.
			appCtrl->setCurrentPageForced(QStringLiteral("dashboard"));
			QTimer::singleShot(1200, qApp, []() {
				const bool failed = g_qmlVerifyError;
				fprintf(stderr, "[qml-verify] %s\n", failed ? "FAIL" : "PASS");
				QCoreApplication::exit(failed ? 3 : 0);
			});
		});
	}
	if (!shotDir.isEmpty()) {
		QDir().mkpath(shotDir);
		auto grab = [&engine, shotDir](const QString &name) {
			if (engine.rootObjects().isEmpty())
				return;
			auto *win = qobject_cast<QQuickWindow *>(engine.rootObjects().first());
			if (!win)
				return;
			QImage img = win->grabWindow();
			const QString path = shotDir + QLatin1Char('/') + name + QLatin1String(".png");
			img.save(path);
			fprintf(stderr, "[shot] %s (%dx%d)\n", qPrintable(path), img.width(), img.height());
		};
		// State walk: auth → dashboard → overlays → narrow window.
		// Timers are spaced so each state settles before its grab (the old
		// schedule set dashboard at 1600ms, before the 1800ms auth grab).
		QTimer::singleShot(800, &app, [appCtrl]() { appCtrl->setCurrentPageForced(QStringLiteral("auth")); });
		QTimer::singleShot(1600, qApp, [grab]() { grab(QStringLiteral("01-auth")); });
		QTimer::singleShot(1700, &app, [appCtrl]() { appCtrl->setCurrentPageForced(QStringLiteral("dashboard")); });
		QTimer::singleShot(2500, qApp, [grab]() { grab(QStringLiteral("02-dashboard")); });
		QTimer::singleShot(2600, qApp, [appCtrl]() { appCtrl->requestOpenNotifications(); });
		QTimer::singleShot(3400, qApp, [grab, appCtrl]() { grab(QStringLiteral("03-notifications")); appCtrl->requestEscape(); });
		QTimer::singleShot(3500, &app, [appCtrl]() { appCtrl->setProperty("showSettings", true); });
		QTimer::singleShot(4300, qApp, [grab, appCtrl]() { grab(QStringLiteral("04-settings")); appCtrl->setProperty("showSettings", false); });
		QTimer::singleShot(4400, &app, [appCtrl]() { appCtrl->setProperty("showBuyCredits", true); });
		QTimer::singleShot(5200, qApp, [grab, appCtrl]() { grab(QStringLiteral("05-buycredits")); appCtrl->setProperty("showBuyCredits", false); });
		QTimer::singleShot(5300, &app, [appCtrl]() { appCtrl->setProperty("showWhatsNew", true); });
		QTimer::singleShot(6100, qApp, [grab, appCtrl]() { grab(QStringLiteral("06-whatsnew")); appCtrl->setProperty("showWhatsNew", false); });
		QTimer::singleShot(6200, &app, [appCtrl]() { appCtrl->setProperty("showLockScreen", true); });
		QTimer::singleShot(7000, qApp, [grab, appCtrl]() { grab(QStringLiteral("07-lock")); appCtrl->setProperty("showLockScreen", false); });
		QTimer::singleShot(7100, &app, [&engine]() {
			if (!engine.rootObjects().isEmpty()) {
				auto *rootObj = engine.rootObjects().first();
				rootObj->setProperty("width", 1024);
				rootObj->setProperty("height", 640);
			}
		});
		QTimer::singleShot(7900, qApp, [grab]() { grab(QStringLiteral("08-narrow-1024x640")); });
		QTimer::singleShot(8400, qApp, []() { QCoreApplication::exit(0); });
	}
	QObject::connect(&app, &QCoreApplication::aboutToQuit, &app,
	                 [streamServer, vcam, session, recording, &engine]() {
		                 // Flush pending QSettings writes — setters never sync(),
		                 // so a crash right after a change would lose it.
		                 QSettings().sync();
		                 if (session && session->isActive())
			                 session->stopSession();
		                 					if (recording && recording->isRecording()) {
						// QMediaRecorder::stop() is async — arm the bound-wait loop BEFORE
						// stopping so the isRecordingChanged signal can't be missed.
						QEventLoop finalizeLoop;
						QTimer::singleShot(5000, &finalizeLoop, &QEventLoop::quit);
						bool finalized = false;
						QObject::connect(recording, &RecordingManager::isRecordingChanged,
									  &finalizeLoop, [&finalizeLoop, recording, &finalized]() {
								      if (!recording->isRecording()) {
									          finalized = true;
									          finalizeLoop.quit();
								      }
								  });
						recording->stopRecording(QStringLiteral("quit"));
						if (!finalized)
							finalizeLoop.exec(); // bounded by the 5s timer
					}
		                 if (vcam && vcam->active())
			                 vcam->stop();
		                 if (streamServer && streamServer->running())
			                 streamServer->stop();
		                 // Save window geometry
		                 if (engine.rootObjects().size() > 0) {
			                 auto* rootObj = engine.rootObjects().first();
			                 QSettings winSettings;
			                 winSettings.beginGroup(QStringLiteral("Window"));
			                 winSettings.setValue("width", rootObj->property("width").toInt());
			                 winSettings.setValue("height", rootObj->property("height").toInt());
			                 winSettings.setValue("x", rootObj->property("x").toInt());
			                 winSettings.setValue("y", rootObj->property("y").toInt());
			                 winSettings.endGroup();
		                 }
	                 });
	// Release the single-instance lock AFTER the teardown handler above has
	// run (aboutToQuit handlers fire in connect order) — otherwise a second
	// launch could start while recording finalize is still in flight.
	QObject::connect(&app, &QCoreApplication::aboutToQuit, &app,
	                 [instanceLock]() {
		                 if (instanceLock) { instanceLock->unlock(); delete instanceLock; }
	                 });

	// ── Single-instance guard + deep-link forwarding ─────────────────
	// A deep link while the app runs spawns a SECOND process (the OS
	// protocol handler can't target a running instance). Instance #2 must
	// forward the link and exit — otherwise both instances race the OAuth
	// ticket exchange (double-exchange → spurious "expired ticket" error)
	// and fight over QSettings/sockets.
	// Deep links from argv (protocol handler / cold launch) — same process, so
	// no secret needed, but the same strict link filter applies.
	const QString apiHost = QUrl(config->apiBaseUrl()).host();
	for (const QString& arg : app.arguments()) {
		if (isForwardableLink(arg, apiHost))
			appCtrl->handleDeepLink(arg);
	}

	return app.exec();
}
