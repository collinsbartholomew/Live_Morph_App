#include "I18nManager.h"

#include <QCoreApplication>
#include <QStandardPaths>
#include <QDir>
#include <QFile>
#include <QFileInfo>
#include <QSaveFile>
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
#include <QRegularExpression>

static const QStringList kLanguages = {
    QStringLiteral("en"), QStringLiteral("es"), QStringLiteral("fr"),
    QStringLiteral("de"), QStringLiteral("pt"), QStringLiteral("it"),
    QStringLiteral("nl"), QStringLiteral("pl"), QStringLiteral("sv"),
    QStringLiteral("tr"), QStringLiteral("ru"), QStringLiteral("uk"),
    QStringLiteral("ar"), QStringLiteral("hi"), QStringLiteral("id"),
    QStringLiteral("vi"), QStringLiteral("th"), QStringLiteral("zh"),
    QStringLiteral("ja"), QStringLiteral("ko"),
};

// The translate_a/t endpoint returns one entry per q= item, but the nesting
// differs by client (dict-chrome-ex: [["Hola","Hello",...]], gtx:
// [[["Hola","Hello",...]],...]). Return the first string found at any depth so
// the translated text is extracted regardless of the wire shape.
static QString firstStringDeep(const QJsonValue &v, int depth = 0)
{
    if (v.isString())
        return v.toString();
    if (v.isArray() && depth < 4) {
        const QJsonArray a = v.toArray();
        for (int i = 0; i < a.size(); ++i) {
            const QString s = firstStringDeep(a[i], depth + 1);
            if (!s.isEmpty())
                return s;
        }
    }
    return {};
}

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

QString I18nManager::languageDisplayName(const QString &code) const
{
    const QString c = code.trimmed().toLower();
    const QLocale loc(c);
    const QString native = loc.nativeLanguageName();
    if (native.isEmpty())
        return c.toUpper();
    QString label = native;
    if (!label.isEmpty())
        label[0] = label[0].toUpper();
    return label + QStringLiteral(" (") + c.toUpper() + QLatin1Char(')');
}

