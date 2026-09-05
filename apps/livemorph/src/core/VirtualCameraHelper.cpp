#include "VirtualCameraHelper.h"
#include "StreamServer.h"

#include <QClipboard>
#include <QDesktopServices>
#include <QDir>
#include <QFile>
#include <QFileInfo>
#include <QGuiApplication>
#include <QProcess>
#include <QStandardPaths>
#include <QUrl>

#ifdef Q_OS_LINUX
#  include <fcntl.h>
#  include <unistd.h>
#  include <sys/ioctl.h>
#  include <linux/videodev2.h>
#  include <cstring>
#endif

VirtualCameraHelper::VirtualCameraHelper(StreamServer *stream, QObject *parent)
    : QObject(parent)
    , m_stream(stream)
{
    detectObs();
}

void VirtualCameraHelper::setStatus(const QString &s)
{
    if (m_status == s)
        return;
    m_status = s;
    emit statusMessageChanged();
}

QString VirtualCameraHelper::obsBrowserSourceUrl() const
{
    if (!m_stream)
        return QStringLiteral("http://127.0.0.1:4789/stream");
    const QString u = m_stream->url();
    if (!u.isEmpty())
        return u;
    return QStringLiteral("http://127.0.0.1:%1/stream").arg(m_stream->port());
}

QStringList VirtualCameraHelper::setupSteps() const
{
    return {
        tr("1. Click “Start for OBS” in LiveMorph (starts the local MJPEG stream)."),
        tr("2. Open OBS Studio → Sources → + → Browser."),
        tr("3. Set URL to the LiveMorph stream address (copy button). Width/Height match your stage (e.g. 1280×720)."),
        tr("4. In OBS, click “Start Virtual Camera” (Controls dock)."),
        tr("5. In Zoom / Teams / Meet / Discord, choose the camera named “OBS Virtual Camera”."),
    };
}

QString VirtualCameraHelper::platformHint() const
{
#if defined(Q_OS_WIN)
    return tr("Windows: OBS 26+ includes Virtual Camera. Install OBS once, then use Browser Source + Start Virtual Camera.");
#elif defined(Q_OS_MACOS)
    return tr("macOS: OBS 26.1+ (30+ on macOS 13+). First time: start then stop Virtual Camera once so the system extension is ready.");
#elif defined(Q_OS_LINUX)
    return tr("Linux: OBS Virtual Camera uses v4l2loopback. Install v4l2loopback-dkms if OBS cannot start the virtual camera.");
#else
    return tr("Use OBS Studio’s built-in Virtual Camera with a Browser Source pointed at LiveMorph’s local stream.");
#endif
}

void VirtualCameraHelper::detectObs()
{
    m_obsInstalled = false;
    m_obsPath.clear();

    QStringList candidates;
#if defined(Q_OS_WIN)
    const QString pf = qEnvironmentVariable("ProgramFiles", QStringLiteral("C:/Program Files"));
    const QString pf86 = qEnvironmentVariable("ProgramFiles(x86)", QStringLiteral("C:/Program Files (x86)"));
    candidates << pf + QStringLiteral("/obs-studio/bin/64bit/obs64.exe")
               << pf86 + QStringLiteral("/obs-studio/bin/64bit/obs64.exe")
               << pf + QStringLiteral("/obs-studio/bin/32bit/obs32.exe");
#elif defined(Q_OS_MACOS)
    candidates << QStringLiteral("/Applications/OBS.app/Contents/MacOS/OBS")
               << QStringLiteral("/Applications/OBS.app");
#else
    candidates << QStringLiteral("/usr/bin/obs")
               << QStringLiteral("/usr/local/bin/obs")
               << QStringLiteral("/snap/bin/obs")
               << QStringLiteral("/var/lib/flatpak/exports/bin/com.obsproject.Studio");
    // PATH lookup
    const QString which = QStandardPaths::findExecutable(QStringLiteral("obs"));
    if (!which.isEmpty())
        candidates.prepend(which);
#endif

    for (const QString &c : candidates) {
        if (QFileInfo::exists(c)) {
            m_obsInstalled = true;
            m_obsPath = c;
            break;
        }
    }
    emit obsInstalledChanged();
}

void VirtualCameraHelper::refreshObsDetection()
{
    detectObs();
    setStatus(m_obsInstalled
                  ? tr("OBS detected: %1").arg(m_obsPath)
                  : tr("OBS not found — install from https://obsproject.com"));
}

