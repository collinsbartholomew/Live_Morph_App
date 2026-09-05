import QtQuick
import QtQuick.Controls as Controls
import LiveMorph

Controls.TextField {
    id: control
    color: Colors.textPrimary
    placeholderTextColor: Colors.textMuted
    font: Theme.fontUi
    leftPadding: 14
    rightPadding: 14
    topPadding: 12
    bottomPadding: 12
    selectByMouse: true
    selectedTextColor: Colors.white
    selectionColor: Colors.accent40

    background: Rectangle {
        implicitHeight: 44
        radius: Theme.radiusMd
        color: control.activeFocus ? Colors.surfaceElevated : Colors.surfaceOverlay
        border.color: control.activeFocus ? Colors.accent
                    : control.hovered ? Colors.surfaceBorder
                    : Colors.surfaceBorderSubtle
        border.width: control.activeFocus ? 1.5 : 1
        Behavior on border.color { ColorAnimation { duration: Theme.motionFast } }
        Behavior on color { ColorAnimation { duration: Theme.motionFast } }
        // Focus glow
        Rectangle {
            anchors.fill: parent
            anchors.margins: -2
            radius: parent.radius + 2
            color: "transparent"
            border.width: control.activeFocus ? 1 : 0
            border.color: Colors.accent20
            z: -1
        }
    }
}
