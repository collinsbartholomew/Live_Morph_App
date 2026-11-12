#pragma once

#include <QObject>
#include <QPointer>
#include <QString>
#include <QElapsedTimer>
#include <QTimer>
#include <QVideoSink>
#include <QImage>

class AuthManager;
class ConfigManager;
class BackendClient;
class WebRtcSignalingClient;
class GstRtcPeer;
class CameraManager;

class SessionManager : public QObject
{
    Q_OBJECT
    Q_PROPERTY(bool isActive READ isActive NOTIFY isActiveChanged)
    Q_PROPERTY(QString connectionStatus READ connectionStatus NOTIFY connectionStatusChanged)
    Q_PROPERTY(QString statusText READ statusText NOTIFY statusTextChanged)
    Q_PROPERTY(double creditsPerSecond READ creditsPerSecond NOTIFY ratesChanged)
    Q_PROPERTY(double elapsedSec READ elapsedSec NOTIFY elapsedChanged)
    Q_PROPERTY(int framesProcessed READ framesProcessed NOTIFY framesChanged)
    // bool view of framesProcessed>0 — notifies ONCE per session so QML
    // bindings don't re-evaluate per decoded frame.
    Q_PROPERTY(bool hasFrames READ hasFrames NOTIFY firstFrameChanged)
    Q_PROPERTY(QString activeCharacterId READ activeCharacterId NOTIFY activeCharacterChanged)
    Q_PROPERTY(QString activeCharacterName READ activeCharacterName NOTIFY activeCharacterChanged)
    Q_PROPERTY(QString activeCharacterImage READ activeCharacterImage NOTIFY activeCharacterChanged)
    Q_PROPERTY(QString activePrompt READ activePrompt NOTIFY activePromptChanged)
    Q_PROPERTY(QString scenePrompt READ scenePrompt NOTIFY scenePromptChanged)
    Q_PROPERTY(QString activeScene READ activeScene NOTIFY activeSceneChanged)
    Q_PROPERTY(bool sceneEnabled READ sceneEnabled NOTIFY sceneEnabledChanged)
    Q_PROPERTY(bool identityLockEnabled READ identityLockEnabled WRITE setIdentityLockEnabled NOTIFY identityLockChanged)
    Q_PROPERTY(bool enhancePrompts READ enhancePrompts WRITE setEnhancePrompts NOTIFY enhancePromptsChanged)
    Q_PROPERTY(bool cooldownActive READ cooldownActive NOTIFY cooldownChanged)
    Q_PROPERTY(int cooldownRemainingSec READ cooldownRemainingSec NOTIFY cooldownChanged)
    Q_PROPERTY(bool hdActive READ hdActive WRITE setHdActive NOTIFY hdActiveChanged)
    Q_PROPERTY(QString engineLabel READ engineLabel NOTIFY engineLabelChanged)
    Q_PROPERTY(bool signalingConnected READ signalingConnected NOTIFY signalingConnectedChanged)
    Q_PROPERTY(QString realtimeSessionId READ realtimeSessionId NOTIFY realtimeSessionIdChanged)
    Q_PROPERTY(QVideoSink *peerVideoSink READ peerVideoSink NOTIFY peerVideoSinkChanged)
    // Dedicated sinks for the popout / preview windows — they must NOT bind
    // peerVideoSink (a QVideoSink feeds one VideoOutput; binding it would steal
    // the stage's video). Fed the same frames via GstRtcPeer aux sinks.
    Q_PROPERTY(QVideoSink *popoutVideoSink READ popoutVideoSink NOTIFY popoutVideoSinkChanged)
    Q_PROPERTY(QVideoSink *previewVideoSink READ previewVideoSink NOTIFY previewVideoSinkChanged)
    Q_PROPERTY(double rttMs READ rttMs NOTIFY statsChanged)
    Q_PROPERTY(QString connectionQuality READ connectionQuality NOTIFY statsChanged)
    Q_PROPERTY(int queuePosition READ queuePosition NOTIFY queueChanged)
    Q_PROPERTY(int queueSize READ queueSize NOTIFY queueChanged)
    // Structured "signaling is reconnecting" flag — views must not sniff the
    // translated statusText prose for it.
    Q_PROPERTY(bool reconnecting READ isReconnecting NOTIFY reconnectingChanged)

public:
    enum class Status { Idle, Connecting, Connected, Generating, Cooldown, InsufficientCredits, Error };
    Q_ENUM(Status)
    // Discrete phase exposed to QML, so views don't sniff statusText prefixes.
    Q_PROPERTY(Status status READ statusEnum NOTIFY connectionStatusChanged)
    enum class ErrorKind { None, Connection, Stall, NoOutput, Credits, Other };
    Q_ENUM(ErrorKind)
    // Categorizes the current error (if any) so views don't regex statusText.
    Q_PROPERTY(ErrorKind errorKind READ errorKind NOTIFY connectionStatusChanged)

