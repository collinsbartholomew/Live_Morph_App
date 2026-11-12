use crate::auth::{
    decode_refresh, generate_otp, hash_otp, hash_password, issue_pair_for, validate_email, verify_otp,
    verify_password, AuthUser,
};
use crate::config::Config;
use crate::db::{new_id, Db};
use crate::error::{AppError, AppResult};
use crate::models::{CreditLedgerEntry, OtpChallenge, User};
use crate::product::ProductId;
use crate::services::google_oauth;
use actix_web::{get, post, web, HttpMessage, HttpRequest, HttpResponse};
use chrono::{Duration, Utc};
use mongodb::bson::doc;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::sync::Arc;
use tracing::info;

pub fn configure_public(cfg: &mut web::ServiceConfig) {
    cfg.service(request_otp)
        .service(verify_otp_login)
        .service(register_password)
        .service(login_password)
        .service(password_reset_request)
        .service(password_reset_complete)
        .service(refresh)
        .service(oauth_google_start)
        .service(oauth_google_callback)
        .service(oauth_google_poll)
        .service(oauth_google_exchange)
        .service(oauth_google_status);
}

pub fn configure_protected(cfg: &mut web::ServiceConfig) {
    cfg.service(me)
        .service(logout)
        .service(logout_all)
        .service(export_data)
        .service(delete_account)
        .service(clear_session);
}

#[derive(Deserialize)]
pub struct EmailBody {
    pub email: String,
}

#[derive(Deserialize)]
pub struct VerifyBody {
    pub email: String,
    pub code: String,
    #[serde(default)]
    pub device_id: Option<String>,
}

#[derive(Deserialize)]
#[allow(dead_code)]
pub struct PasswordRegister {
    pub email: String,
    pub password: String,
    #[serde(default)]
    pub display_name: Option<String>,
    #[serde(default)]
    pub name: Option<String>,
    #[serde(default)]
    pub phone: Option<String>,
    #[serde(default)]
    pub referral_code: Option<String>,
    #[serde(default)]
    pub ref_code: Option<String>,
    #[serde(default)]
    pub accepted_terms: Option<bool>,
    #[serde(default)]
    pub device_id: Option<String>,
}

#[derive(Deserialize)]
pub struct PasswordLogin {
    pub email: String,
    pub password: String,
    #[serde(default)]
    pub device_id: Option<String>,
}

#[derive(Deserialize)]
pub struct RefreshBody {
    pub refresh_token: String,
}

#[derive(Deserialize)]
pub struct ResetRequestBody {
    pub email: String,
}

#[derive(Deserialize)]
#[allow(dead_code)]
pub struct ResetCompleteBody {
    pub token: String,
    pub password: String,
    #[serde(default)]
    pub email: Option<String>,
}

#[post("/auth/password-reset-request")]
async fn password_reset_request(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Json<ResetRequestBody>,
) -> AppResult<HttpResponse> {
    let product = ProductId::from_request(&req);
    let ip = crate::auth::client_ip(&req);
    if !crate::auth::check_rate_limit(
        &ip,
        "password-reset",
        cfg.auth_max_attempts,
        cfg.auth_lockout_secs.max(1) as u64,
    ) {
        return Err(AppError::RateLimited(format!(
            "too many password reset attempts — try again in {} seconds",
            cfg.auth_lockout_secs.max(1)
        )));
    }
    validate_email(&body.email)?;
    let email = body.email.trim().to_lowercase();
    // Don't leak account existence.
    let exists = user_store(&db, product)
        .find_one(doc! { "email": &email })
        .await?
        .is_some();
    if !exists {
        return Ok(HttpResponse::Ok().json(json!({
            "ok": true,
            "message": "If your email is registered, a reset link has been sent."
        })));
    }
    let token = uuid::Uuid::new_v4().to_string().replace('-', "");
    let th = hash_token(&token);
    let coll = reset_token_store(&db, product);
    coll.insert_one(doc! {
        "_id": new_id(),
        "email": &email,
        "product": product.as_str(),
        "token_hash": &th,
        "consumed": false,
        "expires_at": Utc::now() + Duration::minutes(30),
    })
    .await?;
    // Never log the raw reset token (bearer credential). Gate logging like OTP codes.
    if cfg.log_otp_codes {
        tracing::info!(%email, "password reset token issued (log_otp_codes enabled)");
    }
    match crate::services::mail::send_password_reset_email(&cfg, &email, &token).await {
        Ok(()) => {}
        Err(e) => {
            tracing::warn!(error = %e, "password reset email delivery failed");
        }
    }
    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "message": "If your email is registered, a reset link has been sent."
    })))
}

#[post("/auth/password-reset")]
async fn password_reset_complete(
    db: web::Data<Db>,
    req: HttpRequest,
    body: web::Json<ResetCompleteBody>,
) -> AppResult<HttpResponse> {
    let product = ProductId::from_request(&req);
    // Throttle token-grinding: lenient (30/min) since the token is a 122-bit
    // UUID, but the control must exist (audit: unlimited attempts absent).
    let ip = crate::auth::client_ip(&req);
    if !crate::auth::check_rate_limit(&ip, "password-reset-complete", 30, 60) {
        return Err(AppError::RateLimited(
            "too many attempts — try again in 60 seconds".into(),
        ));
    }
    let token = body.token.trim().to_string();
    if token.len() < 16 {
        return Err(AppError::BadRequest("Reset token is missing.".into()));
    }
    // bcrypt operates on at most 72 bytes; enforce the byte range here so a
    // 73..128-char (or multibyte) password fails the policy check, not later
    // inside hash_password.
    if body.password.len() < 8 || body.password.len() > 72 {
        return Err(AppError::BadRequest(
            "Password must be 8 to 72 bytes.".into(),
        ));
    }
    let th = hash_token(&token);
    let coll = reset_token_store(&db, product);
    // CAS consume: atomically flip consumed=false → true so two concurrent
    // resets can never both read the token as unconsumed.
    let consumed = coll
        .find_one_and_update(
            doc! {
                "token_hash": &th,
                "product": product.as_str(),
                "consumed": false,
                "expires_at": { "$gt": Utc::now() },
            },
            doc! { "$set": { "consumed": true, "consumed_at": Utc::now() } },
        )
        .await?
        .ok_or_else(|| AppError::BadRequest("Reset token is invalid or expired.".into()))?;
    let email = consumed.get_str("email").unwrap_or("").to_string();

    let users = user_store(&db, product);
    let user = users
        .find_one(doc! { "email": &email })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;
    let new_hash = hash_password(&body.password)?;
    users
        .update_one(
            doc! { "_id": &user.id },
            doc! { "$set": { "password_hash": new_hash, "updated_at": Utc::now() },
                   "$inc": { "token_version": 1 } },
        )
        .await?;
    // token_version bumped -> drop cached revocation state immediately so the
    // old access tokens are rejected now, not after the 10 s cache TTL.
    crate::auth::middleware::invalidate_user_active(product, &user.id);
    // Revoke all existing sessions on password change.
    refresh_store(&db, product)
        .delete_many(doc! { "user_id": &user.id })
        .await?;
    audit(&db, &user.id, "password_reset", None).await;
    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "message": "Password reset successfully. Please sign in."
    })))
}

