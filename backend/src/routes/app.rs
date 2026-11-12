use crate::auth::middleware::require_user;
use crate::config::Config;
use crate::db::Db;
use crate::product::ProductId;
use actix_web::{post, web, HttpRequest, HttpResponse};
use serde::Deserialize;
use serde_json::json;
use std::sync::Arc;
use uuid::Uuid;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(check_updates)
        .service(support_tickets);
}

fn update_payload(_cfg: &Config) -> serde_json::Value {
    let latest =
        std::env::var("APP_LATEST_VERSION").unwrap_or_else(|_| env!("CARGO_PKG_VERSION").into());
    let current = env!("CARGO_PKG_VERSION");
    let download = std::env::var("APP_DOWNLOAD_URL").unwrap_or_default();
    let notes = std::env::var("APP_UPDATE_NOTES").unwrap_or_default();
    let force = std::env::var("APP_FORCE_UPDATE")
        .map(|v| v == "1" || v.eq_ignore_ascii_case("true"))
        .unwrap_or(false);
    let available = latest != current && !latest.is_empty();
    json!({
        "update_available": available,
        "force": force,
        "forceUpdate": force,
        "current_version": current,
        "latest_version": latest,
        "latest": latest,
        "download_url": download,
        "url": download,
        "notes": notes,
        "products": [ProductId::LiveMorph.as_str(), ProductId::Secondary.as_str()],
    })
}

#[derive(Deserialize)]
struct VersionBody {
    #[serde(default)]
    version: Option<String>,
    #[serde(default)]
    platform: Option<String>,
}

/// Single unified update/version check (LiveMorph + Secondary clients).
#[post("/update/check")]
async fn check_updates(
    cfg: web::Data<Arc<Config>>,
    body: Option<web::Json<VersionBody>>,
) -> HttpResponse {
    let mut p = update_payload(&cfg);
    if let Some(body) = body {
        if let Some(obj) = p.as_object_mut() {
            obj.insert("platform".into(), json!(body.platform));
            obj.insert("current".into(), json!(body.version));
        }
    }
    HttpResponse::Ok().json(p)
}

#[derive(Deserialize)]
struct TicketBody {
    #[serde(default)]
    subject: Option<String>,
    #[serde(default)]
    message: Option<String>,
    // Sender email is always taken from the authenticated user, never the body.
    #[serde(default)]
    #[allow(dead_code)]
    email: Option<String>,
}

/// Shared support ticket endpoint (both products). Tickets are persisted to the
/// product-scoped `support_tickets` collection for operator follow-up.
#[post("/support/tickets")]
async fn support_tickets(
    db: web::Data<Db>,
    req: HttpRequest,
    body: web::Json<TicketBody>,
) -> HttpResponse {
    let product = ProductId::from_request(&req);
    let ip = crate::auth::client_ip(&req);
    if !crate::auth::check_rate_limit(&ip, "support-ticket", 5, 60) {
        return HttpResponse::TooManyRequests().json(json!({
            "error": "rate_limited",
            "message": "too many tickets — try again in 60 seconds",
        }));
    }
    // Authenticated only — anonymous tickets with spoofed sender emails are spam.
    let user = match require_user(&req) {
        Ok(u) => u,
        Err(e) => {
            return HttpResponse::Unauthorized()
                .json(json!({ "error": "unauthorized", "message": e.to_string() }));
        }
    };
    let email = user.email.clone();
    let user_id = Some(user.user_id.clone());
    let ticket_id = Uuid::new_v4().to_string();
    let subject_raw = body.subject.clone().unwrap_or_else(|| "General".into());
    let subject: String = subject_raw.chars().take(200).collect();
    let message_raw = body.message.clone().unwrap_or_default();
    let message: String = message_raw.chars().take(4000).collect();
    let created_at = chrono::Utc::now();
    let doc = json!({
        "_id": &ticket_id,
        "product": product.as_str(),
        "user_id": user_id,
        "email": email,
        "subject": subject,
        "message": message,
        "status": "open",
        "created_at": created_at.to_rfc3339(),
    });
    let coll = match product {
        ProductId::Secondary => db
            .db_secondary
            .collection::<mongodb::bson::Document>("support_tickets"),
        ProductId::LiveMorph => db.db.collection::<mongodb::bson::Document>("support_tickets"),
    };
    match mongodb::bson::to_document(&doc) {
        Ok(bson_doc) => {
            if let Err(e) = coll.insert_one(bson_doc).await {
                tracing::warn!(error = %e, "failed to persist support ticket");
                return HttpResponse::InternalServerError().json(json!({
                    "ok": false,
                    "error": "failed to save ticket",
                }));
            }
        }
        Err(e) => {
            // Never report success when the ticket was not persisted.
            tracing::warn!(error = %e, "failed to serialize support ticket");
            return HttpResponse::InternalServerError().json(json!({
                "ok": false,
                "error": "failed to save ticket",
            }));
        }
    }
    HttpResponse::Ok().json(json!({
        "ok": true,
        "ticket_id": ticket_id,
        "subject": subject,
        "message": message,
        "email": email,
        "user_id": user_id,
    }))
}
