#!/usr/bin/env bash
# Make Desk reachable. Prefers Vercel; falls back to Cloudflare quick tunnel.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env.local ]]; then
  SECRET=$(openssl rand -hex 24)
  CODE=$(openssl rand -hex 8)
  cat > .env.local <<EOF
DOGE_DESK_SECRET=$SECRET
DESK_PRO_CODE=$CODE
NEXT_PUBLIC_DEFAULT_DOGE_ADDRESS=DTRJECKXfxgnSzGbt7TYRikLPDocqvdmo5
EOF
  echo "Wrote .env.local (DESK_PRO_CODE=$CODE)"
fi

# Ensure default doge if missing
grep -q NEXT_PUBLIC_DEFAULT_DOGE_ADDRESS .env.local 2>/dev/null || \
  echo 'NEXT_PUBLIC_DEFAULT_DOGE_ADDRESS=DTRJECKXfxgnSzGbt7TYRikLPDocqvdmo5' >> .env.local

if command -v vercel >/dev/null 2>&1 && vercel whoami >/dev/null 2>&1; then
  echo "Deploying to Vercel production…"
  vercel --prod --yes
  exit 0
fi

echo "Vercel not logged in — starting local + Cloudflare quick tunnel"
if ! curl -sS -o /dev/null -w '' http://127.0.0.1:3456/ 2>/dev/null; then
  npm run build
  npm run start &
  sleep 2
fi

echo "Tunnel (Ctrl+C to stop). Public URL prints below:"
npx --yes cloudflared tunnel --url http://127.0.0.1:3456
