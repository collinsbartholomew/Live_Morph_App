#pragma once

#include <QObject>
#include <QString>
#include <QImage>

// MorphRecorder — encodes the decoded morph-output frames (from the AI engine)
// to a local file via a small GStreamer appsrc pipeline. Mirrors Electron's
// MediaRecorder-on-RemoteStream behavior: the saved file contains the morphed
// output, not the camera.
//
// Lifecycle: open(path) → appendFrame(qimage)… → close().
// Caps are set lazily from the FIRST appended frame (actual size + fps), so
// recordings work at any output resolution (standard 960x540, HD 1280x720).
class MorphRecorder
{
public:
    MorphRecorder() = default;
    ~MorphRecorder();

    bool open(const QString &path, int fps = 30, QString *err = nullptr);
    bool active() const { return m_open; }
    void appendFrame(const QImage &img);
    bool close(QString *err = nullptr);

private:
    struct Impl;
    Impl *m_impl = nullptr;
    bool m_open = false;
};
