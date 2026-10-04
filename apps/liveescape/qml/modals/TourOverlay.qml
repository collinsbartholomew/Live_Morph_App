import QtQuick
import QtQuick.Controls
import Qt5Compat.GraphicalEffects
import LiveEscape

Item {
    id: tourRoot
    anchors.fill: parent
    visible: App.showTour
    z: 9500

    property var dashboard: null
    property int step: App.tourStep

    readonly property int totalSteps: 13

    function findChildRecursive(parent, name) {
        if (!parent) return null;
        if (parent.objectName === name) return parent;
        for (var i = 0; i < parent.children.length; i++) {
            var result = findChildRecursive(parent.children[i], name);
            if (result) return result;
        }
        return null;
    }

    property var targetItem: null
    property real targetX: 0
    property real targetY: 0
    property real targetW: 0
    property real targetH: 0

    function resolveTarget() {
        if (step < 1 || step > totalSteps || !dashboard) {
            targetItem = null; targetX = 0; targetY = 0; targetW = 0; targetH = 0;
            return;
        }
        var s = steps[step - 1];
        var item = findChildRecursive(dashboard, s.target);
        if (item) {
            targetItem = item;
            var p = item.mapToItem(tourRoot, 0, 0);
            targetX = p.x; targetY = p.y; targetW = item.width; targetH = item.height;
        } else {
            targetItem = null; targetX = 0; targetY = 0; targetW = 0; targetH = 0;
        }
    }

    function positionTooltip() {
        if (step < 1 || step > totalSteps || !targetItem) return;
        var s = steps[step - 1];
        var pad = 14, margin = 14;
        var rw = tourTooltip.width, rh = tourTooltip.height;
        var vw = tourRoot.width, vh = tourRoot.height;
        var px = 0, py = 0;

        if (s.pos === "bottom")      { px = targetX + targetW / 2 - rw / 2; py = targetY + targetH + pad + margin; }
        else if (s.pos === "top")    { px = targetX + targetW / 2 - rw / 2; py = targetY - pad - margin - rh; }
        else if (s.pos === "right")  { px = targetX + targetW + pad + margin; py = targetY + targetH / 2 - rh / 2; }
        else                         { px = targetX - pad - margin - rw; py = targetY + targetH / 2 - rh / 2; }

        tourTooltip.x = Math.max(8, Math.min(vw - rw - 8, px));
        tourTooltip.y = Math.max(8, Math.min(vh - rh - 8, py));

        if (s.pos === "bottom")      { tooltipArrow.x = targetX + targetW / 2 - 5; tooltipArrow.y = tourTooltip.y - 6; tooltipArrow.rotation = 45; }
        else if (s.pos === "top")    { tooltipArrow.x = targetX + targetW / 2 - 5; tooltipArrow.y = tourTooltip.y + rh - 4; tooltipArrow.rotation = 225; }
        else if (s.pos === "right")  { tooltipArrow.x = tourTooltip.x - 6; tooltipArrow.y = targetY + targetH / 2 - 5; tooltipArrow.rotation = 315; }
        else                         { tooltipArrow.x = tourTooltip.x + rw - 4; tooltipArrow.y = targetY + targetH / 2 - 5; tooltipArrow.rotation = 135; }
    }

    onStepChanged: { resolveTarget(); if (step > 0) positionTooltip(); }
    onDashboardChanged: resolveTarget()

    readonly property var steps: [
        { t: "Dashboard Header", d: "This is your main control bar. It shows your connection status, live credit meter, and quick-action buttons for recording, snapshots, and account access.", target: "topBar", pos: "bottom" },
        { t: "Credit Meter", d: "This shows how many credits you've used and how many remain in your current plan. Credits are consumed while the AI engine is running live.", target: "meterBlock", pos: "bottom" },
        { t: "Tutorial Button", d: "Click this button anytime to restart this guided tour. It's always available in the header so you can revisit any feature explanation.", target: "tourBtn", pos: "bottom" },
        { t: "Account & Profile", d: "Access your account details, device ID, license status, referral code, and sign-out option here. Creator plan holders can also set up payout details.", target: "accountBtn", pos: "bottom" },
        { t: "AI Output Stage", d: "This is where your live AI-transformed video appears. The output updates in real time as the AI processes your camera feed with the selected style or face swap.", target: "stageFrame", pos: "top" },
        { t: "Webcam Preview", d: "Your raw camera input is shown here as a picture-in-picture overlay. This lets you compare your original feed with the AI-transformed output side by side.", target: "stageFrame", pos: "top" },
        { t: "Camera & Mode", d: "Select your camera device and choose between Style mode (full AI transformation) or Face Swap mode (swap your face with a reference image). Upload a reference photo when in Face Swap mode.", target: "modeToggle", pos: "right" },
        { t: "Connect / Stop", d: "Press CONNECT to start the AI engine and begin your live transformation. Press STOP to end the session. The BACKGROUND button lets you apply live scene presets.", target: "connectBtn", pos: "right" },
        { t: "Background & Style", d: "Type what you want to see — a background, an outfit, a cap, anything — and it changes live. For example, try 'cozy coffee shop background' or 'red baseball cap'. Enable Live Update to apply changes as you type.", target: "promptArea", pos: "right" },
        { t: "Style Presets", d: "Quick-tap presets let you apply popular transformations instantly without typing a prompt. Your recent prompts also appear below so you can reuse past styles.", target: "presetsFlow", pos: "right" },
        { t: "Quality & Latency", d: "Choose between High, Balanced, or Performance quality modes to balance output fidelity against stream latency. Your current output latency is shown next to this selector.", target: "qualSelector", pos: "left" },
        { t: "Session Balance", d: "Track your plan total, credits used, and credits remaining for this session. The progress bar gives a visual overview of your credit consumption.", target: "balanceCol", pos: "left" },
        { t: "Telegram Support", d: "Join our Telegram community for real-time support, update announcements, and tips. Contact us anytime at @liveescapeapp.", target: "accountBtn", pos: "bottom" }
    ]

    Rectangle { anchors.fill: parent; color: Theme.scrim }

    // ── HIGHLIGHT ──
    Rectangle {
        id: tourHighlight
        visible: tourRoot.step > 0 && targetItem !== null
        color: "transparent"
        border.color: Theme.gold
        border.width: 2
        radius: 8
        x: targetX - 6
        y: targetY - 6
        width: targetW + 12
        height: targetH + 12
        layer.enabled: visible
        layer.effect: DropShadow {
            radius: 16
            color: Qt.rgba(240 / 255, 168 / 255, 48 / 255, 0.45)
            horizontalOffset: 0
            verticalOffset: 0
            spread: 0.2
        }
        Behavior on x      { NumberAnimation { duration: 280; easing.type: Easing.OutCubic } }
        Behavior on y      { NumberAnimation { duration: 280; easing.type: Easing.OutCubic } }
        Behavior on width  { NumberAnimation { duration: 280; easing.type: Easing.OutCubic } }
        Behavior on height { NumberAnimation { duration: 280; easing.type: Easing.OutCubic } }
    }

    // ── INTRO MODAL (step 0) ──
    Rectangle {
        anchors.centerIn: parent
        width: Math.min(parent.width * 0.9, 380)
        implicitHeight: introCol.implicitHeight + 48
        radius: Theme.radiusXl
        color: Theme.glass
        border.color: Theme.goldDim
        border.width: 1
        visible: tourRoot.step === 0

        Column {
            id: introCol
            anchors.centerIn: parent
            width: parent.width - 48
            spacing: 12

            Text { text: "🗺️"; font.pixelSize: 36; anchors.horizontalCenter: parent.horizontalCenter }
            Text { text: "DASHBOARD TOUR"; color: Theme.gold; font.family: Theme.fontMono; font.pixelSize: 8; font.letterSpacing: 3; anchors.horizontalCenter: parent.horizontalCenter }
            Text { width: parent.width; wrapMode: Text.WordWrap; horizontalAlignment: Text.AlignHCenter; text: "Are you Ready to Take a Tour of your Dashboard?"; color: Theme.text; font.family: Theme.fontUi; font.pixelSize: 16; font.bold: true }
            Text { width: parent.width; wrapMode: Text.WordWrap; horizontalAlignment: Text.AlignHCenter; text: "We'll walk you through 13 key features in under 2 minutes."; color: Theme.dim; font.family: Theme.fontMono; font.pixelSize: 10; lineHeight: 1.6 }
            Row { anchors.horizontalCenter: parent.horizontalCenter; spacing: 10
                GhostButton { text: "← Back"; onClicked: App.closeTour() }
                GoldButton  { text: "Proceed →"; onClicked: App.nextTourStep() }
            }
        }
    }

    // ── STEP TOOLTIP (step > 0) ──
    Rectangle {
        id: tourTooltip
        visible: tourRoot.step > 0 && targetItem !== null
        width: Math.min(Math.max(ttipCol.implicitWidth + 36, 220), 300)
        implicitHeight: ttipCol.implicitHeight + 28
        radius: 10
        color: "#0d0d18"
        border.color: Qt.rgba(240 / 255, 168 / 255, 48 / 255, 0.5)
        border.width: 1

        Column {
            id: ttipCol
            anchors.left: parent.left; anchors.right: parent.right; anchors.top: parent.top
            anchors.margins: 14
            spacing: 6

            Text { text: tourRoot.step + "/" + tourRoot.totalSteps; color: Theme.gold; font.family: Theme.fontMono; font.pixelSize: 8; font.letterSpacing: 2 }
            Text { width: parent.width; wrapMode: Text.WordWrap; text: tourRoot.step >= 1 && tourRoot.step <= totalSteps ? steps[tourRoot.step - 1].t : ""; color: Theme.text; font.family: Theme.fontUi; font.pixelSize: 13; font.bold: true; font.letterSpacing: 1 }
            Text { width: parent.width; wrapMode: Text.WordWrap; text: tourRoot.step >= 1 && tourRoot.step <= totalSteps ? steps[tourRoot.step - 1].d : ""; color: Theme.dim; font.family: Theme.fontMono; font.pixelSize: 10; lineHeight: 1.6 }
            Row { anchors.right: parent.right; spacing: 8
                GhostButton { text: "← Back"; onClicked: App.prevTourStep() }
                GoldButton { text: tourRoot.step >= totalSteps ? "Done ✓" : "Next →"; onClicked: App.nextTourStep() }
            }
        }
    }

    Rectangle {
        id: tooltipArrow
        visible: tourRoot.step > 0 && targetItem !== null
        width: 10; height: 10
        color: "#0d0d18"
        border.color: Qt.rgba(240 / 255, 168 / 255, 48 / 255, 0.5)
        border.width: 1
        rotation: 45
    }
}
