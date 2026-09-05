# Toolchain + i18n update changelog

**Date:** 2026-08-17  
**Desktop version:** 1.7.0  
**Backend version:** 1.7.1  

---

## 1. Desktop (Qt / CMake)

| Item | Before | After |
|------|--------|-------|
| CMake minimum | 3.21 | **3.22** |
| Project version | 1.6.0 | **1.7.0** |
| C++ standard | C++17 | **C++20** |
| Qt package floor | 6.5 | **6.8** |
| `qt_standard_project_setup` | REQUIRES 6.5 | **REQUIRES 6.8** |
| App version strings (`main`, `AppController`, `BackendClient`) | 1.6.0 mixed | **1.7.0** unified |

### Qt6 Linguist / translator plugin

| Item | Change |
|------|--------|
| **Qt6 LinguistTools** | `find_package(Qt6 6.8 COMPONENTS LinguistTools QUIET)` |
| **`qt_add_translations(LiveMorph …)`** | Builds `.qm` from `.ts`, embeds under resource prefix **`/i18n`** |
| **lrelease options** | `-compress -nounfinished` |
| **Fallback** | Warning if tools missing; install still ships `i18n/*.qm` |

`I18nManager` load order:

1. `:/i18n/livemorph_<lang>.qm` (from `qt_add_translations`)
2. `:/i18n/<lang>.qm`
3. App-dir / share path `.qm` files

Runtime: `setLanguage` → `QTranslator` → `QQmlEngine::retranslate()` (no restart).

---

## 2. i18n language reach (20 locales)

| Code | Language | Catalog |
|------|----------|---------|
| en | English (source) | `livemorph_en.ts` |
| es | Spanish | `livemorph_es.ts` |
| fr | French | `livemorph_fr.ts` |
| de | German | `livemorph_de.ts` |
| pt | Portuguese | `livemorph_pt.ts` |
| it | Italian | **new** `livemorph_it.ts` |
| nl | Dutch | **new** `livemorph_nl.ts` |
| pl | Polish | **new** `livemorph_pl.ts` |
| sv | Swedish | **new** `livemorph_sv.ts` |
| tr | Turkish | **new** `livemorph_tr.ts` |
| ru | Russian | `livemorph_ru.ts` |
| uk | Ukrainian | **new** `livemorph_uk.ts` |
| ar | Arabic | `livemorph_ar.ts` |
| hi | Hindi | **new** `livemorph_hi.ts` |
| id | Indonesian | **new** `livemorph_id.ts` |
| vi | Vietnamese | **new** `livemorph_vi.ts` |
| th | Thai | **new** `livemorph_th.ts` |
| zh | Chinese | `livemorph_zh.ts` |
| ja | Japanese | `livemorph_ja.ts` |
| ko | Korean | `livemorph_ko.ts` |

- **~243** `qsTr` / `tr` source strings extracted into catalogs  
- Core UI strings translated in primary locales; remaining marked `unfinished` for Linguist  
- Settings language chips bind to `I18n.availableLanguages` (all 20)

### Build note

```bash
# Preferred: CMake runs lrelease via qt_add_translations
cmake -B build -DCMAKE_PREFIX_PATH=/path/to/Qt/6.8.x
cmake --build build

# Manual if needed:
for f in i18n/livemorph_*.ts; do lrelease "$f" -qm "${f%.ts}.qm"; done
```

---

## 3. Backend (Rust)

| Item | Before | After |
|------|--------|-------|
| Package version | 1.7.0 | **1.7.1** |
| `rust-version` (Cargo.toml) | 1.75 | **1.83** |
| `rust-toolchain.toml` | (none) | **channel 1.85.0** + rustfmt, clippy |
| `tokio-tungstenite` | 0.24 | **0.26** |
| `bcrypt` | 0.15 | **0.16** |
| `thiserror` | 1 | **2** |
| `rand` | 0.8 | **0.8** (kept for API stability) |
| actix-web / mongodb / tokio | 4 / 3 / 1 | unchanged (current major lines) |

Release profile unchanged: LTO, single codegen unit, strip.

**Note:** First build after bump should `cargo update` / regenerate lock on a machine with network and Rust ≥ 1.83.

---

## 4. Files touched (this change set)

| Path | Action |
|------|--------|
| `LiveMorphQt/CMakeLists.txt` | Qt 6.8, C++20, version 1.7.0, `qt_add_translations` |
| `LiveMorphQt/src/core/I18nManager.cpp` | 20 languages, resource load paths |
| `LiveMorphQt/src/main.cpp` | already 1.7.0 |
| `LiveMorphQt/src/core/AppController.h` | version 1.7.0 |
| `LiveMorphQt/src/services/BackendClient.h` | default appVersion 1.7.0 |
| `LiveMorphQt/i18n/livemorph_*.ts` | 20 catalogs (10 new locales) |
| `backend/Cargo.toml` | 1.7.1 + dependency bumps |
| `backend/rust-toolchain.toml` | **new** — pin 1.85.0 |
| `TOOLCHAIN_AND_I18N_CHANGELOG.md` | **this document** |

---

## 5. Error-avoidance notes

1. **Qt 6.8**: If only 6.5/6.6/6.7 is installed, lower `find_package(Qt6 6.8` to your installed minor or install 6.8+.  
2. **LinguistTools**: Install `qt6-tools` / “Qt Language Server & Linguist” component so `qt_add_translations` runs.  
3. **Rust**: Toolchain file wants **1.85**; CI images must match or remove `rust-toolchain.toml` to use system rustc.  
4. **`thiserror` 2**: Existing `#[error("...")]` enums remain valid.  
5. **Duplicate `install(TARGETS)`** in CMake pre-existed; harmless but can be deduped later.

---

## 6. What was intentionally not changed

- QML information architecture (Auth split, Dashboard, OBS settings)  
- OBS Virtual Camera integration API  
- Backend route layout (simplify pass is separate)  
- Mongo / Paystack / Decart env contract  
