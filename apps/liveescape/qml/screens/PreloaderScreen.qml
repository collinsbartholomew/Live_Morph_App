import LiveEscape
import QtQuick
import QtQuick.Layouts
import Qt5Compat.GraphicalEffects

Item {
    id: root

    Rectangle {
        anchors.fill: parent
        color: Theme.bg
    }

    ColumnLayout {
        anchors.centerIn: parent
        spacing: 28

        Item {
            width: 90
            height: 90
            Layout.alignment: Qt.AlignHCenter

            // Electron .preloader-gem glow: 0 0 40px rgba(232,197,71,.35),
            // 0 0 80px rgba(63,232,184,.15) — approximated with stacked soft rects
            Rectangle {
                id: glowOuter
                anchors.centerIn: gem
                width: gem.width + 26; height: gem.height + 26
                radius: gem.radius + 13
                color: "transparent"
                border.color: Qt.rgba(232/255, 197/255, 71/255, 0.14)
                border.width: 13
                rotation: 45
            }
            Rectangle {
                id: glowMid
                anchors.centerIn: gem
                width: gem.width + 14; height: gem.height + 14
                radius: gem.radius + 7
                color: "transparent"
                border.color: Qt.rgba(232/255, 197/255, 71/255, 0.3)
                border.width: 7
                rotation: 45
            }
            Rectangle {
                id: glowTeal
                anchors.centerIn: gem
                width: gem.width + 20; height: gem.height + 20
                radius: gem.radius + 10
                color: "transparent"
                border.color: Qt.rgba(63/255, 232/255, 184/255, 0.12)
                border.width: 10
                rotation: 45
            }

            // Glow pulse animation
            SequentialAnimation {
                running: Qt.application.state === Qt.ApplicationActive
                loops: Animation.Infinite
                ParallelAnimation {
                    NumberAnimation { target: glowOuter; property: "opacity"; from: 0.6; to: 1; duration: 1500; easing.type: Easing.InOutSine }
                    NumberAnimation { target: glowMid; property: "opacity"; from: 0.6; to: 1; duration: 1500; easing.type: Easing.InOutSine }
                    NumberAnimation { target: glowTeal; property: "opacity"; from: 0.6; to: 1; duration: 1500; easing.type: Easing.InOutSine }
                }
                ParallelAnimation {
                    NumberAnimation { target: glowOuter; property: "opacity"; from: 1; to: 0.6; duration: 1500; easing.type: Easing.InOutSine }
                    NumberAnimation { target: glowMid; property: "opacity"; from: 1; to: 0.6; duration: 1500; easing.type: Easing.InOutSine }
                    NumberAnimation { target: glowTeal; property: "opacity"; from: 1; to: 0.6; duration: 1500; easing.type: Easing.InOutSine }
                }
            }

            Rectangle {
                id: gem

                width: 60
                height: 60
                anchors.centerIn: parent
                radius: 16
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

            // Dual-color spinning ring (gold top half, teal right half) — matches Electron exactly
            Canvas {
                id: ringGlow
                anchors.fill: parent
                anchors.margins: -6
                opacity: 0.4
                layer.enabled: true
                layer.effect: GaussianBlur {
                    radius: 8
                    deviation: 4
                }
                renderStrategy: Canvas.Cooperative
                property real rotation: 0

                onPaint: {
                    var ctx = getContext("2d")
                    ctx.clearRect(0, 0, width, height)
                    ctx.save()
                    ctx.translate(width / 2, height / 2)
                    ctx.rotate(rotation * Math.PI / 180)

                    var radius = width / 2
                    var lineWidth = 4

                    ctx.beginPath()
                    ctx.arc(0, 0, radius - lineWidth / 2, -Math.PI / 2, Math.PI / 2)
                    ctx.strokeStyle = "#e8c547"
                    ctx.lineWidth = lineWidth
                    ctx.lineCap = "round"
                    ctx.stroke()

                    ctx.beginPath()
                    ctx.arc(0, 0, radius - lineWidth / 2, 0, Math.PI)
                    ctx.strokeStyle = "#3fe8b8"
                    ctx.lineWidth = lineWidth
                    ctx.lineCap = "round"
                    ctx.stroke()

                    ctx.restore()
                }

                Connections {
                    target: ringCanvas
                    function onRotationChanged() { ringGlow.rotation = ringCanvas.rotation; ringGlow.requestPaint() }
                }
            }

            Canvas {
                id: ringCanvas
                anchors.fill: parent
                anchors.margins: -6
                renderStrategy: Canvas.Cooperative
                property real rotation: 0

                onPaint: {
                    var ctx = getContext("2d")
                    ctx.clearRect(0, 0, width, height)
                    ctx.save()
                    ctx.translate(width / 2, height / 2)
                    ctx.rotate(rotation * Math.PI / 180)

                    var radius = width / 2
                    var lineWidth = 2

                    // Gold arc: top half (from -90 to 90 degrees in canvas coords = top)
                    ctx.beginPath()
                    ctx.arc(0, 0, radius - lineWidth / 2, -Math.PI / 2, Math.PI / 2)
                    ctx.strokeStyle = "#e8c547"
                    ctx.lineWidth = lineWidth
                    ctx.lineCap = "butt"
                    ctx.stroke()

                    // Teal arc: right half (from 0 to 180 degrees in rotated coords = right side)
                    ctx.beginPath()
                    ctx.arc(0, 0, radius - lineWidth / 2, 0, Math.PI)
                    ctx.strokeStyle = "#3fe8b8"
                    ctx.lineWidth = lineWidth
                    ctx.lineCap = "butt"
                    ctx.stroke()

                    ctx.restore()
                }

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
                    to: 1.08
                    duration: 1200
                    easing.type: Easing.InOutQuad
                }

                NumberAnimation {
                    to: 1
                    duration: 1200
                    easing.type: Easing.InOutQuad
                }

            }

            // Opacity pulse on gem (matching Electron preloaderPulse opacity .85→1)
            SequentialAnimation on opacity {
                running: Qt.application.state === Qt.ApplicationActive
                loops: Animation.Infinite
                NumberAnimation { from: 0.85; to: 1; duration: 1200; easing.type: Easing.InOutQuad }
                NumberAnimation { from: 1; to: 0.85; duration: 1200; easing.type: Easing.InOutQuad }
            }
        }

        Text {
            Layout.alignment: Qt.AlignHCenter
            textFormat: Text.RichText
            text: qsTr("LIVE <font color='#e8c547'>ESCAPE</font>")
            color: Theme.text
            font.family: Theme.fontUi
            font.pixelSize: 22
            font.bold: true
            font.letterSpacing: 6
        }

        Row {
            Layout.alignment: Qt.AlignHCenter
            spacing: 8

            Repeater {
                model: 3

                Rectangle {
                    width: 8
                    height: 8
                    radius: 4
                    color: Theme.gold
                    scale: 0

                    SequentialAnimation on scale {
                        running: Qt.application.state === Qt.ApplicationActive
                        loops: Animation.Infinite

                        PauseAnimation {
                            duration: index * 160
                        }

                        NumberAnimation {
                            from: 0; to: 1
                            duration: 560
                            easing.type: Easing.OutQuad
                        }

                        NumberAnimation {
                            from: 1; to: 0
                            duration: 560
                            easing.type: Easing.InQuad
                        }

                        PauseAnimation {
                            duration: (2 - index) * 160
                        }
                    }
                }
            }
        }

        Text {
            Layout.alignment: Qt.AlignHCenter
            text: qsTr("Initializing…")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 9
            font.letterSpacing: 2
        }

    }

}