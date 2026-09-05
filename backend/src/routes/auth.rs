use crate::auth::{
    decode_refresh, generate_otp, hash_otp, hash_password, issue_pair, validate_email, verify_otp,
    verify_password, AuthUser,
};
use crate::config::Config;
use crate::db::{new_id, Db};
use crate::error::{AppError, AppResult};
use crate::models::{CreditLedgerEntry, OtpChallenge, User};
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
pub struct PasswordRegister {
    pub email: String,
    pub password: String,
    pub display_name: Option<String>,
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

#[derive(Serialize)]
struct AuthResponse {
    access_token: String,
    refresh_token: String,
    expires_in: i64,
    user: crate::models::UserPublic,
}

#[post("/auth/otp/request")]
async fn request_otp(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    body: web::Json<EmailBody>,
) -> AppResult<HttpResponse> {
    validate_email(&body.email)?;
    let email = body.email.trim().to_lowercase();

    // Rate limit: count recent challenges
    let since = Utc::now() - Duration::seconds(cfg.auth_lockout_secs);
    let recent = db
        .otps()
        .count_documents(doc! { "email": &email, "created_at": { "$gte": since } })
        .await?;
    if recent >= cfg.auth_max_attempts as u64 {
        return Err(AppError::RateLimited(format!(
            "too many attempts — wait {}s",
            cfg.auth_lockout_secs
        )));
    }

    // Invalidate any previous unconsumed challenges so only the latest code works
    let _ = db
        .otps()
        .update_many(
            doc! { "email": &email, "consumed": false },
            doc! { "$set": { "consumed": true } },
        )
        .await;

    let code = generate_otp(cfg.otp_length);
    let challenge = OtpChallenge {
        id: new_id(),
        email: email.clone(),
        code_hash: hash_otp(&code),
        attempts: 0,
        max_attempts: cfg.auth_max_attempts,
        expires_at: bson::DateTime::from_chrono(Utc::now() + Duration::seconds(cfg.otp_ttl_secs)),
        created_at: bson::DateTime::from_chrono(Utc::now()),
        consumed: false,
    };
    db.otps().insert_one(&challenge).await?;

    // Production: send email via your SMTP. For local/dev we log the code
    // only when LOG_OTP_CODES=true (default true in .env) to avoid leaking
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
    body: web::Json<VerifyBody>,
) -> AppResult<HttpResponse> {
    validate_email(&body.email)?;
    let email = body.email.trim().to_lowercase();
    let code = body.code.trim().to_string();
    let expected_len = cfg.otp_length as usize;
    if code.len() != expected_len || !code.chars().all(|c| c.is_ascii_digit()) {
        return Err(AppError::BadRequest(format!(
            "enter the full {expected_len}-digit code"
        )));
    }

    // Prefer the newest unconsumed, unexpired challenge
    let challenge = db
        .otps()
        .find_one(doc! {
            "email": &email,
            "consumed": false,
            "expires_at": { "$gt": Utc::now() }
        })
        .await?
        .ok_or_else(|| {
            AppError::BadRequest("code expired or not found — request a new one".into())
        })?;

    if !verify_otp(&code, &challenge.code_hash) {
        // Atomic: only increment if under max_attempts (closes TOCTOU window)
        let bumped = db
            .otps()
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
    let consumed = db
        .otps()
        .update_one(
            doc! { "_id": &challenge.id, "consumed": false },
            doc! { "$set": { "consumed": true } },
        )
        .await?;
    if consumed.matched_count == 0 {
        return Err(AppError::BadRequest(
            "code already used — request a new one".into(),
        ));
    }

    let mut user = upsert_user_by_email(&db, &cfg, &email, None).await?;
    if !user.is_active {
        return Err(AppError::Forbidden("account deactivated".into()));
    }
    // Bind stable device id when client sends one (license / anti-abuse)
    if let Some(ref did) = body.device_id {
        let did = did.trim();
        if !did.is_empty() && user.device_id.as_deref() != Some(did) {
            user.device_id = Some(did.to_string());
            let _ = db
                .users()
                .update_one(
                    doc! { "_id": &user.id },
                    doc! { "$set": { "device_id": did, "last_login_at": Utc::now() } },
                )
                .await;
        }
    }
    let tokens = issue_pair(&cfg, &user.id, &user.email)?;
    store_refresh(&db, &user.id, &tokens.refresh_token).await?;

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
    body: web::Json<PasswordRegister>,
) -> AppResult<HttpResponse> {
    validate_email(&body.email)?;
    if body.password.len() < 8 || body.password.len() > 128 {
        return Err(AppError::BadRequest(
            "password must be 8–128 characters".into(),
        ));
    }
    let email = body.email.trim().to_lowercase();
    if db
        .users()
        .find_one(doc! { "email": &email })
        .await?
        .is_some()
    {
        return Err(AppError::Conflict("email already registered".into()));
    }
    let mut user = User::new(email, body.display_name.clone(), cfg.signup_bonus_credits);
    user.password_hash = Some(hash_password(&body.password)?);
    if let Some(ref did) = body.device_id {
        let did = did.trim();
        if !did.is_empty() {
            user.device_id = Some(did.to_string());
        }
    }
    db.users().insert_one(&user).await?;
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
        db.ledger().insert_one(&entry).await?;
    }
    let tokens = issue_pair(&cfg, &user.id, &user.email)?;
    store_refresh(&db, &user.id, &tokens.refresh_token).await?;
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
    let ip = req
        .peer_addr()
        .map(|a| a.ip().to_string())
        .unwrap_or_else(|| "unknown".into());
    if !crate::auth::check_rate_limit(&ip, "login", 5, 60) {
        return Err(AppError::RateLimited(
            "too many login attempts — try again in 60 seconds".into(),
        ));
    }
    validate_email(&body.email)?;
    let email = body.email.trim().to_lowercase();
    let user = db
        .users()
        .find_one(doc! { "email": &email })
        .await?
        .ok_or_else(|| AppError::Unauthorized("invalid credentials".into()))?;
    let hash = user
        .password_hash
        .as_deref()
        .ok_or_else(|| AppError::Unauthorized("use magic link for this account".into()))?;
    if !verify_password(&body.password, hash)? {
        return Err(AppError::Unauthorized("invalid credentials".into()));
    }
    if !user.is_active {
        return Err(AppError::Forbidden("account disabled".into()));
    }
    let mut set_doc = doc! { "last_login_at": Utc::now() };
    if let Some(ref did) = body.device_id {
        let did = did.trim();
        if !did.is_empty() {
            set_doc.insert("device_id", did);
        }
    }
    db.users()
        .update_one(doc! { "_id": &user.id }, doc! { "$set": set_doc })
        .await?;
    let tokens = issue_pair(&cfg, &user.id, &user.email)?;
    store_refresh(&db, &user.id, &tokens.refresh_token).await?;
    // Refresh public view after device bind
    let user = db
        .users()
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
    body: web::Json<RefreshBody>,
) -> AppResult<HttpResponse> {
    let claims = decode_refresh(&cfg, &body.refresh_token)?;
    let th = hash_token(&body.refresh_token);

    // Shared refresh for both products — check LiveMorph then Live Escape token stores
    let in_lm = db
        .refresh_tokens()
        .find_one(doc! { "token_hash": &th })
        .await?
        .is_some();
    let in_le = if !in_lm {
        db.refresh_tokens_le()
            .find_one(doc! { "token_hash": &th })
            .await?
            .is_some()
    } else {
        false
    };
    if !in_lm && !in_le {
        let _ = db
            .refresh_tokens()
            .delete_many(doc! { "user_id": &claims.sub })
            .await;
        let _ = db
            .refresh_tokens_le()
            .delete_many(doc! { "user_id": &claims.sub })
            .await;
        audit(&db, &claims.sub, "refresh_reuse_detected", None).await;
        return Err(AppError::Unauthorized(
            "refresh token revoked — sign in again".into(),
        ));
    }

    let (user, is_le) = if in_le {
        let u = db
            .users_le()
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
    let tokens = issue_pair(&cfg, &user.id, &user.email)?;
    if is_le {
        db.refresh_tokens_le()
            .delete_one(doc! { "token_hash": &th })
            .await?;
        // store rotated token in LE collection (same hash scheme as LM)
        let new_hash = hash_token(&tokens.refresh_token);
        db.refresh_tokens_le()
            .insert_one(doc! {
                "_id": crate::db::new_id(),
                "user_id": &user.id,
                "token_hash": new_hash,
                "created_at": chrono::Utc::now(),
            })
            .await?;
    } else {
        db.refresh_tokens()
            .delete_one(doc! { "token_hash": &th })
            .await?;
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

#[post("/auth/me")]
async fn me(db: web::Data<Db>, req: HttpRequest) -> AppResult<HttpResponse> {
    let auth = req
        .extensions()
        .get::<AuthUser>()
        .cloned()
        .ok_or_else(|| AppError::Unauthorized("not authenticated".into()))?;
    let user = db
        .users()
        .find_one(doc! { "_id": &auth.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;
    Ok(HttpResponse::Ok().json(user.public_view()))
}

#[post("/auth/logout")]
async fn logout(
    db: web::Data<Db>,
    req: HttpRequest,
    body: web::Json<RefreshBody>,
) -> AppResult<HttpResponse> {
    let _ = req;
    if body.refresh_token.trim().len() < 16 {
        return Err(AppError::BadRequest("invalid refresh token".into()));
    }
    let th = hash_token(&body.refresh_token);
    db.refresh_tokens()
        .delete_one(doc! { "token_hash": &th })
        .await?;
    Ok(HttpResponse::Ok().json(json!({ "ok": true })))
}

#[post("/auth/logout_all")]
async fn logout_all(db: web::Data<Db>, req: HttpRequest) -> AppResult<HttpResponse> {
    let auth = req
        .extensions()
        .get::<AuthUser>()
        .cloned()
        .ok_or_else(|| AppError::Unauthorized("not authenticated".into()))?;
    db.refresh_tokens()
        .delete_many(doc! { "user_id": &auth.user_id })
        .await?;
    // Also clear LE refresh tokens if the user exists in the LE collection (same email)
    if let Ok(Some(lm_user)) = db.users().find_one(doc! { "_id": &auth.user_id }).await {
        let _ = db
            .users_le()
            .update_one(
                doc! { "email": &lm_user.email },
                doc! { "$unset": { "le_refresh_token": "" } },
            )
            .await;
    }
    audit(&db, &auth.user_id, "logout_all", None).await;
    Ok(HttpResponse::Ok().json(json!({ "ok": true })))
}

/// GDPR-style data export
#[post("/auth/export")]
async fn export_data(db: web::Data<Db>, req: HttpRequest) -> AppResult<HttpResponse> {
    let auth = req
        .extensions()
        .get::<AuthUser>()
        .cloned()
        .ok_or_else(|| AppError::Unauthorized("not authenticated".into()))?;
    let user = db
        .users()
        .find_one(doc! { "_id": &auth.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;
    use futures_util::TryStreamExt;
    let mut ledger_cur = db.ledger().find(doc! { "user_id": &auth.user_id }).await?;
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
    let mut sess_cur = db
        .sessions()
        .find(doc! { "user_id": &auth.user_id })
        .await?;
    let mut sessions = Vec::new();
    let mut sessions_truncated = false;
    while let Some(s) = sess_cur.try_next().await? {
        if sessions.len() >= 200 {
            sessions_truncated = true;
            break;
        }
        sessions.push(serde_json::json!({
            "id": s.id,
            "status": s.status,
            "started_at": s.started_at,
            "ended_at": s.ended_at,
            "generation_seconds": s.generation_seconds,
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
    // Get user email before anonymizing so we can clean up LE tokens
    let user_email = db
        .users()
        .find_one(doc! { "_id": &auth.user_id })
        .await?
        .map(|u| u.email.clone());
    let anon = format!("deleted+{}@invalid.local", auth.user_id);
    db.users()
        .update_one(
            doc! { "_id": &auth.user_id },
            doc! { "$set": {
                "email": &anon,
                "display_name": "Deleted User",
                "password_hash": null,
                "is_active": false,
                "credit_balance": 0.0,
                "bonus_balance": 0.0,
                "updated_at": chrono::Utc::now(),
            }},
        )
        .await?;
    db.refresh_tokens()
        .delete_many(doc! { "user_id": &auth.user_id })
        .await?;
    // Also deactivate LE account if present (same email)
    if let Some(ref email) = user_email {
        let _ = db
            .users_le()
            .update_one(
                doc! { "email": email },
                doc! { "$set": { "is_active": false }, "$unset": { "le_refresh_token": "" } },
            )
            .await;
    }
    audit(&db, &auth.user_id, "account_deleted", None).await;
    Ok(HttpResponse::Ok().json(json!({ "ok": true })))
}

#[post("/auth/clear")]
async fn clear_session(db: web::Data<Db>, req: HttpRequest) -> AppResult<HttpResponse> {
    let auth_opt = req.extensions().get::<AuthUser>().cloned();
    if let Some(auth) = auth_opt {
        db.refresh_tokens()
            .delete_many(doc! { "user_id": &auth.user_id })
            .await?;
    }
    Ok(HttpResponse::Ok().json(json!({ "ok": true })))
}

async fn upsert_user_by_email(
    db: &Db,
    cfg: &Config,
    email: &str,
    display_name: Option<String>,
) -> AppResult<User> {
    if let Some(u) = db.users().find_one(doc! { "email": email }).await? {
        db.users()
            .update_one(
                doc! { "_id": &u.id },
                doc! { "$set": { "last_login_at": Utc::now() } },
            )
            .await?;
        return Ok(u);
    }
    let user = User::new(email.to_string(), display_name, cfg.signup_bonus_credits);
    db.users().insert_one(&user).await?;
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
        db.ledger().insert_one(&entry).await?;
    }
    Ok(user)
}

pub fn hash_token(token: &str) -> String {
    use sha2::{Digest, Sha256};
    let mut h = Sha256::new();
    h.update(token.as_bytes());
    hex::encode(h.finalize())
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
) -> AppResult<HttpResponse> {
    if !google_oauth::is_configured(&cfg) {
        return Err(AppError::BadRequest(
            "Google sign-in is not configured on this server".into(),
        ));
    }
    let state = google_oauth::new_state();
    // Persist state briefly for CSRF (reuse otps collection shape as lightweight store)
    let exp = Utc::now() + Duration::minutes(15);
    db.db
        .collection::<mongodb::bson::Document>("oauth_states")
        .insert_one(doc! {
            "_id": &state,
            "provider": "google",
            "expires_at": exp,
        })
        .await?;
    let url = google_oauth::authorization_url(&cfg, &state)?;
    Ok(HttpResponse::Ok().json(json!({
        "authorization_url": url,
        "state": state,
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
        let deep = format!(
            "livemorph://oauth/callback?error={}",
            urlencoding_simple(err)
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

    // Validate state
    let states = db.db.collection::<mongodb::bson::Document>("oauth_states");
    let st = states
        .find_one_and_delete(doc! {
            "_id": state,
            "provider": "google",
            "expires_at": { "$gt": Utc::now() }
        })
        .await?;
    if st.is_none() {
        return Err(AppError::BadRequest(
            "invalid or expired OAuth state".into(),
        ));
    }

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
    if info.verified_email == Some(false) {
        return Err(AppError::BadRequest("Google email is not verified".into()));
    }

    let email = info.email.trim().to_lowercase();
    let user = upsert_google_user(&db, &cfg, &email, &info.id, info.name.clone()).await?;
    if !user.is_active {
        return Err(AppError::Forbidden("account deactivated".into()));
    }
    // One-time ticket: user_id only — JWT minted on /exchange (no tokens at rest)
    let ticket = uuid::Uuid::new_v4().simple().to_string();
    let exp = Utc::now() + Duration::minutes(5);
    db.db
        .collection::<mongodb::bson::Document>("oauth_tickets")
        .insert_one(doc! {
            "_id": &ticket,
            "user_id": &user.id,
            "email": &user.email,
            "expires_at": exp,
            "consumed": false,
        })
        .await?;

    // Store state→ticket mapping so the desktop app can poll for the result
    db.db
        .collection::<mongodb::bson::Document>("oauth_results")
        .insert_one(doc! {
            "_id": state,
            "ticket": &ticket,
            "created_at": Utc::now(),
        })
        .await?;

    let deep = format!(
        "livemorph://oauth/callback?ticket={}",
        urlencoding_simple(&ticket)
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
    query: web::Query<std::collections::HashMap<String, String>>,
) -> AppResult<HttpResponse> {
    let state = query
        .get("state")
        .ok_or_else(|| AppError::BadRequest("missing state".into()))?;
    let results = db.db.collection::<mongodb::bson::Document>("oauth_results");
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
}

/// Desktop redeems one-time ticket → JWT pair (production-safe vs tokens in URL).
#[post("/auth/oauth/google/exchange")]
async fn oauth_google_exchange(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    body: web::Json<OAuthExchangeBody>,
) -> AppResult<HttpResponse> {
    let ticket = body.ticket.trim();
    if ticket.is_empty() {
        return Err(AppError::BadRequest("missing ticket".into()));
    }
    let coll = db.db.collection::<mongodb::bson::Document>("oauth_tickets");
    let doc = coll
        .find_one_and_update(
            doc! {
                "_id": ticket,
                "consumed": false,
                "expires_at": { "$gt": Utc::now() }
            },
            doc! { "$set": { "consumed": true } },
        )
        .await?
        .ok_or_else(|| AppError::BadRequest("invalid or expired OAuth ticket".into()))?;

    let user_id = doc.get_str("user_id").unwrap_or("").to_string();
    if user_id.is_empty() {
        return Err(AppError::Internal("ticket missing user".into()));
    }
    let user = db
        .users()
        .find_one(doc! { "_id": &user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;
    if !user.is_active {
        return Err(AppError::Forbidden("account deactivated".into()));
    }

    // Mint tokens only at redeem time — never stored on the ticket document
    let jwt = issue_pair(&cfg, &user.id, &user.email)?;
    store_refresh(&db, &user.id, &jwt.refresh_token).await?;

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
    email: &str,
    google_sub: &str,
    display_name: Option<String>,
) -> AppResult<User> {
    // Prefer match by google_sub, then by email
    if let Some(mut u) = db
        .users()
        .find_one(doc! { "google_sub": google_sub })
        .await?
    {
        u.last_login_at = Some(bson::DateTime::from_chrono(Utc::now()));
        u.updated_at = bson::DateTime::from_chrono(Utc::now());
        if u.email != email {
            u.email = email.to_string();
        }
        db.users().replace_one(doc! { "_id": &u.id }, &u).await?;
        return Ok(u);
    }
    if let Some(mut u) = db.users().find_one(doc! { "email": email }).await? {
        u.google_sub = Some(google_sub.to_string());
        u.last_login_at = Some(bson::DateTime::from_chrono(Utc::now()));
        u.updated_at = bson::DateTime::from_chrono(Utc::now());
        if let Some(n) = display_name {
            if !n.is_empty() {
                u.display_name = n;
            }
        }
        db.users().replace_one(doc! { "_id": &u.id }, &u).await?;
        return Ok(u);
    }
    let mut u = User::new(email.to_string(), display_name, cfg.signup_bonus_credits);
    u.google_sub = Some(google_sub.to_string());
    u.last_login_at = Some(bson::DateTime::from_chrono(Utc::now()));
    db.users().insert_one(&u).await?;
    // Signup bonus ledger (best-effort)
    let _ = db
        .db
        .collection::<CreditLedgerEntry>("credit_ledger")
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
