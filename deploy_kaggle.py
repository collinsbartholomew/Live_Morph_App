#!/usr/bin/env python3
"""
LiveMorph Rust backend deployment script.

Deploys only the backend (no Qt/QML frontend). Handles:
  - Git clone (private GitHub with embedded token)
  - MongoDB installation & startup
  - Rust 1.88 toolchain & release build
  - Backend server on 127.0.0.1:3874
  - Ngrok tunnel via pyngrok (falls back to localhost on failure)
  - Public URL for Qt client connection
  - Auto-update monitor: polls GitHub and rebuilds on new commits
  - Idempotent admin user seeding (unlimited credits + pro tier)

All env vars are hardcoded as test values (development only).
"""

import os
import sys
import subprocess
import threading
import time
import json
import shutil
import socket
import urllib.request
import urllib.error
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
REPO_URL = "https://github.com/collinsbartholomew/Live_Morph_App.git"

BACKEND_PORT = 3874
WORK_DIR = Path("/kaggle/working")
REPO_DIR = WORK_DIR / "livemorph"
BACKEND_DIR = REPO_DIR / "backend"
MONGODB_DIR = WORK_DIR / "mongodb"
LOG_DIR = WORK_DIR / "logs"

# Auto-update: poll GitHub for new commits and rebuild/restart automatically.
AUTO_UPDATE_ENABLED = True
AUTO_UPDATE_INTERVAL = 60  # seconds between git fetches


# ---------------------------------------------------------------------------
# Load secrets (env var first, then Kaggle Secrets as fallback)
# ---------------------------------------------------------------------------
def load_secret(name):
    """Load a secret from env, falling back to Kaggle Secrets."""
    val = (os.environ.get(name) or "").strip()
    if val:
        print(f"[*] {name} loaded from environment", flush=True)
        return val
    try:
        from kaggle_secrets import UserSecretsClient
        val = (UserSecretsClient().get_secret(name) or "").strip()
        if val:
            print(f"[*] {name} loaded from Kaggle Secrets", flush=True)
            return val
    except Exception as e:
        print(f"[!] Could not load {name} from Kaggle Secrets: {e}", flush=True)
    print(f"[!] {name} is not set", flush=True)
    return ""


# ---------------------------------------------------------------------------
# Install pyngrok at runtime (idempotent, quiet)
# ---------------------------------------------------------------------------
def ensure_pyngrok():
    try:
        import pyngrok  # noqa: F401
        print("[*] pyngrok already available", flush=True)
    except ImportError:
        print("[*] Installing pyngrok ...", flush=True)
        subprocess.run(
            [sys.executable, "-m", "pip", "install", "-q", "pyngrok"],
            check=True,
        )
        print("[*] pyngrok installed", flush=True)


NGROK_AUTH_TOKEN = load_secret("NGROK_AUTH_TOKEN")
GITHUB_TOKEN = load_secret("GITHUB_TOKEN")


# ---------------------------------------------------------------------------
# Utility: embed GITHUB_TOKEN into the clone URL
# ---------------------------------------------------------------------------
def repo_url_with_token(url):
    if not url or not GITHUB_TOKEN:
        return url
    if "github.com" in url and url.startswith("https://"):
        return url.replace(
            "https://",
            "https://x-access-token:{}@".format(GITHUB_TOKEN),
            1,
        )
    return url


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def run(cmd, **kwargs):
    print(f"[+] {cmd}", flush=True)
    if isinstance(cmd, str):
        cmd = cmd.split()
    return subprocess.run(cmd, check=True, **kwargs)


def run_bg(cmd, log_file, cwd=None, env=None):
    print(f"[+] (bg) {cmd}  ->  {log_file}", flush=True)
    if isinstance(cmd, str):
        cmd = cmd.split()
    log_fh = open(log_file, "ab")
    proc = subprocess.Popen(
        cmd,
        cwd=cwd,
        env=env,
        stdout=log_fh,
        stderr=log_fh,
        start_new_session=True,
    )
    return proc, log_fh


def sh(cmd, check=False, capture=True, cwd=None):
    if isinstance(cmd, str):
        cmd = cmd.split()
    return subprocess.run(
        cmd, capture_output=capture, text=True, check=check, cwd=cwd
    )


def ensure_dir(path: Path):
    path.mkdir(parents=True, exist_ok=True)


def wait_for_port(host, port, timeout=60, service="service"):
    print(f"[*] Waiting for {service} on {host}:{port} ...", flush=True)
    start = time.time()
    while time.time() - start < timeout:
        try:
            with socket.create_connection((host, port), timeout=2):
                print(f"[*] {service} is up on {host}:{port}", flush=True)
                return True
        except OSError:
            time.sleep(2)
    print(
        f"[!] {service} did not become available on {host}:{port} "
        f"within {timeout}s",
        flush=True,
    )
    return False


