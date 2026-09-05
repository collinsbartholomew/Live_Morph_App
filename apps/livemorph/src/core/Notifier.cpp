#include "Notifier.h"

Notifier::Notifier(QObject *parent)
    : QAbstractListModel(parent)
{
}

int Notifier::rowCount(const QModelIndex &parent) const
{
    if (parent.isValid())
        return 0;
    return m_items.size();
}

QVariant Notifier::data(const QModelIndex &index, int role) const
{
    if (!index.isValid() || index.row() < 0 || index.row() >= m_items.size())
        return {};
    const Item &it = m_items.at(index.row());
    switch (role) {
    case IdRole:        return it.id;
    case TitleRole:     return it.title;
    case BodyRole:      return it.body;
    case SeverityRole:  return it.severity;
    case CategoryRole:  return it.category;
    case TimestampRole: return it.timestamp;
    case UnreadRole:    return it.unread;
    case TimeTextRole:  return timeText(it);
    }
    return {};
}

QHash<int, QByteArray> Notifier::roleNames() const
{
    QHash<int, QByteArray> roles;
    roles[IdRole]        = "nid";
    roles[TitleRole]     = "title";
    roles[BodyRole]      = "body";
    roles[SeverityRole]  = "severity";
    roles[CategoryRole]  = "category";
    roles[TimestampRole] = "timestamp";
    roles[UnreadRole]    = "unread";
    roles[TimeTextRole]  = "timeText";
    return roles;
}

QString Notifier::timeText(const Item &item) const
{
    const qint64 now = QDateTime::currentMSecsSinceEpoch();
    qint64 diff = now - item.timestamp;
    if (diff < 0)
        diff = 0;
    if (diff < 60 * 1000)
        return tr("just now");
    if (diff < 60 * 60 * 1000)
        return tr("%1m ago").arg(diff / (60 * 1000));
    if (diff < 24 * 60 * 60 * 1000)
        return tr("%1h ago").arg(diff / (60 * 60 * 1000));
    return QDateTime::fromMSecsSinceEpoch(item.timestamp).toString(QStringLiteral("MMM d, hh:mm"));
}

void Notifier::push(const QString &title, const QString &body,
                    const QString &severity, const QString &category)
{
    const QString sev = severity.isEmpty() ? QStringLiteral("info") : severity;

    // Coalesce an identical consecutive event: bump the head item instead of
    // stacking duplicates (fixes "Signed in" ×N and repeated poll failures).
    if (!m_items.isEmpty()) {
        Item &head = m_items.first();
        if (head.title == title && head.severity == sev && head.category == category) {
            head.body = body;
            head.timestamp = QDateTime::currentMSecsSinceEpoch();
            head.unread = true;
            emit dataChanged(index(0), index(0));
            emitUnread();
            emit pushed(head.id);
            return;
        }
    }

    Item it;
    it.id = m_nextId++;
    it.title = title;
    it.body = body;
    it.severity = sev;
    it.category = category;
    it.timestamp = QDateTime::currentMSecsSinceEpoch();
    it.unread = true;

    beginInsertRows(QModelIndex(), 0, 0);
    m_items.prepend(it);
    endInsertRows();

    while (m_items.size() > m_maxCount) {
        beginRemoveRows(QModelIndex(), m_items.size() - 1, m_items.size() - 1);
        m_items.removeLast();
        endRemoveRows();
    }

    emit countChanged();
    emit pushed(it.id);
    emitUnread();
}

void Notifier::markRead(int id)
{
    for (int i = 0; i < m_items.size(); ++i) {
        if (m_items[i].id == id && m_items[i].unread) {
            m_items[i].unread = false;
            emit dataChanged(index(i), index(i), { UnreadRole });
            emitUnread();
            return;
        }
    }
}

void Notifier::markAllRead()
{
    if (m_items.isEmpty())
        return;
    for (int i = 0; i < m_items.size(); ++i)
        m_items[i].unread = false;
    emit dataChanged(index(0), index(m_items.size() - 1), { UnreadRole });
    emitUnread();
}

void Notifier::clear()
{
    if (m_items.isEmpty())
        return;
    beginResetModel();
    m_items.clear();
    endResetModel();
    emit countChanged();
    emitUnread();
}

void Notifier::dismiss(int id)
{
    for (int i = 0; i < m_items.size(); ++i) {
        if (m_items[i].id == id) {
            beginRemoveRows(QModelIndex(), i, i);
            m_items.removeAt(i);
            endRemoveRows();
            emit countChanged();
            emitUnread();
            return;
        }
    }
}

void Notifier::refreshTimes()
{
    if (m_items.isEmpty())
        return;
    emit dataChanged(index(0), index(m_items.size() - 1), { TimeTextRole });
}

QVariantMap Notifier::itemById(int id) const
{
    for (const Item &it : m_items) {
        if (it.id == id) {
            QVariantMap m;
            m.insert(QStringLiteral("nid"), it.id);
            m.insert(QStringLiteral("title"), it.title);
            m.insert(QStringLiteral("body"), it.body);
            m.insert(QStringLiteral("severity"), it.severity);
            m.insert(QStringLiteral("category"), it.category);
            m.insert(QStringLiteral("timestamp"), it.timestamp);
            m.insert(QStringLiteral("unread"), it.unread);
            m.insert(QStringLiteral("timeText"), timeText(it));
            return m;
        }
    }
    return {};
}

QVariantMap Notifier::at(int index) const
{
    if (index < 0 || index >= m_items.size())
        return {};
    const Item &it = m_items.at(index);
    QVariantMap m;
    m.insert(QStringLiteral("nid"), it.id);
    m.insert(QStringLiteral("title"), it.title);
    m.insert(QStringLiteral("body"), it.body);
    m.insert(QStringLiteral("severity"), it.severity);
    m.insert(QStringLiteral("category"), it.category);
    m.insert(QStringLiteral("timestamp"), it.timestamp);
    m.insert(QStringLiteral("unread"), it.unread);
    m.insert(QStringLiteral("timeText"), timeText(it));
    return m;
}

void Notifier::setMaxCount(int maxCount)
{
    const int c = qMax(1, maxCount);
    if (c == m_maxCount)
        return;
    m_maxCount = c;
    emit maxCountChanged();
    while (m_items.size() > m_maxCount) {
        beginRemoveRows(QModelIndex(), m_items.size() - 1, m_items.size() - 1);
        m_items.removeLast();
        endRemoveRows();
    }
    emit countChanged();
    emitUnread();
}

void Notifier::emitUnread()
{
    int n = 0;
    for (const Item &it : m_items)
        if (it.unread)
            ++n;
    if (n != m_unread) {
        m_unread = n;
        emit unreadCountChanged();
    }
}