#include "PresetModel.h"
#include <QUuid>
#include <QJsonArray>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonValue>
#include <QFile>
#include <QSaveFile>
#include <QStandardPaths>
#include <QDir>
#include <QFileInfo>
#include <algorithm>

PresetModel::PresetModel(QObject *parent) : QAbstractListModel(parent) {}

int PresetModel::rowCount(const QModelIndex &parent) const
{
    return parent.isValid() ? 0 : m_items.size();
}

QVariant PresetModel::data(const QModelIndex &index, int role) const
{
    if (!index.isValid() || index.row() >= m_items.size()) return {};
    const auto &p = m_items.at(index.row());
    switch (role) {
    case IdRole:        return p.id;
    case NameRole:      return p.name;
    case PromptRole:    return p.prompt;
    case ThumbnailRole: return p.thumbnail;
    case ModeRole:      return p.mode;
    default: return {};
    }
}

QHash<int, QByteArray> PresetModel::roleNames() const
{
    return {
        { IdRole,        "presetId" },
        { NameRole,      "name" },
        { PromptRole,    "prompt" },
        { ThumbnailRole, "thumbnail" },
        { ModeRole,      "mode" },
    };
}

static QString presetStorePath()
{
    return QStandardPaths::writableLocation(QStandardPaths::AppLocalDataLocation)
           + QStringLiteral("/presets.json");
}

void PresetModel::load()
{
    // Built-in starter prompts (always present) + user-saved customs merged
    // from disk. The old loader reset to 3 hardcoded rows on every boot —
    // every "Save preset" was silently lost on restart.
    beginResetModel();
    m_items = {
        { QStringLiteral("p1"), QStringLiteral("Cinematic Portrait"),
          QStringLiteral("cinematic lighting, shallow depth of field, 85mm lens"),
          {}, QStringLiteral("prompt") },
        { QStringLiteral("p2"), QStringLiteral("Anime Style"),
          QStringLiteral("anime style, vibrant colors, clean line art"),
          {}, QStringLiteral("prompt") },
        { QStringLiteral("p3"), QStringLiteral("Oil Painting"),
          QStringLiteral("oil painting, thick brush strokes, classical composition"),
          {}, QStringLiteral("prompt") },
    };
    QFile f(presetStorePath());
    if (f.open(QIODevice::ReadOnly)) {
        const auto doc = QJsonDocument::fromJson(f.readAll());
        if (doc.isArray()) {
            const auto arr = doc.array();
            for (const auto &v : arr) {
                const auto o = v.toObject();
                const QString id = o.value(QStringLiteral("id")).toString();
                if (id.isEmpty() || id.startsWith(QStringLiteral("p"))
                    || std::any_of(m_items.cbegin(), m_items.cend(),
                                   [id](const PresetEntry &p) { return p.id == id; }))
                    continue; // skip built-in duplicates / corrupt ids
                m_items.append({
                    id,
                    o.value(QStringLiteral("name")).toString(),
                    o.value(QStringLiteral("prompt")).toString(),
                    o.value(QStringLiteral("thumbnail")).toString(),
                    o.value(QStringLiteral("mode")).toString(QStringLiteral("prompt")),
                });
            }
        }
    }
    endResetModel();
    emit countChanged();
    emit loaded();
}

void PresetModel::persist() const
{
    QJsonArray arr;
    for (const auto &p : m_items) {
        if (!p.id.startsWith(QStringLiteral("custom-")))
            continue; // persist user presets only
        arr.append(QJsonObject{
            { QStringLiteral("id"), p.id },
            { QStringLiteral("name"), p.name },
            { QStringLiteral("prompt"), p.prompt },
            { QStringLiteral("thumbnail"), p.thumbnail },
            { QStringLiteral("mode"), p.mode },
        });
    }
    QDir().mkpath(QFileInfo(presetStorePath()).absolutePath());
    QSaveFile f(presetStorePath());
    if (f.open(QIODevice::WriteOnly)) {
        f.write(QJsonDocument(arr).toJson(QJsonDocument::Compact));
        f.commit();
    }
}

void PresetModel::addCustom(const QString &name, const QString &prompt, const QString &mode)
{
    // UUID-suffixed id: `custom-%1` of the current size collides after a
    // removeAt (new preset reuses a live id → duplicate keys in views).
    const QString id = QStringLiteral("custom-%1")
                           .arg(QUuid::createUuid().toString(QUuid::WithoutBraces));
    beginInsertRows({}, m_items.size(), m_items.size());
    m_items.append({
        id,
        name.isEmpty() ? QStringLiteral("Custom %1").arg(m_items.size() + 1) : name,
        prompt, {}, mode.isEmpty() ? QStringLiteral("prompt") : mode
    });
    endInsertRows();
    emit countChanged();
    persist();
}

void PresetModel::rename(int index, const QString &newName)
{
    if (index < 0 || index >= m_items.size() || newName.trimmed().isEmpty()) return;
    m_items[index].name = newName.trimmed();
    emit dataChanged(this->index(index), this->index(index), { NameRole });
    persist();
}

void PresetModel::removeAt(int index)
{
    if (index < 0 || index >= m_items.size()) return;
    beginRemoveRows({}, index, index);
    m_items.removeAt(index);
    endRemoveRows();
    emit countChanged();
    persist();
}

void PresetModel::move(int from, int to)
{
    if (from < 0 || from >= m_items.size() || to < 0 || to >= m_items.size() || from == to)
        return;
    const int dest = to > from ? to + 1 : to;
    if (!beginMoveRows({}, from, from, {}, dest))
        return;
    m_items.move(from, to);
    endMoveRows();
    persist();
}

QVariantMap PresetModel::get(int index) const
{
    if (index < 0 || index >= m_items.size()) return {};
    const auto &p = m_items.at(index);
    return {
        { QStringLiteral("id"), p.id },
        { QStringLiteral("name"), p.name },
        { QStringLiteral("prompt"), p.prompt },
        { QStringLiteral("mode"), p.mode },
    };
}
