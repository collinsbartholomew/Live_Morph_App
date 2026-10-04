import QtQuick
import SmokeScreen

// #streamConsentModal — z 600. One-time stream-logging consent.
ModalBase {
    open: App.showStreamConsent
    modalZ: 600
    centered: true
    onClose: App.declineStreamConsent()

    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("Before You Connect")
        color: Theme.gold
        font.family: Theme.fontUi
        font.pixelSize: 20
        font.weight: Font.Bold
        font.letterSpacing: 3
    }
    Rectangle {
        width: parent.width
        height: bodyCol.implicitHeight + 28
        radius: Theme.radius
        color: Theme.s2
        border.width: 1
        border.color: Theme.border
        Column {
            id: bodyCol
            anchors.centerIn: parent
            width: parent.width - 32
            spacing: 8
            Text {
                width: parent.width
                text: qsTr("Smoke Screen performs AI transformation auditing, capture, and session logging while you're connected to the live engine. This is required to keep the platform safe for everyone.")
                color: Theme.text
                font.family: Theme.fontMono
                font.pixelSize: 10
                lineHeight: 1.85
                wrapMode: Text.WordWrap
            }
            Text {
                width: parent.width
                text: qsTr("You'll only see this once — it won't show again on this device.")
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 9
                lineHeight: 1.7
                wrapMode: Text.WordWrap
            }
        }
    }
    Rectangle {
        width: parent.width
        height: 40
        radius: Theme.radius
        color: Theme.gold
        Text {
            anchors.centerIn: parent
            text: qsTr("I Agree — Connect")
            color: Theme.bg
            font.family: Theme.fontUi
            font.pixelSize: 15
            font.weight: Font.Bold
            font.letterSpacing: 2
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: App.acceptStreamConsent()
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
            text: qsTr("Cancel")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 10
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: App.declineStreamConsent()
        }
    }
}
