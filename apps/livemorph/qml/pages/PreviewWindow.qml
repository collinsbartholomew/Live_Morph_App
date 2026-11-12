import LiveMorph
import QtMultimedia
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import QtQuick.Window

ApplicationWindow {
    id: root

    property bool cleanMode: false

    // Qt 6.12: VideoOutput.videoSink is read-only and each VideoOutput owns
    // its internal sink — feed the output's OWN sink from the peer.
    function bindSink() {
        Session.bindPreviewVideoOutput(videoOut)
    }
    onVisibleChanged: if (visible) bindSink()
    Connections {
        target: Session
        function onPeerVideoSinkChanged() { if (root.visible) root.bindSink() }
        function onPreviewVideoSinkChanged() { if (root.visible) root.bindSink() }
    }

    title: qsTr("Preview Window")
    width: 1280
    height: 720
    minimumWidth: 640
    minimumHeight: 360
    color: Colors.black
    flags: Qt.Window
    visible: false
    onClosing: {
        Session.unbindPreviewVideoOutput()
        root.destroy();
    }

    Keys.onPressed: function(event) {
        if (event.key === Qt.Key_C && event.modifiers === (Qt.ControlModifier | Qt.ShiftModifier)) {
            root.cleanMode = !root.cleanMode
            event.accepted = true
            return
        }
        if (event.key === Qt.Key_F11) {
            root.visibility = root.visibility === Window.FullScreen ? Window.Windowed : Window.FullScreen
            event.accepted = true
        } else if (event.key === Qt.Key_Escape && root.visibility === Window.FullScreen) {
            root.visibility = Window.Windowed
            event.accepted = true
        }
    }

    Rectangle {
        anchors.fill: parent
        color: Colors.black
        clip: true

        Honeycomb {
            anchors.fill: parent
            cellSize: Theme.honeycombCellLg
            lineColor: Colors.honeycombOnBlack
            highlightCells: ["4,2", "5,2", "4,3", "6,3", "5,4"]
            opacity: 0.6
        }

        // Hex-tech corner frame on the preview surface
        CornerTicks {
            anchors.fill: parent
            inset: 8
            tickSize: 12
            thickness: 1.5
            color: Colors.white15
        }

        VideoOutput {
            id: videoOut

            anchors.fill: parent
            anchors.bottomMargin: !root.cleanMode ? 32 : 0
            fillMode: VideoOutput.PreserveAspectFit
            visible: Session.isActive && Session.peerVideoSink !== null

        }

        // Feed this output's own sink from the peer's aux-sink fan-out.
        Component.onCompleted: root.bindSink()

        // Empty state
        Column {
            anchors.centerIn: parent
            spacing: 8
            visible: !(Session.isActive && Session.peerVideoSink !== null)

            Item {
                width: 72; height: 72
                anchors.horizontalCenter: parent.horizontalCenter
                Hexagon {
                    anchors.centerIn: parent
                    size: 72
                    lineWidth: 2
                    lineColor: Colors.white35
                }
                Image {
                    anchors.centerIn: parent
                    source: "qrc:/assets/livemorph-icon.png"
                    width: 40
                    sourceSize: Qt.size(80, 80)
                    height: 40
                    opacity: 0.5
                    fillMode: Image.PreserveAspectFit
                }
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: qsTr("LiveMorph Live Preview")
                color: Colors.textPrimary
                font.pixelSize: 18
                font.weight: Font.Bold
                opacity: 0.6
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: qsTr("Waiting for first frame…")
                color: Colors.textSecondary
                font.pixelSize: 13
                opacity: 0.5
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: qsTr("Start OBS Stream in the main window")
                color: Colors.textSecondary
                font.pixelSize: 10
                opacity: 0.3
            }

            Rectangle {
                anchors.horizontalCenter: parent.horizontalCenter
                width: obsInfoCol.implicitWidth + 40
                height: obsInfoCol.implicitHeight + 20
                radius: Theme.radiusMd
                color: Colors.surfaceRaised
                border.color: Colors.surfaceBorder
                border.width: 1

                ColumnLayout {
                    id: obsInfoCol
                    anchors.centerIn: parent
                    spacing: 4

                    Text {
                        text: qsTr("Capture this window in OBS using Window Capture")
                        color: Colors.textSecondary
                        font.pixelSize: 11
                        font.family: Theme.fontMono.family
                        opacity: 0.6
                        Layout.alignment: Qt.AlignHCenter
                    }

                    Text {
                        text: qsTr("Window title: %1").arg(root.title)
                        color: Colors.textMuted
                        font.pixelSize: 10
                        font.family: Theme.fontMono.family
                        Layout.alignment: Qt.AlignHCenter
                    }
                }
            }
        }

        // Hover toolbar (top-right, auto-hide)
        Rectangle {
            id: hoverToolbar
            visible: !root.cleanMode && hoverArea.containsMouse
            anchors.top: parent.top
            anchors.right: parent.right
            anchors.margins: 12
            width: hoverRow.implicitWidth + 16
            height: 32
            radius: Theme.radiusSm
            color: Colors.surfaceGlassStrong
            border.color: Colors.surfaceBorder
            border.width: 1


            Row {
                id: hoverRow
                anchors.centerIn: parent
                spacing: 4

                Rectangle {
                    width: cleanModeBtn.implicitWidth + 16
                    height: 24
                    radius: Theme.radiusSm
                    color: root.cleanMode ? Colors.accentMuted : Colors.transparent
                    border.color: root.cleanMode ? Colors.accent : Colors.transparent
                    border.width: 1

                    Text {
                        id: cleanModeBtn
                        anchors.centerIn: parent
                        text: root.cleanMode ? qsTr("Show Footer") : qsTr("Clean Mode")
                        color: root.cleanMode ? Colors.accent : Colors.textSecondary
                        font.pixelSize: 10
                        font.family: Theme.fontMono.family
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.cleanMode = !root.cleanMode
                    }
                }

                Rectangle {
                    width: fsBtn.implicitWidth + 16
                    height: 24
                    radius: Theme.radiusSm
                    color: Colors.transparent

                    Text {
                        id: fsBtn
                        anchors.centerIn: parent
                        text: root.visibility === Window.FullScreen ? qsTr("Exit Fullscreen") : qsTr("Fullscreen")
                        color: Colors.textSecondary
                        font.pixelSize: 10
                        font.family: Theme.fontMono.family
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.visibility = root.visibility === Window.FullScreen ? Window.Windowed : Window.FullScreen
                    }
                }
            }
        }

        // Invisible hover area for toolbar
        MouseArea {
            id: hoverArea
            anchors.top: parent.top
            anchors.right: parent.right
            anchors.margins: 4
            width: 200
            height: 50
            hoverEnabled: true
            visible: !root.cleanMode
        }

        // Hamburger restore button (clean mode)
        Rectangle {
            visible: root.cleanMode
            anchors.top: parent.top
            anchors.right: parent.right
            anchors.margins: 8
            width: 28
            height: 28
            radius: Theme.radiusSm
            color: Colors.overlayScrim

            Icon {
                anchors.centerIn: parent
                name: "menu"
                size: 14
                color: Colors.textSecondary
            }

            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: root.cleanMode = false
            }
        }

        // Chrome bar at bottom
        Rectangle {
            visible: !root.cleanMode
            anchors.bottom: parent.bottom
            anchors.left: parent.left
            anchors.right: parent.right
            height: 32
            color: Colors.surfaceRaised
            border.color: Colors.surfaceBorder
            border.width: 1

            Row {
                anchors.verticalCenter: parent.verticalCenter
                anchors.left: parent.left
                anchors.leftMargin: 16
                spacing: 12

                Text {
                    text: qsTr("LiveMorph Live Preview — %1×%2").arg(root.width).arg(root.height)
                    color: Colors.textMuted
                    font: Theme.fontMicro
                    anchors.verticalCenter: parent.verticalCenter
                }
            }

            Row {
                anchors.verticalCenter: parent.verticalCenter
                anchors.right: parent.right
                anchors.rightMargin: 16
                spacing: 12

                Text {
                    text: qsTr("A product of TheTools Hub")
                    color: Colors.textMuted
                    font: Theme.fontMicro
                    anchors.verticalCenter: parent.verticalCenter
                }

                Rectangle {
                    width: 1
                    height: 12
                    color: Colors.divider
                    anchors.verticalCenter: parent.verticalCenter
                }

                Text {
                    text: qsTr("Support")
                    color: Colors.accentHover
                    font: Theme.fontMicro
                    anchors.verticalCenter: parent.verticalCenter

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: Qt.openUrlExternally(Constants.urlSupport)
                    }
                }
            }
        }

    }

}
