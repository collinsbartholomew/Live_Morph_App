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
    title: "Live Escape"
    color: Theme.bg

    Component.onCompleted: showMaximized()

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
                spacing: 16
                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "MAINTENANCE"
                    color: Theme.gold
                    font.family: Theme.fontUi
                    font.pixelSize: 24
                    font.bold: true
                    font.letterSpacing: 4
                }
                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Live Escape is temporarily unavailable.\nPlease try again later."
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 12
                    horizontalAlignment: Text.AlignHCenter
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
    TourOverlay {}
    BackgroundPanel {}
    AbuseReportModal {}
    UpgradeModal {}
    NotificationModal {}
    PaymentStatusModal {}
    CryptoProofModal {}
    FreeCreditsModal {}
    LockScreen {}
    AdminModal {}
    CheckoutWebModal {}

    Toast {
        message: App.toastMessage
        kind: App.toastKind
    }

    // Provider: Ctrl+Shift+A opens admin (mutations still need ADMIN_SECRET)
    Keys.onPressed: (event) => {
        if (event.modifiers & Qt.ControlModifier && event.modifiers & Qt.ShiftModifier
            && (event.key === Qt.Key_A)) {
            App.showAdminPanel = true
            event.accepted = true
        }
    }
}
