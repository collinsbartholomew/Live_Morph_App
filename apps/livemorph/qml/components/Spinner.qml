import QtQuick
import LiveMorph

/**
 * Nocturne spinner: track ring + quarter arc. Animations are banned
 * project-wide, so instead of spinning we gate the arc's opacity on
 * `running` (paused = dimmed static arc). Stroke scales with size.
 */
Item {
    id: root
    property int size: 18
    property color color: Colors.accent
    property color trackColor: Colors.accent20
    property bool running: true
    width: size
    height: size
    implicitWidth: size
    implicitHeight: size

    readonly property real line: Math.max(1.5, size * 0.1)
    onColorChanged: canvas.requestPaint()
    onLineChanged: canvas.requestPaint()
    onSizeChanged: canvas.requestPaint()

    Rectangle {
        anchors.fill: parent
        radius: Theme.radiusFull
        color: Colors.transparent
        border.color: root.trackColor
        border.width: root.line
    }

    Canvas {
        id: canvas
        anchors.fill: parent
        opacity: root.running ? 1.0 : 0.35
        onPaint: {
            var ctx = getContext("2d")
            ctx.reset()
            var w = width
            ctx.strokeStyle = root.color
            ctx.lineWidth = root.line
            ctx.lineCap = "round"
            ctx.beginPath()
            var r = (w - root.line) / 2
            ctx.arc(w / 2, w / 2, r, -Math.PI / 2, -Math.PI / 2 + Math.PI / 2)
            ctx.stroke()
        }
        Component.onCompleted: requestPaint()
        onWidthChanged: requestPaint()
        onHeightChanged: requestPaint()
    }
}
