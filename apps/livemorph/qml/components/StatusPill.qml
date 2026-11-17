import QtQuick
import LiveMorph

/**
 * Obsidian Hex status pill: full-radius pill with semantic faint fill + border
 * and a tiny hex status glyph. API: text, status (idle|connecting|connected|
 * live|generating|cooldown|error|insufficient_credits).
 */
Rectangle {
    id: root
    // Empty text falls back to the translated status label, so a caller that
    // only sets `status` never shows a stale hardcoded "Idle".
    property string text: ""
    property string status: "idle"
    readonly property string effectiveText: text.length ? text : statusLabel

    readonly property bool isError: status === "error" || status === "insufficient_credits"
    readonly property bool isActive: status === "connected" || status === "live"
                                     || status === "generating"
    readonly property bool isPending: status === "connecting" || status === "cooldown"

    readonly property color accentColor: isError ? Colors.statusError
        : isActive ? Colors.statusSuccess
        : isPending ? Colors.statusWarning
        : Colors.textMuted

    // Translated status label (never show the raw enum string to the user).
    readonly property string statusLabel: {
        switch (root.status) {
        case "idle": return qsTr("Idle")
        case "connecting": return qsTr("Connecting")
        case "connected": return qsTr("Connected")
        case "live": return qsTr("Live")
        case "generating": return qsTr("Generating")
        case "cooldown": return qsTr("Cooldown")
        case "error": return qsTr("Error")
        case "insufficient_credits": return qsTr("Insufficient credits")
        default: return root.status
        }
    }

    implicitWidth: row.implicitWidth + 20
    implicitHeight: 24
    // Long/server-derived status text must truncate, never push the pill (and
    // the TopBar cluster behind it) out of place.
    clip: true
    radius: Theme.radiusFull
    z: ma.containsMouse ? Theme.zLocal5 : Theme.zLocal0
    color: isError ? Colors.errorFaintBg
        : isActive ? Colors.successFaintBg
        : isPending ? Colors.warningFaintBg
        : Colors.overlay30
    border.color: isError ? Colors.errorFaintBorder
        : isActive ? Colors.successFaintBorder
        : isPending ? Colors.warningFaintBorder
        : Colors.surfaceBorderSubtle
    border.width: 1

    Row {
        id: row
        anchors.centerIn: parent
        spacing: 7
        Hexagon {
            size: 9
            lineWidth: 0
            fillColor: root.accentColor
            anchors.verticalCenter: parent.verticalCenter
        }
        Text {
            text: root.effectiveText
            textFormat: Text.PlainText // status text may carry server-derived error prose
            width: Math.min(implicitWidth, Math.max(0, root.width - 36))
            elide: Text.ElideRight
            color: root.isError ? Colors.statusError
                 : root.isActive ? Colors.statusSuccess
                 : root.isPending ? Colors.statusWarning
                 : Colors.textSecondary
            font.family: Theme.fontCaption.family
            font.pixelSize: Theme.fontCaption.pixelSize
            font.weight: Font.Normal
            font.capitalization: Font.AllUppercase
            font.letterSpacing: Theme.trackingChip
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
        anchors.bottom: parent.top
        anchors.bottomMargin: 6
        anchors.horizontalCenter: parent.horizontalCenter
        text: qsTr("Session: %1").arg(root.statusLabel)
        shown: ma.containsMouse
    }
}
