import QtQuick
import QtQuick.Controls
import SmokeScreen

// #abuseReportModal — z 650.
ModalBase {
    open: App.showAbuseReport
    modalZ: 650
    centered: true
    closeOnBackdrop: true
    onClose: App.showAbuseReport = false

    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: "🚨"
        font.pixelSize: 40
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("REPORT ABUSE")
        color: Theme.gold
        font.family: Theme.fontUi
        font.pixelSize: 20
        font.weight: Font.Bold
        font.letterSpacing: 3
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("HELP US KEEP SMOKE SCREEN SAFE")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 9
        font.letterSpacing: 1.5
        bottomPadding: 8
    }
    Rectangle {
        width: parent.width
        height: 50
        radius: Theme.radius
        color: Theme.s2
        border.width: 1
        border.color: Theme.border
        Text {
            anchors.centerIn: parent
            width: parent.width - 24
            text: qsTr("Describe the issue you'd like to report. Our support team will review it and follow up if needed.")
            color: Theme.text
            font.family: Theme.fontMono
            font.pixelSize: 10
            lineHeight: 1.85
            wrapMode: Text.WordWrap
        }
    }
    TextArea {
        id: abuseMsg
        width: parent.width
        height: 100
        color: Theme.text
        font.family: Theme.fontMono
        font.pixelSize: 11
        placeholderText: qsTr("Describe the issue…")
        placeholderTextColor: Theme.dim2
        wrapMode: TextEdit.Wrap
        background: Rectangle {
            radius: Theme.radius
            color: Theme.s2
            border.width: 1
            border.color: abuseMsg.activeFocus ? Theme.goldD : Theme.border
        }
    }
    Row {
        width: parent.width
        spacing: 8
        Rectangle {
            width: (parent.width - 8) * 0.65
            height: 38
            radius: Theme.radius
            color: Theme.gold
            Text {
                anchors.centerIn: parent
                text: qsTr("SUBMIT REPORT")
                color: Theme.bg
                font.family: Theme.fontUi
                font.pixelSize: 14
                font.weight: Font.Bold
                font.letterSpacing: 2
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: {
                    App.submitAbuseReport(abuseMsg.text)
                    App.showAbuseReport = false
                }
            }
        }
        Rectangle {
            width: (parent.width - 8) * 0.35
            height: 38
            radius: Theme.radius
            color: "transparent"
            border.width: 1
            border.color: Theme.border
            Text {
                anchors.centerIn: parent
                text: qsTr("✕ Cancel")
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 10
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: App.showAbuseReport = false
            }
        }
    }
}
