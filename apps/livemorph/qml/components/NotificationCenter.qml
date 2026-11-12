import LiveMorph
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

/**
 * NotificationCenter — drop-down inbox fed by the C++ Notifier model.
 *
 * Nocturne redesign:
 *  - 340px panel: header (title + unread pill + mark-all-read ghost chip +
 *    clear-with-confirm), All/Unread segmented filter, Today/Earlier groups.
 *  - Item rows are rounded hover cards: unread accent dot, severity icon disc,
 *    title (+ "×N" coalesce pill), body, mono timestamp, hover-X dismiss.
 *  - Click marks read and routes by category (payment -> credits drawer,
 *    recording -> reveal file). Opening the panel clears the bell badge.
 *  - Scroll position preserved across rebuilds; relative timestamps refresh
 *    every 30s while open. All state changes are instant bindings (no
 *    animation elements — project directive).
 */
Rectangle {
    id: root

    property bool open: false
    property string filter: "all" // "all" | "unread"
    readonly property int unreadCount: Notifier.unreadCount

    function severityColor(s) {
        if (s === "error")
            return Colors.statusError
        if (s === "warning")
            return Colors.statusWarning
        if (s === "success")
            return Colors.statusSuccess
        return Colors.statusInfo
    }

    function severityIcon(s) {
        if (s === "error")
            return "x-circle"
        if (s === "warning")
            return "alert-circle"
        if (s === "success")
            return "check-circle"
        return "info"
    }

    function rebuild() {
        // Preserve scroll across rebuilds (model is fully replaced below).
        var savedY = listView ? listView.contentY : 0
        var midnight = new Date()
        midnight.setHours(0, 0, 0, 0)
        var today = []
        var earlier = []
        for (var i = 0; i < Notifier.count; i++) {
            var it = Notifier.at(i)
            if (!it)
                continue
            if (root.filter === "unread" && !it.unread)
                continue
            var ms = it.timestamp || 0
            // Calendar-day boundary (since local midnight).
            var fresh = ms > 0 ? ms >= midnight.getTime() : true
            if (fresh)
                today.push(it)
            else
                earlier.push(it)
        }
        var arr = []
        var groups = [
            { "list": today, "label": qsTr("Today") },
            { "list": earlier, "label": qsTr("Earlier") }
        ]
        for (var g = 0; g < groups.length; g++) {
            var grp = groups[g]
            if (!grp.list.length)
                continue
            arr.push({ "kind": "header", "title": grp.label })
            for (var j = 0; j < grp.list.length; j++) {
                var n = grp.list[j]
                arr.push({ "kind": "item", "nid": n.nid, "title": n.title,
                           "body": n.body || "", "severity": n.severity || "info",
                           "unread": !!n.unread, "timeText": n.timeText || "",
                           "category": n.category || "", "repeat": n.repeat || 1 })
            }
        }
        viewModel.clear()
        for (var k = 0; k < arr.length; k++)
            viewModel.append(arr[k])
        // Rebuild replaced the whole model — restore the scroll position so an
        // open panel doesn't jump to the top on every new notification.
        if (listView)
            listView.contentY = savedY
    }

    width: Theme.notificationsWidth
    // Compact-aware height: never reach into the action/status bars at the
    // minimum window size (mirrors the toast host's bottom-margin formula).
    height: Math.max(0, Math.min(parent ? parent.height - Theme.topBarHeight
                                          - (parent.height < Theme.compactChromeBelow || Config.compactChrome
                                             ? Theme.actionBarHeightCompact : Theme.actionBarHeight)
                                          - Theme.statusBarHeight - 8 : 600, 560))
    anchors.top: parent.top
    anchors.right: parent.right
    color: Colors.surfaceOverlay
    border.color: Colors.surfaceBorder
    border.width: 1
    radius: Theme.radiusLg
    visible: open || opacity > 0.001 // keep the close state alive
    z: Theme.zNotificationCenter
    clip: true
    // Instant open/close (no animation elements — project directive).
    opacity: open ? 1 : 0
    scale: open ? 1 : 0.98
    transformOrigin: Item.TopRight
    Component.onCompleted: rebuild()
    onOpenChanged: {
        // While the inbox is open, the toast host suppresses mirrors (items
        // still land in the inbox).
        Notifier.setInboxOpen(root.open)
        if (root.open) {
            root.rebuild()
            // Opening the popover clears the unseen bell badge.
            Notifier.markNotificationsSeen()
        }
    }
    onFilterChanged: rebuild()

    // Top hairline highlight
    Rectangle {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        height: 1
        color: Colors.insetHighlight
        z: Theme.zLocal2
    }

    // Hex-tech corner frame (signature motif on floating panels)
    CornerTicks {
        anchors.fill: parent
        inset: 5
        tickSize: 7
        thickness: 1
        color: Colors.accent30
        z: Theme.zLocal2
    }

    // Faint honeycomb wash behind the list (signature texture on panels)
    Honeycomb {
        anchors.fill: parent
        cellSize: Theme.honeycombCell
        lineColor: Colors.honeycombLineFaint
        opacity: 0.4
        z: Theme.zLocal0
    }

    ColumnLayout {
        anchors.fill: parent
        spacing: 0

        // ── Header: title, unread pill, mark-all-read, clear ──
        Rectangle {
            Layout.fillWidth: true
            height: Theme.drawerHeaderHeight
            color: Colors.transparent

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 14
                anchors.rightMargin: 10
                spacing: 8

                Hexagon {
                    size: 12
                    lineWidth: 1.5
                    lineColor: Colors.accent
                    Layout.alignment: Qt.AlignVCenter
                }
                Text {
                    text: qsTr("Notifications")
                    color: Colors.textPrimary
                    font.pixelSize: 15
                    font.weight: Font.Bold
                }

                // Unread count pill
                Rectangle {
                    visible: root.unreadCount > 0
                    radius: Theme.radiusFull
                    color: Colors.accent12
                    border.color: Colors.accent30
                    border.width: 1
                    implicitWidth: unreadPillLbl.implicitWidth + 12
                    implicitHeight: 20
                    Layout.alignment: Qt.AlignVCenter
                    Text {
                        id: unreadPillLbl
                        anchors.centerIn: parent
                        text: root.unreadCount > 99 ? "99+" : root.unreadCount
                        color: Colors.accentHover
                        font.family: Theme.fontMono.family
                        font.pixelSize: 9
                        font.weight: Font.Bold
                    }
                }

                Item { Layout.fillWidth: true }

                // Mark all read — ghost chip
                Rectangle {
                    visible: root.unreadCount > 0
                    radius: Theme.radiusFull
                    color: marMa.containsMouse ? Colors.overlay40 : Colors.transparent
                    border.color: marMa.containsMouse ? Colors.surfaceBorder : Colors.surfaceBorderSubtle
                    border.width: 1
                    implicitWidth: marLbl.implicitWidth + 14
                    implicitHeight: 26
                    Layout.alignment: Qt.AlignVCenter
                    Text {
                        id: marLbl
                        anchors.centerIn: parent
                        text: qsTr("MARK ALL READ")
                        color: marMa.containsMouse ? Colors.accentHover : Colors.textMuted
                        font.family: Theme.fontLabel.family
                        font.pixelSize: 9
                    }
                    MouseArea {
                        id: marMa
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: Notifier.markAllRead()
                    }
                }

                // Clear all (with confirm) — inert when the inbox is empty
                Rectangle {
                    width: 26
                    height: 26
                    radius: Theme.radiusSm
                    opacity: clearMa.enabled ? 1 : 0.35
                    color: clearMa.containsMouse ? Colors.errorSoftBg : Colors.transparent
                    Layout.alignment: Qt.AlignVCenter
                    Icon {
                        anchors.centerIn: parent
                        name: "trash"
                        size: 13
                        color: clearMa.containsMouse ? Colors.statusError : Colors.textMuted
                    }
                    MouseArea {
                        id: clearMa
                        anchors.fill: parent
                        enabled: Notifier.count > 0
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: clearConfirm.open()
                    }
                }
            }

            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.bottom: parent.bottom
                height: 1
                color: Colors.surfaceBorderSubtle
            }
        }

        // ── Filter: All / Unread ──
        Rectangle {
            Layout.fillWidth: true
            height: 48
            color: Colors.transparent

            SegmentedControl {
                anchors.centerIn: parent
                width: parent.width - 16
                model: [
                    { "label": qsTr("All"), "value": "all" },
                    { "label": qsTr("Unread"), "value": "unread" }
                ]
                currentValue: root.filter
                onActivated: (v) => {
                    root.filter = v
                    root.rebuild()
                }
            }

            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.bottom: parent.bottom
                height: 1
                color: Colors.surfaceBorderSubtle
            }
        }

        // ── Empty state (shared component, honeycomb wash included) ──
        EmptyState {
            Layout.fillWidth: true
            Layout.fillHeight: true
            visible: viewModel.count === 0
            iconName: "bell"
            badgeSize: 56
            title: root.filter === "unread" ? qsTr("No unread notifications")
                                             : qsTr("You're all caught up.")
            body: qsTr("Session events and account alerts appear here")
        }

        // ── Grouped list ──
        ListView {
            id: listView
            Layout.fillWidth: true
            Layout.fillHeight: true
            visible: viewModel.count > 0
            model: viewModel
            clip: true
            spacing: 4
            leftMargin: 8
            rightMargin: 8
            topMargin: 6
            bottomMargin: 8

            ScrollBar.vertical: StyledScrollBar { thin: true }

            delegate: Item {
                id: row
                property bool expanded: false // full-body display toggle
                width: ListView.view.width - ListView.view.leftMargin - ListView.view.rightMargin
                height: kind === "header" ? 26 : card.implicitHeight + 4

                // Group header (mono uppercase eyebrow)
                Text {
                    visible: kind === "header"
                    anchors.left: parent.left
                    anchors.leftMargin: 8
                    anchors.verticalCenter: parent.verticalCenter
                    text: typeof title !== "undefined" ? title : ""
                    color: Colors.textMuted
                    font.family: Theme.fontMono.family
                    font.pixelSize: 9
                    font.letterSpacing: Theme.trackingEyebrow
                    font.capitalization: Font.AllUppercase
                }

                // Notification card
                Rectangle {
                    id: card
                    visible: kind === "item"
                    activeFocusOnTab: visible
                    Accessible.role: Accessible.Button
                    Accessible.name: (typeof title !== "undefined") ? title : ""
                    function activate() {
                        Notifier.markRead(nid)
                        var cat = (typeof category !== "undefined") ? category : ""
                        if (cat === "payment") { root.open = false; App.openBuyCredits() }
                        else if (cat === "recording") { Recording.revealLastRecording() }
                        else if (cat === "update") { root.open = false; App.openSettings() }
                    }
                    Keys.onReturnPressed: card.activate()
                    Keys.onSpacePressed: card.activate()
                    width: parent.width
                    anchors.top: parent.top
                    implicitHeight: cardRow.implicitHeight + 16
                    radius: Theme.radiusSm
                    color: notifItemMa.containsMouse ? Colors.surfaceHover
                         : (unread ? Colors.accent06 : Colors.surfaceElevated)
                    border.width: 1
                    border.color: notifItemMa.containsMouse ? Colors.surfaceBorder
                                 : (unread ? Colors.accent15 : Colors.surfaceBorderSubtle)

                    // Card click: mark read + route by category. Declared
                    // FIRST (bottom of paint order) so the dismiss X in the
                    // row below keeps receiving its own clicks.
                    MouseArea {
                        id: notifItemMa
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: card.activate()
                    }

                    RowLayout {
                        id: cardRow
                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.top: parent.top
                        anchors.leftMargin: 10
                        anchors.rightMargin: 8
                        anchors.topMargin: 8
                        spacing: 10

                        // Unread accent hex dot
                        Hexagon {
                            size: 8
                            lineWidth: 0
                            fillColor: Colors.accent
                            visible: unread
                            Layout.alignment: Qt.AlignTop
                            Layout.topMargin: 10
                        }

                        // Severity hex badge (dimmed once read)
                        HexBadge {
                            size: 26
                            iconName: root.severityIcon(severity)
                            iconSize: 13
                            lineWidth: 1
                            property color sc: root.severityColor(severity)
                            lineColor: Qt.rgba(sc.r, sc.g, sc.b, 0.25)
                            fillColor: Qt.rgba(sc.r, sc.g, sc.b, 0.12)
                            iconColor: sc
                            opacity: unread ? 1.0 : 0.5
                            Layout.alignment: Qt.AlignTop
                        }

                        ColumnLayout {
                            Layout.fillWidth: true
                            spacing: 2

                            RowLayout {
                                Layout.fillWidth: true
                                spacing: 6

                                Text {
                                    text: title
                                    textFormat: Text.PlainText // server-derived
                                    color: unread ? Colors.textPrimary : Colors.textSecondary
                                    font.pixelSize: 12
                                    font.weight: unread ? Font.Bold : Font.Normal
                                    Layout.fillWidth: true
                                    elide: Text.ElideRight
                                }

                                // Coalesced duplicate pill ("×N")
                                Rectangle {
                                    visible: repeat > 1
                                    radius: Theme.radiusFull
                                    color: Colors.accent12
                                    border.color: Colors.accent30
                                    border.width: 1
                                    implicitWidth: repLbl.implicitWidth + 10
                                    implicitHeight: 16
                                    Text {
                                        id: repLbl
                                        anchors.centerIn: parent
                                        text: "×" + repeat
                                        color: Colors.accentHover
                                        font.family: Theme.fontMono.family
                                        font.pixelSize: 9
                                        font.weight: Font.Bold
                                    }
                                }

                                Text {
                                    text: (timeText || "").toUpperCase()
                                    color: Colors.textMuted
                                    opacity: 0.7
                                    font.family: Theme.fontMono.family
                                    font.pixelSize: 9
                                    font.letterSpacing: 1.0
                                }

                                // Expand/collapse — full body display for long notifications
                                Rectangle {
                                    visible: typeof body !== "undefined" && body.length > 90
                                    width: 20; height: 20
                                    radius: Theme.radiusFull
                                    color: expMa.containsMouse ? Colors.overlay50 : Colors.transparent
                                    Layout.alignment: Qt.AlignVCenter
                                    Icon {
                                        anchors.centerIn: parent
                                        name: row.expanded ? "chevron-down" : "more-horizontal"
                                        size: 11
                                        color: expMa.containsMouse ? Colors.textPrimary : Colors.textMuted
                                        rotation: row.expanded ? 180 : 0
                                    }
                                    MouseArea {
                                        id: expMa
                                        anchors.fill: parent
                                        anchors.margins: -4
                                        hoverEnabled: true
                                        cursorShape: Qt.PointingHandCursor
                                        onClicked: row.expanded = !row.expanded
                                    }
                                    Tooltip {
                                        anchors.bottom: parent.top
                                        anchors.bottomMargin: 6
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        text: row.expanded ? qsTr("Show less") : qsTr("Show full message")
                                        shown: expMa.containsMouse
                                    }
                                }
                            }

                            Text {
                                visible: typeof body !== "undefined" && body.length > 0
                                text: body
                                textFormat: Text.PlainText // server-derived
                                color: Colors.textMuted
                                font.pixelSize: 11
                                wrapMode: Text.WordWrap
                                Layout.fillWidth: true
                                // collapsed: 2 lines; expanded: full body, no cap
                                maximumLineCount: row.expanded ? 10000 : 2
                                elide: row.expanded ? Text.ElideNone : Text.ElideRight
                                lineHeight: 1.35
                            }
                        }

                        // Hover-revealed dismiss X (painted above the card
                        // click area so it stays clickable).
                        Rectangle {
                            width: 20
                            height: 20
                            radius: Theme.radiusFull
                            opacity: notifItemMa.containsMouse ? 1 : 0
                            color: itemDismissMa.containsMouse ? Colors.errorSoftBg : Colors.white10
                            Layout.alignment: Qt.AlignTop
                            Layout.topMargin: 2

                            Icon {
                                anchors.centerIn: parent
                                name: "x"
                                size: 10
                                emphasis: true
                                color: itemDismissMa.containsMouse ? Colors.statusError : Colors.textMuted
                            }

                            MouseArea {
                                id: itemDismissMa
                                anchors.fill: parent
                                anchors.margins: -4
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor
                                onClicked: Notifier.dismiss(nid)
                            }
                        }
                    }
                }
            }
        }
    }

    // Grouped + filtered snapshot of Notifier (headers + item rows).
    ListModel {
        id: viewModel
    }

    Connections {
        // Only rebuild the open view; the badge reads Notifier directly.
        function onPushed() {
            if (root.open)
                root.rebuild()
        }

        function onCountChanged() {
            if (root.open)
                root.rebuild()
        }

        function onUnreadCountChanged() {
            if (root.open)
                root.rebuild()
        }

        target: Notifier
    }

    // Relative timestamp refresh — only while open (no idle timer)
    Timer {
        interval: 30000
        running: root.open
        repeat: true
        onTriggered: {
            Notifier.refreshTimes()
            root.rebuild()
        }
    }

    ConfirmDialog {
        id: clearConfirm
        title: qsTr("Clear all notifications?")
        message: Notifier.count === 1
            ? qsTr("This removes the last notification in your inbox. This can't be undone.")
            : qsTr("This removes all %1 notifications from your inbox. This can't be undone.").arg(Notifier.count)
        confirmText: qsTr("Clear all")
        destructive: true
        onAccepted: {
            Notifier.clear()
            root.rebuild()
            root.open = false
        }
    }
}
