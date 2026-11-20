//! Operator-facing runtime values that live outside the validated `Config`
//! struct (update metadata, support contact, downloads, dashboard messages).
//!
//! Every value is read ONCE per process (LazyLock) instead of per request:
//! process env is immutable after boot, and per-request `std::env::var` both
//! scans the whole environ and hides these keys from any single inventory.
//! Boolean flags accept only "1"/"true" (same semantics as before).

use std::sync::LazyLock;

fn flag(raw: &str) -> bool {
    raw == "1" || raw.eq_ignore_ascii_case("true")
}

fn cached(name: &str) -> &'static String {
    static VALUES: LazyLock<std::collections::HashMap<&'static str, String>> =
        LazyLock::new(|| {
            const KEYS: &[&str] = &[
                "SUPPORT_EMAIL",
                "APP_LATEST_VERSION",
                "APP_DOWNLOAD_URL",
                "APP_UPDATE_NOTES",
                "APP_UPDATE_SHA256",
                "APP_FORCE_UPDATE",
                "APP_MAINTENANCE",
                "DASHBOARD_NOTIFICATION_TITLE",
                "DASHBOARD_NOTIFICATION_MESSAGE",
                "DOWNLOAD_URLS",
            ];
            KEYS.iter()
                .map(|k| (*k, std::env::var(k).unwrap_or_default()))
                .collect()
        });
    static EMPTY: String = String::new();
    VALUES.get(name).unwrap_or(&EMPTY)
}

pub fn support_email() -> &'static str {
    let v = cached("SUPPORT_EMAIL");
    if v.is_empty() { "support@platform.local" } else { v }
}

pub fn app_latest_version() -> &'static str {
    let v = cached("APP_LATEST_VERSION");
    if v.is_empty() { env!("CARGO_PKG_VERSION") } else { v }
}

pub fn app_download_url() -> &'static str {
    cached("APP_DOWNLOAD_URL")
}

pub fn app_update_notes() -> &'static str {
    cached("APP_UPDATE_NOTES")
}

pub fn app_update_sha256() -> &'static str {
    cached("APP_UPDATE_SHA256")
}

pub fn app_force_update() -> bool {
    flag(cached("APP_FORCE_UPDATE"))
}

pub fn app_maintenance() -> bool {
    flag(cached("APP_MAINTENANCE"))
}

pub fn dashboard_notification_title() -> Option<&'static str> {
    let v = cached("DASHBOARD_NOTIFICATION_TITLE");
    if v.is_empty() { None } else { Some(v) }
}

pub fn dashboard_notification_message() -> Option<&'static str> {
    let v = cached("DASHBOARD_NOTIFICATION_MESSAGE");
    if v.is_empty() { None } else { Some(v) }
}

#[derive(Debug, Clone)]
pub struct DownloadItem {
    pub id: String,
    pub name: String,
    pub url: String,
    pub mime: String,
}

pub fn download_items() -> &'static [DownloadItem] {
    static ITEMS: LazyLock<Vec<DownloadItem>> = LazyLock::new(|| {
        std::env::var("DOWNLOAD_URLS")
            .unwrap_or_default()
            .split(',')
            .filter(|v| !v.trim().is_empty())
            .enumerate()
            .map(|(i, v)| DownloadItem {
                id: format!("dl-{}", i + 1),
                name: std::env::var(format!("DOWNLOAD_NAME_{}", i + 1))
                    .unwrap_or_else(|_| format!("Tutorial {}", i + 1)),
                url: v.trim().to_string(),
                mime: std::env::var(format!("DOWNLOAD_TYPE_{}", i + 1))
                    .unwrap_or_else(|_| "video/mp4".into()),
            })
            .collect()
    });
    &ITEMS
}
