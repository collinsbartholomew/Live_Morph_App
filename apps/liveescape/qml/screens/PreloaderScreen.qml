import LiveEscape
import QtQuick

Item {
    id: root

    Rectangle {
        anchors.fill: parent
        color: Theme.bg
    }

    Column {
        anchors.centerIn: parent
        spacing: 28

        Item {
            width: 90
            height: 90
            anchors.horizontalCenter: parent.horizontalCenter

            Rectangle {
                id: gem

                width: 60
                height: 60
                anchors.centerIn: parent
                radius: 14
                rotation: 45

                gradient: Gradient {
                    GradientStop {
                        position: 0
                        color: Theme.gold
                    }

                    GradientStop {
                        position: 0.5
                        color: "#d4a017"
                    }

                    GradientStop {
                        position: 1
                        color: Theme.teal
                    }

                }

            }

            // Spinning ring
            Rectangle {
                id: ring

                anchors.fill: parent
                anchors.margins: -6
                radius: width / 2
                color: "transparent"
                border.width: 2
                border.color: Theme.gold
                opacity: 0.7

                // clip to make partial ring feel
                SequentialAnimation on rotation {
                    running: Qt.application.state === Qt.ApplicationActive
                    loops: Animation.Infinite

                    NumberAnimation {
                        from: 0
                        to: 360
                        duration: 1600
                    }

                }

            }

            SequentialAnimation on scale {
                running: Qt.application.state === Qt.ApplicationActive
                loops: Animation.Infinite

                NumberAnimation {
                    to: 1.06
                    duration: 1200
                    easing.type: Easing.InOutQuad
                }

                NumberAnimation {
                    to: 1
                    duration: 1200
                    easing.type: Easing.InOutQuad
                }

            }

        }

        Text {
            anchors.horizontalCenter: parent.horizontalCenter
            textFormat: Text.RichText
            text: "LIVE <font color='#e8c547'>ESCAPE</font>"
            color: Theme.text
            font.family: Theme.fontUi
            font.pixelSize: 22
            font.bold: true
            font.letterSpacing: 6
        }

        Row {
            anchors.horizontalCenter: parent.horizontalCenter
            spacing: 8

            Repeater {
                model: 3

                Rectangle {
                    width: 8
                    height: 8
                    radius: 4
                    color: Theme.gold

                    SequentialAnimation on scale {
                        running: Qt.application.state === Qt.ApplicationActive
                        loops: Animation.Infinite

                        PauseAnimation {
                            duration: index * 160
                        }

                        NumberAnimation {
                            to: 0
                            duration: 400
                        }

                        NumberAnimation {
                            to: 1
                            duration: 400
                        }

                        PauseAnimation {
                            duration: (2 - index) * 160
                        }

                    }

                }

            }

        }

        Text {
            anchors.horizontalCenter: parent.horizontalCenter
            text: "INITIALIZING ENGINE"
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 9
            font.letterSpacing: 2
        }

    }

}
