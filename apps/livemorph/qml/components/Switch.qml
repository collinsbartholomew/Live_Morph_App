import QtQuick
import LiveMorph

/**
 * Obsidian Hex switch: 40×22 track, 16px knob, solid white track when on
 * (black knob) for a crisp monochrome toggle. Keyboard: root holds focus
 * (activeFocusOnTab), Space toggles.
 */
Item {
    id: root
    activeFocusOnTab: true
    property bool checked: false
    // `enabled` is intentionally NOT re-declared: the built-in Item.enabled is
    // the single source of truth (callers set `enabled: false`).
    property string accessibleName: ""
    signal toggled(bool checked)

    Accessible.role: Accessible.Switch
    Accessible.checkable: true
    Accessible.checked: root.checked
    Accessible.name: root.accessibleName
    Accessible.description: root.checked ? qsTr("On") : qsTr("Off")

    implicitWidth: 40
    implicitHeight: 22

    opacity: root.enabled ? 1.0 : 0.5

    Keys.onSpacePressed: function(event) {
        if (root.enabled) {
            root.toggled(!root.checked)
            event.accepted = true
        }
    }
    Keys.onReturnPressed: function(event) {
        if (root.enabled) {
            root.toggled(!root.checked)
            event.accepted = true
        }
    }
    Keys.onEnterPressed: function(event) {
        if (root.enabled) {
            root.toggled(!root.checked)
            event.accepted = true
        }
    }

    FocusRing {
        shown: root.activeFocus
        ringRadius: Theme.radiusFull
    }

    Rectangle {
        anchors.fill: parent
        radius: Theme.radiusFull
        color: Colors.surfaceElevated
        border.width: 1
        border.color: ma.containsMouse && root.enabled ? Colors.accent40 : Colors.surfaceBorder
        Rectangle {
            anchors.fill: parent
            radius: Theme.radiusFull
            color: Colors.accent
            visible: root.checked
        }

        // Hex knob — the honeycomb signature on every toggle. Flat-top hex,
        // black when on (sits on the white track), white when off.
        Hexagon {
            id: knob
            size: 16
            lineWidth: 0
            anchors.verticalCenter: parent.verticalCenter
            x: root.checked ? parent.width - width - 3 : 3
            fillColor: root.checked ? Colors.black : Colors.white
        }
    }

    MouseArea {
        id: ma
        anchors.fill: parent
        enabled: root.enabled
        hoverEnabled: true
        cursorShape: root.enabled ? Qt.PointingHandCursor : Qt.ArrowCursor
        onClicked: {
            // Never assign root.checked here — it would destroy the caller's
            // declarative binding; the caller's toggled() updates the source.
            root.toggled(!root.checked)
        }
    }
}
