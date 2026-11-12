#include "CharacterCatalogModel.h"
#include <QFile>
#include <QSaveFile>
#include <QFileInfo>
#include <QJsonDocument>
#include <QJsonArray>
#include <QJsonObject>
#include <QDateTime>
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
    // Compute the next filtered list first, then apply it incrementally
    // (common prefix/suffix diff) so views keep scroll position and selection
    // instead of a full beginResetModel() per keystroke/toggle/sort.
    QVector<CharacterEntry> next;
    next.reserve(m_all.size());
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
        next.append(c);
    }

    const int oldLen = m_filtered.size();
    const int newLen = next.size();
    auto same = [](const CharacterEntry &a, const CharacterEntry &b) {
        return a.id == b.id && a.name == b.name && a.category == b.category
               && a.thumbnail == b.thumbnail && a.description == b.description
               && a.isPremium == b.isPremium && a.isStarter == b.isStarter
               && a.isHidden == b.isHidden;
    };
    int p = 0;
    while (p < oldLen && p < newLen && same(m_filtered[p], next[p]))
        ++p;
    int s = 0;
    while (s < oldLen - p && s < newLen - p && same(m_filtered[oldLen - 1 - s], next[newLen - 1 - s]))
        ++s;
    const int oldMid = oldLen - p - s; // rows to drop from the middle
    const int newMid = newLen - p - s; // rows to insert in the middle

    if (oldMid > 0) {
        beginRemoveRows({}, p, p + oldMid - 1);
        m_filtered.erase(m_filtered.begin() + p, m_filtered.begin() + p + oldMid);
        endRemoveRows();
    }
    if (newMid > 0) {
        beginInsertRows({}, p, p + newMid - 1);
        for (int i = 0; i < newMid; ++i)
            m_filtered.insert(p + i, next[p + i]);
        endInsertRows();
    }
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
        o.insert(QStringLiteral("isHidden"), c.isHidden);
        arr.append(o);
    }
    const QString path = cacheFilePath();
    QDir().mkpath(QFileInfo(path).absolutePath());
    // QSaveFile: atomic temp+rename — a crash mid-write can't corrupt the
    // cache (PresetModel already does it this way).
    QSaveFile f(path);
    if (!f.open(QIODevice::WriteOnly | QIODevice::Truncate)) {
        qWarning() << "CharacterCatalogModel: cannot write catalog cache:" << f.errorString();
        return;
    }
    f.write(QJsonDocument(arr).toJson(QJsonDocument::Compact));
    if (!f.commit())
        qWarning() << "CharacterCatalogModel: catalog cache commit failed:" << f.errorString();
}

