import LiveMorph
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

/**
 * TopBar — original: flex items-center justify-between h-11 px-4
 * border-b border-surface-border bg-surface-base z-chrome
 */
Rectangle {
    id: root

    property int notifUnread: 0
    property bool narrow: false

    signal openBuyCredits()
    signal openSettings()
    signal openHelp()
    signal openNotifications()
    signal openWhatsNew()

    color: Colors.surfaceBase
    implicitHeight: Theme.topBarHeight

    Rectangle {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        height: 1
        color: Colors.surfaceBorder
    }

    RowLayout {
        anchors.fill: parent
        anchors.leftMargin: 16
        anchors.rightMargin: 12
        spacing: 10

        StatusPill {
            text: Session.statusText
            status: Session.connectionStatus
        }

        WorkingWithChip {
            visible: !root.narrow
        }

        Item {
            Layout.fillWidth: true
        }

        Text {
            visible: !root.narrow
            text: (App.realtimeProvider === "decart" ? "Lucy 2" : "Fal") + " · " + (App.swapTier === "hd" ? "HD" : "Standard")
            color: Colors.textMuted
            font.pixelSize: 10
            font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
            font.letterSpacing: 1
        }

        // Credits pill
        Rectangle {
            Layout.preferredHeight: 28
            Layout.preferredWidth: creditsRow.implicitWidth + 16
            radius: 14
            color: (Auth.creditBalance + (Auth.bonusBalance || 0)) < (Session.creditsPerSecond || 2) * 60 ? Colors.statusErrorMuted : Colors.surfaceOverlay
            border.color: (Auth.creditBalance + (Auth.bonusBalance || 0)) < (Session.creditsPerSecond || 2) * 60 ? Colors.statusError : Colors.surfaceBorder
            border.width: 1

            Row {
                id: creditsRow

                anchors.centerIn: parent
                spacing: 6

                Icon {
                    name: "zap"
                    size: Theme.iconSm
                    color: Colors.accent
                    anchors.verticalCenter: parent.verticalCenter
                }

                Text {
                    text: Auth.creditBalance.toLocaleString()
                    color: Colors.textPrimary
                    font.pixelSize: 11
                    font.weight: Font.DemiBold
                    font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                    anchors.verticalCenter: parent.verticalCenter
                }

                Text {
                    text: {
                        var bal = Auth.creditBalance + (Auth.bonusBalance || 0);
                        var rate = Session.creditsPerSecond || 2;
                        if (rate <= 0)
                            return qsTr("credits");

                        var sec = Math.floor(bal / rate);
                        if (sec <= 0)
                            return qsTr("credits · empty");

                        var m = Math.floor(sec / 60);
                        var s = sec % 60;
                        if (m >= 60)
                            return qsTr("credits · %1h+").arg(Math.floor(m / 60));

                        if (m > 0)
                            return qsTr("credits · ~%1m").arg(m);

                        return qsTr("credits · ~%1s").arg(s);
                    }
                    color: {
                        var bal = Auth.creditBalance + (Auth.bonusBalance || 0);
                        var rate = Session.creditsPerSecond || 2;
                        var sec = rate > 0 ? bal / rate : 999;
                        return sec < 30 ? Colors.statusError : (sec < 90 ? Colors.statusWarning : Colors.textMuted);
                    }
                    font.pixelSize: 10
                    anchors.verticalCenter: parent.verticalCenter
                }

            }

            MouseArea {
                id: creditsMa

                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                hoverEnabled: true
                onClicked: root.openBuyCredits()
                onPressed: parent.scale = 0.96
                onReleased: parent.scale = 1
            }

            Tooltip {
                anchors.top: parent.bottom
                anchors.topMargin: 6
                anchors.horizontalCenter: parent.horizontalCenter
                text: qsTr("Balance & estimated morph time at current rate — click to buy")
                shown: creditsMa.containsMouse
            }

            Behavior on scale {
                NumberAnimation {
                    duration: Theme.motionFast
                }

            }

        }

        GhostButton {
            id: buyBtn

            text: "Buy"
            onClicked: root.openBuyCredits()
            ToolTip.visible: hovered
            ToolTip.text: "Buy credit packs"
            ToolTip.delay: 400
        }

        // Notifications
        Rectangle {
            width: 32
            height: 32
            radius: Theme.radiusSm
            color: notifMa.containsMouse ? Colors.surfaceOverlay : "transparent"

            Icon {
                anchors.centerIn: parent
                name: "bell"
                size: Theme.iconLg
                color: Colors.textSecondary
            }

            MouseArea {
                id: notifMa

                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: root.openNotifications()
                onPressed: parent.scale = 0.96
                onReleased: parent.scale = 1
            }

            Rectangle {
                visible: root.notifUnread > 0
                anchors.top: parent.top
                anchors.right: parent.right
                anchors.topMargin: -2
                anchors.rightMargin: -2
                width: notifCount.implicitWidth + 8
                height: 16
                radius: 8
                color: Colors.statusError

                Text {
                    id: notifCount

                    anchors.centerIn: parent
                    text: root.notifUnread > 99 ? "99+" : root.notifUnread
                    color: Colors.white
                    font.pixelSize: 9
                    font.weight: Font.Bold
                }

            }

            Tooltip {
                anchors.top: parent.bottom
                anchors.topMargin: 6
                anchors.horizontalCenter: parent.horizontalCenter
                text: root.notifUnread > 0 ? ("Notifications (" + root.notifUnread + ")") : "Notifications"
                shown: notifMa.containsMouse
            }

            Behavior on color {
                ColorAnimation {
                    duration: Theme.motionFast
                }

            }

            Behavior on scale {
                NumberAnimation {
                    duration: Theme.motionFast
                }

            }

        }

        // Help
        Rectangle {
            width: 32
            height: 32
            radius: Theme.radiusSm
            color: helpMa.containsMouse ? Colors.surfaceOverlay : "transparent"

            Icon {
                anchors.centerIn: parent
                name: "help-circle"
                size: Theme.iconLg
                color: Colors.textSecondary
            }

            MouseArea {
                id: helpMa

                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: root.openHelp()
                onPressed: parent.scale = 0.96
                onReleased: parent.scale = 1
            }

            Tooltip {
                anchors.top: parent.bottom
                anchors.topMargin: 6
                anchors.horizontalCenter: parent.horizontalCenter
                text: "Help & shortcuts"
                shown: helpMa.containsMouse
            }

            Behavior on color {
                ColorAnimation {
                    duration: Theme.motionFast
                }

            }

            Behavior on scale {
                NumberAnimation {
                    duration: Theme.motionFast
                }

            }

        }

        // Account avatar
        Rectangle {
            id: accountBtn

            width: 32
            height: 32
            radius: 16
            color: Colors.surfaceOverlay
            border.color: Colors.surfaceBorder
            border.width: 1

            Text {
                anchors.centerIn: parent
                text: Auth.displayName.length ? Auth.displayName.charAt(0).toUpperCase() : "?"
                color: Colors.accent
                font.pixelSize: 12
                font.bold: true
            }

            MouseArea {
                id: accountMa

                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                hoverEnabled: true
                onClicked: accountMenu.open()
                onPressed: parent.scale = 0.96
                onReleased: parent.scale = 1
            }

            Tooltip {
                anchors.top: parent.bottom
                anchors.topMargin: 6
                anchors.horizontalCenter: parent.horizontalCenter
                text: "Account menu"
                shown: accountMa.containsMouse && !accountMenu.visible
            }

            // panel-popover style menu
            Menu {
                id: accountMenu

                y: parent.height + 4

                MenuItem {
                    text: Auth.displayName || Auth.email
                    enabled: false
                }

                MenuSeparator {
                }

                MenuItem {
                    text: "Settings"
                    onTriggered: root.openSettings()
                }

                MenuItem {
                    text: "Buy credits"
                    onTriggered: root.openBuyCredits()
                }

                MenuItem {
                    text: "What's new"
                    onTriggered: root.openWhatsNew()
                }

                MenuSeparator {
                }

                MenuItem {
                    text: "Sign out"
                    onTriggered: {
                        Backend.clearAuthSession();
                        Auth.signOut();
                    }
                }

                background: Rectangle {
                    color: Colors.surfaceOverlay
                    border.color: Colors.surfaceBorder
                    radius: Theme.radiusMd
                    implicitWidth: 200

                    // inset highlight
                    Rectangle {
                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.top: parent.top
                        height: 1
                        color: Colors.insetHighlightSoft
                        radius: Theme.radiusMd
                    }

                }

            }

            Behavior on scale {
                NumberAnimation {
                    duration: Theme.motionFast
                }

            }

        }

    }

}
