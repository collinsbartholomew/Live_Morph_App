import QtQuick
import LiveMorph

/**
 * Lightweight circular spinner — does not depend on parent surface color.
 */
Item {
    id: root
    property int size: 24
    property color color: Colors.accent
    width: size
    height: size
    implicitWidth: size
    implicitHeight: size

    // Track
    Rectangle {
        anchors.fill: parent
        radius: width / 2
        color: "transparent"
        border.color: Qt.rgba(root.color.r, root.color.g, root.color.b, 0.2)
        border.width: Math.max(2, size / 10)
    }

    // Sweep arc via rotating partial ring
    Canvas {
        id: canvas
        anchors.fill: parent
        onPaint: {
            var ctx = getContext("2d")
            ctx.reset()
            var w = width
            var line = Math.max(2, size / 10)
            ctx.strokeStyle = root.color
            ctx.lineWidth = line
            ctx.lineCap = "round"
            ctx.beginPath()
            var r = (w - line) / 2
            ctx.arc(w / 2, w / 2, r, -Math.PI / 2, Math.PI * 0.6)
            ctx.stroke()
        }
        Component.onCompleted: requestPaint()
        onWidthChanged: requestPaint()
    }

    RotationAnimation on rotation {
        from: 0
        to: 360
        duration: 850
        loops: Animation.Infinite
        running: root.visible
    }
}
