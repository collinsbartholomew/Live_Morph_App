import QtQuick
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
    height: visible ? 32 : 0
    radius: Theme.radiusXs
    color: Colors.accent06 // accent/[0.06]
    border.width: 1
    border.color: Colors.transparent
    // Electron: border-b accent/15 only
    Rectangle {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        height: 1
        color: Colors.accent15
    }

    RowLayout {
        anchors.fill: parent
        anchors.leftMargin: 16
        anchors.rightMargin: 12
        spacing: 10

        // Mode hex badge
        HexBadge {
            size: 20
            iconName: root.mode === "crypto" ? "coins" : "credit-card"
            iconSize: 11
            lineWidth: 1
            lineColor: Colors.accent30
            fillColor: Colors.accent12
            iconColor: Colors.accentHover
            Layout.alignment: Qt.AlignVCenter
        }

        Text {
            text: root.statusHint.length
                  ? root.statusHint
                  : (root.mode === "crypto"
                     ? qsTr("Confirming on blockchain")
                     : qsTr("Payment in progress"))
            color: Colors.textPrimary
            font.pixelSize: 12
            font.weight: Font.Bold
            Layout.fillWidth: true
            elide: Text.ElideRight
        }

        // Elapsed pill (mono tabular)
        Rectangle {
            radius: Theme.radiusFull
            color: Colors.surfaceElevated
            border.color: Colors.surfaceBorderSubtle
            border.width: 1
            implicitWidth: elLbl.implicitWidth + 10
            implicitHeight: 18
            Layout.alignment: Qt.AlignVCenter
            Text {
                id: elLbl
                anchors.centerIn: parent
                text: {
                    var m = Math.floor(root.elapsedSec / 60)
                    var s = root.elapsedSec % 60
                    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s
                }
                color: Colors.textMuted
                font.pixelSize: 10
                font.family: Theme.fontMono.family
            }
        }

        Text {
            visible: root.orderId.length
            text: qsTr("Order %1").arg(root.orderId)
            color: Colors.textMuted
            font.pixelSize: 10
            font.family: Theme.fontMono.family
            Layout.fillWidth: true
            elide: Text.ElideMiddle
        }
        Item { Layout.fillWidth: !root.orderId.length }

        // "Resume" affordance — reopens the credits drawer
        Rectangle {
            radius: Theme.radiusFull
            color: openMa.containsMouse ? Colors.accent12 : Colors.accent10
            border.color: Colors.accent30
            border.width: 1
            implicitWidth: resumeLbl.implicitWidth + 14
            implicitHeight: 22
            Layout.alignment: Qt.AlignVCenter
            Text {
                id: resumeLbl
                anchors.centerIn: parent
                text: qsTr("RESUME")
                color: Colors.accentHover
                font.pixelSize: 9
                font.family: Theme.fontMono.family
                font.weight: Font.Bold
                font.letterSpacing: 1.0
            }
            MouseArea {
                id: openMa
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: root.openPanel()
            }
        }

        // Single compact dismiss
        Rectangle {
            width: 22; height: 22
            radius: Theme.radiusXs
            color: dismissMa.containsMouse ? Colors.overlay50 : Colors.transparent
            Layout.alignment: Qt.AlignVCenter
            Icon {
                anchors.centerIn: parent
                name: "x"
                size: 12
                emphasis: true
                color: dismissMa.containsMouse ? Colors.textSecondary : Colors.textMuted60
            }
            MouseArea {
                id: dismissMa
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: {
                    root.active = false
                    root.orderId = ""
                    root.elapsedSec = 0
                    root.pollCount = 0
                }
            }
        }
    }


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
            if (root.pollCount >= root.pollCap) {
                // Don't leave the banner polling forever — hand back to the
                // user with a notification.
                root.active = false
                root.statusHint = qsTr("Still confirming — check back later")
                Notifier.push(qsTr("Payment still pending"),
                              qsTr("Still confirming — check back later"), "warning", "payment")
            }
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
