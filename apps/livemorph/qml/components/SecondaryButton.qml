import QtQuick
import QtQuick.Controls as Controls
import LiveMorph

Controls.Button {
    id: control
    property bool busy: false
    implicitHeight: 42
    padding: 14
    font: Theme.fontUi

    background: Rectangle {
        radius: Theme.radiusMd
        color: control.pressed ? Colors.surfaceHover
             : control.hovered ? Colors.surfaceElevated
             : Colors.surfaceOverlay
        border.width: 1
        border.color: control.activeFocus ? Colors.accent40 : Colors.surfaceBorder
        Behavior on color { ColorAnimation { duration: Theme.motionFast } }
        Behavior on border.color { ColorAnimation { duration: Theme.motionFast } }
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.margins: 1
            height: 1
            color: Colors.insetHighlightSoft
        }
    }

    contentItem: Row {
        spacing: 8
        anchors.centerIn: parent
        Spinner {
            visible: control.busy
            size: 14
            anchors.verticalCenter: parent.verticalCenter
        }
        Text {
            text: control.text
            color: control.enabled ? Colors.textPrimary : Colors.textMuted
            font.pixelSize: 13
            font.weight: Font.Medium
            anchors.verticalCenter: parent.verticalCenter
        }
    }

    scale: control.pressed ? 0.97 : 1.0
    Behavior on scale { NumberAnimation { duration: Theme.motionFast } }
}
