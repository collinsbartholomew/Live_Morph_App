import LiveEscape
import QtQuick
import QtQuick.Controls

ModalBase {
    open: App.showAbuseReport
    modalZ: 650
    onClose: App.showAbuseReport = false

    // Icon
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: "🚨"
        font.pixelSize: 40
    }

    Text {
        text: qsTr("REPORT ABUSE")
        color: Theme.gold
        font.family: Theme.fontUi
        font.pixelSize: 18
        font.bold: true
        font.letterSpacing: 2
    }

    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("HELP US KEEP LIVE ESCAPE SAFE")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 9
        font.letterSpacing: 1.5
    }

    // Body card
    Rectangle {
        width: parent.width
        height: abuseBodyCol.implicitHeight + 20
        radius: Theme.radius
        color: Theme.s2
        border.color: Theme.border
        border.width: 1

        Column {
            id: abuseBodyCol
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.margins: 10
            spacing: 8

            Text {
                width: parent.width
                wrapMode: Text.WordWrap
                text: qsTr("Describe the issue you'd like to report. Our support team will review it and follow up if needed.")
                color: Theme.text
                font.family: Theme.fontMono
                font.pixelSize: 11
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
                    placeholderText: qsTr("Describe the issue…")

                    background: Rectangle {
                        color: Theme.s1
                        radius: Theme.radius
                        border.color: Theme.border
                    }

                }

            }
        }
    }

    GoldButton {
        width: parent.width
        text: qsTr("SUBMIT REPORT")
        onClicked: App.submitAbuseReport(details.text)
    }

    GhostButton {
        width: parent.width
        text: qsTr("✕ Cancel")
        onClicked: App.showAbuseReport = false
    }

}
