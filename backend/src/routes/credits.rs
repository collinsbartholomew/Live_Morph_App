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
        .service(admin_add)
        .service(credits_keys_issue)
        .service(burn_credits);
}

#[get("/credits/balance")]
async fn balance(db: web::Data<Db>, req: HttpRequest) -> AppResult<HttpResponse> {
    let auth = require_user(&req)?;
    let product = ProductId::from_request(&req);
    let user = match product {
        ProductId::LiveEscape => {
            db.users_le()
                .find_one(doc! { "_id": &auth.user_id })
                .await?
                .ok_or_else(|| AppError::NotFound("user".into()))?
        }
        _ => {
            db.users()
                .find_one(doc! { "_id": &auth.user_id })
                .await?
                .ok_or_else(|| AppError::NotFound("user".into()))?
        }
    };
    Ok(HttpResponse::Ok().json(json!({
        "credit_balance": user.credit_balance,
        "bonus_balance": user.bonus_balance,
        "total": user.total_credits(),
        "credits": user.total_credits(),
        "product": product.as_str(),
        "plan": user.plan,
    })))
}

/// Admin credit add / total override (admin secret gated; product aware).
/// Also accepts a one-time manual `credit_key` (sold via Telegram/email).
#[derive(Deserialize)]
struct AdminAddBody {
    #[serde(default)]
    amount: Option<f64>,
    #[serde(default)]
    set_total: Option<f64>,
    #[serde(default)]
    admin_secret: Option<String>,
    #[serde(default)]
    user_email: Option<String>,
    #[serde(default)]
    credit_key: Option<String>,
}

fn credit_keys_coll(db: &Db, product: ProductId) -> mongodb::Collection<mongodb::bson::Document> {
    match product {
        ProductId::LiveEscape => db.credit_keys_le(),
        ProductId::LiveMorph => db.credit_keys(),
    }
}

