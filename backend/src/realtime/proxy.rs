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

#[derive(Clone)]
struct ByteBudget {
    used: Arc<std::sync::atomic::AtomicUsize>,
    cap: usize,
}

impl ByteBudget {
    fn new(cap: usize) -> Self {
        Self {
            used: Arc::new(std::sync::atomic::AtomicUsize::new(0)),
            cap,
        }
    }

    fn reserve(&self, bytes: usize) -> bool {
        let mut current = self.used.load(std::sync::atomic::Ordering::Acquire);
        loop {
            let Some(next) = current.checked_add(bytes) else {
                return false;
            };
            if next > self.cap {
                return false;
            }
            match self.used.compare_exchange_weak(
                current,
                next,
                std::sync::atomic::Ordering::AcqRel,
                std::sync::atomic::Ordering::Acquire,
            ) {
                Ok(_) => return true,
                Err(actual) => current = actual,
            }
        }
    }

    fn try_send_text(
        &self,
        tx: &mpsc::Sender<String>,
        text: String,
    ) -> Result<(), ()> {
        let bytes = text.len();
        if !self.reserve(bytes) {
            return Err(());
        }
        match tx.try_send(text) {
            Ok(()) => Ok(()),
            Err(_) => {
                self.used
                    .fetch_sub(bytes, std::sync::atomic::Ordering::SeqCst);
                Err(())
            }
        }
    }

    async fn send_text(&self, tx: &mpsc::Sender<String>, text: String) -> Result<(), ()> {
        let bytes = text.len();
        if !self.reserve(bytes) {
            return Err(());
        }
        match tx.send(text).await {
            Ok(()) => Ok(()),
            Err(_) => {
                self.used
                    .fetch_sub(bytes, std::sync::atomic::Ordering::SeqCst);
                Err(())
            }
        }
    }

    async fn recv_text(&self, rx: &mut mpsc::Receiver<String>) -> Option<String> {
        let text = rx.recv().await?;
        self.used
            .fetch_sub(text.len(), std::sync::atomic::Ordering::SeqCst);
        Some(text)
    }

