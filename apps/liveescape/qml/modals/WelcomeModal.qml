import LiveEscape
import QtQuick

ModalBase {
    open: App.showWelcome
    modalZ: 550
    onClose: App.dismissWelcome()

    LogoMark {
        anchors.horizontalCenter: parent.horizontalCenter
        gemSize: 36
    }

    Text {
        anchors.horizontalCenter: parent.horizontalCenter
        text: "WELCOME TO LIVE ESCAPE"
        color: Theme.gold
        font.family: Theme.fontUi
        font.pixelSize: 16
        font.bold: true
        font.letterSpacing: 2
    }

    Text {
        width: parent.width
        wrapMode: Text.WordWrap
        horizontalAlignment: Text.AlignHCenter
        text: "Upload a reference face, hit CONNECT, and transform your live video in real time. Credits power your sessions and never expire."
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 11
    }

    GoldButton {
        width: parent.width
        text: "GET STARTED"
        onClicked: App.dismissWelcome()
    }

    GhostButton {
        width: parent.width
        text: "▶ TAKE THE TOUR"
        onClicked: {
            App.dismissWelcome();
            App.startTour();
        }
    }

}