def _wait_for_http(url, timeout=30, interval=1):
    """Wait until an HTTP server responds (any status, incl. 4xx/5xx)."""
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(url, timeout=3):
                return True
        except urllib.error.HTTPError:
            return True  # server responded — it's up
        except Exception:
            time.sleep(interval)
    return False


def tail_file(path: Path, n=2000):
    try:
        return path.read_text(errors="replace")[-n:]
    except Exception:
        return ""


def _trunc(obj, n=200):
    s = obj if isinstance(obj, str) else json.dumps(obj)
    return s[:n] + ("..." if len(s) > n else "")


# ---------------------------------------------------------------------------
# Steps
# ---------------------------------------------------------------------------
def detect_repo_url():
    global REPO_URL
    print(f"[*] Using repo URL: {REPO_URL}", flush=True)
    return repo_url_with_token(REPO_URL)


def install_system_deps():
    print("\n=== Installing system dependencies ===", flush=True)
    for prefix in (["sudo", "apt-get"], ["apt-get"]):
        try:
            run(prefix + ["update", "-qq"])
            run(
                prefix
                + [
                    "install",
                    "-y",
                    "--no-install-recommends",
                    "build-essential",
                    "pkg-config",
                    "libssl-dev",
                    "curl",
                    "gnupg",
                    "lsb-release",
                    "wget",
                    "gnupg2",
                    "software-properties-common",
                ]
            )
            return
        except Exception as e:
            print(f"[!] {prefix[0]} apt-get failed: {e}", flush=True)
            continue
    raise RuntimeError("Failed to install system dependencies via apt-get")


def install_mongodb():
    print("\n=== Installing MongoDB ===", flush=True)
    ensure_dir(MONGODB_DIR)
    ensure_dir(LOG_DIR)

    for prefix in (["sudo", "apt-get"], ["apt-get"]):
        try:
            run(prefix + ["install", "-y", "mongodb"], check=False)
            if shutil.which("mongod"):
                print("[*] MongoDB installed via apt-get", flush=True)
                return
        except Exception:
            pass

    print(
        "[*] apt-get mongodb not available, downloading official binary...",
        flush=True,
    )
    arch = sh(["uname", "-m"], capture=True).stdout.strip()
    if arch in ("x86_64", "amd64"):
        tarball = "mongodb-linux-x86_64-ubuntu2204-7.0.0.tgz"
        url = f"https://fastdl.mongodb.org/linux/{tarball}"
    elif arch in ("aarch64", "arm64"):
        tarball = "mongodb-linux-aarch64-ubuntu2204-7.0.0.tgz"
        url = f"https://fastdl.mongodb.org/linux/{tarball}"
    else:
        raise RuntimeError(f"Unsupported architecture for MongoDB binary: {arch}")

    tarball_path = WORK_DIR / tarball
    run(["curl", "-fL", "-o", str(tarball_path), url])
    run(["tar", "xzf", str(tarball_path), "-C", str(WORK_DIR)])

    extracted = None
    for entry in WORK_DIR.iterdir():
        if entry.is_dir() and entry.name.startswith("mongodb-linux-"):
            extracted = entry
            break
    if not extracted:
        raise RuntimeError(
            "MongoDB tarball extraction did not produce expected dir"
        )

    mongod_bin = extracted / "bin" / "mongod"
    link_target = WORK_DIR / "bin" / "mongod"
    link_target.parent.mkdir(exist_ok=True)
    if not link_target.exists():
        os.symlink(str(mongod_bin), str(link_target))
    os.environ["PATH"] = str(WORK_DIR / "bin") + os.pathsep + os.environ.get(
        "PATH", ""
    )
    print(f"[*] MongoDB binary ready at {mongod_bin}", flush=True)


def start_mongodb():
    print("\n=== Starting MongoDB ===", flush=True)
    dbpath = MONGODB_DIR / "data"
    logpath = LOG_DIR / "mongod.log"
    ensure_dir(dbpath)
    ensure_dir(LOG_DIR)

    mongod = shutil.which("mongod")
    if not mongod:
        raise RuntimeError("mongod not found in PATH")

    sh(["pkill", "-f", "mongod"], check=False)
    time.sleep(1)

    proc, log_fh = run_bg(
        [
            mongod,
            "--dbpath",
            str(dbpath),
            "--bind_ip",
            "127.0.0.1",
            "--port",
            "27017",
            "--logpath",
            str(logpath),
            "--fork",
        ],
        log_file=logpath,
    )
    log_fh.close()

    if not wait_for_port("127.0.0.1", 27017, timeout=60, service="MongoDB"):
        raise RuntimeError("MongoDB failed to start")


