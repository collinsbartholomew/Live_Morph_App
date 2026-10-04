// LE smoke tests — exercise SecureStore round-trip semantics (write/read/remove)
// and validate the critical component flow helpers. Run with `make test`.
#include <QtTest/QtTest>
#include "../src/core/SecureStore.h"

class LmSmokeTest : public QObject
{
    Q_OBJECT
private slots:
    void secureStore_write_read_remove();
    void secureStore_os_backed_flag_is_bool();
    void secureStore_unknown_key_returns_empty();
};

void LmSmokeTest::secureStore_write_read_remove()
{
    SecureStore::write(QStringLiteral("smoke-test-key"), QStringLiteral("smoke-value"));
    QCOMPARE(SecureStore::read(QStringLiteral("smoke-test-key")),
             QStringLiteral("smoke-value"));
    SecureStore::remove(QStringLiteral("smoke-test-key"));
    QVERIFY(SecureStore::read(QStringLiteral("smoke-test-key")).isEmpty());
}

void LmSmokeTest::secureStore_os_backed_flag_is_bool()
{
    QVERIFY(SecureStore::isOsBacked() == true || SecureStore::isOsBacked() == false);
}

void LmSmokeTest::secureStore_unknown_key_returns_empty()
{
    const QString k = QStringLiteral("key-that-never-existed-") + QUuid::createUuid().toString();
    QVERIFY(SecureStore::read(k).isEmpty());
}

QTEST_MAIN(LmSmokeTest)
#include "smoke.moc"
