import QtQuick
import LiveMorph

Item {
    id: root
    property bool checked: false
    signal toggled(bool checked)

    implicitWidth: 44
    implicitHeight: 26

    Rectangle {
        anchors.fill: parent
        radius: Theme.radiusFull
        color: root.checked ? Colors.accent : Colors.surfaceElevated
        border.width: 1
        border.color: root.checked ? Colors.accent40 : Colors.surfaceBorder
        Behavior on color { ColorAnimation { duration: Theme.motionNormal } }

        Rectangle {
            id: knob
            width: 20
            height: 20
            radius: 10
            anchors.verticalCenter: parent.verticalCenter
            x: root.checked ? parent.width - width - 3 : 3
            color: Colors.white
            Behavior on x { NumberAnimation { duration: Theme.motionNormal; easing.type: Easing.OutCubic } }
            // subtle shadow
            Rectangle {
                anchors.fill: parent
                anchors.margins: -1
                radius: 11
                color: "#00000033"
                z: -1
            }
        }
    }

    MouseArea {
        anchors.fill: parent
        cursorShape: Qt.PointingHandCursor
        onClicked: {
            root.checked = !root.checked
            root.toggled(root.checked)
        }
    }
}
