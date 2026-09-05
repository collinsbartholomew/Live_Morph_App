#pragma once

#include <QObject>
#include <QString>
#include <QVariantList>
#include <QVariantMap>

class QTimer;

class ApiClient;
class SessionManager;
class MachineIdProvider;
class UpdateChecker;
class StreamController;
class WebSocketClient;

class AppController : public QObject
{
    Q_OBJECT
    Q_PROPERTY(QString screen READ screen NOTIFY screenChanged)
    Q_PROPERTY(QString toastMessage READ toastMessage NOTIFY toastChanged)
    Q_PROPERTY(QString toastKind READ toastKind NOTIFY toastChanged)
    Q_PROPERTY(int toastSeq READ toastSeq NOTIFY toastSeqChanged)
    Q_PROPERTY(bool showAccountModal READ showAccountModal WRITE setShowAccountModal NOTIFY modalChanged)
    Q_PROPERTY(bool showPlanGate READ showPlanGate WRITE setShowPlanGate NOTIFY modalChanged)
    Q_PROPERTY(bool showUpgradeGate READ showUpgradeGate WRITE setShowUpgradeGate NOTIFY modalChanged)
    Q_PROPERTY(bool showPayModal READ showPayModal WRITE setShowPayModal NOTIFY modalChanged)
    Q_PROPERTY(bool showTutorials READ showTutorials WRITE setShowTutorials NOTIFY modalChanged)
    Q_PROPERTY(bool showTour READ showTour WRITE setShowTour NOTIFY modalChanged)
    Q_PROPERTY(bool showConsent READ showConsent WRITE setShowConsent NOTIFY modalChanged)
    Q_PROPERTY(bool showWelcome READ showWelcome WRITE setShowWelcome NOTIFY modalChanged)
    Q_PROPERTY(bool showBgPanel READ showBgPanel WRITE setShowBgPanel NOTIFY modalChanged)
    Q_PROPERTY(bool showAbuseReport READ showAbuseReport WRITE setShowAbuseReport NOTIFY modalChanged)
    Q_PROPERTY(bool showNotification READ showNotification WRITE setShowNotification NOTIFY modalChanged)
    Q_PROPERTY(int tourStep READ tourStep NOTIFY tourChanged)
    Q_PROPERTY(bool payFlutterwaveEnabled READ payFlutterwaveEnabled NOTIFY paymentFlagsChanged)
    Q_PROPERTY(bool payCryptoEnabled READ payCryptoEnabled NOTIFY paymentFlagsChanged)

    Q_PROPERTY(QVariantMap selectedPlan READ selectedPlan NOTIFY selectedPlanChanged)
    Q_PROPERTY(QVariantList plans READ plans NOTIFY plansChanged)
    Q_PROPERTY(QVariantList bgPresets READ bgPresets NOTIFY bgPresetsChanged)
    Q_PROPERTY(QVariantMap notification READ notification NOTIFY notificationChanged)

    Q_PROPERTY(bool showCryptoProof READ showCryptoProof WRITE setShowCryptoProof NOTIFY modalChanged)
    Q_PROPERTY(bool showPaymentStatus READ showPaymentStatus WRITE setShowPaymentStatus NOTIFY modalChanged)
    Q_PROPERTY(bool showFreeCredits READ showFreeCredits NOTIFY modalChanged)
    Q_PROPERTY(bool showLockScreen READ showLockScreen NOTIFY modalChanged)
    Q_PROPERTY(bool showAdminPanel READ showAdminPanel WRITE setShowAdminPanel NOTIFY modalChanged)
    Q_PROPERTY(bool showCheckoutWeb READ showCheckoutWeb NOTIFY modalChanged)
    Q_PROPERTY(QString checkoutUrl READ checkoutUrl NOTIFY modalChanged)
    Q_PROPERTY(double freeCreditsAmount READ freeCreditsAmount NOTIFY modalChanged)
    Q_PROPERTY(QString freeCreditsTimeEst READ freeCreditsTimeEst NOTIFY modalChanged)
    Q_PROPERTY(QString lockTitle READ lockTitle NOTIFY modalChanged)
    Q_PROPERTY(QString lockMessage READ lockMessage NOTIFY modalChanged)
    Q_PROPERTY(bool lockDismissable READ lockDismissable NOTIFY modalChanged)
    Q_PROPERTY(QVariantMap paymentStatus READ paymentStatus NOTIFY paymentStatusChanged)
    Q_PROPERTY(QVariantMap cryptoCheckout READ cryptoCheckout NOTIFY paymentStatusChanged)
    Q_PROPERTY(QString notificationTitle READ notificationTitle NOTIFY notificationChanged)
    Q_PROPERTY(QString notificationMessage READ notificationMessage NOTIFY notificationChanged)
    Q_PROPERTY(QVariantList downloadsModel READ downloadsModel NOTIFY downloadsChanged)

