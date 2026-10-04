import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

Item {
    id: root

    // Electron layout: single fixed 360px workshop on the left — no drawer,
    // no collapse, no narrow mode (min window width 1024 fits it fine).
    readonly property bool narrowLayout: false

    // Escape key: close dashboard-specific overlays
    Keys.onEscapePressed: function(event) {
        if (helpDrawer.open) { helpDrawer.open = false; event.accepted = true; }
        else if (notifPanel.open) { notifPanel.open = false; event.accepted = true; }
    }
    focus: true
    readonly property bool useCompactChrome: Config.compactChrome || height < Theme.compactChromeBelow
    readonly property int actionBarEffectiveHeight: useCompactChrome
          ? Theme.actionBarHeightCompact
          : Theme.actionBarHeight
    readonly property int statusBarEffectiveHeight: useCompactChrome
          ? Theme.statusBarHeightCompact
          : Theme.statusBarHeight
    readonly property int promptBarEffectiveHeight: Config.promptBarVisible ? Theme.promptBarHeight : 0

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
        // Chain through the streaming banner: when hidden its height is 0, so
        // layout is unchanged — and both banners visible no longer collide.
        anchors.top: streamingUnavailableBanner.bottom
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
        onOpenStreamKit: streamKitPanel.open()
    }

    Item {
        anchors.top: topBar.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: actionBar.top

        // ── Workshop (Electron: LEFT side, fixed w-[360px], no collapse) ──
        WorkshopPanel {
            id: workshop
            width: Theme.workshopWidth
            anchors.left: parent.left
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            collapsed: false
        }

        Item {
            id: stageArea
            anchors.left: workshop.right
            anchors.top: parent.top
            // Drive the resize via an animated bottomMargin (the instant
            // anchor-target flip made hiding the prompt bar jump).
            anchors.bottom: parent.bottom
            anchors.bottomMargin: promptBar.height
            anchors.right: parent.right

            // Electron stage box: aspect-video 16:9, max-w 880px, centered in
            // the column with 24px padding — a letterboxed box, not full-bleed.
            Item {
                id: stageBox
                readonly property real maxW: Math.min(parent.width - 48, 880)
                readonly property real w: Math.min(maxW, (parent.height - 48) * 16 / 9)
                readonly property real h: w * 9 / 16
                anchors.centerIn: parent
                width: Math.max(320, w)
                height: Math.max(180, h)

                StageFrame {
                    id: stage
                    anchors.fill: parent
                    onPopoutRequested: App.popoutRequested()
                }
            }

            InputPiP {
                id: inputPip
                anchors.left: stageBox.left
                anchors.top: stageBox.top
                anchors.leftMargin: 16
                anchors.topMargin: 16
                width: 256
                height: 144
            }

            // Cooldown overlay (Qt functional extra; Electron gates via tooltip)
            Rectangle {
                visible: Session.cooldownActive
                anchors.horizontalCenter: stageBox.horizontalCenter
                anchors.top: stageBox.top
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
                    font.family: Theme.fontMono.family
                }
            }
        }

        // Dual prompt / scene bars (collapsible) — margins symmetric with the
        // stage (12) so the bar aligns with the stage edges.
        PromptCommitBar {
            id: promptBar
            anchors.left: workshop.right
            anchors.right: parent.right
            anchors.bottom: parent.bottom
            anchors.margins: Config.promptBarVisible ? 12 : 0
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
            Behavior on opacity {
                NumberAnimation {
                    duration: Theme.motionFast
                    easing.type: Easing.OutCubic
                }
            }
        }

        // Critical low-credits bar — sibling of the prompt bar so it stacks
        // ABOVE it (the old root-level actionBar.top anchor overlapped this
        // exact band, hiding the prompt inputs mid-session).
        Rectangle {
            id: criticalCreditsBar
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.bottom: Config.promptBarVisible ? promptBar.top : parent.bottom
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

        // Electron layout keeps a single fixed workshop — no drawer/FAB/collapse.
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

    StreamKitPanel {
        id: streamKitPanel
        anchors.centerIn: parent
    }

    // Global shortcuts (Electron has no Ctrl+B — the workshop is always up)
    Shortcut {
        sequence: "Ctrl+E"
        onActivated: Config.promptBarVisible = !Config.promptBarVisible
    }
    Shortcut {
        sequence: "F12"
        onActivated: {
            if (Recording.isRecording) {
                Recording.stopRecording();
            } else {
                Recording.startRecording(Session.activeCharacterId);
            }
        }
    }
    Shortcut {
        sequence: "Ctrl+P"
        onActivated: App.openPreview()
    }
    Shortcut {
        sequence: "Ctrl+Shift+P"
        onActivated: App.openPopout()
    }

    Connections {
        target: Auth
        function onSignedOut() {
            if (CameraCtrl.isActive)
                CameraCtrl.stop()
            if (Session && Session.isActive)
                Session.stopSession()
        }
        function onSignedIn() {
            if (Config.startWithCamera && !CameraCtrl.isActive)
                CameraCtrl.start()
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
            CameraCtrl.start()
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
