import LiveMorph
import QtQuick
import QtQuick.Layouts

/**
 * NotificationToastHost — transient toast stack (bottom-right).
 *
 * Modern behavior:
 *  - per-severity lifetime: errors are STICKY (never auto-dismiss, never
 *    evicted), warnings 6s, success/info 4.5s; actionable toasts sticky.
 *  - max 3 visible; eviction drops the oldest non-sticky, info before others.
 *  - duplicate message+type anywhere in the stack refreshes that toast.
 *  - non-error inbox mirrors are rate-limited to 1 per 300ms; a dropped one
 *    is queued (1-slot) and flushed when the window ends — nothing is lost.
 *  - hover pauses the countdown without resetting it; progress bar is a thin
 *    type-colored rail at the card bottom. All transitions instant (no
 *    animation elements — project directive).
 *
 * Toast cards: 3px left type rail + severity icon disc + title/detail +
 * optional action chip + close button. Flat (no shadows — project directive).
 */
Item {
    id: root

    // Toast presentation policy lives in Notifier (C++): maxToasts + per-severity
    // auto-dismiss durations. 0 duration = sticky (never auto-dismiss).
    property int maxToasts: Notifier.maxToasts
    property int _seq: 0
    property int _lastMirrorTs: 0
    property var _pendingMirror: null // 1-slot queue for throttled mirrors
    // Toast action callbacks live in a JS side-map (keyed by toastId), not in
    // the ListModel: storing functions/nulls in model roles breaks role setup.
    property var _cbs: ({})

    function typeColor(t) {
        if (t === "error") return Colors.statusError
        if (t === "success") return Colors.statusSuccess
        if (t === "warning") return Colors.statusWarning
        return Colors.statusInfo
    }
    function typeIcon(t) {
        if (t === "error") return "x-circle"
        if (t === "success") return "check-circle"
        if (t === "warning") return "alert-circle"
        return "info"
    }
    function durationFor(t) {
        var d = Notifier.toastDurationMs(t)
        return d > 0 ? d : 4500
    }
    function isSticky(t, actionLabel) {
        return t === "error" || Notifier.toastDurationMs(t) === 0 || (actionLabel && actionLabel.length > 0)
    }

    // Inbox mirror: rate-limit non-error bursts to 1 per 300ms, but queue the
    // latest dropped one and flush it when the window ends (no silent loss).
    // Skipped entirely while the inbox panel is open — the item is right there.
    function mirror(title, sev, body, repeat) {
        if (Notifier.inboxOpen)
            return
        var now = Date.now()
        if (sev !== "error" && _lastMirrorTs > 0 && now - _lastMirrorTs < 300) {
            _pendingMirror = { "title": title, "sev": sev, "body": body, "repeat": repeat || 1 }
            flushTimer.restart()
            return
        }
        _lastMirrorTs = now
        show(title, sev, body, "", null, repeat)
    }

    function show(msg, t, det, action, cb, repeat) {
        var m = msg || ""
        var k = t || "info"
        var d = det || ""
        var a = action || ""
        var f = cb || null
        var rep = repeat || 1
        // Duplicate anywhere in the visible stack refreshes that toast.
        for (var i = 0; i < toastModel.count; i++) {
            var head = toastModel.get(i)
            if (head.message === m && head.type === k) {
                var total = root.isSticky(k, head.actionLabel) ? 0 : root.durationFor(k)
                toastModel.set(i, { "remaining": total, "total": total, "exiting": false,
                                    "repeat": Math.max(head.repeat || 1, rep) })
                return
            }
        }
        var id = ++root._seq
        if (f)
            root._cbs[id] = f
        var sticky = root.isSticky(k, a)
        var total2 = sticky ? 0 : root.durationFor(k)
        toastModel.insert(0, {
            "toastId": id,
            "message": m,
            "type": k,
            "detail": d,
            "actionLabel": a,
            "repeat": rep,
            "remaining": total2,
            "total": total2,
            "hovered": false,
            "exiting": false
        })
        root._trim()
    }

    function invokeCb(id) {
        var f = root._cbs[id]
        delete root._cbs[id]
        if (typeof f === "function")
            f()
    }

    // Eviction: sticky (error/action) toasts are never evicted; otherwise drop
    // the oldest non-sticky, preferring info over warning/success.
    function _trim() {
        while (toastModel.count > root.maxToasts) {
            var drop = -1
            for (var i = toastModel.count - 1; i >= 0; i--) {
                var it = toastModel.get(i)
                if (!root.isSticky(it.type, it.actionLabel)) { drop = i; break }
            }
            if (drop < 0) {
                // All sticky: drop the oldest info-ish one, else the last.
                for (var j = toastModel.count - 1; j >= 0; j--) {
                    if (toastModel.get(j).type === "info") { drop = j; break }
                }
                if (drop < 0)
                    drop = toastModel.count - 1
            }
            delete root._cbs[toastModel.get(drop).toastId]
            toastModel.remove(drop, 1)
        }
    }

    function removeById(id) {
        for (var i = 0; i < toastModel.count; i++) {
            if (toastModel.get(i).toastId === id) {
                delete root._cbs[id]
                toastModel.remove(i, 1)
                return
            }
        }
        delete root._cbs[id]
    }

    function dismiss() {
        toastModel.clear()
        root._cbs = {}
        root._pendingMirror = null
        flushTimer.stop()
    }

    // False on pages without the action/status chrome (auth) so the stack
    // hugs the bottom edge instead of floating a chrome-height above it.
    property bool pageChrome: true

    // Bottom-right stack, above the status + action bars (compact-aware).
    anchors.right: parent.right
    anchors.bottom: parent.bottom
    anchors.rightMargin: 24
    anchors.bottomMargin: root.pageChrome
        ? Theme.statusBarHeight
          + ((parent.height < Theme.compactChromeBelow || Config.compactChrome)
             ? Theme.actionBarHeightCompact : Theme.actionBarHeight) + 16
        : 24
    width: Theme.toastWidth
    height: col.implicitHeight
    z: Theme.zToast

    ListModel {
        id: toastModel
    }

    Column {
        id: col
        width: parent.width
        spacing: 10

        // Dismiss-all chip above the stack
        Rectangle {
            visible: toastModel.count > 1
            width: dismissAllLbl.implicitWidth + 14
            height: 22
            radius: Theme.radiusXs
            color: dismissAllMa.containsMouse ? Colors.overlay50 : Colors.raised95
            border.color: Colors.surfaceBorderSubtle
            border.width: 1
            anchors.right: parent.right
            Text {
                id: dismissAllLbl
                anchors.centerIn: parent
                text: qsTr("DISMISS ALL")
                color: dismissAllMa.containsMouse ? Colors.textSecondary : Colors.textMuted
                font.family: Theme.fontMono.family
                font.pixelSize: 9
                font.weight: Font.Bold
                font.letterSpacing: 1.0
            }
            MouseArea {
                id: dismissAllMa
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: root.dismiss()
            }
        }

        Repeater {
            model: toastModel

            delegate: Item {
                id: wrap
                required property var model
                property bool shown: false
                readonly property color tc: root.typeColor(model.type)

                width: col.width
                height: card.implicitHeight
                visible: opacity > 0.001
                opacity: model.exiting ? 0 : (shown ? 1 : 0)
                Component.onCompleted: shown = true
                transform: Translate { y: wrap.shown && !wrap.model.exiting ? 0 : 10 }

                Rectangle {
                    id: card
                    width: parent.width
                    implicitHeight: inner.implicitHeight + 20
                    radius: Theme.radiusSm
                    color: Colors.raised95
                    border.width: 1
                    border.color: Colors.surfaceBorder
                    clip: true

                    // Card body click opens the notification center. Declared
                    // FIRST (bottom of paint order) so the action chip and
                    // close button above keep receiving their own clicks.
                    // Hover also pauses the countdown without resetting it.
                    MouseArea {
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onEntered: model.hovered = true
                        onExited: model.hovered = false
                        onClicked: App.requestOpenNotifications()
                    }

                    // Left type rail (3px, type color) — the severity cue.
                    // Square-edged; the card's clip + radius shapes the corner.
                    Rectangle {
                        anchors.left: parent.left
                        anchors.top: parent.top
                        anchors.bottom: parent.bottom
                        width: 3
                        radius: Theme.radiusXs
                        color: wrap.tc
                    }

                    // Hex-tech corner frame on hover (signature motif)
                    CornerTicks {
                        anchors.fill: parent
                        visible: model.hovered
                        inset: 4
                        tickSize: 6
                        thickness: 1
                        color: Qt.rgba(wrap.tc.r, wrap.tc.g, wrap.tc.b, 0.8)
                    }

                    RowLayout {
                        id: inner
                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.top: parent.top
                        anchors.leftMargin: 14
                        anchors.rightMargin: 10
                        anchors.topMargin: 10
                        spacing: 10

                        // Severity hex badge: outlined hex + glyph (monochrome-
                        // weighted; only the semantic hue reads through)
                        Item {
                            width: 24; height: 24
                            Layout.alignment: Qt.AlignTop
                            Hexagon {
                                anchors.centerIn: parent
                                size: 24
                                lineWidth: 1
                                lineColor: Qt.rgba(wrap.tc.r, wrap.tc.g, wrap.tc.b, 0.45)
                                fillColor: Qt.rgba(wrap.tc.r, wrap.tc.g, wrap.tc.b, 0.10)
                            }
                            Icon {
                                anchors.centerIn: parent
                                name: root.typeIcon(model.type)
                                size: 12
                                color: wrap.tc
                            }
                        }

                        ColumnLayout {
                            Layout.fillWidth: true
                            spacing: 2

                            Text {
                                text: model.message + (model.repeat > 1 ? "  ×" + model.repeat : "")
                                textFormat: Text.PlainText // server-derived — never rich text
                                color: Colors.textPrimary
                                font.pixelSize: 12
                                font.weight: Font.Bold
                                wrapMode: Text.WordWrap
                                Layout.fillWidth: true
                            }
                            Text {
                                visible: model.detail && model.detail.length > 0
                                text: model.detail || ""
                                textFormat: Text.PlainText // server-derived — never rich text
                                color: Colors.textMuted
                                font.pixelSize: 11
                                wrapMode: Text.WordWrap
                                Layout.fillWidth: true
                                maximumLineCount: 2
                                elide: Text.ElideRight
                            }
                        }

                        // Action chip
                        Rectangle {
                            visible: model.actionLabel && model.actionLabel.length > 0
                            radius: Theme.radiusXs
                            color: Colors.accent10
                            border.color: Colors.accent30
                            border.width: 1
                            implicitWidth: actLbl.implicitWidth + 14
                            implicitHeight: 24
                            Layout.alignment: Qt.AlignVCenter
                            Text {
                                id: actLbl
                                anchors.centerIn: parent
                                text: (model.actionLabel || "").toUpperCase()
                                color: Colors.accentHover
                                font.family: Theme.fontMono.family
                                font.pixelSize: 9
                                font.weight: Font.Bold
                                font.letterSpacing: Theme.trackingEyebrow
                            }
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: {
                                    root.invokeCb(model.toastId)
                                    root.removeById(model.toastId)
                                }
                            }
                        }

                        // Close
                        Rectangle {
                            width: 22; height: 22
                            radius: Theme.radiusXs
                            color: dismissMa.containsMouse ? Colors.white10 : Colors.transparent
                            Layout.alignment: Qt.AlignTop
                            Icon {
                                anchors.centerIn: parent
                                name: "x"
                                size: 12
                                color: dismissMa.containsMouse ? Colors.textPrimary : Colors.textMuted
                            }
                            MouseArea {
                                id: dismissMa
                                anchors.fill: parent
                                anchors.margins: -4
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor
                                onClicked: root.removeById(model.toastId)
                            }
                        }
                    }

                    // Thin progress rail (only for auto-dismissing toasts)
                    Item {
                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.bottom: parent.bottom
                        anchors.leftMargin: 6
                        anchors.rightMargin: 6
                        height: 2
                        visible: model.total > 0 && !model.exiting
                        Rectangle {
                            anchors.fill: parent
                            color: Colors.divider
                            radius: Theme.radiusHairline
                        }
                        Rectangle {
                            anchors.left: parent.left
                            width: parent.width * Math.max(0, model.remaining) / Math.max(1, model.total)
                            height: parent.height
                            radius: Theme.radiusHairline
                            color: wrap.tc
                            opacity: 0.6
                        }
                    }
                }

                // Exit completion -> remove the row
                Timer {
                    interval: 200
                    running: model.exiting
                    onTriggered: root.removeById(model.toastId)
                }
            }
        }
    }

    // Mirror inbox events as transient toasts
    Connections {
        function onPushed(id) {
            var it = Notifier.itemById(id)
            if (it && it.title)
                root.mirror(it.title, it.severity, it.body, it.repeat)
        }
        // "Clear all" wipes the inbox AND the visible toast stack.
        function onCleared() {
            root.dismiss()
        }
        target: Notifier
    }

    // Flush a queued mirror when the rate-limit window ends
    Timer {
        id: flushTimer
        interval: 300
        onTriggered: {
            if (root._pendingMirror) {
                var p = root._pendingMirror
                root._pendingMirror = null
                if (Notifier.inboxOpen)
                    return // inbox is open — the item is already listed there
                root._lastMirrorTs = Date.now()
                root.show(p.title, p.sev, p.body, "", null, p.repeat)
            }
        }
    }

    // Single shared auto-dismiss driver — only runs while toasts exist
    Timer {
        interval: 250
        repeat: true
        running: toastModel.count > 0
        onTriggered: {
            for (var i = toastModel.count - 1; i >= 0; i--) {
                var it = toastModel.get(i)
                // Sticky toasts (errors, actionable) never auto-dismiss.
                if (it.exiting || it.hovered || it.total === 0)
                    continue
                var rem = it.remaining - 250
                if (rem <= 0)
                    toastModel.set(i, { "exiting": true, "remaining": 0 })
                else
                    toastModel.set(i, { "remaining": rem })
            }
        }
    }
}
