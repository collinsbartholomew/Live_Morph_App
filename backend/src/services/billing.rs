//! Production billing chain (authoritative on the server only):
//!
//! 1. User pays **Paystack** in full → money settles in **your** merchant account.
//! 2. Backend verifies Paystack (amount + success status).
//! 3. Backend allocates a **Decart operating budget** from that payment
//!    (payment_usd × (1 − margin)). Decart itself is usage-billed against
//!    `DECART_API_KEY` (pay-as-you-go); this budget is the platform's internal
//!    prepaid allowance so sessions cannot overspend relative to collected revenue.
//! 4. Backend credits the **user ledger** with the pack's platform tokens.
//! 5. During morph, each generation second:
//!    - debits user tokens at `CREDITS_PER_SECOND`
//!    - debits platform Decart budget at `DECART_USD_PER_SECOND`
//!    - if either hits zero → force-close session
//!
//! Desktop never holds Paystack/Decart secrets and never settles money.

use crate::config::Config;
use crate::db::{new_id, Db};
use crate::error::{AppError, AppResult};
use crate::models::{AccessKey, CreditLedgerEntry, PaymentOrder, User};
use crate::product::ProductId;
use chrono::Utc;
use mongodb::bson::doc;
use serde::{Deserialize, Serialize};
use tracing::info;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PlatformWallet {
    #[serde(rename = "_id")]
    pub id: String,
    /// USD reserved for Decart usage (prepaid from user payments)
    pub decart_budget_usd: f64,
    /// Lifetime user payments settled (USD-equivalent)
    pub revenue_usd: f64,
    pub updated_at: bson::DateTime,
}

const WALLET_ID: &str = "platform";
// NOTE: the platform wallet is intentionally a SINGLE shared ledger in the
// primary DB, not per-product: there is exactly one Decart API key (one shared
// upstream account), so the Decart budget it tracks is a single global
// resource. Product revenue is still recorded per-product on the order rows.

/// Platform wallet collection (shared Decart budget ledger).
fn wallet_coll(db: &Db) -> mongodb::Collection<PlatformWallet> {
    db.db.collection::<PlatformWallet>("platform_wallet")
}

pub async fn get_or_create_wallet(db: &Db) -> AppResult<PlatformWallet> {
    let coll = wallet_coll(db);
    if let Some(w) = coll.find_one(doc! { "_id": WALLET_ID }).await? {
        return Ok(w);
    }
    let w = PlatformWallet {
        id: WALLET_ID.into(),
        decart_budget_usd: 0.0,
        revenue_usd: 0.0,
        updated_at: bson::DateTime::from_chrono(Utc::now()),
    };
    // Atomic upsert: two concurrent first-time settles must not race into a
    // duplicate-key 500 (which used to strand orders in "provisioning").
    let doc_w = mongodb::bson::to_document(&w)
        .map_err(|e| AppError::Internal(format!("wallet serialize: {e}")))?;
    let res = coll
        .update_one(
            doc! { "_id": WALLET_ID },
            doc! { "$setOnInsert": doc_w },
        )
        .upsert(true)
        .await?;
    if res.upserted_id.is_some() {
        return Ok(w);
    }
    // Lost the race: return the winner's row.
    coll.find_one(doc! { "_id": WALLET_ID })
        .await?
        .ok_or_else(|| AppError::Internal("platform wallet missing after upsert".into()))
}

/// USD amount actually collected for this order, derived from the charged
/// subunit + currency (never from the USD list price, which can drift from the
/// naira actually charged via FX).
pub fn order_revenue_usd(cfg: &Config, order: &PaymentOrder) -> f64 {
    if order.currency.eq_ignore_ascii_case("USD") {
        order.amount_subunit as f64 / 100.0
    } else if order.currency.eq_ignore_ascii_case("NGN") {
        // amount_subunit is kobo (1/100 NGN); convert via the configured rate.
        if cfg.usd_ngn_rate > 0.0 {
            order.amount_subunit as f64 / (cfg.usd_ngn_rate * 100.0)
        } else {
            order.amount_usd
        }
    } else {
        order.amount_usd
    }
}

