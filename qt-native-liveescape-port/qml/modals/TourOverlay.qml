import QtQuick
import SmokeScreen

// Tour system — exact reference 13-step copy (DASHBOARD_TOUR):
//   #tourModal (z 10001) intro card · #tourOverlay (z 9997) dim ·
//   #tourHighlight (z 9998, 2px gold + glow) · #tourTooltip (z 10000, #0d0d18)
Item {
    id: root
    anchors.fill: parent
    visible: App.showTour
    z: 9997

    // the dashboard instance (set by Main.qml) whose objectNames are targeted
    property var dashboard: null
    readonly property int step: App.tourStep   // 0 = intro, 1..13 = steps

    readonly property var tourSteps: [
        { title: "Dashboard Header", description: "This is your main control bar. It shows your connection status, live credit meter, and quick-action buttons for recording, snapshots, and account access.", target: "topBar", position: "bottom" },
        { title: "Credit Meter", description: "This shows how many credits you've used and how many remain in your current plan. Credits are consumed while the AI engine is running live.", target: "meterBlock", position: "bottom" },
        { title: "Tutorial Button", description: "Click this button anytime to restart this guided tour. It's always available in the header so you can revisit any feature explanation.", target: "tutorialBtn", position: "bottom" },
        { title: "Account & Profile", description: "Access your account details, device ID, license status, referral code, and sign-out option here. Creator plan holders can also set up payout details.", target: "accountBtn", position: "bottom" },
        { title: "AI Output Stage", description: "This is where your live AI-transformed video appears. The output updates in real time as the AI processes your camera feed with the selected style or face swap.", target: "stage", position: "top" },
        { title: "Webcam Preview", description: "Your raw camera input is shown here as a picture-in-picture overlay. This lets you compare your original feed with the AI-transformed output side by side.", target: "pip", position: "top" },
        { title: "Camera & Mode", description: "Select your camera device and choose between Style mode (full AI transformation) or Face Swap mode (swap your face with a reference image). Upload a reference photo when in Face Swap mode.", target: "camSel", position: "right" },
        { title: "Connect / Stop", description: "Press CONNECT to start the AI engine and begin your live transformation. Press STOP to end the session. The BACKGROUND button lets you apply live scene presets.", target: "connectBtn", position: "right" },
        { title: "Background & Style", description: "Type what you want to see — a background, an outfit, a cap, anything — and it changes live. For example, try 'cozy coffee shop background' or 'red baseball cap'. Enable Live Update to apply changes as you type.", target: "prompt", position: "right" },
        { title: "Style Presets", description: "Quick-tap presets let you apply popular transformations instantly without typing a prompt. Your recent prompts also appear below so you can reuse past styles.", target: "presets", position: "right" },
        { title: "Quality & Latency", description: "Choose between High, Balanced, or Performance quality modes to balance output fidelity against stream latency. Your current output latency is shown next to this selector.", target: "qualSel", position: "left" },
        { title: "Session Balance", description: "Track your plan total, credits used, and credits remaining for this session. The progress bar gives a visual overview of your credit consumption.", target: "balCol", position: "left" },
        { title: "Telegram Support", description: "Join our Telegram community for real-time support, update announcements, and tips. Tap the floating button anytime to reach the Smoke Screen support channel.", target: "tgSupportFloat", position: "top" }
    ]

    readonly property var currentStep: (step >= 1 && step <= tourSteps.length) ? tourSteps[step - 1] : null

    // recursive objectName lookup (no C++ findChild from QML)
    function findByName(item, name) {
        if (!item) return null
        if (item.objectName === name) return item
        const kids = item.children || []
        for (let i = 0; i < kids.length; i++) {
            const r = findByName(kids[i], name)
            if (r) return r
        }
        return null
    }

    readonly property var targetItem: currentStep && dashboard ? findByName(dashboard, currentStep.target) : null
    readonly property rect targetRect: {
        if (!targetItem) return Qt.rect(root.width / 2 - 100, root.height / 2 - 60, 200, 120)
        try {
            const p = targetItem.mapToItem(root, 0, 0)
            return Qt.rect(p.x, p.y, targetItem.width, targetItem.height)
        } catch (e) {
            return Qt.rect(root.width / 2 - 100, root.height / 2 - 60, 200, 120)
        }
    }

    // ── dim overlay (z 9997) ──
    Rectangle {
        anchors.fill: parent
        color: Qt.rgba(0, 0, 0, 0.72)
        visible: root.step >= 1
    }

    // ── highlight (z 9998) ──
    Rectangle {
        visible: root.step >= 1
        x: root.targetRect.x - 4
        y: root.targetRect.y - 4
        width: root.targetRect.width + 8
        height: root.targetRect.height + 8
        radius: 8
        color: "transparent"
        border.width: 2
        border.color: Theme.gold
        z: 9998
        Behavior on x { NumberAnimation { duration: 300; easing.type: Easing.OutCubic } }
        Behavior on y { NumberAnimation { duration: 300; easing.type: Easing.OutCubic } }
        Behavior on width { NumberAnimation { duration: 300; easing.type: Easing.OutCubic } }
        Behavior on height { NumberAnimation { duration: 300; easing.type: Easing.OutCubic } }
    }

    // ── intro modal (#tourModal, z 10001) ──
    Item {
        anchors.fill: parent
        visible: root.step === 0
        z: 10001
        Rectangle {
            anchors.fill: parent
            color: Qt.rgba(0, 0, 0, 0.8)
        }
        Rectangle {
            anchors.centerIn: parent
            width: Math.min(root.width * 0.92, 360)
            height: introCol.implicitHeight + 60
            radius: 14
            color: Theme.tooltipBg
            border.width: 1
            border.color: Qt.rgba(240/255, 168/255, 48/255, 0.45)
            Column {
                id: introCol
                anchors.centerIn: parent
                width: parent.width - 56
                spacing: 10
                Text {
                    width: parent.width
                    horizontalAlignment: Text.AlignHCenter
                    text: "🗺️"
                    font.pixelSize: 32
                }
                Text {
                    width: parent.width
                    horizontalAlignment: Text.AlignHCenter
                    text: qsTr("DASHBOARD TOUR")
                    color: Qt.rgba(240/255, 168/255, 48/255, 1)
                    font.family: Theme.fontMono
                    font.pixelSize: 8
                    font.letterSpacing: 3
                }
                Text {
                    width: parent.width
                    horizontalAlignment: Text.AlignHCenter
                    text: qsTr("Are you Ready to Take a Tour of your Dashboard?")
                    color: Theme.text
                    font.family: Theme.fontUi
                    font.pixelSize: 16
                    font.weight: Font.Bold
                    lineHeight: 1.4
                    wrapMode: Text.WordWrap
                }
                Text {
                    width: parent.width
                    horizontalAlignment: Text.AlignHCenter
                    text: qsTr("We'll walk you through 13 key features in under 2 minutes. You can skip anytime or restart the tour later from the TOUR button.")
                    color: Theme.dim2
                    font.family: Theme.fontMono
                    font.pixelSize: 10
                    lineHeight: 1.6
                    wrapMode: Text.WordWrap
                }
                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: 10
                    Rectangle {
                        width: backIntroTxt.implicitWidth + 28
                        height: 30
                        radius: 6
                        color: "transparent"
                        border.width: 1
                        border.color: Qt.rgba(240/255, 168/255, 48/255, 0.3)
                        Text {
                            id: backIntroTxt
                            anchors.centerIn: parent
                            text: qsTr("← Back")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 10
                        }
                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: App.closeTour()
                        }
                    }
                    Rectangle {
                        width: proceedTxt.implicitWidth + 32
                        height: 30
                        radius: 6
                        color: Qt.rgba(240/255, 168/255, 48/255, 1)
                        Text {
                            id: proceedTxt
                            anchors.centerIn: parent
                            text: qsTr("Proceed →")
                            color: Theme.goldInk
                            font.family: Theme.fontMono
                            font.pixelSize: 10
                            font.weight: Font.Bold
                        }
                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: App.nextTourStep()
                        }
                    }
                }
            }
        }
    }

    // ── tooltip (#tourTooltip, z 10000) ──
    Rectangle {
        id: tooltip
        visible: root.step >= 1 && root.currentStep !== null
        width: Math.max(220, Math.min(300, tooltipCol.implicitWidth + 36))
        height: tooltipCol.implicitHeight + 32
        color: Theme.tooltipBg
        border.width: 1
        border.color: Qt.rgba(240/255, 168/255, 48/255, 0.5)
        radius: 10
        z: 10000

        readonly property var pos: root.currentStep ? root.currentStep.position : "bottom"
        readonly property rect tr: root.targetRect
        x: {
            if (pos === "left") return Math.max(8, tr.x - width - 14)
            if (pos === "right") return Math.min(root.width - width - 8, tr.x + tr.width + 14)
            return Math.max(8, Math.min(root.width - width - 8, tr.x + tr.width / 2 - width / 2))
        }
        y: {
            if (pos === "top") return Math.max(8, tr.y - height - 14)
            if (pos === "bottom") return Math.min(root.height - height - 8, tr.y + tr.height + 14)
            return Math.max(8, Math.min(root.height - height - 8, tr.y + tr.height / 2 - height / 2))
        }
        Behavior on x { NumberAnimation { duration: 250; easing.type: Easing.OutCubic } }
        Behavior on y { NumberAnimation { duration: 250; easing.type: Easing.OutCubic } }

        Column {
            id: tooltipCol
            anchors.centerIn: parent
            width: parent.width - 36
            spacing: 6
            Text {
                text: root.step + "/" + root.tourSteps.length
                color: Qt.rgba(240/255, 168/255, 48/255, 1)
                font.family: Theme.fontMono
                font.pixelSize: 8
                font.letterSpacing: 2
            }
            Text {
                width: parent.width
                text: root.currentStep ? root.currentStep.title : ""
                color: Theme.text
                font.family: Theme.fontUi
                font.pixelSize: 13
                font.weight: Font.Bold
                font.letterSpacing: 1
            }
            Text {
                width: parent.width
                text: root.currentStep ? root.currentStep.description : ""
                color: Theme.dim2
                font.family: Theme.fontMono
                font.pixelSize: 10
                lineHeight: 1.6
                wrapMode: Text.WordWrap
            }
            Row {
                spacing: 8
                Rectangle {
                    width: prevTxt.implicitWidth + 24
                    height: 26
                    radius: 6
                    color: "transparent"
                    border.width: 1
                    border.color: Qt.rgba(240/255, 168/255, 48/255, 0.3)
                    Text {
                        id: prevTxt
                        anchors.centerIn: parent
                        text: qsTr("← Back")
                        color: Theme.dim
                        font.family: Theme.fontMono
                        font.pixelSize: 9
                    }
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: App.prevTourStep()
                    }
                }
                Rectangle {
                    width: nextTxt.implicitWidth + 28
                    height: 26
                    radius: 6
                    color: Qt.rgba(240/255, 168/255, 48/255, 1)
                    Text {
                        id: nextTxt
                        anchors.centerIn: parent
                        text: root.step >= root.tourSteps.length ? qsTr("Finish") : qsTr("Next →")
                        color: Theme.goldInk
                        font.family: Theme.fontMono
                        font.pixelSize: 9
                        font.weight: Font.Bold
                    }
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            if (root.step >= root.tourSteps.length)
                                App.closeTour()
                            else
                                App.nextTourStep()
                        }
                    }
                }
            }
        }
    }
}
