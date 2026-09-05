import QtQuick
import QtQuick.Controls
import QtMultimedia
import LiveMorph

/**
 * Picture-in-picture of local camera while morph Stage is active.
 */
Rectangle {
    id: root
    radius: Theme.radiusMd
    color: "#000000"
    border.color: Colors.surfaceBorder
    border.width: 1
    clip: true
    visible: Camera.isActive && Session.isActive
    opacity: visible ? 1 : 0
    Behavior on opacity { NumberAnimation { duration: Theme.motionNormal } }

    VideoOutput {
        id: pipOut
        anchors.fill: parent
        anchors.margins: 1
        fillMode: VideoOutput.PreserveAspectCrop
        transform: Scale {
            origin.x: pipOut.width / 2
            xScale: Camera.mirrored ? -1 : 1
        }
    }
    Binding {
        target: pipOut
        property: "videoSink"
        value: Camera.videoSink
        when: Camera.videoSink !== null && root.visible
    }

    Rectangle {
        anchors.left: parent.left
        anchors.top: parent.top
        anchors.margins: 6
        width: lab.implicitWidth + 10
        height: 16
        radius: 3
        color: "#000000aa"
        Text {
            id: lab
            anchors.centerIn: parent
            text: "YOU"
            color: Colors.textPrimary
            font.pixelSize: 9
            font.weight: Font.Bold
            font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
            font.letterSpacing: 1.2
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
        text: "Your camera (PiP)"
        shown: ma.containsMouse
    }
}
