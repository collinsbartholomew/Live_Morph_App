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
}

pub struct TokenPair {
    pub access_token: String,
    pub refresh_token: String,
    pub expires_in: i64,
}

pub fn issue_pair(cfg: &Config, user_id: &str, email: &str) -> AppResult<TokenPair> {
    let access = issue(cfg, user_id, email, "access", cfg.jwt_access_ttl_secs)?;
    let refresh = issue(cfg, user_id, email, "refresh", cfg.jwt_refresh_ttl_secs)?;
    Ok(TokenPair {
        access_token: access,
        refresh_token: refresh,
        expires_in: cfg.jwt_access_ttl_secs,
    })
}

fn issue(cfg: &Config, user_id: &str, email: &str, typ: &str, ttl: i64) -> AppResult<String> {
    let now = Utc::now();
    let claims = Claims {
        sub: user_id.into(),
        email: email.into(),
        typ: typ.into(),
        iss: cfg.jwt_issuer.clone(),
        exp: (now + Duration::seconds(ttl)).timestamp(),
        iat: now.timestamp(),
        jti: Uuid::new_v4().to_string(),
    };
    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(cfg.jwt_secret.as_bytes()),
    )
    .map_err(AppError::from)
}

pub fn decode_access(cfg: &Config, token: &str) -> AppResult<Claims> {
    let mut validation = Validation {
        leeway: 60,
        ..Default::default()
    };
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
        leeway: 60,
        ..Default::default()
    };
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
