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
        .and_then(crate::auth::parse_bearer_token)
        // Query-string tokens land in access logs — header-only in production.
        .or_else(|| if cfg.is_production() { None } else { q.get("token").cloned() })
        .ok_or_else(|| actix_web::error::ErrorUnauthorized("missing token"))?;
    let model_req = q.get("model").map(|s| s.as_str());

    let claims = decode_access(&cfg, &token)
        .map_err(|e| { tracing::warn!(error = %e, "WS token decode failed"); actix_web::error::ErrorUnauthorized("invalid token") })?;
    // Product binding: the WS product comes from the same headers as REST.
    // Require an explicit aud (matching the REST middleware) — an aud-less
    // token must not be accepted by any product's WS.
    let product_hdr = crate::product::ProductId::from_request(&req);
    let Some(aud) = &claims.aud else {
        return Err(actix_web::error::ErrorUnauthorized("token missing product binding"));
    };
    if aud != product_hdr.as_str() {
        warn!(user = %claims.sub, aud = %aud, "cross-product realtime token rejected");
        return Err(actix_web::error::ErrorUnauthorized("token bound to another product"));
    }
    let model = cfg
        .resolve_model(model_req)
        .map_err(actix_web::error::ErrorBadRequest)?;

    // Reject cross-origin WS upgrades (defense-in-depth; desktop client sends
    // no Origin header and is allowed through).
    if !crate::auth::ratelimit::ws_origin_ok(&req, &cfg) {
        return Err(actix_web::error::ErrorForbidden("cross-origin websocket rejected"));
    }

    // HD tier selection: client passes ?tier=hd or ?tier=standard (default).
    // The BILLED tier is overridden below from the server-side session-start
    // row, so a hand-crafted WS can't stream HD while being billed standard.
    let mut tier = q.get("tier").map(|s| s.as_str()).unwrap_or("standard").to_string();
    if tier != "hd" {
        tier = "standard".into();
    }

    // Credit gate — product-aware user store. Product resolution is shared with
    // every other route: X-Frontend-Id header first, then ?product=/?frontend_id=,
    // then default LiveMorph (same semantics as /api/v1/ws).
    let product = crate::product::ProductId::from_request(&req);
    let user = match product {
        crate::product::ProductId::Secondary => db
            .users_secondary()
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

    if !user.is_active || user.token_version != claims.ver {
        return Err(actix_web::error::ErrorUnauthorized("token revoked"));
    }
    if user.total_credits() < cfg.min_credits_to_start {
        return Err(actix_web::error::ErrorPaymentRequired(
            "insufficient credits",
        ));
    }

    // Billed tier is decided SERVER-SIDE from the user's plan entitlement, not
    // from the client-supplied ?tier= or the client-stamped REST row (both are
    // spoofable). HD is only billable when the user is HD-entitled; otherwise
    // the session is always billed at the standard rate regardless of what the
    // client claims.
    if let Ok(Some(row)) = session_coll(&db, product)
        .find_one(doc! { "user_id": &claims.sub, "status": "live" })
        .with_options(
            mongodb::options::FindOneOptions::builder()
                .sort(doc! { "started_at": -1 })
                .build(),
        )
        .await
    {
        if let Ok(t) = row.get_str("tier") {
            if t == "hd" || t == "standard" {
                tier = t.to_string();
            }
        }
    }
    let billed_hd = (tier == "hd" || q.get("tier").map(|t| t == "hd").unwrap_or(false))
        && user.hd_entitled();
    tier = if billed_hd { "hd".into() } else { "standard".into() };
    let tier_multiplier = if tier == "hd" {
        cfg.hd_credit_multiplier
    } else {
        1.0
    };

    // Concurrent session limit (edge case: double-start from two windows).
    // Counts in the product's own session store so Secondary sessions are
    // never counted against LiveMorph (and vice versa).
    //
    // IMPORTANT: clients call REST /streaming/session-start first (which stamps
    // a "live" intent row) and then connect here — ONE logical session, two
    // rows. Counting "live" would self-collide with our own REST row, so only
    // rows that actually own a Decart stream ("connecting"/"generating") count.
    let session_id = new_id();
    // Session record is written to the product's own DB (LM vs secondary isolation).
    let session_doc = doc! {
        "_id": &session_id,
        "user_id": &claims.sub,
        "model": &model,
        "decart_session_id": None::<String>,
        "status": "connecting",
        "started_at": Utc::now(),
        "last_activity_at": bson::DateTime::from_chrono(Utc::now()),
        "ended_at": None::<bson::DateTime>,
        "generation_seconds": 0.0_f64,
        "credits_charged": 0.0_f64,
        "end_reason": None::<String>,
        "prompt": None::<String>,
        "character_id": None::<String>,
        "tier": tier,
        "tier_multiplier": tier_multiplier,
        "product": product.as_str(),
        "instance_id": crate::INSTANCE_ID.as_str(),
    };
    // Insert the session row BEFORE claiming the slot: a concurrent connect's
    // liveness probe must be able to see this row. Claiming first left a window
    // where another connection could mistake an in-flight claim for a stale
    // counter and zero it, letting two connections hold one slot.
    if let Err(e) = session_coll(&db, product).insert_one(&session_doc).await {
        // Never echo the Mongo error text to the client — log it server-side.
        tracing::error!(error = %e, session = %session_id, "session row insert failed");
        return Err(actix_web::error::ErrorInternalServerError("internal error"));
    }

    // Atomic session claim on the user doc: a single conditional $inc lets
    // exactly one racing connection win the slot. The loser sees the winner's
    // freshly-inserted row in the probe below and is rejected cleanly.
    if cfg.max_concurrent_sessions > 0 {
        let users = match product {
            crate::product::ProductId::Secondary => db.users_secondary(),
            crate::product::ProductId::LiveMorph => db.users(),
        };
        let mut claimed = users
            .update_one(
                doc! {
                    "_id": &claims.sub,
                    "$expr": { "$lt": [
                        { "$ifNull": ["$active_sessions", 0] },
                        cfg.max_concurrent_sessions as i64,
                    ] },
                },
                doc! { "$inc": { "active_sessions": 1 } },
            )
            .await
            .map_err(|e| { tracing::warn!(error = %e, "WS session claim failed"); actix_web::error::ErrorInternalServerError("internal error") })?;
        if claimed.matched_count == 0 {
            // Reconnect race: the counter may be stale (the previous session's
            // slot was never released even though its row is ended). The counter
            // is only provably stale if NO other session row owns a Decart stream
            // ("connecting"/"generating" — "live" REST intent rows never own a
            // slot). Exclude our own just-inserted row, and fail closed on a
            // probe error instead of guessing and clobbering a live claim.
            let live_rows = match session_coll(&db, product)
                .count_documents(doc! {
                    "user_id": &claims.sub,
                    "_id": { "$ne": &session_id },
                    "status": { "$in": ["connecting", "generating"] },
                })
                .await
            {
                Ok(n) => n,
                Err(e) => {
                    tracing::warn!(error = %e, "WS session liveness probe failed — rejecting");
                    let _ = session_coll(&db, product)
                        .update_one(
                            doc! { "_id": &session_id },
                            doc! { "$set": { "status": "ended", "ended_at": Utc::now(), "end_reason": "probe_error" } },
                        )
                        .await;
                    return Err(actix_web::error::ErrorTooManyRequests(
                        "maximum concurrent morph sessions reached",
                    ));
                }
            };
            if live_rows == 0 {
                // No other row owns a slot, so the counter is stale (the prior
                // holder's row is already ended). Do NOT zero the counter
                // unconditionally: in the window where the prior holder flipped
                // its row to "ended" but has not yet released its slot, a
                // `$set: 0` would clobber that pending release and later
                // double-decrement, over-admitting past MAX_CONCURRENT_SESSIONS.
                // Instead retry the conditional claim briefly — the legitimate
                // holder releases within milliseconds of flipping its row, so
                // the claim wins without clobbering. (A holder that died without
                // releasing is healed by the startup reset / reaper.)
                for attempt in 0..5u32 {
                    claimed = users
                        .update_one(
                            doc! {
                                "_id": &claims.sub,
                                "$expr": { "$lt": [
                                    { "$ifNull": ["$active_sessions", 0] },
                                    cfg.max_concurrent_sessions as i64,
                                ] },
                            },
                            doc! { "$inc": { "active_sessions": 1 } },
                        )
                        .await
                        .map_err(|e| { tracing::warn!(error = %e, "WS session reclaim failed"); actix_web::error::ErrorInternalServerError("internal error") })?;
                    if claimed.matched_count > 0 {
                        break;
                    }
                    if attempt < 4 {
                        tokio::time::sleep(std::time::Duration::from_millis(50u64 << attempt)).await;
                    }
                }
            }
        }
        if claimed.matched_count == 0 {
            // Slot genuinely held by another live session: end our row WITHOUT
            // releasing a slot (we never claimed one) and reject.
            let _ = session_coll(&db, product)
                .update_one(
                    doc! { "_id": &session_id },
                    doc! { "$set": { "status": "ended", "ended_at": Utc::now(), "end_reason": "concurrent_limit" } },
                )
                .await;
            return Err(actix_web::error::ErrorTooManyRequests(
                "maximum concurrent morph sessions reached",
            ));
        }
    }

    info!(
        user_id = %claims.sub,
        session = %session_id,
        %model,
        "realtime WS accepting client"
    );

    // Upgrade to actix websocket. A plain GET (no upgrade headers) with a
    // valid token would claim the slot above and then fail here — release the
    // slot and end the session row on that path instead of leaking them.
    let (res, mut session, mut msg_stream) = match actix_ws::handle(&req, stream) {
        Ok(v) => v,
        Err(e) => {
            mark_session_ended(&db, &claims.sub, &session_id, "upgrade_failed", product).await;
            return Err(e);
        }
    };

    let cfg = cfg.clone();
    let db = db.clone();
    let user_id = claims.sub.clone();
    let product_for_bill = product;
    let tasks = req.app_data::<web::Data<ProxyTasks>>().cloned();
    // Register the session clone BEFORE the task moves `session`.
    let session_for_registry = session.clone();
    let tasks_for_task = tasks.clone();
    if let Some(tasks) = &tasks {
        tasks.register(session_id.clone(), session_for_registry);
    }

    let _handle = actix_web::rt::spawn(async move {
        let ctx = ProxySessionCtx {
            user_id: &user_id,
            session_id: &session_id,
            model: &model,
            product: product_for_bill,
            tier_multiplier,
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
        mark_session_ended(&db, &user_id, &session_id, reason, product_for_bill).await;
        // Drop the registry entry now that the task is ending — otherwise the
        // registry leaks one handle per WS connection for the process lifetime.
        if let Some(t) = &tasks_for_task {
            t.unregister(&session_id);
        }

        let _ = session
            .close(Some(actix_ws::CloseReason {
                code: actix_ws::CloseCode::Normal,
                description: Some(reason.to_string()),
            }))
            .await;
    });
    // (session was registered above, before the move into the task)

    Ok(res)
}

/// Immutable per-connection metadata passed through the proxy loop.
struct ProxySessionCtx<'a> {
    user_id: &'a str,
    session_id: &'a str,
    model: &'a str,
    product: crate::product::ProductId,
    tier_multiplier: f64,
}

