import LiveEscape
import QtQuick
import QtQuick.Layouts

Item {
    id: root

    property bool open: false
    property int modalZ: 500
    property color backdropColor: Theme.scrim
    property real backdropOpacity: 1
    property bool closeOnBackdrop: true
    property real panelWidth: Math.min(parent.width * 0.9, 440)
    property real panelImplicitHeight: contentCol.implicitHeight + 40
    property color panelColor: Theme.s1
    property color panelBorderColor: Theme.goldDim
    property real panelBorderWidth: 1
    property real panelRadius: 12

    signal close()

    anchors.fill: parent
    visible: open
    z: modalZ
    focus: open
    Keys.onEscapePressed: {
        if (root.closeOnBackdrop)
            root.close();

    }
    onOpenChanged: {
        if (open) {
            forceActiveFocus();
        }
    }

    Rectangle {
        anchors.fill: parent
        color: root.backdropColor
        opacity: root.backdropOpacity

        MouseArea {
            anchors.fill: parent
            onClicked: {
                if (root.closeOnBackdrop)
                    root.close();

            }
        }

    }

    Rectangle {
        id: panel

        default property alias content: contentCol.data

        width: root.panelWidth
        implicitHeight: root.panelImplicitHeight
        anchors.centerIn: parent
        radius: root.panelRadius
        color: root.panelColor
        border.color: root.panelBorderColor
        border.width: root.panelBorderWidth
        clip: true

        MouseArea {
            anchors.fill: parent
        }

        Column {
            id: contentCol

            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.margins: 24
            spacing: 12
        }

    }

}
