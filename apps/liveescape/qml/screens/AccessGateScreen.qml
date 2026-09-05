import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveEscape

Item {
    id: root

    property bool fromGetStarted: false

    Rectangle {
        anchors.fill: parent
        color: Theme.bg
    }

    Flickable {
        anchors.fill: parent
        anchors.margins: 16
        contentHeight: contentCol.implicitHeight + 60
        clip: true
        flickableDirection: Flickable.VerticalFlick

        Column {
            id: contentCol
            anchors.horizontalCenter: parent.horizontalCenter
            width: Math.min(parent.width, 720)
            spacing: 20
            topPadding: 24

            LogoMark { gemSize: 36; version: App.appVersion }

            Rectangle {
                width: eyebrow.implicitWidth + 28
                height: 28
                radius: 14
                color: Theme.goldGlow
                border.color: Theme.goldDim
                border.width: 1
                Text {
                    id: eyebrow
                    anchors.centerIn: parent
                    text: "LICENSE ACTIVATION"
                    color: Theme.gold
                    font.family: Theme.fontMono
                    font.pixelSize: 10
                    font.letterSpacing: 2
                }
            }

            Text {
                text: "Activate your device"
                color: Theme.text
                font.family: Theme.fontUi
                font.pixelSize: 28
                font.bold: true
            }

            // Device ID card
            Rectangle {
                width: parent.width
                height: 72
                radius: 12
                color: Theme.s2
                border.color: Theme.border
                border.width: 1

                Row {
                    anchors.fill: parent
                    anchors.margins: 16
                    spacing: 14

                    Rectangle {
                        width: 40; height: 40; radius: 10
                        color: Theme.goldGlow
                        border.color: Theme.goldDim
                        Text {
                            anchors.centerIn: parent
                            text: "🖥"
                            font.pixelSize: 18
                        }
                    }

                    Column {
                        anchors.verticalCenter: parent.verticalCenter
                        spacing: 4
                        width: parent.width - 160
                        Text {
                            text: "DEVICE ID"
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 1.5
                        }
                        Text {
                            text: App.deviceId()
                            color: Theme.gold
                            font.family: Theme.fontMono
                            font.pixelSize: 16
                            font.bold: true
                            font.letterSpacing: 1.5
                            elide: Text.ElideMiddle
                            width: parent.width
                        }
                    }

                    GhostButton {
                        anchors.verticalCenter: parent.verticalCenter
                        text: "COPY"
                        onClicked: App.copyToClipboard(App.deviceId())
                    }
                }
            }

            // Plan selection grid (server-driven from /settings/plans)
            Text {
                text: "SELECT A PLAN"
                color: Theme.text
                font.family: Theme.fontMono
                font.pixelSize: 11
                font.letterSpacing: 2
            }

            Flickable {
                width: parent.width
                height: 200
                contentWidth: planGridRow.implicitWidth
                clip: true
                flickableDirection: Flickable.HorizontalFlick

                Row {
                    id: planGridRow
                    spacing: 12

                    Repeater {
                        model: App.plans

                        delegate: Rectangle {
                            property bool selected: selectedPlan === modelData.id
                            width: 200
                            height: 190
                            radius: 14
                            color: selected ? Theme.goldGlow : Theme.s1
                            border.color: selected ? Theme.gold : (modelData.popular ? Theme.goldDim : Theme.border)
                            border.width: selected ? 2 : 1

                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: selectedPlan = modelData.id
                            }

                            Column {
                                anchors.fill: parent
                                anchors.margins: 16
                                spacing: 8

                                Rectangle {
                                    visible: modelData.popular === true
                                    width: popularText.implicitWidth + 16
                                    height: 20
                                    radius: 10
                                    color: Theme.gold
                                    Text {
                                        id: popularText
                                        anchors.centerIn: parent
                                        text: "MOST POPULAR"
                                        color: "#1a0a00"
                                        font.family: Theme.fontMono
                                        font.pixelSize: 8
                                        font.bold: true
                                        font.letterSpacing: 0.5
                                    }
                                }

                                Text {
                                    text: modelData.name
                                    color: Theme.text
                                    font.family: Theme.fontUi
                                    font.pixelSize: 18
                                    font.bold: true
                                }

                                Text {
                                    text: "$" + Number(modelData.dollars).toFixed(modelData.dollars % 1 === 0 ? 0 : 2) + " USD"
                                    color: Theme.gold
                                    font.family: Theme.fontMono
                                    font.pixelSize: 20
                                    font.bold: true
                                }

                                Text {
                                    text: Number(modelData.credits) + " credits"
                                    color: Theme.dim
                                    font.family: Theme.fontMono
                                    font.pixelSize: 11
                                }

                                Text {
                                    text: "One-time license · 1 year"
                                    color: Theme.dim
                                    font.family: Theme.fontMono
                                    font.pixelSize: 9
                                }
                            }
                        }
                    }
                }
            }

            // Payment method toggle
            Row {
                width: parent.width
                spacing: 8

                GoldButton {
                    id: methodCardBtn
                    width: App.payCryptoEnabled ? (parent.width - 16) / 2 : parent.width
                    text: "💳 Card / Transfer"
                    bg: root.selectedMethod === "card" ? Theme.gold : Theme.s2
                    fg: root.selectedMethod === "card" ? Theme.bg : Theme.dim
                    onClicked: root.selectedMethod = "card"
                }

                GoldButton {
                    id: methodCryptoBtn
                    visible: App.payCryptoEnabled
                    width: (parent.width - 16) / 2
                    text: "₿ Crypto"
                    bg: root.selectedMethod === "crypto" ? Theme.gold : Theme.s2
                    fg: root.selectedMethod === "crypto" ? Theme.bg : Theme.dim
                    onClicked: root.selectedMethod = "crypto"
                }
            }

            GoldButton {
                width: parent.width
                text: selectedPlan.length === 0 ? "SELECT A PLAN FIRST"
                     : ("PAY NOW — $" + selectedPlanDollars().toFixed(selectedPlanDollars() % 1 === 0 ? 0 : 2) + " USD")
                busy: Api.busy
                onClicked: App.payActivation(selectedPlan)
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

            // Divider
            Rectangle {
                width: parent.width * 0.6
                height: 1
                anchors.horizontalCenter: parent.horizontalCenter
                color: Theme.border
            }

            // Manual key entry
            Text {
                text: "ALREADY HAVE A KEY?"
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 11
                font.letterSpacing: 2
            }

            FieldInput {
                id: keyField
                width: parent.width
                label: "ACCESS KEY"
                placeholderText: "SS-XXXX-XXXX-XXXX"
                mono: true
                onAccepted: App.activateKey(keyField.text)
            }

            GoldButton {
                width: parent.width
                text: "ACTIVATE LICENSE"
                busy: Api.busy
                onClicked: App.activateKey(keyField.text)
            }

            Text {
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                text: "Keys are bound to your Device ID."
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 9
                font.letterSpacing: 2
                wrapMode: Text.WordWrap
            }

            GhostButton {
                width: parent.width
                text: "RESET LOCAL STORAGE"
                onClicked: App.requestStorageReset()
            }
        }
    }

    property string selectedPlan: "pro"
    property string selectedMethod: "card"

    function selectedPlanDollars() {
        for (var i = 0; i < App.plans.length; i++) {
            if (App.plans[i].id === selectedPlan)
                return Number(App.plans[i].dollars);
        }
        return 0;
    }
}