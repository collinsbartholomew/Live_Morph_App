use crate::auth::middleware::require_user;
use crate::routes::auth::hash_token;
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
        ProductId::Secondary => {
            db.users_secondary()
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
        ProductId::Secondary => db.credit_keys_secondary(),
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
    let ip = crate::auth::client_ip(&req);
    if !crate::auth::check_rate_limit(&ip, "credits-add", 10, 60) {
        return Err(AppError::RateLimited(
            "too many credit redemption attempts — try again in 60 seconds".into(), None));
    }

    // Manual credit-key redemption (no admin secret needed — the key is the credential).
    if let Some(ref key) = body.credit_key {
        let key = key.trim().to_uppercase();
        if key.is_empty() {
            return Err(AppError::BadRequest("credit_key is empty".into()));
        }
        let auth = require_user(&req)?;
        let (users_coll, ledger_coll) = match product {
            ProductId::Secondary => (db.users_secondary(), db.ledger_secondary()),
            _ => (db.users(), db.ledger()),
        };
        let user = users_coll
            .find_one(doc! { "_id": &auth.user_id })
            .await?
            .ok_or_else(|| AppError::NotFound("user".into()))?;
        let key_hash = hash_token(&key);
        let keys = credit_keys_coll(&db, product);
        let kd = keys
            .find_one(doc! { "key_hash": &key_hash, "product": product.as_str() })
            .await?
            .ok_or_else(|| AppError::Conflict(
                "credit key is invalid or has already been used".into(),
            ))?;
        let used = kd.get_bool("used").unwrap_or(false);
        let owner = kd.get_str("user_id").ok();
        if used && owner != Some(user.id.as_str()) {
            return Err(AppError::Conflict(
                "credit key is invalid or has already been used".into(),
            ));
        }
        if !used {
            // Atomic claim: a key can only be redeemed once, and only by the
            // product it was issued for.
            let claimed = keys
                .find_one_and_update(
                    doc! { "key_hash": &key_hash, "product": product.as_str(), "used": false },
                    doc! {
                        "$set": {
                            "used": true,
                            "user_id": &user.id,
                            "redeemed_at": Utc::now(),
                        }
                    },
                )
                .await?;
            if claimed.is_none() {
                return Err(AppError::Conflict(
                    "credit key is invalid or has already been used".into(),
                ));
            }
        }
        let credits = kd
            .get_f64("credits")
            .ok()
            .or_else(|| kd.get("credits").and_then(|b| match b {
                mongodb::bson::Bson::Int32(i) => Some(*i as f64),
                mongodb::bson::Bson::Int64(i) => Some(*i as f64),
                _ => None,
            }))
            .unwrap_or(0.0);
        if !credits.is_finite() || credits <= 0.0 {
            return Err(AppError::Internal("credit key has no balance".into()));
        }
        // Exactly-once credit anchored on the USER document: the key claim
        // above may succeed and the process crash before the increment — a
        // retry then resumes here (the key is owned by this user) and the
        // redeemed_credit_keys marker guarantees the increment lands once.
        use mongodb::options::{FindOneAndUpdateOptions, ReturnDocument};
        let updated = users_coll
            .find_one_and_update(
                doc! { "_id": &user.id, "redeemed_credit_keys": { "$ne": &key_hash } },
                doc! {
                    "$inc": { "credit_balance": credits },
                    "$push": { "redeemed_credit_keys": { "$each": [&key_hash], "$slice": -10_000 } },
                    "$set": { "updated_at": Utc::now() },
                },
            )
            .with_options(
                FindOneAndUpdateOptions::builder()
                    .return_document(ReturnDocument::After)
                    .build(),
            )
            .await?;
        let (fresh, already) = match updated {
            Some(u) => (u, false),
            None => {
                // Marker already present: this key was fully redeemed before
                // (not a crash-resume) — preserve the original 409 contract.
                return Err(AppError::Conflict(
                    "credit key is invalid or has already been used".into(),
                ));
            }
        };
        if let Err(e) = ledger_coll
            .insert_one(CreditLedgerEntry {
                id: new_id(),
                user_id: user.id.clone(),
                delta: credits,
                balance_after: fresh.total_credits(),
                kind: "credit_key".into(),
                // Store only the hash — a DB dump must not reveal redeemable keys.
                ref_id: Some(key_hash.clone()),
                note: Some("manual credit key redemption".into()),
                created_at: bson::DateTime::from_chrono(Utc::now()),
            })
            .await
        {
            if !e.to_string().contains("E11000") {
                tracing::warn!(error = %e, "credit-key ledger insert failed");
            }
        }
        return Ok(HttpResponse::Ok().json(json!({
            "ok": true,
            "already": already,
            "credits_added": if already { 0.0 } else { credits },
            "credit_balance": fresh.credit_balance,
            "bonus_balance": fresh.bonus_balance,
            "total": fresh.total_credits(),
            "balance": fresh.public_view(),
            "product": product.as_str(),
        })));
    }

    if !crate::auth::check_rate_limit(&ip, "admin-secret", 5, 60) {
        return Err(AppError::RateLimited(
            "too many admin attempts — try again in 60 seconds".into(), None));
    }
    let expected = cfg.admin_secret.as_deref().unwrap_or("");
    let provided = body.admin_secret.as_deref().unwrap_or("");
    let authed = !expected.is_empty() && subtle::ConstantTimeEq::ct_eq(expected.as_bytes(), provided.as_bytes()).into();
    // Admin secret is ALWAYS required for credit mutations — the
    // allow_credits_adjust dev flag must never open an admin mint path.
    if !authed {
        return Err(AppError::Forbidden(
            "admin secret required for credit mutations".into(),
        ));
    }

    let (users_coll, ledger_coll) = match product {
        ProductId::Secondary => (db.users_secondary(), db.ledger_secondary()),
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

    if let Some(total) = body.set_total {
        // set_total is a TRUE set: a negative or non-finite value would push
        // bonus_balance/credit_balance negative via the $min/$max pipeline.
        if !total.is_finite() || total < 0.0 {
            return Err(AppError::BadRequest(
                "set_total must be a finite value >= 0".into(),
            ));
        }
    }

    for v in [body.amount, body.set_total].into_iter().flatten() {
        if !v.is_finite() || v.abs() > 1_000_000.0 {
            return Err(AppError::BadRequest(
                "amount/set_total must be finite and within ±1000000".into(),
            ));
        }
    }
    let (delta, label) = if let Some(total) = body.set_total {
        (total - target.total_credits(), "admin_set_total".to_string())
    } else if let Some(amount) = body.amount {
        (amount, "admin_add".to_string())
    } else {
        return Err(AppError::BadRequest(
            "send `amount` or `set_total`".into(),
        ));
    };

    if let Some(total) = body.set_total {
        // set_total must be a TRUE set, not a stale-delta $inc: compute the
        // split in-DB so a concurrent purchase/refund between the read and the
        // write can't make the final balance differ from `total`.
        let set_pipeline = vec![
            doc! {
                "$set": {
                    // Put the whole total in credit_balance, keep bonus as-is is
                    // wrong — instead: credit = max(total - bonus, 0), bonus = min(bonus, total)
                    "bonus_balance": { "$min": [{ "$ifNull": ["$bonus_balance", 0] }, total] },
                    "credit_balance": { "$max": [{ "$subtract": [total, { "$ifNull": ["$bonus_balance", 0] }] }, 0.0] },
                    "updated_at": Utc::now(),
                }
            }
        ];
        users_coll
            .update_one(doc! { "_id": &target.id }, set_pipeline)
            .await?;
    } else if delta != 0.0 {
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
    /// Product to bind keys to (livemorph | secondary). Default from header.
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
    {
        let ip = crate::auth::client_ip(&req);
        if !crate::auth::check_rate_limit(&ip, "admin-secret", 5, 60) {
            return Err(AppError::RateLimited("too many admin attempts".into(), None));
        }
    }
    let expected = cfg.admin_secret.as_deref().unwrap_or("");
    let provided = body.admin_secret.as_deref().unwrap_or("");
    if expected.is_empty() || !bool::from(subtle::ConstantTimeEq::ct_eq(expected.as_bytes(), provided.as_bytes())) {
        return Err(AppError::Forbidden("admin secret required".into()));
    }
    if !body.credits.unwrap_or(1000.0).is_finite() {
        return Err(AppError::BadRequest("credits must be finite".into()));
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
            "key_hash": hash_token(&full),
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
        ProductId::Secondary => db.ledger_secondary(),
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
    if !cfg.allow_credits_adjust || cfg.is_production() {
        return Err(AppError::Forbidden(
            "credits adjust disabled in this environment".into(),
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
        ProductId::Secondary => db.users_secondary(),
        _ => db.users(),
    };
    let ledger_coll = match product {
        ProductId::Secondary => db.ledger_secondary(),
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
        // Compute the bonus/credit split INSIDE the update (no re-fetch, no
        // stale-read TOCTOU that could drive bonus_balance negative under a
        // concurrent burn) — same atomic pipeline pattern as burn_credits.
        let pipeline = vec![
            doc! {
                "$set": {
                    "bonus_balance": {
                        "$max": [{ "$subtract": [{ "$ifNull": ["$bonus_balance", 0] }, need] }, 0.0]
                    },
                    "credit_balance": {
                        "$max": [
                            { "$subtract": [
                                { "$ifNull": ["$credit_balance", 0] },
                                { "$subtract": [need, { "$min": [{ "$ifNull": ["$bonus_balance", 0] }, need] }] }
                            ]},
                            0.0,
                        ]
                    },
                    "updated_at": Utc::now(),
                }
            }
        ];
        let result = users_coll
            .update_one(filter, pipeline)
            .await?;
        if result.matched_count == 0 {
            return Err(AppError::InsufficientCredits);
        }
        // Post-write read for the response view only — the mutation above was
        // already atomic; this read is not used to compute the debit.
        let fresh = users_coll
            .find_one(doc! { "_id": &user.id })
            .await?
            .ok_or_else(|| AppError::NotFound("user".into()))?;
        (fresh.credit_balance, fresh.bonus_balance, fresh.total_credits())
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

/// Shared burn — used by Secondary client and any product session meter.
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
    if !crate::auth::check_rate_limit(&auth.user_id, "credits-burn", 30, 60) {
        return Err(AppError::RateLimited("too many burn requests".into(), None));
    }
    let product = ProductId::from_request(&req);
    let amount = body.amount;
    // Minimum charge quantum: sub-quantum f64 burns would round back to an
    // unchanged balance while still appending ledger rows (free DB spam).
    if !amount.is_finite() || amount < 0.001 {
        return Err(AppError::BadRequest(
            "amount must be finite and >= 0.001 credits".into(),
        ));
    }
    if amount > 1_000_000.0 {
        return Err(AppError::BadRequest("amount too large".into()));
    }
    let reason = body
        .reason
        .as_deref()
        .or(body.product.as_deref())
        .map(|s| s.chars().take(256).collect::<String>());
    let session_id = body
        .session_id
        .as_deref()
        .map(|s| s.trim())
        .filter(|s| !s.is_empty())
        .map(|s| s.chars().take(128).collect::<String>());
    let ledger_coll = match product {
        ProductId::Secondary => db.ledger_secondary(),
        _ => db.ledger(),
    };
    let users_coll = match product {
        ProductId::Secondary => db.users_secondary(),
        _ => db.users(),
    };
    let balance_filter = doc! {
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
    let mut debit_stage = doc! {
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
    };

    if let Some(sid) = session_id.clone() {
        // Exactly-once burn keyed by session_id: the user document itself is
        // the idempotency anchor. The atomic update only matches when this
        // session was never burned AND the balance covers the amount; the same
        // write records the session marker, so a retry (or a crash between the
        // debit and the audit insert) can never double-debit.
        use mongodb::options::{FindOneAndUpdateOptions, ReturnDocument};
        let mut filter = balance_filter.clone();
        filter.insert("burn_sessions", doc! { "$ne": &sid });
        debit_stage.insert(
            "burn_sessions",
            doc! { "$slice": [
                { "$concatArrays": [ { "$ifNull": ["$burn_sessions", []] }, [sid.clone()] ] },
                -10_000
            ] },
        );
        let updated = users_coll
            .find_one_and_update(filter, vec![doc! { "$set": debit_stage }])
            .with_options(
                FindOneAndUpdateOptions::builder()
                    .return_document(ReturnDocument::After)
                    .build(),
            )
            .await?;
        let Some(fresh) = updated else {
            // Distinguish an idempotent replay from insufficient funds.
            let replayed = users_coll
                .count_documents(doc! { "_id": &auth.user_id, "burn_sessions": &sid })
                .await?
                > 0;
            if replayed {
                let fresh = users_coll
                    .find_one(doc! { "_id": &auth.user_id })
                    .await?
                    .ok_or_else(|| AppError::NotFound("user".into()))?;
                return Ok(HttpResponse::Ok().json(serde_json::json!({
                    "ok": true,
                    "already": true,
                    "credit_balance": fresh.credit_balance,
                    "bonus_balance": fresh.bonus_balance,
                    "total": fresh.total_credits(),
                    "product": fresh.product,
                })));
            }
            return Err(AppError::InsufficientCredits);
        };
        let entry = crate::models::CreditLedgerEntry {
            id: crate::db::new_id(),
            user_id: auth.user_id.clone(),
            delta: -amount,
            balance_after: fresh.total_credits(),
            kind: "burn".into(),
            ref_id: Some(sid),
            note: reason,
            created_at: bson::DateTime::from_chrono(chrono::Utc::now()),
        };
        // Audit-only: a duplicate ledger row must never fail the (already
        // committed, exactly-once) debit.
        if let Err(e) = ledger_coll.insert_one(&entry).await {
            if !e.to_string().contains("E11000") {
                tracing::warn!(error = %e, "burn ledger insert failed");
            }
        }
        return Ok(HttpResponse::Ok().json(serde_json::json!({
            "ok": true,
            "credit_balance": fresh.credit_balance,
            "bonus_balance": fresh.bonus_balance,
            "total": fresh.total_credits(),
            "product": fresh.product,
        })));
    }

    // No idempotency key supplied: plain atomic debit (legacy behavior).
    let result = users_coll
        .update_one(balance_filter, vec![doc! { "$set": debit_stage }])
        .await?;
    if result.matched_count == 0 {
        return Err(AppError::InsufficientCredits);
    }
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
        ref_id: None,
        note: reason,
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
