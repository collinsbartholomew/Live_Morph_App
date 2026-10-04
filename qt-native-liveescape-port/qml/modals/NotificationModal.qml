import QtQuick
import SmokeScreen

// #dashboardNotificationModal — z 650. Admin announcement.
ModalBase {
    open: App.showNotification
    modalZ: 650
    centered: true
    panelMaxWidth: 520
    panelBorderColor: Qt.rgba(232/255, 197/255, 71/255, 0.4)
    panelPaddingH: 40
    onClose: App.dismissNotification()

    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: "📢"
        font.pixelSize: 40
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("Announcement")
        color: Theme.gold
        font.family: Theme.fontUi
        font.pixelSize: 17
        font.weight: Font.Bold
        font.letterSpacing: 3
    }
    Text {
        width: parent.width
        text: App.notificationTitle
        color: Theme.text
        font.family: Theme.fontUi
        font.pixelSize: 16
        font.weight: Font.Bold
        wrapMode: Text.WordWrap
    }
    Text {
        width: parent.width
        text: App.notificationMessage
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 10
        lineHeight: 1.7
        wrapMode: Text.WordWrap
    }
    Rectangle {
        width: parent.width
        height: 38
        radius: Theme.radius
        color: Theme.gold
        Text {
            anchors.centerIn: parent
            text: qsTr("GOT IT")
            color: Theme.bg
            font.family: Theme.fontUi
            font.pixelSize: 14
            font.weight: Font.Bold
            font.letterSpacing: 2
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: App.dismissNotification()
        }
    }
}
