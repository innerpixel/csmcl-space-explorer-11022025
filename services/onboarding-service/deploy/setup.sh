#!/bin/bash

# Exit on error
set -e

# Update system
echo "Updating system..."
sudo apt update && sudo apt upgrade -y

# Install Node.js
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
echo "Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
echo "Installing Nginx..."
sudo apt install -y nginx

# Install PM2
echo "Installing PM2..."
sudo npm install -g pm2

# Create application user
echo "Creating application user..."
sudo useradd -r -m -s /bin/bash onboarding || true

# Create application directories
echo "Setting up application directories..."
sudo mkdir -p /opt/onboarding
sudo mkdir -p /var/log/onboarding
sudo chown -R onboarding:onboarding /opt/onboarding
sudo chown -R onboarding:onboarding /var/log/onboarding

# Setup PostgreSQL
echo "Setting up PostgreSQL..."
sudo -u postgres psql -c "CREATE USER onboarding WITH PASSWORD '${DB_PASSWORD:-changeme}';" || true
sudo -u postgres psql -c "CREATE DATABASE onboarding OWNER onboarding;" || true

# Setup Nginx configuration
echo "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/onboarding << EOF
server {
    listen 80;
    server_name \$hostname;

    location /api/onboarding/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

# Enable Nginx site
sudo ln -sf /etc/nginx/sites-available/onboarding /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

echo "Basic server setup completed!"
