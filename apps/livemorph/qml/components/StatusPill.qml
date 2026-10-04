import QtQuick
import QtQuick.Controls
import LiveMorph

/**
 * Electron status pill (TopBar KR, ground truth):
 *   px-2 py-1 rounded-sm(4) border transition-colors duration-200
 *   success: border-success/25 bg-success/5 · warning: /25 + /5
 *   error: border-error/30 bg-error/10
 *   idle: border-surface-border-subtle bg-surface-overlay/30
 *   dot 6px · pulse-subtle 2s ease-in-out 1↔0.7
 *   text: font-mono 10px uppercase tracking-label text-text-secondary
 *         (error tone is the only one that colors the text red)
 */
Rectangle {
    id: root
    property string text: "Idle"
    property string status: "idle"

    readonly property bool isError: status === "error" || status === "insufficient_credits"
    readonly property bool isActive: status === "connected" || status === "live"
                                     || status === "generating"
    readonly property bool isPending: status === "connecting" || status === "cooldown"

    readonly property color accentColor: isError ? Colors.statusError
        : isActive ? Colors.statusSuccess
        : isPending ? Colors.statusWarning
        : Colors.textMuted

    implicitWidth: row.implicitWidth + 16
    implicitHeight: 22
    radius: Theme.radiusSm
    color: isError ? Colors.errorFaintBg
        : isActive ? Colors.successFaintBg
        : isPending ? Colors.warningFaintBg
        : "#17171f4d" // surface-overlay/30
    border.color: isError ? Colors.errorFaintBorder
        : isActive ? Colors.successFaintBorder
        : isPending ? Colors.warningFaintBorder
        : Colors.surfaceBorderSubtle
    border.width: 1
    Behavior on color { ColorAnimation { duration: Theme.motionNormal; easing.type: Easing.OutCubic } }
    Behavior on border.color { ColorAnimation { duration: Theme.motionNormal; easing.type: Easing.OutCubic } }

    Row {
        id: row
        anchors.centerIn: parent
        spacing: 7
        Rectangle {
            width: 6; height: 6
            radius: 3
            color: root.accentColor
            anchors.verticalCenter: parent.verticalCenter
            // pulse-subtle: 2s ease-in-out, 1 ↔ 0.7 (Electron never blinks hard)
            SequentialAnimation on opacity {
                running: (root.isActive || root.isPending)
                         && Qt.application.state === Qt.ApplicationActive
                loops: Animation.Infinite
                NumberAnimation { from: 1; to: 0.7; duration: 2000; easing.type: Easing.InOutQuad }
                NumberAnimation { from: 0.7; to: 1; duration: 2000; easing.type: Easing.InOutQuad }
            }
        }
        Text {
            text: root.text
            color: root.isError ? Colors.statusError : Colors.textSecondary
            font.family: Theme.fontMono.family
            font.pixelSize: 10
            font.weight: Font.Medium
            font.capitalization: Font.AllUppercase
            font.letterSpacing: 1.5
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
