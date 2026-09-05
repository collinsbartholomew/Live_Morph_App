use crate::auth::middleware::require_user;
use crate::config::Config;
use crate::db::{new_id, Db};
use crate::error::{AppError, AppResult};
use crate::models::CreditLedgerEntry;
use crate::product::ProductId;
use actix_web::{get, post, web, HttpRequest, HttpResponse};
use chrono::Utc;
use futures_util::TryStreamExt;
use mongodb::bson::doc;
use serde::Deserialize;
use serde_json::json;
use std::sync::Arc;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(balance)
        .service(ledger)
        .service(adjust_demo)
        .service(burn_credits);
}

#[get("/credits/balance")]
async fn balance(db: web::Data<Db>, req: HttpRequest) -> AppResult<HttpResponse> {
    let auth = require_user(&req)?;
    let user = db
        .users()
        .find_one(doc! { "_id": &auth.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;
    let product = ProductId::from_request(&req);
    Ok(HttpResponse::Ok().json(json!({
        "credit_balance": user.credit_balance,
        "bonus_balance": user.bonus_balance,
        "total": user.total_credits(),
        "credits": user.total_credits(),
        "product": product.as_str(),
        "plan": user.plan,
    })))
}

#[get("/credits/ledger")]
async fn ledger(db: web::Data<Db>, req: HttpRequest) -> AppResult<HttpResponse> {
    let auth = require_user(&req)?;
    let opts = mongodb::options::FindOptions::builder()
        .sort(doc! { "created_at": -1 })
        .limit(50)
        .build();
    let mut cursor = db
        .ledger()
        .find(doc! { "user_id": &auth.user_id })
        .with_options(opts)
        .await?;
    let mut items = Vec::new();
    while let Some(e) = cursor.try_next().await? {
        items.push(e);
    }
    Ok(HttpResponse::Ok().json(items))
}

/// Demo-only top-up for local testing (no payment provider).
/// Disable or protect in production behind admin role if needed.
#[derive(Deserialize)]
struct AdjustBody {
    amount: f64,
    note: Option<String>,
}

#[post("/credits/adjust")]
async fn adjust_demo(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Json<AdjustBody>,
) -> AppResult<HttpResponse> {
    if !cfg.allow_credits_adjust {
        return Err(AppError::Forbidden(
            "credits adjust disabled (set ALLOW_CREDITS_ADJUST=true only in development)".into(),
        ));
    }
    let auth = require_user(&req)?;
    if body.amount == 0.0 {
        return Err(AppError::BadRequest("amount must be non-zero".into()));
    }
    let amount = body.amount;
    if !amount.is_finite() {
        return Err(AppError::BadRequest("amount must be finite".into()));
    }
    let user = db
        .users()
        .find_one(doc! { "_id": &auth.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;
    let (credit_balance, bonus_balance, balance_after) = if amount > 0.0 {
        db.users()
            .update_one(
                doc! { "_id": &user.id },
                doc! {
                    "$inc": { "credit_balance": amount },
                    "$set": { "updated_at": Utc::now() },
                },
            )
            .await?;
        let cb = user.credit_balance + amount;
        let bb = user.bonus_balance;
        (cb, bb, cb + bb)
    } else {
        let need = -amount;
        let filter = doc! {
            "_id": &user.id,
            "$expr": {
                "$gte": [
                    { "$add": [
                        { "$ifNull": ["$credit_balance", 0] },
                        { "$ifNull": ["$bonus_balance", 0] }
                    ]},
                    need
                ]
            }
        };
        let bonus_take = need.min(user.bonus_balance.max(0.0));
        let credit_take = need - bonus_take;
        let result = db
            .users()
            .update_one(
                filter,
                doc! {
                    "$inc": {
                        "bonus_balance": -bonus_take,
                        "credit_balance": -credit_take,
                    },
                    "$set": { "updated_at": Utc::now() },
                },
            )
            .await?;
        if result.matched_count == 0 {
            return Err(AppError::InsufficientCredits);
        }
        let cb = (user.credit_balance - credit_take).max(0.0);
        let bb = (user.bonus_balance - bonus_take).max(0.0);
        (cb, bb, cb + bb)
    };
    let entry = CreditLedgerEntry {
        id: new_id(),
        user_id: user.id.clone(),
        delta: amount,
        balance_after,
        kind: if body.amount > 0.0 {
            "purchase"
        } else {
            "adjustment"
        }
        .into(),
        ref_id: None,
        note: body.note.clone(),
        created_at: bson::DateTime::from_chrono(Utc::now()),
    };
    db.ledger().insert_one(&entry).await?;
    Ok(HttpResponse::Ok().json(json!({
        "credit_balance": credit_balance,
        "bonus_balance": bonus_balance,
        "total": balance_after,
    })))
}

/// Shared burn — used by Live Escape client and any product session meter.
#[derive(Deserialize)]
struct BurnBody {
    #[serde(default)]
    amount: f64,
    #[serde(default)]
    reason: Option<String>,
    #[serde(default)]
    session_id: Option<String>,
    #[serde(default)]
    product: Option<String>,
}

#[post("/credits/burn")]
async fn burn_credits(
    db: web::Data<Db>,
    req: HttpRequest,
    body: web::Json<BurnBody>,
) -> AppResult<HttpResponse> {
    let auth = require_user(&req)?;
    let amount = body.amount;
    if amount <= 0.0 || !amount.is_finite() {
        return Err(AppError::BadRequest("amount must be positive".into()));
    }
    // Atomic debit: only matches if total credits >= amount (prevents double-spend races)
    let filter = doc! {
        "_id": &auth.user_id,
        "$expr": {
            "$gte": [
                { "$add": [
                    { "$ifNull": ["$credit_balance", 0] },
                    { "$ifNull": ["$bonus_balance", 0] }
                ]},
                amount
            ]
        }
    };
    let user = db
        .users()
        .find_one(doc! { "_id": &auth.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;
    let bonus_take = amount.min(user.bonus_balance.max(0.0));
    let credit_take = amount - bonus_take;
    let result = db
        .users()
        .update_one(
            filter,
            doc! {
                "$inc": {
                    "bonus_balance": -bonus_take,
                    "credit_balance": -credit_take,
                },
                "$set": { "updated_at": chrono::Utc::now() },
            },
        )
        .await?;
    if result.matched_count == 0 {
        return Err(AppError::InsufficientCredits);
    }
    // Re-fetch to get the actual post-debit balance (the pre-update read may be stale)
    let fresh = db
        .users()
        .find_one(doc! { "_id": &auth.user_id })
        .await?
        .unwrap_or_else(|| user.clone());
    let balance_after = fresh.total_credits();
    let entry = crate::models::CreditLedgerEntry {
        id: crate::db::new_id(),
        user_id: auth.user_id.clone(),
        delta: -amount,
        balance_after,
        kind: "burn".into(),
        ref_id: body.session_id.clone(),
        note: body.reason.clone().or_else(|| body.product.clone()),
        created_at: bson::DateTime::from_chrono(chrono::Utc::now()),
    };
    db.ledger().insert_one(&entry).await?;
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "ok": true,
        "credit_balance": fresh.credit_balance,
        "bonus_balance": fresh.bonus_balance,
        "total": balance_after,
        "product": fresh.product,
    })))
}
