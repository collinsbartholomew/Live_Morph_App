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

pub async fn get_or_create_wallet(db: &Db) -> AppResult<PlatformWallet> {
    let coll = db.db.collection::<PlatformWallet>("platform_wallet");
    if let Some(w) = coll.find_one(doc! { "_id": WALLET_ID }).await? {
        return Ok(w);
    }
    let w = PlatformWallet {
        id: WALLET_ID.into(),
        decart_budget_usd: 0.0,
        revenue_usd: 0.0,
        updated_at: bson::DateTime::from_chrono(Utc::now()),
    };
    coll.insert_one(&w).await?;
    Ok(w)
}

/// USD amount charged to the user for this order (from subunit + currency).
pub fn order_revenue_usd(cfg: &Config, order: &PaymentOrder) -> f64 {
    if order.currency.eq_ignore_ascii_case("USD") {
        order.amount_subunit as f64 / 100.0
    } else if order.currency.eq_ignore_ascii_case("NGN") {
        if order.amount_usd > 0.0 {
            order.amount_usd
        } else {
            // amount_subunit is in kobo (1/100 NGN); convert via configured rate
            order.amount_subunit as f64 / (cfg.usd_ngn_rate * 100.0)
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
    let is_le = order.product == "liveescape";
    let orders_coll = if is_le {
        db.db_le.collection::<PaymentOrder>("payment_orders")
    } else {
        db.db.collection::<PaymentOrder>("payment_orders")
    };
    let users_coll = if is_le { db.users_le() } else { db.users() };
    let ledger_coll = if is_le { db.ledger_le() } else { db.ledger() };

    if order.status == "provisioned" {
        return users_coll
            .find_one(doc! { "_id": &order.user_id })
            .await?
            .ok_or_else(|| AppError::NotFound("user".into()));
    }
    if order.status != "paid" {
        return Err(AppError::BadRequest(format!(
            "order status is '{}', expected paid",
            order.status
        )));
    }

    // Claim order for provisioning (webhook + client verify race)
    let claim = orders_coll
        .update_one(
            doc! { "_id": &order.id, "status": "paid" },
            doc! { "$set": { "status": "provisioning" } },
        )
        .await?;
    if claim.matched_count == 0 {
        // Another worker already provisioned or is provisioning
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
        // Crash recovery: stuck "provisioning" older than 2 minutes → reclaim to paid
        if latest.status == "provisioning" {
            let stale = latest
                .paid_at
                .map(|t| {
                    let t_chrono = Some(t.to_chrono());
                    t_chrono
                        .map(|tc| (Utc::now() - tc).num_seconds() > 120)
                        .unwrap_or(true)
                })
                .unwrap_or(true);
            if stale {
                let reclaim = orders_coll
                    .update_one(
                        doc! { "_id": &order.id, "status": "provisioning" },
                        doc! { "$set": { "status": "paid" } },
                    )
                    .await?;
                if reclaim.matched_count == 1 {
                    order.status = "paid".into();
                    // fall through by recursive-ish retry once
                    return Box::pin(settle_and_provision(db, cfg, order)).await;
                }
            }
            return Err(AppError::Conflict("order provision in progress".into()));
        }
        return Err(AppError::Conflict("order provision in progress".into()));
    }

    let revenue = order_revenue_usd(cfg, order);
    let decart_budget = decart_budget_from_payment(cfg, revenue);
    let prepaid_seconds = if cfg.decart_usd_per_second > 0.0 {
        decart_budget / cfg.decart_usd_per_second
    } else {
        0.0
    };

    // 1) Fund platform Decart budget (what we can afford to burn on Decart API key)
    let coll = db.db.collection::<PlatformWallet>("platform_wallet");
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

    // 2) Credit user platform tokens (atomic $inc — safe under concurrent readers)
    let user = users_coll
        .find_one(doc! { "_id": &order.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;

    users_coll
        .update_one(
            doc! { "_id": &user.id },
            doc! {
                "$inc": { "credit_balance": order.credits },
                "$set": { "updated_at": Utc::now() },
            },
        )
        .await?;

    let balance_after = user.total_credits() + order.credits;
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

    // 3) Mark order provisioned + store economics snapshot
    order.status = "provisioned".into();
    order.provisioned_at = Some(bson::DateTime::from_chrono(Utc::now()));
    orders_coll
        .update_one(
            doc! { "_id": &order.id },
            doc! { "$set": {
                "status": "provisioned",
                "provisioned_at": order.provisioned_at,
                "revenue_usd": revenue,
                "decart_budget_usd": decart_budget,
                "prepaid_decart_seconds": prepaid_seconds,
            }},
        )
        .await?;

    info!(
        user = %user.id,
        order = %order.id,
        credits = order.credits,
        revenue_usd = revenue,
        decart_budget_usd = decart_budget,
        "payment settled: Paystack → Decart budget funded → user credited"
    );

    // LiveEscape activation payment: mint the user's annual license access key
    // now that the order is settled. Without this, a paying user gets credits but
    // never a key, so `licensed()` stays false and they are stuck at the AccessGate.
    if order.product == "liveescape"
        && order.kind.as_deref() == Some("activation")
    {
        let plan = order.package_key.clone();
        let has_key = db
            .access_keys()
            .find_one(doc! { "user_id": &user.id, "active": true })
            .await?;
        if has_key.is_none() {
            let mut ak = AccessKey::new(&plan, order.credits);
            ak.user_id = user.id.clone();
            db.access_keys().insert_one(&ak).await?;
            // Bind the key + plan on the user so subsequent boots are licensed.
            users_coll
                .update_one(
                    doc! { "_id": &user.id },
                    doc! { "$set": {
                        "access_key": &ak.key,
                        "plan": &plan,
                        "product": "liveescape",
                        "updated_at": Utc::now(),
                    }},
                )
                .await?;
            // Surface the key to the client through the order document.
            orders_coll
                .update_one(
                    doc! { "_id": &order.id },
                    doc! { "$set": {
                        "access_key": &ak.key,
                        "plan": &plan,
                    }},
                )
                .await?;
            info!(
                user = %user.id,
                order = %order.id,
                "activation order provisioned: access key minted"
            );
        }
    }

    // Reload balances for response
    users_coll
        .find_one(doc! { "_id": &user.id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))
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
    get_or_create_wallet(db).await?;
    let coll = db.db.collection::<PlatformWallet>("platform_wallet");
    let res = coll
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
    Ok(())
}
