import LiveEscape
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

// One-time consent shown on the first Connect (reference #streamConsentModal).
ModalBase {
    open: App.showStreamConsent
    modalZ: 600
    closeOnBackdrop: false
    panelWidth: Math.min(parent.width * 0.92, 460)

    ColumnLayout {
        width: parent.width
        spacing: 14

        Text {
            text: qsTr("Before You Connect")
            color: Theme.gold
            font.family: Theme.fontUi
            font.pixelSize: 18
            font.bold: true
            Layout.alignment: Qt.AlignHCenter
        }

        // Body card
        Rectangle {
            Layout.fillWidth: true
            height: bodyCol.implicitHeight + 20
            radius: Theme.radius
            color: Theme.s2
            border.color: Theme.border
            border.width: 1

            Column {
                id: bodyCol
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                anchors.margins: 10
                spacing: 10

                Text {
                    width: parent.width
                    wrapMode: Text.WordWrap
                    text: qsTr("Live Escape performs AI transformation auditing, capture, and session logging while you're connected to the live engine. This is required to keep the platform safe for everyone.")
                    color: Theme.text
                    font.family: Theme.fontMono
                    font.pixelSize: 11
                    lineHeight: 1.4
                }

                Text {
                    width: parent.width
                    wrapMode: Text.WordWrap
                    text: qsTr("You'll only see this once — it won't show again on this device.")
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 12
                }
            }
        }

        GoldButton {
            width: parent.width
            text: qsTr("I Agree — Continue")
            onClicked: App.acceptStreamConsent()
        }

        GhostButton {
            width: parent.width
            text: qsTr("Cancel")
            onClicked: App.declineStreamConsent()
        }
    }
}
