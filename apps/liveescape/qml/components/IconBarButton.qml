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
    radius: Theme.radius
    color: root.active ? (danger ? "#3a1018" : Theme.goldGlow)
         : (ma.containsMouse ? Theme.s2 : "transparent")
    border.color: root.active ? (danger ? Theme.red : Theme.gold)
                 : (ma.containsMouse ? Theme.border : "transparent")
    border.width: 1

    Text {
        id: txt
        anchors.centerIn: parent
        text: root.label
        color: root.danger ? Theme.red : (root.active ? Theme.gold : Theme.text)
        font.family: Theme.fontMono
        font.pixelSize: 10
        font.letterSpacing: 1
    }
    MouseArea {
        id: ma
        anchors.fill: parent
        hoverEnabled: true
        cursorShape: Qt.PointingHandCursor
        onClicked: root.clicked()
    }
}
