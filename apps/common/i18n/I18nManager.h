#pragma once

#include <QObject>
#include <QString>
#include <QStringList>
#include <QJsonObject>
#include <QLocale>
#include <QTranslator>
#include <QQmlEngine>
#include <QList>
#include <QHash>

class QNetworkAccessManager;
class QNetworkReply;

/**
 * QTranslator subclass that looks up translations from an in-memory JSON object.
 * Format: { "ContextName": { "source": "translation", ... }, ... }
 */
class JsonTranslator : public QTranslator
{
public:
    explicit JsonTranslator(const QJsonObject &translations, QObject *parent = nullptr)
        : QTranslator(parent), m_translations(translations) {}

    QString translate(const char *context, const char *sourceText,
                      const char *disambiguation = nullptr, int n = -1) const override
    {
        QJsonObject ctx = m_translations.value(QString::fromUtf8(context)).toObject();
        // Plural request (qsTr("singular", "plural", n)): Qt passes the plural
        // source as `disambiguation` and the count as `n`. The online cache holds
        // one translation per source string, so pick the form by n (exact for
        // two-form languages, best-effort for CLDR multi-form ones).
        if (disambiguation && n >= 0) {
            const char *key = (n == 1) ? sourceText : disambiguation;
            QString r = ctx.value(QString::fromUtf8(key)).toString();
            if (!r.isEmpty())
                return r;
        }
        // Comment-disambiguated strings still translate by their source text.
        QString result = ctx.value(QString::fromUtf8(sourceText)).toString();
        return result.isEmpty() ? QString() : result;
    }

private:
    QJsonObject m_translations;
};

/**
 * Runtime i18n with async online translation + persistent JSON cache.
 *
 * - English-only in source code (qsTr("..."))
 * - On first non-English switch: enqueue batches on a network queue (NAM),
 *   one batch in flight at a time; UI never blocks (no processEvents hack).
 * - Each batch retried up to N times; on final failure the batch is skipped.
 * - Caches to disk with a TTL — recreated if stale; cached files open instantly.
 * - Partial progress is emitted via `translationProgress` so the UI can show
 *   a live indicator during first translation of a language.
 */
class I18nManager : public QObject
{
    Q_OBJECT
    Q_PROPERTY(QString language READ language WRITE setLanguage NOTIFY languageChanged)
    Q_PROPERTY(QStringList availableLanguages READ availableLanguages CONSTANT)
    Q_PROPERTY(bool isTranslating READ isTranslating NOTIFY isTranslatingChanged)
    /**
     * Progress of the one-time download for a language, 0..100. Useful for
     * showing a thin progress bar on top of the settings drawer.
     */
    Q_PROPERTY(int translationProgress READ translationProgress NOTIFY translationProgressChanged)
    // Milliseconds an already-downloaded cache is considered fresh.
    static constexpr int kCacheTtlDays = 7;

public:
    explicit I18nManager(QQmlEngine *engine,
                         const QString &appName,
                         const QString &catalogResource,
                         QObject *parent = nullptr);

    QString language() const { return m_language; }
    QStringList availableLanguages() const;
    bool isTranslating() const { return m_isTranslating; }
    int translationProgress() const { return m_translationProgress; }

    Q_INVOKABLE void setLanguage(const QString &lang);
    /// Human-readable label for a language code, e.g. "Español (ES)".
    Q_INVOKABLE QString languageDisplayName(const QString &code) const;
    /// Locale name matching the CURRENT UI language (e.g. "de_DE") — use for
    /// Qt.locale(...) in number/date formatting so grouping follows the
    /// interface language instead of a hardcoded en-US.
    Q_INVOKABLE QString uiLocaleName() const { return QLocale(m_language).name(); }
    /// Number of (context, source) pairs in the embedded catalog — every pair
    /// is translated, so duplicate source text across components counts once
    /// per context. Exposed for tests/progress UI.
    int catalogSize() const { return m_catalog.size(); }

signals:
    void languageChanged();
    void isTranslatingChanged();
    void translationProgressChanged();

private:
    struct CatalogEntry {
        QString context;
        QString source;
    };

    void parseCatalog();
    QString cachePath(const QString &lang) const;
    bool loadFromCache(const QString &lang);       // loads regardless of TTL
    bool loadAndMaybeRefresh(const QString &lang);  // re-queues if TTL stale
    void startTranslation(const QString &lang);    // enqueue via NAM — async now
    void pumpNextBatch();
    void abortPendingTranslation();                // cancel in-flight batch (language switch)

    void finishTranslation();
    void installFromJson(const QJsonObject &json);
    void writeCache();

    QQmlEngine *m_engine = nullptr;
    QTranslator *m_translator = nullptr;
    QString m_appName;
    QString m_catalogResource;
    QString m_language;
    bool m_isTranslating = false;
    int m_translationProgress = 0;

    QList<CatalogEntry> m_catalog;
    QStringList m_uniqueSources;

    // Translation state
    QNetworkAccessManager *m_nam = nullptr;
    QNetworkReply *m_pendingReply = nullptr;
    QString m_pendingLang;
    QStringList m_pendingTexts;
    QStringList::const_iterator m_pendingCursor;
    int m_pendingBatchesDone = 0;
    int m_pendingBatchesTotal = 0;
    QHash<QString, QString> m_translationResults;
    int m_retryCount = 0;
    QStringList m_lastPumpedBatch; // batch identity for per-batch retry budget
    // Bumped on every abort: finished-lambdas capture it and bail if stale,
    // so a late reply can never corrupt the new translation batch.
    int m_translationGeneration = 0;
    static constexpr int kBatchSize = 15;
    static constexpr int kMaxRetries = 4;
    // Encoded-query byte budget per GET request (the endpoint 429s on POST).
    static constexpr int kUrlByteBudget = 6000;
};
