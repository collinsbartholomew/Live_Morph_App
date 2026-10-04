#include "I18nManager.h"

#include <QCoreApplication>
#include <QStandardPaths>
#include <QDir>
#include <QFile>
#include <QFileInfo>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QXmlStreamReader>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QNetworkRequest>
#include <QSet>
#include <QUrl>
#include <QUrlQuery>
#include <QSettings>
#include <QLocale>
#include <QQmlEngine>
#include <QTimer>
#include <QCryptographicHash>
#include <QDateTime>

static const QStringList kLanguages = {
    QStringLiteral("en"), QStringLiteral("es"), QStringLiteral("fr"),
    QStringLiteral("de"), QStringLiteral("pt"), QStringLiteral("it"),
    QStringLiteral("nl"), QStringLiteral("pl"), QStringLiteral("sv"),
    QStringLiteral("tr"), QStringLiteral("ru"), QStringLiteral("uk"),
    QStringLiteral("ar"), QStringLiteral("hi"), QStringLiteral("id"),
    QStringLiteral("vi"), QStringLiteral("th"), QStringLiteral("zh"),
    QStringLiteral("ja"), QStringLiteral("ko"),
};

I18nManager::I18nManager(QQmlEngine *engine,
                         const QString &appName,
                         const QString &catalogResource,
                         QObject *parent)
    : QObject(parent)
    , m_engine(engine)
    , m_appName(appName)
    , m_catalogResource(catalogResource)
    , m_language(QStringLiteral("en"))
{
    m_nam = new QNetworkAccessManager(this);

    parseCatalog();

    QSettings s(m_appName, m_appName);
    const QString saved = s.value(QStringLiteral("ui/language")).toString();
    const QString initial = saved.isEmpty()
                                ? QLocale::system().name().left(2)
                                : saved;
    const QString lang = initial.isEmpty() ? QStringLiteral("en") : initial;

    QTimer::singleShot(0, this, [this, lang]() { setLanguage(lang); });
}

QStringList I18nManager::availableLanguages() const { return kLanguages; }

void I18nManager::setLanguage(const QString &lang)
{
    QString code = lang.trimmed().toLower();
    if (code.contains(QLatin1Char('_')))
        code = code.left(2);
    if (code.isEmpty())
        code = QLatin1String("en");

    if (code == m_language && !m_isTranslating)
        return;

    if (m_isTranslating) {
        m_isTranslating = false;
        emit isTranslatingChanged();
    }

    if (code == QLatin1String("en")) {
        if (m_translator) {
            QCoreApplication::removeTranslator(m_translator);
            delete m_translator;
            m_translator = nullptr;
        }
        m_language = code;
        QSettings s(m_appName, m_appName);
        s.setValue(QStringLiteral("ui/language"), m_language);
        if (m_engine) m_engine->retranslate();
        emit languageChanged();
        return;
    }

    if (loadAndMaybeRefresh(code)) {
        m_language = code;
        QSettings s(m_appName, m_appName);
        s.setValue(QStringLiteral("ui/language"), m_language);
        if (m_engine) m_engine->retranslate();
        emit languageChanged();
        return;
    }

    startTranslation(code);
}

void I18nManager::parseCatalog()
{
    QFile file(m_catalogResource);
    if (!file.open(QIODevice::ReadOnly | QIODevice::Text))
        return;

    QXmlStreamReader xml(&file);
    QString currentContext;
    QSet<QString> seen;

    while (!xml.atEnd()) {
        xml.readNext();
        if (xml.isStartElement()) {
            if (xml.name() == QLatin1String("name")) {
                currentContext = xml.readElementText();
            } else if (xml.name() == QLatin1String("source")
                       && !currentContext.isEmpty()) {
                QString source = xml.readElementText().trimmed();
                if (!source.isEmpty() && !seen.contains(source)) {
                    seen.insert(source);
                    m_catalog.append({currentContext, source});
                    m_uniqueSources.append(source);
                }
            }
        }
    }
}

QString I18nManager::cachePath(const QString &lang) const
{
    return QStandardPaths::writableLocation(QStandardPaths::AppConfigLocation)
           + QStringLiteral("/translations/") + lang + QStringLiteral(".json");
}

bool I18nManager::loadFromCache(const QString &lang)
{
    QFile file(cachePath(lang));
    if (!file.exists() || !file.open(QIODevice::ReadOnly))
        return false;

    QJsonDocument doc = QJsonDocument::fromJson(file.readAll());
    if (doc.isNull() || !doc.isObject())
        return false;

    installFromJson(doc.object());
    return true;
}

bool I18nManager::loadAndMaybeRefresh(const QString &lang)
{
    const QString path = cachePath(lang);
    QFileInfo fi(path);
    if (!fi.exists() || fi.size() < 4) {
        m_isTranslating = true;
        m_translationProgress = 0;
        emit isTranslatingChanged();
        emit translationProgressChanged();
        return false;
    }
    if (fi.lastModified().daysTo(QDateTime::currentDateTime()) > 7) {
        // Stale — background-refresh, but still load right now for instant UX.
        loadFromCache(lang);
        return true; // still install the (possibly older) copy
    }
    return loadFromCache(lang);
}

