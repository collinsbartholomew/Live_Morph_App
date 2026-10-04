import QtQuick
import QtQuick.Controls as Controls
import LiveMorph

/**
 * Electron ghost button (ground truth):
 *   px-4 py-2 rounded-sm text-[12px] font-medium text-text-secondary
 *   hover:text-text-primary hover:bg-surface-overlay
 *   active:opacity-70 (no scale animation)
 */
Controls.Button {
    id: control

    implicitHeight: 32
    padding: control.text.length ? 16 : 10
    font: Theme.fontSmall

    background: Rectangle {
        radius: Theme.radiusSm
        color: !control.enabled ? Colors.transparent
             : control.hovered ? "#17171f80" // surface-overlay/50 wash
             : Colors.transparent
        Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
        FocusRing { shown: control.activeFocus; ringRadius: Theme.radiusSm }
    }

    contentItem: Text {
        text: control.text
        color: !control.enabled ? Colors.textMuted
             : control.hovered ? Colors.textPrimary
             : Colors.textSecondary
        font.pixelSize: 12
        font.weight: Font.Medium
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
        Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
    }

    // Electron: active:opacity-70 dip instead of a scale animation
    opacity: !control.enabled ? 0.45 : (control.pressed ? 0.7 : 1.0)
    Behavior on opacity { NumberAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
}
