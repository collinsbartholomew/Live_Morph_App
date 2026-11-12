import QtQuick
import LiveMorph

/**
 * Honeycomb — the signature Obsidian Hex texture: a static flat-top hex field
 * painted once per geometry change on a Canvas (motion is banned project-wide,
 * so the pattern is pure geometry, no animation; all shading is painted in the
 * canvas, never a QML gradient element).
 *
 * Premium depth layers:
 *  - dual scale: a second, larger hex lattice (cellSize2) sits under the main
 *    one at lower alpha — a deep layered field instead of a flat mesh
 *  - radial glow: a soft canvas-painted light pool at (focusX,focusY)
 *  - radial fade: main cells dim quadratically with distance from the focus
 *  - sparkle: deterministic sparse filled cells
 *  - emphasis lattice: 1-in-N cells get a heavier stroke
 *  - constellation: 1-in-N cells get a bright fill + strong outline (stars)
 *  - highlightCells: "col,row" list rendered as filled cells with strong
 *    outline (bind to real state, e.g. the selected catalog index)
 *  - featureHex: large hex outline frame at the focus point
 *
 * Usage: Honeycomb { anchors.fill: parent; cellSize: Theme.honeycombCellLg; fadeRadius: 900; cellSize2: 90; glowAlpha: 0.05 }
 */
