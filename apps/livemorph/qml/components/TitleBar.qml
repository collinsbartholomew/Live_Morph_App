import QtQuick
import QtQuick.Controls
import LiveMorph

/**
 * TitleBar (Electron ground truth):
 *   h-10 bg-surface-raised border-b surface-border
 *   px-4 · gap-2.5 · logo 20px · name 13px bold tracking-[-0.02em]
 *   "LIVE" chip: mono 8px uppercase tracking-label bg-accent/10
 *     border-accent/30 rounded-sm px-1
 *   window controls: h-10 w-12 (48×40) flush, radius 0
 *     min/max hover:bg-surface-overlay · close hover:bg-status-error
 */
Rectangle {
    id: root
    color: Colors.surfaceRaised

    Rectangle {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        height: 1
        color: Colors.surfaceBorder
    }

    signal closeRequested()
    signal minimizeRequested()
    signal maximizeRequested()

    MouseArea {
        anchors.fill: parent
        anchors.rightMargin: 144 // Electron no-drag zone
        property point clickPos
        onPressed: (mouse) => { clickPos = Qt.point(mouse.x, mouse.y) }
        onPositionChanged: (mouse) => {
            if (pressed) {
                var win = root.Window.window
                if (win) {
                    win.x += mouse.x - clickPos.x
                    win.y += mouse.y - clickPos.y
                }
            }
        }
        onDoubleClicked: root.maximizeRequested()
    }

    Row {
        anchors.left: parent.left
        anchors.leftMargin: 16
        anchors.verticalCenter: parent.verticalCenter
        spacing: 10

        Rectangle {
            width: 20; height: 20
            radius: Theme.radiusSm
            color: Colors.accent
            anchors.verticalCenter: parent.verticalCenter
            Text {
                anchors.centerIn: parent
                text: "LM"
                color: Colors.surfaceRaised
                font.pixelSize: 11
                font.bold: true
            }
        }

        Text {
            text: "LiveMorph"
            color: Colors.textPrimary
            font.pixelSize: 13
            font.weight: Font.Bold
            font.letterSpacing: -0.26
            anchors.verticalCenter: parent.verticalCenter
        }

        // Electron "LIVE" badge next to the product name
        Rectangle {
            anchors.verticalCenter: parent.verticalCenter
            width: liveLabel.implicitWidth + 8 // px-1
            height: 14
            radius: Theme.radiusSm
            color: Colors.accent10
            border.color: Colors.accent30
            border.width: 1
            Text {
                id: liveLabel
                anchors.centerIn: parent
                text: qsTr("LIVE")
                color: Colors.accentHover
                font.family: Theme.fontMono.family
                font.pixelSize: 8
                font.capitalization: Font.AllUppercase
                font.letterSpacing: 1.2
            }
        }

        Text {
            text: "v" + App.appVersion
            color: Colors.textMuted
            font.pixelSize: 10
            font.family: Theme.fontMono.family
            font.letterSpacing: 0.5
            anchors.verticalCenter: parent.verticalCenter
        }
    }

    Row {
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.bottom: parent.bottom
        spacing: 0

        IconButton {
            name: "minimize"
            iconSize: 14
            width: 48
            height: 40
            radius: 0
            hoverColor: Colors.surfaceOverlay
            onClicked: root.minimizeRequested()
        }
        IconButton {
            name: "maximize"
            iconSize: 14
            width: 48
            height: 40
            radius: 0
            hoverColor: Colors.surfaceOverlay
            onClicked: root.maximizeRequested()
        }
        IconButton {
            name: "x"
            iconSize: 14
            emphasis: true
            width: 48
            height: 40
            radius: 0
            hoverColor: Colors.danger
            iconColor: hovered ? Colors.textOnAccent : Colors.textSecondary
            onClicked: root.closeRequested()
        }
    }
}