#[derive(Serialize)]
struct AuthResponse {
    access_token: String,
    refresh_token: String,
    expires_in: i64,
    user: crate::models::UserPublic,
}

fn user_store(db: &Db, product: ProductId) -> mongodb::Collection<User> {
    match product {
        ProductId::Secondary => db.users_secondary(),
        ProductId::LiveMorph => db.users(),
    }
}

fn ledger_store(db: &Db, product: ProductId) -> mongodb::Collection<CreditLedgerEntry> {
    match product {
        ProductId::Secondary => db.ledger_secondary(),
        ProductId::LiveMorph => db.ledger(),
    }
}

fn refresh_store(db: &Db, product: ProductId) -> mongodb::Collection<bson::Document> {
    match product {
        ProductId::Secondary => db.refresh_tokens_secondary(),
        ProductId::LiveMorph => db.refresh_tokens(),
    }
}
fn otp_store(db: &Db, product: ProductId) -> mongodb::Collection<OtpChallenge> {
    match product {
        ProductId::Secondary => db.otps_secondary(),
        ProductId::LiveMorph => db.otps(),
    }
}
fn reset_token_store(db: &Db, product: ProductId) -> mongodb::Collection<bson::Document> {
    match product {
        ProductId::Secondary => db.password_reset_tokens_secondary(),
        ProductId::LiveMorph => db.password_reset_tokens(),
    }
}

// OAuth CSRF state / one-time tickets / poll results live per-product so the
// secondary slot never reads or writes the primary DB's OAuth rows.
fn oauth_store(db: &Db, product: ProductId, name: &str) -> mongodb::Collection<bson::Document> {
    match product {
        ProductId::Secondary => db.db_secondary.collection(name),
        ProductId::LiveMorph => db.db.collection(name),
    }
}

async fn store_refresh_for(
    db: &Db,
    user_id: &str,
    token: &str,
    product: ProductId,
) -> AppResult<()> {
    let th = hash_token(token);
    refresh_store(db, product)
        .insert_one(doc! {
            "user_id": user_id,
            "token_hash": th,
            "created_at": chrono::Utc::now(),
        })
        .await?;
    Ok(())
}

#[post("/auth/otp/request")]
async fn request_otp(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Json<EmailBody>,
) -> AppResult<HttpResponse> {
    validate_email(&body.email)?;
    let email = body.email.trim().to_lowercase();
    let product = ProductId::from_request(&req);
    let ip = crate::auth::client_ip(&req);

    // IP rate limits: OTP issuance and verification are the brute-force surface
    if !crate::auth::check_rate_limit(&ip, "otp-request", 10, 60) {
        return Err(AppError::RateLimited("too many OTP requests".into()));
    }

    // Rate limit: count recent challenges
    let since = Utc::now() - Duration::seconds(cfg.auth_lockout_secs);
    let recent = otp_store(&db, product)
        .count_documents(doc! {
            "email": &email,
            "product": product.as_str(),
            "created_at": { "$gte": since }
        })
        .await?;
    if recent >= cfg.auth_max_attempts as u64 {
        return Err(AppError::RateLimited(format!(
            "too many attempts — wait {}s",
            cfg.auth_lockout_secs
        )));
    }

    // Invalidate any previous unconsumed challenges so only the latest code works
    let _ = otp_store(&db, product)
        .update_many(
            doc! { "email": &email, "product": product.as_str(), "consumed": false },
            doc! { "$set": { "consumed": true } },
        )
        .await;

    let code = generate_otp(cfg.otp_length);
    let challenge = OtpChallenge {
        id: new_id(),
        email: email.clone(),
        product: product.as_str().into(),
        code_hash: hash_otp(&code),
        attempts: 0,
        max_attempts: cfg.auth_max_attempts,
        expires_at: bson::DateTime::from_chrono(Utc::now() + Duration::seconds(cfg.otp_ttl_secs)),
        created_at: bson::DateTime::from_chrono(Utc::now()),
        consumed: false,
    };
    otp_store(&db, product).insert_one(&challenge).await?;

    // Production: send email via your SMTP. For local/dev we log the code
    // only when LOG_OTP_CODES=true (default false; production requires it off) to avoid leaking
    // codes into CI / shared-terminal logs.
    if cfg.log_otp_codes {
        info!(%email, otp = %code, "OTP issued (code logged via LOG_OTP_CODES)");
    } else {
        info!(%email, "OTP issued (code not logged)");
    }

    // Deliver OTP via SMTP when configured. In production without SMTP this is a hard error
    // so users never wait for a code that was never sent.
    match crate::services::mail::send_otp_email(&cfg, &email, &code).await {
        Ok(()) => {}
        Err(e) if cfg.is_production() && cfg.smtp_host.is_some() => return Err(e),
        Err(e) => {
            tracing::warn!(error = %e, "OTP email delivery failed — continuing (dev/no SMTP)");
        }
    }

    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "email": email,
        "expires_in": cfg.otp_ttl_secs,
        "code_length": cfg.otp_length,
        "message": "If the email is valid, a code has been sent"
    })))
}

