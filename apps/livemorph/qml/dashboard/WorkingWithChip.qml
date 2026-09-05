import QtQuick
import LiveMorph

Rectangle {
    visible: Session.activeCharacterId.length > 0
             || Session.activeCharacterName.length > 0
             || Session.activePrompt.length > 0
    implicitWidth: row.implicitWidth + 16
    implicitHeight: 24
    radius: 12
    color: Colors.surfaceOverlay
    border.color: Colors.surfaceBorder
    border.width: 1

    readonly property string label: {
        if (Session.activeCharacterName.length)
            return Session.activeCharacterName
        if (Session.activeCharacterId.length)
            return Session.activeCharacterId
        if (Session.activePrompt.length > 28)
            return Session.activePrompt.substring(0, 28) + "…"
        return Session.activePrompt
    }

    Row {
        id: row
        anchors.centerIn: parent
        spacing: 6
        Text {
            text: "Working with"
            color: Colors.textMuted
            font.pixelSize: 10
            anchors.verticalCenter: parent.verticalCenter
        }
        Text {
            text: label
            color: Colors.textPrimary
            font.pixelSize: 10
            font.weight: Font.Medium
            anchors.verticalCenter: parent.verticalCenter
            elide: Text.ElideRight
            width: Math.min(implicitWidth, 160)
        }
    }

    MouseArea {
        id: ma
        anchors.fill: parent
        hoverEnabled: true
        acceptedButtons: Qt.NoButton
    }
    Tooltip {
        anchors.top: parent.bottom
        anchors.topMargin: 6
        anchors.horizontalCenter: parent.horizontalCenter
        text: "Active character / prompt for morph"
        shown: ma.containsMouse
    }
}