    explicit SessionManager(AuthManager *auth, ConfigManager *config, BackendClient *backend,
                            WebRtcSignalingClient *signaling,
                            QObject *parent = nullptr);

    bool isActive() const { return m_active; }
    Status statusEnum() const { return m_status; }
    ErrorKind errorKind() const { return m_errorKind; }
    int queuePosition() const { return m_queuePosition; }
    int queueSize() const { return m_queueSize; }
    bool isReconnecting() const { return m_reconnecting; }
    QString connectionStatus() const;
    QString statusText() const { return m_statusText; }
    double creditsPerSecond() const { return m_creditsPerSec; }
    double elapsedSec() const;
    int framesProcessed() const { return m_frames; }
    bool hasFrames() const { return m_frames > 0; }
    QString activeCharacterId() const { return m_characterId; }
    QString activeCharacterName() const { return m_characterName; }
    QString activeCharacterImage() const { return m_characterImage; }
    QString activePrompt() const { return m_prompt; }
    QString scenePrompt() const { return m_scenePrompt; }
    Q_INVOKABLE void setScenePrompt(const QString &p);
    Q_INVOKABLE void setActivePrompt(const QString &p);
    QString activeScene() const { return m_scene; }
    Q_INVOKABLE void setActiveScene(const QString &s);
    bool sceneEnabled() const { return m_sceneEnabled; }
    Q_INVOKABLE void setSceneEnabled(bool v);
    /// Re-apply tr() to C++-owned status text after a language switch —
    /// retranslate() only refreshes QML bindings, not C++ properties.
    Q_INVOKABLE void retranslateStatusText();
    bool identityLockEnabled() const { return m_identityLock; }
    void setIdentityLockEnabled(bool v);
    bool enhancePrompts() const { return m_enhance; }
    void setEnhancePrompts(bool v);
    bool cooldownActive() const { return m_cooldownSec > 0; }
    int cooldownRemainingSec() const { return m_cooldownSec; }
    bool hdActive() const { return m_hd; }
    void setHdActive(bool v);
    QString engineLabel() const;
    bool signalingConnected() const { return m_signalingConnected; }
    QString realtimeSessionId() const { return m_realtimeSessionId; }
    double rttMs() const { return m_rttMs; }
    QString connectionQuality() const;
    QVideoSink *peerVideoSink() const;
    QVideoSink *popoutVideoSink() const { return m_popoutSink; }
    QVideoSink *previewVideoSink() const { return m_previewSink; }
    // Qt 6.12: VideoOutput.videoSink is read-only and every VideoOutput owns
    // its sink, so an external sink can never be attached TO an output. The
    // correct direction is: read the output's own sink and feed IT from the
    // peer. These register the internal sinks of the stage / popout / preview
    // VideoOutput items with the peer's frame fan-out.
    Q_INVOKABLE void bindStageVideoOutput(QObject *videoOutput);
    Q_INVOKABLE void bindPopoutVideoOutput(QObject *videoOutput);
    Q_INVOKABLE void bindPreviewVideoOutput(QObject *videoOutput);
    Q_INVOKABLE void unbindStageVideoOutput();
    Q_INVOKABLE void unbindPopoutVideoOutput();
    Q_INVOKABLE void unbindPreviewVideoOutput();

public slots:
    void updateRates(); // public: re-run when bootstrap refreshes credit rates
    void startSession(const QString &provider, const QString &tier);
    void stopSession();
    void setActiveCharacter(const QString &id, const QString &name = {}, const QString &image = {}, const QString &prompt = {});
    void setCameraManager(CameraManager *cam);
    void commitPrompt(const QString &prompt);
    void tickFrame();
    void applyCooldown(int seconds = 3);
    void reportError(const QString &message);

signals:
    void isActiveChanged();
    void connectionStatusChanged();
    void statusTextChanged();
    void queueChanged();
    void reconnectingChanged();
    void ratesChanged();
    void elapsedChanged();
    void framesChanged();
    void firstFrameChanged();
    void activeCharacterChanged();
    void activePromptChanged();
    void scenePromptChanged();
    void activeSceneChanged();
    void sceneEnabledChanged();
    void identityLockChanged();
    void enhancePromptsChanged();
    void cooldownChanged();
    void hdActiveChanged();
    void engineLabelChanged();
    void signalingConnectedChanged();
    void realtimeSessionIdChanged();
    void statsChanged();
    void sessionStarted();
    void sessionStopped();
    void characterSwitchFailed(); // Electron stage.characterSwitchFailed
    void error(const QString &message);
    void morphFrameReady(const QImage &image);
    /// Forwarded from signaling for a native WebRTC peer to consume
    void remoteAnswerReceived(const QString &sdp);
    void remoteIceCandidateReceived(const QJsonObject &candidate);
    void remoteIceRestartRequested(const QVariantMap &turnConfig);
    void peerConnectionNeeded(const QString &model);
    void peerVideoSinkChanged();
    void popoutVideoSinkChanged();
    void previewVideoSinkChanged();

private:
    void setStatus(Status s, const QString &text = {}, ErrorKind kind = ErrorKind::Other);
    void pushActiveTargetsToProvider();
    void pushSceneToProvider();
    void wireSignaling();
    void createNativePeer();
    void destroyNativePeer();
    QString wsBaseUrl() const;
    void scheduleReconnect();
    QString composedPrompt() const;
    int swapFailureCooldown() const;