#[post("/auth/otp/verify")]
async fn verify_otp_login(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Json<VerifyBody>,
) -> AppResult<HttpResponse> {
    let product = ProductId::from_request(&req);
    let ip = crate::auth::client_ip(&req);
    if !crate::auth::check_rate_limit(&ip, "otp-verify", 20, 60) {
        return Err(AppError::RateLimited("too many OTP attempts".into()));
    }
    validate_email(&body.email)?;
    let email = body.email.trim().to_lowercase();
    let code = body.code.trim().to_string();
    let expected_len = cfg.otp_length as usize;
    if code.len() != expected_len || !code.chars().all(|c| c.is_ascii_digit()) {
        return Err(AppError::BadRequest(format!(
            "enter the full {expected_len}-digit code"
        )));
    }

    // Prefer the newest unconsumed, unexpired challenge for THIS product
    let challenge = otp_store(&db, product)
        .find_one(doc! {
            "email": &email,
            "product": product.as_str(),
            "consumed": false,
            "expires_at": { "$gt": Utc::now() }
        })
        .sort(doc! { "created_at": -1 })
        .await?
        .ok_or_else(|| {
            AppError::BadRequest("code expired or not found — request a new one".into())
        })?;

    if !verify_otp(&code, &challenge.code_hash) {
        // Atomic: only increment if under max_attempts (closes TOCTOU window)
        let bumped = otp_store(&db, product)
            .update_one(
                doc! {
                    "_id": &challenge.id,
                    "attempts": { "$lt": challenge.max_attempts as i64 },
                },
                doc! { "$inc": { "attempts": 1i64 } },
            )
            .await?;
        if bumped.matched_count == 0 {
            return Err(AppError::RateLimited("too many invalid attempts".into()));
        }
        return Err(AppError::BadRequest("invalid code".into()));
    }
    if challenge.attempts >= challenge.max_attempts {
        return Err(AppError::RateLimited("too many invalid attempts".into()));
    }

    // Atomic consume — reject if already used (parallel verify race)
    let consumed = otp_store(&db, product)
        .update_one(
            doc! { "_id": &challenge.id, "consumed": false,
                    "attempts": { "$lt": challenge.max_attempts },
                    "expires_at": { "$gt": Utc::now() } },
            doc! { "$set": { "consumed": true } },
        )
        .await?;
    if consumed.matched_count == 0 {
        return Err(AppError::BadRequest(
            "code already used — request a new one".into(),
        ));
    }

    let mut user = upsert_user_by_email(&db, &cfg, &email, None, product).await?;
    if !user.is_active {
        return Err(AppError::Forbidden("account deactivated".into()));
    }
    // Bind stable device id when client sends one (license / anti-abuse).
    // Sticky: only set when unset — a later different value must NOT silently
    // rebind the account to another device; changes need an authed step-up.
    if let Some(ref did) = body.device_id {
        let did = did.trim();
        if !did.is_empty() && user.device_id.is_none() {
            user.device_id = Some(did.to_string());
            let _ = user_store(&db, product)
                .update_one(
                    doc! { "_id": &user.id, "device_id": { "$exists": false } },
                    doc! { "$set": { "device_id": did, "last_login_at": Utc::now() } },
                )
                .await;
        }
    }
    let tokens = issue_pair_for(&cfg, &user.id, &user.email,
        crate::product::ProductId::from_request(&req).as_str(),
        user.token_version)?;
    store_refresh_for(&db, &user.id, &tokens.refresh_token, product).await?;

    Ok(HttpResponse::Ok().json(AuthResponse {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expires_in,
        user: user.public_view(),
    }))
}

#[post("/auth/register")]
async fn register_password(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Json<PasswordRegister>,
) -> AppResult<HttpResponse> {
    let product = ProductId::from_request(&req);
    let ip = crate::auth::client_ip(&req);
    if !crate::auth::check_rate_limit(
        &ip,
        "register",
        cfg.auth_max_attempts,
        cfg.auth_lockout_secs.max(1) as u64,
    ) {
        return Err(AppError::RateLimited(format!(
            "too many registration attempts — try again in {} seconds",
            cfg.auth_lockout_secs.max(1)
        )));
    }
    validate_email(&body.email)?;
    // Byte range matches the bcrypt 72-byte input cap (see password_reset).
    if body.password.len() < 8 || body.password.len() > 72 {
        return Err(AppError::BadRequest(
            "password must be 8 to 72 bytes".into(),
        ));
    }
    // Terms must be explicitly accepted — a missing field is not consent.
    if body.accepted_terms != Some(true) {
        return Err(AppError::BadRequest(
            "You must accept the Terms & Conditions to continue.".into(),
        ));
    }
    let email = body.email.trim().to_lowercase();
    if user_store(&db, product)
        .find_one(doc! { "email": &email })
        .await?
        .is_some()
    {
        return Err(AppError::Conflict("email already registered".into()));
    }
    let mut user = User::new(
        email,
        body.display_name.clone().or_else(|| body.name.clone()),
        cfg.signup_bonus_credits,
    );
    user.product = product.as_str().into();
    user.password_hash = Some(hash_password(&body.password)?);
    if let Some(ref did) = body.device_id {
        let did = did.trim();
        if !did.is_empty() {
            user.device_id = Some(did.to_string());
        }
    }
    if let Some(ref code) = body.referral_code.clone().or(body.ref_code.clone()) {
        let code = code.trim().to_uppercase();
        if !code.is_empty() {
            user.referred_by = Some(code);
        }
    }
    if let Err(e) = user_store(&db, product).insert_one(&user).await {
        // Unique email index: two devices signing up the same new email
        // concurrently — report a clean 409 instead of a 500.
        if e.to_string().contains("E11000") {
            return Err(AppError::Conflict("email already registered".into()));
        }
        return Err(e.into());
    }
    if cfg.signup_bonus_credits > 0.0 {
        let entry = crate::models::CreditLedgerEntry {
            id: crate::db::new_id(),
            user_id: user.id.clone(),
            delta: cfg.signup_bonus_credits,
            balance_after: user.total_credits(),
            kind: "signup_bonus".into(),
            ref_id: None,
            note: Some("welcome bonus".into()),
            created_at: bson::DateTime::from_chrono(chrono::Utc::now()),
        };
        ledger_store(&db, product).insert_one(&entry).await?;
    }
    let tokens = issue_pair_for(&cfg, &user.id, &user.email,
        crate::product::ProductId::from_request(&req).as_str(),
        user.token_version)?;
    store_refresh_for(&db, &user.id, &tokens.refresh_token, product).await?;
    Ok(HttpResponse::Created().json(AuthResponse {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expires_in,
        user: user.public_view(),
    }))
}

