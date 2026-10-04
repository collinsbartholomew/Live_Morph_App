import QtQuick
import QtQuick.Controls
import LiveEscape

// Maintenance Blocker — z-index 100000, blocks ALL content
Item {
    id: root
    anchors.fill: parent
    visible: App.screen === "maintenance"
    z: 100000

        Rectangle {
            anchors.fill: parent
            color: Theme.bg

        Column {
            anchors.centerIn: parent
            spacing: 16

            Text {
                text: "🔧"
                font.pixelSize: 48
                anchors.horizontalCenter: parent.horizontalCenter
            }

            Text {
                text: qsTr("UNDER MAINTENANCE")
                color: Theme.gold
                font.family: Theme.fontUi
                font.pixelSize: 22
                font.bold: true
                font.letterSpacing: 1
                anchors.horizontalCenter: parent.horizontalCenter
            }

            Text {
                width: 420
                horizontalAlignment: Text.AlignHCenter
                wrapMode: Text.WordWrap
                text: App.maintenanceMessage || qsTr("Live Escape is undergoing scheduled maintenance. Please check back soon.")
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 12
                lineHeight: 1.7
            }

            Text {
                text: qsTr("Homepage and support channels remain available.")
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 10
                anchors.horizontalCenter: parent.horizontalCenter
            }
        }
    }
}