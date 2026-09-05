import LiveMorph
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

/**
 * NotificationCenter — drop-down inbox fed by the C++ Notifier model.
 * Filter tabs (All / Unread / Errors), severity grouping, icon badges,
 * relative timestamps, and a numeric unread badge on the bell.
 */
Rectangle {
    id: root

    property bool open: false
    readonly property int unreadCount: Notifier.unreadCount
    property string filter: "all" // all | unread | error
    readonly property var severityOrder: ["success", "warning", "error", "info"]

    function severityColor(s) {
        if (s === "error")
            return Colors.statusError;

        if (s === "warning")
            return Colors.statusWarning;

        if (s === "success")
            return Colors.statusSuccess;

        return Colors.statusInfo;
    }

    function severityIcon(s) {
        if (s === "error")
            return "x-circle";

        if (s === "warning")
            return "alert-circle";

        if (s === "success")
            return "check-circle";

        return "info";
    }

    function rebuild() {
        var arr = [];
        for (var g = 0; g < root.severityOrder.length; g++) {
            var sev = root.severityOrder[g];
            var rows = [];
            for (var i = 0; i < Notifier.count; i++) {
                var it = Notifier.at(i);
                if (!it)
                    continue;

                if (it.severity !== sev)
                    continue;

                if (root.filter === "unread" && !it.unread)
                    continue;

                if (root.filter === "error" && it.severity !== "error")
                    continue;

                rows.push(it);
            }
            if (rows.length === 0)
                continue;

            arr.push({
                "kind": "header",
                "severity": sev,
                "count": rows.length
            });
            for (var j = 0; j < rows.length; j++) arr.push({
                "kind": "item",
                "nid": rows[j].nid,
                "title": rows[j].title,
                "body": rows[j].body,
                "severity": rows[j].severity,
                "unread": rows[j].unread,
                "timeText": rows[j].timeText
            })
        }
        viewModel.clear();
        for (var k = 0; k < arr.length; k++) viewModel.append(arr[k])
    }

    width: Theme.notificationsWidth
    height: Math.min(600, parent ? parent.height - 80 : 600)
    anchors.top: parent.top
    anchors.topMargin: 8
    anchors.right: parent.right
    anchors.rightMargin: 12
    color: Colors.surfaceGlassStrong
    border.color: Colors.surfaceBorder
    border.width: 1
    radius: Theme.radiusXl
    visible: open
    z: 130
    clip: true
    // Entrance gated on open (closed removes node -> no idle cost)
    opacity: open ? 1 : 0
    scale: open ? 1 : 0.96
    transformOrigin: Item.TopRight
    Component.onCompleted: rebuild()
    onFilterChanged: rebuild()
    onOpenChanged: {
        if (root.open) {
            rebuild();
        }
    }

    // Soft top highlight
    Rectangle {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        height: 1
        color: Colors.insetHighlight
        z: 2
    }

    ColumnLayout {
        anchors.fill: parent
        spacing: 0

        // Header
        Rectangle {
            Layout.fillWidth: true
            height: 58
            color: "transparent"

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 16
                anchors.rightMargin: 10
                spacing: 8

                ColumnLayout {
                    spacing: 2
                    Layout.fillWidth: true

                    Text {
                        text: qsTr("Notifications")
                        color: Colors.textPrimary
                        font.pixelSize: 15
                        font.weight: Font.DemiBold
                    }

                    Text {
                        text: root.unreadCount > 0 ? qsTr("%1 unread").arg(root.unreadCount) : qsTr("You're all caught up")
                        color: Colors.textMuted
                        font.pixelSize: 11
                    }

                }

                GhostButton {
                    text: qsTr("Mark all read")
                    visible: Notifier.count > 0 && root.unreadCount > 0
                    onClicked: Notifier.markAllRead()
                }

                Rectangle {
                    width: 28
                    height: 28
                    radius: 14
                    color: closeMa.containsMouse ? Colors.white06 : "transparent"

                    Icon {
                        anchors.centerIn: parent
                        name: "x"
                        size: 16
                        color: Colors.textSecondary
                    }

                    MouseArea {
                        id: closeMa

                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.open = false
                    }

                }

            }

            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.bottom: parent.bottom
                height: 1
                color: Colors.divider
            }

        }

        // Filter tabs
        Item {
            Layout.fillWidth: true
            height: 44
            visible: Notifier.count > 0

            SegmentedControl {
                anchors.verticalCenter: parent.verticalCenter
                anchors.left: parent.left
                anchors.leftMargin: 16
                model: [{
                    "label": qsTr("All"),
                    "value": "all"
                }, {
                    "label": qsTr("Unread"),
                    "value": "unread"
                }, {
                    "label": qsTr("Errors"),
                    "value": "error"
                }]
                currentValue: root.filter
                onActivated: (v) => {
                    return root.filter = v;
                }
            }

        }

        // Empty state
        Item {
            Layout.fillWidth: true
            Layout.fillHeight: true
            visible: viewModel.count === 0

            Column {
                anchors.centerIn: parent
                spacing: 10

                Rectangle {
                    width: 56
                    height: 56
                    radius: 28
                    color: Colors.accent10
                    anchors.horizontalCenter: parent.horizontalCenter
                    border.color: Colors.accent20
                    border.width: 1

                    Icon {
                        anchors.centerIn: parent
                        name: "bell"
                        size: 22
                        color: Colors.accent
                    }

                }

                Text {
                    text: Notifier.count === 0 ? qsTr("All caught up") : qsTr("Nothing here")
                    color: Colors.textPrimary
                    font.pixelSize: 14
                    font.weight: Font.DemiBold
                    anchors.horizontalCenter: parent.horizontalCenter
                }

                Text {
                    text: qsTr("Session events and account alerts appear here")
                    color: Colors.textMuted
                    font.pixelSize: 12
                    anchors.horizontalCenter: parent.horizontalCenter
                }

            }

        }

        // Grouped list
        ListView {
            Layout.fillWidth: true
            Layout.fillHeight: true
            visible: viewModel.count > 0
            model: viewModel
            clip: true
            spacing: 2
            topMargin: 4
            bottomMargin: 4

            ScrollBar.vertical: ScrollBar {
                policy: ScrollBar.AsNeeded
            }

            delegate: Item {
                width: ListView.view.width
                height: kind === "header" ? 30 : cardCol.implicitHeight + 14

                // Group header
                Rectangle {
                    visible: kind === "header"
                    anchors.fill: parent
                    anchors.leftMargin: 12
                    anchors.rightMargin: 12
                    color: "transparent"

                    RowLayout {
                        anchors.fill: parent
                        spacing: 6

                        Icon {
                            name: root.severityIcon(severity)
                            size: 12
                            color: root.severityColor(severity)
                            Layout.alignment: Qt.AlignVCenter
                        }

                        Text {
                            text: severity.charAt(0).toUpperCase() + severity.slice(1)
                            color: Colors.textMuted
                            font.pixelSize: 10
                            font.weight: Font.Medium
                            Layout.alignment: Qt.AlignVCenter
                        }

                        Text {
                            text: count
                            color: Colors.textMuted
                            font.pixelSize: 10
                            Layout.alignment: Qt.AlignVCenter
                        }

                    }

                }

                // Notification item
                Rectangle {
                    visible: kind === "item"
                    anchors.fill: parent
                    anchors.leftMargin: 8
                    anchors.rightMargin: 8
                    anchors.bottomMargin: 2
                    radius: Theme.radiusMd
                    color: unread ? Colors.accent10 : Colors.surfaceOverlay
                    border.color: unread ? Colors.accent20 : Colors.divider
                    border.width: 1

                    RowLayout {
                        id: cardCol

                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.top: parent.top
                        anchors.margins: 12
                        spacing: 12

                        Rectangle {
                            width: 28
                            height: 28
                            radius: 14
                            color: Qt.rgba(root.severityColor(severity).r, root.severityColor(severity).g, root.severityColor(severity).b, 0.16)
                            Layout.alignment: Qt.AlignTop

                            Icon {
                                anchors.centerIn: parent
                                name: root.severityIcon(severity)
                                size: 14
                                color: root.severityColor(severity)
                            }

                        }

                        ColumnLayout {
                            Layout.fillWidth: true
                            spacing: 3

                            RowLayout {
                                Layout.fillWidth: true

                                Text {
                                    text: title
                                    color: Colors.textPrimary
                                    font.pixelSize: 13
                                    font.weight: Font.DemiBold
                                    Layout.fillWidth: true
                                    elide: Text.ElideRight
                                }

                                Text {
                                    text: timeText
                                    color: Colors.textMuted
                                    font.pixelSize: 10
                                }

                            }

                            Text {
                                visible: body.length > 0
                                text: body
                                color: Colors.textSecondary
                                font.pixelSize: 12
                                wrapMode: Text.WordWrap
                                Layout.fillWidth: true
                                lineHeight: 1.35
                            }

                        }

                        Rectangle {
                            visible: unread
                            width: 8
                            height: 8
                            radius: 4
                            color: Colors.accent
                            Layout.alignment: Qt.AlignTop
                            Layout.topMargin: 6
                        }

                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: Notifier.markRead(nid)
                    }

                }

            }

        }

        // Footer
        Rectangle {
            Layout.fillWidth: true
            height: 44
            color: "transparent"
            visible: Notifier.count > 0

            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                height: 1
                color: Colors.divider
            }

            GhostButton {
                anchors.centerIn: parent
                text: qsTr("Clear all")
                onClicked: Notifier.clear()
            }

        }

    }

    // Grouped + filtered snapshot of Notifier (headers + item rows).
    ListModel {
        id: viewModel
    }

    Connections {
        // Only rebuild the open view; the badge reads Notifier.unreadCount directly.
        function onPushed() {
            if (root.open)
                root.rebuild();

        }

        function onCountChanged() {
            if (root.open)
                root.rebuild();

        }

        function onUnreadCountChanged() {
            if (root.open)
                root.rebuild();

        }

        target: Notifier
    }

    // Relative timestamp refresh — only while open (no idle timer)
    Timer {
        interval: 30000
        running: root.open
        repeat: true
        onTriggered: Notifier.refreshTimes()
    }

    Behavior on opacity {
        NumberAnimation {
            duration: Theme.motionNormal
        }

    }

    Behavior on scale {
        NumberAnimation {
            duration: Theme.motionNormal
            easing.type: Easing.OutCubic
        }

    }

}
