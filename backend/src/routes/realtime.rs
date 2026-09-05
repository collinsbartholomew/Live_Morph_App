use crate::realtime::{balance_ws, realtime_ws};
use actix_web::web;

/// Decart signaling proxy — one implementation, multiple paths for both frontends.
pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.route("/realtime", web::get().to(realtime_ws));
}

/// Root aliases: Live Escape `/v1/realtime` + shared balance `/ws`.
pub fn configure_aliases(cfg: &mut web::ServiceConfig) {
    cfg.route("/v1/realtime", web::get().to(realtime_ws));
    cfg.route("/ws", web::get().to(balance_ws));
    // Also under /api/v1 for LiveMorph clients that prefer versioned paths
    cfg.route("/api/v1/ws", web::get().to(balance_ws));
}
