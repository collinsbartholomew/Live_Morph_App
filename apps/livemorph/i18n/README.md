# LiveMorph i18n (runtime online translation, no .qm catalogs)

## How it works

1. Source strings are English-only: `qsTr("...")` in QML, `tr("...")` in C++.
   Plural form: `qsTr("singular", "plural", n)` — both forms are translated.
2. `i18n/livemorph_en.ts` is the embedded English catalog (embedded at `:/i18n/livemorph_en.ts`
   via `qt_add_resources`; `qt_add_translations` exists only so `lupdate` can rescan it —
   it does NOT produce runtime `.qm` files).
3. On a non-English switch, `I18nManager` (`apps/common/i18n/`) batches the unique source
   strings into GET requests to `https://clients5.google.com/translate_a/t` — one batch in
   flight, batches sized by a ~6 KB encoded-URL byte budget (the endpoint rejects POST with
   429 and long URLs), with exponential backoff (500 ms→4 s, up to 4 retries) on failure
   because the endpoint rate-limits bursts with 429.
4. Results are cached as JSON at
   `QStandardPaths::AppConfigLocation/translations/<lang>.json` (7-day TTL, atomic
   `QSaveFile` write). A stale cache still applies instantly and refreshes in background.
5. A `JsonTranslator` (a `QTranslator` subclass) serves lookups keyed by
   (context, source); `engine->retranslate()` applies a live switch with no restart.
   Duplicate sources across components are translated per-context; plural lookups
   pick singular/plural by `n`.

## Languages (21)

en es fr de pt it nl pl sv tr ru uk ar hi id vi th zh ja ko

## After adding or changing source strings

```bash
cd apps/livemorph
lupdate qml src -ts i18n/livemorph_en.ts -no-obsolete
```

`verify.sh` step 6 fails if the catalog is out of sync with the `qsTr`/`tr` sources.

## Notes

- Brand names (LiveMorph, TheTools Hub, pack names, crypto tickers), URLs, symbols and
  keyboard shortcuts are intentionally not translated.
- Character prompts sent to the AI engine stay raw (untranslated) by design.
- The language picker shows native names via `QLocale::nativeLanguageName()` plus the code.
