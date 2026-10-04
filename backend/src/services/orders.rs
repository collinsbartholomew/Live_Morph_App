//! Unified plan-order engine.
//!
//! One implementation for every product × kind × provider:
//!   product   : livemorph | liveescape  (from headers)
//!   kind      : credits | plan | activation | starter_pack | upgrade | renew
//!   provider  : paystack | nowpayments | flutterwave
//!
//! Pricing comes from the single plan catalog (`services/plans`). Orders are
//! written with proper `bson::DateTime` timestamps so the shared webhook path
//! (`find_order_any_db`) can decode them for either product.

use crate::auth::AuthUser;
use crate::config::Config;
use crate::db::{new_id, Db};
use crate::error::{AppError, AppResult};
use crate::models::PaymentOrder;
use crate::product::ProductId;
use crate::services::paystack;
use crate::services::{nowpayments, plans};
use actix_web::HttpRequest;
use chrono::Utc;
use serde_json::json;
use std::sync::Arc;

#[derive(Debug, Clone)]
pub struct CreatedOrder {
    pub order: PaymentOrder,
    pub authorization_url: Option<String>,
    pub pay_address: Option<String>,
    pub pay_amount: Option<f64>,
    pub pay_currency: Option<String>,
    pub network: Option<String>,
    pub crypto_status: Option<String>,
    pub reference: Option<String>,
    pub dev_mode: bool,
}

/// Resolve (usd, credits) for a kind + plan id.
pub fn resolve_pricing(kind: &str, plan: &str) -> Option<(f64, f64)> {
    match kind {
        "starter_pack" => Some(plans::STARTER_PACK),
        "credits" | "plan" => plans::credit_plan(plan).map(|p| (p.dollars, p.credits)),
        "activation" | "renew" => {
            plans::activation_plan(plan).map(|p| (p.dollars, p.credits))
        }
        // Upgrades are priced from the user's current plan (resolved later).
        "upgrade" => plans::activation_plan(plan).map(|p| (p.dollars, p.credits)),
        _ => None,
    }
}

pub fn normalize_provider(p: &str) -> String {
    match p.to_ascii_lowercase().as_str() {
        "crypto" | "usdt" | "nowpayments" => "nowpayments".into(),
        "flutterwave" | "fw" => "flutterwave".into(),
        other => other.to_string(),
    }
}

fn orders_coll(db: &Db, product: ProductId) -> mongodb::Collection<PaymentOrder> {
    match product {
        ProductId::LiveEscape => db.payment_orders_le_typed(),
        ProductId::LiveMorph => db.db.collection::<PaymentOrder>("payment_orders"),
    }
}

