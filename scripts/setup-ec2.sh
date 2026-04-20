#!/bin/bash
# ─────────────────────────────────────────────────────────────
# scripts/setup-ec2.sh
# Run ONCE on a fresh Ubuntu 22.04 EC2 instance as the ubuntu user:
#   chmod +x setup-ec2.sh && sudo bash setup-ec2.sh
# ─────────────────────────────────────────────────────────────

set -e
echo "===== Job Portal EC2 Setup ====="

# ── 1. System update ──────────────────────────────────────────
apt-get update -y && apt-get upgrade -y

# ── 2. Install Node.js 20 LTS ─────────────────────────────────
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
echo "Node version: $(node -v)"
echo "NPM version:  $(npm -v)"

# ── 3. Install PM2 globally ───────────────────────────────────
npm install -g pm2
pm2 startup systemd -u ubuntu --hp /home/ubuntu   # auto-start on reboot

# ── 4. Install Nginx ──────────────────────────────────────────
apt-get install -y nginx
systemctl enable nginx

# ── 5. Install PostgreSQL client (for manual DB access/testing) ─
apt-get install -y postgresql-client

# ── 6. Install Git ────────────────────────────────────────────
apt-get install -y git

# ── 7. Create app directory ───────────────────────────────────
mkdir -p /var/www/job-portal
chown -R ubuntu:ubuntu /var/www/job-portal

echo "===== EC2 setup complete! ====="
echo "Next: run deploy.sh to pull code, install deps, and start services."
