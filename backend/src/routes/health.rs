use crate::auth::middleware::require_user;
use crate::config::Config;
use crate::db::Db;
use crate::error::{AppError, AppResult};
use crate::product::ProductId;
use actix_web::{get, web, HttpRequest, HttpResponse};
use serde_json::json;
use std::sync::Arc;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(health).service(version).service(metrics);
}

#[get("/health")]
async fn health(db: web::Data<Db>, _cfg: web::Data<Arc<Config>>) -> HttpResponse {
    let mongo_ok = db
        .db
        .run_command(mongodb::bson::doc! { "ping": 1 })
        .await
        .is_ok();
    let mongo_secondary_ok = db
        .db_secondary
        .run_command(mongodb::bson::doc! { "ping": 1 })
        .await
        .is_ok();
    let status = if mongo_ok && mongo_secondary_ok {
        "ok"
    } else {
        "degraded"
    };
    let mut code = if mongo_ok && mongo_secondary_ok {
        HttpResponse::Ok()
    } else {
        HttpResponse::ServiceUnavailable()
    };
    code.json(json!({
        "status": status,
        "version": env!("CARGO_PKG_VERSION"),
        // Kept for the integration suite; no provider flags / product list /
        // latency here — /health is unauthenticated, so it must not disclose
        // which payment providers or products are configured.
        "mongo_secondary": mongo_secondary_ok,
    }))
}

#[get("/app/version")]
async fn version() -> HttpResponse {
    HttpResponse::Ok().json(json!({
        "version": env!("CARGO_PKG_VERSION"),
        "name": "platform-backend",
        "products": [ProductId::LiveMorph.as_str(), ProductId::Secondary.as_str()]
    }))
}

#[get("/metrics")]
async fn metrics(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
) -> AppResult<HttpResponse> {
    let _auth = require_user(&req)?;
    // Admin-only: global counts are operational data, not user data.
    // Rate-limit BEFORE the secret compare (no timing oracle on the secret).
    let ip = crate::auth::client_ip(&req);
    if !crate::auth::check_rate_limit(&ip, "metrics", 10, 60) {
        return Err(AppError::RateLimited("too many metrics requests".into()));
    }
    let expected = cfg.admin_secret.as_deref().unwrap_or("");
    let provided = req
        .headers()
        .get("x-admin-secret")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");
    if expected.is_empty()
        || !bool::from(subtle::ConstantTimeEq::ct_eq(expected.as_bytes(), provided.as_bytes()))
    {
        return Err(AppError::Forbidden("admin secret required".into()));
    }
    // Lightweight operational snapshot (not Prometheus text — JSON for simplicity)
    let users = db.users().estimated_document_count().await.unwrap_or(0);
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
        "version": env!("CARGO_PKG_VERSION"),
    })))
}
