import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveEscape

// Full-screen lock for session conflict, force-lock, or storage-reset.
Item {
    id: root
    anchors.fill: parent
    visible: App.showLockScreen
    z: 300

    Rectangle {
        anchors.fill: parent
        color: "#04040a"

        Column {
            anchors.centerIn: parent
            spacing: 18
            width: Math.min(parent.width - 64, 440)

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: "🔒"
                font.pixelSize: 48
            }
            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: App.lockTitle.length ? App.lockTitle : "SESSION LOCKED"
                color: Theme.gold
                font.family: Theme.fontUi
                font.pixelSize: 22
                font.bold: true
                font.letterSpacing: 2
            }
            Text {
                width: parent.width
                wrapMode: Text.WordWrap
                horizontalAlignment: Text.AlignHCenter
                text: App.lockMessage.length
                      ? App.lockMessage
                      : "This session was locked for security.\nSign in again to continue."
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 12
                lineHeight: 1.4
            }

            GoldButton {
                anchors.horizontalCenter: parent.horizontalCenter
                text: "RETURN TO LOGIN"
                onClicked: {
                    App.dismissLockScreen()
                    App.logout()
                }
            }
            GhostButton {
                anchors.horizontalCenter: parent.horizontalCenter
                text: "Dismiss"
                visible: App.lockDismissable
                onClicked: App.dismissLockScreen()
            }
        }
    }
}
