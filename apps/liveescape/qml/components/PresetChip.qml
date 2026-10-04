import QtQuick
import LiveEscape

Rectangle {
    id: root
    property string label: ""
    property bool selected: false
    property bool enabled: true
    signal clicked()
    implicitWidth: t.implicitWidth + 14
    implicitHeight: 20
    radius: 100
    opacity: enabled ? 1 : 0.4
    color: ma.containsMouse && enabled ? Theme.tealDim : Theme.s2
    border.color: ma.containsMouse && enabled ? Qt.rgba(63/255, 232/255, 184/255, 0.4) : Theme.border
    border.width: 1
    Behavior on border.color { ColorAnimation { duration: Theme.motionFast } }
    Text {
        id: t
        anchors.centerIn: parent
        text: root.label
        color: ma.containsMouse && enabled ? Theme.teal : Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 8
        Behavior on color { ColorAnimation { duration: Theme.motionFast } }
    }
    MouseArea {
        id: ma
        anchors.fill: parent
        hoverEnabled: true
        enabled: root.enabled
        cursorShape: Qt.PointingHandCursor
        onClicked: root.clicked()
    }
}
