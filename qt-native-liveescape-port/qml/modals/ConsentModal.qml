import QtQuick
import SmokeScreen

// #consentModal — z 600. "Before You Continue" terms gate.
// Electron copy (exact):
//   h2  "Before You Continue"
//   body "By using Smoke Screen, you agree to our <a>Terms of Service</a>
//         and <a>Privacy Policy</a>."  (teal underline links)
//   btn "I Agree — Continue" → acceptConsent()
// No backdrop dismiss (boot is blocked until accepted).
ModalBase {
    open: App.showConsent
    modalZ: 600
    onClose: {}   // consent is mandatory — only the button closes it

    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("Before You Continue")
        color: Theme.gold
        font.family: Theme.fontUi
        font.pixelSize: 20
        font.weight: Font.Bold
        font.letterSpacing: 3
        bottomPadding: 4
    }

    Rectangle {
        width: parent.width
        height: bodyText.implicitHeight + 28
        radius: Theme.radius
        color: Theme.s2
        border.width: 1
        border.color: Theme.border

        Text {
            id: bodyText
            anchors.centerIn: parent
            width: parent.width - 32
            textFormat: Text.RichText
            text: qsTr("By using Smoke Screen, you agree to our <a href=\"https://smokescreenapp.com/terms.html\">Terms of Service</a> and <a href=\"https://smokescreenapp.com/privacy.html\">Privacy Policy</a>.")
            color: Theme.text
            linkColor: Theme.teal
            font.family: Theme.fontMono
            font.pixelSize: 10
            wrapMode: Text.WordWrap
            onLinkActivated: (link) => Qt.openUrlExternally(link)
        }
    }

    Rectangle {
        width: parent.width
        height: 40
        radius: Theme.radius
        color: Theme.gold
        Text {
            anchors.centerIn: parent
            text: qsTr("I Agree — Continue")
            color: Theme.bg
            font.family: Theme.fontUi
            font.pixelSize: 15
            font.weight: Font.Bold
            font.letterSpacing: 3
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: App.acceptConsent()
        }
    }
}
