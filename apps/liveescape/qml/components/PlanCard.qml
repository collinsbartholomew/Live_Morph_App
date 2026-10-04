import Qt5Compat.GraphicalEffects
import QtQuick
import LiveEscape

Rectangle {
    id: root
    property string planId: ""
    property string title: ""
    property real price: 0
    property int credits: 0
    property string timeLabel: ""
    property bool popular: false
    property var features: []
    property bool selected: false
    signal clicked()

    readonly property var featureMatrix: ({
        "test":    [{t:"Full AI engine access",i:true},{t:"OBS / Theatre mode",i:true},{t:"Priority support",i:false}],
        "starter": [{t:"Full AI engine access",i:true},{t:"All presets included",i:true},{t:"OBS / Theatre mode",i:true},{t:"Priority support",i:false}],
        "creator": [{t:"Everything in Starter",i:true},{t:"Voice Changer",i:true},{t:"Creator Program",i:true},{t:"15% Referral Commission",i:true},{t:"Background Change",i:true},{t:"Priority support",i:false}],
        "pro":     [{t:"Everything in Creator",i:true},{t:"All presets included",i:true},{t:"1-on-1 Setup Call",i:true},{t:"Priority support",i:true}],
    })
    readonly property var activeFeatures: featureMatrix[root.planId] || []

    height: contentCol.implicitHeight + 38
    radius: 12
    color: Theme.s2
    border.width: selected || popular ? 1 : 1
    border.color: selected ? Theme.gold : (popular ? Qt.rgba(63/255, 232/255, 184/255, 0.4) : Theme.border)

    property real hoverOffset: 0
    Behavior on hoverOffset { NumberAnimation { duration: 250; easing.type: Easing.OutCubic } }
    transform: Translate { y: root.hoverOffset }

    Rectangle {
        visible: root.popular
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.top: parent.top
        width: badge.implicitWidth + 28
        height: 20
        radius: 0
        color: Theme.teal
        bottomLeftRadius: 8
        bottomRightRadius: 8
        Text {
            id: badge
            anchors.centerIn: parent
            text: qsTr("MOST POPULAR")
            color: Theme.bg
            font.family: Theme.fontMono
            font.pixelSize: 8
            font.bold: true
            font.letterSpacing: 1.5
        }
    }

    Column {
        id: contentCol
        anchors.fill: parent
        anchors.margins: 16
        spacing: 6

        Text {
            text: root.title.toUpperCase()
            color: Theme.gold
            font.family: Theme.fontUi
            font.pixelSize: 15
            font.bold: true
            font.letterSpacing: 3
        }
        Row {
            anchors.horizontalCenter: parent.horizontalCenter
            spacing: 2
            Text {
                text: "$" + root.price
                color: Theme.gold
                font.family: Theme.fontUi
                font.pixelSize: 36
                font.bold: true
                anchors.baseline: usdLabel.baseline
            }
            Text {
                id: usdLabel
                text: "USD"
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 14
                font.weight: Font.Normal
                anchors.bottom: parent.bottom
                anchors.bottomMargin: 6
            }
        }
        Text {
            text: root.credits + " credits"
            color: Theme.teal
            font.family: Theme.fontMono
            font.pixelSize: 11
            font.letterSpacing: 1
        }

        Rectangle { width: parent.width; height: 1; color: Theme.border }

        Repeater {
            model: root.activeFeatures
            Row {
                width: parent.width
                spacing: 5
                Text {
                    text: modelData.i ? "✓" : "—"
                    color: modelData.i ? Theme.teal : Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 8
                    width: 14
                }
                Text {
                    width: parent.width - 19
                    text: modelData.t
                    color: modelData.i ? Theme.text : Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 8
                    wrapMode: Text.WordWrap
                }
            }
        }
    }

    // Hover glow effect (matches Electron shadow-glow-md)
    Rectangle {
        anchors.fill: parent
        anchors.margins: -8
        radius: parent.radius + 8
        color: "transparent"
        border.width: 1
        border.color: ma.containsMouse && !root.selected ? Theme.gold : "transparent"
        opacity: ma.containsMouse && !root.selected ? 0.3 : 0
        Behavior on opacity { NumberAnimation { duration: 300 } }
        z: -2
        layer.enabled: ma.containsMouse && !root.selected
        layer.effect: DropShadow {
            horizontalOffset: 0
            verticalOffset: 0
            radius: 16
            samples: 16
            color: Theme.gold
            transparentBorder: true
        }
    }

    Rectangle {
        anchors.fill: parent
        anchors.margins: -1
        radius: parent.radius + 1
        color: "transparent"
        border.color: ma.containsMouse ? (root.selected ? Theme.gold : (root.popular ? Theme.teal : Theme.goldDim)) : "transparent"
        border.width: 1
        opacity: ma.containsMouse ? 0.35 : 0
        Behavior on opacity { NumberAnimation { duration: Theme.motionFast } }
        z: -1
    }

    MouseArea {
        id: ma
        anchors.fill: parent
        cursorShape: Qt.PointingHandCursor
        hoverEnabled: true
        onClicked: root.clicked()
        onEntered: { root.border.color = root.selected ? Theme.gold : (root.popular ? Theme.teal : Theme.gold); root.hoverOffset = -3 }
        onExited: { root.border.color = root.selected ? Theme.gold : (root.popular ? Qt.rgba(63/255, 232/255, 184/255, 0.4) : Theme.border); root.hoverOffset = 0 }
    }
}
