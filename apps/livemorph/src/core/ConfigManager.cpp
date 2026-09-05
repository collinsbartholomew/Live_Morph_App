#include <QSettings>
#include "ConfigManager.h"

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

QString ConfigManager::language() const
{
    return m_settings.value(QStringLiteral("ui/language"), QStringLiteral("en")).toString();
}

void ConfigManager::setLanguage(const QString &lang)
{
    if (language() == lang) return;
    m_settings.setValue(QStringLiteral("ui/language"), lang);
    emit languageChanged();
    emit configChanged();
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
    return m_settings.value(QStringLiteral("stream/port"), 4789).toInt();
}

void ConfigManager::setStreamPort(int port)
{
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
    return m_settings.value(QStringLiteral("decart/model"), QStringLiteral("lucy-2.1")).toString();
}

void ConfigManager::setDefaultModel(const QString &m)
{
    if (defaultModel() == m) return;
    m_settings.setValue(QStringLiteral("decart/model"), m);
    emit defaultModelChanged();
    emit configChanged();
}

QString ConfigManager::apiBaseUrl() const
{
    // 1. Environment variable takes priority (single source of truth)
    const QByteArray envUrl = qgetenv("LIVEMORPH_API_URL");
    if (!envUrl.isEmpty())
        return QString::fromUtf8(envUrl);
    // 2. Persisted user setting (from Settings drawer)
    const QString saved = m_settings.value(QStringLiteral("api/baseUrl")).toString();
    if (!saved.isEmpty())
        return saved;
    // 3. Fall back to local dev default
    return QStringLiteral("http://127.0.0.1:3874");
}

void ConfigManager::setApiBaseUrl(const QString &u)
{
    QString v = u.trimmed();
    while (v.endsWith(QLatin1Char('/')))
        v.chop(1);
    if (v.isEmpty())
        return; // don't save empty URL — will fall back to default on next read
    // Only allow http(s) — prevent file: or javascript: injection into network stack
    if (!v.startsWith(QLatin1String("http://")) && !v.startsWith(QLatin1String("https://")))
        v = QStringLiteral("http://") + v;
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

bool ConfigManager::identityLockDefault() const
{
    return m_settings.value(QStringLiteral("session/identityLockDefault"), false).toBool();
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
    m_settings.setValue(key, value);
    emit configChanged();
}

QString ConfigManager::decartApiKey() const
{
    return {}; // never expose vendor API keys in the desktop binary
}

void ConfigManager::setDecartApiKey(const QString &)
{
    // Intentionally ignored — Decart keys live only on the backend
}

QString ConfigManager::decartWsUrl() const
{
    return m_settings.value(QStringLiteral("decart/wsUrl"),
                            QStringLiteral("wss://api3.decart.ai/v1/stream")).toString();
}

void ConfigManager::setDecartWsUrl(const QString &u)
{
    if (decartWsUrl() == u) return;
    m_settings.setValue(QStringLiteral("decart/wsUrl"), u);
    emit decartWsUrlChanged();
}
