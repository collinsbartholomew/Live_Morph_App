import QtQuick
import LiveEscape

Item {
    id: root
    property bool checked: false
    property string accessibleName: ""
    property string accessibleDescription: ""
    signal toggled(bool value)
    width: 32; height: 17

    Accessible.role: Accessible.CheckBox
    Accessible.name: root.accessibleName
    Accessible.description: root.accessibleDescription
    Accessible.checked: root.checked

    Rectangle {
        anchors.fill: parent
        radius: height / 2
        color: root.checked ? Theme.goldD : Theme.s2
        border.color: root.checked ? Theme.gold : Theme.border
        border.width: 1
        Behavior on color { ColorAnimation { duration: 300 } }

        Rectangle {
            width: 11; height: 11; radius: 50
            anchors.verticalCenter: parent.verticalCenter
            x: root.checked ? 17 : 2
            color: root.checked ? Theme.gold : Theme.dim
            Behavior on x { NumberAnimation { duration: 300 } }
        }
    }
    MouseArea {
        anchors.fill: parent
        cursorShape: Qt.PointingHandCursor
        onClicked: { root.checked = !root.checked; root.toggled(root.checked) }
    }
}
