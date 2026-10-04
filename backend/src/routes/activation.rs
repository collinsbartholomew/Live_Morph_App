//! Unified activation / starter / upgrade / renew order routes for both products.
//!
//! These are thin product-aware wrappers over the shared order engine
//! (`services::orders`), so pricing, provider init and order persistence are
//! identical across LiveMorph and LiveEscape. Only `kind` differs.

use crate::auth::middleware::require_user;
use crate::config::Config;
use crate::db::Db;
use crate::error::{AppError, AppResult};
use crate::product::ProductId;
use crate::services::orders;
use crate::services::nowpayments;
use actix_web::{get, post, web, HttpRequest, HttpResponse};
use mongodb::bson::doc;
use serde::Deserialize;
use serde_json::json;
use std::sync::Arc;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(starter_pack_pay)
        .service(starter_pack_pay_flutterwave)
        .service(starter_pack_pay_crypto)
        .service(starter_pack_status)
        .service(starter_pack_confirm_crypto)
        .service(activation_pay)
        .service(activation_pay_flutterwave)
        .service(activation_pay_crypto)
        .service(activation_pay_nowpayments)
        .service(activation_confirm_crypto)
        .service(activation_nowpayments_status)
        .service(upgrade_pay)
        .service(upgrade_pay_flutterwave)
        .service(upgrade_pay_crypto)
        .service(credits_purchase)
        .service(credits_purchase_flutterwave)
        .service(credits_pay_crypto)
        .service(renew);
}

fn product(req: &HttpRequest) -> ProductId {
    ProductId::from_request(req)
}

#[derive(Deserialize)]
#[allow(dead_code)]
struct PayBody {
    #[serde(default)]
    plan_id: Option<String>,
    #[serde(default)]
    plan: Option<String>,
    #[serde(default)]
    target_plan: Option<String>,
    #[serde(default)]
    method: Option<String>,
    #[serde(default)]
    email: Option<String>,
}

fn resolved_plan(body: &PayBody, fallback: &str) -> String {
    body.target_plan
        .as_deref()
        .or(body.plan_id.as_deref())
        .or(body.plan.as_deref())
        .unwrap_or(fallback)
        .to_string()
}

async fn pay_kind(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    kind: &str,
    plan: &str,
    provider: &str,
) -> AppResult<HttpResponse> {
    let _ = product(&req);
    let auth = require_user(&req)?;
    let created = orders::create_plan_order(&db, &cfg, &req, &auth, kind, plan, provider).await?;
    Ok(HttpResponse::Ok().json(orders::created_order_json(&created)))
}

#[post("/starter-pack/pay")]
async fn starter_pack_pay(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<PayBody>) -> AppResult<HttpResponse> {
    let plan = resolved_plan(&body, "starter");
    pay_kind(db, cfg, req, "starter_pack", &plan, "paystack").await
}
#[post("/starter-pack/pay-flutterwave")]
async fn starter_pack_pay_flutterwave(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<PayBody>) -> AppResult<HttpResponse> {
    let plan = resolved_plan(&body, "starter");
    pay_kind(db, cfg, req, "starter_pack", &plan, "flutterwave").await
}
#[post("/starter-pack/pay-crypto")]
async fn starter_pack_pay_crypto(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<PayBody>) -> AppResult<HttpResponse> {
    let plan = resolved_plan(&body, "starter");
    pay_kind(db, cfg, req, "starter_pack", &plan, "nowpayments").await
}

