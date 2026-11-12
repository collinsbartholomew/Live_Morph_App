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

/// After Paystack confirms **paid**: fund Decart budget + credit user tokens.
pub async fn settle_and_provision(
    db: &Db,
    cfg: &Config,
    order: &mut PaymentOrder,
) -> AppResult<User> {
    let is_secondary = ProductId::parse(&order.product) == Some(ProductId::Secondary);
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
        // Self-heal: a provisioned activation order whose key mint failed at
        // settle time (crash between finalize and mint) still gets its key here.
        if ProductId::parse(&order.product) == Some(ProductId::Secondary)
            && order.kind.as_deref() == Some("activation")
        {
            if let Err(e) = ensure_activation_key(db, &users_coll, order, &user).await {
                tracing::warn!(error = %e, order = %order.id, "activation key self-heal failed");
            }
        }
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

    // Exactly-once credit mutex: the first attempt to flip `credit_applied`
    // owns the wallet/user $inc. A crashed attempt that flipped the flag but
    // died before the $inc under-credits (auditable via the missing ledger
    // row) — it can never double-credit. A reclaiming worker sees the flag
    // already set and skips the credit entirely.
    let owns_credit = orders_coll
        .find_one_and_update(
            doc! { "_id": &order.id, "status": "provisioning", "credit_applied": { "$ne": true } },
            doc! { "$set": { "credit_applied": true } },
        )
        .await?
        .is_some();

    let revenue = order_revenue_usd(cfg, order);
    let decart_budget = decart_budget_from_payment(cfg, revenue);
    let prepaid_seconds = if cfg.decart_usd_per_second > 0.0 {
        decart_budget / cfg.decart_usd_per_second
    } else {
        0.0
    };

    // 1) Fund platform Decart budget (what we can afford to burn on Decart API key)
    let coll = wallet_coll(db);
    let mut user = users_coll
        .find_one(doc! { "_id": &order.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;

    if owns_credit {
        get_or_create_wallet(db).await?;
        coll.update_one(
            doc! { "_id": WALLET_ID },
            doc! {
                "$inc": {
                    "decart_budget_usd": decart_budget,
                    "revenue_usd": revenue,
                },
                "$set": { "updated_at": Utc::now() }
            },
        )
        .await?;

        // 2) Credit user platform tokens (atomic $inc — safe under concurrent
        // readers). balance_after is read back from the post-update document
        // so it can never be a stale read-modify-write value.
        let updated = users_coll
            .find_one_and_update(
                doc! { "_id": &user.id },
                doc! {
                    "$inc": { "credit_balance": order.credits },
                    "$set": { "updated_at": Utc::now() },
                },
            )
            .with_options(
                mongodb::options::FindOneAndUpdateOptions::builder()
                    .return_document(mongodb::options::ReturnDocument::After)
                    .build(),
            )
            .await?;
        let balance_after = if let Some(u) = updated {
            user = u;
            user.total_credits()
        } else {
            user.total_credits() + order.credits
        };

        let entry = CreditLedgerEntry {
            id: new_id(),
            user_id: user.id.clone(),
            delta: order.credits,
            balance_after,
            kind: "purchase".into(),
            ref_id: Some(order.id.clone()),
            note: Some(format!(
                "paystack_settled pack={} revenue_usd={:.4} decart_budget_usd={:.4} prepaid_secs={:.1}",
                order.package_key, revenue, decart_budget, prepaid_seconds
            )),
            created_at: bson::DateTime::from_chrono(Utc::now()),
        };
        ledger_coll.insert_one(&entry).await?;

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
    }

    // 3) Mark order provisioned + store economics snapshot. The write is
    // guarded by the claim (status=provisioning AND our claimed_at): if a
    // concurrent worker reclaimed the stale claim and finalized first, this
    // matches 0 and we compensate the credit we just applied so the user is
    // never double-credited.
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
        // We lost the claim to a reclaiming worker — undo our credit AND the
        // wallet inc (otherwise platform revenue double-counts). Only the
        // worker that owns the credit mutex may reverse it.
        if !owns_credit {
            tracing::warn!(order = %order.id, "provision claim lost; no credit applied, nothing to revert");
            return users_coll
                .find_one(doc! { "_id": &order.user_id })
                .await?
                .ok_or_else(|| AppError::NotFound("user".into()));
        }
        // Revert wallet + user credit, CLAMPED at 0 so a spend between credit and
        // revert can never drive a balance negative. balance_after is read back
        // from the post-revert document, not the stale in-memory user.
        coll.update_one(
            doc! { "_id": WALLET_ID },
            doc! { "$set": {
                "decart_budget_usd": { "$max": [{ "$subtract": [{ "$ifNull": ["$decart_budget_usd", 0.0] }, decart_budget] }, 0.0] },
                "revenue_usd": { "$max": [{ "$subtract": [{ "$ifNull": ["$revenue_usd", 0.0] }, revenue] }, 0.0] },
            }},
        )
        .await?;
        let reverted_user = users_coll
            .find_one_and_update(
                doc! { "_id": &user.id },
                doc! { "$set": { "credit_balance": { "$max": [{ "$subtract": [{ "$ifNull": ["$credit_balance", 0.0] }, order.credits] }, 0.0] } } },
            )
            .with_options(
                mongodb::options::FindOneAndUpdateOptions::builder()
                    .return_document(mongodb::options::ReturnDocument::After)
                    .build(),
            )
            .await?;
        let balance_after = reverted_user
            .map(|u| u.total_credits())
            .unwrap_or(0.0);
        let undo = CreditLedgerEntry {
            id: new_id(),
            user_id: user.id.clone(),
            delta: -order.credits,
            balance_after,
            kind: "purchase_reverted_duplicate_claim".into(),
            ref_id: Some(order.id.clone()),
            note: Some("duplicate provision claim lost; credit reverted".into()),
            created_at: bson::DateTime::from_chrono(Utc::now()),
        };
        ledger_coll.insert_one(&undo).await?;
        tracing::warn!(order = %order.id, "provision claim lost; credit reverted");
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
        "payment settled: Paystack → Decart budget funded → user credited"
    );

    // Secondary activation payment: mint the user's annual license access key
    // now that the order is settled. Without this, a paying user gets credits but
    // never a key, so `licensed()` stays false and they are stuck at the AccessGate.
    if ProductId::parse(&order.product) == Some(ProductId::Secondary)
        && order.kind.as_deref() == Some("activation")
    {
        match ensure_activation_key(db, &users_coll, order, &user).await {
            Ok(Some(ak)) => {
                // Surface the minted key on the in-memory order so verify/status
                // responses can return it to the client immediately.
                order.access_key = Some(ak.key.clone());
                order.plan = Some(ak.plan.clone());
            }
            Ok(None) => {}
            Err(e) => {
                // Order is provisioned and credits applied — never fail the
                // settle over a key-mint blip; the provisioned early-return path
                // self-heals on the next poll.
                tracing::error!(error = %e, order = %order.id, "activation key mint failed after provisioning");
            }
        }
    }

    // Secondary upgrade: promote the user (and any bound license key) to the
    // target plan so feature tiers unlock immediately after payment settles.
    if ProductId::parse(&order.product) == Some(ProductId::Secondary) && order.kind.as_deref() == Some("upgrade") {
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
    }

    // Secondary starter pack: tag the account so the client can show the
    // starter-specific lock/upsell states (credits exhausted → activate).
    if ProductId::parse(&order.product) == Some(ProductId::Secondary) && order.kind.as_deref() == Some("starter_pack") {
        users_coll
            .update_one(
                doc! { "_id": &user.id },
                doc! {
                    "$set": { "starter_pack": true, "updated_at": Utc::now() }
                },
            )
            .await?;
    }

    // Secondary renewal: extend every active license key's expiry by a fresh
    // year. Without this, a paid renewal grants credits but never extends
    // expires_at — the user pays and stays locked out at the gate.
    if ProductId::parse(&order.product) == Some(ProductId::Secondary)
        && order.kind.as_deref() == Some("renew")
    {
        let new_expiry = bson::DateTime::from_chrono(Utc::now() + chrono::Duration::days(365));
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
    }

    // Reload balances for response
    users_coll
        .find_one(doc! { "_id": &user.id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))
}

/// Mint + bind the annual license key for a settled Secondary activation
/// order. Idempotent (no-op when the user already has an active key). Returns
/// the minted key so the caller can surface it on the in-memory order.
async fn ensure_activation_key(
    db: &Db,
    users_coll: &mongodb::Collection<User>,
    order: &PaymentOrder,
    user: &User,
) -> AppResult<Option<AccessKey>> {
    let has_key = db
        .access_keys_secondary()
        .find_one(doc! { "user_id": &user.id, "active": true })
        .await?;
    if has_key.is_some() {
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
    db.access_keys_secondary().insert_one(&ak).await?;
    // Bind the key + plan on the user so subsequent boots are licensed.
    users_coll
        .update_one(
            doc! { "_id": &user.id },
            doc! { "$set": {
                "access_key": &ak.key,
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
            doc! { "$set": { "access_key": &ak.key, "plan": &plan } },
        )
        .await?;
    info!(
        user = %user.id,
        order = %order.id,
        "activation order provisioned: access key minted"
    );
    Ok(Some(ak))
}

/// Debit platform Decart USD budget for `seconds` of generation.
pub async fn debit_decart_budget(db: &Db, cfg: &Config, seconds: f64) -> AppResult<()> {
    if seconds <= 0.0 {
        return Ok(());
    }
    let cost = seconds * cfg.decart_usd_per_second;
    if cost <= 0.0 {
        return Ok(());
    }
    let coll = wallet_coll(db);
    // Conditional debit FIRST: only create the wallet row on a miss (first
    // use), so the per-tick hot path is a single update rather than a
    // get_or_create (find + insert) plus the update.
    let mut res = coll
        .update_one(
            doc! { "_id": WALLET_ID, "decart_budget_usd": { "$gte": cost } },
            doc! {
                "$inc": { "decart_budget_usd": -cost },
                "$set": { "updated_at": Utc::now() }
            },
        )
        .await?;
    if res.matched_count == 0 {
        get_or_create_wallet(db).await?;
        res = coll
            .update_one(
                doc! { "_id": WALLET_ID, "decart_budget_usd": { "$gte": cost } },
                doc! {
                    "$inc": { "decart_budget_usd": -cost },
                    "$set": { "updated_at": Utc::now() }
                },
            )
            .await?;
        if res.matched_count == 0 {
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
