import QtQuick
import QtQuick.Controls
import LiveEscape

Button {
    id: root
    property color fg: "transparent"
    property string accessibleName: root.text
    property string accessibleDescription: ""
    font.family: Theme.fontUi
    font.pixelSize: 12
    font.weight: Font.DemiBold
    leftPadding: 24
    rightPadding: 24
    topPadding: 10
    bottomPadding: 10

    Accessible.role: Accessible.Button
    Accessible.name: root.accessibleName
    Accessible.description: root.accessibleDescription
    Accessible.pressed: root.down

    background: Rectangle {
        radius: 8
        color: "transparent"
        border.color: root.hovered ? Theme.goldD : Theme.border
        border.width: 1
        Behavior on border.color { ColorAnimation { duration: Theme.motionFast } }
    }

    contentItem: Text {
        text: root.text
        font: root.font
        color: root.fg !== "transparent" ? root.fg
             : root.hovered ? Theme.gold : Theme.dim
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
        Behavior on color { ColorAnimation { duration: Theme.motionFast } }
    }
}
