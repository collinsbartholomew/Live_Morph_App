#include "SessionManager.h"
#include "SecureStore.h"

#include <QDateTime>
#include <QHash>
#include <QtMath>

SessionManager::SessionManager(QObject *parent)
    : QObject(parent)
    , m_settings(QStringLiteral("SmokeScreen"), QStringLiteral("Smoke Screen"))
{
    loadFromDisk();
}

QString SessionManager::connectionStatus() const
{
    return m_connected ? QStringLiteral("LIVE") : QStringLiteral("OFFLINE");
}

void SessionManager::setDeviceId(const QString &id)
{
    if (m_deviceId == id)
        return;
    m_deviceId = id;
    saveToDisk();
    emit sessionChanged();
}

void SessionManager::setConnected(bool v)
{
    if (m_connected == v)
        return;
    m_connected = v;
    emit connectedChanged();
}

bool SessionManager::hasFeature(const QString &featureName) const
{
    // Backend LICENSE_TIER_FEATURES — also accept camelCase aliases from QML
    QString key = featureName;
    if (key == QLatin1String("backgroundChange"))
        key = QStringLiteral("background_change");
    else if (key == QLatin1String("creatorProgram"))
        key = QStringLiteral("creator_program");
    else if (key == QLatin1String("referralEarnings"))
        key = QStringLiteral("referral_earnings");
    else if (key == QLatin1String("liveSetupCall"))
        key = QStringLiteral("live_setup_call");
    else if (key == QLatin1String("prioritySupport"))
        key = QStringLiteral("priority_support");
    else if (key == QLatin1String("faceSwap"))
        return true; // all tiers

    static const QHash<QString, QStringList> matrix{
        {QStringLiteral("starter"), {}},
        {QStringLiteral("creator"),
         {QStringLiteral("background_change"),           QStringLiteral("creator_program"), QStringLiteral("referral_earnings")}},
        {QStringLiteral("pro"),
         {QStringLiteral("background_change"),           QStringLiteral("creator_program"), QStringLiteral("referral_earnings"),
          QStringLiteral("live_setup_call"), QStringLiteral("priority_support")}},
        // purchasable packs may map to pro features
        {QStringLiteral("premium"),
         {QStringLiteral("background_change"),           QStringLiteral("creator_program"), QStringLiteral("referral_earnings"),
          QStringLiteral("live_setup_call"), QStringLiteral("priority_support")}},
        {QStringLiteral("elite"),
         {QStringLiteral("background_change"),           QStringLiteral("creator_program"), QStringLiteral("referral_earnings"),
          QStringLiteral("live_setup_call"), QStringLiteral("priority_support")}},
    };

    const QString p = m_plan.isEmpty() ? QStringLiteral("starter") : m_plan.toLower();
    return matrix.value(p).contains(key);
}

void SessionManager::setUser(const QString &email, const QString &name, const QString &userId,
                             const QString &sessionToken)
{
    m_email = email;
    m_displayName = name;
    if (!userId.isEmpty())
        m_userId = userId;
    if (!sessionToken.isEmpty())
        m_sessionToken = sessionToken;
    saveToDisk();
    emit sessionChanged();
}

void SessionManager::setDisplayName(const QString &name)
{
    if (m_displayName == name)
        return;
    m_displayName = name;
    saveToDisk();
    emit sessionChanged();
}

void SessionManager::setPhone(const QString &phone)
{
    if (m_phone == phone)
        return;
    m_phone = phone;
    saveToDisk();
    emit sessionChanged();
}

void SessionManager::setRefreshToken(const QString &token)
{
    if (m_refreshToken == token)
        return;
    m_refreshToken = token;
    SecureStore::write(QStringLiteral("le_refresh"), m_refreshToken);
    emit sessionChanged();
}

