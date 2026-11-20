import QtQuick
import LiveMorph

Item {
    id: root

    property int size: 320
    property bool illuminated: true
    property string glyph: "LM"
    property color lineColor: Colors.accent40
    property color strongLineColor: Colors.accent80

    width: size
    height: size
    implicitWidth: size
    implicitHeight: size

    onSizeChanged: canvas.requestPaint()
    onIlluminatedChanged: canvas.requestPaint()
    onLineColorChanged: canvas.requestPaint()
    onStrongLineColorChanged: canvas.requestPaint()

    Canvas {
        id: canvas
        anchors.fill: parent

        function hexPath(ctx, cx, cy, radius) {
            ctx.beginPath()
            for (var i = 0; i < 6; ++i) {
                var angle = Math.PI / 3 * i
                var x = cx + radius * Math.cos(angle)
                var y = cy + radius * Math.sin(angle)
                if (i === 0)
                    ctx.moveTo(x, y)
                else
                    ctx.lineTo(x, y)
            }
            ctx.closePath()
        }

        function polygon(ctx, points) {
            ctx.beginPath()
            for (var i = 0; i < points.length; ++i) {
                if (i === 0)
                    ctx.moveTo(points[i][0], points[i][1])
                else
                    ctx.lineTo(points[i][0], points[i][1])
            }
            ctx.closePath()
        }

        function vertex(cx, cy, radius, index) {
            var angle = Math.PI / 3 * index
            return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]
        }

        function prism(ctx, cx, cy, radius, depth, topAlpha, lineAlpha) {
            var right = vertex(cx, cy, radius, 0)
            var lowerRight = vertex(cx, cy, radius, 1)
            var lowerLeft = vertex(cx, cy, radius, 2)
            var left = vertex(cx, cy, radius, 3)

            polygon(ctx, [left, lowerLeft, [lowerLeft[0], lowerLeft[1] + depth], [left[0], left[1] + depth]])
            ctx.fillStyle = Qt.rgba(1, 1, 1, 0.025)
            ctx.fill()

            polygon(ctx, [lowerRight, lowerLeft, [lowerLeft[0], lowerLeft[1] + depth], [lowerRight[0], lowerRight[1] + depth]])
            ctx.fillStyle = Qt.rgba(1, 1, 1, 0.065)
            ctx.fill()
            ctx.strokeStyle = Qt.rgba(1, 1, 1, lineAlpha * 0.45)
            ctx.lineWidth = 1
            ctx.stroke()

            polygon(ctx, [right, lowerRight, [lowerRight[0], lowerRight[1] + depth], [right[0], right[1] + depth]])
            ctx.fillStyle = Qt.rgba(0, 0, 0, 0.72)
            ctx.fill()
            ctx.stroke()

            hexPath(ctx, cx, cy, radius)
            ctx.fillStyle = Qt.rgba(1, 1, 1, topAlpha)
            ctx.fill()
            ctx.strokeStyle = Qt.rgba(1, 1, 1, lineAlpha)
            ctx.lineWidth = 1.2
            ctx.stroke()

            hexPath(ctx, cx, cy, radius * 0.82)
            ctx.strokeStyle = Qt.rgba(1, 1, 1, lineAlpha * 0.32)
            ctx.lineWidth = 1
            ctx.stroke()
        }

        onPaint: {
            var ctx = getContext("2d")
            ctx.reset()
            if (width <= 0 || height <= 0)
                return

            var cx = width / 2
            var cy = height / 2 - width * 0.025
            var unit = Math.min(width, height)
            var outer = unit * 0.45
            var middle = unit * 0.355
            var inner = unit * 0.265

            ctx.lineJoin = "round"
            ctx.lineCap = "round"

            hexPath(ctx, cx, cy, outer)
            ctx.strokeStyle = Qt.rgba(root.lineColor.r, root.lineColor.g, root.lineColor.b, 0.32)
            ctx.lineWidth = 1
            ctx.setLineDash([2, 8])
            ctx.stroke()
            ctx.setLineDash([])

            hexPath(ctx, cx, cy, middle)
            ctx.strokeStyle = root.lineColor
            ctx.globalAlpha = 0.42
            ctx.stroke()
            ctx.globalAlpha = 1

            hexPath(ctx, cx, cy, inner)
            ctx.strokeStyle = root.strongLineColor
            ctx.globalAlpha = 0.34
            ctx.stroke()
            ctx.globalAlpha = 1

            for (var i = 0; i < 12; ++i) {
                var angle = Math.PI / 6 * i
                var c = Math.cos(angle)
                var s = Math.sin(angle)
                var start = unit * (i % 2 === 0 ? 0.365 : 0.39)
                var end = unit * (i % 2 === 0 ? 0.435 : 0.45)
                ctx.beginPath()
                ctx.moveTo(cx + c * start, cy + s * start)
                ctx.lineTo(cx + c * end, cy + s * end)
                ctx.strokeStyle = i % 3 === 0 ? root.strongLineColor : root.lineColor
                ctx.globalAlpha = i % 3 === 0 ? 0.75 : 0.34
                ctx.lineWidth = i % 3 === 0 ? 1.5 : 1
                ctx.stroke()

                if (i % 2 === 0) {
                    var nx = cx + c * unit * 0.465
                    var ny = cy + s * unit * 0.465
                    hexPath(ctx, nx, ny, unit * 0.012)
                    ctx.fillStyle = i % 4 === 0 ? root.strongLineColor : root.lineColor
                    ctx.globalAlpha = 0.8
                    ctx.fill()
                }
            }
            ctx.globalAlpha = 1

            for (var j = 0; j < 6; ++j) {
                var a = Math.PI / 3 * j
                var x1 = cx + Math.cos(a) * inner
                var y1 = cy + Math.sin(a) * inner
                var x2 = cx + Math.cos(a) * middle
                var y2 = cy + Math.sin(a) * middle
                var bendX = x1 + (x2 - x1) * 0.55
                var bendY = y1
                ctx.beginPath()
                ctx.moveTo(x1, y1)
                ctx.lineTo(bendX, bendY)
                ctx.lineTo(x2, y2)
                ctx.strokeStyle = root.lineColor
                ctx.globalAlpha = 0.55
                ctx.lineWidth = 1
                ctx.stroke()
                ctx.globalAlpha = 1
            }

            var satellites = [
                [-0.205, -0.115, 0.068, 0.055],
                [0.195, -0.13, 0.06, 0.04],
                [-0.225, 0.12, 0.052, 0.035],
                [0.215, 0.105, 0.074, 0.06],
                [0.0, -0.225, 0.047, 0.035],
                [0.0, 0.225, 0.056, 0.04]
            ]
            for (var k = 0; k < satellites.length; ++k) {
                var item = satellites[k]
                prism(ctx, cx + unit * item[0], cy + unit * item[1], unit * item[2], unit * 0.018, item[3], 0.34)
            }

            prism(ctx, cx, cy, unit * 0.158, unit * 0.032, root.illuminated ? 0.92 : 0.085, root.illuminated ? 0.95 : 0.52)

            ctx.beginPath()
            ctx.moveTo(cx - unit * 0.41, cy)
            ctx.lineTo(cx - unit * 0.385, cy)
            ctx.moveTo(cx + unit * 0.385, cy)
            ctx.lineTo(cx + unit * 0.41, cy)
            ctx.moveTo(cx, cy - unit * 0.41)
            ctx.lineTo(cx, cy - unit * 0.385)
            ctx.moveTo(cx, cy + unit * 0.385)
            ctx.lineTo(cx, cy + unit * 0.41)
            ctx.strokeStyle = root.strongLineColor
            ctx.globalAlpha = 0.8
            ctx.lineWidth = 1.5
            ctx.stroke()
            ctx.globalAlpha = 1
        }

        Component.onCompleted: requestPaint()
        onWidthChanged: requestPaint()
        onHeightChanged: requestPaint()
    }

    Text {
        anchors.centerIn: parent
        anchors.verticalCenterOffset: -root.size * 0.025
        text: root.glyph
        color: root.illuminated ? Colors.textOnAccent : Colors.textPrimary
        font.family: Theme.fontDisplay.family
        font.pixelSize: Math.max(18, root.size * 0.066)
        font.weight: Font.Bold
        font.letterSpacing: -0.5
    }
}
