//! Unified activation / starter / upgrade routes for Live Escape
//! Product-aware via header; writes to Live Escape collections.

use crate::auth::middleware::require_user;
use crate::config::Config;
use crate::db::{new_id, Db};
use crate::error::{AppError, AppResult};
use crate::product::ProductId;
use crate::services::paystack::initialize_transaction;
use actix_web::{get, post, web, HttpRequest, HttpResponse};
use chrono::Utc;
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
        .service(activation_dev_activate)
        .service(upgrade_pay)
        .service(upgrade_pay_flutterwave)
        .service(upgrade_pay_crypto)
        .service(renew)
        .service(activate_legacy)
        .service(support_tickets);
}

fn product(req: &HttpRequest) -> ProductId {
    ProductId::from_request(req)
}

fn plan_credits(plan_id: &str) -> (f64, f64) {
    match plan_id {
        "test" => (0.5, 50.0),
        "starter" => (20.0, 1000.0),
        "pro" | "creator" => (60.0, 5000.0),
        "premium" => (150.0, 10000.0),
        "elite" => (550.0, 50000.0),
        _ => (20.0, 1000.0),
    }
}

#[derive(Deserialize)]
struct PayBody {
    plan_id: Option<String>,
    email: Option<String>,
}

async fn pay_kind(
    db: &Db,
    cfg: &Config,
    req: &HttpRequest,
    kind: &str,
    plan: &str,
) -> AppResult<HttpResponse> {
    let product_id = product(req);
    if product_id != ProductId::LiveEscape {
        return Err(AppError::BadRequest("activation payments only for liveescape".into()));
    }
    let auth = require_user(req)?;
    let (dollars, credits) = plan_credits(plan);
    let order_id = new_id();
    let user = db.users_le().find_one(doc! { "_id": &auth.user_id }).await?.ok_or_else(|| AppError::NotFound("user".into()))?;
    let email = req.query_string(); // placeholder
    let email_addr = auth.user_id.clone(); // simplified

    if cfg.paystack_secret_key.is_some() {
        let amount_kobo = if cfg.paystack_currency.eq_ignore_ascii_case("NGN") {
            (dollars * cfg.usd_ngn_rate * 100.0).round() as i64
        } else {
            (dollars * 100.0).round() as i64
        };
        let init = initialize_transaction(
            cfg,
            &crate::services::paystack::InitRequest {
                email: &user.email,
                amount_subunit: amount_kobo,
                currency: &cfg.paystack_currency,
                reference: &order_id,
                order_id: &order_id,
                package_key: kind,
                platform: "liveescape",
            },
        ).await?;
        db.payment_orders_le().insert_one(doc! {
            "_id": &order_id,
            "user_id": &auth.user_id,
            "plan": plan,
            "credits": credits,
            "amount_usd": dollars,
            "status": "pending",
            "provider": "paystack",
            "product": "liveescape",
            "kind": kind,
            "created_at": Utc::now().to_rfc3339(),
            "provider_ref": &init.reference,
            "authorization_url": &init.authorization_url,
        }).await?;
        return Ok(HttpResponse::Ok().json(json!({
            "ok": true,
            "order_id": order_id,
            "authorization_url": init.authorization_url,
            "reference": init.reference,
            "kind": kind,
            "product": "liveescape",
        })));
    }
    if cfg.is_production() {
        return Err(AppError::BadRequest("paystack not configured".into()));
    }
    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "order_id": order_id,
        "dev_mode": true,
        "kind": kind,
        "product": "liveescape",
    })))
}

