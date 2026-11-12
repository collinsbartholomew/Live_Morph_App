# LiveMorph Platform — full release

**One desktop frontend + one shared backend, with a second product slot ready.**

| Path | Role |
|------|------|
| `apps/livemorph/` | **LiveMorph** Qt6 client (AI morph, VCam, credits) |
| `apps/common/` | Shared Qt libs (GStreamer WebRTC peer, MJPEG stream server, i18n) |
| `backend/` | Shared Rust API (auth, ledger, Decart proxy, payments) |
| `docker-compose.yml` | MongoDB + API |
| `docs/` | Production / parity notes |

The backend serves **two product slots** from one `/api/v1` tree. Product identity
travels in the `X-Frontend-Id` / `X-Client-Product` header (or `?product=` /
`?frontend_id=`), and each slot gets its own Mongo database, JWT `aud` binding,
bootstrap payload and plan catalogue:

- `livemorph` — the primary desktop client (the app in this repo).
- `secondary` — the slot reserved for the next desktop client. Claim it by
  setting `SECONDARY_PRODUCT_ID` (the wire id clients send) and
  `MONGODB_DB_SECONDARY` (its isolated database) in `backend/.env`; no Rust
  changes are required.

## Backend
```bash
cp backend/.env.example backend/.env   # set JWT_SECRET, Mongo, Decart, etc.
docker compose up -d
# or: cd backend && cargo run --release
```

## Frontend (needs Qt 6.5+ and the GStreamer WebRTC plugins)
```bash
cd apps/livemorph && cmake -B build -DCMAKE_BUILD_TYPE=Release && cmake --build build -j
```

Point the app at the API base URL (Settings or default `http://127.0.0.1:3874`).
