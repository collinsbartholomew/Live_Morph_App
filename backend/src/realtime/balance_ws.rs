//! Shared live balance WebSocket for LiveMorph + Secondary.
//!
//! Connect: WS /ws with Authorization: Bearer <access_jwt> (?token= only outside production)
//! Optional: &product=livemorph|secondary (else taken from JWT path / header heuristic)
//!
//! Messages (server → client):
//!   { "type": "balance_update", "product", "user_id", "credit_balance", "bonus_balance",
//!     "total", "credits", "plan" }
//!   { "type": "force_disconnect", "product", "user_id", "reason" }
//!   { "type": "hello", "product", "user_id" }

use crate::auth::jwt::decode_access;
use crate::config::Config;
use crate::db::Db;
use crate::product::ProductId;
use actix_web::{web, HttpRequest, HttpResponse};
use futures_util::StreamExt;
use mongodb::bson::doc;
use serde_json::json;
use std::sync::Arc;
use std::time::Duration;
use tracing::info;

pub async fn balance_ws(
    req: HttpRequest,
    stream: web::Payload,
    cfg: web::Data<Arc<Config>>,
    db: web::Data<Db>,
) -> Result<HttpResponse, actix_web::Error> {
    let q = web::Query::<std::collections::HashMap<String, String>>::from_query(req.query_string())
        .map_err(|_| actix_web::error::ErrorBadRequest("bad query"))?;

    let token = req
        .headers()
        .get(actix_web::http::header::AUTHORIZATION)
        .and_then(|v| v.to_str().ok())
        .and_then(crate::auth::parse_bearer_token)
        .or_else(|| if cfg.is_production() { None } else { q.get("token").cloned() })
        .ok_or_else(|| actix_web::error::ErrorUnauthorized("missing token"))?;

    let claims = decode_access(&cfg, &token)
        .map_err(|e| { tracing::warn!(error = %e, "balance WS token decode failed"); actix_web::error::ErrorUnauthorized("invalid token") })?;

    // Rate-limit balance WS handshakes per (user, ip) before any DB write.
    {
        let ip = crate::auth::client_ip(&req);
        let key = format!("{}:{}", claims.sub, ip);
        if !crate::auth::check_rate_limit(&key, "ws-balance", 10, 60)
            || !crate::auth::check_rate_limit(&ip, "ws-balance-ip", 30, 60)
        {
            return Err(actix_web::error::ErrorTooManyRequests("too many balance connections"));
        }
    }

    let product = q
        .get("product")
        .or_else(|| q.get("frontend_id"))
        .and_then(|s| ProductId::parse(s))
        .unwrap_or_else(|| ProductId::from_request(&req));

    // Same product binding + revocation as the realtime WS and REST middleware.
    // Require an explicit aud — an aud-less token must not reach any product's WS.
    let Some(aud) = &claims.aud else {
        return Err(actix_web::error::ErrorUnauthorized("token missing product binding"));
    };
    if aud != product.as_str() {
        return Err(actix_web::error::ErrorUnauthorized("token bound to another product"));
    }

    // Verify user exists in the correct DB
    let user_ok = match product {
        ProductId::LiveMorph => db
            .users()
            .find_one(doc! { "_id": &claims.sub })
            .await
            .map_err(|e| {
                tracing::error!(error = %e, "db error");
                actix_web::error::ErrorInternalServerError("database error")
            })?
            .map(|u| u.is_active && u.token_version == claims.ver)
            .unwrap_or(false),
        ProductId::Secondary => db
            .users_secondary()
            .find_one(doc! { "_id": &claims.sub })
            .await
            .map_err(|e| {
                tracing::error!(error = %e, "db error");
                actix_web::error::ErrorInternalServerError("database error")
            })?
            .map(|u| u.is_active && u.token_version == claims.ver)
            .unwrap_or(false),
    };
    if !user_ok {
        return Err(actix_web::error::ErrorUnauthorized(
            "user not found for product",
        ));
    }

    // Reject cross-origin WS upgrades (defense-in-depth; desktop client sends
    // no Origin header and is allowed through).
    if !crate::auth::ratelimit::ws_origin_ok(&req, &cfg) {
        return Err(actix_web::error::ErrorForbidden("cross-origin websocket rejected"));
    }

    // Bound long-lived balance sockets globally, not just by handshake rate.
    static SLOTS: std::sync::LazyLock<tokio::sync::Semaphore> =
        std::sync::LazyLock::new(|| tokio::sync::Semaphore::new(1024));
    let slot = SLOTS
        .try_acquire()
        .map_err(|_| actix_web::error::ErrorTooManyRequests("too many balance sockets"))?;

    let (res, mut session, mut msg_stream) = actix_ws::handle(&req, stream)?;
    let db = db.clone();
    let user_id = claims.sub.clone();
    let product_str = product.as_str().to_string();
    let min_credits = cfg.min_credits_to_start;
    let expected_ver = claims.ver;

    info!(%user_id, product = %product_str, "balance WS connected");

    actix_web::rt::spawn(async move {
        // The semaphore permit is released when this task exits for ANY reason.
        let _slot = slot;
        let cfg_rev =
            crate::config::config_revision();
        let base = cfg.public_base_url.clone();
        let _ = session
            .text(
                json!({
                    "type": "hello",
                    "product": product_str,
                    "user_id": user_id,
                    "config_revision": cfg_rev,
                    "hint": "poll GET /api/v1/bootstrap when config_revision changes",
                    "public_base_url": base,
                })
                .to_string(),
            )
            .await;

        let mut tick = tokio::time::interval(Duration::from_secs(10));
        let mut n = 0u32;
        let mut last_state: Option<(f64, f64, Option<String>, i64, bool)> = None;
        let mut last_config_rev = cfg_rev;
        let force_sent = false;
        loop {
            tokio::select! {
                _ = tick.tick() => {
                    let user = match product {
                        ProductId::LiveMorph => {
                            db.users().find_one(doc! { "_id": &user_id }).await.ok().flatten()
                        }
                        ProductId::Secondary => {
                            db.users_secondary().find_one(doc! { "_id": &user_id }).await.ok().flatten()
                        }
                    };
                    let Some(u) = user else { break; };
                    if !u.is_active || u.token_version != expected_ver {
                        let _ = session.close(Some(actix_ws::CloseReason {
                            code: actix_ws::CloseCode::Policy,
                            description: Some("session revoked".into()),
                        })).await;
                        break;
                    }
                    let total = u.total_credits();
                    let state = (total, u.credit_balance, u.plan.clone(), u.token_version, u.is_active);
                    // Compare the full visible state: equal totals can still
                    // hide a bonus purchase, a burn, or a plan change.
                    let changed = last_state.as_ref() != Some(&state);
                    if changed {
                        last_state = Some(state);
                        let msg = json!({
                            "type": "balance_update",
                            "product": product_str,
                            "user_id": user_id,
                            "credit_balance": u.credit_balance,
                            "bonus_balance": u.bonus_balance,
                            "total": total,
                            "credits": total,
                            "plan": u.plan,
                        });
                        if session.text(msg.to_string()).await.is_err() {
                            break;
                        }
                    }
                    if total < min_credits && !force_sent {
                        // Send the force_disconnect ONCE, then close with a code:
                        // re-sending every tick just spams a dead session.
                        let fd = json!({
                            "type": "force_disconnect",
                            "product": product_str,
                            "user_id": user_id,
                            "reason": "credits_depleted",
                        });
                        let _ = session.text(fd.to_string()).await;
                        let _ = session
                            .close(Some(actix_ws::CloseReason {
                                code: actix_ws::CloseCode::Normal,
                                description: Some("credits_depleted".into()),
                            }))
                            .await;
                        break;
                    }
                    n += 1;
                    if n.is_multiple_of(3) {
                        // Notify only on an actual revision change, not every 30s.
                        let cfg_rev = crate::config::config_revision();
                        if cfg_rev != last_config_rev {
                            last_config_rev = cfg_rev;
                            let _ = session.text(json!({
                                "type": "config_update",
                                "product": product_str,
                                "user_id": user_id,
                                "config_revision": cfg_rev,
                                "action": "refetch_bootstrap",
                            }).to_string()).await;
                        }
                    }
                }
                // Silence bound: a peer that vanished without a TCP FIN is only
                // detected by the kernel after ~15 min, leaking a task plus a
                // Mongo read every 10 s. Break after 120 s of silence, same idea
                // as the realtime proxy's silence break. `StreamExt::next` is
                // cancel-safe, so the timeout does not lose a frame.
                msg = tokio::time::timeout(Duration::from_secs(120), msg_stream.next()) => {
                    match msg {
                        Err(_) | Ok(None) => break,
                        Ok(Some(Ok(actix_ws::Message::Close(_)))) => break,
                        Ok(Some(Ok(actix_ws::Message::Ping(p)))) => {
                            let _ = session.pong(&p).await;
                        }
                        Ok(Some(Ok(actix_ws::Message::Pong(_)))) => {}
                        // client ping as JSON
                        Ok(Some(Ok(actix_ws::Message::Text(t)))) if t.contains("ping") => {
                            let _ = session.text(json!({
                                "type": "pong",
                                "product": product_str,
                                "user_id": user_id,
                            }).to_string()).await;
                        }
                        _ => {}
                    }
                }
            }
        }
        info!(%user_id, product = %product_str, "balance WS disconnected");
    });

    Ok(res)
}
