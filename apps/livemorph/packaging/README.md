# Package LiveMorph for desktop

LiveMorph is a Qt Quick (QML) desktop client. It does **not** use QtWebEngine or Chromium — media is peer-to-peer between the client and Decart via GStreamer `webrtcbin` (see `tools/spike-m0/M0_REPORT.md`). Bundle the Qt Quick stack, not WebEngine binaries.

## Prerequisites

- Qt 6.5+ with: Qt Quick, Multimedia, WebSockets, Svg, Test, LinguistTools
- GStreamer 1.x dev packages with `gstreamer-webrtc-1.0` (for the `gstpeer` shared lib)
- C++20 toolchain

```bash
cmake -B build -S apps/livemorph -DCMAKE_PREFIX_PATH=/path/to/Qt/6.x -DCMAKE_BUILD_TYPE=Release
cmake --build build -j
```
The binary lands at `build/bin/LiveMorph` (Release preset).

## Platform deploy scripts

- Linux: `apps/livemorph/packaging/deploy-linux.sh build/bin/LiveMorph` (TGZ/DEB via CPack; bundles QuickLayouts, QuickShapes, scenegraph plugins + resolves multiarch GStreamer triplet)
- macOS: `apps/livemorph/packaging/deploy-macos.sh build/LiveMorph.app` (DragNDrop via CPack; `MACOSX_BUNDLE` set)
- Windows: `apps/livemorph\packaging\deploy-windows.ps1 -BuildDir build\Release -QtDir C:\Qt\6.x\msvc2019_64` (ZIP/NSIS via CPack; `WIN32` set)

## What gets included

- Embedded QML (`qml/`, compiled into the app via `resources.qrc`)
- `theme/` singletons (`Colors`, `Theme`, `Constants`, `PlatformSettings`)
- Qt Quick plugins: QuickLayouts, QuickShapes, scenegraph
- Fonts (`:/fonts/`, Maple Mono) and assets (`:/assets/`)
- i18n catalog `i18n/livemorph_en.ts` (runtime online translation, no `.qm` at runtime)

**Not included:** `QtWebEngineProcess`, `libQt6WebEngineCore`, Chromium `.pak`/locale packs — the app is Qt Quick only.

## Deep links (Google OAuth return)

Register the custom URL scheme so the browser can return tokens to the app:

- **Windows (Inno/NSIS):** `Registry` HKCU `Software\Classes\livemorph\shell\open\command` = `"path\to\LiveMorph.exe" "%1"`
- **macOS:** `CFBundleURLTypes` with scheme `livemorph` in Info.plist
- **Linux:** `MimeType=x-scheme-handler/livemorph;` in the `.desktop` file and `xdg-mime default livemorph.desktop x-scheme-handler/livemorph`

Callback URL configured in Google Cloud Console must be the **backend** redirect:
`https://your-api.example/api/v1/auth/oauth/google/callback`
which then 302-redirects to `livemorph://oauth/callback?ticket=...` (desktop redeems the ticket for a JWT pair).
