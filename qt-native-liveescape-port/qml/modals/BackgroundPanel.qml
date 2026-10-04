import QtQuick
import SmokeScreen

// #bgPanelBackdrop / #bgPanel — z 550. Live background presets.
Item {
    id: root
    anchors.fill: parent
    visible: App.showBgPanel
    property bool applying: false
    property string applyingLabel: ""

    Rectangle {
        anchors.fill: parent
        color: Qt.rgba(2/255, 2/255, 8/255, 0.72)
        MouseArea {
            anchors.fill: parent
            onClicked: App.showBgPanel = false
        }
    }

    Rectangle {
        anchors.centerIn: parent
        width: Math.min(parent.width * 0.92, 760)
        height: Math.min(parent.height * 0.88, 680)
        radius: 12
        color: Theme.s2
        border.width: 1
        border.color: Theme.border

        Column {
            anchors.fill: parent
            spacing: 0

            Item {
                width: parent.width
                height: 40
                Text {
                    anchors.left: parent.left
                    anchors.leftMargin: 14
                    anchors.verticalCenter: parent.verticalCenter
                    text: qsTr("BACKGROUND")
                    color: Theme.gold
                    font.family: Theme.fontUi
                    font.pixelSize: 13
                    font.weight: Font.Bold
                    font.letterSpacing: 2
                }
                Text {
                    anchors.right: parent.right
                    anchors.rightMargin: 14
                    anchors.verticalCenter: parent.verticalCenter
                    text: "×"
                    color: Theme.dim
                    font.pixelSize: 18
                    MouseArea {
                        anchors.fill: parent
                        anchors.margins: -8
                        cursorShape: Qt.PointingHandCursor
                        onClicked: App.showBgPanel = false
                    }
                }
            }

            Text {
                width: parent.width
                leftPadding: 14
                rightPadding: 14
                bottomPadding: 8
                text: qsTr("Pick a scene — your stream updates live. Premium scenes require full license activation.")
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 9
                wrapMode: Text.WordWrap
            }

            GridView {
                width: parent.width
                height: parent.height - 90
                leftMargin: 14
                rightMargin: 14
                cellWidth: 142
                cellHeight: 110
                clip: true
                model: Stream.backgroundPresets
                delegate: Rectangle {
                    width: 132
                    height: 100
                    radius: 10
                    color: Theme.s1
                    border.width: 1
                    border.color: modelData && modelData.locked ? Theme.border : Theme.border
                    opacity: modelData && modelData.locked ? 0.55 : 1

                    Column {
                        anchors.centerIn: parent
                        spacing: 6
                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: modelData && modelData.icon ? modelData.icon : "🖼"
                            font.pixelSize: 26
                        }
                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: modelData && modelData.label ? modelData.label : (modelData ? modelData.id : "")
                            color: Theme.text
                            font.family: Theme.fontUi
                            font.pixelSize: 11
                            font.weight: Font.DemiBold
                            font.letterSpacing: 0.5
                        }
                        Text {
                            visible: modelData && modelData.premium === true
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: qsTr("PREMIUM")
                            color: Theme.gold
                            font.family: Theme.fontMono
                            font.pixelSize: 7
                            font.letterSpacing: 1
                        }
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            if (modelData && modelData.locked) {
                                App.toast("Premium background — full license activation unlocks this scene.", "warn")
                                return
                            }
                            root.applying = true
                            root.applyingLabel = modelData && modelData.label ? modelData.label : ""
                            Stream.selectBackgroundPreset(modelData.id, modelData.label || modelData.id)
                        }
                    }
                }
            }
        }

        // apply overlay
        Rectangle {
            anchors.fill: parent
            visible: root.applying
            color: Qt.rgba(4/255, 4/255, 10/255, 0.88)
            radius: 12
            Column {
                anchors.centerIn: parent
                spacing: 14
                Rectangle {
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: 40
                    height: 40
                    radius: 20
                    color: "transparent"
                    border.width: 3
                    border.color: Theme.border
                    Rectangle {
                        width: parent.width
                        height: parent.height
                        radius: 20
                        color: "transparent"
                        border.width: 3
                        border.color: "transparent"
                        Rectangle {
                            width: parent.width / 2
                            height: parent.height / 2
                            color: "transparent"
                            border.width: 3
                            border.color: Theme.teal
                            radius: 3
                        }
                        SequentialAnimation on rotation {
                            loops: Animation.Infinite
                            NumberAnimation { from: 0; to: 360; duration: 700 }
                        }
                    }
                }
                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: qsTr("APPLYING BACKGROUND")
                    color: Theme.teal
                    font.family: Theme.fontUi
                    font.pixelSize: 13
                    font.weight: Font.DemiBold
                    font.letterSpacing: 2
                }
                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: qsTr("Sending scene to the engine…")
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 9
                }
            }
        }
    }

    Connections {
        target: Stream
        function onPresetsChanged() {}
    }
    // clear the applying state when the engine answers
    Connections {
        target: App
        function onToastSeqChanged() { root.applying = false }
    }
}