    Q_PROPERTY(QString appVersion READ appVersion CONSTANT)
    Q_PROPERTY(QString expiryBannerText READ expiryBannerText NOTIFY sessionUiChanged)
    Q_PROPERTY(QString expiryBannerKind READ expiryBannerKind NOTIFY sessionUiChanged)
    Q_PROPERTY(QVariantMap paymentGateway READ paymentGateway NOTIFY platformChanged)

public:
    AppController(ApiClient *api, SessionManager *session, MachineIdProvider *machineId,
                   UpdateChecker *updater, StreamController *stream, WebSocketClient *ws,
                   QObject *parent = nullptr);

    QString screen() const;
    QString toastMessage() const { return m_toast; }
    QString toastKind() const { return m_toastKind; }
    int toastSeq() const { return m_toastSeq; }
    bool showAccountModal() const { return m_showAccount; }
    bool showPlanGate() const { return m_showPlanGate; }
    bool showUpgradeGate() const { return m_showUpgrade; }
    bool showPayModal() const { return m_showPay; }
    bool showTutorials() const { return m_showTutorials; }
    bool showTour() const { return m_showTour; }
    bool showConsent() const { return m_showConsent; }
    bool showWelcome() const { return m_showWelcome; }
    bool showBgPanel() const { return m_showBg; }
    bool showAbuseReport() const { return m_showAbuse; }
    bool showNotification() const { return m_showNotification; }
    bool showCryptoProof() const { return m_showCrypto; }
    bool showPaymentStatus() const { return m_showPayStatus; }
    bool showFreeCredits() const { return m_showFreeCredits; }
    bool showLockScreen() const { return m_showLock; }
    bool showAdminPanel() const { return m_showAdmin; }
    bool showCheckoutWeb() const { return m_showCheckoutWeb; }
    QString checkoutUrl() const { return m_checkoutUrl; }
    void setShowAdminPanel(bool v);
    double freeCreditsAmount() const { return m_freeCreditsAmount; }
    QString freeCreditsTimeEst() const { return m_freeCreditsTimeEst; }
    QString lockTitle() const { return m_lockTitle; }
    QString lockMessage() const { return m_lockMessage; }
    bool lockDismissable() const { return m_lockDismissable; }
    QVariantMap paymentStatus() const { return m_paymentStatus; }
    QVariantMap cryptoCheckout() const { return m_cryptoCheckout; }
    QString notificationTitle() const;
    QString notificationMessage() const;
    QVariantList downloadsModel() const { return m_downloads; }
    int tourStep() const { return m_tourStep; }
    QVariantMap selectedPlan() const { return m_selectedPlan; }
    QVariantList plans() const { return m_plans; }
    QVariantList bgPresets() const { return m_bgPresets; }
    QVariantMap notification() const { return m_notification; }
    QString appVersion() const;
    QString expiryBannerText() const;
    QString expiryBannerKind() const;
    QVariantMap paymentGateway() const { return m_paymentGateway; }
    bool payFlutterwaveEnabled() const { return m_payFlutterwave; }
    bool payCryptoEnabled() const { return m_payCrypto; }

    void setShowAccountModal(bool v);
    void setShowPlanGate(bool v);
    void setShowUpgradeGate(bool v);
    void setShowPayModal(bool v);
    void setShowTutorials(bool v);
    void setShowTour(bool v);
    void setShowConsent(bool v);
    void setShowWelcome(bool v);
    void setShowBgPanel(bool v);
    void setShowAbuseReport(bool v);
    void setShowNotification(bool v);
    void setShowCryptoProof(bool v);
    void setShowPaymentStatus(bool v);

