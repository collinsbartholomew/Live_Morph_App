//! Streaming availability — shared by both products.
//!
//! Availability reflects operator-controlled flags and provider readiness rather
//! than a hardcoded `true`. The dashboard banner in both Qt clients is driven by
//! GET /api/v1/settings/streaming-availability.

/// Operator kill switch, shared by availability reporting and realtime
/// handshakes so "unavailable" cannot be bypassed by opening a WS directly.
pub fn streaming_disabled_by_operator() -> bool {
    std::env::var("STREAMING_UNAVAILABLE")
        .map(|v| v == "1" || v.eq_ignore_ascii_case("true"))
        .unwrap_or(false)
}

/// Returns `(available, reason)`.
pub fn streaming_available(cfg: &crate::config::Config) -> (bool, Option<String>) {
    if streaming_disabled_by_operator() {
        return (
            false,
            Some("Streaming is unavailable at the moment. Please try again later.".into()),
        );
    }
    // In production the Decart engine key is required; without it sessions
    // cannot run, so surface that as unavailable instead of silently failing.
    // Uses the validated config value, not a second raw env read.
    if cfg.decart_api_key.trim().is_empty() || cfg.decart_api_key.starts_with("your-") {
        return (
            false,
            Some("AI engine is not configured yet. Please try again later.".into()),
        );
    }
    (true, None)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn respects_operator_flag() {
        std::env::set_var("STREAMING_UNAVAILABLE", "true");
        let cfg = crate::config::Config::from_env().expect("test env loads");
        assert!(!streaming_available(&cfg).0);
        std::env::remove_var("STREAMING_UNAVAILABLE");
    }
}