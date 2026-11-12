import LiveMorph
import LiveMorph as LM
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import QtQuick.Window

ApplicationWindow {
    id: root

    readonly property string page: App.currentPage
    property var previewWin: null
    property var popoutWin: null

    // True while a text-editing control has focus — used to keep global
    // shortcuts (Space) from hijacking typed text.
    function hasTextFocus() {
        const fi = activeFocusItem;
        if (!fi)
            return false;

        return fi instanceof TextField || fi instanceof TextInput || fi instanceof TextArea;
    }

    function openPreview() {
        if (!previewWin) {
            previewWin = previewComponent.createObject(null);
            if (!previewWin)
                return;
            previewWin.destroyed.connect(function () {
                previewWin = null;
            });
        }

        previewWin.show();
        previewWin.raise();
        previewWin.requestActivate();
    }

    function openPopout() {
        if (!popoutWin) {
            popoutWin = popoutComponent.createObject(null);
            if (!popoutWin)
                return;
            popoutWin.destroyed.connect(function () {
                popoutWin = null;
            });
        }

        popoutWin.show();
        popoutWin.raise();
    }

    // Expose helpers for child pages
    function openCheckout(url, orderId) {
        checkoutSheet.openCheckout(url, orderId);
    }

    function startPaymentFlight(orderId, mode) {
        paymentBanner.start(orderId, mode || "card");
    }

    function stopPaymentFlight() {
        paymentBanner.active = false
        paymentBanner.orderId = ""
        paymentBanner.pollCount = 0
    }

    // A sign-out mid-checkout must not leave the payment banner polling an
    // order that no longer belongs to the (now anonymous) session.
    Connections {
        target: Auth
        function onSignedOut() { stopPaymentFlight() }
    }

    visible: true
    width: 1280
    height: 800
    // Smallest useful layout: fits 1024x768 / 1280x720 laptops; the
    // dashboard switches to narrow layout below Theme.narrowBreakpoint.
    minimumWidth: 1024
    minimumHeight: 640
    title: Constants.appName
    color: Colors.surfaceBase
    flags: Qt.Window | Qt.FramelessWindowHint

    // (The old escapeHandler Item was dead code — the window-level Escape
    // Shortcut above consumes the key before any Keys.onEscapePressed.)

    Component.onCompleted: PlatformSettings.streamingUnavailable = Backend.streamingUnavailable
    Connections {
        target: Backend
        function onStreamingAvailabilityChanged() {
            PlatformSettings.streamingUnavailable = Backend.streamingUnavailable;
        }
    }
    // Force dark chrome — prevents system light overlays on controls
    palette.window: Colors.surfaceBase
    palette.windowText: Colors.textPrimary
    palette.base: Colors.surfaceOverlay
    palette.text: Colors.textPrimary
    palette.button: Colors.surfaceRaised
    palette.buttonText: Colors.textPrimary
    palette.highlight: Colors.accent
    palette.highlightedText: Colors.surfaceBase
    // Rich-text <a> links ignore their inline style color in the Basic style —
    // without these, links render in the OS default blue/purple, breaking the
    // monochrome Obsidian Hex directive.
    palette.link: Colors.accent
    palette.linkVisited: Colors.textSecondary
    palette.mid: Colors.surfaceBorder
    palette.dark: Colors.surfaceBase
    palette.light: Colors.surfaceOverlay
    palette.toolTipBase: Colors.surfaceElevated
    palette.toolTipText: Colors.textPrimary

    TitleBar {
        id: titleBar

        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        height: Theme.titleBarHeight
        z: Theme.zTitleBar
        onCloseRequested: App.quitApp()
        onMinimizeRequested: root.showMinimized()
        onMaximizeRequested: {
            if (root.visibility === Window.Maximized)
                root.showNormal();
            else
                root.showMaximized();
        }
    }

    PaymentInFlightBanner {
        id: paymentBanner

        onOpenPanel: App.openBuyCredits()

        anchors.top: titleBar.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        z: Theme.zBanner
    }

    // Connectivity strip
    Rectangle {
        id: offlineBanner

        anchors.top: paymentBanner.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        height: visible ? 32 : 0
        // reachableKnown gates the banner: no "offline" flash on cold start
        // before the first ping has completed.
        visible: Backend.reachableKnown && !Backend.reachable
        z: Theme.zOfflineBanner
        color: Colors.statusWarningMuted
        border.color: Colors.statusWarning40
        border.width: 1

        RowLayout {
            anchors.fill: parent
            anchors.leftMargin: 12
            anchors.rightMargin: 12
            spacing: 10

            Icon {
                name: "alert-circle"
                size: 14
                color: Colors.statusWarning
                Layout.alignment: Qt.AlignVCenter
            }

            Text {
                text: qsTr("Can't reach the LiveMorph API — check that the backend is running and the URL in Settings")
                color: Colors.textPrimary
                font.pixelSize: 12
                Layout.alignment: Qt.AlignVCenter
                Layout.fillWidth: true
                elide: Text.ElideRight
            }

            GhostButton {
                text: qsTr("Retry")
                Layout.alignment: Qt.AlignVCenter
                onClicked: Backend.ping()
            }
        }

    }

    // Maintenance gate (Electron AppGate Mf) — anchored BELOW the TitleBar so
    // the frameless window stays draggable/minimizable during maintenance.
    Rectangle {
        id: maintenanceOverlay
        anchors.top: titleBar.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        visible: Backend.maintenance
        z: Theme.zMaintenance
        color: Colors.surfaceBase
        clip: true

        Honeycomb {
            anchors.fill: parent
            cellSize: Theme.honeycombCellLg
            cellSize2: Theme.honeycombCellLg * 3
            cellSize2Alpha: 0.45
            lineColor: Colors.honeycombOnBlack
            opacity: 0.8
            focusX: width / 2
            focusY: height / 2
            fadeRadius: Math.max(width, height) * 0.75
            glowAlpha: 0.05
            sparkleEvery: 23
            sparkleAlpha: 0.07
            emphasisEvery: 7
            constellationEvery: 53
            constellationAlpha: 0.2
            featureHex: 180
            featureHexAlpha: 0.5
        }

        Column {
            anchors.centerIn: parent
            spacing: 24
            // Brand monogram over the maintenance alert
            Item {
                width: 64; height: 64
                anchors.horizontalCenter: parent.horizontalCenter
                BrandMark {
                    anchors.centerIn: parent
                    size: 60
                    letter: ""
                    lineWidth: 1.5
                    lineColor: Colors.surfaceBorderStrong
                    fillColor: Colors.surfaceOverlay
                    letterColor: Colors.accent
                }
                Icon {
                    anchors.centerIn: parent
                    name: "alert-circle"
                    size: 24
                    color: Colors.accent
                }
            }
            Text {
                text: qsTr("Under maintenance")
                color: Colors.textPrimary
                font.pixelSize: 20
                font.weight: Font.Bold
                anchors.horizontalCenter: parent.horizontalCenter
            }
            Text {
                text: qsTr("LiveMorph is undergoing scheduled maintenance. Please check back soon.")
                color: Colors.textSecondary
                font.pixelSize: 14
                lineHeight: 1.625
                anchors.horizontalCenter: parent.horizontalCenter
            }
            PrimaryButton {
                text: qsTr("Retry")
                anchors.horizontalCenter: parent.horizontalCenter
                onClicked: Backend.fetchMaintenance()
            }
        }
    }

    Item {
        id: content

        anchors.top: offlineBanner.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom

        Loader {
            anchors.fill: parent
            active: root.page === "auth"
            source: "pages/AuthScreen.qml"
        }

        Loader {
            anchors.fill: parent
            active: root.page === "dashboard"
            source: "pages/Dashboard.qml"
        }

    }

    // NOTE: the toast host is NOT window-level — it lives inside each page
    // (Dashboard/AuthScreen) at Theme.zToast so drawers, sheets and dialogs
    // (z ≥ 150) inside the page layer actually paint above the toast stack.

    ShortcutsSheet {
        id: shortcutsSheet
    }

    // Global shortcuts
    Shortcut {
        sequence: "Space"
        enabled: App.currentPage === "dashboard" && Auth.isAuthenticated && !App.showLockScreen
        onActivated: {
            if (hasTextFocus())
                return;
            const af = activeFocusItem
            // Qualified check: the unqualified `Switch` can resolve to
            // Controls.Switch (import order), which would never match the
            // app's custom toggle and Space would hijack it mid-toggle.
            // Items flagged spaceToggles (e.g. consent rows) own Space too.
            if (af && (af instanceof LM.Switch || af instanceof Button || af.spaceToggles === true))
                return; // let the focused control handle Space

            if (Session.isActive)
                Session.stopSession();
            else if (Session.cooldownActive)
                Notifier.push(qsTr("Cooldown active, %1s left").arg(Session.cooldownRemainingSec), "", "info");
            else if (!CameraCtrl.isActive)
                Notifier.push(qsTr("Camera is off"), qsTr("Turn the camera on in the stage controls before starting the swap."), "warning");
            else
                App.startSwap();
        }
    }

    // Global Escape: window-level Shortcuts consume the key BEFORE any
    // focused item's Keys.onEscapePressed — this single handler owns the
    // WHOLE close stack (topmost first), ending with App.requestEscape()
    // for dashboard-local overlays (tour/help/notifications).
    Shortcut {
        sequence: "Escape"
        onActivated: {
            // A non-dismissable lock (e.g. credits) swallows Escape entirely —
            // it must not close overlays behind it.
            if (App.showLockScreen) {
                if (App.lockDismissable)
                    App.showLockScreen = false;
                return
            }
            // A focused revert-on-Escape field (e.g. the prompt box) gets the
            // key first — the window Shortcut would otherwise swallow it before
            // the field's Keys.onEscapePressed can fire.
            const af = activeFocusItem
            if (af && af instanceof LM.TextField && af.escapeReverts) {
                af.escapeRevertRequested()
                return
            }
            if (App.openModals > 0) {
                App.requestModalEscape()
                return
            }
            if (checkoutSheet.visible)
                checkoutSheet.close();
            else if (shortcutsSheet.open)
                shortcutsSheet.open = false;
            else if (App.showSettings)
                App.showSettings = false;
            else if (App.showBuyCredits)
                App.showBuyCredits = false;
            else if (App.showDownloads)
                App.showDownloads = false;
            else if (App.showWhatsNew)
                App.showWhatsNew = false;
            else if (App.showTour)
                App.showTour = false;
            else
                App.requestEscape();
        }
    }

    Shortcut {
        sequence: "?"
        enabled: App.currentPage === "dashboard" && !hasTextFocus()
        onActivated: shortcutsSheet.toggle()
    }

    Shortcut {
        id: recordShortcut

        sequence: "F12"
        enabled: App.currentPage === "dashboard" && Auth.isAuthenticated && !App.showLockScreen
        onActivated: {
            // A start/stop transition is in flight — a second F12 would
            // cross-wire the finalize path onto the new recording.
            if (Recording.transitioning)
                return;
            if (Recording.isRecording) {
                Recording.stopRecording("user");
                Notifier.push(qsTr("Recording stopped"), "", "info", "recording");
            } else {
                // Only toast "started" when the recorder actually started —
                // startRecording returns false on no-source/unwritable-dir/etc.
                if (Recording.startRecording(Session.activeCharacterId))
                    Notifier.push(qsTr("Recording started"), "", "success", "recording");
            }
        }
    }

    Shortcut {
        sequence: "Ctrl+P"
        enabled: App.currentPage === "dashboard"
        onActivated: openPreview()
    }

    Shortcut {
        sequence: "Ctrl+Shift+P"
        enabled: App.currentPage === "dashboard"
        onActivated: openPopout()
    }

    Component {
        id: previewComponent

        PreviewWindow {}
    }

    Component {
        id: popoutComponent

        PopoutWindow {}
    }

    DownloadsScreen {
        visible: App.showDownloads
        z: Theme.zDrawer
    }

    LockScreen {}

    Connections {
        function onPreviewRequested() {
            openPreview();
        }

        function onPopoutRequested() {
            openPopout();
        }

        target: App
    }

    Connections {
        function onRecordingSaved(path) {
            // Inbox entry (category "recording" — click in the center reveals
            // the file); the toast mirror shows it transiently.
            Notifier.push(qsTr("Recording saved"), path, "success", "recording");
        }

        function onRecordingFailed(message) {
            Notifier.push(qsTr("Recording error"), message, "error", "recording");
        }

        target: Recording
    }

    Connections {
        // Electron stage.characterSwitchFailed: warning toast — the previous
        // look keeps running; do not tear the session down.
        target: Session
        function onCharacterSwitchFailed() {
            Notifier.push(qsTr("Couldn't switch character"), qsTr("Your previous look is still running, so try picking it again."), "warning");
        }
    }

    Connections {
        // Server-side insufficient-credits ends the session — route the user
        // straight to top-up instead of leaving them staring at a dead stage.
        target: Session
        function onConnectionStatusChanged() {
            if (Session.status === SessionManager.InsufficientCredits)
                App.openBuyCredits()
        }
    }

    Connections {
        function onReachableChanged() {
            if (!Backend.reachable)
                Notifier.push(qsTr("Backend offline — set the API URL in Settings or LIVEMORPH_API_URL env var"), "", "warning");
            else
                Notifier.push(qsTr("Connected to backend"), "", "success");
        }

        target: Backend
    }

    Connections {
        function onRequestFailed(ep, err) {
            // Surface all endpoint failures (credits/catalog/characters were
            // silently dropped before); /health is covered by the offline banner.
            if (ep.indexOf("/health") >= 0)
                return;
            Notifier.push(qsTr("Backend: %1").arg(ep), err, "warning");
        }

        function onUpdateCheckResult(result) {
            var avail = result.available === true || result.update_available === true;
            if (avail)
                Notifier.push(qsTr("Update available"), result.latest_version || result.version || result.message || qsTr("A newer version is ready"), "info", "update");
            else
                Notifier.push(qsTr("You're up to date"), result.message || ("v" + (App.appVersion || "")), "success");
        }

        function onPaymentOrderVerified(result) {
            if (result.in_flight) {
                paymentBanner.statusHint = result.crypto_status || "confirming";
                return;
            }
            paymentBanner.active = false;
            checkoutSheet.statusText = qsTr("Payment confirmed");
            checkoutSheet.close();
            Notifier.push(qsTr("Payment confirmed"), qsTr("Balance updated"), "success", "payment");
            Auth.refreshProfile();
        }

        function onPaymentOrderStatusReceived(status) {
            if (status.crypto_status)
                paymentBanner.statusHint = status.crypto_status;

            // Terminal states stop the flight even if the "provisioned" success
            // signal was missed (e.g. deep-link return raced the poll).
            const s = String(status.status || "").toLowerCase()
            if (s === "provisioned" || s === "failed" || s === "cancelled") {
                paymentBanner.active = false
                paymentBanner.pollCount = 0
            }

            // Provisioned success UI is handled once by onPaymentOrderVerified
            // (BackendClient emits both signals for a provisioned GET) — doing
            // it here too would double the toast and the profile refresh.
        }

        function onVirtualCameraStarted(r) {
            Notifier.push(qsTr("Virtual camera started"), "", "success");
        }

        function onVirtualCameraStopped(r) {
            Notifier.push(qsTr("Virtual camera stopped"), "", "info");
        }

        target: Backend
    }

    CheckoutSheet {
        id: checkoutSheet

        anchors.fill: parent
        onCompleted: function (orderId, reference) {
            if (orderId && orderId.length)
                Backend.verifyPaymentOrder(orderId, reference || "");

            Auth.refreshProfile();
            checkoutSheet.statusText = qsTr("Verifying payment…");
        }
    }
}
