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
    property color iconColor: Colors.textMuted
    property color hoverColor: Colors.overlay50 // surface-overlay/50
    property color pressedColor: Colors.overlay60 // surface-overlay/70
    property int iconSize: Theme.iconMd
    property real radius: Theme.radiusMd
    property bool emphasis: false // stroke 2.5 for dismiss/confirm glyphs
    // Accessible label for icon-only buttons (screen readers); falls back to text.
    property string accessibleName: ""

    Accessible.name: control.accessibleName.length > 0 ? control.accessibleName : control.text

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
        FocusRing { shown: control.activeFocus; ringRadius: control.radius }
    }

    contentItem: Item {
        Icon {
            visible: control.name.length > 0
            anchors.centerIn: parent
            name: control.name
            size: control.iconSize
            emphasis: control.emphasis
            color: control.hovered && control.enabled ? Colors.textPrimary : control.iconColor
        }
        Text {
            visible: control.name.length === 0
            anchors.centerIn: parent
            text: control.iconText
            color: control.hovered && control.enabled ? Colors.textPrimary : control.iconColor
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            font.family: Theme.fontUi.family
            font.pixelSize: 12
            font.weight: Font.Bold
        }
    }

    scale: control.pressed ? 0.96 : 1.0
    opacity: control.enabled ? 1.0 : 0.5
}
