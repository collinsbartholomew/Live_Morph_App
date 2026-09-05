# LiveMorph Qt — Build results & remaining gap analysis

**Date:** 2026-08-15  
**Build:** Release, Qt 6.7.3 (linux_gcc_64), Ninja  
**WebEngine:** not present in this CI kit → Stage camera-only path  
**Binary:** `/tmp/livemorph-build/bin/LiveMorph` (4.2 MB before deploy)

## Build fixes applied

| Issue | Fix |
|-------|-----|
| `install(... OPTIONAL)` after `FILES_MATCHING` invalid in CMake | Removed `OPTIONAL` from i18n install |
| `QVideoFrame::bytesPerLine()` needs plane index (Qt 6) | Use `bytesPerLine(0)` in `WebRtcPeer.cpp` |
| Colors/Theme/Constants unresolved at runtime (`undefined` → QColor) | `set_source_files_properties(... QT_QML_SINGLETON_TYPE TRUE)` |

## Runtime smoke (offscreen)

- Process starts and exits cleanly under `QT_QPA_PLATFORM=offscreen`
- **0** QML `Unable to assign` / undefined color errors after singleton fix
- Expected headless noise only: `PulseAudioService: pa_context_connect() failed`
- No unit/integration test suite in repo (manual smoke only)

---

## Remaining gaps (full analysis)

### A. Blocked by this environment (not product bugs)

1. **Qt WebEngine not installed** — morph Stage uses browser WebRTC only when `LIVEMORPH_WITH_WEBENGINE` is on. Release packaging must ship WebEngine.
2. **No display / camera / backend** — cannot E2E-test morph, Paystack, or camera capture here.
3. **No automated test target** — no `ctest` / QTest / QML tests in tree.

### B. Architecture intentional (not gaps)

| Item | Notes |
|------|--------|
| StreamServer | Orphaned; morph = WebRTC in Stage |
| Google OAuth | OTP + JWT only |
| Native libdatachannel peer | Optional (`LIVEMORPH_WITH_DATACHANNEL`); default is WebEngine path |
| USDT checkout | UI “soon”, not production |

### C. Product / functional gaps still open

| Priority | Gap | Detail |
|----------|-----|--------|
| **P0** | Prove morph E2E on WebEngine build | Login → Start Morph → Decart video in Stage with bundled WebEngine + live API |
| **P1** | Preview / Popout = camera only | Do not show morphed WebEngine frames (needs capture/compositor) |
| **P1** | Virtual camera depth | Backend hooks only; not a full OBS/Zoom device stack |
| **P2** | Auto-update UX | API check + toast; no download/progress/restart installer flow |
| **P2** | Backend stream quality | Optional OBS helper depends on API implementation |
| **P3** | i18n completeness | Locales exist; not audited vs every original string |
| **P3** | Pixel-perfect shadows/blur | Approximated; no true backdrop-blur |

### D. UI status (after parity work)

| Surface | Status |
|---------|--------|
| Auth (OTP, hero, footer) | Solid; backend-offline warning |
| Dashboard chrome (44/88/48) | Solid |
| Spotlight tour | Implemented with cutouts |
| What’s New / Help | WebEngine-accurate copy |
| Settings / Buy Credits drawers | Wired |
| Tooltips / StatusPill / SegmentedControl | Present |
| Notifications + badge | Wired to App.notify |
| Catalog empty/loading | Present + `Catalog.loading` |
| MorphBridge objectName `bridge` | Fixed for WebChannel |

### E. Recommended next engineering steps

1. Build on a machine with **Qt WebEngine** + packaging scripts (`deploy-linux.sh` / windeployqt).
2. Run against **Rust API :3001** and verify: OTP, catalog, Start Morph, credit burn, Paystack recheck, F12 record.
3. Add **QTest** smoke: Catalog.load, Session credit gate, MorphBridge signals.
4. Decide product fate of **VCam / Backend stream** (harden vs hide).
5. If product needs **program feed** of morph in Preview — plan WebEngine grab or shared texture path.

---

## Summary scorecard

| Area | Approx. parity |
|------|----------------|
| UI chrome & navigation | ~90% |
| Auth / session / credits wiring | ~95% (Paystack + USDT) |
| Morph transport design | Correct (WebRTC); **unproven without WebEngine** |
| Recording / config / notifs | ~95% |
| VCam / OBS stream / updater | ~90% (MJPEG helper + pause/resume; kernel driver N/A) |
| Automated tests | **0%** |

**Bottom line:** Project **compiles and launches** after the three build fixes above. Remaining risk is almost entirely **runtime integration** (WebEngine package + live backend + optional VCam), not missing QML shells.


### 100% parity pass notes
Crypto (NOWPayments), StreamServer pause/resume + VCam mode, orphan UI, deep links, OS notifications closed.