#[get("/starter-pack/status")]
async fn starter_pack_status(db: web::Data<Db>, req: HttpRequest) -> AppResult<HttpResponse> {
    let auth = require_user(&req)?;
    let product = product(&req);
    let coll = match product {
        ProductId::LiveEscape => db.payment_orders_le(),
        ProductId::LiveMorph => db.db.collection::<mongodb::bson::Document>("payment_orders"),
    };
    let order = coll
        .find_one(doc! {
            "user_id": &auth.user_id,
            "kind": "starter_pack",
        })
        .await?;
    let (status, credits, plan, order_id) = match order {
        Some(o) => {
            let st = o.get_str("status").unwrap_or("pending").to_string();
            let cr = o.get_f64("credits").unwrap_or(0.0);
            let pl = o.get_str("plan").unwrap_or("starter").to_string();
            let oid = o.get_str("_id").unwrap_or("").to_string();
            (st, cr, pl, oid)
        }
        None => ("none".to_string(), 0.0, "starter".to_string(), String::new()),
    };
    let status = match status.as_str() {
        "provisioned" | "paid" => "approved",
        "pending" | "provisioning" => "pending",
        "failed" | "refunded" | "cancelled" => "rejected",
        _ => "none",
    };
    Ok(HttpResponse::Ok().json(json!({
        "status": status,
        "credits": credits,
        "plan": plan,
        "order_id": order_id,
        "product": product.as_str(),
    })))
}

#[post("/starter-pack/confirm-crypto")]
async fn starter_pack_confirm_crypto(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<CryptoConfirmBody>) -> AppResult<HttpResponse> {
    confirm_crypto_impl(db, cfg, req, body).await
}

#[post("/activation/pay")]
async fn activation_pay(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<PayBody>) -> AppResult<HttpResponse> {
    let plan = resolved_plan(&body, "creator");
    pay_kind(db, cfg, req, "activation", &plan, "paystack").await
}
#[post("/activation/pay-flutterwave")]
async fn activation_pay_flutterwave(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<PayBody>) -> AppResult<HttpResponse> {
    let plan = resolved_plan(&body, "creator");
    pay_kind(db, cfg, req, "activation", &plan, "flutterwave").await
}
#[post("/activation/pay-crypto")]
async fn activation_pay_crypto(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<PayBody>) -> AppResult<HttpResponse> {
    let plan = resolved_plan(&body, "creator");
    pay_kind(db, cfg, req, "activation", &plan, "nowpayments").await
}
#[post("/activation/pay-nowpayments")]
async fn activation_pay_nowpayments(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<PayBody>) -> AppResult<HttpResponse> {
    let plan = resolved_plan(&body, "creator");
    pay_kind(db, cfg, req, "activation", &plan, "nowpayments").await
}

#[derive(Deserialize)]
#[allow(dead_code)]
struct CryptoConfirmBody {
    #[serde(default)]
    payment_id: Option<String>,
    #[serde(default)]
    tx_id: Option<String>,
    #[serde(default)]
    order_id: Option<String>,
    /// Manual-review proof: either an image path the client stored locally, or
    /// a base64 data-URL the reference web client uploads.
    #[serde(default)]
    proof_path: Option<String>,
    #[serde(default)]
    proof_image: Option<String>,
}

#[post("/activation/confirm-crypto")]
async fn activation_confirm_crypto(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<CryptoConfirmBody>) -> AppResult<HttpResponse> {
    confirm_crypto_impl(db, cfg, req, body).await
}