QVector<CharacterEntry> CharacterCatalogModel::readCache() const
{
    QVector<CharacterEntry> out;
    QFile f(cacheFilePath());
    if (!f.open(QIODevice::ReadOnly))
        return out;
    // Cap the cache file size — a tampered cache must not be parsed wholesale.
    if (f.size() > 4 * 1024 * 1024) {
        f.close();
        return out;
    }
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
        // Same scheme allowlist as loadFromBackend: a tampered cache file must
        // not set a file:// thumbnail (local file read/render + upload).
        QString thumb = o.value(QStringLiteral("thumbnail")).toString();
        if (!thumb.startsWith(QLatin1String("qrc:")) && !thumb.startsWith(QLatin1String("https://")))
            thumb.clear();
        e.thumbnail = thumb;
        e.description = o.value(QStringLiteral("description")).toString();
        e.isPremium = o.value(QStringLiteral("isPremium")).toBool();
        e.isStarter = o.value(QStringLiteral("isStarter")).toBool();
        e.isHidden = o.value(QStringLiteral("isHidden")).toBool();
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
        QStringLiteral("Transform into a neon-soaked street samurai with a chrome jacket, glowing circuitry tattoos, and rain-slicked city lights reflecting off armored plating."),
        false, true
    });
    m_all.append({
        QStringLiteral("forest-spirit"),
        QStringLiteral("Forest Spirit"),
        QStringLiteral("Fantasy"),
        QString{},
        QStringLiteral("Transform into an ethereal forest guardian with moss-woven hair, bark-like skin, glowing emerald eyes, and fireflies drifting around you."),
        true, true
    });
    m_all.append({
        QStringLiteral("noir-detective"),
        QStringLiteral("Noir Detective"),
        QStringLiteral("Realistic"),
        QString{},
        QStringLiteral("Transform into a hard-boiled 1940s private detective with a trench coat, fedora shadow over the eyes, and cigarette smoke curling in black-and-white light."),
        false, true
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
    return entryMap(m_filtered.at(index));
}

QVariantMap CharacterCatalogModel::entryMap(const CharacterEntry &c) const
{
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

int CharacterCatalogModel::starterCount() const
{
    int n = 0;
    for (const auto &c : m_filtered)
        if (c.isStarter) ++n;
    return n;
}

QVariantList CharacterCatalogModel::starterEntries() const
{
    QVariantList out;
    for (const auto &c : m_filtered)
        if (c.isStarter) out.append(entryMap(c));
    return out;
}

QVariantList CharacterCatalogModel::userEntries() const
{
    QVariantList out;
    for (const auto &c : m_filtered)
        if (!c.isStarter && !c.isHidden) out.append(entryMap(c));
    return out;
}

QString CharacterCatalogModel::coverThumb() const
{
    for (const auto &c : m_filtered)
        if (c.isStarter && !c.thumbnail.isEmpty())
            return c.thumbnail;
    return QStringLiteral("qrc:/assets/starters/crimson-knight.webp");
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
        // Server-supplied image must never be a local file:// — the client would
        // read and upload it. Only qrc: resources and https: URLs are accepted.
        QString img = m.value(QStringLiteral("image")).toString();
        if (!img.startsWith(QLatin1String("qrc:")) && !img.startsWith(QLatin1String("https://")))
            img.clear();
        e.thumbnail = img;
        e.description = m.value(QStringLiteral("prompt")).toString();
        e.isPremium = m.value(QStringLiteral("is_premium")).toBool();
        e.isStarter = m.value(QStringLiteral("is_starter")).toBool();
        // Skip empty/duplicate ids — indexOfId/deleteCharacter act on the
        // first match, so duplicates would hit the wrong row.
        if (e.id.isEmpty())
            continue;
        bool dup = false;
        for (const auto &existing : m_all) {
            if (existing.id == e.id) { dup = true; break; }
        }
        if (!dup)
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
    // Preserve locally-created characters (preset-* ids): they are not on the
    // server yet, and wiping them here would delete them on every online boot.
    const QVector<CharacterEntry> prevCache = readCache();
    for (const auto &c : prevCache) {
        bool exists = false;
        for (auto &b : m_all) {
            if (b.id == c.id) {
                // Preserve locally-set hide state across online reloads.
                b.isHidden = c.isHidden;
                exists = true;
                break;
            }
        }
        // Preserve locally-created characters (preset-* ids): not on the
        // server yet; wiping them would delete them on every online boot.
        if (!exists && c.id.startsWith(QLatin1String("preset-")))
            m_all.append(c);
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
            persistCache(m_all);
            return;
        }
    }
}

void CharacterCatalogModel::unhideAll()
{
    for (auto &c : m_all)
        c.isHidden = false;
    rebuildFiltered();
    persistCache(m_all);
}

void CharacterCatalogModel::renameCharacter(const QString &id, const QString &newName)
{
    if (newName.trimmed().isEmpty()) return;
    const QString capped = newName.trimmed().left(40);
    for (int i = 0; i < m_all.size(); ++i) {
        if (m_all[i].id == id) {
            m_all[i].name = capped;
            rebuildFiltered();
            persistCache(m_all);
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
            persistCache(m_all); // deletions must survive restart
            // Local preset-* ids exist only client-side; the server would 404.
            if (!id.startsWith(QLatin1String("preset-")))
                emit characterDeleteRequested(id);
            return;
        }
    }
}

QString CharacterCatalogModel::addUserCharacter(const QString &name,
                                               const QString &image,
                                               const QString &prompt,
                                               const QString &scene,
                                               const QString &mode)
{
    Q_UNUSED(scene) // CharacterEntry has no scene field yet — prompt carries the swap content
    Q_UNUSED(mode)   // mode is implicit (scene toggle drives composition)
    // Electron jP guards: need a prompt or a reference image ("no-content"),
    // and the library holds a bounded number of user slots ("library-full").
    if (prompt.trimmed().isEmpty() && image.trimmed().isEmpty())
        return {};
    int userCount = 0;
    for (const auto &c : m_all)
        if (!c.isStarter) ++userCount;
    if (userCount >= 28) // Electron's Kc library capacity
        return {};

    CharacterEntry e;
    e.id = QStringLiteral("preset-") + QString::number(m_all.size() + 1)
           + QLatin1Char('-') + QString::number(QDateTime::currentMSecsSinceEpoch());
    e.name = name.trimmed().isEmpty()
             ? QStringLiteral("Character %1").arg(userCount + 1)
             : name.trimmed().left(40);
    e.category = QStringLiteral("custom");
    e.thumbnail = image;
    e.description = prompt;
    e.isStarter = false;
    m_all.append(e);
    rebuildFiltered();
    persistCache(m_all);
    emit characterAdded(e.id);
    return e.id;
}

void CharacterCatalogModel::sortAlphabetically()
{
    // Electron: sorts the USER characters only — starters stay pinned in the
    // pack. Stable-partition first, then sort the user partition.
    const auto partition = std::stable_partition(
        m_all.begin(), m_all.end(),
        [](const CharacterEntry &c) { return c.isStarter; });
    std::sort(partition, m_all.end(), [](const CharacterEntry &a, const CharacterEntry &b) {
        return a.name.toLower().localeAwareCompare(b.name.toLower()) < 0;
    });
    rebuildFiltered();
    persistCache(m_all);
}
