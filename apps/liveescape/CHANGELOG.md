# Live Escape — Change Log

Product version remains **1.8.0**. This document records every intentional change applied during the Qt 6 / Rust production port hardening and toolchain refresh.

---

## A. Toolchain and dependency updates

### Rust / Cargo
| Item | Before | After |
|------|--------|-------|
| Host toolchain (dev) | System 1.75 / MSRV mismatch | rustc/cargo **1.97.1** (rustup stable) |
| Cargo.toml edition | 2021 | **2021** |
| Cargo.toml rust-version (MSRV) | 1.88 claimed | **1.88** enforced |
| tokio-tungstenite | 0.26 | **0.28** |
| rand | 0.8 | **0.9** (code updated for new API) |
| Docker build image | rust:1.85-bookworm | **rust:1-bookworm** (tracks stable >= MSRV) |
| Runtime image | root | bookworm-slim, **USER nobody** |
| Cargo.lock | Stale | Regenerated; **cargo check clean** |

### Code fixes required by latest crates
1. src/routes/keys.rs — rand 0.9:
   - distributions::Alphanumeric -> distr::{Alphanumeric, SampleString}
   - thread_rng() -> rng()
2. src/routes/payments.rs — BSON-safe fields:
   - No raw serde_json::Value in doc!
   - as_str / as_i64 for paystack_access_code, provider_amount, provider_currency

### CI (.github/workflows/ci.yml)
- dtolnay/rust-toolchain@stable with clippy + rustfmt
- Swatinem/rust-cache@v2
- cargo fmt --check, cargo check, cargo clippy -D warnings

### Docker Compose
- mongo:7 -> **mongo:8**

### Qt / CMake
- Unchanged Qt 6.5+ posture (versionless QML, qt_add_qml_module)
- cmake_minimum_required 3.21 kept

### Verification
cargo check Finished successfully after lock + API fixes (built under /tmp due to FUSE noexec on artifacts).

---

## B. UI / QML / C++ parity

| File | Change |
|------|--------|
| qml/screens/DashboardScreen.qml | Fixed invalid stage tree; idle placeholder; connecting loader; AI LIVE + quality HUD; fullscreen; theatre full DecartViewport; face image preview; quality default |
| qml/components/DecartViewport.qml | Qt6 Camera active only; MediaRecorder notifies purpose mp4 |
| qml/modals/sed5cEeAL | Deleted junk |
| src/core/StreamController.h | Split merged lines; quality high; recording state fields |
| src/core/StreamController.cpp | Single path recording MP4 prefer / PNG after 2s; valid recording.json |
| src/core/DecartSignalingClient.cpp | errorOccurred without QOverload |
| src/core/DecartWebPeer.cpp | skip_local=1; TURN from LIVEESCAPE_TURN_* env |
| resources/decart_peer.html | TURN ICE; skip_local |
| qml/screens/AuthScreen.qml | Password reset complete mode 3 |
| src/core/AppController.* | completePasswordReset |

---

## C. Payments hardening

- config: usd_ngn_rate, amount_minor_units, amount_major_units, flutterwave_secret_hash
- Paystack/FLW init use FX helpers; metadata amount_usd + fx_rate
- Paystack webhook marks paid before fulfill
- Flutterwave webhook requires verif-hash in production

---

## D. Build

Backend: cd backend && cargo check && cargo run --release
Client: cmake -B build && cmake --build build -j
Docker: docker compose up --build

## E. Residual limits
WebEngine for AI pixels; MediaRecorder platform limits; live payment secrets required.

---

## G. Verification record (2026-08-17)

```
rustc 1.97.1 / cargo 1.97.1
cd backend && cargo check
→ Finished `dev` profile successfully (exit 0)
```

`Cargo.lock` regenerated at **lockfile version 4** (Cargo ≥ 1.78). Docker build uses `rust:1-bookworm` which tracks current stable and can consume this lockfile.

## H. Build-fix pass (from local Qt 6 compile errors)

| Issue | Fix |
|-------|-----|
| `UpgradeModal.qml:38` Expected `,` | Closed unterminated `text: "Unlock` string |
| Duplicate `notificationMessage` | Removed extra `Q_INVOKABLE` decls (kept single pair) |
| Missing `adminActionSucceeded/Failed` | Declared on `ApiClient` signals |
| Missing `licenseStatus()` | Implemented on `SessionManager` |
| Missing `m_payPollTimer` | Member + ctor init already; declared in header |
| Missing `setShowCryptoProof/PaymentStatus` decls | Declared in header; MODAL_SETTER provides defs |
| Orphan `connect(...)` after `wireWs` | Moved admin connects **inside** `wireApi()` |
| `QVariant::toBool(false)` | Qt 6: use `toBool()` (no args) project-wide |
| Missing `paymentStatusChanged` signal | Declared in `AppController` |
| Missing `pickCryptoProofImage` / `captureReferenceFace` | Implemented in `AppController.cpp` |
