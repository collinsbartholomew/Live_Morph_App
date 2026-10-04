import QtQuick
import SmokeScreen

// #paySuccessModal — z 700. Teal celebration.
ModalBase {
    open: App.showPaySuccess
    modalZ: 700
    centered: true
    panelMaxWidth: 440
    panelBorderColor: Qt.rgba(63/255, 232/255, 184/255, 0.4)
    panelPaddingH: 40
    onClose: App.dismissPaySuccess()

    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: "✅"
        font.pixelSize: 56
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("Payment Confirmed")
        color: Theme.teal
        font.family: Theme.fontUi
        font.pixelSize: 17
        font.weight: Font.Bold
        font.letterSpacing: 3
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("CREDITS LOADED")
        color: Theme.text
        font.family: Theme.fontUi
        font.pixelSize: 22
        font.weight: Font.Bold
        font.letterSpacing: 2
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: App.paySuccessCredits.toLocaleString()
        color: Theme.teal
        font.family: Theme.fontMono
        font.pixelSize: 56
        font.weight: Font.Bold
        font.letterSpacing: 2
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: App.paySuccessPlanName
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 11
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        textFormat: Text.RichText
        text: qsTr("Your balance has been updated automatically.<br>Reference: <b style='color:#e8c547'>%1</b>").arg(App.paySuccessReference)
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 10
        lineHeight: 1.8
        bottomPadding: 6
    }
    Rectangle {
        width: parent.width
        height: 40
        radius: Theme.radius
        color: Theme.teal
        Text {
            anchors.centerIn: parent
            text: qsTr("🚀 CONTINUE STREAMING")
            color: Theme.bg
            font.family: Theme.fontUi
            font.pixelSize: 15
            font.weight: Font.Bold
            font.letterSpacing: 3
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: App.dismissPaySuccess()
        }
    }
}
