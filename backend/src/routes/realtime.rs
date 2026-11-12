use crate::realtime::{balance_ws, realtime_ws};
use actix_web::web;

/// Unified realtime surface, registered once under /api/v1:
///   GET /api/v1/realtime  → Decart signaling proxy
///   GET /api/v1/ws        → balance push socket
pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.route("/realtime", web::get().to(realtime_ws));
    cfg.route("/ws", web::get().to(balance_ws));
}