import QtQuick
import QtQuick.Controls
import QtQuick.Window
import LiveEscape

Window {
    id: popoutWindow
    visible: false
    width: 480
    height: 300
    minimumWidth: 480
    minimumHeight: 300
    maximumWidth: 480
    maximumHeight: 300
    flags: Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint | Qt.Tool
    title: qsTr("Live Escape — Live Output")
    color: "#000000"

    property bool streamActive: false

    onVisibleChanged: {
        if (visible) {
            Stream.startMjpegServer(4789)
        } else {
            Stream.stopMjpegServer()
        }
    }

    Rectangle {
        anchors.fill: parent

        // Title bar
        Rectangle {
            id: titleBar
            height: 28
            width: parent.width
            color: Theme.s1
            border.color: Theme.border
            border.width: 1

            Row {
                anchors.fill: parent
                anchors.margins: 6
                spacing: 8

                Rectangle {
                    width: 8; height: 8; radius: 4
                    color: Theme.gold
                }
                Text {
                    text: qsTr("Live Escape Output")
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 9
                    font.letterSpacing: 1
                }
                Item { Layout.fillWidth: true }

                Button {
                    width: 24; height: 24
                    padding: 0
                    background: Rectangle {
                        anchors.fill: parent
                        radius: 4
                        color: "transparent"
                        border.color: hovered ? Theme.red : "transparent"
                        border.width: 1
                    }
                    contentItem: Text {
                        text: "✕"
                        color: hovered ? Theme.red : Theme.dim
                        font.family: Theme.fontMono
                        font.pixelSize: 10
                        horizontalAlignment: Text.AlignHCenter
                        verticalAlignment: Text.AlignVCenter
                    }
                    onClicked: popoutWindow.close()
                }
            }
            MouseArea {
                anchors.fill: parent
                hoverEnabled: true
                onPressed: popoutWindow.startSystemMove()
            }
        }

        // Stream canvas
        Rectangle {
            anchors.fill: parent
            anchors.topMargin: 28
            color: "#000000"

            DecartViewport {
                id: popoutViewport
                anchors.fill: parent
                anchors.margins: 2
                signalingWsUrl: Stream.signalingUrl
                userId: Session.userId
                accessKey: Session.accessKey
                model: "lucy-2.5"
                active: Stream.live || Stream.connecting
                showLocalPip: false
                stageFillMode: "cover"
            }

            Rectangle {
                anchors.fill: parent
                z: 10
                visible: Stream.connecting
                color: Qt.rgba(4/255, 4/255, 10/255, 0.9)

                Column {
                    anchors.centerIn: parent
                    spacing: 12

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

            // Waiting state
            Column {
                anchors.centerIn: parent
                spacing: 10
                visible: !Stream.live && !Stream.connecting

                Image {
                    source: "../icons/icon.png"
                    width: 64; height: 64
                    fillMode: Image.PreserveAspectFit
                }
                Text {
                    text: qsTr("Waiting for output")
                    color: Theme.dim
                    font.family: Theme.fontSans
                    font.pixelSize: 13
                }
                Text {
                    text: qsTr("Start a swap to begin")
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 9
                }
            }
        }
    }

    Connections {
        target: Stream
        function onTheatreChanged() {
            popoutWindow.visible = Stream.theatreMode
        }
    }
}