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
                id: azBtn
                text: "A→Z"
                onClicked: {
                    Catalog.sortAlphabetically()
                    App.notify("Sorted alphabetically", "info")
                }
                Tooltip {
                    anchors.top: parent.bottom
                    anchors.topMargin: 4
                    text: qsTr("Sort characters A→Z")
                    shown: azBtn.hovered
                }
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
            // Electron: grid grid-cols-3 gap-2.5, aspect-[4/5] PORTRAIT cards
            // Electron: grid-cols-3 gap-2.5 (10px) — the aspect math must use
            // the CARD width (cellWidth − 2×5 margin), not the cell width, or
            // the portrait 4:5 ratio drifts.
            cellWidth: Math.floor((width - 10) / 3)
            cellHeight: Math.floor((cellWidth - 10) * 5 / 4) + 10
            clip: true
            model: Catalog

            delegate: Item {
                width: grid.cellWidth
                height: grid.cellHeight
                property bool isSelected: Session.activeCharacterId === characterId

                Rectangle {
                    id: card
                    anchors.fill: parent
                    anchors.margins: 5
                    radius: Theme.radiusSm
                    color: Colors.surfaceOverlay
                    border.color: isSelected ? Colors.accent : Colors.surfaceBorder
                    border.width: 1
                    clip: true
                    Behavior on border.color { ColorAnimation { duration: Theme.motionFast } }

                    // Full-bleed portrait image (Electron: object-cover, 4:5)
                    Item {
                        id: thumbArea
                        anchors.fill: parent
                        clip: true

                        Image {
                            id: thumb
                            anchors.fill: parent
                            source: thumbnail && thumbnail.length ? thumbnail : ""
                            fillMode: Image.PreserveAspectCrop
                            asynchronous: true
                            visible: status === Image.Ready
                            // Electron image hover: opacity 80→100 + scale 1.02 (500ms)
                            opacity: cardMa.containsMouse || isSelected ? 1.0 : 0.8
                            scale: cardMa.containsMouse && !isSelected ? 1.02 : 1.0
                            Behavior on opacity { NumberAnimation { duration: 500; easing.type: Easing.OutCubic } }
                            Behavior on scale { NumberAnimation { duration: 500; easing.type: Easing.OutCubic } }
                        }
                        Text {
                            anchors.centerIn: parent
                            text: name && name.length ? name.charAt(0).toUpperCase() : "?"
                            color: Colors.textMuted
                            font.pixelSize: 32
                            font.weight: Font.Bold
                            visible: !thumb.visible
                        }

                        // Bottom gradient name bar (Electron: from-black/85)
                        Rectangle {
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.bottom: parent.bottom
                            height: 26
                            gradient: Gradient {
                                orientation: Qt.Vertical
                                GradientStop { position: 0.0; color: "transparent" }
                                GradientStop { position: 1.0; color: "#d9000000" }
                            }
                            Text {
                                anchors.left: parent.left
                                anchors.right: parent.right
                                anchors.bottom: parent.bottom
                                anchors.bottomMargin: 5
                                anchors.leftMargin: 6
                                anchors.rightMargin: 6
                                text: name || ""
                                color: "#e6ffffff"
                                font.pixelSize: 10
                                elide: Text.ElideRight
                                horizontalAlignment: Text.AlignHCenter
                            }
                        }

                        // Selected: 16px accent check badge top-right (check-pop)
                        Rectangle {
                            visible: isSelected
                            anchors.top: parent.top
                            anchors.right: parent.right
                            anchors.margins: 6
                            width: 16; height: 16; radius: 8
                            color: Colors.accent
                            z: 3
                            Icon {
                                anchors.centerIn: parent
                                name: "check"
                                size: 10
                                emphasis: true
                                color: Colors.white
                            }
                            // check-pop: scale .6 → 1.18 → 1 (.22s spring)
                            scale: isSelected ? 1.0 : 0.6
                            SequentialAnimation on scale {
                                running: isSelected
                                NumberAnimation { to: 1.18; duration: 140; easing.type: Easing.OutCubic }
                                NumberAnimation { to: 1.0; duration: 80; easing.type: Easing.OutCubic }
                            }
                        }

                        // Kind dot (Electron: 4px corner dot — accent for starters)
                        Rectangle {
                            anchors.left: parent.left
                            anchors.bottom: parent.bottom
                            anchors.margins: 6
                            width: 4; height: 4; radius: 2
                            color: isStarter ? Colors.accent : "#2dd4bf"
                        }
                    }

                    MouseArea {
                        id: cardMa
                        anchors.fill: parent
                        acceptedButtons: Qt.LeftButton | Qt.RightButton
                        cursorShape: Qt.PointingHandCursor
                        hoverEnabled: true
                        onClicked: function(mouse) {
                            if (mouse.button === Qt.RightButton) {
                                ctxMenu.characterId = characterId
                                ctxMenu.characterName = name
                                ctxMenu.isStarter = isStarter
                                ctxMenu.popup()
                            } else if (Session.activeCharacterId === characterId) {
                                // Electron: clicking the SELECTED card deselects
                                Session.setActiveCharacter("", "", "", "")
                            } else {
                                Session.setActiveCharacter(characterId, name, thumbnail || "", description || "")
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
            text: "Delete…"
            enabled: !ctxMenu.isStarter
            onTriggered: {
                deleteDialog.targetId = ctxMenu.characterId
                deleteDialog.targetName = ctxMenu.characterName
                deleteDialog.open()
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
        id: deleteDialog
        property string targetId: ""
        property string targetName: ""
        title: "Delete character"
        modal: true
        anchors.centerIn: parent
        width: 340
        closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside
        background: Rectangle {
            color: Colors.surfaceRaised
            border.color: Colors.surfaceBorder
            radius: Theme.radiusMd
        }
        contentItem: ColumnLayout {
            spacing: 12
            Text {
                text: "Are you sure you want to delete \"" + deleteDialog.targetName + "\"?"
                color: Colors.textPrimary
                font.pixelSize: 13
                wrapMode: Text.WordWrap
                Layout.fillWidth: true
            }
            Text {
                text: "This action cannot be undone. You will need to re-upload the reference image if you want to use this character again."
                color: Colors.textMuted
                font.pixelSize: 11
                wrapMode: Text.WordWrap
                Layout.fillWidth: true
            }
        }
        standardButtons: Dialog.Yes | Dialog.No
        onAccepted: {
            Catalog.deleteCharacter(deleteDialog.targetId)
            App.notify("Deleted " + deleteDialog.targetName, "info")
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
