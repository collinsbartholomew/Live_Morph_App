# Test / build results (2026-08-25)

## Environment
- Rust: 1.88 available via rustup; full `cargo test` of livemorph-backend **cannot complete here**
  - `mongodb` crate compile is **SIGKILL (OOM)** on this host
- Qt6: **not installed** — desktop CMake/QML build not runnable in this environment

## Passed
| Suite | Result |
|-------|--------|
| `backend/tests/security_hardening.rs` (15 tests, standalone crate) | **PASS** |
| OTP + email validation unit tests (extracted from `auth/otp.rs`) | **PASS** (3) |
| Frontend static checks (QML brace balance, CMake sources exist, critical files) | **PASS** |

## Fixed during test run
- `security_hardening.rs`: temporary borrow in `provider_normalize_aliases` (`to_ascii_lowercase`)
- `Constants.qml`: `otpMinSubmitLength` 6 → **8** (align with server/UI)

## Not run (environment limits)
- Full `cargo build` / `cargo test` of Actix backend (MongoDB dependency OOM)
- Qt `cmake` + link LiveMorph desktop (no Qt6 packages)

## Recommended on a normal machine
```bash
cd backend && cargo test
cd LiveMorphQt && ./build.sh
```
