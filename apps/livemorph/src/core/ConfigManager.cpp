#include <QDebug>
#include <QSettings>
#include <QSet>
#include <QUrl>
#include <QRegularExpression>
#include "ConfigManager.h"

namespace {
const QString kDefaultApiBaseUrl = QStringLiteral("http://127.0.0.1:3874");

bool isLoopbackHost(const QString &host)
{
    return host == QLatin1String("127.0.0.1") || host == QLatin1String("localhost")
        || host == QLatin1String("::1") || host == QLatin1String("[::1]");
}

// Normalize a candidate API base URL into a safe value, or return empty when
// the input is unusable. Shared by the setter AND the getter so a persisted or
// env-provided value can never bypass the plaintext-remote-host rule.
QString normalizeApiBaseUrl(const QString &raw)
{
    QString v = raw.trimmed();
    while (v.endsWith(QLatin1Char('/')))
        v.chop(1);
    if (v.isEmpty())
        return {};
    // Only allow http(s) with a real host — prevent file:/javascript:/etc.
    // scheme injection into the network stack.
    if (!v.startsWith(QLatin1String("http://")) && !v.startsWith(QLatin1String("https://")))
        v = QStringLiteral("http://") + v;
    const QUrl url(v);
    if ((url.scheme() != QLatin1String("http") && url.scheme() != QLatin1String("https"))
        || url.host().isEmpty())
        return {};
    if (url.scheme() == QLatin1String("http") && !isLoopbackHost(url.host())) {
        // The JWT travels in the Authorization header — plain http to ANY
        // non-loopback host (including *.local mDNS names) would expose it on
        // the wire. Upgrade so the effective value can never send the token in
        // cleartext.
        v.replace(QLatin1String("http://"), QLatin1String("https://"));
    }
    return v;
}
} // namespace

ConfigManager::ConfigManager(QObject *parent)
    : QObject(parent)
    , m_settings(QStringLiteral("LiveMorph"), QStringLiteral("LiveMorph"))
{
    // One-time migrate settings from pre-rebrand organization key
    QSettings legacy(QStringLiteral("TheTools Hub"), QStringLiteral("LiveMorph"));
    if (!m_settings.contains(QStringLiteral("api/baseUrl")) && legacy.contains(QStringLiteral("api/baseUrl"))) {
        const auto keys = legacy.allKeys();
        for (const QString &k : keys)
            m_settings.setValue(k, legacy.value(k));
        m_settings.sync();
    }
}

bool ConfigManager::startWithCamera() const
{
    return m_settings.value(QStringLiteral("camera/startWithCamera"), true).toBool();
}

void ConfigManager::setStartWithCamera(bool v)
{
    if (startWithCamera() == v) return;
    m_settings.setValue(QStringLiteral("camera/startWithCamera"), v);
    emit startWithCameraChanged();
    emit configChanged();
}

bool ConfigManager::mirrorCamera() const
{
    return m_settings.value(QStringLiteral("camera/mirror"), true).toBool();
}

void ConfigManager::setMirrorCamera(bool v)
{
    if (mirrorCamera() == v) return;
    m_settings.setValue(QStringLiteral("camera/mirror"), v);
    emit mirrorCameraChanged();
    emit configChanged();
}

int ConfigManager::streamPort() const
{
    // Clamp on read too: a hand-edited settings file with 0/70000 must not
    // reach the TCP bind. Lower bound 1024 matches StreamServer's own check
    // (ports <1024 are privileged and the MJPEG server rejects them).
    return qBound(1024, m_settings.value(QStringLiteral("stream/port"), 4789).toInt(), 65535);
}

void ConfigManager::setStreamPort(int port)
{
    // Clamp to [1024, 65535] to match StreamServer's own validation — a lower
    // value would make the MJPEG server fail to bind (or bind a random port)
    // silently.
    port = qBound(1024, port, 65535);
    if (streamPort() == port) return;
    m_settings.setValue(QStringLiteral("stream/port"), port);
    emit streamPortChanged();
    emit configChanged();
}

bool ConfigManager::autoRecord() const
{
    return m_settings.value(QStringLiteral("recording/autoRecord"), false).toBool();
}

void ConfigManager::setAutoRecord(bool v)
{
    if (autoRecord() == v) return;
    m_settings.setValue(QStringLiteral("recording/autoRecord"), v);
    emit autoRecordChanged();
    emit configChanged();
}

bool ConfigManager::onboardingDone() const
{
    return m_settings.value(QStringLiteral("ui/onboardingDone"), false).toBool();
}

void ConfigManager::setOnboardingDone(bool v)
{
    if (onboardingDone() == v) return;
    m_settings.setValue(QStringLiteral("ui/onboardingDone"), v);
    emit onboardingDoneChanged();
}

