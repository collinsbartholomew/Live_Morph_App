import QtQuick
import LiveMorph

/**
 * Nocturne tooltip: elevated surface, soft layered shadow, top placement is
 * the caller's job (anchor above the control). Delay before showing.
 * Instant show/hide under the project-wide animation ban.
 */
Rectangle {
    id: root
    property string text: ""
    property bool shown: false
    property real showDelay: 400

    property bool _displayed: false

    visible: opacity > 0
    z: Theme.zTooltip
    implicitWidth: Math.min(lbl.implicitWidth + 20, 260)
    implicitHeight: lbl.implicitHeight + 12
    radius: Theme.radiusMd
    color: Colors.surfaceElevated
    border.color: Colors.surfaceBorder
    border.width: 1
    opacity: _displayed ? 1 : 0

    // Crisp offset edge instead of a soft shadow (monochrome, no blur)
    Rectangle {
        anchors.fill: parent
        anchors.margins: -1
        radius: parent.radius + 1
        color: Colors.transparent
        border.width: 1
        border.color: Colors.border20
        z: Theme.zUnder
    }

    Text {
        id: lbl
        anchors.centerIn: parent
        width: Math.min(implicitWidth, 240)
        text: root.text
        color: Colors.textPrimary
        font.family: Theme.fontUi.family
        font.pixelSize: 11
        font.weight: Font.Normal
        wrapMode: Text.WordWrap
        horizontalAlignment: Text.AlignHCenter
    }

    onShownChanged: {
        if (shown)
            delayTimer.restart()
        else {
            delayTimer.stop()
            _displayed = false
        }
    }

    Timer {
        id: delayTimer
        interval: root.showDelay
        onTriggered: root._displayed = true
    }
}
