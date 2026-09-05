import QtQuick
import QtQuick.Layouts
import LiveMorph

/**
 * BrandingFooter — LiveMorph legal links and product line.
 */
Item {
    id: root
    implicitHeight: col.implicitHeight

    Column {
        id: col
        anchors.horizontalCenter: parent.horizontalCenter
        spacing: 10
        width: parent.width

        Row {
            anchors.horizontalCenter: parent.horizontalCenter
            spacing: 16
            Repeater {
                model: [
                    { label: qsTr("Terms of Service"), url: Constants.urlTerms },
                    { label: qsTr("Privacy Policy"), url: Constants.urlPrivacy },
                    { label: qsTr("Acceptable Use"), url: Constants.urlAup }
                ]
                Text {
                    text: modelData.label
                    color: Colors.accent
                    opacity: 0.75
                    font.pixelSize: 11
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        hoverEnabled: true
                        onEntered: parent.opacity = 1
                        onExited: parent.opacity = 0.75
                        onClicked: Backend.openExternal(modelData.url)
                    }
                }
            }
        }

        Text {
            anchors.horizontalCenter: parent.horizontalCenter
            text: qsTr("By continuing you agree to LiveMorph’s Terms, Privacy Policy, and Acceptable Use Policy.")
            color: Colors.textMuted
            font.pixelSize: 10
            horizontalAlignment: Text.AlignHCenter
            wrapMode: Text.WordWrap
            width: Math.min(parent.width, 420)
        }

        Text {
            anchors.horizontalCenter: parent.horizontalCenter
            text: qsTr("LiveMorph · Live AI character transformation")
            color: Colors.textMuted
            font.pixelSize: 10
            opacity: 0.7
        }
    }
}
