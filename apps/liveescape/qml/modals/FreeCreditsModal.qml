import LiveEscape
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ModalBase {
    open: App.showFreeCredits
    modalZ: 200
    onClose: App.dismissFreeCredits()

    Text {
        anchors.horizontalCenter: parent.horizontalCenter
        text: "✦"
        color: Theme.gold
        font.pixelSize: 36
    }

    Text {
        anchors.horizontalCenter: parent.horizontalCenter
        text: "FREE CREDITS LOADED"
        color: Theme.gold
        font.family: Theme.fontUi
        font.pixelSize: 18
        font.bold: true
        font.letterSpacing: 2
    }

    Text {
        anchors.horizontalCenter: parent.horizontalCenter
        text: Number(App.freeCreditsAmount).toLocaleString(Qt.locale(), "f", 0)
        color: Theme.teal
        font.family: Theme.fontMono
        font.pixelSize: 42
        font.bold: true
    }

    Text {
        anchors.horizontalCenter: parent.horizontalCenter
        text: App.freeCreditsTimeEst
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 11
    }

    Text {
        width: parent.width
        wrapMode: Text.WordWrap
        horizontalAlignment: Text.AlignHCenter
        text: "We've gifted you free credits to experience Live Escape.\nWhen they run out, choose a plan to continue."
        color: Theme.text
        font.family: Theme.fontUi
        font.pixelSize: 13
        lineHeight: 1.3
    }

    GoldButton {
        anchors.horizontalCenter: parent.horizontalCenter
        text: "LET'S GO"
        width: 180
        onClicked: App.dismissFreeCredits()
    }

}
