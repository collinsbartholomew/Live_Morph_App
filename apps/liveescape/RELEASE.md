# Live Escape 1.8 — Final package

## Stack
- Desktop: Qt 6 / QML (C++)
- API: Rust / Axum + MongoDB

## Backend
```bash
cd backend
cp .env.example .env   # fill secrets
# Local Mongo: MONGODB_URI=mongodb://127.0.0.1:27017
cargo run --release
# or: docker compose up --build
```

## Desktop
```bash
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j
export LIVEESCAPE_API_URL=http://127.0.0.1:8881
./build/bin/LiveEscape   # path may vary by generator
```

Build with Qt WebEngine for in-app checkout + AI video peer.

## Production env (minimum)
RUST_ENV, JWT_SECRET, MONGODB_URI, PUBLIC_BASE_URL, DECART_API_KEY,
PAYSTACK_* (or other gateways), CORS_ORIGINS, ADMIN_SECRET
