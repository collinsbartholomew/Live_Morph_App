pragma Singleton
import QtQuick
import QtCore as QtC

// Recording / advanced preferences, persisted via the QtCore QML Settings
// type (QSettings under the hood — org/application from QCoreApplication).
// Namespaced import avoids clashing with this file's own type name.
Item {
    id: root

    property string outputDir: ""
    property bool includeMicrophone: true
    property string recordingQuality: "balanced"
    property bool autoRecordOnSwap: false

    QtC.Settings {
        property alias outputDir: root.outputDir
        property alias includeMicrophone: root.includeMicrophone
        property alias recordingQuality: root.recordingQuality
        property alias autoRecordOnSwap: root.autoRecordOnSwap
    }
}