void I18nManager::setLanguage(const QString &lang)
{
    QString code = lang.trimmed().toLower();
    // Normalize locale tags ("pt-BR", "zh_CN", "en-US") to the bare 2-letter code.
    if (code.contains(QLatin1Char('_')) || code.contains(QLatin1Char('-')))
        code = code.left(2);
    if (code.isEmpty())
        code = QLatin1String("en");
    // Validate against the known language list — the code builds a cache file
    // path, so an unvalidated value from the config file would be path traversal.
    if (!availableLanguages().contains(code))
        code = QLatin1String("en");

    // Same language re-selected: keep any in-flight translation running.
    if (code == m_language)
        return;

    // Abort any in-flight translation batch: a stale reply must never
    // overwrite the language the user just switched to.
    abortPendingTranslation();

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

    if (loadAndMaybeRefresh(code) && m_translator) {
        // Commit the language only when a translator was actually installed —
        // otherwise a corrupt cache would set m_language with an English UI.
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
    // Dedup catalog entries by (context, source): the SAME source string in two
    // components lives in two contexts and BOTH must be translated — deduping
    // by source alone silently dropped all but the first context, leaving the
    // other components stuck in English after a language switch.
    QSet<QString> seenPairs;
    QSet<QString> seenSources; // translation-request list stays source-unique
    bool inNumerus = false;
    QString currentSource;

    while (!xml.atEnd()) {
        xml.readNext();
        if (!xml.isStartElement())
            continue;
        if (xml.name() == QLatin1String("name")) {
            currentContext = xml.readElementText();
        } else if (xml.name() == QLatin1String("message")) {
            inNumerus = xml.attributes().value(QLatin1String("numerus")) == QLatin1String("yes");
            currentSource.clear();
        } else if (xml.name() == QLatin1String("source") && !currentContext.isEmpty()) {
            currentSource = xml.readElementText().trimmed();
            if (currentSource.isEmpty())
                continue;
            const QString pairKey = currentContext + QChar(0x1F) + currentSource;
            // QSet::insert returns an iterator in Qt6 — test contains() first.
            if (!seenPairs.contains(pairKey)) {
                seenPairs.insert(pairKey);
                m_catalog.append({currentContext, currentSource});
            }
            if (!seenSources.contains(currentSource)) {
                seenSources.insert(currentSource);
                m_uniqueSources.append(currentSource);
            }
        } else if (xml.name() == QLatin1String("comment") && inNumerus && !currentContext.isEmpty()) {
            // Plural source (qsTr("singular", "plural", n)): translate it too so
            // JsonTranslator can pick the plural form at lookup time.
            const QString plural = xml.readElementText().trimmed();
            if (!plural.isEmpty() && plural != currentSource) {
                const QString pairKey = currentContext + QChar(0x1F) + plural;
                if (!seenPairs.contains(pairKey)) {
                    seenPairs.insert(pairKey);
                    m_catalog.append({currentContext, plural});
                }
                if (!seenSources.contains(plural)) {
                    seenSources.insert(plural);
                    m_uniqueSources.append(plural);
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
    if (fi.lastModified().daysTo(QDateTime::currentDateTime()) > kCacheTtlDays) {
        // Stale — install the cached copy instantly, then refresh in the
        // background (a flaky network must not pin users to old translations).
        const bool ok = loadFromCache(lang);
        startTranslation(lang);
        // Return true even if the cached copy was corrupt: a refresh is already
        // running, and returning false here would make setLanguage() start a
        // second pump on top of the first.
        (void)ok;
        return true;
    }
    return loadFromCache(lang);
}

void I18nManager::startTranslation(const QString &lang)
{
    m_pendingLang = lang;
    m_pendingTexts = m_uniqueSources;
    m_pendingCursor = m_pendingTexts.constBegin();
    // Estimate batch count as the LARGER of the URL-byte budget and the
    // item-count cap (pumpNextBatch enforces BOTH), so progress never exceeds
    // 100% with many short strings.
    int totalBytes = 0;
    for (const QString &t : m_pendingTexts)
        totalBytes += QUrl::toPercentEncoding(t).size() + 3; // "q=" + encoded
    const int byteBatches = qMax(1, (totalBytes + kUrlByteBudget - 1) / kUrlByteBudget);
    const int itemBatches = qMax(1, (m_pendingTexts.size() + kBatchSize - 1) / kBatchSize);
    m_pendingBatchesTotal = qMax(byteBatches, itemBatches);
    m_pendingBatchesDone = 0;
    m_translationResults.clear();
    m_retryCount = 0;
    m_isTranslating = true;
    m_translationProgress = 0;
    emit isTranslatingChanged();
    emit translationProgressChanged();
    pumpNextBatch();
}

void I18nManager::abortPendingTranslation()
{
    ++m_translationGeneration;
    if (m_pendingReply) {
        m_pendingReply->abort();
        m_pendingReply->deleteLater();
        m_pendingReply = nullptr;
    }
    if (m_isTranslating) {
        m_isTranslating = false;
        emit isTranslatingChanged();
    }
}

void I18nManager::pumpNextBatch()
{
    if (m_pendingCursor == m_pendingTexts.constEnd()) {
        finishTranslation();
        return;
    }
    // Grab the next batch — GET with a byte budget: a fixed item count could
    // push a batch of long strings over the server's URL length limit, and
    // this endpoint rejects POST (429), so the query must stay short.
    QStringList batch;
    int budget = kUrlByteBudget;
    while (m_pendingCursor != m_pendingTexts.constEnd()
           && batch.size() < kBatchSize) {
        const QString &t = *m_pendingCursor;
        const int cost = QUrl::toPercentEncoding(t).size() + 3;
        if (!batch.isEmpty() && cost > budget)
            break;
        batch.append(t);
        budget -= cost;
        ++m_pendingCursor;
    }
    if (batch.isEmpty()) { finishTranslation(); return; }

    // Retry budget is per batch: a retry re-pumps the SAME batch (cursor was
    // pushed back), so only reset the counter when the batch actually changed.
    if (batch != m_lastPumpedBatch) {
        m_lastPumpedBatch = batch;
        m_retryCount = 0;
    }

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
    QNetworkReply *reply = m_nam->get(req);
    m_pendingReply = reply;
    const int generation = m_translationGeneration;

    const QStringList batchCopy = batch;
    connect(reply, &QNetworkReply::finished, this, [this, reply, batchCopy, generation]() {
        // Stale reply (batch aborted by a language switch or superseded by a
        // newer pump): ignore it entirely — never touch shared state.
        if (reply != m_pendingReply || generation != m_translationGeneration)
            return;
        const bool ok = (reply->error() == QNetworkReply::NoError);
        const QByteArray raw = ok ? reply->readAll() : QByteArray();
        reply->deleteLater();
        m_pendingReply = nullptr;

        // Parse results FIRST so a 200 with an unexpected shape counts as a
        // (retryable) failure instead of a silent zero-entry batch.
        int parsed = 0;
        if (ok) {
            const QJsonDocument doc = QJsonDocument::fromJson(raw);
            const QJsonArray arr = doc.array();
            const int n = qMin(arr.size(), batchCopy.size());
            for (int i = 0; i < n; ++i) {
                const QString t = firstStringDeep(arr[i]);
                if (!t.isEmpty()) {
                    m_translationResults.insert(batchCopy[i], t);
                    ++parsed;
                }
            }
        }

        const bool retryable = !ok || (parsed == 0 && !batchCopy.isEmpty());
        if (retryable) {
            m_retryCount++;
            emit translationProgressChanged();
            if (m_retryCount <= kMaxRetries) {
                // Pull the batch back — push the cursor back one batch
                for (int i = 0; i < batchCopy.size(); ++i)
                    --m_pendingCursor;
                // Back off before retrying: the endpoint rate-limits bursts with
                // 429, and immediate retries would burn the whole retry budget.
                const int backoffMs = 500 << (m_retryCount - 1); // 500, 1000, 2000, 4000
                QTimer::singleShot(backoffMs, this, [this, generation]() {
                    if (generation != m_translationGeneration)
                        return; // language switched while backing off
                    pumpNextBatch();
                });
                return;
            }
            // Give up on this batch (skip it) and continue with the next one
            m_retryCount = 0;
        } else {
            m_retryCount = 0;
        }

        m_pendingBatchesDone++;
        m_translationProgress = qMin(100, (m_pendingBatchesDone * 100) /
                                qMax(1, m_pendingBatchesTotal));
        emit translationProgressChanged();
        pumpNextBatch();
    });
}

void I18nManager::finishTranslation()
{
    // Nothing translated at all (offline / endpoint rejected POST): do NOT
    // switch language and do NOT write a near-empty cache that would shadow
    // the source strings with nothing.
    if (m_translationResults.isEmpty()) {
        m_isTranslating = false;
        m_translationProgress = 0;
        emit isTranslatingChanged();
        emit translationProgressChanged();
        return;
    }
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

// Translations render via QML Text (default textFormat AutoText = rich text),
// so a poisoned on-disk cache or a hostile endpoint response could inject
// markup (e.g. an <img> tracking pixel) into the UI. Strip all tags from every
// translation value at the single install choke point (covers both the network
// results and the on-disk cache).
static QString sanitizeTranslationValue(const QString &v)
{
    static const QRegularExpression tagRe(QStringLiteral("<[^>]*>"));
    QString s = v;
    s.remove(tagRe);
    s.replace(QLatin1Char('<'), QStringLiteral("&lt;"));
    return s;
}

static QJsonValue sanitizeJsonValue(const QJsonValue &v)
{
    if (v.isString())
        return QJsonValue(sanitizeTranslationValue(v.toString()));
    if (v.isObject()) {
        QJsonObject o;
        for (auto it = v.toObject().constBegin(); it != v.toObject().constEnd(); ++it)
            o.insert(it.key(), sanitizeJsonValue(it.value()));
        return o;
    }
    if (v.isArray()) {
        QJsonArray a;
        for (const auto &e : v.toArray())
            a.append(sanitizeJsonValue(e));
        return a;
    }
    return v;
}

void I18nManager::installFromJson(const QJsonObject &json)
{
    if (m_translator) {
        QCoreApplication::removeTranslator(m_translator);
        delete m_translator;
        m_translator = nullptr;
    }
    m_translator = new JsonTranslator(sanitizeJsonValue(json).toObject(), this);
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
    // QSaveFile: atomic temp+rename (a crash mid-write can never leave a
    // truncated cache with a fresh mtime) and it refuses to follow a
    // pre-existing symlink planted at the cache path.
    QSaveFile f(cachePath(m_pendingLang));
    if (f.open(QIODevice::WriteOnly))
        f.write(doc.toJson());
    if (!f.commit())
        qWarning() << "I18nManager: failed to write translation cache:" << f.errorString();
}
