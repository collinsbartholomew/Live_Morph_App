import QtQuick
import LiveMorph

Rectangle {
    id: root
    property string text: ""
    property bool shown: false
    visible: shown && text.length > 0
    z: 1000
    implicitWidth: lbl.implicitWidth + 16
    implicitHeight: lbl.implicitHeight + 10
    radius: Theme.radiusSm
    color: Colors.surfaceElevated
    border.color: Colors.surfaceBorder
    border.width: 1
    opacity: shown ? 1 : 0
    Behavior on opacity { NumberAnimation { duration: Theme.motionFast } }

    Text {
        id: lbl
        anchors.centerIn: parent
        text: root.text
        color: Colors.textPrimary
        font.pixelSize: 11
        font.weight: Font.Medium
    }
}
