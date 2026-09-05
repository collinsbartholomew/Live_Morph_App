#pragma once

#include <QObject>
#include <QString>
#include <QStringList>
#include <QImage>

class StreamServer;

/**
 * OBS Virtual Camera integration (primary supported path) + optional Linux v4l2loopback.
 *
 * Recommended flow (all platforms):
 *   1. startForObs() → local MJPEG StreamServer
 *   2. User adds OBS Browser Source → obsBrowserSourceUrl
 *   3. User clicks "Start Virtual Camera" inside OBS
 *   4. Zoom/Teams/Meet pick "OBS Virtual Camera"
 *
 * This matches OBS Studio’s built-in virtual camera (GPL, maintained) and the
 * original Electron helper model. We do not ship a signed kernel driver.
 */
class VirtualCameraHelper : public QObject
{
    Q_OBJECT
    Q_PROPERTY(bool active READ active NOTIFY activeChanged)
    Q_PROPERTY(QString backend READ backend NOTIFY activeChanged)
    Q_PROPERTY(QString devicePath READ devicePath NOTIFY activeChanged)
    Q_PROPERTY(QString statusMessage READ statusMessage NOTIFY statusMessageChanged)
    Q_PROPERTY(QString obsBrowserSourceUrl READ obsBrowserSourceUrl NOTIFY statusMessageChanged)
    Q_PROPERTY(bool obsInstalled READ obsInstalled NOTIFY obsInstalledChanged)
    Q_PROPERTY(QString obsInstallPath READ obsInstallPath NOTIFY obsInstalledChanged)
    Q_PROPERTY(QStringList setupSteps READ setupSteps CONSTANT)
    Q_PROPERTY(QString platformHint READ platformHint CONSTANT)

public:
    explicit VirtualCameraHelper(StreamServer *stream, QObject *parent = nullptr);

    bool active() const { return m_active; }
    QString backend() const { return m_backend; }
    QString devicePath() const { return m_devicePath; }
    QString statusMessage() const { return m_status; }
    QString obsBrowserSourceUrl() const;
    bool obsInstalled() const { return m_obsInstalled; }
    QString obsInstallPath() const { return m_obsPath; }
    QStringList setupSteps() const;
    QString platformHint() const;

public slots:
    /** Start MJPEG pipeline optimized for OBS Browser Source. */
    void startForObs();
    /** Alias used by existing QML. */
    void start();
    void stop();
    void pushFrame(const QImage &frame);

    void copyObsUrl();
    void openObsDownloadPage();
    void tryLaunchObs();
    void refreshObsDetection();
    QStringList detectLoopbackDevices() const;

signals:
    void activeChanged();
    void statusMessageChanged();
    void obsInstalledChanged();
    void urlCopied();

private:
    void setStatus(const QString &s);
    bool tryOpenV4l2(const QString &path);
    void detectObs();

    StreamServer *m_stream = nullptr;
    bool m_active = false;
    QString m_backend; // obs-mjpeg | v4l2loopback
    QString m_devicePath;
    QString m_status;
    int m_v4l2Fd = -1;
    bool m_obsInstalled = false;
    QString m_obsPath;
};
