import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

/**
 * Spotlight onboarding tour — cutout overlay over real layout targets.
 * Dashboard assigns: tour.registerTargets({ top, stage, workshop, action })
 */
Item {
    id: root
    property bool open: false
    property int step: 0
    anchors.fill: parent
    visible: open
    z: 180

    // Target items (set from Dashboard)
    property var targetTop: null
    property var targetStage: null
    property var targetWorkshop: null
    property var targetAction: null

    readonly property var steps: [
        {
            title: qsTr("1 · Enable your camera"),
            body: qsTr("Allow camera access and start the Stage preview. LiveMorph only uses the camera while you are signed in."),
            key: "stage"
        },
        {
            title: qsTr("2 · Pick a character"),
            body: qsTr("Choose a look from the Workshop. The highlighted card is the one that will morph when you go live."),
            key: "workshop"
        },
        {
            title: qsTr("3 · Start LiveMorph"),
            body: qsTr("Press Start on the action bar (or Space). Credits burn while you are live — buy more anytime from the top bar."),
            key: "action"
        }
    ]

    function targetForKey(key) {
        if (key === "stage") return targetStage
        if (key === "workshop") return targetWorkshop
        if (key === "action") return targetAction
        if (key === "top" || key === "account") return targetTop
        return null
    }

    function holeRect() {
        var key = steps[step].key
        var t = targetForKey(key)
        if (!t || key === "center") {
            // Center placeholder hole (no cutout focus)
            var w = Math.min(root.width * 0.5, 420)
            var h = Math.min(root.height * 0.35, 240)
            return Qt.rect((root.width - w) / 2, (root.height - h) / 2 - 40, w, h)
        }
        var p = t.mapToItem(root, 0, 0)
        var pad = 8
        return Qt.rect(
            Math.max(0, p.x - pad),
            Math.max(0, p.y - pad),
            Math.min(root.width - Math.max(0, p.x - pad), t.width + pad * 2),
            Math.min(root.height - Math.max(0, p.y - pad), t.height + pad * 2)
        )
    }

    property real hx: 0
    property real hy: 0
    property real hw: 100
    property real hh: 100

    function refreshHole() {
        var r = holeRect()
        hx = r.x; hy = r.y; hw = r.width; hh = r.height
        positionCard()
    }

    function positionCard() {
        // Prefer below hole; if no room, above; clamp to margins
        var margin = 16
        var cw = Math.min(root.width - 48, 400)
        var ch = card.implicitHeight
        var cx = hx + (hw - cw) / 2
        cx = Math.max(margin, Math.min(root.width - cw - margin, cx))
        var cy = hy + hh + 16
        if (cy + ch > root.height - margin)
            cy = hy - ch - 16
        if (cy < margin)
            cy = Math.max(margin, (root.height - ch) / 2)
        card.x = cx
        card.y = cy
        card.width = cw
    }

    onStepChanged: Qt.callLater(refreshHole)
    onOpenChanged: if (open) Qt.callLater(refreshHole)
    onWidthChanged: if (open) Qt.callLater(refreshHole)
    onHeightChanged: if (open) Qt.callLater(refreshHole)

    // ── Dim overlay with rectangular cutout (4 panels) ───────────────
    Item {
        anchors.fill: parent
        visible: root.open

        Rectangle { // top
            x: 0; y: 0
            width: root.width
            height: Math.max(0, root.hy)
            color: "#000000cc"
        }
        Rectangle { // bottom
            x: 0
            y: root.hy + root.hh
            width: root.width
            height: Math.max(0, root.height - (root.hy + root.hh))
            color: "#000000cc"
        }
        Rectangle { // left
            x: 0
            y: root.hy
            width: Math.max(0, root.hx)
            height: root.hh
            color: "#000000cc"
        }
        Rectangle { // right
            x: root.hx + root.hw
            y: root.hy
            width: Math.max(0, root.width - (root.hx + root.hw))
            height: root.hh
            color: "#000000cc"
        }

        // Accent ring around hole
        Rectangle {
            x: root.hx - 2
            y: root.hy - 2
            width: root.hw + 4
            height: root.hh + 4
            radius: Theme.radiusMd
            color: "transparent"
            border.color: Colors.accent
            border.width: 2
            opacity: 0.9
        }

        MouseArea {
            anchors.fill: parent
            onClicked: { /* block clicks through dim */ }
        }
    }

    // Transparent pass-through in hole is intentional (user can see UI)
    // Card
    Rectangle {
        id: card
        width: 400
        implicitHeight: cardCol.implicitHeight + 32
        height: implicitHeight
        radius: Theme.radiusLg
        color: Colors.surfaceOverlay
        border.color: Colors.accent + "66"
        border.width: 1
        z: 2

        // inset highlight
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 1
            color: Colors.insetHighlight
            radius: Theme.radiusLg
        }

        ColumnLayout {
            id: cardCol
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.margins: 20
            spacing: 12

            RowLayout {
                Text {
                    text: "Step " + (root.step + 1) + " of " + root.steps.length
                    color: Colors.accent
                    font.pixelSize: 11
                    font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                    font.letterSpacing: 1.2
                    Layout.fillWidth: true
                }
                GhostButton {
                    text: "Skip"
                    onClicked: {
                        Config.onboardingDone = true
                        root.open = false
                    }
                }
            }

            Text {
                text: root.steps[root.step].title
                color: Colors.textPrimary
                font.pixelSize: 18
                font.weight: Font.DemiBold
                Layout.fillWidth: true
                wrapMode: Text.WordWrap
            }

            Text {
                text: root.steps[root.step].body
                color: Colors.textSecondary
                font.pixelSize: 13
                wrapMode: Text.WordWrap
                Layout.fillWidth: true
                lineHeight: 1.4
            }

            Row {
                spacing: 6
                Layout.alignment: Qt.AlignHCenter
                Layout.topMargin: 4
                Repeater {
                    model: root.steps.length
                    Rectangle {
                        width: index === root.step ? 18 : 8
                        height: 8
                        radius: 4
                        color: index === root.step ? Colors.accent : Colors.surfaceBorder
                        Behavior on width { NumberAnimation { duration: Theme.motionFast } }
                    }
                }
            }

            RowLayout {
                Layout.topMargin: 8
                Layout.fillWidth: true
                GhostButton {
                    text: "Back"
                    enabled: root.step > 0
                    onClicked: root.step = Math.max(0, root.step - 1)
                }
                Item { Layout.fillWidth: true }
                PrimaryButton {
                    text: root.step === root.steps.length - 1 ? "Finish" : "Next"
                    onClicked: {
                        if (root.step >= root.steps.length - 1) {
                            Config.onboardingDone = true
                            root.open = false
                        } else {
                            root.step++
                        }
                    }
                }
            }
        }
    }

    function start() {
        root.step = 0
        root.open = true
        Qt.callLater(refreshHole)
    }

    function registerTargets(top, stage, workshop, action) {
        targetTop = top
        targetStage = stage
        targetWorkshop = workshop
        targetAction = action
        if (open)
            Qt.callLater(refreshHole)
    }
}
