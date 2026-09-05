import QtQuick
import LiveEscape

Item {
    id: root
    property bool checked: false
    signal toggled(bool value)
    width: 34; height: 18

    Rectangle {
        anchors.fill: parent
        radius: height / 2
        color: root.checked ? Theme.gold : Theme.border
        Behavior on color { ColorAnimation { duration: 120 } }

        Rectangle {
            width: 14; height: 14; radius: 7
            anchors.verticalCenter: parent.verticalCenter
            x: root.checked ? parent.width - width - 2 : 2
            color: root.checked ? Theme.bg : Theme.dim
            Behavior on x { NumberAnimation { duration: 120 } }
        }
    }
    MouseArea {
        anchors.fill: parent
        cursorShape: Qt.PointingHandCursor
        onClicked: { root.checked = !root.checked; root.toggled(root.checked) }
    }
}
