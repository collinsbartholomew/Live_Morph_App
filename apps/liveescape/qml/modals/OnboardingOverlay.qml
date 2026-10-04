import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveEscape

ModalBase {
    id: root
    open: App.showOnboarding
    closeOnBackdrop: false

    property int step: 0
    onOpenChanged: if (open) step = 0

    // Auto-advance for steps with no user action (the live preview step
    // mirrors the Electron's 5s auto-stop cycle after the camera setup). It
    // stops whenever the user proceeds manually (which resets the timer).
    Timer {
        id: autoAdvanceTimer
        interval: 5000
        onTriggered: {
            if (step < steps.length - 1) {
                step++
            } else {
                App.completeOnboarding()
            }
        }
    }

    onStepChanged: {
        if (step >= 0 && step < steps.length && steps[step].action === null)
            autoAdvanceTimer.start()
        else
            autoAdvanceTimer.stop()
    }

    Component.onDestruction: autoAdvanceTimer.stop()

    readonly property var steps: [
        { label: "01 / 07", title: "Welcome to Live Escape",
          body: "Become anyone. Live. Let's get you set up in under 3 minutes.",
          action: "GET STARTED →" },
        { label: "02 / 07", title: "Camera Setup",
          body: "Your webcam is ready. You should see yourself below.",
          action: "LOOKS GOOD →" },
        { label: "03 / 07", title: "First Transformation",
          body: "We've pre-filled a prompt for you. Hit START to see the magic.",
          action: "START TRANSFORMATION →" },
        { label: "04 / 07", title: "Live Preview",
          body: "Watch the transformation happen in real time. Auto-stops in 5s.",
          action: null },
        { label: "05 / 07", title: "Your Credits",
          body: "Credits power your sessions. 2 credits = 1 second of streaming.",
          action: "NEXT →" },
        { label: "06 / 07", title: "Choose Your Mode",
          body: "Style Transfer transforms via a text prompt. Face Swap maps your face onto a reference photo.",
          action: "CONFIRM MODE →" },
        { label: "07 / 07", title: "You're Ready 🎉",
          body: "Setup complete. Hit the button below to start your first real session.",
          action: "START STREAMING →" }
    ]

    contentCol.spacing: 12

    // Dots
    Row {
        spacing: 6
        anchors.horizontalCenter: parent.horizontalCenter
        Repeater {
            model: steps.length
            Rectangle {
                width: 8; height: 8; radius: 4
                color: index === step ? Theme.gold : Theme.dim
            }
        }
    }

    // Step label
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: step >= 0 && step < steps.length ? steps[step].label : ""
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 10
    }

    // Title
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: step >= 0 && step < steps.length ? steps[step].title : ""
        color: Theme.gold
        font.family: Theme.fontUi
        font.pixelSize: 16
        font.bold: true
    }

    // Body
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        wrapMode: Text.WordWrap
        text: step >= 0 && step < steps.length ? steps[step].body : ""
        color: Theme.text
        font.family: Theme.fontMono
        font.pixelSize: 11
    }

    // Action button (only on steps that have one)
    GoldButton {
        width: parent.width
        visible: step >= 0 && step < steps.length && steps[step].action !== null
        text: step >= 0 && step < steps.length ? steps[step].action : ""
        onClicked: {
            if (step < steps.length - 1) {
                step++
            } else {
                App.completeOnboarding()
            }
        }
    }

    // Skip button
    GhostButton {
        width: parent.width
        text: "SKIP"
        onClicked: App.completeOnboarding()
    }
}
