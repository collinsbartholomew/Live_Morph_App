//! Platform bootstrap — one route family, product-id dispatch.
//!
//! Path (unified /api/v1 namespace):
//!   GET /api/v1/bootstrap
//!
//! Identity: X-Frontend-Id / X-Client-Product / ?product= / path heuristic
//!   → ProductId::LiveMorph  → bootstrap_for_livemorph()
//!   → ProductId::LiveEscape → bootstrap_for_liveescape()

use crate::config::Config;
use crate::product::ProductId;
use actix_web::{web, HttpRequest, HttpResponse};
use serde_json::{json, Value};
use std::sync::Arc;

pub fn configure(cfg: &mut web::ServiceConfig) {
	// Mounted under /api/v1 → GET /api/v1/bootstrap
	cfg.route("/bootstrap", web::get().to(bootstrap_handler));
}

/// Single entry — branches to product-specific builders by frontend id.
async fn bootstrap_handler(cfg: web::Data<Arc<Config>>, req: HttpRequest) -> HttpResponse {
	let product = ProductId::from_request(&req);
	let body = match product {
		ProductId::LiveMorph => bootstrap_for_livemorph(&cfg),
		ProductId::LiveEscape => bootstrap_for_liveescape(&cfg),
	};
	HttpResponse::Ok()
		.insert_header(("Cache-Control", "no-store"))
		.json(body)
}

// ── shared building blocks ─────────────────────────────────────────────

fn public_base(cfg: &Config) -> String {
	cfg.public_base_url.trim_end_matches('/').to_string()
}

fn ws_origin(http_base: &str) -> String {
	if http_base.starts_with("https://") {
		http_base.replacen("https://", "wss://", 1)
	} else if http_base.starts_with("http://") {
		http_base.replacen("http://", "ws://", 1)
	} else {
		format!("ws://{}", http_base.trim_start_matches('/'))
	}
}

fn shared_endpoints(cfg: &Config) -> Value {
	let base = public_base(cfg);
	let wso = ws_origin(&base);
	json!({
		"api_base": base,
		"health": format!("{}/api/v1/health", base),
		"bootstrap": format!("{}/api/v1/bootstrap", base),
		"balance_ws": format!("{}/api/v1/ws", wso),
		"realtime_ws": format!("{}/api/v1/realtime", wso),
		"paystack_callback": format!("{}/api/v1/payments/callback/paystack", base),
		"support_tickets": format!("{}/api/v1/support/tickets", base),
		"version_check": format!("{}/api/v1/update/check", base),
		"auth_refresh": format!("{}/api/v1/auth/refresh", base),
	})
}

fn shared_meta(cfg: &Config, product: ProductId) -> Value {
	json!({
		"ok": true,
		"product": product.as_str(),
		"server_time": chrono::Utc::now().to_rfc3339(),
		"version": env!("CARGO_PKG_VERSION"),
		"env": cfg.rust_env,
		"config_revision": std::env::var("CONFIG_REVISION")
			.unwrap_or_else(|_| env!("CARGO_PKG_VERSION").into()),
	})
}

fn shared_credits(cfg: &Config) -> Value {
	json!({
		"credits_per_second": cfg.credits_per_second,
		"min_credits_to_start": cfg.min_credits_to_start,
		"signup_bonus": cfg.signup_bonus_credits,
		"hd_multiplier": cfg.hd_credit_multiplier,
	})
}

fn shared_payments(cfg: &Config) -> Value {
	json!({
		"paystack": cfg.paystack_secret_key.as_ref().map(|s| !s.is_empty()).unwrap_or(false),
		"paystack_public_key": cfg.paystack_public_key,
		"nowpayments": cfg.nowpayments_api_key.as_ref().map(|s| !s.is_empty()).unwrap_or(false),
		"flutterwave": cfg.flutterwave_secret_key.as_ref().map(|s| !s.is_empty()).unwrap_or(false),
		"flutterwave_public_key": cfg.flutterwave_public_key,
		"currency": cfg.paystack_currency,
		"usd_ngn_rate": cfg.usd_ngn_rate,
	})
}

fn shared_decart(cfg: &Config) -> Value {
	json!({
		"default_model": cfg.decart_default_model,
		"allowed_models": cfg.decart_allowed_models,
		"proxy_only": true,
	})
}

fn shared_ui() -> Value {
	json!({
		"min_app_version": std::env::var("APP_LATEST_VERSION")
			.unwrap_or_else(|_| env!("CARGO_PKG_VERSION").into()),
		"force_update": std::env::var("APP_FORCE_UPDATE")
			.map(|v| v == "1" || v.eq_ignore_ascii_case("true"))
			.unwrap_or(false),
		"maintenance": false,
		"support_email": std::env::var("SUPPORT_EMAIL")
			.unwrap_or_else(|_| "support@platform.local".into()),
	})
}

// ── product-specific functions (same route, different payload) ─────────

