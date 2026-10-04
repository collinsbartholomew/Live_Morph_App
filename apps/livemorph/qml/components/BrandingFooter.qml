import QtQuick
import LiveMorph

/**
 * BrandingFooter (Electron `ce`, ground truth):
 *   single horizontal row: "Built by" + 14px logo (opacity .5)
 *   + "TheTools Hub" link (10px muted, hover accent)
 *   → https://linktr.ee/thetoolshub
 * The legal links live in the auth terms paragraph above (Electron shows
 * the terms ONCE — the old footer duplicated them).
 */
Item {
    id: root
    implicitHeight: 16

    Row {
        anchors.horizontalCenter: parent.horizontalCenter
        spacing: 5

        Text {
            text: qsTr("Built by")
            color: Colors.textMuted
            font.pixelSize: 10
            anchors.verticalCenter: parent.verticalCenter
        }

        // 14px logo mark (opacity .5)
        Rectangle {
            width: 14
            height: 14
            radius: 2
            color: Colors.accent
            opacity: 0.5
            anchors.verticalCenter: parent.verticalCenter
            Text {
                anchors.centerIn: parent
                text: "T"
                color: Colors.white
                font.pixelSize: 9
                font.bold: true
            }
        }

        Text {
            text: qsTr("TheTools Hub")
            color: brandMa.containsMouse ? Colors.accent : Colors.textMuted
            font.pixelSize: 10
            anchors.verticalCenter: parent.verticalCenter
            Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }

            MouseArea {
                id: brandMa
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: Backend.openExternal("https://linktr.ee/thetoolshub")
            }
        }
    }
}
