import QtQuick
import LiveEscape

Rectangle {
    id: root
    property string label: ""
    property bool selected: false
    property bool enabled: true
    signal clicked()
    implicitWidth: t.implicitWidth + 16
    implicitHeight: 26
    radius: 13
    opacity: enabled ? 1 : 0.4
    color: selected ? Theme.goldDim : (ma.containsMouse && enabled ? Theme.goldDim : Theme.s2)
    border.color: selected ? Theme.gold : Theme.border
    border.width: 1
    Text {
        id: t
        anchors.centerIn: parent
        text: root.label
        color: selected ? Theme.gold : Theme.text
        font.family: Theme.fontMono
        font.pixelSize: 9
        font.bold: selected
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
