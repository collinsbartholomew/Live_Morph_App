import QtQuick
import QtQuick.Controls as Controls
import LiveMorph

/**
 * IconButton — unified icon action (title-bar, top-bar, drawer close buttons).
 * Electron spec: h-9 w-9 (36×36) rounded-sm text-text-muted
 *   hover:text-text-primary hover:bg-surface-overlay/50
 *   active:scale-[0.96] active:bg-surface-overlay/70
 *   focus-visible:ring-2 ring-accent/50  ·  disabled:opacity-50
 * `iconText` kept for any legacy glyph callers.
 */
Controls.Button {
    id: control
    property string name: ""
    property string iconText: ""
    property color iconColor: control.enabled ? Colors.textMuted : Colors.textMuted
    property color hoverColor: "#17171f80" // surface-overlay/50
    property color pressedColor: "#17171f99" // surface-overlay/70
    property int iconSize: Theme.iconMd
    property real radius: Theme.radiusSm
    property bool emphasis: false // stroke 2.5 for dismiss/confirm glyphs

    // Electron default 36×36; title-bar window controls override to 48×40.
    implicitWidth: 36
    implicitHeight: 36
    padding: 0

    background: Rectangle {
        radius: control.radius
        color: !control.enabled ? Colors.transparent
             : control.pressed ? control.pressedColor
             : control.hovered ? control.hoverColor
             : Colors.transparent
        Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
        FocusRing { shown: control.activeFocus; ringRadius: Theme.radiusSm }
    }

    contentItem: Item {
        Icon {
            visible: control.name.length > 0
            anchors.centerIn: parent
            name: control.name
            size: control.iconSize
            emphasis: control.emphasis
            color: control.hovered && control.enabled ? Colors.textPrimary : control.iconColor
            Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
        }
        Text {
            visible: control.name.length === 0
            anchors.centerIn: parent
            text: control.iconText
            color: control.hovered && control.enabled ? Colors.textPrimary : control.iconColor
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            font.pixelSize: 12
            font.weight: Font.DemiBold
        }
    }

    scale: control.pressed ? 0.96 : 1.0
    Behavior on scale { NumberAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
    opacity: control.enabled ? 1.0 : 0.5
}
