#pragma once

#include <QAbstractListModel>
#include <QString>
#include <QVector>
#include <QVariantMap>

struct PresetEntry {
    QString id;
    QString name;
    QString prompt;
    QString thumbnail;
    QString mode; // character | prompt | scene
};

class PresetModel : public QAbstractListModel
{
    Q_OBJECT
    Q_PROPERTY(int count READ rowCount NOTIFY countChanged)

public:
    enum Roles {
        IdRole = Qt::UserRole + 1,
        NameRole,
        PromptRole,
        ThumbnailRole,
        ModeRole
    };

    explicit PresetModel(QObject *parent = nullptr);

    int rowCount(const QModelIndex &parent = {}) const override;
    QVariant data(const QModelIndex &index, int role = Qt::DisplayRole) const override;
    QHash<int, QByteArray> roleNames() const override;

public slots:
    void load();
    void addCustom(const QString &name, const QString &prompt, const QString &mode = QStringLiteral("prompt"));
    void rename(int index, const QString &newName);
    void removeAt(int index);
    void move(int from, int to);
    QVariantMap get(int index) const;

signals:
    void countChanged();
    void loaded();

private:
    QVector<PresetEntry> m_items;
};
