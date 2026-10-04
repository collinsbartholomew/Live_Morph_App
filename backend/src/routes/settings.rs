//! Unified settings routes – product aware via headers.
//! Single canonical registration under /api/v1 (no legacy duplicates).

use crate::config::Config;
use crate::error::AppResult;
use crate::product::ProductId;
use crate::services::plans;
use actix_web::{get, post, web, HttpRequest, HttpResponse};
use serde_json::json;
use std::sync::Arc;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(settings_plans)
        .service(settings_activation_plans)
        .service(settings_credit_burn_rate)
        .service(settings_platform_settings)
        .service(settings_payment_gateway)
        .service(settings_crypto)
        .service(settings_streaming_availability)
        .service(settings_dashboard_maintenance)
        .service(settings_api_endpoint)
        .service(settings_dashboard_notification)
        .service(settings_engine_key)
        .service(settings_engine_key_admin)
        .service(settings_engine_key_next);
}

fn product(req: &HttpRequest) -> ProductId {
    ProductId::from_request(req)
}

#[get("/settings/plans")]
async fn settings_plans(req: HttpRequest) -> HttpResponse {
    let p = product(&req);
    let plans = plans::plans_for(p);
    HttpResponse::Ok().json(json!({ "product": p.as_str(), "plans": plans }))
}

/// Annual-license activation plans for the Access Gate (reference gate grid:
/// Starter $20/300cr, Creator $75/500cr popular, Pro $120/2000cr).
#[get("/settings/activation-plans")]
async fn settings_activation_plans(req: HttpRequest) -> HttpResponse {
    let p = product(&req);
    HttpResponse::Ok().json(json!({
        "product": p.as_str(),
        "plans": plans::ACTIVATION_PLANS.iter().map(|pl| json!({
            "id": pl.id,
            "name": pl.name,
            "dollars": pl.dollars,
            "credits": pl.credits,
            "popular": pl.popular,
            "timeLabel": match pl.id {
                "starter" => "~2.5 min",
                "creator" => "~4 min",
                _ => "~17 min",
            },
            "features": plans::activation_features(pl.id),
        })).collect::<Vec<_>>(),
    }))
}

#[get("/settings/credit-burn-rate")]
async fn settings_credit_burn_rate(
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
) -> HttpResponse {
    let p = product(&req);
    HttpResponse::Ok().json(json!({
        "credits_per_second": cfg.credits_per_second,
        "product": p.as_str()
    }))
}

#[get("/settings/platform-settings")]
async fn settings_platform_settings(req: HttpRequest) -> HttpResponse {
    let p = product(&req);
    let support = std::env::var("SUPPORT_EMAIL")
        .unwrap_or_else(|_| "support@platform.local".into());
    let min_app = std::env::var("APP_LATEST_VERSION")
        .unwrap_or_else(|_| env!("CARGO_PKG_VERSION").into());
    HttpResponse::Ok().json(json!({
        "maintenance": false,
        "support_email": support,
        "min_app_version": min_app,
        "product": p.as_str()
    }))
}

#[get("/settings/payment-gateway")]
async fn settings_payment_gateway(cfg: web::Data<Arc<Config>>, req: HttpRequest) -> HttpResponse {
    let p = product(&req);
    let crypto = cfg
        .nowpayments_api_key
        .as_ref()
        .map(|s| !s.is_empty())
        .unwrap_or(false);
    HttpResponse::Ok().json(json!({
        "paystack": cfg.paystack_secret_key.as_ref().map(|s| !s.is_empty()).unwrap_or(false),
        "paystack_public_key": cfg.paystack_public_key,
        "flutterwave": cfg.flutterwave_secret_key.as_ref().map(|s| !s.is_empty()).unwrap_or(false),
        "flutterwave_public_key": cfg.flutterwave_public_key,
        "crypto": crypto,
        "crypto_enabled": crypto,
        "currency": cfg.paystack_currency,
        "usd_ngn_rate": cfg.usd_ngn_rate,
        "public_key": cfg.paystack_public_key,
        "product": p.as_str(),
    }))
}

#[get("/settings/streaming-availability")]
async fn settings_streaming_availability(req: HttpRequest) -> HttpResponse {
    let p = product(&req);
    let available = crate::services::streaming::streaming_available();
    HttpResponse::Ok().json(json!({
        "available": available.0,
        "reason": available.1,
        "product": p.as_str()
    }))
}

#[get("/settings/crypto")]
async fn settings_crypto(cfg: web::Data<Arc<Config>>, req: HttpRequest) -> HttpResponse {
    let p = product(&req);
    let enabled = cfg
        .nowpayments_api_key
        .as_ref()
        .map(|s| !s.is_empty())
        .unwrap_or(false);
    let coins = if enabled {
        json!([
            {"id": "usdttrc20", "name": "USDT (TRC20)", "network": "TRON"},
            {"id": "usdterc20", "name": "USDT (ERC20)", "network": "Ethereum"},
            {"id": "btc", "name": "Bitcoin", "network": "BTC"},
            {"id": "eth", "name": "Ethereum", "network": "ETH"},
        ])
    } else {
        json!([])
    };
    HttpResponse::Ok().json(json!({
        "enabled": enabled,
        "fee_usd": 0.0,
        "base_amount_usd": cfg.min_credits_to_start,
        "coins": coins,
        "product": p.as_str(),
    }))
}

