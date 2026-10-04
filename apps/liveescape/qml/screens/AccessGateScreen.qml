import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import Qt5Compat.GraphicalEffects
import LiveEscape

Item {
    id: root

    property bool fromGetStarted: false
    property string selectedPlan: ""
    property string selectedMethod: "card"
    property bool gateCryptoOpen: false

    Rectangle {
        anchors.fill: parent
        gradient: Gradient {
            GradientStop { position: 0; color: Qt.rgba(232/255, 197/255, 71/255, 0.07) }
            GradientStop { position: 0.6; color: Theme.bg }
            GradientStop { position: 1; color: Theme.bg }
        }
    }

    Flickable {
        anchors.fill: parent
        contentHeight: accessCard.implicitHeight + 80
        clip: true
        flickableDirection: Flickable.VerticalFlick

        Rectangle {
            id: accessCard
            width: Math.min(parent.width * 0.92, 820)
            anchors.horizontalCenter: parent.horizontalCenter
            anchors.top: parent.top
            anchors.topMargin: 24
            implicitHeight: cardCol.implicitHeight + 60
            radius: 24
            color: Theme.s1
            border.color: Theme.goldD
            border.width: 1

            Rectangle {
                anchors.fill: parent
                anchors.margins: -44
                radius: parent.radius + 44
                color: "transparent"
                border.width: 1
                border.color: Theme.gold
                opacity: 0.04
                z: -1
            }

            // Top highlight line
            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                anchors.margins: 1
                height: 1
                radius: parent.radius
                color: "#ffffff33"
            }

            Column {
                id: cardCol
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                anchors.leftMargin: 56
                anchors.rightMargin: 56
                anchors.topMargin: 52
                anchors.bottomMargin: 48
                spacing: 18

                // Logo row
                Item {
                    width: parent.width
                    height: accessLogo.implicitHeight

                    LogoMark {
                        id: accessLogo
                        anchors.horizontalCenter: parent.horizontalCenter
                        variant: "diamond"
                        gemSize: 40
                        wordmarkSize: 20
                        wordmarkLS: 3
                        version: App.appVersion
                        versionFont: Theme.fontMono
                        versionSize: 10
                        versionLS: 1.5
                    }
                }

                // Eyebrow
                Rectangle {
                    width: eyebrowText.implicitWidth + 28
                    height: 28
                    radius: 14
                    color: Theme.goldG
                    border.color: Theme.goldD
                    border.width: 1
                    anchors.horizontalCenter: parent.horizontalCenter

                    Text {
                        id: eyebrowText
                        anchors.centerIn: parent
                        text: "🔒 Annual License"
                        color: Theme.gold
                        font.family: Theme.fontMono
                        font.pixelSize: 10
                        font.letterSpacing: 2.5
                        font.bold: true
                    }
                }

                // Headline
                Text {
                    width: parent.width
                    text: "Let's activate your account"
                    color: Theme.text
                    font.family: Theme.fontUi
                    font.pixelSize: 34
                    font.bold: true
                    font.weight: Font.ExtraBold
                    font.letterSpacing: 0.3
                    horizontalAlignment: Text.AlignHCenter
                    lineHeight: 1.2
                }

                // Subtext
                Text {
                    width: parent.width
                    text: "Pick a plan and pay below, or drop in a license key you already have. Either way, you'll be streaming in under a minute."
                    color: Theme.dim
                    font.family: Theme.fontUi
                    font.pixelSize: 15
                    lineHeight: 1.65
                    horizontalAlignment: Text.AlignHCenter
                    wrapMode: Text.WordWrap
                }

                // VERTICAL STEPPER (matches Electron exactly)
                Column {
                    id: stepper
                    width: parent.width
                    spacing: 0

                    Repeater {
                        model: [
                            {
                                num: "1",
                                title: "Confirm this device",
                                desc: "Your license is locked to one device so it can't be shared — this is the ID we'll attach it to.",
                                showDeviceCard: true
                            },
                            {
                                num: "2",
                                title: "Choose a plan & activate",
                                desc: "A one-time payment unlocks a full year of access. Your key is generated automatically the moment payment is confirmed.",
                                showDeviceCard: false
                            },
                            {
                                num: "3",
                                title: "Already have a key?",
                                desc: "If you already paid or received a license key by email, enter it below instead of paying again.",
                                showDeviceCard: false,
                                showKeyInput: true
                            }
                        ]

                        delegate: Item {
                            id: stepItem
                            width: parent.width
                            height: stepContent.implicitHeight + (index < 2 ? 26 : 0)

                            // Connecting line (left: 15px, top: 32px, bottom: 4px)
                            Rectangle {
                                visible: index < 2
                                x: 15
                                y: 32
                                width: 1
                                height: parent.height - 36
                                gradient: Gradient {
                                    GradientStop { position: 0; color: Theme.goldD }
                                    GradientStop { position: 0.8; color: Theme.border }
                                }
                            }

                            Row {
                                id: stepContent
                                width: parent.width
                                spacing: 14
                                anchors.top: parent.top

                                // Step number circle
                                Rectangle {
                                    id: stepNum
                                    width: 31
                                    height: 31
                                    radius: 15.5
                                    gradient: Gradient {
                                        GradientStop { position: 0; color: Theme.gold }
                                        GradientStop { position: 1; color: "#d4a017" }
                                    }
                                    Text {
                                        anchors.centerIn: parent
                                        text: modelData.num
                                        color: Theme.bg
                                        font.family: Theme.fontUi
                                        font.pixelSize: 13
                                        font.bold: true
                                    }
                                    // Outer glow ring
                                    Rectangle {
                                        anchors.centerIn: parent
                                        width: parent.width + 8
                                        height: parent.height + 8
                                        radius: (parent.width + 8) / 2
                                        color: "transparent"
                                        border.color: Theme.gold
                                        border.width: 1
                                        opacity: 0.35
                                        z: -1
                                        layer.enabled: true
                                        layer.effect: DropShadow {
                                            radius: 10
                                            color: Qt.rgba(240 / 255, 168 / 255, 48 / 255, 0.5)
                                            horizontalOffset: 0
                                            verticalOffset: 0
                                            spread: 0.15
                                        }
                                    }
                                }

                                // Step content
                                Column {
                                    width: parent.width - 45
                                    spacing: 4

                                    Text {
                                        width: parent.width
                                        text: modelData.title
                                        color: Theme.text
                                        font.family: Theme.fontUi
                                        font.pixelSize: 16
                                        font.bold: true
                                        font.letterSpacing: 0.2
                                    }

                                    Text {
                                        width: parent.width
                                        text: modelData.desc
                                        color: Theme.dim
                                        font.family: Theme.fontUi
                                        font.pixelSize: 15
                                        lineHeight: 1.6
                                        wrapMode: Text.WordWrap
                                    }

                                    // Device ID Card (Step 1 only)
                                    Rectangle {
                                        visible: modelData.showDeviceCard
                                        width: parent.width
                                        height: 72
                                        radius: 12
                                        color: Theme.s2
                                        border.color: Theme.border
                                        border.width: 1
                                        anchors.topMargin: 8

                                        Row {
                                            anchors.fill: parent
                                            anchors.margins: 18
                                            spacing: 16

                                            Rectangle {
                                                width: 44; height: 44; radius: 10
                                                color: Theme.goldG
                                                border.color: Theme.goldD
                                                border.width: 1
                                                Text {
                                                    anchors.centerIn: parent
                                                    text: "🖥️"
                                                    font.pixelSize: 19
                                                }
                                            }

                                            Column {
                                                anchors.verticalCenter: parent.verticalCenter
                                                spacing: 5
                                                width: parent.width - 160

                                                Text {
                                                    text: "DEVICE ID"
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
                                                        font.bold: true
                                                        font.letterSpacing: 1.5
                                                    }

                                                    GhostButton {
                                                        text: "COPY"
                                                        anchors.verticalCenter: parent.verticalCenter
                                                        onClicked: App.copyToClipboard(App.deviceId())
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    // Plan Selector (Step 2 only)
                                    Column {
                                        visible: index === 1
                                        width: parent.width
                                        spacing: 16
                                        anchors.topMargin: 8

                                        Text {
                                            text: "Select Your Plan"
                                            color: Theme.dim
                                            font.family: Theme.fontMono
                                            font.pixelSize: 9
                                            font.letterSpacing: 2
                                        }

                                        // Plan cards container
                                        Flickable {
                                            width: parent.width
                                            height: planRow.implicitHeight + 20
                                            contentWidth: planRow.implicitWidth
                                            clip: true
                                            flickableDirection: Flickable.HorizontalFlick

                                            Row {
                                                id: planRow
                                                spacing: 14

                                                Repeater {
                                                    model: App.activationPlans.length > 0 ? App.activationPlans : [
                                                        {id: "starter", name: "Starter", dollars: 20, credits: 300, timeLabel: "~2.5 min", popular: false},
                                                        {id: "creator", name: "Creator", dollars: 75, credits: 500, timeLabel: "~4 min", popular: true},
                                                        {id: "pro", name: "Pro", dollars: 120, credits: 2000, timeLabel: "~17 min", popular: false}
                                                    ]

                                                    delegate: PlanCard {
                                                        planId: modelData.id
                                                        title: modelData.name
                                                        price: modelData.dollars
                                                        credits: modelData.credits
                                                        timeLabel: modelData.timeLabel
                                                        popular: modelData.popular === true
                                                        features: modelData.features
                                                        selected: root.selectedPlan === modelData.id
                                                        onClicked: root.selectedPlan = modelData.id
                                                    }
                                                }
                                            }
                                        }

                                        // Payment method toggle
                                        Row {
                                            width: parent.width
                                            spacing: 4
                                            anchors.topMargin: 8

                                            Rectangle {
                                                width: App.payCryptoEnabled ? (parent.width - 4) / 2 : parent.width
                                                height: 44
                                                radius: 11
                                                color: root.selectedMethod === "card" ? Theme.gold : Theme.s2
                                                border.color: root.selectedMethod === "card" ? Theme.gold : Theme.border
                                                border.width: 1
                                                Text {
                                                    anchors.centerIn: parent
                                                    text: "💳 Card / Transfer"
                                                    color: root.selectedMethod === "card" ? Theme.bg : Theme.dim
                                                    font.family: Theme.fontUi
                                                    font.pixelSize: 12
                                                    font.bold: true
                                                    font.letterSpacing: 0.3
                                                }
                                                MouseArea {
                                                    anchors.fill: parent
                                                    cursorShape: Qt.PointingHandCursor
                                                    onClicked: root.selectedMethod = "card"
                                                }
                                            }

                                            Rectangle {
                                                visible: App.payCryptoEnabled
                                                width: (parent.width - 4) / 2
                                                height: 44
                                                radius: 11
                                                color: root.selectedMethod === "crypto" ? Theme.gold : Theme.s2
                                                border.color: root.selectedMethod === "crypto" ? Theme.gold : Theme.border
                                                border.width: 1
                                                Text {
                                                    anchors.centerIn: parent
                                                    text: "₿ Crypto"
                                                    color: root.selectedMethod === "crypto" ? Theme.bg : Theme.dim
                                                    font.family: Theme.fontUi
                                                    font.pixelSize: 12
                                                    font.bold: true
                                                    font.letterSpacing: 0.3
                                                }
                                                MouseArea {
                                                    anchors.fill: parent
                                                    cursorShape: Qt.PointingHandCursor
                                                    onClicked: root.selectedMethod = "crypto"
                                                }
                                            }
                                        }

                                        GoldButton {
                                            width: parent.width
                                            text: root.selectedPlan.length === 0 ? "SELECT A PLAN FIRST"
                                                 : ("PAY NOW — $" + selectedPlanDollars().toFixed(selectedPlanDollars() % 1 === 0 ? 0 : 2))
                                            busy: Api.busy
                                            enabled: root.selectedPlan.length > 0
                                            onClicked: App.payActivation(root.selectedPlan)
                                        }

                                        // ₿ Crypto pay (Electron gatePayBtnCrypto)
                                        Rectangle {
                                            visible: App.payCryptoEnabled
                                            width: parent.width
                                            height: 42
                                            radius: 8
                                            gradient: Gradient {
                                                orientation: Gradient.Horizontal
                                                GradientStop { position: 0; color: "#f7931a" }
                                                GradientStop { position: 1; color: "#fbcc5c" }
                                            }

                                            Text {
                                                anchors.centerIn: parent
                                                text: root.selectedPlan.length === 0
                                                      ? qsTr("₿ PAY · CRYPTO")
                                                      : qsTr("₿ PAY $%1 · CRYPTO").arg(
                                                            selectedPlanDollars().toFixed(
                                                                selectedPlanDollars() % 1 === 0 ? 0 : 2))
                                                color: "#1a0a00"
                                                font.family: Theme.fontUi
                                                font.pixelSize: 14
                                                font.bold: true
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
                                            visible: root.gateCryptoOpen && App.payCryptoEnabled
                                            flow: "gate"
                                            planId: root.selectedPlan
                                        }

                                        Text {
                                            width: parent.width
                                            horizontalAlignment: Text.AlignHCenter
                                            text: "Opens Paystack in your browser. Return here after payment."
                                            color: Theme.dim
                                            font.family: Theme.fontMono
                                            font.pixelSize: 9
                                            font.letterSpacing: 2
                                            wrapMode: Text.WordWrap
                                            opacity: 0.6
                                        }
                                    }

                                    // Manual Key Entry (Step 3 only)
                                    Column {
                                        visible: modelData.showKeyInput
                                        width: parent.width
                                        spacing: 8
                                        anchors.topMargin: 8

                                        FieldInput {
                                            id: keyField
                                            width: parent.width
                                            label: ""
                                            placeholderText: "SS-XXXX-XXXX-XXXX-XXXX"
                                            mono: true
                                            font.pixelSize: 13
                                            font.letterSpacing: 2
                                            error: App.activationError !== ""
                                            onAccepted: App.activateKey(keyField.text)
                                        }

                                        Text {
                                            width: parent.width
                                            visible: App.activationError.length > 0
                                            height: visible ? Math.max(implicitHeight, 14) : 0
                                            text: App.activationError
                                            color: Theme.red
                                            font.family: Theme.fontMono
                                            font.pixelSize: 9
                                            font.letterSpacing: 0.5
                                            horizontalAlignment: Text.AlignHCenter
                                        }

                                        GoldButton {
                                            width: parent.width
                                            text: "ACTIVATE LICENSE"
                                            busy: Api.busy
                                            fontPixelSize: 15
                                            fontLS: 3
                                            onClicked: App.activateKey(keyField.text)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Note
                Text {
                    width: parent.width
                    horizontalAlignment: Text.AlignHCenter
                    text: "Having trouble? Contact support on Telegram"
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 8
                    font.letterSpacing: 1
                    wrapMode: Text.WordWrap
                    lineHeight: 1.7
                    anchors.topMargin: 4
                }

                GhostButton {
                    width: parent.width
                    text: "← BACK TO OPTIONS"
                    visible: false
                }

                Text {
                    width: parent.width
                    horizontalAlignment: Text.AlignHCenter
                    text: "← Sign out"
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 8
                    font.letterSpacing: 1
                    topPadding: 12

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: App.logout()
                    }
                }
            }
        }
    }

    function selectedPlanDollars() {
        for (var i = 0; i < App.activationPlans.length; i++) {
            if (App.activationPlans[i].id === selectedPlan)
                return Number(App.activationPlans[i].dollars);
        }
        // Fallback to regular plans
        for (var j = 0; j < App.plans.length; j++) {
            if (App.plans[j].id === selectedPlan)
                return Number(App.plans[j].dollars);
        }
        return 0;
    }
}