# LiveMorph Platform — full release

**Two desktop frontends + one shared backend.**

| Path | Role |
|------|------|
| `apps/livemorph/` | **LiveMorph** Qt6 client (AI morph, VCam, credits) |
| `apps/liveescape/` | **LiveEscape** Qt6 client (companion product) |
| `backend/` | Shared Rust API (auth, ledger, Decart proxy, payments) |
| `docker-compose.yml` | MongoDB + API |
| `docs/` | Production / parity notes |

## Backend
```bash
cp backend/.env.example backend/.env   # set JWT_SECRET, Mongo, Decart, etc.
docker compose up -d
# or: cd backend && cargo run --release
```

## Frontends (each needs Qt6 + WebEngine where applicable)
```bash
cd apps/livemorph && cmake -B build -DCMAKE_BUILD_TYPE=Release && cmake --build build -j
cd apps/liveescape && cmake -B build -DCMAKE_BUILD_TYPE=Release && cmake --build build -j
```

Point both apps at the same API base URL (Settings or default `http://127.0.0.1:3874`).
