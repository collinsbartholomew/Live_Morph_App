//! Unified settings routes – product aware via headers.

use crate::config::Config;
use crate::product::ProductId;
use actix_web::{get, post, web, HttpRequest, HttpResponse};
use serde_json::json;
use std::sync::Arc;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(settings_plans_v1)
        .service(settings_plans_legacy)
        .service(settings_credit_burn_rate_v1)
        .service(settings_credit_burn_rate_legacy)
        .service(settings_platform_settings_v1)
        .service(settings_platform_settings_legacy)
        .service(settings_payment_gateway_v1)
        .service(settings_payment_gateway_legacy)
        .service(settings_streaming_availability_v1)
        .service(settings_streaming_availability_legacy)
        .service(settings_dashboard_maintenance_v1)
        .service(settings_dashboard_maintenance_legacy)
        .service(settings_api_endpoint_v1)
        .service(settings_api_endpoint_legacy)
        .service(settings_dashboard_notification_v1)
        .service(settings_dashboard_notification_legacy)
        .service(settings_engine_key_v1)
        .service(settings_engine_key_legacy)
        .service(settings_engine_key_next_v1)
        .service(settings_engine_key_next_legacy);
}

fn product(req: &HttpRequest) -> ProductId {
    ProductId::from_request(req)
}

async fn settings_plans_inner(req: HttpRequest) -> HttpResponse {
    let p = product(&req);
    let plans = json!([
        {"id": "test", "name": "Test", "dollars": 0.5, "credits": 50},
        {"id": "starter", "name": "Starter", "dollars": 20.0, "credits": 1000},
        {"id": "pro", "name": "Pro", "dollars": 60.0, "credits": 5000, "popular": true},
        {"id": "premium", "name": "Premium", "dollars": 150.0, "credits": 10000},
        {"id": "elite", "name": "Elite", "dollars": 550.0, "credits": 50000},
    ]);
    HttpResponse::Ok().json(json!({"product": p.as_str(), "plans": plans}))
}

#[get("/api/v1/settings/plans")]
async fn settings_plans_v1(req: HttpRequest) -> HttpResponse { settings_plans_inner(req).await }
#[get("/settings/plans")]
async fn settings_plans_legacy(req: HttpRequest) -> HttpResponse { settings_plans_inner(req).await }

async fn settings_credit_burn_rate_inner(cfg: web::Data<Arc<Config>>, req: HttpRequest) -> HttpResponse {
    let p = product(&req);
    HttpResponse::Ok().json(json!({"credits_per_second": cfg.credits_per_second, "product": p.as_str()}))
}
#[get("/api/v1/settings/credit-burn-rate")]
async fn settings_credit_burn_rate_v1(cfg: web::Data<Arc<Config>>, req: HttpRequest) -> HttpResponse { settings_credit_burn_rate_inner(cfg, req).await }
#[get("/settings/credit-burn-rate")]
async fn settings_credit_burn_rate_legacy(cfg: web::Data<Arc<Config>>, req: HttpRequest) -> HttpResponse { settings_credit_burn_rate_inner(cfg, req).await }

async fn settings_platform_settings_inner(req: HttpRequest) -> HttpResponse {
    let p = product(&req);
    HttpResponse::Ok().json(json!({"maintenance": false, "support_email": "support@liveescape.local", "min_app_version": "1.8.0", "product": p.as_str()}))
}
#[get("/api/v1/settings/platform-settings")]
async fn settings_platform_settings_v1(req: HttpRequest) -> HttpResponse { settings_platform_settings_inner(req).await }
#[get("/settings/platform-settings")]
async fn settings_platform_settings_legacy(req: HttpRequest) -> HttpResponse { settings_platform_settings_inner(req).await }

