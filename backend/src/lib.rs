//! Library target for `livemorph-backend`.
//!
//! The binary (`src/main.rs`) links this crate; declaring the modules here (and
//! making them `pub`) lets the integration tests under `tests/` call the REAL
//! functions (e.g. `services::paystack::verify_webhook_signature`) instead of
//! re-implementing local mirrors that could drift from production code.

pub mod auth;
pub mod config;
pub mod db;
pub mod error;
pub mod models;
pub mod product;
pub mod realtime;
pub mod routes;
pub mod runtime_env;
pub mod services;

use std::sync::LazyLock;

/// Per-process instance id, stamped on every session row this process creates.
/// The startup orphan reset only ends rows carrying this id (or legacy rows
/// with none), so multiple replicas can coexist without clobbering each other.
pub static INSTANCE_ID: LazyLock<String> =
    LazyLock::new(|| uuid::Uuid::new_v4().simple().to_string());
