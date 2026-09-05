use crate::auth::jwt::decode_access;
use crate::config::Config;
use crate::db::{new_id, Db};
use crate::models::CreditLedgerEntry;
use actix_web::{web, HttpRequest, HttpResponse};
use chrono::Utc;
use futures_util::{SinkExt, StreamExt};
use mongodb::bson::{doc, Document};
use serde_json::{json, Value};
use std::sync::Arc;
use tokio::sync::mpsc;
use tokio_tungstenite::{connect_async, tungstenite::Message as WsMessage};
use tracing::{error, info, warn};

/// Actix WebSocket entry — upgrades the HTTP request then runs the proxy loop.
pub async fn realtime_ws(
    req: HttpRequest,
    stream: web::Payload,
    cfg: web::Data<Arc<Config>>,
    db: web::Data<Db>,
) -> Result<HttpResponse, actix_web::Error> {
    // Query params
    let q = web::Query::<std::collections::HashMap<String, String>>::from_query(req.query_string())
        .map_err(|_| actix_web::error::ErrorBadRequest("bad query"))?;

    // Prefer Authorization: Bearer (avoids JWT in logs/proxies); query token still accepted
    let token = req
        .headers()
        .get(actix_web::http::header::AUTHORIZATION)
        .and_then(|v| v.to_str().ok())
        .and_then(|h| {
            let h = h.trim();
            if h.len() > 7 && h.as_bytes()[..7].eq_ignore_ascii_case(b"Bearer ") {
                Some(h[7..].trim().to_string())
            } else {
                None
            }
        })
        .or_else(|| q.get("token").cloned())
        .ok_or_else(|| actix_web::error::ErrorUnauthorized("missing token"))?;
    let model_req = q.get("model").map(|s| s.as_str());

    let claims = decode_access(&cfg, &token)
        .map_err(|e| actix_web::error::ErrorUnauthorized(e.to_string()))?;
    let model = cfg
        .resolve_model(model_req)
        .map_err(actix_web::error::ErrorBadRequest)?;

    // Credit gate — product-aware user store
    let product = q
        .get("product")
        .or_else(|| q.get("frontend_id"))
        .and_then(|s| crate::product::ProductId::parse(s))
        .unwrap_or(crate::product::ProductId::LiveMorph);
    let user = match product {
        crate::product::ProductId::LiveEscape => db
            .users_le()
            .find_one(doc! { "_id": &claims.sub })
            .await
            .map_err(|e| {
                tracing::error!(error = %e, "db error");
                actix_web::error::ErrorInternalServerError("database error")
            })?
            .ok_or_else(|| actix_web::error::ErrorUnauthorized("user not found"))?,
        crate::product::ProductId::LiveMorph => db
            .users()
            .find_one(doc! { "_id": &claims.sub })
            .await
            .map_err(|e| {
                tracing::error!(error = %e, "db error");
                actix_web::error::ErrorInternalServerError("database error")
            })?
            .ok_or_else(|| actix_web::error::ErrorUnauthorized("user not found"))?,
    };

    if user.total_credits() < cfg.min_credits_to_start {
        return Err(actix_web::error::ErrorPaymentRequired(
            "insufficient credits",
        ));
    }

    // Concurrent session limit (edge case: double-start from two windows).
    // Counts in the product's own session store so Live Escape sessions are
    // never counted against LiveMorph (and vice versa).
    if cfg.max_concurrent_sessions > 0 {
        let active = session_coll(&db, product)
            .count_documents(doc! {
                "user_id": &claims.sub,
                "status": { "$in": ["connecting", "live", "generating"] }
            })
            .await
            .map_err(|e| actix_web::error::ErrorInternalServerError(e.to_string()))?;
        if active >= cfg.max_concurrent_sessions as u64 {
            return Err(actix_web::error::ErrorTooManyRequests(
                "maximum concurrent morph sessions reached",
            ));
        }
    }

    let session_id = new_id();
    // Session record is written to the product's own DB (LM vs LE isolation).
    let session_doc = doc! {
        "_id": &session_id,
        "user_id": &claims.sub,
        "model": &model,
        "decart_session_id": None::<String>,
        "status": "connecting",
        "started_at": Utc::now(),
        "ended_at": None::<bson::DateTime>,
        "generation_seconds": 0.0_f64,
        "credits_charged": 0.0_f64,
        "end_reason": None::<String>,
        "prompt": None::<String>,
        "character_id": None::<String>,
        "tier": "standard",
        "product": product.as_str(),
    };
    let _ = session_coll(&db, product).insert_one(&session_doc).await;

    info!(
        user_id = %claims.sub,
        session = %session_id,
        %model,
        "realtime WS accepting client"
    );

    // Upgrade to actix websocket
    let (res, mut session, mut msg_stream) = actix_ws::handle(&req, stream)?;

    let cfg = cfg.clone();
    let db = db.clone();
    let user_id = claims.sub.clone();
    let product_for_bill = product;

    actix_web::rt::spawn(async move {
        let ctx = ProxySessionCtx {
            user_id: &user_id,
            session_id: &session_id,
            model: &model,
            product: product_for_bill,
        };
        let proxy_result = run_proxy(&cfg, &db, ctx, &mut session, &mut msg_stream).await;
        let reason = match &proxy_result {
            Ok(()) => "client_or_upstream_closed",
            Err(e) => {
                warn!(error = %e, session = %session_id, "proxy ended with error");
                let _ = session
                    .text(json!({ "type": "error", "error": "proxy_error" }).to_string())
                    .await;
                "error"
            }
        };
        mark_session_ended(&db, &session_id, reason, product_for_bill).await;

        let _ = session.close(None).await;
    });

    Ok(res)
}