Item {
    id: root

    property int cellSize: Theme.honeycombCell          // primary flat-top hex width
    property color lineColor: Colors.honeycombLine
    property color lineColorStrong: Colors.honeycombLineStrong
    property real lineWidth: Theme.honeycombLineWidth
    property color fillColor: Colors.transparent        // set to fill every primary cell
    property var highlightCells: []                     // ["c,r", ...]
    property color highlightFill: Colors.honeycombCell
    property real highlightAlpha: 0.16
    // Spotlight focus (item coords, -1 = center) + radius
    property real focusX: -1
    property real focusY: -1
    property real fadeRadius: 0                        // 0 = uniform field
    // Soft light pool at the focus (canvas radial fill, alpha 0..1)
    property real glowAlpha: 0
    property color glowColor: Colors.white
    // Secondary larger lattice (0 = off), its own alpha multiplier
    property int cellSize2: 0
    property real cellSize2Alpha: 0.5
    // Sparkle / emphasis / constellation rates (0 = off)
    property int sparkleEvery: 29
    property real sparkleAlpha: 0.05
    property int emphasisEvery: 7
    property int constellationEvery: 53                // bright "star" cells
    property real constellationAlpha: 0.20
    // Feature hex frame at the focus
    property real featureHex: 0
    property real featureHexAlpha: 0.6

    onCellSizeChanged: canvas.requestPaint()
    onLineColorChanged: canvas.requestPaint()
    onLineWidthChanged: canvas.requestPaint()
    onFillColorChanged: canvas.requestPaint()
    onHighlightCellsChanged: canvas.requestPaint()
    onHighlightFillChanged: canvas.requestPaint()
    onHighlightAlphaChanged: canvas.requestPaint()
    onFocusXChanged: canvas.requestPaint()
    onFocusYChanged: canvas.requestPaint()
    onFadeRadiusChanged: canvas.requestPaint()
    onGlowAlphaChanged: canvas.requestPaint()
    onGlowColorChanged: canvas.requestPaint()
    onCellSize2Changed: canvas.requestPaint()
    onCellSize2AlphaChanged: canvas.requestPaint()
    onSparkleEveryChanged: canvas.requestPaint()
    onSparkleAlphaChanged: canvas.requestPaint()
    onEmphasisEveryChanged: canvas.requestPaint()
    onConstellationEveryChanged: canvas.requestPaint()
    onConstellationAlphaChanged: canvas.requestPaint()
    onFeatureHexChanged: canvas.requestPaint()
    onFeatureHexAlphaChanged: canvas.requestPaint()

    Canvas {
        id: canvas
        anchors.fill: parent

        function hexPath(ctx, cx, cy, s) {
            ctx.beginPath()
            for (var i = 0; i < 6; i++) {
                var a = Math.PI / 180 * (60 * i)
                var x = cx + s * Math.cos(a)
                var y = cy + s * Math.sin(a)
                if (i === 0)
                    ctx.moveTo(x, y)
                else
                    ctx.lineTo(x, y)
            }
            ctx.closePath()
        }

        function cellAlpha(cx, cy, fx, fy, fade) {
            if (!fade) return 1.0
            var dx = cx - fx, dy = cy - fy
            var t = Math.sqrt(dx * dx + dy * dy) / root.fadeRadius
            if (t > 1) t = 1
            return 1 - t * t
        }

        function paintGrid(ctx, size, alphaScale, fx, fy, fade, isPrimary, hl) {
            var s = size / 2
            var hStep = 1.5 * s
            var vStep = Math.sqrt(3) * s
            var cols = Math.ceil(width / hStep) + 2
            var rows = Math.ceil(height / vStep) + 2
            ctx.lineWidth = root.lineWidth
            for (var c = -1; c < cols; c++) {
                for (var r = -1; r < rows; r++) {
                    var cx = c * hStep
                    var cy = r * vStep + (Math.abs(c % 2) === 1 ? vStep / 2 : 0)
                    var alpha = cellAlpha(cx, cy, fx, fy, fade) * alphaScale
                    if (alpha < 0.03) continue
                    var key = c + "," + r
                    var hot = isPrimary && hl[key] === true
                    var hash = Math.abs(c * 31 + r * 17) // deterministic per-cell

                    canvas.hexPath(ctx, cx, cy, s - root.lineWidth / 2)

                    if (hot) {
                        ctx.fillStyle = Qt.rgba(root.highlightFill.r, root.highlightFill.g, root.highlightFill.b, root.highlightAlpha)
                        ctx.fill()
                    } else if (isPrimary && root.constellationEvery > 0 && hash % root.constellationEvery === 0) {
                        // constellation star: bright fill + strong outline
                        ctx.fillStyle = Qt.rgba(root.lineColorStrong.r, root.lineColorStrong.g, root.lineColorStrong.b, root.constellationAlpha * alpha)
                        ctx.fill()
                    } else if (isPrimary && root.fillColor !== Colors.transparent) {
                        ctx.fillStyle = root.fillColor
                        ctx.fill()
                    } else if (isPrimary && root.sparkleEvery > 0 && hash % root.sparkleEvery === 0) {
                        ctx.fillStyle = Qt.rgba(root.lineColor.r, root.lineColor.g, root.lineColor.b, root.sparkleAlpha * alpha)
                        ctx.fill()
                    }

                    var emphasized = isPrimary && root.emphasisEvery > 0
                                     && Math.abs(c * 13 + r * 29) % root.emphasisEvery === 0
                    var star = isPrimary && root.constellationEvery > 0 && hash % root.constellationEvery === 0
                    if (hot || star) {
                        ctx.strokeStyle = root.lineColorStrong
                        ctx.globalAlpha = Math.min(1, alpha * (hot ? 1.4 : 1.2))
                        ctx.lineWidth = root.lineWidth * 1.5
                    } else if (emphasized) {
                        ctx.strokeStyle = root.lineColor
                        ctx.globalAlpha = Math.min(1, alpha * 1.6)
                        ctx.lineWidth = root.lineWidth * 1.6
                    } else {
                        ctx.strokeStyle = root.lineColor
                        ctx.globalAlpha = alpha
                        ctx.lineWidth = root.lineWidth
                    }
                    ctx.stroke()
                    ctx.globalAlpha = 1
                    ctx.lineWidth = root.lineWidth
                }
            }
        }

        onPaint: {
            var ctx = getContext("2d")
            ctx.reset()
            if (width <= 0 || height <= 0 || root.cellSize <= 0)
                return

            var hl = {}
            for (var i = 0; i < root.highlightCells.length; i++) {
                var parts = String(root.highlightCells[i]).split(",")
                hl[parts[0] + "," + parts[1]] = true
            }

            var fx = root.focusX >= 0 ? root.focusX : width / 2
            var fy = root.focusY >= 0 ? root.focusY : height / 2
            var fade = root.fadeRadius > 0

            // (The old canvas radial-gradient light pool was removed: the
            // project directive bans gradients/glows project-wide. glowAlpha
            // remains as an inert API property.)

            // 2) secondary large lattice (under everything)
            if (root.cellSize2 > 0)
                paintGrid(ctx, root.cellSize2, root.cellSize2Alpha, fx, fy, fade, false, hl)

            // 3) feature hex frame at the focus
            if (root.featureHex > 0) {
                canvas.hexPath(ctx, fx, fy, root.featureHex / 2)
                ctx.strokeStyle = root.lineColorStrong
                ctx.globalAlpha = root.featureHexAlpha
                ctx.lineWidth = root.lineWidth * 1.5
                ctx.stroke()
                ctx.globalAlpha = 1
                ctx.lineWidth = root.lineWidth
            }

            // 4) primary lattice with spotlight fade + sparkle + emphasis + constellation
            paintGrid(ctx, root.cellSize, 1.0, fx, fy, fade, true, hl)
        }
        Component.onCompleted: requestPaint()
        onWidthChanged: requestPaint()
        onHeightChanged: requestPaint()
    }
}