async fn settings_payment_gateway_inner(cfg: web::Data<Arc<Config>>, req: HttpRequest) -> HttpResponse {
    let p = product(&req);
    HttpResponse::Ok().json(json!({
        "paystack": cfg.paystack_secret_key.as_ref().map(|s| !s.is_empty()).unwrap_or(false),
        "flutterwave": cfg.flutterwave_secret_key.as_ref().map(|s| !s.is_empty()).unwrap_or(false),
        "crypto": cfg.nowpayments_api_key.as_ref().map(|s| !s.is_empty()).unwrap_or(false),
        "currency": cfg.paystack_currency,
        "public_key": cfg.paystack_public_key,
        "product": p.as_str(),
    }))
}
#[get("/api/v1/settings/payment-gateway")]
async fn settings_payment_gateway_v1(cfg: web::Data<Arc<Config>>, req: HttpRequest) -> HttpResponse { settings_payment_gateway_inner(cfg, req).await }
#[get("/settings/payment-gateway")]
async fn settings_payment_gateway_legacy(cfg: web::Data<Arc<Config>>, req: HttpRequest) -> HttpResponse { settings_payment_gateway_inner(cfg, req).await }

async fn settings_streaming_availability_inner(req: HttpRequest) -> HttpResponse {
    let p = product(&req);
    HttpResponse::Ok().json(json!({"available": true, "reason": null, "product": p.as_str()}))
}
#[get("/api/v1/settings/streaming-availability")]
async fn settings_streaming_availability_v1(req: HttpRequest) -> HttpResponse { settings_streaming_availability_inner(req).await }
#[get("/settings/streaming-availability")]
async fn settings_streaming_availability_legacy(req: HttpRequest) -> HttpResponse { settings_streaming_availability_inner(req).await }

async fn settings_dashboard_maintenance_inner() -> HttpResponse {
    HttpResponse::Ok().json(json!({"maintenance": false}))
}
#[get("/api/v1/settings/dashboard-maintenance")]
async fn settings_dashboard_maintenance_v1() -> HttpResponse { settings_dashboard_maintenance_inner().await }
#[get("/settings/dashboard-maintenance")]
async fn settings_dashboard_maintenance_legacy() -> HttpResponse { settings_dashboard_maintenance_inner().await }

async fn settings_api_endpoint_inner(cfg: web::Data<Arc<Config>>, req: HttpRequest) -> HttpResponse {
    let p = product(&req);
    HttpResponse::Ok().json(json!({"api_base": cfg.public_base_url, "realtime": format!("{}/v1/realtime", cfg.public_base_url.trim_end_matches('/')), "product": p.as_str()}))
}
#[get("/api/v1/settings/api-endpoint")]
async fn settings_api_endpoint_v1(cfg: web::Data<Arc<Config>>, req: HttpRequest) -> HttpResponse { settings_api_endpoint_inner(cfg, req).await }
#[get("/settings/api-endpoint")]
async fn settings_api_endpoint_legacy(cfg: web::Data<Arc<Config>>, req: HttpRequest) -> HttpResponse { settings_api_endpoint_inner(cfg, req).await }

async fn settings_dashboard_notification_inner() -> HttpResponse {
    HttpResponse::Ok().json(json!({"notification": null}))
}
#[get("/api/v1/settings/dashboard-notification")]
async fn settings_dashboard_notification_v1() -> HttpResponse { settings_dashboard_notification_inner().await }
#[get("/settings/dashboard-notification")]
async fn settings_dashboard_notification_legacy() -> HttpResponse { settings_dashboard_notification_inner().await }

async fn settings_engine_key_inner(req: HttpRequest) -> HttpResponse {
    let p = product(&req);
    HttpResponse::Ok().json(json!({"mode": "proxy", "message": "use /v1/realtime or /api/v1/realtime signaling proxy", "product": p.as_str()}))
}
#[get("/api/v1/settings/engine-key")]
async fn settings_engine_key_v1(req: HttpRequest) -> HttpResponse { settings_engine_key_inner(req).await }
#[get("/settings/engine-key")]
async fn settings_engine_key_legacy(req: HttpRequest) -> HttpResponse { settings_engine_key_inner(req).await }

async fn settings_engine_key_next_inner(req: HttpRequest) -> HttpResponse {
    let p = product(&req);
    HttpResponse::Ok().json(json!({"ok": true, "mode": "proxy", "product": p.as_str()}))
}
#[post("/api/v1/settings/engine-key/next")]
async fn settings_engine_key_next_v1(req: HttpRequest) -> HttpResponse { settings_engine_key_next_inner(req).await }
#[post("/settings/engine-key/next")]
async fn settings_engine_key_next_legacy(req: HttpRequest) -> HttpResponse { settings_engine_key_next_inner(req).await }
