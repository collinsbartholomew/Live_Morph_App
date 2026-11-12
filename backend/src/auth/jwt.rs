use crate::config::Config;
use crate::error::{AppError, AppResult};
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: String, // user id
    pub email: String,
    pub typ: String, // access | refresh
    pub iss: String,
    pub exp: i64,
    pub iat: i64,
    pub jti: String,
    /// Product the token was issued for ("livemorph" | "secondary").
    /// Absent on legacy tokens (accepted, but new tokens always carry it).
    #[serde(default)]
    pub aud: Option<String>,
    /// User token_version — bumped on logout_all / password reset / delete so
    /// older access tokens stop validating.
    #[serde(default)]
    pub ver: i64,
}

pub struct TokenPair {
    pub access_token: String,
    pub refresh_token: String,
    pub expires_in: i64,
}

/// Issue a token pair bound to a product (`aud`) and the user's token_version.
pub fn issue_pair_for(cfg: &Config, user_id: &str, email: &str, product: &str, ver: i64) -> AppResult<TokenPair> {
    let access = issue(cfg, user_id, email, "access", cfg.jwt_access_ttl_secs, product, ver)?;
    let refresh = issue(cfg, user_id, email, "refresh", cfg.jwt_refresh_ttl_secs, product, ver)?;
    Ok(TokenPair {
        access_token: access,
        refresh_token: refresh,
        expires_in: cfg.jwt_access_ttl_secs,
    })
}

fn issue(cfg: &Config, user_id: &str, email: &str, typ: &str, ttl: i64, product: &str, ver: i64) -> AppResult<String> {
    let now = Utc::now();
    let claims = Claims {
        sub: user_id.into(),
        email: email.into(),
        typ: typ.into(),
        iss: cfg.jwt_issuer.clone(),
        exp: (now + Duration::seconds(ttl)).timestamp(),
        iat: now.timestamp(),
        jti: Uuid::new_v4().to_string(),
        aud: Some(product.to_string()),
        ver,
    };
    encode(
        &Header::new(jsonwebtoken::Algorithm::HS256),
        &claims,
        &EncodingKey::from_secret(cfg.jwt_secret.as_bytes()),
    )
    .map_err(AppError::from)
}

pub fn decode_access(cfg: &Config, token: &str) -> AppResult<Claims> {
    let mut validation = Validation {
        leeway: 0,
        ..Default::default()
    };
    // Pin the algorithm explicitly — never trust the token's own alg header.
    validation.algorithms = vec![jsonwebtoken::Algorithm::HS256];
    // We bind products via our own aud claim checked in the middleware —
    // jsonwebtoken 11 would reject any token carrying aud when no audience
    // is set on the validator.
    validation.validate_aud = false;
    validation.set_issuer(std::slice::from_ref(&cfg.jwt_issuer));
    let data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(cfg.jwt_secret.as_bytes()),
        &validation,
    )?;
    if data.claims.typ != "access" {
        return Err(AppError::Unauthorized("expected access token".into()));
    }
    Ok(data.claims)
}

pub fn decode_refresh(cfg: &Config, token: &str) -> AppResult<Claims> {
    let mut validation = Validation {
        leeway: 0,
        ..Default::default()
    };
    // Pin the algorithm explicitly — never trust the token's own alg header.
    validation.algorithms = vec![jsonwebtoken::Algorithm::HS256];
    // We bind products via our own aud claim checked in the middleware —
    // jsonwebtoken 11 would reject any token carrying aud when no audience
    // is set on the validator.
    validation.validate_aud = false;
    validation.set_issuer(std::slice::from_ref(&cfg.jwt_issuer));
    let data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(cfg.jwt_secret.as_bytes()),
        &validation,
    )?;
    if data.claims.typ != "refresh" {
        return Err(AppError::Unauthorized("expected refresh token".into()));
    }
    Ok(data.claims)
}
