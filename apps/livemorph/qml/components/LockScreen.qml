import QtQuick
import LiveMorph

Item {
    id: root
    anchors.fill: parent
    visible: App.showLockScreen
    z: Theme.zLock

    // Eat all pointer input while locked — without this, hit-testing falls
    // through the overlay and the dashboard controls stay clickable.
    MouseArea {
        anchors.fill: parent
        enabled: root.visible
        onPressed: function(mouse) { mouse.accepted = true }
    }

    Rectangle {
        anchors.fill: parent
        color: Colors.surfaceBase

        Honeycomb {
            anchors.fill: parent
            cellSize: Theme.honeycombCellLg
            cellSize2: Theme.honeycombCellLg * 3
            cellSize2Alpha: 0.45
            lineColor: Colors.honeycombOnBlack
            opacity: 0.9
            focusX: width / 2
            focusY: height / 2
            fadeRadius: Math.max(width, height) * 0.8
            glowAlpha: 0.045
            sparkleEvery: 23
            sparkleAlpha: 0.07
            constellationEvery: 53
            constellationAlpha: 0.2
            featureHex: 170
            featureHexAlpha: 0.5
        }

        // Framed card behind the lock content (signature panel chrome)
        Rectangle {
            anchors.centerIn: parent
            width: Math.min(parent.width - 64, 480)
            height: lockCol.implicitHeight + 64
            radius: Theme.radiusLg
            color: Colors.raised95
            border.color: Colors.surfaceBorder
            border.width: 1
            clip: true
            Honeycomb {
                anchors.fill: parent
                cellSize: Theme.honeycombCell
                lineColor: Colors.honeycombLineFaint
                opacity: 0.6
            }
            CornerTicks {
                anchors.fill: parent
                inset: 8
                tickSize: 8
                thickness: 1.5
                color: Colors.accent50
            }
        }

        Column {
            id: lockCol
            anchors.centerIn: parent
            spacing: 18
            width: Math.min(parent.width - 128, 400)

            Item {
                width: 64; height: 64
                anchors.horizontalCenter: parent.horizontalCenter
                BrandMark {
                    anchors.centerIn: parent
                    size: 60
                    letter: ""
                    lineWidth: 2
                    lineColor: Colors.accent
                    fillColor: Colors.accent10
                    letterColor: Colors.accent
                }
                Icon {
                    anchors.centerIn: parent
                    name: "lock"
                    size: 22
                    color: Colors.accent
                }
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: App.lockTitle.length ? App.lockTitle : qsTr("SESSION LOCKED")
                color: Colors.accent
                font.family: Theme.fontHeadline.family
                font.pixelSize: Theme.fontHeadline.pixelSize
                font.weight: Theme.fontHeadline.weight
                font.letterSpacing: 2
            }

            Text {
                width: parent.width
                wrapMode: Text.WordWrap
                horizontalAlignment: Text.AlignHCenter
                text: App.lockMessage.length
                      ? App.lockMessage
                      : qsTr("This session was locked for security.\nSign in again to continue.")
                color: Colors.textSecondary
                font.pixelSize: 12
                lineHeight: 1.4
            }

            PrimaryButton {
                anchors.horizontalCenter: parent.horizontalCenter
                text: App.lockReason === AppController.Credits ? qsTr("BUY MORE CREDITS") : qsTr("RETURN TO LOGIN")
                onClicked: {
                    if (App.lockReason === AppController.Credits) {
                        App.dismissLockScreen()
                        App.openBuyCredits()
                    } else {
                        App.dismissLockScreen()
                        Auth.signOut()
                    }
                }
            }

            GhostButton {
                anchors.horizontalCenter: parent.horizontalCenter
                visible: App.lockReason === AppController.Credits
                text: qsTr("RETURN TO LOGIN")
                onClicked: {
                    App.dismissLockScreen()
                    Auth.signOut()
                }
            }

            GhostButton {
                anchors.horizontalCenter: parent.horizontalCenter
                text: qsTr("Dismiss")
                visible: App.lockDismissable
                onClicked: App.dismissLockScreen()
            }
        }
    }
}
