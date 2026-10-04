import LiveEscape
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ModalBase {
    open: App.showAdminPanel
    modalZ: 900
    panelBorderColor: Theme.red
    onClose: App.showAdminPanel = false

    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("⚠ ADMIN PANEL")
        color: Theme.red
        font.family: Theme.fontMono
        font.pixelSize: 11
        font.bold: true
        font.letterSpacing: 2
    }

    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("PROVIDER ACCESS ONLY · NOT VISIBLE TO CLIENT")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 9
    }

    GridLayout {
        width: parent.width
        columns: 2
        rowSpacing: 8
        columnSpacing: 10

        Repeater {
            model: [{
                "k": "USER",
                "v": Session.email || "—"
            }, {
                "k": "DEVICE",
                "v": MachineId.deviceId || "—"
            }, {
                "k": "CREDITS LEFT",
                "v": String(Math.floor(Session.creditsRemaining))
            }, {
                "k": "CREDITS USED",
                "v": String(Math.floor(Session.creditsUsed))
            }, {
                "k": "PLAN",
                "v": Session.plan || "—"
            }, {
                "k": "USER ID",
                "v": Session.userId || "—"
            }]

            Rectangle {
                Layout.fillWidth: true
                Layout.preferredHeight: 48
                radius: 7
                color: Theme.s2
                border.color: Theme.border

                Column {
                    anchors.centerIn: parent
                    width: parent.width
                    spacing: 2

                    Text {
                        width: parent.width
                        horizontalAlignment: Text.AlignHCenter
                        text: modelData.k
                        color: Theme.dim
                        font.family: Theme.fontMono
                        font.pixelSize: 8
                    }

                    Text {
                        width: parent.width
                        horizontalAlignment: Text.AlignHCenter
                        text: modelData.v
                        color: Theme.text
                        font.family: Theme.fontMono
                        font.pixelSize: 13
                        font.bold: true
                        elide: Text.ElideMiddle
                    }

                }

            }

        }

    }

    SectionLabel {
        text: qsTr("ENGINE KEY")
    }

    FieldInput {
        id: engineKeyInput

        width: parent.width
        label: qsTr("DECART ENGINE KEY")
        placeholderText: qsTr("sk-decart-… (stored on this machine)")
        echoMode: TextInput.Password
    }

    FieldInput {
        id: adminSecret1

        width: parent.width
        label: qsTr("ADMIN SECRET")
        placeholderText: qsTr("Required to save to server")
        echoMode: TextInput.Password
    }

    GoldButton {
        width: parent.width
        text: qsTr("💾 SAVE ENGINE KEY")
        enabled: adminSecret1.text.length > 0 && engineKeyInput.text.length > 0
        onClicked: App.adminSaveEngineKey(engineKeyInput.text, adminSecret1.text)
    }

    SectionLabel {
        text: qsTr("CREDIT OVERRIDE")
    }

    FieldInput {
        id: creditOverride

        width: parent.width
        label: qsTr("SET TOTAL CREDITS")
        placeholderText: qsTr("e.g. 13500")
    }

    FieldInput {
        id: adminSecret2

        width: parent.width
        label: qsTr("ADMIN SECRET")
        placeholderText: qsTr("Required to override balance")
        echoMode: TextInput.Password
    }

    GoldButton {
        width: parent.width
        text: qsTr("⚡ OVERRIDE CREDIT BALANCE")
        bg: Theme.red
        fg: Theme.text
        enabled: adminSecret2.text.length > 0 && creditOverride.text.length > 0 && !isNaN(parseFloat(creditOverride.text))
        onClicked: App.adminSetCredits(parseFloat(creditOverride.text), adminSecret2.text)
    }

    GhostButton {
        width: parent.width
        text: qsTr("CLOSE ADMIN PANEL")
        onClicked: App.showAdminPanel = false
    }

}
