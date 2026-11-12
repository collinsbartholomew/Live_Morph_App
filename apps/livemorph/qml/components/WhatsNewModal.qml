import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

/**
 * What's New modal — Obsidian Hex release card:
 *   centered 520px panel on a scrim · faint honeycomb field · top hairline
 *   with corner ticks (CornerTicks) · eyebrow "WHAT'S NEW" + mono version
 *   headline · release notes with filled-hex bullets · footer with GOT IT.
 *   Scrim click or Escape marks the version seen and closes.
 */
Rectangle {
    id: root
    property bool open: false
    // Release headline + notes for the current version (set by callers when
    // the update payload provides them; Electron renders changelog markdown)
    property string headline: ""
    property var notes: []
    anchors.fill: parent
    color: Colors.overlayScrim
    visible: open
    z: Theme.zDialog
    opacity: open ? 1 : 0

    onOpenChanged: {
        if (open)
            App.modalOpened()
        else
            App.modalClosed()
    }
    Connections {
        target: App
        function onModalEscapeRequested() {
            if (root.open) {
                Config.whatsNewSeenVersion = App.appVersion || Backend.appVersion || Constants.appVersion
                root.open = false
            }
        }
    }

    MouseArea {
        anchors.fill: parent
        onClicked: {
            Config.whatsNewSeenVersion = App.appVersion || Backend.appVersion || Constants.appVersion
            root.open = false
        }
    }

    Rectangle {
        id: card
        anchors.centerIn: parent
        width: Math.min(parent.width - 48, 520)
        height: Math.min(parent.height - 64, 440)
        radius: Theme.radiusLg
        color: Colors.surfaceOverlay
        border.color: Colors.surfaceBorder
        border.width: 1
        clip: true

        MouseArea { anchors.fill: parent /* absorb clicks */ }

        Honeycomb {
            anchors.fill: parent
            cellSize: Theme.honeycombCell
            lineColor: Colors.honeycombLineFaint
            opacity: 0.5
        }

        // Top hairline + corner frame (signature Obsidian Hex panel chrome)
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 1
            color: Colors.white35
        }
        CornerTicks {
            anchors.fill: parent
            inset: 8
            tickSize: 8
            thickness: 1.5
            color: Colors.accent50
        }

        ColumnLayout {
            anchors.fill: parent
            spacing: 0

            // ── Header ──────────────────────────────────────────────
            ColumnLayout {
                Layout.fillWidth: true
                Layout.margins: 24
                Layout.topMargin: 24
                Layout.bottomMargin: 16
                spacing: 6

                RowLayout {
                    Layout.fillWidth: true
                    spacing: 10
                    Hexagon {
                        size: 10
                        lineWidth: 1.5
                        lineColor: Colors.accent
                    }
                    Text {
                        text: qsTr("WHAT'S NEW")
                        color: Colors.textMuted
                        font.family: Theme.fontMono.family
                        font.pixelSize: 10
                        font.weight: Font.Bold
                        font.letterSpacing: Theme.trackingEyebrow
                    }
                    Rectangle {
                        Layout.fillWidth: true
                        height: 1
                        color: Colors.surfaceBorderSubtle
                    }
                }
                Text {
                    text: qsTr("v%1").arg(App.appVersion || Backend.appVersion || Constants.appVersion)
                    color: Colors.textPrimary
                    font: Theme.fontHeadline
                }
                Text {
                    visible: root.headline.length > 0
                    text: root.headline
                    color: Colors.textSecondary
                    font.pixelSize: 13
                    wrapMode: Text.WordWrap
                    Layout.fillWidth: true
                }
            }

            // ── Notes ───────────────────────────────────────────────
            Flickable {
                Layout.fillWidth: true
                Layout.fillHeight: true
                Layout.leftMargin: 24
                Layout.rightMargin: 24
                contentHeight: notesCol.implicitHeight
                clip: true
                boundsBehavior: Flickable.StopAtBounds

                ColumnLayout {
                    id: notesCol
                    width: parent.width
                    spacing: 12

                    Repeater {
                        model: root.notes.length > 0 ? root.notes : [qsTr("This update includes performance improvements and bug fixes.")]
                        Row {
                            required property var modelData
                            Layout.fillWidth: true
                            spacing: 8
                            Hexagon {
                                size: 6
                                lineWidth: 0
                                fillColor: Colors.accent
                                anchors.verticalCenter: parent.verticalCenter
                            }
                            Text {
                                text: parent.modelData
                                color: Colors.textSecondary
                                font.pixelSize: 12
                                wrapMode: Text.WordWrap
                                width: parent.width - 14
                                lineHeight: 1.4
                            }
                        }
                    }
                }
                ScrollBar.vertical: StyledScrollBar { thin: true }
            }

            // ── Footer ──────────────────────────────────────────────
            Rectangle {
                Layout.fillWidth: true
                Layout.preferredHeight: 60
                Layout.topMargin: 16
                color: Colors.surfaceRaised
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
                    Item { Layout.fillWidth: true }
                    PrimaryButton {
                        text: qsTr("Got it")
                        onClicked: {
                            Config.whatsNewSeenVersion = App.appVersion || Backend.appVersion || Constants.appVersion
                            root.open = false
                        }
                    }
                }
            }
        }
    }
}
