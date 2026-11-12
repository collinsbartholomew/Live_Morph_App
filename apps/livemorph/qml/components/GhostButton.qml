import QtQuick
import QtQuick.Controls as Controls
import LiveMorph

/**
 * Nocturne ghost button: text-only, soft wash on hover, opacity dip on press.
 */
Controls.Button {
    id: control

    implicitHeight: 36
    padding: control.text.length ? 16 : 10
    font: Theme.fontSmall

    background: Rectangle {
        radius: Theme.radiusMd
        color: !control.enabled ? Colors.transparent
             : control.pressed ? Colors.overlay60
             : control.hovered ? Colors.overlay50
             : Colors.transparent
        FocusRing { shown: control.activeFocus; ringRadius: Theme.radiusMd }
    }

    contentItem: Text {
        text: control.text
        color: !control.enabled ? Colors.textMuted
             : control.hovered || control.pressed ? Colors.textPrimary
             : Colors.textSecondary
        font: Theme.fontSmall
        elide: Text.ElideRight
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
    }

    opacity: !control.enabled ? 0.5 : (control.pressed ? 0.7 : 1.0)
}
