import QtQuick
import QtQuick.Controls
import LiveMorph

Rectangle {
    id: root
    color: Colors.surfaceBase

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
        anchors.rightMargin: 120
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
        anchors.leftMargin: 12
        anchors.verticalCenter: parent.verticalCenter
        spacing: 8

        Rectangle {
            width: 18; height: 18
            radius: Theme.radiusSm
            color: Colors.accent
            anchors.verticalCenter: parent.verticalCenter
            Text {
                anchors.centerIn: parent
                text: "LM"
                color: Colors.surfaceBase
                font.pixelSize: 11
                font.bold: true
            }
        }

        Text {
            text: "LiveMorph"
            color: Colors.textPrimary
            font.pixelSize: 12
            font.weight: Font.Medium
            anchors.verticalCenter: parent.verticalCenter
        }

        Text {
            text: "v" + App.appVersion
            color: Colors.textMuted
            font.pixelSize: 10
            font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
            anchors.verticalCenter: parent.verticalCenter
        }
    }

    Row {
        anchors.right: parent.right
        anchors.rightMargin: 4
        anchors.verticalCenter: parent.verticalCenter
        spacing: 2

        IconButton {
            name: "minimize"
            ToolTip.visible: hovered
            ToolTip.delay: 500
            ToolTip.text: "Minimize"
            onClicked: root.minimizeRequested()
        }
        IconButton {
            name: "maximize"
            ToolTip.visible: hovered
            ToolTip.delay: 500
            ToolTip.text: "Maximize"
            onClicked: root.maximizeRequested()
        }
        IconButton {
            name: "x"
            hoverColor: Colors.dangerMuted
            iconColor: hovered ? Colors.danger : Colors.textSecondary
            ToolTip.visible: hovered
            ToolTip.delay: 500
            ToolTip.text: "Close"
            onClicked: root.closeRequested()
        }
    }
}