void SessionManager::setAccess(const QVariantMap &access)
{
    // ValidateKeyResponse shape
    if (access.contains(QStringLiteral("valid")) && !access.value(QStringLiteral("valid")).toBool())
        return;

    QString key = access.value(QStringLiteral("access_key")).toString();
    if (key.isEmpty())
        key = access.value(QStringLiteral("key")).toString();
    if (!key.isEmpty())
        m_accessKey = key;

    QString plan = access.value(QStringLiteral("plan")).toString();
    if (plan.isEmpty())
        plan = access.value(QStringLiteral("license_type")).toString();
    if (!plan.isEmpty())
        m_plan = plan.toLower();

    const QString exp = access.value(QStringLiteral("expires_at")).toString();
    if (!exp.isEmpty())
        m_licenseExpiry = exp;

    // Entitlement kind: reference tags starter-pack keys with type='starter_pack'
    // so isStarterPackUser() stays true and the mandatory starter lock applies.
    const QString type = access.value(QStringLiteral("type")).toString();
    if (!type.isEmpty()) {
        m_accessType = type;
        if (type == QLatin1String("starter_pack"))
            m_starterPack = true;
        else if (type == QLatin1String("active") && m_accessKey == key)
            m_starterPack = false;
    }

    if (access.contains(QStringLiteral("free_credits"))) {
        const double fc = access.value(QStringLiteral("free_credits")).toDouble();
        if (fc > 0 && m_creditsRemaining <= 0) {
            m_creditsRemaining = fc;
            m_creditsTotal = static_cast<qint64>(fc);
        }
    }

    applyCreditsMap(access);
    saveToDisk();
    emit sessionChanged();
}

bool SessionManager::licenseExpired() const
{
    if (m_licenseExpiry.isEmpty())
        return false;
    const QDateTime d = QDateTime::fromString(m_licenseExpiry, Qt::ISODate);
    if (!d.isValid())
        return false;
    return d < QDateTime::currentDateTimeUtc();
}

void SessionManager::setCredits(qint64 total, double used, double remaining, const QString &plan)
{
    m_creditsTotal = total;
    m_creditsUsed = used;
    m_creditsRemaining = remaining;
    if (!plan.isEmpty())
        m_plan = plan.toLower();
    saveToDisk();
    emit creditsChanged();
    if (!plan.isEmpty())
        emit sessionChanged();
}

void SessionManager::applyCreditsMap(const QVariantMap &credits)
{
    // Handle nested "credits" object: {credits: {total:500, used:0, remaining:500}}
    const QVariant creditsRaw = credits.value(QStringLiteral("credits"));
    if (creditsRaw.canConvert<QVariantMap>()) {
        const QVariantMap nested = creditsRaw.toMap();
        if (nested.contains(QStringLiteral("total")))
            m_creditsTotal = static_cast<qint64>(nested.value(QStringLiteral("total")).toDouble());
        if (nested.contains(QStringLiteral("used")))
            m_creditsUsed = nested.value(QStringLiteral("used")).toDouble();
        if (nested.contains(QStringLiteral("remaining")))
            m_creditsRemaining = nested.value(QStringLiteral("remaining")).toDouble();
    } else if (!creditsRaw.isNull() && creditsRaw.toDouble() > 0 && !credits.contains(QStringLiteral("remaining"))) {
        // Flat number: {credits: 500}
        m_creditsRemaining = creditsRaw.toDouble();
    }

    if (credits.contains(QStringLiteral("total")))
        m_creditsTotal = static_cast<qint64>(credits.value(QStringLiteral("total")).toDouble());
    if (credits.contains(QStringLiteral("used")))
        m_creditsUsed = credits.value(QStringLiteral("used")).toDouble();
    if (credits.contains(QStringLiteral("remaining")))
        m_creditsRemaining = credits.value(QStringLiteral("remaining")).toDouble();
    if (credits.contains(QStringLiteral("new_total")))
        m_creditsTotal = static_cast<qint64>(credits.value(QStringLiteral("new_total")).toDouble());
    if (credits.contains(QStringLiteral("new_used")))
        m_creditsUsed = credits.value(QStringLiteral("new_used")).toDouble();
    if (credits.contains(QStringLiteral("credit_balance"))) {
        const double bal = credits.value(QStringLiteral("credit_balance")).toDouble()
                           + credits.value(QStringLiteral("bonus_balance")).toDouble();
        if (!credits.contains(QStringLiteral("remaining")) && !creditsRaw.canConvert<QVariantMap>())
            m_creditsRemaining = bal;
        if (!credits.contains(QStringLiteral("total")))
            m_creditsTotal = static_cast<qint64>(bal);
    }
    if (credits.contains(QStringLiteral("plan"))) {
        const QString p = credits.value(QStringLiteral("plan")).toString();
        if (!p.isEmpty())
            m_plan = p.toLower();
    }
    throttledSave();
    emit creditsChanged();
}