def install_rust():
    print("\n=== Installing Rust toolchain (1.88) ===", flush=True)
    if shutil.which("cargo") and shutil.which("rustc"):
        print("[*] Rust already installed", flush=True)
    else:
        run(
            [
                "curl",
                "--proto",
                "=https",
                "--tlsv1.2",
                "-sSf",
                "https://sh.rustup.rs",
                "-o",
                str(WORK_DIR / "rustup-init.sh"),
            ]
        )
        run(
            [
                "sh",
                str(WORK_DIR / "rustup-init.sh"),
                "-y",
                "--default-toolchain",
                "1.88",
                "--profile",
                "minimal",
            ]
        )
        cargo_env = Path.home() / ".cargo" / "bin"
        if cargo_env.exists():
            os.environ["PATH"] = str(cargo_env) + os.pathsep + os.environ.get(
                "PATH", ""
            )
            os.environ["CARGO_HOME"] = str(Path.home() / ".cargo")
            os.environ["RUSTUP_HOME"] = str(Path.home() / ".rustup")

    run(["rustc", "--version"])
    run(["cargo", "--version"])
    run(["rustup", "default", "1.88"])


def build_backend():
    print("\n=== Building backend (cargo build --release) ===", flush=True)
    env = os.environ.copy()
    env["CARGO_HOME"] = str(Path.home() / ".cargo")
    env["RUSTUP_HOME"] = str(Path.home() / ".rustup")
    run(["cargo", "build", "--release"], cwd=str(BACKEND_DIR), env=env)

    binary = BACKEND_DIR / "target" / "release" / "livemorph-backend"
    if not binary.exists():
        raise RuntimeError(f"Backend binary not found at {binary}")
    print(f"[*] Backend binary: {binary}", flush=True)
    return binary


# Hardcoded test env values (development only — never use in production)
ENV_VARS = {
    "RUST_ENV": "development",
    "HOST": "127.0.0.1",
    "PORT": str(BACKEND_PORT),
    "PUBLIC_BASE_URL": "",  # filled in after ngrok / local discovery
    "RUST_LOG": "info,livemorph_backend=debug,actix_web=info",
    "MONGODB_URI": "mongodb://127.0.0.1:27017",
    "MONGODB_DB": "livemorph",
    "SECONDARY_PRODUCT_ID": "secondary",
    "MONGODB_DB_SECONDARY": "secondary",
    "JWT_SECRET": "35-S9So_i6yFBcP6N9wtscvRQvxri6AwkCdTx" + "XmpqIc",
    "JWT_ACCESS_TTL_SECS": "900",
    "JWT_REFRESH_TTL_SECS": "2592000",
    "GOOGLE_CLIENT_ID": "354176682069-02idc58e8c0tvl9m93bcjkd1qu4iejtr" + ".apps.googleusercontent.com",
    "GOOGLE_CLIENT_SECRET": "GOCSPX-" + "cAuljlb_oKOJShqpe8J9dLuFtG0G",
    "GOOGLE_REDIRECT_URI": "https://waltz-mountain-nemesis.ngrok-free.dev/api/v1/auth/oauth/google/callback",
    "OTP_LENGTH": "8",
    "OTP_TTL_SECS": "600",
    "AUTH_MAX_ATTEMPTS": "500",
    "AUTH_LOCKOUT_SECS": "60",
    "JWT_ISSUER": "livemorph",
    "CREDITS_PER_SECOND": "2.0",
    "SIGNUP_BONUS_CREDITS": "100",
    "MIN_CREDITS_TO_START": "5.0",
    "HD_CREDIT_MULTIPLIER": "1.5",
    "DECART_API_KEY": "3MEvOKmPCSizaCZfCGSaC8O5klY_2aVCwBrirs2iKcgQ7" + "Z57j",
    "DECART_SIGNALING_URL": "wss://api3.decart.ai/v1/stream",
    "DECART_DEFAULT_MODEL": "lucy-2.6",
    "DECART_ALLOWED_MODELS": "lucy-2.6,lucy-2.5,lucy-2.1,lucy-restyle-2,lucy-latest",
    "STREAM_DEFAULT_PORT": "4789",
    "SEED_STARTER_CATALOG": "true",
    "PAYSTACK_SECRET_KEY": "rk_test_" + "WqY1_-itTwsqCT0WyjstsXlPjE5QgdnC3156f4ef",
    "PAYSTACK_PUBLIC_KEY": "pk_test_" + "0d76952c7090ae02a04d9d01469797433dbe171c",
    "PAYSTACK_CALLBACK_URL": "https://waltz-mountain-nemesis.ngrok-free.dev/pay/callback",
    "PAYSTACK_WEBHOOK_URL": "https://waltz-mountain-nemesis.ngrok-free.dev/webhooks/paystack",
    "NOWPAYMENTS_API_KEY": "",
    "NOWPAYMENTS_DEFAULT_PAY_CURRENCY": "usdttrc20",
    "ALLOW_MANUAL_PAYMENTS": "true",
    "ALLOW_CREDITS_ADJUST": "true",
    "LOG_OTP_CODES": "false",
    "MAX_BODY_BYTES": "8388608",
    "SMTP_HOST": "smtp-relay.brevo.com",
    "SMTP_PORT": "587",
    "SMTP_USERNAME": "b7dd79001@smtp-brevo.com",
    "SMTP_PASSWORD": "xsmtpsib-" + "4cecfa7ed54f5341c66c7e6b7365f735094426aae515a88f1734b55dc01210c5-XXEkeQkz7qTkOH7u",
    "SMTP_FROM": "collinsomega177@gmail.com",
    "SMTP_STARTTLS": "true",
    "ICE_SERVERS_JSON": "",
    "MAX_CONCURRENT_SESSIONS": "1",
    "DECART_USD_PER_SECOND": "0.02",
    "PLATFORM_MARGIN_RATIO": "0.35",
    "ADMIN_SECRET": "xsmtpsib-" + "4cescfda7edm54fk53451c66sc7e6b7u365f7h35094426aae515a8s8f1734b55d6c01210c5-gXXEkeQkz7qdTkOH7u",
    "USD_NGN_RATE": "1600",
    "FLUTTERWAVE_SECRET_KEY": "",
    "FLUTTERWAVE_PUBLIC_KEY": "",
}


