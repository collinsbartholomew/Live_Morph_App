import LiveEscape
import QtQuick
import QtQuick.Controls

ModalBase {
    open: App.showAbuseReport
    modalZ: 530
    panelBorderColor: Theme.red
    onClose: App.showAbuseReport = false

    Text {
        text: "REPORT ABUSE"
        color: Theme.red
        font.family: Theme.fontUi
        font.pixelSize: 16
        font.bold: true
        font.letterSpacing: 2
    }

    Text {
        width: parent.width
        wrapMode: Text.WordWrap
        text: "Describe the issue. Our team reviews every report."
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 10
    }

    ScrollView {
        width: parent.width
        height: 100

        TextArea {
            id: details

            width: parent.width
            wrapMode: TextEdit.Wrap
            color: Theme.text
            font.family: Theme.fontMono
            font.pixelSize: 11
            placeholderText: "What happened?"

            background: Rectangle {
                color: Theme.s2
                radius: Theme.radius
                border.color: Theme.border
            }

        }

    }

    GoldButton {
        width: parent.width
        text: "SUBMIT REPORT"
        bg: Theme.red
        fg: Theme.text
        onClicked: App.submitAbuseReport(details.text)
    }

    GhostButton {
        width: parent.width
        text: "CANCEL"
        onClicked: App.showAbuseReport = false
    }

}
