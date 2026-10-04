import QtQuick
import QtQuick.Controls
import LiveMorph

Item {
    id: root
    anchors.fill: parent
    visible: App.showLockScreen
    z: 300

    Rectangle {
        anchors.fill: parent
        color: Colors.surfaceBase

        Column {
            anchors.centerIn: parent
            spacing: 18
            width: Math.min(parent.width - 64, 440)

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: "\uD83D\uDD12"
                font.pixelSize: 48
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: App.lockTitle.length ? App.lockTitle : "SESSION LOCKED"
                color: Colors.accent
                font.pixelSize: 22
                font.weight: Font.Bold
                font.letterSpacing: 2
            }

            Text {
                width: parent.width
                wrapMode: Text.WordWrap
                horizontalAlignment: Text.AlignHCenter
                text: App.lockMessage.length
                      ? App.lockMessage
                      : "This session was locked for security.\nSign in again to continue."
                color: Colors.textSecondary
                font.pixelSize: 12
                lineHeight: 1.4
            }

            PrimaryButton {
                anchors.horizontalCenter: parent.horizontalCenter
                text: App.lockTitle.indexOf("CREDITS") >= 0 ? "BUY MORE CREDITS" : "RETURN TO LOGIN"
                onClicked: {
                    if (App.lockTitle.indexOf("CREDITS") >= 0) {
                        App.dismissLockScreen()
                        App.openBuyCredits()
                    } else {
                        App.dismissLockScreen()
                        Auth.signOut()
                    }
                }
            }

            GhostButton {
                anchors.horizontalCenter: parent.horizontalCenter
                visible: App.lockTitle.indexOf("CREDITS") >= 0
                text: qsTr("RETURN TO LOGIN")
                onClicked: {
                    App.dismissLockScreen()
                    Auth.signOut()
                }
            }

            GhostButton {
                anchors.horizontalCenter: parent.horizontalCenter
                text: qsTr("Dismiss")
                visible: App.lockDismissable
                onClicked: App.dismissLockScreen()
            }
        }
    }
}
