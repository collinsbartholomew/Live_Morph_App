# Toolchain — latest targets (2026-08)

| Component | Project pin | Recommended latest |
|-----------|-------------|-------------------|
| Rust | MSRV **1.85** (`rust-toolchain.toml`) | **1.85+** / latest stable |
| Cargo edition | 2021 | 2021 (stable) |
| CMake | **3.22+** | 3.28–3.31 |
| C++ | **C++20** | C++20 |
| Qt (LiveMorph) | **6.8+** | 6.8 / 6.9 with WebEngine, WebSockets, Multimedia |
| Qt (Live Escape) | **6.5+** (CMake), prefer **6.8** | same + WebSockets |
| MongoDB | 6+ | 7/8 |
| actix-web | 4.x | 4.14+ |
| mongodb crate | 3.x | 3.x |
| tokio | 1.x | 1.x |
| tokio-tungstenite | 0.26 | 0.26–0.28 |

## Update locally

```bash
rustup toolchain install 1.85.0 && rustup default 1.85.0
cd port/backend && cargo update && cargo build --release
```

Qt: install matching Kit from qt.io or distro `qt6-*-dev`.
