//! Google OAuth 2.0 (Authorization Code) for desktop + web callback.
//! Secrets stay server-side. Client only opens the auth URL and receives JWTs via deep link.

use crate::config::Config;
use crate::error::{AppError, AppResult};
use serde::Deserialize;
use std::sync::Arc;
use uuid::Uuid;

#[derive(Debug, Deserialize)]
pub struct GoogleTokenResponse {
    pub access_token: String,
    pub expires_in: Option<u64>,
    pub id_token: Option<String>,
    pub token_type: Option<String>,
    pub scope: Option<String>,
    pub refresh_token: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct GoogleUserInfo {
    pub id: String,
    pub email: String,
    pub verified_email: Option<bool>,
    pub name: Option<String>,
    pub picture: Option<String>,
}

pub fn is_configured(cfg: &Config) -> bool {
    cfg.google_client_id
        .as_ref()
        .map(|s| !s.is_empty())
        .unwrap_or(false)
        && cfg
            .google_client_secret
            .as_ref()
            .map(|s| !s.is_empty())
            .unwrap_or(false)
}

pub fn redirect_uri(cfg: &Config) -> String {
    cfg.google_redirect_uri.clone().unwrap_or_else(|| {
        format!(
            "{}/api/v1/auth/oauth/google/callback",
            cfg.public_base_url.trim_end_matches('/')
        )
    })
}

/// Build Google authorization URL. `state` must be stored server-side or echoed back.
pub fn authorization_url(cfg: &Config, state: &str) -> AppResult<String> {
    if !is_configured(cfg) {
        return Err(AppError::BadRequest(
            "Google OAuth is not configured (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET)".into(),
        ));
    }
    let client_id = cfg
        .google_client_id
        .as_ref()
        .filter(|s| !s.is_empty())
        .ok_or_else(|| AppError::BadRequest("GOOGLE_CLIENT_ID missing".into()))?;
    let redirect = redirect_uri(cfg);
    let mut url = url::Url::parse("https://accounts.google.com/o/oauth2/v2/auth")
        .map_err(|e| AppError::Internal(format!("oauth url: {e}")))?;
    {
        let mut q = url.query_pairs_mut();
        q.append_pair("client_id", client_id);
        q.append_pair("redirect_uri", &redirect);
        q.append_pair("response_type", "code");
        q.append_pair("scope", "openid email profile");
        q.append_pair("access_type", "offline");
        q.append_pair("prompt", "select_account");
        q.append_pair("state", state);
    }
    Ok(url.into())
}

pub fn new_state() -> String {
    Uuid::new_v4().simple().to_string()
}

pub async fn exchange_code(cfg: &Arc<Config>, code: &str) -> AppResult<GoogleTokenResponse> {
    if !is_configured(cfg) {
        return Err(AppError::BadRequest(
            "Google OAuth is not configured".into(),
        ));
    }
    let client_id = cfg
        .google_client_id
        .as_ref()
        .filter(|s| !s.is_empty())
        .ok_or_else(|| AppError::BadRequest("GOOGLE_CLIENT_ID missing".into()))?;
    let client_secret = cfg
        .google_client_secret
        .as_ref()
        .filter(|s| !s.is_empty())
        .ok_or_else(|| AppError::BadRequest("GOOGLE_CLIENT_SECRET missing".into()))?;
    let redirect = redirect_uri(cfg);

    let client = crate::services::http_client::shared();
    let form_body = serde_urlencoded::to_string([
        ("code", code),
        ("client_id", client_id.as_str()),
        ("client_secret", client_secret.as_str()),
        ("redirect_uri", redirect.as_str()),
        ("grant_type", "authorization_code"),
    ])
    .map_err(|e| AppError::Internal(format!("google token form encode: {e}")))?;
    let res = client
        .post("https://oauth2.googleapis.com/token")
        .header("content-type", "application/x-www-form-urlencoded")
        .body(form_body)
        .send()
        .await
        .map_err(|e| AppError::Internal(format!("google token: {e}")))?;

    let status = res.status();
    let text = res
        .text()
        .await
        .map_err(|e| AppError::Internal(format!("google token body: {e}")))?;
    if !status.is_success() {
        tracing::error!(status = %status, body = %text, "Google token exchange failed");
        return Err(AppError::BadRequest("Google authentication failed".into()));
    }
    serde_json::from_str(&text).map_err(|e| AppError::Internal(format!("google token parse: {e}")))
}

pub async fn fetch_userinfo(access_token: &str) -> AppResult<GoogleUserInfo> {
    let client = crate::services::http_client::shared();
    let res = client
        .get("https://www.googleapis.com/oauth2/v2/userinfo")
        .bearer_auth(access_token)
        .send()
        .await
        .map_err(|e| AppError::Internal(format!("google userinfo: {e}")))?;
    let status = res.status();
    let text = res
        .text()
        .await
        .map_err(|e| AppError::Internal(format!("google userinfo body: {e}")))?;
    if !status.is_success() {
        tracing::error!(status = %status, body = %text, "Google userinfo fetch failed");
        return Err(AppError::BadRequest(
            "failed to fetch Google user profile".into(),
        ));
    }
    serde_json::from_str(&text)
        .map_err(|e| AppError::Internal(format!("google userinfo parse: {e}")))
}
