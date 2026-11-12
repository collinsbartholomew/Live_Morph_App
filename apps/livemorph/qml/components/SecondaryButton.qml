import QtQuick
import QtQuick.Controls as Controls
import LiveMorph

/**
 * Nocturne secondary button: outline style. Hover = soft wash + primary text,
 * pressed = deeper wash. Destructive variant uses the error ramp.
 */
Controls.Button {
    id: control

    property bool compact: false
    property bool destructive: false // error-tinted variant (Cancel/Remove)

    implicitHeight: compact ? 28 : 36
    padding: compact ? 12 : 16
    font: Theme.fontUi

    background: Rectangle {
        radius: Theme.radiusMd
        color: !control.enabled ? Colors.transparent
             : control.pressed ? (control.destructive ? Colors.statusError20 : Colors.surfaceOverlay)
             : control.hovered ? (control.destructive ? Colors.statusError10 : Colors.overlay50)
             : Colors.transparent
        border.width: 1
        border.color: !control.enabled ? Colors.surfaceBorderSubtle
                    : control.destructive ? Colors.statusError40
                    : control.hovered ? Colors.surfaceBorderStrong
                    : Colors.surfaceBorder
        FocusRing { shown: control.activeFocus; ringRadius: Theme.radiusMd }
    }

    contentItem: Text {
        text: control.text
        color: !control.enabled ? Colors.textMuted
             : control.destructive ? Colors.statusError85
             : control.hovered || control.pressed ? Colors.textPrimary
             : Colors.textSecondary
        font.family: control.font.family
        font.pixelSize: control.compact ? 10 : 12
        font.weight: control.compact ? Font.Bold : Font.Normal
        font.capitalization: control.compact ? Font.AllUppercase : Font.MixedCase
        font.letterSpacing: control.compact ? 1.0 : 0
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
        elide: Text.ElideRight
    }

    opacity: control.enabled ? 1.0 : 0.5
    scale: control.pressed ? 0.98 : 1.0
}
