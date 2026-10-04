import QtQuick
import QtQuick.Controls as Controls
import LiveMorph

/**
 * Electron .input-field (ground truth):
 *   background:#101019 border:1px #262630 radius:4px padding:10px 14px 13px
 *   inset 0 1px #ffffff08
 *   focus: border-color:#8b5cf680 (accent 50%), background:#131320,
 *          box-shadow: 0 0 0 3px #8b5cf626 (3px accent-15% ring)
 *   ::selection #8b5cf659 / #f0f0f5
 */
Controls.TextField {
    id: control
    color: Colors.textPrimary
    placeholderTextColor: Colors.textMuted
    font: Theme.fontUi
    leftPadding: 14
    rightPadding: 14
    topPadding: 10
    bottomPadding: 10
    selectByMouse: true
    selectedTextColor: Colors.selectionText
    selectionColor: Colors.selectionBg

    background: Item {
        implicitHeight: 40

        // Focus ring: solid 3px accent/15 spread just outside the border
        Rectangle {
            anchors.fill: parent
            anchors.margins: -3
            radius: Theme.inputRadius + 3
            color: control.activeFocus ? Colors.accent15 : Colors.transparent
            Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
            z: -1
        }

        Rectangle {
            anchors.fill: parent
            radius: Theme.inputRadius
            color: control.activeFocus ? Colors.surfaceFocus : Colors.surfaceRaised
            // Electron keeps a 50%-alpha accent border on focus — never full-strength
            border.color: control.activeFocus ? Colors.focusRing
                        : control.hovered ? Colors.surfaceBorderStrong
                        : Colors.surfaceBorder
            border.width: 1
            // Inset highlight (top edge)
            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                height: 1
                radius: 1
                color: control.activeFocus ? Colors.insetHighlight : Colors.insetHighlightSoft
                z: 1
            }
            Behavior on border.color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
            Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
        }
    }
}
