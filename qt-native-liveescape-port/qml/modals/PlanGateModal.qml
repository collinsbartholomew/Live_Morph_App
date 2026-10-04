import QtQuick
import SmokeScreen

// #planGate — credit plans. Exact reference cards:
//   Test $0.50/50cr · Starter $20/1000cr · Pro $60/5000cr (MOST POPULAR)
//   Premium $150/10,000cr · Elite $550/50,000cr
ModalBase {
    id: gate
    open: App.showPlanGate
    modalZ: 500
    panelMaxWidth: 820
    panelPaddingH: 20
    panelPaddingV: 20
    onClose: App.showPlanGate = false

    readonly property var planCards: {
        const defs = [
            { id: "test",    name: "Test",    dollars: 0.50, credits: 50,    time: "≈ 25 sec streaming", test: true,
              feats: [["Full AI engine access", true], ["OBS / Theatre mode", true], ["Priority support", false]] },
            { id: "starter", name: "Starter", dollars: 20,   credits: 1000,  time: "≈ 8 min streaming",
              feats: [["Full AI engine access", true], ["All presets included", true], ["OBS / Theatre mode", true], ["Priority support", false]] },
            { id: "pro",     name: "Pro",     dollars: 60,   credits: 5000,  time: "≈ 42 min streaming", popular: true,
              feats: [["Full AI engine access", true], ["All presets included", true], ["OBS / Theatre mode", true], ["Priority support", true]] },
            { id: "premium", name: "Premium", dollars: 150,  credits: 10000, time: "≈ 83 min streaming",
              feats: [["Full AI engine access", true], ["All presets included", true], ["OBS / Theatre mode", true], ["Priority support", true]] },
            { id: "elite",   name: "Elite",   dollars: 550,  credits: 50000, time: "≈ 417 min streaming",
              feats: [["Full AI engine access", true], ["All presets included", true], ["OBS / Theatre mode", true], ["Priority support", true]] }
        ]
        const src = App.plans || []
        for (let i = 0; i < defs.length; i++) {
            for (let j = 0; j < src.length; j++) {
                if (src[j] && src[j].id === defs[i].id) {
                    if (Number(src[j].dollars) > 0) defs[i].dollars = Number(src[j].dollars)
                    if (Number(src[j].credits) > 0) defs[i].credits = Number(src[j].credits)
                }
            }
        }
        return defs
    }

    Row {
        width: parent.width
        spacing: 8
        Text {
            anchors.verticalCenter: parent.verticalCenter
            text: "S"
            color: Theme.bg
            font.family: Theme.fontUi
            font.pixelSize: 16
            font.weight: Font.Black
            width: 32
            height: 32
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            Rectangle {
                z: -1
                anchors.fill: parent
                radius: 6
                color: Theme.gold
            }
        }
        Text {
            anchors.verticalCenter: parent.verticalCenter
            textFormat: Text.RichText
            text: qsTr("SMOKE<font color='#e8c547'>SCREEN</font>")
            color: Theme.text
            font.family: Theme.fontUi
            font.pixelSize: 22
            font.weight: Font.Bold
            font.letterSpacing: 4
        }
        Text {
            anchors.verticalCenter: parent.verticalCenter
            text: "1.8"
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 12
        }
        Item { width: parent.width - 640; height: 1 }
        Rectangle {
            anchors.verticalCenter: parent.verticalCenter
            width: 32
            height: 32
            radius: 16
            color: "transparent"
            border.width: 1
            border.color: Qt.rgba(255, 255, 255, 0.15)
            Text {
                anchors.centerIn: parent
                text: "×"
                color: Theme.dim
                font.pixelSize: 18
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: App.showPlanGate = false
            }
        }
    }

    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("REAL-TIME AI VIDEO TRANSFORMATION")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 9
        font.letterSpacing: 2
        bottomPadding: 10
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("SELECT A CREDIT PLAN")
        color: Theme.text
        font.family: Theme.fontUi
        font.pixelSize: 17
        font.weight: Font.Bold
        font.letterSpacing: 3
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        textFormat: Text.RichText
        text: qsTr("Credits power your live AI sessions at <b style='color:#e8c547'>120 credits/minute</b>.<br>Purchase once, use anytime — credits never expire.")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 10
        lineHeight: 1.7
        bottomPadding: 12
    }

    Grid {
        width: parent.width
        columns: 4
        spacing: 14

        Repeater {
            model: gate.planCards
            delegate: Rectangle {
                width: (gate.width - 56 - 42) / 4
                height: 268
                radius: 12
                color: Theme.s2
                border.width: 1
                border.color: modelData.popular ? Qt.rgba(63/255, 232/255, 184/255, 0.4)
                            : modelData.test ? Qt.rgba(255/255, 77/255, 109/255, 0.3)
                            : Theme.border

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: App.selectPlan(modelData.id)
                }

                Rectangle {
                    visible: modelData.popular === true
                    anchors.top: parent.top
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: popularTxt.implicitWidth + 28
                    height: 19
                    color: Theme.teal
                    bottomLeftRadius: 8
                    bottomRightRadius: 8
                    Text {
                        id: popularTxt
                        anchors.centerIn: parent
                        text: qsTr("MOST POPULAR")
                        color: Theme.bg
                        font.family: Theme.fontMono
                        font.pixelSize: 8
                        font.weight: Font.Bold
                        font.letterSpacing: 1.5
                    }
                }

                Column {
                    anchors.fill: parent
                    anchors.margins: 16
                    spacing: 4
                    topPadding: modelData.popular ? 22 : 6

                    Text {
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: modelData.name
                        color: modelData.test ? Theme.red : Theme.text
                        font.family: Theme.fontUi
                        font.pixelSize: 15
                        font.weight: Font.Bold
                        font.letterSpacing: 2
                    }
                    Text {
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: "$" + (modelData.dollars % 1 === 0 ? modelData.dollars : modelData.dollars.toFixed(2))
                        color: modelData.test ? Theme.red : modelData.popular ? Theme.teal : Theme.gold
                        font.family: Theme.fontUi
                        font.pixelSize: 30
                        font.weight: Font.Bold
                    }
                    Text {
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: modelData.credits.toLocaleString() + " Credits"
                        color: Theme.teal
                        font.family: Theme.fontMono
                        font.pixelSize: 10
                    }
                    Text {
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: modelData.time
                        color: Theme.dim
                        font.family: Theme.fontMono
                        font.pixelSize: 9
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
                            spacing: 5
                            Text {
                                text: modelData[1] ? "✓" : "—"
                                color: modelData[1] ? Theme.teal : Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 8
                                width: 12
                            }
                            Text {
                                width: parent.width - 17
                                text: modelData[0]
                                color: modelData[1] ? Theme.text : Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 8
                                wrapMode: Text.WordWrap
                            }
                        }
                    }
                    Rectangle {
                        width: parent.width
                        height: 26
                        radius: 6
                        color: Theme.gold
                        anchors.horizontalCenter: parent.horizontalCenter
                        Text {
                            anchors.centerIn: parent
                            text: qsTr("SELECT")
                            color: Theme.bg
                            font.family: Theme.fontUi
                            font.pixelSize: 13
                            font.weight: Font.Bold
                            font.letterSpacing: 2
                        }
                    }
                }
            }
        }
    }

    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        textFormat: Text.RichText
        text: qsTr("After purchase via Telegram or email, you will receive a <b style='color:#e8c547'>Credit Key</b> to enter below.")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 10
        topPadding: 10
    }
}
