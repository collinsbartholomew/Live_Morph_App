#pragma once

#include <QObject>
#include <QString>
#include <QStringList>
#include <QTimer>
#include <QUuid>
#include <QVariantList>
#include <QVariantMap>
#include <QVideoSink>

class SessionManager;
class ApiClient;
class DecartSignalingClient;
class GstRtcPeer;

class StreamController : public QObject
{
    Q_OBJECT
    Q_PROPERTY(bool connecting READ connecting NOTIFY stateChanged)
    Q_PROPERTY(bool live READ live NOTIFY stateChanged)
    Q_PROPERTY(bool paused READ paused NOTIFY stateChanged)
    Q_PROPERTY(bool recording READ recording NOTIFY recordingChanged)
    Q_PROPERTY(bool theatreMode READ theatreMode NOTIFY theatreChanged)
    Q_PROPERTY(bool frozen READ frozen NOTIFY frozenChanged)
    Q_PROPERTY(QString lastFramePath READ lastFramePath NOTIFY lastFramePathChanged)
    Q_PROPERTY(QString quality READ quality WRITE setQuality NOTIFY qualityChanged)
    Q_PROPERTY(QString latencyText READ latencyText NOTIFY latencyChanged)
    Q_PROPERTY(QString prompt READ prompt WRITE setPrompt NOTIFY promptChanged)
    Q_PROPERTY(bool liveUpdate READ liveUpdate WRITE setLiveUpdate NOTIFY prefsChanged)
    Q_PROPERTY(bool enhance READ enhance WRITE setEnhance NOTIFY prefsChanged)
    Q_PROPERTY(QStringList presets READ presets NOTIFY presetsChanged)
    Q_PROPERTY(QVariantList backgroundPresets READ backgroundPresets NOTIFY presetsChanged)
    Q_PROPERTY(QStringList recentPrompts READ recentPrompts NOTIFY recentChanged)
    Q_PROPERTY(QString referenceFacePath READ referenceFacePath NOTIFY referenceChanged)
    Q_PROPERTY(QString loaderText READ loaderText NOTIFY stateChanged)
    Q_PROPERTY(QString connectionQuality READ connectionQuality NOTIFY latencyChanged)
    Q_PROPERTY(QString sessionId READ sessionId NOTIFY stateChanged)
    Q_PROPERTY(QString engineKey READ engineKey NOTIFY stateChanged)
    Q_PROPERTY(QString signalingUrl READ signalingUrl NOTIFY stateChanged)
    Q_PROPERTY(bool decartConnected READ decartConnected NOTIFY stateChanged)
    Q_PROPERTY(bool decartGenerating READ decartGenerating NOTIFY stateChanged)
    Q_PROPERTY(QVideoSink *peerVideoSink READ peerVideoSink NOTIFY peerVideoSinkChanged)

    // MJPEG / OBS feed properties (aliased as "Mjpeg" in QML)
    Q_PROPERTY(bool running READ feedRunning NOTIFY feedChanged)
    Q_PROPERTY(QString url READ feedUrl NOTIFY feedChanged)
    Q_PROPERTY(QString feedMode READ feedMode WRITE setFeedMode NOTIFY feedChanged)

public:
    StreamController(SessionManager *session, ApiClient *api,
                     DecartSignalingClient *decart = nullptr, QObject *parent = nullptr);

    bool connecting() const { return m_connecting; }
    bool live() const { return m_live; }
    bool paused() const { return m_paused; }
    bool recording() const { return m_recording; }
    bool theatreMode() const { return m_theatre; }
    bool frozen() const { return m_frozen; }
    QString lastFramePath() const { return m_lastFramePath; }
    QString quality() const { return m_quality; }
    QString latencyText() const { return m_latencyText; }
    QString prompt() const { return m_prompt; }
    bool liveUpdate() const { return m_liveUpdate; }
    bool enhance() const { return m_enhance; }
    QStringList presets() const { return m_presetNames; }
    QVariantList backgroundPresets() const { return m_bgPresets; }
    QStringList recentPrompts() const { return m_recent; }
    QString referenceFacePath() const { return m_refPath; }
    QString loaderText() const { return m_loaderText; }
    QString connectionQuality() const { return m_connQuality; }
    QString sessionId() const { return m_sessionId; }
    QString engineKey() const { return m_engineKey; }
    QString signalingUrl() const { return m_signalingUrl; }
    bool decartConnected() const;
    bool decartGenerating() const;
    QVideoSink *peerVideoSink() const;

