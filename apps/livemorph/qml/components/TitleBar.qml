import QtQuick
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
    implicitHeight: Theme.titleBarHeight

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

        // Brand mark: layered hex monogram (shared BrandMark component)
        BrandMark {
            size: 24
            letter: "LM"
            lineColor: Colors.white
            fillColor: Colors.white
            letterColor: Colors.black
            lineWidth: 1.5
            anchors.verticalCenter: parent.verticalCenter
        }

        Text {
            text: qsTr("LiveMorph")
            color: Colors.textPrimary
            font.pixelSize: 13
            font.weight: Font.Bold
            font.letterSpacing: -0.26
            anchors.verticalCenter: parent.verticalCenter
        }

        // Electron "LIVE" badge next to the product name
        Rectangle {
            anchors.verticalCenter: parent.verticalCenter
            width: liveLabel.implicitWidth + 12
            height: 14
            radius: Theme.radiusSm
            color: Colors.accent10
            border.color: Colors.accent30
            border.width: 1
            Text {
                id: liveLabel
                anchors.centerIn: parent
                text: qsTr("LIVE")
                color: Colors.accent
                font.family: Theme.fontMono.family
                font.pixelSize: 8
                font.capitalization: Font.AllUppercase
                font.letterSpacing: Theme.trackingChip
            }
        }

        Text {
            text: qsTr("v%1").arg(App.appVersion)
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
            accessibleName: qsTr("Minimize")
            iconSize: 14
            width: 48
            height: 40
            radius: Theme.radiusXs
            hoverColor: Colors.surfaceOverlay
            onClicked: root.minimizeRequested()
        }
        IconButton {
            name: "maximize"
            accessibleName: qsTr("Maximize")
            iconSize: 14
            width: 48
            height: 40
            radius: Theme.radiusXs
            hoverColor: Colors.surfaceOverlay
            onClicked: root.maximizeRequested()
        }
        IconButton {
            name: "x"
            accessibleName: qsTr("Close")
            iconSize: 14
            emphasis: true
            width: 48
            height: 40
            radius: Theme.radiusXs
            hoverColor: Colors.danger
            pressedColor: Colors.dangerPressed
            iconColor: hovered ? Colors.textOnAccent : Colors.textSecondary
            onClicked: root.closeRequested()
        }
    }
}
