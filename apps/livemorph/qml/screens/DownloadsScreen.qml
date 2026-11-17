import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import LiveMorph

Item {
    id: root
    anchors.fill: parent

    // Fetch lazily on first open — the screen is instantiated at startup but
    // hidden, so an onCompleted call would hit the API on every launch.
    property bool _fetched: false
    onVisibleChanged: {
        if (visible && !_fetched) {
            _fetched = true
            Backend.fetchDownloads()
        }
    }

    // Scrim (dims the app instead of blanking it); click outside closes.
    Rectangle {
        anchors.fill: parent
        color: Colors.overlayScrim
        MouseArea { anchors.fill: parent; onClicked: App.closeDownloads() }
    }

    Rectangle {
        anchors.centerIn: parent
        width: Math.min(parent.width * 0.7, 520)
        height: Math.min(parent.height * 0.8, 420)
        radius: Theme.radiusLg
        color: Colors.surfaceOverlay
        border.color: Colors.surfaceBorder
        border.width: 1
        clip: true
        MouseArea { anchors.fill: parent } // absorb clicks; scrim handles close

        Honeycomb {
            anchors.fill: parent
            cellSize: Theme.honeycombCell
            lineColor: Colors.honeycombLineFaint
            opacity: 0.5
        }

        // panel-premium inset highlight
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 1
            color: Colors.insetHighlight
            radius: Theme.radiusLg
        }

        // Hex-tech corner frame (signature motif on modal panels)
        CornerTicks {
            anchors.fill: parent
            inset: 6
            tickSize: 8
            thickness: 1
            color: Colors.accent30
        }

        ColumnLayout {
            anchors.fill: parent
            anchors.margins: Theme.spacingXl
            spacing: 0

            // Header (hex eyebrow + close)
            RowLayout {
                Layout.fillWidth: true
                Layout.bottomMargin: Theme.spacingMd
                SectionHeader {
                    text: qsTr("DOWNLOADS")
                    Layout.fillWidth: true
                }
                Rectangle {
                    width: 28; height: 28; radius: Theme.radiusMd
                    color: dlXMa.containsMouse ? Colors.white06 : Colors.transparent
                    Icon {
                        anchors.centerIn: parent
                        name: "x"
                        size: 12
                        color: dlXMa.containsMouse ? Colors.textSecondary : Colors.textMuted
                    }
                    MouseArea {
                        id: dlXMa
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: App.closeDownloads()
                    }
                }
            }

            Rectangle { Layout.fillWidth: true; height: 1; color: Colors.surfaceBorderSubtle; Layout.bottomMargin: Theme.spacingMd }

            // Rows (panel family — no zebra)
            ListView {
                id: listView
                Layout.fillWidth: true
                Layout.fillHeight: true
                visible: !Backend.downloadsLoading && Backend.downloadsModel && Backend.downloadsModel.length > 0
                clip: true
                spacing: Theme.spacingXs
                ScrollBar.vertical: StyledScrollBar { thin: true }
                model: Backend.downloadsModel || []
                delegate: Rectangle {
                    width: listView.width
                    height: 48
                    radius: Theme.radiusSm
                    color: dlRowMa.containsMouse ? Colors.overlay20 : Colors.transparent
                    border.color: Colors.surfaceBorderSubtle
                    border.width: 1
                    // Declared FIRST so it stays under the row content —
                    // otherwise it swallows the DOWNLOAD button's clicks.
                    MouseArea {
                        id: dlRowMa
                        anchors.fill: parent
                        hoverEnabled: true
                        z: Theme.zUnder
                    }
                    RowLayout {
                        anchors.fill: parent
                        anchors.leftMargin: Theme.spacingMd
                        anchors.rightMargin: Theme.spacingMd
                        spacing: Theme.gapCard
                        Text {
                            text: modelData.name || modelData.filename || qsTr("File")
                            color: Colors.textSecondary
                            font.pixelSize: Theme.fontMono.pixelSize
                            elide: Text.ElideMiddle
                            Layout.fillWidth: true
                        }
                        Text {
                            text: modelData.size || ""
                            color: Colors.textMuted
                            font.family: Theme.fontMono.family
                            font.pixelSize: Theme.fontMonoTiny.pixelSize
                        }
                        SecondaryButton {
                            compact: true
                            text: qsTr("DOWNLOAD")
                            onClicked: {
                                var u = modelData.url || ""
                                if (u.indexOf("https://") === 0)
                                    Backend.openExternal(u)
                                else
                                    Notifier.push(qsTr("Download link unavailable"), qsTr("Only https links can be opened."), "warning")
                            }
                        }
                    }
                }
            }

            ColumnLayout {
                visible: Backend.downloadsLoading
                Layout.fillWidth: true
                Layout.fillHeight: true
                Layout.topMargin: Theme.spacingLg
                spacing: Theme.spacingMd
                HexBadge {
                    Layout.alignment: Qt.AlignHCenter
                    size: 40
                    iconName: "download"
                    iconSize: Theme.iconLg
                }
                Spinner {
                    Layout.alignment: Qt.AlignHCenter
                    running: true
                }
                Text {
                    text: qsTr("Loading downloads…")
                    color: Colors.textMuted
                    font.pixelSize: Theme.fontMono.pixelSize
                    Layout.fillWidth: true
                    horizontalAlignment: Text.AlignHCenter
                }
            }
            EmptyState {
                visible: !Backend.downloadsLoading && (!Backend.downloadsModel || Backend.downloadsModel.length === 0)
                Layout.fillWidth: true
                Layout.fillHeight: true
                Layout.topMargin: Theme.spacingLg
                iconName: "download"
                badgeSize: 40
                body: qsTr("Nothing here yet — finished recordings and exports appear here.")
            }
        }
    }
}
