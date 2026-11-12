import QtQuick
import QtQuick.Layouts
import LiveMorph

Item {
    id: root

    // Narrow layout below Theme.narrowBreakpoint: the workshop shrinks so the
    // stage keeps a usable 16:9 box on small windows (min window 1024x640).
    readonly property bool narrowLayout: width < Theme.narrowBreakpoint
    readonly property int workshopEffectiveWidth: narrowLayout ? Math.min(300, width * 0.34) : Theme.workshopWidth
    readonly property bool useCompactChrome: Config.compactChrome || height < Theme.compactChromeBelow
    readonly property int actionBarEffectiveHeight: useCompactChrome
          ? Theme.actionBarHeightCompact
          : Theme.actionBarHeight
    readonly property int statusBarEffectiveHeight: Theme.statusBarHeight
    readonly property int promptBarEffectiveHeight: Config.promptBarVisible ? Theme.promptBarHeight : 0

    // (Escape for dashboard overlays is owned by the window-level Shortcut
    // in main.qml, which consumes it before any item-level handler.)
    focus: true

    Rectangle {
        id: streamingUnavailableBanner
        visible: PlatformSettings.streamingUnavailable
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        height: visible ? 36 : 0
        color: Colors.errorBannerBg
        z: Theme.zPageBanner
        RowLayout {
            anchors.fill: parent
            anchors.leftMargin: 16
            anchors.rightMargin: 12
            Text {
                text: qsTr("Streaming unavailable")
                color: Colors.statusError
                font.pixelSize: 12
                Layout.fillWidth: true
            }
            GhostButton {
                text: qsTr("Details")
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
        notifUnread: Notifier.unseenCount
        notifOpen: notifPanel.open
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

        // ── Workshop (Electron: LEFT side, fixed w-[360px], no collapse) ──
        WorkshopPanel {
            id: workshop
            width: root.workshopEffectiveWidth
            anchors.left: parent.left
            anchors.top: parent.top
            anchors.bottom: parent.bottom
        }

        Rectangle {
            id: stageArea
            color: Colors.black
            clip: true
            anchors.left: workshop.right
            anchors.top: parent.top

            // Premium honeycomb field behind the stage box (dual scale + glow)
            Honeycomb {
                anchors.fill: parent
                cellSize: Theme.honeycombCellLg
                cellSize2: Theme.honeycombCellLg * 3
                cellSize2Alpha: 0.4
                lineColor: Colors.honeycombOnBlack
                opacity: Theme.honeycombBgOpacity
                focusX: width / 2
                focusY: height / 2
                fadeRadius: Math.max(width, height) * 0.8
                glowAlpha: 0.04
                sparkleEvery: 23
                sparkleAlpha: 0.07
                emphasisEvery: 7
                constellationEvery: 53
                constellationAlpha: 0.18
                featureHex: Math.min(width, height) * 0.55
                featureHexAlpha: 0.4
            }


            // The prompt bar hides via an instant bottomMargin binding
            // (animations are banned project-wide).
            anchors.bottom: parent.bottom
            anchors.bottomMargin: promptBar.height
            anchors.right: parent.right

            // Electron stage-controls strip (h-12) at the bottom of the
            // stage column: camera picker · toggles · ENGINE · working-with.
            StageControls {
                id: stageStrip
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.bottom: parent.bottom
            }

            // Video viewport excludes the strip so the 16:9 box centers
            // in the remaining space (Electron stage column p-6 + strip).
            Item {
                id: stageViewport
                anchors.top: parent.top
                anchors.bottom: stageStrip.top
                anchors.left: parent.left
                anchors.right: parent.right

                // Electron stage box: aspect-video 16:9, max-w 880px, centered
                // in the column with 24px padding — letterboxed, not full-bleed.
                Item {
                    id: stageBox
                    readonly property real maxW: Math.min(parent.width - 48, 960)
                    readonly property real w: Math.min(maxW, (parent.height - 48) * 16 / 9)
                    readonly property real h: w * 9 / 16
                    anchors.centerIn: parent
                    width: Math.min(Math.max(320, w), parent.width)
                    height: Math.min(Math.max(180, h), parent.height)

                    StageFrame {
                        id: stage
                        anchors.fill: parent
                        onPopoutRequested: App.popoutRequested()
                    }

                    // PiP lives INSIDE the stage box — drag bounds and corner
                    // snapping are the video rect itself (Electron mounts it in
                    // [data-stage], clipped by the box). Sized relative to the
                    // stage so it never covers most of a small video.
                    InputPiP {
                        id: inputPip
                        anchors.left: stageBox.left
                        anchors.bottom: stageBox.bottom
                        anchors.leftMargin: 16
                        anchors.bottomMargin: 16
                        width: Math.max(140, Math.min(256, stageBox.width * 0.22))
                        height: width * 9 / 16
                    }

                    // Cooldown chip — pinned BELOW the STAGE/REC pill row and the
                    // top-right HUD (top 12 + 24 high), so a centered chip can
                    // never overlap them on a narrow stage.
                    Rectangle {
                        visible: Session.cooldownActive
                        anchors.horizontalCenter: stageBox.horizontalCenter
                        anchors.top: stageBox.top
                        anchors.topMargin: 44
                        width: cdLabel.implicitWidth + 20
                        height: 28
                        radius: Theme.radiusFull
                        color: Colors.scrimMid
                        Text {
                            id: cdLabel
                            anchors.centerIn: parent
                            text: qsTr("Cooldown %1s").arg(Session.cooldownRemainingSec)
                            color: Colors.statusWarning
                            font.pixelSize: 11
                            font.family: Theme.fontMono.family
                        }
                    }
                }
            }
        }

        // Dual prompt / scene bars — full-bleed strip (Electron: the strip
        // spans the whole stage column; internal px-4 handles insets).
        PromptCommitBar {
            id: promptBar
            anchors.left: workshop.right
            anchors.right: parent.right
            anchors.bottom: parent.bottom
            height: root.promptBarEffectiveHeight
            opacity: Config.promptBarVisible ? 1 : 0
            visible: height > 0
            clip: true
        }

        // Electron layout keeps a single fixed workshop — no drawer/FAB/collapse.
    }

    ActionBar {
        id: actionBar
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: statusBar.top
        height: root.actionBarEffectiveHeight
    }

    StatusBar {
        id: statusBar
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        height: root.statusBarEffectiveHeight
    }

    // Toast stack lives in the page layer (not the window) so drawers/sheets/
    // dialogs (z ≥ 150) cover it; zToast (140) keeps it above page content.
    NotificationToastHost {
        id: toastHost
        z: Theme.zToast
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

    // Click-away layer: any press outside the open notification panel closes
    // it (lost-focus behavior for the popover). Sits just under the panel, so
    // the panel's own controls keep receiving their clicks.
    MouseArea {
        anchors.fill: parent
        z: Theme.zNotificationCenter - 1
        visible: notifPanel.open
        onPressed: notifPanel.open = false
    }

    // Dropdown catcher: popups use CloseOnEscape only, so this layer closes
    // any open dropdown (account menu, camera pickers) on an outside press.
    // It CONSUMES the press so the trigger button doesn't re-toggle — fully
    // race-free (no press-time visibility capture).
    MouseArea {
        anchors.fill: parent
        z: Theme.zNotificationCenter - 2
        visible: topBar.accountMenuOpen || stageStrip.camPopupOpen || inputPip.camPopupOpen
        onPressed: {
            topBar.closeAccountMenu()
            stageStrip.closeCamPopup()
            inputPip.closeCamPopup()
        }
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

    // True while a text-editing control has focus (duck-typed via
    // selectByMouse, present on TextField/TextInput/TextArea) so the global
    // shortcut doesn't hijack typed text.
    function textEditorFocused() {
        const w = root.Window.window
        const fi = w ? w.activeFocusItem : null
        return !!(fi && fi.selectByMouse !== undefined)
    }

    // Global shortcuts (Electron has no Ctrl+B — the workshop is always up)
    Shortcut {
        sequence: "Ctrl+E"
        enabled: !root.textEditorFocused()
        onActivated: Config.promptBarVisible = !Config.promptBarVisible
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
                    tour.registerTargets({
                    top: topBar, stage: stageArea, workshop: workshop, action: actionBar,
                    engine: stageStrip ? stageStrip.tourEngine : null,
                    prompts: promptBar,
                    privacy: stageStrip ? stageStrip.tourPrivacy : null,
                    obs: actionBar ? actionBar.tourObs : null,
                    topup: topBar
                })
                    tour.start()
                })
        }
    }

    Component.onCompleted: {
        tour.registerTargets({
                    top: topBar, stage: stageArea, workshop: workshop, action: actionBar,
                    engine: stageStrip ? stageStrip.tourEngine : null,
                    prompts: promptBar,
                    privacy: stageStrip ? stageStrip.tourPrivacy : null,
                    obs: actionBar ? actionBar.tourObs : null,
                    topup: topBar
                })
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
                tour.registerTargets({
                    top: topBar, stage: stageArea, workshop: workshop, action: actionBar,
                    engine: stageStrip ? stageStrip.tourEngine : null,
                    prompts: promptBar,
                    privacy: stageStrip ? stageStrip.tourPrivacy : null,
                    obs: actionBar ? actionBar.tourObs : null,
                    topup: topBar
                })
                tour.start()
            })

        checkWhatsNew()
    }

    function checkWhatsNew() {
        var ver = Backend.appVersion || "1.0.0"
        if (Backend.appVersion.length && Config.whatsNewSeenVersion !== ver) {
            // Electron marks the version seen on OPEN — scrim-dismiss must
            // not re-show the modal on every launch.
            Config.whatsNewSeenVersion = ver
            Qt.callLater(function() { whatsNew.open = true })
        }
    }

    Connections {
        target: Backend
        function onAppVersionChanged() { root.checkWhatsNew() }
    }

    Connections {
        target: App
        function onAccountUsageRequested() {
            settingsDrawer.activeTab = "account"
        }
        function onOpenNotificationsRequested() {
            notifPanel.open = true
        }
        function onEscapeRequested() {
            // Dashboard-local overlays (window Shortcut handles global ones)
            if (topBar.accountMenuOpen)
                topBar.closeAccountMenu()
            else if (stageStrip.camPopupOpen)
                stageStrip.closeCamPopup()
            else if (inputPip.camPopupOpen)
                inputPip.closeCamPopup()
            else if (whatsNew.open) {
                Config.whatsNewSeenVersion = App.appVersion || Backend.appVersion || Constants.appVersion
                whatsNew.open = false
            }
            else if (helpDrawer.open)
                helpDrawer.open = false
            else if (notifPanel.open)
                notifPanel.open = false
            else if (tour.open) {
                Config.onboardingDone = true
                tour.open = false
            }
        }
        function onShowWhatsNewChanged() {
            if (App.showWhatsNew) {
                Config.whatsNewSeenVersion = Backend.appVersion || "1.0.0"
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
                tour.registerTargets({
                    top: topBar, stage: stageArea, workshop: workshop, action: actionBar,
                    engine: stageStrip ? stageStrip.tourEngine : null,
                    prompts: promptBar,
                    privacy: stageStrip ? stageStrip.tourPrivacy : null,
                    obs: actionBar ? actionBar.tourObs : null,
                    topup: topBar
                })
                tour.start()
                App.showTour = false
            }
        }
    }
}
