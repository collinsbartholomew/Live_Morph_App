//! Paystack Initialize + Verify (server-side only).
//! Money settles in YOUR Paystack balance; we then credit the user's platform tokens.

use crate::config::Config;
use crate::error::{AppError, AppResult};
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Debug, Serialize)]
struct InitBody<'a> {
    email: &'a str,
    amount: i64,
    currency: &'a str,
    reference: &'a str,
    callback_url: Option<&'a str>,
    metadata: serde_json::Value,
}

#[derive(Debug, Deserialize)]
pub struct PaystackInitResponse {
    pub status: bool,
    pub message: String,
    pub data: Option<PaystackInitData>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct PaystackInitData {
    pub authorization_url: String,
    pub access_code: String,
    pub reference: String,
}

#[derive(Debug, Deserialize)]
pub struct PaystackVerifyResponse {
    pub status: bool,
    pub message: String,
    pub data: Option<PaystackVerifyData>,
}

#[derive(Debug, Deserialize)]
pub struct PaystackVerifyData {
    pub status: String,
    pub reference: String,
    pub amount: i64,
    pub currency: String,
}

#[derive(Debug, Clone)]
pub struct InitRequest<'a> {
    pub email: &'a str,
    pub amount_subunit: i64,
    pub currency: &'a str,
    /// Unique transaction reference (also echoed in webhook lookups).
    pub reference: &'a str,
    /// Internal order id stored in Paystack metadata.
    pub order_id: &'a str,
    /// Package / plan key stored in Paystack metadata.
    pub package_key: &'a str,
    /// Product identity ("livemorph" | "liveescape") stored in metadata.
    pub platform: &'a str,
}

pub async fn initialize_transaction(
    cfg: &Config,
    req: &InitRequest<'_>,
) -> AppResult<PaystackInitData> {
    let secret = cfg
        .paystack_secret_key
        .as_ref()
        .ok_or_else(|| AppError::Internal("PAYSTACK_SECRET_KEY not configured".into()))?;

    let client = crate::services::http_client::shared();
    let body = InitBody {
        email: req.email,
        amount: req.amount_subunit,
        currency: req.currency,
        reference: req.reference,
        callback_url: cfg.paystack_callback_url.as_deref(),
        metadata: json!({
            "order_id": req.order_id,
            "package_key": req.package_key,
            "platform": req.platform,
        }),
    };

    let res = client
        .post("https://api.paystack.co/transaction/initialize")
        .bearer_auth(secret)
        .json(&body)
        .send()
        .await
        .map_err(|e| AppError::Internal(format!("paystack init network: {e}")))?;

    let status = res.status();
    let parsed: PaystackInitResponse = res
        .json()
        .await
        .map_err(|e| AppError::Internal(format!("paystack init parse: {e}")))?;

    if !status.is_success() || !parsed.status {
        tracing::warn!(msg = %parsed.message, "paystack init failed");
        return Err(AppError::BadRequest(
            "payment provider declined the request".into(),
        ));
    }

    parsed
        .data
        .ok_or_else(|| AppError::Internal("paystack init missing data".into()))
}

pub async fn verify_transaction(cfg: &Config, reference: &str) -> AppResult<PaystackVerifyData> {
    let secret = cfg
        .paystack_secret_key
        .as_ref()
        .ok_or_else(|| AppError::Internal("PAYSTACK_SECRET_KEY not configured".into()))?;

    let client = crate::services::http_client::shared();
    let url = format!("https://api.paystack.co/transaction/verify/{reference}");
    let res = client
        .get(&url)
        .bearer_auth(secret)
        .send()
        .await
        .map_err(|e| AppError::Internal(format!("paystack verify network: {e}")))?;

    let parsed: PaystackVerifyResponse = res
        .json()
        .await
        .map_err(|e| AppError::Internal(format!("paystack verify parse: {e}")))?;

    if !parsed.status {
        tracing::error!(message = %parsed.message, "Paystack verify failed");
        return Err(AppError::BadRequest("payment verification failed".into()));
    }

    let data = parsed
        .data
        .ok_or_else(|| AppError::Internal("paystack verify missing data".into()))?;

    if data.status != "success" {
        tracing::error!(status = %data.status, "Paystack transaction not successful");
        return Err(AppError::BadRequest("payment was not successful".into()));
    }

    Ok(data)
}

/// Paystack signs the raw body with HMAC-SHA512 using the secret key.
pub fn verify_webhook_signature(secret: &str, body: &[u8], signature_hex: &str) -> bool {
    use hmac::{Hmac, KeyInit, Mac};
    use sha2::Sha512;
    type HmacSha512 = Hmac<Sha512>;

    let Ok(mut mac) = HmacSha512::new_from_slice(secret.as_bytes()) else {
        return false;
    };
    mac.update(body);
    let result = mac.finalize();
    let expected = hex::encode(result.into_bytes());
    // Constant-time-ish compare
    if expected.len() != signature_hex.len() {
        return false;
    }
    expected
        .bytes()
        .zip(signature_hex.bytes())
        .fold(0u8, |acc, (a, b)| acc | (a ^ b))
        == 0
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sign(secret: &str, body: &[u8]) -> String {
        use hmac::{Hmac, KeyInit, Mac};
        use sha2::Sha512;
        type HmacSha512 = Hmac<Sha512>;
        let mut mac = HmacSha512::new_from_slice(secret.as_bytes()).unwrap();
        mac.update(body);
        hex::encode(mac.finalize().into_bytes())
    }

    #[test]
    fn accepts_valid_signature() {
        let secret = "sk_test_secret";
        let body = br#"{"event":"charge.success","data":{"reference":"lm_abc"}}"#;
        let sig = sign(secret, body);
        assert!(verify_webhook_signature(secret, body, &sig));
    }

    #[test]
    fn rejects_tampered_body() {
        let secret = "sk_test_secret";
        let body = br#"{"event":"charge.success","data":{"reference":"lm_abc"}}"#;
        let sig = sign(secret, body);
        let tampered = br#"{"event":"charge.success","data":{"reference":"lm_xyz"}}"#;
        assert!(!verify_webhook_signature(secret, tampered, &sig));
    }

    #[test]
    fn rejects_wrong_secret() {
        let body = br#"{"event":"charge.success"}"#;
        let sig = sign("sk_correct", body);
        assert!(!verify_webhook_signature("sk_wrong", body, &sig));
    }
}
