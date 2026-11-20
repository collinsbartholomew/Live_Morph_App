import QtQuick
import QtQuick.Controls
import QtQuick.Controls as Controls
import QtQuick.Layouts
import LiveMorph

Dialog {
    id: root
    property string modalId: "upload-consent"
    property bool consentGiven: firstCheck.checked && secondCheck.checked && thirdCheck.checked

    modal: true
    anchors.centerIn: Overlay.overlay ? Overlay.overlay : parent
    width: Math.min(560, (Overlay.overlay ? Overlay.overlay.width : 800) - 48)
    height: Math.min((Overlay.overlay ? Overlay.overlay.height : 800) - 64, 600)
    closePolicy: Popup.NoAutoClose
    padding: 0

    background: Rectangle {
        color: Colors.surfaceOverlay
        border.color: Colors.surfaceBorderStrong
        border.width: 1
        radius: Theme.radiusLg
        clip: true
        Honeycomb {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 150
            cellSize: Theme.honeycombCellLg
            lineColor: Colors.honeycombLineFaint
            focusX: width * 0.85
            focusY: 0
            fadeRadius: width * 0.6
            depthEvery: 9
        }
        CornerTicks {
            anchors.fill: parent
            inset: 10
            tickSize: 10
            thickness: 1
            color: Colors.accent40
        }
    }

    Connections {
        target: App
        function onModalEscapeRequested(id) {
            if (root.visible && id === root.modalId)
                root.reject()
        }
    }

    contentItem: ColumnLayout {
        spacing: 0

        Column {
            Layout.fillWidth: true
            Layout.margins: 28
            Layout.bottomMargin: 20
            spacing: Theme.spacingMd

            RowLayout {
                width: parent.width
                spacing: Theme.spacingLg
                HexBadge {
                    size: 48
                    iconName: "shield-check"
                    iconSize: 21
                    lineWidth: 1.5
                    lineColor: Colors.accent40
                    fillColor: Colors.accent10
                    iconColor: Colors.accent
                    Layout.alignment: Qt.AlignTop
                }
                Column {
                    Layout.fillWidth: true
                    spacing: Theme.spacingXs
                    Text {
                                        text: qsTr("RESPONSIVE CREATION / CONSENT")
                                        color: Colors.textMuted
                                        font.family: Theme.fontLabel.family; font.pixelSize: Theme.fontLabel.pixelSize; font.weight: Theme.fontLabel.weight
                                        font.letterSpacing: 1.2
                    }
                    Text {
                        width: parent.width
                        text: qsTr("Create responsibly")
                        color: Colors.textPrimary
                        font.family: Theme.fontHeadline.family; font.pixelSize: Theme.fontHeadline.pixelSize; font.weight: Theme.fontHeadline.weight
                        font.letterSpacing: -0.6
                        wrapMode: Text.WordWrap
                    }
                }
            }

            Text {
                width: parent.width
                text: qsTr("Before your first upload, confirm these standards. This acknowledgment is remembered on this device, and you remain responsible for every image you add.")
                color: Colors.textSecondary
                font.family: Theme.fontUi.family; font.pixelSize: Theme.fontUi.pixelSize
                wrapMode: Text.WordWrap
                lineHeight: 1.45
            }
        }

        Flickable {
            Layout.fillWidth: true
            Layout.fillHeight: true
            Layout.leftMargin: 28
            Layout.rightMargin: 28
            contentWidth: width
            contentHeight: checkColumn.implicitHeight
            clip: true
            boundsBehavior: Flickable.StopAtBounds
            ScrollBar.vertical: StyledScrollBar { thin: true }

            ColumnLayout {
                id: checkColumn
                width: parent.width
                spacing: Theme.spacingMd

                Controls.Button {
                    id: firstCheck
                    Layout.fillWidth: true
                    implicitHeight: firstLabel.implicitHeight + 32
                    checkable: true
                    checked: false
                    hoverEnabled: true
                    Accessible.checkable: true
                    Accessible.checked: checked
                    Accessible.name: qsTr("Likeness and consent acknowledgment")
                    background: Rectangle {
                        color: firstCheck.checked ? Colors.accent10 : firstCheck.hovered ? Colors.surfaceHover : Colors.surfaceRaised
                        border.color: firstCheck.activeFocus ? Colors.accent : firstCheck.checked ? Colors.accent40 : Colors.surfaceBorder
                        border.width: 1
                        radius: Theme.radiusMd
                    }
                    contentItem: RowLayout {
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: Theme.spacingMd
                        Hexagon {
                            size: 22
                            lineWidth: 1.5
                            lineColor: firstCheck.checked ? Colors.accent : Colors.surfaceBorderStrong
                            fillColor: firstCheck.checked ? Colors.accent : Colors.surfaceBase
                            Layout.alignment: Qt.AlignTop
                            Layout.topMargin: 2
                            Icon {
                                visible: firstCheck.checked
                                anchors.centerIn: parent
                                name: "check"
                                size: 13
                                color: Colors.textOnAccent
                            }
                        }
                        Text {
                            id: firstLabel
                            Layout.fillWidth: true
                            text: qsTr("This image is fictional, or I have explicit documented consent from the real person it depicts. I will not impersonate anyone without consent.")
                            color: Colors.textPrimary
                            font.family: Theme.fontUi.family; font.pixelSize: Theme.fontUi.pixelSize
                            wrapMode: Text.WordWrap
                            lineHeight: 1.4
                        }
                    }
                }

                Controls.Button {
                    id: secondCheck
                    Layout.fillWidth: true
                    implicitHeight: secondLabel.implicitHeight + 32
                    checkable: true
                    checked: false
                    hoverEnabled: true
                    Accessible.checkable: true
                    Accessible.checked: checked
                    Accessible.name: qsTr("AI disclosure acknowledgment")
                    background: Rectangle {
                        color: secondCheck.checked ? Colors.accent10 : secondCheck.hovered ? Colors.surfaceHover : Colors.surfaceRaised
                        border.color: secondCheck.activeFocus ? Colors.accent : secondCheck.checked ? Colors.accent40 : Colors.surfaceBorder
                        border.width: 1
                        radius: Theme.radiusMd
                    }
                    contentItem: RowLayout {
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: Theme.spacingMd
                        Hexagon {
                            size: 22
                            lineWidth: 1.5
                            lineColor: secondCheck.checked ? Colors.accent : Colors.surfaceBorderStrong
                            fillColor: secondCheck.checked ? Colors.accent : Colors.surfaceBase
                            Layout.alignment: Qt.AlignTop
                            Layout.topMargin: 2
                            Icon {
                                visible: secondCheck.checked
                                anchors.centerIn: parent
                                name: "check"
                                size: 13
                                color: Colors.textOnAccent
                            }
                        }
                        Text {
                            id: secondLabel
                            Layout.fillWidth: true
                            text: qsTr("I will disclose AI-generated output to viewers and will not present it as authentic news, real events, or testimony from a real person.")
                            color: Colors.textPrimary
                            font.family: Theme.fontUi.family; font.pixelSize: Theme.fontUi.pixelSize
                            wrapMode: Text.WordWrap
                            lineHeight: 1.4
                        }
                    }
                }

                Controls.Button {
                    id: thirdCheck
                    Layout.fillWidth: true
                    implicitHeight: thirdLabel.implicitHeight + 32
                    checkable: true
                    checked: false
                    hoverEnabled: true
                    Accessible.checkable: true
                    Accessible.checked: checked
                    Accessible.name: qsTr("Acceptable use policy acknowledgment")
                    background: Rectangle {
                        color: thirdCheck.checked ? Colors.accent10 : thirdCheck.hovered ? Colors.surfaceHover : Colors.surfaceRaised
                        border.color: thirdCheck.activeFocus ? Colors.accent : thirdCheck.checked ? Colors.accent40 : Colors.surfaceBorder
                        border.width: 1
                        radius: Theme.radiusMd
                    }
                    contentItem: RowLayout {
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: Theme.spacingMd
                        Hexagon {
                            size: 22
                            lineWidth: 1.5
                            lineColor: thirdCheck.checked ? Colors.accent : Colors.surfaceBorderStrong
                            fillColor: thirdCheck.checked ? Colors.accent : Colors.surfaceBase
                            Layout.alignment: Qt.AlignTop
                            Layout.topMargin: 2
                            Icon {
                                visible: thirdCheck.checked
                                anchors.centerIn: parent
                                name: "check"
                                size: 13
                                color: Colors.textOnAccent
                            }
                        }
                        Text {
                            id: thirdLabel
                            Layout.fillWidth: true
                            text: qsTr("I have read and agree to both acceptable use policies, including their rules for consent, disclosure, and prohibited content.")
                            color: Colors.textPrimary
                            font.family: Theme.fontUi.family; font.pixelSize: Theme.fontUi.pixelSize
                            wrapMode: Text.WordWrap
                            lineHeight: 1.4
                        }
                    }
                }

                RowLayout {
                    Layout.fillWidth: true
                    spacing: Theme.spacingSm
                    Text {
                        text: qsTr("REVIEW POLICIES")
                        color: Colors.textMuted
                        font.family: Theme.fontLabel.family; font.pixelSize: Theme.fontLabel.pixelSize; font.weight: Theme.fontLabel.weight
                        Layout.fillWidth: true
                    }
                    GhostButton {
                        text: qsTr("LiveMorph AUP")
                        onClicked: Backend.openExternal(Constants.urlAup)
                    }
                    GhostButton {
                        text: qsTr("Decart AUP")
                        onClicked: Backend.openExternal(Constants.urlDecartAup)
                    }
                }
            }
        }
    }

    footer: Item {
        implicitHeight: 76
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 1
            color: Colors.surfaceBorder
        }
        RowLayout {
            anchors.fill: parent
            anchors.leftMargin: 28
            anchors.rightMargin: 28
            spacing: Theme.spacingMd
            SecondaryButton {
                Layout.fillWidth: true
                Layout.preferredHeight: 44
                text: qsTr("Cancel")
                onClicked: root.reject()
            }
            PrimaryButton {
                Layout.fillWidth: true
                Layout.preferredHeight: 44
                text: qsTr("I agree, choose image")
                enabled: root.consentGiven
                onClicked: {
                    Config.uploadConsentShown = true
                    root.accept()
                }
            }
        }
    }

    onOpened: {
        App.modalOpened(root.modalId)
        firstCheck.checked = false
        secondCheck.checked = false
        thirdCheck.checked = false
        firstCheck.forceActiveFocus()
    }
    onClosed: App.modalClosed(root.modalId)
}
