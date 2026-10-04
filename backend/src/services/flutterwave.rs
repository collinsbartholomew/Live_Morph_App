//! Flutterwave card payments (server-side collect + verify).
//!
//! Mirrors the Live Escape Electron reference which used the Flutterwave
//! inline/hosted checkout. We use the hosted standard flow so the desktop
//! client can open a system browser the same way it does for Paystack:
//!
//! 1. `initialize_payment` → POST https://api.flutterwave.com/v3/payments
//!    returns a hosted checkout `link` (surfaced as `authorization_url`).
//! 2. The user pays; Flutterwave redirects the browser back to `redirect_url`.
//! 3. `verify_transaction` → GET /v3/transactions/verify_by_reference?tx_ref=…
//!    confirms "successful" + amount + currency before we provision credits.

use crate::config::Config;
use crate::error::{AppError, AppResult};
use serde::{Deserialize, Serialize};
use serde_json::json;

const API_BASE: &str = "https://api.flutterwave.com/v3";

#[derive(Debug, Serialize)]
struct InitBody<'a> {
    tx_ref: &'a str,
    amount: i64,
    currency: &'a str,
    redirect_url: &'a str,
    #[serde(skip_serializing_if = "Option::is_none")]
    customer: Option<CustomerBody<'a>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    meta: Option<serde_json::Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    payment_options: Option<&'a str>,
}

#[derive(Debug, Serialize)]
struct CustomerBody<'a> {
    email: &'a str,
}

#[derive(Debug, Deserialize)]
pub struct FlutterwaveInitResponse {
    pub status: String,
    pub message: String,
    pub data: Option<FlutterwaveInitData>,
}

#[derive(Debug, Deserialize)]
pub struct FlutterwaveInitData {
    pub link: Option<String>,
    pub tx_ref: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct FlutterwaveVerifyResponse {
    pub status: String,
    pub message: String,
    pub data: Option<Vec<FlutterwaveVerifyData>>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct FlutterwaveVerifyData {
    #[allow(dead_code)]
    pub id: Option<i64>,
    pub tx_ref: Option<String>,
    /// Amount in the currency's minor unit (kobo / cent) as requested.
    pub amount: Option<f64>,
    pub currency: Option<String>,
    pub status: Option<String>,
}

#[derive(Debug, Clone)]
pub struct InitRequest<'a> {
    pub email: &'a str,
    pub amount_subunit: i64,
    pub currency: &'a str,
    /// Unique transaction reference (also the Flutterwave tx_ref).
    pub tx_ref: &'a str,
    pub order_id: &'a str,
    pub package_key: &'a str,
    pub platform: &'a str,
    pub redirect_url: &'a str,
}

fn secret_key(cfg: &Config) -> AppResult<&str> {
    cfg.flutterwave_secret_key
        .as_deref()
        .filter(|s| !s.is_empty())
        .ok_or_else(|| AppError::Internal("FLUTTERWAVE_SECRET_KEY not configured".into()))
}

/// Create a hosted checkout. Returns the checkout link (authorization_url).
pub async fn initialize_payment(
    cfg: &Config,
    req: &InitRequest<'_>,
) -> AppResult<FlutterwaveInitData> {
    let key = secret_key(cfg)?;
    let body = InitBody {
        tx_ref: req.tx_ref,
        amount: req.amount_subunit,
        currency: req.currency,
        redirect_url: req.redirect_url,
        customer: Some(CustomerBody { email: req.email }),
        meta: Some(json!({
            "order_id": req.order_id,
            "package_key": req.package_key,
            "platform": req.platform,
        })),
        payment_options: Some("card"),
    };

    let client = crate::services::http_client::shared();
    let res = client
        .post(format!("{API_BASE}/payments"))
        .bearer_auth(key)
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await
        .map_err(|e| AppError::Internal(format!("flutterwave init network: {e}")))?;

    let status = res.status();
    let parsed: FlutterwaveInitResponse = res
        .json()
        .await
        .map_err(|e| AppError::Internal(format!("flutterwave init parse: {e}")))?;

    if !status.is_success() || !parsed.status.eq_ignore_ascii_case("success") {
        tracing::warn!(msg = %parsed.message, "flutterwave init failed");
        return Err(AppError::BadRequest(
            "payment provider declined the request".into(),
        ));
    }

    parsed
        .data
        .ok_or_else(|| AppError::Internal("flutterwave init missing data".into()))
}

/// Verify a transaction by tx_ref. Returns the successful transaction data.
pub async fn verify_transaction(cfg: &Config, tx_ref: &str) -> AppResult<FlutterwaveVerifyData> {
    let key = secret_key(cfg)?;
    let client = crate::services::http_client::shared();
    let url = format!("{API_BASE}/transactions/verify_by_reference?tx_ref={tx_ref}");
    let res = client
        .get(&url)
        .bearer_auth(key)
        .send()
        .await
        .map_err(|e| AppError::Internal(format!("flutterwave verify network: {e}")))?;

    let parsed: FlutterwaveVerifyResponse = res
        .json()
        .await
        .map_err(|e| AppError::Internal(format!("flutterwave verify parse: {e}")))?;

    if !parsed.status.eq_ignore_ascii_case("success") {
        tracing::error!(message = %parsed.message, "flutterwave verify failed");
        return Err(AppError::BadRequest("payment verification failed".into()));
    }

    let items = parsed.data.unwrap_or_default();
    // Take the entry matching our tx_ref (most recent successful charge).
    let data = items
        .iter()
        .find(|d| d.tx_ref.as_deref() == Some(tx_ref) || d.tx_ref.is_none())
        .or_else(|| items.first())
        .cloned()
        .ok_or_else(|| AppError::BadRequest("transaction not found".into()))?;

    let ok = data
        .status
        .as_deref()
        .map(|s| s.eq_ignore_ascii_case("successful"))
        .unwrap_or(false);
    if !ok {
        tracing::error!(
            status = ?data.status,
            "flutterwave transaction not successful"
        );
        return Err(AppError::BadRequest("payment was not successful".into()));
    }

    Ok(data)
}

/// Flutterwave amount/currency are matched with a small tolerance to absorb
/// exchange-rate or rounding drift between order creation and settlement.
pub fn amount_matches(order_subunit: i64, paid_amount: Option<f64>) -> bool {
    let Some(paid) = paid_amount else { return false };
    let delta = (paid - order_subunit as f64).abs();
    delta < (order_subunit as f64 * 0.02).max(1.0)
}