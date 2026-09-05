# LiveMorph i18n (Qt6 Linguist)

## How it works

1. Source strings: `qsTr("...")` in QML, `tr("...")` in C++.
2. Catalogs: `livemorph_<lang>.ts` (Qt Linguist XML).
3. **CMake** `qt_add_translations()` runs **lrelease** and embeds `.qm` under `:/i18n/`.
4. **I18nManager** loads `QTranslator` and calls `engine->retranslate()`.

## Languages (20)

en es fr de pt it nl pl sv tr ru uk ar hi id vi th zh ja ko

## Manual lrelease

```bash
for f in livemorph_*.ts; do lrelease "$f" -qm "${f%.ts}.qm"; done
```

## Editing translations

Open any `.ts` in **Qt Linguist**, or finish `type="unfinished"` entries, then rebuild.
