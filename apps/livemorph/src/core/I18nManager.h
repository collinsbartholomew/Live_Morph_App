#pragma once

#include <QObject>
#include <QString>
#include <QStringList>
#include <QTranslator>
#include <QQmlEngine>

/**
 * Runtime language switching for Qt 6 QML.
 *
 * - QML strings use qsTr("...")
 * - Call setLanguage("fr") → loads :/i18n/livemorph_fr.qm → engine->retranslate()
 * - No restart required
 */
class I18nManager : public QObject
{
    Q_OBJECT
    Q_PROPERTY(QString language READ language WRITE setLanguage NOTIFY languageChanged)
    Q_PROPERTY(QStringList availableLanguages READ availableLanguages CONSTANT)

public:
    explicit I18nManager(QQmlEngine *engine, QObject *parent = nullptr);

    QString language() const { return m_language; }
    QStringList availableLanguages() const;

public slots:
    void setLanguage(const QString &lang);

signals:
    void languageChanged();

private:
    bool loadTranslator(const QString &lang);

    QQmlEngine *m_engine = nullptr;
    QTranslator m_translator;
    QString m_language = QStringLiteral("en");
};
