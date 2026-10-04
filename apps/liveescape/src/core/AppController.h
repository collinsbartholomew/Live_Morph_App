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
class I18nManager;
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
    Q_PROPERTY(QVariantList activationPlans READ activationPlans NOTIFY activationPlansChanged)
    Q_PROPERTY(QVariantList bgPresets READ bgPresets NOTIFY bgPresetsChanged)
    Q_PROPERTY(QVariantMap notification READ notification NOTIFY notificationChanged)

    Q_PROPERTY(bool showCryptoProof READ showCryptoProof WRITE setShowCryptoProof NOTIFY modalChanged)
    Q_PROPERTY(bool showPaymentStatus READ showPaymentStatus WRITE setShowPaymentStatus NOTIFY modalChanged)
    Q_PROPERTY(bool showFreeCredits READ showFreeCredits NOTIFY modalChanged)
    Q_PROPERTY(bool showLockScreen READ showLockScreen NOTIFY modalChanged)
    Q_PROPERTY(bool showAdminPanel READ showAdminPanel WRITE setShowAdminPanel NOTIFY modalChanged)
    Q_PROPERTY(bool showExpiry READ showExpiry WRITE setShowExpiry NOTIFY modalChanged)
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
    Q_PROPERTY(bool showDownloads READ showDownloads WRITE setShowDownloads NOTIFY modalChanged)

    Q_PROPERTY(QString appVersion READ appVersion CONSTANT)
    Q_PROPERTY(QString expiryBannerText READ expiryBannerText NOTIFY sessionUiChanged)
    Q_PROPERTY(QString expiryBannerKind READ expiryBannerKind NOTIFY sessionUiChanged)
    // Inline red feedback under the AccessGate key input (Electron #akeyErr).
    // Empty when no error is pending.
    Q_PROPERTY(QString activationError READ activationError NOTIFY sessionUiChanged)
    // Inline red feedback under the PayModal credit-key input (Electron #keyErr).
    Q_PROPERTY(QString keyRedeemError READ keyRedeemError NOTIFY keyRedeemErrorChanged)
    Q_PROPERTY(QVariantMap paymentGateway READ paymentGateway NOTIFY platformChanged)
    Q_PROPERTY(QVariantList upgradeTargets READ upgradeTargets NOTIFY selectedPlanChanged)
    Q_PROPERTY(bool showStreamConsent READ showStreamConsent WRITE setShowStreamConsent NOTIFY modalChanged)
    Q_PROPERTY(QVariantMap payoutDetails READ payoutDetails NOTIFY payoutChanged)
    Q_PROPERTY(bool showForceUpdate READ showForceUpdate NOTIFY modalChanged)
    Q_PROPERTY(QString forceUpdateVersion READ forceUpdateVersion NOTIFY modalChanged)
    Q_PROPERTY(QString forceUpdateUrl READ forceUpdateUrl NOTIFY modalChanged)
    Q_PROPERTY(int downloadProgress READ downloadProgress NOTIFY downloadProgressChanged)
    Q_PROPERTY(bool downloading READ downloading NOTIFY downloadProgressChanged)
    Q_PROPERTY(bool showOnboarding READ showOnboarding WRITE setShowOnboarding NOTIFY modalChanged)
    Q_PROPERTY(bool showGateBlocker READ showGateBlocker WRITE setShowGateBlocker NOTIFY modalChanged)
    Q_PROPERTY(bool showGetStarted READ showGetStarted WRITE setShowGetStarted NOTIFY modalChanged)
    Q_PROPERTY(bool showStarterPay READ showStarterPay WRITE setShowStarterPay NOTIFY modalChanged)
    Q_PROPERTY(bool showStarterLock READ showStarterLock NOTIFY modalChanged)
    Q_PROPERTY(bool showPaySuccess READ showPaySuccess NOTIFY modalChanged)
    Q_PROPERTY(bool showSettings READ showSettings WRITE setShowSettings NOTIFY modalChanged)
    Q_PROPERTY(QString starterPayError READ starterPayError NOTIFY modalChanged)
    Q_PROPERTY(bool starterPayLoading READ starterPayLoading NOTIFY modalChanged)
    Q_PROPERTY(bool payStackEnabled READ payStackEnabled NOTIFY paymentFlagsChanged)
    Q_PROPERTY(QVariantList cryptoCoins READ cryptoCoins NOTIFY cryptoChanged)
    Q_PROPERTY(QString selectedCryptoCoin READ selectedCryptoCoin NOTIFY cryptoChanged)
    Q_PROPERTY(bool starterCryptoWalletVisible READ starterCryptoWalletVisible NOTIFY cryptoChanged)
    Q_PROPERTY(QString starterCryptoQR READ starterCryptoQR NOTIFY cryptoChanged)
    Q_PROPERTY(QString starterCryptoAddress READ starterCryptoAddress NOTIFY cryptoChanged)
    Q_PROPERTY(QString starterCryptoProofName READ starterCryptoProofName NOTIFY cryptoChanged)
    Q_PROPERTY(QString starterCryptoSubStatus READ starterCryptoSubStatus NOTIFY cryptoChanged)
    Q_PROPERTY(bool starterCryptoPending READ starterCryptoPending NOTIFY cryptoChanged)
    // Flow-generalized crypto payment state (starter | gate | upgrade | credits).
    // Neutral view over the shared selected-coin wallet data.
    Q_PROPERTY(QString cryptoFlow READ cryptoFlow NOTIFY cryptoChanged)
    Q_PROPERTY(QString cryptoSubStatus READ cryptoSubStatus NOTIFY cryptoChanged)
    Q_PROPERTY(bool cryptoPending READ cryptoPending NOTIFY cryptoChanged)
    Q_PROPERTY(bool cryptoWalletVisible READ starterCryptoWalletVisible NOTIFY cryptoChanged)
    Q_PROPERTY(QString cryptoQR READ starterCryptoQR NOTIFY cryptoChanged)
    Q_PROPERTY(QString cryptoAddress READ starterCryptoAddress NOTIFY cryptoChanged)
    Q_PROPERTY(QString cryptoProofName READ starterCryptoProofName NOTIFY cryptoChanged)
    Q_PROPERTY(int paySuccessCredits READ paySuccessCredits NOTIFY modalChanged)
    Q_PROPERTY(QString paySuccessPlanName READ paySuccessPlanName NOTIFY modalChanged)
    Q_PROPERTY(QString paySuccessReference READ paySuccessReference NOTIFY modalChanged)
    // Password-reset token delivered via deep link (liveescape://reset?token=…).
    // AuthScreen binds the token field to it and switches to the reset form.
    Q_PROPERTY(QString pendingResetToken READ pendingResetToken NOTIFY pendingResetTokenChanged)
    // Referral code delivered via deep link (?ref=…, Electron ss_referred_by_v1
    // parity). AuthScreen prefills the signup referral field from it.
    Q_PROPERTY(QString pendingReferralCode READ pendingReferralCode NOTIFY pendingReferralCodeChanged)
    // Language selection (routed through App — the raw I18n context property
    // resolves to null inside compiled QML, while App resolves everywhere).
    Q_PROPERTY(QStringList i18nLanguages READ i18nLanguages NOTIFY i18nChanged)
    Q_PROPERTY(QString i18nLanguage READ i18nLanguage NOTIFY i18nChanged)
    Q_PROPERTY(QString maintenanceMessage READ maintenanceMessage NOTIFY maintenanceMessageChanged)

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
    bool showExpiry() const { return m_showExpiry; }
    void setShowExpiry(bool v);
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
    bool showDownloads() const { return m_showDownloads; }
    void setShowDownloads(bool v);
    int tourStep() const { return m_tourStep; }
    QVariantMap selectedPlan() const { return m_selectedPlan; }
    QVariantList plans() const { return m_plans; }
    QVariantList activationPlans() const { return m_activationPlans; }
    QVariantList bgPresets() const { return m_bgPresets; }
    QVariantMap notification() const { return m_notification; }
    QString appVersion() const;
    QString expiryBannerText() const;
    QString expiryBannerKind() const;
    QString activationError() const { return m_activationError; }
    QVariantMap paymentGateway() const { return m_paymentGateway; }
    bool payFlutterwaveEnabled() const { return m_payFlutterwave; }
    bool payCryptoEnabled() const { return m_payCrypto; }
    QVariantList upgradeTargets() const;
    bool showStreamConsent() const { return m_showStreamConsent; }
    void setShowStreamConsent(bool v);
    QVariantMap payoutDetails() const { return m_payoutDetails; }
    bool showForceUpdate() const { return m_showForceUpdate; }
    QString forceUpdateVersion() const { return m_forceUpdateVersion; }
    QString forceUpdateUrl() const { return m_forceUpdateUrl; }
    int downloadProgress() const;
    bool downloading() const;
    Q_INVOKABLE void downloadForceUpdate();
    bool showOnboarding() const { return m_showOnboarding; }
    void setShowOnboarding(bool v);

    bool showGateBlocker() const { return m_showGateBlocker; }
    void setShowGateBlocker(bool v);

    bool showGetStarted() const { return m_showGetStarted; }
    void setShowGetStarted(bool v);
    bool showStarterPay() const { return m_showStarterPay; }
    void setShowStarterPay(bool v);
    bool showStarterLock() const { return m_showStarterLock; }
    bool showPaySuccess() const { return m_showPaySuccess; }
    bool showSettings() const { return m_showSettings; }
    void setShowSettings(bool v);
    QString starterPayError() const { return m_starterPayError; }
    bool starterPayLoading() const { return m_starterPayLoading; }
    bool payStackEnabled() const { return m_payStack; }
    QVariantList cryptoCoins() const { return m_cryptoCoins; }
    QString selectedCryptoCoin() const { return m_selectedCryptoCoin; }
    bool starterCryptoWalletVisible() const { return m_starterCryptoWalletVisible; }
    QString starterCryptoQR() const { return m_starterCryptoQR; }
    QString starterCryptoAddress() const { return m_starterCryptoAddress; }
    QString starterCryptoProofName() const { return m_starterCryptoProofName; }
    QString starterCryptoSubStatus() const { return m_starterCryptoSubStatus; }
    bool starterCryptoPending() const { return m_starterCryptoPending; }
    QString cryptoFlow() const { return m_cryptoFlow; }
    QString cryptoSubStatus() const { return m_cryptoSubStatus; }
    bool cryptoPending() const { return m_cryptoPending; }
    int paySuccessCredits() const { return m_paySuccessCredits; }
    QString paySuccessPlanName() const { return m_paySuccessPlanName; }
    QString paySuccessReference() const { return m_paySuccessReference; }
    QString pendingResetToken() const { return m_pendingResetToken; }
    QString pendingReferralCode() const { return m_pendingReferralCode; }
    QStringList i18nLanguages() const;
    QString i18nLanguage() const;
    QString keyRedeemError() const { return m_keyRedeemError; }
    QString maintenanceMessage() const { return m_maintenanceMessage; }

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
    Q_INVOKABLE void payActivation(const QString &planId, const QString &method = QStringLiteral("paystack"));
    Q_INVOKABLE void selectBackground(const QString &presetId, const QString &prompt = {});
    Q_INVOKABLE void logout();
    Q_INVOKABLE void handleDeepLink(const QString &url);
    Q_INVOKABLE void toast(const QString &message, const QString &kind = QStringLiteral("info"));
    Q_INVOKABLE void clearToast();
    Q_INVOKABLE QString deviceId() const;
    Q_INVOKABLE void copyToClipboard(const QString &text);
    Q_INVOKABLE void pickReferenceFace();
    Q_INVOKABLE void selectPlan(const QString &planId);
    Q_INVOKABLE void selectUpgradePlan(const QString &planId);
    Q_INVOKABLE void startCheckout(const QString &method);
    Q_INVOKABLE void openUpgradeFlow();
    Q_INVOKABLE void acceptConsent();
    Q_INVOKABLE void dismissWelcome();
    Q_INVOKABLE void dismissFreeCredits();
    Q_INVOKABLE void showLock(const QString &title, const QString &message, bool dismissable = false);
    Q_INVOKABLE void dismissLockScreen();
    Q_INVOKABLE void adminSaveEngineKey(const QString &key, const QString &adminSecret);
    Q_INVOKABLE void adminSetCredits(double total, const QString &adminSecret);
    Q_INVOKABLE void startTour();
    Q_INVOKABLE void nextTourStep();
    Q_INVOKABLE void prevTourStep();
    Q_INVOKABLE void closeTour();
    Q_INVOKABLE void submitAbuseReport(const QString &details);
    Q_INVOKABLE void openExternal(const QString &url);
    Q_INVOKABLE void refreshCredits();
    Q_INVOKABLE void dismissNotification();
    Q_INVOKABLE void pollPaymentStatus();
    Q_INVOKABLE void completeOnboarding();
    Q_INVOKABLE void submitCryptoProof(const QString &txId, const QString &proofPath = {});
    Q_INVOKABLE void requestStorageReset();
    Q_INVOKABLE void loadDownloads(const QString &accessKey = {});
    Q_INVOKABLE void openDownloads();
    Q_INVOKABLE void closeDownloads();
    Q_INVOKABLE void renewLicense();
    Q_INVOKABLE void pickCryptoProofImage();
    Q_INVOKABLE void captureReferenceFace();
    Q_INVOKABLE QString captureImagePath(const QString &purpose) const;
    Q_INVOKABLE QString recordingPath() const;
    Q_INVOKABLE bool ensureStreamConsent();
    Q_INVOKABLE void acceptStreamConsent();
    Q_INVOKABLE void declineStreamConsent();
    Q_INVOKABLE void redeemCreditKey(const QString &key);
    Q_INVOKABLE void clearKeyRedeemError();
    Q_INVOKABLE void savePayoutDetails(const QString &accountName, const QString &bankName,
                                       const QString &accountNumber, const QString &routing,
                                       const QString &country);
    Q_INVOKABLE void loadPayoutDetails();

    // SettingsScreen actions (production readiness — replace fake toasts).
    Q_INVOKABLE void checkForUpdates();
    Q_INVOKABLE void saveProfile(const QString &name, const QString &phone);
    Q_INVOKABLE void changePassword(const QString &currentPassword, const QString &newPassword);
    Q_INVOKABLE void deleteAccount();
    Q_INVOKABLE void clearCache();
    Q_INVOKABLE void logoutAllDevices();
    Q_INVOKABLE void copyDebugLog();
    Q_INVOKABLE void openLogFolder();
    Q_INVOKABLE void i18nSetLanguage(const QString &lang);

    // Wire the shared I18nManager (called from main once both exist).
    void setI18nManager(I18nManager *i18n);

    // Google OAuth social sign-in: "google" opens browser → polls → exchange.
    Q_INVOKABLE void socialLogin(const QString &provider);

    // Get Started / Starter Pack flow
    Q_INVOKABLE void getStartedActivate();
    Q_INVOKABLE void getStartedTryFirst();
    Q_INVOKABLE void starterPayPaystack();
    Q_INVOKABLE void starterPayFlutterwave();
    Q_INVOKABLE void showStarterCryptoPanel();
    Q_INVOKABLE void selectCryptoCoin(const QString &coinId);
    Q_INVOKABLE void submitStarterCryptoProof(const QString &txId);
    Q_INVOKABLE void showCryptoPanel(const QString &flow);
    Q_INVOKABLE void submitCryptoProofFor(const QString &flow, const QString &txId, const QString &planId);
    Q_INVOKABLE void starterLockActivate();
    Q_INVOKABLE void dismissPaySuccess();

