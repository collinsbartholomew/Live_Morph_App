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
            // Electron onboarding.welcome
            title: qsTr("Welcome to LiveMorph"),
            body: qsTr("This is the Stage. Your swapped video plays here, and everything you need sits around it."),
            key: "center"
        },
        {
            // Electron onboarding.addCharacter (act: become)
            title: qsTr("Who you become"),
            body: qsTr("Drop in a photo of any face or character to become it, or pick one of the ready-made characters above."),
            key: "workshop"
        },
        {
            // Electron onboarding.hitBeginSwap (act: go live)
            title: qsTr("One button, live"),
            body: qsTr("Begin Swap starts the transformation. Your camera drops to a corner and the swapped output takes the Stage."),
            key: "action"
        },
        {
            // Electron onboarding.swapModes (act: go live) — interpolates live rates
            title: qsTr("Standard or HD"),
            body: qsTr("Standard is watermark-free at %1 credits/sec. HD adds smooth 30fps at the same %2 credits/sec. Switch here between swaps.")
                .arg(Session.creditsPerSecond.toFixed(0))
                .arg(Session.creditsPerSecond.toFixed(0)),
            key: "action"
        },
        {
            // Electron onboarding.liveEdit (act: go live)
            title: qsTr("Change it mid-swap"),
            body: qsTr("Open the prompt bar to adjust your look without stopping, and the background bar to put yourself somewhere else. Both apply to the live swap."),
            key: "stage"
        },
        {
            // Electron onboarding.privacy (act: become)
            title: qsTr("Private by default"),
            body: qsTr("This keeps your real camera off the output between swaps, so viewers only ever see the swapped result."),
            key: "stage"
        },
        {
            // Electron onboarding.streamOBS (act: on stream)
            title: qsTr("Straight into your stream"),
            body: qsTr("The OBS button starts a stream your broadcast app can capture, or drag it straight into an OBS scene. The output also works as a virtual camera in Zoom and Discord."),
            key: "action"
        },
        {
            // Electron onboarding.credits (act: on stream) — opens the account menu
            title: qsTr("You pay for frames, not time"),
            body: qsTr("The meter runs only while swapped video is actually on screen. Warmup and idle cost nothing. Your balance and top-ups live here."),
            key: "top"
        }
    ]

    // Act chips (Electron onboarding.acts.*)
    readonly property var acts: [qsTr("Become"), qsTr("Go live"), qsTr("On stream")]
    function actForStep(i) {
        if (i === 0 || i === 1 || i === 5) return acts[0] // become
        if (i >= 2 && i <= 4) return acts[1]              // go live
        return acts[2]                                      // on stream
    }

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
        var cw = Math.min(root.width - 48, 320)
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
    // Electron dim: rgba(4,4,8,0.74)
    readonly property color dimColor: "#040408bd"

    Item {
        anchors.fill: parent
        visible: root.open

        Rectangle { // top
            x: 0; y: 0
            width: root.width
            height: Math.max(0, root.hy)
            color: root.dimColor
        }
        Rectangle { // bottom
            x: 0
            y: root.hy + root.hh
            width: root.width
            height: Math.max(0, root.height - (root.hy + root.hh))
            color: root.dimColor
        }
        Rectangle { // left
            x: 0
            y: root.hy
            width: Math.max(0, root.hx)
            height: root.hh
            color: root.dimColor
        }
        Rectangle { // right
            x: root.hx + root.hw
            y: root.hy
            width: Math.max(0, root.width - (root.hx + root.hw))
            height: root.hh
            color: root.dimColor
        }

        // Accent ring around hole (Electron: rgba(139,92,246,.55) 1px + glow)
        Rectangle {
            x: root.hx - 2
            y: root.hy - 2
            width: root.hw + 4
            height: root.hh + 4
            radius: Theme.radiusMd
            color: "transparent"
            border.color: "#8b5cf68c"
            border.width: 1
            opacity: 0.9
        }

        MouseArea {
            anchors.fill: parent
            onClicked: { /* block clicks through dim */ }
        }
    }

    // Keyboard navigation (Electron): Esc=skip, Enter/→=next, ←=back
    focus: open
    Keys.onEscapePressed: {
        Config.onboardingDone = true
        root.open = false
    }
    Keys.onReturnPressed: advance()
    Keys.onRightPressed: advance()
    Keys.onLeftPressed: root.step = Math.max(0, root.step - 1)

    function advance() {
        if (root.step >= root.steps.length - 1) {
            Config.onboardingDone = true
            root.open = false
        } else {
            root.step++
        }
    }

    // Transparent pass-through in hole is intentional (user can see UI)
    // Card
    Rectangle {
        id: card
        width: 320
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
                // Electron counter: zero-padded mono "01 / 08"
                Text {
                    text: ("0" + (root.step + 1)).slice(-2) + " / " + ("0" + root.steps.length).slice(-2)
                    color: Colors.textPrimary
                    opacity: 0.9
                    font.pixelSize: 11
                    font.family: Theme.fontMono.family
                    font.letterSpacing: 1.2
                }
                Text {
                    text: root.actForStep(root.step)
                    color: Colors.textMuted
                    opacity: 0.4
                    font.pixelSize: 11
                    font.family: Theme.fontMono.family
                    font.letterSpacing: 1.2
                }
                Item { Layout.fillWidth: true }
                GhostButton {
                    text: qsTr("Skip tour")
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
                    text: qsTr("Back")
                    enabled: root.step > 0
                    onClicked: root.step = Math.max(0, root.step - 1)
                }
                Item { Layout.fillWidth: true }
                PrimaryButton {
                    // Electron final-step label
                    text: root.step === root.steps.length - 1 ? qsTr("Got it") : qsTr("Next")
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
