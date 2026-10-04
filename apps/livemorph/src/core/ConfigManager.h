#pragma once

#include <QObject>
#include <QString>
#include <QVariant>
#include <QSettings>

class ConfigManager : public QObject
{
    Q_OBJECT
    Q_PROPERTY(QString language READ language WRITE setLanguage NOTIFY languageChanged)
    Q_PROPERTY(bool startWithCamera READ startWithCamera WRITE setStartWithCamera NOTIFY startWithCameraChanged)
    Q_PROPERTY(bool mirrorCamera READ mirrorCamera WRITE setMirrorCamera NOTIFY mirrorCameraChanged)
    Q_PROPERTY(int streamPort READ streamPort WRITE setStreamPort NOTIFY streamPortChanged)
    Q_PROPERTY(bool autoRecord READ autoRecord WRITE setAutoRecord NOTIFY autoRecordChanged)
    Q_PROPERTY(QString themeAccent READ themeAccent CONSTANT)
    Q_PROPERTY(bool onboardingDone READ onboardingDone WRITE setOnboardingDone NOTIFY onboardingDoneChanged)
    Q_PROPERTY(bool workshopCollapsed READ workshopCollapsed WRITE setWorkshopCollapsed NOTIFY workshopCollapsedChanged)
    Q_PROPERTY(bool promptBarVisible READ promptBarVisible WRITE setPromptBarVisible NOTIFY promptBarVisibleChanged)
    Q_PROPERTY(bool compactChrome READ compactChrome WRITE setCompactChrome NOTIFY compactChromeChanged)
    Q_PROPERTY(QString whatsNewSeenVersion READ whatsNewSeenVersion WRITE setWhatsNewSeenVersion NOTIFY whatsNewSeenVersionChanged)
    Q_PROPERTY(QString defaultModel READ defaultModel WRITE setDefaultModel NOTIFY defaultModelChanged)
    Q_PROPERTY(QString apiBaseUrl READ apiBaseUrl WRITE setApiBaseUrl NOTIFY apiBaseUrlChanged)
    Q_PROPERTY(bool showBuiltinCharacters READ showBuiltinCharacters WRITE setShowBuiltinCharacters NOTIFY showBuiltinCharactersChanged)
    Q_PROPERTY(bool showCameraBeforeSwap READ showCameraBeforeSwap WRITE setShowCameraBeforeSwap NOTIFY showCameraBeforeSwapChanged)
    Q_PROPERTY(bool productNotifications READ productNotifications WRITE setProductNotifications NOTIFY productNotificationsChanged)
    Q_PROPERTY(bool identityLockDefault READ identityLockDefault WRITE setIdentityLockDefault NOTIFY identityLockDefaultChanged)
    Q_PROPERTY(QString recordingExtension READ recordingExtension WRITE setRecordingExtension NOTIFY recordingExtensionChanged)
    Q_PROPERTY(bool uploadConsentShown READ uploadConsentShown WRITE setUploadConsentShown NOTIFY uploadConsentShownChanged)
    Q_PROPERTY(QString pipVisibility READ pipVisibility WRITE setPipVisibility NOTIFY pipVisibilityChanged)
    Q_PROPERTY(bool smoothOutput READ smoothOutput WRITE setSmoothOutput NOTIFY smoothOutputChanged)
    Q_PROPERTY(QString recordingQuality READ recordingQuality WRITE setRecordingQuality NOTIFY recordingQualityChanged)
    Q_PROPERTY(bool micAudioEnabled READ micAudioEnabled WRITE setMicAudioEnabled NOTIFY micAudioEnabledChanged)
    Q_PROPERTY(bool autoRecordOnSwap READ autoRecordOnSwap WRITE setAutoRecordOnSwap NOTIFY autoRecordOnSwapChanged)

public:
    explicit ConfigManager(QObject *parent = nullptr);

    QString language() const;
    void setLanguage(const QString &lang);

    bool startWithCamera() const;
    void setStartWithCamera(bool v);

    bool mirrorCamera() const;
    void setMirrorCamera(bool v);

    int streamPort() const;
    void setStreamPort(int port);

    bool autoRecord() const;
    void setAutoRecord(bool v);

    QString themeAccent() const { return QStringLiteral("#8b5cf6"); }

    bool onboardingDone() const;
    void setOnboardingDone(bool v);

    bool workshopCollapsed() const;
    void setWorkshopCollapsed(bool v);

    bool promptBarVisible() const;
    void setPromptBarVisible(bool v);

    bool compactChrome() const;
    void setCompactChrome(bool v);

    QString whatsNewSeenVersion() const;
    void setWhatsNewSeenVersion(const QString &v);

    QString defaultModel() const;
    void setDefaultModel(const QString &m);
    QString apiBaseUrl() const;
    void setApiBaseUrl(const QString &u);

    bool showBuiltinCharacters() const;
    void setShowBuiltinCharacters(bool v);
    bool showCameraBeforeSwap() const;
    void setShowCameraBeforeSwap(bool v);
    bool productNotifications() const;
    void setProductNotifications(bool v);
    bool identityLockDefault() const;
    void setIdentityLockDefault(bool v);
    QString recordingExtension() const;
    void setRecordingExtension(const QString &ext);
    bool uploadConsentShown() const;
    void setUploadConsentShown(bool v);
    QString pipVisibility() const;
    void setPipVisibility(const QString &v);
    bool smoothOutput() const;
    void setSmoothOutput(bool v);
    QString recordingQuality() const;
    void setRecordingQuality(const QString &q);
    bool micAudioEnabled() const;
    void setMicAudioEnabled(bool v);
    bool autoRecordOnSwap() const;
    void setAutoRecordOnSwap(bool v);

    Q_INVOKABLE QVariant value(const QString &key, const QVariant &defaultValue = {}) const;
    Q_INVOKABLE void setValue(const QString &key, const QVariant &value);

signals:
    void languageChanged();
    void startWithCameraChanged();
    void mirrorCameraChanged();
    void streamPortChanged();
    void autoRecordChanged();
    void onboardingDoneChanged();
    void workshopCollapsedChanged();
    void promptBarVisibleChanged();
    void compactChromeChanged();
    void whatsNewSeenVersionChanged();
    void defaultModelChanged();
    void apiBaseUrlChanged();
    void showBuiltinCharactersChanged();
    void showCameraBeforeSwapChanged();
    void productNotificationsChanged();
    void identityLockDefaultChanged();
    void recordingExtensionChanged();
    void uploadConsentShownChanged();
    void pipVisibilityChanged();
    void smoothOutputChanged();
    void recordingQualityChanged();
    void micAudioEnabledChanged();
    void autoRecordOnSwapChanged();
    void configChanged();

private:
    QSettings m_settings;
};