/// How much USD of Decart budget this payment funds after platform margin.
pub fn decart_budget_from_payment(cfg: &Config, revenue_usd: f64) -> f64 {
    let margin = cfg.platform_margin_ratio.clamp(0.0, 0.9);
    (revenue_usd * (1.0 - margin)).max(0.0)
}

/// Reverse wallet economics for a refunded order exactly once. Safe to retry
/// from both the refund handler and the periodic sweeper after a DB failure.
pub async fn reverse_wallet_for_refund(
    db: &Db,
    cfg: &Config,
    order: &PaymentOrder,
) -> AppResult<()> {
    let revenue = order_revenue_usd(cfg, order);
    let budget = decart_budget_from_payment(cfg, revenue);
    let wallet = db.db.collection::<mongodb::bson::Document>("platform_wallet");
    wallet
        .update_one(
            doc! { "_id": WALLET_ID, "refunded_orders": { "$ne": &order.id } },
            vec![doc! { "$set": {
                "decart_budget_usd": { "$max": [{ "$subtract": [{ "$ifNull": ["$decart_budget_usd", 0.0] }, budget] }, 0.0] },
                "revenue_usd": { "$max": [{ "$subtract": [{ "$ifNull": ["$revenue_usd", 0.0] }, revenue] }, 0.0] },
                "refunded_orders": { "$slice": [
                    { "$concatArrays": [{ "$ifNull": ["$refunded_orders", []] }, [order.id.clone()]] },
                    -10_000
                ] },
                "updated_at": Utc::now(),
            } }],
        )
        .await?;
    Ok(())
}

/// (funded_seconds, sold_seconds) for a pack: how much Decart compute the
/// payment funds vs how much compute the sold credits entitle. A pack with
/// sold_seconds > funded_seconds sells compute the platform cannot pay for.
pub fn funding_analysis(cfg: &Config, revenue_usd: f64, credits: f64) -> (f64, f64) {
    let funded = if cfg.decart_usd_per_second > 0.0 {
        decart_budget_from_payment(cfg, revenue_usd) / cfg.decart_usd_per_second
    } else {
        0.0
    };
    let sold = if cfg.credits_per_second > 0.0 {
        credits / cfg.credits_per_second
    } else {
        0.0
    };
    (funded, sold)
}

/// Startup invariant report: every catalog entry whose sold compute exceeds
/// its funded compute (a structural loss / broken-promise pack).
pub fn underfunded_packs(cfg: &Config) -> Vec<(String, f64, f64)> {
    let mut out = Vec::new();
    let mut check = |name: String, usd: f64, credits: f64| {
        let (funded, sold) = funding_analysis(cfg, usd, credits);
        if sold > funded + 1e-9 {
            out.push((name, funded, sold));
        }
    };
    for p in crate::models::TokenPackage::catalog() {
        check(format!("token-pack:{}", p.key), p.price_usd, p.credits);
    }
    for p in crate::services::plans::ACTIVATION_PLANS {
        check(format!("activation:{}", p.id), p.dollars, p.credits);
    }
    for p in crate::services::plans::CREDIT_PLANS {
        check(format!("credit-plan:{}", p.id), p.dollars, p.credits);
    }
    let (sp_usd, sp_credits) = crate::services::plans::STARTER_PACK;
    check("starter-pack".into(), sp_usd, sp_credits);
    out
}

pub async fn settle_and_provision(
    db: &Db,
    cfg: &Config,
    order: &mut PaymentOrder,
) -> AppResult<User> {
    let storage = ProductId::parse(&order.product).unwrap_or(ProductId::LiveMorph);
    settle_and_provision_in(db, cfg, order, storage).await
}

