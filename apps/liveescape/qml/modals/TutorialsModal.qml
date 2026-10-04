import LiveEscape
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ModalBase {
    id: tutorialsRoot

    // Top-level tabs (Electron tutTabSetup / tutTabVoice)
    property int topLevelTab: 0   // 0 = Setup, 1 = Voice Changer
    // Voice Changer is a Creator/Pro feature (Electron plan gating).
    readonly property bool voiceUnlocked: {
        const p = (Session.plan || "").toString().toLowerCase();
        return p === "creator" || p === "pro";
    }

    readonly property var tabs: ["START", "OBS", "FACE", "PROMPT", "PAY"]
    readonly property var tabIcons: ["▶", "📺", "🎭", "💬", "💳"]
    readonly property var voiceTabs: ["SETUP", "PITCH", "EFFECTS", "SHORTCUTS"]
    readonly property var voiceTabIcons: ["🎙", "🎚", "✨", "⌨"]

    readonly property var content: [{
        "title": "First session in 5 minutes",
        "body": "1) Activate your license on the Access Gate.\n2) Upload a clear front-facing reference photo.\n3) Write a short prompt (who/what you want to look like).\n4) Press CONNECT — the live AI output appears on the stage.\n5) Credits burn only while live. Disconnect to stop billing.",
        "video": "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "downloads": []
    }, {
        "title": "OBS / virtual camera",
        "body": "1) Press OBS mode (theatre) for a clean full-stage view.\n2) Capture this window with OBS Window Capture, or use a virtual-cam plugin on the stage region.\n3) Prefer 720p balanced quality for stable streams.\n4) Freeze frame is useful for static overlays while you adjust scenes.\n5) Keep the Live Escape window on a free GPU when possible.",
        "video": "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "downloads": ["OBS Scene Collection", "Virtual Cam Setup Guide"]
    }, {
        "title": "Reference face tips",
        "body": "• Use a sharp, well-lit face photo (JPG/PNG).\n• Eyes visible, minimal occlusion, neutral angle works best.\n• You can capture from CAMERA or pick a FILE.\n• Re-upload anytime — CONNECT again to apply.\n• Creator/Pro unlock richer background and style presets.",
        "video": "",
        "downloads": ["Sample Reference Photos"]
    }, {
        "title": "Prompting that works",
        "body": "• Be specific: subject + style + lighting.\n• Example: \"Anime hero, soft rim light, cinematic\".\n• Toggle Enhance for automatic prompt cleanup.\n• Live Update pushes prompt changes while connected.\n• Recent prompts are saved for quick reuse.",
        "video": "",
        "downloads": ["Prompt Cheat Sheet"]
    }, {
        "title": "Credits & payments",
        "body": "• Buy packs in-app — checkout stays inside Live Escape.\n• Your payment goes to our merchant account first.\n• We reserve Decart capacity on our platform key, then credit your balance.\n• Credits never expire. Low balance shows a banner before disconnect.\n• Crypto: send exact amount, paste TX ID to verify.",
        "video": "",
        "downloads": []
    }]

    // Voice Changer tab content (Electron VOICE_TUTORIAL_STEPS_MANUAL placeholders —
    // the standalone Voice Changer app: pitch control, live preview, stream integration)
    readonly property var voiceContent: [{
        "title": "Voice Changer Setup",
        "body": "Learn how to activate and use the Voice Changer feature in real time. Covers pitch control, live preview, and integrating voice effects into your stream setup. Available on Creator and Pro plans.",
        "video": "",
        "downloads": ["VoiceDrift Desktop"]
    }, {
        "title": "Live Pitch Control",
        "body": "Shift your voice up or down in real time while streaming. Adjust the pitch slider, enable live preview to hear yourself before going live, and fine-tune the effect per session.",
        "video": "",
        "downloads": []
    }, {
        "title": "Voice Effects Integration",
        "body": "Route the Voice Changer output into OBS or your streaming software as a virtual microphone. Keep the effect app open while streaming for live adjustments.",
        "video": "",
        "downloads": ["OBS Audio Routing Guide"]
    }, {
        "title": "Voice Changer Shortcuts",
        "body": "Quick keys for the Voice Changer app: toggle the effect on/off, reset pitch to neutral, and cycle saved presets without leaving your stream.",
        "video": "",
        "downloads": []
    }]

    readonly property var activeContent: topLevelTab === 0 ? content : voiceContent
    readonly property var activeTabs: topLevelTab === 0 ? tabs : voiceTabs
    readonly property var activeTabIcons: topLevelTab === 0 ? tabIcons : voiceTabIcons
    // Content renders below the gate only on Setup or when Voice is unlocked
    readonly property bool showContent: topLevelTab === 0 || voiceUnlocked

    open: App.showTutorials
    modalZ: 660
    panelWidth: Math.min(parent.width - 32, 640)
    panelImplicitHeight: Math.min(parent.height - 32, 520)
    onClose: App.showTutorials = false

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 4
        spacing: 12

        RowLayout {
            Layout.fillWidth: true

            Text {
                text: qsTr("TUTORIALS")
                color: Theme.gold
                font.family: Theme.fontUi
                font.pixelSize: 16
                font.bold: true
                font.letterSpacing: 2
                Layout.fillWidth: true
            }

            GhostButton {
                text: qsTr("✕")
                onClicked: App.showTutorials = false
            }
        }

        // Top-level tabs (Electron .tut-tab row: Setup | Voice Changer)
        Row {
            Layout.fillWidth: true
            spacing: 8

            Rectangle {
                width: setupTabLabel.implicitWidth + 28
                height: 30
                radius: Theme.radiusSm
                color: tutorialsRoot.topLevelTab === 0 ? Theme.goldGlow : Theme.s2
                border.color: tutorialsRoot.topLevelTab === 0 ? Theme.goldD : Theme.border
                border.width: 1

                Text {
                    id: setupTabLabel
                    anchors.centerIn: parent
                    text: qsTr("▶ SETUP")
                    color: tutorialsRoot.topLevelTab === 0 ? Theme.gold : Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 9
                    font.letterSpacing: 1.5
                    font.bold: tutorialsRoot.topLevelTab === 0
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: {
                        tutorialsRoot.topLevelTab = 0;
                        tutTab.current = 0;
                    }
                }
            }

            Rectangle {
                width: voiceTabLabel.implicitWidth + 28
                height: 30
                radius: Theme.radiusSm
                color: tutorialsRoot.topLevelTab === 1 ? Theme.goldGlow : Theme.s2
                border.color: tutorialsRoot.topLevelTab === 1 ? Theme.goldD : Theme.border
                border.width: 1

                Text {
                    id: voiceTabLabel
                    anchors.centerIn: parent
                    text: tutorialsRoot.voiceUnlocked ? qsTr("🎙 VOICE CHANGER") : qsTr("🎙 VOICE CHANGER 🔒")
                    color: tutorialsRoot.topLevelTab === 1 ? Theme.gold : Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 9
                    font.letterSpacing: 1.5
                    font.bold: tutorialsRoot.topLevelTab === 1
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: {
                        tutorialsRoot.topLevelTab = 1;
                        tutTab.current = 0;
                    }
                }
            }
        }

        RowLayout {
            Layout.fillWidth: true
            Layout.fillHeight: true
            spacing: 0

            // Sidebar — tab list (Electron sidebar)
            Rectangle {
                Layout.preferredWidth: 130
                Layout.fillHeight: true
                radius: Theme.radius
                color: Theme.s2
                border.color: Theme.border

                Column {
                    anchors.fill: parent
                    anchors.margins: 4
                    spacing: 2

                    Repeater {
                        model: tutorialsRoot.activeTabs

                        Rectangle {
                            width: parent.width
                            height: 34
                            radius: Theme.radiusSm
                            color: tutTab.current === index ? Theme.goldGlow : (sidebarHover.containsMouse ? Theme.s1 : "transparent")

                            Row {
                                anchors.fill: parent
                                anchors.margins: 6
                                spacing: 8

                                Text {
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: tutorialsRoot.activeTabIcons[index]
                                    font.pixelSize: 12
                                    color: tutTab.current === index ? Theme.gold : Theme.dim
                                }

                                Text {
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: modelData
                                    color: tutTab.current === index ? Theme.gold : Theme.dim
                                    font.family: Theme.fontMono
                                    font.pixelSize: 9
                                    font.letterSpacing: 1
                                    font.bold: tutTab.current === index
                                }
                            }

                            MouseArea {
                                id: sidebarHover
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor
                                onClicked: tutTab.current = index
                            }
                        }
                    }

                    Item { Layout.fillHeight: true }
                }
            }

            // Divider
            Rectangle {
                Layout.preferredWidth: 1
                Layout.fillHeight: true
                color: Theme.border
            }

            // Content area
            ColumnLayout {
                Layout.fillWidth: true
                Layout.fillHeight: true
                spacing: 0

                Item {
                    id: tutTab
                    property int current: 0
                }

                // Content scroll area
                Rectangle {
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    color: "transparent"

                    Flickable {
                        anchors.fill: parent
                        anchors.margins: 14
                        contentHeight: contentCol.implicitHeight
                        clip: true
                        flickableDirection: Flickable.VerticalFlick

                        ColumnLayout {
                            id: contentCol
                            width: parent.width
                            spacing: 12

                            // Voice Changer plan gate (Electron tutTabVoice lock)
                            Rectangle {
                                Layout.fillWidth: true
                                Layout.preferredHeight: gateCol.implicitHeight + 48
                                radius: Theme.radius
                                color: Theme.s1
                                border.color: Theme.goldD
                                border.width: 1
                                visible: tutorialsRoot.topLevelTab === 1
                                         && !tutorialsRoot.voiceUnlocked

                                ColumnLayout {
                                    id: gateCol
                                    anchors.centerIn: parent
                                    width: parent.width - 48
                                    spacing: 10

                                    Text {
                                        Layout.alignment: Qt.AlignHCenter
                                        text: "🔒"
                                        font.pixelSize: 42
                                    }

                                    Text {
                                        Layout.alignment: Qt.AlignHCenter
                                        text: qsTr("VOICE CHANGER")
                                        color: Theme.gold
                                        font.family: Theme.fontUi
                                        font.pixelSize: 18
                                        font.bold: true
                                        font.letterSpacing: 3
                                    }

                                    Text {
                                        Layout.alignment: Qt.AlignHCenter
                                        Layout.fillWidth: true
                                        horizontalAlignment: Text.AlignHCenter
                                        wrapMode: Text.WordWrap
                                        text: qsTr("Creator Plan Required — the Voice Changer with real-time pitch control and effects is available on Creator and Pro.")
                                        color: Theme.dim
                                        font.family: Theme.fontMono
                                        font.pixelSize: 10
                                        lineHeight: 1.5
                                    }

                                    GoldButton {
                                        Layout.alignment: Qt.AlignHCenter
                                        text: qsTr("UPGRADE TO CREATOR")
                                        onClicked: {
                                            App.showTutorials = false;
                                            App.openUpgradeFlow();
                                        }
                                    }
                                }
                            }

                            // Section header
                            Text {
                                visible: tutorialsRoot.showContent
                                text: tutorialsRoot.activeContent[tutTab.current].title
                                color: Theme.text
                                font.family: Theme.fontUi
                                font.pixelSize: 15
                                font.bold: true
                            }

                            // Video placeholder (Electron embedded YouTube)
                            Rectangle {
                                Layout.fillWidth: true
                                Layout.preferredHeight: 180
                                radius: Theme.radius
                                color: Theme.s1
                                border.color: Theme.border
                                visible: tutorialsRoot.showContent
                                         && tutorialsRoot.activeContent[tutTab.current].video.length > 0

                                Column {
                                    anchors.centerIn: parent
                                    spacing: 8

                                    Text {
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        text: "▶"
                                        color: Theme.gold
                                        font.pixelSize: 32
                                        opacity: 0.6
                                    }

                                    Text {
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        text: "VIDEO TUTORIAL"
                                        color: Theme.dim
                                        font.family: Theme.fontMono
                                        font.pixelSize: 9
                                        font.letterSpacing: 2
                                    }

                                    Text {
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        text: "Open in browser to watch"
                                        color: Theme.dim
                                        font.family: Theme.fontMono
                                        font.pixelSize: 8
                                        opacity: 0.5
                                    }
                                }
                            }

                            // Body text
                            Text {
                                Layout.fillWidth: true
                                wrapMode: Text.WordWrap
                                visible: tutorialsRoot.showContent
                                text: tutorialsRoot.activeContent[tutTab.current].body
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 11
                                lineHeight: 1.4
                            }

                            // Downloads section (Electron sidebar downloads)
                            Repeater {
                                model: tutorialsRoot.showContent
                                       ? tutorialsRoot.activeContent[tutTab.current].downloads
                                       : []

                                Rectangle {
                                    Layout.fillWidth: true
                                    Layout.preferredHeight: 36
                                    radius: Theme.radiusSm
                                    color: Theme.s1
                                    border.color: Theme.border

                                    Row {
                                        anchors.fill: parent
                                        anchors.margins: 8
                                        spacing: 8

                                        Text {
                                            anchors.verticalCenter: parent.verticalCenter
                                            text: "⬇"
                                            color: Theme.gold
                                            font.pixelSize: 12
                                        }

                                        Text {
                                            anchors.verticalCenter: parent.verticalCenter
                                            text: modelData
                                            color: Theme.text
                                            font.family: Theme.fontMono
                                            font.pixelSize: 10
                                        }

                                        Item { Layout.fillWidth: true }

                                        Text {
                                            anchors.verticalCenter: parent.verticalCenter
                                            text: "DOWNLOAD"
                                            color: Theme.gold
                                            font.family: Theme.fontMono
                                            font.pixelSize: 8
                                            font.letterSpacing: 1
                                        }
                                    }

                                    MouseArea {
                                        anchors.fill: parent
                                        hoverEnabled: true
                                        cursorShape: Qt.PointingHandCursor
                                    }
                                }
                            }

                            // Keyboard shortcut reference (Electron quickref)
                            Rectangle {
                                Layout.fillWidth: true
                                Layout.preferredHeight: shortcutCol.implicitHeight + 24
                                radius: Theme.radiusSm
                                color: Theme.s1
                                border.color: Theme.border
                                visible: tutorialsRoot.topLevelTab === 0 && tutTab.current === 0

                                ColumnLayout {
                                    id: shortcutCol
                                    anchors.fill: parent
                                    anchors.margins: 12
                                    spacing: 6

                                    Text {
                                        text: "KEYBOARD SHORTCUTS"
                                        color: Theme.gold
                                        font.family: Theme.fontMono
                                        font.pixelSize: 8
                                        font.letterSpacing: 2
                                    }

                                    RowLayout { spacing: 20
                                        Text { text: "F5"; color: Theme.gold; font.family: Theme.fontMono; font.pixelSize: 10; font.bold: true }
                                        Text { text: "Toggle theatre mode"; color: Theme.dim; font.family: Theme.fontMono; font.pixelSize: 9 }
                                    }
                                    RowLayout { spacing: 20
                                        Text { text: "F6"; color: Theme.gold; font.family: Theme.fontMono; font.pixelSize: 10; font.bold: true }
                                        Text { text: "Freeze / unfreeze frame"; color: Theme.dim; font.family: Theme.fontMono; font.pixelSize: 9 }
                                    }
                                    RowLayout { spacing: 20
                                        Text { text: "F9"; color: Theme.gold; font.family: Theme.fontMono; font.pixelSize: 10; font.bold: true }
                                        Text { text: "Start / stop stream"; color: Theme.dim; font.family: Theme.fontMono; font.pixelSize: 9 }
                                    }
                                    RowLayout { spacing: 20
                                        Text { text: "F10"; color: Theme.gold; font.family: Theme.fontMono; font.pixelSize: 10; font.bold: true }
                                        Text { text: "Record output"; color: Theme.dim; font.family: Theme.fontMono; font.pixelSize: 9 }
                                    }
                                    RowLayout { spacing: 20
                                        Text { text: "F11"; color: Theme.gold; font.family: Theme.fontMono; font.pixelSize: 10; font.bold: true }
                                        Text { text: "Snapshot frame"; color: Theme.dim; font.family: Theme.fontMono; font.pixelSize: 9 }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Footer
        RowLayout {
            Layout.fillWidth: true

            GhostButton {
                text: qsTr("START TOUR")
                onClicked: {
                    App.showTutorials = false;
                    App.startTour();
                }
            }

            Item { Layout.fillWidth: true }

            GoldButton {
                readonly property int lastIdx: tutorialsRoot.activeContent.length - 1
                text: tutTab.current < lastIdx ? "NEXT TAB" : "BUY CREDITS"
                onClicked: {
                    if (tutTab.current < lastIdx) {
                        tutTab.current++;
                    } else {
                        App.showTutorials = false;
                        App.showPlanGate = true;
                    }
                }
            }
        }
    }
}
