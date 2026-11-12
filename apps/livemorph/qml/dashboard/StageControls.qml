import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

/**
 * StageControls — Electron stage-controls strip (h-12 px-6 border-t):
 *   camera picker button (+ popover) · mirror · privacy · prompt-bar ·
 *   scene toggles · ENGINE label + Standard/HD radio + rate pill ·
 *   working-with chip · wall clock.
 */
Rectangle {
    id: root

    height: Theme.stageControlsHeight
    color: Colors.surfaceBase

    Rectangle {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        height: 1
        color: Colors.borderSubtle40 // border-surface-border-subtle/40
    }

    readonly property bool camPopupOpen: camPopup.visible
    // Tour anchors read by Dashboard (OnboardingTour target registration).
    property alias tourEngine: engSeg
    property alias tourPrivacy: privacyBtn
    function closeCamPopup() {
        if (camPopup.visible)
            camPopup.close()
    }

    function workingWithLabel() {
        if (Session.activeCharacterId.length > 0)
            return Session.activeCharacterName
        if (Session.activeCharacterImage.length > 0 || Session.activePrompt.length > 0)
            return qsTr("Custom")
        return qsTr("No character")
    }

    RowLayout {
        anchors.fill: parent
        anchors.leftMargin: 24
        anchors.rightMargin: 24
        spacing: 10

        // ── Camera picker button + popover ────────────────────────────
        // Electron: borderless px-2 py-1 rounded-sm; hover /40 wash;
        // label 12px max-w-130 truncate; chevron rotates when open;
        // disabled while streaming (cameraLockedTitle).
        Rectangle {
            property bool popupOpen: camPopup.visible
            opacity: (Session.isActive || CameraCtrl.deviceCount === 0) ? 0.5 : 1.0
            width: camRow.implicitWidth + 16
            height: 28
            radius: Theme.radiusFull
            color: camPopup.visible ? Colors.accent10
                 : (camMa.containsMouse && !Session.isActive ? Colors.overlay40 : Colors.transparent)
            border.width: (camPopup.visible || (camMa.containsMouse && !Session.isActive)) ? 1 : 0
            border.color: camPopup.visible ? Colors.accent30
                         : camMa.containsMouse ? Colors.surfaceBorderStrong
                         : Colors.transparent

            Row {
                id: camRow
                anchors.centerIn: parent
                spacing: 6
                Icon {
                    name: "video"
                    size: 15
                    color: camPopup.visible ? Colors.accentHover
                         : (Session.isActive ? Colors.textMuted : Colors.textSecondary)
                    anchors.verticalCenter: parent.verticalCenter
                }
                Text {
                    text: CameraCtrl.currentDeviceName
                    width: 130 // Electron max-w-[130px]
                    elide: Text.ElideRight
                    color: camPopup.visible ? Colors.accentHover
                         : (Session.isActive ? Colors.textMuted : Colors.textSecondary)
                    font.pixelSize: 12
                    anchors.verticalCenter: parent.verticalCenter
                }
                Icon {
                    name: "chevron-down"
                    size: 12
                    color: camPopup.visible ? Colors.accentHover
                         : Colors.textMuted50
                    rotation: camPopup.visible ? 180 : 0
                    anchors.verticalCenter: parent.verticalCenter
                }
            }

            Tooltip {
                anchors.bottom: parent.top
                anchors.bottomMargin: 6
                anchors.horizontalCenter: parent.horizontalCenter
                text: Session.isActive ? qsTr("Stop the swap to switch cameras.")
                      : (CameraCtrl.deviceCount === 0 ? qsTr("No cameras detected") : "")
                visible: text.length > 0
                shown: camMa.containsMouse
            }
            // Plain toggle — outside-press closing is handled race-free by the
            // Dashboard-level catcher (popup uses CloseOnEscape only).
            MouseArea {
                id: camMa
                anchors.fill: parent
                hoverEnabled: true
                enabled: !Session.isActive && CameraCtrl.deviceCount > 0
                cursorShape: enabled ? Qt.PointingHandCursor : Qt.ArrowCursor
                onClicked: camPopup.visible ? camPopup.close() : camPopup.open()
            }

            Popup {
                id: camPopup
                y: -height - 8 // strip sits at the bottom — opens UPWARD
                x: 0
                width: 280
                // Count-based height: ColumnLayout+Repeater implicitHeight is 0.
                height: Math.min(300, 32 + CameraCtrl.availableDevices.length * 34
                                 + Math.max(0, CameraCtrl.availableDevices.length - 1) * 2 + 16)
                padding: 8
                closePolicy: Popup.CloseOnEscape
                background: Rectangle {
                    color: Colors.surfaceOverlay
                    border.color: Colors.surfaceBorder
                    border.width: 1
                    radius: Theme.radiusMd
                    clip: true
                    // Honeycomb wash + corner frame on dropdowns (signature)
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
                        z: Theme.zLocal1
                    }
                    CornerTicks {
                        anchors.fill: parent
                        inset: 5
                        tickSize: 7
                        thickness: 1
                        color: Colors.accent30
                        z: Theme.zLocal1
                    }
                }

                // Electron popover header: px-3 py-2 border-b border-subtle
                // bg-surface-base/40, then the device list below.
                Rectangle {
                    id: camPopupHeader
                    width: camListCol.width
                    height: 28
                    color: Colors.base40 // surface-base/40
                    Rectangle {
                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.bottom: parent.bottom
                        height: 1
                        color: Colors.surfaceBorderSubtle
                    }
                    Text {
                        anchors.left: parent.left
                        anchors.leftMargin: 12
                        anchors.verticalCenter: parent.verticalCenter
                        text: qsTr("CAMERA SOURCE")
                        color: Colors.textMuted
                        font.family: Theme.fontMono.family
                        font.pixelSize: 9
                        font.letterSpacing: 1.2
                    }
                }

                ColumnLayout {
                    id: camListCol
                    anchors.fill: parent
                    anchors.topMargin: 30 // header 28 + 2 gap
                    anchors.leftMargin: 0
                    spacing: 2

                    Repeater {
                        // availableDevices is a QStringList of NAMES (plain strings)
                        model: CameraCtrl.availableDevices
                        delegate: Rectangle {
                            required property string modelData
                            required property int index
                            Layout.fillWidth: true
                            height: 32
                            radius: Theme.radiusSm
                            color: devMa.containsMouse ? Colors.surfaceOverlay
                                 : (CameraCtrl.currentDeviceName === modelData ? Colors.accent10 : Colors.transparent)

                            RowLayout {
                                anchors.fill: parent
                                anchors.leftMargin: 8
                                anchors.rightMargin: 8
                                spacing: 8
                                Hexagon {
                                    size: 8
                                    lineWidth: 0
                                    fillColor: CameraCtrl.currentDeviceName === modelData ? Colors.accent : Colors.textMuted
                                    Layout.alignment: Qt.AlignVCenter
                                }
                                Text {
                                    text: modelData
                                    color: CameraCtrl.currentDeviceName === modelData ? Colors.textPrimary : Colors.textSecondary
                                    font.pixelSize: 12
                                    elide: Text.ElideRight
                                    Layout.fillWidth: true
                                }
                                Icon {
                                    visible: CameraCtrl.currentDeviceName === modelData
                                    name: "check"
                                    size: 12
                                    color: Colors.accentHover
                                    emphasis: true
                                }
                            }

                            MouseArea {
                                id: devMa
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor
                                onClicked: {
                                    CameraCtrl.currentDeviceId = CameraCtrl.deviceIdAt(index)
                                    camPopup.close()
                                }
                            }
                        }
                    }
                }
            }
        }

        // ── Icon toggles: mirror · privacy · prompt bar · scene ────────
        Row {
            spacing: 2

            IconButton {
                name: "flip-horizontal-2"
                accessibleName: qsTr("Toggle preview mirror")
                iconSize: 15
                iconColor: Config.mirrorCamera ? Colors.accent : Colors.textMuted
                radius: Theme.radiusSm
                width: 28; height: 28
                onClicked: Config.mirrorCamera = !Config.mirrorCamera
                Tooltip {
                    anchors.bottom: parent.top
                    anchors.bottomMargin: 6
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: Config.mirrorCamera
                        ? qsTr("Preview mirror: on. The streamed output is never mirrored.")
                        : qsTr("Preview mirror: off. The streamed output is never mirrored.")
                    shown: parent.hovered
                }
            }
            IconButton {
                id: privacyBtn
                name: Config.showCameraBeforeSwap ? "eye" : "eye-off"
                accessibleName: qsTr("Toggle camera between swaps")
                iconSize: 15
                iconColor: Config.showCameraBeforeSwap ? Colors.textMuted : Colors.accent
                radius: Theme.radiusSm
                width: 28; height: 28
                onClicked: Config.showCameraBeforeSwap = !Config.showCameraBeforeSwap
                Tooltip {
                    anchors.bottom: parent.top
                    anchors.bottomMargin: 6
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: !Config.showCameraBeforeSwap ? qsTr("Swap output only: your camera stays hidden") : qsTr("Your camera can show between swaps")
                    shown: parent.hovered
                }
            }
            IconButton {
                name: "pencil-line"
                accessibleName: qsTr("Toggle prompt bar")
                iconSize: 15
                iconColor: Config.promptBarVisible ? Colors.accent : Colors.textMuted
                radius: Theme.radiusSm
                width: 28; height: 28
                onClicked: Config.promptBarVisible = !Config.promptBarVisible
                Tooltip {
                    anchors.bottom: parent.top
                    anchors.bottomMargin: 6
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: Config.promptBarVisible ? qsTr("Hide prompt bar") : qsTr("Show prompt bar")
                    shown: parent.hovered
                }
            }
            IconButton {
                name: "image"
                accessibleName: qsTr("Toggle scene mode")
                iconSize: 15
                iconColor: Session.sceneEnabled ? Colors.accent : Colors.textMuted
                radius: Theme.radiusSm
                width: 28; height: 28
                enabled: !Session.isActive // scene toggle allowed when idle, locked mid-swap (like camera)
                opacity: enabled ? 1.0 : 0.5
                onClicked: {
                    // sceneEnabled is a READ-ONLY property — use the invokable.
                    Session.setSceneEnabled(!Session.sceneEnabled)
                    if (Session.sceneEnabled) App.swapMode = "scene"
                    else App.swapMode = "character" // reset so prompt mode resumes cleanly
                }
            }
        }

        Rectangle {
            width: 1
            height: 16 // h-4
            color: Colors.border40
            Layout.alignment: Qt.AlignVCenter
        }

        // ── ENGINE radio + rate pill ───────────────────────────────────
        Text {
            text: qsTr("ENGINE")
            color: Colors.textMuted
            font.family: Theme.fontMono.family
            font.pixelSize: 9
            font.letterSpacing: 1.5
            Layout.alignment: Qt.AlignVCenter
        }

        // Electron: always renders Standard + HD; locked HD shows a lock;
        // whole group disabled (opacity-50) while streaming.
        Item {
            Layout.alignment: Qt.AlignVCenter
            implicitWidth: engSeg.width
            implicitHeight: engSeg.height
            opacity: Session.isActive ? 0.5 : 1.0
            enabled: !Session.isActive

            SegmentedControl {
                id: engSeg
                property bool hdAllowed: App.hdAvailable
                property double hdRate: Session.hdActive ? Session.creditsPerSecond : Session.creditsPerSecond * (Backend.hdMultiplier > 1 ? Backend.hdMultiplier : 1)
                model: [
                    { label: qsTr("Standard"), value: "standard",
                      tip: Session.isActive
                          ? qsTr("Stop the swap to switch engines.")
                          : qsTr("Watermark-free, 2 credits/sec. Works on most networks.") },
                    { label: qsTr("HD"), value: "hd",
                      icon: engSeg.hdAllowed ? "" : "lock",
                      tip: !engSeg.hdAllowed
                          ? qsTr("HD unlocks with a Starter pack ($60) or larger.")
                          : (Session.isActive
                              ? qsTr("Stop the swap to switch engines.")
                              : qsTr("Smooth 30fps, watermark-free. %1 credits/sec.").arg(engSeg.hdRate.toFixed(0))) }
                ]
                currentValue: App.swapTier
                onActivated: (v) => {
                    // Electron: locked HD click is silently ignored (no toast)
                    if (v === "hd" && !engSeg.hdAllowed) return
                    App.swapTier = v
                }
            }
        }

        Rectangle {
            id: ratePill
            // Electron: rate pill visible while IDLE, hidden while streaming.
            // Neutral for Standard; HD gets the white accent (a tier, not a
            // warning — amber is reserved for functional states only).
            property bool isHd: App.swapTier === "hd"
            visible: !Session.isActive
            height: 20
            width: rateLbl.implicitWidth + 12
            radius: Theme.radiusFull
            color: ratePill.isHd ? Colors.accent12 : Colors.overlay40
            border.color: ratePill.isHd ? Colors.accent40 : Colors.surfaceBorder
            border.width: 1
            Layout.alignment: Qt.AlignVCenter
            Text {
                id: rateLbl
                anchors.centerIn: parent
                text: qsTr("%1 cr/sec").arg(ratePill.isHd ? engSeg.hdRate.toFixed(0) : Session.creditsPerSecond.toFixed(0))
                color: ratePill.isHd ? Colors.accentHover : Colors.textMuted
                font.pixelSize: 9
                font.family: Theme.fontMono.family
            }
            Tooltip {
                anchors.bottom: parent.top
                anchors.bottomMargin: 6
                anchors.horizontalCenter: parent.horizontalCenter
                text: ratePill.isHd
                    ? qsTr("HD bills %1 credits/sec. Your balance runs down faster than Standard.").arg(engSeg.hdRate.toFixed(0))
                    : qsTr("This engine uses %1 credits for every second of live swap.").arg(Session.creditsPerSecond.toFixed(0))
                shown: ratePillMa.containsMouse
            }
            MouseArea {
                id: ratePillMa
                anchors.fill: parent
                hoverEnabled: true
                acceptedButtons: Qt.NoButton
            }
        }

        Item { Layout.fillWidth: true }

        // ── Working-with chip (Electron a1: rounded-sm, no border,
        //    leading slot, NAME ONLY mono uppercase, opacity-60 none) ────
        Item {
            id: workChip
            property string workingLabel: root.workingWithLabel()
            property bool hasCharacter: workingLabel !== qsTr("No character")
            // Narrow stage strip: drop the chip (the character is visible in
            // the workshop anyway) instead of clipping the row.
            visible: parent.width > Theme.stageControlsNarrow
            Layout.alignment: Qt.AlignVCenter
            readonly property bool activeIsStarter: {
                const id = Session.activeCharacterId
                if (!id.length) return false
                const idx = Catalog.indexOfId(id)
                if (idx < 0) return false
                const e = Catalog.get(idx)
                return e.isStarter === true
            }
            implicitWidth: workRow.implicitWidth + 12
            implicitHeight: 28
            opacity: hasCharacter ? 1.0 : 0.6

            Rectangle {
                anchors.fill: parent
                radius: Theme.radiusFull
                color: Colors.overlay30 // surface-overlay/30
                border.color: Colors.surfaceBorderSubtle
                border.width: 1
            }

            Row {
                id: workRow
                anchors.centerIn: parent
                spacing: 8 // gap-2

                // Electron leading slot by state: none = dashed + 9px plus
                // (muted/40); starter preset w/o image = user icon in accent/20;
                // custom w/o image = pencil in surface-overlay.
                Item {
                    width: 20; height: 20
                    anchors.verticalCenter: parent.verticalCenter
                    visible: !workChip.hasCharacter
                    Hexagon {
                        anchors.centerIn: parent
                        size: 20
                        lineWidth: 1
                        lineColor: Colors.surfaceBorderSubtle
                    }
                    Icon {
                        anchors.centerIn: parent
                        name: "plus"
                        size: 9
                        color: Colors.textMuted40
                    }
                }
                Item {
                    width: 20; height: 20
                    anchors.verticalCenter: parent.verticalCenter
                    visible: workChip.hasCharacter && !Session.activeCharacterImage.length && workChip.activeIsStarter
                    Hexagon {
                        anchors.centerIn: parent
                        size: 22
                        lineWidth: 0
                        fillColor: Colors.accent20
                    }
                    Icon {
                        anchors.centerIn: parent
                        name: "user"
                        size: 12
                        color: Colors.accent
                    }
                }
                Item {
                    width: 20; height: 20
                    anchors.verticalCenter: parent.verticalCenter
                    visible: workChip.hasCharacter && !Session.activeCharacterImage.length && !workChip.activeIsStarter
                    Hexagon {
                        anchors.centerIn: parent
                        size: 22
                        lineWidth: 0
                        fillColor: Colors.surfaceOverlay
                    }
                    Icon {
                        anchors.centerIn: parent
                        name: "pencil"
                        size: 12
                        color: Colors.textSecondary
                    }
                }
                Image {
                    visible: workChip.hasCharacter && Session.activeCharacterImage.length > 0
                    width: 20; height: 20
                    source: Session.activeCharacterImage
                    fillMode: Image.PreserveAspectCrop
                    asynchronous: true
                    anchors.verticalCenter: parent.verticalCenter
                    Rectangle {
                        anchors.fill: parent
                        radius: Theme.radiusMd
                        color: Colors.transparent
                        border.color: Colors.surfaceBorder
                        border.width: 1
                    }
                }

                Text {
                    text: workChip.workingLabel
                    color: Colors.textSecondary
                    font.pixelSize: 10
                    font.family: Theme.fontMono.family
                    font.letterSpacing: 1.5
                    font.capitalization: Font.AllUppercase
                    elide: Text.ElideRight
                    width: Math.min(implicitWidth, 120)
                    anchors.verticalCenter: parent.verticalCenter
                }
                Icon {
                    visible: workChip.hasCharacter
                    name: "x"
                    size: 12
                    emphasis: true
                    color: clearMa.containsMouse ? Colors.statusError : Colors.textMuted
                    anchors.verticalCenter: parent.verticalCenter
                    Rectangle {
                        visible: clearMa.containsMouse
                        anchors.centerIn: parent
                        width: 16; height: 16; radius: Theme.radiusXs
                        color: Colors.errorSoftBg
                        z: Theme.zUnder
                    }
                    MouseArea {
                        id: clearMa
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: Session.setActiveCharacter("", "", "", "")
                    }
                }
            }

            MouseArea {
                anchors.fill: parent
                hoverEnabled: true
                acceptedButtons: Qt.NoButton
                id: workMa
            }
            // Electron: label tooltip only for library presets
            Tooltip {
                anchors.bottom: parent.top
                anchors.bottomMargin: 6
                anchors.horizontalCenter: parent.horizontalCenter
                text: workChip.hasCharacter && workChip.activeIsStarter
                      ? qsTr("Working with: %1").arg(workChip.workingLabel)
                      : ""
                visible: text.length > 0
                shown: workMa.containsMouse
            }
            Tooltip {
                anchors.bottom: parent.top
                anchors.bottomMargin: 6
                anchors.horizontalCenter: parent.horizontalCenter
                text: qsTr("Clear character")
                shown: clearMa.containsMouse
            }
        }

        // ── Session timer (Electron: billable H:MM:SS while swapping) ──
        Rectangle {
            visible: Session.isActive
            height: 24
            width: clockText.implicitWidth + 14
            radius: Theme.radiusFull
            color: Colors.overlay30
            border.color: Colors.surfaceBorderSubtle
            border.width: 1
            Layout.alignment: Qt.AlignVCenter
            Text {
                id: clockText
                anchors.centerIn: parent
                // Timer is the SOLE writer — an initial text: binding here would
                // be destroyed by the first onTriggered assignment.
                text: ""
                color: Colors.textSecondary
                font.family: Theme.fontMono.family
                font.pixelSize: 11
                font.weight: Font.Bold

                Timer {
                    interval: 1000
                    running: Session.isActive && root.visible
                    repeat: true
                    triggeredOnStart: true
                    onTriggered: {
                        var t = Math.max(0, Math.floor(Session.elapsedSec))
                        var h = Math.floor(t / 3600)
                        var m = Math.floor((t % 3600) / 60)
                        var sec = t % 60
                        clockText.text = (h > 0 ? h + ":" : "")
                            + (h > 0 ? ("0" + m).slice(-2) : m) + ":"
                            + ("0" + sec).slice(-2)
                    }
                }
            }
        }
    }
}
