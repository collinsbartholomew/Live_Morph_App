# Package LiveMorph for desktop

LiveMorph is a Qt Quick desktop client. It does not use QtWebEngine or Chromium. Media is peer-to-peer between the client and Decart through GStreamer `webrtcbin`.

## Prerequisites

- Qt 6.5+ with Quick, Multimedia, WebSockets, Svg, Test, and LinguistTools
- GStreamer 1.x with WebRTC, nice, srtp, base, good, bad, and libav plugins
- A C++20 toolchain and the platform deployment tools (`windeployqt` or `macdeployqt`)

Build and verify from `apps/livemorph`:

```bash
cp .env.example .env
# Set LIVEMORPH_API_URL to the public HTTPS backend origin, then compile.
./build.sh
```

The binary and app bundle are written under `build/bin/`. The frontend env file is required before compilation and supplies the API origin.

## Linux

```bash
./packaging/deploy-linux.sh build/bin/LiveMorph
./build/bin/dist/LiveMorph.sh --verify-qml
```

Ship `build/bin/dist/` and start with `LiveMorph.sh`. The script uses `qmake6`/`qmake` for Qt paths and `pkg-config` for GStreamer paths. `QMAKE`, `QT_LIBDIR`, `QT_PLUGIN_DIR`, `QT_QML_DIR`, `GST_LIBDIR`, and `GST_PLUGIN_DIR` can override discovery.

Missing required libraries, QML modules, WebRTC plugins, or unresolved shared-library dependencies are fatal. The staged application must pass QML verification before the script reports success.

## macOS

```bash
QTDIR=/path/to/Qt/6.x ./packaging/deploy-macos.sh build/bin/LiveMorph.app
```

The DMG is created beside the app bundle. `MACDEPLOYQT` and `QMAKE` can override tool discovery. Target Macs must install the full GStreamer runtime with WebRTC plugins; the script does not claim to bundle it.

## Windows

Run from `apps/livemorph` in a Qt/GStreamer developer shell:

```powershell
.\packaging\deploy-windows.ps1 -BuildDir build\bin -QtDir C:\Qt\6.x\msvc2022_64 -GstDir C:\gstreamer\1.0\msvc_x86_64
```

Ship the entire directory containing `LiveMorph.exe` and use `LiveMorph.bat` so versioned GStreamer plugin paths are set. Missing GStreamer files are fatal unless `-AllowSystemGStreamer` is explicitly supplied; that option requires the full MSVC runtime on every target machine.

## Included runtime resources

- Embedded QML and the LiveMorph QML module
- `Colors`, `Theme`, `Constants`, and `PlatformSettings` singletons
- Qt Quick plugins and platform integration
- Maple Mono fonts and image assets
- Embedded English i18n source catalog and online translation cache support
- GStreamer shared libraries and plugins on Linux and Windows

## OAuth and payment deep links

The backend callback is:

```text
https://your-api.example/api/v1/auth/oauth/google/callback
```

It redirects to `omegarevelation://oauth/callback?ticket=...`. Installers also register legacy `livemorph://` callbacks:

- Windows: NSIS writes both HKCU protocol registrations at install time.
- macOS: `Info.plist` declares both URL schemes.
- Linux: the desktop entry declares both `x-scheme-handler` MIME types.

For a manual Linux desktop-entry installation:

```bash
xdg-mime default livemorph.desktop x-scheme-handler/omegarevelation
xdg-mime default livemorph.desktop x-scheme-handler/livemorph
```