def write_env(use_local_url=False):
    print("\n=== Writing backend .env ===", flush=True)
    env = dict(ENV_VARS)
    if use_local_url:
        env["PUBLIC_BASE_URL"] = f"http://127.0.0.1:{BACKEND_PORT}"

    env_path = BACKEND_DIR / ".env"
    lines = ["# Auto-generated by deploy_kaggle.py — DO NOT COMMIT\n"]
    for k, v in env.items():
        lines.append(f"{k}={v}")
    env_path.write_text("\n".join(lines) + "\n")
    print(f"[*] Wrote {env_path} ({len(env)} vars)", flush=True)


def start_backend():
    print("\n=== Starting backend ===", flush=True)
    binary = BACKEND_DIR / "target" / "release" / "livemorph-backend"
    log_path = LOG_DIR / "backend.log"

    sh(["pkill", "-f", "livemorph-backend"], check=False)
    time.sleep(1)

    env = os.environ.copy()
    env_path = BACKEND_DIR / ".env"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k] = v

    proc, log_fh = run_bg(
        [str(binary)],
        log_file=log_path,
        cwd=str(BACKEND_DIR),
        env=env,
    )
    log_fh.close()

    if not wait_for_port(
        "127.0.0.1", BACKEND_PORT, timeout=90, service="backend"
    ):
        if log_path.exists():
            print("=== Recent backend log ===", flush=True)
            print(log_path.read_text(errors="replace")[-3000:], flush=True)
        raise RuntimeError("Backend failed to start")


# ---------------------------------------------------------------------------
# Admin user seeding — idempotent, robust
# ---------------------------------------------------------------------------
ADMIN_EMAIL = "collinsomega177@gmail.com"
ADMIN_PASSWORD = "LiveMorph2026!Admin"
UNLIMITED_CREDITS = 999999999.0

_pymongo_available = None


def _post_json(url, payload, headers=None, timeout=15):
    """POST JSON. Returns (status_code, body_dict). Never raises for HTTP errors."""
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("X-Frontend-Id", "livemorph")
    req.add_header("X-Client-Product", "livemorph")
    if headers:
        for k, v in headers.items():
            req.add_header(k, v)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            raw = r.read().decode() or "{}"
            try:
                return r.status, json.loads(raw)
            except json.JSONDecodeError:
                return r.status, {"raw": raw}
    except urllib.error.HTTPError as e:
        raw = ""
        try:
            raw = e.read().decode() or ""
        except Exception:
            pass
        try:
            body = json.loads(raw) if raw else {}
        except json.JSONDecodeError:
            body = {"raw": raw}
        return e.code, body
    except (urllib.error.URLError, socket.timeout, TimeoutError) as e:
        return 0, {"error": f"connection failed: {e}"}


