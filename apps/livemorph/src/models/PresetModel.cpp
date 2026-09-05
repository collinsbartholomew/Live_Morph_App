#include "PresetModel.h"

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

void PresetModel::load()
{
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
    endResetModel();
    emit countChanged();
    emit loaded();
}

void PresetModel::addCustom(const QString &name, const QString &prompt, const QString &mode)
{
    beginInsertRows({}, m_items.size(), m_items.size());
    m_items.append({
        QStringLiteral("custom-%1").arg(m_items.size()),
        name.isEmpty() ? QStringLiteral("Custom %1").arg(m_items.size() + 1) : name,
        prompt, {}, mode.isEmpty() ? QStringLiteral("prompt") : mode
    });
    endInsertRows();
    emit countChanged();
}

void PresetModel::rename(int index, const QString &newName)
{
    if (index < 0 || index >= m_items.size() || newName.trimmed().isEmpty()) return;
    m_items[index].name = newName.trimmed();
    emit dataChanged(this->index(index), this->index(index), { NameRole });
}

void PresetModel::removeAt(int index)
{
    if (index < 0 || index >= m_items.size()) return;
    beginRemoveRows({}, index, index);
    m_items.removeAt(index);
    endRemoveRows();
    emit countChanged();
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
