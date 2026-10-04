import QtQuick
import SmokeScreen

// #preloader — exact port of dashboard.html CSS:
//   fixed, inset 0, z 9999, bg var(--bg), flex column center, gap 28px
//   .preloader-logo = .preloader-gem (60×60, 135deg gold→#d4a017→teal, radius 16,
//       rotate 45°, glow 0 0 40px rgba(232,197,71,.35)+0 0 80px rgba(63,232,184,.15))
//     + .preloader-ring (inset −6px, 2px, top gold / right teal, 1.6s linear rotate)
//     — both pulse (preloaderPulse 2.4s ease-in-out infinite: scale 1→1.08, opacity .85→1)
//   .preloader-title = Rajdhani 22px/700 ls 6px "SMOKE <gold>SCREEN</gold>"
//   .preloader-dots = 3× 8px gold circles, dotBounce 1.4s (delays 0/.16/.32s)
//   .preloader-sub = mono 9px --dim ls 2px "INITIALIZING…"
Item {
    anchors.fill: parent

    Rectangle { anchors.fill: parent; color: Theme.bg }

    Column {
        anchors.centerIn: parent
        spacing: 28

        // .preloader-logo (gem + ring + shared pulse)
        Item {
            width: 72
            height: 72

            // preloaderPulse: scale 1→1.08, opacity .85→1 (2.4s ease-in-out infinite)
            SequentialAnimation on scale {
                loops: Animation.Infinite
                NumberAnimation { to: 1.08; duration: 1200; easing.type: Easing.InOutQuad }
                NumberAnimation { to: 1.0; duration: 1200; easing.type: Easing.InOutQuad }
            }
            SequentialAnimation on opacity {
                loops: Animation.Infinite
                NumberAnimation { to: 1.0; duration: 1200; easing.type: Easing.InOutQuad }
                NumberAnimation { to: 0.85; duration: 1200; easing.type: Easing.InOutQuad }
            }

            // .preloader-gem — 60×60 centered, gradient, radius 16, rotated 45°
            Rectangle {
                anchors.centerIn: parent
                width: 60
                height: 60
                radius: 16
                rotation: 45
                gradient: Gradient {
                    GradientStop { position: 0.0; color: Theme.gold }
                    GradientStop { position: 0.5; color: Theme.goldDeep }
                    GradientStop { position: 1.0; color: Theme.teal }
                }
                // box-shadow: 0 0 40px rgba(232,197,71,.35), 0 0 80px rgba(63,232,184,.15)
                Rectangle {
                    anchors.centerIn: parent
                    anchors.margins: -10
                    width: parent.width + 20
                    height: parent.height + 20
                    radius: parent.radius + 10
                    color: "transparent"
                    z: -1
                    border.width: 8
                    border.color: Qt.rgba(232/255, 197/255, 71/255, 0.12)
                }
            }

            // .preloader-ring — inset −6px → 72×72, 2px top gold / right teal, 1.6s linear
            Rectangle {
                anchors.centerIn: parent
                width: 72
                height: 72
                radius: 36
                color: "transparent"
                border.width: 2
                border.color: Theme.gold
                SequentialAnimation on rotation {
                    loops: Animation.Infinite
                    NumberAnimation { from: 0; to: 360; duration: 1600 }
                }
                // right quarter tinted teal (border-top gold + border-right teal)
                Rectangle {
                    anchors.top: parent.top
                    anchors.right: parent.right
                    width: parent.width / 2
                    height: parent.height / 2
                    color: "transparent"
                    border.width: 2
                    border.color: Theme.teal
                    radius: 2
                }
            }
        }

        // .preloader-title — 22px/700 ls 6px, SCREEN in gold
        Row {
            spacing: 6
            anchors.horizontalCenter: parent.horizontalCenter
            Text {
                text: qsTr("SMOKE")
                color: Theme.text
                font.family: Theme.fontUi
                font.pixelSize: 22
                font.weight: Font.Bold
                font.letterSpacing: 6
            }
            Text {
                text: qsTr("SCREEN")
                color: Theme.gold
                font.family: Theme.fontUi
                font.pixelSize: 22
                font.weight: Font.Bold
                font.letterSpacing: 6
            }
        }

        // .preloader-dots — 3× 8px gold, dotBounce 1.4s staggered .16/.32
        Row {
            spacing: 8
            anchors.horizontalCenter: parent.horizontalCenter

            Repeater {
                model: 3

                Rectangle {
                    width: 8
                    height: 8
                    radius: 4
                    color: Theme.gold
                    // dotBounce: 0%,80%,100% scale(0) → 40% scale(1)
                    SequentialAnimation on scale {
                        loops: Animation.Infinite
                        PauseAnimation { duration: 1400 * (index / 3) } // stagger 0/.16/.32 ≈ phase shift
                        NumberAnimation { to: 0; duration: 0 }
                        NumberAnimation { to: 1; duration: 560; easing.type: Easing.InOutQuad }
                        NumberAnimation { to: 0; duration: 840; easing.type: Easing.InOutQuad }
                    }
                }
            }
        }

        // .preloader-sub
        Text {
            anchors.horizontalCenter: parent.horizontalCenter
            text: qsTr("INITIALIZING…")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 9
            font.letterSpacing: 2
        }
    }
}
