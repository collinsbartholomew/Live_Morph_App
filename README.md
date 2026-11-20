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

## Deployment

See [the deployment guide](docs/DEPLOYMENT.md) for production containers, named env files, Kaggle, desktop packaging, health checks, and rollback behavior.

Local backend:

```bash
cp backend/.env.example backend/.env
# Fill JWT_SECRET and DECART_API_KEY; keep RUST_ENV=development.
docker compose up -d --build
```

Frontend (Qt 6.5+ and GStreamer WebRTC plugins):

```bash
cd apps/livemorph
cp .env.example .env
# Set LIVEMORPH_API_URL to the public HTTPS backend origin, then compile.
./build.sh
```

The frontend build requires `.env` and runs CTest plus QML checks. The env origin replaces local defaults; explicit Settings choices and the `LIVEMORPH_API_URL` process variable remain available as overrides.