/// `storage` is the AUTHORITATIVE product store the order was loaded from
/// (find_order_any_db knows the collection; a legacy order's missing `product`
/// field defaults to livemorph and must not re-route settlement).
pub async fn settle_and_provision_in(
    db: &Db,
    cfg: &Config,
    order: &mut PaymentOrder,
    storage: ProductId,
) -> AppResult<User> {
    let is_secondary = storage == ProductId::Secondary;
    let orders_coll = if is_secondary {
        db.db_secondary.collection::<PaymentOrder>("payment_orders")
    } else {
        db.db.collection::<PaymentOrder>("payment_orders")
    };
    let users_coll = if is_secondary { db.users_secondary() } else { db.users() };
    let ledger_coll = if is_secondary { db.ledger_secondary() } else { db.ledger() };

    if order.status == "provisioned" {
        let user = users_coll
            .find_one(doc! { "_id": &order.user_id })
            .await?
            .ok_or_else(|| AppError::NotFound("user".into()))?;
        // Self-heal EVERY entitlement kind, not just activation: a crash after
        // finalize but before the entitlement writes must be repairable by any
        // later poll/verify instead of stranding a paid purchase.
        if is_secondary {
            match apply_secondary_entitlements(db, &users_coll, order, &user).await {
                Ok(Some(ak)) => {
                    order.access_key_plain = Some(ak.key.clone());
                    order.plan = Some(ak.plan.clone());
                }
                Ok(None) => {}
                Err(e) => {
                    tracing::warn!(error = %e, order = %order.id, "entitlement self-heal failed");
                }
            }
        }
        crate::routes::referral::grant_referral_reward_after_purchase(
            db, cfg, storage, &order.user_id,
        )
        .await;
        return Ok(user);
    }
    if order.status != "paid" {
        return Err(AppError::BadRequest(format!(
            "order status is '{}', expected paid",
            order.status
        )));
    }

    // Claim order for provisioning (webhook + client verify race).
    // Stamp claimed_at: crash-recovery staleness is measured from THIS claim
    // moment, not from paid_at (payment time) — otherwise a long-since-paid
    // crypto order looks "stale" instantly and two settlers can double-provision.
    let mut claim_attempts = 0u32;
    let now_claim = loop {
        claim_attempts += 1;
        let now_claim = Utc::now();
        let claim = orders_coll
            .update_one(
                doc! { "_id": &order.id, "status": "paid" },
                doc! { "$set": { "status": "provisioning", "claimed_at": bson::DateTime::from_chrono(now_claim) } },
            )
            .await?;
        if claim.matched_count == 1 {
            break now_claim;
        }
        // Another worker already provisioned or is provisioning.
        tokio::time::sleep(std::time::Duration::from_millis(200)).await;
        let latest = orders_coll
            .find_one(doc! { "_id": &order.id })
            .await?
            .ok_or_else(|| AppError::NotFound("order".into()))?;
        if latest.status == "provisioned" {
            return users_coll
                .find_one(doc! { "_id": &order.user_id })
                .await?
                .ok_or_else(|| AppError::NotFound("user".into()));
        }
        // Crash recovery: a claim stuck "provisioning" older than 2 minutes
        // (measured from claimed_at, never from paid_at) → reclaim to paid and
        // retry the claim ourselves. Legacy pre-fix docs have no claimed_at —
        // base staleness on created_at (non-optional in the model) so they
        // self-heal instead of 409ing forever.
        if latest.status == "provisioning" {
            let stale = match latest.claimed_at {
                Some(t) => (Utc::now() - t.to_chrono()).num_seconds() > 120,
                None => (Utc::now() - latest.created_at.to_chrono()).num_seconds() > 120,
            };
            if stale {
                let reclaim = orders_coll
                    .update_one(
                        doc! { "_id": &order.id, "status": "provisioning", "claimed_at": latest.claimed_at },
                        doc! { "$set": { "status": "paid" } },
                    )
                    .await?;
                if reclaim.matched_count == 1 {
                    order.status = "paid".into();
                    continue; // we reset it to paid — retry the claim from the top
                }
            }
        }
        // Someone else holds the claim (or reset it to paid) — retry a bounded
        // number of times before giving up.
        if claim_attempts >= 3 {
            return Err(AppError::Conflict("order provision in progress".into()));
        }
    };

    let revenue = order_revenue_usd(cfg, order);
    let decart_budget = decart_budget_from_payment(cfg, revenue);
    let prepaid_seconds = if cfg.decart_usd_per_second > 0.0 {
        decart_budget / cfg.decart_usd_per_second
    } else {
        0.0
    };

    let coll = wallet_coll(db);
    let mut user = users_coll
        .find_one(doc! { "_id": &order.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;

    // A discounted upgrade is only valid against the source plan captured at
    // creation. If another upgrade has already changed the user's plan, this
    // order is stale and must be refunded rather than discounted a second time.
    if is_secondary && order.kind.as_deref() == Some("upgrade") {
        let current = user.plan.as_deref().unwrap_or("starter");
        if !upgrade_source_is_valid(order.source_plan.as_deref(), current) {
            let source = order.source_plan.as_deref().unwrap_or("unknown");
            orders_coll
                .update_one(
                    doc! { "_id": &order.id },
                    doc! { "$set": {
                        "status": "refund_required",
                        "refund_reason": format!("upgrade source plan changed: expected {source}, current {current}"),
                    }},
                )
                .await?;
            return Err(AppError::Conflict(
                "your plan changed after this upgrade order was created — the order is flagged for refund".into(),
            ));
        }
    }

    // Starter pack single-claim is enforced AT SETTLEMENT, before any money or
    // credit moves: order-creation checks alone are raceable (many pending
    // orders created concurrently). A duplicate paid order is flagged for
    // refund instead of silently double-crediting.
    if is_secondary && order.kind.as_deref() == Some("starter_pack") {
        let claimed = users_coll
            .update_one(
                doc! { "_id": &user.id, "starter_pack": { "$ne": true } },
                doc! { "$set": { "starter_pack": true, "updated_at": Utc::now() } },
            )
            .await?;
        if claimed.matched_count == 0 {
            orders_coll
                .update_one(
                    doc! { "_id": &order.id },
                    doc! { "$set": {
                        "status": "refund_required",
                        "refund_reason": "starter pack already claimed on this account",
                    }},
                )
                .await?;
            return Err(AppError::Conflict(
                "starter pack already claimed — this order is flagged for refund".into(),
            ));
        }
    }

    // 1) Fund the platform wallet EXACTLY ONCE per order. The funded_orders
    // marker on the wallet document makes the increment idempotent across
    // crashes, stale-claim reclaims, and concurrent workers — no worker ever
    // reverses another worker's funding.
    get_or_create_wallet(db).await?;
    coll.update_one(
        doc! { "_id": WALLET_ID, "funded_orders": { "$ne": &order.id } },
        doc! {
            "$inc": {
                "decart_budget_usd": decart_budget,
                "revenue_usd": revenue,
            },
            // Bound the idempotency journal: 10k UUIDs is ~0.4 MB, far below
            // Mongo's 16 MB document limit even alongside other fields.
            "$push": { "funded_orders": { "$each": [&order.id], "$slice": -10_000 } },
            "$set": { "updated_at": Utc::now() }
        },
    )
    .await?;

    // 2) Credit the user EXACTLY ONCE per order via the provisioned_orders
    // marker on the user document (same idempotency-anchor pattern as key
    // redemption and session burns). A crashed attempt is resumed by any later
    // worker; the credit can never be duplicated or reversed by a racing
    // finalizer.
    let credited = users_coll
        .find_one_and_update(
            doc! { "_id": &user.id, "provisioned_orders": { "$ne": &order.id } },
            doc! {
                "$inc": { "credit_balance": order.credits },
                "$push": { "provisioned_orders": { "$each": [&order.id], "$slice": -10_000 } },
                "$set": { "updated_at": Utc::now() },
            },
        )
        .with_options(
            mongodb::options::FindOneAndUpdateOptions::builder()
                .return_document(mongodb::options::ReturnDocument::After)
                .build(),
        )
        .await?;
    if let Some(u) = credited {
        let balance_after = u.total_credits();
        user = u;
        let entry = CreditLedgerEntry {
            id: new_id(),
            user_id: user.id.clone(),
            delta: order.credits,
            balance_after,
            kind: "purchase".into(),
            ref_id: Some(order.id.clone()),
            note: Some(format!(
                "settled pack={} revenue_usd={:.4} decart_budget_usd={:.4} prepaid_secs={:.1}",
                order.package_key, revenue, decart_budget, prepaid_seconds
            )),
            created_at: bson::DateTime::from_chrono(Utc::now()),
        };
        if let Err(e) = ledger_coll.insert_one(&entry).await {
            if !e.to_string().contains("E11000") {
                tracing::warn!(error = %e, order = %order.id, "purchase ledger insert failed");
            }
        }
    }

    // Pack purchases also carry the plan tier: desktop clients gate HD and
    // the settings tier UI on user.tier (free | basic | starter | mid |
    // pro), so a paid pack must be reflected on the user row. Only ever
    // upgrade (never downgrade a higher tier); kind=None marks a plain
    // credit pack — activation/plan orders carry kind and set plan via
    // their own flow.
    if order.kind.is_none() {
        let rank = |t: &str| match t {
            "basic" => 1,
            "starter" => 2,
            "mid" => 3,
            "pro" => 4,
            _ => 0,
        };
        let new_rank = rank(&order.package_key);
        if new_rank > rank(&user.tier) {
            users_coll
                .update_one(
                    doc! { "_id": &user.id },
                    doc! { "$set": {
                        "tier": &order.package_key,
                        "plan": &order.package_key,
                        "updated_at": Utc::now(),
                    }},
                )
                .await?;
        }
    }
    // Observability flag for the audit reconciler (no longer a mutex).
    orders_coll
        .update_one(
            doc! { "_id": &order.id },
            doc! { "$set": { "credit_applied": true } },
        )
        .await?;

    // 3) Mark order provisioned + store economics snapshot, guarded by our
    // claim. If a reclaiming worker finalized first, that is fine: every step
    // above is exactly-once, so there is NOTHING to compensate — the old
    // reversal path could zero out the only legitimate credit.
    order.status = "provisioned".into();
    order.provisioned_at = Some(bson::DateTime::from_chrono(Utc::now()));
    let finalize = orders_coll
        .update_one(
            doc! {
                "_id": &order.id,
                "status": "provisioning",
                "claimed_at": bson::DateTime::from_chrono(now_claim),
            },
            doc! { "$set": {
                "status": "provisioned",
                "provisioned_at": order.provisioned_at,
                "revenue_usd": revenue,
                "decart_budget_usd": decart_budget,
                "prepaid_decart_seconds": prepaid_seconds,
            }},
        )
        .await?;
    if finalize.matched_count == 0 {
        tracing::warn!(order = %order.id, "provision claim lost to a reclaiming worker; credit is exactly-once, no reversal needed");
        return users_coll
            .find_one(doc! { "_id": &order.user_id })
            .await?
            .ok_or_else(|| AppError::NotFound("user".into()));
    }

    info!(
        user = %user.id,
        order = %order.id,
        credits = order.credits,
        revenue_usd = revenue,
        decart_budget_usd = decart_budget,
        "payment settled: budget funded → user credited"
    );

    // Secondary entitlements (activation key mint, plan upgrades, renewals).
    // Failures never fail the settle: the provisioned early-return above
    // re-runs this exact function on every later poll.
    if is_secondary {
        match apply_secondary_entitlements(db, &users_coll, order, &user).await {
            Ok(Some(ak)) => {
                // Surface the minted key on the in-memory order so verify/status
                // responses can return it to the client exactly once. The field
                // is serde-skipped, so it is never persisted (hash-at-rest).
                order.access_key_plain = Some(ak.key.clone());
                order.plan = Some(ak.plan.clone());
            }
            Ok(None) => {}
            Err(e) => {
                tracing::error!(error = %e, order = %order.id, "entitlement application failed after provisioning");
            }
        }
    }

    // Referral rewards are granted on the first SETTLED purchase only
    // (anti-Sybil), idempotent via the unique referral ledger key.
    crate::routes::referral::grant_referral_reward_after_purchase(
        db, cfg, storage, &order.user_id,
    )
    .await;

    // Reload balances for response
    users_coll
        .find_one(doc! { "_id": &user.id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))
}

/// Apply (or re-apply) every Secondary entitlement for a provisioned order.
/// Idempotent: safe to call on every settle and every provisioned poll.
async fn apply_secondary_entitlements(
    db: &Db,
    users_coll: &mongodb::Collection<User>,
    order: &mut PaymentOrder,
    user: &User,
) -> AppResult<Option<AccessKey>> {
    match order.kind.as_deref() {
        Some("activation") => ensure_activation_key(db, users_coll, order, user).await,
        Some("upgrade") => {
            if let Some(ref target) = order.plan {
                users_coll
                    .update_one(
                        doc! { "_id": &user.id },
                        doc! { "$set": { "plan": target, "updated_at": Utc::now() } },
                    )
                    .await?;
                db.access_keys_secondary()
                    .update_many(
                        doc! { "user_id": &user.id, "active": true },
                        doc! { "$set": { "plan": target } },
                    )
                    .await?;
                info!(
                    user = %user.id,
                    order = %order.id,
                    plan = %target,
                    "upgrade order provisioned: plan promoted"
                );
            }
            Ok(None)
        }
        Some("starter_pack") => {
            users_coll
                .update_one(
                    doc! { "_id": &user.id },
                    doc! {
                        "$set": { "starter_pack": true, "updated_at": Utc::now() }
                    },
                )
                .await?;
            Ok(None)
        }
        Some("renew") => {
            // Anchor the term to the ORIGINAL paid transition, not the current
            // poll time. Self-healing runs on every provisioned poll; using
            // `now + 365 days` here would extend the license every poll and
            // turn a one-year renewal into a perpetual subscription.
            let new_expiry = renewal_expiry(order.paid_at, order.provisioned_at);
            let key_res = db
                .access_keys_secondary()
                .update_many(
                    doc! { "user_id": &user.id, "active": true },
                    doc! { "$set": { "expires_at": new_expiry } },
                )
                .await?;
            info!(
                user = %user.id,
                order = %order.id,
                keys_extended = key_res.modified_count,
                "renew order provisioned: license expiry extended 365 days"
            );
            Ok(None)
        }
        _ => Ok(None),
    }
}

async fn ensure_activation_key(
    db: &Db,
    users_coll: &mongodb::Collection<User>,
    order: &PaymentOrder,
    user: &User,
) -> AppResult<Option<AccessKey>> {
    let now = bson::DateTime::from_chrono(Utc::now());
    // Only an UNEXPIRED active key satisfies an activation purchase. An
    // expired-but-active key must not swallow a new activation/renewal.
    let existing = db
        .access_keys_secondary()
        .find_one(doc! {
            "user_id": &user.id,
            "active": true,
            "$or": [
                { "expires_at": { "$gt": now } },
                { "expires_at": { "$exists": false } },
                { "expires_at": bson::Bson::Null },
            ],
        })
        .await?;
    if let Some(key) = existing {
        if key.plan != order.package_key {
            // Paid plan change on an existing license: promote the key (and
            // extend the annual term) instead of leaving the old plan in place.
            let new_expiry = bson::DateTime::from_chrono(Utc::now() + chrono::Duration::days(365));
            db.access_keys_secondary()
                .update_one(
                    doc! { "_id": &key.id },
                    doc! { "$set": { "plan": &order.package_key, "expires_at": new_expiry } },
                )
                .await?;
            users_coll
                .update_one(
                    doc! { "_id": &user.id },
                    doc! { "$set": { "plan": &order.package_key, "updated_at": Utc::now() } },
                )
                .await?;
            info!(user = %user.id, order = %order.id, plan = %order.package_key, "activation: existing license plan updated");
        }
        return Ok(None);
    }
    let plan = order.package_key.clone();
    let mut ak = AccessKey::new(&plan, order.credits);
    ak.user_id = user.id.clone();
    // Credits were already delivered via the `$inc` at settle time. The key
    // must NOT carry a pending `credits_granted`, otherwise the next
    // `/keys/validate` from the client would re-grant the same activation
    // credits a second time.
    ak.credits_granted = 0.0;
    if let Err(e) = db.access_keys_secondary().insert_one(&ak).await {
        if e.to_string().contains("E11000") {
            // Lost a concurrent mint race (unique active-key-per-user index):
            // the other worker's key is the user's license.
            return Ok(None);
        }
        return Err(e.into());
    }
    // Bind the key + plan on the user so subsequent boots are licensed.
    users_coll
        .update_one(
            doc! { "_id": &user.id },
            doc! { "$set": {
                "access_key_hash": crate::routes::auth::hash_token(&ak.key),
                "plan": &plan,
                "product": ProductId::Secondary.as_str(),
                "updated_at": Utc::now(),
            }},
        )
        .await?;
    // Surface the key to the client through the order document.
    db.db_secondary
        .collection::<PaymentOrder>("payment_orders")
        .update_one(
            doc! { "_id": &order.id },
            doc! { "$set": { "access_key_hash": crate::routes::auth::hash_token(&ak.key), "plan": &plan } },
        )
        .await?;
    info!(
        user = %user.id,
        order = %order.id,
        "activation order provisioned: access key minted"
    );
    Ok(Some(ak))
}

pub async fn debit_decart_budget(
    db: &Db,
    cfg: &Config,
    seconds: f64,
    charge_id: &str,
) -> AppResult<()> {
    if seconds <= 0.0 {
        return Ok(());
    }
    let cost = seconds * cfg.decart_usd_per_second;
    if cost <= 0.0 {
        return Ok(());
    }
    let coll = wallet_coll(db);
    // Exactly-once budget burn: charge_id is recorded in the same conditional
    // update as the balance decrement. A duplicate retry returns success
    // without burning again; genuine exhaustion still fails closed.
    let filter = doc! {
        "_id": WALLET_ID,
        "billed_charges": { "$ne": charge_id },
        "decart_budget_usd": { "$gte": cost },
    };
    let update = doc! {
        "$inc": { "decart_budget_usd": -cost },
        "$push": { "billed_charges": { "$each": [charge_id], "$slice": -10_000 } },
        "$set": { "updated_at": Utc::now() }
    };
    let mut res = coll.update_one(filter.clone(), update.clone()).await?;
    if res.matched_count == 0 {
        get_or_create_wallet(db).await?;
        // A duplicate charge is a successful no-op, not budget exhaustion.
        if coll
            .count_documents(doc! { "_id": WALLET_ID, "billed_charges": charge_id })
            .await?
            > 0
        {
            return Ok(());
        }
        res = coll.update_one(filter, update).await?;
        if res.matched_count == 0
            && coll
                .count_documents(doc! { "_id": WALLET_ID, "billed_charges": charge_id })
                .await?
                == 0
        {
            return Err(AppError::PaymentRequired(
                "platform Decart budget exhausted — top up Decart account / wait for new purchases"
                    .into(),
            ));
        }
    }
    Ok(())
}

/// Crash-recovery reconciler: find `provisioned` orders that set
/// `credit_applied=true` but are missing their `purchase` ledger row (an
/// audit gap from a crash between the credit and the ledger insert). This is
/// AUDIT-ONLY: in the settle path the ledger row is inserted BEFORE the order
/// is finalized to `provisioned`, so a `provisioned` row implies the credit
/// already landed — the reconciler must NEVER re-`$inc` the user (that would
/// double-credit). It only writes the missing audit ledger row. Genuinely
/// uncredited orders stuck in `provisioning` are healed by the 120 s reclaim.
pub async fn reconcile_orphaned_provisions(db: &Db, _cfg: &Config) -> AppResult<usize> {
    use futures_util::TryStreamExt;
    let mut fixed = 0usize;
    for secondary in [false, true] {
        let orders_coll = if secondary {
            db.db_secondary.collection::<PaymentOrder>("payment_orders")
        } else {
            db.db.collection::<PaymentOrder>("payment_orders")
        };
        let ledger_coll = if secondary { db.ledger_secondary() } else { db.ledger() };
        let mut cursor = orders_coll
            .find(doc! { "status": "provisioned", "credit_applied": true })
            .await?;
        while let Some(order) = cursor.try_next().await? {
            if ledger_coll
                .find_one(doc! { "ref_id": &order.id, "kind": "purchase" })
                .await?
                .is_some()
            {
                continue;
            }
            // Write the missing audit row only — never re-credit.
            let entry = CreditLedgerEntry {
                id: new_id(),
                user_id: order.user_id.clone(),
                delta: order.credits,
                balance_after: 0.0,
                kind: "purchase".into(),
                ref_id: Some(order.id.clone()),
                note: Some("reconciled audit row after crash (credit already applied)".into()),
                created_at: bson::DateTime::from_chrono(Utc::now()),
            };
            match ledger_coll.insert_one(&entry).await {
                Ok(_) => {
                    tracing::warn!(order = %order.id, "reconciled missing purchase ledger row (audit only)");
                    fixed += 1;
                }
                Err(e) if e.to_string().contains("11000") || e.to_string().contains("duplicate key") => {}
                Err(e) => return Err(e.into()),
            }
        }
    }
    Ok(fixed)
}

/// One-year renewal expiry anchored to the paid transition. Repeated calls
/// with the same order timestamps always return the same instant.
fn renewal_expiry(
    paid_at: Option<bson::DateTime>,
    provisioned_at: Option<bson::DateTime>,
) -> bson::DateTime {
    let base = paid_at
        .or(provisioned_at)
        .map(|t| t.to_chrono())
        .unwrap_or_else(Utc::now);
    bson::DateTime::from_chrono(base + chrono::Duration::days(365))
}

fn upgrade_source_is_valid(source: Option<&str>, current: &str) -> bool {
    // Legacy orders predate source_plan and remain governed by their stored
    // price; new orders must still be on the source plan they discounted from.
    source
        .map(|expected| expected.eq_ignore_ascii_case(current))
        .unwrap_or(true)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn upgrade_source_must_match_current_plan() {
        assert!(upgrade_source_is_valid(Some("starter"), "starter"));
        assert!(upgrade_source_is_valid(Some("Starter"), "STARTER"));
        assert!(!upgrade_source_is_valid(Some("starter"), "creator"));
        assert!(upgrade_source_is_valid(None, "creator"));
    }

    #[test]
    fn renewal_expiry_is_stable_across_self_healing_polls() {
        let paid = chrono::DateTime::parse_from_rfc3339("2026-01-15T12:00:00Z")
            .unwrap()
            .with_timezone(&Utc);
        let paid_bson = bson::DateTime::from_chrono(paid);
        let expected = paid + chrono::Duration::days(365);
        assert_eq!(
            renewal_expiry(Some(paid_bson), None).to_chrono().timestamp(),
            expected.timestamp()
        );
        assert_eq!(
            renewal_expiry(Some(paid_bson), Some(bson::DateTime::from_chrono(Utc::now())))
                .to_chrono()
                .timestamp(),
            expected.timestamp(),
            "provisioned_at and later poll times must not extend the term"
        );
    }
}
