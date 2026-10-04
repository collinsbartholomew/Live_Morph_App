#pragma once

#include <QObject>
#include <QString>
#include <QVariantMap>

class AuthManager;
class SessionManager;
class CameraManager;
class RecordingManager;
class ConfigManager;
class CharacterCatalogModel;
class PresetModel;

class AppController : public QObject
{
    Q_OBJECT
    Q_PROPERTY(QString currentPage READ currentPage WRITE setCurrentPage NOTIFY currentPageChanged)
    Q_PROPERTY(QString appVersion READ appVersion CONSTANT)
    Q_PROPERTY(bool isReady READ isReady NOTIFY isReadyChanged)
    Q_PROPERTY(QString swapMode READ swapMode WRITE setSwapMode NOTIFY swapModeChanged)
    Q_PROPERTY(QString realtimeProvider READ realtimeProvider WRITE setRealtimeProvider NOTIFY realtimeProviderChanged)
    Q_PROPERTY(QString swapTier READ swapTier WRITE setSwapTier NOTIFY swapTierChanged)
    Q_PROPERTY(bool hdAvailable READ hdAvailable NOTIFY hdAvailableChanged)
    Q_PROPERTY(bool showWhatsNew READ showWhatsNew WRITE setShowWhatsNew NOTIFY showWhatsNewChanged)
    Q_PROPERTY(bool showSettings READ showSettings WRITE setShowSettings NOTIFY showSettingsChanged)
    Q_PROPERTY(bool showBuyCredits READ showBuyCredits WRITE setShowBuyCredits NOTIFY showBuyCreditsChanged)
    Q_PROPERTY(bool showTour READ showTour WRITE setShowTour NOTIFY showTourChanged)
    Q_PROPERTY(bool showDownloads READ showDownloads WRITE setShowDownloads NOTIFY showDownloadsChanged)
    Q_PROPERTY(bool showLockScreen READ showLockScreen WRITE setShowLockScreen NOTIFY showLockScreenChanged)
    Q_PROPERTY(QString lockTitle READ lockTitle NOTIFY lockScreenChanged)
    Q_PROPERTY(QString lockMessage READ lockMessage NOTIFY lockScreenChanged)
    Q_PROPERTY(bool lockDismissable READ lockDismissable NOTIFY lockScreenChanged)

public:
    explicit AppController(AuthManager *auth,
                           SessionManager *session,
                           CameraManager *camera,
                           RecordingManager *recording,
                           ConfigManager *config,
                           CharacterCatalogModel *catalog,
                           PresetModel *presets,
                           QObject *parent = nullptr);

    QString currentPage() const { return m_currentPage; }
    void setCurrentPage(const QString &page);

    QString appVersion() const { return QStringLiteral("1.8.0"); }
    bool isReady() const { return m_isReady; }

    QString swapMode() const { return m_swapMode; }
    void setSwapMode(const QString &mode);

    QString realtimeProvider() const { return m_realtimeProvider; }
    void setRealtimeProvider(const QString &provider);

    QString swapTier() const { return m_swapTier; }
    void setSwapTier(const QString &tier);

    bool hdAvailable() const { return m_hdAvailable; }
    void setHdAvailable(bool available);
    bool showWhatsNew() const { return m_showWhatsNew; }
    void setShowWhatsNew(bool v);
    bool showSettings() const { return m_showSettings; }
    void setShowSettings(bool v);
    bool showBuyCredits() const { return m_showBuyCredits; }
    void setShowBuyCredits(bool v);
    bool showTour() const { return m_showTour; }
    void setShowTour(bool v);
    bool showDownloads() const { return m_showDownloads; }
    void setShowDownloads(bool v);
    bool showLockScreen() const { return m_showLockScreen; }
    void setShowLockScreen(bool v);
    QString lockTitle() const { return m_lockTitle; }
    QString lockMessage() const { return m_lockMessage; }
    bool lockDismissable() const { return m_lockDismissable; }

public slots:
    void navigateTo(const QString &page);
    void openSettings();
    void openBuyCredits();
    void openHelp();
    void openPreview();
    void openPopout();
    void openDownloads();
    void closeDownloads();
    void showLock(const QString &title, const QString &message, bool dismissable = false);
    void dismissLockScreen();
    void notify(const QString &message, const QString &type = QStringLiteral("info"));
    void showOsNotification(const QString &title, const QString &body);
    void handleDeepLink(const QString &url);
    void quitApp();
    void startSwap();
    void stopSwap();
    void toggleSwap();

signals:
    void currentPageChanged();
    void isReadyChanged();
    void swapModeChanged();
    void realtimeProviderChanged();
    void swapTierChanged();
    void hdAvailableChanged();
    void showWhatsNewChanged();
    void showSettingsChanged();
    void showBuyCreditsChanged();
    void showTourChanged();
    void showDownloadsChanged();
    void showLockScreenChanged();
    void lockScreenChanged();
    void errorOccurred(const QString &title, const QString &message);
    void notification(const QString &message, const QString &type); // info|success|warning|error
    void deepLinkReceived(const QString &url);
    void helpRequested();
    void previewRequested();
    void popoutRequested();

private:
    AuthManager *m_auth;
    SessionManager *m_session;
    CameraManager *m_camera;
    RecordingManager *m_recording;
    ConfigManager *m_config;
    CharacterCatalogModel *m_catalog;
    PresetModel *m_presets;

    QString m_currentPage = QStringLiteral("auth");
    bool m_isReady = false;
    QString m_swapMode = QStringLiteral("character"); // character | prompt | scene
    QString m_realtimeProvider = QStringLiteral("decart"); // decart | fal
    QString m_swapTier = QStringLiteral("standard"); // standard | hd
    bool m_hdAvailable = false;
    bool m_showWhatsNew = false;
    bool m_showSettings = false;
    bool m_showBuyCredits = false;
    bool m_showTour = false;
    bool m_showDownloads = false;
    bool m_showLockScreen = false;
    QString m_lockTitle;
    QString m_lockMessage;
    bool m_lockDismissable = false;

private:
    void updateHdAvailability();
    class QSystemTrayIcon *m_tray = nullptr; // ONE persistent tray icon
};
