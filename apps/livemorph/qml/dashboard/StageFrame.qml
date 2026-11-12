import QtQuick
import QtQuick.Layouts
import QtMultimedia
import LiveMorph

/**
 * StageFrame — Electron s1 ground truth:
 *   rounded(4) constant border · corner brackets FLUSH at corners (1px,
 *   state-colored: white/15 · accent/45 warming · accent live · error/70) ·
 *   bottom ellipse glow (warming /10, live /30 with 6.5s pulse, error /20
 *   constant, no pulse) · STAGE pill (16,12) · top-right HUD: Swap-Active +
 *   credits pills · top-left REC pill · bottom-right OBS chip ·
 *   double-click hint · top hairline · idle "Ready to stream" ·
 *   connecting overlay (camera behind bg-black/50 + spinner + label) ·
 *   error overlay (bg-black/70 + panel-premium card).
 */
Rectangle {
    id: root
    color: Colors.surfaceBase
    radius: Theme.radiusLg
    clip: true
    // Live sessions get a bolder accent border; idle stays neutral.
    border.color: Session.isActive ? Colors.accent : Colors.surfaceBorder
    border.width: Session.isActive ? 2 : 1

    // Double-click the stage → popout (Electron hint parity)
    signal popoutRequested()
    property bool hovered: false
    MouseArea {
        anchors.fill: parent
        acceptedButtons: Qt.LeftButton
        propagateComposedEvents: true
        hoverEnabled: true
        z: Theme.zLocal1_5
        onDoubleClicked: root.popoutRequested()
        onClicked: function(mouse) { mouse.accepted = false }
        onPressed: function(mouse) { mouse.accepted = false }
        onEntered: root.hovered = true
        onExited: root.hovered = false
    }

    // ── Top hairline (solid white/6, no gradient) ──
    Rectangle {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        height: 1
        color: Colors.white06
        z: Theme.zLocal9
    }

    // ── Bottom ellipse glow ────────────────────────────────────────────
    // Electron net opacities: warming accent/20 @ 50% = 0.10; live
    // accent/30 pulsing 0.30↔0.216 (0.72×); error error/25 @ 80% = 0.20,
    // NO pulse.

    // GStreamer WebRTC morph surface
    MorphStage {
        id: morphStage
        anchors.fill: parent
        active: Session.isActive
        visible: Session.isActive
        z: Theme.zLocal1
    }

    // Local camera when not morphing
    VideoOutput {
        id: videoOut
        anchors.fill: parent
        fillMode: VideoOutput.PreserveAspectCrop
        visible: CameraCtrl.isActive && Config.showCameraBeforeSwap && (!Session.isActive || !Session.hasFrames)
        transform: Scale {
            origin.x: videoOut.width / 2
            xScale: CameraCtrl.mirrored ? -1 : 1
        }
        onVisibleChanged: if (visible) CameraCtrl.bindVideoOutput(videoOut)
        Component.onCompleted: if (visible) CameraCtrl.bindVideoOutput(videoOut)
    }

    // ── Inline camera-error pill (Electron: 11px, error/10 + error/25,
    //    alert icon 12, message + underlined "Try again") ────────────
    // Anchored BELOW the STAGE/REC pill row (top 12 + 22 high + 10 gap) so
    // the two never overlap, and stretched to the right edge: without
    // anchors.right the RowLayout keeps a zero width and the inner
    // Layout.fillWidth rectangle collapses to nothing.
    RowLayout {
        visible: !CameraCtrl.isActive && !Session.isActive && CameraCtrl.lastError.length > 0
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.topMargin: 44
        anchors.leftMargin: 16
        anchors.rightMargin: 16
        spacing: 6
        z: Theme.zLocal12
        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 28
            radius: Theme.radiusMd
            color: Colors.statusError10
            border.color: Colors.statusError30
            border.width: 1
            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 10
                anchors.rightMargin: 10
                spacing: 6
                Icon { name: "alert-circle"; size: 12; color: Colors.statusError }
                Text {
                    text: CameraCtrl.lastError
                    color: Colors.statusError
                    font.pixelSize: 11
                    elide: Text.ElideRight
                    Layout.fillWidth: true
                }
                Text {
                    text: qsTr("Try again")
                    color: camRetryMa.containsMouse ? Colors.dangerHover : Colors.statusError
                    font.pixelSize: 11
                    font.underline: true
                    MouseArea {
                        id: camRetryMa
                        anchors.fill: parent
                        anchors.margins: -4
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: CameraCtrl.refreshDevices()
                    }
                }
            }
        }
    }

    // ── STAGE label pill (top-left, 16/12 inset) ─────────────────────
    Rectangle {
        id: stagePill
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.topMargin: 12
        anchors.leftMargin: 16
        height: 22
        width: stageLabel.implicitWidth + 16
        radius: Theme.radiusFull
        color: Colors.base70
        border.color: Colors.surfaceBorder
        border.width: 1
        z: Theme.zLocal5
        Text {
            id: stageLabel
            anchors.centerIn: parent
            text: qsTr("STAGE")
            color: Colors.textMuted
            font.family: Theme.fontMono.family
            font.pixelSize: 9
            font.letterSpacing: 1.5
        }
    }

    // ── REC pill (Electron: flex sibling after STAGE, gap-2) ──────
    Rectangle {
        visible: Recording.isRecording
        anchors.verticalCenter: stagePill.verticalCenter
        anchors.left: stagePill.right
        anchors.leftMargin: 8 // gap-2
        anchors.topMargin: 0
        height: 22
        width: recRow.implicitWidth + 12
        radius: Theme.radiusFull
        color: Colors.scrimHeavy // bg-black/70
        border.color: Colors.statusError40
        border.width: 1
        z: Theme.zLocal7

        Row {
            id: recRow
            anchors.centerIn: parent
            spacing: 5
            Hexagon {
                size: 8
                lineWidth: 0
                fillColor: Colors.statusError
                anchors.verticalCenter: parent.verticalCenter
            }
            Text {
                text: {
                    var s = Recording.elapsedMs / 1000
                    var h = Math.floor(s / 3600)
                    var m = Math.floor((s % 3600) / 60)
                    var sec = Math.floor(s % 60)
                    var pad = function(v) { return v < 10 ? "0" + v : "" + v }
                    return h > 0 ? (h + ":" + pad(m) + ":" + pad(sec)) : (pad(m) + ":" + pad(sec))
                }
                color: Colors.white95 // white/95
                font.pixelSize: 9
                font.family: Theme.fontMono.family
                anchors.verticalCenter: parent.verticalCenter
            }
        }
    }

    // ── Top-right HUD (Electron: swap-active + credits in ONE row) ──
    Row {
        anchors.top: parent.top
        anchors.right: parent.right
        anchors.topMargin: 12
        anchors.rightMargin: 16
        spacing: 8
        z: Theme.zLocal11

        // Swap Active pill: accent/10 + accent/20 border + pulsing dot
        Rectangle {
            visible: Session.isActive
            && Session.connectionStatus !== "connecting"
            && Session.connectionStatus !== "reconnecting"
            height: 24
            width: swapRow.implicitWidth + 16
            radius: Theme.radiusFull
            color: Colors.accent10
            border.color: Colors.accent20
            border.width: 1

            Row {
                id: swapRow
                anchors.centerIn: parent
                spacing: 6
                Hexagon {
                    size: 9
                    lineWidth: 0
                    fillColor: Colors.accent
                    anchors.verticalCenter: parent.verticalCenter
                }
                Text {
                    text: qsTr("Swap Active")
                    color: Colors.accentHover
                    font.pixelSize: 10
                    font.capitalization: Font.AllUppercase
                    font.letterSpacing: 1.0
                    font.family: Theme.fontMono.family
                    horizontalAlignment: Text.AlignHCenter
                    anchors.verticalCenter: parent.verticalCenter
                }
            }
        }

        // Credits pill: error ≤0 · warning <600 · base/70 otherwise
        Rectangle {
            visible: Session.isActive
            height: 24
            width: credRow.implicitWidth + 16
            radius: Theme.radiusFull
            color: (Auth.creditBalance + Auth.bonusBalance) <= 0 ? Colors.errorFaintBg
                 : (Auth.creditBalance + Auth.bonusBalance) < Constants.lowCreditThreshold ? Colors.warningFaintBg
                 : Colors.base70
            border.color: (Auth.creditBalance + Auth.bonusBalance) <= 0 ? Colors.statusError40
                 : (Auth.creditBalance + Auth.bonusBalance) < Constants.lowCreditThreshold ? Colors.statusWarning30
                 : Colors.surfaceBorder
            border.width: 1

            Row {
                id: credRow
                anchors.centerIn: parent
                spacing: 5
                Hexagon {
                    size: 9
                    lineWidth: 0
                    fillColor: (Auth.creditBalance + Auth.bonusBalance) <= 0 ? Colors.statusError
                             : (Auth.creditBalance + Auth.bonusBalance) < Constants.lowCreditThreshold ? Colors.statusWarning
                             : Colors.accent70
                    anchors.verticalCenter: parent.verticalCenter
                }
                Text {
                    text: Auth.creditBalance.toLocaleString(Qt.locale(I18n.uiLocaleName()), 'f', 0)
                    color: Auth.creditBalance <= 0 ? Colors.statusError
                         : Auth.creditBalance < Constants.lowCreditThreshold ? Colors.statusWarning
                         : Colors.textSecondary
                    font.pixelSize: 10
                    font.weight: Font.Bold
                    font.family: Theme.fontMono.family
                    anchors.verticalCenter: parent.verticalCenter
                }
            }

            MouseArea {
                id: credPillMa
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: App.openBuyCredits()
                hoverEnabled: true
            }
            Tooltip {
                anchors.top: parent.bottom
                anchors.topMargin: 6
                anchors.horizontalCenter: parent.horizontalCenter
                text: qsTr("%1 credits · burns %2/sec").arg(Number(Auth.creditBalance + Auth.bonusBalance).toFixed(0)).arg(Session.creditsPerSecond.toFixed(0))
                shown: credPillMa.containsMouse
            }
        }
    }

    // ── "OBS Stream Active" chip (bottom-right while streaming) ──────
    Rectangle {
        visible: StreamServer.running && !StreamServer.paused
        anchors.bottom: parent.bottom
        anchors.right: parent.right
        anchors.bottomMargin: 16
        anchors.rightMargin: 16
        height: 24
        width: obsRow.implicitWidth + 16
        radius: Theme.radiusFull
        color: Colors.statusSuccess10
        border.color: Colors.successFaintBorder
        border.width: 1
        z: Theme.zLocal7_5 // above connecting overlay (6) and idle state (4)

        Row {
            id: obsRow
            anchors.centerIn: parent
            spacing: 6
            Rectangle {
                width: 6; height: 6; radius: Theme.radiusXl
                color: Colors.statusSuccess
                anchors.verticalCenter: parent.verticalCenter
            }
            Text {
                text: qsTr("OBS Stream Active")
                color: Colors.statusSuccess
                font.pixelSize: 10
                font.family: Theme.fontMono.family
                font.capitalization: Font.AllUppercase
                font.letterSpacing: 1.5
                anchors.verticalCenter: parent.verticalCenter
            }
        }
    }

    // ── Double-click hint (hidden while live/warmup; 12px ext glyph) ─
    Row {
        readonly property bool warm: Session.connectionStatus === "connecting"
                                     || Session.connectionStatus === "reconnecting"
        visible: !Session.isActive && !warm
        anchors.top: parent.top
        anchors.right: parent.right
        anchors.topMargin: 12
        anchors.rightMargin: 16
        spacing: 6
        opacity: root.hovered ? 0.4 : 0
        z: Theme.zLocal11
        Text {
            text: qsTr("Double-click")
            color: Colors.white
            font.pixelSize: 9
            font.family: Theme.fontMono.family
            font.capitalization: Font.AllUppercase
            font.letterSpacing: 1.5
            anchors.verticalCenter: parent.verticalCenter
        }
        Icon {
            name: "external-link"
            size: 12
            color: Colors.white
            anchors.verticalCenter: parent.verticalCenter
        }
    }

    // ── Idle empty state (opaque bg + gradient icon disc + kbd hint) ──
    Item {
        anchors.fill: parent
        // Electron: empty/swap-only state — camera-off now renders the
        // camera-error pill instead of this content.
        visible: !Config.showCameraBeforeSwap && !Session.isActive && CameraCtrl.isActive
        z: Theme.zLocal4

        Rectangle { anchors.fill: parent; color: Colors.surfaceBase }

        // Premium honeycomb behind the idle state (dual scale + glow + feature hex)
        Honeycomb {
            anchors.fill: parent
            cellSize: Theme.honeycombCellLg
            cellSize2: Theme.honeycombCellLg * 3
            cellSize2Alpha: 0.4
            lineColor: Colors.honeycombLineFaint
            highlightCells: ["3,2", "4,2", "3,3", "5,3", "4,4"]
            opacity: Theme.honeycombIdleOpacity
            focusX: width / 2
            focusY: height / 2
            fadeRadius: Math.max(width, height) * 0.8
            glowAlpha: 0.05
            sparkleEvery: 23
            sparkleAlpha: 0.07
            emphasisEvery: 7
            constellationEvery: 53
            constellationAlpha: 0.2
            featureHex: Math.min(width, height) * 0.42
            featureHexAlpha: 0.5
        }

        Column {
            anchors.centerIn: parent
            spacing: 20
            width: Math.min(320, parent.width - 48)

            // Brand monogram cell with a play glyph (shared BrandMark)
            Item {
                width: 64
                height: 64
                anchors.horizontalCenter: parent.horizontalCenter
                BrandMark {
                    anchors.centerIn: parent
                    size: 64
                    letter: ""
                    lineWidth: 1.5
                    lineColor: Colors.white
                    fillColor: Colors.white
                    letterColor: Colors.black
                }
                Icon {
                    anchors.centerIn: parent
                    name: "play"
                    size: 24
                    color: Colors.black
                    emphasis: true
                }
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: qsTr("Ready to stream")
                color: Colors.textPrimary
                font: Theme.fontHeading
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                wrapMode: Text.WordWrap
                text: qsTr("Pick a character in the workshop, then start the swap.")
                color: Colors.textMuted
                font.pixelSize: 12
                lineHeight: 1.4
            }

            Row {
                anchors.horizontalCenter: parent.horizontalCenter
                spacing: 6
                Text {
                    text: qsTr("Press")
                    color: Colors.textMuted
                    font.pixelSize: 12
                    anchors.verticalCenter: parent.verticalCenter
                }
                Rectangle {
                    height: 24
                    width: beginChip.implicitWidth + 14
                    radius: Theme.radiusFull
                    color: Colors.accent12
                    border.color: Colors.accent30
                    border.width: 1
                    anchors.verticalCenter: parent.verticalCenter
                    Text {
                        id: beginChip
                        anchors.centerIn: parent
                        text: qsTr("BEGIN SWAP")
                        color: Colors.accentHover
                        font.pixelSize: 10
                        font.family: Theme.fontMono.family
                        font.weight: Font.Bold
                        font.letterSpacing: 1.2
                    }
                }
                Text {
                    text: qsTr("to transform")
                    color: Colors.textMuted
                    font.pixelSize: 12
                    anchors.verticalCenter: parent.verticalCenter
                }
            }
        }
    }

    // ── Corner brackets — FLUSH at corners, 2px arms ────────────────
    // idle: white/15 · warming: accent/45 · live: accent · error: error/70
    readonly property color bracketColor: Session.connectionStatus === "error" ? Colors.statusError60
        : Session.isActive
          ? (Session.connectionStatus === "connecting" || Session.connectionStatus === "reconnecting"
             ? Colors.accent45 : Colors.accent)
        : Colors.white15
    CornerTicks {
        anchors.fill: parent
        inset: 8
        tickSize: 16
        thickness: 2
        color: root.bracketColor
        z: Theme.zLocal10
    }

    // ── Connecting overlay (Electron: camera behind bg-black/50 + spinner) ──
    // Visible for connecting · reconnecting · live-but-no-frames-yet.
    Item {
        anchors.fill: parent
        visible: Session.isActive
            && (Session.connectionStatus === "connecting"
                || Session.connectionStatus === "reconnecting"
                || ((Session.connectionStatus === "connected"
                     || Session.connectionStatus === "generating")
                    && !Session.hasFrames))
        z: Theme.zLocal6

        // Electron: frozen last camera frame behind the scrim. Snapshotted on
        // demand (~2fps only while the overlay is visible) — a per-frame
        // dataURL binding would encode PNGs at 30fps and burn the CPU.
        Image {
            id: freezeImg
            anchors.fill: parent
            source: ""
            fillMode: Image.PreserveAspectCrop
            asynchronous: true
            visible: freezeImg.source.toString().length > 0
        sourceSize: Qt.size(Math.ceil(width * 2), Math.ceil(height * 2))
        }
        Timer {
            interval: 500
            repeat: true
            running: parent.visible && CameraCtrl.isActive
            onTriggered: freezeImg.source = CameraCtrl.snapshotDataUrl(640)
        }
        // Snapshot immediately when the overlay appears — no blank stage for
        // the first 500 ms while connecting.
        Connections {
            target: parent
            function onVisibleChanged() {
                if (parent.visible && CameraCtrl.isActive)
                    freezeImg.source = CameraCtrl.snapshotDataUrl(640)
            }
        }

        Rectangle { anchors.fill: parent; color: Colors.scrim } // bg-black/50

        // Glass card: spinner disc + status line + no-billing pill
        Rectangle {
            anchors.centerIn: parent
            width: cardCol.implicitWidth + 40
            implicitHeight: cardCol.implicitHeight + 32
            radius: Theme.radiusLg
            color: Colors.surfaceOverlay
            border.color: Colors.surfaceBorder
            border.width: 1
            clip: true

            // Faint honeycomb wash (signature texture on overlay cards)
            Honeycomb {
                anchors.fill: parent
                cellSize: Theme.honeycombCell
                lineColor: Colors.honeycombLineFaint
                opacity: 0.5
            }

            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                height: 1
                color: Colors.insetHighlightSoft
            }

            Column {
                id: cardCol
                anchors.centerIn: parent
                spacing: 10

                Item {
                    width: 48; height: 48
                    anchors.horizontalCenter: parent.horizontalCenter
                    Hexagon {
                        anchors.centerIn: parent
                        size: 48
                        lineWidth: 1.5
                        lineColor: Colors.accent30
                        fillColor: Colors.accent12
                    }
                    Spinner {
                        anchors.centerIn: parent
                        size: 22
                        running: true
                        color: Colors.accentHover
                    }
                }

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: Session.connectionStatus === "reconnecting"
                          ? qsTr("Reconnecting…") : qsTr("Connecting…")
                    color: Colors.textPrimary
                    font.pixelSize: 13
                    font.weight: Font.Bold
                }

                Rectangle {
                    height: 20
                    width: noCredLbl.implicitWidth + 12
                    radius: Theme.radiusFull
                    anchors.horizontalCenter: parent.horizontalCenter
                    color: Colors.transparent
                    border.color: Colors.surfaceBorder
                    border.width: 1
                    Text {
                        id: noCredLbl
                        anchors.centerIn: parent
                        text: qsTr("NO CREDITS USED YET")
                        color: Colors.textMuted
                        font.pixelSize: 9
                        font.family: Theme.fontMono.family
                        font.letterSpacing: 1.2
                    }
                }
            }
        }
    }

    // ── Error overlay (Electron: bg-black/70 + panel-premium 340px) ──
    property bool errorDismissed: false
    // True when the current error is a connection/engine failure (not a
    // billing/other error) — drives the network hint, the "No credits charged"
    // pill and the support link, replacing the old statusText prefix sniffing.
    readonly property bool isConnError: Session.errorKind === SessionManager.ErrorKind.Connection
        || Session.errorKind === SessionManager.ErrorKind.Stall
        || Session.errorKind === SessionManager.ErrorKind.NoOutput
    Connections {
        target: Session
        function onConnectionStatusChanged() {
            if (Session.status === SessionManager.Error)
                root.errorDismissed = false
        }
    }

    Item {
        anchors.fill: parent
        visible: Session.status === SessionManager.Error && !root.errorDismissed
        z: Theme.zLocal8

        Rectangle { anchors.fill: parent; color: Colors.scrimHeavy } // bg-black/70

        // panel-premium card
        Rectangle {
            anchors.centerIn: parent
            width: Math.min(340, parent.width - 48)
            height: errCol.implicitHeight + 48
            radius: Theme.radiusLg
            color: Colors.surfaceOverlay
            border.color: Colors.surfaceBorder
            border.width: 1
            clip: true

            // Faint honeycomb wash (signature texture on overlay cards)
            Honeycomb {
                anchors.fill: parent
                cellSize: Theme.honeycombCell
                lineColor: Colors.honeycombLineFaint
                opacity: 0.5
            }

            // top hairline (solid)
            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                height: 1
                color: Colors.white10
            }

            ColumnLayout {
                id: errCol
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                anchors.margins: 24
                spacing: 12

                // 44px error hexagon badge (bg-error/10 ring-error/20)
                Item {
                    width: 48; height: 48
                    Layout.alignment: Qt.AlignHCenter
                    Hexagon {
                        anchors.centerIn: parent
                        size: 48
                        lineWidth: 1.5
                        lineColor: Colors.statusError30
                        fillColor: Colors.errorFaintBg
                    }
                    Icon {
                        anchors.centerIn: parent
                        name: "alert-circle"
                        size: 20
                        color: Colors.statusError
                    }
                }

                Text {
                    Layout.fillWidth: true
                    Layout.alignment: Qt.AlignHCenter
                    horizontalAlignment: Text.AlignHCenter
                    wrapMode: Text.WordWrap
                    text: Session.statusText.length ? Session.statusText : qsTr("Something went wrong. Please try again.")
                    color: Colors.textPrimary
                    font.pixelSize: 14
                    font.weight: Font.Bold
                }

                Text {
                    Layout.fillWidth: true
                    Layout.alignment: Qt.AlignHCenter
                    horizontalAlignment: Text.AlignHCenter
                    wrapMode: Text.WordWrap
                    Layout.maximumWidth: 280
                    visible: root.isConnError || /network|connection|timeout|signaling/i.test(Session.statusText)
                    text: qsTr("A VPN, firewall, or work/school wifi may be blocking it. Try another network. Or switch to the Standard engine in Settings, which works on most networks.")
                    color: Colors.textSecondary
                    font.pixelSize: 12
                }

                // "No credits charged" as a bordered pill (Electron)
                Rectangle {
                    // Electron: shown only for errors NOT caused by
                    // connection/engine failures (those never bill anyway).
                    visible: Session.statusText.length > 0 && !root.isConnError
                    Layout.alignment: Qt.AlignHCenter
                    height: 24
                    width: ncLbl.implicitWidth + 20
                    radius: Theme.radiusFull
                    color: Colors.transparent
                    border.color: Colors.surfaceBorder
                    border.width: 1
                    Text {
                        id: ncLbl
                        anchors.centerIn: parent
                        text: qsTr("No credits charged")
                        color: Colors.textMuted
                        font.pixelSize: 10
                        font.family: Theme.fontMono.family
                    }
                }

                RowLayout {
                    Layout.alignment: Qt.AlignHCenter
                    Layout.topMargin: 4
                    spacing: 8

                    PrimaryButton {
                        text: Session.cooldownActive
                              ? qsTr("Try again in %n second", "Try again in %n seconds", Session.cooldownRemainingSec)
                              : qsTr("Try again")
                        enabled: !Session.cooldownActive
                        onClicked: {
                            root.errorDismissed = true
                            App.toggleSwap()
                        }
                    }
                    GhostButton {
                        text: qsTr("Dismiss")
                        onClicked: root.errorDismissed = true
                    }
                }

                // Contact support link (non-connection errors — Electron Vm)
                Text {
                    visible: Session.statusText.length > 0 && !root.isConnError
                    Layout.alignment: Qt.AlignHCenter
                    Layout.topMargin: 10
                    text: qsTr("Contact support")
                    color: supportLinkMa.containsMouse ? Colors.textPrimary : Colors.textSecondary
                    font.pixelSize: 11
                    font.underline: true
                    MouseArea {
                        id: supportLinkMa
                        anchors.fill: parent
                        anchors.margins: -4
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: Backend.openExternal(Constants.urlSupport)
                    }
                }
            }
        }
    }
}