bool ConfigManager::workshopCollapsed() const
{
    return m_settings.value(QStringLiteral("ui/workshopCollapsed"), false).toBool();
}

void ConfigManager::setWorkshopCollapsed(bool v)
{
    if (workshopCollapsed() == v) return;
    m_settings.setValue(QStringLiteral("ui/workshopCollapsed"), v);
    emit workshopCollapsedChanged();
}

bool ConfigManager::promptBarVisible() const
{
    return m_settings.value(QStringLiteral("ui/promptBarVisible"), false).toBool();
}

void ConfigManager::setPromptBarVisible(bool v)
{
    if (promptBarVisible() == v) return;
    m_settings.setValue(QStringLiteral("ui/promptBarVisible"), v);
    emit promptBarVisibleChanged();
}

bool ConfigManager::compactChrome() const
{
    return m_settings.value(QStringLiteral("ui/compactChrome"), false).toBool();
}

void ConfigManager::setCompactChrome(bool v)
{
    if (compactChrome() == v) return;
    m_settings.setValue(QStringLiteral("ui/compactChrome"), v);
    emit compactChromeChanged();
}

QString ConfigManager::whatsNewSeenVersion() const
{
    return m_settings.value(QStringLiteral("ui/whatsNewSeenVersion")).toString();
}

void ConfigManager::setWhatsNewSeenVersion(const QString &v)
{
    if (whatsNewSeenVersion() == v) return;
    m_settings.setValue(QStringLiteral("ui/whatsNewSeenVersion"), v);
    emit whatsNewSeenVersionChanged();
}

QString ConfigManager::defaultModel() const
{
    // 1. Explicit user choice wins.
    const QString saved = m_settings.value(QStringLiteral("decart/model")).toString();
    if (!saved.isEmpty())
        return saved;
    // 2. Server-advertised default from bootstrap (decart.default_model).
    if (!m_serverDefaultModel.isEmpty())
        return m_serverDefaultModel;
    // 3. Hardcoded fallback.
    return QStringLiteral("lucy-2.6");
}

void ConfigManager::setServerDefaultModel(const QString &m)
{
    const QString v = m.trimmed();
    if (v == m_serverDefaultModel)
        return;
    m_serverDefaultModel = v;
    // Only re-notify when no explicit user setting shadows the server default.
    if (m_settings.value(QStringLiteral("decart/model")).toString().isEmpty())
        emit defaultModelChanged();
}

void ConfigManager::setDefaultModel(const QString &m)
{
    // Validate: a model id is a short slug; anything else would 400 every
    // session start server-side (the backend only accepts allow-listed ids).
    static const QRegularExpression modelRe(QStringLiteral("^[A-Za-z0-9._-]{1,64}$"));
    const QString v = m.trimmed();
    if (v.isEmpty() || !modelRe.match(v).hasMatch())
        return; // reject — keep the previous valid model
    if (defaultModel() == v) return;
    m_settings.setValue(QStringLiteral("decart/model"), v);
    emit defaultModelChanged();
    emit configChanged();
}

QString ConfigManager::apiBaseUrl() const
{
    // 1. Environment variable takes priority (single source of truth) — but
    // run through the same normalizer as the setter so a bad env value can
    // never point the JWT at a plaintext remote host.
    const QByteArray envUrl = qgetenv("LIVEMORPH_API_URL");
    if (!envUrl.isEmpty()) {
        const QString normalized = normalizeApiBaseUrl(QString::fromUtf8(envUrl));
        if (!normalized.isEmpty())
            return normalized;
    }
    // 2. Persisted user setting (from Settings drawer) — same normalization:
    // a stale/hand-edited plaintext remote value is upgraded, not trusted.
    const QString saved = m_settings.value(QStringLiteral("api/baseUrl")).toString();
    if (!saved.isEmpty()) {
        const QString normalized = normalizeApiBaseUrl(saved);
        if (!normalized.isEmpty())
            return normalized;
    }
    // 3. Fall back to local dev default
    return kDefaultApiBaseUrl;
}

void ConfigManager::setApiBaseUrl(const QString &u)
{
    if (u.trimmed().isEmpty())
        return; // don't save empty URL — will fall back to default on next read
    const QString v = normalizeApiBaseUrl(u);
    if (v.isEmpty()) {
        qWarning() << "ConfigManager: rejecting invalid apiBaseUrl:" << u;
        return;
    }
    if (apiBaseUrl() == v) return;
    m_settings.setValue(QStringLiteral("api/baseUrl"), v);
    emit apiBaseUrlChanged();
    emit configChanged();
}

bool ConfigManager::showBuiltinCharacters() const
{
    return m_settings.value(QStringLiteral("catalog/showBuiltin"), true).toBool();
}

void ConfigManager::setShowBuiltinCharacters(bool v)
{
    if (showBuiltinCharacters() == v) return;
    m_settings.setValue(QStringLiteral("catalog/showBuiltin"), v);
    emit showBuiltinCharactersChanged();
    emit configChanged();
}

