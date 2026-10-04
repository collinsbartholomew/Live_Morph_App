import QtQuick
import LiveEscape

Rectangle {
    id: root
    property string label: ""
    property bool danger: false
    property bool active: false
    signal clicked()

    implicitWidth: txt.implicitWidth + 20
    implicitHeight: 30
    radius: Theme.radiusFull
    color: "transparent"
    border.color: ma.containsMouse ? Theme.goldD : Theme.border
    border.width: 1
    Behavior on border.color { ColorAnimation { duration: Theme.motionFast } }

    Text {
        id: txt
        anchors.centerIn: parent
        text: root.label
        color: root.danger ? (ma.containsMouse ? Theme.red : Theme.dim)
             : (ma.containsMouse ? Theme.gold : Theme.dim)
        font.family: Theme.fontMono
        font.pixelSize: 9
        font.letterSpacing: 1
        Behavior on color { ColorAnimation { duration: Theme.motionFast } }
    }
    MouseArea {
        id: ma
        anchors.fill: parent
        hoverEnabled: true
        cursorShape: Qt.PointingHandCursor
        onClicked: root.clicked()
    }
}
