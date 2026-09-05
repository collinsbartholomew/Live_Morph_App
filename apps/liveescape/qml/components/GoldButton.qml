import QtQuick
import QtQuick.Controls
import LiveEscape

Button {
    id: root
    property bool busy: false
    property color bg: Theme.gold
    property color fg: Theme.bg

    font.family: Theme.fontUi
    font.pixelSize: 14
    font.bold: true
    font.letterSpacing: 1.5
    leftPadding: 20
    rightPadding: 20
    topPadding: 12
    bottomPadding: 12
    implicitHeight: 44

    background: Item {
        Rectangle {
            id: glow
            anchors.centerIn: parent
            width: parent.width + 8
            height: parent.height + 8
            radius: Theme.radius + 4
            color: Theme.gold
            opacity: root.enabled && !root.busy ? (root.hovered ? 0.28 : 0.14) : 0
            Behavior on opacity { NumberAnimation { duration: Theme.motionFast } }
            NumberAnimation on scale {
                from: 0.9; to: 1.1; duration: 2200; loops: Animation.Infinite; running: root.enabled && !root.busy
            }
        }
        Rectangle {
            anchors.fill: parent
            radius: Theme.radius
            gradient: Gradient {
                GradientStop {
                    position: 0.0
                    color: !root.enabled ? Qt.darker(root.bg, 1.5)
                         : root.down ? Qt.darker(root.bg, 1.12)
                         : root.hovered ? Theme.goldHover
                         : root.bg
                }
                GradientStop {
                    position: 1.0
                    color: !root.enabled ? Qt.darker(root.bg, 1.7)
                         : Qt.darker(root.bg, 1.08)
                }
            }
            border.width: 1
            border.color: root.enabled ? Theme.goldGlowStrong : "transparent"
            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                anchors.margins: 1
                height: 1
                color: "#ffffff33"
                visible: root.enabled
            }
        }
    }

    contentItem: Text {
        text: root.busy ? "…" : root.text
        font: root.font
        color: root.fg
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
        opacity: root.busy ? 0.85 : 1
    }

    scale: root.down ? 0.97 : 1.0
    Behavior on scale { NumberAnimation { duration: Theme.motionFast } }
}