/// Immutable per-connection metadata passed through the proxy loop.
struct ProxySessionCtx<'a> {
    user_id: &'a str,
    session_id: &'a str,
    model: &'a str,
    product: crate::product::ProductId,
}

/// Product-aware session collection (LiveMorph `morph_sessions` | LiveEscape `sessions`).
fn session_coll(db: &Db, product: crate::product::ProductId) -> mongodb::Collection<Document> {
    match product {
        crate::product::ProductId::LiveEscape => db.sessions_le(),
        crate::product::ProductId::LiveMorph => db.db.collection("morph_sessions"),
    }
}

async fn run_proxy(
    cfg: &Config,
    db: &Db,
    ctx: ProxySessionCtx<'_>,
    client: &mut actix_ws::Session,
    client_stream: &mut actix_ws::MessageStream,
) -> anyhow::Result<()> {
    let ProxySessionCtx {
        user_id,
        session_id,
        model,
        product,
    } = ctx;
    // API key must be query-encoded (keys can contain + / =)
    let upstream_url = format!(
        "{}?api_key={}&model={}",
        cfg.decart_signaling_url.trim_end_matches('/'),
        urlencoding::encode(&cfg.decart_api_key),
        urlencoding::encode(model)
    );

    let (upstream, _) = connect_async(&upstream_url).await.map_err(|e| {
        error!(error = %e, "decart upstream connect failed");
        e
    })?;
    let (mut up_write, mut up_read) = upstream.split();

    let (tx_up, mut rx_up) = mpsc::unbounded_channel::<String>();
    let (tx_client, mut rx_client) = mpsc::unbounded_channel::<String>();

    // Writer tasks
    let mut up_writer = {
        tokio::spawn(async move {
            while let Some(text) = rx_up.recv().await {
                if up_write.send(WsMessage::Text(text.into())).await.is_err() {
                    break;
                }
            }
        })
    };

    // Client → upstream
    let tx_up_c = tx_up.clone();
    let client_to_up = async {
        while let Some(Ok(msg)) = client_stream.next().await {
            match msg {
                actix_ws::Message::Text(t) => {
                    if let Ok(v) = serde_json::from_str::<Value>(&t) {
                        let typ = v.get("type").and_then(|x| x.as_str()).unwrap_or("");
                        match typ {
                            "prompt" | "set_image" | "offer" | "ice-candidate" => {
                                let _ = tx_up_c.send(t.to_string());
                            }
                            "ping" => {
                                let _ = tx_client.send(json!({ "type": "pong" }).to_string());
                            }
                            other => {
                                warn!(%other, "unknown client message type — still forwarding");
                                let _ = tx_up_c.send(t.to_string());
                            }
                        }
                    }
                }
                actix_ws::Message::Close(_) | actix_ws::Message::Ping(_) => break,
                actix_ws::Message::Pong(_) => {}
                _ => {}
            }
        }
    };

    // Upstream → client + billing
    let mut last_billed_seconds: f64 = 0.0;
    let cps = cfg.credits_per_second;
    let db_bill = db.clone();
    let cfg_bill = cfg.clone();
    let uid = user_id.to_string();
    let sid = session_id.to_string();

    let upstream_to_client = async {
        while let Some(Ok(msg)) = up_read.next().await {
            match msg {
                WsMessage::Text(text) => {
                    let text_str = text.to_string();
                    if let Ok(v) = serde_json::from_str::<Value>(&text_str) {
                        let typ = v.get("type").and_then(|x| x.as_str()).unwrap_or("");
                        match typ {
                            "session_id" => {
                                if let Some(dsid) = v.get("session_id").and_then(|x| x.as_str()) {
                                    let _ = session_coll(&db_bill, product)
                                        .update_one(
                                            doc! { "_id": &sid },
                                            doc! { "$set": {
                                                "decart_session_id": dsid,
                                                "status": "live",
                                            }},
                                        )
                                        .await;
                                }
                            }
                            "generation_started" => {
                                let _ = session_coll(&db_bill, product)
                                    .update_one(
                                        doc! { "_id": &sid },
                                        doc! { "$set": { "status": "live" } },
                                    )
                                    .await;
                            }
                            "generation_tick" => {
                                let secs = v.get("seconds").and_then(|x| x.as_f64()).unwrap_or(0.0);
                                let delta_secs = (secs - last_billed_seconds).max(0.0);
                                last_billed_seconds = secs;
                                if delta_secs > 0.0 {
                                    let charge = delta_secs * cps;
                                    if let Err(e) = charge_user(
                                        &db_bill, &cfg_bill, &uid, charge, delta_secs, &sid,
                                        product,
                                    )
                                    .await
                                    {
                                        warn!(error = %e, "billing failed — forcing disconnect");
                                        let err_msg = e.to_string();
                                        let code = if err_msg.contains("decart")
                                            || err_msg.contains("budget")
                                        {
                                            "platform_budget_exhausted"
                                        } else {
                                            "insufficient_credits"
                                        };
                                        let _ = tx_client.send(
                                            json!({
                                                "type": "error",
                                                "error": code
                                            })
                                            .to_string(),
                                        );
                                        break;
                                    }
                                    let _ = session_coll(&db_bill, product)
                                        .update_one(
                                            doc! { "_id": &sid },
                                            doc! { "$set": {
                                                "generation_seconds": secs,
                                            },
                                            "$inc": { "credits_charged": charge }},
                                        )
                                        .await;
                                }
                            }
                            "generation_ended" => {
                                let secs = v
                                    .get("seconds")
                                    .and_then(|x| x.as_f64())
                                    .unwrap_or(last_billed_seconds);
                                let reason = v
                                    .get("reason")
                                    .and_then(|x| x.as_str())
                                    .unwrap_or("disconnect")
                                    .to_string();
                                // Final charge for any remainder — surface failures so the
                                // tail usage is never silently granted.
                                let delta_secs = (secs - last_billed_seconds).max(0.0);
                                if delta_secs > 0.0 {
                                    let charge = delta_secs * cps;
                                    if let Err(e) = charge_user(
                                        &db_bill, &cfg_bill, &uid, charge, delta_secs, &sid,
                                        product,
                                    )
                                    .await
                                    {
                                        warn!(error = %e, "final generation charge failed");
                                    }
                                }
                                let _ = session_coll(&db_bill, product)
                                    .update_one(
                                        doc! { "_id": &sid },
                                        doc! { "$set": {
                                            "status": "ended",
                                            "ended_at": Utc::now(),
                                            "generation_seconds": secs,
                                            "end_reason": &reason,
                                        }},
                                    )
                                    .await;
                            }
                            _ => {}
                        }
                    }
                    if tx_client.send(text_str).is_err() {
                        break;
                    }
                }
                WsMessage::Close(_) => break,
                _ => {}
            }
        }
    };

    // Client writer from channel
    let client_writer = async {
        while let Some(text) = rx_client.recv().await {
            if client.text(text).await.is_err() {
                break;
            }
        }
    };

    tokio::select! {
        _ = client_to_up => {},
        _ = upstream_to_client => {},
        _ = client_writer => {},
        _ = &mut up_writer => {},
    }

    // Finalize session if still open
    let _ = session_coll(db, product)
        .update_one(
            doc! { "_id": session_id, "status": { "$ne": "ended" } },
            doc! { "$set": {
                "status": "ended",
                "ended_at": Utc::now(),
                "end_reason": "disconnect",
            }},
        )
        .await;

    Ok(())
}

