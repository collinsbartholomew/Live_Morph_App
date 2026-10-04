import QtQuick
import SmokeScreen

// #freeCreditsModal — z 550. .credits-celebration teal celebration card.
ModalBase {
    open: App.showFreeCredits
    modalZ: 550
    centered: true
    panelMaxWidth: 440
    panelBorderColor: Qt.rgba(63/255, 232/255, 184/255, 0.4)
    panelPaddingH: 40
    onClose: App.dismissFreeCredits()

    // creditsPop equivalent: card pops in (ModalBase slide covers it closely)

    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("Welcome Gift")
        color: Theme.teal
        font.family: Theme.fontUi
        font.pixelSize: 17
        font.weight: Font.Bold
        font.letterSpacing: 4
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("FREE CREDITS LOADED")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 10
        font.letterSpacing: 2
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: Math.round(App.freeCreditsAmount).toLocaleString()
        color: Theme.teal
        font.family: Theme.fontMono
        font.pixelSize: 64
        font.weight: Font.Bold
        font.letterSpacing: 2
        topPadding: 12
        bottomPadding: 12
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("≈ %1").arg(App.freeCreditsTimeEst)
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 10
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        textFormat: Text.RichText
        text: qsTr("We've gifted you <b style='color:#3fe8b8'>%1 free credits</b> to experience<br>Smoke Screen in full — no payment needed to start.<br><br>When your free credits run out, choose a plan to continue.")
              .arg(Math.round(App.freeCreditsAmount).toLocaleString())
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 10
        lineHeight: 1.8
        bottomPadding: 8
    }
    Rectangle {
        width: parent.width
        height: 40
        radius: Theme.radius
        color: Theme.teal
        Text {
            anchors.centerIn: parent
            text: qsTr("🚀 START STREAMING")
            color: Theme.bg
            font.family: Theme.fontUi
            font.pixelSize: 15
            font.weight: Font.Bold
            font.letterSpacing: 3
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: App.dismissFreeCredits()
        }
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        textFormat: Text.RichText
        text: qsTr("Credits deplete only while you are actively connected.<br>Always click STOP when you finish streaming.")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 9
        lineHeight: 1.7
    }
}
