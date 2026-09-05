# Live Escape

Real-time AI video desktop client + API.

# LiveEscape Desktop (Qt 6 + Rust/Axum)

Production-oriented rewrite of the LiveEscape streaming dashboard.

## Stack
- **Frontend:** Qt 6 / QML (C++ controllers)
- **Backend:** Rust, Axum, MongoDB
- **Realtime:** Decart signaling proxy (`/v1/realtime`)

## Backend

```bash
cd backend
cp .env.example .env   # fill secrets
# MongoDB required
cargo run --release
# listens on :8881
```

## Frontend

Requires Qt 6.5+ (Multimedia, WebSockets; **WebEngine recommended** for AI video peer).

```bash
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j$(nproc)
export LIVEESCAPE_API_URL=http://127.0.0.1:8881
./build/bin/LiveEscape
```

## Features
- Auth, license gate, plans & payments (Paystack / Flutterwave / NOWPayments / crypto)
- Credits + live balance WebSocket
- Camera stage, freeze (real frame), snapshot, recording (MediaRecorder MP4 + PNG fallback)
- Decart session + reference face upload
- Free credits modal, lock screens, admin panel (Ctrl+Shift+A, secret-gated)
- Password reset with Mongo tokens + SMTP when configured

## Environment
See `backend/.env.example` for JWT, DECART, payment, SMTP, and ADMIN_SECRET keys.

## Docs
- `BACKEND_MAP.md` — route map
- `PRODUCTION.md` — deploy notes
- `DECART_INTEGRATION.md` — realtime path

## Docs
- `CHANGELOG.md` — full list of parity, payment, recording, WebEngine, and toolchain changes
- `TOOLCHAIN.md` — MSRV, Qt, Mongo, crate pins
- `ANALYSIS.md` — gap closure status
- `BACKEND_MAP.md` — HTTP route map
- `PRODUCTION.md` — deploy notes
- `DECART_INTEGRATION.md` — realtime path