async fn charge_user(
    db: &Db,
    cfg: &Config,
    user_id: &str,
    amount: f64,
    delta_secs: f64,
    session_id: &str,
    product: crate::product::ProductId,
) -> anyhow::Result<()> {
    if amount <= 0.0 {
        return Ok(());
    }

    // 1) Debit user first (atomic). Only then burn platform Decart budget —
    // avoids orphan budget if the user cannot pay.
    let filter = doc! {
        "_id": user_id,
        "$expr": {
            "$gte": [
                { "$add": [
                    { "$ifNull": ["$credit_balance", 0] },
                    { "$ifNull": ["$bonus_balance", 0] }
                ]},
                amount
            ]
        }
    };

    let user = match product {
        crate::product::ProductId::LiveEscape => db
            .users_le()
            .find_one(doc! { "_id": user_id })
            .await?
            .ok_or_else(|| anyhow::anyhow!("user not found"))?,
        crate::product::ProductId::LiveMorph => db
            .users()
            .find_one(doc! { "_id": user_id })
            .await?
            .ok_or_else(|| anyhow::anyhow!("user not found"))?,
    };

    let bonus_take = amount.min(user.bonus_balance.max(0.0));
    let credit_take = amount - bonus_take;

    let update = doc! {
        "$inc": {
            "bonus_balance": -bonus_take,
            "credit_balance": -credit_take,
        },
        "$set": { "updated_at": chrono::Utc::now() },
    };

    let result = match product {
        crate::product::ProductId::LiveEscape => {
            db.users_le()
                .update_one(filter.clone(), update.clone())
                .await?
        }
        crate::product::ProductId::LiveMorph => db.users().update_one(filter, update).await?,
    };
    if result.matched_count == 0 {
        anyhow::bail!("insufficient_credits");
    }

    // 2) Platform pays Decart on the shared API key
    if let Err(e) = crate::services::billing::debit_decart_budget(db, cfg, delta_secs).await {
        let refund = doc! {
            "$inc": {
                "bonus_balance": bonus_take,
                "credit_balance": credit_take,
            },
            "$set": { "updated_at": chrono::Utc::now() },
        };
        let _ = match product {
            crate::product::ProductId::LiveEscape => {
                db.users_le()
                    .update_one(doc! { "_id": user_id }, refund)
                    .await
            }
            crate::product::ProductId::LiveMorph => {
                db.users().update_one(doc! { "_id": user_id }, refund).await
            }
        };
        anyhow::bail!("{e}");
    }

    let balance_after = (user.total_credits() - amount).max(0.0);
    let entry = CreditLedgerEntry {
        id: crate::db::new_id(),
        user_id: user_id.to_string(),
        delta: -amount,
        balance_after,
        kind: "usage".into(),
        ref_id: Some(session_id.to_string()),
        note: Some("decart generation_tick".into()),
        created_at: bson::DateTime::from_chrono(chrono::Utc::now()),
    };
    match product {
        crate::product::ProductId::LiveEscape => {
            db.ledger_le().insert_one(&entry).await?;
        }
        crate::product::ProductId::LiveMorph => {
            db.ledger().insert_one(&entry).await?;
        }
    }
    Ok(())
}

async fn mark_session_ended(
    db: &Db,
    session_id: &str,
    reason: &str,
    product: crate::product::ProductId,
) {
    let _ = session_coll(db, product)
        .update_one(
            doc! { "_id": session_id },
            doc! { "$set": {
                "status": "ended",
                "ended_at": chrono::Utc::now(),
                "end_reason": reason,
            }},
        )
        .await;
}
