# LiveMorph Qt6

Native C++20 and Qt 6 QML desktop client. Auth and data use the Rust backend; WebRTC media uses GStreamer `webrtcbin` directly between the client and Decart. QtWebEngine is not used.

## Features

- Email OTP, password, and optional Google OAuth through the backend
- Dashboard, Stage, Workshop, Settings, Buy Credits, and Downloads
- Local MJPEG output for OBS and virtual-camera workflows
- Online runtime translation with an embedded English catalog and cached language JSON
- Paystack and optional crypto payments through backend APIs

## Build and verify

Install Qt 6.5+ with Multimedia, WebSockets, Svg, Test, and LinguistTools, a C++20 compiler, and GStreamer development packages with WebRTC support.

```bash
cp .env.example .env
# Set LIVEMORPH_API_URL to the public HTTPS backend origin, then compile.
./build.sh
```

The Release build requires `.env` and runs the CTest suite plus headless QML verification. Use `CMAKE_PREFIX_PATH=/path/to/Qt/6.x ./build.sh` for a custom Qt kit. `LIVEMORPH_ENV_FILE`, `BUILD_DIR`, `BUILD_TYPE`, `JOBS`, and `VERIFY=0` are optional overrides.

The configured env origin replaces all local fallbacks. An explicit Settings choice can override it, and `LIVEMORPH_API_URL` can override it at process launch. Backend secrets must never be included in the desktop app.

## Package

See [packaging/README.md](packaging/README.md) and [the deployment guide](../../docs/DEPLOYMENT.md). Platform scripts verify required Qt/GStreamer runtimes and the packaged QML application.

## i18n

Use `qsTr()` for visible strings. After changes, resync the English source catalog:

```bash
lupdate qml src -ts i18n/livemorph_en.ts -no-obsolete
```

Runtime translation is downloaded and cached by `I18nManager`; `.qm` language catalogs are not required.
