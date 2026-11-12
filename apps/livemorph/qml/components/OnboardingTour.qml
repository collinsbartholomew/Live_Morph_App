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
    z: Theme.zTour

    // Target items (set from Dashboard)
    property var targetTop: null
    property var targetStage: null
    property var targetWorkshop: null
    property var targetAction: null
    // Electron data-tour anchors (fine-grained)
    property var targetEngine: null
    property var targetPrompts: null
    property var targetPrivacy: null
    property var targetObs: null

    // Accepts {top, stage, workshop, action, engine, prompts, privacy, obs, topup}
    // or the legacy positional form (top, stage, workshop, action).
    function registerTargets(top, stage, workshop, action, engine, prompts, privacy, obs, topup) {
        if (top && top.top !== undefined && arguments.length === 1) {
            targetTop = top.top || null
            targetStage = top.stage || null
            targetWorkshop = top.workshop || null
            targetAction = top.action || null
            targetEngine = top.engine || null
            targetPrompts = top.prompts || null
            targetPrivacy = top.privacy || null
            targetObs = top.obs || null
            if (top.topup && top.topup.openAccountMenuForTour)
                topupHook = top.topup
            else
                targetTopup = top.topup || null
        } else {
            targetTop = top; targetStage = stage; targetWorkshop = workshop; targetAction = action
            targetEngine = engine || null
            targetPrompts = prompts || null
            targetPrivacy = privacy || null
            targetObs = obs || null
            targetTopup = topup || null
        }
        if (open)
            Qt.callLater(refreshHole)
    }
    property var targetTopup: null
    property var topupHook: null // component owning openAccountMenuForTour()

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
            key: "stage"
        },
        {
            // Electron onboarding.hitBeginSwap (act: go live)
            title: qsTr("One button, live"),
            body: qsTr("Begin Swap starts the transformation. Your camera drops to a corner and the swapped output takes the Stage."),
            key: "engine"
        },
        {
            // Electron onboarding.swapModes (act: go live) — interpolates live rates
            title: qsTr("Standard or HD"),
            body: qsTr("Standard is watermark-free at %1 credits/sec. HD adds smooth 30fps at the same %2 credits/sec. Switch here between swaps.")
                .arg(Session.creditsPerSecond.toFixed(0))
                .arg((Session.creditsPerSecond * (Backend.hdMultiplier || 1)).toFixed(0)),
            key: "engine"
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
            key: "engine"
        },
        {
            // Electron onboarding.credits (act: on stream) — opens the account menu
            title: qsTr("You pay for frames, not time"),
            body: qsTr("The meter runs only while swapped video is actually on screen. Warmup and idle cost nothing. Your balance and top-ups live here."),
            key: "top"
        }
    ]

    // Electron: the credits/topup step OPENS the account menu
    function onStepChangedEnsureMenu() {
        const step = root.steps[root.step]
        if (open && step && (step.key === "top" || step.key === "topup")) {
            if (topupHook && topupHook.openAccountMenuForTour)
                topupHook.openAccountMenuForTour()
        }
    }
    // Act chips (Electron onboarding.acts.*)
    readonly property var acts: [qsTr("Become"), qsTr("Go live"), qsTr("On stream")]
    function actIndexForStep(i) {
        // mirrors actForStep: 0,1,5 → 0(become); 2,3,4 → 1(go live); 6,7 → 2(on stream)
        if (i === 0 || i === 1 || i === 5) return 0
        if (i === 2 || i === 3 || i === 4) return 1
        return 2
    }
    function actForStep(i) {
        if (i === 0 || i === 1 || i === 5) return acts[0] // become
        if (i >= 2 && i <= 4) return acts[1]              // go live
        return acts[2]                                      // on stream
    }

    function targetForKey(key) {
        if (key === "stage") return targetStage
        if (key === "workshop") return targetWorkshop
        if (key === "action") return targetAction
        if (key === "engine") return targetEngine
        if (key === "prompts") return targetPrompts
        if (key === "privacy") return targetPrivacy
        if (key === "obs") return targetObs
        if (key === "top" || key === "topup") return targetTopup || targetTop
        return null
    }

    function holeRect() {
        if (!steps.length || step < 0 || step >= steps.length) return Qt.rect(0, 0, 0, 0)
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
        // Electron: steps without an anchor get a uniform dim + centered card
        var r = holeRect()
        if (root.step === 0) { // welcome — no anchor in Electron
            hx = -9999; hy = -9999; hw = 0; hh = 0
            card.x = Math.max(16, (root.width - Math.min(root.width - 48, 320)) / 2)
            card.y = Math.max(16, (root.height - card.implicitHeight) / 2)
            card.width = Math.min(root.width - 48, 320)
            return
        }
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

    onStepChanged: {
        Qt.callLater(refreshHole)
        onStepChangedEnsureMenu()
        Qt.callLater(card.forceActiveFocus) // Electron: autofocus after mount
    }
    onOpenChanged: if (open) Qt.callLater(refreshHole)
    onWidthChanged: if (open) Qt.callLater(refreshHole)
    onHeightChanged: if (open) Qt.callLater(refreshHole)

    // ── Dim overlay with rectangular cutout (4 panels) ───────────────
    // Electron dim: rgba(4,4,8,0.74)
    readonly property color dimColor: Colors.scrimMid

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

        // Spotlight: crisp 1px white ring + hex-tech corner brackets (no glow)
        Rectangle {
            x: root.hx - 2
            y: root.hy - 2
            width: root.hw + 4
            height: root.hh + 4
            radius: Theme.radiusMd
            color: Colors.transparent
            border.color: Colors.accent60
            border.width: 1
            z: Theme.zLocal1
        }
        Repeater {
            model: 4
            Item {
                readonly property int pos: index  // 0=TL 1=TR 2=BL 3=BR
                x: root.hx - 6 + ((pos % 2 === 0) ? 0 : root.hw + 12 - 12)
                y: root.hy - 6 + ((pos < 2) ? 0 : root.hh + 12 - 12)
                width: 12
                height: 12
                z: Theme.zLocal1
                Rectangle {
                    width: 3; height: parent.height
                    color: Colors.accent
                    x: (pos % 2 === 0) ? 0 : parent.width - width
                }
                Rectangle {
                    width: parent.width; height: 3
                    color: Colors.accent
                    y: (pos < 2) ? 0 : parent.height - height
                }
            }
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
    Keys.onTabPressed: card.forceActiveFocus() // trap Tab inside the card
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
        border.color: Colors.surfaceBorder
        border.width: 1
        clip: true
        z: Theme.zLocal2

        Honeycomb {
            anchors.fill: parent
            cellSize: Theme.honeycombCell
            lineColor: Colors.honeycombLineFaint
            opacity: 0.5
            sparkleEvery: 31
            sparkleAlpha: 0.06
        }

        // inset highlight
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 1
            color: Colors.insetHighlight
            radius: Theme.radiusLg
        }
        Hexagon {
            size: 9
            lineWidth: 1.5
            lineColor: Colors.accent
            anchors.left: parent.left
            anchors.leftMargin: 14
            anchors.top: parent.top
            anchors.topMargin: 0
            z: Theme.zLocal3
        }
        CornerTicks {
            anchors.fill: parent
            inset: 6
            tickSize: 8
            thickness: 1
            color: Colors.accent30
            z: Theme.zLocal3
        }
        Hexagon {
            size: 9
            lineWidth: 1.5
            lineColor: Colors.accent
            anchors.right: parent.right
            anchors.rightMargin: 14
            anchors.top: parent.top
            anchors.topMargin: 0
            z: Theme.zLocal3
        }

        ColumnLayout {
            id: cardCol
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.margins: 20
            spacing: 12

            RowLayout {
                Layout.fillWidth: true
                // Electron counter: "01" primary + " / 08" muted/40 + act label
                Row {
                    spacing: 0
                    Text {
                        text: ("0" + (root.step + 1)).slice(-2)
                        color: Colors.textPrimary
                        font.pixelSize: 11
                        font.family: Theme.fontMono.family
                        font.letterSpacing: 1.2
                    }
                    Text {
                        text: " / " + ("0" + root.steps.length).slice(-2)
                        color: Colors.textMuted40
                        font.pixelSize: 11
                        font.family: Theme.fontMono.family
                        font.letterSpacing: 1.2
                    }
                }
                Text {
                    text: root.actForStep(root.step)
                    color: Colors.textMuted
                    font.pixelSize: 10
                    font.family: Theme.fontMono.family
                    font.capitalization: Font.AllUppercase
                    font.letterSpacing: 1.5
                }
                Item { Layout.fillWidth: true }
                // Electron: X-icon skip with tooltip
                Rectangle {
                    width: 24; height: 24; radius: Theme.radiusMd
                    color: skipXMa.containsMouse ? Colors.textMuted10 : Colors.transparent
                    Icon {
                        anchors.centerIn: parent
                        name: "x"
                        size: 12
                        color: skipXMa.containsMouse ? Colors.textPrimary
                             : Colors.textMuted60
                    }
                    MouseArea {
                        id: skipXMa
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            Config.onboardingDone = true
                            root.open = false
                        }
                    }
                }
            }

            Text {
                text: (root.steps[root.step] || {title: ""}).title
                color: Colors.textPrimary
                font.pixelSize: 15
                font.weight: Font.Bold
                font.letterSpacing: -0.375 // tracking-tight
                Layout.fillWidth: true
                wrapMode: Text.WordWrap
            }

            Text {
                text: (root.steps[root.step] || {body: ""}).body
                color: Colors.textSecondary
                font.pixelSize: 12
                wrapMode: Text.WordWrap
                Layout.fillWidth: true
                lineHeight: 1.625 // leading-relaxed
            }

            // Electron: h-px act bar — 3 segments, fill = act progress,
            // glowing accent fill (shadow 0 0 6px rgba(139,92,246,.55))
            RowLayout {
                Layout.fillWidth: true
                Layout.topMargin: 4
                spacing: 4
                Repeater {
                    model: 3
                    delegate: Rectangle {
                        required property int index
                        Layout.fillWidth: true
                        height: 1
                        color: Colors.surfaceBorder
                        // fraction of THIS act's steps completed
                        property real frac: {
                            let first = -1, last = -1, cur = -1
                            for (let i = 0; i < root.steps.length; i++) {
                                const a = root.actIndexForStep(i)
                                if (a === index) {
                                    if (first < 0) first = i
                                    last = i
                                    if (i <= root.step) cur = i
                                }
                            }
                            if (first < 0) return 0
                            return (cur - first + 1) / (last - first + 1)
                        }
                        Rectangle {
                            width: parent.width * parent.frac
                            height: parent.height // fill the 1px track exactly (no 1px bleed)
                            color: Colors.accent
                        }
                    }
                }
            }

            RowLayout {
                Layout.topMargin: 8
                Layout.fillWidth: true
                // Back: icon-only (Electron)
                Rectangle {
                    width: 26; height: 26; radius: Theme.radiusMd
                    color: backMa.containsMouse && root.step > 0 ? Colors.overlay30 : Colors.transparent
                    opacity: root.step > 0 ? 1 : 0.25
                    Icon {
                        anchors.centerIn: parent
                        name: "chevron-left"
                        size: 14
                        color: Colors.textSecondary
                    }
                    MouseArea {
                        id: backMa
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        enabled: root.step > 0
                        onClicked: root.step = Math.max(0, root.step - 1)
                    }
                }
                Text {
                    text: qsTr("Skip tour")
                    color: skipMa.containsMouse ? Colors.textSecondary : Colors.textMuted
                    font.pixelSize: 11
                    MouseArea {
                        id: skipMa
                        anchors.fill: parent
                        anchors.margins: -4
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            Config.onboardingDone = true
                            root.open = false
                        }
                    }
                }
                Item { Layout.fillWidth: true }
                PrimaryButton {
                    // Electron final-step label
                    text: root.step === root.steps.length - 1 ? qsTr("Got it") : qsTr("Next")
                    implicitHeight: 30
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

}