def _ensure_pymongo():
    global _pymongo_available
    if _pymongo_available is not None:
        return _pymongo_available
    try:
        import pymongo  # noqa: F401
        _pymongo_available = True
        return True
    except ImportError:
        print("[*] Installing pymongo ...", flush=True)
        try:
            subprocess.run(
                [sys.executable, "-m", "pip", "install", "-q", "pymongo"],
                check=True,
            )
            _pymongo_available = True
            return True
        except Exception as e:
            print(f"[!] pymongo install failed: {e}", flush=True)
            _pymongo_available = False
            return False


def _db_get_user(email):
    """Fetch user doc from MongoDB via pymongo. Returns dict or None."""
    if not _ensure_pymongo():
        return None
    try:
        from pymongo import MongoClient
        client = MongoClient(
            "mongodb://127.0.0.1:27017", serverSelectionTimeoutMS=5000
        )
        db = client[ENV_VARS.get("MONGODB_DB", "livemorph")]
        user = db.users.find_one({"email": email})
        client.close()
        return user
    except Exception as e:
        print(f"[!] MongoDB read failed: {e}", flush=True)
        return None


def _db_set_credits(email, amount):
    """Set user's credit balance to an exact value. Idempotent."""
    if not _ensure_pymongo():
        return False
    try:
        from pymongo import MongoClient
        client = MongoClient(
            "mongodb://127.0.0.1:27017", serverSelectionTimeoutMS=5000
        )
        db = client[ENV_VARS.get("MONGODB_DB", "livemorph")]
        user = db.users.find_one({"email": email})
        if not user:
            client.close()
            print(f"[!] User {email} not found in MongoDB", flush=True)
            return False
        # Detect the credits field
        candidates = [
            "credits",
            "credits_balance",
            "credit_balance",
            "balance",
            "wallet_balance",
            "credits_total",
            "available_credits",
        ]
        field = next((f for f in candidates if f in user), None)
        update = {field or "credits": float(amount)}
        db.users.update_one({"_id": user["_id"]}, {"$set": update})
        client.close()
        print(
            f"[*] Set {field or 'credits'} = {amount:,.0f} for {email}",
            flush=True,
        )
        return True
    except Exception as e:
        print(f"[!] MongoDB credits update failed: {e}", flush=True)
        return False


def _db_set_tier(email, tier, plan, is_active):
    """Set user's subscription tier. Idempotent."""
    if not _ensure_pymongo():
        return False
    try:
        from pymongo import MongoClient
        client = MongoClient(
            "mongodb://127.0.0.1:27017", serverSelectionTimeoutMS=5000
        )
        db = client[ENV_VARS.get("MONGODB_DB", "livemorph")]
        result = db.users.update_one(
            {"email": email},
            {"$set": {"tier": tier, "plan": plan, "is_active": is_active}},
        )
        client.close()
        if result.matched_count == 0:
            print(f"[!] User {email} not found for tier update", flush=True)
            return False
        print(f"[*] Set tier={tier}, plan={plan} for {email}", flush=True)
        return True
    except Exception as e:
        print(f"[!] MongoDB tier update failed: {e}", flush=True)
        return False