/// Registry of live realtime proxy sessions so shutdown can close them with a
/// coded frame (1001 GoingAway) and let each task run its billing tail +
/// mark_session_ended before the process exits.
#[derive(Default)]
pub struct ProxyTasks {
    sessions: std::sync::Mutex<Vec<(String, actix_ws::Session)>>,
}

impl ProxyTasks {
    pub fn register(&self, session_id: String, session: actix_ws::Session) {
        if let Ok(mut s) = self.sessions.lock() {
            s.push((session_id, session));
        }
    }
    /// Close and drop the live proxy WS for one session id (used by REST
    /// /streaming/end so ending a WS-owned row also stops the stream).
    pub async fn close_session(&self, session_id: &str) {
        let taken = match self.sessions.lock() {
            Ok(mut s) => {
                let mut i = 0;
                let mut out = None;
                while i < s.len() {
                    if s[i].0 == session_id {
                        out = Some(s.remove(i));
                        break;
                    }
                    i += 1;
                }
                out
            }
            Err(_) => None,
        };
        if let Some((_, s)) = taken {
            let _ = s
                .close(Some(actix_ws::CloseReason {
                    code: actix_ws::CloseCode::Normal,
                    description: Some("session ended".into()),
                }))
                .await;
        }
    }
    /// Remove a session from the registry (called when its proxy task ends
    /// for ANY reason — otherwise the registry leaks one handle per connection
    /// for the life of the process).
    pub fn unregister(&self, session_id: &str) {
        if let Ok(mut s) = self.sessions.lock() {
            s.retain(|(id, _)| id != session_id);
        }
    }
    pub async fn close_all(&self) {
        let sessions = match self.sessions.lock() {
            Ok(mut s) => std::mem::take(&mut *s),
            Err(_) => return,
        };
        for (_, s) in sessions {
            let _ = s
                .close(Some(actix_ws::CloseReason {
                    code: actix_ws::CloseCode::Away,
                    description: Some("server shutdown".into()),
                }))
                .await;
        }
    }
}

