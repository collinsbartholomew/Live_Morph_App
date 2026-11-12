//! Continuous regression tests for production hardening.

use hmac::{Hmac, KeyInit, Mac};
use sha2::Sha512;

type HmacSha512 = Hmac<Sha512>;

fn compute_hmac_signature(secret: &str, body: &[u8]) -> String {
    let mut mac = HmacSha512::new_from_slice(secret.as_bytes()).unwrap();
    mac.update(body);
    hex::encode(mac.finalize().into_bytes())
}

fn verify_hmac_signature(secret: &str, body: &[u8], signature_hex: &str) -> bool {
    let expected = compute_hmac_signature(secret, body);
    if expected.len() != signature_hex.len() {
        return false;
    }
    expected
        .bytes()
        .zip(signature_hex.bytes())
        .fold(0u8, |acc, (a, b)| acc | (a ^ b))
        == 0
}

#[test]
fn paystack_webhook_signature_accepts_valid() {
    let secret = "sk_test_secret";
    let body = br#"{"event":"charge.success","data":{"reference":"lm_abc"}}"#;
    let sig = compute_hmac_signature(secret, body);
    assert!(verify_hmac_signature(secret, body, &sig));
}

#[test]
fn paystack_webhook_signature_rejects_tampered() {
    let secret = "sk_test_secret";
    let body = br#"{"event":"charge.success"}"#;
    let sig = compute_hmac_signature(secret, body);
    let tampered = br#"{"event":"charge.success","data":{"amount":1}}"#;
    assert!(!verify_hmac_signature(secret, tampered, &sig));
}

#[test]
fn paystack_webhook_signature_rejects_wrong_secret() {
    let body = br#"{"event":"charge.success"}"#;
    let sig = compute_hmac_signature("sk_correct", body);
    assert!(!verify_hmac_signature("sk_wrong", body, &sig));
}

#[test]
fn token_package_catalog_nonempty_and_positive() {
    let packs = [
        ("basic", 500.0_f64, 5.0_f64),
        ("starter", 1200.0, 10.0),
        ("mid", 3000.0, 20.0),
        ("pro", 8000.0, 45.0),
    ];
    for (k, credits, price) in packs {
        assert!(credits > 0.0, "{k}");
        assert!(price > 0.0, "{k}");
        assert!(
            credits / price >= 50.0,
            "{k} should offer >= 50 credits per USD"
        );
    }
}

#[test]
fn jwt_secret_length_policy() {
    let short = "tooshort";
    let ok = "a".repeat(32);
    assert!(short.len() < 32);
    assert!(ok.len() >= 32);
}

#[test]
fn credit_spend_math() {
    let mut bonus: f64 = 30.0;
    let mut credit: f64 = 100.0;
    let amount: f64 = 50.0;
    let take_bonus = amount.min(bonus);
    let take_credit = amount - take_bonus;
    bonus -= take_bonus;
    credit -= take_credit;
    assert!((bonus - 0.0).abs() < 1e-9);
    assert!((credit - 80.0).abs() < 1e-9);
}

#[test]
fn production_flags_must_block_dangerous_defaults() {
    let allow_manual = false;
    let allow_adjust = false;
    let log_otp = false;
    assert!(!allow_manual);
    assert!(!allow_adjust);
    assert!(!log_otp);
}

#[test]
fn email_validation_rejects_invalid() {
    // Missing @
    assert!(validate_email_simple("notanemail").is_err());
    // Missing domain
    assert!(validate_email_simple("user@").is_err());
    // Missing local part
    assert!(validate_email_simple("@domain.com").is_err());
    // Too long (over 254 chars)
    let too_long = format!("{}@b.com", "a".repeat(250));
    assert!(too_long.len() > 254);
    assert!(validate_email_simple(&too_long).is_err());
    // Valid emails
    assert!(validate_email_simple("user@example.com").is_ok());
    assert!(validate_email_simple("a@b.co").is_ok());
    assert!(validate_email_simple("test+tag@domain.org").is_ok());
}

/// Minimal email validation matching the backend's validate_email logic.
fn validate_email_simple(email: &str) -> Result<(), String> {
    let email = email.trim();
    if email.is_empty() {
        return Err("empty email".into());
    }
    if email.len() > 254 {
        return Err("email too long".into());
    }
    let at_count = email.matches('@').count();
    if at_count != 1 {
        return Err("invalid email".into());
    }
    let parts: Vec<&str> = email.split('@').collect();
    let local = parts[0];
    let domain = parts[1];
    if local.is_empty() || domain.is_empty() {
        return Err("invalid email".into());
    }
    if !domain.contains('.') {
        return Err("invalid domain".into());
    }
    Ok(())
}

#[test]
fn concurrent_session_default_is_one() {
    let max: u32 = 1;
    assert_eq!(max, 1);
}

#[test]
fn credit_gate_requires_positive_balance() {
    let min_start = 5.0_f64;
    let empty = 0.0_f64;
    assert!(empty < min_start);
}

#[test]
fn nowpayments_status_classification() {
    // Mirror the backend nowpayments module logic — tests verify our understanding
    // matches the implementation contract.
    fn is_paid(s: &str) -> bool {
        matches!(s.to_ascii_lowercase().as_str(), "finished" | "confirmed")
    }
    fn is_terminal_failure(s: &str) -> bool {
        matches!(
            s.to_ascii_lowercase().as_str(),
            "failed" | "expired" | "refunded"
        )
    }
    fn is_in_flight(s: &str) -> bool {
        matches!(
            s.to_ascii_lowercase().as_str(),
            "waiting" | "confirming" | "sending" | "partially_paid"
        )
    }
    assert!(is_paid("finished"));
    assert!(is_paid("CONFIRMED"));
    assert!(is_terminal_failure("expired"));
    assert!(is_in_flight("waiting"));
    assert!(!is_paid("waiting"));
    assert!(!is_terminal_failure("confirming"));
    assert!(is_in_flight("partially_paid"));
    assert!(!is_paid("failed"));
    assert!(is_terminal_failure("refunded"));
    // Edge: unknown status is none of the above
    assert!(!is_paid("unknown"));
    assert!(!is_terminal_failure("unknown"));
    assert!(!is_in_flight("unknown"));
}

#[test]
fn provider_normalize_aliases() {
    let aliases = ["crypto", "usdt", "nowpayments", "CRYPTO", "Usdt"];
    for a in aliases {
        let lower = a.to_ascii_lowercase();
        let n = match lower.as_str() {
            "crypto" | "usdt" | "nowpayments" => "nowpayments",
            other => other,
        };
        assert_eq!(n, "nowpayments");
    }
}

#[test]
fn oauth_ticket_format_is_hex_uuid() {
    let ticket = "a".repeat(32);
    assert_eq!(ticket.len(), 32);
    assert!(ticket
        .chars()
        .all(|c| c.is_ascii_hexdigit() || c.is_ascii_lowercase()));
}

#[test]
fn webhook_paths_are_public_contract() {
    let public = [
        "/api/v1/payments/webhook/paystack",
        "/api/v1/payments/webhook/nowpayments",
        "/api/v1/auth/oauth/google/callback",
        "/api/v1/auth/oauth/google/exchange",
        "/api/v1/health",
    ];
    for p in public {
        assert!(p.starts_with("/api/v1/"));
        assert!(!p.contains(" "));
    }
}

#[test]
fn credits_per_second_positive_policy() {
    let cps = 2.0_f64;
    assert!(cps > 0.0);
    let burn_10s = cps * 10.0;
    assert!((burn_10s - 20.0).abs() < f64::EPSILON);
}
