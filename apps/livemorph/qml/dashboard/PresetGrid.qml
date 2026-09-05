import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

/**
 * PresetGrid — full character catalog with thumbnails, selection,
 * context menu (rename / hide starter), category chips, search.
 */
Item {
    id: root

    property string renameTargetId: ""
    property string renameTargetName: ""

    ColumnLayout {
        anchors.fill: parent
        spacing: 10

        TextField {
            Layout.fillWidth: true
            placeholderText: "Search characters…"
            onTextChanged: Catalog.searchText = text
        }

        Flickable {
            Layout.fillWidth: true
            Layout.preferredHeight: 28
            contentWidth: chips.implicitWidth
            clip: true
            interactive: contentWidth > width
            Row {
                id: chips
                spacing: 6
                Repeater {
                    model: {
                        var list = ["All"];
                        return list.concat(Catalog.categories);
                    }
                    Rectangle {
                        property bool selected: (modelData === "All" && Catalog.filterCategory === "")
                                                || Catalog.filterCategory === modelData
                        width: chipLabel.implicitWidth + 16
                        height: 26
                        radius: 13
                        color: selected ? Colors.accentMuted : Colors.surfaceOverlay
                        border.color: selected ? Colors.accent : Colors.surfaceBorder
                        border.width: 1
                        Text {
                            id: chipLabel
                            anchors.centerIn: parent
                            text: modelData
                            color: selected ? Colors.accent : Colors.textSecondary
                            font.pixelSize: 11
                            font.weight: selected ? Font.DemiBold : Font.Normal
                        }
                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: Catalog.filterCategory = (modelData === "All" ? "" : modelData)
                        }
                    }
                }
            }
        }

        RowLayout {
            Layout.fillWidth: true
            Text {
                text: Catalog.count + " character" + (Catalog.count === 1 ? "" : "s")
                color: Colors.textMuted
                font.pixelSize: 11
                Layout.fillWidth: true
            }
            GhostButton {
                text: "Show hidden"
                onClicked: {
                    Catalog.unhideAll()
                    App.notify("Hidden starters restored", "success")
                }
            }
        }

        // Empty / loading
        Item {
            Layout.fillWidth: true
            Layout.fillHeight: true
            visible: Catalog.count === 0
            Column {
                anchors.centerIn: parent
                spacing: 10
                Spinner {
                    size: 28
                    anchors.horizontalCenter: parent.horizontalCenter
                    visible: !Backend.reachable || Catalog.loading
                }
                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: {
                        if (!Backend.reachable)
                            return "Backend offline"
                        if (Catalog.loading)
                            return "Loading characters…"
                        return qsTr("No LiveMorph characters yet")
                    }
                    color: Colors.textSecondary
                    font.pixelSize: 13
                }
                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: 200
                    wrapMode: Text.WordWrap
                    horizontalAlignment: Text.AlignHCenter
                    text: Backend.reachable
                          ? "Try another search or category, or refresh from Settings."
                          : "Set the API URL in Settings to load the catalog."
                    color: Colors.textMuted
                    font.pixelSize: 11
                }
                PrimaryButton {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: Backend.reachable ? qsTr("Refresh catalog") : qsTr("Retry connection")
                    onClicked: {
                        if (!Backend.reachable)
                            Backend.ping()
                        Catalog.load()
                        Backend.fetchCatalog()
                    }
                }
            }
        }

        GridView {
            visible: Catalog.count > 0
            id: grid
            Layout.fillWidth: true
            Layout.fillHeight: true
            cellWidth: Math.floor((width - 4) / 2)
            cellHeight: cellWidth + 40
            clip: true
            model: Catalog

            delegate: Item {
                width: grid.cellWidth
                height: grid.cellHeight
                property bool isSelected: Session.activeCharacterId === characterId

                Rectangle {
                    id: card
                    anchors.fill: parent
                    anchors.margins: 4
                    radius: Theme.radiusSm
                    color: isSelected ? Colors.accent15 : Colors.surfaceOverlay
                    border.color: isSelected ? Colors.accent : Colors.surfaceBorder
                    border.width: isSelected ? 2 : 1
                    clip: true
                    scale: 1.0
                    Behavior on scale { NumberAnimation { duration: Theme.motionFast } }
                    Behavior on border.color { ColorAnimation { duration: Theme.motionFast } }
                    Behavior on color { ColorAnimation { duration: Theme.motionFast } }
                    // Selected glow
                    Rectangle {
                        anchors.fill: parent
                        anchors.margins: -1
                        radius: parent.radius + 1
                        color: "transparent"
                        border.color: Colors.accent
                        border.width: 1
                        opacity: isSelected ? 0.45 : 0
                        z: 3
                    }

                    Rectangle {
                        visible: isSelected
                        anchors.left: parent.left
                        anchors.top: parent.top
                        anchors.margins: 8
                        z: 4
                        height: 20
                        width: activeLbl.implicitWidth + 12
                        radius: Theme.radiusFull
                        color: Colors.accent
                        Text {
                            id: activeLbl
                            anchors.centerIn: parent
                            text: qsTr("Active")
                            color: Colors.white
                            font.pixelSize: 10
                            font.weight: Font.DemiBold
                        }
                    }

                    Rectangle {
                        id: thumbArea
                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.top: parent.top
                        height: parent.width - 8
                        color: "#0a0a10"
                        radius: Theme.radiusSm
                        clip: true

                        Image {
                            id: thumb
                            anchors.fill: parent
                            source: thumbnail && thumbnail.length ? thumbnail : ""
                            fillMode: Image.PreserveAspectCrop
                            asynchronous: true
                            visible: status === Image.Ready
                        }
                        Text {
                            anchors.centerIn: parent
                            text: name && name.length ? name.charAt(0).toUpperCase() : "?"
                            color: Colors.textMuted
                            font.pixelSize: 32
                            font.weight: Font.Bold
                            visible: !thumb.visible
                        }
                        Rectangle {
                            visible: isPremium
                            anchors.top: parent.top
                            anchors.right: parent.right
                            anchors.margins: 6
                            width: 20; height: 20; radius: 10
                            color: Colors.accent
                            Text {
                                anchors.centerIn: parent
                                text: "★"
                                color: Colors.surfaceBase
                                font.pixelSize: 11
                                font.weight: Font.Bold
                            }
                        }
                        Rectangle {
                            visible: isSelected
                            anchors.bottom: parent.bottom
                            anchors.right: parent.right
                            anchors.margins: 6
                            width: 22; height: 22; radius: 11
                            color: Colors.accent
                            Text {
                                anchors.centerIn: parent
                                text: "✓"
                                color: Colors.surfaceBase
                                font.pixelSize: 12
                                font.weight: Font.Bold
                            }
                        }
                    }

                    Text {
                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.top: thumbArea.bottom
                        anchors.margins: 8
                        anchors.topMargin: 6
                        text: name || ""
                        color: Colors.textPrimary
                        font.pixelSize: 12
                        font.weight: Font.Medium
                        elide: Text.ElideRight
                        horizontalAlignment: Text.AlignHCenter
                    }

                    MouseArea {
                        id: cardMa
                        anchors.fill: parent
                        acceptedButtons: Qt.LeftButton | Qt.RightButton
                        cursorShape: Qt.PointingHandCursor
                        hoverEnabled: true
                        onEntered: {
                            if (!isSelected) card.border.color = Colors.accent40
                            card.scale = 1.02
                        }
                        onExited: {
                            card.border.color = isSelected ? Colors.accent : Colors.surfaceBorder
                            card.scale = 1.0
                        }
                        onClicked: function(mouse) {
                            if (mouse.button === Qt.RightButton) {
                                ctxMenu.characterId = characterId
                                ctxMenu.characterName = name
                                ctxMenu.isStarter = isStarter
                                ctxMenu.popup()
                            } else {
                                Session.setActiveCharacter(characterId, name, thumbnail || "", description || "")
                                App.notify("Selected " + name, "success")
                            }
                        }
                        onPressAndHold: {
                            ctxMenu.characterId = characterId
                            ctxMenu.characterName = name
                            ctxMenu.isStarter = isStarter
                            ctxMenu.popup()
                        }
                    }
                }
            }

            ScrollBar.vertical: ScrollBar { policy: ScrollBar.AsNeeded }
        }
    }

    Menu {
        id: ctxMenu
        property string characterId: ""
        property string characterName: ""
        property bool isStarter: false

        MenuItem {
            text: "Select"
            onTriggered: {
                Session.setActiveCharacter(ctxMenu.characterId, ctxMenu.characterName, "", "")
            }
        }
        MenuItem {
            text: "Rename…"
            onTriggered: {
                renameDialog.targetId = ctxMenu.characterId
                renameDialog.targetName = ctxMenu.characterName
                renameDialog.open()
            }
        }
        MenuItem {
            text: "Hide starter"
            enabled: ctxMenu.isStarter
            onTriggered: {
                Catalog.hideStarter(ctxMenu.characterId)
                App.notify("Hidden " + ctxMenu.characterName, "info")
            }
        }
    }

    Dialog {
        id: renameDialog
        property string targetId: ""
        property string targetName: ""
        title: "Rename character"
        modal: true
        anchors.centerIn: parent
        width: 320
        standardButtons: Dialog.Ok | Dialog.Cancel
        background: Rectangle {
            color: Colors.surfaceRaised
            border.color: Colors.surfaceBorder
            radius: Theme.radiusMd
        }
        contentItem: ColumnLayout {
            spacing: 12
            TextField {
                id: renameField
                Layout.fillWidth: true
                text: renameDialog.targetName
                placeholderText: "New name"
            }
        }
        onAccepted: {
            if (renameField.text.trim().length) {
                Catalog.renameCharacter(renameDialog.targetId, renameField.text.trim())
                App.notify("Renamed", "success")
            }
        }
        onOpened: renameField.forceActiveFocus()
    }

    Component.onCompleted: {
        if (Catalog.count === 0)
            Catalog.load()
    }
}
