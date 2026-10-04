import QtQuick
import QtQuick.Controls
import SmokeScreen

// #accessGate — SCREEN 1, exact reference structure:
//   .access-box: 180deg s1→#0d0d1a, border rgba(232,197,71,.18), radius 24,
//                padding 52/56/48, max 820, gold top hairline
//   logo row (diamond mark + Smoke<em>Screen</em> + 1.8) · eyebrow "🔒 Annual License"
//   headline · sub · 3-step stepper (device / plan+pay / key) · notes
Item {
    id: root

    property string gatePlan: "creator"      // reference _gatePlan default
    property string gateMethod: "card"       // card | crypto
    property bool gateCryptoOpen: false

    // Reference gate plan definitions (backend prices merged when available)
    readonly property var gatePlans: {
        const defs = [
            { id: "starter", icon: "◆", name: "Starter", dollars: 20, credits: "300",
              desc: "Try the core engine",
              feats: ["Face Swap", "Recording / Snapshots", "Video Tutorials"] },
            { id: "creator", icon: "✦", name: "Creator", dollars: 75, credits: "500",
              desc: "Built for regular streamers", popular: true,
              feats: ["Everything in Starter", "Voice Changer", "Creator Program",
                      "15% Referral Commission", "Background Change"] },
            { id: "pro", icon: "♛", name: "Pro", dollars: 120, credits: "2,000",
              desc: "For power users & teams",
              feats: ["Everything in Creator", "1-on-1 Setup Call", "Priority Support"] }
        ]
        const src = App.activationPlans || []
        for (let i = 0; i < defs.length; i++) {
            for (let j = 0; j < src.length; j++) {
                if (src[j] && src[j].id === defs[i].id) {
                    if (Number(src[j].dollars) > 0) defs[i].dollars = Number(src[j].dollars)
                    if (Number(src[j].credits) > 0) defs[i].credits = String(Number(src[j].credits).toLocaleString())
                }
            }
        }
        return defs
    }

    readonly property real gatePlanDollars: {
        for (let i = 0; i < gatePlans.length; i++)
            if (gatePlans[i].id === root.gatePlan) return Number(gatePlans[i].dollars)
        return 0
    }

    // ── backdrop: radial gold at 50% -10% (same wash as auth) ──
    Rectangle { anchors.fill: parent; color: Theme.bg }
    Rectangle {
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        height: parent.height * 0.6
        gradient: Gradient {
            GradientStop { position: 0; color: Qt.rgba(232/255, 197/255, 71/255, 0.07) }
            GradientStop { position: 1; color: Qt.rgba(4/255, 4/255, 10/255, 0) }
        }
    }

    Flickable {
        anchors.fill: parent
        contentWidth: width
        contentHeight: accessBox.y + accessBox.height + 80
        clip: true

        // ── .access-box ──
        Rectangle {
            id: accessBox
            width: Math.min(parent.width * 0.92, 820)
            height: boxCol.implicitHeight + 100      // padding 52 top + 48 bottom
            anchors.horizontalCenter: parent.horizontalCenter
            y: 40
            radius: 24
            border.width: 1
            border.color: Qt.rgba(232/255, 197/255, 71/255, 0.18)
            gradient: Gradient {
                GradientStop { position: 0; color: Theme.s1 }
                GradientStop { position: 1; color: "#0d0d1a" }
            }

            // ::before — gold top hairline (10% insets, .6 opacity)
            Rectangle {
                anchors.top: parent.top
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.leftMargin: parent.width * 0.10
                anchors.rightMargin: parent.width * 0.10
                height: 1
                color: Theme.gold
                opacity: 0.6
            }

            Column {
                id: boxCol
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                anchors.leftMargin: 56
                anchors.rightMargin: 56
                anchors.topMargin: 52
                spacing: 0

                // ── logo row ──
                Row {
                    spacing: 14
                    bottomPadding: 28

                    // .access-logo-mark — 40×40 gradient diamond
                    Item {
                        width: 40
                        height: 40
                        anchors.verticalCenter: parent.verticalCenter
                        Rectangle {
                            anchors.centerIn: parent
                            width: 28
                            height: 28
                            radius: 9
                            rotation: 45
                            gradient: Gradient {
                                GradientStop { position: 0; color: Theme.gold }
                                GradientStop { position: 0.5; color: Theme.goldDeep }
                                GradientStop { position: 1; color: Theme.teal }
                            }
                        }
                    }

                    Text {
                        anchors.verticalCenter: parent.verticalCenter
                        textFormat: Text.RichText
                        text: qsTr("Smoke<font color='#e8c547'>Screen</font>")
                        color: Theme.text
                        font.family: Theme.fontUi
                        font.pixelSize: 20
                        font.weight: Font.Bold
                        font.letterSpacing: 3
                    }
                    Text {
                        anchors.verticalCenter: parent.verticalCenter
                        text: "1.8"
                        color: Theme.dim
                        font.family: Theme.fontMono
                        font.pixelSize: 10
                        font.letterSpacing: 1.5
                    }
                }

                // ── eyebrow ──
                Rectangle {
                    width: eyebrow.implicitWidth + 28
                    height: 28
                    radius: 20
                    color: Theme.goldG
                    border.width: 1
                    border.color: Theme.goldD
                    Text {
                        id: eyebrow
                        anchors.centerIn: parent
                        text: qsTr("🔒 Annual License")
                        color: Theme.gold
                        font.family: Theme.fontMono
                        font.pixelSize: 10
                        font.letterSpacing: 2.5
                    }
                }

                // ── headline + sub ──
                Text {
                    topPadding: 18
                    text: qsTr("Let's activate your account")
                    color: Theme.text
                    font.family: Theme.fontUi
                    font.pixelSize: 34
                    font.weight: Font.Black
                    font.letterSpacing: 0.3
                    bottomPadding: 10
                }
                Text {
                    width: parent.width * 0.85
                    text: qsTr("Pick a plan and pay below, or drop in a license key you already have. Either way, you'll be streaming in under a minute.")
                    color: Theme.dim2
                    font.family: Theme.fontUi
                    font.pixelSize: 15
                    lineHeight: 1.65
                    wrapMode: Text.WordWrap
                    bottomPadding: 36
                }

                // ── STEP 1: device ──
                Row {
                    width: parent.width
                    spacing: 14
                    bottomPadding: 26

                    // step number (31px gold gradient badge)
                    Rectangle {
                        width: 31
                        height: 31
                        radius: 15.5
                        gradient: Gradient {
                            GradientStop { position: 0; color: Theme.gold }
                            GradientStop { position: 1; color: Theme.goldDeep }
                        }
                        Text {
                            anchors.centerIn: parent
                            text: "1"
                            color: Theme.goldInk
                            font.family: Theme.fontUi
                            font.pixelSize: 13
                            font.weight: Font.Black
                        }
                    }

                    Column {
                        width: parent.width - 45
                        spacing: 4

                        Text {
                            text: qsTr("Confirm this device")
                            color: Theme.text
                            font.family: Theme.fontUi
                            font.pixelSize: 16
                            font.weight: Font.Bold
                        }
                        Text {
                            width: parent.width
                            text: qsTr("Your license is locked to one device so it can't be shared — this is the ID we'll attach it to.")
                            color: Theme.dim2
                            font.family: Theme.fontUi
                            font.pixelSize: 14
                            lineHeight: 1.6
                            wrapMode: Text.WordWrap
                        }

                        // .device-id-card
                        Rectangle {
                            width: parent.width
                            height: 76
                            radius: 12
                            color: Theme.s2
                            border.width: 1
                            border.color: Theme.border

                            Row {
                                anchors.left: parent.left
                                anchors.leftMargin: 20
                                anchors.verticalCenter: parent.verticalCenter
                                spacing: 16

                                Rectangle {
                                    width: 44
                                    height: 44
                                    radius: 10
                                    color: Theme.goldG
                                    border.width: 1
                                    border.color: Theme.goldD
                                    anchors.verticalCenter: parent.verticalCenter
                                    Text {
                                        anchors.centerIn: parent
                                        text: "🖥️"
                                        font.pixelSize: 19
                                    }
                                }

                                Column {
                                    anchors.verticalCenter: parent.verticalCenter
                                    spacing: 5
                                    Text {
                                        text: qsTr("YOUR DEVICE ID")
                                        color: Theme.dim
                                        font.family: Theme.fontMono
                                        font.pixelSize: 10
                                        font.letterSpacing: 1.5
                                    }
                                    Row {
                                        spacing: 8
                                        Text {
                                            text: App.deviceId()
                                            color: Theme.gold
                                            font.family: Theme.fontMono
                                            font.pixelSize: 18
                                            font.weight: Font.Bold
                                            font.letterSpacing: 1.5
                                            anchors.verticalCenter: parent.verticalCenter
                                        }
                                        Rectangle {
                                            width: copyDeviceTxt.implicitWidth + 20
                                            height: 22
                                            radius: 6
                                            color: Theme.goldG
                                            border.width: 1
                                            border.color: Theme.goldD
                                            anchors.verticalCenter: parent.verticalCenter
                                            Text {
                                                id: copyDeviceTxt
                                                anchors.centerIn: parent
                                                text: qsTr("COPY")
                                                color: Theme.gold
                                                font.family: Theme.fontMono
                                                font.pixelSize: 8
                                                font.letterSpacing: 1
                                            }
                                            MouseArea {
                                                anchors.fill: parent
                                                cursorShape: Qt.PointingHandCursor
                                                onClicked: App.copyToClipboard(App.deviceId())
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // ── STEP 2: plan & activate ──
                Row {
                    width: parent.width
                    spacing: 14
                    bottomPadding: 26

                    Rectangle {
                        width: 31
                        height: 31
                        radius: 15.5
                        gradient: Gradient {
                            GradientStop { position: 0; color: Theme.gold }
                            GradientStop { position: 1; color: Theme.goldDeep }
                        }
                        Text {
                            anchors.centerIn: parent
                            text: "2"
                            color: Theme.goldInk
                            font.family: Theme.fontUi
                            font.pixelSize: 13
                            font.weight: Font.Black
                        }
                    }

                    Column {
                        width: parent.width - 45
                        spacing: 4

                        Text {
                            text: qsTr("Choose a plan & activate")
                            color: Theme.text
                            font.family: Theme.fontUi
                            font.pixelSize: 16
                            font.weight: Font.Bold
                        }
                        Text {
                            width: parent.width
                            text: qsTr("A one-time payment unlocks a full year of access. Your key is generated automatically the moment payment is confirmed.")
                            color: Theme.dim2
                            font.family: Theme.fontUi
                            font.pixelSize: 14
                            lineHeight: 1.6
                            wrapMode: Text.WordWrap
                            bottomPadding: 8
                        }

                        // payment sub-panel
                        Rectangle {
                            width: parent.width
                            height: payCol.implicitHeight + 32
                            radius: 12
                            color: Theme.s2
                            border.width: 1
                            border.color: Qt.rgba(240/255, 168/255, 48/255, 0.15)

                            Column {
                                id: payCol
                                anchors.fill: parent
                                anchors.margins: 16
                                spacing: 12

                                Text {
                                    text: qsTr("SELECT YOUR PLAN")
                                    color: Theme.dim
                                    font.family: Theme.fontMono
                                    font.pixelSize: 9
                                    font.letterSpacing: 2
                                }

                                // plan tiles (1fr ×3)
                                Grid {
                                    width: parent.width
                                    columns: 3
                                    spacing: 10

                                    Repeater {
                                        model: root.gatePlans
                                        delegate: Rectangle {
                                            width: (payCol.width - 20) / 3
                                            height: 250
                                            radius: 16
                                            readonly property bool sel: root.gatePlan === modelData.id
                                            readonly property bool pop: modelData.popular === true
                                            gradient: Gradient {
                                                GradientStop { position: 0; color: Theme.s2 }
                                                GradientStop { position: 1; color: Theme.s1 }
                                            }
                                            border.width: 1
                                            border.color: sel ? Theme.gold
                                                              : pop ? Qt.rgba(232/255, 197/255, 71/255, 0.55)
                                                              : Theme.border

                                            MouseArea {
                                                anchors.fill: parent
                                                cursorShape: Qt.PointingHandCursor
                                                onClicked: root.gatePlan = modelData.id
                                            }

                                            Column {
                                                anchors.fill: parent
                                                anchors.margins: 16
                                                spacing: 6
                                                topPadding: pop ? 18 : 2

                                                Text {
                                                    anchors.horizontalCenter: parent.horizontalCenter
                                                    text: modelData.icon
                                                    color: Theme.gold
                                                    font.pixelSize: 24
                                                }
                                                Text {
                                                    anchors.horizontalCenter: parent.horizontalCenter
                                                    text: modelData.name
                                                    color: Theme.text
                                                    font.family: Theme.fontUi
                                                    font.pixelSize: 17
                                                    font.weight: Font.Black
                                                }
                                                Row {
                                                    anchors.horizontalCenter: parent.horizontalCenter
                                                    Text {
                                                        text: "$" + modelData.dollars
                                                        color: Theme.gold
                                                        font.family: Theme.fontUi
                                                        font.pixelSize: 32
                                                        font.weight: Font.Black
                                                    }
                                                }
                                                Text {
                                                    anchors.horizontalCenter: parent.horizontalCenter
                                                    text: modelData.credits + " credits"
                                                    color: Theme.dim2
                                                    font.family: Theme.fontMono
                                                    font.pixelSize: 11
                                                }
                                                Text {
                                                    width: parent.width
                                                    horizontalAlignment: Text.AlignHCenter
                                                    text: modelData.desc
                                                    color: Theme.dim
                                                    font.family: Theme.fontUi
                                                    font.pixelSize: 12
                                                    font.italic: true
                                                    wrapMode: Text.WordWrap
                                                }
                                                Rectangle {
                                                    width: parent.width
                                                    height: 1
                                                    color: Theme.border
                                                }
                                                Repeater {
                                                    model: modelData.feats
                                                    Row {
                                                        width: parent.width
                                                        spacing: 6
                                                        Text {
                                                            text: "✓"
                                                            color: Theme.goldInk
                                                            font.pixelSize: 9
                                                            font.weight: Font.Black
                                                            width: 15
                                                        }
                                                        Text {
                                                            width: parent.width - 21
                                                            text: modelData
                                                            color: Theme.text
                                                            font.family: Theme.fontUi
                                                            font.pixelSize: 12
                                                            wrapMode: Text.WordWrap
                                                        }
                                                    }
                                                }
                                            }

                                            // popular ribbon
                                            Rectangle {
                                                visible: pop
                                                anchors.top: parent.top
                                                anchors.left: parent.left
                                                anchors.right: parent.right
                                                height: 24
                                                radius: 0
                                                bottomLeftRadius: 10
                                                bottomRightRadius: 10
                                                gradient: Gradient {
                                                    GradientStop { position: 0; color: Theme.gold }
                                                    GradientStop { position: 1; color: Theme.goldDeep }
                                                }
                                                Text {
                                                    anchors.centerIn: parent
                                                    text: qsTr("MOST POPULAR")
                                                    color: Theme.goldInk
                                                    font.family: Theme.fontMono
                                                    font.pixelSize: 8
                                                    font.weight: Font.Bold
                                                    font.letterSpacing: 1.5
                                                }
                                            }
                                        }
                                    }
                                }

                                // method toggle
                                Rectangle {
                                    width: parent.width
                                    height: 46
                                    radius: 11
                                    color: Theme.s2
                                    border.width: 1
                                    border.color: Theme.border

                                    Row {
                                        anchors.fill: parent
                                        anchors.margins: 4
                                        spacing: 4

                                        Rectangle {
                                            width: (parent.width - 4) / 2
                                            height: parent.height
                                            radius: 8
                                            color: root.gateMethod === "card" ? Theme.gold : "transparent"
                                            Text {
                                                anchors.centerIn: parent
                                                text: qsTr("💳 Card / Transfer")
                                                color: root.gateMethod === "card" ? Theme.goldInk : Theme.dim
                                                font.family: Theme.fontUi
                                                font.pixelSize: 12
                                                font.weight: Font.Bold
                                            }
                                            MouseArea {
                                                anchors.fill: parent
                                                cursorShape: Qt.PointingHandCursor
                                                onClicked: root.gateMethod = "card"
                                            }
                                        }
                                        Rectangle {
                                            width: (parent.width - 4) / 2
                                            height: parent.height
                                            radius: 8
                                            color: root.gateMethod === "crypto" ? Theme.gold : "transparent"
                                            Text {
                                                anchors.centerIn: parent
                                                text: qsTr("₿ Crypto")
                                                color: root.gateMethod === "crypto" ? Theme.goldInk : Theme.dim
                                                font.family: Theme.fontUi
                                                font.pixelSize: 12
                                                font.weight: Font.Bold
                                            }
                                            MouseArea {
                                                anchors.fill: parent
                                                cursorShape: Qt.PointingHandCursor
                                                onClicked: root.gateMethod = "crypto"
                                            }
                                        }
                                    }
                                }

                                // card panel
                                Column {
                                    width: parent.width
                                    spacing: 8
                                    visible: root.gateMethod === "card"

                                    Rectangle {
                                        width: parent.width
                                        height: 40
                                        radius: 8
                                        visible: App.payStackEnabled
                                        color: Theme.gold
                                        Text {
                                            anchors.centerIn: parent
                                            text: qsTr("💳 PAY $%1 — PAYSTACK").arg(root.gatePlanDollars)
                                            color: Theme.bg
                                            font.family: Theme.fontUi
                                            font.pixelSize: 14
                                            font.weight: Font.Bold
                                            font.letterSpacing: 2
                                        }
                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: App.payActivation(root.gatePlan, "paystack")
                                        }
                                    }
                                    Rectangle {
                                        width: parent.width
                                        height: 40
                                        radius: 8
                                        visible: !App.payStackEnabled && App.payFlutterwaveEnabled
                                        gradient: Gradient {
                                            GradientStop { position: 0; color: "#fb8c00" }
                                            GradientStop { position: 1; color: "#f7d060" }
                                        }
                                        Text {
                                            anchors.centerIn: parent
                                            text: qsTr("🦋 PAY $%1 — FLUTTERWAVE").arg(root.gatePlanDollars)
                                            color: "#1a0a00"
                                            font.family: Theme.fontUi
                                            font.pixelSize: 14
                                            font.weight: Font.Bold
                                            font.letterSpacing: 2
                                        }
                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: App.payActivation(root.gatePlan, "flutterwave")
                                        }
                                    }
                                    Rectangle {
                                        width: parent.width
                                        height: 44
                                        radius: 8
                                        visible: !App.payStackEnabled && !App.payFlutterwaveEnabled
                                        color: Theme.s1
                                        border.width: 1
                                        border.color: Theme.border
                                        Text {
                                            anchors.centerIn: parent
                                            horizontalAlignment: Text.AlignHCenter
                                            text: qsTr("ONLINE PAYMENT UNAVAILABLE\nContact support below to activate.")
                                            color: Theme.dim
                                            font.family: Theme.fontMono
                                            font.pixelSize: 9
                                        }
                                    }
                                }

                                // crypto panel
                                Column {
                                    width: parent.width
                                    spacing: 8
                                    visible: root.gateMethod === "crypto"

                                    Rectangle {
                                        width: parent.width
                                        height: 40
                                        radius: 8
                                        visible: App.payCryptoEnabled
                                        gradient: Gradient {
                                            GradientStop { position: 0; color: "#f7931a" }
                                            GradientStop { position: 1; color: "#fbcc5c" }
                                        }
                                        Text {
                                            anchors.centerIn: parent
                                            text: qsTr("₿ PAY $%1 · CRYPTO").arg(root.gatePlanDollars)
                                            color: "#1a0a00"
                                            font.family: Theme.fontUi
                                            font.pixelSize: 14
                                            font.weight: Font.Bold
                                            font.letterSpacing: 2
                                        }
                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: {
                                                root.gateCryptoOpen = !root.gateCryptoOpen
                                                if (root.gateCryptoOpen)
                                                    App.showCryptoPanel("gate")
                                            }
                                        }
                                    }

                                    CryptoPayPanel {
                                        visible: App.payCryptoEnabled && root.gateCryptoOpen
                                        flow: "gate"
                                        planId: root.gatePlan
                                    }
                                }
                            }
                        }
                    }
                }

                // ── STEP 3: key ──
                Row {
                    width: parent.width
                    spacing: 14
                    bottomPadding: 10

                    Rectangle {
                        width: 31
                        height: 31
                        radius: 15.5
                        gradient: Gradient {
                            GradientStop { position: 0; color: Theme.gold }
                            GradientStop { position: 1; color: Theme.goldDeep }
                        }
                        Text {
                            anchors.centerIn: parent
                            text: "3"
                            color: Theme.goldInk
                            font.family: Theme.fontUi
                            font.pixelSize: 13
                            font.weight: Font.Black
                        }
                    }

                    Column {
                        width: parent.width - 45
                        spacing: 8

                        Text {
                            text: qsTr("Already have a key?")
                            color: Theme.text
                            font.family: Theme.fontUi
                            font.pixelSize: 16
                            font.weight: Font.Bold
                        }
                        Text {
                            width: parent.width
                            text: qsTr("If you already paid or received a license key by email, enter it below instead of paying again.")
                            color: Theme.dim2
                            font.family: Theme.fontUi
                            font.pixelSize: 14
                            lineHeight: 1.6
                            wrapMode: Text.WordWrap
                            bottomPadding: 4
                        }

                        TextField {
                            id: keyField
                            width: parent.width
                            height: 44
                            color: Theme.text
                            font.family: Theme.fontMono
                            font.pixelSize: 13
                            font.letterSpacing: 2
                            placeholderText: qsTr("SS-XXXX-XXXX-XXXX-XXXX")
                            placeholderTextColor: Theme.dim2
                            inputMethodHints: Qt.ImhUppercaseOnly
                            maximumLength: 40
                            background: Rectangle {
                                radius: Theme.radius
                                color: Theme.s2
                                border.width: 1
                                border.color: App.activationError.length > 0 ? Theme.red
                                            : keyField.activeFocus ? Theme.goldD : Theme.border
                            }
                            onAccepted: App.activateKey(keyField.text)
                        }

                        Text {
                            width: parent.width
                            height: 14
                            text: App.activationError
                            color: Theme.red
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 0.5
                            clip: true
                        }

                        Rectangle {
                            width: parent.width
                            height: 40
                            radius: Theme.radius
                            color: Theme.gold
                            Text {
                                anchors.centerIn: parent
                                text: qsTr("ACTIVATE LICENSE")
                                color: Theme.bg
                                font.family: Theme.fontUi
                                font.pixelSize: 15
                                font.weight: Font.Bold
                                font.letterSpacing: 3
                            }
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: App.activateKey(keyField.text)
                            }
                        }
                    }
                }

                // ── notes + sign-out ──
                Text {
                    width: parent.width
                    horizontalAlignment: Text.AlignHCenter
                    text: qsTr("Having trouble? Contact support on Telegram")
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 8
                    topPadding: 14
                    bottomPadding: 10
                }

                Text {
                    width: parent.width
                    horizontalAlignment: Text.AlignHCenter
                    text: qsTr("← Sign out")
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 8
                    topPadding: 6
                    MouseArea {
                        anchors.fill: parent
                        anchors.margins: -6
                        cursorShape: Qt.PointingHandCursor
                        onClicked: App.logout()
                    }
                }
            }
        }
    }
}
