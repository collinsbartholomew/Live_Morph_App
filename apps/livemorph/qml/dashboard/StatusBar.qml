import QtQuick
import QtQuick.Layouts
import LiveMorph

/**
 * Status footer (Electron i1, ground truth):
 *   h-8 (32px fixed) px-4 border-t surface-border bg-surface-base
 *   text: font-mono text-[10px] uppercase tracking-label text-text-secondary
 *   left: 6px connection dot (success glow when connected) + engine name
 *         + "·" + region "AUTO"
 *   right: latency ##MS tabular-nums (colored <200/<500/else) + "·"
 *          + OBS URL copy chip w/ "Copied" flash
 *   Qt functional extras kept inline, restyled to the same mono language.
 */
Rectangle {
    id: root
    color: Colors.surfaceBase
    implicitHeight: Theme.statusBarHeight

    property string copiedFlash: ""

    Rectangle {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        height: 1
        color: Colors.surfaceBorder
    }

    RowLayout {
        anchors.fill: parent
        anchors.leftMargin: 16
        anchors.rightMargin: 16
        spacing: 12

        // Connection dot + engine name + region (Electron left cluster)
        Row {
            spacing: 6
            Hexagon {
                size: 9
                lineWidth: 0
                anchors.verticalCenter: parent.verticalCenter
                fillColor: !Backend.reachable ? Colors.statusError
                        : (Session.connectionStatus === "connecting" || Session.connectionStatus === "reconnecting") ? Colors.statusWarning
                        : (Session.isActive && (Session.connectionStatus === "connected" || Session.connectionStatus === "generating")) ? Colors.statusSuccess
                        : Colors.textMuted
            }
            // Engine tier chip (HD accent-tinted)
            Rectangle {
                height: 20
                width: engLbl.implicitWidth + 12
                radius: Theme.radiusFull
                color: !Backend.reachable ? Colors.statusError10
                     : Session.hdActive ? Colors.accent10
                     : Colors.overlay30
                border.color: !Backend.reachable ? Colors.statusError30
                             : Session.hdActive ? Colors.accent30
                             : Colors.surfaceBorderSubtle
                border.width: 1
                Text {
                    id: engLbl
                    anchors.centerIn: parent
                    // Electron: engine TIER only ("HD" / "STANDARD") — no provider prefix
                    text: !Backend.reachable ? qsTr("OFFLINE")
                          : (Session.hdActive ? qsTr("HD") : qsTr("STANDARD"))
                    color: !Backend.reachable ? Colors.statusError
                         : Session.hdActive ? Colors.accentHover
                         : Colors.textSecondary
                    font.family: Theme.fontMono.family
                    font.pixelSize: 9
                    font.weight: Font.Bold
                    font.letterSpacing: 1.2
                }
            }
        }

        // Region pill (mono uppercase, matching the engine chip beside it)
        Rectangle {
            height: 20
            width: regionLbl.implicitWidth + 12
            radius: Theme.radiusFull
            color: Colors.overlay30
            border.color: Colors.surfaceBorderSubtle
            border.width: 1
            Text {
                id: regionLbl
                anchors.centerIn: parent
                text: qsTr("AUTO")
                color: Colors.textSecondary
                font.letterSpacing: 1.5
                font.family: Theme.fontMono.family
                font.pixelSize: 9
                font.weight: Font.Bold
            }
        }

        // Hex bullet separator (honeycomb motif in the footer strip)
        Hexagon {
            size: 7
            lineWidth: 0
            fillColor: Colors.textMuted40
            Layout.alignment: Qt.AlignVCenter
        }
        Item { Layout.fillWidth: true }

        // Latency chip (Electron: ##MS tabular-nums, colored by thresholds)
        Text {
            visible: Session.isActive && Session.rttMs >= 0
            text: qsTr("%1 ms").arg(Math.round(Session.rttMs))
            color: Session.connectionQuality === "good" ? Colors.statusSuccess
                 : Session.connectionQuality === "fair" ? Colors.statusWarning
                 : Colors.statusError
            font.family: Theme.fontMono.family
            font.pixelSize: 10
            font.weight: Font.Normal
            Layout.alignment: Qt.AlignVCenter
        }

        Hexagon {
            visible: Session.isActive && Session.rttMs >= 0
            size: 7
            lineWidth: 0
            fillColor: Colors.textMuted40
            Layout.alignment: Qt.AlignVCenter
        }

        // OBS Browser Source URL copy pill (Electron: hover accent, "Copied" flash)
        Rectangle {
            visible: StreamServer.running
            height: 22
            width: urlRow.implicitWidth + 12
            radius: Theme.radiusFull
            color: copiedMa.containsMouse ? Colors.overlay40 : Colors.overlay30
            border.color: copiedMa.containsMouse ? Colors.surfaceBorderStrong : Colors.surfaceBorderSubtle
            border.width: 1
            Layout.alignment: Qt.AlignVCenter

            Tooltip {
                anchors.top: parent.bottom
                anchors.topMargin: 6
                anchors.horizontalCenter: parent.horizontalCenter
                text: qsTr("Copy stream URL for OBS")
                shown: copiedMa.containsMouse
            }

            Row {
                id: urlRow
                anchors.centerIn: parent
                spacing: 5

                Icon {
                    name: root.copiedFlash.length > 0 ? "check" : "copy"
                    size: 11
                    color: root.copiedFlash.length > 0 ? Colors.statusSuccess
                         : copiedMa.containsMouse ? Colors.textPrimary : Colors.textMuted
                    anchors.verticalCenter: parent.verticalCenter
                }
                Text {
                    text: StreamServer.url
                    color: copiedMa.containsMouse ? Colors.textPrimary : Colors.textMuted
                    font.family: Theme.fontMono.family
                    font.pixelSize: 10
                    // Long custom URLs must not overpaint the right edge.
                    width: Math.min(implicitWidth, 220)
                    elide: Text.ElideMiddle
                    anchors.verticalCenter: parent.verticalCenter
                }
                Text {
                    visible: root.copiedFlash.length > 0
                    text: root.copiedFlash
                    color: Colors.statusSuccess
                    font.family: Theme.fontMono.family
                    font.pixelSize: 9
                    font.weight: Font.Bold
                    anchors.verticalCenter: parent.verticalCenter
                }
            }

            MouseArea {
                id: copiedMa
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: {
                    Backend.copyToClipboard(StreamServer.url)
                    root.copiedFlash = qsTr("COPIED")
                    flashTimer.restart()
                }
            }

            Timer {
                id: flashTimer
                interval: 1500
                onTriggered: root.copiedFlash = ""
            }
        }

        // Electron: right edge shows the stream-output status (version lives
        // in the titlebar instead).
        Text {
            visible: !StreamServer.running
            text: qsTr("STREAM OUTPUT: NOT STARTED")
            color: Colors.textMuted
            font.pixelSize: 10
            font.family: Theme.fontMono.family
            font.capitalization: Font.AllUppercase
            font.letterSpacing: 1.2
        }
    }
}
