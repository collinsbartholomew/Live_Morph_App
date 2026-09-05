# Toolchain matrix

| Component | Required | Recommended |
|-----------|----------|-------------|
| Rust (MSRV) | 1.88 | 1.97.1 stable |
| CMake | >= 3.21 | 3.28+ |
| Qt | 6.5+ | 6.5-6.8 + Multimedia/Network/Quick; WebEngine optional |
| MongoDB | 6+ | 8 (compose default) |

## Notable crate pins
axum 0.8, tower-http 0.6, tokio 1.x, mongodb 3.x, bson 2.x, tokio-tungstenite 0.28, rand 0.9, reqwest 0.12 rustls, lettre 0.11

Lockfile: backend/Cargo.lock — commit with sources.

## Verify
cd backend && cargo check
