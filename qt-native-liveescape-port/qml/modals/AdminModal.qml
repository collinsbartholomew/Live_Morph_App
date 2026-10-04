import QtQuick
import QtQuick.Controls
import SmokeScreen

// #adminPanel — z 900. Provider access only (Ctrl+Shift+A blocked in reference).
ModalBase {
    id: admin
    open: App.showAdminPanel
    modalZ: 900
    centered: true
    onClose: App.showAdminPanel = false

    component AdminStat: Column {
        property string label: ""
        property string value: "—"
        width: (admin.width - 82) / 2
        spacing: 2
        Text {
            text: parent.label
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 8
            font.letterSpacing: 1
        }
        Text {
            text: parent.value
            color: Theme.text
            font.family: Theme.fontMono
            font.pixelSize: 13
            font.weight: Font.Bold
            elide: Text.ElideRight
            width: parent.width
        }
    }

    component AdminBtn: Rectangle {
        property string label: ""
        height: 32
        radius: Theme.radius
        color: Qt.rgba(255/255, 77/255, 109/255, 0.08)
        border.width: 1
        border.color: Qt.rgba(255/255, 77/255, 109/255, 0.25)
        Text {
            anchors.centerIn: parent
            text: parent.label
            color: Theme.red
            font.family: Theme.fontMono
            font.pixelSize: 9
            font.letterSpacing: 1.5
        }
    }

    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("⚠ ADMIN PANEL")
        color: Theme.red
        font.family: Theme.fontMono
        font.pixelSize: 11
        font.weight: Font.Bold
        font.letterSpacing: 3
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("PROVIDER ACCESS ONLY · NOT VISIBLE TO CLIENT")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 8
        font.letterSpacing: 1
        bottomPadding: 6
    }

    Grid {
        width: parent.width
        columns: 2
        spacing: 10
        AdminStat { label: qsTr("USER"); value: Session.email.length ? Session.email : "—" }
        AdminStat { label: qsTr("DEVICE"); value: App.deviceId() }
        AdminStat { label: qsTr("CREDITS LEFT"); value: Math.round(Session.creditsRemaining).toLocaleString() }
        AdminStat { label: qsTr("CREDITS USED"); value: Math.round(Session.creditsUsed).toLocaleString() }
    }

    Text {
        text: qsTr("Decart Engine Key")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 10
        topPadding: 6
    }
    TextField {
        id: adminKey
        width: parent.width
        height: 36
        echoMode: TextInput.Password
        color: Theme.text
        font.family: Theme.fontMono
        font.pixelSize: 11
        placeholderText: qsTr("sk-decart-… (stored permanently on this machine)")
        placeholderTextColor: Theme.dim2
        background: Rectangle {
            radius: Theme.radius
            color: Qt.rgba(255/255, 77/255, 109/255, 0.04)
            border.width: 1
            border.color: Qt.rgba(255/255, 77/255, 109/255, 0.2)
        }
    }
    TextField {
        id: adminCredits
        width: parent.width
        height: 36
        color: Theme.text
        font.family: Theme.fontMono
        font.pixelSize: 11
        placeholderText: qsTr("Override credit balance (set total credits), e.g. 13500")
        placeholderTextColor: Theme.dim2
        inputMethodHints: Qt.ImhDigitsOnly
        background: Rectangle {
            radius: Theme.radius
            color: Qt.rgba(255/255, 77/255, 109/255, 0.04)
            border.width: 1
            border.color: Qt.rgba(255/255, 77/255, 109/255, 0.2)
        }
    }
    Row {
        width: parent.width
        spacing: 8
        AdminBtn {
            width: (parent.width - 8) / 2
            label: qsTr("💾 SAVE ENGINE KEY")
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: App.adminSaveEngineKey(adminKey.text, "admin")
            }
        }
        AdminBtn {
            width: (parent.width - 8) / 2
            label: qsTr("⚡ OVERRIDE BALANCE")
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: App.adminSetCredits(Number(adminCredits.text), "admin", Session.email)
            }
        }
    }
    Rectangle {
        width: parent.width
        height: 32
        radius: Theme.radius
        color: "transparent"
        border.width: 1
        border.color: Theme.border
        Text {
            anchors.centerIn: parent
            text: qsTr("CLOSE ADMIN PANEL")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 9
            font.letterSpacing: 1.5
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: App.showAdminPanel = false
        }
    }
}
