import QtQuick
import QtQuick.Controls
import LiveEscape

Button {
    id: root
    font.family: Theme.fontUi
    font.pixelSize: 12
    font.weight: Font.Medium
    leftPadding: 12
    rightPadding: 12
    topPadding: 8
    bottomPadding: 8

    background: Rectangle {
        radius: Theme.radiusSm
        color: root.down ? "#ffffff12"
             : root.hovered ? "#ffffff08"
             : "transparent"
        Behavior on color { ColorAnimation { duration: Theme.motionFast } }
    }

    contentItem: Text {
        text: root.text
        font: root.font
        color: root.hovered ? Theme.gold : Theme.dim
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
        Behavior on color { ColorAnimation { duration: Theme.motionFast } }
    }
}
