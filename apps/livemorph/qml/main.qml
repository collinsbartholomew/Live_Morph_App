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
        if (!previewWin)
            previewWin = previewComponent.createObject(null);

        previewWin.show();
        previewWin.raise();
        previewWin.requestActivate();
    }

    function openPopout() {
        if (!popoutWin)
            popoutWin = popoutComponent.createObject(null);

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

        anchors.top: titleBar.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        z: 90
    }

    // Connectivity strip
    Rectangle {
        id: offlineBanner

        anchors.top: paymentBanner.visible ? paymentBanner.bottom : titleBar.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        height: visible ? 32 : 0
        visible: !Backend.reachable
        z: 89
        color: Colors.statusWarningMuted
        border.color: Colors.statusWarning
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

    Item {
        id: content

        anchors.top: offlineBanner.visible ? offlineBanner.bottom : (paymentBanner.visible ? paymentBanner.bottom : titleBar.bottom)
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

            if (Session.active)
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

        function onStreamStarted(r) {
            toast.show("Stream started", "success");
        }

        function onStreamStopped(r) {
            toast.show("Stream stopped", "info");
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
