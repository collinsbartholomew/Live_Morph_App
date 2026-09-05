//! Public unauthenticated endpoints for Live Escape

use crate::error::AppResult;
use actix_web::{get, post, web, HttpResponse};
use serde_json::json;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(feature_flags)
        .service(storage_reset_token)
        .service(logout_token)
        .service(storage_reset)
        .service(public_logout);
}

#[get("/public/feature-flags")]
async fn feature_flags() -> AppResult<HttpResponse> {
    Ok(HttpResponse::Ok().json(json!({
        "flags": {
            "enable_starter_pack": true,
            "enable_activation": true,
            "enable_crypto": true,
            "enable_creator_payout": true
        }
    })))
}

#[get("/public/storage-reset-token")]
async fn storage_reset_token() -> AppResult<HttpResponse> {
    Ok(HttpResponse::Ok().json(json!({
        "token": uuid::Uuid::new_v4().to_string()
    })))
}

#[get("/public/logout-token")]
async fn logout_token() -> AppResult<HttpResponse> {
    Ok(HttpResponse::Ok().json(json!({
        "token": uuid::Uuid::new_v4().to_string()
    })))
}

#[post("/public/storage-reset")]
async fn storage_reset() -> AppResult<HttpResponse> {
    Ok(HttpResponse::Ok().json(json!({ "ok": true })))
}

#[post("/public/logout")]
async fn public_logout() -> AppResult<HttpResponse> {
    Ok(HttpResponse::Ok().json(json!({ "ok": true })))
}
