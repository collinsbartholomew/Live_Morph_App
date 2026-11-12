use std::collections::HashMap;
use std::sync::Mutex;
use std::time::{Duration, Instant};

use actix_web::HttpRequest;

// Bucket = (timestamps, last_seen) so the MAX_BUCKETS cap evicts the least
// recently used bucket instead of an arbitrary one.
type RateMap = HashMap<(String, String), (Vec<Instant>, Instant)>;

/// Maximum number of distinct (ip, action) buckets retained per sweep.
/// Bounds memory so a flood of unique IPs cannot grow the map unboundedly.
const MAX_BUCKETS: usize = 65_536;

/// Resolve the client IP for rate-limit keying.
///
/// Behind a reverse proxy, `req.peer_addr()` is the PROXY's address — every
/// client would share one (ip, action) bucket, causing mass lockout. Trust
/// X-Forwarded-For (first hop) / X-Real-IP when present; fall back to the
/// direct peer address.
pub fn client_ip(req: &HttpRequest) -> String {
    // Only trust forwarded headers when the direct peer is a configured
    // reverse proxy — otherwise any client can rotate X-Forwarded-For to
    // defeat every IP rate limit. TRUSTED_PROXY_IPS is a comma-separated
    // list of proxy IPs; empty (default) = trust no one.
    use std::sync::LazyLock;
    static TRUSTED: LazyLock<Vec<std::net::IpAddr>> = LazyLock::new(|| {
        std::env::var("TRUSTED_PROXY_IPS")
            .unwrap_or_default()
            .split(',')
            .filter_map(|s| s.trim().parse::<std::net::IpAddr>().ok())
            // Never trust a wildcard/unspecified address: 0.0.0.0 / :: would
            // match every peer and let any client forge X-Forwarded-For.
            .filter(|ip| !ip.is_unspecified())
            // Normalize IPv4-mapped IPv6 (::ffff:10.0.0.1) to plain IPv4 so it
            // compares equal to a configured IPv4 proxy entry.
            .map(|ip| match ip {
                std::net::IpAddr::V6(v6) => v6
                    .to_ipv4_mapped()
                    .map(std::net::IpAddr::V4)
                    .unwrap_or(std::net::IpAddr::V6(v6)),
                other => other,
            })
            .collect()
    });
    let peer = req
        .peer_addr()
        .map(|a| a.ip())
        .unwrap_or(std::net::IpAddr::from([0, 0, 0, 0]));
    let peer = match peer {
        std::net::IpAddr::V6(v6) => v6
            .to_ipv4_mapped()
            .map(std::net::IpAddr::V4)
            .unwrap_or(std::net::IpAddr::V6(v6)),
        other => other,
    };
    if !TRUSTED.is_empty() && TRUSTED.contains(&peer) {
        // Walk XFF from the RIGHT, skipping trusted proxy hops; the first
        // untrusted entry is the real client. (The leftmost entry is
        // client-forgeable.)
        if let Some(v) = req.headers().get("x-forwarded-for").and_then(|h| h.to_str().ok()) {
            let mut hops: Vec<&str> = v.split(',').map(|s| s.trim()).filter(|s| !s.is_empty()).collect();
            hops.reverse();
            for hop in hops {
                match hop.parse::<std::net::IpAddr>() {
                    Ok(ip) if !TRUSTED.contains(&ip) => return ip.to_string(),
                    Ok(_) => continue, // trusted proxy hop — keep walking
                    Err(_) => continue, // garbage entry — skip
                }
            }
        }
        // X-Real-IP is client-controllable unless the proxy provably strips it —
        // if the XFF walk found no untrusted hop, fall back to the direct peer.
    }
    peer.to_string()
}

/// Defense-in-depth for WebSocket upgrades. Auth is Bearer-header (no cookies),
/// so cross-site WebSocket hijacking is not exploitable, but reject any upgrade
/// that carries an Origin header pointing at a different host than the request
/// (and not in the configured CORS allowlist). Non-browser clients (the desktop
/// app) send no Origin header and are allowed through.
pub fn ws_origin_ok(req: &HttpRequest, cfg: &crate::config::Config) -> bool {
    let Some(origin) = req.headers().get("origin").and_then(|h| h.to_str().ok()) else {
        return true;
    };
    let Ok(o) = url::Url::parse(origin) else {
        return false;
    };
    let Some(ohost) = o.host_str() else {
        return false;
    };
    if let Some(host) = req.headers().get("host").and_then(|h| h.to_str().ok()) {
        let host = host.split(':').next().unwrap_or(host);
        if ohost.eq_ignore_ascii_case(host) {
            return true;
        }
    }
    if let Some(cors) = &cfg.cors_origins {
        if cors
            .split(',')
            .map(str::trim)
            .filter(|s| !s.is_empty())
            .any(|a| a.eq_ignore_ascii_case(origin))
        {
            return true;
        }
    }
    false
}

