//! WebRTC helper endpoints (ICE servers for clients).

use crate::config::Config;
use actix_web::{get, web, HttpResponse};
use serde_json::{json, Value};
use std::sync::Arc;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(ice_servers);
}

/// Public: STUN/TURN list for Qt WebRtcPeer.
#[get("/webrtc/ice-servers")]
async fn ice_servers(cfg: web::Data<Arc<Config>>) -> HttpResponse {
    let fallback = json!([
        { "urls": "stun:stun.l.google.com:19302" },
        { "urls": "stun:stun1.l.google.com:19302" }
    ]);

    let servers: Value = match &cfg.ice_servers_json {
        Some(s) if !s.trim().is_empty() => {
            serde_json::from_str(s).unwrap_or_else(|_| fallback.clone())
        }
        _ => fallback.clone(),
    };

    let ice = if servers.is_array() {
        json!({ "iceServers": servers })
    } else if servers.get("iceServers").is_some() {
        servers
    } else {
        json!({ "iceServers": fallback })
    };

    HttpResponse::Ok().json(ice)
}