    AuthManager *m_auth = nullptr;
    ConfigManager *m_config = nullptr;
    BackendClient *m_backend = nullptr;
    bool m_cameraFrameConsumer = false;
    WebRtcSignalingClient *m_signaling = nullptr;
    GstRtcPeer *m_peer = nullptr;
    CameraManager *m_camera = nullptr;
    // Dedicated aux sinks for the popout / preview windows (registered on the
    // peer while it lives).
    QVideoSink *m_popoutSink = nullptr;
    QVideoSink *m_previewSink = nullptr;
    // Internal sinks of the currently bound VideoOutput items (owned by those
    // items; tracked via QPointer so a destroyed window drops out safely).
    QPointer<QVideoSink> m_stageWindowSink;
    QPointer<QVideoSink> m_popoutWindowSink;
    QPointer<QVideoSink> m_previewWindowSink;

    bool m_active = false;
    int m_lastElapsedNotifySec = -1;
    bool m_signalingConnected = false;
    Status m_status = Status::Idle;
    ErrorKind m_errorKind = ErrorKind::None;
    int m_queuePosition = 0;
    int m_queueSize = 0;
    bool m_reconnecting = false;
    QString m_statusText = tr("Ready");
    QString m_provider = QStringLiteral("decart");
    QString m_tier = QStringLiteral("standard");
    QString m_realtimeSessionId;
    double m_creditsPerSec = 2.0;
    QElapsedTimer m_timer;
    QTimer m_tickTimer;
    QTimer m_cooldownTimer;
    int m_frames = 0;
    int m_cooldownSec = 0;
    int m_tickCount = 0; // 100ms UI ticks since session start
    bool m_hd = false;
    bool m_identityLock = true; // Electron session store default: ON
    bool m_enhance = true;
    bool m_sceneEnabled = false;
    QString m_characterId;
    QString m_characterName;
    QString m_characterImage;
    QString m_prompt;
    QString m_scene;
    QString m_scenePrompt;
    QTimer m_reconnectTimer;
    QTimer m_connectWatchdog; // 15s first-connect timeout (Electron connect timeout)
    int m_reconnectAttempts = 0;
    // Per-session reconnect total: m_reconnectAttempts resets on every
    // successful connect, so without this a stalling engine loops forever.
    int m_sessionReconnects = 0;
    bool m_wantReconnect = false;
    bool m_connectingProactively = false; // self-issued connect — its induced disconnect must not re-arm the ladder
    int m_consecutiveSwapFailures = 0;   // Electron swap-failure ladder 0/15/60/300s
    double m_rttMs = -1;                  // cached from GstRtcPeer stats pump
    static const int kMaxReconnectAttempts = 5;
    static const int kConnectTimeoutMs = 15000;
    static const int kFirstFrameTimeoutMs = 35000; // Electron no-output watchdog (Du)
};
