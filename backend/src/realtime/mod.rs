//! Decart WebSocket Signaling Proxy.
//!
//! Client connects to:  WS /api/v1/realtime?token=<access_jwt>&model=<model>
//! Backend opens:       wss://api3.decart.ai/v1/stream?api_key=…&model=…
//! Media (WebRTC) is peer-to-peer between Qt and Decart — never through this process.

mod proxy;

pub use proxy::realtime_ws;

mod balance_ws;
pub use balance_ws::balance_ws;
