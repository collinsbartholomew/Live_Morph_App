import QtQuick
import LiveMorph

/**
 * BrandingFooter:
 *   single horizontal row: "Built by" + logo mark + "Omega Revelation PLC" link
 *   → https://omegarevelation.com
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
           font.pixelSize: Theme.fontMonoTiny.pixelSize
           anchors.verticalCenter: parent.verticalCenter
       }

       // 16px hex logo mark
       Hexagon {
           size: 16
           lineWidth: 1.5
           lineColor: Colors.accent
           fillColor: Colors.accent
           anchors.verticalCenter: parent.verticalCenter
           Text {
               anchors.centerIn: parent
               text: "O"
               color: Colors.textOnAccent
               font.pixelSize: Theme.fontMicro.pixelSize
               font.bold: true
           }
       }

       Text {
           text: qsTr("Omega Revelation PLC")
           color: brandMa.containsMouse || activeFocus ? Colors.accent : Colors.textMuted
           font.pixelSize: Theme.fontMonoTiny.pixelSize
           font.underline: brandMa.containsMouse || activeFocus
           anchors.verticalCenter: parent.verticalCenter
           activeFocusOnTab: true
           Accessible.role: Accessible.Link
           Accessible.name: qsTr("Omega Revelation PLC website")
           Keys.onReturnPressed: Backend.openExternal(Constants.urlSite)
           Keys.onSpacePressed: Backend.openExternal(Constants.urlSite)

           MouseArea {
               id: brandMa
               anchors.fill: parent
               hoverEnabled: true
               cursorShape: Qt.PointingHandCursor
               onClicked: Backend.openExternal(Constants.urlSite)
           }
       }
   }
}
