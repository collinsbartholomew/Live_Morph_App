# Ship LiveMorph with WebEngine bundled

Users never install Chromium separately. You build once per OS and run the deploy script.

## Prerequisites

- Qt 6.5+ **with WebEngine** component installed in the kit
- Release build of LiveMorph

```bash
cmake -B build -DCMAKE_PREFIX_PATH=/path/to/Qt/6.x -DCMAKE_BUILD_TYPE=Release
cmake --build build -j
```

## Windows

```powershell
.\packaging\deploy-windows.ps1 -BuildDir build\Release -QtDir C:\Qt\6.x\msvc2019_64
```

Distributes the whole `Release` folder (or wrap with NSIS/Inno).

CMake alternative after build:

```bat
cmake --build build --target deploy-win
```

## macOS

```bash
export QTDIR=/path/to/Qt/6.x/macos
./packaging/deploy-macos.sh build/LiveMorph.app
```

## Linux

```bash
export CMAKE_PREFIX_PATH=/path/to/Qt/6.x/gcc_64
./packaging/deploy-linux.sh build/LiveMorph
# or AppImage via linuxdeploy-plugin-qt
```

## What gets included

- `QtWebEngineProcess` (+ `.exe` on Windows)
- `libQt6WebEngineCore` / Quick
- Chromium `.pak` resources + locale packs
- Your QML (embedded) + optional `i18n/*.qm`

Morph video stays **inside the Stage** of the same window.


## Deep links (Google OAuth return)

Register the custom URL scheme so the browser can return tokens to the app:

- **Windows (Inno/NSIS):** `Registry` HKCU `Software\Classes\livemorph\shell\open\command` = `"path\to\LiveMorph.exe" "%1"`
- **macOS:** `CFBundleURLTypes` with scheme `livemorph` in Info.plist
- **Linux:** `MimeType=x-scheme-handler/livemorph;` in the `.desktop` file and `xdg-mime default livemorph.desktop x-scheme-handler/livemorph`

Callback URL configured in Google Cloud Console must be the **backend** redirect:
`https://your-api.example/api/v1/auth/oauth/google/callback`
which then 302-redirects to `livemorph://oauth/callback?access_token=...`.