/// Product-aware session collection (LiveMorph `morph_sessions` | Secondary `sessions`).
fn session_coll(db: &Db, product: crate::product::ProductId) -> mongodb::Collection<Document> {
    match product {
        crate::product::ProductId::Secondary => db.sessions_secondary(),
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
        tier_multiplier,
    } = ctx;
    // API key must be query-encoded (keys can contain + / =)
    let upstream_url = format!(
        "{}?api_key={}&model={}",
        cfg.decart_signaling_url.trim_end_matches('/'),
        urlencoding::encode(&cfg.decart_api_key),
        urlencoding::encode(model)
    );

    // Bound the upstream dial: while it hangs the claimed slot is held with no
    // stream and no billing (and client Pings keep the 90s silence break from
    // firing), so an unbounded connect would self-lock the user out with 429s.
    let (upstream, _) = tokio::time::timeout(
        std::time::Duration::from_secs(15),
        connect_async(&upstream_url),
    )
    .await
    .map_err(|_| {
        error!("decart upstream connect timed out after 15s");
        std::io::Error::new(std::io::ErrorKind::TimedOut, "upstream connect timed out")
    })?
    .map_err(|e| {
        error!(error = %e, "decart upstream connect failed");
        e
    })?;
    let (mut up_write, mut up_read) = upstream.split();

    let (tx_up, mut rx_up) = mpsc::channel::<String>(256);
    let (tx_client, mut rx_client) = mpsc::channel::<String>(256);

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
    let db_touch = db.clone();
    let sid = session_id.to_string();
    let client_to_up = async {
        // W1: 90s without any client frame = dead connection (network drop) —
        // end the session instead of holding a concurrency slot until the reaper.
        let mut last_touch = std::time::Instant::now();
        loop {
            let msg = match tokio::time::timeout(std::time::Duration::from_secs(90), client_stream.next()).await {
                Ok(m) => m,
                Err(_) => break, // 90s silence — dead connection
            };
            let Some(Ok(msg)) = msg else { break };
            if last_touch.elapsed() >= std::time::Duration::from_secs(1) {
                last_touch = std::time::Instant::now();
                let _ = session_coll(&db_touch, product)
                    .update_one(
                        doc! { "_id": &sid },
                        doc! { "$set": { "last_activity_at": bson::DateTime::from_chrono(Utc::now()) } },
                    )
                    .await;
            }
            match msg {
                actix_ws::Message::Text(t) => {
                    // Cap inbound control frames (set_image base64 can be huge) —
                    // anything past the API body limit is rejected, not forwarded.
                    if t.len() > cfg.max_body_bytes {
                        warn!(len = t.len(), "oversized client frame rejected");
                        let _ = tx_client.try_send(json!({ "type": "error", "error": "frame_too_large" }).to_string());
                        // Drop the frame but KEEP the session: one oversized
                        // image must not end an otherwise healthy stream.
                        continue;
                    }
                    if let Ok(v) = serde_json::from_str::<Value>(&t) {
                        let typ = v.get("type").and_then(|x| x.as_str()).unwrap_or("");
                        match typ {
                            "prompt" | "set_image" => {
                                // Cap prompt text server-side too (chars, not bytes,
                                // to match the REST 4000-char cap on characters).
                                if let Some(p) = v.get("prompt").and_then(|x| x.as_str()) {
                                    if p.chars().count() > 4000 {
                                        let _ = tx_client.try_send(json!({ "type": "error", "error": "prompt_too_long" }).to_string());
                                        continue;
                                    }
                                }
                                let _ = tx_up_c.try_send(t.to_string());
                            }
                            "offer" | "ice-candidate" => {
                                let _ = tx_up_c.try_send(t.to_string());
                            }
                            "ping" => {
                                let _ = tx_client.try_send(json!({ "type": "pong" }).to_string());
                            }
                            other => {
                                // Allowlist only the known signaling/prompt types —
                                // never relay unknown client JSON upstream.
                                warn!(%other, "unknown client message type — rejected");
                                let _ = tx_client.try_send(json!({ "type": "error", "error": "unknown_message_type" }).to_string());
                            }
                        }
                    }
                }
                actix_ws::Message::Close(_) => break,
                // Ping: client keepalive — QWebSocket auto-replies Pong at the
                // protocol level; just keep the loop alive.
                actix_ws::Message::Ping(_) => {}
                actix_ws::Message::Pong(_) => {}
                _ => {}
            }
        }
    };

    // Upstream → client + billing
    let mut last_billed_seconds: f64 = 0.0;
    let cps = cfg.credits_per_second;
    let effective_cps = cps * tier_multiplier;
    let db_bill = db.clone();
    let cfg_bill = cfg.clone();
    let uid = user_id.to_string();
    let sid = session_id.to_string();
    // The per-tick session-row write (generation_seconds/credits_charged) is
    // reporting-only — the authoritative debit is charge_user's atomic user
    // update. Throttle it to <= 1 write per 5 s to cut Mongo write load; the
    // generation_ended final write below stays unconditional.
    let mut last_bill_write = std::time::Instant::now();

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
                                                // WS-row lifecycle: connecting → generating →
                                                // ended. "generating" (not "live") is the
                                                // counted-active state, so concurrent streams
                                                // stay bounded by max_concurrent_sessions.
                                                "status": "generating",
                                            }},
                                        )
                                        .await;
                                }
                            }
                            "generation_started" => {
                                let _ = session_coll(&db_bill, product)
                                    .update_one(
                                        doc! { "_id": &sid },
                                        doc! { "$set": { "status": "generating" } },
                                    )
                                    .await;
                            }
                            "generation_tick" => {
                                let secs = v.get("seconds").and_then(|x| x.as_f64()).unwrap_or(0.0);
                                // Only advance the billing watermark — an upstream
                                // counter reset must never re-bill the same seconds.
                                let delta_secs = (secs - last_billed_seconds).max(0.0);
                                if secs > last_billed_seconds {
                                    last_billed_seconds = secs;
                                }
                                if delta_secs > 0.0 {
                                    let charge = delta_secs * effective_cps;
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
                                        let _ = tokio::time::timeout(
                                            std::time::Duration::from_secs(2),
                                            tx_client.send(json!({
                                                "type": "error",
                                                "error": code,
                                                "code": code
                                            })
                                            .to_string()),
                                        )
                                        .await;
                                        break;
                                    }
                                    let _ = if last_bill_write.elapsed() >= std::time::Duration::from_secs(5) {
                                        last_bill_write = std::time::Instant::now();
                                        session_coll(&db_bill, product)
                                            .update_one(
                                                doc! { "_id": &sid },
                                                doc! { "$set": {
                                                    "generation_seconds": secs,
                                                },
                                                "$inc": { "credits_charged": charge }},
                                            )
                                            .await
                                    } else {
                                        Ok(mongodb::results::UpdateResult::default())
                                    };
                                }
                            }
                            "generation_ended" => {
                                let secs = v
                                    .get("seconds")
                                    .and_then(|x| x.as_f64())
                                    .unwrap_or(last_billed_seconds);
                                // Final charge for any remainder — surface failures so the
                                // tail usage is never silently granted.
                                let delta_secs = (secs - last_billed_seconds).max(0.0);
                                // Advance the watermark on the terminal message too:
                                // a late tick after generation_ended must never
                                // re-bill the same tail.
                                if secs > last_billed_seconds {
                                    last_billed_seconds = secs;
                                }
                                if delta_secs > 0.0 {
                                    let charge = delta_secs * effective_cps;
                                    if let Err(e) = charge_user(
                                        &db_bill, &cfg_bill, &uid, charge, delta_secs, &sid,
                                        product,
                                    )
                                    .await
                                    {
                                        // Surface the failure on the session row so the
                                        // unbilled tail is auditable, not just a log line.
                                        tracing::error!(error = %e, session = %sid, "final generation charge failed — tail unbilled");
                                        let _ = session_coll(&db_bill, product)
                                            .update_one(
                                                doc! { "_id": &sid },
                                                doc! { "$set": { "billing_tail_error": true } },
                                            )
                                            .await;
                                    }
                                }
                                // Record billing tail only — do NOT flip status
                                // here: the spawned task's mark_session_ended is
                                // the single writer that transitions to ended AND
                                // releases the active_sessions slot. Ending the row
                                // directly made that call a no-op and leaked the slot.
                                let _ = session_coll(&db_bill, product)
                                    .update_one(
                                        doc! { "_id": &sid },
                                        doc! { "$set": {
                                            "generation_seconds": secs,
                                        }},
                                    )
                                    .await;
                            }
                            _ => {}
                        }
                    }
                    if tx_client.try_send(text_str).is_err() {
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

    // Drain queued client-bound messages (e.g. a terminal billing error queued
    // right before teardown) so the client sees why the session ended instead
    // of a bare close. The uncompleted select! branches were dropped above,
    // releasing their borrows on rx_client / client.
    while let Ok(text) = rx_client.try_recv() {
        if client.text(text).await.is_err() {
            break;
        }
    }

    // NOTE: do NOT mark the session ended here — the WS handler's spawned task
    // always calls mark_session_ended() right after run_proxy returns, and that
    // is the ONLY place allowed to flip the row (its conditional transition is
    // what releases the active_sessions slot). Ending the row directly here
    // made the outer call a no-op, leaking the slot on every disconnect.

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

    // Atomic debit via aggregation pipeline: bonus-first then credit, each
    // clamped at zero. The `$expr` filter bounds the *total*; this eliminates
    // the read-then-split TOCTOU that could drive a field negative concurrently.
    // ReturnDocument::After gives us the TRUE post-debit balance for the ledger
    // (the old code computed balance_after from a pre-debit read → wrong under
    // concurrent ticks).
    let pipeline = vec![
        doc! {
            "$set": {
                "bonus_balance": {
                    "$max": [
                        { "$subtract": ["$bonus_balance", amount] },
                        0.0,
                    ]
                },
                "credit_balance": {
                    "$max": [
                        {
                            "$subtract": [
                                "$credit_balance",
                                {
                                    "$subtract": [
                                        amount,
                                        { "$min": ["$bonus_balance", amount] },
                                    ]
                                },
                            ]
                        },
                        0.0,
                    ]
                },
                "updated_at": chrono::Utc::now(),
            }
        }
    ];

    let opts = mongodb::options::FindOneAndUpdateOptions::builder()
        .return_document(mongodb::options::ReturnDocument::After)
        .build();
    let updated = match product {
        crate::product::ProductId::Secondary => {
            db.users_secondary()
                .find_one_and_update(filter.clone(), pipeline.clone())
                .with_options(opts.clone())
                .await?
        }
        crate::product::ProductId::LiveMorph => {
            db.users()
                .find_one_and_update(filter, pipeline)
                .with_options(opts)
                .await?
        }
    };
    let Some(updated) = updated else {
        anyhow::bail!("insufficient_credits");
    };

    // 2) Platform pays Decart on the shared API key
    if let Err(e) = crate::services::billing::debit_decart_budget(db, cfg, delta_secs).await {
        // Refund the exact amount back to the platform (credit) balance. The
        // debit was bonus-first, but both balances are interchangeable spendable
        // credits, so a single credit-balance refund preserves the user's total.
        let refund = doc! {
            "$inc": { "credit_balance": amount },
            "$set": { "updated_at": chrono::Utc::now() },
        };
        let _ = match product {
            crate::product::ProductId::Secondary => {
                db.users_secondary()
                    .update_one(doc! { "_id": user_id }, refund)
                    .await
            }
            crate::product::ProductId::LiveMorph => {
                db.users().update_one(doc! { "_id": user_id }, refund).await
            }
        };
        anyhow::bail!("{e}");
    }

    let balance_after = updated.total_credits();
    let entry_id = crate::db::new_id();
    let entry = CreditLedgerEntry {
        id: entry_id.clone(),
        user_id: user_id.to_string(),
        delta: -amount,
        balance_after,
        kind: "usage".into(),
        // Unique per charge: the ledger's unique (ref_id, kind) partial index
        // exists for purchase idempotency — reusing the bare session id here
        // would make every usage row after the first per session violate it
        // (E11000) and silently drop the audit row.
        ref_id: Some(format!("{session_id}:{entry_id}")),
        note: Some("decart generation_tick".into()),
        created_at: bson::DateTime::from_chrono(chrono::Utc::now()),
    };
    // The debit already happened — a ledger-insert failure must NOT propagate
    // (it would report "insufficient_credits"/force-disconnect for a user who
    // was actually debited). Log it; the row is cosmetic vs. the balance.
    let ledger_res = match product {
        crate::product::ProductId::Secondary => {
            db.ledger_secondary().insert_one(&entry).await
        }
        crate::product::ProductId::LiveMorph => {
            db.ledger().insert_one(&entry).await
        }
    };
    if let Err(e) = ledger_res {
        tracing::error!(error = %e, session = %session_id, "ledger insert failed after debit");
    }
    Ok(())
}

