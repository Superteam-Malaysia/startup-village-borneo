#!/usr/bin/env bash
# Idempotent dependency setup for the startup-village-borneo Cloud Agent environment.
# Installs uv (Python tool manager) and the Spec Kit CLI (`specify`), then makes
# the bundled Spec Kit helper scripts executable. Safe to run repeatedly.
set -euo pipefail

echo "==> Installing uv (if missing)"
if ! command -v uv >/dev/null 2>&1; then
  curl -LsSf https://astral.sh/uv/install.sh | sh
fi

# Ensure uv-installed tools are on PATH for the rest of this script.
export PATH="$HOME/.local/bin:$PATH"

echo "==> Installing/updating the Spec Kit CLI (specify)"
# --force keeps the install idempotent: reinstalls cleanly if already present.
uv tool install specify-cli --force

echo "==> Ensuring Spec Kit helper scripts are executable"
if [ -d .specify/scripts/bash ]; then
  chmod +x .specify/scripts/bash/*.sh 2>/dev/null || true
fi

echo "==> Verifying toolchain"
uv --version
specify version || true
uv tool list || true

echo "==> Installing Railway CLI (if missing)"
if ! command -v railway >/dev/null 2>&1; then
  bash <(curl -fsSL https://railway.com/install.sh) --agents -y
fi
# shellcheck disable=SC1091
[ -f "$HOME/.railway/env" ] && source "$HOME/.railway/env"

echo "==> Checking Cloud Agent secrets"
missing=()
[ -z "${RAILWAY_TOKEN:-}" ] && missing+=("RAILWAY_TOKEN")
[ -z "${TELEGRAM_BOT_TOKEN:-}" ] && missing+=("TELEGRAM_BOT_TOKEN")
if [ "${#missing[@]}" -gt 0 ]; then
  echo "WARN: Missing secrets: ${missing[*]} (add in Cursor environment settings)"
else
  echo "OK: RAILWAY_TOKEN and TELEGRAM_BOT_TOKEN are set"
fi

echo "==> Installing web app dependencies (if needed)"
if [ -f apps/web/package.json ] && [ ! -d apps/web/node_modules ]; then
  (cd apps/web && npm ci)
fi

echo "==> Environment setup complete"
