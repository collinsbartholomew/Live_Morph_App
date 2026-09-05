//! Unified creator / payout routes.

use crate::auth::middleware::require_user;
use crate::product::ProductId;
use actix_web::{get, post, web, HttpRequest, HttpResponse};
use serde_json::json;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(payout_get_v1)
        .service(payout_get_legacy)
        .service(payout_post_v1)
        .service(payout_post_legacy);
}

async fn payout_get_inner(req: HttpRequest) -> HttpResponse {
    let _ = require_user(&req);
    let product = ProductId::from_request(&req);
    HttpResponse::Ok().json(json!({ "details": null, "product": product.as_str() }))
}
#[get("/api/v1/creator/payout-details")]
async fn payout_get_v1(req: HttpRequest) -> HttpResponse { payout_get_inner(req).await }
#[get("/creator/payout-details")]
async fn payout_get_legacy(req: HttpRequest) -> HttpResponse { payout_get_inner(req).await }

async fn payout_post_inner(req: HttpRequest, body: web::Json<serde_json::Value>) -> HttpResponse {
    let _ = require_user(&req);
    let product = ProductId::from_request(&req);
    let _ = body;
    HttpResponse::Ok().json(json!({ "ok": true, "product": product.as_str() }))
}
#[post("/api/v1/creator/payout-details")]
async fn payout_post_v1(req: HttpRequest, body: web::Json<serde_json::Value>) -> HttpResponse { payout_post_inner(req, body).await }
#[post("/creator/payout-details")]
async fn payout_post_legacy(req: HttpRequest, body: web::Json<serde_json::Value>) -> HttpResponse { payout_post_inner(req, body).await }
