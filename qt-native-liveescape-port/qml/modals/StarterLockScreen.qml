import QtQuick
import SmokeScreen

// #starterLockScreen — z 9998. Mandatory starter activation.
Item {
    anchors.fill: parent
    visible: App.showStarterLock
    z: 9998

    Rectangle { anchors.fill: parent; color: Theme.bg }
    Rectangle {
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        height: parent.height * 0.55
        gradient: Gradient {
            GradientStop { position: 0; color: Qt.rgba(232/255, 197/255, 71/255, 0.08) }
            GradientStop { position: 1; color: Qt.rgba(4/255, 4/255, 10/255, 0) }
        }
    }

    Rectangle {
        anchors.centerIn: parent
        width: Math.min(parent.width * 0.92, 440)
        height: cardCol.implicitHeight + 72
        radius: 16
        color: Theme.s1
        border.width: 1
        border.color: Qt.rgba(232/255, 197/255, 71/255, 0.25)

        Column {
            id: cardCol
            anchors.centerIn: parent
            width: parent.width - 64
            spacing: 14

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
                font.pixelSize: 20
                font.weight: Font.Bold
                font.letterSpacing: 2
            }
            Text {
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                text: qsTr("YOUR 500 STARTER CREDITS HAVE BEEN USED")
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 9
                font.letterSpacing: 1
            }
            Text {
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                wrapMode: Text.WordWrap
                text: qsTr("To continue using Smoke Screen, activate your license with a one-time $75 fee. This unlocks permanent access and the ability to purchase credit plans.")
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 9
                lineHeight: 1.7
            }
            Rectangle {
                width: parent.width
                height: 44
                radius: 10
                gradient: Gradient {
                    GradientStop { position: 0; color: "#f7d060" }
                    GradientStop { position: 0.55; color: "#f0a830" }
                    GradientStop { position: 1; color: "#d4711a" }
                }
                Text {
                    anchors.centerIn: parent
                    text: qsTr("🔓 ACTIVATE LICENSE NOW")
                    color: Theme.goldInk
                    font.family: Theme.fontUi
                    font.pixelSize: 15
                    font.weight: Font.Bold
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
                lineHeight: 1.5
            }
        }
    }
}
