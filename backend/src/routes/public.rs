//! Public endpoints shared by both products – product aware via headers.
//!
//! storage-reset / logout tokens are one-shot admin directives persisted in a
//! shared collection and consumed by the client when it acknowledges them.

use crate::config::Config;
use crate::db::{new_id, Db};
use crate::error::{AppError, AppResult};
use crate::product::ProductId;
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

#[get("/public/feature-flags")]
async fn feature_flags(req: HttpRequest, cfg: web::Data<Arc<Config>>) -> AppResult<HttpResponse> {
    let product = ProductId::from_request(&req);
    let crypto = cfg.nowpayments_api_key.as_ref().map(|k| !k.is_empty()).unwrap_or(false);
    let flags = match product {
        ProductId::LiveEscape => json!({
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
#[get("/public/storage-reset-token")]
async fn storage_reset_token(db: web::Data<Db>, req: HttpRequest) -> AppResult<HttpResponse> {
    let product = ProductId::from_request(&req);
    let coll = db.db.collection::<mongodb::bson::Document>("admin_directives");
    let doc = coll
        .find_one(doc! {
            "kind": "storage_reset",
            "product": product.as_str(),
            "consumed": false,
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
    let expected = cfg.admin_secret.as_deref().unwrap_or("");
    let provided = body.admin_secret.as_deref().unwrap_or("");
    if expected.is_empty() || expected.as_bytes() != provided.as_bytes() {
        return Err(AppError::Forbidden("admin secret required".into()));
    }
    let kind = body.kind.clone().unwrap_or_else(|| "storage_reset".into());
    let coll = db.db.collection::<mongodb::bson::Document>("admin_directives");
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
    let product = ProductId::from_request(&req);
    let coll = db.db.collection::<mongodb::bson::Document>("admin_directives");
    let doc = coll
        .find_one(doc! {
            "kind": "force_logout",
            "product": product.as_str(),
            "consumed": false,
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
    let product = ProductId::from_request(&req);
    let token = body
        .token
        .as_deref()
        .map(|s| s.trim())
        .filter(|s| !s.is_empty());
    let coll = db.db.collection::<mongodb::bson::Document>("admin_directives");
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