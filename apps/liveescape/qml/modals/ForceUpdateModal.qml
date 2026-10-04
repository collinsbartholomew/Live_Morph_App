import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveEscape

ModalBase {
    id: root
    open: App.showForceUpdate
    closeOnBackdrop: false
    modalZ: 99999

    contentCol.spacing: 16

    // Icon (above heading)
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: "🔄"
        font.pixelSize: 48
    }

    // Heading
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: "UPDATE REQUIRED"
        color: Theme.gold
        font.family: Theme.fontUi
        font.pixelSize: 18
        font.bold: true
        font.letterSpacing: 4
    }

    // Subtitle
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: "A NEW VERSION OF LIVE ESCAPE IS AVAILABLE"
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 9
        font.letterSpacing: 1.5
    }

    // Body box
    Rectangle {
        width: parent.width
        height: bodyCol.implicitHeight + 20
        radius: Theme.radius
        color: Theme.s2
        border.color: Theme.border
        border.width: 1

        ColumnLayout {
            id: bodyCol
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.margins: 10
            spacing: 8

            Text {
                Layout.fillWidth: true
                wrapMode: Text.WordWrap
                horizontalAlignment: Text.AlignHCenter
                text: qsTr("Your current version is no longer supported.")
                color: Theme.text
                font.family: Theme.fontMono
                font.pixelSize: 11
            }

            Text {
                Layout.fillWidth: true
                wrapMode: Text.WordWrap
                horizontalAlignment: Text.AlignHCenter
                text: qsTr("A new version (%1) is available with important improvements and fixes.").arg(App.forceUpdateVersion)
                color: Theme.teal
                font.family: Theme.fontMono
                font.pixelSize: 11
                font.bold: true
            }
        }
    }

    // Warning
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        wrapMode: Text.WordWrap
        text: "⚠️ You must update to continue using Live Escape."
        color: Theme.red
        font.family: Theme.fontMono
        font.pixelSize: 11
        font.bold: true
    }

    // Download button → live progress bar
    ColumnLayout {
        width: parent.width
        spacing: 6

        GoldButton {
            width: parent.width
            text: App.downloading
                  ? qsTr("DOWNLOADING… %1%").arg(App.downloadProgress)
                  : (App.downloadProgress > 0 ? qsTr("OPEN INSTALLER") : qsTr("⬇ DOWNLOAD UPDATE"))
            enabled: !App.downloading || App.downloadProgress < 100
            onClicked: App.downloadForceUpdate()
        }

        Rectangle {
            Layout.fillWidth: true
            height: 8
            radius: 4
            color: Theme.s1
            visible: App.downloading || App.downloadProgress > 0

            Rectangle {
                anchors.left: parent.left
                width: parent.width * (App.downloadProgress / 100.0)
                height: parent.height
                radius: 4
                color: Theme.gold
                Behavior on width { NumberAnimation { duration: 150 } }
            }
        }

        Text {
            width: parent.width
            horizontalAlignment: Text.AlignHCenter
            visible: App.downloadProgress >= 100 && !App.downloading
            text: qsTr("Download complete — launching installer…")
            color: Theme.teal
            font.family: Theme.fontMono
            font.pixelSize: 9
        }
    }

    // Help text
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        wrapMode: Text.WordWrap
        text: "After downloading, close this app and install the new version.\nNeed help? Chat us on Telegram"
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 9

        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: App.openExternal("https://t.me/liveescapeapp")
        }
    }

    // Quit button
    GhostButton {
        width: parent.width
        text: qsTr("QUIT")
        onClicked: Qt.quit()
    }
}