    fn try_recv_text(&self, rx: &mut mpsc::Receiver<String>) -> Option<String> {
        let text = rx.try_recv().ok()?;
        self.used
            .fetch_sub(text.len(), std::sync::atomic::Ordering::SeqCst);
        Some(text)
    }
}

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

    // Rate-limit WS handshakes per (user, ip) BEFORE any DB write: each
    // handshake inserts a session row, so an unthrottled single credential
    // could exhaust DB writes/storage.
    {
        let ip = crate::auth::client_ip(&req);
        let key = format!("{}:{}", claims.sub, ip);
        if !crate::auth::check_rate_limit(&key, "ws-realtime", 20, 60)
            || !crate::auth::check_rate_limit(&ip, "ws-realtime-ip", 40, 60)
        {
            return Err(actix_web::error::ErrorTooManyRequests("too many realtime connections"));
        }
    }

    // Reject cross-origin WS upgrades (defense-in-depth; desktop client sends
    // no Origin header and is allowed through).
    if !crate::auth::ratelimit::ws_origin_ok(&req, &cfg) {
        return Err(actix_web::error::ErrorForbidden("cross-origin websocket rejected"));
    }
    if crate::services::streaming::streaming_disabled_by_operator() {
        return Err(actix_web::error::ErrorServiceUnavailable(
            "streaming is temporarily unavailable",
        ));
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

    // Bind the billed tier to the EXACT REST session-start intent when the
    // client supplies session_id. Older clients get a short-window fallback;
    // an arbitrary older "live" row can no longer change this stream's tier.
    let intent_tier = if let Some(intent_id) = q.get("session_id") {
        let row = session_coll(&db, product)
            .find_one(doc! {
                "_id": intent_id,
                "user_id": &claims.sub,
                "status": "live",
            })
            .await
            .map_err(|e| {
                tracing::error!(error = %e, "session intent lookup failed");
                actix_web::error::ErrorInternalServerError("database error")
            })?
            .ok_or_else(|| actix_web::error::ErrorBadRequest("unknown session intent"))?;
        row.get_str("tier").ok().map(str::to_string)
    } else {
        let recent = Utc::now() - chrono::Duration::seconds(60);
        session_coll(&db, product)
            .find_one(doc! {
                "user_id": &claims.sub,
                "status": "live",
                "started_at": { "$gte": recent },
            })
            .with_options(
                mongodb::options::FindOneOptions::builder()
                    .sort(doc! { "started_at": -1 })
                    .build(),
            )
            .await
            .map_err(|e| {
                tracing::error!(error = %e, "recent session intent lookup failed");
                actix_web::error::ErrorInternalServerError("database error")
            })?
            .and_then(|row| row.get_str("tier").ok().map(str::to_string))
    };
    let requested_tier = intent_tier.unwrap_or(tier);
    // HD is a request that requires entitlement. An HD-entitled user choosing
    // standard pays the standard rate; a non-entitled user requesting HD is
    // rejected instead of silently receiving HD service or an HD surcharge.
    if requested_tier == "hd" && !user.hd_entitled() {
        return Err(actix_web::error::ErrorForbidden(
            "HD tier requires an eligible paid plan",
        ));
    }
    tier = if requested_tier == "hd" { "hd".into() } else { "standard".into() };
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
                if claimed.matched_count == 0 {
                    // A rollback that ended the previous row but failed to
                    // release its counter must not lock the user out forever.
                    // Re-prove there is no slot-owning row after the grace
                    // window, then reset only this user's stale counter and
                    // retry the atomic claim once. The per-instance healer
                    // corrects any delayed release race within one cycle.
                    let remaining = session_coll(&db, product)
                        .count_documents(doc! {
                            "user_id": &claims.sub,
                            "_id": { "$ne": &session_id },
                            "status": { "$in": ["connecting", "generating"] },
                        })
                        .await
                        .map_err(|e| {
                            tracing::warn!(error = %e, "WS stale counter recheck failed");
                            actix_web::error::ErrorInternalServerError("internal error")
                        })?;
                    if remaining == 0 {
                        let _ = users
                            .update_one(
                                doc! { "_id": &claims.sub },
                                doc! { "$set": { "active_sessions": 0 } },
                            )
                            .await;
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
                            .map_err(|e| {
                                tracing::warn!(error = %e, "WS stale counter claim failed");
                                actix_web::error::ErrorInternalServerError("internal error")
                            })?;
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
    let (res, mut session, msg_stream) = match actix_ws::handle(&req, stream) {
        Ok(v) => v,
        Err(e) => {
            mark_session_ended(&db, &claims.sub, &session_id, "upgrade_failed", product).await;
            return Err(e);
        }
    };
    // Raise the per-frame cap to MAX_BODY_BYTES (actix-ws defaults to 64 KiB,
    // which would kill the session on a large set_image) and aggregate
    // continuation frames so fragmented messages are reassembled.
    let max_frame = cfg.max_body_bytes;
    let mut msg_stream = msg_stream
        .max_frame_size(max_frame)
        .aggregate_continuations()
        .max_continuation_size(max_frame);

    let cfg = cfg.clone();
    let db = db.clone();
    let user_id = claims.sub.clone();
    let product_for_bill = product;
    let tasks = req.app_data::<web::Data<ProxyTasks>>().cloned();
    // Register the session clone BEFORE the task moves `session`.
    let session_for_registry = session.clone();
    let tasks_for_task = tasks.clone();
    if let Some(tasks) = &tasks {
        if !tasks.register(session_id.clone(), session_for_registry) {
            mark_session_ended(&db, &claims.sub, &session_id, "server_capacity", product).await;
            let _ = session
                .close(Some(actix_ws::CloseReason {
                    code: actix_ws::CloseCode::Policy,
                    description: Some("server session capacity reached".into()),
                }))
                .await;
            return Ok(res);
        }
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
    pub fn register(&self, session_id: String, session: actix_ws::Session) -> bool {
        const MAX_PROXY_SESSIONS: usize = 1024;
        if let Ok(mut s) = self.sessions.lock() {
            // Hard resource bound: a reconnect loop cannot grow the registry
            // without limit. The caller closes the rejected socket and row.
            if s.len() >= MAX_PROXY_SESSIONS {
                return false;
            }
            s.push((session_id, session));
            return true;
        }
        false
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
    client_stream: &mut actix_ws::AggregatedMessageStream,
) -> anyhow::Result<()> {
    let ProxySessionCtx {
        user_id,
        session_id,
        model,
        product,
        tier_multiplier,
    } = ctx;
    // Clone the session handle up front so the Ping handler can pong without
    // holding a borrow on `client` across the async blocks.
    let mut session_ping = client.clone();
    // API key must be query-encoded (keys can contain + / =)
    let upstream_url = format!(
        "{}?api_key={}&model={}",
        cfg.decart_signaling_url.trim_end_matches('/'),
        urlencoding::encode(&cfg.decart_api_key),
        urlencoding::encode(model)
    );
    // Never log the full URL: tungstenite error variants can embed the request
    // URI, which carries ?api_key=… — strip the query for any log output.
    let upstream_log = upstream_url.split('?').next().unwrap_or(&upstream_url).to_string();

    // Bound the upstream dial: while it hangs the claimed slot is held with no
    // stream and no billing (and client Pings keep the 90s silence break from
    // firing), so an unbounded connect would self-lock the user out with 429s.
    info!(session = %session_id, "run_proxy: connecting to decart upstream");
    let (upstream, _) = tokio::time::timeout(
        std::time::Duration::from_secs(15),
        connect_async(&upstream_url),
    )
    .await
    .map_err(|_| {
        error!(session = %session_id, "decart upstream connect timed out after 15s");
        std::io::Error::new(std::io::ErrorKind::TimedOut, "upstream connect timed out")
    })?
    .inspect_err(|e| {
        // Log only the error KIND plus the query-stripped URL — never the raw
        // Display, which can contain the api_key query parameter.
        let kind = match e {
            tokio_tungstenite::tungstenite::Error::Io(ioe) => format!("io:{:?}", ioe.kind()),
            other => format!("{:?}", std::mem::discriminant(other)),
        };
        error!(session = %session_id, url = %upstream_log, error_kind = %kind, "decart upstream connect failed");
    })?;
    info!(session = %session_id, "run_proxy: decart upstream connected");
    let (mut up_write, mut up_read) = upstream.split();

    // Message count alone is not a memory bound: each queue is also capped at
    // 4 request bodies, so stalled peers cannot accumulate unbounded strings.
    let budget_up = ByteBudget::new(cfg.max_body_bytes.saturating_mul(4));
    let budget_client = ByteBudget::new(cfg.max_body_bytes.saturating_mul(4));
    let (tx_up, mut rx_up) = mpsc::channel::<String>(256);
    let (tx_client, mut rx_client) = mpsc::channel::<String>(256);

    // Writer tasks
    let budget_up_writer = budget_up.clone();
    let mut up_writer = {
        tokio::spawn(async move {
            while let Some(text) = budget_up_writer.recv_text(&mut rx_up).await {
                // A stalled upstream must not park this task forever with the
                // session slot held. Bound each write; select!/abort below
                // guarantees cancellation when any other branch ends.
                if tokio::time::timeout(
                    std::time::Duration::from_secs(10),
                    up_write.send(WsMessage::Text(text.into())),
                )
                .await
                .is_err()
                {
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
            let msg = match msg {
                Some(Ok(m)) => m,
                Some(Err(e)) => {
                    // Frame-level error (e.g. overflow past the configured cap):
                    // tell the client why, then end — don't silently kill a
                    // healthy billing session.
                    warn!(error = %e, "client WS frame error — ending session");
                    let _ = budget_client.try_send_text(&tx_client,json!({ "type": "error", "error": "frame_too_large" }).to_string());
                    break;
                }
                None => break,
            };
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
                actix_ws::AggregatedMessage::Text(t) => {
                    // Cap inbound control frames (set_image base64 can be huge) —
                    // anything past the API body limit is rejected, not forwarded.
                    if t.len() > cfg.max_body_bytes {
                        warn!(len = t.len(), "oversized client frame rejected");
                        let _ = budget_client.try_send_text(&tx_client,json!({ "type": "error", "error": "frame_too_large" }).to_string());
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
                                        let _ = budget_client.try_send_text(&tx_client,json!({ "type": "error", "error": "prompt_too_long" }).to_string());
                                        continue;
                                    }
                                }
                                // Bounded send: a full upstream channel must not
                                // silently drop an SDP/offer or image — wait briefly,
                                // and if still full, fail the session loudly.
                                if tokio::time::timeout(
                                    std::time::Duration::from_secs(5),
                                    budget_up.send_text(&tx_up_c, t.to_string()),
                                ).await.is_err() {
                                    warn!("upstream channel full — dropping signaling frame");
                                    let _ = budget_client.try_send_text(&tx_client,json!({ "type": "error", "error": "upstream_backpressure" }).to_string());
                                }
                            }
                            "offer" | "ice-candidate" => {
                                if tokio::time::timeout(
                                    std::time::Duration::from_secs(5),
                                    budget_up.send_text(&tx_up_c, t.to_string()),
                                ).await.is_err() {
                                    warn!("upstream channel full — offer/ICE dropped");
                                    let _ = budget_client.try_send_text(&tx_client,json!({ "type": "error", "error": "upstream_backpressure" }).to_string());
                                }
                            }
                            "ping" => {
                                let _ = budget_client.try_send_text(&tx_client,json!({ "type": "pong" }).to_string());
                            }
                            other => {
                                // Allowlist only the known signaling/prompt types —
                                // never relay unknown client JSON upstream.
                                warn!(%other, "unknown client message type — rejected");
                                let _ = budget_client.try_send_text(&tx_client,json!({ "type": "error", "error": "unknown_message_type" }).to_string());
                            }
                        }
                    } else {
                        // Non-JSON input is rejected explicitly instead of
                        // disappearing silently into the signaling channel.
                        let _ = budget_client.try_send_text(&tx_client,json!({ "type": "error", "error": "invalid_json" }).to_string());
                    }
                }
                actix_ws::AggregatedMessage::Close(_) => break,
                // Protocol-level keepalive: answer Ping with Pong so clients
                // that rely on transport pings don't drop the connection.
                actix_ws::AggregatedMessage::Ping(p) => {
                    let _ = session_ping.pong(&p).await;
                }
                actix_ws::AggregatedMessage::Pong(_) => {}
                _ => {}
            }
        }
    };

    // Upstream → client + billing
    let mut last_billed_seconds: f64 = 0.0;
    // Billing identity starts as this WS row, then becomes Decart's stable
    // session id once known, so reconnects with a new WS row cannot re-bill.
    let mut billing_epoch = session_id.to_string();
    let cps = cfg.credits_per_second;
    let effective_cps = cps * tier_multiplier;
    let db_bill = db.clone();
    let cfg_bill = cfg.clone();
    let uid = user_id.to_string();
    let sid = session_id.to_string();
    // The per-tick row write is both reporting and the reconnect-safe billing
    // watermark. It is written only after a successful debit, never before.

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
                                    billing_epoch = dsid.to_string();
                                    // Resume the watermark from the previous WS row for
                                    // THIS Decart session (not a different/new upstream
                                    // session). Duplicate ticks after reconnect become 0.
                                    if let Ok(Some(previous)) = session_coll(&db_bill, product)
                                        .find_one(doc! {
                                            "decart_session_id": dsid,
                                            "_id": { "$ne": &sid },
                                        })
                                        .with_options(
                                            mongodb::options::FindOneOptions::builder()
                                                .sort(doc! { "started_at": -1 })
                                                .build(),
                                        )
                                        .await
                                    {
                                        let previous_secs = previous
                                            .get_f64("billed_watermark")
                                            .ok()
                                            .or_else(|| previous.get_f64("generation_seconds").ok());
                                        if let Some(previous_secs) = previous_secs {
                                            if previous_secs.is_finite() {
                                                last_billed_seconds = last_billed_seconds.max(previous_secs);
                                            }
                                        }
                                    }
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
                                // Billing watermark: delta never re-bills paid seconds
                                // even if the upstream counter resets. Advance it ONLY
                                // after a successful charge — a failed charge must be
                                // retried on the next tick, not silently forgiven.
                                let delta_secs = (secs - last_billed_seconds).max(0.0);
                                if delta_secs > 0.0 {
                                    let charge = delta_secs * effective_cps;
                                    let mut charged = false;
                                    match charge_user(
                                        &db_bill, &cfg_bill, &uid, charge, delta_secs, &sid,
                                        &format!("{billing_epoch}:tick:{secs}"),
                                        product,
                                    )
                                    .await
                                    {
                                        Ok(()) => {
                                            charged = true;
                                            // Charge succeeded — now commit the watermark.
                                            if secs > last_billed_seconds {
                                                last_billed_seconds = secs;
                                            }
                                        }
                                        Err(e) => {
                                            let err_msg = e.to_string();
                                            // Classify by stable machine-readable prefixes,
                                            // never by prose substring.
                                            let (code, terminal) = if err_msg == "insufficient_credits" {
                                                ("insufficient_credits", true)
                                            } else if err_msg.starts_with("platform_budget_exhausted") {
                                                ("platform_budget_exhausted", true)
                                            } else {
                                                // Transient (DB/IO) — do NOT advance the
                                                // watermark and do NOT kill the session;
                                                // the next tick retries the same delta.
                                                warn!(error = %e, "billing transient error — will retry next tick");
                                                ("billing_error", false)
                                            };
                                            if terminal {
                                                warn!(error = %e, "billing failed — forcing disconnect");
                                                let _ = tokio::time::timeout(
                                                    std::time::Duration::from_secs(2),
                                                    budget_client.send_text(&tx_client, json!({
                                                        "type": "error",
                                                        "error": code,
                                                        "code": code
                                                    })
                                                    .to_string()),
                                                )
                                                .await;
                                                break;
                                            }
                                        }
                                    }
                                    if charged {
                                        let _ = session_coll(&db_bill, product)
                                            .update_one(
                                                doc! { "_id": &sid },
                                                doc! {
                                                    "$set": {
                                                        "generation_seconds": secs,
                                                        "billed_watermark": last_billed_seconds,
                                                    },
                                                    "$inc": { "credits_charged": charge },
                                                },
                                            )
                                            .await;
                                    }
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
                                let mut final_charge = 0.0;
                                if delta_secs > 0.0 {
                                    let charge = delta_secs * effective_cps;
                                    if let Err(e) = charge_user(
                                        &db_bill, &cfg_bill, &uid, charge, delta_secs, &sid,
                                        &format!("{billing_epoch}:final:{secs}"),
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
                                    } else {
                                        final_charge = charge;
                                        if secs > last_billed_seconds {
                                            // Advance the terminal watermark only after the
                                            // charge succeeded, so a late tick never re-bills.
                                            last_billed_seconds = secs;
                                        }
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
                                        doc! {
                                            "$set": {
                                                "generation_seconds": secs,
                                                "billed_watermark": last_billed_seconds,
                                            },
                                            "$inc": { "credits_charged": final_charge },
                                        },
                                    )
                                    .await;
                            }
                            _ => {}
                        }
                    }
                    // Bounded send: a full client channel means a stalled client —
                    // apply brief backpressure instead of tearing down a healthy,
                    // billing session. Only give up if the client is truly stuck.
                    if tokio::time::timeout(
                        std::time::Duration::from_secs(10),
                        budget_client.send_text(&tx_client, text_str),
                    ).await.is_err() {
                        warn!("client channel full for 10s — ending session");
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
        while let Some(text) = budget_client.recv_text(&mut rx_client).await {
            if client.text(text).await.is_err() {
                break;
            }
        }
    };

    let select_result = tokio::select! {
        biased;
        _ = client_to_up => "client_to_up",
        _ = upstream_to_client => "upstream_to_client",
        _ = client_writer => "client_writer",
        _ = &mut up_writer => "up_writer",
    };
    info!(session = %session_id, "run_proxy: select! returned, branch={}", select_result);
    // No writer is allowed to outlive the proxy loop: abort even if the
    // upstream socket is blocked in send(), then drain the client error tail.
    up_writer.abort();
    let _ = up_writer.await;

    // Drain queued client-bound messages (e.g. a terminal billing error queued
    // right before teardown) so the client sees why the session ended instead
    // of a bare close. The uncompleted select! branches were dropped above,
    // releasing their borrows on rx_client / client.
    while let Some(text) = budget_client.try_recv_text(&mut rx_client) {
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

#[allow(clippy::too_many_arguments)]
async fn charge_user(
    db: &Db,
    cfg: &Config,
    user_id: &str,
    amount: f64,
    delta_secs: f64,
    session_id: &str,
    charge_id: &str,
    product: crate::product::ProductId,
) -> anyhow::Result<()> {
    if amount <= 0.0 {
        return Ok(());
    }
    let users_coll = match product {
        crate::product::ProductId::Secondary => db.users_secondary(),
        crate::product::ProductId::LiveMorph => db.users(),
    };
    let already_billed = users_coll
        .count_documents(doc! { "_id": user_id, "billed_charges": charge_id })
        .await?
        > 0;
    let already_refunded = users_coll
        .count_documents(doc! { "_id": user_id, "refunded_charges": charge_id })
        .await?
        > 0;
    if already_refunded {
        // A previous budget failure was already compensated. Never burn budget
        // or debit this deterministic charge again.
        anyhow::bail!("platform_budget_exhausted: charge was already refunded");
    }

    if !already_billed {
        // Exactly-once debit: the charge id and balance guard are committed in
        // the SAME atomic update. A duplicate tick, reconnect, or process crash
        // can never debit this charge twice.
        let filter = doc! {
            "_id": user_id,
            "billed_charges": { "$ne": charge_id },
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
        let pipeline = vec![doc! {
            "$set": {
                "bonus_balance": {
                    "$max": [{ "$subtract": ["$bonus_balance", amount] }, 0.0]
                },
                "credit_balance": {
                    "$max": [{
                        "$subtract": [
                            "$credit_balance",
                            { "$subtract": [amount, { "$min": ["$bonus_balance", amount] }] }
                        ]
                    }, 0.0]
                },
                "billed_charges": { "$slice": [
                    { "$concatArrays": [{ "$ifNull": ["$billed_charges", []] }, [charge_id]] },
                    -10_000
                ] },
                "updated_at": chrono::Utc::now(),
            }
        }];
        let updated = users_coll
            .find_one_and_update(filter, pipeline)
            .with_options(
                mongodb::options::FindOneAndUpdateOptions::builder()
                    .return_document(mongodb::options::ReturnDocument::After)
                    .build(),
            )
            .await?;
        if updated.is_none()
            && users_coll
                .count_documents(doc! { "_id": user_id, "billed_charges": charge_id })
                .await?
                == 0
        {
            anyhow::bail!("insufficient_credits");
        }
    }

    // The platform budget uses the SAME deterministic charge id, so a crash
    // after the user debit but before/after the wallet burn is replay-safe.
    if let Err(e) = crate::services::billing::debit_decart_budget(db, cfg, delta_secs, charge_id).await {
        // Compensate the user exactly once. A retry after this refund returns
        // the already_refunded branch above, never another credit/debit cycle.
        let mut refunded = false;
        for attempt in 0..3 {
            match users_coll
                .find_one_and_update(
                    doc! { "_id": user_id, "refunded_charges": { "$ne": charge_id } },
                    doc! {
                        "$inc": { "credit_balance": amount },
                        "$push": { "refunded_charges": { "$each": [charge_id], "$slice": -10_000 } },
                        "$set": { "updated_at": chrono::Utc::now() },
                    },
                )
                .await
            {
                Ok(_) => {
                    refunded = true;
                    break;
                }
                Err(re) => {
                    tracing::warn!(error = %re, attempt, "billing refund attempt failed");
                    tokio::time::sleep(std::time::Duration::from_millis(50u64 << attempt)).await;
                }
            }
        }
        if !refunded {
            tracing::error!(
                amount,
                session = %session_id,
                "billing refund FAILED after retries — user debited without budget burn; reconcile manually"
            );
        }
        anyhow::bail!("platform_budget_exhausted: {e}");
    }

    let balance_after = users_coll
        .find_one(doc! { "_id": user_id })
        .await?
        .map(|u| u.total_credits())
        .unwrap_or(0.0);
    let entry_id = crate::db::new_id();
    let entry = CreditLedgerEntry {
        id: entry_id,
        user_id: user_id.to_string(),
        delta: -amount,
        balance_after,
        kind: "usage".into(),
        // Deterministic id: the unique (ref_id, kind) index deduplicates audit
        // rows, while billed_charges above is authoritative for the debit.
        ref_id: Some(format!("{session_id}:{charge_id}")),
        note: Some("decart generation_tick".into()),
        created_at: bson::DateTime::from_chrono(chrono::Utc::now()),
    };
    let ledger_res = match product {
        crate::product::ProductId::Secondary => db.ledger_secondary().insert_one(&entry).await,
        crate::product::ProductId::LiveMorph => db.ledger().insert_one(&entry).await,
    };
    if let Err(e) = ledger_res {
        if !e.to_string().contains("E11000") {
            tracing::error!(error = %e, session = %session_id, "ledger insert failed after debit");
        }
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
    // Transition to ended exactly once, and ONLY from a slot-owning live
    // state. `$ne: ended` allowed a reaper-ended row to be resurrected and
    // released a second time; a terminal row must stay terminal.
    let ended = session_coll(db, product)
        .find_one_and_update(
            doc! { "_id": session_id, "status": { "$in": ["connecting", "generating"] } },
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

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn byte_budget_rejects_overfill_and_recovers_after_receive() {
        let (tx, mut rx) = mpsc::channel::<String>(8);
        let budget = ByteBudget::new(10);
        assert!(budget.try_send_text(&tx, "12345".into()).is_ok());
        assert!(budget.try_send_text(&tx, "67890".into()).is_ok());
        assert!(budget.try_send_text(&tx, "x".into()).is_err());
        assert_eq!(budget.recv_text(&mut rx).await.unwrap(), "12345");
        assert_eq!(budget.recv_text(&mut rx).await.unwrap(), "67890");
        assert!(budget.try_send_text(&tx, "ok".into()).is_ok());
    }

    #[test]
    fn byte_budget_never_accepts_an_oversized_single_frame() {
        let (tx, _rx) = mpsc::channel::<String>(8);
        let budget = ByteBudget::new(4);
        assert!(budget.try_send_text(&tx, "12345".into()).is_err());
    }
}
