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
    Q_PROPERTY(int count READ count NOTIFY countChanged)
    Q_PROPERTY(int maxCount READ maxCount WRITE setMaxCount NOTIFY maxCountChanged)

public:
    enum Role {
        IdRole = Qt::UserRole + 1,
        TitleRole,
        BodyRole,
        SeverityRole,
        CategoryRole,
        TimestampRole,
        UnreadRole,
        TimeTextRole
    };
    Q_ENUM(Role)

    explicit Notifier(QObject *parent = nullptr);

    int rowCount(const QModelIndex &parent = QModelIndex()) const override;
    QVariant data(const QModelIndex &index, int role) const override;
    QHash<int, QByteArray> roleNames() const override;

    int unreadCount() const { return m_unread; }
    int count() const { return m_items.size(); }
    int maxCount() const { return m_maxCount; }

    Q_INVOKABLE void push(const QString &title,
                          const QString &body = QString(),
                          const QString &severity = QStringLiteral("info"),
                          const QString &category = QString());

    Q_INVOKABLE void markRead(int id);
    Q_INVOKABLE void markAllRead();
    Q_INVOKABLE void clear();
    Q_INVOKABLE void dismiss(int id);
    Q_INVOKABLE void refreshTimes();
    Q_INVOKABLE QVariantMap itemById(int id) const;
    Q_INVOKABLE QVariantMap at(int index) const;

public slots:
    void setMaxCount(int maxCount);

signals:
    void unreadCountChanged();
    void countChanged();
    void maxCountChanged();
    void pushed(int id);

private:
    struct Item {
        int id = 0;
        QString title;
        QString body;
        QString severity;
        QString category;
        qint64 timestamp = 0;
        bool unread = true;
    };

    QString timeText(const Item &item) const;
    void emitUnread();

    QVector<Item> m_items;
    int m_nextId = 1;
    int m_maxCount = 50;
    int m_unread = 0;
};