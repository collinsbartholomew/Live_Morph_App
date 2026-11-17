#!/usr/bin/env python3
"""
LiveMorph Rust backend deployment script.

Deploys only the backend (no Qt/QML frontend). Handles:
  - Git clone (private GitHub with embedded token)
  - MongoDB installation & startup
  - Rust 1.88 toolchain & release build
  - Backend server on 127.0.0.1:3874
  - Ngrok tunnel (optional — falls back to localhost if network restricted)
  - Public URL for Qt client connection

All env vars are hardcoded as test values (development only).
"""

import os
import sys
import subprocess
import time
import json
import shutil
import socket
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration — hardcode your values below
# ---------------------------------------------------------------------------
REPO_URL = "https://github.com/collinsbartholomew/Live_Morph_App.git"

# NGROK_AUTH_TOKEN — read from Kaggle environment, fall back to hardcoded test token.
# Set this in Kaggle Settings → Secrets to use your own ngrok token.
# If not set, the script uses a hardcoded test token (spaces stripped).
NGROK_AUTH_TOKEN = os.environ.get("NGROK_AUTH_TOKEN", "3MevOKmPCSizaCZfCGSaC8O5klY_2aVCwBri rs2iKcgQ7Z57j").replace(" ", "")
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")

BACKEND_PORT = 3874
WORK_DIR = Path("/kaggle/working")
REPO_DIR = WORK_DIR / "livemorph"
BACKEND_DIR = REPO_DIR / "backend"
MONGODB_DIR = WORK_DIR / "mongodb"
NGROK_DIR = WORK_DIR / "ngrok"
LOG_DIR = WORK_DIR / "logs"


# ---------------------------------------------------------------------------
# Utility: embed GITHUB_TOKEN into the clone URL
# ---------------------------------------------------------------------------
def repo_url_with_token(url):
    """Embed GITHUB_TOKEN into an https://github.com/... URL for auth."""
    if not url or not GITHUB_TOKEN:
        return url
    if "github.com" in url and url.startswith("https://"):
        return url.replace("https://", "https://x-access-token:{}@".format(GITHUB_TOKEN), 1)
    return url


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def run(cmd, **kwargs):
    """Run a command, raising on non-zero exit."""
    print(f"[+] {cmd}", flush=True)
    if isinstance(cmd, str):
        cmd = cmd.split()
    return subprocess.run(cmd, check=True, **kwargs)


def run_bg(cmd, log_file, cwd=None, env=None):
    """Start a background process, writing output to log_file."""
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


def sh(cmd, check=False, capture=True):
    """Run a command quietly, return CompletedProcess."""
    if isinstance(cmd, str):
        cmd = cmd.split()
    return subprocess.run(cmd, capture_output=capture, text=True, check=check)


def ensure_dir(path: Path):
    path.mkdir(parents=True, exist_ok=True)


def wait_for_port(host, port, timeout=60, service="service"):
    """Wait until a TCP port accepts connections."""
    print(f"[*] Waiting for {service} on {host}:{port} ...", flush=True)
    start = time.time()
    while time.time() - start < timeout:
        try:
            with socket.create_connection((host, port), timeout=2):
                print(f"[*] {service} is up on {host}:{port}", flush=True)
                return True
        except OSError:
            time.sleep(2)
    print(f"[!] {service} did not become available on {host}:{port} within {timeout}s",
          flush=True)
    return False


