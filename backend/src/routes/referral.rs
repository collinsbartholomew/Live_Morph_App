//! Unified referral routes.

use crate::product::ProductId;
use actix_web::{get, post, web, HttpRequest, HttpResponse};
use serde::Deserialize;
use serde_json::json;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(referral_my_code_v1)
        .service(referral_my_code_legacy)
        .service(referral_attach_v1)
        .service(referral_attach_legacy);
}

async fn referral_my_code_inner(req: HttpRequest, query: web::Query<std::collections::HashMap<String, String>>) -> HttpResponse {
    let product = ProductId::from_request(&req);
    if let Some(email) = query.get("email") {
        let code = format!("LE{}", &email[..email.len().min(8)]);
        return HttpResponse::Ok().json(json!({ "code": code.to_uppercase(), "earned": 0, "credits_earned": 0, "product": product.as_str() }));
    }
    HttpResponse::Ok().json(json!({ "code": "", "earned": 0, "credits_earned": 0, "product": product.as_str() }))
}
#[get("/api/v1/referral/my-code")]
async fn referral_my_code_v1(req: HttpRequest, query: web::Query<std::collections::HashMap<String, String>>) -> HttpResponse { referral_my_code_inner(req, query).await }
#[get("/referral/my-code")]
async fn referral_my_code_legacy(req: HttpRequest, query: web::Query<std::collections::HashMap<String, String>>) -> HttpResponse { referral_my_code_inner(req, query).await }

#[derive(Deserialize)]
struct AttachBody {
    email: String,
    device_id: String,
    code: String,
}

async fn referral_attach_inner(req: HttpRequest, body: web::Json<AttachBody>) -> HttpResponse {
    let product = ProductId::from_request(&req);
    let _ = body;
    HttpResponse::Ok().json(json!({ "ok": true, "product": product.as_str() }))
}
#[post("/api/v1/referral/attach")]
async fn referral_attach_v1(req: HttpRequest, body: web::Json<AttachBody>) -> HttpResponse { referral_attach_inner(req, body).await }
#[post("/referral/attach")]
async fn referral_attach_legacy(req: HttpRequest, body: web::Json<AttachBody>) -> HttpResponse { referral_attach_inner(req, body).await }
