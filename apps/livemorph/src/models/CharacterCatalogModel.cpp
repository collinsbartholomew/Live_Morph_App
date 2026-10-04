#include "CharacterCatalogModel.h"
#include <QFile>
#include <QFileInfo>
#include <QJsonDocument>
#include <QJsonArray>
#include <QJsonObject>
#include <QDir>
#include <QStandardPaths>
#include <algorithm>

CharacterCatalogModel::CharacterCatalogModel(QObject *parent)
    : QAbstractListModel(parent)
{
}

int CharacterCatalogModel::rowCount(const QModelIndex &parent) const
{
    if (parent.isValid()) return 0;
    return m_filtered.size();
}

QVariant CharacterCatalogModel::data(const QModelIndex &index, int role) const
{
    if (!index.isValid() || index.row() < 0 || index.row() >= m_filtered.size())
        return {};
    const auto &c = m_filtered.at(index.row());
    switch (role) {
    case IdRole:          return c.id;
    case NameRole:        return c.name;
    case CategoryRole:    return c.category;
    case ThumbnailRole:   return c.thumbnail;
    case DescriptionRole: return c.description;
    case IsPremiumRole:   return c.isPremium;
    case IsStarterRole:   return c.isStarter;
    case IsHiddenRole:    return c.isHidden;
    default: return {};
    }
}

QHash<int, QByteArray> CharacterCatalogModel::roleNames() const
{
    return {
        { IdRole,          "characterId" },
        { NameRole,        "name" },
        { CategoryRole,    "category" },
        { ThumbnailRole,   "thumbnail" },
        { DescriptionRole, "description" },
        { IsPremiumRole,   "isPremium" },
        { IsStarterRole,   "isStarter" },
        { IsHiddenRole,    "isHidden" },
    };
}

void CharacterCatalogModel::setFilterCategory(const QString &cat)
{
    if (m_filterCategory == cat) return;
    m_filterCategory = cat;
    rebuildFiltered();
    emit filterChanged();
}

void CharacterCatalogModel::setSearchText(const QString &t)
{
    if (m_search == t) return;
    m_search = t;
    // Debounce: a full model reset per keystroke drops scroll/selection state
    // on large catalogs — coalesce typing bursts to one 300ms rebuild.
    if (!m_searchDebounce)
        m_searchDebounce = new QTimer(this);
    m_searchDebounce->setSingleShot(true);
    m_searchDebounce->setInterval(300);
    disconnect(m_searchDebounce, &QTimer::timeout, nullptr, nullptr);
    connect(m_searchDebounce, &QTimer::timeout, this, [this]() {
        rebuildFiltered();
        emit filterChanged();
    });
    m_searchDebounce->start();
}

void CharacterCatalogModel::setHideStarters(bool v)
{
    if (m_hideStarters == v) return;
    m_hideStarters = v;
    rebuildFiltered();
    emit filterChanged();
}

void CharacterCatalogModel::rebuildFiltered()
{
    beginResetModel();
    populateFiltered();
    endResetModel();
    emit countChanged();
}

void CharacterCatalogModel::populateFiltered()
{
    m_filtered.clear();
    for (const auto &c : m_all) {
        if (c.isHidden)
            continue;
        if (m_hideStarters && c.isStarter)
            continue;
        if (!m_filterCategory.isEmpty() && c.category != m_filterCategory)
            continue;
        if (!m_search.isEmpty() &&
            !c.name.contains(m_search, Qt::CaseInsensitive) &&
            !c.description.contains(m_search, Qt::CaseInsensitive))
            continue;
        m_filtered.append(c);
    }
}

QString CharacterCatalogModel::cacheFilePath() const
{
    return QStandardPaths::writableLocation(QStandardPaths::AppLocalDataLocation)
           + QStringLiteral("/catalog/catalog.json");
}

