import QtQuick
import QtQuick.Controls
import LiveMorph

/**
 * Nocturne scrollbar: slim rounded thumb; accent-colored while dragged,
 * strong border color on hover, hidden when content fits.
 * Attach: Flickable { ScrollBar.vertical: StyledScrollBar { } }
 */
ScrollBar {
    id: control
    property bool thin: false
    implicitWidth: thin ? 4 : 6
    contentItem: Rectangle {
        implicitWidth: control.implicitWidth
        radius: Theme.radiusFull
        color: control.pressed ? Colors.accent60
             : control.interactive && control.hovered ? Colors.surfaceBorderStrong
             : Colors.surfaceElevated
        opacity: control.size < 1.0 || control.pressed || control.hovered ? 1.0 : 0.0
    }
}