def auto_create_admin_user():
    """Idempotent: register if needed, then ensure unlimited credits + pro tier.

    Safe to call multiple times — registration handles 409, credits use
    set_total (idempotent), tier uses $set (idempotent).
    """
    print(f"\n=== Ensuring admin user: {ADMIN_EMAIL} ===", flush=True)
    base = f"http://127.0.0.1:{BACKEND_PORT}/api/v1"

    # Wait for backend HTTP readiness (TCP-only check in start_backend isn't enough)
    if not _wait_for_http(f"{base}/health", timeout=30):
        print(
            "[!] Backend HTTP not ready after 30s — skipping admin user setup",
            flush=True,
        )
        return

    # --- Step 1: Ensure user exists ---
    user_exists = False
    status, body = _post_json(
        f"{base}/auth/register",
        {
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD,
            "accepted_terms": True,
            "display_name": "Collins Omega",
            "name": "Collins Omega",
        },
    )

    if status in (200, 201):
        print(f"[*] Registered new user: {ADMIN_EMAIL}", flush=True)
        user_exists = True
    elif status == 409:
        print(f"[*] User already exists — verifying login", flush=True)
        login_status, login_body = _post_json(
            f"{base}/auth/login",
            {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        )
        if login_status in (200, 201):
            print(f"[*] Login verified", flush=True)
        elif login_status == 401:
            print(
                f"[!] User exists but password mismatch (different from ADMIN_PASSWORD)",
                flush=True,
            )
            print(
                f"    Credits/tier will still be updated via DB",
                flush=True,
            )
        else:
            print(
                f"[!] Login returned {login_status}: {_trunc(login_body)}",
                flush=True,
            )
        user_exists = True  # 409 = user is in DB
    else:
        print(
            f"[!] Registration returned {status}: {_trunc(body)}", flush=True
        )
        # Could already exist with a different status; try DB read as fallback
        user_exists = _db_get_user(ADMIN_EMAIL) is not None
        if user_exists:
            print(
                f"[*] Confirmed user exists via DB", flush=True
            )

    if not user_exists:
        print(
            f"[!] Cannot confirm user exists — skipping credits/tier update",
            flush=True,
        )
        return

    # --- Step 2: Set unlimited credits (try API, fall back to pymongo) ---
    credits_ok = False
    admin_secret = ENV_VARS.get("ADMIN_SECRET", "")
    api_status, api_body = _post_json(
        f"{base}/credits/add",
        {
            "admin_secret": admin_secret,
            "user_email": ADMIN_EMAIL,
            "set_total": UNLIMITED_CREDITS,
        },
    )
    if api_status in (200, 201):
        print(
            f"[*] Credits set via API: {UNLIMITED_CREDITS:,.0f}", flush=True
        )
        credits_ok = True
    else:
        print(
            f"[!] API credits update returned {api_status}: {_trunc(api_body)}",
            flush=True,
        )
        print(f"    Falling back to direct MongoDB write", flush=True)
        credits_ok = _db_set_credits(ADMIN_EMAIL, UNLIMITED_CREDITS)

    # --- Step 3: Upgrade tier via pymongo (no known API) ---
    tier_ok = _db_set_tier(ADMIN_EMAIL, "pro", "unlimited", True)

    # --- Step 4: Report ---
    print(f"\n=== Admin user summary ===", flush=True)
    print(f"  Email:      {ADMIN_EMAIL}", flush=True)
    print(f"  Password:   {ADMIN_PASSWORD}", flush=True)
    print(
        f"  Credits:    "
        + (f"✓ {UNLIMITED_CREDITS:,.0f}" if credits_ok else "✗ failed")
    , flush=True)
    print(
        f"  Tier:       "
        + ("✓ pro/unlimited" if tier_ok else "✗ failed")
    , flush=True)
    if not (credits_ok and tier_ok):
        print(
            f"[!] Some admin fields failed to update — check logs above",
            flush=True,
        )


# ---------------------------------------------------------------------------
# ngrok via pyngrok — the reliable path
# ---------------------------------------------------------------------------
def start_ngrok():
    """Open an ngrok tunnel using pyngrok and return the public HTTPS URL."""
    print("\n=== Starting ngrok tunnel (pyngrok) ===", flush=True)

    if not NGROK_AUTH_TOKEN:
        print("[!] NGROK_AUTH_TOKEN is not set — skipping ngrok", flush=True)
        print(
            "    Set it as an env var or in Kaggle Secrets to enable a public URL.",
            flush=True,
        )
        return None

    fp = NGROK_AUTH_TOKEN[:8]
    print(
        f"[*] Using NGROK_AUTH_TOKEN: {fp}... (len={len(NGROK_AUTH_TOKEN)})",
        flush=True,
    )

    ensure_pyngrok()

    from pyngrok import ngrok as pyngrok_ngrok
    from pyngrok import conf as pyngrok_conf

    for cfg in (
        Path.home() / ".config" / "ngrok" / "ngrok.yml",
        Path.home() / ".ngrok2" / "ngrok.yml",
    ):
        try:
            if cfg.exists():
                print(f"[*] Removing stale ngrok config: {cfg}", flush=True)
                cfg.unlink()
        except Exception as e:
            print(f"[!] Could not remove {cfg}: {e}", flush=True)

    pyngrok_conf.get_default().config_path = str(
        LOG_DIR / "pyngrok_config.yml"
    )

    try:
        pyngrok_ngrok.set_auth_token(
            NGROK_AUTH_TOKEN, pyngrok_config=pyngrok_conf.get_default()
        )
        print("[*] pyngrok auth token set successfully", flush=True)
    except Exception as e:
        print(f"[!] Failed to set ngrok auth token: {e}", flush=True)
        print(tail_file(LOG_DIR / "ngrok.log", 2000), flush=True)
        return None

    sh(["pkill", "-f", "ngrok"], check=False)
    time.sleep(1)

    tunnel = None
    try:
        tunnel = pyngrok_ngrok.connect(
            BACKEND_PORT,
            proto="http",
            pyngrok_config=pyngrok_conf.get_default(),
        )
        public_url = tunnel.public_url
        if public_url.startswith("http://"):
            public_url = public_url.replace("http://", "https://", 1)
        print(f"[*] ngrok public URL: {public_url}", flush=True)
        return public_url
    except Exception as e:
        print(f"[!] pyngrok tunnel failed: {e}", flush=True)
        if tunnel:
            try:
                print(tail_file(Path(tunnel.log_file), 2000), flush=True)
            except Exception:
                pass
        print(
            "[!] If you see ERR_NGROK_107, your token is invalid/revoked.",
            flush=True,
        )
        print(
            "    Regenerate at https://dashboard.ngrok.com/get-started/your-authtoken",
            flush=True,
        )
        print(
            f"    and update your NGROK_AUTH_TOKEN secret "
            f"(current prefix: {fp}...).",
            flush=True,
        )
        return None


def update_env_with_ngrok(public_url):
    if not public_url:
        print(
            "[!] No ngrok URL — keeping PUBLIC_BASE_URL as localhost", flush=True
        )
        return
    env_path = BACKEND_DIR / ".env"
    lines = []
    for line in env_path.read_text().splitlines():
        if line.startswith("PUBLIC_BASE_URL="):
            lines.append(f"PUBLIC_BASE_URL={public_url.rstrip('/')}")
        else:
            lines.append(line)
    env_path.write_text("\n".join(lines) + "\n")
    print(f"[*] Updated PUBLIC_BASE_URL -> {public_url}", flush=True)


# ---------------------------------------------------------------------------
# Auto-update monitor
# ---------------------------------------------------------------------------
def git_current_sha():
    r = sh(["git", "rev-parse", "HEAD"], cwd=str(REPO_DIR))
    return r.stdout.strip() if r.returncode == 0 else None


def git_current_branch():
    r = sh(["git", "rev-parse", "--abbrev-ref", "HEAD"], cwd=str(REPO_DIR))
    branch = r.stdout.strip() if r.returncode == 0 else "main"
    return branch or "main"


def git_fetch_remote_sha(branch):
    """Fetch origin/<branch> and return its SHA, or (None, error)."""
    r = sh(["git", "fetch", "origin", branch, "--quiet"], cwd=str(REPO_DIR))
    if r.returncode != 0:
        return None, (r.stderr or "").strip() or "git fetch failed"
    r = sh(["git", "rev-parse", f"origin/{branch}"], cwd=str(REPO_DIR))
    if r.returncode != 0:
        return None, "git rev-parse origin/<branch> failed"
    return r.stdout.strip(), None


def _log_line(msg):
    print(msg, flush=True)
    try:
        with open(LOG_DIR / "auto_update.log", "a") as f:
            f.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {msg}\n")
    except Exception:
        pass


def auto_update_loop(deployed_sha_ref):
    """Poll GitHub, rebuild when new commits land. Runs in a daemon thread."""
    branch = git_current_branch()
    _log_line(
        f"[*] Auto-update monitor started "
        f"(branch={branch}, interval={AUTO_UPDATE_INTERVAL}s)"
    )

    while True:
        time.sleep(AUTO_UPDATE_INTERVAL)
        try:
            remote_sha, err = git_fetch_remote_sha(branch)
            if remote_sha is None:
                _log_line(f"[!] {err} — will retry")
                continue

            current_deployed = deployed_sha_ref[0]
            if remote_sha == current_deployed:
                continue

            short_new = remote_sha[:8]
            short_old = (current_deployed or "none")[:8]
            _log_line(
                f"[+] New commit detected: {short_new} (deployed: {short_old})"
            )

            _log_line("=== Pulling changes ===")
            r = sh(
                ["git", "pull", "--ff-only", "origin", branch],
                cwd=str(REPO_DIR),
            )
            if r.returncode != 0:
                _log_line(
                    f"[!] git pull failed: {(r.stderr or '').strip() or 'unknown'}"
                )
                _log_line("    Will retry on next poll.")
                continue

            _log_line("=== Rebuilding backend ===")
            try:
                build_backend()
            except Exception as e:
                _log_line(f"[!] Build failed: {e}")
                _log_line(
                    "    Keeping old binary running; will retry on next poll."
                )
                continue

            _log_line("=== Restarting backend ===")
            try:
                start_backend()
            except Exception as e:
                _log_line(f"[!] Restart failed: {e}")
                _log_line("    Will retry on next poll.")
                continue

            deployed_sha_ref[0] = remote_sha
            _log_line(f"[+] Deploy complete: {short_new}")

        except Exception as e:
            _log_line(f"[!] Auto-update loop error: {e}")


# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
def print_summary(public_url):
    print("\n" + "=" * 60, flush=True)
    print("DEPLOYMENT COMPLETE", flush=True)
    print("=" * 60, flush=True)
    print(f"Backend:      http://127.0.0.1:{BACKEND_PORT}", flush=True)
    if public_url:
        print(f"Public URL:   {public_url}", flush=True)
        print(
            f"Health:       {public_url.rstrip('/')}/api/v1/health",
            flush=True,
        )
    else:
        print(
            f"Public URL:   http://127.0.0.1:{BACKEND_PORT} "
            f"(ngrok unavailable — using localhost)",
            flush=True,
        )
    print(f"Repo:         {REPO_DIR}", flush=True)
    print(f"Logs:         {LOG_DIR}", flush=True)
    print("=" * 60, flush=True)
    print("Logs:", flush=True)
    print(f"  backend:      {LOG_DIR / 'backend.log'}", flush=True)
    print(f"  mongodb:      {LOG_DIR / 'mongod.log'}", flush=True)
    print(f"  ngrok:        {LOG_DIR / 'ngrok.log'}", flush=True)
    print(f"  auto-update:  {LOG_DIR / 'auto_update.log'}", flush=True)
    print(
        "\nThe backend is running in the background. It will keep running "
        "as long as this Kaggle session is active.",
        flush=True,
    )
    if not public_url:
        if NGROK_AUTH_TOKEN:
            print(
                "Note: ngrok was attempted but failed — check the ngrok log above.",
                flush=True,
            )
            print(
                "      If you saw ERR_NGROK_107, your token has been reset/revoked;",
                flush=True,
            )
            print(
                "      get a new one from https://dashboard.ngrok.com/get-started/your-authtoken",
                flush=True,
            )
        else:
            print(
                "Note: ngrok was skipped — NGROK_AUTH_TOKEN is not set.",
                flush=True,
            )
            print(
                "      Set it as an env var or in Kaggle Secrets to get a public URL.",
                flush=True,
            )
        print(
            f"      The Qt client should connect to http://127.0.0.1:{BACKEND_PORT} directly.",
            flush=True,
        )


def main():
    ensure_dir(WORK_DIR)
    ensure_dir(LOG_DIR)

    repo_url = detect_repo_url()
    if not repo_url:
        print(
            "[!] Cannot proceed without a repo URL. Set GITHUB_TOKEN env var.",
            flush=True,
        )
        sys.exit(1)

    # 1. Clone / pull repo
    if REPO_DIR.exists():
        print(f"[*] {REPO_DIR} already exists — pulling latest", flush=True)
        run(["git", "pull"], cwd=str(REPO_DIR))
    else:
        print(f"[*] Cloning repo into {REPO_DIR}", flush=True)
        run(["git", "clone", "--recursive", repo_url, str(REPO_DIR)])

    # 2. System deps
    install_system_deps()

    # 3. MongoDB
    install_mongodb()
    start_mongodb()

    # 4. Rust
    install_rust()

    # 5. Build
    build_backend()

    # 6. Env (localhost first — ngrok URL updated later if available)
    write_env(use_local_url=True)

    # 7. Start backend
    start_backend()

    # 8. ngrok via pyngrok
    public_url = start_ngrok()

    # 9. Update env with public URL and restart backend if ngrok succeeded
    if public_url:
        update_env_with_ngrok(public_url)
        start_backend()

    # 10. Seed admin user — single call after backend is fully settled
    auto_create_admin_user()

    # 11. Summary
    print_summary(public_url)

    # 12. Auto-update monitor
    if AUTO_UPDATE_ENABLED:
        deployed_sha = [git_current_sha()]

        monitor = threading.Thread(
            target=auto_update_loop,
            args=(deployed_sha,),
            daemon=True,
            name="auto-update-monitor",
        )
        monitor.start()

        print(
            f"\n[*] Auto-update monitor active — polling every "
            f"{AUTO_UPDATE_INTERVAL}s",
            flush=True,
        )
        print(f"    Log: {LOG_DIR / 'auto_update.log'}", flush=True)
        print(
            "    Press Ctrl-C to stop monitoring (backend continues running).",
            flush=True,
        )

        try:
            while True:
                time.sleep(3600)
        except KeyboardInterrupt:
            print(
                "\n[!] Monitoring stopped by user (backend keeps running)",
                flush=True,
            )
    else:
        print(
            "\n[*] Deployment script finished. Backend is running in background.",
            flush=True,
        )
        print(
            f"    The backend URL is: http://127.0.0.1:{BACKEND_PORT}",
            flush=True,
        )
        if public_url:
            print("    Public URL (ngrok):", public_url, flush=True)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n[!] Interrupted by user", flush=True)
        sys.exit(1)
    except Exception as e:
        print(f"\n[!] FATAL: {e}", flush=True)
        import traceback

        traceback.print_exc()
        sys.exit(1)
