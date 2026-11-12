//! Token provisioning after payment settlement.
//!
//! Full chain (server-only):
//! User → Paystack (full settlement to merchant) → verify → fund Decart budget
//!      → credit user platform tokens → morph debits both until empty.

use crate::config::Config;
use crate::db::Db;
use crate::error::AppResult;
use crate::models::{PaymentOrder, User};
use crate::services::billing;

/// Preferred entry after order.status == "paid".
pub async fn provision_order(db: &Db, cfg: &Config, order: &mut PaymentOrder) -> AppResult<User> {
    billing::settle_and_provision(db, cfg, order).await
}