#[post("/auth/login")]
async fn login_password(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Json<PasswordLogin>,
) -> AppResult<HttpResponse> {
    let product = ProductId::from_request(&req);
    let ip = crate::auth::client_ip(&req);
    if !crate::auth::check_rate_limit(
        &ip,
        "login",
        cfg.auth_max_attempts,
        cfg.auth_lockout_secs.max(1) as u64,
    ) {
        return Err(AppError::RateLimited(format!(
            "too many login attempts — try again in {} seconds",
            cfg.auth_lockout_secs.max(1)
        )));
    }
    validate_email(&body.email)?;
    let email = body.email.trim().to_lowercase();
    // Enumeration-safe: same 401 for unknown user / OTP-only account / wrong
    // password / disabled account, and always burn one bcrypt verify (dummy
    // hash on the miss-path) so timing doesn't reveal account existence.
    // The dummy MUST be a real bcrypt hash: bcrypt::verify errors on malformed
    // hashes, which would turn the miss-path into a 500 instead of a 401.
    // Generated once per process from a random throwaway password.
    static DUMMY_HASH: std::sync::LazyLock<String> = std::sync::LazyLock::new(|| {
        bcrypt::hash(uuid::Uuid::new_v4().to_string(), 12)
            .expect("bcrypt dummy hash must build")
    });
    let user = user_store(&db, product)
        .find_one(doc! { "email": &email })
        .await?;
    let (hash, exists, active) = match &user {
        Some(u) => (
            u.password_hash.as_deref().unwrap_or(DUMMY_HASH.as_str()),
            true,
            u.is_active,
        ),
        None => (DUMMY_HASH.as_str(), false, false),
    };
    let password_ok = verify_password(&body.password, hash)?; // always pay the cost
    if !password_ok || !exists || !active || user.as_ref().and_then(|u| u.password_hash.as_deref()).is_none() {
        return Err(AppError::Unauthorized("invalid credentials".into()));
    }
    let user = user.unwrap(); // safe: exists && active checked above
    let mut set_doc = doc! { "last_login_at": Utc::now() };
    if let Some(ref did) = body.device_id {
        let did = did.trim();
        if !did.is_empty() {
            set_doc.insert("device_id", did);
        }
    }
    user_store(&db, product)
        .update_one(doc! { "_id": &user.id }, doc! { "$set": set_doc })
        .await?;
    let tokens = issue_pair_for(&cfg, &user.id, &user.email,
        crate::product::ProductId::from_request(&req).as_str(),
        user.token_version)?;
    store_refresh_for(&db, &user.id, &tokens.refresh_token, product).await?;
    // Refresh public view after device bind
    let user = user_store(&db, product)
        .find_one(doc! { "_id": &user.id })
        .await?
        .unwrap_or(user);
    Ok(HttpResponse::Ok().json(AuthResponse {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expires_in,
        user: user.public_view(),
    }))
}

#[post("/auth/refresh")]
async fn refresh(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Json<RefreshBody>,
) -> AppResult<HttpResponse> {
    {
        let ip = crate::auth::client_ip(&req);
        if !crate::auth::check_rate_limit(&ip, "auth-refresh", 30, 60) {
            return Err(AppError::RateLimited("too many refresh attempts".into()));
        }
    }

    let claims = decode_refresh(&cfg, &body.refresh_token)?;
    let th = hash_token(&body.refresh_token);

    // Shared refresh for both products — claim the token ATOMICALLY with
    // find_one_and_delete so two concurrent refreshes with the same token
    // cannot both succeed (the loser hits the reuse-revocation path below).
    let claimed_lm = db
        .refresh_tokens()
        .find_one_and_delete(doc! { "token_hash": &th })
        .await?;
    let (in_lm, in_secondary) = if claimed_lm.is_some() {
        (true, false)
    } else {
        let le = db
            .refresh_tokens_secondary()
            .find_one_and_delete(doc! { "token_hash": &th })
            .await?;
        (false, le.is_some())
    };
    if !in_lm && !in_secondary {
        let _ = db
            .refresh_tokens()
            .delete_many(doc! { "user_id": &claims.sub })
            .await;
        let _ = db
            .refresh_tokens_secondary()
            .delete_many(doc! { "user_id": &claims.sub })
            .await;
        audit(&db, &claims.sub, "refresh_reuse_detected", None).await;
        return Err(AppError::Unauthorized(
            "refresh token revoked — sign in again".into(),
        ));
    }

    let (user, is_secondary) = if in_secondary {
        let u = db
            .users_secondary()
            .find_one(doc! { "_id": &claims.sub })
            .await?
            .ok_or_else(|| AppError::Unauthorized("user gone".into()))?;
        (u, true)
    } else {
        let u = db
            .users()
            .find_one(doc! { "_id": &claims.sub })
            .await?
            .ok_or_else(|| AppError::Unauthorized("user gone".into()))?;
        (u, false)
    };
    if !user.is_active {
        return Err(AppError::Forbidden("account disabled".into()));
    }
    // Revocation: a refresh token from before a token_version bump (logout_all,
    // password reset, delete) must not mint new access tokens. Kill all of the
    // user's refresh rows so reuse detection fires on any later replay.
    if claims.ver != user.token_version {
        let _ = db.refresh_tokens().delete_many(doc! { "user_id": &user.id }).await;
        let _ = db.refresh_tokens_secondary().delete_many(doc! { "user_id": &user.id }).await;
        return Err(AppError::Unauthorized("token revoked".into()));
    }
    let tokens = issue_pair_for(&cfg, &user.id, &user.email,
        claims.aud.as_deref().unwrap_or("livemorph"),
        user.token_version)?;
    if is_secondary {
        // token already claimed (deleted) above; store rotated token in secondary collection
        let new_hash = hash_token(&tokens.refresh_token);
        db.refresh_tokens_secondary()
            .insert_one(doc! {
                "_id": crate::db::new_id(),
                "user_id": &user.id,
                "token_hash": new_hash,
                "created_at": chrono::Utc::now(),
            })
            .await?;
    } else {
        store_refresh(&db, &user.id, &tokens.refresh_token).await?;
    }
    audit(&db, &user.id, "token_refreshed", None).await;
    Ok(HttpResponse::Ok().json(AuthResponse {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expires_in,
        user: user.public_view(),
    }))
}

#[get("/auth/me")]
async fn me(db: web::Data<Db>, req: HttpRequest) -> AppResult<HttpResponse> {
    let auth = req
        .extensions()
        .get::<AuthUser>()
        .cloned()
        .ok_or_else(|| AppError::Unauthorized("not authenticated".into()))?;
    let product = ProductId::from_request(&req);
    let user = match product {
        ProductId::Secondary => {
            db.users_secondary()
                .find_one(doc! { "_id": &auth.user_id })
                .await?
        }
        _ => {
            db.users()
                .find_one(doc! { "_id": &auth.user_id })
                .await?
        }
    };
    let user = user.ok_or_else(|| AppError::NotFound("user".into()))?;
    Ok(HttpResponse::Ok().json(user.public_view()))
}

