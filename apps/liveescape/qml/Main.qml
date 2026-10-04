import QtQuick
import QtQuick.Controls
import QtQuick.Window
import LiveEscape

ApplicationWindow {
    id: win
    visible: true
    width: 1360
    height: 860
    minimumWidth: 1100
    minimumHeight: 700
    title: qsTr("Live Escape")
    color: Theme.bg

    Component.onCompleted: {
        showMaximized()
        ResponsiveHelper.syncViewport(win.width)
    }
    onWidthChanged: ResponsiveHelper.syncViewport(win.width)

    // Maintenance Blocker — z-index 100000, blocks ALL content
    MaintenanceBlocker {}

    // Gate Blocker — FAIL-CLOSED: z-index 99999, shows while boot resolves
    GateBlocker {}

    // Offline API strip
    Rectangle {
        id: offlineBanner
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        height: visible ? 32 : 0
        z: 900
        visible: !Api.reachable && App.screen !== "preloader"
        color: Theme.warnDim
        border.color: Theme.gold
        border.width: 1
        Row {
            anchors.centerIn: parent
            spacing: 12
            Text {
                text: qsTr("API offline — start the backend or check the server URL")
                color: Theme.gold
                font.family: Theme.fontMono
                font.pixelSize: 11
            }
            Text {
                text: qsTr("Retry")
                color: Theme.text
                font.family: Theme.fontUi
                font.pixelSize: 12
                font.bold: true
                MouseArea {
                    anchors.fill: parent
                    anchors.margins: -4
                    cursorShape: Qt.PointingHandCursor
                    onClicked: Api.ping()
                }
            }
        }
        Behavior on height { NumberAnimation { duration: Theme.motionFast } }
    }

    Loader {
        id: screenLoader
        anchors.top: offlineBanner.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        property var dashItem: item
        sourceComponent: {
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
    Component {
        id: maintComp
        Item {
            Rectangle { anchors.fill: parent; color: Theme.bg }
            Column {
                anchors.centerIn: parent
                width: parent.width
                spacing: 16
                Text {
                    width: parent.width
                    horizontalAlignment: Text.AlignHCenter
                    text: qsTr("MAINTENANCE")
                    color: Theme.gold
                    font.family: Theme.fontUi
                    font.pixelSize: 24
                    font.bold: true
                    font.letterSpacing: 4
                }
                Text {
                    width: parent.width
                    horizontalAlignment: Text.AlignHCenter
                    text: qsTr("Live Escape is temporarily unavailable.\nPlease try again later.")
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 12
                }
            }
        }
    }

    AccountModal {}
    PlanGateModal {}
    PayModal {}
    ConsentModal {}
    WelcomeModal {}
    TutorialsModal {}
    TourOverlay {
        dashboard: screenLoader.dashItem
    }
    BackgroundPanel {}
    AbuseReportModal {}
    UpgradeModal {}
    NotificationModal {}
    PaymentStatusModal {}
    CryptoProofModal {}
    FreeCreditsModal {}
    ExpiryModal {}
    StreamConsentModal {}
    LockScreen {}
    AdminModal {}
    ForceUpdateModal {}
    OnboardingOverlay {}
    GetStartedModal {}
    StarterPayModal {}
    StarterLockScreen {}
    PaySuccessModal {}
    DownloadsScreen { visible: App.showDownloads; z: 750 }
    SettingsScreen { visible: App.showSettings; z: 800 }

    Toast {
        message: App.toastMessage
        kind: App.toastKind
    }

    // F toggles fullscreen (skip when typing in text fields)
    // Ctrl+Shift+A intentionally blocked (matches Electron — admin panel disabled for security)
    Item {
        anchors.fill: parent
        focus: true
        Keys.onPressed: (event) => {
            if (event.modifiers & Qt.ControlModifier && event.modifiers & Qt.ShiftModifier
                && (event.key === Qt.Key_A)) {
                event.accepted = true;
                return;
            }
            if (event.key === Qt.Key_F && !(event.modifiers & Qt.ControlModifier)) {
                var f = win.activeFocusItem;
                if (!f || (f.toString().indexOf("TextEdit") === -1 && f.toString().indexOf("TextField") === -1)) {
                    win.visibility = (win.visibility === Window.FullScreen) ? Window.Windowed : Window.FullScreen;
                    event.accepted = true;
                }
            }
        }
    }
}
