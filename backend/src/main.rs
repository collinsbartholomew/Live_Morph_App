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
use std::sync::Arc;
use tracing_subscriber::{fmt, EnvFilter};

#[actix_web::main]
async fn main() -> anyhow::Result<()> {
    let cfg = Config::from_env().map_err(|e| {
        eprintln!("config error: {e}");
        eprintln!("Copy .env.example → .env and fill required values.");
        e
    })?;

    fmt()
        .with_env_filter(EnvFilter::from_default_env())
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
        tracing::warn!("ADMIN_SECRET unset or short — LiveEscape admin APIs stay locked");
    }

    let db = Db::connect(&cfg).await?;
    let cfg = Arc::new(cfg);
    let bind = cfg.bind_addr();
    let max_body = cfg.max_body_bytes;

    tracing::info!(
        %bind,
        env = %cfg.rust_env,
        production = cfg.is_production(),
        "Platform backend starting (LiveMorph + Live Escape routes)"
    );

    HttpServer::new(move || {
        let cors = build_cors(&cfg);

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
            .configure(routes::public::configure);

        // ── Root-scope services (no prefix) ─────────────────────────────────
        // All root-level routes must live in a SINGLE scope to avoid Actix
        // returning 404 on the first empty-prefix scope that doesn't have the route.
        let root = web::scope("")
            .configure(routes::realtime::configure_aliases)
            .configure(routes::payments::configure_webhook_aliases)
            .configure(routes::bootstrap::configure_root)
            .configure(routes::keys::configure)
            .configure(routes::settings::configure)
            .configure(routes::streaming::configure)
            .configure(routes::referral::configure)
            .configure(routes::creator::configure)
            .configure(routes::activation::configure)
            .configure(routes::public::configure);

        App::new()
            .app_data(web::Data::new(cfg.clone()))
            .app_data(web::Data::new(db.clone()))
            .app_data(web::JsonConfig::default().limit(max_body))
            .app_data(web::PayloadConfig::default().limit(max_body))
            .wrap(Logger::default())
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
            .wrap(cors)
            .wrap(auth::JwtAuth {
                config: cfg.clone(),
            })
            .service(api_v1)
            .service(root)
    })
    .bind(&bind)?
    .run()
    .await?;

    Ok(())
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
