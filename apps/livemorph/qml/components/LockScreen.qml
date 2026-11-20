import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import QtQuick.Window
import LiveMorph

Item {
    id: root
    anchors.fill: parent
    visible: App.showLockScreen
    z: Theme.zLock
    focus: visible
    Accessible.role: Accessible.Dialog
    Accessible.name: App.lockTitle.length ? App.lockTitle : qsTr("Session locked")

    property var previousFocus: null
    property bool creditTopUpOpen: false
    readonly property bool creditsLock: App.lockReason === AppController.Credits

    function moveFocusForward() {
        if (primaryAction.activeFocus) {
            if (secondaryAction.visible)
                secondaryAction.forceActiveFocus()
            else if (dismissAction.visible)
                dismissAction.forceActiveFocus()
            else
                primaryAction.forceActiveFocus()
        } else if (secondaryAction.activeFocus) {
            if (dismissAction.visible)
                dismissAction.forceActiveFocus()
            else
                primaryAction.forceActiveFocus()
        } else {
            primaryAction.forceActiveFocus()
        }
    }

    function moveFocusBackward() {
        if (primaryAction.activeFocus) {
            if (dismissAction.visible)
                dismissAction.forceActiveFocus()
            else if (secondaryAction.visible)
                secondaryAction.forceActiveFocus()
        } else if (secondaryAction.activeFocus) {
            primaryAction.forceActiveFocus()
        } else if (dismissAction.activeFocus) {
            if (secondaryAction.visible)
                secondaryAction.forceActiveFocus()
            else
                primaryAction.forceActiveFocus()
        }
    }

    Keys.onTabPressed: function(event) {
        root.moveFocusForward()
        event.accepted = true
    }
    Keys.onBacktabPressed: function(event) {
        root.moveFocusBackward()
        event.accepted = true
    }

    onVisibleChanged: {
        if (visible) {
            previousFocus = Window.window ? Window.window.activeFocusItem : null
            Qt.callLater(primaryAction.forceActiveFocus)
        } else if (previousFocus && !creditTopUpOpen) {
            var target = previousFocus
            previousFocus = null
            if (target)
                Qt.callLater(target.forceActiveFocus)
        }
    }

    MouseArea {
        anchors.fill: parent
        enabled: root.visible
        onPressed: function(mouse) { mouse.accepted = true }
        onClicked: function(mouse) { mouse.accepted = true }
        onWheel: function(wheel) { wheel.accepted = true }
    }

    Rectangle {
        anchors.fill: parent
        color: Colors.surfaceBase

        Honeycomb {
            anchors.fill: parent
            cellSize: Theme.honeycombCellLg
            cellSize2: Theme.honeycombCellLg * 3
            cellSize2Alpha: 0.32
            lineColor: Colors.honeycombOnBlack
            focusX: width * 0.32
            focusY: height * 0.5
            fadeRadius: Math.max(width, height) * 0.82
            sparkleEvery: 23
            emphasisEvery: 7
            constellationEvery: 47
            depthEvery: 13
            circuitEvery: 19
        }

        Rectangle {
            anchors.centerIn: parent
            width: Math.min(parent.width - 64, 820)
            height: Math.min(parent.height - 64, 460)
            color: Colors.raised95
            border.color: Colors.surfaceBorderStrong
            border.width: 1
            radius: Theme.radiusLg
            clip: true

            Rectangle {
                anchors.left: parent.left
                anchors.top: parent.top
                width: 96
                height: 2
                color: Colors.accent
                z: Theme.zLocal2
            }

            CornerTicks {
                anchors.fill: parent
                inset: 10
                tickSize: 12
                thickness: 1
                color: Colors.accent40
                z: Theme.zLocal2
            }

            RowLayout {
                anchors.fill: parent
                anchors.margins: 32
                spacing: 32

                Item {
                                    visible: parent.width > 620
                    Layout.preferredWidth: 290
                    Layout.fillHeight: true

                    HexSculpture {
                        anchors.centerIn: parent
                        anchors.verticalCenterOffset: -20
                        size: 260
                        illuminated: !root.creditsLock
                    }

                    Text {
                        anchors.horizontalCenter: parent.horizontalCenter
                        anchors.bottom: parent.bottom
                        anchors.bottomMargin: 22
                        text: root.creditsLock ? qsTr("CREDIT GATE / 03") : qsTr("SECURE SESSION / LOCKED")
                        color: Colors.textMuted
                        font.family: Theme.fontLabel.family; font.pixelSize: Theme.fontLabel.pixelSize; font.weight: Theme.fontLabel.weight
                        font.letterSpacing: 1.2
                    }
                }

                Rectangle {
                    visible: parent.width > 620
                    Layout.preferredWidth: 1
                    Layout.fillHeight: true
                    color: Colors.surfaceBorder
                }

                Flickable {
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    contentWidth: width
                    contentHeight: lockColumn.implicitHeight
                    clip: true
                    boundsBehavior: Flickable.StopAtBounds
                    ScrollBar.vertical: StyledScrollBar { thin: true }

                    ColumnLayout {
                        id: lockColumn
                        width: parent.width
                        spacing: Theme.spacingLg

                        Item { Layout.preferredHeight: 4 }

                        HexBadge {
                            size: 52
                            iconName: root.creditsLock ? "coins" : "lock"
                            iconSize: 22
                            lineWidth: 1.5
                            lineColor: Colors.accent40
                            fillColor: Colors.accent10
                            iconColor: Colors.accent
                        }

                        Column {
                            Layout.fillWidth: true
                            spacing: Theme.spacingSm
                            Text {
                                text: root.creditsLock ? qsTr("SESSION PAUSED") : qsTr("ACCESS RESTRICTED")
                                color: Colors.textMuted
                                font.family: Theme.fontLabel.family; font.pixelSize: Theme.fontLabel.pixelSize; font.weight: Theme.fontLabel.weight
                                font.letterSpacing: 1.3
                            }
                            Text {
                                width: parent.width
                                text: App.lockTitle.length ? App.lockTitle : root.creditsLock ? qsTr("Your next reality needs credits") : qsTr("Session locked")
                                color: Colors.textPrimary
                                font.family: Theme.fontHeadline.family; font.pixelSize: Theme.fontHeadline.pixelSize; font.weight: Theme.fontHeadline.weight
                                font.letterSpacing: -0.6
                                wrapMode: Text.WordWrap
                                maximumLineCount: 3
                                elide: Text.ElideRight
                            }
                        }

                        Text {
                            Layout.fillWidth: true
                            wrapMode: Text.WordWrap
                            text: App.lockMessage.length
                                  ? App.lockMessage
                                  : root.creditsLock
                                    ? qsTr("Top up to return to the stage. Your character and workspace are waiting.")
                                    : qsTr("This session was locked for security. Sign in again to continue.")
                            color: Colors.textSecondary
                            font.family: Theme.fontUi.family; font.pixelSize: Theme.fontUi.pixelSize
                            lineHeight: 1.45
                        }

                        Item { Layout.preferredHeight: 4 }

                        PrimaryButton {
                            id: primaryAction
                            Layout.fillWidth: true
                            Layout.preferredHeight: 48
                            iconName: root.creditsLock ? "coins" : "log-in"
                            text: root.creditsLock ? qsTr("Top up and return to the stage") : qsTr("Return to secure sign in")
                            onClicked: {
                                if (root.creditsLock) {
                                    root.creditTopUpOpen = true
                                    App.showLockScreen = false
                                    App.openBuyCredits()
                                } else {
                                    App.dismissLockScreen()
                                    Auth.signOut()
                                }
                            }
                        }

                        GhostButton {
                            id: secondaryAction
                            Layout.fillWidth: true
                            visible: root.creditsLock
                            text: qsTr("Sign in with a different account")
                            onClicked: {
                                root.creditTopUpOpen = false
                                App.dismissLockScreen()
                                Auth.signOut()
                            }
                        }

                        GhostButton {
                            id: dismissAction
                            Layout.fillWidth: true
                            text: qsTr("Dismiss this notice")
                            visible: App.lockDismissable
                            onClicked: App.dismissLockScreen()
                        }

                        Row {
                            spacing: Theme.spacingSm
                            Hexagon {
                                size: 8
                                lineWidth: 0
                                fillColor: Colors.textMuted
                                anchors.verticalCenter: parent.verticalCenter
                            }
                            Text {
                                text: qsTr("Your local workspace remains on this device")
                                color: Colors.textMuted
                                font.family: Theme.fontSmall.family; font.pixelSize: Theme.fontSmall.pixelSize
                                anchors.verticalCenter: parent.verticalCenter
                            }
                        }
                    }
                }
            }
        }
    }

    Connections {
        target: App
        function onShowBuyCreditsChanged() {
            if (root.creditTopUpOpen && !App.showBuyCredits && !App.showLockScreen) {
                root.creditTopUpOpen = false
                App.showLockScreen = true
            }
        }
    }

    Connections {
        target: Auth
        function onCreditBalanceChanged() {
            if (root.creditTopUpOpen && Auth.creditBalance + Auth.bonusBalance > 0) {
                root.creditTopUpOpen = false
                App.showBuyCredits = false
                App.showLockScreen = false
            }
        }
    }
}