#[post("/starter-pack/pay")]
async fn starter_pack_pay(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<PayBody>) -> AppResult<HttpResponse> {
    let plan = body.plan_id.clone().unwrap_or_else(|| "starter".into());
    pay_kind(&db, &cfg, &req, "starter_pack", &plan).await
}
#[post("/starter-pack/pay-flutterwave")]
async fn starter_pack_pay_flutterwave() -> AppResult<HttpResponse> {
    Err(AppError::BadRequest("use /starter-pack/pay (paystack)".into()))
}
#[post("/starter-pack/pay-crypto")]
async fn starter_pack_pay_crypto() -> AppResult<HttpResponse> {
    Err(AppError::BadRequest("use nowpayments via credits purchase".into()))
}
#[get("/starter-pack/status")]
async fn starter_pack_status() -> HttpResponse {
    HttpResponse::Ok().json(json!({ "status": "unknown", "product": "liveescape" }))
}
#[post("/starter-pack/confirm-crypto")]
async fn starter_pack_confirm_crypto() -> AppResult<HttpResponse> {
    Err(AppError::BadRequest("crypto confirm via nowpayments webhook".into()))
}

#[post("/activation/pay")]
async fn activation_pay(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<PayBody>) -> AppResult<HttpResponse> {
    let plan = body.plan_id.clone().unwrap_or_else(|| "starter".into());
    pay_kind(&db, &cfg, &req, "activation", &plan).await
}
#[post("/activation/pay-flutterwave")]
async fn activation_pay_flutterwave(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<PayBody>) -> AppResult<HttpResponse> {
    // Flutterwave deprecated, map to Paystack
    pay_kind(&db, &cfg, &req, "activation", &body.plan_id.clone().unwrap_or_else(|| "starter".into())).await
}
#[post("/activation/pay-crypto")]
async fn activation_pay_crypto(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<PayBody>) -> AppResult<HttpResponse> {
    let product_id = product(&req);
    if product_id != ProductId::LiveEscape {
        return Err(AppError::BadRequest("activation payments only for liveescape".into()));
    }
    let auth = require_user(&req)?;
    let plan = body.plan_id.clone().unwrap_or_else(|| "starter".into());
    let (dollars, credits) = plan_credits(&plan);
    let order_id = new_id();
    let pay_cur = cfg.nowpayments_default_pay_currency.clone();
    let invoice = crate::services::nowpayments::create_invoice(&cfg, dollars, &order_id, &format!("LiveEscape activation {}", plan), &pay_cur).await?;
    let pay_address = invoice.pay_address.clone();
    let pay_currency = invoice.pay_currency.clone();
    let provider_ref = invoice.payment_id.clone();
    let network = invoice.network.clone();
    let pay_amount = invoice.pay_amount;
    db.payment_orders_le().insert_one(doc! {
        "_id": &order_id,
        "user_id": &auth.user_id,
        "plan": &plan,
        "credits": credits,
        "amount_usd": dollars,
        "status": "pending",
        "provider": "nowpayments",
        "product": "liveescape",
        "kind": "activation",
        "created_at": Utc::now().to_rfc3339(),
        "provider_ref": &provider_ref,
        "pay_address": &pay_address,
        "pay_amount": pay_amount,
        "pay_currency": &pay_currency,
    }).await?;
    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "order_id": order_id,
        "pay_address": pay_address,
        "pay_amount": pay_amount,
        "pay_currency": pay_currency,
        "network": network,
        "provider": "nowpayments",
        "product": "liveescape"
    })))
}
#[post("/activation/pay-nowpayments")]
async fn activation_pay_nowpayments(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<PayBody>) -> AppResult<HttpResponse> {
    let product_id = product(&req);
    if product_id != ProductId::LiveEscape {
        return Err(AppError::BadRequest("activation payments only for liveescape".into()));
    }
    let auth = require_user(&req)?;
    let plan = body.plan_id.clone().unwrap_or_else(|| "starter".into());
    let (dollars, credits) = plan_credits(&plan);
    let order_id = new_id();
    let pay_cur = cfg.nowpayments_default_pay_currency.clone();
    let invoice = crate::services::nowpayments::create_invoice(&cfg, dollars, &order_id, &format!("LiveEscape activation {}", plan), &pay_cur).await?;
    let pay_address = invoice.pay_address.clone();
    let pay_currency = invoice.pay_currency.clone();
    let provider_ref = invoice.payment_id.clone();
    let network = invoice.network.clone();
    let pay_amount = invoice.pay_amount;
    db.payment_orders_le().insert_one(doc! {
        "_id": &order_id,
        "user_id": &auth.user_id,
        "plan": &plan,
        "credits": credits,
        "amount_usd": dollars,
        "status": "pending",
        "provider": "nowpayments",
        "product": "liveescape",
        "kind": "activation",
        "created_at": Utc::now().to_rfc3339(),
        "provider_ref": &provider_ref,
        "pay_address": &pay_address,
        "pay_amount": pay_amount,
        "pay_currency": &pay_currency,
    }).await?;
    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "order_id": order_id,
        "pay_address": pay_address,
        "pay_amount": pay_amount,
        "pay_currency": pay_currency,
        "network": network,
        "provider": "nowpayments",
        "product": "liveescape"
    })))
}
#[post("/activation/confirm-crypto")]
async fn activation_confirm_crypto() -> AppResult<HttpResponse> {
    Err(AppError::BadRequest("use webhook fulfillment".into()))
}
#[get("/activation/nowpayments-status/{payment_id}")]
async fn activation_nowpayments_status(
    cfg: web::Data<Arc<Config>>,
    path: web::Path<String>,
) -> AppResult<HttpResponse> {
    let payment_id = path.into_inner();
    let inv = crate::services::nowpayments::get_payment_status(&cfg, &payment_id).await?;
    Ok(HttpResponse::Ok().json(json!({
        "payment_id": payment_id,
        "status": inv.payment_status,
        "pay_amount": inv.pay_amount,
        "pay_currency": inv.pay_currency,
    })))
}
#[post("/activation/dev-activate")]
async fn activation_dev_activate(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<PayBody>) -> AppResult<HttpResponse> {
    if cfg.is_production() {
        return Err(AppError::Forbidden("dev-activate disabled in production".into()));
    }
    let auth = require_user(&req)?;
    let plan = body.plan_id.clone().unwrap_or_else(|| "starter".into());
    let (_, credits) = plan_credits(&plan);
    // stub: grant credits
    Ok(HttpResponse::Ok().json(json!({ "ok": true, "plan": plan, "credits": credits, "product": "liveescape" })))
}

