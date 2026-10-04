import QtQuick
import QtQuick.Controls
import LiveEscape

Button {
    id: root
    property bool busy: false
    property color bg: Theme.gold
    property color fg: Theme.bg
    property int fontPixelSize: 14
    property int fontLS: 2
    property bool showGlow: false
    property string accessibleName: root.text
    property string accessibleDescription: ""

    font.family: Theme.fontUi
    font.pixelSize: root.fontPixelSize
    font.bold: true
    font.letterSpacing: root.fontLS
    leftPadding: 20
    rightPadding: 20
    topPadding: 12
    bottomPadding: 12
    implicitHeight: 44

    Accessible.role: Accessible.Button
    Accessible.name: root.accessibleName
    Accessible.description: root.accessibleDescription
    Accessible.pressed: root.down

    background: Rectangle {
        anchors.fill: parent
        radius: Theme.radius
        color: !root.enabled ? Qt.darker(root.bg, 1.5)
             : root.down ? Qt.darker(root.bg, 1.12)
             : root.hovered ? Qt.lighter(root.bg, 1.1)
             : root.bg
        Behavior on color { ColorAnimation { duration: Theme.motionFast } }
    }

    contentItem: Text {
        text: root.busy ? "…" : root.text
        font: root.font
        color: root.fg
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
        opacity: root.busy ? 0.85 : 1
    }
}