void CharacterCatalogModel::persistCache(const QVector<CharacterEntry> &entries)
{
    QJsonArray arr;
    for (const auto &c : entries) {
        QJsonObject o;
        o.insert(QStringLiteral("id"), c.id);
        o.insert(QStringLiteral("name"), c.name);
        o.insert(QStringLiteral("category"), c.category);
        o.insert(QStringLiteral("thumbnail"), c.thumbnail);
        o.insert(QStringLiteral("description"), c.description);
        o.insert(QStringLiteral("isPremium"), c.isPremium);
        o.insert(QStringLiteral("isStarter"), c.isStarter);
        arr.append(o);
    }
    const QString path = cacheFilePath();
    QDir().mkpath(QFileInfo(path).absolutePath());
    QFile f(path);
    if (f.open(QIODevice::WriteOnly | QIODevice::Truncate)) {
        f.write(QJsonDocument(arr).toJson(QJsonDocument::Compact));
        f.close();
    }
}

QVector<CharacterEntry> CharacterCatalogModel::readCache() const
{
    QVector<CharacterEntry> out;
    QFile f(cacheFilePath());
    if (!f.open(QIODevice::ReadOnly))
        return out;
    const QJsonDocument doc = QJsonDocument::fromJson(f.readAll());
    f.close();
    if (!doc.isArray())
        return out;
    for (const auto &v : doc.array()) {
        const QJsonObject o = v.toObject();
        CharacterEntry e;
        e.id = o.value(QStringLiteral("id")).toString();
        e.name = o.value(QStringLiteral("name")).toString();
        e.category = o.value(QStringLiteral("category")).toString();
        e.thumbnail = o.value(QStringLiteral("thumbnail")).toString();
        e.description = o.value(QStringLiteral("description")).toString();
        e.isPremium = o.value(QStringLiteral("isPremium")).toBool();
        e.isStarter = o.value(QStringLiteral("isStarter")).toBool();
        if (!e.id.isEmpty())
            out.append(e);
    }
    return out;
}

void CharacterCatalogModel::load()
{
    if (!m_loading) {
        m_loading = true;
        emit loadingChanged();
    }

    // Restore any previously cached backend catalog (offline-safe) before
    // falling back to built-in starters.
    const QVector<CharacterEntry> cached = readCache();
    if (!cached.isEmpty()) {
        beginResetModel();
        m_all.clear();
        for (const auto &c : cached)
            m_all.append(c);
        populateFiltered();
        endResetModel();
        m_loading = false;
        emit loadingChanged();
        emit categoriesChanged();
        emit loaded();
        emit countChanged();
        return;
    }

    // Built-in starters matching original assets
    beginResetModel();
    m_all.clear();
    m_all.append({
        QStringLiteral("crimson-knight"),
        QStringLiteral("Crimson Knight"),
        QStringLiteral("Fantasy"),
        QStringLiteral("qrc:/assets/starters/crimson-knight.webp"),
        QStringLiteral("Armored knight in deep crimson plate"),
        false, true
    });
    m_all.append({
        QStringLiteral("vampire-lord"),
        QStringLiteral("Vampire Lord"),
        QStringLiteral("Horror"),
        QStringLiteral("qrc:/assets/starters/vampire-lord.webp"),
        QStringLiteral("Elegant and deadly vampire noble"),
        false, true
    });
    m_all.append({
        QStringLiteral("cyber-runner"),
        QStringLiteral("Cyber Runner"),
        QStringLiteral("Sci-Fi"),
        QString{},
        QStringLiteral("Neon-soaked street samurai"),
        false, false
    });
    m_all.append({
        QStringLiteral("forest-spirit"),
        QStringLiteral("Forest Spirit"),
        QStringLiteral("Fantasy"),
        QString{},
        QStringLiteral("Ethereal guardian of the ancient woods"),
        true, false
    });
    m_all.append({
        QStringLiteral("noir-detective"),
        QStringLiteral("Noir Detective"),
        QStringLiteral("Realistic"),
        QString{},
        QStringLiteral("Hard-boiled private eye from the 1940s"),
        false, false
    });

    populateFiltered();
    endResetModel();
    m_loading = false;
    emit loadingChanged();
    emit categoriesChanged();
    emit loaded();
    emit countChanged();
}

QStringList CharacterCatalogModel::categories() const
{
    QStringList out;
    for (const auto &c : m_all) {
        if (c.category.isEmpty())
            continue;
        if (!out.contains(c.category))
            out.append(c.category);
    }
    return out;
}

