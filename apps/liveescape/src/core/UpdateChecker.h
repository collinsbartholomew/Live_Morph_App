#pragma once

#include <QObject>
#include <QString>

class ApiClient;

class UpdateChecker : public QObject
{
    Q_OBJECT
public:
    explicit UpdateChecker(ApiClient *api, QObject *parent = nullptr);

    Q_INVOKABLE void check();

signals:
    void forceUpdateRequired(const QString &latestVersion, const QString &downloadUrl);
    void checkFinished(bool forceUpdate);
    void checkFailed();

private:
    ApiClient *m_api = nullptr;
};
