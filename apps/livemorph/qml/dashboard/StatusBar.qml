import QtQuick
import QtQuick.Layouts
import LiveMorph

/**
 * Status footer (Electron i1, ground truth):
 *   h-8 (32px fixed) px-4 border-t surface-border bg-surface-base
 *   text: font-mono text-[10px] uppercase tracking-label text-text-secondary
 *   left: 6px connection dot (success glow when connected) + engine name
 *         + "·" + region "AUTO"
 *   right: latency ##MS tabular-nums (colored <200/<500/else) + "·"
 *          + OBS URL copy chip w/ "Copied" flash
 *   Qt functional extras kept inline, restyled to the same mono language.
 */
Rectangle {
    id: root
    property bool compact: false
    color: Colors.surfaceBase
    implicitHeight: 32

    property string copiedFlash: ""

    Rectangle {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        height: 1
        color: Colors.surfaceBorder
    }

    RowLayout {
        anchors.fill: parent
        anchors.leftMargin: 16
        anchors.rightMargin: 16
        spacing: 12

        // Connection dot + engine name + region (Electron left cluster)
        Row {
            spacing: 6
            Item {
                width: 6
                height: 6
                anchors.verticalCenter: parent.verticalCenter
                Rectangle {
                    anchors.centerIn: parent
                    width: 6; height: 6; radius: 3
                    color: !Backend.reachable ? Colors.statusError
                        : Session.isActive ? Colors.statusSuccess : Colors.textMuted
                }
                // shadow-glow-success: 0 0 6px rgba(34,197,94,.5)
                Rectangle {
                    visible: Backend.reachable && !Session.isActive
                    anchors.centerIn: parent
                    width: 12; height: 12; radius: 6
                    color: "#22c55e80"
                }
                SequentialAnimation on opacity {
                    running: Backend.reachable && Session.isActive
                    loops: Animation.Infinite
                    NumberAnimation { to: 0.7; duration: 2000; easing.type: Easing.InOutQuad }
                    NumberAnimation { to: 1.0; duration: 2000; easing.type: Easing.InOutQuad }
                }
            }
            Text {
                text: Backend.reachable ? Session.engineLabel : qsTr("OFFLINE")
                color: Colors.textSecondary
                font.family: Theme.fontMono.family
                font.pixelSize: 10
                font.capitalization: Font.AllUppercase
                font.letterSpacing: 1.5
                anchors.verticalCenter: parent.verticalCenter
            }
            Text {
                text: "·"
                color: Qt.rgba(138/255, 138/255, 163/255, 0.3)
                font.family: Theme.fontMono.family
                font.pixelSize: 10
                anchors.verticalCenter: parent.verticalCenter
            }
            Text {
                text: qsTr("AUTO")
                color: Colors.textMuted
                font.family: Theme.fontMono.family
                font.pixelSize: 10
                font.capitalization: Font.AllUppercase
                font.letterSpacing: 1.5
                anchors.verticalCenter: parent.verticalCenter
            }
        }

        Rectangle {
            visible: {
                var bal = Auth.creditBalance + (Auth.bonusBalance || 0)
                var rate = Session.creditsPerSecond || 2
                return Session.isActive && rate > 0 && (bal / rate) < 30
            }
            radius: Theme.radiusSm
            color: Colors.statusWarningMuted
            border.color: Colors.statusWarning
            border.width: 1
            implicitWidth: lowLbl.implicitWidth + 12
            implicitHeight: 18
            Text {
                id: lowLbl
                anchors.centerIn: parent
                text: qsTr("LOW CREDITS")
                color: Colors.statusWarning
                font.family: Theme.fontMono.family
                font.pixelSize: 8
                font.weight: Font.DemiBold
                font.letterSpacing: 1.2
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: App.openBuyCredits()
            }
        }

        Text {
            visible: Recording.isRecording
            text: "\u25CF REC " + Math.floor(Recording.elapsedMs / 1000) + "s"
            color: Colors.statusError
            font.pixelSize: 10
            font.weight: Font.Bold
            font.family: Theme.fontMono.family
        }

        Text {
            visible: Session.isActive
            text: Math.floor(Session.elapsedSec) + "s · " + Session.creditsPerSecond.toFixed(1) + " cr/s"
            color: Colors.textSecondary
            font.pixelSize: 10
            font.family: Theme.fontMono.family
        }

        Text {
            visible: Session.cooldownActive
            text: "COOLDOWN " + Session.cooldownRemainingSec + "s"
            color: Colors.statusWarning
            font.pixelSize: 10
            font.family: Theme.fontMono.family
        }

        Item { Layout.fillWidth: true }

        // Latency chip (Electron: ##MS tabular-nums, colored by thresholds)
        Text {
            visible: Session.isActive && Session.rttMs >= 0
            text: Math.round(Session.rttMs) + "MS"
            color: Session.rttMs < 200 ? Colors.statusSuccess
                 : Session.rttMs < 500 ? Colors.statusWarning
                 : Colors.statusError
            font.family: Theme.fontMono.family
            font.pixelSize: 10
            font.weight: Font.Medium
            Layout.alignment: Qt.AlignVCenter
        }

        Text {
            visible: Session.isActive && Session.rttMs >= 0
            text: "·"
            color: Qt.rgba(138/255, 138/255, 163/255, 0.3)
            font.family: Theme.fontMono.family
            font.pixelSize: 10
            Layout.alignment: Qt.AlignVCenter
        }

        // OBS Browser Source URL copy chip (Electron: hover accent, "Copied" flash)
        Row {
            visible: StreamServer.running
            spacing: 4
            Text {
                text: root.copiedFlash.length ? root.copiedFlash : StreamServer.url
                color: copiedMa.containsMouse ? Colors.textPrimary : Colors.textMuted
                font.family: Theme.fontMono.family
                font.pixelSize: 10
                // Long custom URLs must not overpaint the right edge.
                width: Math.min(implicitWidth, 220)
                elide: Text.ElideMiddle
                Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
            }
            Icon {
                name: "copy"
                size: 11
                color: copiedMa.containsMouse ? Colors.textPrimary : Colors.textMuted
            }
            MouseArea {
                id: copiedMa
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: {
                    Backend.copyToClipboard(StreamServer.url)
                    root.copiedFlash = qsTr("Copied")
                    flashTimer.restart()
                }
            }
            Timer {
                id: flashTimer
                interval: 1500
                onTriggered: root.copiedFlash = ""
            }
        }

        Text {
            text: App.appVersion
            color: Colors.textMuted
            font.pixelSize: 10
            font.family: Theme.fontMono.family
            opacity: 0.5
        }
    }
}
