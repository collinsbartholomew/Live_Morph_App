//! NOWPayments (crypto / USDT) integration.
//!
//! Flow mirrors the original Electron BuyCredits crypto path:
//! 1. Create invoice via NOWPayments API
//! 2. Client shows pay_address + pay_amount + tracks status
//! 3. Poll invoice status until finished / failed / expired
//! 4. On finished → provision credits (same ledger path as Paystack)

use crate::config::Config;
use crate::error::{AppError, AppResult};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

const API_BASE: &str = "https://api.nowpayments.io/v1";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CryptoInvoice {
    pub payment_id: String,
    pub payment_status: String,
    pub pay_address: Option<String>,
    pub pay_amount: Option<f64>,
    pub pay_currency: Option<String>,
    pub price_amount: Option<f64>,
    pub price_currency: Option<String>,
    pub order_id: Option<String>,
    pub purchase_id: Option<String>,
    pub outcome_amount: Option<f64>,
    pub outcome_currency: Option<String>,
    pub network: Option<String>,
    pub expiration_estimate_date: Option<String>,
}

#[derive(Debug, Serialize)]
struct CreatePaymentBody<'a> {
    price_amount: f64,
    price_currency: &'a str,
    pay_currency: &'a str,
    order_id: &'a str,
    order_description: &'a str,
    ipn_callback_url: Option<&'a str>,
    #[serde(skip_serializing_if = "Option::is_none")]
    success_url: Option<&'a str>,
    #[serde(skip_serializing_if = "Option::is_none")]
    cancel_url: Option<&'a str>,
}

fn api_key(cfg: &Config) -> AppResult<&str> {
    cfg.nowpayments_api_key
        .as_deref()
        .filter(|s| !s.is_empty())
        .ok_or_else(|| AppError::Internal("NOWPAYMENTS_API_KEY not configured".into()))
}

/// Create a crypto invoice. `pay_currency` e.g. "usdttrc20" or "usdterc20".
pub async fn create_invoice(
    cfg: &Arc<Config>,
    price_usd: f64,
    order_id: &str,
    description: &str,
    pay_currency: &str,
) -> AppResult<CryptoInvoice> {
    let key = api_key(cfg)?;
    let callback = cfg
        .nowpayments_ipn_callback_url
        .as_deref()
        .or(cfg.paystack_callback_url.as_deref());

    let body = CreatePaymentBody {
        price_amount: price_usd,
        price_currency: "usd",
        pay_currency,
        order_id,
        order_description: description,
        ipn_callback_url: callback,
        success_url: None,
        cancel_url: None,
    };

    let client = crate::services::http_client::shared();
    let res = client
        .post(format!("{API_BASE}/payment"))
        .header("x-api-key", key)
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await
        .map_err(|e| AppError::Internal(format!("nowpayments request: {e}")))?;

    let status = res.status();
    let text = res
        .text()
        .await
        .map_err(|_e| AppError::Internal("nowpayments response error".into()))?;

    if !status.is_success() {
        tracing::error!(status = %status, body = %text, "NOWPayments create failed");
        return Err(AppError::BadRequest(
            "payment provider rejected the request".into(),
        ));
    }

    serde_json::from_str::<CryptoInvoice>(&text)
        .map_err(|e| AppError::Internal(format!("nowpayments parse: {e}")))
}

/// Poll payment status by NOWPayments payment_id.
pub async fn get_payment_status(cfg: &Arc<Config>, payment_id: &str) -> AppResult<CryptoInvoice> {
    let key = api_key(cfg)?;
    let client = crate::services::http_client::shared();
    let res = client
        .get(format!("{API_BASE}/payment/{payment_id}"))
        .header("x-api-key", key)
        .send()
        .await
        .map_err(|e| AppError::Internal(format!("nowpayments status: {e}")))?;

    let status = res.status();
    let text = res
        .text()
        .await
        .map_err(|e| AppError::Internal(format!("nowpayments status body: {e}")))?;

    if !status.is_success() {
        tracing::error!(status = %status, body = %text, "NOWPayments status check failed");
        return Err(AppError::BadRequest("payment status check failed".into()));
    }

    serde_json::from_str::<CryptoInvoice>(&text)
        .map_err(|e| AppError::Internal(format!("nowpayments status parse: {e}")))
}

/// Map NOWPayments status → our order lifecycle.
/// finished / confirmed → paid; failed / expired / refunded → terminal failure.
pub fn is_paid(status: &str) -> bool {
    matches!(
        status.to_ascii_lowercase().as_str(),
        "finished" | "confirmed"
    )
}

pub fn is_terminal_failure(status: &str) -> bool {
    matches!(
        status.to_ascii_lowercase().as_str(),
        "failed" | "expired" | "refunded"
    )
}

pub fn is_in_flight(status: &str) -> bool {
    matches!(
        status.to_ascii_lowercase().as_str(),
        "waiting" | "confirming" | "sending" | "partially_paid"
    )
}

/// NOWPayments IPN: HMAC-SHA512 of sorted JSON body with IPN secret; header `x-nowpayments-sig`.
pub fn verify_ipn_signature(secret: &str, body: &[u8], signature_hex: &str) -> bool {
    use hmac::{Hmac, KeyInit, Mac};
    use sha2::Sha512;
    type HmacSha512 = Hmac<Sha512>;

    // Parse JSON and re-serialize with sorted keys for stable MAC input
    let Ok(v) = serde_json::from_slice::<serde_json::Value>(body) else {
        return false;
    };
    let sorted = sort_json(&v);
    let Ok(payload) = serde_json::to_vec(&sorted) else {
        return false;
    };
    let Ok(mut mac) = HmacSha512::new_from_slice(secret.as_bytes()) else {
        return false;
    };
    mac.update(&payload);
    let expected = hex::encode(mac.finalize().into_bytes());
    if expected.len() != signature_hex.len() {
        return false;
    }
    expected
        .bytes()
        .zip(signature_hex.bytes())
        .fold(0u8, |acc, (a, b)| acc | (a ^ b))
        == 0
}

fn sort_json(v: &serde_json::Value) -> serde_json::Value {
    match v {
        serde_json::Value::Object(map) => {
            let mut keys: Vec<_> = map.keys().cloned().collect();
            keys.sort();
            let mut out = serde_json::Map::new();
            for k in keys {
                if let Some(val) = map.get(&k) {
                    out.insert(k, sort_json(val));
                }
            }
            serde_json::Value::Object(out)
        }
        serde_json::Value::Array(arr) => {
            serde_json::Value::Array(arr.iter().map(sort_json).collect())
        }
        other => other.clone(),
    }
}
