import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveEscape

Item {
    anchors.fill: parent
    visible: App.showBgPanel
    z: 480
    Rectangle { anchors.fill: parent; color: "#04040ae8"; MouseArea { anchors.fill: parent; onClicked: App.showBgPanel = false } }

    Rectangle {
        id: panelRoot
        width: Math.min(parent.width * 0.9, 760)
        height: Math.min(parent.height * 0.8, 680)
        anchors.centerIn: parent
        radius: 12
        color: Theme.s1
        border.color: Theme.goldDim
        MouseArea { anchors.fill: parent }

        // Apply-in-flight state (Electron #bgPanelApplyOverlay)
        property bool applying: false
        property string applyingLabel: ""

        ColumnLayout {
            anchors.fill: parent
            anchors.margins: 20
            spacing: 12
            RowLayout {
                Layout.fillWidth: true
                Text { text: "BACKGROUND"; color: Theme.gold; font.family: Theme.fontUi; font.pixelSize: 16; font.bold: true; font.letterSpacing: 2; Layout.fillWidth: true }
                GhostButton { text: "✕"; onClicked: App.showBgPanel = false }
            }
            Text {
                Layout.fillWidth: true
                wrapMode: Text.WordWrap
                text: qsTr("Pick a scene — your stream updates live. Premium scenes require full license activation.")
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 10
            }
            GridView {
                Layout.fillWidth: true
                Layout.fillHeight: true
                cellWidth: 120
                cellHeight: 100
                model: App.bgPresets
                clip: true
                delegate: Rectangle {
                    id: bgCard
                    width: 110; height: 90
                    radius: 10
                    color: Theme.s2
                    border.color: Theme.border
                    border.width: 1
                    opacity: modelData.premium === true && Session.plan === "starter" ? 0.55 : 1.0

                    Column {
                        anchors.centerIn: parent
                        width: parent.width
                        spacing: 6
                        Text { width: parent.width; horizontalAlignment: Text.AlignHCenter; text: modelData.icon || "🖼"; font.pixelSize: 26 }
                        Text {
                            width: parent.width
                            horizontalAlignment: Text.AlignHCenter
                            text: modelData.name
                            color: Theme.text
                            font.family: Theme.fontMono
                            font.pixelSize: 11
                        }
                        Text {
                            visible: modelData.premium === true
                            width: parent.width
                            horizontalAlignment: Text.AlignHCenter
                            text: qsTr("★ PREMIUM")
                            color: Theme.gold
                            font.family: Theme.fontMono
                            font.pixelSize: 7
                        }
                    }
                    MouseArea {
                        anchors.fill: parent
                        enabled: !panelRoot.applying
                        cursorShape: modelData.premium === true && Session.plan === "starter" ? Qt.ForbiddenCursor : Qt.PointingHandCursor
                        onClicked: {
                            if (modelData.premium === true && Session.plan === "starter") {
                                App.toast("Premium background — full license activation unlocks this scene.", "warn")
                                return
                            }
                            // Electron shows an apply overlay and only closes
                            // on the server's answer — no instant false-success.
                            panelRoot.applying = true
                            panelRoot.applyingLabel = modelData.name || modelData.id
                            const p = modelData.prompt || modelData.name
                            Stream.selectBackgroundPreset(modelData.id, p)
                        }
                    }
                }
            }
        }
    }

    // ── Applying overlay (Electron #bgPanelApplyOverlay) ──
    Rectangle {
        anchors.fill: parent
        visible: panelRoot.applying
        color: "#04040ad0"
        // Root panel container is a plain Item (no radius) — match the card.
        radius: 12

        Column {
            anchors.centerIn: parent
            spacing: 14

            BusyIndicator {
                anchors.horizontalCenter: parent.horizontalCenter
                running: panelRoot.applying
                palette.dark: Theme.teal
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: qsTr("APPLYING BACKGROUND")
                color: Theme.teal
                font.family: Theme.fontUi
                font.pixelSize: 13
                font.bold: true
                font.letterSpacing: 2
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: qsTr("Sending scene to the engine…")
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 9
            }
        }
    }

    // Resolve the apply from the server's answer
    Connections {
        target: Stream
        function onBackgroundApplied(ok, label) {
            if (!panelRoot.applying)
                return
            panelRoot.applying = false
            if (ok) {
                App.showBgPanel = false
                App.toast((label ? "Background: " + label : "Background updated") + " — live", "ok")
            }
            // failure: panel stays open; Stream.statusMessage surfaces the error
        }
    }
}