/// In-memory sliding-window rate limiter keyed by (ip, action).
///
/// Returns true if the request is allowed.
///
/// # Production notes
/// - This state is per-process. Deploy a single instance (or move to a shared
///   store such as Redis) if scaling horizontally; an attacker can otherwise
///   spread attempts across instances.
/// - The map is pruned on an interval so expired keys never accumulate (DoS guard).
pub fn check_rate_limit(ip: &str, action: &str, max_requests: u32, window_secs: u64) -> bool {
    use std::sync::LazyLock;
    static MAP: LazyLock<Mutex<RateMap>> = LazyLock::new(|| Mutex::new(HashMap::new()));
    static LAST_SWEEP: LazyLock<Mutex<Option<Instant>>> = LazyLock::new(|| Mutex::new(None));

    let Ok(mut map) = MAP.lock() else {
        // Poisoned lock means a panic mid-update; fail CLOSED so a corrupted
        // map cannot be used to bypass rate limits (availability is preserved
        // because the lock is only poisoned by a panic, which is itself rare).
        return false;
    };
    let now = Instant::now();
    let window = Duration::from_secs(window_secs.max(1));

    // Periodic global sweep: drop fully-expired buckets and cap total buckets.
    let sweep = match LAST_SWEEP.lock() {
        Ok(mut ls) => {
            let due = match *ls {
                Some(t) => now.duration_since(t) >= window,
                None => true,
            };
            if due {
                *ls = Some(now);
            }
            due
        }
        Err(_) => false, // sweep lock poisoned — skip this round (bucket lock already held)
    };
    if sweep && !map.is_empty() {
        map.retain(|_, (ts, _)| {
            ts.retain(|t| now.duration_since(*t) < window);
            !ts.is_empty()
        });
        // Hard cap: evict the least-recently-used bucket until under the cap.
        while map.len() > MAX_BUCKETS {
            let Some(oldest) = map
                .iter()
                .min_by_key(|(_, (_, last))| *last)
                .map(|(k, _)| k.clone())
            else {
                break;
            };
            map.remove(&oldest);
        }
    }

    // Hard cap even between sweeps. First drop fully-expired buckets (a flood
    // of unique keys shouldn't evict live buckets); only if still at cap, evict
    // the LRU one.
    if map.len() >= MAX_BUCKETS {
        map.retain(|_, (ts, _)| ts.iter().any(|t| now.duration_since(*t) < window));
    }
    while map.len() >= MAX_BUCKETS {
        let Some(oldest) = map
            .iter()
            .min_by_key(|(_, (_, last))| *last)
            .map(|(k, _)| k.clone())
        else {
            break;
        };
        map.remove(&oldest);
    }

    let key = (ip.to_lowercase(), action.to_string());
    let (timestamps, last_seen) = map.entry(key).or_insert_with(|| (Vec::new(), now));
    timestamps.retain(|t| now.duration_since(*t) < window);
    *last_seen = now;

    if timestamps.len() >= max_requests as usize {
        return false;
    }
    timestamps.push(now);
    true
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::thread;

    #[test]
    fn allows_within_window() {
        for _ in 0..5 {
            assert!(check_rate_limit("1.2.3.4", "test", 5, 60));
        }
        assert!(!check_rate_limit("1.2.3.4", "test", 5, 60));
    }

    #[test]
    fn separate_actions_are_independent() {
        for _ in 0..5 {
            assert!(check_rate_limit("10.0.0.1", "act_a", 5, 60));
        }
        assert!(!check_rate_limit("10.0.0.1", "act_a", 5, 60));
        assert!(check_rate_limit("10.0.0.1", "act_b", 5, 60));
    }

    #[test]
    fn separate_ips_are_independent() {
        for _ in 0..5 {
            assert!(check_rate_limit("10.1.0.1", "ip_test", 5, 60));
        }
        assert!(check_rate_limit("10.1.0.2", "ip_test", 5, 60));
    }

    #[test]
    fn expires_after_window() {
        for _ in 0..5 {
            assert!(check_rate_limit("10.2.0.1", "expire", 5, 1));
        }
        assert!(!check_rate_limit("10.2.0.1", "expire", 5, 1));
        thread::sleep(Duration::from_millis(1100));
        assert!(check_rate_limit("10.2.0.1", "expire", 5, 1));
    }
}
