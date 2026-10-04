import QtQuick
import QtQuick.Controls
import LiveEscape

// Gate Blocker — FAIL-CLOSED: z-index 99999, shows while boot resolves
// Sits above ALL content except MaintenanceBlocker
Item {
    id: root
    anchors.fill: parent
    visible: App.showGateBlocker
    z: 99999

    Rectangle {
        anchors.fill: parent
        color: "#0a0a0a"

        Column {
            anchors.centerIn: parent
            spacing: 16

            // Lock icon (red stroke like Electron)
            Canvas {
                width: 48
                height: 48
                anchors.horizontalCenter: parent.horizontalCenter
                onPaint: {
                    var ctx = getContext("2d")
                    ctx.clearRect(0, 0, width, height)
                    ctx.strokeStyle = "#ef4444"
                    ctx.lineWidth = 2
                    ctx.lineCap = "round"
                    ctx.lineJoin = "round"

                    // Lock body
                    ctx.beginPath()
                    ctx.rect(3, 11, 18, 11)
                    ctx.stroke()

                    // Shackle
                    ctx.beginPath()
                    ctx.moveTo(7, 11)
                    ctx.lineTo(7, 7)
                    ctx.arc(12, 7, 5, Math.PI, 0)
                    ctx.lineTo(17, 11)
                    ctx.stroke()
                }
            }

            Text {
                text: qsTr("Access Restricted")
                color: Theme.text
                font.family: Theme.fontUi
                font.pixelSize: 18
                font.bold: true
                anchors.horizontalCenter: parent.horizontalCenter
            }

            Text {
                text: qsTr("Loading your session…")
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 12
                anchors.horizontalCenter: parent.horizontalCenter
            }
        }
    }
}