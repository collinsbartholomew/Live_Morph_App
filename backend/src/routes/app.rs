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

fn update_payload(cfg: &Config) -> serde_json::Value {
    use crate::runtime_env as renv;
    let latest = renv::app_latest_version();
    let current = env!("CARGO_PKG_VERSION");
    let download = renv::app_download_url();
    let notes = renv::app_update_notes();
    // sha256 of the download artifact — the client refuses to install an update
    // whose digest doesn't match (or isn't provided) when a URL is set.
    let sha256 = renv::app_update_sha256();
    let force = renv::app_force_update();
    // Never announce an update the client cannot actually install: the
    // artifact must be HTTPS in production and carry a valid SHA-256 digest.
    let url_ok = if cfg.is_production() {
        download.starts_with("https://")
    } else {
        download.starts_with("https://") || download.starts_with("http://")
    };
    let sha_ok = sha256.len() == 64 && sha256.chars().all(|c| c.is_ascii_hexdigit());
    let artifact_ready = url_ok && sha_ok;
    let available = latest != current && !latest.is_empty() && artifact_ready;
    json!({
        "update_available": available,
        "artifact_ready": artifact_ready,
        "force": force,
        "forceUpdate": force,
        "current_version": current,
        "latest_version": latest,
        "latest": latest,
        "download_url": download,
        "url": download,
        "sha256": sha256,
        "notes": notes,
        "products": [ProductId::LiveMorph.as_str(), ProductId::Secondary.as_str()],
    })
}

fn apply_client_version(payload: &mut serde_json::Value, client_version: &str) {
    let client_version = client_version.trim();
    if client_version.is_empty() {
        return;
    }
    let latest = payload
        .get("latest_version")
        .and_then(|value| value.as_str())
        .unwrap_or_default()
        .to_string();
    let artifact_ready = payload
        .get("artifact_ready")
        .and_then(|value| value.as_bool())
        .unwrap_or(false);
    if let Some(obj) = payload.as_object_mut() {
        obj.insert("current_version".into(), json!(client_version));
        obj.insert(
            "update_available".into(),
            json!(!latest.is_empty() && latest != client_version && artifact_ready),
        );
    }
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
        }
        apply_client_version(&mut p, body.version.as_deref().unwrap_or_default());
    }
    HttpResponse::Ok().json(p)
}

#[cfg(test)]
mod update_tests {
    use super::*;

    #[test]
    fn update_is_evaluated_against_the_client_version() {
        let mut payload = json!({
            "latest_version": "1.9.0",
            "artifact_ready": true,
            "update_available": false,
        });
        apply_client_version(&mut payload, "1.8.0");
        assert_eq!(payload["update_available"], json!(true));
        assert_eq!(payload["current_version"], json!("1.8.0"));
        apply_client_version(&mut payload, "1.9.0");
        assert_eq!(payload["update_available"], json!(false));
        payload["artifact_ready"] = json!(false);
        apply_client_version(&mut payload, "1.8.0");
        assert_eq!(payload["update_available"], json!(false));
    }
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
    let subject: String = subject_raw.trim().chars().take(200).collect();
    let message_raw = body.message.clone().unwrap_or_default();
    let message: String = message_raw.trim().chars().take(4000).collect();
    if subject.is_empty() || message.is_empty() {
        return HttpResponse::BadRequest().json(json!({
            "ok": false,
            "error": "subject and message must not be empty",
        }));
    }
    // Per-user open-ticket quota (on top of the per-IP burst limit) so one
    // account cannot persist unlimited email-bearing tickets over time.
    let coll = match product {
        ProductId::Secondary => db
            .db_secondary
            .collection::<mongodb::bson::Document>("support_tickets"),
        ProductId::LiveMorph => db.db.collection::<mongodb::bson::Document>("support_tickets"),
    };
    match coll
        .count_documents(mongodb::bson::doc! { "user_id": &user_id, "status": "open" })
        .await
    {
        Ok(open) if open >= 20 => {
            return HttpResponse::TooManyRequests().json(json!({
                "ok": false,
                "error": "too many open tickets — wait for support to respond",
            }));
        }
        Ok(_) => {}
        Err(e) => {
            tracing::warn!(error = %e, "support ticket quota check failed");
            return HttpResponse::InternalServerError().json(json!({
                "ok": false,
                "error": "failed to save ticket",
            }));
        }
    }
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
    }))
}
