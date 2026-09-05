use crate::auth::middleware::require_user;
use crate::config::Config;
use crate::db::Db;
use crate::error::AppResult;
use crate::services::google_oauth;
use actix_web::{get, web, HttpRequest, HttpResponse};
use serde_json::json;
use std::sync::Arc;
use std::time::Instant;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(health).service(version).service(metrics);
}

#[get("/health")]
async fn health(db: web::Data<Db>, cfg: web::Data<Arc<Config>>) -> HttpResponse {
    let t0 = Instant::now();
    let mongo_ok = db
        .db
        .run_command(mongodb::bson::doc! { "ping": 1 })
        .await
        .is_ok();
    let mongo_le_ok = db
        .db_le
        .run_command(mongodb::bson::doc! { "ping": 1 })
        .await
        .is_ok();
    let ms = t0.elapsed().as_millis();
    let status = if mongo_ok && mongo_le_ok {
        "ok"
    } else {
        "degraded"
    };
    let mut code = if mongo_ok && mongo_le_ok {
        HttpResponse::Ok()
    } else {
        HttpResponse::ServiceUnavailable()
    };
    code.json(json!({
        "status": status,
        "mongo": mongo_ok,
        "mongo_livemorph": mongo_ok,
        "mongo_liveescape": mongo_le_ok,
        "mongo_ping_ms": ms,
        "products": ["livemorph", "liveescape"],
        "version": env!("CARGO_PKG_VERSION"),
        "google_oauth": google_oauth::is_configured(cfg.get_ref().as_ref()),
        "paystack": cfg.paystack_secret_key.as_ref().map(|s| !s.is_empty()).unwrap_or(false),
        "nowpayments": cfg.nowpayments_api_key.as_ref().map(|s| !s.is_empty()).unwrap_or(false),
    }))
}

#[get("/app/version")]
async fn version() -> HttpResponse {
    HttpResponse::Ok().json(json!({
        "version": env!("CARGO_PKG_VERSION"),
        "name": "platform-backend",
        "products": ["livemorph", "liveescape"]
    }))
}

#[get("/metrics")]
async fn metrics(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
) -> AppResult<HttpResponse> {
    let _auth = require_user(&req)?;
    // Lightweight operational snapshot (not Prometheus text — JSON for simplicity)
    let users = db
        .users()
        .count_documents(mongodb::bson::doc! {})
        .await
        .unwrap_or(0);
    let sessions_live = db
        .sessions()
        .count_documents(mongodb::bson::doc! {
            "status": { "$in": ["connecting", "live", "generating"] }
        })
        .await
        .unwrap_or(0);
    Ok(HttpResponse::Ok().json(json!({
        "users": users,
        "live_sessions": sessions_live,
        "credits_per_second": cfg.credits_per_second,
        "env": cfg.rust_env,
        "version": env!("CARGO_PKG_VERSION"),
    })))
}
