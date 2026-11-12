//! LiveMorph production backend.
//! Auth, credits, catalog, stream metadata, and Decart WS signaling proxy.
//! Media (WebRTC) is peer-to-peer between Qt and Decart — never through this process.

mod auth;
mod config;
mod db;
mod error;
mod models;
mod product;
mod realtime;
mod routes;
mod services;

use actix_cors::Cors;
use actix_web::{
    middleware::{DefaultHeaders, Logger},
    web, App, HttpServer,
};
use config::Config;
use db::Db;
use std::sync::{Arc, LazyLock};
use tracing_subscriber::{fmt, EnvFilter};

/// Per-process instance id, stamped on every session row this process creates.
/// The startup orphan reset only ends rows carrying this id (or legacy rows
/// with none), so multiple replicas can coexist without clobbering each other.
pub static INSTANCE_ID: LazyLock<String> =
    LazyLock::new(|| uuid::Uuid::new_v4().simple().to_string());

#[actix_web::main]
async fn main() -> anyhow::Result<()> {
    let cfg = Config::load().map_err(|e| {
        eprintln!("config error: {e}");
        eprintln!("Copy .env.example → .env and fill required values.");
        e
    })?;

    // Bind the wire id of the second product slot before any request can
    // resolve a product from headers.
    product::init_secondary_id(&cfg.secondary_product_id);

    // Numeric sanity: reject 0/negative/NaN billing values (free streaming,
    // division by zero) regardless of environment.
    if let Err(e) = cfg.validate() {
        anyhow::bail!("invalid config: {e}");
    }

    // rustls (used by tokio-tungstenite / reqwest / lettre) has NO default
    // crypto provider when multiple backends are enabled — install the
    // process default once at startup, otherwise the realtime proxy panics
    // the first time it dials the upstream (wss://api3.decart.ai).
    // AlreadyInstalled is fine (another component installed one first).
    let _ = rustls::crypto::aws_lc_rs::default_provider().install_default();

    fmt()
        .with_env_filter(EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info")))
        .with_target(true)
        .init();

    // ── Startup safety checks ──────────────────────────────────────────
    if cfg.jwt_secret.len() < 32 {
        if cfg.is_production() {
            anyhow::bail!("JWT_SECRET must be at least 32 characters in production");
        }
        tracing::warn!(
            "JWT_SECRET is shorter than 32 characters — use a stronger secret in production"
        );
    }
    if cfg.decart_api_key.starts_with("your-") || cfg.decart_api_key.is_empty() {
        if cfg.is_production() {
            anyhow::bail!("DECART_API_KEY must be set in production");
        }
        tracing::warn!(
            "DECART_API_KEY is not set to a real key — realtime sessions will fail upstream"
        );
    }
    if cfg.is_production() && cfg.allow_manual_payments {
        anyhow::bail!("ALLOW_MANUAL_PAYMENTS must be false in production");
    }
    if cfg.is_production() && cfg.allow_credits_adjust {
        anyhow::bail!("ALLOW_CREDITS_ADJUST must be false in production");
    }
    if cfg.is_production() && cfg.log_otp_codes {
        anyhow::bail!("LOG_OTP_CODES must be false in production");
    }
    if cfg.is_production() {
        let pub_url = cfg.public_base_url.as_str();
        if pub_url.is_empty() || pub_url.contains("127.0.0.1") || pub_url.contains("localhost") {
            tracing::warn!("PUBLIC_BASE_URL looks local — OAuth redirects and payment callbacks will fail for real users");
        }
    }
    if cfg.is_production() && cfg.paystack_secret_key.is_none() {
        tracing::warn!("PAYSTACK_SECRET_KEY unset — paid checkout will fail");
    }
    if cfg
        .nowpayments_api_key
        .as_ref()
        .map(|s| s.is_empty())
        .unwrap_or(true)
    {
        tracing::info!("NOWPAYMENTS_API_KEY unset — USDT/crypto checkout disabled");
    }
    if cfg
        .google_client_id
        .as_ref()
        .map(|s| !s.is_empty())
        .unwrap_or(false)
        != cfg
            .google_client_secret
            .as_ref()
            .map(|s| !s.is_empty())
            .unwrap_or(false)
    {
        tracing::warn!("Google OAuth partially configured — set both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET");
    } else if cfg
        .google_client_id
        .as_ref()
        .map(|s| !s.is_empty())
        .unwrap_or(false)
    {
        tracing::info!("Google OAuth enabled");
    }
    if cfg.is_production() && cfg.smtp_host.is_none() {
        tracing::warn!("SMTP_HOST unset — OTP email delivery will fail in production");
    }
    if cfg.is_production()
        && cfg
            .paystack_secret_key
            .as_ref()
            .map(|s| s.is_empty())
            .unwrap_or(true)
        && cfg
            .paystack_webhook_secret
            .as_ref()
            .map(|s| s.is_empty())
            .unwrap_or(true)
    {
        tracing::warn!(
            "Paystack secrets unset in production — card checkout and webhooks will fail"
        );
    }
    if cfg.is_production()
        && cfg
            .nowpayments_api_key
            .as_ref()
            .map(|s| !s.is_empty())
            .unwrap_or(false)
        && cfg
            .nowpayments_ipn_secret
            .as_ref()
            .map(|s| s.is_empty())
            .unwrap_or(true)
    {
        anyhow::bail!(
            "NOWPAYMENTS_IPN_SECRET required when NOWPAYMENTS_API_KEY is set in production"
        );
    }
    if cfg.is_production()
        && cfg
            .admin_secret
            .as_ref()
            .map(|s| s.len() < 16)
            .unwrap_or(true)
    {
        tracing::warn!("ADMIN_SECRET unset or short — Secondary admin APIs stay locked");
    }

    // Refuse the shipped test/dev JWT secret in any environment — a
    // repo-known signing key must never run, even accidentally in dev.
    // These refusals run BEFORE Db::connect so a refused boot leaves no DB
    // side effects (no ping, no index creation, no catalog seed).
    const SHIPPED_TEST_JWT_SECRET: &str =
        "gl8a/9Sf4LCg5aYL54ZZuyvv0IzPKvsGySi0aO7TjXzt2KFwaHe5RDgyi2RnQrHz";
    if cfg.jwt_secret == SHIPPED_TEST_JWT_SECRET {
        panic!("refusing to boot with the shipped .test.env JWT_SECRET — set a real JWT_SECRET");
    }
    // Same rule for the other shipped test secrets: if .test.env ever loads
    // (ALLOW_TEST_ENV=1) on a deployed host, admin/OTP must not run repo-known.
    const SHIPPED_TEST_SECRETS: &[&str] = &[
        "gl8a/9Sf4LCg5aYL54ZZuyvv0IzPKvsGySi0aO7TjXzt2KFwaHe5RDgyi2RnQrHz", // JWT_SECRET
        "DzdIHOMlGgcnTUGaUbsR+Ln0dO54fnOnhnStGdl6fyE=",                  // ADMIN_SECRET (.test.env)
    ];
    if let Some(ref s) = cfg.admin_secret {
        // Production-only: dev .env legitimately reuses the test admin secret.
        if cfg.is_production() && SHIPPED_TEST_SECRETS.contains(&s.as_str()) {
            panic!("refusing to boot with the shipped .test.env ADMIN_SECRET in production — set a real ADMIN_SECRET");
        }
    }
    // Placeholder secrets shipped in .env.example must never boot in production.
    if cfg.is_production() {
        let low = cfg.jwt_secret.to_ascii_lowercase();
        if low.contains("change-me") || low.contains("your-") || low.contains("placeholder") || low.contains("example") {
            panic!("refusing to boot with a placeholder JWT_SECRET in production — set a real JWT_SECRET");
        }
    }

    let db = Db::connect(&cfg).await?;

    // Per-process instance id stamped on session rows so the startup orphan
    // reset only touches rows owned by THIS process — safe to run with multiple
    // replicas (each only resets its own dead rows).
    let instance_id = crate::INSTANCE_ID.as_str();

    let cfg = Arc::new(cfg);
    let bind = cfg.bind_addr();
    let max_body = cfg.max_body_bytes;

    // Registry of live realtime proxy sessions — used by the shutdown handler
    // to close each WS with 1001 so proxy tasks run their billing tail and
    // mark sessions ended instead of being killed mid-flight.
    let proxy_tasks = web::Data::new(crate::realtime::ProxyTasks::default());
    let proxy_tasks_server = proxy_tasks.clone();

    // ── Startup session-claim reset ───────────────────────────────────
    // A process (re)start kills every WebSocket connection, so any
    // active_sessions claim left over from the previous process is stale by
    // definition — without this, a restart mid-swap leaks the slot and every
    // later handshake gets 429 "maximum concurrent morph sessions reached"
    // until the 10-minute reaper happens to clean the row.
    {
        use chrono::Utc;
        use mongodb::bson::doc;
        // Run inline (awaited) BEFORE HttpServer::run(): a WS accepted in the
        // gap while this ran as a spawned task could have its fresh claim
        // zeroed by the reset. Two update_many calls are cheap at startup.
        // Single-instance assumption: all WS die with this process, so any
        // leftover claim is stale by definition.
        let now = Utc::now();
        let main_coll = db.db.collection::<mongodb::bson::Document>("morph_sessions");
        let sec_coll = db.db_secondary.collection::<mongodb::bson::Document>("sessions");
        // Only rows owned by this instance (or legacy rows with no instance_id)
        // are stale — with >1 replica, other instances' live rows must not be
        // touched.
        let orphan_filter = doc! {
            "status": { "$in": ["connecting", "generating", "live"] },
            "$or": [
                { "instance_id": instance_id },
                { "instance_id": { "$exists": false } },
            ],
        };
        for (coll, users) in [
            (&main_coll, db.users()),
            (&sec_coll, db.users_secondary()),
        ] {
            let res = coll
                .update_many(
                    orphan_filter.clone(),
                    doc! { "$set": {
                        "status": "ended",
                        "end_reason": "server_restart",
                        "ended_at": now,
                    } },
                )
                .await;
            match res {
                Ok(r) if r.modified_count > 0 => tracing::warn!(
                    count = r.modified_count,
                    "startup: marked orphaned sessions ended (server_restart)"
                ),
                Err(e) => tracing::warn!(error = %e, "startup session reset failed"),
                _ => {}
            }
            // Zero active_sessions only for users whose orphaned rows we just
            // ended — never blanket-reset every user (would clobber other
            // replicas' live claims).
            let ended_uids: Vec<String> = match coll
                .distinct("user_id", doc! { "end_reason": "server_restart", "ended_at": now })
                .await
            {
                Ok(v) => v
                    .into_iter()
                    .filter_map(|b| b.as_str().map(|s| s.to_string()))
                    .collect(),
                Err(e) => {
                    tracing::warn!(error = %e, "startup: distinct user_id failed");
                    Vec::new()
                }
            };
            if !ended_uids.is_empty() {
                if let Err(e) = users
                    .update_many(
                        doc! { "_id": { "$in": ended_uids } },
                        doc! { "$set": { "active_sessions": 0 } },
                    )
                    .await
                {
                    tracing::warn!(error = %e, "startup: failed to zero active_sessions claims — stale claims may persist until the reaper");
                }
            }
        }
        tracing::info!("startup: active_sessions claims reset to 0");
    }

    // Crash-recovery: credit any paid orders whose provision crashed mid-flight
    // (provisioned + credit_applied set but no purchase ledger row). Uses the
    // unique ledger index as the exactly-once commit, so it is double-credit-proof.
    match crate::services::billing::reconcile_orphaned_provisions(&db, &cfg).await {
        Ok(n) if n > 0 => tracing::warn!(count = n, "startup: reconciled orphaned provisions"),
        Ok(_) => {}
        Err(e) => tracing::error!(error = %e, "startup: provision reconciler failed"),
    }

    // ── Session reaper: mark stale morph sessions as ended ───────────
    {
        let db = db.clone();
        let cfg_reaper = cfg.clone();
        actix_web::rt::spawn(async move {
            use chrono::{Duration, Utc};
            use mongodb::bson::doc;
            loop {
                actix_web::rt::time::sleep(std::time::Duration::from_secs(60)).await;
                let cutoff = Utc::now() - Duration::minutes(10);
                // Reap by last_activity_at (falling back to started_at for
                // legacy rows). "live" rows from the REST streaming path are
                // included: any session with no activity for 10 min is dead
                // (the client pings / the proxy touches the row), so even
                // long-running live sessions are never killed while active.
                let stale_filter = doc! {
                    "status": { "$in": ["connecting", "generating", "live"] },
                    "$or": [
                        { "last_activity_at": { "$lt": cutoff } },
                        { "last_activity_at": { "$exists": false }, "started_at": { "$lt": cutoff } },
                    ],
                };
                // Per-row conditional transition: re-check the row's status in
                // the update filter so exactly one caller (reaper or proxy task)
                // can flip it to ended — and only then is the slot released.
                // "live" rows are REST intent markers that never claimed a slot,
                // so they are marked ended but never decrement active_sessions.
                async fn reap_collection(
                    coll: &mongodb::Collection<mongodb::bson::Document>,
                    users: &mongodb::Collection<crate::models::User>,
                    stale_filter: &mongodb::bson::Document,
                ) -> u64 {
                    use futures_util::TryStreamExt;
                    let mut reaped = 0u64;
                    let projection = mongodb::options::FindOptions::builder()
                        .projection(doc! { "user_id": 1, "status": 1 })
                        .build();
                    let Ok(mut cur) = coll.find(stale_filter.clone()).with_options(projection).await else {
                        return 0;
                    };
                    while let Ok(Some(d)) = cur.try_next().await {
                        let (Ok(id), Ok(uid), Ok(status)) = (
                            d.get_str("_id"),
                            d.get_str("user_id"),
                            d.get_str("status"),
                        ) else {
                            continue;
                        };
                        let transitioned = coll
                            .find_one_and_update(
                                doc! { "_id": id, "status": status },
                                doc! { "$set": {
                                    "status": "ended",
                                    "end_reason": "reaper_timeout",
                                    "ended_at": Utc::now(),
                                } },
                            )
                            .await;
                        // Only the winner of the conditional transition proceeds,
                        // and only slot-owning rows (connecting/generating) release.
                        if matches!(transitioned, Ok(Some(_)))
                            && (status == "connecting" || status == "generating")
                        {
                            let _ = users
                                .update_one(
                                    doc! { "_id": uid },
                                    vec![doc! { "$set": { "active_sessions": { "$max": [
                                        { "$subtract": [{ "$ifNull": ["$active_sessions", 0] }, 1] }, 0 ] } } }],
                                )
                                .await;
                            reaped += 1;
                        }
                    }
                    reaped
                }
                let n_morph = reap_collection(
                    &db.db.collection::<mongodb::bson::Document>("morph_sessions"),
                    &db.users(),
                    &stale_filter,
                ).await;
                if n_morph > 0 {
                    tracing::warn!(count = n_morph, "reaper: marked stale morph sessions as ended");
                }
                let n_sec = reap_collection(
                    &db.sessions_secondary(),
                    &db.users_secondary(),
                    &stale_filter,
                ).await;
                if n_sec > 0 {
                    tracing::warn!(count = n_sec, "reaper: marked stale secondary sessions as ended");
                }
                // Slot healer: recompute active_sessions from live slot-owning rows
                // (connecting/generating) so a leaked or under-released counter
                // self-corrects within one cycle instead of 429ing until restart.
                {
                    use futures_util::TryStreamExt;
                    for (coll, users) in [
                        (db.db.collection::<mongodb::bson::Document>("morph_sessions"), db.users()),
                        (db.sessions_secondary(), db.users_secondary()),
                    ] {
                        let pipeline = vec![
                            doc! { "$match": { "status": { "$in": ["connecting", "generating"] } } },
                            doc! { "$group": { "_id": "$user_id", "n": { "$sum": 1 } } },
                        ];
                        let mut cur = match coll.aggregate(pipeline).await {
                            Ok(c) => c,
                            Err(_) => continue,
                        };
                        while let Ok(Some(d)) = cur.try_next().await {
                            if let (Ok(uid), Some(n)) =
                                (d.get_str("_id"), d.get("n").and_then(|v| v.as_i64()))
                            {
                                let _ = users
                                    .update_one(doc! { "_id": uid }, doc! { "$set": { "active_sessions": n } })
                                    .await;
                            }
                        }
                    }
                }
                // Audit reconciler on the same cadence (idempotent, audit-only).
                if let Err(e) = crate::services::billing::reconcile_orphaned_provisions(&db, &cfg_reaper).await {
                    tracing::error!(error = %e, "reaper: provision reconciler failed");
                }
                // Pending-order sweeper: re-verify upstream so paid orders settle
                // even if the client never polls (covers providers without an IPN).
                match crate::routes::payments::sweep_pending_orders(&db, &cfg_reaper).await {
                    Ok(n) if n > 0 => tracing::warn!(count = n, "sweeper: provisioned paid orders"),
                    Ok(_) => {}
                    Err(e) => tracing::error!(error = %e, "sweeper: pending-order sweep failed"),
                }
            }
        });
    }

    tracing::info!(
        %bind,
        env = %cfg.rust_env,
        production = cfg.is_production(),
        secondary_product = product::secondary_id(),
        "Platform backend starting (LiveMorph + secondary product slot)"
    );

    let http = HttpServer::new(move || {
        let proxy_tasks = proxy_tasks_server.clone();
        let cors = build_cors(&cfg);

        // Single unified `/api/v1` namespace. Frontend/product identity is carried
        // exclusively by the X-Frontend-Id / X-Client-Product headers (+ WS query).
        // No product-named scopes, no root-level aliases — one backend movement per route.
        let api_v1 = web::scope("/api/v1")
            .configure(routes::health::configure)
            .configure(routes::bootstrap::configure)
            .configure(routes::auth::configure_public)
            .configure(routes::auth::configure_protected)
            .configure(routes::catalog::configure)
            .configure(routes::webrtc::configure)
            .configure(routes::payments::configure_webhooks)
            .configure(routes::payments::configure)
            .configure(routes::credits::configure)
            .configure(routes::stream::configure)
            .configure(routes::recording::configure)
            .configure(routes::app::configure)
            .configure(routes::realtime::configure)
            .configure(routes::keys::configure)
            .configure(routes::settings::configure)
            .configure(routes::streaming::configure)
            .configure(routes::referral::configure)
            .configure(routes::creator::configure)
            .configure(routes::activation::configure)
            .configure(routes::public::configure)
            .configure(routes::user_characters::configure)
            .configure(routes::downloads::configure);

        App::new()
            .app_data(web::Data::new(cfg.clone()))
            .app_data(web::Data::new(db.clone()))
            .app_data(web::JsonConfig::default().limit(max_body))
            .app_data(web::PayloadConfig::default().limit(max_body))
            // Middleware execution is REVERSE of registration order. Register
            // JwtAuth first and Logger last so requests flow:
            // Logger → DefaultHeaders → Cors → JwtAuth → routes
            // (preflight responses then get security headers and are logged).
            .wrap(auth::JwtAuth {
                config: cfg.clone(),
                db: db.clone(),
            })
            .wrap(cors)
            .wrap(
                DefaultHeaders::new()
                    .add(("X-Content-Type-Options", "nosniff"))
                    .add(("X-Frame-Options", "DENY"))
                    .add(("Referrer-Policy", "no-referrer"))
                    .add((
                        "Content-Security-Policy",
                        "default-src 'none'; frame-ancestors 'none'",
                    ))
                    .add(("Cache-Control", "no-store"))
                    .add((
                        "Permissions-Policy",
                        "camera=(), microphone=(), geolocation=()",
                    ))
                    .add(("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")),
            )
            // %U is path-only (no query string) — WS endpoints accept
            // ?token=<jwt> in dev and %r would log those tokens verbatim.
            .wrap(Logger::new(r#"%a "%m %U" %s %b "%{User-Agent}i" %T"#))
            .app_data(proxy_tasks.clone())
            .service(api_v1)
    })
    .shutdown_timeout(30)
    // Reconnect handshakes can legitimately take longer than actix's 5s
    // default slow-request timeout (which otherwise answers 408 and the Qt
    // client reports "Unhandled http status code: 408").
    .client_request_timeout(std::time::Duration::from_secs(30))
    .bind(&bind)?;

    let server = http.run();
    let server_handle = server.handle();
    {
        let tasks = proxy_tasks.clone();
        actix_web::rt::spawn(async move {
            shutdown_signal().await;
            tracing::info!("shutdown signal received — closing realtime sessions gracefully");
            // Bound the WS drain so a stalled peer can't hang shutdown.
            let _ = tokio::time::timeout(
                std::time::Duration::from_secs(5),
                tasks.close_all(),
            )
            .await;
            // Stop accepting new connections immediately; drain in-flight HTTP.
            server_handle.stop(true).await;
            // Give proxy tasks a window to run mark_session_ended + billing tail.
            tokio::time::sleep(std::time::Duration::from_secs(3)).await;
        });
    }
    server.await?;

    Ok(())
}

async fn shutdown_signal() {
    #[cfg(unix)]
    {
        use tokio::signal::unix::{signal, SignalKind};
        // If SIGTERM registration fails, fall back to ctrl_c only (log it) rather
        // than panicking — a panic here would skip the graceful drain below.
        let mut term = match signal(SignalKind::terminate()) {
            Ok(s) => s,
            Err(e) => {
                tracing::warn!(error = %e, "SIGTERM handler registration failed — falling back to ctrl_c only");
                tokio::select! {
                    _ = tokio::signal::ctrl_c() => {},
                }
                return;
            }
        };
        tokio::select! {
            _ = tokio::signal::ctrl_c() => {},
            _ = term.recv() => {},
        }
    }
    #[cfg(not(unix))]
    {
        let _ = tokio::signal::ctrl_c().await;
    }
}

fn build_cors(cfg: &Config) -> Cors {
    if cfg.is_production() {
        let list = cfg.cors_origins.clone().unwrap_or_default();
        let origins: Vec<&str> = list
            .split(',')
            .map(str::trim)
            .filter(|s| !s.is_empty())
            .collect();
        if origins.is_empty() {
            tracing::info!(
                "CORS: production with empty CORS_ORIGINS — denying browser cross-origin"
            );
            return Cors::default();
        }
        let mut c = Cors::default()
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE", "OPTIONS"])
            .allowed_headers(vec![
                actix_web::http::header::AUTHORIZATION,
                actix_web::http::header::ACCEPT,
                actix_web::http::header::CONTENT_TYPE,
            ])
            .allowed_header(actix_web::http::header::HeaderName::from_static(
                "x-frontend-id",
            ))
            .allowed_header(actix_web::http::header::HeaderName::from_static(
                "x-client-product",
            ))
            .allowed_header(actix_web::http::header::HeaderName::from_static(
                "x-device-id",
            ))
            .allowed_header(actix_web::http::header::HeaderName::from_static(
                "x-app-version",
            ))
            .max_age(3600);
        for origin in origins {
            c = c.allowed_origin(origin);
        }
        c
    } else {
        Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600)
    }
}
