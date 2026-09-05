import QtQuick
import QtQuick.Controls
import LiveMorph

Dialog {
    id: root
    property string message: ""
    property string confirmText: "Confirm"
    property string cancelText: "Cancel"
    modal: true
    anchors.centerIn: parent
    width: 400
    title: ""

    background: Rectangle {
        color: Colors.surfaceOverlay
        border.color: Colors.surfaceBorder
        radius: Theme.radiusLg
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 1
            color: Colors.insetHighlight
            radius: Theme.radiusLg
        }
    }

    overlay.modal: Rectangle {
        color: Colors.overlayScrim
    }

    header: Item {
        height: 48
        width: parent.width
        Text {
            anchors.left: parent.left
            anchors.verticalCenter: parent.verticalCenter
            anchors.leftMargin: 20
            text: root.title.length ? root.title : "Confirm"
            color: Colors.textPrimary
            font.pixelSize: 15
            font.weight: Font.DemiBold
        }
    }

    contentItem: Text {
        text: root.message
        color: Colors.textSecondary
        wrapMode: Text.WordWrap
        font.pixelSize: 13
        lineHeight: 1.4
        padding: 8
        leftPadding: 16
        rightPadding: 16
    }

    footer: DialogButtonBox {
        background: Rectangle {
            color: Colors.surfaceRaised
            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                height: 1
                color: Colors.surfaceBorder
            }
        }
        alignment: Qt.AlignRight
        PrimaryButton {
            text: root.confirmText
            DialogButtonBox.buttonRole: DialogButtonBox.AcceptRole
        }
        GhostButton {
            text: root.cancelText
            DialogButtonBox.buttonRole: DialogButtonBox.RejectRole
        }
    }
}
