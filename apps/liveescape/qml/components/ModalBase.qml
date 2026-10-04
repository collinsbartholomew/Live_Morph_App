import Qt5Compat.GraphicalEffects
import LiveEscape
import QtQuick
import QtQuick.Layouts

Item {
    id: root

    property bool open: false
    property int modalZ: 500
    property color backdropColor: Qt.rgba(4/255, 4/255, 10/255, 0.97)
    property real backdropOpacity: 1
    property bool closeOnBackdrop: true
    property real panelWidth: Math.min(parent.width * 0.92, 460)
    property real panelImplicitHeight: contentCol.implicitHeight + 60
    property alias contentCol: contentCol
    property color panelColor: Theme.s1
    property color panelBorderColor: Theme.goldD
    property real panelBorderWidth: 1
    property real panelRadius: 12
    property real panelGlow: 80
    property int slideUpDuration: 350
    property string accessibleTitle: ""
    property string accessibleDescription: ""

    signal close()

    anchors.fill: parent
    visible: open
    z: modalZ
    focus: open
    Keys.onEscapePressed: { if (open) root.close(); }
    onOpenChanged: {
        if (open) {
            forceActiveFocus();
        }
    }

    Accessible.role: Accessible.Dialog
    Accessible.name: root.accessibleTitle
    Accessible.description: root.accessibleDescription

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
        Behavior on opacity { NumberAnimation { duration: Theme.motionNormal } }
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

        Rectangle {
            anchors.fill: parent
            anchors.margins: -20
            radius: parent.radius + 20
            color: "transparent"
            z: -1
            visible: root.panelGlow > 0
            layer.enabled: true
            layer.effect: DropShadow {
                horizontalOffset: 0
                verticalOffset: 0
                radius: 80
                samples: 80
                color: Qt.rgba(232/255, 197/255, 71/255, 0.07)
                transparentBorder: true
            }
        }

        opacity: root.open ? 1 : 0
        transform: Translate {
            id: panelSlide
            y: root.open ? 0 : 24
            Behavior on y { NumberAnimation { duration: root.slideUpDuration; easing.type: Easing.OutCubic } }
        }
        Behavior on opacity { NumberAnimation { duration: root.slideUpDuration; easing.type: Easing.OutCubic } }

        MouseArea {
            anchors.fill: parent
        }

        Column {
            id: contentCol

            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.leftMargin: 36
            anchors.rightMargin: 36
            anchors.topMargin: 30
            anchors.bottomMargin: 30
            spacing: 12
        }
    }
}
