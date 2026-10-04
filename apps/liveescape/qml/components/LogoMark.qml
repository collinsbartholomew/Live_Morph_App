import QtQuick
import QtQuick.Layouts
import LiveEscape

Item {
    id: root
    property string variant: "bar"
    property int gemSize: 98
    property int gemLetterSize: 12
    property int gemRadius: 4
    property int gemGap: 8
    property bool showWordmark: true
    property string version: "1.8"
    property int wordmarkSize: 16
    property real wordmarkLS: 4
    property int versionSize: 11
    property real versionLS: 2
    property string versionFont: Theme.fontMono
    property bool wideGem: true

    // Variant-specific defaults
    property bool isDiamond: variant === "diamond"
    property bool isAuthWide: variant === "authWide"

    implicitWidth: row.implicitWidth
    implicitHeight: Math.max(gemSize, isDiamond ? gemSize : (isAuthWide ? 28 : 28))

    RowLayout {
        id: row
        spacing: gemGap
        anchors.verticalCenter: parent.verticalCenter

        Item {
            Layout.alignment: Qt.AlignVCenter
            width: gemSize
            height: isDiamond ? gemSize : (isAuthWide ? 28 : gemSize)

            // Diamond variant (AccessGate) - rotated 45° gradient square
            Rectangle {
                visible: isDiamond
                anchors.centerIn: parent
                width: gemSize
                height: gemSize
                radius: 9
                rotation: 45
                gradient: Gradient {
                    GradientStop { position: 0; color: Theme.gold }
                    GradientStop { position: 0.5; color: "#d4a017" }
                    GradientStop { position: 1; color: Theme.teal }
                }
                // Glow
                Rectangle {
                    anchors.fill: parent
                    anchors.margins: -4
                    radius: 13
                    color: "transparent"
                    border.color: Theme.gold
                    border.width: 1
                    opacity: 0.3
                    z: -1
                }
            }

            // Auth wide gem (AuthScreen) - 130×28, radius 7, "S" 18px
            Rectangle {
                visible: isAuthWide
                anchors.centerIn: parent
                width: gemSize
                height: 28
                radius: 7
                color: Theme.gold
                Text {
                    anchors.centerIn: parent
                    text: "S"
                    color: Theme.bg
                    font.family: Theme.fontUi
                    font.pixelSize: 18
                    font.bold: true
                }
            }

            // Bar variant (Dashboard top bar) - 98×28, radius 4, "S" 12px
            Rectangle {
                visible: variant === "bar"
                anchors.centerIn: parent
                width: gemSize
                height: 28
                radius: 4
                color: Theme.gold
                Text {
                    anchors.centerIn: parent
                    text: "S"
                    color: Theme.bg
                    font.family: Theme.fontUi
                    font.pixelSize: gemLetterSize
                    font.bold: true
                }
            }
        }

        Column {
            visible: root.showWordmark && !isDiamond
            Layout.alignment: Qt.AlignVCenter
            spacing: 0
            Row {
                spacing: 2
                Text {
                    text: qsTr("LIVE")
                    color: Theme.text
                    font.family: Theme.fontUi
                    font.pixelSize: root.wordmarkSize
                    font.bold: true
                    font.letterSpacing: root.wordmarkLS
                }
                Text {
                    text: qsTr("ESCAPE")
                    color: Theme.gold
                    font.family: Theme.fontUi
                    font.pixelSize: root.wordmarkSize
                    font.bold: true
                    font.letterSpacing: root.wordmarkLS
                }
            }
            Text {
                text: root.version
                color: Theme.dim
                font.family: root.versionFont
                font.pixelSize: root.versionSize
                font.letterSpacing: root.versionLS
            }
        }
    }
}