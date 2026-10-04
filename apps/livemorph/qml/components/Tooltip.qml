import QtQuick
import LiveMorph

/**
 * Electron tooltip (index zP / CSS ground truth):
 *   side:top (ABOVE), sideOffset:6, align:center, collisionPadding:8
 *   delayDuration:400  skipDelayDuration:300
 *   max-w-[260px] rounded-md(6) border-surface-border bg-surface-raised
 *   px-2.5 py-1.5 (10/6) text-[11px] font-medium text-text-primary
 *   shadow-popover · open: fade-in-up .22s · close: fade-out .12s · no arrow
 *
 * Placement: callers anchor this component; the CONTENT label wraps at 260px.
 */
Rectangle {
    id: root
    property string text: ""
    property bool shown: false
    property real showDelay: 400 // Electron delayDuration
    property real closeDuration: 120
    property real openDuration: 220

    // Internal visible state — the delay plays between `shown` and display.
    property bool _displayed: false

    visible: opacity > 0
    z: 1000
    implicitWidth: Math.min(lbl.implicitWidth + 20, 260)
    implicitHeight: lbl.implicitHeight + 12
    radius: Theme.radiusMd
    color: Colors.surfaceRaised
    border.color: Colors.surfaceBorder
    border.width: 1
    opacity: _displayed ? 1 : 0
    // fade-in-up rise via transform (y binding would fight caller anchors)
    transform: Translate { y: root._displayed ? 0 : 8 }

    // shadow-popover: 0 2px 6px rgba(0,0,0,.3), 0 12px 24px -8px rgba(0,0,0,.45)
    Rectangle {
        anchors.fill: parent
        anchors.margins: -1
        radius: parent.radius + 1
        color: "#0000004d"
        z: -1
    }
    Rectangle {
        anchors.fill: parent
        anchors.margins: -6
        anchors.topMargin: -4
        anchors.bottomMargin: -8
        radius: parent.radius + 6
        color: "#00000073"
        opacity: 0.7
        z: -1
    }

    Text {
        id: lbl
        anchors.centerIn: parent
        width: Math.min(implicitWidth, 240) // 260 - 2*10 padding
        text: root.text
        color: Colors.textPrimary
        font.pixelSize: 11
        font.weight: Font.Medium
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

    Behavior on opacity {
        NumberAnimation {
            duration: root._displayed ? root.openDuration : root.closeDuration
            easing.type: Easing.OutCubic
        }
    }
}
