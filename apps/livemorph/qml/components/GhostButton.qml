import QtQuick
import QtQuick.Controls as Controls
import LiveMorph

Controls.Button {
    id: control
    implicitHeight: 32
    padding: 8
    font: Theme.fontSmall

    background: Rectangle {
        radius: Theme.radiusSm
        color: control.pressed ? Colors.white06
             : control.hovered ? Colors.white03
             : "transparent"
        Behavior on color { ColorAnimation { duration: Theme.motionFast } }
    }

    contentItem: Text {
        text: control.text
        color: control.hovered ? Colors.textPrimary : Colors.textSecondary
        font.pixelSize: 12
        font.weight: Font.Medium
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
        Behavior on color { ColorAnimation { duration: Theme.motionFast } }
    }
}
