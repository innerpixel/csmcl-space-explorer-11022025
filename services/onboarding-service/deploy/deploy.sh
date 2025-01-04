#!/bin/bash

# Exit on error
set -e

# Configuration
APP_DIR="/opt/onboarding"
REPO_URL="your-repository-url"
BRANCH="main"

# Update application
echo "Deploying application..."

# Switch to application user
sudo -u onboarding bash << EOF
    # Navigate to app directory
    cd $APP_DIR

    # Pull latest code
    if [ ! -d ".git" ]; then
        git clone $REPO_URL .
    else
        git fetch origin
        git reset --hard origin/$BRANCH
    fi

    # Install dependencies
    npm ci --production

    # Copy environment file if not exists
    if [ ! -f ".env" ]; then
        cp .env.example .env
    fi

    # Run database migrations
    psql "postgresql://onboarding:${DB_PASSWORD}@localhost/onboarding" < src/db/schema.sql

    # Restart PM2 process
    pm2 reload ecosystem.config.js --update-env
EOF

echo "Deployment completed!"