    Q_INVOKABLE void boot();
    Q_INVOKABLE void goTo(const QString &screenName);
    Q_INVOKABLE void login(const QString &email, const QString &password);
    Q_INVOKABLE void registerUser(const QString &email, const QString &password,
                                  const QString &name, const QString &phone = {},
                                  const QString &refCode = {});
    Q_INVOKABLE void requestPasswordReset(const QString &email);
    Q_INVOKABLE void completePasswordReset(const QString &token, const QString &newPassword, const QString &email);
    Q_INVOKABLE void activateKey(const QString &key);
    Q_INVOKABLE void payActivation(const QString &planId);
    Q_INVOKABLE void logout();
    Q_INVOKABLE void toast(const QString &message, const QString &kind = QStringLiteral("info"));
    Q_INVOKABLE void clearToast();
    Q_INVOKABLE QString deviceId() const;
    Q_INVOKABLE void copyToClipboard(const QString &text);
    Q_INVOKABLE void pickReferenceFace();
    Q_INVOKABLE void selectPlan(const QString &planId);
    Q_INVOKABLE void startCheckout(const QString &method);
    Q_INVOKABLE void openUpgradeFlow();
    Q_INVOKABLE void acceptConsent();
    Q_INVOKABLE void dismissWelcome();
    Q_INVOKABLE void dismissFreeCredits();
    Q_INVOKABLE void showLock(const QString &title, const QString &message, bool dismissable = false);
    Q_INVOKABLE void dismissLockScreen();
    Q_INVOKABLE void adminSaveEngineKey(const QString &key, const QString &adminSecret);
    Q_INVOKABLE void adminSetCredits(double total, const QString &adminSecret);
    Q_INVOKABLE void closeCheckoutWeb();
    Q_INVOKABLE void onCheckoutCallback(const QString &url);
    Q_INVOKABLE void startTour();
    Q_INVOKABLE void nextTourStep();
    Q_INVOKABLE void prevTourStep();
    Q_INVOKABLE void closeTour();
    Q_INVOKABLE void submitAbuseReport(const QString &details);
    Q_INVOKABLE void openExternal(const QString &url);
    Q_INVOKABLE void refreshCredits();
    Q_INVOKABLE void dismissNotification();
    Q_INVOKABLE void pollPaymentStatus();
    Q_INVOKABLE void submitCryptoProof(const QString &txId, const QString &proofPath = {});
    Q_INVOKABLE void requestStorageReset();
    Q_INVOKABLE void loadDownloads(const QString &accessKey = {});
    Q_INVOKABLE void pickCryptoProofImage();
    Q_INVOKABLE void captureReferenceFace();
    Q_INVOKABLE QString captureImagePath(const QString &purpose) const;
    Q_INVOKABLE QString recordingPath() const;

signals:
    void screenChanged();
    void toastChanged();
    void toastSeqChanged();
    void modalChanged();
    void tourChanged();
    void selectedPlanChanged();
    void plansChanged();
    void bgPresetsChanged();
    void notificationChanged();
    void sessionUiChanged();
    void platformChanged();
    void paymentStatusChanged();
    void paymentFlagsChanged();
    void downloadsChanged();
    void statusMessage(const QString &message, const QString &level);

private:
    enum class Screen { Preloader, Auth, AccessGate, Dashboard, Maintenance };
    void setScreen(Screen s);
    void wireApi();
    void wireWs();
    void maybeShowFirstRun();
    void startRealtime();
    void enterAppAfterAuth();
    QVariantList fallbackPlans() const;

    ApiClient *m_api = nullptr;
    SessionManager *m_session = nullptr;
    MachineIdProvider *m_machineId = nullptr;
    UpdateChecker *m_updater = nullptr;
    StreamController *m_stream = nullptr;
    WebSocketClient *m_ws = nullptr;
    Screen m_screen = Screen::Preloader;
    QString m_toast;
    QString m_toastKind = QStringLiteral("info");
    int m_toastSeq = 0;
    bool m_showAccount = false;
    bool m_showPlanGate = false;
    bool m_showUpgrade = false;
    bool m_showPay = false;
    bool m_showTutorials = false;
    bool m_showTour = false;
    bool m_showConsent = false;
    bool m_showWelcome = false;
    bool m_showBg = false;
    bool m_showAbuse = false;
    bool m_showNotification = false;
    bool m_showCrypto = false;
    bool m_showPayStatus = false;
    bool m_showFreeCredits = false;
    bool m_showLock = false;
    bool m_showAdmin = false;
    bool m_showCheckoutWeb = false;
    QString m_checkoutUrl;
    bool m_lockDismissable = false;
    int m_tourStep = 0;
    bool m_payFlutterwave = false;
    bool m_payCrypto = false;
    double m_freeCreditsAmount = 0;
    QString m_freeCreditsTimeEst;
    QString m_lockTitle;
    QString m_lockMessage;
    QVariantMap m_selectedPlan;
    QVariantList m_plans;
    QVariantList m_bgPresets;
    QVariantMap m_notification;
    QVariantMap m_paymentGateway;
    QVariantMap m_paymentStatus;
    QVariantMap m_cryptoCheckout;
    QString m_paymentReference;
    QString m_resetEmail;
    int m_paymentPollCount = 0;
    QTimer *m_payPollTimer = nullptr;
    QVariantList m_downloads;
};
