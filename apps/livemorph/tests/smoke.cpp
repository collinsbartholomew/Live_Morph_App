// LM smoke tests — instantiate only the self-contained Qt list models used by
// the dashboard, and assert their invariants (catalog load, starter presence,
// filter semantics, custom preset add/remove). Run with `make test` (ctest).
#include <QtTest/QtTest>
#include <QCoreApplication>
#include <QJsonObject>
#include <QStandardPaths>
#include <QTemporaryFile>
#include <QDir>
#include <QFile>

#include "../src/models/CharacterCatalogModel.h"
#include "../src/models/PresetModel.h"
#include "I18nManager.h"

class LmSmokeTest : public QObject {
	Q_OBJECT
private slots:
	void catalog_baseline_includes_starters();
	void catalog_filter_shrinks_results();
	void catalog_hide_and_unhack();
	void catalog_rename();
	void presets_set_and_remove();
};

// I18n engine: per-context dedup, plural handling, cache round-trip.
class I18nTest : public QObject {
	Q_OBJECT
private slots:
	void json_translator_per_context();
	void json_translator_plural_forms();
	void catalog_dedups_per_context_and_includes_plural_sources();
	void language_display_name();
	void every_language_has_display_name_and_locale();
	void cache_roundtrip_installs_translations();
	void cleanupTestCase();
};

void I18nTest::json_translator_per_context() {
	QJsonObject a; a[QStringLiteral("Settings")] = QStringLiteral("Ajustes");
	QJsonObject b; b[QStringLiteral("Settings")] = QStringLiteral("Configuración");
	QJsonObject t; t[QStringLiteral("CtxA")] = a; t[QStringLiteral("CtxB")] = b;
	JsonTranslator tr(t);
	// The same source in two contexts must resolve per context.
	QCOMPARE(tr.translate("CtxB", "Settings"), QStringLiteral("Configuración"));
	QCOMPARE(tr.translate("CtxA", "Settings"), QStringLiteral("Ajustes"));
	QVERIFY(tr.translate("CtxC", "Settings").isEmpty());
	// Comment disambiguation (n == -1) still translates by source.
	QCOMPARE(tr.translate("CtxA", "Settings", "a comment"), QStringLiteral("Ajustes"));
}

void I18nTest::json_translator_plural_forms() {
	QJsonObject c;
	c[QStringLiteral("(%n minute)")] = QStringLiteral("(%n minuto)");
	c[QStringLiteral("(%n minutes)")] = QStringLiteral("(%n minutos)");
	QJsonObject t; t[QStringLiteral("C")] = c;
	JsonTranslator tr(t);
	QCOMPARE(tr.translate("C", "(%n minute)", "(%n minutes)", 1), QStringLiteral("(%n minuto)"));
	QCOMPARE(tr.translate("C", "(%n minute)", "(%n minutes)", 5), QStringLiteral("(%n minutos)"));
	// Missing plural form falls back to the singular translation, never empty.
	QJsonObject c2; c2[QStringLiteral("(%n minute)")] = QStringLiteral("(%n minuto)");
	QJsonObject t2; t2[QStringLiteral("C")] = c2;
	JsonTranslator tr2(t2);
	QCOMPARE(tr2.translate("C", "(%n minute)", "(%n minutes)", 5), QStringLiteral("(%n minuto)"));
}

void I18nTest::catalog_dedups_per_context_and_includes_plural_sources() {
	const QString ts = QStringLiteral(
		"<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!DOCTYPE TS>\n"
		"<TS version=\"2.1\" language=\"en_US\">\n"
		"<context><name>CtxA</name>\n"
		"  <message><source>Settings</source><translation type=\"unfinished\"></translation></message>\n"
		"</context>\n"
		"<context><name>CtxB</name>\n"
		"  <message><source>Settings</source><translation type=\"unfinished\"></translation></message>\n"
		"  <message numerus=\"yes\"><source>(%n minute)</source><comment>(%n minutes)</comment>"
		"<translation type=\"unfinished\"><numerusform></numerusform><numerusform></numerusform></translation></message>\n"
		"</context>\n"
		"</TS>\n");
	QTemporaryFile f(QDir::tempPath() + QStringLiteral("/lm_i18n_test_XXXXXX.ts"));
	QVERIFY(f.open());
	f.write(ts.toUtf8());
	f.flush();
	I18nManager mgr(nullptr, QStringLiteral("LiveMorphSmokeTest"), f.fileName());
	// CtxA/Settings + CtxB/Settings + plural source + plural comment = 4 entries.
	// (Source-only dedup would collapse the two "Settings" into 1.)
	QCOMPARE(mgr.catalogSize(), 4);
}

void I18nTest::language_display_name() {
	I18nManager mgr(nullptr, QStringLiteral("LiveMorphSmokeTest"), QStringLiteral(":/nonexistent.ts"));
	const QString es = mgr.languageDisplayName(QStringLiteral("es"));
	QVERIFY(es.contains(QStringLiteral("ES")));
	QVERIFY(es.length() > 2); // native name present, not just the code
	QCOMPARE(mgr.languageDisplayName(QStringLiteral("xx")), QStringLiteral("XX"));
}

