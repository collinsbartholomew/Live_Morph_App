import LiveEscape
import QtQuick
import QtQuick.Controls
import Qt5Compat.GraphicalEffects

ModalBase {
    open: App.showFreeCredits
    modalZ: 560
    onClose: App.dismissFreeCredits()

    // Welcome Gift label
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("Welcome Gift")
        color: Theme.teal
        font.family: Theme.fontMono
        font.pixelSize: 9
        font.letterSpacing: 4
    }

    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("FREE CREDITS LOADED")
        color: Theme.gold
        font.family: Theme.fontUi
        font.pixelSize: 18
        font.bold: true
        font.letterSpacing: 2
    }

    Text {
        id: creditsBig
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: Number(App.freeCreditsAmount).toLocaleString(Qt.locale(), "f", 0)
        color: Theme.teal
        font.family: Theme.fontMono
        font.pixelSize: 64
        font.bold: true

        // creditsPop animation (Electron: scale 1→1.08→1, 0.5s ease)
        SequentialAnimation on scale {
            running: App.showFreeCredits
            loops: 1
            NumberAnimation { from: 1; to: 1.08; duration: 250; easing.type: Easing.OutQuad }
            NumberAnimation { from: 1.08; to: 1; duration: 250; easing.type: Easing.InQuad }
        }

        // Glow animation (Electron .glow: box-shadow pulse, 2s infinite)
        // Approximated with opacity pulse on a layered glow rect behind
        // Since we can't do box-shadow on Text, we use a Rectangle behind with glow
    }

    // Glow background for credits big number (matches Electron .credits-big glow)
    Rectangle {
        id: creditsGlowRect
        anchors.centerIn: creditsBig
        width: creditsBig.contentWidth + 40
        height: creditsBig.contentHeight + 40
        radius: 20
        color: Theme.teal
        opacity: 0
        z: -1
        layer.enabled: true
        layer.effect: GaussianBlur {
            radius: 32
            deviation: 12
        }
        SequentialAnimation on opacity {
            running: App.showFreeCredits
            loops: Animation.Infinite
            NumberAnimation { from: 0; to: 0.25; duration: 1200; easing.type: Easing.InOutSine }
            NumberAnimation { from: 0.25; to: 0; duration: 1200; easing.type: Easing.InOutSine }
        }
    }

    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: App.freeCreditsTimeEst
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 11
    }

    Text {
        width: parent.width
        wrapMode: Text.WordWrap
        horizontalAlignment: Text.AlignHCenter
        textFormat: Text.RichText
        text: qsTr("We've gifted you <b>free credits</b> to experience Live Escape in full — <b>no payment needed to start</b>. When your free credits run out, choose a plan to continue.")
        color: Theme.text
        font.family: Theme.fontUi
        font.pixelSize: 12
        lineHeight: 1.4
    }

    GoldButton {
        width: parent.width
        text: qsTr("🚀 START STREAMING")
        bg: Theme.teal
        fg: Theme.bg
        onClicked: App.dismissFreeCredits()
    }

    // Footer warning
    Text {
        width: parent.width
        wrapMode: Text.WordWrap
        horizontalAlignment: Text.AlignHCenter
        text: "Credits deplete only while you are actively connected.\nAlways click STOP when you finish streaming."
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 9
        lineHeight: 1.4
    }

}
