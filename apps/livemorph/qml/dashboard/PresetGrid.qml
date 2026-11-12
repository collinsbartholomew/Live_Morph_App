import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import QtQuick.Dialogs
import LiveMorph

/**
 * PresetGrid — Electron workshop roster (single-scroll section):
 *   pack header "LiveMorph characters · N AVAILABLE" (collapsible, stacked cover)
 *   3-col portrait 4:5 card grid inside the pack
 *   "My characters · N saved" + Sort A→Z + dashed add-a-character slots
 *   upload-consent footer
 * No search/category chips (Electron has none — packs organize the catalog).
 */
Item {
    id: root

    // Roster is visible by default — the pack is the primary content, not a
    // collapsed behind a 62px header.
    property bool packExpanded: true
    property string pendingSlotUpload: ""
    readonly property int gridPad: Theme.padSection // aligns with WorkshopPanel header
    readonly property int gap: Theme.gapCard       // gap-2.5
    readonly property real cardW: Math.floor((width - gridPad * 2 - gap * 2) / 3)
    readonly property real cardH: Math.floor(cardW * 5 / 4)

    // Live counts/lists — computed in C++ (CharacterCatalogModel) and re-notified
    // on countChanged, instead of JS loops over Catalog.get() per binding.
    readonly property int starterCount: Catalog.starterCount
    readonly property var starterEntries: Catalog.starterEntries
    readonly property var userEntries: Catalog.userEntries
    readonly property int saved: Catalog.savedCount
    readonly property string coverThumb: Catalog.coverThumb

    implicitHeight: col.implicitHeight

    function localPath(url) {
        var s = url.toString()
        if (s.startsWith("file://"))
            return decodeURIComponent(s.substring(7))
        return s
    }

    Column {
        id: col
        width: parent.width
        spacing: 0

        // ── Pack header (Electron: rounded-sm border card, stacked covers) ─
        Rectangle {
            width: parent.width - root.gridPad * 2
            x: root.gridPad
            height: 62
            readonly property bool packSelected: {
                const id = Session.activeCharacterId
                if (!id.length) return false
                const idx = Catalog.indexOfId(id)
                if (idx < 0) return false
                const m = Catalog.get(idx)
                return m.isStarter === true
            }
            radius: Theme.radiusMd
            // Selected pack = accent wash + accent ring; hover warms the card
            color: packSelected ? Colors.accent06
                 : packMa.containsMouse ? Colors.surfaceHover
                 : Colors.surfaceRaised
            border.width: 1
            border.color: packSelected ? Colors.accent60
                         : (packMa.containsMouse ? Colors.surfaceBorderStrong : Colors.surfaceBorder)

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 10   // px-2.5
                anchors.rightMargin: 10
                spacing: 12             // gap-3

                // Stacked cover 37×46 — two offset layers fade on expand
                Item {
                    width: 42
                    height: 46
                    Layout.alignment: Qt.AlignVCenter

                    // Back layer: translate(5,5) scale .94 — fades when open
                    Rectangle {
                        width: 37; height: 46; radius: Theme.radiusSm
                        x: root.packExpanded ? 0 : 5
                        y: root.packExpanded ? 0 : 5
                        scale: root.packExpanded ? 1.0 : 0.94
                        color: Colors.surfaceOverlay
                        border.color: Colors.surfaceBorderSubtle
                        border.width: 1
                        opacity: root.packExpanded ? 0 : 1
                    }
                    // Mid layer: translate(2.5,2.5) scale .97 — fades when open
                    Rectangle {
                        width: 37; height: 46; radius: Theme.radiusSm
                        x: root.packExpanded ? 0 : 2.5
                        y: root.packExpanded ? 0 : 2.5
                        scale: root.packExpanded ? 1.0 : 0.97
                        color: Colors.surfaceElevated
                        border.color: Colors.surfaceBorderSubtle
                        border.width: 1
                        opacity: root.packExpanded ? 0 : 1
                    }
                    // Front: the thumb itself
                    Image {
                        width: 37; height: 46
                        x: 0; y: 0
                        clip: true
                        source: root.coverThumb
                        fillMode: Image.PreserveAspectCrop
                        asynchronous: true
                        Rectangle {
                            anchors.fill: parent
                            radius: Theme.radiusSm
                            color: Colors.transparent
                            border.color: Colors.surfaceBorder
                            border.width: 1
                        }
                    }
                }

                ColumnLayout {
                    spacing: 2
                    Layout.fillWidth: true
                    Text {
                        text: qsTr("LiveMorph characters")
                        color: Colors.textPrimary
                        font.pixelSize: 13
                        font.weight: Font.Bold
                        elide: Text.ElideRight
                        Layout.fillWidth: true
                    }
                    // Count pill (mono, uppercase eyebrow)
                    Rectangle {
                        height: 18
                        width: availLbl.implicitWidth + 12
                        radius: Theme.radiusFull
                        color: Colors.overlay30
                        border.color: Colors.surfaceBorderSubtle
                        border.width: 1
                        Text {
                            id: availLbl
                            anchors.centerIn: parent
                            text: qsTr("%1 AVAILABLE").arg(root.starterCount)
                            color: Colors.textMuted
                            font.family: Theme.fontMono.family
                            font.pixelSize: 9
                            font.letterSpacing: 1.2
                        }
                    }
                }

                // Chevron in a hex outline
                Item {
                    width: 24; height: 24
                    Layout.alignment: Qt.AlignVCenter
                    Hexagon {
                        anchors.centerIn: parent
                        size: 24
                        lineWidth: 1
                        lineColor: packMa.containsMouse ? Colors.accent30 : Colors.surfaceBorder
                        fillColor: packMa.containsMouse ? Colors.overlay40 : Colors.transparent
                    }
                    Icon {
                        anchors.centerIn: parent
                        name: "chevron-down"
                        size: 13
                        color: packMa.containsMouse ? Colors.accentHover : Colors.textMuted
                        rotation: root.packExpanded ? 180 : 0
                    }
                }
            }

            MouseArea {
                id: packMa
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: root.packExpanded = !root.packExpanded
            }
        }

        Item { width: 1; height: 10 }

        // ── Starter pack grid (collapsible) ───────────────────────────
        Item {
            width: parent.width
            clip: true
            height: root.packExpanded ? (root.starterCount > 0 ? packGrid.implicitHeight + 12 : catEmpty.implicitHeight + 12) : 0

            // Catalog empty / load-failed: shared EmptyState with a Retry action
            EmptyState {
                id: catEmpty
                visible: root.starterCount === 0
                width: parent.width - root.gridPad * 2
                x: root.gridPad
                iconName: Backend.reachable ? "grid" : "alert-circle"
                title: Backend.reachable ? qsTr("No characters loaded yet")
                                         : qsTr("Couldn't reach the catalog")
                body: Backend.reachable ? qsTr("Pull the character library again.")
                                        : qsTr("Check that the backend is running, then retry.")
                actionText: qsTr("RETRY")
                onAction: Backend.fetchCatalog()
            }

            Grid {
                id: packGrid
                visible: root.starterCount > 0
                x: root.gridPad
                y: 2
                columns: 3
                columnSpacing: root.gap
                rowSpacing: root.gap

                Repeater {
                    model: root.starterEntries
                    delegate: Item {
                        required property var modelData

                        width: root.cardW
                        height: root.cardH

                        CharacterCard {
                            anchors.fill: parent
                            characterId: modelData.id
                            name: modelData.name
                            thumbnail: modelData.thumbnail
                            description: modelData.description
                            isStarter: true
                            isPremium: modelData.isPremium
                            onClickedMenu: function(id, nm, starter) {
                                ctxMenu.characterId = id
                                ctxMenu.characterName = nm
                                ctxMenu.isStarter = starter
                                ctxMenu.popup()
                            }
                        }
                    }
                }
            }
        }

        Item { width: 1; height: 16 }

        // Electron: pt-5 border-t border-surface-border-subtle/60 mt-4
        Rectangle {
            width: parent.width - root.gridPad * 2
            x: root.gridPad
            height: 1
            color: Colors.borderSubtle50
        }
        Item { width: 1; height: 20 }

        // ── My characters ─────────────────────────────────────────────
        RowLayout {
            width: parent.width - root.gridPad * 2
            x: root.gridPad
            height: 24
            Hexagon {
                size: 11
                lineWidth: 1.5
                lineColor: Colors.textPrimary
                Layout.alignment: Qt.AlignVCenter
            }
            Text {
                text: qsTr("MY CHARACTERS")
                color: Colors.textPrimary
                font: Theme.fontLabel
                Layout.fillWidth: true
            }
            // Sort as a subtle ghost chip
            Rectangle {
                visible: root.saved >= 2
                height: 22
                width: sortLbl.implicitWidth + 14
                radius: Theme.radiusFull
                color: sortMa.containsMouse ? Colors.overlay50 : Colors.transparent
                border.color: Colors.surfaceBorderSubtle
                border.width: 1
                Layout.alignment: Qt.AlignVCenter
                Text {
                    id: sortLbl
                    anchors.centerIn: parent
                    text: qsTr("SORT A\u2192Z")
                    color: sortMa.containsMouse ? Colors.textSecondary : Colors.textMuted
                    font.family: Theme.fontMono.family
                    font.pixelSize: 9
                    font.letterSpacing: 1.0
                }
                MouseArea {
                    id: sortMa
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: Catalog.sortAlphabetically()
                }
            }
            // Count pill
            Rectangle {
                height: 20
                width: savedLbl.implicitWidth + 14
                radius: Theme.radiusFull
                color: Colors.overlay30
                border.color: Colors.surfaceBorderSubtle
                border.width: 1
                Layout.alignment: Qt.AlignVCenter
                Text {
                    id: savedLbl
                    anchors.centerIn: parent
                    text: qsTr("%1 saved").arg(root.saved)
                    color: Colors.textMuted
                    font.family: Theme.fontMono.family
                    font.pixelSize: 10
                }
            }
        }

        Item { width: 1; height: 10 }

        // Empty-library state: bordered card + shared EmptyState (hex badge + honeycomb)
        Rectangle {
            visible: root.saved === 0
            x: root.gridPad
            width: parent.width - root.gridPad * 2
            height: emptyState.implicitHeight + 24
            radius: Theme.radiusMd
            color: Colors.surfaceRaised
            border.color: Colors.surfaceBorderSubtle
            border.width: 1
            clip: true
            EmptyState {
                id: emptyState
                anchors.fill: parent
                iconName: "user-plus"
                title: qsTr("No saved characters yet")
                body: qsTr("Drop an image into a slot above, or save a character from the Customize section to add it here.")
            }
        }

        Grid {
            id: myGrid
            x: root.gridPad
            columns: 3
            columnSpacing: root.gap
            rowSpacing: root.gap

            Repeater {
                model: root.userEntries
                delegate: Item {
                    required property var modelData

                    width: root.cardW
                    height: root.cardH

                    CharacterCard {
                        anchors.fill: parent
                        characterId: modelData.id
                        name: modelData.name
                        thumbnail: modelData.thumbnail
                        description: modelData.description
                        isStarter: false
                        isPremium: modelData.isPremium
                        onClickedMenu: function(id, nm, starter) {
                            ctxMenu.characterId = id
                            ctxMenu.characterName = nm
                            ctxMenu.isStarter = false
                            ctxMenu.popup()
                        }
                        onDeleteRequested: function(id, nm) {
                            deleteConfirm.characterId = id
                            deleteConfirm.characterName = nm
                            deleteConfirm.open()
                        }
                    }
                }
            }

            // Dashed add-a-character slots (uniform design; the first slot
            // also carries the "Add a character" label)
            Repeater {
                // visible cells = min(28, ceil((saved+2)/3)*3) — slots fill
                // the row out to at least 2 empties until the library is full.
                model: Math.max(0, Math.min(Constants.maxLibrarySize, Math.ceil((root.saved + 2) / 3) * 3) - root.saved)
                delegate: Item {
                    width: root.cardW
                    height: root.cardH

                    Rectangle {
                        anchors.fill: parent
                        radius: Theme.radiusMd
                        color: slotMa.containsMouse ? Colors.accent06 : Colors.raised20
                        border.color: slotMa.containsMouse ? Colors.accent40 : Colors.surfaceBorderSubtle
                        border.width: 1

                        // Dashed hexagonal inner outline (drop affordance)
                        Canvas {
                            id: slotDash
                            anchors.fill: parent
                            anchors.margins: 8
                            onPaint: {
                                var ctx = getContext("2d")
                                ctx.reset()
                                ctx.strokeStyle = slotMa.containsMouse ? Colors.accent50 : Colors.surfaceBorderSubtle
                                ctx.lineWidth = 1
                                ctx.setLineDash([4, 4])
                                var s = Math.min(width, height) / 2 - 1
                                var cx = width / 2
                                var cy = height / 2
                                ctx.beginPath()
                                for (var i = 0; i < 6; i++) {
                                    // flat-top orientation (60*i), matching Hexagon/Honeycomb
                                    var a = Math.PI / 180 * (60 * i)
                                    var px = cx + s * Math.cos(a)
                                    var py = cy + s * Math.sin(a)
                                    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py)
                                }
                                ctx.closePath()
                                ctx.stroke()
                            }
                            Component.onCompleted: requestPaint()
                            onWidthChanged: requestPaint()
                            onHeightChanged: requestPaint()
                            Connections {
                                target: slotMa
                                function onContainsMouseChanged() { slotDash.requestPaint() }
                            }
                        }
                    }

                    Column {
                        anchors.centerIn: parent
                        spacing: 8
                        Item {
                            width: 30; height: 30
                            anchors.horizontalCenter: parent.horizontalCenter
                            Hexagon {
                                anchors.centerIn: parent
                                size: 30
                                lineWidth: 1
                                lineColor: slotMa.containsMouse ? Colors.accent60 : Colors.surfaceBorder
                                fillColor: slotMa.containsMouse ? Colors.accent12 : Colors.transparent
                            }
                            Icon {
                                anchors.centerIn: parent
                                name: "plus"
                                size: 14
                                color: slotMa.containsMouse ? Colors.accent : Colors.textMuted
                            }
                        }
                        Text {
                            visible: index === 0
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: qsTr("Add a character")
                            color: slotMa.containsMouse ? Colors.textSecondary : Colors.textMuted
                            font.pixelSize: 10
                        }
                    }

                    MouseArea {
                        id: slotMa
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: slotFileDialog.open()
                    }
                }
            }

        }

        // Full-library inline note (Electron) — sibling of the grid, not a cell
        Text {
            visible: root.saved >= Constants.maxLibrarySize
            width: parent.width - root.gridPad * 2
            x: root.gridPad
            text: qsTr("Your library is full at %1 characters. Delete one to free a slot.").arg(root.saved)
            color: Colors.textSecondary
            font.pixelSize: 10
            wrapMode: Text.WordWrap
        }

        Item { width: 1; height: 14 }

        // Upload consent footer (Electron reference.consentReminder)
        Text {
            x: root.gridPad
            width: parent.width - root.gridPad * 2
            text: qsTr("By uploading, you confirm the image is fictional or you have the person's consent, and that you'll disclose AI use to viewers.")
            color: Colors.textMuted
            font.pixelSize: 10
            wrapMode: Text.WordWrap
            lineHeight: 1.6
        }

        Item { width: 1; height: 16 }
    }

    FileDialog {
        id: slotFileDialog
        title: qsTr("Choose a reference image")
        nameFilters: [qsTr("Images (*.png *.jpg *.jpeg *.webp)")]
        onAccepted: {
            var path = root.localPath(selectedFile)
            if (!Config.uploadConsentShown) {
                root.pendingSlotUpload = path
                slotConsentDialog.open()
                return
            }
            root.fillSlot(path)
        }
    }

    // First-upload consent gate (Electron mm — persisted ack)
    UploadConsentDialog {
        id: slotConsentDialog
        onAccepted: {
            if (root.pendingSlotUpload.length) {
                root.fillSlot(root.pendingSlotUpload)
                root.pendingSlotUpload = ""
            }
        }
        onRejected: root.pendingSlotUpload = ""
    }

    // Electron x1 slot-fill: the image is saved as a LIBRARY character with
    // the default prompt, auto-selected — not just a session reference.
    function fillSlot(path) {
        const id = Catalog.addUserCharacter("", path, "")
        if (id.length) {
            const entry = Catalog.get(Catalog.indexOfId(id))
            Session.setActiveCharacter(id, (entry && entry.name) || id, path, "")
            App.notify(qsTr("Character saved to Library"), "success")
        } else {
            App.notify(qsTr("Your library is full — delete a character to free a slot."), "warning")
        }
    }

    // Context menu styled to match the theme — a raw Controls Menu renders with
    // the unstyled Basic style (system colors), which looked broken next to
    // the dark UI. Items carry an icon disc-less row: icon + label + optional
    // trailing check; destructive actions render red.
    Menu {
        id: ctxMenu
        property string characterId: ""
        property string characterName: ""
        property bool isStarter: false

        background: Rectangle {
            implicitWidth: 220
            color: Colors.surfaceOverlay
            border.color: Colors.surfaceBorder
            border.width: 1
            radius: Theme.radiusMd
            clip: true
            Honeycomb {
                anchors.fill: parent
                cellSize: Theme.honeycombCell
                lineColor: Colors.honeycombLineFaint
                opacity: 0.5
            }
            Rectangle {
                anchors.left: parent.left; anchors.right: parent.right; anchors.top: parent.top
                height: 1; color: Colors.insetHighlightSoft
                z: Theme.zLocal1
            }
            CornerTicks {
                anchors.fill: parent
                inset: 5
                tickSize: 7
                thickness: 1
                color: Colors.accent30
                z: Theme.zLocal1
            }
        }
        delegate: MenuItem {
            id: mi
            implicitWidth: 220
            implicitHeight: 34
            leftPadding: 10
            rightPadding: 10
            background: Rectangle {
                color: mi.highlighted ? Colors.overlay50 : Colors.transparent
                radius: Theme.radiusXs
            }
            contentItem: RowLayout {
                spacing: 10
                Icon {
                    name: mi.iconName || ""
                    size: 14
                    color: mi.destructive
                         ? (mi.highlighted ? Colors.statusError
                            : Qt.rgba(Colors.statusError.r, Colors.statusError.g, Colors.statusError.b, 0.7))
                         : (mi.highlighted ? Colors.textSecondary : Colors.textMuted)
                }
                Text {
                    text: mi.text
                    color: mi.destructive
                         ? (mi.highlighted ? Colors.statusError
                            : Qt.rgba(Colors.statusError.r, Colors.statusError.g, Colors.statusError.b, 0.85))
                         : (mi.enabled ? Colors.textPrimary : Colors.textMuted)
                    font.pixelSize: 12
                    Layout.fillWidth: true
                    elide: Text.ElideRight
                    verticalAlignment: Text.AlignVCenter
                }
                Icon {
                    visible: mi.showCheck
                    name: "check"
                    size: 12
                    color: Colors.accentHover
                }
            }
        }

        MenuItem {
            property string iconName: "check"
            property bool showCheck: Session.activeCharacterId === ctxMenu.characterId
            text: qsTr("Select")
            onTriggered: {
                var idx = Catalog.indexOfId(ctxMenu.characterId)
                var m = idx >= 0 ? Catalog.get(idx) : null
                Session.setActiveCharacter(ctxMenu.characterId, ctxMenu.characterName,
                                           m && m.thumbnail ? m.thumbnail : "",
                                           m && m.description ? m.description : "")
            }
        }

        MenuItem {
            property string iconName: "pencil"
            text: qsTr("Rename…")
            enabled: !ctxMenu.isStarter
            onTriggered: {
                renameDialog.targetId = ctxMenu.characterId
                renameDialog.targetName = ctxMenu.characterName
                renameDialog.open()
            }
        }
        MenuItem {
            property string iconName: "trash"
            property bool destructive: true
            text: qsTr("Delete…")
            enabled: !ctxMenu.isStarter
            onTriggered: {
                deleteConfirm.characterId = ctxMenu.characterId
                deleteConfirm.characterName = ctxMenu.characterName
                deleteConfirm.open()
            }
        }
        MenuItem {
            property string iconName: "eye-off"
            text: qsTr("Hide starter")
            visible: ctxMenu.isStarter
            onTriggered: {
                Catalog.hideStarter(ctxMenu.characterId)
                App.notify(qsTr("Hidden %1").arg(ctxMenu.characterName), "info")
            }
        }
    }


    // Delete confirm (single dialog for both trash-click and menu paths)
    ConfirmDialog {
        id: deleteConfirm
        property string characterId: ""
        property string characterName: ""
        title: qsTr("Delete character?")
        message: qsTr("%1 will be removed from your library. This cannot be undone.").arg(deleteConfirm.characterName)
        confirmText: qsTr("Delete")
        destructive: true
        onAccepted: {
            if (Session.activeCharacterId === deleteConfirm.characterId)
                Session.setActiveCharacter("", "", "", "")
            Catalog.deleteCharacter(deleteConfirm.characterId)
            App.notify(qsTr("Deleted %1").arg(deleteConfirm.characterName), "info")
        }
    }

    Dialog {
        id: renameDialog
        property string targetId: ""
        property string targetName: ""
        title: qsTr("Rename character")
        modal: true
        anchors.centerIn: Overlay.overlay
        width: 320
        standardButtons: Dialog.Ok | Dialog.Cancel
        background: Rectangle {
            color: Colors.surfaceOverlay
            border.color: Colors.surfaceBorder
            radius: Theme.radiusMd
        }
        contentItem: ColumnLayout {
            spacing: 12
            TextField {
                id: renameField
                Layout.fillWidth: true
                text: renameDialog.targetName
                placeholderText: qsTr("Character name")
                maximumLength: 40
            }
        }
        onAccepted: {
            if (renameField.text.trim().length) {
                Catalog.renameCharacter(renameDialog.targetId, renameField.text.trim())
                App.notify(qsTr("Renamed"), "success")
            }
        }
        onOpened: renameField.forceActiveFocus()
    }

    Component.onCompleted: {
        if (Catalog.count === 0)
            Catalog.load()
    }
}
