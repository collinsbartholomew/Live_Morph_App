//! Payment + token packs.
//!
//! User buys a pack → Paystack charges their card → money lands in YOUR Paystack
//! account → we verify → provision platform credits on the user ledger.
//! Decart usage later debits those credits until zero (session forced off).

use crate::auth::middleware::require_user;
use crate::config::Config;
use crate::db::{new_id, Db};
use crate::error::{AppError, AppResult};
use crate::models::{PaymentOrder, TokenPackage};
use crate::product::ProductId;
use crate::services::nowpayments;
use crate::services::paystack::{initialize_transaction, verify_transaction};
use crate::services::tokens::provision_order;
use actix_web::{get, post, web, HttpRequest, HttpResponse};
use chrono::Utc;
use mongodb::bson::doc;
use serde::Deserialize;
use serde_json::json;
use std::sync::Arc;
use uuid::Uuid;

/// Authenticated payment APIs (JWT required).
pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(list_packages)
        .service(create_order)
        .service(verify_order)
        .service(order_status)
        .service(refund_order);
}

/// Provider webhooks — must be public (no JWT). Signature-checked where configured.
/// Dual paths: LiveMorph `/api/v1/payments/...` and Live Escape legacy `/webhooks/...`, `/pay/callback`.
pub fn configure_webhooks(cfg: &mut web::ServiceConfig) {
    cfg.service(webhook_paystack)
        .service(webhook_nowpayments)
        .service(paystack_browser_callback);
}

#[post("/payments/webhook/paystack")]
async fn webhook_paystack(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Bytes,
) -> AppResult<HttpResponse> {
    webhook_paystack_impl(db, cfg, req, body).await
}

#[post("/payments/webhook/nowpayments")]
async fn webhook_nowpayments(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Bytes,
) -> AppResult<HttpResponse> {
    webhook_nowpayments_impl(db, cfg, req, body).await
}

#[get("/payments/callback/paystack")]
async fn paystack_browser_callback(
    query: web::Query<std::collections::HashMap<String, String>>,
) -> HttpResponse {
    paystack_browser_callback_impl(query).await
}

/// Root-level aliases for Live Escape clients (same handlers, same Paystack merchant).
pub fn configure_webhook_aliases(cfg: &mut web::ServiceConfig) {
    cfg.service(webhook_paystack_root)
        .service(webhook_nowpayments_root)
        .service(paystack_callback_root);
}

#[get("/payments/packages")]
async fn list_packages(
    cfg: web::Data<std::sync::Arc<crate::config::Config>>,
    req: HttpRequest,
) -> HttpResponse {
    let product = ProductId::from_request(&req);
    let mut providers = vec!["paystack"];
    if cfg
        .nowpayments_api_key
        .as_ref()
        .map(|s| !s.is_empty())
        .unwrap_or(false)
    {
        providers.push("nowpayments");
    }
    if cfg.allow_manual_payments {
        providers.push("manual");
    }
    // Live Escape UI also expects plan-style packs; same Paystack rail.
    let packages = TokenPackage::catalog();
    HttpResponse::Ok().json(serde_json::json!({
        "packages": packages,
        "providers": providers,
        "currency": cfg.paystack_currency,
        "product": product.as_str(),
    }))
}

#[derive(Deserialize)]
struct CreateOrderBody {
    package_key: String,
    /// paystack | manual | nowpayments | crypto (crypto aliases to nowpayments)
    #[serde(default = "default_provider")]
    provider: String,
    /// Optional override; else taken from X-Frontend-Id
    #[serde(default)]
    product: Option<String>,
    /// Force currency; default from config (NGN for Paystack, USD for crypto)
    currency: Option<String>,
    /// Crypto pay currency override (e.g. usdttrc20, usdterc20)
    pay_currency: Option<String>,
}

fn default_provider() -> String {
    "paystack".into()
}

