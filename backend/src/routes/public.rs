//! Public endpoints shared by both products – product aware via headers.
//!
//! storage-reset / logout tokens are one-shot admin directives persisted in a
//! shared collection and consumed by the client when it acknowledges them.

use crate::config::Config;
use crate::db::{new_id, Db};
use crate::error::{AppError, AppResult};
use crate::product::ProductId;
use crate::auth::middleware::require_user;
use actix_web::{get, post, web, HttpRequest, HttpResponse};
use chrono::Utc;
use mongodb::bson::doc;
use serde::Deserialize;
use serde_json::json;
use std::sync::Arc;
use uuid::Uuid;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(feature_flags)
        .service(storage_reset_token)
        .service(storage_reset_token_issue)
        .service(logout_token)
        .service(storage_reset)
        .service(public_logout);
}

// Per-product directive store (secondary slot is isolated like everything else).
fn directives_coll(db: &Db, product: ProductId) -> mongodb::Collection<mongodb::bson::Document> {
    match product {
        ProductId::Secondary => db.db_secondary.collection("admin_directives"),
        ProductId::LiveMorph => db.db.collection("admin_directives"),
    }
}

#[get("/public/feature-flags")]
async fn feature_flags(req: HttpRequest, cfg: web::Data<Arc<Config>>) -> AppResult<HttpResponse> {
    let product = ProductId::from_request(&req);
    let crypto = cfg.nowpayments_api_key.as_ref().map(|k| !k.is_empty()).unwrap_or(false);
    let flags = match product {
        ProductId::Secondary => json!({
            "enable_starter_pack": true,
            "enable_activation": true,
            "enable_crypto": crypto,
            "enable_creator_payout": true,
            "free_credits_enabled": true,
            "free_credits_amount": 1500,
            "referral_enabled": true,
        }),
        ProductId::LiveMorph => json!({
            "enable_starter_pack": false,
            "enable_activation": false,
            "enable_crypto": crypto,
            "enable_creator_payout": false,
            "free_credits_enabled": true,
            "free_credits_amount": 1500,
            "referral_enabled": false,
        }),
    };
    Ok(HttpResponse::Ok().json(json!({
        "flags": flags,
        "product": product.as_str(),
    })))
}

/// Client polling endpoint: returns any pending one-shot directive.
/// Authenticated: the directive token is a bearer credential, so it must only
/// be disclosed to a logged-in client of the matching product, never to an
/// unauthenticated caller (which could then consume the directive).
#[get("/public/storage-reset-token")]
async fn storage_reset_token(db: web::Data<Db>, req: HttpRequest) -> AppResult<HttpResponse> {
    let _auth = require_user(&req)?;
    let ip = crate::auth::client_ip(&req);
    if !crate::auth::check_rate_limit(&ip, "directive-poll", 10, 60) {
        return Err(AppError::RateLimited("too many polls".into()));
    }
    let product = ProductId::from_request(&req);
    let coll = directives_coll(&db, product);
    let doc = coll
        .find_one(doc! {
            "kind": "storage_reset",
            "product": product.as_str(),
            "consumed": false,
            "expires_at": { "$gt": Utc::now() },
        })
        .await?;
    match doc {
        Some(d) => Ok(HttpResponse::Ok().json(json!({
            "token": d.get_str("token").unwrap_or(""),
        }))),
        None => Ok(HttpResponse::Ok().json(json!({ "token": "" }))),
    }
}

#[derive(Deserialize)]
struct IssueTokenBody {
    admin_secret: Option<String>,
    #[serde(default)]
    kind: Option<String>,
}

