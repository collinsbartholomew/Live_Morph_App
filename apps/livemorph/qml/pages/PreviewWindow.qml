import LiveMorph
import QtMultimedia
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import QtQuick.Window

ApplicationWindow {
    id: root

    property bool cleanMode: false

    title: "Preview Window"
    width: 1280
    height: 720
    minimumWidth: 640
    minimumHeight: 360
    color: "#000000"
    flags: Qt.Window
    visible: false
    onClosing: {
        root.destroy();
    }

    Keys.onPressed: function(event) {
        if (event.key === Qt.Key_F11) {
            root.visibility = root.visibility === Window.FullScreen ? Window.Windowed : Window.FullScreen
        } else if (event.key === Qt.Key_Escape && root.visibility === Window.FullScreen) {
            root.visibility = Window.Windowed
        }
    }

    Rectangle {
        anchors.fill: parent
        color: "#000000"

        VideoOutput {
            id: videoOut

            anchors.fill: parent
            anchors.bottomMargin: !root.cleanMode ? 32 : 0
            fillMode: VideoOutput.PreserveAspectFit
            visible: Session.isActive && Session.peerVideoSink !== null

        }

        Binding {
            target: videoOut
            property: "videoSink"
            value: Session.peerVideoSink
            when: Session.peerVideoSink !== null && root.visible
        }

        // Empty state
        Column {
            anchors.centerIn: parent
            spacing: 8
            visible: !Session.isActive

            Image {
                anchors.horizontalCenter: parent.horizontalCenter
                source: "qrc:/assets/livemorph-icon.png"
                width: 64
                height: 64
                opacity: 0.4
                fillMode: Image.PreserveAspectFit
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: "LiveMorph Live Preview"
                color: Colors.textPrimary
                font.pixelSize: 18
                font.weight: Font.SemiBold
                opacity: 0.6
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: "Waiting for stream..."
                color: Colors.textSecondary
                font.pixelSize: 13
                opacity: 0.5
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: "Start OBS Stream in the main window"
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
                        text: "Capture this window in OBS using Window Capture"
                        color: Colors.textSecondary
                        font.pixelSize: 11
                        font.family: Theme.fontMono.family
                        opacity: 0.6
                        Layout.alignment: Qt.AlignHCenter
                    }

                    Text {
                        text: "Window title: Preview Window"
                        color: Colors.textMuted
                        font.pixelSize: 10
                        font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Consolas, monospace"
                        Layout.alignment: Qt.AlignHCenter
                    }
                }
            }
        }

        // Hover toolbar (top-right, auto-hide)
        Rectangle {
            id: hoverToolbar
            visible: !root.cleanMode && !hoverArea.containsMouse
            anchors.top: parent.top
            anchors.right: parent.right
            anchors.margins: 12
            width: hoverRow.implicitWidth + 16
            height: 32
            radius: Theme.radiusSm
            color: Colors.surfaceRaised + "cc"
            border.color: Colors.surfaceBorder
            border.width: 1
            opacity: hoverArea.containsMouse ? 0 : 1

            Behavior on opacity { NumberAnimation { duration: 200 } }

            Row {
                id: hoverRow
                anchors.centerIn: parent
                spacing: 4

                Rectangle {
                    width: cleanModeBtn.implicitWidth + 16
                    height: 24
                    radius: 3
                    color: root.cleanMode ? Colors.accentMuted : "transparent"
                    border.color: root.cleanMode ? Colors.accent : "transparent"
                    border.width: 1

                    Text {
                        id: cleanModeBtn
                        anchors.centerIn: parent
                        text: root.cleanMode ? "Show Footer" : "Clean Mode"
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
                    radius: 3
                    color: "transparent"

                    Text {
                        id: fsBtn
                        anchors.centerIn: parent
                        text: root.visibility === Window.FullScreen ? "Exit Fullscreen" : "Fullscreen"
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
            color: "#00000099"

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
                    text: "LiveMorph Live Preview — 1280x720"
                    color: Colors.textMuted
                    font.pixelSize: 9
                    font.family: Theme.fontMono.family
                    anchors.verticalCenter: parent.verticalCenter
                }
            }

            Row {
                anchors.verticalCenter: parent.verticalCenter
                anchors.right: parent.right
                anchors.rightMargin: 16
                spacing: 12

                Text {
                    text: "A product of TheTools Hub"
                    color: Colors.textMuted
                    font.pixelSize: 9
                    font.family: Theme.fontMono.family
                    anchors.verticalCenter: parent.verticalCenter
                }

                Text {
                    text: "|"
                    color: Colors.textMuted
                    font.pixelSize: 9
                    opacity: 0.2
                    anchors.verticalCenter: parent.verticalCenter
                }

                Text {
                    text: "Support"
                    color: Colors.accent
                    font.pixelSize: 9
                    font.family: Theme.fontMono.family
                    opacity: 0.6
                    anchors.verticalCenter: parent.verticalCenter

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: Qt.openUrlExternally("https://livemorph.app/support")
                    }
                }
            }
        }

    }

}
