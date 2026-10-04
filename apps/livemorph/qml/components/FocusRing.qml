import QtQuick
import LiveMorph

/**
 * Electron focus-visible ring parity: ring-2 ring-accent/50 ring-offset-2.
 * Attach as a child of any control and bind `shown` to activeFocus:
 *   FocusRing { shown: control.activeFocus; ringRadius: Theme.radiusSm }
 * The ring floats 4px outside the control edge (2px offset + 2px ring) and
 * is a border-only rectangle, so it never covers the control itself.
 */
Rectangle {
    id: root

    property bool shown: false
    property real ringRadius: Theme.radiusSm
    property color ringColor: Colors.focusRing

    anchors.centerIn: parent
    width: parent.width + 8
    height: parent.height + 8
    radius: ringRadius + 4
    color: Colors.transparent
    border.color: ringColor
    border.width: 2
    visible: shown && parent && parent.visible
    opacity: shown ? 1 : 0

    Behavior on opacity {
        NumberAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic }
    }
}
