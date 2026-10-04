import QtQuick
import SmokeScreen

// #gateBlocker — z 99999, #0a0a0a full-screen, red padlock, white text.
// Transient in the reference (flicker guard while screens swap); here it is
// driven by App.showGateBlocker exactly like the predecessor.
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

            // padlock (48×48, #ef4444 stroke)
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
                    // body
                    ctx.beginPath()
                    ctx.rect(3, 11, 18, 11)
                    ctx.stroke()
                    // shackle
                    ctx.beginPath()
                    ctx.moveTo(7, 11)
                    ctx.lineTo(7, 7)
                    ctx.arc(12, 7, 5, Math.PI, 0)
                    ctx.lineTo(17, 11)
                    ctx.stroke()
                }
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: qsTr("Access Restricted")
                color: "#ffffff"
                font.family: "sans-serif"
                font.pixelSize: 16
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: qsTr("Loading your session…")
                color: "#9a9a9a"
                font.family: "sans-serif"
                font.pixelSize: 13
            }
        }
    }
}
