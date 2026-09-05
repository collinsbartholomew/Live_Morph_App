import QtQuick
import QtQuick.Controls as Controls
import LiveMorph

/**
 * IconButton — unified icon action (title-bar, top-bar, drawer close buttons).
 * Prefer `name` (vector Icon); `iconText` kept for any legacy glyph callers.
 */
Controls.Button {
    id: control
    property string name: ""
    property string iconText: ""
    property color iconColor: Colors.textSecondary
    property color hoverColor: Colors.white06
    property int iconSize: Theme.iconLg

    implicitWidth: 32
    implicitHeight: 28
    padding: 0

    background: Rectangle {
        color: control.hovered ? control.hoverColor : "transparent"
        radius: Theme.radiusSm
    }

    contentItem: Item {
        Icon {
            visible: control.name.length > 0
            anchors.centerIn: parent
            name: control.name
            size: control.iconSize
            color: control.iconColor
        }
        Text {
            visible: control.name.length === 0
            anchors.centerIn: parent
            text: control.iconText
            color: control.iconColor
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            font.pixelSize: 12
            font.weight: Font.DemiBold
        }
    }
}