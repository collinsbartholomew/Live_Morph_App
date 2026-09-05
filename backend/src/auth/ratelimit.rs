use std::collections::HashMap;
use std::sync::Mutex;
use std::time::{Duration, Instant};

type RateMap = HashMap<(String, String), Vec<Instant>>;

/// Maximum number of distinct (ip, action) buckets retained per sweep.
/// Bounds memory so a flood of unique IPs cannot grow the map unboundedly.
const MAX_BUCKETS: usize = 65_536;

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
        return true; // poisoned lock — fail open (auth availability over strictness)
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
        map.retain(|_, ts| {
            ts.retain(|t| now.duration_since(*t) < window);
            !ts.is_empty()
        });
        // Hard cap: if still over, drop the oldest bucket (FIFO) until under.
        while map.len() > MAX_BUCKETS {
            let Some(oldest) = map.keys().next().cloned() else {
                break;
            };
            map.remove(&oldest);
        }
    }

    let key = (ip.to_lowercase(), action.to_string());
    let timestamps = map.entry(key).or_default();
    timestamps.retain(|t| now.duration_since(*t) < window);

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
