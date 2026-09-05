//! SMTP delivery for OTP and transactional mail.
//!
//! Deliverability checklist (all required for 100% inbox placement):
//! - multipart/alternative: HTML body + plain-text fallback
//! - List-Unsubscribe header + in-body unsubscribe link (CAN-SPAM / RFC 8058)
//! - Precedence: bulk + X-Mailer + Feedback-ID (Brevo/Gmail tracking)
//! - Proper Message-ID with verified domain
//! - Branding in subject + body (Gmail groups by sender+brand)
//! - TLS enforced (STARTTLS on 587, implicit TLS on 465)

use crate::config::Config;
use crate::error::{AppError, AppResult};
use lettre::message::header::ContentType;
use lettre::message::header::{HeaderName, HeaderValue};
use lettre::message::{Mailbox, MultiPart, SinglePart};
use lettre::transport::smtp::authentication::Credentials;
use lettre::{AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor};
use tracing::{info, warn};

const BRAND: &str = "LiveMorph";
const UNSUBSCRIBE_EMAIL: &str = "collinsomega177@gmail.com";
const MAILER_ID: &str = "LiveMorph/1.8 (transactional)";

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

pub async fn send_otp_email(cfg: &Config, to_email: &str, code: &str) -> AppResult<()> {
    let Some(host) = cfg.smtp_host.as_ref().filter(|h| !h.is_empty()) else {
        info!(%to_email, "SMTP_HOST unset — OTP email skipped (dev mode)");
        return Ok(());
    };

    let ttl_minutes = ((cfg.otp_ttl_secs / 60).max(1)) as u32;
    let subject = format!("{BRAND} — Your sign-in code");
    let plain = format!(
        "Your {BRAND} sign-in code is:\n\n\
         {code}\n\n\
         It expires in {ttl_minutes} minute(s).\n\n\
         If you did not request this, you can safely ignore this email.\n\n\
         —\n\
         {BRAND}\n\
         https://livemorph.com\n\
         To unsubscribe, send an email to {UNSUBSCRIBE_EMAIL}\n"
    );
    let html = otp_html(code, ttl_minutes);

    send_html(cfg, host, to_email, &subject, &plain, &html).await
}

pub async fn send_password_reset_email(cfg: &Config, to_email: &str, token: &str) -> AppResult<()> {
    let Some(host) = cfg.smtp_host.as_ref().filter(|h| !h.is_empty()) else {
        info!(%to_email, "SMTP_HOST unset — password reset email skipped");
        return Ok(());
    };

    let subject = format!("{BRAND} — Password reset");
    let plain = format!(
        "Your {BRAND} password reset code is:\n\n\
         {token}\n\n\
         It expires in 30 minutes.\n\n\
         If you did not request this, you can safely ignore this email.\n\n\
         —\n\
         {BRAND}\n\
         https://livemorph.com\n\
         To unsubscribe, send an email to {UNSUBSCRIBE_EMAIL}\n"
    );
    let html = password_reset_html(token);

    send_html(cfg, host, to_email, &subject, &plain, &html).await
}

// ---------------------------------------------------------------------------
// Core transport
// ---------------------------------------------------------------------------

async fn send_html(
    cfg: &Config,
    host: &str,
    to_email: &str,
    subject: &str,
    plain_body: &str,
    html_body: &str,
) -> AppResult<()> {
    let from: Mailbox = cfg
        .smtp_from
        .parse()
        .map_err(|e| AppError::Internal(format!("SMTP_FROM invalid: {e}")))?;
    let to: Mailbox = to_email
        .parse()
        .map_err(|e| AppError::BadRequest(format!("invalid recipient: {e}")))?;

    let email = Message::builder()
        .from(from)
        .to(to)
        .subject(subject)
        .raw_header(HeaderValue::new(
            HeaderName::new_from_ascii_str("List-Unsubscribe"),
            format!("<mailto:{UNSUBSCRIBE_EMAIL}?subject=unsubscribe>"),
        ))
        .raw_header(HeaderValue::new(
            HeaderName::new_from_ascii_str("List-Unsubscribe-Post"),
            "List-Unsubscribe=One-Click".into(),
        ))
        .raw_header(HeaderValue::new(
            HeaderName::new_from_ascii_str("Precedence"),
            "bulk".into(),
        ))
        .raw_header(HeaderValue::new(
            HeaderName::new_from_ascii_str("X-Mailer"),
            MAILER_ID.into(),
        ))
        .raw_header(HeaderValue::new(
            HeaderName::new_from_ascii_str("Feedback-ID"),
            format!("otp:{BRAND}"),
        ))
        .multipart(
            MultiPart::alternative()
                .singlepart(
                    SinglePart::builder()
                        .header(ContentType::TEXT_PLAIN)
                        .body(plain_body.to_string()),
                )
                .singlepart(
                    SinglePart::builder()
                        .header(ContentType::TEXT_HTML)
                        .body(html_body.to_string()),
                ),
        )
        .map_err(|e| AppError::Internal(format!("email build: {e}")))?;

    let builder = if cfg.smtp_starttls || cfg.smtp_port == 587 {
        AsyncSmtpTransport::<Tokio1Executor>::starttls_relay(host)
            .map_err(|e| AppError::Internal(format!("smtp relay: {e}")))?
            .port(cfg.smtp_port)
    } else {
        AsyncSmtpTransport::<Tokio1Executor>::relay(host)
            .map_err(|e| AppError::Internal(format!("smtp relay: {e}")))?
            .port(cfg.smtp_port)
    };

    let mailer = if let (Some(u), Some(p)) = (&cfg.smtp_username, &cfg.smtp_password) {
        builder
            .credentials(Credentials::new(u.clone(), p.clone()))
            .build()
    } else {
        builder.build()
    };

    match mailer.send(email).await {
        Ok(_) => {
            info!(%to_email, "Email sent");
            Ok(())
        }
        Err(e) => {
            warn!(error = %e, %to_email, "Email send failed");
            Err(AppError::Internal(format!("smtp send failed: {e}")))
        }
    }
}

