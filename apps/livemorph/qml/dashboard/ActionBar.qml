import LiveMorph
import QtQuick
import QtQuick.Layouts

/**
 * ActionBar (Electron WR, ground truth):
 *   h-[88px] px-6 border-t bg-surface-base
 *   left w-[360px]: warmup progression while connecting
 *     (spinner + stage1/long/stage3 copy + "no credits used yet"),
 *     else session cost block
 *   center CTA: 296×48 solid-white rounded-md, black uppercase label with
 *     corner ticks, in-CTA elapsed mono tabular while live
 *     cooldown: flat elevated + tooltip countdown
 *   right: 4 × 56×48 vertical buttons (REC/OBS/PREVIEW/POPOUT), 9px labels
 */
Rectangle {
    id: root

    property bool compact: false

    color: Colors.surfaceBase
    implicitHeight: compact ? Theme.actionBarHeightCompact : Theme.actionBarHeight

    // Warmup copy progression (Electron stage.warmup.*)
    function fmtInt(n) { return Math.round(n).toLocaleString(Qt.locale(I18n.uiLocaleName()), 'f', 0) }

    // Tour anchor export (Electron data-tour="obs")
    property var tourObs: obsBtn

    // Structured reconnect flag from SessionManager (not prose sniffing —
    // statusText is translated and would not match under other languages).
    readonly property bool reconnecting: Session.reconnecting
    readonly property bool warmingUp: Session.isActive
        && (Session.connectionStatus === "connecting"
            || root.reconnecting
            || ((Session.connectionStatus === "connected"
                 || Session.connectionStatus === "generating")
                && !Session.hasFrames))
    readonly property string warmupText: {
        if (root.reconnecting)
            return qsTr("Reconnecting…")
        const s = Session.elapsedSec
        if (s < 4) return qsTr("Contacting the engine…")
        if (s < 14) return qsTr("Warming up your character…")
        return qsTr("Almost there, first frames incoming…")
    }

    Rectangle {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        height: 1
        color: Colors.surfaceBorder
    }

    RowLayout {
        anchors.fill: parent
        anchors.leftMargin: 24
        anchors.rightMargin: 24
        spacing: 0

        // ── Left: w-[360px] — Electron: settings gear + warmup / session cost ──
        Item {
            Layout.preferredWidth: Theme.actionLeftWidth
            Layout.maximumWidth: Theme.actionLeftWidth
            Layout.minimumWidth: 0
            Layout.fillHeight: true
            clip: true

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 4
                anchors.rightMargin: 8
                spacing: 12

                // Settings gear (opens Settings — Electron)
                IconButton {
                    name: "settings"
                    accessibleName: qsTr("Settings")
                    iconSize: 18
                    iconColor: Colors.textMuted
                    radius: Theme.radiusSm
                    hoverColor: Colors.overlay40
                    width: 32; height: 32
                    Layout.alignment: Qt.AlignVCenter
                    onClicked: App.openSettings()
                    Tooltip {
                        anchors.bottom: parent.top
                        anchors.bottomMargin: 6
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: qsTr("Settings")
                        shown: parent.hovered
                    }
                }

                // Electron VR updater: progress pill / Restart & Update
                Rectangle {
                    Layout.alignment: Qt.AlignVCenter
                    visible: Backend.updateDownloading || Backend.updateDownloadedPath.length > 0
                    width: 30 + updateLbl.implicitWidth
                    height: 26
                    radius: Theme.radiusFull
                    color: pillHover.containsMouse ? Colors.accent15 : Colors.accent10
                    border.color: Colors.accent40
                    border.width: 1

                    Row {
                        anchors.centerIn: parent
                        spacing: 6
                        Text {
                            id: updateLbl
                            anchors.verticalCenter: parent.verticalCenter
                            text: Backend.updateDownloading
                                  ? qsTr("DOWN… %1%").arg(Math.round(Backend.updateProgress))
                                  : qsTr("RESTART & UPDATE")
                            color: Colors.accent
                            font.pixelSize: 11
                            font.weight: Font.Normal
                            font.capitalization: Font.AllUppercase
                            font.letterSpacing: 1.0
                        }
                    }
                    MouseArea {
                        id: pillHover
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: if (!Backend.updateDownloading && Backend.updateDownloadedPath.length > 0)
                                       Backend.installUpdate()
                    }
                }

                // Divider (h-9 w-px — one 360px group per Electron)
                Rectangle {
                    Layout.alignment: Qt.AlignVCenter
                    width: 1
                    height: 28
                    color: Colors.surfaceBorder
                }

                // Warmup / session cost — fills the rest of the 360px group
                Item {
                    Layout.fillWidth: true
                    Layout.alignment: Qt.AlignVCenter
                    Layout.preferredHeight: 30
                    clip: true

            // Electron warmup: spinner disc + 2-line stack
            Row {
                visible: root.warmingUp
                anchors.centerIn: parent
                spacing: 10

                Item {
                    width: 26; height: 26
                    anchors.verticalCenter: parent.verticalCenter
                    Hexagon {
                        anchors.centerIn: parent
                        size: 26
                        lineWidth: 1
                        lineColor: Colors.accent30
                        fillColor: Colors.accent12
                    }
                    Spinner { anchors.centerIn: parent; size: 12; color: Colors.accentHover }
                }

                Column {
                    anchors.verticalCenter: parent.verticalCenter
                    spacing: 2
                    Text {
                        text: root.warmupText
                        color: Colors.textPrimary
                        font.pixelSize: 12
                        font.weight: Font.Bold
                        elide: Text.ElideRight
                        width: Math.min(implicitWidth, 170)
                    }
                    Text {
                        text: qsTr("NO CREDITS USED YET")
                        color: Colors.textMuted
                        font.pixelSize: 9
                        font.capitalization: Font.AllUppercase
                        font.letterSpacing: 1.2
                        font.family: Theme.fontMono.family
                    }
                }
            }

            Column {
                visible: Session.isActive && Session.hasFrames
                anchors.centerIn: parent
                spacing: 3

                Text {
                    text: qsTr("SESSION COST")
                    color: Colors.textMuted
                    font.pixelSize: 9
                    font.family: Theme.fontMono.family
                    font.letterSpacing: 1.35
                    anchors.horizontalCenter: parent.horizontalCenter
                }

                Text {
                    // Electron: accumulated session cost = elapsed × rate.
                    // Session.creditsPerSecond ALREADY includes the HD multiplier.
                    text: qsTr("%1 cr").arg(fmtInt(Math.floor(Session.elapsedSec) * Session.creditsPerSecond))
                    color: Colors.textPrimary
                    font.pixelSize: 13
                    font.weight: Font.Bold
                    font.family: Theme.fontMono.family
                    anchors.horizontalCenter: parent.horizontalCenter
                }
            }
                }
            }
        }

        Rectangle {
            width: 1
            height: 28
            color: Colors.surfaceBorder
            Layout.alignment: Qt.AlignVCenter
        }



        Item {
            Layout.fillWidth: true
        }



        // ── Vertical quick actions — pinned FAR RIGHT (Electron) ──
        Row {
            spacing: 2
            Layout.alignment: Qt.AlignVCenter

            // Record button
            Rectangle {
                id: recBtn

                activeFocusOnTab: true
                Accessible.role: Accessible.Button
                Accessible.name: qsTr("Record")
                function activate() {
                    if (Recording.transitioning)
                        return
                    if (Recording.isRecording)
                        Recording.stopRecording()
                    else
                        Recording.startRecording(Session.activeCharacterId)
                }
                Keys.onReturnPressed: recBtn.activate()
                Keys.onSpacePressed: recBtn.activate()

                width: 56
                height: 48
                radius: Theme.radiusMd
                color: Recording.isRecording ? Colors.errorSoftBg
                        : (recMa.containsMouse ? Colors.overlay50 : Colors.transparent)
                border.width: Recording.isRecording ? 1 : 0
                border.color: Colors.statusError40

                Column {
                    visible: !Recording.transitioning
                    anchors.centerIn: parent
                    spacing: 5

                    Item {
                        width: 12; height: 12
                        anchors.horizontalCenter: parent.horizontalCenter
                        Rectangle {
                            anchors.centerIn: parent
                            width: Recording.isRecording ? 10 : 12
                            height: Recording.isRecording ? 10 : 12
                            radius: Recording.isRecording ? Theme.radiusSm : Theme.radiusFull
                            color: Recording.isRecording ? Colors.statusError : Colors.textMuted
                        }
                    }

                    Text {
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: {
                            var s = Recording.elapsedMs / 1000
                            var m = Math.floor(s / 60)
                            var sec = Math.floor(s % 60)
                            var pad = function(v) { return v < 10 ? "0" + v : "" + v }
                            return Recording.isRecording ? (pad(m) + ":" + pad(sec)) : qsTr("REC")
                        }
                        color: Recording.isRecording ? Colors.statusError
                             : (recMa.enabled && recMa.containsMouse) ? Colors.textPrimary
                             : Colors.textMuted
                        font.pixelSize: 9
                        font.weight: Font.Bold
                        font.letterSpacing: 1.0
                        font.capitalization: Font.AllUppercase
                    }
                }

                // Transient (Electron: sm spinner + "···" + "Working…")
                Column {
                    visible: Recording.transitioning
                    anchors.centerIn: parent
                    spacing: 2
                    Spinner {
                        anchors.horizontalCenter: parent.horizontalCenter
                        size: 12
                        color: Colors.textMuted
                    }
                    Text {
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: qsTr("···")
                        color: Colors.textMuted
                        font.pixelSize: 9
                        font.family: Theme.fontMono.family
                    }
                }

                MouseArea {
                    id: recMa

                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    hoverEnabled: true
                    onClicked: recBtn.activate()
                    onPressed: parent.scale = 0.97
                    onReleased: parent.scale = 1
                    onCanceled: parent.scale = 1
                }

                Tooltip {
                    anchors.bottom: parent.top
                    anchors.bottomMargin: 8
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: Recording.isRecording ? qsTr("Stop recording (F12)") : qsTr("Start recording (F12)")
                    shown: recMa.containsMouse
                }

            }

            // OBS button
            Rectangle {
                id: obsBtn
                activeFocusOnTab: true
                Accessible.role: Accessible.Button
                Accessible.name: qsTr("Stream output (OBS)")
                function activate() {
                    if (StreamServer.running) StreamServer.stop(); else StreamServer.start()
                }
                Keys.onReturnPressed: obsBtn.activate()
                Keys.onSpacePressed: obsBtn.activate()
                width: 56
                height: 48
                radius: Theme.radiusMd
                color: StreamServer.running ? Colors.statusSuccess10
                        : (obsMa.containsMouse ? Colors.overlay50 : Colors.transparent)
                border.width: StreamServer.running ? 1 : 0
                border.color: Colors.successFaintBorder

                Column {
                    anchors.centerIn: parent
                    spacing: 5

                    Icon {
                        name: "radio"
                        size: 20
                        color: StreamServer.running
                              ? (StreamServer.paused ? Colors.statusWarning : Colors.statusSuccess)
                              : Colors.textMuted
                        anchors.horizontalCenter: parent.horizontalCenter
                    }

                    Text {
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: StreamServer.running
                              ? (StreamServer.paused ? qsTr("PAUSED") : qsTr("LIVE"))
                              : qsTr("OBS")
                        color: StreamServer.running
                              ? (StreamServer.paused ? Colors.statusWarning : Colors.statusSuccess85)
                              : Colors.textMuted
                        font.pixelSize: 9
                        font.weight: Font.Bold
                        font.letterSpacing: 1.0
                        font.capitalization: Font.AllUppercase
                    }
                }

                MouseArea {
                    id: obsMa
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: obsBtn.activate()
                    onPressed: parent.scale = 0.97
                    onReleased: parent.scale = 1
                    onCanceled: parent.scale = 1
                }
                Tooltip {
                    anchors.bottom: parent.top
                    anchors.bottomMargin: 6
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: StreamServer.running
                          ? qsTr("Drag to OBS, or click to stop. URL: %1").arg(StreamServer.url)
                          : qsTr("Start OBS stream output (MJPEG server)")
                    shown: obsMa.containsMouse
                }
            }

            // Divider (Electron: h-8 w-px between OBS and preview group)
            Rectangle {
                width: 1
                height: 32
                color: Colors.border40
                anchors.verticalCenter: parent.verticalCenter
            }

            // Preview button
            Rectangle {
                id: previewBtn
                activeFocusOnTab: true
                Accessible.role: Accessible.Button
                Accessible.name: qsTr("Preview window")
                Keys.onReturnPressed: App.previewRequested()
                Keys.onSpacePressed: App.previewRequested()
                width: 56
                height: 48
                radius: Theme.radiusMd
                color: previewMa.containsMouse ? Colors.overlay50 : Colors.transparent
                border.width: 0

                Column {
                    anchors.centerIn: parent
                    spacing: 5

                    Icon {
                        name: "eye"
                        size: 20
                        color: previewMa.containsMouse ? Colors.textSecondary : Colors.textMuted
                        anchors.horizontalCenter: parent.horizontalCenter
                    }

                    Text {
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: qsTr("PREVIEW")
                        color: previewMa.containsMouse ? Colors.textSecondary : Colors.textMuted
                        font.pixelSize: 9
                        font.weight: Font.Bold
                        font.letterSpacing: 1.0
                        font.capitalization: Font.AllUppercase
                    }
                }

                MouseArea {
                    id: previewMa
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: App.previewRequested()
                    onPressed: parent.scale = 0.97
                    onReleased: parent.scale = 1
                    onCanceled: parent.scale = 1
                }
            }

            // Popout button
            Rectangle {
                id: popoutBtn
                activeFocusOnTab: true
                Accessible.role: Accessible.Button
                Accessible.name: qsTr("Popout window")
                Keys.onReturnPressed: App.popoutRequested()
                Keys.onSpacePressed: App.popoutRequested()
                width: 56
                height: 48
                radius: Theme.radiusMd
                color: popoutMa.containsMouse ? Colors.overlay50 : Colors.transparent
                border.width: 0

                Column {
                    anchors.centerIn: parent
                    spacing: 5

                    Icon {
                        name: "external-link"
                        size: 20
                        color: popoutMa.containsMouse ? Colors.textSecondary : Colors.textMuted
                        anchors.horizontalCenter: parent.horizontalCenter
                    }

                    Text {
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: qsTr("POPOUT")
                        color: popoutMa.containsMouse ? Colors.textSecondary : Colors.textMuted
                        font.pixelSize: 9
                        font.weight: Font.Bold
                        font.letterSpacing: 1.0
                        font.capitalization: Font.AllUppercase
                    }
                }

                MouseArea {
                    id: popoutMa
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: App.popoutRequested()
                    onPressed: parent.scale = 0.97
                    onReleased: parent.scale = 1
                    onCanceled: parent.scale = 1
                }
            }
        }

    }

    // ── CTA — Electron: absolutely centered over [360px left group … strip edge]
    Item {
        id: ctaWrap
        anchors.verticalCenter: parent.verticalCenter
        // Width reserved for the right quick-action cluster (REC/OBS/PREVIEW/
        // POPOUT 56px each + divider + gaps) so the centered CTA can never
        // slide under it at small window widths.
        readonly property real rightClusterReserve: 265
        // Centered over [left group … strip edge], but clamped so it can never
        // overlap the fixed left group or the right button cluster at small widths.
        property real cx: (parent.width + Theme.actionLeftWidth) / 2 - width / 2
        x: Math.max(24 + Theme.actionLeftWidth + 8, Math.min(cx, parent.width - width - rightClusterReserve))
        width: morphBtn.width
        height: morphBtn.height


                Rectangle {
                    id: morphBtn

                    property bool liveBlocked: Session.cooldownActive

                    width: 296
                    height: 48
                    radius: Theme.radiusMd
                    // Obsidian Hex CTA: solid white when actionable, black
                    // text; disabled = flat elevated surface. No gradient,
                    // no glow halo.
                    color: morphMa.ctaEnabled ? Colors.accent : Colors.surfaceElevated
                    border.width: 1
                    border.color: morphMa.ctaEnabled ? Colors.accent
                           : Colors.surfaceBorderSubtle
                    opacity: morphMa.ctaEnabled ? (morphMa.containsMouse ? 1 : 0.95) : 1

                    // corner ticks on the CTA (hex-tech framing)
                    CornerTicks {
                        anchors.fill: parent
                        inset: 6
                        tickSize: 6
                        thickness: 1
                        color: morphMa.ctaEnabled ? Colors.textOnAccent : Colors.surfaceBorderStrong
                        opacity: morphMa.ctaEnabled ? 0.9 : 0.6
                    }

                    Row {
                        anchors.centerIn: parent
                        spacing: 8

                        // Live: hex status glyph; idle: hex play glyph
                        Hexagon {
                            visible: Session.isActive
                            size: 10
                            lineWidth: 0
                            fillColor: morphMa.ctaEnabled ? Colors.textOnAccent : Colors.textMuted
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        Icon {
                            visible: !Session.isActive
                            name: "play"
                            size: 12
                            color: morphMa.ctaEnabled ? Colors.textOnAccent : Colors.textMuted
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        // Live: stop square beside the label
                        Rectangle {
                            visible: Session.isActive
                            width: 10; height: 10
                            radius: Theme.radiusXs
                            color: morphMa.ctaEnabled ? Colors.textOnAccent : Colors.textMuted
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        Text {
                            id: morphLabel

                            text: Session.isActive ? qsTr("STOP SWAP") : qsTr("BEGIN SWAP")
                            color: morphMa.ctaEnabled ? Colors.textOnAccent : Colors.textMuted
                            font.pixelSize: 14
                            font.weight: Font.Bold
                            font.letterSpacing: 2.0
                            font.capitalization: Font.AllUppercase
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        // In-CTA elapsed (mono tabular)
                        Text {
                            visible: Session.isActive
                            text: {
                                var s = Math.floor(Session.elapsedSec)
                                var m = Math.floor(s / 60)
                                var r = s % 60
                                return (m < 10 ? "0" : "") + m + ":" + (r < 10 ? "0" : "") + r
                            }
                            color: morphMa.ctaEnabled ? Colors.textOnAccent : Colors.textMuted
                            opacity: morphMa.containsMouse ? 1.0 : 0.75
                            font.pixelSize: 11
                            font.family: Theme.fontMono.family
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }

                    MouseArea {
                        id: morphMa

                        // Electron: disabled = !live && (!ready || cooldown) —
                        // STOP is ALWAYS clickable during a session. The click
                        // itself is always accepted and ROUTED by reason, so a
                        // disabled-looking CTA still guides the user.
                        property bool ctaEnabled: Session.isActive
                            || (!morphBtn.liveBlocked
                                && Auth.isAuthenticated
                                && CameraCtrl.isActive)
                        anchors.fill: parent
                        cursorShape: ctaEnabled ? Qt.PointingHandCursor : Qt.ArrowCursor
                        hoverEnabled: true
                        property bool lowCredits: Auth.isAuthenticated
                            && !Session.isActive
                            && (Auth.creditBalance + Auth.bonusBalance) < Session.creditsPerSecond * 60
                        onClicked: {
                            if (Session.isActive) {
                                App.toggleSwap()
                                return
                            }
                            if (!Auth.isAuthenticated) {
                                App.notify(qsTr("Sign in to start a swap"), "warning")
                                App.navigateTo("auth")
                                return
                            }
                            if (!CameraCtrl.isActive) {
                                App.notify(qsTr("No camera detected — connect one or check Settings"), "warning")
                                App.openSettings()
                                return
                            }
                            if (Session.cooldownActive) {
                                App.notify(qsTr("Please wait %n second before trying again", "Please wait %n seconds before trying again", Session.cooldownRemainingSec), "warning")
                                return
                            }
                            if (morphMa.lowCredits) {
                                App.notify(qsTr("You need at least %1 credits (about 1 minute of swap) to start.")
                                               .arg(Math.ceil(Session.creditsPerSecond * 60)), "warning")
                                App.openBuyCredits()
                                return
                            }
                            App.toggleSwap()
                        }
                    }

                    Tooltip {
                        anchors.bottom: parent.top
                        anchors.bottomMargin: 8
                        anchors.horizontalCenter: parent.horizontalCenter
                        property bool lowCredits: Auth.isAuthenticated
                            && !Session.isActive
                            && (Auth.creditBalance + Auth.bonusBalance) < Session.creditsPerSecond * 60
                        text: Session.cooldownActive
                              ? qsTr("Please wait %n second before trying again", "Please wait %n seconds before trying again", Session.cooldownRemainingSec)
                              : !Auth.isAuthenticated ? qsTr("Sign in to start")
                              : !CameraCtrl.isActive ? qsTr("Waiting for camera…")
                              : lowCredits ? qsTr("Insufficient credits. Click to top up")
                              : (Session.isActive ? qsTr("Stop swap") : qsTr("Begin swap"))
                        shown: morphMa.containsMouse || Session.cooldownActive
                    }

                    scale: morphMa.pressed ? 0.98 : 1.0
                }
    }
}
