import QtQuick
import LiveMorph

/**
 * Electron switch (Settings pe):
 *   h-5 w-9 (20×36) rounded-full border-transparent bg-surface-elevated
 *   data-checked:bg-accent · transition-colors 100ms ease-out
 *   thumb h-3.5 w-3.5 (14px) rounded-full bg-white
 *   shadow 0 1px 2px rgba(0,0,0,.4) · translate 3px→19px · 150ms ease-out
 *   disabled:opacity-50 · focus: ring-2 accent/50 offset-2
 */
Item {
    id: root
    property bool checked: false
    property bool enabled: true
    signal toggled(bool checked)

    implicitWidth: 36
    implicitHeight: 20

    opacity: root.enabled ? 1.0 : 0.5

    // Focus ring (keyboard): attach the switch to the tab chain via the
    // MouseArea's focus; rings while focused.
    FocusRing {
        shown: root.activeFocus
        ringRadius: Theme.radiusFull
    }

    Rectangle {
        anchors.fill: parent
        radius: Theme.radiusFull
        // Electron: border-transparent — track fill alone carries the state
        color: root.checked ? Colors.accent : Colors.surfaceElevated
        border.width: 0
        Behavior on color { ColorAnimation { duration: 100; easing.type: Easing.OutCubic } }

        Rectangle {
            id: knob
            width: 14
            height: 14
            radius: 7
            anchors.verticalCenter: parent.verticalCenter
            x: root.checked ? parent.width - width - 3 : 3
            color: Colors.white
            // Electron thumb shadow: 0 1px 2px rgba(0,0,0,.4)
            Rectangle {
                anchors.fill: parent
                anchors.margins: -1
                anchors.topMargin: -1
                radius: 8
                color: "#00000066"
                z: -1
            }
            Behavior on x { NumberAnimation { duration: 150; easing.type: Easing.OutCubic } }
        }
    }

    MouseArea {
        id: ma
        anchors.fill: parent
        enabled: root.enabled
        cursorShape: root.enabled ? Qt.PointingHandCursor : Qt.ArrowCursor
        // Keyboard parity: Space toggles when focused
        Keys.onSpacePressed: function(event) {
            root.toggled(!root.checked)
            event.accepted = true
        }
        onClicked: {
            // DO NOT assign root.checked here — writing it would destroy the
            // caller's declarative binding (e.g. `checked: Config.startWithCamera`)
            // and the toggle would desync from external truth after one click.
            // The caller's toggled() handler updates the source of truth, the
            // binding propagates back here.
            root.toggled(!root.checked)
        }
    }
}
