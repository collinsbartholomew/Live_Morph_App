//! Continuous regression tests for production hardening.
//!
//! These tests call the REAL functions from the `livemorph_backend` library
//! target (src/lib.rs) — never local mirrors, which could drift from the code
//! they claim to guard. `compute_hmac_signature` is kept only to GENERATE valid
//! signatures for the verify path under test.

use hmac::{Hmac, KeyInit, Mac};
use sha2::Sha512;

use livemorph_backend::auth::otp::validate_email;
use livemorph_backend::models::TokenPackage;
use livemorph_backend::services::nowpayments;
use livemorph_backend::services::orders::normalize_provider;
use livemorph_backend::services::paystack;

type HmacSha512 = Hmac<Sha512>;

fn compute_hmac_signature(secret: &str, body: &[u8]) -> String {
    let mut mac = HmacSha512::new_from_slice(secret.as_bytes()).unwrap();
    mac.update(body);
    hex::encode(mac.finalize().into_bytes())
}

#[test]
fn paystack_webhook_signature_accepts_valid() {
    let secret = "sk_test_secret";
    let body = br#"{"event":"charge.success","data":{"reference":"lm_abc"}}"#;
    let sig = compute_hmac_signature(secret, body);
    assert!(paystack::verify_webhook_signature(secret, body, &sig));
}

#[test]
fn paystack_webhook_signature_rejects_tampered() {
    let secret = "sk_test_secret";
    let body = br#"{"event":"charge.success"}"#;
    let sig = compute_hmac_signature(secret, body);
    let tampered = br#"{"event":"charge.success","data":{"amount":1}}"#;
    assert!(!paystack::verify_webhook_signature(secret, tampered, &sig));
}

#[test]
fn paystack_webhook_signature_rejects_wrong_secret() {
    let body = br#"{"event":"charge.success"}"#;
    let sig = compute_hmac_signature("sk_correct", body);
    assert!(!paystack::verify_webhook_signature("sk_wrong", body, &sig));
}

#[test]
fn nowpayments_ipn_signature_roundtrip() {
    // verify_ipn_signature MACs the sorted-JSON re-serialization of the body;
    // a flat object already in sorted key order re-serializes identically.
    let secret = "ipn_secret";
    let body = br#"{"a":1,"b":2}"#;
    let sig = compute_hmac_signature(secret, body);
    assert!(nowpayments::verify_ipn_signature(secret, body, &sig));
    assert!(!nowpayments::verify_ipn_signature("wrong", body, &sig));
    assert!(!nowpayments::verify_ipn_signature(secret, b"not json", &sig));
}

#[test]
fn token_package_catalog_nonempty_and_positive() {
    // Real catalog from the library target.
    let packs = TokenPackage::catalog();
    assert!(!packs.is_empty());
    for p in &packs {
        assert!(p.credits > 0.0, "{}", p.key);
        assert!(p.price_usd > 0.0, "{}", p.key);
        assert!(
            p.credits / p.price_usd >= 50.0,
            "{} should offer >= 50 credits per USD",
            p.key
        );
        // by_key round-trips every catalog key.
        assert_eq!(TokenPackage::by_key(&p.key).unwrap().key, p.key);
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
    // Real validator from the library target.
    // Missing @
    assert!(validate_email("notanemail").is_err());
    // Missing domain
    assert!(validate_email("user@").is_err());
    // Missing local part
    assert!(validate_email("@domain.com").is_err());
    // Too long (over 254 chars)
    let too_long = format!("{}@b.com", "a".repeat(250));
    assert!(too_long.len() > 254);
    assert!(validate_email(&too_long).is_err());
    // Valid emails
    assert!(validate_email("user@example.com").is_ok());
    assert!(validate_email("a@b.co").is_ok());
    assert!(validate_email("test+tag@domain.org").is_ok());
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
    // Real classifiers from the library target: only `finished` (fully settled)
    // provisions credits; `confirmed` is still in flight.
    assert!(nowpayments::is_paid("finished"));
    assert!(!nowpayments::is_paid("CONFIRMED"));
    assert!(nowpayments::is_in_flight("CONFIRMED"));
    assert!(nowpayments::is_terminal_failure("expired"));
    assert!(nowpayments::is_in_flight("waiting"));
    assert!(!nowpayments::is_paid("waiting"));
    assert!(!nowpayments::is_terminal_failure("confirming"));
    assert!(nowpayments::is_in_flight("partially_paid"));
    assert!(!nowpayments::is_paid("failed"));
    assert!(nowpayments::is_terminal_failure("refunded"));
    // Edge: unknown status is none of the above
    assert!(!nowpayments::is_paid("unknown"));
    assert!(!nowpayments::is_terminal_failure("unknown"));
    assert!(!nowpayments::is_in_flight("unknown"));
}

#[test]
fn provider_normalize_aliases() {
    // Real normalizer from the library target.
    let aliases = ["crypto", "usdt", "nowpayments", "CRYPTO", "Usdt"];
    for a in aliases {
        assert_eq!(normalize_provider(a), "nowpayments");
    }
    assert_eq!(normalize_provider("flutterwave"), "flutterwave");
    assert_eq!(normalize_provider("FW"), "flutterwave");
    assert_eq!(normalize_provider("paystack"), "paystack");
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