def http_get_json(url, timeout=10):
    import urllib.request
    with urllib.request.urlopen(url, timeout=timeout) as r:
        return json.loads(r.read().decode())


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
            run(prefix + ["install", "-y", "--no-install-recommends",
                          "build-essential", "pkg-config", "libssl-dev",
                          "curl", "gnupg", "lsb-release", "wget", "gnupg2",
                          "software-properties-common"])
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

    print("[*] apt-get mongodb not available, downloading official binary...", flush=True)
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
        raise RuntimeError("MongoDB tarball extraction did not produce expected dir")

    mongod_bin = extracted / "bin" / "mongod"
    link_target = WORK_DIR / "bin" / "mongod"
    link_target.parent.mkdir(exist_ok=True)
    if not link_target.exists():
        os.symlink(str(mongod_bin), str(link_target))
    os.environ["PATH"] = str(WORK_DIR / "bin") + os.pathsep + os.environ.get("PATH", "")
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
        [mongod,
         "--dbpath", str(dbpath),
         "--bind_ip", "127.0.0.1",
         "--port", "27017",
         "--logpath", str(logpath),
         "--fork"],
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
        run(["curl", "--proto", "=https", "--tlsv1.2", "-sSf",
             "https://sh.rustup.rs", "-o", str(WORK_DIR / "rustup-init.sh")])
        run(["sh", str(WORK_DIR / "rustup-init.sh"), "-y",
             "--default-toolchain", "1.88",
             "--profile", "minimal"])
        cargo_env = Path.home() / ".cargo" / "bin"
        if cargo_env.exists():
            os.environ["PATH"] = str(cargo_env) + os.pathsep + os.environ.get("PATH", "")
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
    "JWT_SECRET": "35-S9So_i6yFBcP6N9wtscvRQvxri6AwkCdTxXmpqIc",
    "JWT_ACCESS_TTL_SECS": "900",
    "JWT_REFRESH_TTL_SECS": "2592000",
    "GOOGLE_CLIENT_ID": "",
    "GOOGLE_CLIENT_SECRET": "",
    "GOOGLE_REDIRECT_URI": "",
    "OTP_LENGTH": "8",
    "OTP_TTL_SECS": "600",
    "AUTH_MAX_ATTEMPTS": "500",
    "AUTH_LOCKOUT_SECS": "60",
    "JWT_ISSUER": "livemorph",
    "CREDITS_PER_SECOND": "2.0",
    "SIGNUP_BONUS_CREDITS": "100",
    "MIN_CREDITS_TO_START": "5.0",
    "HD_CREDIT_MULTIPLIER": "1.5",
    "DECART_API_KEY": "3MEvOKmPCSizaCZfCGSaC8O5klY_2aVCwBrirs2iKcgQ7Z57j",
    "DECART_SIGNALING_URL": "wss://api3.decart.ai/v1/stream",
    "DECART_DEFAULT_MODEL": "lucy-2.6",
    "DECART_ALLOWED_MODELS": "lucy-2.6,lucy-2.5,lucy-2.1,lucy-restyle-2,lucy-latest",
    "STREAM_DEFAULT_PORT": "4789",
    "SEED_STARTER_CATALOG": "true",
    "PAYSTACK_SECRET_KEY": "rk_test_WqY1_-itTwsqCT0WyjstsXlPjE5QgdnC3156f4ef",
    "PAYSTACK_PUBLIC_KEY": "pk_test_0d76952c7090ae02a04d9d01469797433dbe171c",
    "PAYSTACK_CALLBACK_URL": "http://127.0.0.1:3874/api/v1/payments/callback/paystack",
    "PAYSTACK_WEBHOOK_SECRET": "",
    "NOWPAYMENTS_API_KEY": "",
    "NOWPAYMENTS_DEFAULT_PAY_CURRENCY": "usdttrc20",
    "ALLOW_MANUAL_PAYMENTS": "false",
    "ALLOW_CREDITS_ADJUST": "false",
    "LOG_OTP_CODES": "false",
    "MAX_BODY_BYTES": "8388608",
    "SMTP_HOST": "",
    "SMTP_PORT": "587",
    "SMTP_USERNAME": "",
    "SMTP_PASSWORD": "",
    "SMTP_FROM": "LiveMorph <noreply@localhost>",
    "SMTP_STARTTLS": "true",
    "ICE_SERVERS_JSON": "",
    "MAX_CONCURRENT_SESSIONS": "1",
    "DECART_USD_PER_SECOND": "0.02",
    "PLATFORM_MARGIN_RATIO": "0.35",
    "ADMIN_SECRET": "test-admin-secret",
    "USD_NGN_RATE": "1600",
    "FLUTTERWAVE_SECRET_KEY": "",
    "FLUTTERWAVE_PUBLIC_KEY": "",
}


def write_env(use_local_url=False):
    print("\n=== Writing backend .env ===", flush=True)
    env = dict(ENV_VARS)
    # If ngrok failed, use localhost; otherwise ngrok URL is set later
    if use_local_url:
        env["PUBLIC_BASE_URL"] = f"http://127.0.0.1:{BACKEND_PORT}"
    # else: PUBLIC_BASE_URL stays empty; will be set to ngrok URL if available

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

    if not wait_for_port("127.0.0.1", BACKEND_PORT, timeout=90, service="backend"):
        if log_path.exists():
            print("=== Recent backend log ===", flush=True)
            print(log_path.read_text(errors="replace")[-3000:], flush=True)
        raise RuntimeError("Backend failed to start")


def install_ngrok():
    print("\n=== Installing ngrok ===", flush=True)
    ensure_dir(NGROK_DIR)
    ngrok_bin = NGROK_DIR / "ngrok"
    if ngrok_bin.exists():
        print("[*] ngrok already present", flush=True)
        return str(ngrok_bin)

    arch = sh(["uname", "-m"], capture=True).stdout.strip()
    if arch in ("x86_64", "amd64"):
        url = "https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz"
    elif arch in ("aarch64", "arm64"):
        url = "https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-arm64.tgz"
    else:
        raise RuntimeError(f"Unsupported architecture for ngrok: {arch}")

    tgz = WORK_DIR / "ngrok.tgz"
    run(["curl", "-fL", "-o", str(tgz), url])
    run(["tar", "xzf", str(tgz), "-C", str(NGROK_DIR)])

    for entry in NGROK_DIR.iterdir():
        if entry.name == "ngrok" and entry.is_file():
            ngrok_bin = entry
            break

    os.chmod(ngrok_bin, 0o755)
    print(f"[*] ngrok ready at {ngrok_bin}", flush=True)
    return str(ngrok_bin)


