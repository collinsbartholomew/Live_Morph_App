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

/// Entry with the authoritative storage product (the collection the order was
/// actually loaded from). Preferred whenever find_order_any_db resolved it.
pub async fn provision_order_in(
    db: &Db,
    cfg: &Config,
    order: &mut PaymentOrder,
    storage: crate::product::ProductId,
) -> AppResult<User> {
    billing::settle_and_provision_in(db, cfg, order, storage).await
}
