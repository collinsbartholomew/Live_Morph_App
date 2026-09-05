#pragma once

#include <QObject>
#include <QString>

class MachineIdProvider : public QObject
{
    Q_OBJECT
    Q_PROPERTY(QString deviceId READ deviceId CONSTANT)
public:
    explicit MachineIdProvider(QObject *parent = nullptr);

    QString deviceId() const;
    Q_INVOKABLE QString getMachineId() const { return deviceId(); }

private:
    QString rawMachineSeed() const;
    static QString buildStableId(const QString &seed);
    QString m_cachedId;
};
