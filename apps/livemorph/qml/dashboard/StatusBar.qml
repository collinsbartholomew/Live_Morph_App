import QtQuick
import QtQuick.Layouts
import LiveMorph

/**
 * StatusBar — original: h-12 px-6 flex items-center justify-between
 * bg-surface-base border-t border-surface-border
 */
Rectangle {
    id: root
    property bool compact: false
    color: Colors.surfaceBase
    implicitHeight: compact ? Theme.statusBarHeightCompact : Theme.statusBarHeight

    Rectangle {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        height: 1
        color: Colors.surfaceBorder
    }

    RowLayout {
        anchors.fill: parent
        anchors.leftMargin: 24
        anchors.rightMargin: 24
        spacing: 14

        Rectangle {
            visible: {
                var bal = Auth.creditBalance + (Auth.bonusBalance || 0)
                var rate = Session.creditsPerSecond || 2
                return Session.isActive && rate > 0 && (bal / rate) < 30
            }
            radius: Theme.radiusFull
            color: Colors.statusWarningMuted
            border.color: Colors.statusWarning
            border.width: 1
            implicitWidth: lowLbl.implicitWidth + 14
            implicitHeight: 22
            Text {
                id: lowLbl
                anchors.centerIn: parent
                text: qsTr("Low credits — session may end soon")
                color: Colors.statusWarning
                font.pixelSize: 10
                font.weight: Font.DemiBold
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: App.openBuyCredits()
            }
        }

        Text {
            text: Camera.isActive ? ("Camera: " + (Camera.currentDeviceName || "Active")) : "Camera: Off"
            color: Colors.textMuted
            font.pixelSize: root.compact ? 9 : 10
            font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        }

        Text {
            visible: Recording.isRecording
            text: "● REC " + Math.floor(Recording.elapsedMs / 1000) + "s"
            color: Colors.statusError
            font.pixelSize: 10
            font.weight: Font.Bold
            font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        }

        Text {
            visible: StreamServer.running
            text: StreamServer.paused
                  ? ("MJPEG PAUSED · " + StreamServer.url)
                  : (StreamServer.virtualCameraActive
                     ? ("VCAM · " + StreamServer.url)
                     : ("OBS · " + StreamServer.url))
            color: StreamServer.paused ? Colors.statusWarning : Colors.accent
            font.pixelSize: 10
            font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
            elide: Text.ElideMiddle
            Layout.maximumWidth: 280
        }

        Text {
            visible: Session.isActive
            text: "Morph " + Math.floor(Session.elapsedSec) + "s · "
                  + Session.creditsPerSecond.toFixed(1) + " cr/s · "
                  + Session.framesProcessed + "f"
            color: Colors.accent
            font.pixelSize: 10
            font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        }

        Text {
            visible: Session.cooldownActive
            text: "Cooldown " + Session.cooldownRemainingSec + "s"
            color: Colors.statusWarning
            font.pixelSize: 10
            font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        }

        Text {
            text: Session.engineLabel
            color: Colors.textMuted
            font.pixelSize: 10
            font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        }

        Item { Layout.fillWidth: true }

        Text {
            visible: Session.identityLockEnabled
            text: "ID LOCK"
            color: Colors.accent
            font.pixelSize: 9
            font.weight: Font.Bold
            font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
            font.letterSpacing: 1.5
        }

        Row {
            spacing: 6
            Rectangle {
                width: 6; height: 6; radius: 3
                color: Backend.reachable ? Colors.statusSuccess : Colors.statusError
                anchors.verticalCenter: parent.verticalCenter
            }
            Text {
                text: Backend.reachable ? "Backend" : "Backend offline"
                color: Colors.textMuted
                font.pixelSize: 10
                anchors.verticalCenter: parent.verticalCenter
            }
        }

        Text {
            text: "LiveMorph " + App.appVersion + " · Qt6"
            color: Colors.textMuted
            font.pixelSize: 10
            font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        }
    }
}
