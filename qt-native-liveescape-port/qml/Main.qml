import QtQuick
import QtQuick.Controls
import QtQuick.Window
import SmokeScreen

ApplicationWindow {
    id: win
    visible: true
    // Electron main.js: 1200×800 hidden → maximize+show on ready-to-show
    minimumWidth: 900
    minimumHeight: 600
    title: qsTr("Smoke Screen")
    color: Theme.bg
    // Visual-regression mode: always-on-top so captures are pure window pixels
    flags: kNoMaximize ? Qt.WindowStaysOnTopHint : Qt.Window
    // Fixed capture geometry (1280×832) when SMOKE_NO_MAXIMIZE is set
    width: kNoMaximize ? 1280 : 1200
    height: kNoMaximize ? 832 : 800

    Component.onCompleted: {
        // Electron parity: maximize on launch — unless a fixed geometry
        // is requested (visual-regression captures at 1280×832).
        if (!kNoMaximize)
            showMaximized()
    }

    // ── Screen router (App.screen: preloader|auth|accessGate|dashboard|maintenance) ──
    Loader {
        id: screenLoader
        anchors.fill: parent
        sourceComponent: {
            // Capture override (visual regression) — bypasses routing guards
            if (kForceScreen === "accessGate") return gateComp
            if (kForceScreen === "dashboard") return dashComp
            if (kForceScreen === "auth") return authComp
            if (kForceScreen === "preloader") return preloaderComp
            switch (App.screen) {
            case "preloader":   return preloaderComp
            case "auth":        return authComp
            case "accessGate":  return gateComp
            case "dashboard":   return dashComp
            case "maintenance": return maintComp
            default:            return preloaderComp
            }
        }
    }

    Component { id: preloaderComp; PreloaderScreen {} }
    Component { id: authComp; AuthScreen {} }
    Component { id: gateComp; AccessGateScreen {} }
    Component { id: dashComp; DashboardScreen {} }

    // Fullscreen toggle requested from the dashboard stage (⛶ / theatre)
    Connections {
        target: screenLoader.item
        ignoreUnknownSignals: true
        function onToggleFullscreenRequested() {
            win.visibility = win.visibility === Window.FullScreen ? Window.Windowed : Window.FullScreen
        }
    }

    // ── Overlays (reference z-order) ──
    GateBlocker {}       // 99999
    ForceUpdateModal {}  // 9999
    LockScreen {}        // 9999
    StarterLockScreen {} // 9998
    AbuseReportModal {}  // 650
    UpgradeModal {}      // 650
    NotificationModal {} // 650
    ConsentModal {}      // 600 (boot gate)
    StreamConsentModal {}// 600
    ExpiryModal {}       // 600
    PayModal {}          // 600
    AccountModal {}      // 600
    PaySuccessModal {}   // 700
    FreeCreditsModal {}  // 550
    WelcomeModal {}      // 540
    StarterPayModal {}   // 525
    GetStartedModal {}   // 520
    PlanGateModal {}     // 500
    BackgroundPanel {}   // 550
    PaymentStatusModal {}// 540
    AdminModal {}        // 900
    TutorialsModal {}    // 10002
    OnboardingOverlay {} // 610
    TourOverlay {        // 9997-10001
        dashboard: screenLoader.item
    }
    Toast {}             // 9999
    Component {
        id: maintComp
        Item {
            anchors.fill: parent
            Rectangle { anchors.fill: parent; color: "#0a0a12" }
            Text {
                anchors.centerIn: parent
                text: App.maintenanceMessage || qsTr("Smoke Screen is undergoing scheduled maintenance. Please check back soon.")
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 12
                horizontalAlignment: Text.AlignHCenter
            }
        }
    }
}
