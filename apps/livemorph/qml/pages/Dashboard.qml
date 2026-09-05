import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

Item {
    id: root

    // Phase A–C layout system
    readonly property int contentWidth: width
    readonly property bool narrowLayout: contentWidth < Theme.narrowBreakpoint
    // Drawer mode on narrow; in-flow panel on wide
    property bool workshopDrawerOpen: false
    readonly property int workshopEffectiveWidth: {
        if (narrowLayout)
            return Math.min(Theme.workshopMaxWidth, Math.max(Theme.workshopMinWidth, Math.round(contentWidth * 0.85)))
        if (Config.workshopCollapsed)
            return Theme.workshopCollapsedWidth
        var w = Math.round(contentWidth * 0.28)
        return Math.max(Theme.workshopMinWidth, Math.min(Theme.workshopMaxWidth, w))
    }
    readonly property bool useCompactChrome: Config.compactChrome || height < Theme.compactChromeBelow
    readonly property int actionBarEffectiveHeight: useCompactChrome
          ? Theme.actionBarHeightCompact
          : Theme.actionBarHeight
    readonly property int statusBarEffectiveHeight: useCompactChrome
          ? Theme.statusBarHeightCompact
          : Theme.statusBarHeight
    readonly property int promptBarEffectiveHeight: Config.promptBarVisible ? Theme.promptBarHeight : 0


    onWidthChanged: {
        if (!narrowLayout)
            workshopDrawerOpen = false
    }

    // Orphan recovery banner
    Rectangle {
        id: orphanBanner
        visible: Recording.hasOrphans
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        height: visible ? 36 : 0
        color: "#2a2210"
        z: 50
        RowLayout {
            anchors.fill: parent
            anchors.leftMargin: 16
            anchors.rightMargin: 12
            Text {
                text: "Unfinished recording(s) found"
                color: Colors.statusWarning
                font.pixelSize: 12
                Layout.fillWidth: true
            }
            GhostButton {
                text: "Recover"
                onClicked: {
                    var o = Recording.orphanRecordings
                    if (o.length > 0)
                        Recording.recoverOrphan(o[0].path)
                }
            }
            GhostButton {
                text: "Dismiss"
                onClicked: {
                    var o = Recording.orphanRecordings
                    for (var i = 0; i < o.length; i++)
                        Recording.dismissOrphan(o[i].path)
                }
            }
        }
    }

    Rectangle {
        id: streamingUnavailableBanner
        visible: PlatformSettings.streamingUnavailable
        anchors.top: orphanBanner.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        height: visible ? 36 : 0
        color: "#2a1010"
        z: 49
        RowLayout {
            anchors.fill: parent
            anchors.leftMargin: 16
            anchors.rightMargin: 12
            Text {
                text: "Streaming unavailable"
                color: Colors.statusError
                font.pixelSize: 12
                Layout.fillWidth: true
            }
            GhostButton {
                text: "Details"
                onClicked: App.openSettings()
            }
        }
    }

    TopBar {
        id: topBar
        anchors.top: orphanBanner.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        height: Theme.topBarHeight
        narrow: root.narrowLayout
        notifUnread: notifPanel.unreadCount
        onOpenBuyCredits: App.openBuyCredits()
        onOpenSettings: App.openSettings()
        onOpenHelp: helpDrawer.open = true
        onOpenNotifications: notifPanel.open = !notifPanel.open
        onOpenWhatsNew: whatsNew.open = true
    }

    Item {
        anchors.top: topBar.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: actionBar.top

        Item {
            id: stageArea
            anchors.left: parent.left
            anchors.top: parent.top
            anchors.bottom: Config.promptBarVisible ? promptBar.top : parent.bottom
            anchors.right: root.narrowLayout ? parent.right : workshop.left

            StageFrame {
                id: stage
                anchors.fill: parent
                anchors.margins: 12
            }

            InputPiP {
                anchors.left: stage.left
                anchors.bottom: stage.bottom
                anchors.leftMargin: 16
                anchors.bottomMargin: 64
                width: root.narrowLayout ? 140 : 180
                height: root.narrowLayout ? 94 : 120
            }

            // Cooldown overlay
            Rectangle {
                visible: Session.cooldownActive
                anchors.horizontalCenter: stage.horizontalCenter
                anchors.top: stage.top
                anchors.topMargin: 20
                width: cdLabel.implicitWidth + 20
                height: 28
                radius: 14
                color: "#000000aa"
                Text {
                    id: cdLabel
                    anchors.centerIn: parent
                    text: "Cooldown " + Session.cooldownRemainingSec + "s"
                    color: Colors.statusWarning
                    font.pixelSize: 11
                    font.family: "monospace"
                }
            }

            StageControls {
                anchors.horizontalCenter: stage.horizontalCenter
                anchors.bottom: stage.bottom
                anchors.bottomMargin: 52
            }
        }

        // Dual prompt / scene bars (Phase B: collapsible)
        PromptCommitBar {
            id: promptBar
            anchors.left: parent.left
            anchors.right: root.narrowLayout ? parent.right : workshop.left
            anchors.bottom: parent.bottom
            anchors.margins: Config.promptBarVisible ? 8 : 0
            anchors.rightMargin: root.narrowLayout ? 8 : 4
            height: root.promptBarEffectiveHeight
            opacity: Config.promptBarVisible ? 1 : 0
            visible: height > 0
            clip: true
            Behavior on height {
                NumberAnimation {
                    duration: Theme.motionNormal
                    easing.type: Easing.OutCubic
                }
            }
        }

        // Phase C: in-flow workshop (wide) or hidden (narrow — drawn as overlay below)
        WorkshopPanel {
            id: workshop
            visible: !root.narrowLayout
            width: root.narrowLayout ? 0 : root.workshopEffectiveWidth
            collapsed: Config.workshopCollapsed && !root.narrowLayout
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            Behavior on width {
                NumberAnimation {
                    duration: Theme.motionNormal
                    easing.type: Easing.OutCubic
                }
            }
            onToggleCollapsed: Config.workshopCollapsed = !Config.workshopCollapsed
        }
    }

    // Phase C: workshop drawer overlay (narrow windows)
    Rectangle {
        id: workshopScrim
        anchors.fill: parent
        anchors.topMargin: topBar.height + orphanBanner.height
        anchors.bottomMargin: actionBar.height + statusBar.height
        color: Colors.overlayScrim
        opacity: root.narrowLayout && root.workshopDrawerOpen ? 1 : 0
        visible: opacity > 0.01
        z: 70
        Behavior on opacity { NumberAnimation { duration: Theme.motionFast } }
        MouseArea {
            anchors.fill: parent
            onClicked: root.workshopDrawerOpen = false
        }
    }

    WorkshopPanel {
        id: workshopDrawer
        visible: root.narrowLayout
        width: root.workshopEffectiveWidth
        collapsed: false
        z: 71
        anchors.top: parent.top
        anchors.topMargin: topBar.height + orphanBanner.height
        anchors.bottom: actionBar.top
        anchors.right: parent.right
        anchors.rightMargin: root.workshopDrawerOpen ? 0 : -width
        Behavior on anchors.rightMargin {
            NumberAnimation {
                duration: Theme.motionNormal
                easing.type: Easing.OutCubic
            }
        }
        onToggleCollapsed: root.workshopDrawerOpen = false
    }

    // Floating workshop open button (narrow)
    Rectangle {
        id: workshopFab
        visible: root.narrowLayout && !root.workshopDrawerOpen
        z: 65
        width: 44
        height: 44
        radius: 22
        anchors.right: parent.right
        anchors.rightMargin: 16
        anchors.bottom: actionBar.top
        anchors.bottomMargin: 16 + (Config.promptBarVisible ? Theme.promptBarHeight : 0)
        color: Colors.accent
        border.color: Colors.accent40
        border.width: 1
        Icon {
            anchors.centerIn: parent
            name: "layers"
            size: 18
            color: Colors.white
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: root.workshopDrawerOpen = true
        }
        // soft glow
        Rectangle {
            anchors.centerIn: parent
            width: parent.width + 10
            height: parent.height + 10
            radius: width / 2
            color: Colors.accent
            opacity: 0.25
            z: -1
        }
    }

    ActionBar {
        id: actionBar
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: statusBar.top
        height: root.actionBarEffectiveHeight
        compact: root.useCompactChrome
        Behavior on height {
            NumberAnimation {
                duration: Theme.motionNormal
                easing.type: Easing.OutCubic
            }
        }
    }

    StatusBar {
        id: statusBar
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        height: root.statusBarEffectiveHeight
        compact: root.useCompactChrome
        Behavior on height {
            NumberAnimation {
                duration: Theme.motionNormal
                easing.type: Easing.OutCubic
            }
        }
    }

    SettingsDrawer {
        id: settingsDrawer
        anchors.fill: parent
        open: App.showSettings
        onOpenChanged: {
            if (open !== App.showSettings)
                App.showSettings = open
        }
    }

    BuyCreditsDrawer {
        id: buyCreditsDrawer
        anchors.fill: parent
        open: App.showBuyCredits
        onOpenChanged: {
            if (open !== App.showBuyCredits)
                App.showBuyCredits = open
        }
    }

    HelpDrawer {
        id: helpDrawer
        anchors.top: parent.top
        anchors.bottom: parent.bottom
        anchors.right: parent.right
    }

    NotificationCenter {
        id: notifPanel
        anchors.top: topBar.bottom
        anchors.right: parent.right
        anchors.rightMargin: 12
    }

    WhatsNewModal {
        id: whatsNew
        anchors.fill: parent
    }


    OnboardingTour {
        id: tour
        anchors.fill: parent
    }

    // Critical low-credits bar while session is live
    Rectangle {
        id: criticalCreditsBar
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: actionBar.top
        height: visible ? 44 : 0
        z: 60
        visible: {
            if (!Session.isActive) return false
            var bal = Auth.creditBalance + (Auth.bonusBalance || 0)
            var rate = Session.creditsPerSecond || 2
            return rate > 0 && (bal / rate) < 15
        }
        color: Colors.statusErrorMuted
        border.color: Colors.statusError
        border.width: 1

        RowLayout {
            anchors.fill: parent
            anchors.leftMargin: 16
            anchors.rightMargin: 12
            spacing: 12
            Icon {
                name: "alert-circle"
                size: 14
                color: Colors.statusError
                anchors.verticalCenter: parent.verticalCenter
            }
            Text {
                Layout.fillWidth: true
                text: qsTr("Credits almost gone — session will end soon")
                color: Colors.textPrimary
                font.pixelSize: 12
                font.weight: Font.DemiBold
                elide: Text.ElideRight
            }
            PrimaryButton {
                text: qsTr("Buy credits")
                implicitHeight: 32
                onClicked: App.openBuyCredits()
            }
            GhostButton {
                text: qsTr("Stop")
                onClicked: Session.stopSession()
            }
        }
        Behavior on height { NumberAnimation { duration: Theme.motionFast } }
    }

    // Global shortcuts
    Shortcut {
        sequence: "Ctrl+B"
        onActivated: {
            if (root.narrowLayout)
                root.workshopDrawerOpen = !root.workshopDrawerOpen
            else
                Config.workshopCollapsed = !Config.workshopCollapsed
        }
    }
    Shortcut {
        sequence: "Ctrl+E"
        onActivated: Config.promptBarVisible = !Config.promptBarVisible
    }

    Connections {
        target: Auth
        function onSignedOut() {
            if (Camera.isActive)
                Camera.stop()
            if (Session && Session.isActive)
                Session.stopSession()
        }
        function onSignedIn() {
            if (Config.startWithCamera && !Camera.isActive)
                Camera.start()
            // First-run tour only after successful sign-in
            if (!Config.onboardingDone)
                Qt.callLater(function() {
                    tour.registerTargets(topBar, stageArea, workshop, actionBar)
                    tour.start()
                })
        }
    }

    Component.onCompleted: {
        tour.registerTargets(topBar, stageArea, workshop, actionBar)
        if (Auth.isAuthenticated && Config.startWithCamera)
            Camera.start()
        Recording.scanOrphans()
        if (Catalog.count === 0)
            Catalog.load()
        Backend.fetchCatalog()
        if (Presets.count === 0)
            Presets.load()

        if (Auth.isAuthenticated && !Config.onboardingDone)
            Qt.callLater(function() {
                tour.registerTargets(topBar, stageArea, workshop, actionBar)
                tour.start()
            })

        var ver = Backend.appVersion || "1.0.0"
        if (Config.whatsNewSeenVersion !== ver)
            Qt.callLater(function() { whatsNew.open = true })
    }

    Connections {
        target: App
        function onShowWhatsNewChanged() {
            if (App.showWhatsNew) {
                whatsNew.open = true
                App.showWhatsNew = false
            }
        }
        function onHelpRequested() {
            helpDrawer.open = true
        }
        function onShowSettingsChanged() {
            settingsDrawer.open = App.showSettings
        }
        function onShowBuyCreditsChanged() {
            buyCreditsDrawer.open = App.showBuyCredits
        }
        function onShowTourChanged() {
            if (App.showTour) {
                tour.registerTargets(topBar, stageArea, workshop, actionBar)
                tour.start()
                App.showTour = false
            }
        }
    }
}