/// LiveMorph desktop: catalog, packs, OTP/Google, OBS/recording flags.
fn bootstrap_for_livemorph(cfg: &Config) -> Value {
	let mut body = shared_meta(cfg, ProductId::LiveMorph);
	let obj = body.as_object_mut().expect("shared_meta returns object");
	obj.insert("endpoints".into(), {
		let mut ep = shared_endpoints(cfg);
		let base = public_base(cfg);
		if let Some(m) = ep.as_object_mut() {
			m.insert("catalog".into(), json!(format!("{}/api/v1/catalog", base)));
			m.insert(
				"packages".into(),
				json!(format!("{}/api/v1/payments/packages", base)),
			);
			m.insert(
				"otp_request".into(),
				json!(format!("{}/api/v1/auth/otp/request", base)),
			);
			m.insert(
				"google_oauth_start".into(),
				json!(format!("{}/api/v1/auth/oauth/google/start", base)),
			);
			m.insert(
				"stream".into(),
				json!(format!("{}/api/v1/stream/status", base)),
			);
			m.insert(
				"recording".into(),
				json!(format!("{}/api/v1/recordings/directory", base)),
			);
		}
		ep
	});
	obj.insert("credits".into(), shared_credits(cfg));
	obj.insert("payments".into(), shared_payments(cfg));
	obj.insert("decart".into(), shared_decart(cfg));
	obj.insert("ui".into(), shared_ui());
	obj.insert(
		"features".into(),
		json!({
			"google_oauth": cfg.google_client_id.as_ref().map(|s| !s.is_empty()).unwrap_or(false),
			"otp_auth": true,
			"password_auth": true,
			"catalog": true,
			"license_keys": false,
			"obs_mjpeg": true,
			"recording": true,
			"referrals": false,
			"crypto_payments": cfg.nowpayments_api_key.as_ref().map(|s| !s.is_empty()).unwrap_or(false),
			"workshop": true,
			"buy_credits_packs": true,
		}),
	);
	body
}

/// Live Escape desktop: keys, plans, streaming session, referral flags.
fn bootstrap_for_liveescape(cfg: &Config) -> Value {
	let mut body = shared_meta(cfg, ProductId::LiveEscape);
	let obj = body.as_object_mut().expect("shared_meta returns object");
	obj.insert("endpoints".into(), {
		let mut ep = shared_endpoints(cfg);
		let base = public_base(cfg);
		if let Some(m) = ep.as_object_mut() {
			m.insert("plans".into(), json!(format!("{}/api/v1/settings/plans", base)));
			m.insert(
				"keys_validate".into(),
				json!(format!("{}/api/v1/keys/validate", base)),
			);
			m.insert("keys_lookup".into(), json!(format!("{}/api/v1/keys/lookup", base)));
			m.insert(
				"credits".into(),
				json!(format!("{}/api/v1/credits/balance", base)),
			);
			m.insert(
				"streaming_start".into(),
				json!(format!("{}/api/v1/streaming/session-start", base)),
			);
			m.insert(
				"streaming_end".into(),
				json!(format!("{}/api/v1/streaming/end", base)),
			);
			m.insert(
				"background_presets".into(),
				json!(format!("{}/api/v1/streaming/background-presets", base)),
			);
			m.insert(
				"auth_signup".into(),
				json!(format!("{}/api/v1/auth/register", base)),
			);
			m.insert(
				"auth_login".into(),
				json!(format!("{}/api/v1/auth/login", base)),
			);
			m.insert(
				"password_reset_request".into(),
				json!(format!("{}/api/v1/auth/password-reset-request", base)),
			);
			m.insert(
				"feature_flags".into(),
				json!(format!("{}/api/v1/public/feature-flags", base)),
			);
			m.insert(
				"starter_pack_status".into(),
				json!(format!("{}/api/v1/starter-pack/status", base)),
			);
			m.insert(
				"downloads_list".into(),
				json!(format!("{}/api/v1/downloads/list", base)),
			);
			m.insert(
				"engine_key".into(),
				json!(format!("{}/api/v1/settings/engine-key", base)),
			);
			m.insert(
				"payment_gateway".into(),
				json!(format!("{}/api/v1/settings/payment-gateway", base)),
			);
			m.insert(
				"crypto_settings".into(),
				json!(format!("{}/api/v1/settings/crypto", base)),
			);
			m.insert(
				"streaming_availability".into(),
				json!(format!("{}/api/v1/settings/streaming-availability", base)),
			);
		}
		ep
	});
	obj.insert("credits".into(), shared_credits(cfg));
	obj.insert("payments".into(), shared_payments(cfg));
	obj.insert("decart".into(), shared_decart(cfg));
	obj.insert("ui".into(), shared_ui());
	obj.insert(
		"features".into(),
		json!({
			"google_oauth": false,
			"otp_auth": false,
			"password_auth": true,
			"catalog": false,
			"license_keys": true,
			"obs_mjpeg": true,
			"recording": false,
			"referrals": true,
			"crypto_payments": cfg.nowpayments_api_key.as_ref().map(|s| !s.is_empty()).unwrap_or(false),
			"access_gate": true,
			"starter_activation": true,
		}),
	);
	body
}

#[cfg(test)]
mod tests {
	// Product dispatch is pure — covered by integration smoke with X-Frontend-Id.
}
