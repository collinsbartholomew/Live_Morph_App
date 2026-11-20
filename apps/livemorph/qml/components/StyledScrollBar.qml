import QtQuick
import QtQuick.Controls
import LiveMorph

ScrollBar {
    id: control
    property bool thin: false
    implicitWidth: thin ? 12 : 14
    leftPadding: thin ? 4 : 4
    rightPadding: thin ? 4 : 4
    contentItem: Rectangle {
        implicitWidth: control.thin ? 4 : 6
        radius: Theme.radiusFull
        color: control.pressed ? Colors.accent80
             : control.interactive && control.hovered ? Colors.textMuted
             : Colors.surfaceBorderStrong
        opacity: control.size < 1.0 || control.pressed || control.hovered ? 0.9 : 0.0
    }
}
