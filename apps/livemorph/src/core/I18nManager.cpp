#include "I18nManager.h"
#include <QCoreApplication>
#include <QLocale>
#include <QSettings>
#include <QDir>
#include <QFileInfo>

I18nManager::I18nManager(QQmlEngine *engine, QObject *parent)
    : QObject(parent)
    , m_engine(engine)
{
    QSettings s(QStringLiteral("LiveMorph"), QStringLiteral("LiveMorph"));
    const QString saved = s.value(QStringLiteral("ui/language")).toString();
    const QString initial = saved.isEmpty()
                                ? QLocale::system().name().left(2)
                                : saved;
    setLanguage(initial.isEmpty() ? QStringLiteral("en") : initial);
}

QStringList I18nManager::availableLanguages() const
{
    // Wide reach — matches i18n/livemorph_*.ts + qt_add_translations
    return {
        QStringLiteral("en"),
        QStringLiteral("es"),
        QStringLiteral("fr"),
        QStringLiteral("de"),
        QStringLiteral("pt"),
        QStringLiteral("it"),
        QStringLiteral("nl"),
        QStringLiteral("pl"),
        QStringLiteral("sv"),
        QStringLiteral("tr"),
        QStringLiteral("ru"),
        QStringLiteral("uk"),
        QStringLiteral("ar"),
        QStringLiteral("hi"),
        QStringLiteral("id"),
        QStringLiteral("vi"),
        QStringLiteral("th"),
        QStringLiteral("zh"),
        QStringLiteral("ja"),
        QStringLiteral("ko"),
    };
}

void I18nManager::setLanguage(const QString &lang)
{
    QString code = lang.trimmed().toLower();
    if (code.contains(QLatin1Char('_')))
        code = code.left(2);
    if (code.isEmpty())
        code = QStringLiteral("en");

    if (!loadTranslator(code) && code != QLatin1String("en")) {
        loadTranslator(QStringLiteral("en"));
        code = QStringLiteral("en");
    }

    if (m_language == code)
        return;
    m_language = code;

    QSettings s(QStringLiteral("LiveMorph"), QStringLiteral("LiveMorph"));
    s.setValue(QStringLiteral("ui/language"), m_language);

    if (m_engine)
        m_engine->retranslate();

    emit languageChanged();
}

bool I18nManager::loadTranslator(const QString &lang)
{
    QCoreApplication::removeTranslator(&m_translator);

    if (lang == QLatin1String("en"))
        return true;

    const QString appDir = QCoreApplication::applicationDirPath();
    // Prefer Qt resource prefix from qt_add_translations (RESOURCE_PREFIX "/i18n")
    const QStringList candidates = {
        QStringLiteral(":/i18n/livemorph_%1.qm").arg(lang),
        QStringLiteral(":/i18n/%1.qm").arg(lang),
        appDir + QStringLiteral("/i18n/livemorph_%1.qm").arg(lang),
        appDir + QStringLiteral("/../i18n/livemorph_%1.qm").arg(lang),
        appDir + QStringLiteral("/../share/livemorph/i18n/livemorph_%1.qm").arg(lang),
        QStringLiteral("i18n/livemorph_%1.qm").arg(lang),
    };
    for (const QString &path : candidates) {
        if (m_translator.load(path)) {
            QCoreApplication::installTranslator(&m_translator);
            return true;
        }
    }
    return false;
}
