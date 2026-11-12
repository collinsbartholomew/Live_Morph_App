# Investigation notes (blank screen / QML)

## Root cause of empty window

1. **PrimaryButton** invalid: `font:` + `font.weight:` on same Text → component failed
2. Cascading: AuthScreen uses PrimaryButton → Auth Loader empty → only TitleBar visible

## Additional issues found and fixed

| Issue | Fix |
|-------|-----|
| `TextField.qml` recursive type | `import QtQuick.Controls as Controls` + `Controls.TextField` |
| `Switch.qml` recursive type | same pattern with `Controls.Switch` |
| Buttons ambiguous Controls | `Controls.Button` alias |
| `Icon.qml` missing import | `import LiveMorph` |
| CMake linker vs QML dir clash | `CMAKE_RUNTIME_OUTPUT_DIRECTORY=.../bin` |
| `qml/qmldir` in QML_FILES | removed (should be module metadata only) |
| deprecated `_qs` | `QStringLiteral` |

## Still external / env

- VDPAU warning: no NVIDIA lib — cosmetic
- WebEngine for morph Stage only after login
- Backend must run on :3874 for real auth

## Rebuild

```bash
cmake -S LiveMorphQt -B build -DCMAKE_BUILD_TYPE=Debug \
  -DCMAKE_RUNTIME_OUTPUT_DIRECTORY=$PWD/build/bin
cmake --build build -j1
./build/bin/LiveMorph
```
