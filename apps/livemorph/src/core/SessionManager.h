#pragma once

#include <QObject>
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
    Q_PROPERTY(QString activeCharacterId READ activeCharacterId NOTIFY activeCharacterChanged)
    Q_PROPERTY(QString activeCharacterName READ activeCharacterName NOTIFY activeCharacterChanged)
    Q_PROPERTY(QString activeCharacterImage READ activeCharacterImage NOTIFY activeCharacterChanged)
    Q_PROPERTY(QString activePrompt READ activePrompt NOTIFY activePromptChanged)
    Q_PROPERTY(QString scenePrompt READ scenePrompt NOTIFY scenePromptChanged)
    Q_PROPERTY(QString activeScene READ activeScene NOTIFY activeSceneChanged)
    Q_PROPERTY(bool sceneEnabled READ sceneEnabled NOTIFY sceneEnabledChanged)
    Q_PROPERTY(bool identityLockEnabled READ identityLockEnabled WRITE setIdentityLockEnabled NOTIFY identityLockChanged)
    Q_PROPERTY(bool cooldownActive READ cooldownActive NOTIFY cooldownChanged)
    Q_PROPERTY(int cooldownRemainingSec READ cooldownRemainingSec NOTIFY cooldownChanged)
    Q_PROPERTY(bool hdActive READ hdActive WRITE setHdActive NOTIFY hdActiveChanged)
    Q_PROPERTY(QString engineLabel READ engineLabel NOTIFY engineLabelChanged)
    Q_PROPERTY(bool signalingConnected READ signalingConnected NOTIFY signalingConnectedChanged)
    Q_PROPERTY(QString realtimeSessionId READ realtimeSessionId NOTIFY realtimeSessionIdChanged)
    Q_PROPERTY(QVideoSink *peerVideoSink READ peerVideoSink NOTIFY peerVideoSinkChanged)

public:
    enum class Status { Idle, Connecting, Connected, Generating, Cooldown, InsufficientCredits, Error };
    Q_ENUM(Status)

    explicit SessionManager(AuthManager *auth, ConfigManager *config, BackendClient *backend,
                            WebRtcSignalingClient *signaling,
                            QObject *parent = nullptr);

    bool isActive() const { return m_active; }
    QString connectionStatus() const;
    QString statusText() const { return m_statusText; }
    double creditsPerSecond() const { return m_creditsPerSec; }
    double elapsedSec() const;
    int framesProcessed() const { return m_frames; }
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
    bool identityLockEnabled() const { return m_identityLock; }
    void setIdentityLockEnabled(bool v);
    bool cooldownActive() const { return m_cooldownSec > 0; }
    int cooldownRemainingSec() const { return m_cooldownSec; }
    bool hdActive() const { return m_hd; }
    void setHdActive(bool v);
    QString engineLabel() const;
    bool signalingConnected() const { return m_signalingConnected; }
    QString realtimeSessionId() const { return m_realtimeSessionId; }
    QVideoSink *peerVideoSink() const;

public slots:
    void startSession(const QString &provider, const QString &tier);
    void stopSession();
    void setActiveCharacter(const QString &id, const QString &name = {}, const QString &image = {}, const QString &prompt = {});
    void setCameraManager(CameraManager *cam);
    void commitPrompt(const QString &prompt);
    void tickFrame();
    void applyCooldown(int seconds = 3);
    void reportError(const QString &message);
    /// Called by a native WebRTC peer when local SDP offer is ready
    void onLocalOfferReady(const QString &sdp);
    void onLocalIceCandidate(const QJsonObject &candidate);

signals:
    void isActiveChanged();
    void connectionStatusChanged();
    void statusTextChanged();
    void ratesChanged();
    void elapsedChanged();
    void framesChanged();
    void activeCharacterChanged();
    void activePromptChanged();
    void scenePromptChanged();
    void activeSceneChanged();
    void sceneEnabledChanged();
    void identityLockChanged();
    void cooldownChanged();
    void hdActiveChanged();
    void engineLabelChanged();
    void signalingConnectedChanged();
    void realtimeSessionIdChanged();
    void sessionStarted();
    void sessionStopped();
    void creditsDeducted(int amount);
    void error(const QString &message);
    void morphFrameReady(const QImage &image);
    /// Forwarded from signaling for a native WebRTC peer to consume
    void remoteAnswerReceived(const QString &sdp);
    void remoteIceCandidateReceived(const QJsonObject &candidate);
    void remoteIceRestartRequested();
    void peerConnectionNeeded(const QString &model);
    void peerVideoSinkChanged();

private:
    void setStatus(Status s, const QString &text = {});
    void updateRates();
    void pushActiveTargetsToProvider();
    void wireSignaling();
    void createNativePeer();
    void destroyNativePeer();
    QString wsBaseUrl() const;

    AuthManager *m_auth = nullptr;
    ConfigManager *m_config = nullptr;
    BackendClient *m_backend = nullptr;
    WebRtcSignalingClient *m_signaling = nullptr;
    GstRtcPeer *m_peer = nullptr;
    CameraManager *m_camera = nullptr;

    bool m_active = false;
    bool m_signalingConnected = false;
    Status m_status = Status::Idle;
    QString m_statusText = QStringLiteral("Ready");
    QString m_provider = QStringLiteral("decart");
    QString m_tier = QStringLiteral("standard");
    QString m_realtimeSessionId;
    double m_creditsPerSec = 2.0;
    QElapsedTimer m_timer;
    QTimer m_tickTimer;
    QTimer m_cooldownTimer;
    int m_frames = 0;
    int m_cooldownSec = 0;
    bool m_hd = false;
    bool m_identityLock = false;
    bool m_sceneEnabled = false;
    QString m_characterId;
    QString m_characterName;
    QString m_characterImage;
    QString m_prompt;
    QString m_scene;
    QString m_scenePrompt;
};
