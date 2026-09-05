import LiveMorph
import QtMultimedia
import QtQuick
import QtQuick.Controls
import QtQuick.Window

/**
 * Preview window — mirrors the morph (AI) output at 1280×720 for OBS/window capture.
 */
ApplicationWindow {
    id: root

    property bool cleanMode: false

    title: "LiveMorph Preview"
    width: 1280
    height: 720
    minimumWidth: 640
    minimumHeight: 360
    color: "#000000"
    flags: Qt.Window
    visible: false
    onClosing: {
        root.visible = false;
        close.accepted = false;
    }

    Rectangle {
        anchors.fill: parent
        color: "#000000"

        VideoOutput {
            id: videoOut

            anchors.fill: parent
            fillMode: VideoOutput.PreserveAspectFit
            visible: Session.isActive && Session.peerVideoSink !== null

        }

        Binding {
            target: videoOut
            property: "videoSink"
            value: Session.peerVideoSink
            when: Session.peerVideoSink !== null && root.visible
        }

        Text {
            anchors.centerIn: parent
            text: Session.isActive ? "" : "Start a morph to preview the output"
            color: Colors.textMuted
            font.pixelSize: 15
            visible: !Session.isActive
        }

        // Session badge (always visible, including clean mode)
        Rectangle {
            anchors.top: parent.top
            anchors.left: parent.left
            anchors.margins: root.cleanMode ? 12 : 44
            height: 22
            width: badgeRow.implicitWidth + 14
            radius: 4
            color: Session.isActive ? Colors.statusErrorMuted : Colors.surfaceOverlay
            border.color: Session.isActive ? Colors.statusError + "66" : Colors.surfaceBorder
            border.width: 1
            visible: Session.isActive || !root.cleanMode

            Row {
                id: badgeRow

                anchors.centerIn: parent
                spacing: 6

                Rectangle {
                    width: 6
                    height: 6
                    radius: 3
                    color: Session.isActive ? Colors.statusError : Colors.textMuted
                    anchors.verticalCenter: parent.verticalCenter

                    SequentialAnimation on opacity {
                        running: Session.isActive && root.visible && Qt.application.state === Qt.ApplicationActive
                        loops: Animation.Infinite

                        NumberAnimation {
                            from: 1
                            to: 0.35
                            duration: 700
                        }

                        NumberAnimation {
                            from: 0.35
                            to: 1
                            duration: 700
                        }

                    }

                }

                Text {
                    text: Session.isActive ? "LIVE MORPH" : "IDLE"
                    color: Session.isActive ? Colors.statusError : Colors.textMuted
                    font.pixelSize: 10
                    font.weight: Font.Bold
                    font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                    anchors.verticalCenter: parent.verticalCenter
                }

            }

        }

        // Character chip when live
        Rectangle {
            anchors.top: parent.top
            anchors.right: parent.right
            anchors.margins: root.cleanMode ? 12 : 44
            height: 22
            width: charLab.implicitWidth + 14
            radius: 4
            color: Colors.surfaceOverlay
            border.color: Colors.surfaceBorder
            visible: Session.isActive && (Session.activeCharacterName.length || Session.activeCharacterId.length)

            Text {
                id: charLab

                anchors.centerIn: parent
                text: Session.activeCharacterName.length ? Session.activeCharacterName : Session.activeCharacterId
                color: Colors.textPrimary
                font.pixelSize: 10
            }

        }

        // Chrome
        Rectangle {
            visible: !root.cleanMode
            anchors.top: parent.top
            anchors.left: parent.left
            anchors.right: parent.right
            height: 36
            color: "#000000cc"

            Row {
                anchors.verticalCenter: parent.verticalCenter
                anchors.left: parent.left
                anchors.leftMargin: 12
                spacing: 12

                Text {
                    text: "PREVIEW · Morph output"
                    color: Colors.textSecondary
                    font.pixelSize: 11
                    font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                    anchors.verticalCenter: parent.verticalCenter
                }

                Text {
                    visible: Session.isActive
                    text: Session.creditsPerSecond.toFixed(1) + " cr/s"
                    color: Colors.accent
                    font.pixelSize: 11
                    font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                    anchors.verticalCenter: parent.verticalCenter
                }

            }

            Row {
                anchors.verticalCenter: parent.verticalCenter
                anchors.right: parent.right
                anchors.rightMargin: 8
                spacing: 8

                GhostButton {
                    text: root.cleanMode ? "Show chrome" : "Clean mode"
                    ToolTip.visible: hovered
                    ToolTip.delay: 400
                    ToolTip.text: "Hide UI chrome for a clean program feed"
                    onClicked: root.cleanMode = !root.cleanMode
                }

                GhostButton {
                    text: "Close"
                    onClicked: root.close()
                }

            }

        }

        Rectangle {
            visible: root.cleanMode
            anchors.top: parent.top
            anchors.right: parent.right
            anchors.margins: 8
            width: 28
            height: 28
            radius: 6
            color: "#00000099"

            Text {
                anchors.centerIn: parent
                text: "☰"
                color: Colors.textSecondary
                font.pixelSize: 12
            }

            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: root.cleanMode = false
            }

        }

    }

}
