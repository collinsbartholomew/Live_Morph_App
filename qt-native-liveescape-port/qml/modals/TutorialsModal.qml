import QtQuick
import SmokeScreen

// #tutorialModal — z 10002, full-bleed #04040a.
// Header SMOKE SCREEN / Tutorials · tabs Smokescreen Setup | Voice Changer
// (Creator/Pro gated) · content: video placeholder + description + downloads
// + sidebar playlist (reference pads each tab to 10 items with placeholders).
Item {
    id: root
    anchors.fill: parent
    visible: App.showTutorials
    z: 10002

    property int tab: 0        // 0 setup, 1 voice
    readonly property bool voiceUnlocked: {
        const p = (Session.plan || "").toLowerCase()
        return p === "creator" || p === "pro"
    }

    Rectangle { anchors.fill: parent; color: Theme.bg }

    // entrance (tutFadeIn .22s)
    opacity: 0
    onVisibleChanged: {
        if (visible) {
            fadeIn.start()
            // Load downloads only when authenticated (reference skips without a key)
            if (Session.accessKey.length > 0)
                App.loadDownloads(Session.accessKey)
        }
    }
    NumberAnimation { id: fadeIn; target: root; property: "opacity"; to: 1; duration: 220 }

    Column {
        anchors.fill: parent
        anchors.margins: 32

        // ── header ──
        Row {
            width: parent.width
            spacing: 8
            Column {
                spacing: 4
                Text {
                    text: qsTr("SMOKE SCREEN")
                    color: Theme.gold
                    font.family: Theme.fontMono
                    font.pixelSize: 8
                    font.letterSpacing: 3
                }
                Text {
                    text: qsTr("Tutorials")
                    color: Theme.text
                    font.family: Theme.fontUi
                    font.pixelSize: 18
                    font.weight: Font.Bold
                    font.letterSpacing: 1
                }
            }
            Item { width: parent.width - 80; height: 1 }
            Rectangle {
                width: 40
                height: 40
                radius: 20
                color: Qt.rgba(255, 255, 255, 0.04)
                border.width: 1
                border.color: Qt.rgba(255, 255, 255, 0.08)
                Text {
                    anchors.centerIn: parent
                    text: "×"
                    color: Theme.dim
                    font.pixelSize: 20
                }
                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: App.showTutorials = false
                }
            }
        }

        // ── tabs ──
        Row {
            spacing: 0
            bottomPadding: 18
            component TutTab: Rectangle {
                property string label: ""
                property bool active: false
                property bool locked: false
                width: tabTxt.implicitWidth + 36
                height: 34
                color: "transparent"
                border.width: 0
                Text {
                    id: tabTxt
                    anchors.centerIn: parent
                    text: parent.label
                    color: parent.active ? Theme.gold : (parent.locked ? Theme.dim2 : Theme.dim)
                    opacity: parent.locked && !parent.active ? 0.5 : 1
                    font.family: Theme.fontMono
                    font.pixelSize: 9
                    font.letterSpacing: 1.5
                }
                Rectangle {
                    visible: parent.active
                    anchors.bottom: parent.bottom
                    width: parent.width
                    height: 2
                    color: Theme.gold
                }
            }
            TutTab {
                label: qsTr("Smokescreen Setup")
                active: root.tab === 0
                MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: root.tab = 0 }
            }
            TutTab {
                label: root.voiceUnlocked ? qsTr("Voice Changer") : qsTr("Voice Changer 🔒")
                active: root.tab === 1
                locked: !root.voiceUnlocked
                MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: root.tab = 1 }
            }
        }

        // ── gated voice panel ──
        Rectangle {
            width: parent.width
            height: parent.height - 140
            visible: root.tab === 1 && !root.voiceUnlocked
            color: Theme.s1
            border.width: 1
            border.color: Theme.goldD
            radius: 14
            Column {
                anchors.centerIn: parent
                width: Math.min(parent.width - 80, 460)
                spacing: 12
                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "🔒"
                    font.pixelSize: 40
                }
                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: qsTr("CREATOR PLAN REQUIRED")
                    color: Theme.gold
                    font.family: Theme.fontMono
                    font.pixelSize: 13
                    font.weight: Font.Bold
                    font.letterSpacing: 2
                }
                Text {
                    width: parent.width
                    horizontalAlignment: Text.AlignHCenter
                    wrapMode: Text.WordWrap
                    text: qsTr("Voice Changer tutorials cover pitch control, live preview, and integrating voice effects into your stream setup. Available on Creator and Pro plans.")
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 10
                    lineHeight: 1.7
                }
                Rectangle {
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: gateBtnTxt.implicitWidth + 56
                    height: 40
                    radius: 8
                    gradient: Gradient {
                        orientation: Gradient.Horizontal
                        GradientStop { position: 0; color: Theme.gold }
                        GradientStop { position: 1; color: Theme.goldDeep }
                    }
                    Text {
                        id: gateBtnTxt
                        anchors.centerIn: parent
                        text: qsTr("UPGRADE PLAN")
                        color: Theme.goldInk
                        font.family: Theme.fontUi
                        font.pixelSize: 11
                        font.weight: Font.Black
                        font.letterSpacing: 2
                    }
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            App.showTutorials = false
                            App.openUpgradeFlow()
                        }
                    }
                }
            }
        }

        // ── setup / unlocked voice content ──
        Row {
            width: parent.width
            height: parent.height - 140
            spacing: 32
            visible: root.tab === 0 || root.voiceUnlocked

            // main: video placeholder + body + downloads
            Column {
                width: (parent.width - 32) * 0.68
                spacing: 12

                Rectangle {
                    width: parent.width
                    height: parent.width * 9 / 16
                    radius: 8
                    color: "#000000"
                    border.width: 1
                    border.color: Theme.border
                    Column {
                        anchors.centerIn: parent
                        spacing: 8
                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: "▶"
                            color: Theme.gold
                            font.pixelSize: 34
                            opacity: 0.6
                        }
                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: root.tab === 0 ? qsTr("SMOKESCREEN SETUP") : qsTr("VOICE CHANGER SETUP")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 2
                        }
                    }
                }

                Text {
                    width: parent.width
                    wrapMode: Text.WordWrap
                    text: root.tab === 0
                          ? qsTr("Get set up in minutes: activate your license, upload a reference photo, write a prompt, and press CONNECT. Credits burn only while live.")
                          : qsTr("Learn how to activate and use the Voice Changer feature in real time. Covers pitch control, live preview, and integrating voice effects into your stream setup. Available on Creator and Pro plans.")
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 10
                    lineHeight: 1.7
                }

                Repeater {
                    model: root.tab === 0
                           ? [qsTr("OBS Scene Collection"), qsTr("Virtual Cam Setup Guide")]
                           : [qsTr("VoiceDrift Desktop"), qsTr("OBS Audio Routing Guide")]
                    delegate: Rectangle {
                        width: parent.width
                        height: 34
                        radius: 6
                        color: Theme.s1
                        border.width: 1
                        border.color: Theme.border
                        Row {
                            anchors.fill: parent
                            anchors.margins: 8
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
                        }
                    }
                }
            }

            // sidebar playlist (placeholder-padded to 10, like the reference)
            Rectangle {
                width: (parent.width - 32) * 0.32 - 24
                height: parent.height
                color: "transparent"
                border.width: 0

                ListView {
                    anchors.fill: parent
                    clip: true
                    spacing: 6
                    model: {
                        const real = (App.downloadsModel || []).filter(function(d) {
                            const cat = (d.category || "setup")
                            return root.tab === 0 ? cat === "setup" : cat === "voice"
                        })
                        const out = real.map(function(d) { return { name: d.name || d.title || "Tutorial", placeholder: false } })
                        let i = out.length
                        while (i < 10) { out.push({ name: qsTr("Coming Soon"), placeholder: true }); i++ }
                        return out
                    }
                    delegate: Rectangle {
                        width: ListView.view.width
                        height: 46
                        radius: 8
                        color: Theme.s2
                        opacity: modelData.placeholder ? 0.5 : 1
                        Text {
                            anchors.left: parent.left
                            anchors.leftMargin: 12
                            anchors.verticalCenter: parent.verticalCenter
                            width: parent.width - 24
                            text: modelData.name
                            color: Theme.text
                            font.family: Theme.fontUi
                            font.pixelSize: 13
                            font.weight: Font.DemiBold
                            elide: Text.ElideRight
                        }
                    }
                }
            }
        }
    }

}