/// Create a plan order. The `req` provides product identity via headers.
pub async fn create_plan_order(
    db: &Db,
    cfg: &Arc<Config>,
    req: &HttpRequest,
    auth: &AuthUser,
    kind: &str,
    plan: &str,
    provider: &str,
) -> AppResult<CreatedOrder> {
    let product = ProductId::from_request(req);
    let provider = normalize_provider(provider);

    let user = match product {
        ProductId::LiveEscape => db
            .users_le()
            .find_one(mongodb::bson::doc! { "_id": &auth.user_id })
            .await?
            .ok_or_else(|| AppError::NotFound("user".into()))?,
        ProductId::LiveMorph => db
            .users()
            .find_one(mongodb::bson::doc! { "_id": &auth.user_id })
            .await?
            .ok_or_else(|| AppError::NotFound("user".into()))?,
    };

    let (dollars, credits) = if kind == "upgrade" {
        // Discounted upgrade price from the user's current plan (reference).
        plans::upgrade_pricing(user.plan.as_deref().unwrap_or("starter"), plan).unwrap_or_else(|| {
            plans::activation_plan(plan)
                .map(|p| (p.dollars, p.credits))
                .unwrap_or((0.0, 0.0))
        })
    } else {
        resolve_pricing(kind, plan)
            .ok_or_else(|| AppError::BadRequest("unknown plan for this purchase type".into()))?
    };

    let order_id = new_id();
    let currency = if provider == "nowpayments" {
        "USD".into()
    } else {
        cfg.paystack_currency.clone()
    };
    let amount_subunit = if currency.eq_ignore_ascii_case("NGN") {
        (dollars * cfg.usd_ngn_rate * 100.0).round() as i64
    } else {
        (dollars * 100.0).round() as i64
    };

    let mut order = PaymentOrder {
        id: order_id.clone(),
        user_id: auth.user_id.clone(),
        product: product.as_str().into(),
        package_key: plan.to_string(),
        credits,
        amount_usd: dollars,
        amount_subunit,
        currency: currency.clone(),
        provider: provider.clone(),
        status: "pending".into(),
        provider_ref: Some(order_id.clone()),
        provider_access_code: None,
        authorization_url: None,
        pay_address: None,
        pay_amount: None,
        pay_currency: None,
        network: None,
        crypto_status: None,
        kind: Some(kind.to_string()),
        plan: Some(plan.to_string()),
        access_key: None,
        device_id: None,
        created_at: bson::DateTime::from_chrono(Utc::now()),
        paid_at: None,
        claimed_at: None,
        provisioned_at: None,
    };
    let mut dev_mode = false;

    match provider.as_str() {
        "paystack" => {
            if cfg.paystack_secret_key.is_none() {
                return Err(AppError::BadRequest(
                    "paystack payments are not configured on this host".into(),
                ));
            }
            let init_result = paystack::initialize_transaction(
                cfg,
                &paystack::InitRequest {
                    email: &user.email,
                    amount_subunit,
                    currency: &currency,
                    reference: &order_id,
                    order_id: &order_id,
                    package_key: kind,
                    platform: product.as_str(),
                },
            )
            .await;
            match init_result {
                Ok(init) => {
                    order.provider_ref = Some(init.reference.clone());
                    order.authorization_url = Some(init.authorization_url.clone());
                    order.provider_access_code = Some(init.access_code.clone());
                }
                Err(e) if !cfg.is_production() => {
                    // Dev fallback: write a pending order so the full flow is testable
                    // without a live merchant. Never reaches production.
                    tracing::warn!(error = %e, "paystack init failed — dev_mode order");
                    order.provider_ref = Some(order_id.clone());
                    dev_mode = true;
                }
                Err(e) => return Err(e),
            }
        }
        "nowpayments" => {
            if cfg
                .nowpayments_api_key
                .as_ref()
                .map(|s| s.is_empty())
                .unwrap_or(true)
            {
                return Err(AppError::BadRequest(
                    "crypto payments are not configured on this host".into(),
                ));
            }
            let pay_cur = cfg.nowpayments_default_pay_currency.clone();
            let invoice = nowpayments::create_invoice(
                cfg,
                dollars,
                &order_id,
                &format!(
                    "LiveEscape {} {} (${})",
                    kind,
                    plan,
                    (dollars * 100.0).round() as i64 / 100
                ),
                &pay_cur,
            )
            .await?;
            order.provider_ref = Some(invoice.payment_id.clone());
            order.pay_address = invoice.pay_address.clone();
            order.pay_amount = invoice.pay_amount;
            order.pay_currency = invoice.pay_currency.clone().or(Some(pay_cur));
            order.network = invoice.network.clone();
            order.crypto_status = Some(invoice.payment_status.clone());
            order.currency = "USD".into();
            order.amount_subunit = (dollars * 100.0).round() as i64;
        }
        "flutterwave" => {
            if cfg.flutterwave_secret_key.as_ref().map(|s| s.is_empty()).unwrap_or(true) {
                return Err(AppError::BadRequest(
                    "flutterwave payments are not configured on this host".into(),
                ));
            }
            let redirect_url = cfg
                .paystack_callback_url
                .clone()
                .filter(|s| !s.is_empty())
                .unwrap_or_else(|| {
                    format!("{}/api/v1/payments/callback/paystack", cfg.public_base_url.trim_end_matches('/'))
                });
            let init = crate::services::flutterwave::initialize_payment(
                cfg,
                &crate::services::flutterwave::InitRequest {
                    email: &user.email,
                    amount_subunit,
                    currency: &currency,
                    tx_ref: &order_id,
                    order_id: &order_id,
                    package_key: kind,
                    platform: product.as_str(),
                    redirect_url: &redirect_url,
                },
            )
            .await?;
            order.provider_ref = init.tx_ref.clone().or(Some(order_id.clone()));
            order.authorization_url = init.link.clone();
        }
        other => {
            return Err(AppError::BadRequest(format!(
                "unsupported provider: {other}"
            )))
        }
    }

    orders_coll(db, product).insert_one(&order).await?;

    let created = CreatedOrder {
        authorization_url: order.authorization_url.clone(),
        pay_address: order.pay_address.clone(),
        pay_amount: order.pay_amount,
        pay_currency: order.pay_currency.clone(),
        network: order.network.clone(),
        crypto_status: order.crypto_status.clone(),
        reference: order.provider_ref.clone(),
        dev_mode,
        order,
    };
    Ok(created)
}

pub fn created_order_json(c: &CreatedOrder) -> serde_json::Value {
    json!({
        "ok": true,
        "order_id": c.order.id,
        "kind": c.order.kind,
        "plan": c.order.plan,
        "credits": c.order.credits,
        "amount_usd": c.order.amount_usd,
        "amount_subunit": c.order.amount_subunit,
        "currency": c.order.currency,
        "provider": c.order.provider,
        "status": c.order.status,
        "product": c.order.product,
        "dev_mode": c.dev_mode,
        "authorization_url": c.authorization_url,
        "reference": c.reference,
        "pay_address": c.pay_address,
        "pay_amount": c.pay_amount,
        "pay_currency": c.pay_currency,
        "network": c.network,
        "crypto_status": c.crypto_status,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn pricing_resolves_kind_and_plan() {
        assert_eq!(resolve_pricing("starter_pack", "x"), Some((10.0, 500.0)));
        assert_eq!(resolve_pricing("activation", "creator"), Some((75.0, 500.0)));
        assert_eq!(resolve_pricing("credits", "elite"), Some((550.0, 50_000.0)));
        assert_eq!(resolve_pricing("unknown_kind", "starter"), None);
    }

    #[test]
    fn provider_normalization_maps_aliases() {
        assert_eq!(normalize_provider("paystack"), "paystack");
        assert_eq!(normalize_provider("crypto"), "nowpayments");
        assert_eq!(normalize_provider("usdt"), "nowpayments");
        assert_eq!(normalize_provider("flutterwave"), "flutterwave");
        assert_eq!(normalize_provider("fw"), "flutterwave");
    }
}