/// Admin issuing endpoint (mutation, admin-secret gated).
#[post("/public/storage-reset-token")]
async fn storage_reset_token_issue(
    db: web::Data<Db>,
    cfg: web::Data<std::sync::Arc<crate::config::Config>>,
    req: HttpRequest,
    body: web::Json<IssueTokenBody>,
) -> AppResult<HttpResponse> {
    let product = ProductId::from_request(&req);
    // Rate-limit BEFORE the admin-secret compare so the endpoint can't be used
    // as a timing oracle to brute-force the secret.
    let ip = crate::auth::client_ip(&req);
    if !crate::auth::check_rate_limit(&ip, "directive-issue", 5, 60) {
        return Err(AppError::RateLimited("too many requests".into()));
    }
    let expected = cfg.admin_secret.as_deref().unwrap_or("");
    let provided = body.admin_secret.as_deref().unwrap_or("");
    if expected.is_empty() || !bool::from(subtle::ConstantTimeEq::ct_eq(expected.as_bytes(), provided.as_bytes())) {
        return Err(AppError::Forbidden("admin secret required".into()));
    }
    let kind = body.kind.clone().unwrap_or_else(|| "storage_reset".into());
    let coll = directives_coll(&db, product);
    let token = format!("{}:{}", product.as_str(), Uuid::new_v4().simple());
    coll.insert_one(doc! {
        "_id": new_id(),
        "kind": &kind,
        "product": product.as_str(),
        "token": &token,
        "consumed": false,
        "created_at": Utc::now(),
        "expires_at": Utc::now() + chrono::Duration::minutes(15),
    })
    .await?;
    Ok(HttpResponse::Ok().json(json!({ "token": token, "ok": true })))
}

#[get("/public/logout-token")]
async fn logout_token(db: web::Data<Db>, req: HttpRequest) -> AppResult<HttpResponse> {
    let _auth = require_user(&req)?;
    let ip = crate::auth::client_ip(&req);
    if !crate::auth::check_rate_limit(&ip, "directive-poll", 10, 60) {
        return Err(AppError::RateLimited("too many polls".into()));
    }
    let product = ProductId::from_request(&req);
    let coll = directives_coll(&db, product);
    let doc = coll
        .find_one(doc! {
            "kind": "force_logout",
            "product": product.as_str(),
            "consumed": false,
            "expires_at": { "$gt": Utc::now() },
        })
        .await?;
    match doc {
        Some(d) => Ok(HttpResponse::Ok().json(json!({
            "token": d.get_str("token").unwrap_or(""),
        }))),
        None => Ok(HttpResponse::Ok().json(json!({ "token": "" }))),
    }
}

#[derive(Deserialize)]
struct ConsumeTokenBody {
    token: Option<String>,
}

async fn consume_directive(
    db: web::Data<Db>,
    req: HttpRequest,
    body: web::Json<ConsumeTokenBody>,
    kind: &str,
) -> AppResult<HttpResponse> {
    let _auth = require_user(&req)?;
    let product = ProductId::from_request(&req);
    // Throttle consumption attempts (the token is the credential, but don't
    // let this be an unthrottled oracle).
    let ip = crate::auth::client_ip(&req);
    if !crate::auth::check_rate_limit(&ip, "directive-consume", 10, 60) {
        return Err(AppError::RateLimited("too many requests".into()));
    }
    let token = body
        .token
        .as_deref()
        .map(|s| s.trim())
        .filter(|s| !s.is_empty());
    let coll = directives_coll(&db, product);
    if let Some(t) = token {
        coll.update_one(
            doc! { "token": t, "kind": kind, "product": product.as_str(), "consumed": false },
            doc! { "$set": { "consumed": true, "consumed_at": Utc::now() } },
        )
        .await?;
    }
    Ok(HttpResponse::Ok().json(json!({ "ok": true })))
}

#[post("/public/storage-reset")]
async fn storage_reset(
    db: web::Data<Db>,
    req: HttpRequest,
    body: web::Json<ConsumeTokenBody>,
) -> AppResult<HttpResponse> {
    consume_directive(db, req, body, "storage_reset").await
}

#[post("/public/logout")]
async fn public_logout(
    db: web::Data<Db>,
    req: HttpRequest,
    body: web::Json<ConsumeTokenBody>,
) -> AppResult<HttpResponse> {
    consume_directive(db, req, body, "force_logout").await
}