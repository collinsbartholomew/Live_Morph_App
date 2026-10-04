import LiveMorph
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

/**
 * TopBar (Electron ground truth):
 *   h-11 px-4 gap-2 · tier badge exact hex · Swap-Active accent10/20 pill
 *   REC pill bg-black/70 border-error/40 backdrop-blur, text-white/95
 *   credits badge bg-surface-base/70 translucent, error≤0 / warning<600
 *   bell 28×28 rounded-md bordered translucent rest-state, hover accent/4
 *   unread badge bg-accent "9+" ring-2 ring-surface-base
 *   avatar: 28px rounded-md pill w/ 22px avatar + chevron, amber when broke
 *   account menu: w-64 (320px) panel-popover w/ balance block
 */
Rectangle {
    id: root

    property int notifUnread: 0
    property bool narrow: false
    property alias accountMenuOpen: accountMenu.visible

    signal openBuyCredits()
    signal openSettings()
    signal openHelp()
    signal openNotifications()
    signal openWhatsNew()
    signal openStreamKit()

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
        anchors.rightMargin: 16
        spacing: 8

        StatusPill {
            text: Session.statusText
            status: Session.connectionStatus
        }

        // ── Plan tier badge (Electron exact hex) ─────────
        Rectangle {
            visible: Auth.isAuthenticated
            height: 22
            width: tierRow.implicitWidth + 14
            radius: Theme.radiusSm
            color: {
                switch (Auth.tier) {
                case "pro": return Colors.tierProBg
                case "mid": return Colors.tierMidBg
                case "starter": return Colors.tierStarterBg
                case "basic": return Colors.tierBasicBg
                default: return Colors.surfaceOverlay // free
                }
            }
            border.color: {
                switch (Auth.tier) {
                case "pro": return Colors.tierProBorder
                case "mid": return Colors.tierMidBorder
                case "starter": return Colors.tierStarterBorder
                case "basic": return Colors.tierBasicBorder
                default: return Colors.surfaceBorder
                }
            }
            border.width: 1

            Row {
                id: tierRow
                anchors.centerIn: parent
                spacing: 4

                Text {
                    text: {
                        switch (Auth.tier) {
                        case "pro": return "\u265B"      // crown
                        case "mid": return "\u25C6"      // diamond
                        case "starter": return "\u2605"  // star
                        case "basic": return "\u2022"    // bullet
                        default: return ""               // free
                        }
                    }
                    color: {
                        switch (Auth.tier) {
                        case "pro": return Colors.tierProText
                        case "mid": return Colors.tierMidText
                        case "starter": return Colors.tierStarterText
                        case "basic": return Colors.tierBasicText
                        default: return Colors.textMuted
                        }
                    }
                    font.pixelSize: 10
                    anchors.verticalCenter: parent.verticalCenter
                }

                Text {
                    text: Auth.tier.toUpperCase()
                    color: {
                        switch (Auth.tier) {
                        case "pro": return Colors.tierProText
                        case "mid": return Colors.tierMidText
                        case "starter": return Colors.tierStarterText
                        case "basic": return Colors.tierBasicText
                        default: return Colors.textMuted
                        }
                    }
                    font.pixelSize: 9
                    font.weight: Font.DemiBold
                    font.family: Theme.fontMono.family
                    font.letterSpacing: 1
                    anchors.verticalCenter: parent.verticalCenter
                }
            }

            Tooltip {
                anchors.top: parent.bottom
                anchors.topMargin: 6
                anchors.horizontalCenter: parent.horizontalCenter
                text: {
                    switch (Auth.tier) {
                    case "pro": return "Pro plan — HD access, premium features"
                    case "mid": return "Mid plan — HD access available"
                    case "starter": return "Starter plan — HD unlocked"
                    case "basic": return "Basic plan — Standard swap"
                    default: return "Free plan — Limited credits"
                    }
                }
                shown: tierMa.containsMouse
            }

            MouseArea {
                id: tierMa
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: root.openBuyCredits()
            }
        }

        // ── Swap Active pill (stage HUD parity: accent/10 bg, accent/20 border) ──
        Rectangle {
            visible: Session.isActive && Session.connectionStatus === "connected"
            height: 22
            width: swapActiveRow.implicitWidth + 14
            radius: Theme.radiusSm
            color: Colors.accent10
            border.color: Colors.accent20
            border.width: 1
            Row {
                id: swapActiveRow
                anchors.centerIn: parent
                spacing: 5
                Rectangle {
                    width: 6; height: 6; radius: 3
                    color: Colors.accent
                    anchors.verticalCenter: parent.verticalCenter
                    // pulse-subtle 2s ease-in-out 1↔0.7
                    SequentialAnimation on opacity {
                        loops: Animation.Infinite
                        NumberAnimation { to: 0.7; duration: 2000; easing.type: Easing.InOutQuad }
                        NumberAnimation { to: 1.0; duration: 2000; easing.type: Easing.InOutQuad }
                    }
                }
                Text {
                    text: qsTr("Swap Active")
                    color: Colors.accentHover
                    font.pixelSize: 10
                    font.weight: Font.Medium
                    font.capitalization: Font.AllUppercase
                    font.letterSpacing: 1.5
                    font.family: Theme.fontMono.family
                    anchors.verticalCenter: parent.verticalCenter
                }
            }
        }

        // ── Recording timer (Electron: bg-black/70, border-error/40, white/95) ──
        Rectangle {
            visible: Recording.isRecording
            height: 22
            width: recTimerRow.implicitWidth + 14
            radius: Theme.radiusSm
            color: "#000000b3"
            border.color: "#ef444466"
            border.width: 1
            Row {
                id: recTimerRow
                anchors.centerIn: parent
                spacing: 5
                Rectangle {
                    width: 6; height: 6; radius: 3
                    color: Colors.statusError
                    anchors.verticalCenter: parent.verticalCenter
                    // Electron REC dot: glow + pulse-subtle 2s
                    Rectangle {
                        anchors.centerIn: parent
                        width: 12; height: 12; radius: 6
                        color: "#ef4444b3"
                    }
                    SequentialAnimation on opacity {
                        loops: Animation.Infinite
                        NumberAnimation { to: 0.7; duration: 2000; easing.type: Easing.InOutQuad }
                        NumberAnimation { to: 1.0; duration: 2000; easing.type: Easing.InOutQuad }
                    }
                }
                Text {
                    text: {
                        var s = Recording.elapsedMs / 1000;
                        var h = Math.floor(s / 3600);
                        var m = Math.floor((s % 3600) / 60);
                        var sec = Math.floor(s % 60);
                        var pad = function(v) { return v < 10 ? "0" + v : "" + v; };
                        return h > 0 ? (h + ":" + pad(m) + ":" + pad(sec)) : (pad(m) + ":" + pad(sec));
                    }
                    color: "#fffffff2"
                    font.pixelSize: 10
                    font.family: Theme.fontMono.family
                    anchors.verticalCenter: parent.verticalCenter
                }
            }
        }

        Item {
            Layout.fillWidth: true
        }

        // ── Credits balance badge (bg-surface-base/70 translucent) ───
        Rectangle {
            id: creditsBadge
            height: 22
            width: creditsRow.implicitWidth + 14
            radius: Theme.radiusSm
            color: creditsBadgeMa.containsMouse ? Qt.rgba(8/255, 8/255, 12/255, 0.90)
                                               : Qt.rgba(8/255, 8/255, 12/255, 0.70)
            border.color: Auth.creditBalance <= 0 ? Colors.statusError
                          : Auth.creditBalance < 600 ? Colors.statusWarning
                          : Colors.surfaceBorder
            border.width: 1
            visible: Auth.isAuthenticated
            Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }

            Row {
                id: creditsRow
                anchors.centerIn: parent
                spacing: 4
                Text {
                    text: "\u25C6" // 9×9 diamond
                    color: Auth.creditBalance <= 0 ? Colors.statusError
                           : Auth.creditBalance < 600 ? Colors.statusWarning
                           : Colors.textMuted
                    font.pixelSize: 8
                    anchors.verticalCenter: parent.verticalCenter
                }
                Text {
                    text: Auth.creditBalance.toFixed(0)
                    color: Auth.creditBalance <= 0 ? Colors.statusError
                           : Auth.creditBalance < 600 ? Colors.statusWarning
                           : Colors.textSecondary
                    font.pixelSize: 10
                    font.weight: Font.DemiBold
                    font.family: Theme.fontMono.family
                    anchors.verticalCenter: parent.verticalCenter
                }
            }

            MouseArea {
                id: creditsBadgeMa
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: root.openBuyCredits()
            }

            Tooltip {
                anchors.top: parent.bottom
                anchors.topMargin: 6
                anchors.horizontalCenter: parent.horizontalCenter
                text: qsTr("%1 credits · burns %2/sec").arg(Auth.creditBalance.toFixed(0)).arg(Session.creditsPerSecond.toFixed(0))
                shown: creditsBadgeMa.containsMouse
            }
        }

        // ── Notifications bell (Electron: 28×28 bordered translucent rest-state) ──
        Rectangle {
            width: 28
            height: 28
            radius: Theme.radiusMd
            color: notifMa.containsMouse ? "#8b5cf60a" : "#17171f4d"
            border.color: notifMa.containsMouse ? Colors.accent30 : Colors.surfaceBorderSubtle
            border.width: 1
            Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
            Behavior on border.color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }

            Icon {
                anchors.centerIn: parent
                name: "bell"
                size: Theme.iconSm
                color: notifMa.containsMouse ? Colors.textSecondary : Colors.textMuted
            }

            MouseArea {
                id: notifMa
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: root.openNotifications()
            }

            // Electron unread badge: bg-accent violet, "9+", ring-2 ring-surface-base
            Rectangle {
                visible: root.notifUnread > 0
                anchors.top: parent.top
                anchors.right: parent.right
                anchors.topMargin: -6
                anchors.rightMargin: -6
                // Width from the TEXT's implicitWidth — a plain wrapper
                // Rectangle never syncs explicit width into implicitWidth,
                // so the badge collapsed to an 8px sliver.
                width: notifCount.implicitWidth + 8
                height: 16
                radius: Theme.radiusFull
                color: Colors.accent
                border.color: Colors.surfaceBase
                border.width: 2
                Text {
                    id: notifCount
                    anchors.centerIn: parent
                    text: root.notifUnread > 9 ? "9+" : root.notifUnread
                    color: Colors.white
                    font.pixelSize: 9
                    font.weight: Font.Bold
                }
            }

            Tooltip {
                anchors.top: parent.bottom
                anchors.topMargin: 6
                anchors.horizontalCenter: parent.horizontalCenter
                text: root.notifUnread > 0 ? (qsTr("Notifications") + " (" + root.notifUnread + ")") : qsTr("Notifications")
                shown: notifMa.containsMouse
            }
        }

        // ── Account (Electron: 28px rounded-md pill, 22px avatar, chevron) ──
        Rectangle {
            id: accountBtn

            width: 44
            height: 28
            radius: Theme.radiusMd
            readonly property bool lowCredits: Auth.isAuthenticated && Auth.creditBalance <= 0
            color: accountMenu.visible ? "#8b5cf60f"
                : accountMa.containsMouse ? (accountBtn.lowCredits ? "#f59e0b0a" : "#8b5cf60a")
                : (accountBtn.lowCredits ? "#f59e0b0a" : "#17171f4d")
            border.color: accountMenu.visible ? Colors.accent30
                : accountBtn.lowCredits ? "#f59e0b4d"
                : accountMa.containsMouse ? Colors.accent30
                : Colors.surfaceBorderSubtle
            border.width: 1
            Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
            Behavior on border.color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }

            Row {
                anchors.centerIn: parent
                spacing: 5

                Rectangle {
                    width: 22
                    height: 22
                    radius: 11
                    color: Colors.accent20
                    border.color: Colors.accent30
                    border.width: 1
                    anchors.verticalCenter: parent.verticalCenter
                    Text {
                        anchors.centerIn: parent
                        text: Auth.displayName.length ? Auth.displayName.charAt(0).toUpperCase() : "?"
                        color: Colors.accentHover
                        font.pixelSize: 10
                        font.bold: true
                    }
                }

                Text {
                    text: "\u25BE" // chevron-down
                    color: accountMenu.visible ? Colors.accent : Colors.textMuted
                    font.pixelSize: 9
                    anchors.verticalCenter: parent.verticalCenter
                }
            }

            MouseArea {
                id: accountMa
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                hoverEnabled: true
                onClicked: {
                    if (accountMenu.visible)
                        accountMenu.close()
                    else
                        accountMenu.open()
                }
            }

            Tooltip {
                anchors.top: parent.bottom
                anchors.topMargin: 6
                anchors.horizontalCenter: parent.horizontalCenter
                text: qsTr("Account menu")
                shown: accountMa.containsMouse && !accountMenu.visible
            }
        }
    }

    // ── Account menu popover (Electron: w-64 panel-popover + balance block) ──
    Popup {
        id: accountMenu
        x: root.width - width - 12
        y: parent.height + 4
        width: 320
        height: menuCol.implicitHeight + 24
        padding: 0
        closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside
        background: Rectangle {
            color: Colors.surfaceOverlay
            border.color: Colors.surfaceBorder
            border.width: 1
            radius: Theme.radiusMd
            // panel-popover shadow: 0 1px 4px / 0 12px 24px -8px
            Rectangle { anchors.fill: parent; anchors.margins: -1; radius: parent.radius + 1; color: "#0000004d"; z: -1 }
            Rectangle { anchors.fill: parent; anchors.margins: -8; anchors.topMargin: -4; radius: parent.radius + 8; color: "#00000073"; z: -1 }
            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                height: 1
                color: Colors.insetHighlightSoft
            }
        }

        enter: Transition {
            NumberAnimation { property: "opacity"; from: 0; to: 1; duration: Theme.motionPopover; easing.type: Easing.OutCubic }
            NumberAnimation { property: "y"; from: root.height - 4; to: root.height + 4; duration: Theme.motionPopover; easing.type: Easing.OutCubic }
        }
        exit: Transition {
            NumberAnimation { property: "opacity"; to: 0; duration: 120; easing.type: Easing.InQuad }
        }

        ColumnLayout {
            id: menuCol
            anchors.fill: parent
            anchors.margins: 12
            spacing: 0

            // Header: avatar + name/email
            RowLayout {
                Layout.bottomMargin: 10
                spacing: 10
                Rectangle {
                    width: 36; height: 36; radius: 18
                    color: Colors.accent20
                    border.color: Colors.accent30
                    border.width: 1
                    Text {
                        anchors.centerIn: parent
                        text: Auth.displayName.length ? Auth.displayName.charAt(0).toUpperCase() : "?"
                        color: Colors.accentHover
                        font.pixelSize: 13
                        font.bold: true
                    }
                }
                ColumnLayout {
                    spacing: 1
                    Text {
                        text: Auth.displayName || Auth.email
                        color: Colors.textPrimary
                        font.pixelSize: 12
                        font.weight: Font.DemiBold
                        elide: Text.ElideRight
                        Layout.fillWidth: true
                    }
                    Text {
                        visible: (Auth.displayName || "").length > 0
                        text: Auth.email
                        color: Colors.textMuted
                        font.pixelSize: 10
                        elide: Text.ElideMiddle
                        Layout.fillWidth: true
                    }
                }
            }

            // Balance block (Electron: mono 13px bold, colored by health)
            Rectangle {
                visible: Auth.isAuthenticated
                Layout.fillWidth: true
                Layout.bottomMargin: 10
                height: 52
                radius: Theme.radiusSm
                color: Colors.surfaceBase
                border.color: Colors.surfaceBorderSubtle
                border.width: 1

                Column {
                    anchors.centerIn: parent
                    spacing: 2
                    Text {
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: qsTr("BALANCE")
                        color: Colors.textMuted
                        font.family: Theme.fontMono.family
                        font.pixelSize: 8
                        font.letterSpacing: 1.2
                    }
                    Text {
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: (Auth.creditBalance + Auth.bonusBalance).toFixed(0) + " cr"
                        color: (Auth.creditBalance + Auth.bonusBalance) <= 0 ? Colors.statusError
                             : (Auth.creditBalance + Auth.bonusBalance) < 600 ? Colors.statusWarning
                             : Colors.textPrimary
                        font.family: Theme.fontMono.family
                        font.pixelSize: 13
                        font.weight: Font.Bold
                    }
                }
            }

            // Actions
            Repeater {
                model: [
                    { label: qsTr("Settings"), action: "settings" },
                    { label: qsTr("Buy credits"), action: "buy" },
                    { label: qsTr("What's new"), action: "whatsnew" },
                    { label: qsTr("Sign out"), action: "signout" }
                ]
                delegate: Rectangle {
                    required property var modelData
                    Layout.fillWidth: true
                    height: 32
                    radius: Theme.radiusSm
                    color: itemMa.containsMouse ? Colors.accent10 : Colors.transparent

                    Text {
                        anchors.left: parent.left
                        anchors.leftMargin: 10
                        anchors.verticalCenter: parent.verticalCenter
                        text: modelData.label
                        color: modelData.action === "signout" && itemMa.containsMouse
                               ? Colors.statusError : Colors.textSecondary
                        font.pixelSize: 12
                    }

                    MouseArea {
                        id: itemMa
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            accountMenu.close()
                            switch (modelData.action) {
                            case "settings": root.openSettings(); break
                            case "buy": root.openBuyCredits(); break
                            case "whatsnew": root.openWhatsNew(); break
                            case "signout":
                                Backend.clearAuthSession()
                                Auth.signOut()
                                break
                            }
                        }
                    }
                }
            }
        }
    }
}
