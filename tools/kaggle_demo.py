# Kaggle notebook script — clone LiveMorph, build the Rust backend, run it
# against a local MongoDB, and expose the API through ngrok.
#
# How to use:
#   1. Kaggle notebook -> Settings -> enable "Internet".
#   2. Kaggle Secrets: add NGROK_AUTH_TOKEN (from ngrok.com dashboard).
#      Optional: DECART_API_KEY (enables realtime WS proxying),
#                GITHUB_TOKEN (only if the repo is private).
#   3. Paste each `# %%` block below into its own notebook cell, run top to
#      bottom. Every step prints a === STEP n === banner and streams its
#      logs, so you can watch the whole build/deploy live in the cell output.
#
# SECURITY: the ngrok URL is PUBLIC — anyone with it can call this throwaway
# demo API. The script generates a fresh JWT_SECRET/OTP_PEPPER, so nothing
# real is exposed. Never add real payment/SMTP secrets to this notebook.

# %%
# %% STEP 0 — parameters & secrets
import os, secrets, subprocess, sys, time, json

REPO_URL = "https://github.com/collinsbartholomew/Live_Morph_App.git"
# When launched via `remote-bridge run`, the repo itself is synced to the
# remote dir — detect that and use it instead of cloning again.
_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
WORK = os.path.dirname(_SCRIPT_DIR) if os.path.isdir(os.path.join(_SCRIPT_DIR, "..", "backend", "src")) \
    else "/kaggle/working/livemorph-demo"
BACKEND = os.path.join(WORK, "backend")
PORT = 3874

def sh(cmd, **kw):
    """Run a shell command with live output so the notebook shows everything."""
    print(f"\n$ {cmd}", flush=True)
    return subprocess.run(cmd, shell=True, **kw)

def get_secret(name, required=False):
    try:
        from kaggle_secrets import UserSecretsClient
        return UserSecretsClient().get_secret(name)
    except Exception:
        v = os.environ.get(name)
        if v:
            return v
        if required:
            raise RuntimeError(f"Missing Kaggle secret {name}")
        return None

NGROK_TOKEN = get_secret("NGROK_AUTH_TOKEN", required=True)
DECART_KEY = get_secret("DECART_API_KEY")          # optional
GH_TOKEN = get_secret("GITHUB_TOKEN")               # optional (private repo)
if GH_TOKEN:
    REPO_URL = REPO_URL.replace("https://", f"https://x-access-token:{GH_TOKEN}@")

os.makedirs(WORK, exist_ok=True)
print("workdir:", WORK)

# %%
# %% STEP 1 — system deps + Rust toolchain + ngrok (idempotent)
sh("apt-get update -qq && apt-get install -y -qq git curl ca-certificates libssl3 libcurl4 xz-utils >/dev/null 2>&1 || true")

if sh("cargo --version", check=False).returncode != 0:
    sh("curl -sSf https://sh.rustup.rs -o /tmp/rustup.sh && sh /tmp/rustup.sh -y --profile minimal --default-toolchain none")
    os.environ["PATH"] = os.path.expanduser("~/.cargo/bin") + ":" + os.environ["PATH"]
    print("rustup installed; the repo's rust-toolchain.toml pins 1.88 and rustup will fetch it on first cargo run")

sh("pip install -q pyngrok")

# %%
# %% STEP 2 — clone the repo (or reuse the remote-bridge synced copy)
if os.path.isdir(os.path.join(BACKEND, "src")) and os.path.isdir(os.path.join(WORK, "tools")):
    print(f"using already-present project copy at {WORK} (remote-bridge sync)")
else:
    sh(f"git clone --depth 1 {REPO_URL} {WORK}")
    sh(f"git -C {WORK} log -1 --oneline")

# %%
# %% STEP 3 — local MongoDB 7 (static binary tarball, auto-detects Ubuntu version)
MONGO_DIR = "/tmp/mongo"
if not os.path.exists(os.path.join(MONGO_DIR, "bin/mongod")):
    codename = subprocess.run("lsb_release -cs", shell=True, capture_output=True, text=True).stdout.strip()
    tag = {"jammy": "ubuntu2204", "focal": "ubuntu2004", "noble": "ubuntu2404"}.get(codename, "ubuntu2204")
    candidates = [
        f"https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-{tag}-7.0.14.tgz",
        "https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2204-7.0.14.tgz",
        "https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-7.0.14.tgz",
    ]
    import urllib.request
    url = next(u for u in candidates
               if urllib.request.urlopen(urllib.request.Request(u, method="HEAD")).status == 200)
    print("downloading", url)
    sh(f"curl -sSL {url} -o /tmp/mongo.tgz && mkdir -p {MONGO_DIR} && tar -xzf /tmp/mongo.tgz -C {MONGO_DIR} --strip-components=1")

sh("mkdir -p /tmp/mongo-data")
sh(f"{MONGO_DIR}/bin/mongod --dbpath /tmp/mongo-data --bind_ip 127.0.0.1 --port 27017 "
   f"--fork --logpath /tmp/mongod.log && echo 'mongod up (pid in /tmp/mongod.log)'")
sh("tail -n 3 /tmp/mongod.log")

