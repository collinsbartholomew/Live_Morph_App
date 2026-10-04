import QtQuick
import SmokeScreen

// #forceUpdateModal — z 9999. Blocking.
Item {
    anchors.fill: parent
    visible: App.showForceUpdate
    z: 9999

    Rectangle {
        anchors.fill: parent
        color: Qt.rgba(4/255, 4/255, 10/255, 0.99)
    }

    Column {
        anchors.centerIn: parent
        width: Math.min(parent.width * 0.92, 420)
        spacing: 12

        Text {
            width: parent.width
            horizontalAlignment: Text.AlignHCenter
            text: "🔄"
            font.pixelSize: 48
        }
        Text {
            width: parent.width
            horizontalAlignment: Text.AlignHCenter
            text: qsTr("UPDATE REQUIRED")
            color: Theme.gold
            font.family: Theme.fontUi
            font.pixelSize: 20
            font.weight: Font.Bold
            font.letterSpacing: 3
        }
        Text {
            width: parent.width
            horizontalAlignment: Text.AlignHCenter
            text: qsTr("A NEW VERSION OF SMOKE SCREEN IS AVAILABLE")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 9
            font.letterSpacing: 1.5
        }
        Rectangle {
            width: parent.width
            height: bodyCol.implicitHeight + 28
            radius: Theme.radius
            color: Theme.s2
            border.width: 1
            border.color: Theme.border
            Column {
                id: bodyCol
                anchors.centerIn: parent
                width: parent.width - 32
                spacing: 8
                Text {
                    width: parent.width
                    textFormat: Text.RichText
                    text: qsTr("Your current version (<b>%1</b>) is no longer supported.").arg(App.appVersion)
                    color: Theme.text
                    font.family: Theme.fontMono
                    font.pixelSize: 10
                    lineHeight: 1.85
                    wrapMode: Text.WordWrap
                }
                Text {
                    width: parent.width
                    textFormat: Text.RichText
                    text: qsTr("A new version (<b style='color:#3fe8b8'>%1</b>) is available with important improvements and fixes.").arg(App.forceUpdateVersion)
                    color: Theme.text
                    font.family: Theme.fontMono
                    font.pixelSize: 10
                    lineHeight: 1.85
                    wrapMode: Text.WordWrap
                }
                Text {
                    width: parent.width
                    text: qsTr("⚠️ You must update to continue using Smoke Screen.")
                    color: Theme.red
                    font.family: Theme.fontMono
                    font.pixelSize: 10
                    font.weight: Font.Bold
                    lineHeight: 1.85
                    wrapMode: Text.WordWrap
                }
            }
        }
        Rectangle {
            width: parent.width
            height: 40
            radius: Theme.radius
            color: Theme.gold
            opacity: App.downloading ? 0.6 : 1
            Text {
                anchors.centerIn: parent
                text: App.downloading
                      ? qsTr("DOWNLOADING… %1%").arg(App.downloadProgress)
                      : qsTr("⬇ DOWNLOAD UPDATE")
                color: Theme.bg
                font.family: Theme.fontUi
                font.pixelSize: 15
                font.weight: Font.Bold
                font.letterSpacing: 2
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                enabled: !App.downloading
                onClicked: {
                    if (App.forceUpdateUrl.length > 0)
                        App.openExternal(App.forceUpdateUrl)
                    else
                        App.downloadForceUpdate()
                }
            }
        }
        Text {
            width: parent.width
            horizontalAlignment: Text.AlignHCenter
            textFormat: Text.RichText
            text: qsTr("After downloading, close this app and install the new version.<br>Need help? <a href='https://t.me/smokescreenapp' style='color:#e8c547'>Chat us on Telegram</a>")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 9
            lineHeight: 1.7
            onLinkActivated: (link) => App.openExternal(link)
        }
    }
}
