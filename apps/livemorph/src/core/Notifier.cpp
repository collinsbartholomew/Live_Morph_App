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
    case RepeatRole:    return it.repeat;
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
    roles[RepeatRole]    = "repeat";
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
        return tr("%1m").arg(diff / (60 * 1000));
    if (diff < 24 * 60 * 60 * 1000)
        return tr("%1h").arg(diff / (60 * 60 * 1000));
    return tr("%1d").arg(diff / (24 * 60 * 60 * 1000));
}

void Notifier::push(const QString &title, const QString &body,
                    const QString &severity, const QString &category)
{
    const QString sev = severity.isEmpty() ? QStringLiteral("info") : severity;

    // Coalesce a duplicate event: bump the existing matching item (within the
    // newest few) instead of stacking — moves it to the top, bumps repeat,
    // refreshes timestamp, marks unread again. Fixes "Signed in" ×N storms.
    for (int i = 0; i < m_items.size() && i < 5; ++i) {
        Item &it = m_items[i];
        if (it.title == title && it.severity == sev && it.category == category) {
            it.body = body;
            it.timestamp = QDateTime::currentMSecsSinceEpoch();
            it.unread = true;
            it.repeat += 1;
            // Capture identity/seen BEFORE the move: QList::move() reorders
            // contiguous storage, so a reference taken pre-move aliases a
            // different element afterwards.
            const int id = it.id;
            const bool wasSeen = it.seen;
            if (i != 0) {
                // Move to top (newest-first inbox).
                beginMoveRows(QModelIndex(), i, i, QModelIndex(), 0);
                m_items.move(i, 0);
                endMoveRows();
                i = 0;
            }
            emit dataChanged(index(0), index(0),
                             { BodyRole, TimestampRole, UnreadRole, TimeTextRole, RepeatRole });
            emitUnread();
            if (wasSeen) {
                m_items[0].seen = false;
                ++m_unseen;
                emit unseenCountChanged();
            }
            emit pushed(id);
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
    it.seen = false;
    it.repeat = 1;

    beginInsertRows(QModelIndex(), 0, 0);
    m_items.prepend(it);
    endInsertRows();
    ++m_unseen;
    emit unseenCountChanged();

    while (m_items.size() > m_maxCount) {
        // Copy the flag BEFORE removeLast — a reference into the removed slot
        // would be a use-after-free.
        const bool wasUnseen = !m_items.last().seen;
        beginRemoveRows(QModelIndex(), m_items.size() - 1, m_items.size() - 1);
        m_items.removeLast();
        endRemoveRows();
        if (wasUnseen && m_unseen > 0) {
            --m_unseen;
            emit unseenCountChanged();
        }
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
    // The bell badge is "unseen since last open" — clearing the inbox clears it.
    if (m_unseen != 0) {
        m_unseen = 0;
        emit unseenCountChanged();
    }
    emit cleared();
}

void Notifier::dismiss(int id)
{
    for (int i = 0; i < m_items.size(); ++i) {
        if (m_items[i].id == id) {
            const bool wasUnseen = !m_items[i].seen;
            beginRemoveRows(QModelIndex(), i, i);
            m_items.removeAt(i);
            endRemoveRows();
            emit countChanged();
            emitUnread();
            if (wasUnseen && m_unseen > 0) {
                --m_unseen;
                emit unseenCountChanged();
            }
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
            m.insert(QStringLiteral("repeat"), it.repeat);
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
            m.insert(QStringLiteral("repeat"), it.repeat);
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
        // Copy the flag BEFORE removeLast — a reference into the removed slot
        // would be a use-after-free.
        const bool wasUnseen = !m_items.last().seen;
        beginRemoveRows(QModelIndex(), m_items.size() - 1, m_items.size() - 1);
        m_items.removeLast();
        endRemoveRows();
        if (wasUnseen && m_unseen > 0) {
            --m_unseen;
            emit unseenCountChanged();
        }
    }
    emit countChanged();
    emitUnread();
}

void Notifier::markNotificationsSeen()
{
    for (auto &it : m_items)
        it.seen = true;
    if (m_unseen == 0)
        return;
    m_unseen = 0;
    emit unseenCountChanged();
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

QStringList Notifier::categories() const
{
    QStringList out;
    for (const Item &it : m_items)
        if (!it.category.isEmpty() && !out.contains(it.category))
            out.append(it.category);
    return out;
}

int Notifier::unreadByCategoryCount() const
{
    int n = 0;
    for (const Item &it : m_items)
        if (it.unread && !it.category.isEmpty())
            ++n;
    return n;
}

int Notifier::countByCategory(const QString &category) const
{
    int n = 0;
    for (const Item &it : m_items)
        if (it.category == category)
            ++n;
    return n;
}

int Notifier::unreadCountByCategory(const QString &category) const
{
    int n = 0;
    for (const Item &it : m_items)
        if (it.category == category && it.unread)
            ++n;
    return n;
}

void Notifier::setMaxToasts(int v)
{
    const int c = qMax(1, v);
    if (c == m_maxToasts)
        return;
    m_maxToasts = c;
    emit maxToastsChanged();
}

int Notifier::toastDurationMs(const QString &severity) const
{
    if (severity == QLatin1String("error"))   return 0;    // sticky
    if (severity == QLatin1String("warning")) return 6000;
    if (severity == QLatin1String("success")) return 4500;
    return 4500; // info
}