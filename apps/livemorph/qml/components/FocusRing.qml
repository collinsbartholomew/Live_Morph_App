import QtQuick
import LiveMorph

/**
 * Focus-visible ring: border-only rectangle floating outside the control.
 *   FocusRing { shown: control.activeFocus; ringRadius: Theme.radiusMd }
 * offset = gap between control edge and ring (default 2), width = ring
 * thickness (default 2, ringWidth) — matches ring-2 ring-offset-2.
 */
Rectangle {
    id: root

    property bool shown: false
    property real ringRadius: Theme.radiusMd
    property color ringColor: Colors.focusRing
    property real offset: 2
    property real ringWidth: 2

    anchors.centerIn: parent
    width: parent.width + 2 * (offset + ringWidth)
    height: parent.height + 2 * (offset + ringWidth)
    radius: ringRadius + offset + ringWidth
    color: Colors.transparent
    border.width: ringWidth
    border.color: ringColor
    visible: shown && parent.visible
    opacity: shown ? 1 : 0
}
