# LiveMorph — production desktop + API

Native **Qt6 / C++** client and **Rust (Actix)** backend. Replaces the original Electron app with the same product flows and stronger secret isolation.

## Layout

| Path | Role |
|------|------|
| `LiveMorphQt/` | Desktop app (QML UI, C++ managers, WebEngine morph stage) |
| `backend/` | API: auth, credits, payments, Decart signaling proxy |
| `docker-compose.yml` | MongoDB + API for local/staging |
| `SECURITY.md` | Trust boundaries |
| `FINAL_ANALYSIS.md` | Parity + hardening verdict |
| `PRODUCTION_CHECKLIST.md` | Operator go-live list |
| `GAPS_CLOSED.md` | Feature closure status |

## Quick start

### Backend
```bash
cp backend/.env.example backend/.env
# Edit JWT_SECRET (≥32), MONGODB_URI, DECART_API_KEY, optional Paystack/Google/NOWPayments
docker compose up -d
# or: cd backend && cargo run --release
```

### Desktop
```bash
cd LiveMorphQt
./build.sh          # requires Qt6 + WebEngine + Multimedia + Widgets
./packaging/deploy-linux.sh   # or deploy-macos / deploy-windows
```

Register the `livemorph://` protocol (deploy scripts do this on Windows/Linux) for Google OAuth return.

## Production invariants

- Decart / Paystack / NOWPayments / Google **client secret** never ship in the desktop binary.
- Payment webhooks are public and signature-checked.
- Google OAuth uses one-time tickets, not JWTs in URLs.

See `FINAL_ANALYSIS.md` and `PRODUCTION_CHECKLIST.md` before go-live.
