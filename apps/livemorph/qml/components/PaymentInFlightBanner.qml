import QtQuick
import QtQuick.Layouts
import LiveMorph

Rectangle {
    id: root
    property bool active: false
    property string orderId: ""
    property int elapsedSec: 0
    property string mode: "card" // card | crypto
    property string statusHint: ""

    visible: active
    height: visible ? 44 : 0
    radius: 0
    color: Colors.accent10
    border.color: Colors.accent30
    border.width: 1

    RowLayout {
        anchors.fill: parent
        anchors.leftMargin: 16
        anchors.rightMargin: 16
        spacing: 12

        Spinner { size: 16 }
        Text {
            text: root.mode === "crypto"
                  ? qsTr("Waiting for USDT confirmation…")
                  : qsTr("Payment in progress…")
            color: Colors.textPrimary
            font.pixelSize: 12
            font.weight: Font.Medium
        }
        Text {
            text: root.statusHint.length
                  ? root.statusHint
                  : (root.orderId.length ? ("Order " + root.orderId) : "")
            color: Colors.textMuted
            font.pixelSize: 11
            font.family: "monospace"
            Layout.fillWidth: true
            elide: Text.ElideMiddle
        }
        Text {
            text: {
                var m = Math.floor(root.elapsedSec / 60)
                var s = root.elapsedSec % 60
                return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s
            }
            color: Colors.accent
            font.pixelSize: 11
            font.family: "monospace"
        }
        GhostButton {
            text: qsTr("Recheck")
            onClicked: {
                if (root.orderId.length)
                    Backend.fetchOrderStatus(root.orderId)
            }
        }
        GhostButton {
            text: qsTr("Dismiss")
            onClicked: root.active = false
        }
    }

    Timer {
        running: root.active
        interval: 1000
        repeat: true
        onTriggered: root.elapsedSec++
    }

    // Auto-poll crypto every 5s while banner active
    Timer {
        running: root.active && root.mode === "crypto" && root.orderId.length > 0
        interval: 5000
        repeat: true
        onTriggered: Backend.fetchOrderStatus(root.orderId)
    }

    function start(oid, paymentMode) {
        orderId = oid || ""
        mode = paymentMode || "card"
        statusHint = ""
        elapsedSec = 0
        active = true
    }
}