    // MJPEG / OBS feed
    bool feedRunning() const { return m_feedRunning; }
    QString feedUrl() const { return m_feedUrl; }
    QString feedMode() const { return m_feedMode; }
    void setFeedMode(const QString &mode);

    void setQuality(const QString &q);
    void setPrompt(const QString &p);
    void setLiveUpdate(bool v);
    void setEnhance(bool v);
    void setBackgroundPresets(const QVariantList &list);

    Q_INVOKABLE void connectEngine();
    Q_INVOKABLE void disconnectEngine();
    Q_INVOKABLE void pauseEffect();
    Q_INVOKABLE void resumeEffect();
    Q_INVOKABLE void toggleRecording();
    Q_INVOKABLE void toggleFreeze();
    Q_INVOKABLE void enterTheatre();
    Q_INVOKABLE void exitTheatre();
    Q_INVOKABLE void applyPreset(const QString &name);
    Q_INVOKABLE void applyPrompt();
    Q_INVOKABLE void selectBackgroundPreset(const QString &presetId, const QString &name = {});
    Q_INVOKABLE void setReferenceFace(const QString &path);
    Q_INVOKABLE void clearReferenceFace();
    Q_INVOKABLE void takeSnapshot();
    Q_INVOKABLE void onFrameGrabbed(const QString &path, const QString &purpose);
    Q_INVOKABLE void loadBackgroundPresets();
    Q_INVOKABLE void start(int port);
    Q_INVOKABLE void stop();

signals:
    void stateChanged();
    void recordingChanged();
    void theatreChanged();
    void frozenChanged();
    void qualityChanged();
    void latencyChanged();
    void promptChanged();
    void prefsChanged();
    void recentChanged();
    void referenceChanged();
    void presetsChanged();
    void snapshotTaken(const QString &path);
    void frameGrabRequested(const QString &purpose);
    void lastFramePathChanged();
    void statusMessage(const QString &msg, const QString &kind);
    void feedChanged();
    void peerVideoSinkChanged();

private:
    void onBurnTick();
    void startDecartSignaling();
    void stopDecartSignaling();
    void sendReferenceFaceToDecart();
    void startNativePeer();
    void stopNativePeer();

    SessionManager *m_session = nullptr;
    ApiClient *m_api = nullptr;
    DecartSignalingClient *m_decart = nullptr;
    GstRtcPeer *m_peer = nullptr;
    QString m_signalingUrl;
    QTimer m_burnTimer;
    QTimer m_connectWatchdog;
    bool m_connecting = false;
    bool m_live = false;
    bool m_paused = false;
    bool m_recording = false;
    bool m_theatre = false;
    bool m_frozen = false;
    bool m_pendingSnapshot = false;
    QString m_lastFramePath;
    QString m_recordDir;
    int m_recordFrameIndex = 0;
    QTimer *m_recordTimer = nullptr;
    QTimer *m_recordFallbackTimer = nullptr;
    QString m_recordMp4Path;
    bool m_preferMp4 = true;
    bool m_liveUpdate = true;
    bool m_enhance = true;
    QString m_quality = QStringLiteral("high");
    QString m_latencyText = QStringLiteral("—");
    QString m_connQuality = QStringLiteral("—");
    QString m_prompt;
    QString m_refPath;
    QString m_loaderText = QStringLiteral("CONNECTING TO ENGINE…");
    QString m_sessionId;
    QString m_engineKey;
    QStringList m_recent;
    QStringList m_presetNames;
    QVariantList m_bgPresets;
    bool m_feedRunning = false;
    QString m_feedUrl;
    QString m_feedMode = QStringLiteral("camera");
};