void SessionManager::setBurnRate(double creditsPerSecond)
{
    if (qFuzzyCompare(m_burnRate, creditsPerSecond))
        return;
    m_burnRate = creditsPerSecond > 0 ? creditsPerSecond : 2.0;
    emit burnRateChanged();
}

void SessionManager::setConsent(bool given)
{
    m_consent = given;
    saveToDisk();
    emit sessionChanged();
}

void SessionManager::setStarterPack(bool v)
{
    if (m_starterPack == v)
        return;
    m_starterPack = v;
    saveToDisk();
    emit sessionChanged();
}

void SessionManager::setMemberSince(const QString &iso)
{
    if (m_memberSince == iso)
        return;
    m_memberSince = iso;
    saveToDisk();
    emit sessionChanged();
}

void SessionManager::setReferralCode(const QString &code)
{
    if (m_referralCode == code)
        return;
    m_referralCode = code;
    saveToDisk();
    emit sessionChanged();
}

void SessionManager::setReferralEarned(double v)
{
    if (qFuzzyCompare(m_referralEarned, v))
        return;
    m_referralEarned = v;
    emit sessionChanged();
}

void SessionManager::setStreamingEnabled(bool enabled)
{
    if (m_streamingEnabled == enabled)
        return;
    m_streamingEnabled = enabled;
    emit platformChanged();
}

void SessionManager::clearSession()
{
    m_email.clear();
    m_displayName.clear();
    m_userId.clear();
    m_sessionToken.clear();
    m_refreshToken.clear();
    m_accessKey.clear();
    SecureStore::remove(QStringLiteral("le_session"));
    SecureStore::remove(QStringLiteral("le_access_key"));
    SecureStore::remove(QStringLiteral("le_refresh"));
    m_plan = QStringLiteral("starter");
    m_referralCode.clear();
    m_licenseExpiry.clear();
    m_creditsTotal = 0;
    m_creditsUsed = 0;
    m_creditsRemaining = 0;
    m_connected = false;
    m_consent = false;
    m_starterPack = false;
    m_accessType.clear();
    m_memberSince.clear();
    m_settings.clear();
    // keep device id
    if (!m_deviceId.isEmpty())
        m_settings.setValue(QStringLiteral("deviceId"), m_deviceId);
    emit sessionChanged();
    emit creditsChanged();
    emit connectedChanged();
}

void SessionManager::clearLicenseState()
{
    m_accessKey.clear();
    SecureStore::remove(QStringLiteral("le_access_key"));
    m_plan = QStringLiteral("starter");
    m_licenseExpiry.clear();
    m_accessType.clear();
    emit sessionChanged();
}

void SessionManager::throttledSave()
{
    if (!m_lastSaveTimer.isValid() || m_lastSaveTimer.elapsed() >= 30000) {
        saveToDisk();
        m_lastSaveTimer.start();
    }
}

void SessionManager::logout()
{
    clearSession();
}

void SessionManager::burnCreditsLocal(double seconds)
{
    if (!m_connected || seconds <= 0)
        return;
    const double burned = seconds * m_burnRate;
    m_creditsUsed += burned;
    m_creditsRemaining = qMax(0.0, m_creditsRemaining - burned);
    emit creditsChanged();
    if (m_creditsRemaining <= 0.0) {
        setConnected(false);
        emit creditsExhausted();
    }
    // Throttle disk writes during live sessions: save at most every 30s
    throttledSave();
}