QStringList VirtualCameraHelper::detectLoopbackDevices() const
{
    QStringList out;
#ifdef Q_OS_LINUX
    QDir dev(QStringLiteral("/dev"));
    const auto entries = dev.entryList({QStringLiteral("video*")}, QDir::System);
    for (const QString &name : entries) {
        const QString path = QStringLiteral("/dev/") + name;
        const int fd = ::open(path.toUtf8().constData(), O_RDWR | O_NONBLOCK);
        if (fd < 0)
            continue;
        struct v4l2_capability cap {};
        if (ioctl(fd, VIDIOC_QUERYCAP, &cap) == 0) {
            const QString card = QString::fromUtf8(reinterpret_cast<const char *>(cap.card));
            const bool loop = card.contains(QStringLiteral("loopback"), Qt::CaseInsensitive)
                              || card.contains(QStringLiteral("OBS"), Qt::CaseInsensitive)
                              || (cap.capabilities & V4L2_CAP_VIDEO_OUTPUT);
            if (loop)
                out << path + QStringLiteral(" (") + card + QLatin1Char(')');
        }
        ::close(fd);
    }
#endif
    return out;
}

bool VirtualCameraHelper::tryOpenV4l2(const QString &path)
{
#ifdef Q_OS_LINUX
    if (m_v4l2Fd >= 0) {
        ::close(m_v4l2Fd);
        m_v4l2Fd = -1;
    }
    m_v4l2Fd = ::open(path.toUtf8().constData(), O_RDWR | O_NONBLOCK);
    return m_v4l2Fd >= 0;
#else
    Q_UNUSED(path);
    return false;
#endif
}

void VirtualCameraHelper::startForObs()
{
    if (!m_stream) {
        setStatus(tr("Stream server unavailable"));
        return;
    }

    // Always start MJPEG — this is the OBS Browser Source input
    if (!m_stream->running())
        m_stream->start();
    if (!m_stream->running()) {
        setStatus(tr("Could not start local stream on port %1").arg(m_stream->port()));
        return;
    }

    m_backend = QStringLiteral("obs-mjpeg");
    m_devicePath = obsBrowserSourceUrl();
    m_active = true;
    emit activeChanged();

    QString msg = tr("OBS feed live: %1 — add Browser Source in OBS, then Start Virtual Camera")
                      .arg(m_devicePath);
#ifdef Q_OS_LINUX
    // Optional: also attach first loopback if present
    const QStringList loops = detectLoopbackDevices();
    if (!loops.isEmpty()) {
        const QString path = loops.first().section(QLatin1Char(' '), 0, 0);
        if (tryOpenV4l2(path)) {
            m_backend = QStringLiteral("obs-mjpeg+v4l2");
            m_devicePath = path;
            msg = tr("OBS MJPEG %1 + v4l2 %2").arg(obsBrowserSourceUrl(), path);
        }
    }
#endif
    if (!m_obsInstalled)
        msg += QStringLiteral(" · ") + tr("OBS not detected — install from obsproject.com");
    setStatus(msg);
}

void VirtualCameraHelper::start()
{
    startForObs();
}

void VirtualCameraHelper::stop()
{
#ifdef Q_OS_LINUX
    if (m_v4l2Fd >= 0) {
        ::close(m_v4l2Fd);
        m_v4l2Fd = -1;
    }
#endif
    // Leave StreamServer running if user still wants raw MJPEG; only clear VC state
    m_active = false;
    m_backend.clear();
    m_devicePath.clear();
    emit activeChanged();
    setStatus(tr("Virtual camera / OBS helper stopped (MJPEG may still be running)"));
}

void VirtualCameraHelper::pushFrame(const QImage &frame)
{
    Q_UNUSED(frame);
    // MJPEG path: StreamServer is fed from the camera pipeline in main.cpp
#ifdef Q_OS_LINUX
    // Optional future: VIDIOC_QBUF raw frames into loopback
#endif
}

void VirtualCameraHelper::copyObsUrl()
{
    const QString u = obsBrowserSourceUrl();
    if (auto *clip = QGuiApplication::clipboard()) {
        clip->setText(u);
        setStatus(tr("Copied for OBS Browser Source: %1").arg(u));
        emit urlCopied();
    }
}

void VirtualCameraHelper::openObsDownloadPage()
{
    QDesktopServices::openUrl(QUrl(QStringLiteral("https://obsproject.com/download")));
}

void VirtualCameraHelper::tryLaunchObs()
{
    detectObs();
    if (!m_obsInstalled || m_obsPath.isEmpty()) {
        openObsDownloadPage();
        setStatus(tr("OBS not installed — opened download page"));
        return;
    }
#if defined(Q_OS_MACOS)
    if (m_obsPath.endsWith(QStringLiteral(".app"))) {
        QProcess::startDetached(QStringLiteral("open"), {m_obsPath});
    } else {
        QProcess::startDetached(m_obsPath, {});
    }
#else
    QProcess::startDetached(m_obsPath, {});
#endif
    setStatus(tr("Launching OBS… then add Browser Source → %1").arg(obsBrowserSourceUrl()));
}