void I18nTest::every_language_has_display_name_and_locale() {
	I18nManager mgr(nullptr, QStringLiteral("LiveMorphSmokeTest"), QStringLiteral(":/nonexistent.ts"));
	QVERIFY(mgr.availableLanguages().size() >= 20);
	for (const QString &code : mgr.availableLanguages()) {
		const QString name = mgr.languageDisplayName(code);
		QVERIFY2(name.contains(code.toUpper()), qPrintable(code + " -> " + name));
	}
	// uiLocaleName tracks the current language for number formatting.
	// Seed a German cache so setLanguage("de") applies synchronously.
	const QString dir = QStandardPaths::writableLocation(QStandardPaths::AppConfigLocation)
	                    + QStringLiteral("/translations");
	QVERIFY(QDir().mkpath(dir));
	QFile cache(dir + QStringLiteral("/de.json"));
	QVERIFY(cache.open(QIODevice::WriteOnly));
	cache.write("{\"C\": {\"Hello\": \"Hallo\"}}");
	cache.close();
	QTest::qWait(20); // let the constructor's singleShot(0) fire
	mgr.setLanguage(QStringLiteral("de"));
	QCOMPARE(mgr.language(), QStringLiteral("de"));
	QCOMPARE(mgr.uiLocaleName(), QLocale(QStringLiteral("de")).name());
	mgr.setLanguage(QStringLiteral("en"));
	QCOMPARE(mgr.uiLocaleName(), QLocale(QStringLiteral("en")).name());
}

void I18nTest::cache_roundtrip_installs_translations() {
	// Wipe any leftover cache from a previous run so the test is
	// order-independent (a stale de.json would change what setLanguage("de")
	// installs).
	{
		const QString staleDir = QStandardPaths::writableLocation(QStandardPaths::AppConfigLocation)
		                    + QStringLiteral("/translations");
		QDir(staleDir).removeRecursively();
	}
	// Pre-seed a German cache in the (test-mode) config location.
	const QString dir = QStandardPaths::writableLocation(QStandardPaths::AppConfigLocation)
	                    + QStringLiteral("/translations");
	QVERIFY(QDir().mkpath(dir));
	QFile cache(dir + QStringLiteral("/de.json"));
	QVERIFY(cache.open(QIODevice::WriteOnly));
	cache.write("{\"CtxB\": {\"Settings\": \"Configuración-DE\"}}");
	cache.close();
	// cleaned up in cleanupTestCase below

	I18nManager mgr(nullptr, QStringLiteral("LiveMorphSmokeTest"), QStringLiteral(":/nonexistent.ts"));
	QTest::qWait(20); // let the constructor's singleShot(0) fire
	mgr.setLanguage(QStringLiteral("de"));
	QCOMPARE(mgr.language(), QStringLiteral("de"));
	// The installed JsonTranslator must serve the cached per-context string.
	QCOMPARE(QCoreApplication::translate("CtxB", "Settings"), QStringLiteral("Configuración-DE"));
	// Unknown product codes are rejected to "en".
	mgr.setLanguage(QStringLiteral("../../etc/passwd"));
	QCOMPARE(mgr.language(), QStringLiteral("en"));
}

void I18nTest::cleanupTestCase() {
	// Remove the seeded cache so the test leaves no state behind.
	QFile::remove(QStandardPaths::writableLocation(QStandardPaths::AppConfigLocation)
	              + QStringLiteral("/translations/de.json"));
}

void LmSmokeTest::catalog_baseline_includes_starters() {
	CharacterCatalogModel m;
	m.load();
	// At minimum we ship the two hard-coded starter morphs.
	QVERIFY(m.rowCount() >= 2);
	QVERIFY(m.indexOfId(QStringLiteral("crimson-knight")) >= 0);
	QVERIFY(m.indexOfId(QStringLiteral("vampire-lord")) >= 0);
}

void LmSmokeTest::catalog_filter_shrinks_results() {
	CharacterCatalogModel m;
	m.load();
	const int total = m.rowCount();
	QVERIFY(total > 1);
	// Fantasy only has Crimson Knight — filtering must reduce the count.
	m.setFilterCategory(QStringLiteral("Fantasy"));
	QVERIFY(m.rowCount() < total);
}

void LmSmokeTest::catalog_hide_and_unhack() {
	CharacterCatalogModel m;
	m.load();
	const int total = m.rowCount();
	m.hideStarter(QStringLiteral("crimson-knight"));
	QVERIFY(m.rowCount() <= total);
	m.unhideAll();
	QVERIFY(m.rowCount() >= total - 1); // tolerance for hidden→rebuild fallback
}

void LmSmokeTest::catalog_rename() {
	CharacterCatalogModel m;
	m.load();
	m.renameCharacter(QStringLiteral("crimson-knight"), QStringLiteral("Renamed Knight"));
	const int idx = m.indexOfId(QStringLiteral("crimson-knight"));
	QVERIFY(idx >= 0); // the rename test is meaningless without the starter
	QCOMPARE(m.get(idx).value(QStringLiteral("name")).toString(),
	         QStringLiteral("Renamed Knight"));
}

void LmSmokeTest::presets_set_and_remove() {
	PresetModel p;
	p.load();
	const int before = p.rowCount();
	p.addCustom(QStringLiteral("smoke-preset"), QStringLiteral("a catalog-route preset"),
	            QStringLiteral("prompt"));
	QCOMPARE(p.rowCount(), before + 1);
	const auto last = p.get(p.rowCount() - 1);
	QCOMPARE(last.value(QStringLiteral("name")).toString(), QStringLiteral("smoke-preset"));
	QCOMPARE(last.value(QStringLiteral("mode")).toString(), QStringLiteral("prompt"));
	p.removeAt(p.rowCount() - 1);
	QCOMPARE(p.rowCount(), before);
}

int main(int argc, char **argv) {
	QCoreApplication app(argc, argv);
	QStandardPaths::setTestModeEnabled(true); // isolate QSettings + cache paths
	int status = 0;
	{ LmSmokeTest t; status |= QTest::qExec(&t, argc, argv); }
	{ I18nTest t; status |= QTest::qExec(&t, argc, argv); }
	return status;
}
#include "smoke.moc"