# %%
# %% STEP 4 — backend .env (secrets generated here, never printed)
env = {
    "RUST_ENV": "development",                      # dev mode: allows non-TLS local mongo, ?token= WS, manual payments
    "HOST": "127.0.0.1",
    "PORT": str(PORT),
    "MONGODB_URI": "mongodb://127.0.0.1:27017",
    "MONGODB_DB": "livemorph",
    "JWT_SECRET": secrets.token_hex(32),           # >=32 chars, fresh per run
    "OTP_PEPPER": secrets.token_hex(32),
    "DECART_API_KEY": DECART_KEY or "dev-placeholder-no-realtime",
    "PUBLIC_BASE_URL": f"http://127.0.0.1:{PORT}",
    "ALLOW_MANUAL_PAYMENTS": "true",                # demo checkout without real Paystack keys
    "ALLOW_CREDITS_ADJUST": "true",
    "AUTH_MAX_ATTEMPTS": "500",
    "LOG_OTP_CODES": "true",                        # dev only: OTP codes appear in the log so you can log in
    "SIGNUP_BONUS_CREDITS": "120",
}
with open(os.path.join(BACKEND, ".env"), "w") as f:
    for k, v in env.items():
        f.write(f"{k}={v}\n")
print(f".env written to {BACKEND}/.env ({len(env)} keys, values hidden)")

# %%
# %% STEP 5 — build the backend (rust-toolchain.toml pins Rust 1.88; first run
# downloads it). Debug build is used for a fast demo; use --release for prod-like.
sh(f"cd {BACKEND} && cargo build 2>&1 | tail -n 5", check=False)
assert os.path.exists(f"{BACKEND}/target/debug/livemorph-backend"), "build failed — scroll up for cargo errors"
print("backend binary built OK")

# %%
# %% STEP 6 — start the backend (background, logs streamed to /tmp/backend.log)
sh(f"cd {BACKEND} && nohup ./target/debug/livemorph-backend > /tmp/backend.log 2>&1 & echo $! > /tmp/backend.pid")
for i in range(30):
    r = sh(f"curl -sf --max-time 2 http://127.0.0.1:{PORT}/api/v1/health", check=False,
           capture_output=True, text=True)
    if r.returncode == 0:
        print("HEALTH OK:", r.stdout.strip())
        break
    time.sleep(1)
else:
    sh("tail -n 30 /tmp/backend.log")
    raise RuntimeError("backend did not become healthy — see log above")
sh("tail -n 5 /tmp/backend.log")

# %%
# %% STEP 7 — expose the API through ngrok (public URL printed once, saved to file)
from pyngrok import ngrok
ngrok.set_auth_token(NGROK_TOKEN)
tunnel = ngrok.connect(PORT, "http", bind_tls=True)
PUBLIC = tunnel.public_url
with open("/tmp/livemorph_url.txt", "w") as f:
    f.write(PUBLIC)
print("\n==================================================")
print("PUBLIC API URL:", PUBLIC)
print("==================================================\n")

# %%
# %% STEP 8 — try it: register / OTP login / authenticated call
# Run these in any later cell (PUBLIC is saved in /tmp/livemorph_url.txt):
#
#   PUBLIC=$(cat /tmp/livemorph_url.txt)
#   curl -s $PUBLIC/api/v1/health
#   curl -s $PUBLIC/api/v1/public/bootstrap
#   curl -s -X POST $PUBLIC/api/v1/auth/register -H 'Content-Type: application/json' \
#        -d '{"email":"demo@example.com","password":"DemoPass123!","display_name":"Demo"}'
#   # OTP login (code is printed in /tmp/backend.log because LOG_OTP_CODES=true):
#   curl -s -X POST $PUBLIC/api/v1/auth/otp/request -H 'Content-Type: application/json' -d '{"email":"demo@example.com"}'
#   tail -n 5 /tmp/backend.log   # grab the code
#   curl -s -X POST $PUBLIC/api/v1/auth/otp/verify -H 'Content-Type: application/json' \
#        -d '{"email":"demo@example.com","code":"123456","device_id":"kaggle-demo"}'
#   # -> {"access_token":"...","refresh_token":"..."} ; then:
#   curl -s $PUBLIC/api/v1/auth/me -H "Authorization: Bearer <access_token>"
#   curl -s $PUBLIC/api/v1/credits/balance -H "Authorization: Bearer <access_token>"
#
# Realtime WS (needs a real DECART_API_KEY secret):
#   wss://<ngrok-host>/api/v1/realtime?model=lucy-2.1  (Authorization: Bearer header)

# %%
# %% STEP 9 — optional watch-all loop. Set KAGGLE_DEMO_WATCH=1 (or run this
# cell in a notebook) to stream both process logs forever. Under
# `remote-bridge run` the script just prints the URL and exits 0; the backend
# and ngrok tunnel keep running in the background on the Kaggle runtime.
if os.environ.get("KAGGLE_DEMO_WATCH") == "1":
    print("streaming /tmp/mongod.log + /tmp/backend.log — interrupt to stop watching\n")
    while True:
        for name, log in (("mongo", "/tmp/mongod.log"), ("api", "/tmp/backend.log")):
            out = subprocess.run(f"tail -n 2 {log}", shell=True,
                                 capture_output=True, text=True).stdout.strip().splitlines()
            for line in out[-2:]:
                print(f"[{name}] {line}", flush=True)
        print(f"[ngrok] {open('/tmp/livemorph_url.txt').read()}  "
              f"(up: {len(ngrok.get_tunnels())} tunnel(s))", flush=True)
        time.sleep(10)
else:
    print("\nDone. Backend + ngrok keep running in the background on the runtime.")
    print("Watch logs with:  remote-bridge shell-command 'tail -n 20 /tmp/backend.log'")
    print("Public API URL:  ", open('/tmp/livemorph_url.txt').read())