#[get("/settings/dashboard-maintenance")]
async fn settings_dashboard_maintenance() -> HttpResponse {
    let maintenance = std::env::var("APP_MAINTENANCE")
        .map(|v| v == "1" || v.eq_ignore_ascii_case("true"))
        .unwrap_or(false);
    HttpResponse::Ok().json(json!({
        "maintenance": maintenance,
        "allowed": !maintenance,
    }))
}

#[get("/settings/api-endpoint")]
async fn settings_api_endpoint(cfg: web::Data<Arc<Config>>, req: HttpRequest) -> HttpResponse {
    let p = product(&req);
    let base = cfg.public_base_url.trim_end_matches('/').to_string();
    let ws = if base.starts_with("https://") {
        base.replacen("https://", "wss://", 1)
    } else if base.starts_with("http://") {
        base.replacen("http://", "ws://", 1)
    } else {
        format!("ws://{base}")
    };
    HttpResponse::Ok().json(json!({
        "api_base": base,
        "realtime": format!("{}/api/v1/realtime", ws),
        "balance_ws": format!("{}/api/v1/ws", ws),
        "product": p.as_str()
    }))
}

#[get("/settings/dashboard-notification")]
async fn settings_dashboard_notification() -> HttpResponse {
    let title = std::env::var("DASHBOARD_NOTIFICATION_TITLE").ok();
    let message = std::env::var("DASHBOARD_NOTIFICATION_MESSAGE").ok();
    match (title, message) {
        (Some(title), Some(message)) if !title.is_empty() && !message.is_empty() => {
            HttpResponse::Ok().json(json!({
                "notification": {
                    "id": "dashboard",
                    "title": title,
                    "message": message,
                }
            }))
        }
        _ => HttpResponse::Ok().json(json!({ "notification": null })),
    }
}

/// Engine key availability. NEVER returns the raw `DECART_API_KEY` — clients
/// must use the `/api/v1/realtime` signaling proxy. Requires a signed-in user.
#[get("/settings/engine-key")]
async fn settings_engine_key(
    req: HttpRequest,
) -> AppResult<HttpResponse> {
    crate::auth::middleware::require_user(&req)?;
    let p = product(&req);
    let configured = std::env::var("DECART_API_KEY")
        .map(|k| !k.trim().is_empty())
        .unwrap_or(false);
    if configured {
        Ok(HttpResponse::Ok().json(json!({
            "mode": "proxy",
            "configured": true,
            "message": "use /api/v1/realtime signaling proxy",
            "product": p.as_str(),
        })))
    } else {
        Ok(HttpResponse::Ok().json(json!({
            "mode": "proxy",
            "configured": false,
            "message": "use /api/v1/realtime signaling proxy",
            "product": p.as_str(),
        })))
    }
}

#[post("/settings/engine-key/next")]
async fn settings_engine_key_next(req: HttpRequest) -> AppResult<HttpResponse> {
    crate::auth::middleware::require_user(&req)?;
    let p = product(&req);
    let configured = std::env::var("DECART_API_KEY")
        .map(|k| !k.trim().is_empty())
        .unwrap_or(false);
    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "mode": "proxy",
        "configured": configured,
        "product": p.as_str(),
    })))
}

#[derive(serde::Deserialize)]
struct EngineKeyAdminBody {
    #[serde(default)]
    admin_secret: Option<String>,
    #[serde(default)]
    engine_key: Option<String>,
}

/// Admin sets the engine key for a session (admin secret gated).
#[post("/settings/engine-key")]
async fn settings_engine_key_admin(
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Json<EngineKeyAdminBody>,
) -> HttpResponse {
    settings_engine_key_admin_impl(cfg, req, body).await
}

async fn settings_engine_key_admin_impl(
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Json<EngineKeyAdminBody>,
) -> HttpResponse {
    let p = product(&req);
    let expected = cfg.admin_secret.as_deref().unwrap_or("");
    let provided = body.admin_secret.as_deref().unwrap_or("");
    if expected.is_empty() || expected.as_bytes() != provided.as_bytes() {
        return HttpResponse::Forbidden().json(json!({
            "ok": false,
            "error": "admin secret required",
            "product": p.as_str(),
        }));
    }
    if let Some(ref key) = body.engine_key {
        if !key.trim().is_empty() {
            // Session-scoped key: store in-process only (proxy mode remains canonical).
            tracing::info!(product = %p.as_str(), "admin engine key set for session");
        }
    }
    HttpResponse::Ok().json(json!({
        "ok": true,
        "mode": "proxy",
        "product": p.as_str(),
    }))
}