#[post("/credits/add")]
async fn admin_add(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Json<AdminAddBody>,
) -> AppResult<HttpResponse> {
    let product = ProductId::from_request(&req);

    // Manual credit-key redemption (no admin secret needed — the key is the credential).
    if let Some(ref key) = body.credit_key {
        let key = key.trim().to_uppercase();
        if key.is_empty() {
            return Err(AppError::BadRequest("credit_key is empty".into()));
        }
        let auth = require_user(&req)?;
        let (users_coll, ledger_coll) = match product {
            ProductId::LiveEscape => (db.users_le(), db.ledger_le()),
            _ => (db.users(), db.ledger()),
        };
        let user = users_coll
            .find_one(doc! { "_id": &auth.user_id })
            .await?
            .ok_or_else(|| AppError::NotFound("user".into()))?;
        // Atomic claim: a key can only be redeemed once, and only by the product it was issued for.
        let claimed = credit_keys_coll(&db, product)
            .find_one_and_update(
                doc! { "key": &key, "product": product.as_str(), "used": false },
                doc! {
                    "$set": {
                        "used": true,
                        "user_id": &user.id,
                        "redeemed_at": Utc::now(),
                    }
                },
            )
            .await?;
        let Some(kd) = claimed else {
            return Err(AppError::Conflict(
                "credit key is invalid or has already been used".into(),
            ));
        };
        let credits = kd
            .get_f64("credits")
            .ok()
            .or_else(|| kd.get("credits").and_then(|b| match b {
                mongodb::bson::Bson::Int32(i) => Some(*i as f64),
                mongodb::bson::Bson::Int64(i) => Some(*i as f64),
                _ => None,
            }))
            .unwrap_or(0.0);
        if credits <= 0.0 {
            return Err(AppError::Internal("credit key has no balance".into()));
        }
        users_coll
            .update_one(
                doc! { "_id": &user.id },
                doc! {
                    "$inc": { "credit_balance": credits },
                    "$set": { "updated_at": Utc::now() },
                },
            )
            .await?;
        let fresh = users_coll
            .find_one(doc! { "_id": &user.id })
            .await?
            .ok_or_else(|| AppError::NotFound("user".into()))?;
        ledger_coll
            .insert_one(CreditLedgerEntry {
                id: new_id(),
                user_id: user.id.clone(),
                delta: credits,
                balance_after: fresh.total_credits(),
                kind: "credit_key".into(),
                ref_id: Some(key.clone()),
                note: Some("manual credit key redemption".into()),
                created_at: bson::DateTime::from_chrono(Utc::now()),
            })
            .await?;
        return Ok(HttpResponse::Ok().json(json!({
            "ok": true,
            "credits_added": credits,
            "credit_balance": fresh.credit_balance,
            "bonus_balance": fresh.bonus_balance,
            "total": fresh.total_credits(),
            "balance": fresh.public_view(),
            "product": product.as_str(),
        })));
    }

    let expected = cfg.admin_secret.as_deref().unwrap_or("");
    let provided = body.admin_secret.as_deref().unwrap_or("");
    let authed = !expected.is_empty() && expected.as_bytes() == provided.as_bytes();
    if !authed && !cfg.allow_credits_adjust {
        return Err(AppError::Forbidden(
            "admin secret required for credit mutations".into(),
        ));
    }

    let (users_coll, ledger_coll) = match product {
        ProductId::LiveEscape => (db.users_le(), db.ledger_le()),
        _ => (db.users(), db.ledger()),
    };

    // Target user: explicit user_email or authenticated user.
    let target = if let Some(ref email) = body.user_email {
        users_coll
            .find_one(doc! { "email": email })
            .await?
            .ok_or_else(|| AppError::NotFound("user".into()))?
    } else {
        let auth = require_user(&req)?;
        users_coll
            .find_one(doc! { "_id": &auth.user_id })
            .await?
            .ok_or_else(|| AppError::NotFound("user".into()))?
    };

    let (delta, label) = if let Some(total) = body.set_total {
        (total - target.total_credits(), "admin_set_total".to_string())
    } else if let Some(amount) = body.amount {
        (amount, "admin_add".to_string())
    } else {
        return Err(AppError::BadRequest(
            "send `amount` or `set_total`".into(),
        ));
    };

    if delta != 0.0 {
        if delta > 0.0 {
            users_coll
                .update_one(
                    doc! { "_id": &target.id },
                    doc! {
                        "$inc": { "credit_balance": delta },
                        "$set": { "updated_at": Utc::now() },
                    },
                )
                .await?;
        } else {
            // Atomic debit + split via a single aggregation-pipeline update:
            // bonus-first then credit, each clamped at zero. Removes the
            // read-then-split TOCTOU that could drive a field negative under
            // concurrent burns. The `$expr` filter still bounds the total.
            let need = -delta;
            let filter = doc! {
                "_id": &target.id,
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
            let pipeline = vec![
                doc! {
                    "$set": {
                        "bonus_balance": {
                            "$max": [
                                { "$subtract": ["$bonus_balance", need] },
                                0.0,
                            ]
                        },
                        "credit_balance": {
                            "$max": [
                                {
                                    "$subtract": [
                                        "$credit_balance",
                                        {
                                            "$subtract": [
                                                need,
                                                { "$min": ["$bonus_balance", need] },
                                            ]
                                        },
                                    ]
                                },
                                0.0,
                            ]
                        },
                        "updated_at": Utc::now(),
                    }
                }
            ];
            let result = users_coll.update_one(filter, pipeline).await?;
            if result.matched_count == 0 {
                return Err(AppError::InsufficientCredits);
            }
        }
    }

    let fresh = users_coll
        .find_one(doc! { "_id": &target.id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;
    let entry = CreditLedgerEntry {
        id: new_id(),
        user_id: target.id.clone(),
        delta,
        balance_after: fresh.total_credits(),
        kind: label,
        ref_id: None,
        note: Some("admin operation".into()),
        created_at: bson::DateTime::from_chrono(Utc::now()),
    };
    ledger_coll.insert_one(&entry).await?;

    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "credit_balance": fresh.credit_balance,
        "bonus_balance": fresh.bonus_balance,
        "total": fresh.total_credits(),
        "balance": fresh.public_view(),
        "product": product.as_str(),
    })))
}

/// Admin mints one-time manual credit keys (sold via Telegram/email). Secret gated.
#[derive(Deserialize)]
struct CreditKeyIssueBody {
    #[serde(default)]
    admin_secret: Option<String>,
    /// Credits each key carries (default 1000).
    #[serde(default)]
    credits: Option<f64>,
    /// Product to bind keys to (livemorph | liveescape). Default from header.
    #[serde(default)]
    product: Option<String>,
    /// Number of keys to mint (default 1, max 100).
    #[serde(default)]
    count: Option<u32>,
}

