#pragma once

#include <QAbstractListModel>
#include <QString>
#include <QStringList>
#include <QVector>
#include <QVariantList>
#include <QVariantMap>

struct CharacterEntry {
    QString id;
    QString name;
    QString category;
    QString thumbnail;   // qrc or file path
    QString description;
    bool isPremium = false;
    bool isStarter = false;
    bool isHidden = false;
};

class CharacterCatalogModel : public QAbstractListModel
{
    Q_OBJECT
    Q_PROPERTY(int count READ rowCount NOTIFY countChanged)
    Q_PROPERTY(QString filterCategory READ filterCategory WRITE setFilterCategory NOTIFY filterChanged)
    Q_PROPERTY(QString searchText READ searchText WRITE setSearchText NOTIFY filterChanged)
    Q_PROPERTY(bool hideStarters READ hideStarters WRITE setHideStarters NOTIFY filterChanged)
    Q_PROPERTY(bool loading READ loading NOTIFY loadingChanged)
    Q_PROPERTY(QStringList categories READ categories NOTIFY categoriesChanged)

public:
    enum Roles {
        IdRole = Qt::UserRole + 1,
        NameRole,
        CategoryRole,
        ThumbnailRole,
        DescriptionRole,
        IsPremiumRole,
        IsStarterRole,
        IsHiddenRole
    };

    explicit CharacterCatalogModel(QObject *parent = nullptr);

    int rowCount(const QModelIndex &parent = {}) const override;
    QVariant data(const QModelIndex &index, int role = Qt::DisplayRole) const override;
    QHash<int, QByteArray> roleNames() const override;

    QString filterCategory() const { return m_filterCategory; }
    void setFilterCategory(const QString &cat);
    QString searchText() const { return m_search; }
    void setSearchText(const QString &t);
    bool hideStarters() const { return m_hideStarters; }
    void setHideStarters(bool v);
    bool loading() const { return m_loading; }
    QStringList categories() const;

public slots:
    void load();
    void loadFromBackend(const QVariantList &entries);
    QVariantMap get(int index) const;
    int indexOfId(const QString &id) const;
    void hideStarter(const QString &id);
    void unhideAll();
    void renameCharacter(const QString &id, const QString &newName);

signals:
    void countChanged();
    void filterChanged();
    void loaded();
    void loadingChanged();
    void categoriesChanged();

private:
    void rebuildFiltered();

    QVector<CharacterEntry> m_all;
    QVector<CharacterEntry> m_filtered;
    QString m_filterCategory;
    QString m_search;
    bool m_hideStarters = false;
    bool m_loading = false;
};