def start_ngrok(ngrok_bin):
    print("\n=== Starting ngrok tunnel ===", flush=True)

    # Always attempt ngrok, but handle failure gracefully
    if NGROK_AUTH_TOKEN:
        try:
            run([ngrok_bin, "config", "add-authtoken", NGROK_AUTH_TOKEN])
            print("[*] ngrok auth token accepted", flush=True)
        except Exception as e:
            print(f"[!] ngrok auth failed: {e}", flush=True)

    sh(["pkill", "-f", "ngrok"], check=False)
    time.sleep(1)

    proc, log_fh = run_bg(
        [ngrok_bin, "http", str(BACKEND_PORT)],
        log_file=LOG_DIR / "ngrok.log",
    )
    log_fh.close()

    # Wait a moment for ngrok to initialize and establish outbound connection
    time.sleep(3)

    # Check if ngrok process is still running
    if proc.poll() is not None:
        print("[!] ngrok process exited unexpectedly — check ngrok log", flush=True)
        with open(LOG_DIR / "ngrok.log", "r") as f:
            print(f.read(), flush=True)
        return None

    # Try to get the public URL from ngrok's local API
    print("[*] Querying ngrok tunnel API...", flush=True)
    start = time.time()
    public_url = None
    while time.time() - start < 45:  # extended timeout for outbound dial
        try:
            tunnels = http_get_json("http://127.0.0.1:4040/api/tunnels", timeout=5)
            for t in tunnels.get("tunnels", []):
                if t.get("proto") == "https":
                    public_url = t["public_url"]
                    print(f"[*] ngrok public URL: {public_url}", flush=True)
                    break
            if public_url:
                break
            # Also check if ngrok is still running
            if proc.poll() is not None:
                print("[!] ngrok process exited during tunnel query", flush=True)
                with open(LOG_DIR / "ngrok.log", "r") as f:
                    print(f.read(), flush=True)
                return None
        except Exception as e:
            print(f"[!] ngrok API error: {e}", flush=True)
        time.sleep(2)

    if not public_url:
        print("[!] ngrok did not provide an HTTPS tunnel — falling back to localhost",
              flush=True)
        print("    The backend is still running on http://127.0.0.1:3874", flush=True)
        print("    Qt client should connect to the local address instead.", flush=True)
        return None

    return public_url


def update_env_with_ngrok(public_url):
    if not public_url:
        print("[!] No ngrok URL — keeping PUBLIC_BASE_URL as localhost", flush=True)
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


def print_summary(public_url):
    print("\n" + "=" * 60, flush=True)
    print("DEPLOYMENT COMPLETE", flush=True)
    print("=" * 60, flush=True)
    print(f"Backend:      http://127.0.0.1:{BACKEND_PORT}", flush=True)
    if public_url:
        print(f"Public URL:   {public_url}", flush=True)
        print(f"Health:       {public_url.rstrip('/')}/api/v1/health", flush=True)
    else:
        print(f"Public URL:   http://127.0.0.1:{BACKEND_PORT} (ngrok unavailable — using localhost)", flush=True)
    print(f"Repo:         {REPO_DIR}", flush=True)
    print(f"Logs:         {LOG_DIR}", flush=True)
    print("=" * 60, flush=True)
    print("Logs:", flush=True)
    print(f"  backend:  {LOG_DIR / 'backend.log'}", flush=True)
    print(f"  mongodb:  {LOG_DIR / 'mongod.log'}", flush=True)
    print(f"  ngrok:    {LOG_DIR / 'ngrok.log'}", flush=True)
    print("\nThe backend is running in the background. It will keep running "
          "as long as this Kaggle session is active.", flush=True)
    if not public_url:
        print("Note: Ngrok tunnel could not be established (network restrictions).", flush=True)
        print("      The Qt client should connect to http://127.0.0.1:3874 directly.", flush=True)


def main():
    ensure_dir(WORK_DIR)
    ensure_dir(LOG_DIR)

    repo_url = detect_repo_url()
    if not repo_url:
        print("[!] Cannot proceed without a repo URL. Set GITHUB_TOKEN env var.", flush=True)
        sys.exit(1)

    # 1. Clone repo
    if REPO_DIR.exists():
        print(f"[*] {REPO_DIR} already exists — skipping clone", flush=True)
    else:
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

    # 8. ngrok (best-effort; falls back to localhost)
    ngrok_bin = install_ngrok()
    public_url = start_ngrok(ngrok_bin)

    # 9. Update env with public URL if ngrok succeeded
    if public_url:
        update_env_with_ngrok(public_url)
        # Restart backend so it picks up the new PUBLIC_BASE_URL
        start_backend()

    # 10. Summary
    print_summary(public_url)

    print("\n[*] Deployment script finished. Backend is running in background.",
          flush=True)
    print("    The backend URL is: http://127.0.0.1:3874", flush=True)
    if public_url:
        print("    Public URL (ngrok):", public_url, flush=True)
    print("    Press Ctrl-C in this cell to stop the foreground cell (background "
          "processes continue).", flush=True)


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
