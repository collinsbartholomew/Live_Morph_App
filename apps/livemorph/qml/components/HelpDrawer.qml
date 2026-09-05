import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

Rectangle {
    id: root
    property bool open: false
    width: 380
    anchors.top: parent.top
    anchors.bottom: parent.bottom
    anchors.right: parent.right
    color: Colors.surfaceOverlay
    border.color: Colors.surfaceBorder
    visible: open || x < parent.width - 1
    x: open ? (parent.width - width) : parent.width
    z: 120
    Behavior on x { NumberAnimation { duration: Theme.motionNormal; easing.type: Easing.OutCubic } }

    Rectangle {
        anchors.left: parent.left
        anchors.top: parent.top
        anchors.bottom: parent.bottom
        width: 1
        color: Colors.surfaceBorder
    }

    ColumnLayout {
        anchors.fill: parent
        spacing: 0

        Rectangle {
            Layout.fillWidth: true
            height: 52
            color: Colors.surfaceRaised
            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 16
                anchors.rightMargin: 8
                Text {
                    text: qsTr("Help & shortcuts")
                    color: Colors.textPrimary
                    font.pixelSize: 15
                    font.weight: Font.DemiBold
                    Layout.fillWidth: true
                }
                IconButton { name: "x"; onClicked: root.open = false }
            }
        }

        Flickable {
            Layout.fillWidth: true
            Layout.fillHeight: true
            contentHeight: helpCol.implicitHeight + 40
            clip: true
            boundsBehavior: Flickable.StopAtBounds

            Column {
                id: helpCol
                width: parent.width
                padding: 16
                spacing: 16

                Text { text: qsTr("Quick start"); color: Colors.accent; font.weight: Font.DemiBold; font.pixelSize: 12 }
                Text {
                    width: parent.width - 32
                    text: "1. Sign in with an email code (OTP) with LiveMorph\n2. Allow camera access and start the camera\n3. Pick a character from the Workshop\n4. Press Start LiveMorph — Stage runs native WebRTC (GStreamer) in-app\n5. Optionally use the OBS stream server or virtual camera for your broadcast"
                    color: Colors.textSecondary; font.pixelSize: 12; wrapMode: Text.WordWrap; lineHeight: 1.4
                }

                Text { text: qsTr("Stage & morph"); color: Colors.accent; font.weight: Font.DemiBold; font.pixelSize: 12 }
                Text {
                    width: parent.width - 32
                    text: "LiveMorph streams realtime video through the LiveMorph signaling proxy to Decart/Lucy — no external browser. Identity lock and HD tier adjust session quality. Mirror flips the local camera preview."
                    color: Colors.textSecondary; font.pixelSize: 12; wrapMode: Text.WordWrap; lineHeight: 1.4
                }

                Text { text: qsTr("Workshop"); color: Colors.accent; font.weight: Font.DemiBold; font.pixelSize: 12 }
                Text {
                    width: parent.width - 32
                    text: "Browse the character catalog, filter by category, or commit a custom prompt / scene. The active character is applied when a morph session connects."
                    color: Colors.textSecondary; font.pixelSize: 12; wrapMode: Text.WordWrap; lineHeight: 1.4
                }

                Text { text: qsTr("Stream & virtual camera (optional)"); color: Colors.accent; font.weight: Font.DemiBold; font.pixelSize: 12 }
                Text {
                    width: parent.width - 32
                    text: "Live sessions use realtime peer-to-peer media. The built-in MJPEG stream server mirrors the morph output to OBS (browser source) and, on Linux, a v4l2 loopback virtual camera. Stage controls start/stop these outputs."
                    color: Colors.textSecondary; font.pixelSize: 12; wrapMode: Text.WordWrap; lineHeight: 1.4
                }

                Text { text: qsTr("Credits"); color: Colors.accent; font.weight: Font.DemiBold; font.pixelSize: 12 }
                Text {
                    width: parent.width - 32
                    text: "LiveMorph sessions consume credits in real time (rate on the action bar). Bonus credits are used first. Buy packs from the top bar — checkout opens in your system browser. Use Recheck if credits are delayed."
                    color: Colors.textSecondary; font.pixelSize: 12; wrapMode: Text.WordWrap; lineHeight: 1.4
                }

                Text { text: qsTr("Keyboard"); color: Colors.accent; font.weight: Font.DemiBold; font.pixelSize: 12 }
                Text {
                    width: parent.width - 32
                    text: "F12 — toggle recording\nCtrl+P — Preview window\nCtrl+Shift+P — Popout overlay\nEsc — close drawers / modals / tour"
                    color: Colors.textSecondary; font.pixelSize: 12; wrapMode: Text.WordWrap; lineHeight: 1.4
                    font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                }

                Text { text: qsTr("Backend"); color: Colors.accent; font.weight: Font.DemiBold; font.pixelSize: 12 }
                Text {
                    width: parent.width - 32
                    text: "Sign-in, catalog, payments, and sessions require the Rust API. Set the base URL in Settings or via the LIVEMORPH_API_URL environment variable."
                    color: Colors.textSecondary; font.pixelSize: 12; wrapMode: Text.WordWrap; lineHeight: 1.4
                }

                Text { text: qsTr("Support"); color: Colors.accent; font.weight: Font.DemiBold; font.pixelSize: 12 }
                Row {
                    spacing: 8
                    GhostButton { text: "Terms"; onClicked: Backend.openExternal("https://livemorph.com/terms") }
                    GhostButton { text: "Privacy"; onClicked: Backend.openExternal("https://livemorph.com/privacy") }
                    GhostButton { text: "Contact"; onClicked: Backend.openExternal("https://livemorph.com/support") }
                }
            }
        }
    }
}
