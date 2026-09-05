//! Shared reqwest client — one connection pool for outbound provider calls.
use reqwest::Client;
use std::sync::OnceLock;

pub fn shared() -> Client {
    static CLIENT: OnceLock<Client> = OnceLock::new();
    CLIENT
        .get_or_init(|| {
            Client::builder()
                .timeout(std::time::Duration::from_secs(30))
                .pool_max_idle_per_host(8)
                .build()
                .unwrap_or_else(|_| Client::new())
        })
        .clone()
}
