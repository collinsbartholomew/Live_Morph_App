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
    let support = crate::runtime_env::support_email();
    let min_app = crate::runtime_env::app_latest_version();
    HttpResponse::Ok().json(json!({
        "maintenance": crate::runtime_env::app_maintenance(),
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
async fn settings_streaming_availability(
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
) -> HttpResponse {
    let p = product(&req);
    let available = crate::services::streaming::streaming_available(&cfg);
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
        // USD cost of the minimum start credit balance (credits → seconds →
        // USD), NOT the raw credit count labelled as dollars.
        "base_amount_usd": if cfg.credits_per_second > 0.0 {
            cfg.min_credits_to_start / cfg.credits_per_second * cfg.decart_usd_per_second
        } else {
            0.0
        },
        "base_amount_credits": cfg.min_credits_to_start,
        "coins": coins,
        "product": p.as_str(),
    }))
}

#[get("/settings/dashboard-maintenance")]
async fn settings_dashboard_maintenance() -> HttpResponse {
    let maintenance = crate::runtime_env::app_maintenance();
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
    let title = crate::runtime_env::dashboard_notification_title();
    let message = crate::runtime_env::dashboard_notification_message();
    match (title, message) {
        (Some(title), Some(message)) => {
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
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
) -> AppResult<HttpResponse> {
    crate::auth::middleware::require_user(&req)?;
    let p = product(&req);
    let configured = !cfg.decart_api_key.trim().is_empty();
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
async fn settings_engine_key_next(
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
) -> AppResult<HttpResponse> {
    crate::auth::middleware::require_user(&req)?;
    let p = product(&req);
    let configured = !cfg.decart_api_key.trim().is_empty();
    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "mode": "proxy",
        "configured": configured,
        "rotated": false,
        "message": "proxy mode: the upstream key is static server-side configuration — rotate DECART_API_KEY on the host and restart",
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
    {
        let ip = crate::auth::client_ip(&req);
        if !crate::auth::check_rate_limit(&ip, "admin-secret", 5, 60) {
            return HttpResponse::TooManyRequests().json(json!({
                "ok": false, "error": "too many admin attempts", "product": p.as_str(),
            }));
        }
    }
    let expected = cfg.admin_secret.as_deref().unwrap_or("");
    let provided = body.admin_secret.as_deref().unwrap_or("");
    if expected.is_empty() || !bool::from(subtle::ConstantTimeEq::ct_eq(expected.as_bytes(), provided.as_bytes())) {
        return HttpResponse::Forbidden().json(json!({
            "ok": false,
            "error": "admin secret required",
            "product": p.as_str(),
        }));
    }
    if let Some(ref key) = body.engine_key {
        if !key.trim().is_empty() {
            // Never claim a key was installed/rotated when nothing is stored:
            // proxy mode has exactly one upstream key (DECART_API_KEY env).
            return HttpResponse::BadRequest().json(json!({
                "ok": false,
                "error": "engine key overrides are not supported in proxy mode — set DECART_API_KEY on the host and restart",
                "supported": false,
                "mode": "proxy",
                "product": p.as_str(),
            }));
        }
    }
    HttpResponse::Ok().json(json!({
        "ok": true,
        "mode": "proxy",
        "message": "no engine key supplied; nothing changed",
        "product": p.as_str(),
    }))
}