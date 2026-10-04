import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import QtQuick.Dialogs
import LiveMorph

/**
 * UploadTab — drag-and-drop zone for reference image upload.
 * Shows image preview after selection, with consent gating.
 */
Item {
    id: root

    property string pendingImagePath: ""
    property bool isDragging: false

    signal imageSelected(string path)

    function localPath(url) {
        var s = url.toString()
        if (s.startsWith("file:///"))
            s = s.substring(8)
        else if (s.startsWith("file://"))
            s = s.substring(7)
        try {
            return decodeURIComponent(s)
        } catch (e) {
            return s
        }
    }

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 8
        spacing: 12

        Text {
            text: qsTr("Upload reference")
            color: Colors.textSecondary
            font.pixelSize: Theme.fontSmall.pixelSize
            font.weight: Font.DemiBold
        }

        Text {
            text: qsTr("Drop an image or click to browse.\nPNG, JPG, or WebP — max 10 MB.")
            color: Colors.textMuted
            font.pixelSize: 11
            wrapMode: Text.WordWrap
            Layout.fillWidth: true
        }

        // Drop zone
        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 160
            radius: Theme.radiusMd
            color: isDragging ? Colors.accentMuted : Colors.surfaceBase
            border.color: isDragging ? Colors.accent
                                     : (dropZoneMa.containsMouse && !previewImage.visible ? Colors.accent40 : Colors.surfaceBorder)
            border.width: isDragging ? 2 : 1

            Behavior on border.color { ColorAnimation { duration: Theme.motionFast } }

            Column {
                anchors.centerIn: parent
                spacing: 8
                visible: !previewImage.visible

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "↑"
                    color: Colors.textMuted
                    font.pixelSize: 28
                }
                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: qsTr("Drop image here")
                    color: Colors.textSecondary
                    font.pixelSize: 12
                }
            }

            Image {
                id: previewImage
                anchors.fill: parent
                anchors.margins: 4
                source: pendingImagePath || ""
                fillMode: Image.PreserveAspectFit
                visible: source.toString().length > 0
                asynchronous: true
            }

            // Click + drag-and-drop handling — declared BEFORE the clear
            // button so the ✕ stacks above it (the old order buried the ✕
            // under the full-area MouseArea: clicking it opened the file
            // dialog instead of clearing).
            MouseArea {
                id: dropZoneMa
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: fileDialog.open()

                DropArea {
                    anchors.fill: parent
                    onEntered: root.isDragging = true
                    onExited: root.isDragging = false
                    onDropped: function(drop) {
                        root.isDragging = false
                        if (drop.hasUrls) {
                            var path = root.localPath(drop.urls[0])
                            if (path.match(/\.(png|jpe?g|webp)$/i)) {
                                root.pendingImagePath = path
                            } else {
                                App.notify("Unsupported file format. Use PNG, JPG, or WebP.", "error")
                            }
                        }
                    }
                }
            }

            // Clear button on preview (above the click layer)
            IconButton {
                visible: previewImage.visible
                anchors.top: parent.top
                anchors.right: parent.right
                anchors.margins: 4
                z: 2
                iconText: "✕"
                onClicked: {
                    pendingImagePath = ""
                }
            }
        }

        PrimaryButton {
            Layout.fillWidth: true
            text: qsTr("Use this image")
            enabled: pendingImagePath.length > 0
            onClicked: {
                // Check consent first
                if (!Config.uploadConsentShown) {
                    consentDialog.open()
                    return
                }
                root.imageSelected(pendingImagePath)
                App.notify("Reference image applied", "success")
            }
        }
    }

    FileDialog {
        id: fileDialog
        title: qsTr("Select reference image")
        nameFilters: [qsTr("Images") + " (*.png *.jpg *.jpeg *.webp)"]
        onAccepted: {
            root.pendingImagePath = root.localPath(selectedFile)
        }
    }

    UploadConsentDialog {
        id: consentDialog
        onAccepted: {
            root.imageSelected(root.pendingImagePath)
            App.notify("Reference image applied", "success")
        }
    }
}
