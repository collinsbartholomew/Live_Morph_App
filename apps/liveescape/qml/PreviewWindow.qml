import QtQuick
import QtQuick.Controls
import QtQuick.Window
import LiveEscape

Window {
    id: previewWindow
    visible: false
    width: 1280
    height: 720
    minimumWidth: 640
    minimumHeight: 360
    title: qsTr("Preview Window")
    color: Theme.bg
    flags: Qt.Window

    property bool cleanMode: false
    property bool fullscreen: false

    onVisibleChanged: {
        if (visible) {
            Stream.startMjpegServer(4789)
        } else {
            Stream.stopMjpegServer()
        }
    }

    Rectangle {
        anchors.fill: parent
        color: Theme.bg

        // Stage area
        Rectangle {
            id: stageFrame
            anchors.fill: parent
            anchors.topMargin: cleanMode ? 0 : 0
            anchors.bottomMargin: cleanMode ? 0 : (footer.visible ? footer.height : 0)
            color: "#000000"
            clip: true

            DecartViewport {
                id: previewViewport
                anchors.fill: parent
                anchors.margins: 2
                signalingWsUrl: Stream.signalingUrl
                userId: Session.userId
                accessKey: Session.accessKey
                model: "lucy-2.5"
                active: Stream.live || Stream.connecting
                showLocalPip: !Stream.theatreMode
                stageFillMode: "cover"
            }

            Rectangle {
                anchors.fill: parent
                z: 10
                visible: Stream.connecting
                color: Qt.rgba(4/255, 4/255, 10/255, 0.9)

                Column {
                    anchors.centerIn: parent
                    spacing: 16

                    Rectangle {
                        width: 40; height: 40; radius: 20
                        color: "transparent"
                        border.color: Theme.gold
                        border.width: 2
                        RotationAnimation on rotation {
                            running: Stream.connecting
                            from: 0; to: 360; duration: 1000; loops: Animation.Infinite
                        }
                    }
                    Text {
                        text: Stream.loaderText.length ? Stream.loaderText : "CONNECTING TO ENGINE…"
                        color: Theme.gold
                        font.family: Theme.fontMono
                        font.pixelSize: 11
                        font.letterSpacing: 1.5
                        SequentialAnimation on opacity {
                            running: Stream.connecting
                            loops: Animation.Infinite
                            NumberAnimation { from: 1; to: 0.4; duration: 750 }
                            NumberAnimation { from: 0.4; to: 1; duration: 750 }
                        }
                    }
                }
            }

            // AI LIVE / PAUSED badge
            Rectangle {
                visible: Stream.live
                anchors.top: parent.top
                anchors.left: parent.left
                anchors.margins: 12
                z: 6
                width: aiLab.implicitWidth + 18
                height: 24
                radius: 4
                color: Qt.rgba(4/255, 4/255, 10/255, 0.82)
                border.color: Qt.rgba(63/255, 232/255, 184/255, 0.22)

                Text {
                    id: aiLab
                    anchors.centerIn: parent
                    text: Stream.paused ? "⏸ PAUSED" : "◈ AI LIVE"
                    color: Theme.teal
                    font.family: Theme.fontMono
                    font.pixelSize: 9
                    font.letterSpacing: 2
                }
            }

            // Connection quality HUD
            Rectangle {
                visible: Stream.live && Stream.connectionQuality !== "—"
                anchors.top: parent.top
                anchors.left: parent.left
                anchors.leftMargin: 110
                anchors.topMargin: 12
                z: 6
                width: qLab.implicitWidth + 18
                height: 24
                radius: 4
                color: Qt.rgba(4/255, 4/255, 10/255, 0.82)
                border.color: Theme.goldDim

                Text {
                    id: qLab
                    anchors.centerIn: parent
                    text: Stream.connectionQuality + "  " + Stream.latencyText
                    color: Theme.gold
                    font.family: Theme.fontMono
                    font.pixelSize: 9
                }
            }

            // Fullscreen toggle (top-right)
            Rectangle {
                visible: !cleanMode
                anchors.top: parent.top
                anchors.right: parent.right
                anchors.margins: 12
                z: 7
                width: 34; height: 34
                radius: 7
                color: Qt.rgba(4/255, 4/255, 10/255, 0.82)
                border.color: Qt.rgba(255, 255, 255, 0.1)

                Text {
                    anchors.centerIn: parent
                    text: previewWindow.fullscreen ? "⛶" : "⛶"
                    color: Theme.dim
                    font.pixelSize: 15
                }
                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: previewWindow.fullscreen = !previewWindow.fullscreen
                }
            }
        }

        // Footer bar (hidden in clean mode)
        Rectangle {
            id: footer
            visible: !cleanMode
            anchors.bottom: parent.bottom
            width: parent.width
            height: 36
            color: Theme.s1
            border.color: Theme.border
            border.width: 1

            Row {
                anchors.fill: parent
                anchors.margins: 12
                spacing: 12

                Text {
                    text: qsTr("Live Escape Live Preview — 1280x720")
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 9
                    verticalAlignment: Text.AlignVCenter
                }

                Item { Layout.fillWidth: true }

                Text {
                    text: qsTr("Built by TheTools Hub · Powered by Lucy 2")
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 9
                    verticalAlignment: Text.AlignVCenter
                }

                Text { text: "|"; color: Theme.dim; font.family: Theme.fontMono; font.pixelSize: 9; verticalAlignment: Text.AlignVCenter }

                Button {
                    padding: 0
                    background: Rectangle {
                        anchors.fill: parent
                        color: "transparent"
                    }
                    contentItem: Text {
                        text: qsTr("Support")
                        color: Theme.gold
                        font.family: Theme.fontMono
                        font.pixelSize: 9
                        horizontalAlignment: Text.AlignHCenter
                        verticalAlignment: Text.AlignVCenter
                    }
                    onClicked: App.openExternal("https://t.me/liveescapeapp")
                }
            }
        }
    }

    // Clean mode toggle (Ctrl+Shift+C)
    Shortcut {
        sequence: "Ctrl+Shift+C"
        onActivated: {
            cleanMode = !cleanMode
        }
    }

    // Fullscreen toggle (F11)
    Shortcut {
        sequence: "F11"
        onActivated: {
            fullscreen = !fullscreen
            visibility = fullscreen ? Window.FullScreen : Window.Windowed
        }
    }

    onFullscreenChanged: {
        visibility = fullscreen ? Window.FullScreen : Window.Windowed
    }

    Connections {
        target: Stream
        function onTheatreChanged() {
            previewWindow.visible = Stream.theatreMode
        }
    }
}