#[post("/auth/logout")]
async fn logout(
    db: web::Data<Db>,
    req: HttpRequest,
    body: web::Json<RefreshBody>,
) -> AppResult<HttpResponse> {
    let _ = &req;
    if body.refresh_token.trim().len() < 16 {
        return Err(AppError::BadRequest("invalid refresh token".into()));
    }
    let th = hash_token(&body.refresh_token);
    // Try both token stores — the token may belong to either product
    let deleted_lm = db.refresh_tokens()
        .delete_one(doc! { "token_hash": &th })
        .await?
        .deleted_count > 0;
    let deleted_secondary = db.refresh_tokens_secondary()
        .delete_one(doc! { "token_hash": &th })
        .await?
        .deleted_count > 0;
    if !deleted_lm && !deleted_secondary {
        // Token not found in either store — still return OK (idempotent)
    }
    Ok(HttpResponse::Ok().json(json!({ "ok": true })))
}

#[post("/auth/logout_all")]
async fn logout_all(db: web::Data<Db>, req: HttpRequest) -> AppResult<HttpResponse> {
    let auth = req
        .extensions()
        .get::<AuthUser>()
        .cloned()
        .ok_or_else(|| AppError::Unauthorized("not authenticated".into()))?;
    // Scope to the token's own product (middleware already enforced aud ==
    // request product) — never touch the sibling product's stores.
    let product = ProductId::from_request(&req);
    refresh_store(&db, product)
        .delete_many(doc! { "user_id": &auth.user_id })
        .await?;
    // Bump token_version so existing ACCESS tokens stop validating too.
    let bump = doc! { "$inc": { "token_version": 1 } };
    user_store(&db, product)
        .update_one(doc! { "_id": &auth.user_id }, bump)
        .await?;
    crate::auth::middleware::invalidate_user_active(product, &auth.user_id);
    audit(&db, &auth.user_id, "logout_all", None).await;
    Ok(HttpResponse::Ok().json(json!({ "ok": true })))
}