async fn mark_session_ended(
    db: &Db,
    user_id: &str,
    session_id: &str,
    reason: &str,
    product: crate::product::ProductId,
) {
    // Transition to ended exactly once: only the caller that actually flips a
    // non-ended row releases the slot, so the reaper and this path can never
    // double-release.
    let ended = session_coll(db, product)
        .find_one_and_update(
            doc! { "_id": session_id, "status": { "$ne": "ended" } },
            doc! { "$set": {
                "status": "ended",
                "ended_at": chrono::Utc::now(),
                "end_reason": reason,
            }},
        )
        .await;
    match ended {
        Ok(Some(_)) => {}
        // Already ended by another writer (reaper / REST end) — that writer
        // owns the slot release, so do nothing.
        Ok(None) => return,
        Err(e) => {
            // Transition error: the slot is NOT released. Log loudly — a
            // transient Mongo blip here would otherwise leak the claim until
            // the next restart (the startup reset is the only other self-heal).
            tracing::error!(error = %e, session = session_id, "mark_session_ended: transition failed, slot NOT released");
            return;
        }
    }
    // Release the atomic session slot (clamped at 0 so double-release can't
    // drive the counter negative). Retry a bounded number of times: this is
    // the only release path besides a restart, so a transient failure must not
    // leak the claim permanently.
    let users = match product {
        crate::product::ProductId::Secondary => db.users_secondary(),
        crate::product::ProductId::LiveMorph => db.users(),
    };
    let release = vec![doc! { "$set": { "active_sessions": { "$max": [
        { "$subtract": [{ "$ifNull": ["$active_sessions", 0] }, 1] }, 0 ] } } }];
    for attempt in 0..3u32 {
        match users
            .update_one(doc! { "_id": user_id }, release.clone())
            .await
        {
            Ok(_) => return,
            Err(e) => {
                tracing::error!(error = %e, attempt, session = session_id, "active_sessions slot release failed");
                if attempt == 2 {
                    return;
                }
                tokio::time::sleep(std::time::Duration::from_millis(100u64 << attempt)).await;
            }
        }
    }
}
