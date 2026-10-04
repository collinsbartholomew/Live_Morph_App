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

    // Electron: w-80 (320px) dropdown, SOLID #17171f (panel-popover), radius 6
    width: 320
    height: Math.min(parent ? parent.height - 80 : 600, headerCol.implicitHeight + 360 + 48)
    anchors.top: parent.top
    anchors.topMargin: 4
    anchors.right: parent.right
    anchors.rightMargin: 8
    color: Colors.surfaceOverlay
    border.color: Colors.surfaceBorder
    border.width: 1
    radius: Theme.radiusMd
    visible: open || opacity > 0.001 // keep the close transition alive
    z: 130
    clip: true
    // Entrance gated on open (closed removes node -> no idle cost)
    opacity: open ? 1 : 0
    scale: open ? 1 : 0.98
    transformOrigin: Item.TopRight
    Component.onCompleted: rebuild()
    onFilterChanged: rebuild()
    onOpenChanged: {
        if (root.open) {
            rebuild();
        }
    }

    // panel-popover shadow: 0 1px 4px .3 + 0 12px 24px -8px .5
    Rectangle {
        anchors.fill: parent
        anchors.margins: -1
        radius: parent.radius + 1
        color: "#0000004d"
        z: -1
    }
    Rectangle {
        anchors.fill: parent
        anchors.margins: -8
        anchors.topMargin: -2
        radius: parent.radius + 8
        color: "#00000080"
        z: -1
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
        id: headerCol
        anchors.fill: parent
        spacing: 0

        // Header (Electron: 12px semibold title + markAllRead accent link + clear icon)
        Rectangle {
            Layout.fillWidth: true
            height: 44

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 16
                anchors.rightMargin: 10
                spacing: 8

                Text {
                    text: qsTr("Notifications")
                    color: Colors.textPrimary
                    font.pixelSize: 12
                    font.weight: Font.DemiBold
                    Layout.fillWidth: true
                }

                Text {
                    text: qsTr("Mark all read")
                    color: marMa.containsMouse ? Colors.accent : Colors.textMuted
                    font.pixelSize: 10
                    visible: Notifier.count > 0 && root.unreadCount > 0
                    MouseArea {
                        id: marMa
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: Notifier.markAllRead()
                    }
                    Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
                }

                Rectangle {
                    width: 20
                    height: 20
                    color: clearMa.containsMouse ? Colors.errorSoftBg : "transparent"

                    Icon {
                        anchors.centerIn: parent
                        name: "x"
                        size: 12
                        emphasis: true
                        color: clearMa.containsMouse ? Colors.statusError : Colors.textMuted
                    }

                    MouseArea {
                        id: clearMa
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            Notifier.clear()
                            root.open = false
                        }
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
                    radius: Theme.radiusFull
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

                // Notification item (Electron: BORDERLESS row, bottom hairline,
                // 3% unread tint, read/unread title states, hover-reveal X)
                Rectangle {
                    property bool isHovered: notifItemMa.containsMouse

                    visible: kind === "item"
                    anchors.fill: parent
                    anchors.bottomMargin: 0
                    radius: 0
                    color: isHovered ? "#17171f66"          // surface-overlay/40
                         : unread ? Colors.accent06          // 3% unread tint
                         : "transparent"
                    border.width: 0
                    Behavior on color { ColorAnimation { duration: Theme.motionFast } }

                    // Bottom hairline separator (surface-border-subtle/60)
                    Rectangle {
                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.bottom: parent.bottom
                        height: 1
                        color: "#18182499"
                        visible: kind === "item"
                    }

                    RowLayout {
                        id: cardCol

                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.top: parent.top
                        anchors.leftMargin: 16
                        anchors.rightMargin: 12
                        spacing: 10

                        // 24px icon circle @12% (Electron); read items dim to 45%
                        Rectangle {
                            width: 24
                            height: 24
                            radius: 12
                            color: Qt.rgba(root.severityColor(severity).r, root.severityColor(severity).g, root.severityColor(severity).b, 0.12)
                            opacity: unread ? 1.0 : 0.45
                            Layout.alignment: Qt.AlignTop
                            Layout.topMargin: 10

                            Icon {
                                anchors.centerIn: parent
                                name: root.severityIcon(severity)
                                size: 12
                                color: root.severityColor(severity)
                            }

                        }

                        ColumnLayout {
                            Layout.fillWidth: true
                            spacing: 2
                            Layout.topMargin: 10
                            Layout.bottomMargin: 10

                            // Read/unread title states (Electron: unread =
                            // semibold primary, read = text-secondary)
                            Text {
                                text: title
                                color: unread ? Colors.textPrimary : Colors.textSecondary
                                font.pixelSize: 12
                                font.weight: unread ? Font.DemiBold : Font.Medium
                                Layout.fillWidth: true
                                elide: Text.ElideRight
                            }

                            Text {
                                visible: body.length > 0
                                text: body
                                color: Colors.textMuted
                                font.pixelSize: 11
                                wrapMode: Text.WordWrap
                                Layout.fillWidth: true
                                maximumLineCount: 2
                                lineHeight: 1.35
                            }

                            // 9px mono uppercase timestamp below the body
                            Text {
                                text: timeText.toUpperCase()
                                color: Colors.textMuted
                                opacity: 0.7
                                font.family: Theme.fontMono.family
                                font.pixelSize: 9
                                font.letterSpacing: 1.2
                            }

                        }

                        // Per-item dismiss (Electron: hover-revealed X, error hover).
                        // OPACITY toggle — `visible` drops the item from the
                        // layout, re-eliding titles on every hover pass.
                        Rectangle {
                            visible: true
                            opacity: isHovered ? 1 : 0
                            width: 20
                            height: 20
                            color: itemDismissMa.containsMouse ? Colors.errorSoftBg : "transparent"
                            Layout.alignment: Qt.AlignTop
                            Layout.topMargin: 8

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
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor
                                onClicked: Notifier.dismiss(nid)
                            }
                        }

                    }

                    MouseArea {
                        id: notifItemMa
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: Notifier.markRead(nid)
                    }

                }

            }

        }

        // Footer (Electron: "Clear all" is in the header; hide this strip)
        Rectangle {
            Layout.fillWidth: true
            height: 0
            visible: false
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
