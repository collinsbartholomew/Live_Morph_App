import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveEscape

ModalBase {
    open: App.showExpiry
    modalZ: 520
    closeOnBackdrop: false
    panelWidth: Math.min(parent.width * 0.92, 440)

    ColumnLayout {
        width: parent.width
        spacing: 14

        Text {
            text: "⏰"
            font.pixelSize: 48
            Layout.alignment: Qt.AlignHCenter
        }

        Text {
            text: qsTr("LICENSE EXPIRED")
            color: Theme.gold
            font.family: Theme.fontUi
            font.pixelSize: 18
            font.bold: true
            font.letterSpacing: 3
            Layout.alignment: Qt.AlignHCenter
        }

        Text {
            text: qsTr("YOUR ANNUAL ACCESS KEY HAS EXPIRED")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 10
            font.letterSpacing: 1.5
            Layout.alignment: Qt.AlignHCenter
        }

        // Body box
        Rectangle {
            Layout.fillWidth: true
            height: expiryBody.implicitHeight + 20
            radius: Theme.radius
            color: Theme.s2
            border.color: Theme.border
            border.width: 1

            Column {
                id: expiryBody
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                anchors.margins: 10
                spacing: 10

                Text {
                    width: parent.width
                    wrapMode: Text.WordWrap
                    textFormat: Text.RichText
                    text: "Your <b>Live Escape</b> license expired" + (Session.licenseExpiry.length > 0 ? " on <b>" + Session.licenseExpiry.substring(0, 10) + "</b>" : "") + "."
                    color: Theme.text
                    font.family: Theme.fontMono
                    font.pixelSize: 11
                }

                Text {
                    width: parent.width
                    wrapMode: Text.WordWrap
                    text: "Your credit balance has been preserved and will be available immediately after renewal."
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 10
                }

                Text {
                    width: parent.width
                    wrapMode: Text.WordWrap
                    textFormat: Text.RichText
                    color: Theme.red
                    font.family: Theme.fontMono
                    font.pixelSize: 11
                    font.bold: true
                    text: "⚠️ To continue streaming, renew your annual license at <b>liveescape.app</b>."
                }
            }
        }

        GoldButton {
            width: parent.width
            text: qsTr("RENEW MY LICENSE →")
            onClicked: App.renewLicense()
        }

        GhostButton {
            width: parent.width
            text: qsTr("← Sign out of this account")
            onClicked: {
                App.showExpiry = false
                App.logout()
            }
        }
    }
}
