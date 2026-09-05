import QtQuick
import LiveEscape

Item {
    anchors.fill: parent
    visible: App.showTour
    z: 700

    readonly property var steps: [
        { t: "Welcome", d: "Live Escape turns your camera into a live AI face-swap stage. Five steps and you are ready." },
        { t: "Reference face", d: "Upload a clear face photo — this drives the swap when you connect." },
        { t: "Go live", d: "Press CONNECT to start a session. Credits burn only while you are live." },
        { t: "Style & OBS", d: "Describe a scene or pick presets. Use OBS mode for virtual camera output." },
        { t: "Credits & account", d: "Top up anytime from the plan gate. Manage device binding under Account." }
    ]

    Rectangle { anchors.fill: parent; color: Theme.scrim }

    Rectangle {
        width: Math.min(parent.width * 0.9, 380)
        implicitHeight: col.implicitHeight + 32
        anchors.centerIn: parent
        radius: Theme.radiusXl
        color: Theme.glass
        border.color: Theme.goldDim
        border.width: 1

        Column {
            id: col
            anchors.left: parent.left; anchors.right: parent.right; anchors.top: parent.top; anchors.margins: 20
            spacing: 12

            Text {
                text: (App.tourStep) + " / " + steps.length
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 10
            }
            Text {
                text: App.tourStep >= 1 && App.tourStep <= steps.length ? steps[App.tourStep - 1].t : ""
                color: Theme.gold
                font.family: Theme.fontUi
                font.pixelSize: 16
                font.bold: true
            }
            Text {
                width: parent.width
                wrapMode: Text.WordWrap
                text: App.tourStep >= 1 && App.tourStep <= steps.length ? steps[App.tourStep - 1].d : ""
                color: Theme.text
                font.family: Theme.fontMono
                font.pixelSize: 11
            }
            Row {
                spacing: 8
                width: parent.width
                GhostButton { text: "BACK"; onClicked: App.prevTourStep() }
                GhostButton { text: "SKIP"; onClicked: App.closeTour() }
                GoldButton {
                    text: App.tourStep >= steps.length ? "DONE ✓" : "NEXT →"
                    onClicked: App.nextTourStep()
                }
            }
        }
    }
}
