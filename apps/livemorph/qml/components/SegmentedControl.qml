import QtQuick
import QtQuick.Controls
import LiveMorph

Rectangle {
    id: root
    property var model: []          // array of { label, value }
    property string currentValue: ""
    signal activated(string value)

    implicitHeight: 36
    implicitWidth: row.implicitWidth + 4
    radius: Theme.radiusSm
    color: Colors.surfaceOverlay
    border.color: Colors.surfaceBorder
    border.width: 1

    Row {
        id: row
        anchors.centerIn: parent
        spacing: 2

        Repeater {
            model: root.model
            delegate: Rectangle {
                required property var modelData
                required property int index
                width: segLabel.implicitWidth + 20
                height: 30
                radius: Theme.radiusSm - 1
                color: root.currentValue === modelData.value ? Colors.accent15 : (segMa.containsMouse ? Colors.surfaceOverlay : "transparent")
                border.color: root.currentValue === modelData.value ? Colors.accent40 : "transparent"
                border.width: 1

                Text {
                    id: segLabel
                    anchors.centerIn: parent
                    text: modelData.label
                    color: root.currentValue === modelData.value ? Colors.accent : Colors.textSecondary
                    font.pixelSize: 11
                    font.weight: root.currentValue === modelData.value ? Font.DemiBold : Font.Normal
                }

                MouseArea {
                    id: segMa
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    hoverEnabled: true
                    onClicked: {
                        root.currentValue = modelData.value
                        root.activated(modelData.value)
                    }
                    onPressed: parent.scale = 0.96
                    onReleased: parent.scale = 1.0
                }
                Behavior on scale { NumberAnimation { duration: Theme.motionFast } }
                Behavior on color { ColorAnimation { duration: Theme.motionFast } }
            }
        }
    }
}