QVariantMap CharacterCatalogModel::get(int index) const
{
    if (index < 0 || index >= m_filtered.size()) return {};
    const auto &c = m_filtered.at(index);
    return {
        { QStringLiteral("id"), c.id },
        { QStringLiteral("name"), c.name },
        { QStringLiteral("category"), c.category },
        { QStringLiteral("thumbnail"), c.thumbnail },
        { QStringLiteral("description"), c.description },
        { QStringLiteral("isPremium"), c.isPremium },
        { QStringLiteral("isStarter"), c.isStarter },
    };
}

int CharacterCatalogModel::indexOfId(const QString &id) const
{
    for (int i = 0; i < m_filtered.size(); ++i)
        if (m_filtered.at(i).id == id) return i;
    return -1;
}

int CharacterCatalogModel::savedCount() const
{
    int n = 0;
    for (const auto &c : m_filtered)
        if (!c.isStarter && !c.isHidden) ++n;
    return n;
}

void CharacterCatalogModel::loadFromBackend(const QVariantList &entries)
{
    m_loading = true;
    emit loadingChanged();
    if (entries.isEmpty()) {
        load(); // fall back to built-ins
        return;
    }
    beginResetModel();
    m_all.clear();
    for (const QVariant &v : entries) {
        const QVariantMap m = v.toMap();
        CharacterEntry e;
        e.id = m.value(QStringLiteral("id")).toString();
        e.name = m.value(QStringLiteral("name")).toString();
        // Backend catalog entries expose `category` directly; accept legacy
        // aliases only as a fallback for older servers.
        e.category = m.value(QStringLiteral("category")).toString();
        if (e.category.isEmpty())
            e.category = m.value(QStringLiteral("scene")).toString();
        if (e.category.isEmpty())
            e.category = m.value(QStringLiteral("pack_name")).toString();
        e.thumbnail = m.value(QStringLiteral("image")).toString();
        e.description = m.value(QStringLiteral("prompt")).toString();
        e.isPremium = m.value(QStringLiteral("is_premium")).toBool();
        e.isStarter = m.value(QStringLiteral("is_starter")).toBool();
        m_all.append(e);
    }
    // Always keep local starters as fallback if backend list is tiny
    if (m_all.size() < 2) {
        m_all.append({QStringLiteral("crimson-knight"), QStringLiteral("Crimson Knight"),
                      QStringLiteral("Fantasy"),
                      QStringLiteral("qrc:/assets/starters/crimson-knight.webp"),
                      QStringLiteral("Armored knight in deep crimson plate"), false, true});
        m_all.append({QStringLiteral("vampire-lord"), QStringLiteral("Vampire Lord"),
                      QStringLiteral("Horror"),
                      QStringLiteral("qrc:/assets/starters/vampire-lord.webp"),
                      QStringLiteral("Elegant and deadly vampire noble"), false, true});
    }
    populateFiltered();
    endResetModel();
    // Persist the (possibly augmented) backend catalog so a later offline boot
    // shows the same characters without a network round-trip.
    persistCache(m_all);
    m_loading = false;
    emit loadingChanged();
    emit categoriesChanged();
    emit loaded();
    emit countChanged();
}

void CharacterCatalogModel::hideStarter(const QString &id)
{
    for (int i = 0; i < m_all.size(); ++i) {
        if (m_all[i].id == id) {
            m_all[i].isHidden = true;
            rebuildFiltered();
            return;
        }
    }
}

void CharacterCatalogModel::unhideAll()
{
    for (auto &c : m_all)
        c.isHidden = false;
    rebuildFiltered();
}

void CharacterCatalogModel::renameCharacter(const QString &id, const QString &newName)
{
    if (newName.trimmed().isEmpty()) return;
    for (int i = 0; i < m_all.size(); ++i) {
        if (m_all[i].id == id) {
            m_all[i].name = newName.trimmed();
            rebuildFiltered();
            return;
        }
    }
}

void CharacterCatalogModel::deleteCharacter(const QString &id)
{
    for (int i = 0; i < m_all.size(); ++i) {
        if (m_all[i].id == id) {
            m_all.removeAt(i);
            rebuildFiltered();
            emit characterDeleteRequested(id);
            return;
        }
    }
}

void CharacterCatalogModel::sortAlphabetically()
{
    std::sort(m_all.begin(), m_all.end(), [](const CharacterEntry &a, const CharacterEntry &b) {
        return a.name.toLower().localeAwareCompare(b.name.toLower()) < 0;
    });
    rebuildFiltered();
}
