import QtQuick
import SmokeScreen

// #onboardingOverlay — z 610. Legacy 7-step walkthrough
// (welcome → camera → prompt → preview → credits → modes → ready).
// The reference retired this from the live boot path (plan onboarding + tour
// now own first-run); it remains reachable and skippable, as in the reference.
Item {
    id: root
    anchors.fill: parent
    visible: App.showOnboarding
    z: 610

    property int step: 0
    readonly property var steps: [
        { title: qsTr("Welcome to Smoke Screen"), body: qsTr("Real-time AI video transformation, right on your desktop. This quick walkthrough shows you the essentials.") },
        { title: qsTr("Your Camera"), body: qsTr("Pick your camera and choose STYLE mode (describe a look) or FACE SWAP mode (use a reference photo).") },
        { title: qsTr("Describe the Scene"), body: qsTr("Type a prompt like 'cozy coffee shop background' or 'red baseball cap'. Enable Live Update to change it while streaming.") },
        { title: qsTr("Live Preview"), body: qsTr("Press CONNECT and your AI-transformed video appears on the stage in real time.") },
        { title: qsTr("Credits"), body: qsTr("Streaming consumes credits (120/minute). Always press STOP when you finish — billing runs only while live.") },
        { title: qsTr("Modes & Presets"), body: qsTr("Switch modes, tap presets, and use FREEZE or SNAPSHOT for static overlays while you adjust your scene.") },
        { title: qsTr("You're Ready"), body: qsTr("That's everything. Restart this walkthrough anytime from TUTORIALS, or take the full dashboard tour.") }
    ]

    Rectangle {
        anchors.fill: parent
        color: Qt.rgba(4/255, 4/255, 10/255, 0.97)
    }

    Rectangle {
        anchors.centerIn: parent
        width: Math.min(parent.width - 48, 480)
        height: cardCol.implicitHeight + 72
        radius: 16
        color: Theme.s1
        border.width: 1
        border.color: Theme.goldD

        Column {
            id: cardCol
            anchors.centerIn: parent
            width: parent.width - 80
            spacing: 12

            Text {
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                text: qsTr("STEP %1 OF %2").arg(root.step + 1).arg(root.steps.length)
                color: Theme.gold
                font.family: Theme.fontMono
                font.pixelSize: 9
                font.letterSpacing: 2
            }
            Text {
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                text: root.steps[root.step].title
                color: "#ffffff"
                font.family: Theme.fontUi
                font.pixelSize: 28
                font.weight: Font.Bold
                lineHeight: 1.2
                wrapMode: Text.WordWrap
            }
            Text {
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                text: root.steps[root.step].body
                color: Theme.dim
                font.family: Theme.fontUi
                font.pixelSize: 13
                lineHeight: 1.7
                wrapMode: Text.WordWrap
            }
            Row {
                anchors.horizontalCenter: parent.horizontalCenter
                spacing: 6
                Repeater {
                    model: root.steps.length
                    Rectangle {
                        width: 6
                        height: 6
                        radius: 3
                        color: index <= root.step ? Theme.gold : Theme.border
                    }
                }
            }
            Rectangle {
                width: parent.width
                height: 40
                radius: 8
                color: Theme.gold
                Text {
                    anchors.centerIn: parent
                    text: root.step >= root.steps.length - 1 ? qsTr("FINISH") : qsTr("NEXT")
                    color: Theme.bg
                    font.family: Theme.fontUi
                    font.pixelSize: 13
                    font.weight: Font.Bold
                    font.letterSpacing: 1
                }
                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: {
                        if (root.step >= root.steps.length - 1)
                            App.completeOnboarding()
                        else
                            root.step++
                    }
                }
            }
            Rectangle {
                width: parent.width
                height: 32
                radius: 8
                color: "transparent"
                border.width: 1
                border.color: Theme.border
                Text {
                    anchors.centerIn: parent
                    text: qsTr("SKIP")
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 10
                    font.letterSpacing: 1
                }
                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: App.completeOnboarding()
                }
            }
        }
    }
}
