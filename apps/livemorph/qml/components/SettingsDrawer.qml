import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import QtQuick.Dialogs
import LiveMorph

/**
 * SettingsDrawer — Electron structure (Settings-CtJipCay reference):
 *   Nav: STUDIO (General/Camera/Stream/Recording) · ACCOUNT (Account) ·
 *        About pinned to the bottom
 *   Billing merged INTO Account (no separate Billing tab).
 *   Every row: title + description. Electron copy.
 *   Qt extras (kept improvements) tucked into About ▸ Developer.
 */
Item {
    id: root

    property bool open: false
    property string activeTab: "general"
    property string copiedFlash: ""

    anchors.fill: parent
    visible: open
    z: Theme.zDrawer



    function pickTab(t) {
        activeTab = t
        contentFlick.contentY = 0 // always land at the top of the new tab
        enginePopup.close()
        langPopup.close()
        devPopup.close()
        refreshFirstSwapDone() // the first swap may have completed while closed
    }

    // Config.value() has no NOTIFY — cache and refresh on open / on demand
    property bool firstSwapDone: false
    function firstSwapDoneCheck() {
        return root.firstSwapDone
    }
    function refreshFirstSwapDone() {
        var v = Config.value("session/firstSwapDone", false)
        firstSwapDone = (v === true || v === "true")
    }
    onOpenChanged: if (open) refreshFirstSwapDone()
    Component.onCompleted: refreshFirstSwapDone()

    // ── Scrim ──────────────────────────────────────────────────────────
    Rectangle {
        anchors.fill: parent
        color: Colors.overlayScrim // bg-black/60
        opacity: root.open ? 1 : 0
        MouseArea { anchors.fill: parent; onClicked: root.open = false }
    }

    // Dropdown catcher: popups use CloseOnEscape only, so an outside press is
    // consumed here (race-free). Popup option clicks live in the window overlay
    // above this layer and are unaffected.
    MouseArea {
        anchors.fill: parent
        z: Theme.zCatcher
        visible: root.open && (enginePopup.visible || langPopup.visible || devPopup.visible)
        onPressed: {
            enginePopup.close()
            langPopup.close()
            devPopup.close()
        }
    }

    // ── Drawer panel ──────────────────────────────────────────────────
    Rectangle {
        id: drawer
        width: Math.min(Theme.settingsDrawerWidth, root.width * 0.94)
        height: parent.height
        // Binding-driven: tracks window width even while open (resize-safe)
        x: open ? root.width - width : root.width
        y: 0
        color: Colors.surfaceOverlay // panel-drawer

        Honeycomb {
            anchors.fill: parent
            cellSize: Theme.honeycombCell
            lineColor: Colors.honeycombLineFaint
            opacity: 0.35
        }

        // Panel hairline — solid white rule with hex ticks
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 1
            z: Theme.zLocal1
            color: Colors.white35
        }
        Hexagon {
            size: 8
            lineWidth: 1.5
            lineColor: Colors.accent
            anchors.left: parent.left
            anchors.leftMargin: 12
            anchors.top: parent.top
            anchors.topMargin: -3
            z: Theme.zLocal1
        }
        Hexagon {
            size: 8
            lineWidth: 1.5
            lineColor: Colors.accent
            anchors.right: parent.right
            anchors.rightMargin: 12
            anchors.top: parent.top
            anchors.topMargin: -3
            z: Theme.zLocal1
        }

        // Left edge border
        Rectangle { anchors.left: parent.left; anchors.top: parent.top; anchors.bottom: parent.bottom; width: 1; color: Colors.surfaceBorder }

        // Hex-tech corner frame (signature motif on drawer panels)
        CornerTicks {
            anchors.fill: parent
            inset: 6
            tickSize: 8
            thickness: 1
            color: Colors.accent30
            z: Theme.zLocal1
        }

        // Deterministic anchors scaffold (a ColumnLayout here produced a
        // 140px-wide body — Layout.fillWidth ignored — leaving the content
        // Flickable 0×0 and every settings tab blank).
        Item {
            anchors.fill: parent

            // Header
            Rectangle {
                anchors.top: parent.top
                anchors.left: parent.left
                anchors.right: parent.right
                height: Theme.drawerHeaderHeight
                color: Colors.surfaceRaised
                Rectangle { anchors.left: parent.left; anchors.right: parent.right; anchors.bottom: parent.bottom; height: 1; color: Colors.surfaceBorder }
                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 20
                    anchors.rightMargin: 8
                    spacing: 10
                    HexBadge {
                        size: 30
                        iconName: "settings"
                        iconSize: 15
                        lineWidth: 1
                        lineColor: Colors.accent30
                        fillColor: Colors.accent12
                        iconColor: Colors.accentHover
                    }
                    Text {
                        text: qsTr("Settings")
                        color: Colors.textPrimary
                        font.pixelSize: 16
                        font.weight: Font.Bold
                        Layout.fillWidth: true
                    }
                    IconButton {
                        name: "help-circle"
                        iconSize: 15
                        width: 30; height: 30
                        radius: Theme.radiusXs
                        hoverColor: Colors.overlay50
                        onClicked: {
                            root.open = false
                            App.openHelp()
                        }
                        Tooltip {
                            anchors.top: parent.bottom
                            anchors.topMargin: 6
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: qsTr("Help")
                            shown: parent.hovered
                        }
                    }
                    IconButton {
                        name: "x"
                        accessibleName: qsTr("Close")
                        iconSize: 14
                        emphasis: true
                        width: 30; height: 30
                        radius: Theme.radiusXs
                        hoverColor: Colors.overlay50
                        onClicked: root.open = false
                    }
                }
            }

            // Body: nav + content (anchored, not layouted)
            Item {
                anchors.top: parent.top
                anchors.topMargin: Theme.drawerHeaderHeight
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.bottom: parent.bottom

                // ── Nav column ────────────────────────────────────────
                Rectangle {
                    id: navCol
                    anchors.left: parent.left
                    anchors.top: parent.top
                    anchors.bottom: parent.bottom
                    width: 168
                    color: Colors.base40 // bg-surface-base/40
                    Rectangle { anchors.right: parent.right; anchors.top: parent.top; anchors.bottom: parent.bottom; width: 1; color: Colors.surfaceBorderSubtle }

                    ColumnLayout {
                        anchors.fill: parent
                        anchors.leftMargin: 8
                        anchors.rightMargin: 8
                        anchors.topMargin: 12
                        anchors.bottomMargin: 12
                        spacing: 14

                                                SectionHeader {
                            text: qsTr("STUDIO");
                            Layout.fillWidth: true;
                            Layout.leftMargin: 10
                            Layout.bottomMargin: 2
                        }

                        ColumnLayout {
                            spacing: 2 // gap-0.5 within group (Electron)
                        Repeater {
                            model: [
                                { id: "general",   label: qsTr("General"),   icon: "settings" },
                                { id: "camera",    label: qsTr("Camera"),    icon: "video" },
                                { id: "stream",    label: qsTr("Stream"),    icon: "radio" },
                                { id: "recording", label: qsTr("Recording"), icon: "circle-dot" }
                            ]
                            delegate: Rectangle {
                                required property var modelData
                                readonly property bool active: root.activeTab === modelData.id
                                activeFocusOnTab: true
                                Accessible.role: Accessible.Button
                                Accessible.name: modelData.label
                                Keys.onReturnPressed: root.pickTab(modelData.id)
                                Keys.onSpacePressed: root.pickTab(modelData.id)
                                Layout.fillWidth: true
                                height: 34
                                radius: Theme.radiusMd
                                color: active ? Colors.surfaceOverlay
                                     : navMa.containsMouse ? Colors.overlay30
                                     : Colors.transparent
                                border.width: active ? 1 : 0
                                border.color: Colors.accent30

                                // Active accent bar
                                Rectangle {
                                    visible: active
                                    anchors.left: parent.left
                                    anchors.top: parent.top
                                    anchors.bottom: parent.bottom
                                    anchors.margins: 4
                                    width: 2
                                    radius: Theme.radiusHairline
                                    color: Colors.accent
                                }

                                RowLayout {
                                    anchors.fill: parent
                                    anchors.leftMargin: 12
                                    spacing: 10
                                    Icon {
                                        name: modelData.icon
                                        size: 15
                                        color: active ? Colors.accentHover
                                             : Colors.textMuted60
                                    }
                                    Text {
                                        text: modelData.label
                                        color: active ? Colors.textPrimary : Colors.textSecondary
                                        font.pixelSize: 12
                                        font.weight: active ? Font.Bold : Font.Normal
                                        Layout.fillWidth: true
                                        elide: Text.ElideRight
                                    }
                                }

                                MouseArea {
                                    id: navMa
                                    anchors.fill: parent
                                    hoverEnabled: true
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: root.pickTab(modelData.id)
                                }
                            }
                        }

                        ColumnLayout {
                            spacing: 2
                                                SectionHeader {
                            text: qsTr("ACCOUNT");
                            Layout.fillWidth: true;
                            Layout.leftMargin: 10
                            Layout.bottomMargin: 2
                        }

                        Rectangle {
                            readonly property bool active: root.activeTab === "account"
                            activeFocusOnTab: true
                            Accessible.role: Accessible.Button
                            Accessible.name: qsTr("Account")
                            Keys.onReturnPressed: root.pickTab("account")
                            Keys.onSpacePressed: root.pickTab("account")
                            Layout.fillWidth: true
                            height: 34
                            radius: Theme.radiusMd
                            color: active ? Colors.surfaceOverlay : (acctMa.containsMouse ? Colors.overlay30 : Colors.transparent)
                            border.width: active ? 1 : 0
                            border.color: Colors.accent30
                            Rectangle {
                                visible: active
                                anchors.left: parent.left
                                anchors.top: parent.top
                                anchors.bottom: parent.bottom
                                anchors.margins: 4
                                width: 2; radius: Theme.radiusHairline
                                color: Colors.accent
                            }
                            RowLayout {
                                anchors.fill: parent
                                anchors.leftMargin: 12
                                spacing: 10
                                Icon { name: "credit-card"; size: 15; color: active ? Colors.accentHover : Colors.textMuted }
                                Text {
                                    text: qsTr("Account")
                                    color: active ? Colors.textPrimary : Colors.textSecondary
                                    font.pixelSize: 12
                                    font.weight: active ? Font.Bold : Font.Normal
                                    Layout.fillWidth: true
                                    elide: Text.ElideRight
                                }
                            }
                            MouseArea {
                                id: acctMa
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor
                                onClicked: root.pickTab("account")
                            }
                        }

                        }

                        Item { Layout.fillHeight: true }

                        // About pinned to bottom (Electron: mt-auto pt-3 border-t)
                        Rectangle {
                            readonly property bool active: root.activeTab === "about"
                            activeFocusOnTab: true
                            Accessible.role: Accessible.Button
                            Accessible.name: qsTr("About")
                            Keys.onReturnPressed: root.pickTab("about")
                            Keys.onSpacePressed: root.pickTab("about")
                            Layout.fillWidth: true
                            Layout.topMargin: 12
                            height: 34
                            radius: Theme.radiusMd
                            color: active ? Colors.surfaceOverlay : (aboutMa.containsMouse ? Colors.overlay30 : Colors.transparent)
                            border.width: active ? 1 : 0
                            border.color: Colors.accent30
                            Rectangle {
                                visible: active
                                anchors.left: parent.left
                                anchors.top: parent.top
                                anchors.bottom: parent.bottom
                                anchors.margins: 4
                                width: 2; radius: Theme.radiusHairline
                                color: Colors.accent
                            }
                            RowLayout {
                                anchors.fill: parent
                                anchors.leftMargin: 12
                                spacing: 10
                                Icon { name: "info"; size: 15; color: active ? Colors.accentHover : Colors.textMuted }
                                Text {
                                    text: qsTr("About")
                                    color: active ? Colors.textPrimary : Colors.textSecondary
                                    font.pixelSize: 12
                                    font.weight: active ? Font.Bold : Font.Normal
                                    Layout.fillWidth: true
                                    elide: Text.ElideRight
                                }
                            }
                            MouseArea {
                                id: aboutMa
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor
                                onClicked: root.pickTab("about")
                            }
                        }
                    }
                }
                }

                // ── Content ───────────────────────────────────────────
                Flickable {
                    id: contentFlick
                    anchors.left: navCol.right
                    anchors.top: parent.top
                    anchors.right: parent.right
                    anchors.bottom: parent.bottom
                    contentHeight: contentCard.height + 24
                    clip: true
                    boundsBehavior: Flickable.StopAtBounds
                    ScrollBar.vertical: StyledScrollBar { thin: true }
                    onMovingChanged: if (moving) { enginePopup.close(); langPopup.close(); devPopup.close() }

                    // Unified content card behind whichever tab is active
                    Item {
                        id: contentCard
                        width: parent.width - 32
                        x: 16
                        height: contentCol.implicitHeight + 40

                        Rectangle {
                            anchors.fill: parent
                            radius: Theme.radiusLg
                            clip: true
                            color: Colors.surfaceRaised
                            border.color: Colors.surfaceBorderSubtle
                            border.width: 1
                            Rectangle {
                                anchors.left: parent.left
                                anchors.right: parent.right
                                anchors.top: parent.top
                                height: 1
                                color: Colors.insetHighlightSoft
                            }
                        }

                        ColumnLayout {
                        id: contentCol
                        anchors.fill: parent
                        anchors.margins: 20
                        spacing: 0

                        // ════════════════════════ GENERAL ═══════════════════════
                        ColumnLayout {
                            visible: root.activeTab === "general"
                            Layout.fillWidth: true
                            spacing: 0

                            // SWAP ENGINE
                                                        SectionHeader {
                                text: qsTr("SWAP ENGINE");
                                Layout.fillWidth: true;
                                Layout.bottomMargin: 10
                            }
                            Rectangle {
                                id: engineBox
                                Layout.fillWidth: true
                                height: 46
                                radius: Theme.radiusMd
                                color: enginePopup.visible ? Colors.surfaceFocus
                                     : engSelMa.containsMouse ? Colors.surfaceRaised
                                     : Colors.surfaceBase
                                border.color: enginePopup.visible ? Colors.accent40
                                             : engSelMa.containsMouse ? Colors.surfaceBorderStrong
                                             : Colors.surfaceBorder
                                border.width: 1

                                RowLayout {
                                    anchors.fill: parent
                                    anchors.leftMargin: 10
                                    anchors.rightMargin: 12
                                    spacing: 10
                                    Rectangle {
                                        width: 26; height: 26
                                        radius: Theme.radiusSm
                                        color: Colors.overlay40
                                        border.color: Colors.surfaceBorderSubtle
                                        border.width: 1
                                        Icon { anchors.centerIn: parent; name: "gauge"; size: 13; color: Colors.textMuted }
                                    }
                                    Text {
                                        text: App.swapTier === "hd" ? qsTr("HD") : qsTr("Standard")
                                        color: Colors.textPrimary
                                        font.pixelSize: 12
                                        font.weight: Font.Bold
                                        Layout.fillWidth: true
                                    }
                                    Icon {
                                        name: "chevron-down"
                                        size: 14
                                        color: enginePopup.visible ? Colors.accentHover : Colors.textMuted
                                        rotation: enginePopup.visible ? 180 : 0
                                    }
                                }
                                MouseArea {
                                    id: engSelMa
                                    anchors.fill: parent
                                    hoverEnabled: true
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: enginePopup.visible ? enginePopup.close() : enginePopup.open()
                                }

                                Popup {
                                    id: enginePopup
                                    y: parent.height + 6
                                    x: 0
                                    width: 320
                                    // Count-based height: ColumnLayout+Repeater implicitHeight is 0.
                                    height: 2 * 40 + 2 + 16
                                    padding: 8
                                    closePolicy: Popup.CloseOnEscape
                                    background: Rectangle {
                                        color: Colors.surfaceOverlay
                                        border.color: Colors.surfaceBorder
                                        radius: Theme.radiusMd
                                        border.width: 1
                                        clip: true
                                        Honeycomb {
                                            anchors.fill: parent
                                            cellSize: Theme.honeycombCell
                                            lineColor: Colors.honeycombLineFaint
                                            opacity: 0.5
                                        }
                                        Rectangle {
                                            anchors.left: parent.left
                                            anchors.right: parent.right
                                            anchors.top: parent.top
                                            height: 1
                                            color: Colors.insetHighlightSoft
                                            z: Theme.zLocal1
                                        }
                                        CornerTicks {
                                            anchors.fill: parent
                                            inset: 5
                                            tickSize: 7
                                            thickness: 1
                                            color: Colors.accent30
                                            z: Theme.zLocal1
                                        }
                                    }
                                    ColumnLayout {
                                        id: engCol
                                        anchors.fill: parent
                                        spacing: 2
                                        Repeater {
                                            model: [
                                                { label: qsTr("Standard"), value: "standard", hint: qsTr("%1 credits/sec · works on most networks").arg(Session.creditsPerSecond.toFixed(0)) },
                                                { label: qsTr("HD"), value: "hd", hint: qsTr("Smooth 30fps · needs Starter plan or higher") }
                                            ]
                                            delegate: Rectangle {
                                                required property var modelData
                                                readonly property bool sel: App.swapTier === modelData.value
                                                Layout.fillWidth: true
                                                height: 40
                                                radius: Theme.radiusSm
                                                color: engMa.containsMouse ? Colors.surfaceHover : (sel ? Colors.accent10 : Colors.transparent)
                                                border.width: sel ? 1 : 0
                                                border.color: Colors.accent30
                                                ColumnLayout {
                                                    anchors.fill: parent
                                                    anchors.leftMargin: 10
                                                    anchors.rightMargin: 10
                                                    spacing: 1
                                                    RowLayout {
                                                        Layout.fillWidth: true
                                                        Text {
                                                            text: modelData.label
                                                            color: sel ? Colors.textPrimary : Colors.textSecondary
                                                            font.pixelSize: 12
                                                            font.weight: sel ? Font.Bold : Font.Normal
                                                            Layout.fillWidth: true
                                                        }
                                                        Icon {
                                                            visible: sel
                                                            name: "check"
                                                            size: 13
                                                            emphasis: true
                                                            color: Colors.accentHover
                                                        }
                                                    }
                                                    Text {
                                                        text: modelData.hint
                                                        color: Colors.textMuted
                                                        font.pixelSize: 10
                                                        elide: Text.ElideRight
                                                        Layout.fillWidth: true
                                                    }
                                                }
                                                MouseArea {
                                                    id: engMa
                                                    anchors.fill: parent
                                                    hoverEnabled: true
                                                    cursorShape: Qt.PointingHandCursor
                                                    onClicked: {
                                                        var tier = Auth.tier
                                                        if (modelData.value === "hd" && !(tier === "starter" || tier === "mid" || tier === "pro")) {
                                                            App.notify(qsTr("HD requires Starter plan or higher"), "warning")
                                                            return
                                                        }
                                                        App.swapTier = modelData.value
                                                        enginePopup.close()
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            Text {
                                text: qsTr("Standard is watermark-free at %1 credits/sec. HD adds smooth 30fps at the same rate. Switch any time between swaps.").arg(Session.creditsPerSecond.toFixed(0))
                                color: Colors.textMuted
                                font.pixelSize: 11
                                wrapMode: Text.WordWrap
                                Layout.fillWidth: true
                                Layout.topMargin: 8
                                Layout.bottomMargin: 20
                            }


                            // DISPLAY
                                                        SectionHeader {
                                text: qsTr("DISPLAY");
                                Layout.fillWidth: true;
                                Layout.bottomMargin: 10
                            }
                            Text {
                                text: qsTr("Input camera PIP")
                                color: Colors.textPrimary
                                font.pixelSize: 12
                                font.weight: Font.Bold
                            }
                            // Electron: one bordered pill group (p-0.5, rounded-full),
                            // borderless options, selected = solid accent.
                            // (The first-run override only forces the VALUE, not
                            // the control state — see the note below.)
                            // Rendered with the shared SegmentedControl (equalWidths)
                            // so every pill group in the app shares one component.
                            SegmentedControl {
                                Layout.fillWidth: true
                                Layout.topMargin: 8
                                equalWidths: true
                                model: [
                                    { label: qsTr("Always show"), value: "always" },
                                    { label: qsTr("Only while swapping"), value: "whileSwapping" },
                                    { label: qsTr("Never"), value: "never" }
                                ]
                                currentValue: Config.pipVisibility
                                onActivated: (v) => { Config.pipVisibility = v }
                            }
                            Text {
                                visible: !root.firstSwapDoneCheck()
                                text: qsTr("First-run override active")
                                color: Colors.accent70
                                font.pixelSize: 9
                                font.family: Theme.fontMono.family
                                font.capitalization: Font.AllUppercase
                                font.letterSpacing: Theme.trackingEyebrow
                                Layout.topMargin: 4
                            }
                            Text {
                                // Electron: per-option help, 10px
                                text: {
                                    const v = Config.pipVisibility
                                    if (!root.firstSwapDoneCheck())
                                        return qsTr("PiP forced visible until your first successful swap so you can verify your camera.")
                                    if (v === "always") return qsTr("Visible during live and after stop.")
                                    if (v === "whileSwapping") return qsTr("Hidden once you stop. Default.")
                                    return qsTr("Hidden during live and after stop.")
                                }
                                color: Colors.textMuted
                                font.pixelSize: 10
                                wrapMode: Text.WordWrap
                                Layout.fillWidth: true
                                Layout.topMargin: 8
                                Layout.bottomMargin: 20
                            }

                            ToggleRow {
                                title: qsTr("Show camera before swap")
                                desc: qsTr("Show your real camera in the stage before the swap starts.")
                                checked: Config.showCameraBeforeSwap
                                onToggled: (v) => Config.showCameraBeforeSwap = v
                                Layout.bottomMargin: 20
                            }

                            // NOTIFICATIONS
                                                        SectionHeader {
                                text: qsTr("NOTIFICATIONS");
                                Layout.fillWidth: true;
                                Layout.bottomMargin: 10
                            }
                            ToggleRow {
                                title: qsTr("Desktop notifications")
                                desc: qsTr("OS-level notifications for saves, payments and stream events.")
                                checked: Config.desktopNotifications
                                onToggled: (v) => Config.desktopNotifications = v
                                Layout.bottomMargin: 14
                            }
                            ToggleRow {
                                title: qsTr("Product news & offers")
                                desc: qsTr("Occasional product updates and credit promotions.")
                                checked: Config.productNotifications
                                onToggled: (v) => Config.productNotifications = v
                                Layout.bottomMargin: 20
                            }

                            // LANGUAGE
                                                        SectionHeader {
                                text: qsTr("LANGUAGE");
                                Layout.fillWidth: true;
                                Layout.bottomMargin: 10
                            }
                            Rectangle {
                                id: langBox
                                Layout.fillWidth: true
                                height: 46
                                radius: Theme.radiusMd
                                color: langPopup.visible ? Colors.surfaceFocus
                                     : langSelMa.containsMouse ? Colors.surfaceRaised
                                     : Colors.surfaceBase
                                border.color: langPopup.visible ? Colors.accent40
                                             : langSelMa.containsMouse ? Colors.surfaceBorderStrong
                                             : Colors.surfaceBorder
                                border.width: 1
                                RowLayout {
                                    anchors.fill: parent
                                    anchors.leftMargin: 10
                                    anchors.rightMargin: 12
                                    spacing: 10
                                    Rectangle {
                                        width: 26; height: 26
                                        radius: Theme.radiusSm
                                        color: Colors.overlay40
                                        border.color: Colors.surfaceBorderSubtle
                                        border.width: 1
                                        Icon { anchors.centerIn: parent; name: "globe"; size: 13; color: Colors.textMuted }
                                    }
                                    Text {
                                        text: I18n.languageDisplayName(I18n.language)
                                        color: Colors.textPrimary
                                        font.pixelSize: 12
                                        font.weight: Font.Bold
                                        Layout.fillWidth: true
                                    }
                                    Icon {
                                        name: "chevron-down"
                                        size: 14
                                        color: langPopup.visible ? Colors.accentHover : Colors.textMuted
                                        rotation: langPopup.visible ? 180 : 0
                                    }
                                }
                                MouseArea {
                                    id: langSelMa
                                    anchors.fill: parent
                                    hoverEnabled: true
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: langPopup.visible ? langPopup.close() : langPopup.open()
                                }

                                Popup {
                                    id: langPopup
                                    y: -height - 6 // open upward so a long list never overflows the drawer bottom
                                    x: 0
                                    width: 240
                                    height: Math.min(240, I18n.availableLanguages.length * 34
                                                     + Math.max(0, I18n.availableLanguages.length - 1) * 2 + 16)
                                    padding: 8
                                    closePolicy: Popup.CloseOnEscape
                                    background: Rectangle {
                                        color: Colors.surfaceOverlay
                                        border.color: Colors.surfaceBorder
                                        radius: Theme.radiusMd
                                        border.width: 1
                                        clip: true
                                        Honeycomb {
                                            anchors.fill: parent
                                            cellSize: Theme.honeycombCell
                                            lineColor: Colors.honeycombLineFaint
                                            opacity: 0.5
                                        }
                                        Rectangle {
                                            anchors.left: parent.left
                                            anchors.right: parent.right
                                            anchors.top: parent.top
                                            height: 1
                                            color: Colors.insetHighlightSoft
                                            z: Theme.zLocal1
                                        }
                                        CornerTicks {
                                            anchors.fill: parent
                                            inset: 5
                                            tickSize: 7
                                            thickness: 1
                                            color: Colors.accent30
                                            z: Theme.zLocal1
                                        }
                                    }
                                    Flickable {
                                        anchors.fill: parent
                                        clip: true
                                        contentHeight: langCol.implicitHeight
                                        boundsBehavior: Flickable.StopAtBounds
                                        ScrollBar.vertical: StyledScrollBar { thin: true }
                                        ColumnLayout {
                                            id: langCol
                                            width: parent.width
                                            spacing: 2
                                        Repeater {
                                            model: I18n.availableLanguages
                                            delegate: Rectangle {
                                                required property var modelData
                                                readonly property bool sel: I18n.language === modelData
                                                Layout.fillWidth: true
                                                height: 34
                                                radius: Theme.radiusSm
                                                color: lngMa.containsMouse ? Colors.surfaceHover : (sel ? Colors.accent10 : Colors.transparent)
                                                border.width: sel ? 1 : 0
                                                border.color: Colors.accent30
                                                RowLayout {
                                                    anchors.fill: parent
                                                    anchors.leftMargin: 10
                                                    anchors.rightMargin: 8
                                                    spacing: 8
                                                    Text {
                                                        text: I18n.languageDisplayName(modelData)
                                                        color: sel ? Colors.textPrimary : Colors.textSecondary
                                                        font.pixelSize: 11
                                                        font.weight: sel ? Font.Bold : Font.Normal
                                                        Layout.fillWidth: true
                                                    }
                                                    Icon {
                                                        visible: sel
                                                        name: "check"
                                                        size: 13
                                                        emphasis: true
                                                        color: Colors.accentHover
                                                    }
                                                }
                                                MouseArea { id: lngMa; anchors.fill: parent; hoverEnabled: true; cursorShape: Qt.PointingHandCursor; onClicked: { I18n.setLanguage(modelData); langPopup.close() } }
                                            }
                                        }
                                        }
                                    }
                                }
                            }
                            Text {
                                text: qsTr("Interface language. Some catalog text may stay in English.")
                                color: Colors.textMuted
                                font.pixelSize: 11
                                wrapMode: Text.WordWrap
                                Layout.fillWidth: true
                                Layout.topMargin: 8
                                Layout.bottomMargin: 20
                            }

                            // LIBRARY
                                                        SectionHeader {
                                text: qsTr("LIBRARY");
                                Layout.fillWidth: true;
                                Layout.bottomMargin: 10
                            }
                            ToggleRow {
                                title: qsTr("Show built-in characters")
                                desc: qsTr("Toggle the starter characters in your Library.")
                                checked: Config.showBuiltinCharacters
                                onToggled: (v) => Config.showBuiltinCharacters = v
                            }
                        }

                        // ════════════════════════ CAMERA ═══════════════════════
                        ColumnLayout {
                            visible: root.activeTab === "camera"
                            Layout.fillWidth: true
                            spacing: 0

                                                        SectionHeader {
                                text: qsTr("CAMERA DEVICE");
                                Layout.fillWidth: true;
                                Layout.bottomMargin: 10
                            }
                            Rectangle {
                                id: devBox
                                Layout.fillWidth: true
                                height: 46
                                radius: Theme.radiusMd
                                color: devPopup.visible ? Colors.surfaceFocus
                                     : devSelMa.containsMouse ? Colors.surfaceRaised
                                     : Colors.surfaceBase
                                border.color: devPopup.visible ? Colors.accent40
                                             : devSelMa.containsMouse ? Colors.surfaceBorderStrong
                                             : Colors.surfaceBorder
                                border.width: 1
                                RowLayout {
                                    anchors.fill: parent
                                    anchors.leftMargin: 10
                                    anchors.rightMargin: 12
                                    spacing: 10
                                    Rectangle {
                                        width: 26; height: 26
                                        radius: Theme.radiusSm
                                        color: Colors.overlay40
                                        border.color: Colors.surfaceBorderSubtle
                                        border.width: 1
                                        Icon { anchors.centerIn: parent; name: "video"; size: 13; color: Colors.textMuted }
                                    }
                                    Text {
                                        text: CameraCtrl.currentDeviceName || qsTr("Default camera")
                                        color: Colors.textPrimary
                                        font.pixelSize: 12
                                        font.weight: Font.Bold
                                        Layout.fillWidth: true
                                        elide: Text.ElideMiddle
                                    }
                                    Icon {
                                        name: "chevron-down"
                                        size: 14
                                        color: devPopup.visible ? Colors.accentHover : Colors.textMuted
                                        rotation: devPopup.visible ? 180 : 0
                                    }
                                }
                                MouseArea {
                                    id: devSelMa
                                    anchors.fill: parent
                                    hoverEnabled: true
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: devPopup.visible ? devPopup.close() : devPopup.open()
                                }

                                Popup {
                                    id: devPopup
                                    y: -height - 6 // open upward so a long device list never overflows the drawer bottom
                                    x: 0
                                    width: Math.min(340, root.width - 40)
                                    height: Math.min(240, CameraCtrl.availableDevices.length * 34
                                                     + Math.max(0, CameraCtrl.availableDevices.length - 1) * 2 + 16)
                                    padding: 8
                                    closePolicy: Popup.CloseOnEscape
                                    background: Rectangle {
                                        color: Colors.surfaceOverlay
                                        border.color: Colors.surfaceBorder
                                        radius: Theme.radiusMd
                                        border.width: 1
                                        clip: true
                                        Honeycomb {
                                            anchors.fill: parent
                                            cellSize: Theme.honeycombCell
                                            lineColor: Colors.honeycombLineFaint
                                            opacity: 0.5
                                        }
                                        Rectangle {
                                            anchors.left: parent.left
                                            anchors.right: parent.right
                                            anchors.top: parent.top
                                            height: 1
                                            color: Colors.insetHighlightSoft
                                            z: Theme.zLocal1
                                        }
                                        CornerTicks {
                                            anchors.fill: parent
                                            inset: 5
                                            tickSize: 7
                                            thickness: 1
                                            color: Colors.accent30
                                            z: Theme.zLocal1
                                        }
                                    }
                                    ColumnLayout {
                                        id: devCol
                                        anchors.fill: parent
                                        spacing: 2
                                        Repeater {
                                            model: CameraCtrl.availableDevices
                                            delegate: Rectangle {
                                                required property string modelData
                                                required property int index
                                                readonly property bool sel: CameraCtrl.currentDeviceName === modelData
                                                Layout.fillWidth: true
                                                height: 34
                                                radius: Theme.radiusSm
                                                color: dvMa.containsMouse ? Colors.surfaceHover : (sel ? Colors.accent10 : Colors.transparent)
                                                border.width: sel ? 1 : 0
                                                border.color: Colors.accent30
                                                RowLayout {
                                                    anchors.fill: parent
                                                    anchors.leftMargin: 10
                                                    anchors.rightMargin: 8
                                                    spacing: 8
                                                    Rectangle { width: 6; height: 6; radius: Theme.radiusXl; color: sel ? Colors.accent : Colors.textMuted }
                                                    Text {
                                                        text: modelData
                                                        color: sel ? Colors.textPrimary : Colors.textSecondary
                                                        font.pixelSize: 11
                                                        font.weight: sel ? Font.Bold : Font.Normal
                                                        elide: Text.ElideMiddle
                                                        Layout.fillWidth: true
                                                    }
                                                    Icon {
                                                        visible: sel
                                                        name: "check"
                                                        size: 13
                                                        emphasis: true
                                                        color: Colors.accentHover
                                                    }
                                                }
                                                MouseArea { id: dvMa; anchors.fill: parent; hoverEnabled: true; cursorShape: Qt.PointingHandCursor; onClicked: { CameraCtrl.currentDeviceId = CameraCtrl.deviceIdAt(index); devPopup.close() } }
                                            }
                                        }
                                    }
                                }
                            }

                                                        SectionHeader {
                                text: qsTr("RESOLUTION");
                                Layout.fillWidth: true;
                                Layout.bottomMargin: 10
                            }
                            Text {
                                text: qsTr("HD (locked)")
                                color: Colors.textSecondary
                                font.pixelSize: 12
                                Layout.fillWidth: true
                            }
                            Text {
                                text: qsTr("Resolution follows your plan's engine tier.")
                                color: Colors.textMuted
                                font.pixelSize: 11
                                Layout.topMargin: 8
                                Layout.fillWidth: true
                                wrapMode: Text.WordWrap
                            }
                        }

                        // ════════════════════════ STREAM ═══════════════════════
                        ColumnLayout {
                            visible: root.activeTab === "stream"
                            Layout.fillWidth: true
                            spacing: 0

                            RowLayout {
                                Layout.fillWidth: true
                                Layout.bottomMargin: 12
                                                                SectionHeader {
                                    text: qsTr("OBS STREAM OUTPUT");
                                    Layout.fillWidth: true;
                                }
                                Rectangle {
                                    width: statusLbl.implicitWidth + 20
                                    height: 20
                                    radius: Theme.radiusFull
                                    // Electron: pill chrome CONSTANT — only the dot flips
                                    color: Colors.surfaceBase
                                    border.color: Colors.surfaceBorder
                                    Row {
                                        anchors.centerIn: parent
                                        spacing: 5
                                        Rectangle {
                                            width: 6; height: 6; radius: Theme.radiusXl
                                            color: StreamServer.running ? Colors.statusSuccess
                                                 : Colors.textMuted30
                                            anchors.verticalCenter: parent.verticalCenter
                                        }
                                        Text {
                                            id: statusLbl
                                            text: StreamServer.running ? qsTr("Active") : qsTr("Inactive")
                                            color: Colors.textSecondary
                                            font.pixelSize: 10
                                            font.family: Theme.fontMono.family
                                        }
                                    }
                                }
                            }

                            // URL box (Electron: p-4 cursor-grab card, label inside,
                            // accent 13px mono URL, drag dots, in-box compact copy)
                            Rectangle {
                                Layout.fillWidth: true
                                Layout.preferredHeight: urlCol.implicitHeight + 40
                                radius: Theme.radiusLg
                                color: Colors.surfaceBase
                                border.color: urlHover.containsMouse ? Colors.accent30 : Colors.surfaceBorder
                                border.width: 1

                                ColumnLayout {
                                    id: urlCol
                                    anchors.left: parent.left
                                    anchors.right: parent.right
                                    anchors.top: parent.top
                                    anchors.margins: 20
                                    spacing: 10

                                    RowLayout {
                                        Layout.fillWidth: true
                                                                                SectionHeader {
                                            text: qsTr("BROWSER SOURCE URL");
                                            Layout.fillWidth: true;
                                        }
                                        Item { Layout.fillWidth: true }
                                        // Drag dots (grip)
                                        Row {
                                            spacing: 2
                                            Repeater {
                                                model: 2
                                                Column {
                                                    spacing: 3
                                                    Repeater {
                                                        model: 2
                                                        Rectangle {
                                                            width: 2; height: 2; radius: Theme.radiusHairline
                                                            color: urlHover.containsMouse ? Colors.accent60
                                                                 : Colors.textMuted40
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    Text {
                                        Layout.fillWidth: true
                                        text: StreamServer.url || VirtualCamera.obsBrowserSourceUrl
                                        color: Colors.accent
                                        font.family: Theme.fontMono.family
                                        font.pixelSize: 14
                                        wrapMode: Text.WrapAnywhere
                                    }

                                    // Divider + compact in-box copy (Electron)
                                    Rectangle { Layout.fillWidth: true; height: 1; color: Colors.surfaceBorderSubtle }
                                    RowLayout {
                                        Layout.fillWidth: true
                                        Item { Layout.fillWidth: true }
                                        SecondaryButton {
                                            compact: true
                                            text: root.copiedFlash.length > 0 && root.copiedFlash === qsTr("Copied") ? qsTr("Copied") : qsTr("Copy")
                                            onClicked: {
                                                Backend.copyToClipboard(StreamServer.url || VirtualCamera.obsBrowserSourceUrl)
                                                root.copiedFlash = qsTr("Copied")
                                                copyFlashTimer.restart()
                                            }
                                        }
                                        Timer {
                                            id: copyFlashTimer
                                            interval: 2000
                                            onTriggered: root.copiedFlash = ""
                                        }
                                    }
                                }

                            // Below the content so the in-box Copy button stays clickable.
                            MouseArea {
                                id: urlHover
                                anchors.fill: parent
                                z: Theme.zUnder
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor
                                onClicked: {
                                    Backend.copyToClipboard(StreamServer.url || VirtualCamera.obsBrowserSourceUrl)
                                    root.copiedFlash = qsTr("Copied")
                                    copyFlashTimer.restart()
                                }
                            }
                            }

                            RowLayout {
                                Layout.fillWidth: true
                                Layout.topMargin: 14
                                spacing: 8
                                SecondaryButton {
                                    text: StreamServer.running ? qsTr("Stop output") : qsTr("Start output")
                                    onClicked: {
                                        StreamServer.port = Config.streamPort
                                        if (StreamServer.running)
                                            StreamServer.stop()
                                        else
                                            StreamServer.start()
                                    }
                                }
                            }

                            Text {
                                text: qsTr("How to add LiveMorph to OBS")
                                color: Colors.textPrimary
                                font.pixelSize: 12
                                font.weight: Font.Bold
                                Layout.topMargin: 22
                                Layout.bottomMargin: 10
                            }
                            // 3 steps (Electron): Browser Source / Window
                            // Capture / Direct MJPEG w/ badges + code block
                            ColumnLayout {
                                Layout.fillWidth: true
                                spacing: 12

                                ColumnLayout {
                                    Layout.fillWidth: true
                                    spacing: 2
                                    RowLayout {
                                        spacing: 8
                                        Text {
                                            text: qsTr("Browser Source:")
                                            color: Colors.textPrimary
                                            font.pixelSize: 12
                                            font.weight: Font.Normal
                                        }
                                        Rectangle {
                                            width: recBadge.implicitWidth + 10
                                            height: 15
                                            radius: Theme.radiusSm
                                            color: Colors.transparent
                                            border.color: Colors.accent70
                                            border.width: 1
                                            Text {
                                                id: recBadge
                                                anchors.centerIn: parent
                                                text: qsTr("RECOMMENDED")
                                                color: Colors.accent70
                                                font.pixelSize: 9
                                                font.family: Theme.fontMono.family
                                                font.letterSpacing: 1.0
                                            }
                                        }
                                    }
                                    Text {
                                        text: qsTr("Add a Browser Source with the URL above. LiveMorph streams MJPEG at full frame size — no capture card needed.")
                                        color: Colors.textMuted
                                        font.pixelSize: 11
                                        wrapMode: Text.WordWrap
                                        Layout.fillWidth: true
                                    }
                                }

                                ColumnLayout {
                                    Layout.fillWidth: true
                                    spacing: 2
                                    Text {
                                        text: qsTr("Window Capture:")
                                        color: Colors.textPrimary
                                        font.pixelSize: 12
                                        font.weight: Font.Normal
                                    }
                                    Text {
                                        text: qsTr("Capture the Preview window (1280×720, OBS-capturable). Use Clean Mode (Ctrl+Shift+C) to hide its toolbar.")
                                        color: Colors.textMuted
                                        font.pixelSize: 11
                                        wrapMode: Text.WordWrap
                                        Layout.fillWidth: true
                                    }
                                }

                                ColumnLayout {
                                    Layout.fillWidth: true
                                    spacing: 2
                                    RowLayout {
                                        spacing: 8
                                        Text {
                                            text: qsTr("Direct MJPEG:")
                                            color: Colors.textPrimary
                                            font.pixelSize: 12
                                            font.weight: Font.Normal
                                        }
                                        Rectangle {
                                            width: advBadge.implicitWidth + 10
                                            height: 15
                                            radius: Theme.radiusSm
                                            color: Colors.transparent
                                            border.color: Colors.surfaceBorder
                                            border.width: 1
                                            Text {
                                                id: advBadge
                                                anchors.centerIn: parent
                                                text: qsTr("ADVANCED")
                                                color: Colors.textMuted
                                                font.pixelSize: 9
                                                font.family: Theme.fontMono.family
                                                font.letterSpacing: 1.0
                                            }
                                        }
                                    }
                                    Rectangle {
                                        Layout.fillWidth: true
                                        Layout.preferredHeight: 30
                                        radius: Theme.radiusSm
                                        color: Colors.overlay40 // surface-overlay/50
                                        Text {
                                            anchors.left: parent.left
                                            anchors.leftMargin: 8
                                            anchors.verticalCenter: parent.verticalCenter
                                            text: StreamServer.url || qsTr("http://127.0.0.1:%1/stream (starts with the app)").arg(Constants.defaultStreamPort)
                                            color: Colors.accent70 // accent/70
                                            font.family: Theme.fontMono.family
                                            font.pixelSize: 11
                                        }
                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: {
                                                Backend.copyToClipboard(StreamServer.url || VirtualCamera.obsBrowserSourceUrl)
                                                App.notify(qsTr("URL copied"), "success")
                                            }
                                        }
                                    }
                                }
                            }

                            // Output behavior (Electron: pt-4 border-t + heading)
                            Rectangle { Layout.fillWidth: true; height: 1; color: Colors.surfaceBorderSubtle; Layout.topMargin: 16 }
                                                        SectionHeader {
                                text: qsTr("OUTPUT BEHAVIOR");
                                Layout.fillWidth: true;
                                Layout.topMargin: 14
                                Layout.bottomMargin: 8
                            }

                            ToggleRow {
                                title: qsTr("Swap output only")
                                desc: qsTr("If a swap drops out, your preview and OBS output hold the last swapped frame instead of revealing your camera. Falls back to black before your first frame.")
                                checked: !Config.showCameraBeforeSwap
                                onToggled: (v) => Config.showCameraBeforeSwap = !v
                                Layout.topMargin: 18
                            }
                        }

                        // ════════════════════════ RECORDING ═══════════════════════
                        ColumnLayout {
                            visible: root.activeTab === "recording"
                            Layout.fillWidth: true
                            spacing: 0

                                                        SectionHeader {
                                text: qsTr("SESSION RECORDING");
                                Layout.fillWidth: true;
                                Layout.bottomMargin: 8
                            }
                            Text {
                                text: qsTr("Save your swap session to a local video file. Recording does not cost extra credits.")
                                color: Colors.textSecondary
                                font.pixelSize: 11
                                wrapMode: Text.WordWrap
                                Layout.fillWidth: true
                                Layout.bottomMargin: 18
                            }

                            Text {
                                text: qsTr("Save recordings to")
                                color: Colors.textPrimary
                                font.pixelSize: 12
                                font.weight: Font.Bold
                            }
                            RowLayout {
                                Layout.fillWidth: true
                                Layout.topMargin: 8
                                spacing: 8
                                Rectangle {
                                    Layout.fillWidth: true
                                    height: 38
                                    radius: Theme.inputRadius
                                    color: Colors.surfaceBase
                                    border.color: Colors.surfaceBorder
                                    border.width: 1
                                    Text {
                                        anchors.left: parent.left
                                        anchors.leftMargin: 12
                                        anchors.verticalCenter: parent.verticalCenter
                                        width: parent.width - 24
                                        text: Recording.outputDirectory || qsTr("Default videos folder")
                                        color: Colors.textSecondary
                                        font.family: Theme.fontMono.family
                                        font.pixelSize: 11
                                        elide: Text.ElideMiddle
                                    }
                                }
                                SecondaryButton {
                                    text: qsTr("Change…")
                                    onClicked: folderDialog.open()
                                }
                            }
                            Text {
                                text: qsTr("Videos land here with timestamped filenames.")
                                color: Colors.textMuted
                                font.pixelSize: 11
                                Layout.topMargin: 8
                                Layout.bottomMargin: 20
                                Layout.fillWidth: true
                                wrapMode: Text.WordWrap
                            }

                            ToggleRow {
                                title: qsTr("Auto-record swaps")
                                desc: qsTr("Recording starts by itself when your swap goes live and saves when the swap ends. You can still stop it anytime with the record button.")
                                checked: Config.autoRecord
                                onToggled: (v) => Config.autoRecord = v
                                Layout.bottomMargin: 20
                            }

                            Text {
                                text: qsTr("Quality")
                                color: Colors.textPrimary
                                font.pixelSize: 12
                                font.weight: Font.Bold
                                Layout.bottomMargin: 10
                            }
                            RowLayout {
                                Layout.fillWidth: true
                                spacing: 10
                                Repeater {
                                    model: [
                                        { label: qsTr("Standard"), sub: qsTr("~20 MB/min"), value: "balanced" },
                                        { label: qsTr("High"),     sub: qsTr("~30 MB/min"), value: "high" }
                                    ]
                                    delegate: Rectangle {
                                        required property var modelData
                                        id: qualCard
                                        readonly property bool selected: Config.recordingQuality === modelData.value
                                        readonly property bool hovered: qualMa.containsMouse
                                        Layout.fillWidth: true
                                        height: 60
                                        radius: Theme.radiusMd
                                        color: selected ? Colors.accent06
                                             : hovered ? Colors.overlay30
                                             : Colors.surfaceBase
                                        border.color: selected ? Colors.accent40
                                                    : hovered ? Colors.surfaceBorderStrong
                                                    : Colors.surfaceBorder
                                        border.width: 1

                                        ColumnLayout {
                                            anchors.fill: parent
                                            anchors.leftMargin: 12
                                            anchors.rightMargin: 12
                                            anchors.topMargin: 10
                                            anchors.bottomMargin: 10
                                            spacing: 2

                                            RowLayout {
                                                Layout.fillWidth: true
                                                Text {
                                                    text: modelData.label
                                                    color: Colors.textPrimary
                                                    font.pixelSize: 12
                                                    font.weight: Font.Normal
                                                }
                                                Item { Layout.fillWidth: true }
                                                Icon {
                                                    visible: qualCard.selected
                                                    name: "check"
                                                    size: 12
                                                    emphasis: true
                                                    color: Colors.accent
                                                }
                                            }
                                            Text {
                                                text: modelData.sub
                                                color: Colors.textMuted
                                                font.pixelSize: 10
                                                font.family: Theme.fontMono.family
                                            }
                                        }

                                        MouseArea { id: qualMa; anchors.fill: parent; hoverEnabled: true; cursorShape: Qt.PointingHandCursor; onClicked: Config.recordingQuality = modelData.value }
                                    }
                                }
                            }

                            // Orphan recovery (kept Qt improvement — crash safety)
                                                        SectionHeader {
                                text: qsTr("CRASH RECOVERY");
                                Layout.fillWidth: true;
                                Layout.topMargin: 24
                                Layout.bottomMargin: 8
                            }
                            RowLayout {
                                spacing: 8
                                SecondaryButton {
                                    text: qsTr("Scan orphan recordings")
                                    onClicked: {
                                        Recording.scanOrphans()
                                        App.notify(Recording.orphanRecordings.length > 0
                                                   ? qsTr("%1 unfinished recording(s) found").arg(Recording.orphanRecordings.length)
                                                   : qsTr("No unfinished recordings"), "info")
                                    }
                                }
                                // Recent recordings (Electron: row list w/ reveal)
                                ColumnLayout {
                                    visible: Recording.recentRecordings.length > 0
                                    Layout.fillWidth: true
                                    Layout.topMargin: 8
                                    spacing: 4
                                    Repeater {
                                        model: Recording.recentRecordings
                                        delegate: Rectangle {
                                            required property var modelData
                                            Layout.fillWidth: true
                                            Layout.preferredHeight: 40
                                            radius: Theme.radiusSm
                                            color: recRowMa.containsMouse ? Colors.overlay20 : Colors.transparent
                                            border.color: Colors.surfaceBorderSubtle
                                            border.width: 1
                                            RowLayout {
                                                anchors.fill: parent
                                                anchors.leftMargin: 12
                                                anchors.rightMargin: 12
                                                spacing: 8
                                                Icon { name: "video"; size: 14; color: Colors.textMuted50 }
                                                Text {
                                                    text: modelData.fileName || modelData.path || ""
                                                    color: Colors.textSecondary
                                                    font.family: Theme.fontMono.family
                                                    font.pixelSize: 11
                                                    elide: Text.ElideMiddle
                                                    Layout.fillWidth: true
                                                }
                                                Text {
                                                    visible: (modelData.sizeText || "").length > 0
                                                    text: [modelData.sizeText, modelData.dateText].filter(Boolean).join(" · ")
                                                    color: Colors.textMuted
                                                    font.family: Theme.fontMono.family
                                                    font.pixelSize: 10
                                                }
                                                Text {
                                                    text: qsTr("SHOW IN FOLDER")
                                                    visible: recRowMa.containsMouse
                                                    color: Colors.accent
                                                    font.pixelSize: 10
                                                    font.family: Theme.fontMono.family
                                                    font.letterSpacing: 1.0
                                                }
                                            }
                                            MouseArea {
                                                id: recRowMa
                                                anchors.fill: parent
                                                hoverEnabled: true
                                                cursorShape: Qt.PointingHandCursor
                                                onClicked: Recording.revealPath(modelData.path || "")
                                            }
                                        }
                                    }
                                }
                            }
                            Repeater {
                                model: Recording.orphanRecordings
                                delegate: RowLayout {
                                    required property var modelData
                                    Layout.fillWidth: true
                                    Layout.topMargin: 8
                                    spacing: 8
                                    Text {
                                        text: modelData.name || modelData.path
                                        color: Colors.statusWarning
                                        font.pixelSize: 10
                                        font.family: Theme.fontMono.family
                                        elide: Text.ElideMiddle
                                        Layout.fillWidth: true
                                    }
                                    GhostButton {
                                        text: qsTr("Recover")
                                        onClicked: Recording.recoverOrphan(modelData.path || modelData)
                                    }
                                    GhostButton {
                                        text: qsTr("Dismiss")
                                        onClicked: Recording.dismissOrphan(modelData.path || modelData)
                                    }
                                }
                            }
                        }

                        // ════════════════════════ ACCOUNT ═══════════════════════
                        ColumnLayout {
                            visible: root.activeTab === "account"
                            Layout.fillWidth: true
                            spacing: 0

                                                        SectionHeader {
                                text: qsTr("ACCOUNT");
                                Layout.fillWidth: true;
                                Layout.bottomMargin: 12
                            }
                            RowLayout {
                                Layout.fillWidth: true
                                spacing: 12
                                Item {
                                    width: 38; height: 38
                                    Hexagon {
                                        anchors.centerIn: parent
                                        size: 40
                                        lineWidth: 1.5
                                        lineColor: Colors.accent40
                                        fillColor: Colors.accent
                                    }
                                    Text {
                                        anchors.centerIn: parent
                                        text: { const t = Auth.displayName.trim(); return t.length ? t[0].toUpperCase() : "?" }
                                        color: Colors.textOnAccent
                                        font.pixelSize: 14
                                        font.bold: true
                                    }
                                }
                                ColumnLayout {
                                    spacing: 3
                                    RowLayout {
                                        spacing: 8
                                        Text {
                                            text: Auth.displayName || qsTr("—")
                                            color: Colors.textPrimary
                                            font.pixelSize: 13
                                            font.weight: Font.Bold
                                            elide: Text.ElideMiddle
                                            Layout.fillWidth: true
                                        }
                                        Rectangle {
                                            width: tierTag.implicitWidth + 14
                                            height: 20
                                            radius: Theme.radiusFull
                                            border.width: 1
                                            readonly property bool isPro: Auth.tier === "pro"
                                            readonly property bool isMid: Auth.tier === "mid"
                                            readonly property bool isStarter: Auth.tier === "starter"
                                            color: isPro ? Colors.tierProBg
                                                : isMid ? Colors.tierMidBg
                                                : isStarter ? Colors.tierStarterBg
                                                : Colors.tierBasicBg
                                            border.color: isPro ? Colors.tierProBorder
                                                : isMid ? Colors.tierMidBorder
                                                : isStarter ? Colors.tierStarterBorder
                                                : Colors.tierBasicBorder
                                            Text {
                                                id: tierTag
                                                anchors.centerIn: parent
                                                text: Auth.tier.toUpperCase()
                                                color: parent.isPro ? Colors.tierProText
                                                     : parent.isMid ? Colors.tierMidText
                                                     : parent.isStarter ? Colors.tierStarterText
                                                     : Colors.tierBasicText
                                                font.family: Theme.fontMono.family
                                                font.pixelSize: 9
                                                font.weight: Font.Bold
                                                font.letterSpacing: Theme.trackingEyebrow
                                            }
                                        }
                                        Item { Layout.fillWidth: true }
                                    }
                                    Text {
                                        text: Auth.email || ""
                                        color: Colors.textMuted
                                        font.pixelSize: 11
                                        elide: Text.ElideMiddle
                                        Layout.fillWidth: true
                                    }
                                }
                            }

                                                        SectionHeader {
                                text: qsTr("BILLING");
                                Layout.fillWidth: true;
                                Layout.topMargin: 24
                                Layout.bottomMargin: 10
                            }
                            Rectangle {
                                Layout.fillWidth: true
                                Layout.preferredHeight: billCol.implicitHeight + 28 // p-3.5
                                radius: Theme.radiusMd
                                border.width: 1
                                border.color: Auth.creditBalance < Constants.criticalCreditThreshold ? Colors.statusError20 // error/20
                                            : Auth.creditBalance < Constants.lowCreditThreshold ? Colors.statusWarning20 // warning/20
                                            : Colors.surfaceBorder
                                color: Auth.creditBalance < Constants.criticalCreditThreshold ? Colors.statusError05 // error/5
                                     : Auth.creditBalance < Constants.lowCreditThreshold ? Colors.statusWarning05 // warning/5
                                     : Colors.overlay30 // surface-overlay/30

                                ColumnLayout {
                                    id: billCol
                                    anchors.left: parent.left
                                    anchors.right: parent.right
                                    anchors.top: parent.top
                                    anchors.margins: 14
                                    spacing: 4

                                                                        SectionHeader {
                                        text: qsTr("CREDIT BALANCE");
                                        Layout.fillWidth: true;
                                    }
                                    RowLayout {
                                        spacing: 6
                                        Text {
                                            text: Auth.creditBalance.toLocaleString(Qt.locale(I18n.uiLocaleName()), 'f', 0)
                                            color: Auth.creditBalance < Constants.criticalCreditThreshold ? Colors.statusError
                                                 : Auth.creditBalance < Constants.lowCreditThreshold ? Colors.statusWarning
                                                 : Colors.textPrimary
                                            font.pixelSize: 24
                                            font.weight: Font.Bold
                                            font.family: Theme.fontMono.family
                                        }
                                        Text {
                                            text: qsTr("credits")
                                            color: Colors.textMuted
                                            font.pixelSize: 11
                                            font.family: Theme.fontMono.family
                                            Layout.alignment: Qt.AlignBaseline
                                        }
                                    }
                                    Text {
                                        // Electron: "≈ {{time}} of swap time" — min or Xh Ym
                                        text: {
                                            const mins = Math.max(0, Math.floor(Auth.creditBalance / Math.max(0.1, Session.creditsPerSecond * 60)))
                                            return qsTr("≈ %1 of swap time").arg(
                                                mins < 60 ? (mins + " min")
                                                : (Math.floor(mins / 60) + "h " + (mins % 60) + "m"))
                                        }
                                        color: Colors.textMuted
                                        font.pixelSize: 10
                                    }
                                    RowLayout {
                                        Layout.topMargin: 8
                                        spacing: 14
                                        PrimaryButton {
                                            text: qsTr("Buy credits")
                                            heightOverride: 34
                                            onClicked: { root.open = false; App.openBuyCredits() }
                                        }
                                        Item { Layout.fillWidth: true }
                                    }
                                }
                            }
                            Text {
                                text: qsTr("View your usage & account on the web →")
                                color: billWebMa.containsMouse ? Colors.accentHover : Colors.accent
                                font.pixelSize: 11
                                font.underline: billWebMa.containsMouse
                                Layout.topMargin: 12
                                MouseArea {
                                    id: billWebMa
                                    anchors.fill: parent
                                    anchors.margins: -4
                                    hoverEnabled: true
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: Backend.openExternal(Constants.urlBilling)
                                }
                            }
                            Text {
                                // Electron: standard hardcoded "2"; HD rate when available
                                text: (App.swapTier === "hd" && Backend.hdMultiplier > 1)
                                      ? qsTr("Standard: 2 credits = 1 second. HD: %1 credits = 1 second.")
                                            .arg((Session.creditsPerSecond * Backend.hdMultiplier).toFixed(0))
                                      : qsTr("2 credits = 1 second of live AI swap.")
                                color: Colors.textMuted
                                font.pixelSize: 10
                                Layout.topMargin: 10
                                Layout.fillWidth: true
                                wrapMode: Text.WordWrap
                            }

                                                        SectionHeader {
                                text: qsTr("YOUR DATA");
                                Layout.fillWidth: true;
                                Layout.topMargin: 24
                                Layout.bottomMargin: 10
                            }
                            Text {
                                text: qsTr("You have the right to access, export, or delete your data at any time. Requests are handled by our support team.")
                                color: Colors.textMuted
                                font.pixelSize: 11
                                wrapMode: Text.WordWrap
                                Layout.fillWidth: true
                                Layout.bottomMargin: 10
                            }
                            RowLayout {
                                Layout.fillWidth: true
                                ColumnLayout {
                                    Layout.fillWidth: true
                                    spacing: 2
                                    Text {
                                        text: qsTr("Export my data")
                                        color: Colors.textPrimary
                                        font.pixelSize: 12
                                        font.weight: Font.Normal
                                        Layout.fillWidth: true
                                    }
                                    Text {
                                        text: qsTr("We reply within 30 days.")
                                        color: Colors.textMuted
                                        font.pixelSize: 10
                                        wrapMode: Text.WordWrap
                                        Layout.fillWidth: true
                                    }
                                }
                                Text {
                                    text: qsTr("Request")
                                    color: exportLinkMa.containsMouse ? Colors.accentHover : Colors.accent
                                    font.pixelSize: 11
                                    MouseArea {
                                        id: exportLinkMa
                                        anchors.fill: parent
                                        anchors.margins: -4
                                        hoverEnabled: true
                                        cursorShape: Qt.PointingHandCursor
                                        onClicked: {
                                            Auth.exportData()
                                            App.notify(qsTr("Preparing data export…"), "info")
                                        }
                                    }
                                }
                            }
                            RowLayout {
                                Layout.fillWidth: true
                                Layout.topMargin: 10
                                ColumnLayout {
                                    Layout.fillWidth: true
                                    spacing: 2
                                    Text {
                                        text: qsTr("Delete my account")
                                        color: Colors.textPrimary
                                        font.pixelSize: 12
                                        font.weight: Font.Normal
                                        Layout.fillWidth: true
                                    }
                                    Text {
                                        text: qsTr("Permanent. All data removed within 30 days.")
                                        color: Colors.textMuted
                                        font.pixelSize: 10
                                        wrapMode: Text.WordWrap
                                        Layout.fillWidth: true
                                    }
                                }
                                Text {
                                    text: qsTr("Request deletion")
                                    color: deleteLinkMa.containsMouse ? Colors.dangerHover : Colors.statusError
                                    font.pixelSize: 11
                                    MouseArea {
                                        id: deleteLinkMa
                                        anchors.fill: parent
                                        anchors.margins: -4
                                        hoverEnabled: true
                                        cursorShape: Qt.PointingHandCursor
                                        onClicked: deleteAccountDialog.open()
                                    }
                                }
                            }
                            Text {
                                text: qsTr("Learn more about your rights")
                                color: learnRightsMa.containsMouse ? Colors.accentHover : Colors.accent
                                font.pixelSize: 10
                                Layout.topMargin: 8
                                MouseArea {
                                    id: learnRightsMa
                                    anchors.fill: parent
                                    anchors.margins: -4
                                    hoverEnabled: true
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: Backend.openExternal(Constants.urlPrivacy)
                                }
                            }
                            RowLayout {
                                Layout.fillWidth: true
                                Layout.topMargin: 18
                                Item { Layout.fillWidth: true }
                                Text {
                                    text: qsTr("Sign out")
                                    color: signoutLinkMa.containsMouse ? Colors.textPrimary : Colors.textMuted
                                    font.pixelSize: 11
                                    MouseArea {
                                        id: signoutLinkMa
                                        anchors.fill: parent
                                        anchors.margins: -4
                                        hoverEnabled: true
                                        cursorShape: Qt.PointingHandCursor
                                        onClicked: { root.open = false; Auth.signOut() }
                                    }
                                }
                            }
                            RowLayout {
                                Layout.fillWidth: true
                                Layout.topMargin: 6
                                Item { Layout.fillWidth: true }
                                Text {
                                    text: qsTr("Sign out on all devices")
                                    color: signoutAllMa.containsMouse ? Colors.textPrimary : Colors.textMuted
                                    font.pixelSize: 11
                                    visible: Auth.isAuthenticated
                                    MouseArea {
                                        id: signoutAllMa
                                        anchors.fill: parent
                                        anchors.margins: -4
                                        hoverEnabled: true
                                        cursorShape: Qt.PointingHandCursor
                                        onClicked: Auth.logoutAllDevices()
                                    }
                                }
                            }
                        }

                        // ════════════════════════ ABOUT ═══════════════════════
                        ColumnLayout {
                            visible: root.activeTab === "about"
                            Layout.fillWidth: true
                            spacing: 0

                            // Centered hero (Electron About tab)
                            Item { Layout.fillWidth: true; Layout.preferredHeight: 8 }
                            Item {
                                Layout.alignment: Qt.AlignHCenter
                                width: 68; height: 68
                                Hexagon {
                                    anchors.centerIn: parent
                                    size: 68
                                    lineWidth: 2
                                    lineColor: Colors.accent
                                    fillColor: Colors.accent
                                }
                                Image {
                                    anchors.centerIn: parent
                                    source: ":/assets/livemorph-icon.png"
                                    sourceSize.width: 128
                                    sourceSize.height: 128
                                    width: 40
                                    height: 40
                                    fillMode: Image.PreserveAspectFit
                                    smooth: true
                                }
                            }
                            Text {
                                Layout.alignment: Qt.AlignHCenter
                                Layout.topMargin: 14
                                text: qsTr("LiveMorph")
                                color: Colors.textPrimary
                                font.pixelSize: 18
                                font.weight: Font.Bold
                            }
                            Text {
                                Layout.alignment: Qt.AlignHCenter
                                Layout.topMargin: 2
                                text: qsTr("v%1").arg(App.appVersion)
                                color: Colors.textMuted
                                font.pixelSize: 11
                            }

                            // Links row (Electron: horizontal, hairline dividers)
                            RowLayout {
                                Layout.alignment: Qt.AlignHCenter
                                Layout.topMargin: 20
                                spacing: 10

                                Text {
                                    text: qsTr("What's new")
                                    color: aWhatsNewMa.containsMouse ? Colors.accent : Colors.textMuted
                                    font.pixelSize: 11
                                    font.weight: Font.Normal
                                    MouseArea { id: aWhatsNewMa; anchors.fill: parent; anchors.margins: -4; hoverEnabled: true; cursorShape: Qt.PointingHandCursor; onClicked: { root.open = false; App.showWhatsNew = true } }
                                }
                                Rectangle { width: 1; height: 12; color: Colors.surfaceBorderSubtle }
                                Text {
                                    text: qsTr("Replay tour")
                                    color: aTourMa.containsMouse ? Colors.accent : Colors.textMuted
                                    font.pixelSize: 11
                                    font.weight: Font.Normal
                                    MouseArea { id: aTourMa; anchors.fill: parent; anchors.margins: -4; hoverEnabled: true; cursorShape: Qt.PointingHandCursor; onClicked: { Config.onboardingDone = false; root.open = false; App.showTour = true } }
                                }
                                Rectangle { width: 1; height: 12; color: Colors.surfaceBorderSubtle }
                                Text {
                                    text: qsTr("Join our Discord")
                                    color: aDiscordMa.containsMouse ? Colors.accent : Colors.textMuted
                                    font.pixelSize: 11
                                    font.weight: Font.Normal
                                    MouseArea { id: aDiscordMa; anchors.fill: parent; anchors.margins: -4; hoverEnabled: true; cursorShape: Qt.PointingHandCursor; onClicked: Backend.openExternal(Constants.urlDiscord) }
                                }
                                Rectangle { width: 1; height: 12; color: Colors.surfaceBorderSubtle }
                                Text {
                                    text: qsTr("Visit site")
                                    color: aSiteMa.containsMouse ? Colors.accent : Colors.textMuted
                                    font.pixelSize: 11
                                    font.weight: Font.Normal
                                    MouseArea { id: aSiteMa; anchors.fill: parent; anchors.margins: -4; hoverEnabled: true; cursorShape: Qt.PointingHandCursor; onClicked: Backend.openExternal(Constants.urlSite) }
                                }
                            }

                            // Check for updates (Electron: bordered button + status)
                            RowLayout {
                                Layout.alignment: Qt.AlignHCenter
                                Layout.topMargin: 14
                                spacing: 10

                                Rectangle {
                                    width: upBtnLbl.implicitWidth + 28
                                    height: 34
                                    radius: Theme.radiusMd
                                    visible: !(Backend.updateDownloading || Backend.updateDownloadedPath.length > 0)
                                    border.width: 1
                                    border.color: upBtnMa.containsMouse ? Colors.accent40 : Colors.surfaceBorder
                                    color: upBtnMa.containsMouse ? Colors.accent10 : Colors.surfaceBase
                                    Text {
                                        id: upBtnLbl
                                        anchors.centerIn: parent
                                        text: qsTr("Check for updates")
                                        color: upBtnMa.containsMouse ? Colors.accent : Colors.textSecondary
                                        font.pixelSize: 11
                                    }
                                    MouseArea {
                                        id: upBtnMa
                                        anchors.fill: parent
                                        hoverEnabled: true
                                        cursorShape: Qt.PointingHandCursor
                                        onClicked: { Backend.checkUpdates(); App.notify(qsTr("Checking for updates…"), "info") }
                                    }
                                }

                                // Update status line (Electron)
                                Text {
                                    visible: Backend.updateDownloading || Backend.updateDownloadedPath.length > 0
                                    text: Backend.updateDownloadedPath.length > 0 ? qsTr("UPDATE AVAILABLE")
                                         : qsTr("CHECKING…")
                                    color: Colors.accent
                                    font.pixelSize: 10
                                    font.family: Theme.fontMono.family
                                    font.letterSpacing: 1.5
                                    Rectangle {
                                        visible: parent.visible
                                        width: 6; height: 6; radius: Theme.radiusXl
                                        color: Colors.accent
                                        anchors.left: parent.right
                                        anchors.leftMargin: 6
                                        anchors.verticalCenter: parent.verticalCenter
                                    }
                                }

                                Rectangle {
                                    visible: Backend.updateDownloading
                                    width: 120; height: 4; radius: Theme.radiusSm
                                    color: Colors.surfaceOverlay
                                    Rectangle {
                                        width: parent.width * (Backend.updateProgress / 100.0)
                                        height: parent.height; radius: Theme.radiusSm
                                        color: Colors.accent
                                    }
                                }
                            }

                            // Footer (Electron: poweredBy + terms row, 10px)
                            Item { Layout.fillWidth: true; Layout.fillHeight: true; Layout.minimumHeight: 24 }
                            Rectangle { Layout.fillWidth: true; height: 1; color: Colors.borderSubtle40 } // subtle/40
                            Item { width: 1; height: 12 }
                            Text {
                                Layout.alignment: Qt.AlignHCenter
                                text: qsTr("Powered by Lucy 2")
                                color: lucyMa.containsMouse ? Colors.accent : Colors.textMuted
                                font.pixelSize: 10
                                MouseArea { id: lucyMa; anchors.fill: parent; anchors.margins: -4; hoverEnabled: true; cursorShape: Qt.PointingHandCursor; onClicked: Backend.openExternal(Constants.urlSite) }
                            }
                            RowLayout {
                                Layout.alignment: Qt.AlignHCenter
                                Layout.topMargin: 6
                                spacing: 6
                                Text {
                                    text: qsTr("Terms of Service")
                                    color: aTermsMa.containsMouse ? Colors.accent : Colors.textMuted
                                    font.pixelSize: 10
                                    MouseArea { id: aTermsMa; anchors.fill: parent; anchors.margins: -3; hoverEnabled: true; cursorShape: Qt.PointingHandCursor; onClicked: Backend.openExternal(Constants.urlTerms) }
                                }
                                Text { text: "\u00b7"; color: Colors.textMuted20; font.pixelSize: 10 }
                                Text {
                                    text: qsTr("Privacy Policy")
                                    color: aPrivMa.containsMouse ? Colors.accent : Colors.textMuted
                                    font.pixelSize: 10
                                    MouseArea { id: aPrivMa; anchors.fill: parent; anchors.margins: -3; hoverEnabled: true; cursorShape: Qt.PointingHandCursor; onClicked: Backend.openExternal(Constants.urlPrivacy) }
                                }
                                Text { text: "\u00b7"; color: Colors.textMuted20; font.pixelSize: 10 }
                                Text {
                                    text: qsTr("Acceptable Use")
                                    color: aAupMa.containsMouse ? Colors.accent : Colors.textMuted
                                    font.pixelSize: 10
                                    MouseArea { id: aAupMa; anchors.fill: parent; anchors.margins: -3; hoverEnabled: true; cursorShape: Qt.PointingHandCursor; onClicked: Backend.openExternal(Constants.urlLegalAup) }
                                }
                            }
                            Item { Layout.fillWidth: true; Layout.preferredHeight: 16 }

                            // DEVELOPER (kept Qt extras, collapsed)
                                                        SectionHeader {
                                text: qsTr("DEVELOPER");
                                Layout.fillWidth: true;
                                Layout.bottomMargin: 10
                            }
                            TextField {
                                Layout.fillWidth: true
                                text: Config.apiBaseUrl
                                placeholderText: qsTr("Backend API base URL")
                                onEditingFinished: Config.apiBaseUrl = text.trim()
                                Layout.bottomMargin: 8
                            }
                            TextField {
                                Layout.fillWidth: true
                                text: Config.defaultModel
                                placeholderText: qsTr("Model id (sent to proxy)")
                                onEditingFinished: Config.defaultModel = text.trim()
                                Layout.bottomMargin: 8
                            }
                            ToggleRow {
                                title: qsTr("Start with camera")
                                desc: qsTr("Open the camera automatically after sign-in.")
                                checked: Config.startWithCamera
                                onToggled: (v) => Config.startWithCamera = v
                                Layout.bottomMargin: 8
                            }
                            ToggleRow {
                                title: qsTr("Compact chrome")
                                desc: qsTr("Reduce bar heights on short windows.")
                                checked: Config.compactChrome
                                onToggled: (v) => Config.compactChrome = v
                                Layout.bottomMargin: 8
                            }
                            ToggleRow {
                                title: qsTr("Identity lock by default")
                                desc: qsTr("Keep your real face, identity and background unchanged in new sessions.")
                                checked: Config.identityLockDefault
                                onToggled: (v) => Config.identityLockDefault = v
                                Layout.bottomMargin: 8
                            }
                            SecondaryButton {
                                text: qsTr("Refresh account / balance")
                                onClicked: {
                                    Auth.refreshProfile()
                                    App.notify(qsTr("Refreshing profile…"), "info")
                                }
                            }
                        }
                    }
                    }

                }
            }
        }
    }


    FolderDialog {
        id: folderDialog
        title: qsTr("Choose recordings folder")
        onAccepted: {
            Recording.pickOutputDirectoryFromUrl(selectedFolder.toString())
            App.notify(qsTr("Output folder updated"), "success")
        }
    }

    ConfirmDialog {
        id: deleteAccountDialog
        title: qsTr("Delete account")
        message: qsTr("This permanently deletes your account and credits. This can't be undone.")
        confirmText: qsTr("Delete account")
        onAccepted: {
            Auth.deleteAccount()
            App.notify(qsTr("Account deletion requested"), "warning")
        }
    }
}
