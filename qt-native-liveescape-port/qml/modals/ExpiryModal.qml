import QtQuick
import SmokeScreen

// #expiryModal — z 600. Exact reference copy.
ModalBase {
    open: App.showExpiry
    modalZ: 600
    centered: true
    onClose: {}

    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: "⏰"
        font.pixelSize: 48
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("LICENSE EXPIRED")
        color: Theme.gold
        font.family: Theme.fontUi
        font.pixelSize: 20
        font.weight: Font.Bold
        font.letterSpacing: 3
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("YOUR ANNUAL ACCESS KEY HAS EXPIRED")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 9
        font.letterSpacing: 1.5
        bottomPadding: 8
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
                textFormat: Text.RichText
                text: qsTr("Your Smoke Screen license expired on <b style='color:#e8c547'>%1</b>.").arg(Session.licenseExpiry)
                color: Theme.text
                font.family: Theme.fontMono
                font.pixelSize: 10
                lineHeight: 1.85
                wrapMode: Text.WordWrap
            }
            Text {
                width: parent.width
                text: qsTr("Your credit balance has been preserved and will be available immediately after renewal.")
                color: Theme.text
                font.family: Theme.fontMono
                font.pixelSize: 10
                lineHeight: 1.85
                wrapMode: Text.WordWrap
            }
            Text {
                width: parent.width
                text: qsTr("⚠️ To continue streaming, renew your annual license at smokescreenapp.com.")
                color: Theme.red
                font.family: Theme.fontMono
                font.pixelSize: 10
                font.weight: Font.Bold
                lineHeight: 1.85
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
            text: qsTr("RENEW MY LICENSE →")
            color: Theme.bg
            font.family: Theme.fontUi
            font.pixelSize: 15
            font.weight: Font.Bold
            font.letterSpacing: 3
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: App.renewLicense()
        }
    }
    Rectangle {
        width: parent.width
        height: 30
        radius: Theme.radius
        color: "transparent"
        border.width: 1
        border.color: Theme.border
        Text {
            anchors.centerIn: parent
            text: qsTr("← Sign out of this account")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 9
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: App.logout()
        }
    }
}
