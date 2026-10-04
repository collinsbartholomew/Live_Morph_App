import LiveMorph
import QtQuick
import QtQuick.Controls
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
            previewWin.destroyed.connect(function() { previewWin = null; });
        }

        previewWin.show();
        previewWin.raise();
        previewWin.requestActivate();
    }

    function openPopout() {
        if (!popoutWin) {
            popoutWin = popoutComponent.createObject(null);
            popoutWin.destroyed.connect(function() { popoutWin = null; });
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

    visible: true
    width: 1280
    height: 800
    minimumWidth: 1024
    minimumHeight: 640
    title: "LiveMorph"
    color: Colors.surfaceBase
    flags: Qt.Window | Qt.FramelessWindowHint

    // Global Escape key: close the topmost open overlay (modal / drawer / sheet).
    Item {
        id: escapeHandler
        anchors.fill: parent
        focus: true
        Keys.onEscapePressed: function(event) {
            if (App.showLockScreen) { App.showLockScreen = false; event.accepted = true; }
            else if (checkoutSheet.visible) { checkoutSheet.close(); event.accepted = true; }
            else if (shortcutsSheet.visible) { shortcutsSheet.close(); event.accepted = true; }
            else if (App.showSettings) { App.showSettings = false; event.accepted = true; }
            else if (App.showBuyCredits) { App.showBuyCredits = false; event.accepted = true; }
            else if (App.showDownloads) { App.showDownloads = false; event.accepted = true; }
            else if (App.showWhatsNew) { App.showWhatsNew = false; event.accepted = true; }
            else if (App.showTour) { App.showTour = false; event.accepted = true; }
        }
    }


    Connections {
        target: Backend
        function onStreamingAvailabilityChanged() {
            PlatformSettings.streamingUnavailable = Backend.streamingUnavailable
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
        z: 100
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
        z: 90
    }

    // Connectivity strip
    Rectangle {
        id: offlineBanner

        anchors.top: paymentBanner.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        height: visible ? 32 : 0
        visible: !Backend.reachable
        z: 89
        color: Colors.statusWarningMuted
        border.color: "#f59e0b40"
        border.width: 1

        Row {
            anchors.centerIn: parent
            spacing: 10

            Icon {
                name: "alert-circle"
                size: 14
                color: Colors.statusWarning
                anchors.verticalCenter: parent.verticalCenter
            }

            Text {
                text: qsTr("Can't reach the LiveMorph API — check that the backend is running and the URL in Settings")
                color: Colors.textPrimary
                font.pixelSize: 12
                anchors.verticalCenter: parent.verticalCenter
            }

            GhostButton {
                text: qsTr("Retry")
                anchors.verticalCenter: parent.verticalCenter
                onClicked: Backend.ping()
            }

        }

        Behavior on height {
            NumberAnimation {
                duration: Theme.motionFast
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
        z: 120
        color: Colors.surfaceBase

        Column {
            anchors.centerIn: parent
            spacing: 24
            Image {
                source: "qrc:/assets/livemorph-icon.png"
                width: 44
                height: 44
                opacity: 0.9
                fillMode: Image.PreserveAspectFit
                anchors.horizontalCenter: parent.horizontalCenter
            }
            // Icon disc (Electron: h-14 w-14 rounded-full border surface-border)
            Rectangle {
                width: 56
                height: 56
                radius: 28
                color: Colors.surfaceOverlay
                border.color: Colors.surfaceBorder
                border.width: 1
                anchors.horizontalCenter: parent.horizontalCenter
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
                font.weight: Font.DemiBold
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
            opacity: active ? 1 : 0

            Behavior on opacity {
                NumberAnimation {
                    duration: 160
                }

            }

        }

        Loader {
            anchors.fill: parent
            active: root.page === "dashboard"
            source: "pages/Dashboard.qml"
            opacity: active ? 1 : 0

            Behavior on opacity {
                NumberAnimation {
                    duration: 160
                }

            }

        }

        Loader {
            anchors.fill: parent
            active: root.page === "settings"
            source: "pages/Settings.qml"
            opacity: active ? 1 : 0

            Behavior on opacity {
                NumberAnimation {
                    duration: 160
                }

            }

        }

        Loader {
            anchors.fill: parent
            active: root.page === "buy-credits"
            source: "pages/BuyCredits.qml"
            opacity: active ? 1 : 0

            Behavior on opacity {
                NumberAnimation {
                    duration: 160
                }

            }

        }

    }

    NotificationToastHost {
        id: toast
    }

    ShortcutsSheet {
        id: shortcutsSheet
    }

    // Global shortcuts
    Shortcut {
        sequence: "Space"
        enabled: App.currentPage === "dashboard" && Auth.isAuthenticated
        onActivated: {
            if (hasTextFocus())
                return ;

            if (Session.isActive)
                Session.stopSession();
            else
                App.startSwap();
        }
    }

    Shortcut {
        sequence: "Escape"
        onActivated: {
            if (shortcutsSheet.open)
                shortcutsSheet.open = false;
            else if (App.showSettings)
                App.showSettings = false;
            else if (App.showBuyCredits)
                App.showBuyCredits = false;
        }
    }

    Shortcut {
        sequence: "?"
        onActivated: shortcutsSheet.toggle()
    }

    Shortcut {
        id: recordShortcut

        sequence: "F12"
        enabled: App.currentPage === "dashboard" && Auth.isAuthenticated
        onActivated: {
            if (Recording.isRecording) {
                Recording.stopRecording("user");
                toast.show("Recording stopped", "info");
            } else {
                Recording.startRecording(Session.activeCharacterId);
                toast.show("Recording started", "success");
            }
        }
    }

    Shortcut {
        sequence: "Ctrl+P"
        onActivated: openPreview()
    }

    Shortcut {
        sequence: "Ctrl+Shift+P"
        onActivated: openPopout()
    }

    Component {
        id: previewComponent

        PreviewWindow {
        }

    }

    Component {
        id: popoutComponent

        PopoutWindow {
        }

    }

    DownloadsScreen {
        visible: App.showDownloads
        z: 200
    }

    LockScreen {
    }

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
            toast.show("Recording saved", "success", path, "Reveal", function() {
                Recording.revealPath(path);
            });
        }

        function onRecordingFailed(message) {
            toast.show("Recording error", "error", message);
        }

        target: Recording
    }

    Connections {
        // Electron stage.characterSwitchFailed: warning toast — the previous
        // look keeps running; do not tear the session down.
        target: Session
        function onCharacterSwitchFailed() {
            toast.show(qsTr("Couldn't switch character"), "warning",
                       qsTr("Your previous look is still running, so try picking it again."))
        }
    }

    Connections {
        function onReachableChanged() {
            if (!Backend.reachable)
                toast.show("Backend offline — set the API URL in Settings or LIVEMORPH_API_URL env var", "warning");
            else
                toast.show("Connected to backend", "success");
        }

        target: Backend
    }

    Connections {
        function onRequestFailed(ep, err) {
            if (ep.indexOf("recording") >= 0 || ep.indexOf("stream") >= 0 || ep.indexOf("payment") >= 0 || ep.indexOf("update") >= 0)
                toast.show("Backend: " + ep, "warning", err);

        }

        function onUpdateCheckResult(result) {
            var avail = result.available === true || result.update_available === true;
            if (avail)
                toast.show("Update available", "info", result.version || result.message || "A newer version is ready");
            else
                toast.show("You're up to date", "success", result.message || ("v" + (App.appVersion || "")));
        }

        function onPaymentOrderVerified(result) {
            if (result.in_flight) {
                paymentBanner.statusHint = result.crypto_status || "confirming";
                return ;
            }
            paymentBanner.active = false;
            checkoutSheet.statusText = qsTr("Payment confirmed");
            checkoutSheet.close();
            toast.show("Payment confirmed", "success", "Balance updated");
            Auth.refreshProfile();
        }

        function onPaymentOrderStatusReceived(status) {
            if (status.crypto_status)
                paymentBanner.statusHint = status.crypto_status;

            if (status.provisioned || status.status === "provisioned") {
                paymentBanner.active = false;
                toast.show("Payment confirmed", "success", "Balance updated");
                Auth.refreshProfile();
            }
        }

        function onVirtualCameraStarted(r) {
            toast.show("Virtual camera started", "success");
        }

        function onVirtualCameraStopped(r) {
            toast.show("Virtual camera stopped", "info");
        }

        target: Backend
    }

    CheckoutSheet {
        id: checkoutSheet

        anchors.fill: parent
        onCompleted: function(orderId, reference) {
            if (orderId && orderId.length)
                Backend.verifyPaymentOrder(orderId, reference || "");

            Auth.refreshProfile();
            checkoutSheet.statusText = qsTr("Verifying payment…");
        }
    }

}
