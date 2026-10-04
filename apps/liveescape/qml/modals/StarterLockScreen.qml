import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveEscape

Item {
    id: root
    anchors.fill: parent
    visible: App.showStarterLock
    z: 9998

    // Electron #starterLockScreen: radial-gradient(ellipse at 50% 0%, rgba(232,197,71,.08) 0%, rgba(4,4,10,.99) 55%)
    Rectangle {
        anchors.fill: parent
        gradient: Gradient {
            GradientStop { position: 0; color: Qt.rgba(232/255, 197/255, 71/255, 0.08) }
            GradientStop { position: 0.55; color: Theme.bg }
            GradientStop { position: 1; color: Theme.bg }
        }

        Column {
            anchors.centerIn: parent
            spacing: 18
            width: Math.min(parent.width - 64, 440)

            Text {
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                text: "🔒"
                font.pixelSize: 42
            }

            Text {
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                text: qsTr("Starter Credits Exhausted")
                color: Theme.gold
                font.family: Theme.fontUi
                font.pixelSize: 18
                font.bold: true
                font.letterSpacing: 3
            }

            Text {
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                text: qsTr("Your 500 starter credits have been used")
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 10
                font.letterSpacing: 1
            }

            Text {
                id: activationFeeText
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                wrapMode: Text.WordWrap
                text: qsTr("To continue using Live Escape, activate your license with a one-time $75 fee.\nThis unlocks permanent access and the ability to purchase credit plans.")
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 9
                font.letterSpacing: 0.5
                lineHeight: 1.7
            }

            // Activate Now button (gold gradient)
            Rectangle {
                width: parent.width
                height: 48
                radius: 10
                gradient: Gradient {
                    GradientStop { position: 0; color: "#f7d060" }
                    GradientStop { position: 0.55; color: "#f0a830" }
                    GradientStop { position: 1; color: "#d4711a" }
                }
                Text {
                    anchors.centerIn: parent
                    text: qsTr("🔓 ACTIVATE LICENSE NOW")
                    color: Theme.bg
                    font.family: Theme.fontUi
                    font.pixelSize: 15
                    font.bold: true
                    font.letterSpacing: 2
                }
                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: App.starterLockActivate()
                }
            }

            Text {
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                text: qsTr("After activation, you can buy credit plans and stream without limits.")
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 8
                font.letterSpacing: 0.5
                lineHeight: 1.5
            }
        }
    }
}