signals:
    void screenChanged();
    void toastChanged();
    void toastSeqChanged();
    void modalChanged();
    void downloadProgressChanged();
    void tourChanged();
    void selectedPlanChanged();
    void plansChanged();
    void activationPlansChanged();
    void bgPresetsChanged();
    void notificationChanged();
    void sessionUiChanged();
    void platformChanged();
    void paymentStatusChanged();
    void paymentFlagsChanged();
    void downloadsChanged();
    void payoutChanged();
    void statusMessage(const QString &message, const QString &level);
    void cryptoChanged();
    void pendingResetTokenChanged();
    void pendingReferralCodeChanged();
    void passwordResetCompleted();
    void keyRedeemErrorChanged();
    void maintenanceMessageChanged();
    void i18nChanged();

private:
    enum class Screen { Preloader, Auth, AccessGate, Dashboard, Maintenance };
    void setScreen(Screen s);
    void wireApi();
    void wireWs();
    void maybeShowFirstRun();
    void maybeShowFreeCredits();
    void startRealtime();
    void enterAppAfterAuth();
    void reconcileServerDirectives();
    void revalidateLicenseAtBoot();
    QVariantList fallbackPlans() const;
    void populateCryptoCoins();

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
    bool m_showExpiry = false;
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
    QVariantList m_activationPlans;
    QVariantList m_bgPresets;
    QVariantMap m_notification;
    QVariantMap m_paymentGateway;
    QVariantMap m_paymentStatus;
    QVariantMap m_cryptoCheckout;
    QString m_paymentReference;
    QString m_resetEmail;
    int m_paymentPollCount = 0;
    QTimer *m_payPollTimer = nullptr;
    QTimer *m_notifTimer = nullptr;
    QVariantList m_downloads;
    bool m_showDownloads = false;
    bool m_showStreamConsent = false;
    QVariantMap m_payoutDetails;
    double m_pendingFreeCredits = 0.0;
    bool m_featureFreeCreditsEnabled = false;
    double m_featureFreeCreditsAmount = 0.0;
    bool m_showForceUpdate = false;
    QString m_forceUpdateVersion;
    QString m_forceUpdateUrl;
    bool m_showOnboarding = false;
    bool m_showGateBlocker = true; // Start visible, hide after boot resolves
    bool m_pendingConnectAfterConsent = false;
    // Get Started / Starter Pack flow
    bool m_showGetStarted = false;
    bool m_showStarterPay = false;
    bool m_showStarterLock = false;
    bool m_showPaySuccess = false;
    bool m_showSettings = false;
    QString m_starterPayError;
    bool m_starterPayLoading = false;
    bool m_payStack = false;
    QVariantList m_cryptoCoins;
    QString m_selectedCryptoCoin;
    bool m_starterCryptoWalletVisible = false;
    QString m_starterCryptoQR;
    QString m_starterCryptoAddress;
    QString m_starterCryptoProofName;
    QString m_starterCryptoSubStatus;
    bool m_starterCryptoPending = false;
    // Flow-generalized crypto payment state (gate / upgrade / credits flows;
    // starter keeps its dedicated members above for back-compat).
    QString m_cryptoFlow;
    QString m_cryptoSubStatus;
    bool m_cryptoPending = false;
    int m_paySuccessCredits = 0;
    QString m_paySuccessPlanName;
    QString m_paySuccessReference;
    // Reset token delivered via deep link; consumed by AuthScreen mode 3.
    QString m_pendingResetToken;
    // Last signup attempt credentials — used by the Electron-parity 409
    // auto-login fallback (dashboard.html doSignup "already registered").
    QString m_lastRegEmail;
    QString m_lastRegPass;
    // Referral code from deep link / prior session (Electron ss_referred_by_v1).
    QString m_pendingReferralCode;
    // True when the user pressed "Check for updates" — manual checks toast
    // their outcome; the silent boot check does not.
    bool m_manualUpdateCheck = false;
    // True while re-validating the stored license key against the server at
    // boot (Electron boot revalidation): success updates silently, failure
    // clears the local entitlement and routes to the access gate.
    bool m_bootLicenseCheck = false;
    // One-shot: evaluate the credits-exhaustion lock on the first server
    // balance after boot.
    bool m_bootCreditsChecked = false;
    // Inline activation error (Electron #akeyErr) shown under the key input.
    QString m_activationError;
    // Inline key redemption error (Electron #keyErr) shown under the PayModal key input.
    QString m_keyRedeemError;
    // Shared translation manager (wired from main; may be null in tests).
    I18nManager *m_i18n = nullptr;
    // Maintenance message from the server.
    QString m_maintenanceMessage;
    // Google OAuth poll state
    QString m_oauthState;
    QString m_oauthTicket;
    QTimer *m_oauthPollTimer = nullptr;
    int m_oauthPollCount = 0;
    bool m_oauthExchanging = false;
};
