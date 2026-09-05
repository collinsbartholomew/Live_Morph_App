import QtQuick
import LiveMorph

Rectangle {
    id: root
    property string text: "Idle"
    property string status: "idle"

    readonly property color accentColor: {
        if (status === "error" || status === "insufficient_credits")
            return Colors.statusError
        if (status === "connected" || status === "live" || status === "generating")
            return Colors.statusSuccess
        if (status === "connecting" || status === "cooldown")
            return Colors.statusWarning
        return Colors.textMuted
    }

    implicitWidth: row.implicitWidth + 16
    implicitHeight: 26
    radius: Theme.radiusFull
    color: Qt.rgba(accentColor.r, accentColor.g, accentColor.b, 0.10)
    border.color: Qt.rgba(accentColor.r, accentColor.g, accentColor.b, 0.28)
    border.width: 1

    Row {
        id: row
        anchors.centerIn: parent
        spacing: 7
        Rectangle {
            width: 7; height: 7
            radius: 3.5
            color: root.accentColor
            anchors.verticalCenter: parent.verticalCenter
            SequentialAnimation on opacity {
                running: (root.status === "connected" || root.status === "live"
                         || root.status === "generating" || root.status === "connecting")
                         && Qt.application.state === Qt.ApplicationActive
                loops: Animation.Infinite
                NumberAnimation { from: 1; to: 0.3; duration: 900 }
                NumberAnimation { from: 0.3; to: 1; duration: 900 }
            }
        }
        Text {
            text: root.text
            color: root.accentColor
            font.pixelSize: 11
            font.weight: Font.DemiBold
            font.letterSpacing: 0.3
            anchors.verticalCenter: parent.verticalCenter
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
        text: qsTr("Session: %1").arg(root.status)
        shown: ma.containsMouse
    }
}
