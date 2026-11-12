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
                // Provider URLs are fixed constants — never follow redirects.
                .redirect(reqwest::redirect::Policy::none())
                .build()
                // The fallback must keep the timeout and no-redirect policy —
                // Client::new() has no timeout and would let provider calls hang.
                .unwrap_or_else(|_| {
                    Client::builder()
                        .timeout(std::time::Duration::from_secs(30))
                        .redirect(reqwest::redirect::Policy::none())
                        .build()
                        .expect("reqwest client with fixed options must build")
                })
        })
        .clone()
}
