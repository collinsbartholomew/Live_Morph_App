import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import QtQuick.Window
import LiveMorph

Rectangle {
    id: root
    property string modalId: "whatsnew"
    property bool open: false
    property string headline: ""
    property var notes: []
    property var previousFocus: null
    readonly property string clientVersion: App.appVersion || Constants.appVersion
    readonly property var effectiveNotes: notes.length > 0 ? notes : [
        { title: qsTr("A completely reimagined studio"), body: qsTr("Clearer workflows, responsive layouts, and precise controls put the stage at the center of your work.") },
        { title: qsTr("Sculpted Obsidian Hex visuals"), body: qsTr("Dimensional honeycomb artwork, refined monochrome surfaces, and a new visual hierarchy make every state easier to read.") },
        { title: qsTr("Smoother access and control"), body: qsTr("Redesigned authentication, verification, payments, settings, and keyboard navigation remove friction throughout the app.") }
    ]

    anchors.fill: parent
    color: Colors.overlayScrim
    visible: open
    z: Theme.zDialog
    focus: open
    Accessible.role: Accessible.Dialog
    Accessible.name: qsTr("What's new in LiveMorph %1").arg(root.clientVersion)

    function dismiss() {
        Config.whatsNewSeenVersion = root.clientVersion
        root.open = false
    }

    function cycleFocus() {
        if (gotItButton.activeFocus)
            closeButton.forceActiveFocus()
        else
            gotItButton.forceActiveFocus()
    }

    Keys.onTabPressed: function(event) {
        root.cycleFocus()
        event.accepted = true
    }
    Keys.onBacktabPressed: function(event) {
        root.cycleFocus()
        event.accepted = true
    }

    onOpenChanged: {
        if (open) {
            previousFocus = Window.window ? Window.window.activeFocusItem : null
            App.modalOpened(root.modalId)
            Qt.callLater(gotItButton.forceActiveFocus)
        } else {
            App.modalClosed(root.modalId)
            if (previousFocus) {
                var target = previousFocus
                previousFocus = null
                if (target)
                    Qt.callLater(target.forceActiveFocus)
            }
        }
    }

    Connections {
        target: App
        function onModalEscapeRequested(id) {
            if (root.open && id === root.modalId)
                root.dismiss()
        }
    }

    MouseArea {
        anchors.fill: parent
        onClicked: root.dismiss()
    }

    Rectangle {
        id: card
        anchors.centerIn: parent
        width: Math.min(parent.width - 48, 600)
        height: Math.min(parent.height - 64, cardColumn.implicitHeight)
        radius: Theme.radiusLg
        color: Colors.surfaceOverlay
        border.color: Colors.surfaceBorderStrong
        border.width: 1
        clip: true

        MouseArea { anchors.fill: parent }

        CornerTicks {
            anchors.fill: parent
            inset: 10
            tickSize: 10
            thickness: 1
            color: Colors.accent40
            z: Theme.zLocal3
        }

        ColumnLayout {
            id: cardColumn
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            spacing: 0

            Item {
                Layout.fillWidth: true
                Layout.preferredHeight: headerColumn.implicitHeight + 48
                clip: true

                Honeycomb {
                    anchors.fill: parent
                    cellSize: Theme.honeycombCellLg
                    lineColor: Colors.honeycombLineFaint
                    focusX: width * 0.85
                    focusY: height * 0.5
                    fadeRadius: width * 0.55
                    depthEvery: 7
                    circuitEvery: 11
                }

                HexSculpture {
                    anchors.right: parent.right
                    anchors.rightMargin: 24
                    anchors.verticalCenter: parent.verticalCenter
                    size: 132
                    illuminated: true
                    visible: card.width > 480
                }

                Column {
                    id: headerColumn
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    anchors.margins: 28
                    anchors.rightMargin: card.width > 480 ? 174 : 28
                    spacing: Theme.spacingSm

                    Row {
                        spacing: Theme.spacingSm
                        Hexagon {
                            size: 10
                            lineWidth: 1.5
                            lineColor: Colors.accent
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        Text {
                            text: qsTr("PRODUCT UPDATE / %1").arg(root.clientVersion)
                            color: Colors.textMuted
                            font.family: Theme.fontLabel.family; font.pixelSize: Theme.fontLabel.pixelSize; font.weight: Theme.fontLabel.weight
                            font.letterSpacing: 1.2
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }

                    Text {
                        width: parent.width
                        text: root.headline.length ? root.headline : qsTr("The studio, reimagined.")
                        color: Colors.textPrimary
                        font.family: Theme.fontHeadline.family; font.pixelSize: Theme.fontHeadline.pixelSize; font.weight: Theme.fontHeadline.weight
                        font.letterSpacing: -0.8
                        wrapMode: Text.WordWrap
                    }

                    Text {
                        width: parent.width
                        text: qsTr("A sharper creative instrument for every stream, scene, and character.")
                        color: Colors.textSecondary
                        font.family: Theme.fontUi.family; font.pixelSize: Theme.fontUi.pixelSize
                        wrapMode: Text.WordWrap
                        lineHeight: 1.4
                    }
                }

                IconButton {
                    id: closeButton
                    anchors.top: parent.top
                    anchors.right: parent.right
                    anchors.margins: 14
                    name: "x"
                    accessibleName: qsTr("Close what's new")
                    onClicked: root.dismiss()
                    z: Theme.zLocal4
                }
            }

            Rectangle {
                Layout.fillWidth: true
                height: 1
                color: Colors.surfaceBorder
            }

            Flickable {
                Layout.fillWidth: true
                Layout.preferredHeight: Math.min(220, notesList.implicitHeight)
                Layout.leftMargin: 28
                Layout.rightMargin: 28
                Layout.topMargin: 20
                Layout.bottomMargin: 20
                contentWidth: width
                contentHeight: notesList.implicitHeight
                clip: true
                boundsBehavior: Flickable.StopAtBounds
                ScrollBar.vertical: StyledScrollBar { thin: true }

                Column {
                    id: notesList
                    width: parent.width
                    spacing: Theme.spacingMd

                    Repeater {
                        model: root.effectiveNotes
                        delegate: Rectangle {
                            required property var modelData
                            required property int index
                            width: parent.width
                            height: noteRow.implicitHeight + 20
                            color: Colors.surfaceRaised
                            border.color: Colors.surfaceBorderSubtle
                            border.width: 1
                            radius: Theme.radiusMd

                            RowLayout {
                                id: noteRow
                                anchors.left: parent.left
                                anchors.right: parent.right
                                anchors.top: parent.top
                                anchors.margins: 12
                                spacing: Theme.spacingMd

                                HexBadge {
                                    size: 32
                                    iconName: index === 0 ? "grid" : index === 1 ? "sparkles" : "check"
                                    iconSize: 15
                                    lineColor: Colors.accent30
                                    fillColor: Colors.accent10
                                    iconColor: Colors.accent
                                    Layout.alignment: Qt.AlignTop
                                }

                                Column {
                                    Layout.fillWidth: true
                                    spacing: 4
                                    Text {
                                        width: parent.width
                                        text: typeof modelData === "string" ? modelData : modelData.title || ""
                                        color: Colors.textPrimary
                                        font.family: Theme.fontUi.family; font.pixelSize: Theme.fontUi.pixelSize
                                        font.weight: Font.Bold
                                        wrapMode: Text.WordWrap
                                    }
                                    Text {
                                        visible: text.length > 0
                                        width: parent.width
                                        text: typeof modelData === "string" ? "" : modelData.body || ""
                                        color: Colors.textSecondary
                                        font.family: Theme.fontSmall.family; font.pixelSize: Theme.fontSmall.pixelSize
                                        wrapMode: Text.WordWrap
                                        lineHeight: 1.4
                                    }
                                }
                            }
                        }
                    }
                }
            }

            Rectangle {
                Layout.fillWidth: true
                Layout.preferredHeight: 68
                color: Colors.surfaceRaised

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
                    Text {
                        text: qsTr("VERSION %1").arg(root.clientVersion)
                        color: Colors.textMuted
                        font.family: Theme.fontMonoTiny.family; font.pixelSize: Theme.fontMonoTiny.pixelSize
                        Layout.fillWidth: true
                    }
                    PrimaryButton {
                        id: gotItButton
                        text: qsTr("Enter the studio")
                        iconName: "arrow-right"
                        onClicked: root.dismiss()
                    }
                }
            }
        }
    }
}
