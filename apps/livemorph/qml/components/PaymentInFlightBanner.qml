import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

/**
 * Payment in-flight banner (Electron M1, ground truth):
 *   px-4 py-1.5 (~28px) bg-accent/[0.06] border-b accent/15 (bottom only)
 *   6px accent dot pulse-subtle (no spinner)
 *   label 12px medium · elapsed 11px mono muted
 *   "Open" accent text-button · single compact X dismiss
 */
Rectangle {
    id: root
    property bool active: false
    property string orderId: ""
    property int elapsedSec: 0
    property string mode: "card" // card | crypto
    property string statusHint: ""
    // Poll caps (Electron): card 60 polls (5 min), crypto 720 polls (60 min)
    property int pollCount: 0
    readonly property int pollCap: mode === "crypto" ? 720 : 60

    signal openPanel()

    visible: active
    height: visible ? 28 : 0
    radius: 0
    color: "#8b5cf60f" // accent/[0.06]
    border.width: 1
    border.color: Colors.transparent
    // Electron: border-b accent/15 only
    Rectangle {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        height: 1
        color: "#8b5cf626"
    }

    RowLayout {
        anchors.fill: parent
        anchors.leftMargin: 16
        anchors.rightMargin: 16
        spacing: 10

        Item {
            width: 6; height: 6
            Layout.alignment: Qt.AlignVCenter
            Rectangle {
                anchors.centerIn: parent
                width: 6; height: 6; radius: 3
                color: Colors.accent
            }
            SequentialAnimation on opacity {
                running: root.visible && Qt.application.state === Qt.ApplicationActive
                loops: Animation.Infinite
                NumberAnimation { to: 0.7; duration: 2000; easing.type: Easing.InOutQuad }
                NumberAnimation { to: 1.0; duration: 2000; easing.type: Easing.InOutQuad }
            }
        }

        Text {
            text: root.statusHint.length
                  ? root.statusHint
                  : (root.mode === "crypto"
                     ? qsTr("Confirming on blockchain")
                     : qsTr("Payment in progress"))
            color: Colors.textPrimary
            font.pixelSize: 12
            font.weight: Font.Medium
        }

        Text {
            text: {
                var m = Math.floor(root.elapsedSec / 60)
                var s = root.elapsedSec % 60
                return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s
            }
            color: Colors.textMuted
            font.pixelSize: 11
            font.family: Theme.fontMono.family
        }

        Text {
            visible: root.orderId.length
            text: qsTr("Order %1").arg(root.orderId)
            color: Colors.textMuted
            font.pixelSize: 11
            font.family: Theme.fontMono.family
            Layout.fillWidth: true
            elide: Text.ElideMiddle
        }
        Item { Layout.fillWidth: !root.orderId.length }

        // Electron "Resume"/"Open" affordance — reopens the credits drawer
        Text {
            text: qsTr("Open")
            color: openMa.containsMouse ? Colors.accentHover : Colors.accent
            font.pixelSize: 11
            font.weight: Font.Medium
            Layout.alignment: Qt.AlignVCenter
            MouseArea {
                id: openMa
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: root.openPanel()
            }
            Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
        }

        // Single compact dismiss (Electron: p-1 text-muted/60 X)
        Item {
            width: 20; height: 20
            Layout.alignment: Qt.AlignVCenter
            Icon {
                anchors.centerIn: parent
                name: "x"
                size: 12
                emphasis: true
                color: dismissMa.containsMouse ? Colors.textSecondary : "#8a8aa399"
            }
            MouseArea {
                id: dismissMa
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: root.active = false
            }
        }
    }

    Behavior on height { NumberAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }

    Timer {
        running: root.active
        interval: 1000
        repeat: true
        onTriggered: root.elapsedSec++
    }

    // Auto-poll order status every 5s. Electron caps: 60 polls (5 min) for
    // card providers, 720 polls (60 min) for crypto — the old Qt timer ran
    // uncapped for as long as the banner was visible.
    Timer {
        running: root.active && root.orderId.length > 0 && root.pollCount < root.pollCap
        interval: 5000
        repeat: true
        onTriggered: {
            root.pollCount++
            Backend.fetchOrderStatus(root.orderId)
        }
    }

    function start(oid, paymentMode) {
        orderId = oid || ""
        mode = paymentMode || "card"
        statusHint = ""
        elapsedSec = 0
        pollCount = 0
        active = true
    }
}
