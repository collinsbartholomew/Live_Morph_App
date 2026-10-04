import QtQuick
import QtQuick.Controls as Controls
import LiveMorph

/**
 * Electron secondary button (ground truth): OUTLINE, not filled.
 *   px-4 py-2 rounded-sm border border-surface-border text-text-secondary
 *   text-[12px] font-medium
 *   hover:bg-surface-overlay/50 hover:text-text-primary
 *   disabled:opacity-50
 */
Controls.Button {
    id: control

    property bool compact: false // h-7 px-3 text-[10px] uppercase tracking-widest

    implicitHeight: compact ? 28 : 36
    padding: compact ? 12 : 16
    font: Theme.fontUi

    background: Rectangle {
        radius: Theme.radiusSm
        color: !control.enabled ? Colors.transparent
             : control.pressed ? Colors.surfaceOverlay
             : control.hovered ? "#17171f80" // surface-overlay/50
             : Colors.transparent
        border.width: 1
        border.color: !control.enabled ? Colors.surfaceBorderSubtle : Colors.surfaceBorder
        Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
        FocusRing { shown: control.activeFocus; ringRadius: Theme.radiusSm }
    }

    contentItem: Text {
        text: control.text
        color: !control.enabled ? Colors.textMuted
             : control.hovered || control.pressed ? Colors.textPrimary
             : Colors.textSecondary
        font.family: control.font.family
        font.pixelSize: control.compact ? 10 : 12
        font.weight: Font.Medium
        font.capitalization: control.compact ? Font.AllUppercase : Font.MixedCase
        font.letterSpacing: control.compact ? 1.0 : 0
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
        Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
    }

    opacity: control.enabled ? 1.0 : 0.5
    scale: control.pressed ? 0.98 : 1.0
    Behavior on scale { NumberAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
}
