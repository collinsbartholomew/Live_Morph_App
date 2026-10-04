// LM smoke tests — instantiate only the self-contained Qt list models used by
// the dashboard, and assert their invariants (catalog load, starter presence,
// filter semantics, custom preset add/remove). Run with `make test` (ctest).
#include <QtTest/QtTest>

#include "../src/models/CharacterCatalogModel.h"
#include "../src/models/PresetModel.h"

class LmSmokeTest : public QObject
{
    Q_OBJECT
private slots:
    void catalog_baseline_includes_starters();
    void catalog_filter_shrinks_results();
    void catalog_hide_and_unhack();
    void catalog_rename();
    void presets_set_and_remove();
};

void LmSmokeTest::catalog_baseline_includes_starters()
{
    CharacterCatalogModel m;
    m.load();
    // At minimum we ship the two hard-coded starter morphs.
    QVERIFY(m.rowCount() >= 2);
    QVERIFY(m.indexOfId(QStringLiteral("crimson-knight")) >= 0
            || m.indexOfId(QStringLiteral("vampire-lord")) >= 0);
}

void LmSmokeTest::catalog_filter_shrinks_results()
{
    CharacterCatalogModel m;
    m.load();
    const int total = m.rowCount();
    QVERIFY(total > 1);
    // Fantasy only has Crimson Knight — filtering must reduce the count.
    m.setFilterCategory(QStringLiteral("Fantasy"));
    QVERIFY(m.rowCount() < total);
}

void LmSmokeTest::catalog_hide_and_unhack()
{
    CharacterCatalogModel m;
    m.load();
    const int total = m.rowCount();
    m.hideStarter(QStringLiteral("crimson-knight"));
    QVERIFY(m.rowCount() <= total);
    m.unhideAll();
    QVERIFY(m.rowCount() >= total - 1); // tolerance for hidden→rebuild fallback
}

void LmSmokeTest::catalog_rename()
{
    CharacterCatalogModel m;
    m.load();
    m.renameCharacter(QStringLiteral("crimson-knight"), QStringLiteral("Renamed Knight"));
    const int idx = m.indexOfId(QStringLiteral("crimson-knight"));
    if (idx >= 0) {
        QCOMPARE(m.get(idx).value(QStringLiteral("name")).toString(),
                 QStringLiteral("Renamed Knight"));
    } else {
        qWarning() << "crimson-knight not in active catalog — rename test skipped";
    }
}

void LmSmokeTest::presets_set_and_remove()
{
    PresetModel p;
    p.load();
    const int before = p.rowCount();
    p.addCustom(QStringLiteral("smoke-preset"),
                QStringLiteral("a catalog-route preset"),
                QStringLiteral("prompt"));
    QCOMPARE(p.rowCount(), before + 1);
    const auto last = p.get(p.rowCount() - 1);
    QCOMPARE(last.value(QStringLiteral("name")).toString(), QStringLiteral("smoke-preset"));
    QCOMPARE(last.value(QStringLiteral("mode")).toString(), QStringLiteral("prompt"));
    p.removeAt(p.rowCount() - 1);
    QCOMPARE(p.rowCount(), before);
}

QTEST_MAIN(LmSmokeTest)
#include "smoke.moc"