#[post("/upgrade/pay")]
async fn upgrade_pay(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<PayBody>) -> AppResult<HttpResponse> {
    let plan = body.plan_id.clone().unwrap_or_else(|| "pro".into());
    pay_kind(&db, &cfg, &req, "upgrade", &plan).await
}
#[post("/upgrade/pay-flutterwave")]
async fn upgrade_pay_flutterwave() -> AppResult<HttpResponse> {
    Err(AppError::BadRequest("use /upgrade/pay".into()))
}
#[post("/upgrade/pay-crypto")]
async fn upgrade_pay_crypto() -> AppResult<HttpResponse> {
    Err(AppError::BadRequest("use /upgrade/pay".into()))
}
#[post("/renew")]
async fn renew(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest) -> AppResult<HttpResponse> {
    pay_kind(&db, &cfg, &req, "renew", "starter").await
}

#[derive(Deserialize)]
struct ActivateBody { #[serde(default)] key: Option<String>, #[serde(default)] access_key: Option<String>, #[serde(default)] device_id: Option<String>, }
#[post("/activate")]
async fn activate_legacy() -> AppResult<HttpResponse> {
    // Alias to keys/validate – handled elsewhere
    Err(AppError::BadRequest("use /keys/validate".into()))
}

#[post("/support/tickets")]
async fn support_tickets(req: HttpRequest) -> AppResult<HttpResponse> {
    let _ = require_user(&req);
    Ok(HttpResponse::Ok().json(json!({ "ok": true, "ticket_id": uuid::Uuid::new_v4().to_string(), "product": "liveescape" })))
}
