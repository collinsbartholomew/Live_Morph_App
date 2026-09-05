import QtQuick
import QtQuick.Controls as Controls
import LiveMorph

Controls.Button {
    id: control
    property bool busy: false
    implicitHeight: 42
    padding: 14
    font: Theme.fontUi

    background: Item {
        // Ambient glow
        Rectangle {
            anchors.centerIn: parent
            width: parent.width + 8
            height: parent.height + 8
            radius: Theme.radiusMd + 4
            color: Colors.accent
            opacity: control.enabled && !control.busy ? (control.hovered ? 0.28 : 0.16) : 0
            Behavior on opacity { NumberAnimation { duration: Theme.motionFast } }
        }
        Rectangle {
            anchors.fill: parent
            radius: Theme.radiusMd
            gradient: Gradient {
                GradientStop {
                    position: 0.0
                    color: !control.enabled ? Qt.darker(Colors.accent, 1.6)
                         : control.pressed ? Colors.accentPressed
                         : control.hovered ? Colors.accentHover
                         : Colors.accent
                }
                GradientStop {
                    position: 1.0
                    color: !control.enabled ? Qt.darker(Colors.accent, 1.8)
                         : control.pressed ? Qt.darker(Colors.accentPressed, 1.1)
                         : Colors.accentPressed
                }
            }
            border.width: 1
            border.color: control.enabled ? Colors.accent40 : "transparent"
            // top inset
            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                anchors.margins: 1
                height: 1
                radius: 1
                color: Colors.white10
                visible: control.enabled
            }
            Behavior on color { ColorAnimation { duration: Theme.motionFast } }
        }
    }

    contentItem: Row {
        spacing: 8
        anchors.centerIn: parent
        Spinner {
            visible: control.busy
            size: 16
            anchors.verticalCenter: parent.verticalCenter
        }
        Text {
            text: control.text
            color: Colors.white
            font.family: control.font.family
            font.pixelSize: 13
            font.weight: Font.DemiBold
            anchors.verticalCenter: parent.verticalCenter
            horizontalAlignment: Text.AlignHCenter
            opacity: control.busy ? 0.85 : 1
        }
    }

    scale: control.pressed ? 0.97 : 1.0
    Behavior on scale { NumberAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
}
