# LiveMorph Qt6

Native desktop client: **C++17 + Qt 6 QML**. Auth and data via **your Rust + MongoDB backend only**.

No Supabase. No OAuth/Google login.

## Features

- Email magic-link / OTP + password auth
- Dashboard, Stage, Workshop, Settings, Buy Credits
- Morph Stage: embedded WebEngine (browser WebRTC) — not an external browser
- Runtime language switch (`I18n.setLanguage`) via Qt `QTranslator` + `retranslate()`
- Payments via backend Paystack APIs

## Build

```bash
cmake -B build -DCMAKE_PREFIX_PATH=/path/to/Qt/6.x   # kit must include WebEngine
cmake --build build -j
```

## Package (bundle WebEngine)

See `packaging/README.md`. WebEngine is shipped **inside** the installer with `windeployqt` / `macdeployqt` / linux deploy — users do not install Chromium separately.

## i18n

```qml
I18n.setLanguage("es")   // live switch, no restart
```

Add strings with `qsTr("...")`, run `lupdate`, translate `.ts`, `lrelease` → `:/i18n/livemorph_xx.qm`.