bool ConfigManager::showCameraBeforeSwap() const
{
    return m_settings.value(QStringLiteral("stage/showCameraBeforeSwap"), true).toBool();
}

void ConfigManager::setShowCameraBeforeSwap(bool v)
{
    if (showCameraBeforeSwap() == v) return;
    m_settings.setValue(QStringLiteral("stage/showCameraBeforeSwap"), v);
    emit showCameraBeforeSwapChanged();
    emit configChanged();
}

bool ConfigManager::productNotifications() const
{
    return m_settings.value(QStringLiteral("notifications/product"), true).toBool();
}

void ConfigManager::setProductNotifications(bool v)
{
    if (productNotifications() == v) return;
    m_settings.setValue(QStringLiteral("notifications/product"), v);
    emit productNotificationsChanged();
    emit configChanged();
}

bool ConfigManager::desktopNotifications() const
{
    return m_settings.value(QStringLiteral("notifications/desktop"), true).toBool();
}

void ConfigManager::setDesktopNotifications(bool v)
{
    if (desktopNotifications() == v) return;
    m_settings.setValue(QStringLiteral("notifications/desktop"), v);
    emit desktopNotificationsChanged();
    emit configChanged();
}

bool ConfigManager::identityLockDefault() const
{
    // Electron session store defaults identity lock ON.
    return m_settings.value(QStringLiteral("session/identityLockDefault"), true).toBool();
}

void ConfigManager::setIdentityLockDefault(bool v)
{
    if (identityLockDefault() == v) return;
    m_settings.setValue(QStringLiteral("session/identityLockDefault"), v);
    emit identityLockDefaultChanged();
    emit configChanged();
}

QString ConfigManager::recordingExtension() const
{
    return m_settings.value(QStringLiteral("recording/extension"), QStringLiteral("mp4")).toString();
}

void ConfigManager::setRecordingExtension(const QString &ext)
{
    // The extension lands in a file name — accept only plain alnum tokens.
    static const QRegularExpression extRe(QStringLiteral("^[A-Za-z0-9]{1,8}$"));
    if (!extRe.match(ext).hasMatch())
        return;
    if (recordingExtension() == ext) return;
    m_settings.setValue(QStringLiteral("recording/extension"), ext);
    emit recordingExtensionChanged();
    emit configChanged();
}

QVariant ConfigManager::value(const QString &key, const QVariant &defaultValue) const
{
    return m_settings.value(key, defaultValue);
}

void ConfigManager::setValue(const QString &key, const QVariant &value)
{
    // QML-reachable: reject empty keys and group traversal so a bad key can
    // never escape the app's own settings scope. The api/ and auth/ groups are
    // also reserved: api/baseUrl must go through the validating setter, and
    // auth/* must never be writable from QML (plaintext token injection).
    if (key.isEmpty() || key.contains(QStringLiteral(".."))
        || key.startsWith(QStringLiteral("api/")) || key.startsWith(QStringLiteral("auth/")))
        return;
    m_settings.setValue(key, value);
    emit configChanged();
}

bool ConfigManager::uploadConsentShown() const
{
    return m_settings.value(QStringLiteral("ui/uploadConsentShown"), false).toBool();
}

void ConfigManager::setUploadConsentShown(bool v)
{
    if (uploadConsentShown() == v) return;
    m_settings.setValue(QStringLiteral("ui/uploadConsentShown"), v);
    emit uploadConsentShownChanged();
    emit configChanged();
}

QString ConfigManager::pipVisibility() const
{
    return m_settings.value(QStringLiteral("camera/pipVisibility"), QStringLiteral("whileSwapping")).toString();
}

void ConfigManager::setPipVisibility(const QString &v)
{
    // Whitelist: the PiP only understands these three modes.
    static const QSet<QString> kModes = {
        QStringLiteral("always"), QStringLiteral("whileSwapping"), QStringLiteral("never"),
    };
    if (!kModes.contains(v))
        return;
    if (pipVisibility() == v) return;
    m_settings.setValue(QStringLiteral("camera/pipVisibility"), v);
    emit pipVisibilityChanged();
    emit configChanged();
}

QString ConfigManager::recordingQuality() const
{
    return m_settings.value(QStringLiteral("recording/quality"), QStringLiteral("balanced")).toString();
}

void ConfigManager::setRecordingQuality(const QString &q)
{
    // Whitelist: only the two encoder tiers the recorder understands.
    static const QSet<QString> kQualities = {
        QStringLiteral("balanced"), QStringLiteral("high"),
    };
    if (!kQualities.contains(q))
        return;
    if (recordingQuality() == q) return;
    m_settings.setValue(QStringLiteral("recording/quality"), q);
    emit recordingQualityChanged();
    emit configChanged();
}
