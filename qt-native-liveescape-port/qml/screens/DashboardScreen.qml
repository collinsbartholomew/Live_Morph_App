import QtQuick
import QtQuick.Controls
import QtQuick.Dialogs
import QtMultimedia
import SmokeScreen

// #mainApp — the dashboard, exact reference grid: auto / 54px bar / 1fr stage / auto controls
Item {
    id: root
    anchors.fill: parent

    signal toggleFullscreenRequested()

    component BarPill: Rectangle {
        property string label: ""
        property color accent: Theme.border
        property color fg: Theme.dim
        width: pillText.implicitWidth + 20
        height: 24
        radius: 100
        color: "transparent"
        border.width: 1
        border.color: accent
        Text {
            id: pillText
            anchors.centerIn: parent
            text: parent.label
            color: parent.fg
            font.family: Theme.fontMono
            font.pixelSize: 9
            font.letterSpacing: 1
        }
    }

    MediaDevices { id: md }

    Column {
        anchors.fill: parent
        visible: !Stream.theatreMode

        // ── expiry banner (grid-row 1; hidden by default like the reference) ──
        Rectangle {
            id: expiryBanner
            width: parent.width
            height: visible ? 28 : 0
            visible: App.expiryBannerText.length > 0
            color: App.expiryBannerKind === "urgent"
                   ? Qt.rgba(255/255, 77/255, 109/255, 0.08)
                   : Qt.rgba(232/255, 197/255, 71/255, 0.08)
            border.width: 1
            border.color: App.expiryBannerKind === "urgent"
                          ? Qt.rgba(255/255, 77/255, 109/255, 0.3)
                          : Qt.rgba(232/255, 197/255, 71/255, 0.3)
            Text {
                anchors.centerIn: parent
                text: App.expiryBannerText
                color: App.expiryBannerKind === "urgent" ? Theme.red : Theme.gold
                font.family: Theme.fontMono
                font.pixelSize: 9
                font.letterSpacing: 1.5
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: App.showAccountModal = true
            }
        }

        // ── top bar (54px) ──
        Rectangle {
            id: topBar
            objectName: "topBar"
            width: parent.width
            height: 54
            color: Theme.s1
            border.width: 0

            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.bottom: parent.bottom
                height: 1
                gradient: Gradient {
                    orientation: Gradient.Horizontal
                    GradientStop { position: 0; color: "transparent" }
                    GradientStop { position: 0.5; color: Theme.goldD }
                    GradientStop { position: 1; color: "transparent" }
                }
            }

            Row {
                anchors.left: parent.left
                anchors.leftMargin: 16
                anchors.verticalCenter: parent.verticalCenter
                spacing: 8

                // logo gem S + version
                Rectangle {
                    width: 98
                    height: 24
                    radius: 4
                    color: Theme.gold
                    anchors.verticalCenter: parent.verticalCenter
                    Text {
                        anchors.centerIn: parent
                        text: "S"
                        color: Theme.bg
                        font.family: Theme.fontUi
                        font.pixelSize: 12
                        font.weight: Font.Black
                    }
                }
                Text {
                    anchors.verticalCenter: parent.verticalCenter
                    text: "1.8"
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 11
                    font.letterSpacing: 2
                }
            }

            // bar-mid: status pill + meter
            Row {
                objectName: "meterBlock"
                anchors.centerIn: parent
                spacing: 12

                Rectangle {
                    anchors.verticalCenter: parent.verticalCenter
                    width: pillRow.implicitWidth + 24
                    height: 22
                    radius: 100
                    color: Theme.s2
                    border.width: 1
                    border.color: Theme.border
                    Row {
                        id: pillRow
                        anchors.centerIn: parent
                        spacing: 7
                        Rectangle {
                            anchors.verticalCenter: parent.verticalCenter
                            width: 7
                            height: 7
                            radius: 3.5
                            color: Session.connected ? Theme.teal
                                 : Stream.connecting ? Theme.gold
                                 : Theme.dim
                            SequentialAnimation on opacity {
                                running: Stream.connecting
                                loops: Animation.Infinite
                                NumberAnimation { to: 0.45; duration: 500 }
                                NumberAnimation { to: 1.0; duration: 500 }
                            }
                        }
                        Text {
                            anchors.verticalCenter: parent.verticalCenter
                            text: {
                                if (Stream.live || Session.connected) return qsTr("LIVE")
                                if (Stream.connecting) return qsTr("CONNECTING")
                                if (Stream.paused) return qsTr("PAUSED")
                                return qsTr("OFFLINE")
                            }
                            color: Theme.text
                            font.family: Theme.fontMono
                            font.pixelSize: 10
                            font.letterSpacing: 1.5
                        }
                    }
                }

                Text {
                    anchors.verticalCenter: parent.verticalCenter
                    textFormat: Text.RichText
                    text: qsTr("USED <b style='color:#e8c547'>%1</b> CR <span style='color:#1c1c30'>|</span> LEFT <b style='color:#3fe8b8'>%2</b> CR")
                              .arg(Math.round(Session.creditsUsed))
                              .arg(Math.round(Session.creditsRemaining))
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 9
                }
            }

            // bar-right: action pills
            Row {
                anchors.right: parent.right
                anchors.rightMargin: 16
                anchors.verticalCenter: parent.verticalCenter
                spacing: 8

                BarPill {
                    label: Stream.theatreMode ? qsTr("⬛ EXIT OBS") : qsTr("⬛ OBS")
                    accent: Qt.rgba(63/255, 232/255, 184/255, 0.3)
                    fg: Theme.teal
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: Stream.theatreMode ? Stream.exitTheatre() : Stream.enterTheatre()
                    }
                }
                BarPill {
                    label: Stream.recording ? qsTr("■ REC") : qsTr("● REC")
                    accent: Stream.recording ? Theme.red : Theme.border
                    fg: Stream.recording ? Theme.red : Theme.dim
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: Stream.toggleRecording()
                    }
                }
                BarPill {
                    label: qsTr("📷 SNAP")
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: Stream.takeSnapshot()
                    }
                }
                BarPill {
                    objectName: "tutorialBtn"
                    label: qsTr("▶ TOUR")
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: App.startTour()
                    }
                }
                BarPill {
                    label: qsTr("📚 TUTORIALS")
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: App.showTutorials = true
                    }
                }
                BarPill {
                    objectName: "accountBtn"
                    label: qsTr("👤 ACCOUNT")
                    accent: Theme.goldD
                    fg: Theme.gold
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: App.showAccountModal = true
                    }
                }
            }
        }

        // ── stage ──
        StageViewport {
            id: stage
            objectName: "stage"
            width: parent.width
            height: Math.max(0, parent.height - expiryBanner.height - topBar.height - controls.height)
            activeViewport: !Stream.theatreMode
            onFullscreenRequested: root.toggleFullscreenRequested()
        }

        // ── controls (255 | 1fr | 255) ──
        Rectangle {
            id: controls
            width: parent.width
            height: 210
            color: Theme.s1
            border.width: 0

            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                height: 1
                gradient: Gradient {
                    orientation: Gradient.Horizontal
                    GradientStop { position: 0; color: "transparent" }
                    GradientStop { position: 0.5; color: Theme.goldD }
                    GradientStop { position: 1; color: "transparent" }
                }
            }

            Row {
                anchors.fill: parent
                spacing: 0

                // ── COL 1: camera / mode / connect (actions pinned bottom) ──
                Item {
                    width: 255
                    height: parent.height

                    Column {
                        id: col1Top
                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.top: parent.top
                        anchors.margins: 11
                        spacing: 7

                        Text {
                            text: qsTr("📷 CAMERA")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 2
                        }
                        ComboBox {
                            id: camSel
                            objectName: "camSel"
                            width: parent.width
                            height: 24
                            font.family: Theme.fontMono
                            font.pixelSize: 10
                            model: md.videoInputs
                            textRole: "description"
                            onActivated: stage.cameraId = md.videoInputs[index].id
                            background: Rectangle {
                                radius: Theme.radius
                                color: Theme.s2
                                border.width: 1
                                border.color: Theme.border
                            }
                        }

                        Text {
                            text: qsTr("🎭 MODE")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 2
                        }
                        Rectangle {
                            width: parent.width
                            height: 24
                            radius: Theme.radius
                            color: "transparent"
                            border.width: 1
                            border.color: Theme.border
                            Row {
                                anchors.fill: parent
                                Rectangle {
                                    width: parent.width / 2
                                    height: parent.height
                                    color: Stream.mode === "style" ? Theme.gold : "transparent"
                                    Text {
                                        anchors.centerIn: parent
                                        text: qsTr("STYLE")
                                        color: Stream.mode === "style" ? Theme.bg : Theme.dim
                                        font.family: Theme.fontMono
                                        font.pixelSize: 9
                                        font.bold: Stream.mode === "style"
                                    }
                                    MouseArea {
                                        anchors.fill: parent
                                        cursorShape: Qt.PointingHandCursor
                                        onClicked: Stream.mode = "style"
                                    }
                                }
                                Rectangle {
                                    width: parent.width / 2
                                    height: parent.height
                                    color: Stream.mode === "face" ? Theme.gold : "transparent"
                                    Text {
                                        anchors.centerIn: parent
                                        text: qsTr("FACE SWAP")
                                        color: Stream.mode === "face" ? Theme.bg : Theme.dim
                                        font.family: Theme.fontMono
                                        font.pixelSize: 9
                                        font.bold: Stream.mode === "face"
                                    }
                                    MouseArea {
                                        anchors.fill: parent
                                        cursorShape: Qt.PointingHandCursor
                                        onClicked: Stream.mode = "face"
                                    }
                                }
                            }
                        }

                        Rectangle {
                            width: parent.width
                            height: 30
                            radius: Theme.radius
                            color: Theme.s1
                            border.width: 1
                            border.color: Stream.referenceFacePath.length ? Theme.gold : Theme.border
                            visible: Stream.mode === "face"
                            Text {
                                anchors.centerIn: parent
                                text: Stream.referenceFacePath.length ? qsTr("🖼 REFERENCE LOADED") : qsTr("UPLOAD REFERENCE FACE")
                                color: Stream.referenceFacePath.length ? Theme.gold : Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 10
                            }
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: refDialog.open()
                            }
                        }

                        Rectangle {
                            width: parent.width
                            height: 28
                            radius: Theme.radius
                            visible: !Session.streamingEnabled
                            color: Qt.rgba(255/255, 77/255, 109/255, 0.08)
                            Text {
                                anchors.centerIn: parent
                                width: parent.width - 8
                                horizontalAlignment: Text.AlignHCenter
                                text: qsTr("Streaming is unavailable at the moment.")
                                color: Theme.red
                                font.family: Theme.fontMono
                                font.pixelSize: 8
                                wrapMode: Text.WordWrap
                            }
                        }
                    }

                    Column {
                        id: col1Bottom
                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.bottom: parent.bottom
                        anchors.margins: 11
                        spacing: 7

                        Row {
                            width: parent.width
                            spacing: 8

                            Rectangle {
                                width: Stream.live || Stream.paused ? (parent.width - 8) / 2 : parent.width
                                height: 30
                                radius: Theme.radius
                                color: Theme.gold
                                opacity: Stream.connecting || Stream.live ? 0.4 : 1
                                Text {
                                    anchors.centerIn: parent
                                    text: Stream.connecting ? qsTr("…") : qsTr("▶ CONNECT")
                                    color: Theme.bg
                                    font.family: Theme.fontUi
                                    font.pixelSize: 13
                                    font.weight: Font.Bold
                                    font.letterSpacing: 1
                                }
                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    enabled: !Stream.connecting && !Stream.live
                                    onClicked: Stream.connectEngine()
                                }
                            }

                            Rectangle {
                                width: (parent.width - 8) / 2
                                height: 30
                                radius: Theme.radius
                                visible: Stream.live || Stream.paused
                                color: "transparent"
                                border.width: 1
                                border.color: Stream.paused ? Theme.teal : Theme.gold
                                Text {
                                    anchors.centerIn: parent
                                    text: Stream.paused ? qsTr("▶ PLAY") : qsTr("⏸ PAUSE")
                                    color: Stream.paused ? Theme.teal : Theme.gold
                                    font.family: Theme.fontUi
                                    font.pixelSize: 13
                                    font.weight: Font.Bold
                                }
                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: Stream.paused ? Stream.resumeEffect() : Stream.pauseEffect()
                                }
                            }
                        }

                        Rectangle {
                            width: parent.width
                            height: 28
                            radius: Theme.radius
                            color: "transparent"
                            border.width: 1
                            border.color: Theme.red
                            opacity: Stream.live || Stream.connecting ? 1 : 0.35
                            Text {
                                anchors.centerIn: parent
                                text: qsTr("■ STOP")
                                color: Theme.red
                                font.family: Theme.fontUi
                                font.pixelSize: 12
                                font.weight: Font.Bold
                            }
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                enabled: Stream.live || Stream.connecting
                                onClicked: Stream.disconnectEngine()
                            }
                        }

                        Rectangle {
                            width: parent.width
                            height: 26
                            radius: Theme.radius
                            color: Theme.s2
                            border.width: 1
                            border.color: Qt.rgba(63/255, 232/255, 184/255, 0.2)
                            Text {
                                anchors.centerIn: parent
                                text: qsTr("🖼 BACKGROUND")
                                color: Theme.teal
                                font.family: Theme.fontUi
                                font.pixelSize: 11
                                font.weight: Font.Bold
                            }
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: App.showBgPanel = true
                            }
                        }

                        Rectangle {
                            width: parent.width
                            height: 22
                            radius: Theme.radius
                            color: "transparent"
                            border.width: 1
                            border.color: Theme.border
                            Text {
                                anchors.centerIn: parent
                                text: qsTr("🚨 Report Abuse")
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 9
                            }
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: App.showAbuseReport = true
                            }
                        }
                    }
                }

                Rectangle { width: 1; height: parent.height; color: Theme.border }

                // ── COL 2: prompt ──
                Column {
                    width: parent.width - 512
                    height: parent.height
                    padding: 11
                    spacing: 8

                    Row {
                        width: parent.width - 22
                        spacing: 8
                        Text {
                            anchors.verticalCenter: parent.verticalCenter
                            text: qsTr("🖼️ BACKGROUND & STYLE")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 2
                        }
                        Item { width: parent.width - 260; height: 1 }
                        Text {
                            anchors.verticalCenter: parent.verticalCenter
                            text: qsTr("LIVE UPDATE")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 8
                        }
                        Rectangle {
                            anchors.verticalCenter: parent.verticalCenter
                            width: 32
                            height: 17
                            radius: 100
                            color: Stream.liveUpdate ? Theme.goldD : Theme.s2
                            border.width: 1
                            border.color: Stream.liveUpdate ? Theme.gold : Theme.border
                            Rectangle {
                                width: 11
                                height: 11
                                radius: 6
                                y: 2
                                x: Stream.liveUpdate ? 18 : 2
                                color: Stream.liveUpdate ? Theme.gold : Theme.dim
                                Behavior on x { NumberAnimation { duration: 300 } }
                            }
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: Stream.liveUpdate = !Stream.liveUpdate
                            }
                        }
                    }

                    TextArea {
                        id: promptArea
                        objectName: "prompt"
                        width: parent.width - 22
                        height: 52
                        text: Stream.prompt
                        color: Theme.text
                        font.family: Theme.fontMono
                        font.pixelSize: 11
                        placeholderText: qsTr("Type what you want to see — a background, an outfit, a cap, a style… e.g. 'cozy coffee shop background' or 'red baseball cap'")
                        placeholderTextColor: Theme.dim2
                        wrapMode: TextEdit.Wrap
                        selectByMouse: true
                        background: Rectangle {
                            radius: Theme.radius
                            color: Theme.s2
                            border.width: 1
                            border.color: promptArea.activeFocus ? Theme.goldD : Theme.border
                        }
                        onTextEdited: Stream.prompt = text
                    }

                    Text {
                        width: parent.width - 22
                        text: qsTr("This changes your background live — it can also add or change clothing, accessories, and more. Just describe it in plain words.")
                        color: Theme.dim
                        font.family: Theme.fontMono
                        font.pixelSize: 8
                        wrapMode: Text.WordWrap
                    }

                    Row {
                        width: parent.width - 22
                        spacing: 8
                        Text {
                            anchors.verticalCenter: parent.verticalCenter
                            text: qsTr("⚡ PRESETS")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 2
                        }
                        Item { width: parent.width - 260; height: 1 }
                        Text {
                            anchors.verticalCenter: parent.verticalCenter
                            text: qsTr("ENHANCE")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 8
                        }
                        Rectangle {
                            anchors.verticalCenter: parent.verticalCenter
                            width: 32
                            height: 17
                            radius: 100
                            color: Stream.enhance ? Theme.goldD : Theme.s2
                            border.width: 1
                            border.color: Stream.enhance ? Theme.gold : Theme.border
                            Rectangle {
                                width: 11
                                height: 11
                                radius: 6
                                y: 2
                                x: Stream.enhance ? 18 : 2
                                color: Stream.enhance ? Theme.gold : Theme.dim
                                Behavior on x { NumberAnimation { duration: 300 } }
                            }
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: Stream.enhance = !Stream.enhance
                            }
                        }
                    }

                    Flow {
                        objectName: "presets"
                        width: parent.width - 22
                        spacing: 4
                        Repeater {
                            model: Stream.presets
                            delegate: Rectangle {
                                width: presetTxt.implicitWidth + 14
                                height: 20
                                radius: 100
                                color: Theme.s2
                                border.width: 1
                                border.color: Theme.border
                                Text {
                                    id: presetTxt
                                    anchors.centerIn: parent
                                    text: modelData
                                    color: Theme.dim
                                    font.family: Theme.fontMono
                                    font.pixelSize: 8
                                }
                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: Stream.applyPreset(modelData)
                                }
                            }
                        }
                    }
                }

                Rectangle { width: 1; height: parent.height; color: Theme.border }

                // ── COL 3: balance / quality ──
                Column {
                    objectName: "balCol"
                    width: 255
                    height: parent.height
                    padding: 11
                    spacing: 6

                    Text {
                        text: qsTr("💳 SESSION BALANCE")
                        color: Theme.dim
                        font.family: Theme.fontMono
                        font.pixelSize: 9
                        font.letterSpacing: 2
                    }

                    Rectangle {
                        width: parent.width - 22
                        height: 56
                        radius: Theme.radius
                        color: Theme.s2
                        border.width: 1
                        border.color: Theme.border
                        Column {
                            anchors.fill: parent
                            anchors.margins: 10
                            spacing: 4
                            Row {
                                width: parent.width
                                Text {
                                    text: qsTr("PLAN TOTAL")
                                    color: Theme.dim
                                    font.family: Theme.fontMono
                                    font.pixelSize: 9
                                }
                                Item { width: parent.width - 160; height: 1 }
                                Text {
                                    text: Math.round(Session.creditsTotal) + " CR"
                                    color: Theme.gold
                                    font.family: Theme.fontMono
                                    font.pixelSize: 9
                                    font.bold: true
                                }
                            }
                            Row {
                                width: parent.width
                                Text {
                                    text: qsTr("USED")
                                    color: Theme.dim
                                    font.family: Theme.fontMono
                                    font.pixelSize: 9
                                }
                                Item { width: parent.width - 160; height: 1 }
                                Text {
                                    text: Math.round(Session.creditsUsed) + " CR"
                                    color: Theme.red
                                    font.family: Theme.fontMono
                                    font.pixelSize: 9
                                    font.bold: true
                                }
                            }
                            Row {
                                width: parent.width
                                Text {
                                    text: qsTr("REMAINING")
                                    color: Theme.dim
                                    font.family: Theme.fontMono
                                    font.pixelSize: 9
                                }
                                Item { width: parent.width - 160; height: 1 }
                                Text {
                                    text: Math.round(Session.creditsRemaining) + " CR"
                                    color: Theme.teal
                                    font.family: Theme.fontMono
                                    font.pixelSize: 9
                                    font.bold: true
                                }
                            }
                            Rectangle {
                                width: parent.width
                                height: 3
                                radius: 2
                                color: Theme.border
                                Rectangle {
                                    width: {
                                        if (Session.creditsTotal <= 0) return 0
                                        return parent.width * Math.max(0, Math.min(1,
                                            Session.creditsRemaining / Session.creditsTotal))
                                    }
                                    height: parent.height
                                    radius: 2
                                    color: Theme.teal
                                    Behavior on width { NumberAnimation { duration: 500 } }
                                }
                            }
                        }
                    }

                    Text {
                        text: qsTr("⚙️ QUALITY")
                        color: Theme.dim
                        font.family: Theme.fontMono
                        font.pixelSize: 9
                        font.letterSpacing: 2
                    }
                    ComboBox {
                        objectName: "qualSel"
                        width: parent.width - 22
                        height: 28
                        font.family: Theme.fontMono
                        font.pixelSize: 10
                        model: [qsTr("High — Best Output"), qsTr("Balanced — Recommended"), qsTr("Performance — Lowest Latency")]
                        currentIndex: Stream.quality === "high" ? 0 : Stream.quality === "performance" ? 2 : 1
                        onActivated: Stream.quality = index === 0 ? "high" : index === 2 ? "performance" : "balanced"
                        background: Rectangle {
                            radius: Theme.radius
                            color: Theme.s2
                            border.width: 1
                            border.color: Theme.border
                        }
                    }

                    Row {
                        width: parent.width - 22
                        Text {
                            text: qsTr("🎥 OUTPUT LATENCY")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 2
                        }
                        Item { width: parent.width - 140; height: 1 }
                        Text {
                            text: Stream.latencyText.length > 0 ? Stream.latencyText : "—"
                            color: Theme.teal
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                        }
                    }

                    Item { width: 1; height: Math.max(2, parent.height - 196) }

                    Rectangle {
                        width: parent.width - 22
                        height: 32
                        radius: Theme.radius
                        color: Theme.goldG
                        border.width: 1
                        border.color: Theme.gold
                        Text {
                            anchors.centerIn: parent
                            text: qsTr("🎟️ BUY MORE CREDITS")
                            color: Theme.gold
                            font.family: Theme.fontUi
                            font.pixelSize: 12
                            font.weight: Font.Bold
                            font.letterSpacing: 1
                        }
                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: App.showPlanGate = true
                        }
                    }
                }
            }
        }
    }

    // ── theatre mode: stage fullscreen + exit pill ──
    Loader {
        anchors.fill: parent
        active: Stream.theatreMode
        z: 800
        sourceComponent: Component {
            StageViewport {
                activeViewport: true
                onFullscreenRequested: root.toggleFullscreenRequested()
            }
        }
    }

    Rectangle {
        visible: Stream.theatreMode
        anchors.top: parent.top
        anchors.right: parent.right
        anchors.margins: 12
        width: exitTxt.implicitWidth + 28
        height: 26
        radius: 100
        color: Qt.rgba(4/255, 4/255, 10/255, 0.8)
        border.width: 1
        border.color: Theme.border
        z: 900
        Text {
            id: exitTxt
            anchors.centerIn: parent
            text: qsTr("✕ EXIT OBS MODE")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 10
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: Stream.exitTheatre()
        }
    }

    FileDialog {
        id: refDialog
        title: qsTr("Select Reference Face")
        nameFilters: ["Images (*.png *.jpg *.jpeg *.webp)"]
        onAccepted: Stream.setReferenceFace(selectedFile.toString().replace("file://", ""))
    }
}
