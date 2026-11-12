import LiveMorph
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

/**
 * TopBar (Electron ground truth):
 *   h-11 px-4 gap-2 · tier badge exact hex · Swap-Active accent10/20 pill
 *   REC pill bg-black/70 border-error/40 backdrop-blur, text-white/95
 *   credits badge bg-surface-base/70 translucent, error≤0 / warning<600
 *   bell 28×28 rounded-md bordered translucent, hover accent/4
 *   unread badge bg-accent "9+" ring-2 ring-surface-base
 *   avatar: 28px rounded-md pill w/ 22px avatar + chevron, amber when broke
 *   account menu: w-64 (320px) panel-popover w/ balance block
 */
Rectangle {
    id: root

    property int notifUnread: Notifier.unseenCount
    property bool notifOpen: false
    property bool narrow: false

    // Tour anchor export + open hook (Electron topup step opens the menu)
    property var tourAccount: accountBtn
    function openAccountMenuForTour() {
        accountMenu.visible ? accountMenu.close() : accountMenu.open()
    }
    function closeAccountMenu() {
        if (accountMenu.visible)
            accountMenu.close()
    }
    property alias accountMenuOpen: accountMenu.visible

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
        anchors.rightMargin: 16
        spacing: 8

        StatusPill {
            visible: !root.narrow
            text: Session.statusText
            status: Session.connectionStatus
        }

        // (Electron shows the tier badge only in the account menu — removed here)

        // Swap-Active / REC / credits pills moved INTO the stage HUD (StageFrame)

        Item {
            Layout.fillWidth: true
        }

        // ── Notifications bell (28×28 bordered translucent rest-state) ──
        Rectangle {
            width: 28
            height: 28
            radius: Theme.radiusMd
            activeFocusOnTab: true
            Accessible.role: Accessible.Button
            Accessible.name: qsTr("Notifications")
            Keys.onReturnPressed: root.openNotifications()
            Keys.onSpacePressed: root.openNotifications()
            color: root.notifOpen ? Colors.accent12
                 : (notifMa.containsMouse ? Colors.accent06 : Colors.overlay30)
            border.color: (root.notifOpen || notifMa.containsMouse) ? Colors.accent30
                        : Colors.surfaceBorderSubtle
            border.width: 1

            Icon {
                anchors.centerIn: parent
                name: "bell"
                size: Theme.iconSm
                color: root.notifOpen ? Colors.accentHover
                     : (notifMa.containsMouse ? Colors.textSecondary : Colors.textMuted)
            }

            MouseArea {
                id: notifMa
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: root.openNotifications()
            }

            // Unread badge: bg-accent, "9+", ring-2 ring-surface-base
            Rectangle {
                visible: root.notifUnread > 0
                anchors.top: parent.top
                anchors.right: parent.right
                anchors.topMargin: -6
                anchors.rightMargin: -6
                // Width from the TEXT's implicitWidth — a plain wrapper
                // Rectangle never syncs explicit width into implicitWidth,
                // so the badge collapsed to an 8px sliver.
                width: notifCount.implicitWidth + 10
                height: 16
                radius: Theme.radiusFull
                color: Colors.accent
                border.color: Colors.surfaceBase
                border.width: 2
                Text {
                    id: notifCount
                    anchors.centerIn: parent
                    text: root.notifUnread > 9 ? "9+" : root.notifUnread
                    color: Colors.textOnAccent
                    font.pixelSize: 9
                    font.weight: Font.Bold
                }
            }

            Tooltip {
                anchors.top: parent.bottom
                anchors.topMargin: 6
                anchors.horizontalCenter: parent.horizontalCenter
                text: qsTr("Notifications")
                shown: notifMa.containsMouse
            }
        }

        // ── Account trigger (28px pill: gradient avatar + chevron) ──
        Rectangle {
            id: accountBtn

            activeFocusOnTab: true
            Accessible.role: Accessible.Button
            Accessible.name: qsTr("Account")
            Keys.onReturnPressed: root.openAccountMenuForTour()
            Keys.onSpacePressed: root.openAccountMenuForTour()

            Tooltip {
                anchors.top: parent.bottom
                anchors.topMargin: 6
                anchors.horizontalCenter: parent.horizontalCenter
                text: qsTr("Account")
                shown: accountMa.containsMouse && !accountMenu.visible
            }

            width: root.narrow ? 28 : 48
            height: 28
            radius: Theme.radiusMd
            readonly property bool lowCredits: Auth.isAuthenticated && Auth.creditBalance <= 0
            color: accountMenu.visible ? Colors.accent12
                : accountMa.containsMouse ? (accountBtn.lowCredits ? Colors.statusWarning06 : Colors.accent06)
                : (accountBtn.lowCredits ? Colors.statusWarning06 : Colors.overlay30)
            border.color: accountMenu.visible ? Colors.accent30
                : accountBtn.lowCredits ? Colors.statusWarning30
                : accountMa.containsMouse ? Colors.accent30
                : Colors.surfaceBorderSubtle
            border.width: 1

            Row {
                anchors.centerIn: parent
                spacing: 4 // gap-1

                // Solid white hexagon avatar with black initials (hex sized to
                // the wrapper so it never overhangs the 22x22 box)
                Item {
                    width: 22
                    height: 22
                    anchors.verticalCenter: parent.verticalCenter
                    Hexagon {
                        anchors.centerIn: parent
                        size: 22
                        lineWidth: 1
                        lineColor: accountMenu.visible ? Colors.accent60 : Colors.accent30
                        fillColor: Colors.accent
                    }
                    Text {
                        anchors.centerIn: parent
                        // Code-point iteration: charAt(0) splits astral-plane
                        // emoji names into a lone surrogate (tofu glyph).
                        text: {
                            const parts = Auth.displayName.trim().split(/\s+/).filter(Boolean)
                            if (!parts.length) return "?"
                            const first = [...parts[0]][0]
                            if (parts.length === 1) return first.toUpperCase()
                            const last = [...parts[parts.length - 1]][0]
                            return (first + last).toUpperCase()
                        }
                        color: Colors.textOnAccent
                        font.pixelSize: 10
                        font.weight: Font.Bold
                    }
                }

                Icon {
                    visible: !root.narrow
                    name: "chevron-down"
                    size: 12
                    color: accountMenu.visible ? Colors.accentHover
                         : (accountMa.containsMouse ? Colors.textSecondary
                            : Colors.textMuted40)
                    rotation: accountMenu.visible ? 180 : 0
                    anchors.verticalCenter: parent.verticalCenter
                }
            }

            // Plain toggle — outside-press closing is handled race-free by the
            // Dashboard-level catcher (popups use CloseOnEscape only).
            MouseArea {
                id: accountMa
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                hoverEnabled: true
                onClicked: accountMenu.visible ? accountMenu.close() : accountMenu.open()
            }

        }
    }

    // ── Account menu popover (Nocturne redesign: identity header + tier pill,
    //    clickable balance card, icon-disc action rows, sign out) ──
    Popup {
        id: accountMenu
        x: root.width - width - 16 // flush with trigger right edge
        y: root.height + 8
        width: 280
        height: menuCol.implicitHeight
        padding: 0
        closePolicy: Popup.CloseOnEscape
        background: Rectangle {
            color: Colors.surfaceOverlay
            border.color: Colors.surfaceBorder
            border.width: 1
            radius: Theme.radiusLg
            clip: true
            // Faint honeycomb wash on the popover (signature texture)
            Honeycomb {
                anchors.fill: parent
                cellSize: Theme.honeycombCell
                lineColor: Colors.honeycombLineFaint
                opacity: 0.45
            }
            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                height: 1
                color: Colors.insetHighlightSoft
            }
            CornerTicks {
                anchors.fill: parent
                inset: 5
                tickSize: 7
                thickness: 1
                color: Colors.accent30
            }
        }

        ColumnLayout {
            id: menuCol
            anchors.fill: parent
            spacing: 0

            // ── Identity header ──
            RowLayout {
                Layout.fillWidth: true
                Layout.leftMargin: 14
                Layout.rightMargin: 14
                Layout.topMargin: 14
                Layout.bottomMargin: 12
                spacing: 10

                Item {
                    width: 40
                    height: 40
                    Hexagon {
                        anchors.centerIn: parent
                        size: 40
                        lineWidth: 1.5
                        lineColor: Colors.accent40
                        fillColor: Colors.accent
                    }
                    Text {
                        anchors.centerIn: parent
                        text: {
                            const parts = Auth.displayName.trim().split(/\s+/).filter(Boolean)
                            if (!parts.length) return "?"
                            if (parts.length === 1) return [...parts[0]][0].toUpperCase()
                            return ([...parts[0]][0] + [...parts[parts.length - 1]][0]).toUpperCase()
                        }
                        color: Colors.textOnAccent
                        font.pixelSize: 13
                        font.weight: Font.Bold
                    }
                }

                ColumnLayout {
                    Layout.fillWidth: true
                    spacing: 1
                    Text {
                        text: Auth.displayName || Auth.email
                        color: Colors.textPrimary
                        font.pixelSize: 13
                        font.weight: Font.Bold
                        elide: Text.ElideRight
                        Layout.fillWidth: true
                    }
                    Text {
                        visible: (Auth.displayName || "").length > 0
                        text: Auth.email
                        color: Colors.textMuted
                        font.pixelSize: 11
                        elide: Text.ElideRight
                        Layout.fillWidth: true
                    }
                }

                // Tier pill
                Rectangle {
                    Layout.alignment: Qt.AlignTop
                    Layout.topMargin: 2
                    implicitWidth: tierPillLbl.implicitWidth + 12
                    implicitHeight: 20
                    radius: Theme.radiusFull
                    // Electron te(): pro=amber / starter=emerald / mid=blue / basic=teal
                    color: Auth.tier === "pro" ? Colors.tierProBg
                         : Auth.tier === "starter" ? Colors.tierStarterBg
                         : Auth.tier === "mid" ? Colors.tierMidBg
                         : Auth.tier === "basic" ? Colors.tierBasicBg
                         : Colors.surfaceElevated
                    border.color: Auth.tier === "pro" ? Colors.tierProBorder
                                : Auth.tier === "starter" ? Colors.tierStarterBorder
                                : Auth.tier === "mid" ? Colors.tierMidBorder
                                : Auth.tier === "basic" ? Colors.tierBasicBorder
                                : Colors.surfaceBorder
                    border.width: 1
                    Text {
                        id: tierPillLbl
                        anchors.centerIn: parent
                        text: (Auth.tier || "free").toUpperCase()
                        color: Auth.tier === "pro" ? Colors.tierProText
                             : Auth.tier === "starter" ? Colors.tierStarterText
                             : Auth.tier === "mid" ? Colors.tierMidText
                             : Auth.tier === "basic" ? Colors.tierBasicText
                             : Colors.textMuted
                        font.family: Theme.fontMono.family
                        font.pixelSize: 9
                        font.weight: Font.Bold
                        font.letterSpacing: 1.0
                    }
                }
            }

            // Skeleton while the profile loads (static — animations are banned)
            ColumnLayout {
                visible: Auth.isAuthenticated && Auth.isLoading
                Layout.leftMargin: 14
                Layout.rightMargin: 14
                Layout.bottomMargin: 8
                spacing: 6
                Rectangle { Layout.preferredWidth: 48; Layout.preferredHeight: 14; radius: Theme.radiusXs; color: Colors.surfaceElevated }
                Rectangle { Layout.preferredWidth: 32; Layout.preferredHeight: 10; radius: Theme.radiusXs; color: Colors.surfaceElevated }
            }

            Rectangle { Layout.fillWidth: true; height: 1; color: Colors.surfaceBorderSubtle }

            // ── Balance card (click → top up credits) ──
            Rectangle {
                visible: Auth.isAuthenticated
                Layout.fillWidth: true
                Layout.leftMargin: 10
                Layout.rightMargin: 10
                Layout.topMargin: 10
                Layout.bottomMargin: 6
                implicitHeight: balCol.implicitHeight + 20
                radius: Theme.radiusMd
                color: balMa.containsMouse ? Colors.surfaceHover : Colors.surfaceElevated
                border.width: 1
                border.color: balMa.containsMouse ? Colors.surfaceBorder : Colors.surfaceBorderSubtle

                ColumnLayout {
                    id: balCol
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    anchors.leftMargin: 12
                    anchors.rightMargin: 12
                    anchors.topMargin: 10
                    spacing: 6

                    // Credits row: eyebrow label left, big mono value right
                    RowLayout {
                        Layout.fillWidth: true
                        Text {
                            text: qsTr("CREDITS")
                            color: Colors.textMuted
                            font.family: Theme.fontMono.family
                            font.pixelSize: 9
                            font.letterSpacing: 1.5
                        }
                        Item { Layout.fillWidth: true }
                        Text {
                            text: Auth.creditBalance.toLocaleString(Qt.locale(I18n.uiLocaleName()), 'f', 0)
                            color: Auth.creditBalance <= 0 ? Colors.statusError
                                 : Auth.creditBalance < Constants.lowCreditThreshold ? Colors.statusWarning
                                 : Colors.textPrimary
                            font.family: Theme.fontMono.family
                            font.pixelSize: 16
                            font.weight: Font.Bold
                        }
                    }

                    // Free-credits row (spent before paid credits)
                    RowLayout {
                        visible: Auth.bonusBalance > 0
                        Layout.fillWidth: true
                        spacing: 6
                        Text {
                            text: qsTr("FREE")
                            color: Colors.textMuted
                            font.family: Theme.fontMono.family
                            font.pixelSize: 9
                            font.letterSpacing: 1.5
                        }
                        Rectangle {
                            radius: Theme.radiusFull
                            color: Colors.statusSuccess10
                            border.color: Colors.statusSuccess30
                            border.width: 1
                            implicitWidth: bonusLbl.implicitWidth + 10
                            implicitHeight: 16
                            Text {
                                id: bonusLbl
                                anchors.centerIn: parent
                                text: "+" + Auth.bonusBalance.toLocaleString(Qt.locale(I18n.uiLocaleName()), 'f', 0)
                                color: Colors.statusSuccess
                                font.family: Theme.fontMono.family
                                font.pixelSize: 9
                                font.weight: Font.Bold
                            }
                        }
                        Text {
                            text: qsTr("used before paid credits")
                            color: Colors.textMuted
                            font.pixelSize: 9
                            Layout.fillWidth: true
                            elide: Text.ElideRight
                        }
                    }

                    // Low-balance nudge
                    Text {
                        visible: Auth.creditBalance <= 0
                        text: qsTr("You're out of credits — top up to keep morphing.")
                        color: Colors.statusWarning
                        font.pixelSize: 10
                        wrapMode: Text.WordWrap
                        Layout.fillWidth: true
                    }
                }

                MouseArea {
                    id: balMa
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: {
                        accountMenu.close()
                        root.openBuyCredits()
                    }
                }
            }

            // ── Actions ── (explicit height: ColumnLayout+Repeater implicit is 0)
            ColumnLayout {
                Layout.fillWidth: true
                Layout.leftMargin: 8
                Layout.rightMargin: 8
                Layout.topMargin: 2
                Layout.bottomMargin: 4
                Layout.preferredHeight: actionsRep.count * 36 + Math.max(0, actionsRep.count - 1) * 2
                spacing: 2

                Repeater {
                    id: actionsRep
                    model: [
                        { label: qsTr("Top up credits"), action: "buy", icon: "credit-card", external: false, accent: true },
                        { label: qsTr("Account & usage"), action: "account", icon: "gauge", external: false },
                        { label: qsTr("What's new"), action: "whatsnew", icon: "sparkles", external: false },
                        { label: qsTr("Help"), action: "help", icon: "help-circle", external: false },
                        { label: qsTr("Settings"), action: "settings", icon: "settings", external: false },
                        { label: qsTr("Join our Discord"), action: "discord", icon: "messages-square", external: true }
                    ]
                    delegate: Rectangle {
                        required property var modelData
                        Layout.fillWidth: true
                        height: 36
                        radius: Theme.radiusSm
                        readonly property bool broke: modelData.action === "buy" && Auth.creditBalance <= 0
                        color: itemMa.containsMouse
                               ? (modelData.accent
                                  ? (broke ? Colors.statusWarning10 : Colors.accent10)
                                  : Colors.overlay50)
                               : Colors.transparent

                        RowLayout {
                            anchors.fill: parent
                            anchors.leftMargin: 8
                            anchors.rightMargin: 10
                            spacing: 10

                            // Hex icon badge
                            HexBadge {
                                size: 26
                                iconName: modelData.icon
                                iconSize: 13
                                lineWidth: 1
                                lineColor: itemMa.containsMouse
                                           ? (modelData.accent
                                              ? (broke ? Colors.statusWarning40 : Colors.accent30)
                                              : Colors.surfaceBorder)
                                           : Colors.surfaceBorderSubtle
                                fillColor: itemMa.containsMouse
                                           ? (modelData.accent
                                              ? (broke ? Colors.statusWarning20 : Colors.accent12)
                                              : Colors.overlay60)
                                           : Colors.surfaceElevated
                                iconColor: modelData.accent
                                         ? (broke ? Colors.statusWarning : Colors.accentHover)
                                         : (itemMa.containsMouse ? Colors.textSecondary : Colors.textMuted)
                            }

                            Text {
                                Layout.fillWidth: true
                                text: modelData.label
                                color: modelData.accent
                                     ? (broke ? Colors.statusWarning : Colors.accentHover)
                                     : (itemMa.containsMouse ? Colors.textPrimary : Colors.textSecondary)
                                font.pixelSize: 12
                                font.weight: modelData.accent ? Font.Bold : Font.Normal
                                elide: Text.ElideRight
                            }
                            Icon {
                                visible: modelData.external
                                name: "external-link"
                                size: 12
                                color: Colors.textMuted40
                            }
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
                                case "account": App.openAccountUsage(); break
                                case "discord": Backend.openExternal(Constants.urlDiscord); break
                                case "help": root.openHelp(); break
                                case "whatsnew": root.openWhatsNew(); break
                                }
                            }
                        }
                    }
                }
            }

            // ── Divider + sign out ──
            Rectangle { Layout.fillWidth: true; height: 1; color: Colors.surfaceBorderSubtle }
            ColumnLayout {
                Layout.fillWidth: true
                Layout.leftMargin: 8
                Layout.rightMargin: 8
                Layout.topMargin: 4
                Layout.bottomMargin: 6
                spacing: 2

                Rectangle {
                    Layout.fillWidth: true
                    height: 36
                    radius: Theme.radiusSm
                    color: signoutMa.containsMouse ? Colors.statusError10 : Colors.transparent

                    RowLayout {
                        anchors.fill: parent
                        anchors.leftMargin: 8
                        anchors.rightMargin: 10
                        spacing: 10

                        HexBadge {
                            size: 26
                            iconName: "log-out"
                            iconSize: 13
                            lineWidth: 1
                            lineColor: signoutMa.containsMouse ? Colors.statusError40 : Colors.surfaceBorderSubtle
                            fillColor: signoutMa.containsMouse ? Colors.statusError20 : Colors.surfaceElevated
                            iconColor: signoutMa.containsMouse ? Colors.statusError
                                     : Qt.rgba(Colors.statusError.r, Colors.statusError.g, Colors.statusError.b, 0.7)
                        }
                        Text {
                            Layout.fillWidth: true
                            text: qsTr("Sign out")
                            color: signoutMa.containsMouse ? Colors.statusError
                                 : Qt.rgba(Colors.statusError.r, Colors.statusError.g, Colors.statusError.b, 0.7)
                            font.pixelSize: 12
                        }
                    }

                    MouseArea {
                        id: signoutMa
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            accountMenu.close()
                            // Destructive (stops session + camera) — confirm first.
                            signOutConfirm.open()
                        }
                    }
                }
            }
        }
    }

    ConfirmDialog {
        id: signOutConfirm
        title: qsTr("Sign out?")
        message: qsTr("This stops any running swap and turns the camera off.")
        confirmText: qsTr("Sign out")
        destructive: true
        onAccepted: Auth.signOut()
    }
}
