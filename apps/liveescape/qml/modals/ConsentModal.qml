import LiveEscape
import QtQuick

ModalBase {
    open: App.showConsent
    modalZ: 600
    closeOnBackdrop: false

    Text {
        text: "CONSENT"
        color: Theme.gold
        font.family: Theme.fontUi
        font.pixelSize: 18
        font.bold: true
        font.letterSpacing: 3
    }

    Text {
        width: parent.width
        wrapMode: Text.WordWrap
        color: Theme.text
        font.family: Theme.fontMono
        font.pixelSize: 11
        lineHeight: 1.5
        text: "Live Escape uses your camera and reference images to generate real-time AI transformations. By continuing you confirm you have the rights to any faces you upload and will not use the product for harmful or illegal purposes."
    }

    GoldButton {
        width: parent.width
        text: "I UNDERSTAND — CONTINUE"
        onClicked: App.acceptConsent()
    }

}