fn normalize_provider(p: &str) -> String {
    match p.to_ascii_lowercase().as_str() {
        "crypto" | "usdt" | "nowpayments" => "nowpayments".into(),
        other => other.to_string(),
    }
}

#[post("/payments/orders")]
async fn create_order(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Json<CreateOrderBody>,
) -> AppResult<HttpResponse> {
    let auth = require_user(&req)?;
    let pack = TokenPackage::by_key(&body.package_key)
        .ok_or_else(|| AppError::BadRequest("unknown package".into()))?;

    let provider = normalize_provider(&body.provider);
    if provider == "nowpayments"
        && cfg
            .nowpayments_api_key
            .as_ref()
            .map(|s| s.is_empty())
            .unwrap_or(true)
    {
        return Err(AppError::BadRequest(
            "crypto payments are not configured on this host".into(),
        ));
    }

    let currency = body.currency.clone().unwrap_or_else(|| {
        if provider == "nowpayments" {
            "USD".into()
        } else {
            cfg.paystack_currency.clone()
        }
    });

    let amount_subunit = if currency.eq_ignore_ascii_case("NGN") {
        pack.price_ngn_kobo
    } else {
        (pack.price_usd * 100.0).round() as i64
    };

    let order_id = new_id();
    let reference = format!("lm_{}", Uuid::new_v4().simple());

    let product = body
        .product
        .as_deref()
        .and_then(ProductId::parse)
        .unwrap_or_else(|| ProductId::from_request(&req));

    let mut order = PaymentOrder {
        id: order_id.clone(),
        user_id: auth.user_id.clone(),
        product: product.as_str().into(),
        package_key: pack.key.clone(),
        credits: pack.credits,
        amount_usd: pack.price_usd,
        amount_subunit,
        currency: currency.clone(),
        provider: provider.clone(),
        status: "pending".into(),
        provider_ref: Some(reference.clone()),
        provider_access_code: None,
        authorization_url: None,
        pay_address: None,
        pay_amount: None,
        pay_currency: None,
        network: None,
        crypto_status: None,
        kind: None,
        plan: None,
        access_key: None,
        created_at: bson::DateTime::from_chrono(Utc::now()),
        paid_at: None,
        provisioned_at: None,
    };

    if provider == "manual" && !cfg.allow_manual_payments {
        return Err(AppError::Forbidden(
            "manual payments disabled (development only)".into(),
        ));
    }

    if provider == "paystack" {
        let user = db
            .users()
            .find_one(doc! { "_id": &auth.user_id })
            .await?
            .ok_or_else(|| AppError::NotFound("user".into()))?;

        let init = initialize_transaction(
            &cfg,
            &crate::services::paystack::InitRequest {
                email: &user.email,
                amount_subunit,
                currency: &currency,
                reference: &reference,
                order_id: &order_id,
                package_key: &pack.key,
                platform: product.as_str(),
            },
        )
        .await?;

        order.authorization_url = Some(init.authorization_url.clone());
        order.provider_access_code = Some(init.access_code.clone());
        order.provider_ref = Some(init.reference.clone());
    } else if provider == "nowpayments" {
        let pay_cur = body
            .pay_currency
            .clone()
            .unwrap_or_else(|| cfg.nowpayments_default_pay_currency.clone());
        let invoice = nowpayments::create_invoice(
            &cfg,
            pack.price_usd,
            &order_id,
            &format!("LiveMorph {} pack", pack.name),
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
        order.amount_subunit = (pack.price_usd * 100.0).round() as i64;
    }

    db.db
        .collection::<PaymentOrder>("payment_orders")
        .insert_one(&order)
        .await?;

    Ok(HttpResponse::Created().json(json!({
        "order_id": order.id,
        "package_key": order.package_key,
        "credits": order.credits,
        "amount_usd": order.amount_usd,
        "amount_subunit": order.amount_subunit,
        "currency": order.currency,
        "provider": order.provider,
        "status": order.status,
        "authorization_url": order.authorization_url,
        "reference": order.provider_ref,
        "pay_address": order.pay_address,
        "pay_amount": order.pay_amount,
        "pay_currency": order.pay_currency,
        "network": order.network,
        "crypto_status": order.crypto_status,
    })))
}

#[derive(Deserialize)]
struct VerifyBody {
    order_id: String,
    /// Optional — if omitted we use order.provider_ref
    reference: Option<String>,
}

#[post("/payments/orders/verify")]
async fn verify_order(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Json<VerifyBody>,
) -> AppResult<HttpResponse> {
    let auth = require_user(&req)?;
    let coll = db.db.collection::<PaymentOrder>("payment_orders");

    let mut order = coll
        .find_one(doc! { "_id": &body.order_id, "user_id": &auth.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("order".into()))?;

    if order.status == "provisioned" {
        let user = db
            .users()
            .find_one(doc! { "_id": &auth.user_id })
            .await?
            .ok_or_else(|| AppError::NotFound("user".into()))?;
        return Ok(HttpResponse::Ok().json(json!({
            "order_id": order.id,
            "status": order.status,
            "credits": order.credits,
            "balance": user.public_view(),
        })));
    }

    match order.provider.as_str() {
        "paystack" => {
            let reference = body
                .reference
                .clone()
                .or(order.provider_ref.clone())
                .ok_or_else(|| AppError::BadRequest("missing reference".into()))?;
            let data = verify_transaction(&cfg, &reference).await?;
            tracing::debug!(reference = %data.reference, "paystack verify succeeded");
            if data.amount != order.amount_subunit {
                return Err(AppError::BadRequest("amount mismatch".into()));
            }
            if !data.currency.eq_ignore_ascii_case(&order.currency) {
                return Err(AppError::BadRequest("currency mismatch".into()));
            }
            order.status = "paid".into();
            order.paid_at = Some(bson::DateTime::from_chrono(Utc::now()));
            coll.update_one(
                doc! { "_id": &order.id },
                doc! { "$set": { "status": "paid", "paid_at": order.paid_at } },
            )
            .await?;
        }
        "nowpayments" | "crypto" => {
            let payment_id = body
                .reference
                .clone()
                .or(order.provider_ref.clone())
                .ok_or_else(|| AppError::BadRequest("missing crypto payment_id".into()))?;
            let inv = nowpayments::get_payment_status(&cfg, &payment_id).await?;
            order.crypto_status = Some(inv.payment_status.clone());
            if nowpayments::is_terminal_failure(&inv.payment_status) {
                order.status = "failed".into();
                coll.update_one(
                    doc! { "_id": &order.id },
                    doc! { "$set": {
                        "status": "failed",
                        "crypto_status": &inv.payment_status,
                    }},
                )
                .await?;
                return Err(AppError::BadRequest(format!(
                    "crypto payment {}",
                    inv.payment_status
                )));
            }
            if !nowpayments::is_paid(&inv.payment_status) {
                let in_flight = nowpayments::is_in_flight(&inv.payment_status);
                coll.update_one(
                    doc! { "_id": &order.id },
                    doc! { "$set": { "crypto_status": &inv.payment_status } },
                )
                .await?;
                return Ok(HttpResponse::Ok().json(json!({
                    "order_id": order.id,
                    "status": order.status,
                    "crypto_status": inv.payment_status,
                    "pay_address": order.pay_address,
                    "pay_amount": order.pay_amount,
                    "pay_currency": order.pay_currency,
                    "in_flight": in_flight,
                })));
            }
            order.status = "paid".into();
            order.paid_at = Some(bson::DateTime::from_chrono(Utc::now()));
            coll.update_one(
                doc! { "_id": &order.id },
                doc! { "$set": {
                    "status": "paid",
                    "paid_at": order.paid_at,
                    "crypto_status": &inv.payment_status,
                }},
            )
            .await?;
        }
        "manual" => {
            if !cfg.allow_manual_payments {
                return Err(AppError::Forbidden("manual payments disabled".into()));
            }
            order.status = "paid".into();
            order.paid_at = Some(bson::DateTime::from_chrono(Utc::now()));
            coll.update_one(
                doc! { "_id": &order.id },
                doc! { "$set": { "status": "paid", "paid_at": order.paid_at } },
            )
            .await?;
        }
        other => {
            return Err(AppError::BadRequest(format!(
                "unsupported provider: {other}"
            )))
        }
    }

    let user = provision_order(&db, &cfg, &mut order).await?;

    Ok(HttpResponse::Ok().json(json!({
        "order_id": order.id,
        "status": order.status,
        "credits": order.credits,
        "balance": user.public_view(),
    })))
}

#[get("/payments/orders/{id}")]
async fn order_status(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    path: web::Path<String>,
) -> AppResult<HttpResponse> {
    let auth = require_user(&req)?;
    let coll = db.db.collection::<PaymentOrder>("payment_orders");
    let mut order = coll
        .find_one(doc! { "_id": path.as_str(), "user_id": &auth.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("order".into()))?;

    // Live-refresh crypto status while pending
    if order.status == "pending" && (order.provider == "nowpayments" || order.provider == "crypto")
    {
        if let Some(ref pid) = order.provider_ref {
            if let Ok(inv) = nowpayments::get_payment_status(&cfg, pid).await {
                order.crypto_status = Some(inv.payment_status.clone());
                if nowpayments::is_paid(&inv.payment_status) {
                    order.status = "paid".into();
                    order.paid_at = Some(bson::DateTime::from_chrono(Utc::now()));
                    let _ = coll
                        .update_one(
                            doc! { "_id": &order.id },
                            doc! { "$set": {
                                "status": "paid",
                                "paid_at": order.paid_at,
                                "crypto_status": &inv.payment_status,
                            }},
                        )
                        .await;
                    // Auto-provision when poll sees finished
                    if let Ok(user) = provision_order(&db, &cfg, &mut order).await {
                        return Ok(HttpResponse::Ok().json(json!({
                            "order_id": order.id,
                            "status": order.status,
                            "credits": order.credits,
                            "crypto_status": order.crypto_status,
                            "pay_address": order.pay_address,
                            "pay_amount": order.pay_amount,
                            "pay_currency": order.pay_currency,
                            "network": order.network,
                            "balance": user.public_view(),
                            "provisioned": true,
                        })));
                    }
                } else {
                    let _ = coll
                        .update_one(
                            doc! { "_id": &order.id },
                            doc! { "$set": { "crypto_status": &inv.payment_status } },
                        )
                        .await;
                }
            }
        }
    }

    Ok(HttpResponse::Ok().json(json!({
        "order_id": order.id,
        "status": order.status,
        "provider": order.provider,
        "credits": order.credits,
        "crypto_status": order.crypto_status,
        "pay_address": order.pay_address,
        "pay_amount": order.pay_amount,
        "pay_currency": order.pay_currency,
        "network": order.network,
        "authorization_url": order.authorization_url,
        "reference": order.provider_ref,
    })))
}

/// Browser return URL after Paystack Hosted Checkout (user browser only — not a webhook).
/// Query: ?reference=... or ?trxref=...
async fn paystack_browser_callback_impl(
    query: web::Query<std::collections::HashMap<String, String>>,
) -> HttpResponse {
    let reference = query
        .get("reference")
        .or_else(|| query.get("trxref"))
        .cloned()
        .unwrap_or_default();
    let deep = if reference.is_empty() {
        "livemorph://payments/return".to_string()
    } else {
        format!("livemorph://payments/return?reference={}", {
            let mut out = String::new();
            for b in reference.bytes() {
                match b {
                    b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                        out.push(b as char)
                    }
                    _ => out.push_str(&format!("%{b:02X}")),
                }
            }
            out
        })
    };
    let ref_esc = reference
        .replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;");
    let deep_esc = deep.replace('&', "&amp;").replace('"', "&quot;");
    let deep_js = format!("{deep:?}");
    let ref_block = if reference.is_empty() {
        String::new()
    } else {
        format!("<p>Reference: <code>{ref_esc}</code></p>")
    };
    let html = format!(
        r#"<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>LiveMorph — Payment</title>
<style>
body{{margin:0;font-family:system-ui,-apple-system,sans-serif;background:#0b0b0f;color:#eee;
display:flex;min-height:100vh;align-items:center;justify-content:center}}
.card{{max-width:420px;padding:28px;border-radius:14px;border:1px solid #333;background:#14141a}}
h1{{font-size:1.25rem;margin:0 0 8px}}
p{{color:#aaa;line-height:1.5;font-size:.95rem}}
a{{color:#8b5cf6}}
code{{font-size:.8rem;word-break:break-all;color:#ccc}}
</style></head><body><div class="card">
<h1>Payment complete</h1>
<p>You can return to <strong>LiveMorph</strong>. Credits appear after the app confirms the payment (usually a few seconds).</p>
<p><a href="{deep_esc}">Open LiveMorph</a></p>
{ref_block}
<script>try{{location.href={deep_js};}}catch(e){{}}</script>
</div></body></html>"#
    );
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .insert_header(("Cache-Control", "no-store"))
        .body(html)
}

/// Paystack webhook. Signature required when secret is configured.
/// Product-aware: searches the LiveMorph and Live Escape order collections so
/// both products provision credits from the same Paystack merchant account.
async fn webhook_paystack_impl(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Bytes,
) -> AppResult<HttpResponse> {
    // Verify HMAC SHA512 of raw body using secret (Paystack standard)
    let secret = cfg
        .paystack_webhook_secret
        .as_ref()
        .or(cfg.paystack_secret_key.as_ref());
    if let Some(secret) = secret {
        let sig = req
            .headers()
            .get("x-paystack-signature")
            .and_then(|v| v.to_str().ok())
            .unwrap_or("");
        if !crate::services::paystack::verify_webhook_signature(secret, &body, sig) {
            return Err(AppError::Forbidden("invalid paystack signature".into()));
        }
    } else {
        // Fail closed: unsigned webhooks never accepted (even in development)
        return Err(AppError::Internal("webhook secret not configured".into()));
    }

    let body: serde_json::Value = serde_json::from_slice(&body)
        .map_err(|e| AppError::BadRequest(format!("invalid json: {e}")))?;

    let event = body.get("event").and_then(|v| v.as_str()).unwrap_or("");
    if event != "charge.success" {
        return Ok(HttpResponse::Ok().json(json!({ "ok": true, "ignored": true })));
    }
    let data = body.get("data").cloned().unwrap_or(json!({}));
    let reference = data
        .get("reference")
        .and_then(|v| v.as_str())
        .ok_or_else(|| AppError::BadRequest("no reference".into()))?;

    // Re-verify with Paystack for safety
    let _ = verify_transaction(&cfg, reference).await?;

    let Some((mut order, is_le)) =
        find_order_any_db(&db, doc! { "provider_ref": reference }).await?
    else {
        return Err(AppError::NotFound("order".into()));
    };

    if order.status == "provisioned" {
        return Ok(HttpResponse::Ok().json(json!({ "ok": true, "already": true })));
    }

    // CAS: only transition from pending/paid → paid, prevents duplicate provisioning
    let claim_filter = doc! { "_id": &order.id, "status": { "$in": ["pending", "paid"] } };
    let claim_set = doc! {
        "$set": {
            "status": "paid",
            "paid_at": bson::DateTime::from_chrono(Utc::now()),
        },
    };
    let claimed = if is_le {
        db.payment_orders_le()
            .update_one(claim_filter, claim_set)
            .await?
    } else {
        db.db
            .collection::<PaymentOrder>("payment_orders")
            .update_one(claim_filter, claim_set)
            .await?
    };
    if claimed.matched_count == 0 {
        return Ok(HttpResponse::Ok().json(json!({ "ok": true, "already": true })));
    }

    // Sync the in-memory order to the claimed state so the provisioning step
    // (which requires status == "paid") succeeds on the first webhook delivery.
    order.status = "paid".into();
    order.paid_at = Some(bson::DateTime::from_chrono(Utc::now()));

    let _user = provision_order(&db, &cfg, &mut order).await?;
    Ok(HttpResponse::Ok().json(json!({ "ok": true, "provisioned": true })))
}

/// Locate an order by reference/id across both product collections.
/// Returns `(order, is_le)` where `is_le` selects the Live Escape database.
async fn find_order_any_db(
    db: &Db,
    filter: mongodb::bson::Document,
) -> AppResult<Option<(PaymentOrder, bool)>> {
    let lm = db.db.collection::<PaymentOrder>("payment_orders");
    if let Some(o) = lm.find_one(filter.clone()).await? {
        return Ok(Some((o, false)));
    }
    if let Some(doc) = db.payment_orders_le().find_one(filter).await? {
        let o: PaymentOrder = mongodb::bson::from_bson(mongodb::bson::Bson::Document(doc))
            .map_err(|e| AppError::Internal(format!("LE order decode: {e}")))?;
        return Ok(Some((o, true)));
    }
    Ok(None)
}

/// Reverse a provisioned order (support / chargeback). Dev or future admin role.
#[derive(Deserialize)]
struct RefundBody {
    order_id: String,
    reason: Option<String>,
}

#[post("/payments/orders/refund")]
async fn refund_order(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Json<RefundBody>,
) -> AppResult<HttpResponse> {
    // Self-serve refund is ops-only; never available without explicit flag
    if !cfg.allow_credits_adjust {
        return Err(AppError::Forbidden(
            "refunds disabled without ALLOW_CREDITS_ADJUST".into(),
        ));
    }
    let auth = require_user(&req)?;
    let coll = db.db.collection::<PaymentOrder>("payment_orders");
    let mut order = coll
        .find_one(doc! { "_id": &body.order_id, "user_id": &auth.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("order".into()))?;
    if order.status != "provisioned" {
        return Err(AppError::BadRequest(
            "only provisioned orders can be refunded".into(),
        ));
    }
    let user = db
        .users()
        .find_one(doc! { "_id": &auth.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;
    let take = order.credits.min(user.total_credits());
    // Atomic refund: use $inc with a guard that balance >= take
    let refund_result = db
        .users()
        .update_one(
            doc! {
                "_id": &user.id,
                "$expr": { "$gte": [{ "$add": ["$credit_balance", "$bonus_balance"] }, take] }
            },
            doc! {
                "$inc": {
                    "bonus_balance": -(take.min(user.bonus_balance.max(0.0))),
                    "credit_balance": -(take - take.min(user.bonus_balance.max(0.0))),
                },
                "$set": { "updated_at": Utc::now() }
            },
        )
        .await?;
    if refund_result.matched_count == 0 {
        return Err(AppError::BadRequest(
            "insufficient balance for refund".into(),
        ));
    }
    // Re-fetch to get actual post-refund balance (pre-update read may be stale)
    let fresh_user = db
        .users()
        .find_one(doc! { "_id": &user.id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;
    let balance_after = fresh_user.total_credits();
    let entry = crate::models::CreditLedgerEntry {
        id: new_id(),
        user_id: user.id.clone(),
        delta: -take,
        balance_after,
        kind: "refund".into(),
        ref_id: Some(order.id.clone()),
        note: body.reason.clone(),
        created_at: bson::DateTime::from_chrono(Utc::now()),
    };
    db.ledger().insert_one(&entry).await?;
    order.status = "refunded".into();
    coll.update_one(
        doc! { "_id": &order.id },
        doc! { "$set": { "status": "refunded" } },
    )
    .await?;
    Ok(HttpResponse::Ok().json(json!({
        "order_id": order.id,
        "status": "refunded",
        "revoked_credits": take,
        "balance": fresh_user.public_view(),
    })))
}

/// NOWPayments IPN callback. Marks order paid and provisions credits.
async fn webhook_nowpayments_impl(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Bytes,
) -> AppResult<HttpResponse> {
    // IPN HMAC (x-nowpayments-sig) when secret configured; required in production
    if let Some(secret) = cfg
        .nowpayments_ipn_secret
        .as_ref()
        .filter(|s| !s.is_empty())
    {
        let sig = req
            .headers()
            .get("x-nowpayments-sig")
            .and_then(|v| v.to_str().ok())
            .unwrap_or("");
        if !crate::services::nowpayments::verify_ipn_signature(secret, &body, sig) {
            return Err(AppError::Forbidden("invalid nowpayments signature".into()));
        }
    } else {
        return Err(AppError::Forbidden(
            "NOWPayments IPN secret not configured".into(),
        ));
    }

    let body: serde_json::Value = serde_json::from_slice(&body)
        .map_err(|e| AppError::BadRequest(format!("invalid json: {e}")))?;

    let payment_id = body
        .get("payment_id")
        .map(|v| match v {
            serde_json::Value::String(s) => s.clone(),
            serde_json::Value::Number(n) => n.to_string(),
            _ => String::new(),
        })
        .unwrap_or_default();
    let payment_status = body
        .get("payment_status")
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_string();
    let order_id = body
        .get("order_id")
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_string();

    if payment_id.is_empty() && order_id.is_empty() {
        return Err(AppError::BadRequest("missing payment_id/order_id".into()));
    }

    if !nowpayments::is_paid(&payment_status) {
        return Ok(HttpResponse::Ok().json(json!({
            "ok": true,
            "ignored": true,
            "status": payment_status,
        })));
    }

    let filter = if !order_id.is_empty() {
        doc! { "_id": &order_id }
    } else {
        doc! { "provider_ref": &payment_id }
    };
    let Some((mut order, is_le)) = find_order_any_db(&db, filter).await? else {
        return Err(AppError::NotFound("order".into()));
    };

    if order.status == "provisioned" {
        return Ok(HttpResponse::Ok().json(json!({ "ok": true, "already": true })));
    }

    // CAS: only transition from pending/paid → paid
    let claim_filter = doc! {
        "_id": &order.id,
        "status": { "$in": ["pending", "paid"] },
    };
    let claim_set = doc! {
        "$set": {
            "status": "paid",
            "paid_at": bson::DateTime::from_chrono(Utc::now()),
            "crypto_status": &payment_status,
        },
    };
    let claimed = if is_le {
        db.payment_orders_le()
            .update_one(claim_filter, claim_set)
            .await?
    } else {
        db.db
            .collection::<PaymentOrder>("payment_orders")
            .update_one(claim_filter, claim_set)
            .await?
    };
    if claimed.matched_count == 0 {
        return Ok(HttpResponse::Ok().json(json!({ "ok": true, "already": true })));
    }

    order.status = "paid".into();
    order.paid_at = Some(bson::DateTime::from_chrono(Utc::now()));

    let user = provision_order(&db, &cfg, &mut order).await?;
    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "order_id": order.id,
        "status": order.status,
        "user_id": user.id,
    })))
}

#[post("/webhooks/paystack")]
async fn webhook_paystack_root(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Bytes,
) -> AppResult<HttpResponse> {
    webhook_paystack_impl(db, cfg, req, body).await
}

#[post("/webhooks/nowpayments")]
async fn webhook_nowpayments_root(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Bytes,
) -> AppResult<HttpResponse> {
    webhook_nowpayments_impl(db, cfg, req, body).await
}

#[get("/pay/callback")]
async fn paystack_callback_root(
    query: web::Query<std::collections::HashMap<String, String>>,
) -> HttpResponse {
    paystack_browser_callback_impl(query).await
}
