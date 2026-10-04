import QtQuick
import SmokeScreen

// #welcomeModal — z 540. Exact reference copy.
ModalBase {
    open: App.showWelcome
    modalZ: 540
    onClose: App.dismissWelcome()

    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("SMOKE SCREEN")
        color: Theme.gold
        font.family: Theme.fontUi
        font.pixelSize: 20
        font.weight: Font.Bold
        font.letterSpacing: 3
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("REAL-TIME AI VIDEO TRANSFORMATION")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 9
        font.letterSpacing: 1.5
        bottomPadding: 8
    }

    Rectangle {
        width: parent.width
        height: bodyCol.implicitHeight + 28
        radius: Theme.radius
        color: Theme.s2
        border.width: 1
        border.color: Theme.border
        Column {
            id: bodyCol
            anchors.centerIn: parent
            width: parent.width - 32
            spacing: 8
            Text {
                width: parent.width
                textFormat: Text.RichText
                text: qsTr("⚡ This is a <b>live AI engine</b> that transforms your webcam feed in real time using advanced neural rendering technology.")
                color: Theme.text
                font.family: Theme.fontMono
                font.pixelSize: 10
                lineHeight: 1.85
                wrapMode: Text.WordWrap
            }
            Text {
                width: parent.width
                textFormat: Text.RichText
                text: qsTr("🎟️ This app runs on a <b>credit system</b>. Every second you are connected, <b>2 credits</b> are deducted automatically (120/min).")
                color: Theme.text
                font.family: Theme.fontMono
                font.pixelSize: 10
                lineHeight: 1.85
                wrapMode: Text.WordWrap
            }
            Text {
                width: parent.width
                textFormat: Text.RichText
                text: qsTr("⚠️ When your credits reach zero, streaming stops automatically. Always click <b>STOP</b> when you finish.")
                color: Theme.red
                font.family: Theme.fontMono
                font.pixelSize: 10
                font.weight: Font.Bold
                lineHeight: 1.85
                wrapMode: Text.WordWrap
            }
        }
    }

    Rectangle {
        width: parent.width
        height: 40
        radius: Theme.radius
        color: Theme.gold
        Text {
            anchors.centerIn: parent
            text: qsTr("I UNDERSTAND — CONTINUE")
            color: Theme.bg
            font.family: Theme.fontUi
            font.pixelSize: 15
            font.weight: Font.Bold
            font.letterSpacing: 3
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: App.dismissWelcome()
        }
    }
}
