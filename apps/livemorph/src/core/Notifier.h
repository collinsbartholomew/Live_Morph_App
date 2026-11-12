#pragma once

#include <QAbstractListModel>
#include <QString>
#include <QVector>
#include <QVariantMap>
#include <QDateTime>

/**
 * Notifier — single source of truth for user-facing notifications.
 * Feeds both the transient toast surface and the persistent NotificationCenter.
 * The QML model is the canonical inbox (ordered newest-first, capped, deduped).
 */
class Notifier : public QAbstractListModel
{
    Q_OBJECT
    Q_PROPERTY(int unreadCount READ unreadCount NOTIFY unreadCountChanged)
    // Electron: the bell badge is unseen-since-last-open, cleared by
    // markNotificationsSeen() when the popover opens (unread is the
    // "mark all read" state).
    Q_PROPERTY(int unseenCount READ unseenCount NOTIFY unseenCountChanged)
    Q_PROPERTY(int count READ count NOTIFY countChanged)
    Q_PROPERTY(int maxCount READ maxCount WRITE setMaxCount NOTIFY maxCountChanged)
    // True while the inbox panel is open — the toast host suppresses mirrors
    // then (items still land in the inbox).
    Q_PROPERTY(bool inboxOpen READ inboxOpen WRITE setInboxOpen NOTIFY inboxOpenChanged)
    // Toast presentation policy (centralized here, not in the QML host).
    Q_PROPERTY(int maxToasts READ maxToasts WRITE setMaxToasts NOTIFY maxToastsChanged)
    // Distinct categories present + per-category counts (for filter chips).
    Q_PROPERTY(QStringList categories READ categories NOTIFY countChanged)
    Q_PROPERTY(int unreadByCategory READ unreadByCategoryCount NOTIFY unreadCountChanged)

public:
    enum Role {
        IdRole = Qt::UserRole + 1,
        TitleRole,
        BodyRole,
        SeverityRole,
        CategoryRole,
        TimestampRole,
        UnreadRole,
        TimeTextRole,
        RepeatRole
    };
    Q_ENUM(Role)

    explicit Notifier(QObject *parent = nullptr);

    int rowCount(const QModelIndex &parent = QModelIndex()) const override;
    QVariant data(const QModelIndex &index, int role) const override;
    QHash<int, QByteArray> roleNames() const override;

    int unreadCount() const { return m_unread; }
    int unseenCount() const { return m_unseen; }
    int count() const { return m_items.size(); }
    int maxCount() const { return m_maxCount; }
    bool inboxOpen() const { return m_inboxOpen; }

    Q_INVOKABLE void push(const QString &title,
                          const QString &body = QString(),
                          const QString &severity = QStringLiteral("info"),
                          const QString &category = QString());

    Q_INVOKABLE void markRead(int id);
    Q_INVOKABLE void markAllRead();
    Q_INVOKABLE void markNotificationsSeen();
    Q_INVOKABLE void clear();
    Q_INVOKABLE void dismiss(int id);
    Q_INVOKABLE void refreshTimes();
    Q_INVOKABLE QVariantMap itemById(int id) const;
    Q_INVOKABLE QVariantMap at(int index) const;
    QStringList categories() const;
    int unreadByCategoryCount() const;
    Q_INVOKABLE int countByCategory(const QString &category) const;
    Q_INVOKABLE int unreadCountByCategory(const QString &category) const;
    int maxToasts() const { return m_maxToasts; }
    void setMaxToasts(int v);
    // Per-severity auto-dismiss duration (ms); 0 = sticky (never auto-dismiss).
    Q_INVOKABLE int toastDurationMs(const QString &severity) const;

public slots:
    void setMaxCount(int maxCount);
    void setInboxOpen(bool open) {
        if (open == m_inboxOpen)
            return;
        m_inboxOpen = open;
        emit inboxOpenChanged();
    }

signals:
    void unreadCountChanged();
    void unseenCountChanged();
    void countChanged();
    void maxCountChanged();
    void maxToastsChanged();
    void inboxOpenChanged();
    void pushed(int id);
    void cleared();

private:
    struct Item {
        int id = 0;
        QString title;
        QString body;
        QString severity;
        QString category;
        qint64 timestamp = 0;
        bool unread = true;
        bool seen = false; // counted in m_unseen until markNotificationsSeen()
        int repeat = 1; // coalesced duplicate count (shown as "×N")
    };

    QString timeText(const Item &item) const;
    void emitUnread();

    QVector<Item> m_items;
    int m_nextId = 1;
    int m_maxCount = 50;
    int m_maxToasts = 3;
    int m_unread = 0;
    int m_unseen = 0;
    bool m_inboxOpen = false;
};