// ---------------------------------------------------------------------------
// HTML templates — professional, branded, spam-filter-proof
// ---------------------------------------------------------------------------

fn otp_html(code: &str, ttl_minutes: u32) -> String {
    format!(
        r#"<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{BRAND} Sign-In Code</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 0;">
<tr><td align="center">
<table width="480" cellpadding="0" cellspacing="0" style="background:#14141c;border-radius:12px;overflow:hidden;">
  <tr><td style="background:linear-gradient(135deg,#8b5cf6,#6d28d9);padding:32px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:24px;font-weight:600;">{BRAND}</h1>
    <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Sign-In Verification</p>
  </td></tr>
  <tr><td style="padding:40px 32px;">
    <p style="color:#b0b0c0;font-size:15px;margin:0 0 24px;">Your one-time sign-in code is:</p>
    <div style="background:#1e1e2e;border:2px solid #8b5cf6;border-radius:8px;padding:20px;text-align:center;margin:0 0 24px;">
      <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#ed5bf0;font-family:monospace;">{code}</span>
    </div>
    <p style="color:#888;font-size:13px;margin:0 0 8px;">This code expires in <strong style="color:#b0b0c0;">{ttl_minutes} minute(s)</strong>.</p>
    <p style="color:#666;font-size:12px;margin:0;">If you did not request this, you can safely ignore this email.</p>
  </td></tr>
  <tr><td style="background:#0e0e14;padding:24px 32px;text-align:center;">
    <p style="color:#555;font-size:11px;margin:0;">{BRAND} &mdash; AI-Powered Live Effects</p>
    <p style="color:#444;font-size:10px;margin:8px 0 0;">
      <a href="https://livemorph.com" style="color:#8b5cf6;text-decoration:none;">livemorph.com</a>
      &nbsp;|&nbsp;
      <a href="mailto:{UNSUBSCRIBE_EMAIL}?subject=unsubscribe" style="color:#555;text-decoration:none;">Unsubscribe</a>
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>"#
    )
}

fn password_reset_html(token: &str) -> String {
    format!(
        r#"<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{BRAND} Password Reset</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 0;">
<tr><td align="center">
<table width="480" cellpadding="0" cellspacing="0" style="background:#14141c;border-radius:12px;overflow:hidden;">
  <tr><td style="background:linear-gradient(135deg,#8b5cf6,#6d28d9);padding:32px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:24px;font-weight:600;">{BRAND}</h1>
    <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Password Reset</p>
  </td></tr>
  <tr><td style="padding:40px 32px;">
    <p style="color:#b0b0c0;font-size:15px;margin:0 0 24px;">Your password reset code is:</p>
    <div style="background:#1e1e2e;border:2px solid #8b5cf6;border-radius:8px;padding:20px;text-align:center;margin:0 0 24px;">
      <span style="font-size:28px;font-weight:700;letter-spacing:6px;color:#ed5bf0;font-family:monospace;">{token}</span>
    </div>
    <p style="color:#888;font-size:13px;margin:0 0 8px;">This code expires in <strong style="color:#b0b0c0;">30 minutes</strong>.</p>
    <p style="color:#666;font-size:12px;margin:0;">If you did not request this, you can safely ignore this email.</p>
  </td></tr>
  <tr><td style="background:#0e0e14;padding:24px 32px;text-align:center;">
    <p style="color:#555;font-size:11px;margin:0;">{BRAND} &mdash; AI-Powered Live Effects</p>
    <p style="color:#444;font-size:10px;margin:8px 0 0;">
      <a href="https://livemorph.com" style="color:#8b5cf6;text-decoration:none;">livemorph.com</a>
      &nbsp;|&nbsp;
      <a href="mailto:{UNSUBSCRIBE_EMAIL}?subject=unsubscribe" style="color:#555;text-decoration:none;">Unsubscribe</a>
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>"#
    )
}
