import QtQuick
import QtQuick.Controls as Controls
import LiveMorph

/**
 * Nocturne text field: elevated fill, 1px border, accent focus ring
 * (50% border + 3px accent/15 halo), inset top highlight, disabled state.
 */
Controls.TextField {
    id: control
    color: Colors.textPrimary
    placeholderTextColor: Colors.textMuted
    font: Theme.fontUi
    leftPadding: 14
    rightPadding: 14
    topPadding: 11
    bottomPadding: 11
    selectByMouse: true
    selectedTextColor: Colors.selectionText
    selectionColor: Colors.selectionBg

    // When true, the window-level Escape shortcut delegates to this field
    // (see main.qml) and emits escapeRevertRequested, because the Shortcut
    // consumes the key before any Keys.onEscapePressed on the field fires.
    property bool escapeReverts: false
    signal escapeRevertRequested()

    background: Item {
        implicitHeight: 44

        FocusRing {
            shown: control.activeFocus
            ringRadius: Theme.inputRadius
        }

        Rectangle {
            anchors.fill: parent
            radius: Theme.inputRadius
            color: !control.enabled ? Colors.surfaceRaised
                 : control.activeFocus ? Colors.surfaceFocus
                 : control.hovered ? Colors.surfaceHover
                 : Colors.surfaceElevated
            border.color: !control.enabled ? Colors.surfaceBorderSubtle
                        : control.activeFocus ? Colors.focusRing
                        : control.hovered ? Colors.surfaceBorderStrong
                        : Colors.surfaceBorder
            border.width: 1
            // Inset highlight (top edge)
            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                height: 1
                radius: Theme.radiusHairline
                color: control.activeFocus ? Colors.insetHighlight : Colors.insetHighlightSoft
                z: Theme.zLocal1
            }
        }
    }

    opacity: control.enabled ? 1.0 : 0.6
}
