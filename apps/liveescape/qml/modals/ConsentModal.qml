import LiveEscape
import QtQuick
import QtQuick.Controls

ModalBase {
    open: App.showConsent
    modalZ: 600
    closeOnBackdrop: false

    Text {
        text: qsTr("Before You Continue")
        color: Theme.gold
        font.family: Theme.fontUi
        font.pixelSize: 18
        font.bold: true
        font.letterSpacing: 3
    }

    Text {
        width: parent.width
        wrapMode: Text.WordWrap
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 11
        lineHeight: 1.5
        text: qsTr("By using Live Escape, you agree to our Terms of Service and Privacy Policy.")
    }

    Row {
        spacing: 4

        Text {
            text: qsTr("Terms of Service")
            color: Theme.teal
            font.family: Theme.fontMono
            font.pixelSize: 10

            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: Qt.openUrlExternally("https://liveescape.app/terms.html")
            }
        }

        Text {
            text: qsTr("and")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 10
        }

        Text {
            text: qsTr("Privacy Policy")
            color: Theme.teal
            font.family: Theme.fontMono
            font.pixelSize: 10

            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: Qt.openUrlExternally("https://liveescape.app/privacy.html")
            }
        }
    }

    GoldButton {
        width: parent.width
        text: qsTr("I Agree — Continue")
        onClicked: App.acceptConsent()
    }

}