/// Verify a crypto payment against NOWPayments and surface its state so the
/// client can finish provisioning (webhook is the primary path; this is a poll
/// fallback for the desktop client).
async fn confirm_crypto_impl(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Json<CryptoConfirmBody>,
) -> AppResult<HttpResponse> {
    let auth = require_user(&req)?;
    let product = product(&req);
    let payment_id = body
        .payment_id
        .as_deref()
        .or(body.tx_id.as_deref())
        .map(|s| s.trim())
        .filter(|s| !s.is_empty())
        .ok_or_else(|| AppError::BadRequest("payment_id required".into()))?;

    let coll = match product {
        ProductId::LiveEscape => db.payment_orders_le(),
        ProductId::LiveMorph => db.db.collection::<mongodb::bson::Document>("payment_orders"),
    };
    let order = coll
        .find_one(doc! {
            "user_id": &auth.user_id,
            "provider_ref": payment_id,
        })
        .await?;
    let Some(order) = order else {
        return Err(AppError::NotFound("order".into()));
    };
    let provider_ref = order.get_str("provider_ref").unwrap_or("").to_string();
    let inv = nowpayments::get_payment_status(&cfg, &provider_ref).await?;
    let status = inv.payment_status.clone();

    // Persist manual-review proof artifacts on the order (path or base64 image).
    let mut set = mongodb::bson::doc! { "crypto_status": &status };
    if let Some(path) = body.proof_path.as_deref().filter(|s| !s.trim().is_empty()) {
        set.insert("proof_path", path.trim());
    }
    if let Some(img) = body
        .proof_image
        .as_deref()
        .filter(|s| !s.trim().is_empty())
    {
        let img = img.trim();
        if img.len() <= 5_500_000 {
            set.insert("proof_image", img);
        }
    }
    if nowpayments::is_paid(&status) {
        coll.update_one(
            doc! { "_id": order.get_str("_id").unwrap_or("") },
            doc! { "$set": {
                "status": "paid",
                "crypto_status": &status,
            } },
        )
        .await?;
    } else if nowpayments::is_terminal_failure(&status) {
        coll.update_one(
            doc! { "_id": order.get_str("_id").unwrap_or("") },
            doc! { "$set": {
                "status": "failed",
                "crypto_status": &status,
            } },
        )
        .await?;
    } else {
        coll.update_one(doc! { "_id": order.get_str("_id").unwrap_or("") }, doc! { "$set": set })
            .await?;
    }

    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "payment_id": provider_ref,
        "status": status,
        "order_status": order.get_str("status").unwrap_or("pending"),
        "product": product.as_str(),
    })))
}

#[get("/activation/nowpayments-status/{payment_id}")]
async fn activation_nowpayments_status(
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    path: web::Path<String>,
) -> AppResult<HttpResponse> {
    require_user(&req)?;
    let payment_id = path.into_inner();
    let inv = nowpayments::get_payment_status(&cfg, &payment_id).await?;
    Ok(HttpResponse::Ok().json(json!({
        "payment_id": payment_id,
        "status": inv.payment_status,
        "pay_amount": inv.pay_amount,
        "pay_currency": inv.pay_currency,
    })))
}

#[post("/upgrade/pay")]
async fn upgrade_pay(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<PayBody>) -> AppResult<HttpResponse> {
    let plan = resolved_plan(&body, "creator");
    pay_kind(db, cfg, req, "upgrade", &plan, "paystack").await
}
#[post("/upgrade/pay-flutterwave")]
async fn upgrade_pay_flutterwave(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<PayBody>) -> AppResult<HttpResponse> {
    let plan = resolved_plan(&body, "creator");
    pay_kind(db, cfg, req, "upgrade", &plan, "flutterwave").await
}
#[post("/upgrade/pay-crypto")]
async fn upgrade_pay_crypto(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<PayBody>) -> AppResult<HttpResponse> {
    let plan = resolved_plan(&body, "creator");
    pay_kind(db, cfg, req, "upgrade", &plan, "nowpayments").await
}

#[post("/renew")]
async fn renew(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<PayBody>) -> AppResult<HttpResponse> {
    let plan = resolved_plan(&body, "starter");
    pay_kind(db, cfg, req, "renew", &plan, "paystack").await
}

#[post("/credits/purchase")]
async fn credits_purchase(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<PayBody>) -> AppResult<HttpResponse> {
    let plan = resolved_plan(&body, "starter");
    let method = body.method.clone().unwrap_or_else(|| "paystack".into());
    pay_kind(db, cfg, req, "credits", &plan, &method).await
}
#[post("/credits/purchase-flutterwave")]
async fn credits_purchase_flutterwave(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<PayBody>) -> AppResult<HttpResponse> {
    let plan = resolved_plan(&body, "starter");
    pay_kind(db, cfg, req, "credits", &plan, "flutterwave").await
}
#[post("/credits/pay-crypto")]
async fn credits_pay_crypto(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<PayBody>) -> AppResult<HttpResponse> {
    let plan = resolved_plan(&body, "starter");
    pay_kind(db, cfg, req, "credits", &plan, "nowpayments").await
}