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

#[cfg(test)]
mod alg_confusion_tests {
    use super::*;
    use crate::config::Config;

    fn test_cfg() -> Config {
        let mut c = Config::from_env().expect("test env loads");
        c.jwt_secret = "test-secret-test-secret-test-secret-32".to_string();
        c
    }

    #[test]
    fn alg_none_token_is_rejected() {
        let cfg = test_cfg();
        // Hand-crafted alg:none token (unsigned) — must never validate.
        let header = base64_url(b"{\"alg\":\"none\",\"typ\":\"JWT\"}");
        let payload = base64_url(br#"{"sub":"u","typ":"access","iss":"livemorph","aud":"livemorph","exp":9999999999,"iat":0,"jti":"x","ver":0}"#);
        let token = format!("{header}.{payload}.");
        assert!(decode_access(&cfg, &token).is_err(), "alg:none must be rejected");
    }

    #[test]
    fn wrong_alg_rs256_rejected() {
        let cfg = test_cfg();
        let header = base64_url(b"{\"alg\":\"RS256\",\"typ\":\"JWT\"}");
        let payload = base64_url(br#"{"sub":"u","typ":"access","iss":"livemorph","aud":"livemorph","exp":9999999999,"iat":0,"jti":"x","ver":0}"#);
        let token = format!("{header}.{payload}.fakesig");
        assert!(decode_access(&cfg, &token).is_err(), "RS256 must be rejected (HS256 pinned)");
    }

    #[test]
    fn wrong_secret_rejected() {
        let cfg = test_cfg();
        let pair = issue_pair_for(&cfg, "u1", "u@x.test", "livemorph", 0).unwrap();
        let mut other = test_cfg();
        other.jwt_secret = "a-completely-different-secret-32chars!!".to_string();
        assert!(decode_access(&other, &pair.access_token).is_err());
    }

    #[test]
    fn refresh_token_rejected_by_access_decoder() {
        let cfg = test_cfg();
        let pair = issue_pair_for(&cfg, "u1", "u@x.test", "livemorph", 0).unwrap();
        assert!(decode_access(&cfg, &pair.refresh_token).is_err(), "typ=refresh must not decode as access");
        assert!(decode_refresh(&cfg, &pair.access_token).is_err(), "typ=access must not decode as refresh");
        assert!(decode_refresh(&cfg, &pair.refresh_token).is_ok());
    }

    fn base64_url(data: &[u8]) -> String {
        // minimal base64url encoder for tests
        const T: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
        let mut out = String::new();
        for chunk in data.chunks(3) {
            let b = [chunk[0], *chunk.get(1).unwrap_or(&0), *chunk.get(2).unwrap_or(&0)];
            let n = ((b[0] as u32) << 16) | ((b[1] as u32) << 8) | b[2] as u32;
            out.push(T[(n >> 18) as usize & 63] as char);
            out.push(T[(n >> 12) as usize & 63] as char);
            if chunk.len() > 1 { out.push(T[(n >> 6) as usize & 63] as char); }
            if chunk.len() > 2 { out.push(T[n as usize & 63] as char); }
        }
        out
    }
}