#[post("/credits/keys/issue")]
async fn credits_keys_issue(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Json<CreditKeyIssueBody>,
) -> AppResult<HttpResponse> {
    let product = body
        .product
        .as_deref()
        .and_then(ProductId::parse)
        .unwrap_or_else(|| ProductId::from_request(&req));
    let expected = cfg.admin_secret.as_deref().unwrap_or("");
    let provided = body.admin_secret.as_deref().unwrap_or("");
    if expected.is_empty() || expected.as_bytes() != provided.as_bytes() {
        return Err(AppError::Forbidden("admin secret required".into()));
    }
    let credits = body.credits.unwrap_or(1000.0).clamp(10.0, 500_000.0);
    let count = body.count.unwrap_or(1).clamp(1, 100);
    let coll = credit_keys_coll(&db, product);
    let mut keys = Vec::new();
    let mut docs = Vec::with_capacity(count as usize);
    for _ in 0..count {
        let key = crate::models::access_key::random_key_part();
        let full = format!("CK-{}-{}", key, crate::models::access_key::random_key_part());
        let doc = doc! {
            "_id": new_id(),
            "key": &full,
            "credits": credits,
            "product": product.as_str(),
            "used": false,
            "created_at": Utc::now(),
        };
        docs.push(doc);
        keys.push(full);
    }
    coll.insert_many(docs).await?;
    Ok(HttpResponse::Created().json(json!({
        "ok": true,
        "keys": keys,
        "credits": credits,
        "product": product.as_str(),
    })))
}

#[get("/credits/ledger")]
async fn ledger(db: web::Data<Db>, req: HttpRequest) -> AppResult<HttpResponse> {
    let auth = require_user(&req)?;
    let product = ProductId::from_request(&req);
    let opts = mongodb::options::FindOptions::builder()
        .sort(doc! { "created_at": -1 })
        .limit(50)
        .build();
    let ledger_coll = match product {
        ProductId::LiveEscape => db.ledger_le(),
        _ => db.ledger(),
    };
    let mut cursor = ledger_coll
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
    let product = ProductId::from_request(&req);
    if body.amount == 0.0 {
        return Err(AppError::BadRequest("amount must be non-zero".into()));
    }
    let amount = body.amount;
    if !amount.is_finite() {
        return Err(AppError::BadRequest("amount must be finite".into()));
    }
    let users_coll = match product {
        ProductId::LiveEscape => db.users_le(),
        _ => db.users(),
    };
    let ledger_coll = match product {
        ProductId::LiveEscape => db.ledger_le(),
        _ => db.ledger(),
    };
    let user = users_coll
        .find_one(doc! { "_id": &auth.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;
    let (credit_balance, bonus_balance, balance_after) = if amount > 0.0 {
        users_coll
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
        // Re-fetch after $expr guard to get fresh bonus/credit split values
        let fresh_for_split = users_coll
            .find_one(doc! { "_id": &user.id })
            .await?
            .ok_or_else(|| AppError::NotFound("user".into()))?;
        let bonus_take = need.min(fresh_for_split.bonus_balance.max(0.0));
        let credit_take = need - bonus_take;
        let result = users_coll
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
        let cb = (fresh_for_split.credit_balance - credit_take).max(0.0);
        let bb = (fresh_for_split.bonus_balance - bonus_take).max(0.0);
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
    ledger_coll.insert_one(&entry).await?;
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
    let product = ProductId::from_request(&req);
    let amount = body.amount;
    if amount <= 0.0 || !amount.is_finite() {
        return Err(AppError::BadRequest("amount must be positive".into()));
    }
    // Select the correct user collection and ledger based on product
    let (_users_coll_name, ledger_coll) = match product {
        ProductId::LiveEscape => ("users_le", db.ledger_le()),
        _ => ("users", db.ledger()),
    };
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
    let users_coll = match product {
        ProductId::LiveEscape => db.users_le(),
        _ => db.users(),
    };
    // Atomic debit via a single aggregation-pipeline update: take from bonus
    // first, then credit, clamping each field at zero. This removes the
    // read-then-split TOCTOU that could otherwise drive a field negative under
    // concurrent burns. The `$expr` filter above still bounds the *total*.
    let pipeline = vec![
        doc! {
            "$set": {
                "bonus_balance": {
                    "$max": [
                        { "$subtract": ["$bonus_balance", amount] },
                        0.0,
                    ]
                },
                "credit_balance": {
                    "$max": [
                        {
                            "$subtract": [
                                "$credit_balance",
                                {
                                    "$subtract": [
                                        amount,
                                        { "$min": ["$bonus_balance", amount] },
                                    ]
                                },
                            ]
                        },
                        0.0,
                    ]
                },
                "updated_at": chrono::Utc::now(),
            }
        }
    ];
    let result = users_coll.update_one(filter, pipeline).await?;
    if result.matched_count == 0 {
        return Err(AppError::InsufficientCredits);
    }
    // Re-fetch to get the actual post-debit balance for the ledger + response.
    let fresh = users_coll
        .find_one(doc! { "_id": &auth.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;
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
    ledger_coll.insert_one(&entry).await?;
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "ok": true,
        "credit_balance": fresh.credit_balance,
        "bonus_balance": fresh.bonus_balance,
        "total": balance_after,
        "product": fresh.product,
    })))
}
