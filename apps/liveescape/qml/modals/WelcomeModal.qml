import LiveEscape
import QtQuick
import QtQuick.Controls

ModalBase {
    open: App.showWelcome
    modalZ: 550
    onClose: App.dismissWelcome()

    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("LIVE ESCAPE")
        color: Theme.gold
        font.family: Theme.fontUi
        font.pixelSize: 20
        font.bold: true
        font.letterSpacing: 3
    }

    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("REAL-TIME AI VIDEO TRANSFORMATION")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 10
        font.letterSpacing: 1.5
    }

    // Body paragraph 1
    Text {
        width: parent.width
        wrapMode: Text.WordWrap
        textFormat: Text.RichText
        color: Theme.text
        font.family: Theme.fontMono
        font.pixelSize: 11
        lineHeight: 1.5
        text: "⚡ This is a <b>live AI engine</b> that transforms your webcam feed in real time using advanced neural rendering technology."
    }

    // Body paragraph 2
    Text {
        width: parent.width
        wrapMode: Text.WordWrap
        textFormat: Text.RichText
        color: Theme.text
        font.family: Theme.fontMono
        font.pixelSize: 11
        lineHeight: 1.5
        text: "🎟️ This app runs on a <b>credit system</b>. Every second you are connected, <b>2 credits</b> are deducted automatically (120/min)."
    }

    // Body paragraph 3 (warning)
    Text {
        width: parent.width
        wrapMode: Text.WordWrap
        textFormat: Text.RichText
        color: Theme.red
        font.family: Theme.fontMono
        font.pixelSize: 11
        font.bold: true
        lineHeight: 1.5
        text: "⚠️ When your credits reach zero, streaming stops automatically. Always click <b>STOP</b> when you finish."
    }

    GoldButton {
        width: parent.width
        text: qsTr("I UNDERSTAND — CONTINUE")
        onClicked: App.dismissWelcome()
    }

}
