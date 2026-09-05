import LiveEscape
import QtQuick
import QtQuick.Layouts

ModalBase {
    readonly property var tabs: ["START", "OBS", "FACE", "PROMPT", "PAY"]
    readonly property var content: [{
        "title": "First session in 5 minutes",
        "body": "1) Activate your license on the Access Gate.\n2) Upload a clear front-facing reference photo.\n3) Write a short prompt (who/what you want to look like).\n4) Press CONNECT — AI output appears when WebEngine is available.\n5) Credits burn only while live. Disconnect to stop billing."
    }, {
        "title": "OBS / virtual camera",
        "body": "1) Press OBS mode (theatre) for a clean full-stage view.\n2) Capture this window with OBS Window Capture, or use a virtual-cam plugin on the stage region.\n3) Prefer 720p balanced quality for stable streams.\n4) Freeze frame is useful for static overlays while you adjust scenes.\n5) Keep the Live Escape window on a free GPU when possible."
    }, {
        "title": "Reference face tips",
        "body": "• Use a sharp, well-lit face photo (JPG/PNG).\n• Eyes visible, minimal occlusion, neutral angle works best.\n• You can capture from CAMERA or pick a FILE.\n• Re-upload anytime — CONNECT again to apply.\n• Creator/Pro unlock richer background and style presets."
    }, {
        "title": "Prompting that works",
        "body": "• Be specific: subject + style + lighting.\n• Example: \"Anime hero, soft rim light, cinematic\".\n• Toggle Enhance for automatic prompt cleanup.\n• Live Update pushes prompt changes while connected.\n• Recent prompts are saved for quick reuse."
    }, {
        "title": "Credits & payments",
        "body": "• Buy packs in-app — checkout stays inside Live Escape.\n• Your payment goes to our merchant account first.\n• We reserve Decart capacity on our platform key, then credit your balance.\n• Credits never expire. Low balance shows a banner before disconnect.\n• Crypto: send exact amount, paste TX ID to verify."
    }]

    open: App.showTutorials
    modalZ: 220
    panelWidth: Math.min(parent.width - 32, 560)
    panelImplicitHeight: Math.min(parent.height - 32, 520)
    onClose: App.showTutorials = false

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 4
        spacing: 12

        RowLayout {
            Layout.fillWidth: true

            Text {
                text: "TUTORIALS"
                color: Theme.gold
                font.family: Theme.fontUi
                font.pixelSize: 16
                font.bold: true
                font.letterSpacing: 2
                Layout.fillWidth: true
            }

            GhostButton {
                text: "✕"
                onClicked: App.showTutorials = false
            }

        }

        Row {
            spacing: 6

            Repeater {
                model: tabs

                Rectangle {
                    width: 72
                    height: 28
                    radius: Theme.radius
                    color: tutTab.current === index ? Theme.gold : Theme.s2
                    border.color: Theme.border

                    Text {
                        anchors.centerIn: parent
                        text: modelData
                        color: tutTab.current === index ? Theme.bg : Theme.dim
                        font.family: Theme.fontMono
                        font.pixelSize: 10
                        font.bold: tutTab.current === index
                    }

                    MouseArea {
                        anchors.fill: parent
                        onClicked: tutTab.current = index
                    }

                }

            }

            Item {
                id: tutTab

                property int current: 0
            }

        }

        Rectangle {
            Layout.fillWidth: true
            Layout.fillHeight: true
            radius: Theme.radius
            color: Theme.s2
            border.color: Theme.border
            clip: true

            Flickable {
                anchors.fill: parent
                anchors.margins: 16
                contentHeight: tutCol.implicitHeight
                clip: true

                Column {
                    id: tutCol

                    width: parent.width
                    spacing: 12

                    Text {
                        text: content[tutTab.current].title
                        color: Theme.text
                        font.family: Theme.fontUi
                        font.pixelSize: 15
                        font.bold: true
                    }

                    Text {
                        width: parent.width
                        wrapMode: Text.WordWrap
                        text: content[tutTab.current].body
                        color: Theme.dim
                        font.family: Theme.fontMono
                        font.pixelSize: 11
                        lineHeight: 1.35
                    }

                }

            }

        }

        RowLayout {
            Layout.fillWidth: true

            GhostButton {
                text: "START TOUR"
                onClicked: {
                    App.showTutorials = false;
                    App.startTour();
                }
            }

            Item {
                Layout.fillWidth: true
            }

            GoldButton {
                text: tutTab.current < 4 ? "NEXT TAB" : "BUY CREDITS"
                onClicked: {
                    if (tutTab.current < 4) {
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