void I18nManager::startTranslation(const QString &lang)
{
    m_pendingLang = lang;
    m_pendingTexts = m_uniqueSources;
    m_pendingCursor = m_pendingTexts.constBegin();
    m_pendingBatchesTotal = (m_pendingTexts.size() + kBatchSize - 1) / kBatchSize;
    m_pendingBatchesDone = 0;
    m_translationResults.clear();
    m_retryCount = 0;
    m_isTranslating = true;
    m_translationProgress = 0;
    emit isTranslatingChanged();
    emit translationProgressChanged();
    pumpNextBatch();
}

void I18nManager::pumpNextBatch()
{
    if (m_pendingCursor == m_pendingTexts.constEnd()) {
        finishTranslation();
        return;
    }
    // Grab the next batch
    QStringList batch;
    for (int i = 0; i < kBatchSize && m_pendingCursor != m_pendingTexts.constEnd(); ++i, ++m_pendingCursor)
        batch.append(*m_pendingCursor);
    if (batch.isEmpty()) { finishTranslation(); return; }

    QUrlQuery query;
    query.addQueryItem(QStringLiteral("client"), QStringLiteral("dict-chrome-ex"));
    query.addQueryItem(QStringLiteral("sl"), QStringLiteral("en"));
    query.addQueryItem(QStringLiteral("tl"), m_pendingLang);
    for (const QString &t : batch)
        query.addQueryItem(QStringLiteral("q"), t);

    QUrl url(QStringLiteral("https://clients5.google.com/translate_a/t"));
    url.setQuery(query);

    if (m_pendingReply) { m_pendingReply->abort(); m_pendingReply->deleteLater(); }
    QNetworkRequest req(url);
    req.setTransferTimeout(15000);
    req.setHeader(QNetworkRequest::UserAgentHeader, "LiveMorph/1.8");
    m_pendingReply = m_nam->get(req);

    const QStringList batchCopy = batch;
    connect(m_pendingReply, &QNetworkReply::finished, this, [this, batchCopy]() {
        if (!m_pendingReply) return;
        const bool ok = (m_pendingReply->error() == QNetworkReply::NoError);
        const QByteArray raw = ok ? m_pendingReply->readAll() : QByteArray();
        m_pendingReply->deleteLater();
        m_pendingReply = nullptr;

        if (!ok) {
            m_retryCount++;
            emit translationProgressChanged();
            if (m_retryCount <= kMaxRetries) {
                // Pull the batch back — push the cursor back one batch
                for (int i = 0; i < batchCopy.size(); ++i)
                    --m_pendingCursor;
                // Fall-through: next pump retries
                pumpNextBatch();
                return;
            }
            // Give up on this batch (skip it) and continue with the next one
            m_retryCount = 0;
        } else {
            m_retryCount = 0;
        }

        // Parse results
        const QJsonDocument doc = QJsonDocument::fromJson(raw);
        const QJsonArray arr = doc.array();
        if (ok && arr.size() == batchCopy.size()) {
            for (int i = 0; i < batchCopy.size(); ++i)
                if (arr[i].isString() && !arr[i].toString().isEmpty())
                    m_translationResults.insert(batchCopy[i], arr[i].toString());
        }
        m_pendingBatchesDone++;
        m_translationProgress = (m_pendingBatchesDone * 100) /
                                qMax(1, m_pendingBatchesTotal);
        emit translationProgressChanged();
        pumpNextBatch();
    });
}

void I18nManager::finishTranslation()
{
    writeCache();
    if (loadFromCache(m_pendingLang)) {
        m_language = m_pendingLang;
        QSettings s(m_appName, m_appName);
        s.setValue(QStringLiteral("ui/language"), m_language);
        if (m_engine) m_engine->retranslate();
        emit languageChanged();
    }
    m_isTranslating = false;
    m_translationProgress = 100;
    emit isTranslatingChanged();
    emit translationProgressChanged();
}

void I18nManager::installFromJson(const QJsonObject &json)
{
    if (m_translator) {
        QCoreApplication::removeTranslator(m_translator);
        delete m_translator;
        m_translator = nullptr;
    }
    m_translator = new JsonTranslator(json, this);
    QCoreApplication::installTranslator(m_translator);
}

void I18nManager::writeCache()
{
    QJsonObject contexts;
    for (const auto &entry : m_catalog) {
        const auto it = m_translationResults.constFind(entry.source);
        if (it == m_translationResults.constEnd() || it.value().isEmpty())
            continue;
        if (!contexts.contains(entry.context))
            contexts[entry.context] = QJsonObject();
        QJsonObject ctx = contexts[entry.context].toObject();
        ctx[entry.source] = it.value();
        contexts[entry.context] = ctx;
    }

    QJsonDocument doc(contexts);
    QDir().mkpath(QFileInfo(cachePath(m_pendingLang)).absolutePath());
    QFile f(cachePath(m_pendingLang));
    if (f.open(QIODevice::WriteOnly | QIODevice::Truncate))
        f.write(doc.toJson());
}
