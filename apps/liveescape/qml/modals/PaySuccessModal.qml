import LiveEscape
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import Qt5Compat.GraphicalEffects

ModalBase {
    open: App.showPaySuccess
    modalZ: 700
    panelWidth: Math.min(parent.width * 0.92, 440)
    closeOnBackdrop: false
    onClose: App.dismissPaySuccess()

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 4
        spacing: 16

        Text {
            Layout.alignment: Qt.AlignHCenter
            text: "✅"
            font.pixelSize: 56
        }

        Text {
            Layout.alignment: Qt.AlignHCenter
            text: qsTr("Payment Confirmed")
            color: Theme.teal
            font.family: Theme.fontMono
            font.pixelSize: 10
            font.letterSpacing: 4
        }

        Text {
            Layout.alignment: Qt.AlignHCenter
            text: qsTr("CREDITS LOADED")
            color: Theme.text
            font.family: Theme.fontUi
            font.pixelSize: 22
            font.bold: true
            font.letterSpacing: 3
        }

        Text {
            id: creditsBig
            Layout.alignment: Qt.AlignHCenter
            text: Number(App.paySuccessCredits).toLocaleString(Qt.locale(), "f", 0)
            color: Theme.teal
            font.family: Theme.fontMono
            font.pixelSize: 64
            font.bold: true
            // creditsPop animation
            SequentialAnimation on scale {
                running: App.showPaySuccess
                loops: 1
                NumberAnimation { from: 1; to: 1.08; duration: 250; easing.type: Easing.OutQuad }
                NumberAnimation { from: 1.08; to: 1; duration: 250; easing.type: Easing.InQuad }
            }
        }

        // Glow behind credits number
        Rectangle {
            id: creditsGlowRect
            Layout.alignment: Qt.AlignHCenter
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
                running: App.showPaySuccess
                loops: Animation.Infinite
                NumberAnimation { from: 0; to: 0.25; duration: 1200; easing.type: Easing.InOutSine }
                NumberAnimation { from: 0.25; to: 0; duration: 1200; easing.type: Easing.InOutSine }
            }
        }

        Text {
            Layout.alignment: Qt.AlignHCenter
            text: App.paySuccessPlanName
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 10
        }

        Text {
            Layout.alignment: Qt.AlignHCenter
            wrapMode: Text.WordWrap
            horizontalAlignment: Text.AlignHCenter
            text: qsTr("Your balance has been updated automatically.\nReference: <b style='color:" + Theme.gold + "'>" + App.paySuccessReference + "</b>")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 9
            lineHeight: 1.8
            textFormat: Text.RichText
        }

        GoldButton {
            width: parent.width
            text: qsTr("🚀 CONTINUE STREAMING")
            bg: Theme.teal
            fg: Theme.bg
            onClicked: App.dismissPaySuccess()
        }
    }
}