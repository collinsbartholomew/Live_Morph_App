//! Streaming availability — shared by both products.
//!
//! Availability reflects operator-controlled flags and provider readiness rather
//! than a hardcoded `true`. The dashboard banner in both Qt clients is driven by
//! GET /api/v1/settings/streaming-availability.

/// Returns `(available, reason)`.
pub fn streaming_available() -> (bool, Option<String>) {
    if let Ok(v) = std::env::var("STREAMING_UNAVAILABLE") {
        if v == "1" || v.eq_ignore_ascii_case("true") {
            return (
                false,
                Some("Streaming is unavailable at the moment. Please try again later.".into()),
            );
        }
    }
    // In production the Decart engine key is required; without it sessions
    // cannot run, so surface that as unavailable instead of silently failing.
    if std::env::var("DECART_API_KEY")
        .map(|k| k.is_empty() || k.starts_with("your-"))
        .unwrap_or(true)
    {
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
        assert!(!streaming_available().0);
        std::env::remove_var("STREAMING_UNAVAILABLE");
    }
}