void SessionManager::loadFromDisk()
{
    m_email = m_settings.value(QStringLiteral("email")).toString();
    m_displayName = m_settings.value(QStringLiteral("displayName")).toString();
    m_phone = m_settings.value(QStringLiteral("phone")).toString();
    m_userId = m_settings.value(QStringLiteral("userId")).toString();
    m_sessionToken = SecureStore::read(QStringLiteral("le_session"));
    m_accessKey = SecureStore::read(QStringLiteral("le_access_key"));
    m_refreshToken = SecureStore::read(QStringLiteral("le_refresh"));
    // Migrate legacy plaintext QSettings once
    if (m_sessionToken.isEmpty()) {
        m_sessionToken = m_settings.value(QStringLiteral("sessionToken")).toString();
        m_accessKey = m_settings.value(QStringLiteral("accessKey")).toString();
        if (!m_sessionToken.isEmpty()) {
            SecureStore::write(QStringLiteral("le_session"), m_sessionToken);
            SecureStore::write(QStringLiteral("le_access_key"), m_accessKey);
            m_settings.remove(QStringLiteral("sessionToken"));
            m_settings.remove(QStringLiteral("accessKey"));
        }
    }
    m_deviceId = m_settings.value(QStringLiteral("deviceId")).toString();
    m_plan = m_settings.value(QStringLiteral("plan"), QStringLiteral("starter")).toString();
    m_licenseExpiry = m_settings.value(QStringLiteral("licenseExpiry")).toString();
    m_referralEarned = 0;
    m_referralCode = m_settings.value(QStringLiteral("referralCode")).toString();
    m_referralEarned = m_settings.value(QStringLiteral("referralEarned")).toDouble();
    m_creditsTotal = m_settings.value(QStringLiteral("creditsTotal"), 0).toLongLong();
    m_creditsUsed = m_settings.value(QStringLiteral("creditsUsed"), 0).toDouble();
    m_creditsRemaining = m_settings.value(QStringLiteral("creditsRemaining"), 0).toDouble();
    m_consent = m_settings.value(QStringLiteral("consent"), false).toBool();
    m_starterPack = m_settings.value(QStringLiteral("starterPack"), false).toBool();
    m_accessType = m_settings.value(QStringLiteral("accessType")).toString();
    m_memberSince = m_settings.value(QStringLiteral("memberSince")).toString();
}

void SessionManager::saveToDisk()
{
    m_settings.setValue(QStringLiteral("email"), m_email);
    m_settings.setValue(QStringLiteral("displayName"), m_displayName);
    m_settings.setValue(QStringLiteral("phone"), m_phone);
    m_settings.setValue(QStringLiteral("userId"), m_userId);
    SecureStore::write(QStringLiteral("le_session"), m_sessionToken);
    SecureStore::write(QStringLiteral("le_access_key"), m_accessKey);
    SecureStore::write(QStringLiteral("le_refresh"), m_refreshToken);
    m_settings.remove(QStringLiteral("sessionToken"));
    m_settings.remove(QStringLiteral("accessKey"));
    m_settings.setValue(QStringLiteral("deviceId"), m_deviceId);
    m_settings.setValue(QStringLiteral("plan"), m_plan);
    m_settings.setValue(QStringLiteral("licenseExpiry"), m_licenseExpiry);
    m_settings.setValue(QStringLiteral("referralCode"), m_referralCode);
    m_settings.setValue(QStringLiteral("referralEarned"), m_referralEarned);
    m_settings.setValue(QStringLiteral("creditsTotal"), m_creditsTotal);
    m_settings.setValue(QStringLiteral("creditsUsed"), m_creditsUsed);
    m_settings.setValue(QStringLiteral("creditsRemaining"), m_creditsRemaining);
    m_settings.setValue(QStringLiteral("consent"), m_consent);
    m_settings.setValue(QStringLiteral("starterPack"), m_starterPack);
    m_settings.setValue(QStringLiteral("accessType"), m_accessType);
    m_settings.setValue(QStringLiteral("memberSince"), m_memberSince);
}
