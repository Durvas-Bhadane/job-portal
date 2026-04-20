#!/bin/bash
# ─────────────────────────────────────────────────────────────
# scripts/deploy.sh
# Run from the EC2 instance whenever you want to deploy a new version:
#   bash /var/www/job-portal/scripts/deploy.sh
# ─────────────────────────────────────────────────────────────

set -e
APP_DIR=/var/www/job-portal
BRANCH=aws-deployment

echo "===== Deploying Job Portal ====="

# ── 1. Pull latest code ───────────────────────────────────────
cd "$APP_DIR"
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"
echo "[1/6] Code pulled from $BRANCH"

# ── 2. Server dependencies ────────────────────────────────────
cd "$APP_DIR/server"
npm ci --omit=dev
echo "[2/6] Server dependencies installed"

# ── 3. Copy .env  (must be placed manually the first time) ────
if [ ! -f "$APP_DIR/server/.env" ]; then
  echo "ERROR: server/.env not found. Copy your .env file to $APP_DIR/server/.env and rerun."
  exit 1
fi

# ── 4. Build React client ─────────────────────────────────────
cd "$APP_DIR/client"
npm ci
REACT_APP_API_URL=/api npm run build
echo "[4/6] React build complete"

# ── 5. Restart PM2 ───────────────────────────────────────────
cd "$APP_DIR"
pm2 startOrRestart ecosystem.config.js --env production
pm2 save
echo "[5/6] PM2 restarted"

# ── 6. Reload Nginx ───────────────────────────────────────────
# Copy config on first deploy
if [ ! -f /etc/nginx/sites-available/job-portal ]; then
  cp "$APP_DIR/nginx/job-portal.conf" /etc/nginx/sites-available/job-portal
  ln -sf /etc/nginx/sites-available/job-portal /etc/nginx/sites-enabled/job-portal
  rm -f /etc/nginx/sites-enabled/default
fi
nginx -t && systemctl reload nginx
echo "[6/6] Nginx reloaded"

echo ""
echo "===== Deployment complete! ====="
echo "App running at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