/// GDPR-style data export (product aware)
#[post("/auth/export")]
async fn export_data(db: web::Data<Db>, req: HttpRequest) -> AppResult<HttpResponse> {
    let auth = req
        .extensions()
        .get::<AuthUser>()
        .cloned()
        .ok_or_else(|| AppError::Unauthorized("not authenticated".into()))?;
    let product = ProductId::from_request(&req);
    let user = user_store(&db, product)
        .find_one(doc! { "_id": &auth.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;
    use futures_util::TryStreamExt;
    let mut ledger_cur = ledger_store(&db, product)
        .find(doc! { "user_id": &auth.user_id })
        .await?;
    let mut ledger = Vec::new();
    let mut ledger_truncated = false;
    while let Some(e) = ledger_cur.try_next().await? {
        if ledger.len() >= 500 {
            ledger_truncated = true;
            break;
        }
        ledger.push(serde_json::json!({
            "id": e.id,
            "delta": e.delta,
            "kind": e.kind,
            "note": e.note,
            "created_at": e.created_at,
        }));
    }
    let mut sessions = Vec::new();
    let mut sessions_truncated = false;
    let sess_coll = match product {
        ProductId::Secondary => {
            db.sessions_secondary()
        }
        ProductId::LiveMorph => db.db.collection::<mongodb::bson::Document>("morph_sessions"),
    };
    let mut sess_cur = sess_coll.find(doc! { "user_id": &auth.user_id }).await?;
    while let Some(s) = sess_cur.try_next().await? {
        if sessions.len() >= 200 {
            sessions_truncated = true;
            break;
        }
        sessions.push(serde_json::json!({
            "id": s.get_str("_id").unwrap_or(""),
            "status": s.get_str("status").unwrap_or(""),
            "started_at": s.get("started_at"),
            "ended_at": s.get("ended_at"),
        }));
    }
    audit(&db, &auth.user_id, "data_export", None).await;
    Ok(HttpResponse::Ok().json(json!({
        "user": user.public_view(),
        "ledger": ledger,
        "ledger_truncated": ledger_truncated,
        "sessions": sessions,
        "sessions_truncated": sessions_truncated,
        "exported_at": chrono::Utc::now().to_rfc3339(),
    })))
}

/// GDPR-style account deletion (soft: deactivate + wipe tokens + anonymize email)
#[post("/auth/delete_account")]
async fn delete_account(db: web::Data<Db>, req: HttpRequest) -> AppResult<HttpResponse> {
    let auth = req
        .extensions()
        .get::<AuthUser>()
        .cloned()
        .ok_or_else(|| AppError::Unauthorized("not authenticated".into()))?;
    let product = ProductId::from_request(&req);
    let user_email = user_store(&db, product)
        .find_one(doc! { "_id": &auth.user_id })
        .await?
        .map(|u| u.email.clone());
    let anon = format!("deleted+{}@invalid.local", auth.user_id);
    user_store(&db, product)
        .update_one(
            doc! { "_id": &auth.user_id },
            doc! { "$set": {
                "email": &anon,
                "display_name": "Deleted User",
                "password_hash": null,
                "is_active": false,
                "active_sessions": 0,
                "token_version": 999_999,
                "credit_balance": 0.0,
                "bonus_balance": 0.0,
                "updated_at": chrono::Utc::now(),
            }},
        )
        .await?;
    // Drop any cached revocation state for this user so deactivation is
    // honored immediately (the ver bump already changes the cache key, this
    // covers the is_active=false path too).
    crate::auth::middleware::invalidate_user_active(product, &auth.user_id);
    // GDPR: purge every per-user collection in the CALLER's product DB only.
    // Never touch the sibling product DB — an attacker who registers with a
    // victim's email must not be able to wipe the victim's other-product data.
    let uid = &auth.user_id;
    macro_rules! purge {
        ($c:expr) => {{
            let _ = $c.delete_many(doc! { "user_id": uid }).await;
            if let Some(ref em) = user_email {
                let _ = $c.delete_many(doc! { "email": em }).await;
            }
        }};
    }
    match product {
        ProductId::Secondary => {
            purge!(db.sessions_secondary());
            purge!(db.otps_secondary());
            purge!(db.password_reset_tokens_secondary());
            purge!(db.ledger_secondary());
            purge!(db.refresh_tokens_secondary());
            purge!(db.db_secondary.collection::<bson::Document>("user_characters"));
            purge!(db.credit_keys_secondary());
            purge!(db.payment_orders_secondary());
            purge!(db.db_secondary.collection::<bson::Document>("oauth_states"));
            purge!(db.db_secondary.collection::<bson::Document>("oauth_tickets"));
            purge!(db.db_secondary.collection::<bson::Document>("oauth_results"));
            purge!(db.db_secondary.collection::<bson::Document>("support_tickets"));
            purge!(db.db_secondary.collection::<bson::Document>("creator_payouts"));
            let _ = db
                .db_secondary
                .collection::<bson::Document>("characters")
                .delete_many(doc! { "user_id": uid })
                .await;
        }
        ProductId::LiveMorph => {
            purge!(db.sessions());
            purge!(db.otps());
            purge!(db.password_reset_tokens());
            purge!(db.ledger());
            purge!(db.refresh_tokens());
            purge!(db.user_characters());
            purge!(db.credit_keys());
            purge!(db.db.collection::<bson::Document>("payment_orders"));
            purge!(db.db.collection::<bson::Document>("oauth_states"));
            purge!(db.db.collection::<bson::Document>("oauth_tickets"));
            purge!(db.db.collection::<bson::Document>("oauth_results"));
            purge!(db.db.collection::<bson::Document>("support_tickets"));
            purge!(db.db.collection::<bson::Document>("creator_payouts"));
            let _ = db.characters().delete_many(doc! { "user_id": uid }).await;
        }
    }
    // The audit log lives in the primary DB for both products.
    purge!(db.db.collection::<bson::Document>("audit_log"));
    audit(&db, &auth.user_id, "account_deleted", None).await;
    Ok(HttpResponse::Ok().json(json!({ "ok": true })))
}

#[post("/auth/clear")]
async fn clear_session(db: web::Data<Db>, req: HttpRequest) -> AppResult<HttpResponse> {
    let auth_opt = req.extensions().get::<AuthUser>().cloned();
    if let Some(auth) = auth_opt {
        // Scope to the token's own product (aud == request product is enforced
        // by middleware) — never touch the sibling product's stores.
        let product = ProductId::from_request(&req);
        refresh_store(&db, product)
            .delete_many(doc! { "user_id": &auth.user_id })
            .await?;
        // Bump token_version so existing ACCESS tokens are revoked too (not just
        // refresh tokens) — otherwise a stolen access token survives this call
        // until JWT_ACCESS_TTL_SECS.
        user_store(&db, product)
            .update_one(
                doc! { "_id": &auth.user_id },
                doc! { "$inc": { "token_version": 1 } },
            )
            .await?;
        crate::auth::middleware::invalidate_user_active(product, &auth.user_id);
    }
    Ok(HttpResponse::Ok().json(json!({ "ok": true })))
}

async fn upsert_user_by_email(
    db: &Db,
    cfg: &Config,
    email: &str,
    display_name: Option<String>,
    product: ProductId,
) -> AppResult<User> {
    if let Some(u) = user_store(db, product)
        .find_one(doc! { "email": email })
        .await?
    {
        user_store(db, product)
            .update_one(
                doc! { "_id": &u.id },
                doc! { "$set": { "last_login_at": Utc::now() } },
            )
            .await?;
        return Ok(u);
    }
    let mut user = User::new(email.to_string(), display_name, cfg.signup_bonus_credits);
    user.product = product.as_str().into();
    user_store(db, product).insert_one(&user).await?;
    if cfg.signup_bonus_credits > 0.0 {
        let entry = crate::models::CreditLedgerEntry {
            id: crate::db::new_id(),
            user_id: user.id.clone(),
            delta: cfg.signup_bonus_credits,
            balance_after: user.total_credits(),
            kind: "signup_bonus".into(),
            ref_id: None,
            note: Some("welcome bonus".into()),
            created_at: bson::DateTime::from_chrono(chrono::Utc::now()),
        };
        ledger_store(db, product).insert_one(&entry).await?;
    }
    Ok(user)
}

pub fn hash_token(token: &str) -> String {
    // HMAC-SHA256 keyed with the server pepper (same secret as OTP) — a DB dump
    // alone can't replay stored refresh/reset tokens.
    use hmac::digest::KeyInit;
    use hmac::{Hmac, Mac};
    use sha2::Sha256;
    let key = crate::auth::otp::otp_pepper_pub();
    let mut mac = <Hmac<Sha256> as KeyInit>::new_from_slice(key).expect("hmac key");
    mac.update(token.as_bytes());
    hex::encode(mac.finalize().into_bytes())
}

pub async fn store_refresh(db: &crate::db::Db, user_id: &str, token: &str) -> AppResult<()> {
    let th = hash_token(token);
    db.refresh_tokens()
        .insert_one(doc! {
            "user_id": user_id,
            "token_hash": th,
            "created_at": chrono::Utc::now(),
        })
        .await?;
    Ok(())
}

async fn audit(db: &crate::db::Db, user_id: &str, action: &str, meta: Option<serde_json::Value>) {
    let _ = db
        .db
        .collection::<mongodb::bson::Document>("audit_log")
        .insert_one(doc! {
            "user_id": user_id,
            "action": action,
            "meta": meta.map(|v| mongodb::bson::to_bson(&v).unwrap_or(mongodb::bson::Bson::Null)).unwrap_or(mongodb::bson::Bson::Null),
            "at": chrono::Utc::now(),
        })
        .await;
}

// ── Google OAuth ──────────────────────────────────────────────────────────

#[get("/auth/oauth/google/start")]
async fn oauth_google_start(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
) -> AppResult<HttpResponse> {
    {
        let ip = crate::auth::client_ip(&req);
        if !crate::auth::check_rate_limit(&ip, "oauth-start", 20, 60) {
            return Err(AppError::RateLimited("too many oauth starts".into()));
        }
    }

    if !google_oauth::is_configured(&cfg) {
        return Err(AppError::BadRequest(
            "Google sign-in is not configured on this server".into(),
        ));
    }
    // Product is taken from the request here (the browser callback later carries
    // no X-Frontend-Id header, so it is recovered from this state row).
    let product = ProductId::from_request(&req);
    let state = google_oauth::new_state();
    // Persist state briefly for CSRF (reuse otps collection shape as lightweight store)
    let exp = Utc::now() + Duration::minutes(15);
    // PKCE-style second secret: returned ONLY to the starting client over the
    // API and required again at /exchange. A state/ticket leaked via a browser
    // callback URL or logs therefore cannot mint tokens on its own.
    let verifier = google_oauth::new_state();
    oauth_store(&db, product, "oauth_states")
        .insert_one(doc! {
            "_id": &state,
            "provider": "google",
            "product": product.as_str(),
            "verifier": &verifier,
            "expires_at": exp,
        })
        .await?;
    let url = google_oauth::authorization_url(&cfg, &state)?;
    Ok(HttpResponse::Ok().json(json!({
        "authorization_url": url,
        "state": state,
        "code_verifier": verifier,
        "provider": "google",
    })))
}

#[derive(Deserialize)]
struct OAuthCallbackQuery {
    code: Option<String>,
    state: Option<String>,
    error: Option<String>,
}

#[get("/auth/oauth/google/callback")]
async fn oauth_google_callback(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    query: web::Query<OAuthCallbackQuery>,
) -> AppResult<HttpResponse> {
    if let Some(err) = &query.error {
        // Only redirect back to the app for a state we actually issued (checked
        // in both product stores, not consumed) — otherwise reject, so the
        // callback cannot be abused as an open redirect / phishing echo.
        let state = query.state.as_deref().unwrap_or("");
        let state_valid = !state.is_empty() && {
            let filter = doc! { "_id": state, "provider": "google", "expires_at": { "$gt": Utc::now() } };
            oauth_store(&db, ProductId::LiveMorph, "oauth_states")
                .find_one(filter.clone())
                .await
                .ok()
                .flatten()
                .is_some()
                || oauth_store(&db, ProductId::Secondary, "oauth_states")
                    .find_one(filter)
                    .await
                    .ok()
                    .flatten()
                    .is_some()
        };
        if !state_valid {
            return Err(AppError::BadRequest("invalid or expired OAuth state".into()));
        }
        // Echo state back so the desktop client's anti-fixation check can run on
        // the error path too — but sanitize the error text: the desktop renders
        // it in an in-app notification, so it must not carry attacker prose.
        // Whitelist chars + cap length (still percent-encoded in the Location).
        let safe_err: String = err
            .chars()
            .filter(|c| c.is_ascii_alphanumeric() || *c == '_' || *c == '-')
            .take(64)
            .collect();
        let deep = format!(
            "livemorph://oauth/callback?error={}&state={}",
            urlencoding_simple(&safe_err),
            urlencoding_simple(state),
        );
        return Ok(HttpResponse::Found()
            .insert_header(("Location", deep))
            .finish());
    }
    let code = query
        .code
        .as_ref()
        .ok_or_else(|| AppError::BadRequest("missing code".into()))?;
    let state = query
        .state
        .as_ref()
        .ok_or_else(|| AppError::BadRequest("missing state".into()))?;

    // Validate state — the browser callback carries no product header, so the
    // product is recovered from whichever product DB holds the state row.
    let state_filter = doc! {
        "_id": state,
        "provider": "google",
        "expires_at": { "$gt": Utc::now() }
    };
    let (product, st) = match oauth_store(&db, ProductId::LiveMorph, "oauth_states")
        .find_one_and_delete(state_filter.clone())
        .await?
    {
        Some(d) => (ProductId::LiveMorph, Some(d)),
        None => match oauth_store(&db, ProductId::Secondary, "oauth_states")
            .find_one_and_delete(state_filter)
            .await?
        {
            Some(d) => (ProductId::Secondary, Some(d)),
            None => (ProductId::LiveMorph, None),
        },
    };
    if st.is_none() {
        return Err(AppError::BadRequest(
            "invalid or expired OAuth state".into(),
        ));
    }
    // Carry the PKCE-style verifier from the (now consumed) state row onto the
    // ticket so /exchange can require it.
    let verifier = st
        .as_ref()
        .and_then(|d| d.get_str("verifier").ok())
        .unwrap_or("")
        .to_string();

    let tokens = google_oauth::exchange_code(&cfg, code).await?;
    let has_refresh = tokens.refresh_token.is_some();
    tracing::debug!(
        token_type = ?tokens.token_type,
        expires_in = ?tokens.expires_in,
        has_scope = tokens.scope.is_some(),
        has_id_token = tokens.id_token.is_some(),
        "google token exchange succeeded"
    );
    let info = google_oauth::fetch_userinfo(&tokens.access_token).await?;
    if has_refresh {
        tracing::debug!(email = %info.email, "google OAuth refresh_token received");
    }
    if info.picture.is_some() {
        tracing::debug!(email = %info.email, "google profile picture available");
    }
    if info.email.is_empty() {
        return Err(AppError::BadRequest("Google account has no email".into()));
    }
    if info.id.is_empty() {
        return Err(AppError::BadRequest(
            "Google account missing subject id".into(),
        ));
    }
    if info.verified_email != Some(true) {
        return Err(AppError::BadRequest("Google email is not verified".into()));
    }

    let email = info.email.trim().to_lowercase();
    let user = upsert_google_user(&db, &cfg, product, &email, &info.id, info.name.clone()).await?;
    if !user.is_active {
        return Err(AppError::Forbidden("account deactivated".into()));
    }
    // One-time ticket: user_id only — JWT minted on /exchange (no tokens at rest)
    let ticket = uuid::Uuid::new_v4().simple().to_string();
    let exp = Utc::now() + Duration::minutes(5);
    oauth_store(&db, product, "oauth_tickets")
        .insert_one(doc! {
            "_id": &ticket,
            "user_id": &user.id,
            "email": &user.email,
            "product": product.as_str(),
            "verifier": &verifier,
            "expires_at": exp,
            "consumed": false,
        })
        .await?;

    // Store state→ticket mapping so the desktop app can poll for the result
    oauth_store(&db, product, "oauth_results")
        .insert_one(doc! {
            "_id": state,
            "ticket": &ticket,
            "created_at": Utc::now(),
        })
        .await?;

    // The desktop client rejects OAuth callbacks whose `state` does not match
    // the nonce it started with (session-fixation guard) — the deep link MUST
    // echo it or the protocol-handler path always fails verification.
    let deep = format!(
        "livemorph://oauth/callback?ticket={}&state={}",
        urlencoding_simple(&ticket),
        urlencoding_simple(state)
    );
    // Also support HTML fallback page for when protocol handler is not registered
    let html = format!(
        r#"<!DOCTYPE html><html><head><meta charset=utf-8><title>LiveMorph</title>
<style>body{{font-family:system-ui;background:#0b0b0f;color:#eee;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}}
.card{{max-width:420px;padding:24px;border:1px solid #333;border-radius:12px;background:#14141a}}
a{{color:#8b5cf6}}</style></head><body><div class=card>
<h1>Sign-in complete</h1>
<p>Returning to LiveMorph…</p>
<p><a href="{deep}">Open LiveMorph</a></p>
<p style="color:#888;font-size:12px">If the app does not open, copy this ticket into the app: <code>{ticket}</code></p>
<script>location.href={deep_js};setTimeout(function(){{}},800);</script>
</div></body></html>"#,
        deep = deep,
        ticket = ticket,
        deep_js = serde_json::Value::String(deep.clone())
    );
    Ok(HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .insert_header(("Cache-Control", "no-store"))
        .body(html))
}

/// Desktop polls for OAuth result after opening browser (deep-link fallback).
#[get("/auth/oauth/google/poll")]
async fn oauth_google_poll(
    db: web::Data<Db>,
    req: HttpRequest,
    query: web::Query<std::collections::HashMap<String, String>>,
) -> AppResult<HttpResponse> {
    {
        let ip = crate::auth::client_ip(&req);
        if !crate::auth::check_rate_limit(&ip, "oauth-poll", 60, 60) {
            return Err(AppError::RateLimited("too many oauth-poll attempts".into()));
        }
    }

    let state = query
        .get("state")
        .ok_or_else(|| AppError::BadRequest("missing state".into()))?;
    let product = ProductId::from_request(&req);
    let results = oauth_store(&db, product, "oauth_results");
    if let Some(doc) = results
        .find_one_and_delete(doc! { "_id": state.as_str() })
        .await?
    {
        let ticket = doc.get_str("ticket").unwrap_or("");
        Ok(HttpResponse::Ok().json(serde_json::json!({ "ticket": ticket })))
    } else {
        Ok(HttpResponse::Ok().json(serde_json::json!({ "ticket": null })))
    }
}

#[derive(Deserialize)]
struct OAuthExchangeBody {
    ticket: String,
    /// PKCE-style secret from /start — required so a leaked ticket alone
    /// cannot be redeemed.
    #[serde(default)]
    verifier: Option<String>,
}

/// Desktop redeems one-time ticket → JWT pair (production-safe vs tokens in URL).
#[post("/auth/oauth/google/exchange")]
async fn oauth_google_exchange(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Json<OAuthExchangeBody>,
) -> AppResult<HttpResponse> {
    {
        let ip = crate::auth::client_ip(&req);
        if !crate::auth::check_rate_limit(&ip, "oauth-exchange", 20, 60) {
            return Err(AppError::RateLimited("too many oauth-exchange attempts".into()));
        }
    }

    let ticket = body.ticket.trim();
    if ticket.is_empty() {
        return Err(AppError::BadRequest("missing ticket".into()));
    }
    let product = ProductId::from_request(&req);
    let coll = oauth_store(&db, product, "oauth_tickets");
    // The verifier is part of the atomic claim filter: a ticket presented
    // without the matching verifier matches 0 rows → rejected, and the ticket
    // is NOT consumed (so the legitimate client can still retry).
    let verifier = body
        .verifier
        .as_deref()
        .map(str::trim)
        .filter(|s| !s.is_empty())
        .ok_or_else(|| AppError::BadRequest("missing code_verifier".into()))?;
    let doc = coll
        .find_one_and_update(
            doc! {
                "_id": ticket,
                "consumed": false,
                "expires_at": { "$gt": Utc::now() },
                "verifier": verifier,
            },
            doc! { "$set": { "consumed": true } },
        )
        .await?
        .ok_or_else(|| AppError::BadRequest("invalid or expired OAuth ticket".into()))?;

    let user_id = doc.get_str("user_id").unwrap_or("").to_string();
    if user_id.is_empty() {
        return Err(AppError::Internal("ticket missing user".into()));
    }
    let user = user_store(&db, product)
        .find_one(doc! { "_id": &user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;
    if !user.is_active {
        return Err(AppError::Forbidden("account deactivated".into()));
    }

    // Mint tokens only at redeem time — never stored on the ticket document.
    // aud is the ticket's product (bound at start), not the request header.
    let aud = if user.product.is_empty() {
        product.as_str().to_string()
    } else {
        user.product.clone()
    };
    let jwt = issue_pair_for(&cfg, &user.id, &user.email, &aud, user.token_version)?;
    store_refresh_for(&db, &user.id, &jwt.refresh_token, product).await?;

    Ok(HttpResponse::Ok().json(json!({
        "access_token": jwt.access_token,
        "refresh_token": jwt.refresh_token,
        "expires_in": jwt.expires_in,
        "email": user.email,
        "user": user.public_view(),
    })))
}

#[get("/auth/oauth/google/status")]
async fn oauth_google_status(cfg: web::Data<Arc<Config>>) -> HttpResponse {
    HttpResponse::Ok().json(json!({
        "enabled": google_oauth::is_configured(&cfg),
        "provider": "google",
    }))
}

fn urlencoding_simple(s: &str) -> String {
    let mut out = String::with_capacity(s.len() * 3);
    for b in s.bytes() {
        match b {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                out.push(b as char)
            }
            _ => out.push_str(&format!("%{b:02X}")),
        }
    }
    out
}

async fn upsert_google_user(
    db: &Db,
    cfg: &Config,
    product: ProductId,
    email: &str,
    google_sub: &str,
    display_name: Option<String>,
) -> AppResult<User> {
    let users = user_store(db, product);
    // Prefer match by google_sub, then by email
    if let Some(mut u) = users
        .find_one(doc! { "google_sub": google_sub })
        .await?
    {
        u.last_login_at = Some(bson::DateTime::from_chrono(Utc::now()));
        u.updated_at = bson::DateTime::from_chrono(Utc::now());
        if u.email != email {
            u.email = email.to_string();
        }
        users.replace_one(doc! { "_id": &u.id }, &u).await?;
        return Ok(u);
    }
    if let Some(mut u) = users.find_one(doc! { "email": email }).await? {
        u.google_sub = Some(google_sub.to_string());
        u.last_login_at = Some(bson::DateTime::from_chrono(Utc::now()));
        u.updated_at = bson::DateTime::from_chrono(Utc::now());
        if let Some(n) = display_name {
            if !n.is_empty() {
                u.display_name = n;
            }
        }
        users.replace_one(doc! { "_id": &u.id }, &u).await?;
        return Ok(u);
    }
    let mut u = User::new(email.to_string(), display_name, cfg.signup_bonus_credits);
    u.google_sub = Some(google_sub.to_string());
    u.product = product.as_str().to_string(); // bind the user to the slot that started OAuth
    u.last_login_at = Some(bson::DateTime::from_chrono(Utc::now()));
    users.insert_one(&u).await?;
    // Signup bonus ledger (best-effort) in the product's own ledger.
    let _ = ledger_store(db, product)
        .insert_one(CreditLedgerEntry {
            id: new_id(),
            user_id: u.id.clone(),
            delta: cfg.signup_bonus_credits,
            balance_after: u.bonus_balance,
            kind: "signup_bonus".into(),
            ref_id: None,
            note: Some("Google signup bonus".into()),
            created_at: bson::DateTime::from_chrono(Utc::now()),
        })
        .await;
    Ok(u)
}
