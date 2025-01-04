# Onboarding Service

A dedicated service for handling user onboarding processes, designed to run on a private VPS. This service manages the complete user onboarding flow and seamlessly transitions users to the main application upon completion.

## Architecture

```
[VPS]
├── Nginx (80/443) ← SSL termination
│   └── /api/onboarding/* → Onboarding Service (3000)
├── PostgreSQL (5432) ← User & onboarding data
└── PM2
    └── Node.js Onboarding Service
```

## Features

- **User Onboarding Management**:
  - Step-by-step onboarding tracking
  - Progress persistence
  - Customizable onboarding flows
  
- **Security**:
  - JWT-based authentication
  - Secure transition tokens
  - PostgreSQL user isolation
  - CORS protection
  - Rate limiting
  - SSL/TLS encryption

- **Monitoring & Logging**:
  - Winston logging
  - PM2 process management
  - Health checks
  - Performance metrics

- **Data Management**:
  - PostgreSQL for data persistence
  - Automatic data archiving
  - Backup system

## VPS Deployment

### 1. Initial Server Setup

```bash
# Connect to your VPS
ssh root@your-vps-ip

# Create deployment user
adduser deploy
usermod -aG sudo deploy

# Setup SSH key authentication
# On your local machine:
ssh-copy-id deploy@your-vps-ip
```

### 2. System Requirements

```bash
# Copy deployment files
scp -r deploy/* deploy@your-vps-ip:~/

# SSH into server
ssh deploy@your-vps-ip

# Run setup script
chmod +x setup.sh
sudo ./setup.sh
```

### 3. Application Deployment

```bash
# Deploy application
chmod +x deploy.sh
sudo ./deploy.sh

# Setup systemd service
sudo cp onboarding.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable onboarding
sudo systemctl start onboarding
```

### 4. Security Setup

```bash
# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable

# Install Fail2Ban
sudo apt install fail2ban
sudo systemctl enable fail2ban

# Setup SSL
sudo certbot --nginx -d your-domain.com
```

## Configuration

### Environment Variables

```bash
# Server
PORT=3000
NODE_ENV=production

# Database
DB_USER=onboarding
DB_HOST=localhost
DB_NAME=onboarding
DB_PASSWORD=your_secure_password
DB_PORT=5432

# Security
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=1h

# Application
MAIN_APP_URL=https://your-main-app.com
```

## API Usage

### Authentication
All API endpoints require JWT authentication:
```bash
Authorization: Bearer <jwt_token>
```

### Endpoints

#### 1. Get Onboarding Status
```bash
GET /api/onboarding/status/:userId

Response:
{
  "onboarding_completed": boolean,
  "onboarding_step": number,
  "onboarding_data": object
}
```

#### 2. Update Onboarding Step
```bash
POST /api/onboarding/step/:userId
{
  "step": number,
  "stepData": object
}

Response:
{
  "success": true
}
```

#### 3. Complete Onboarding
```bash
POST /api/onboarding/complete/:userId

Response:
{
  "success": true,
  "redirectUrl": "https://main-app.com?transition_token=..."
}
```

## Monitoring & Maintenance

### Process Management
```bash
# View process status
pm2 list

# Monitor in real-time
pm2 monit

# View logs
pm2 logs onboarding
```

### Health Checks
```bash
# Check service health
curl http://localhost:3000/health

Response:
{
  "status": "healthy",
  "timestamp": "2025-01-04T09:00:00Z"
}
```

### Backup System
Automated daily backups:
```bash
# Manual backup
/opt/onboarding/backup.sh

# Backup location
/var/backups/onboarding/
```

## Troubleshooting

### Common Issues

1. **Service Won't Start**:
```bash
# Check logs
sudo journalctl -u onboarding -f

# Verify permissions
sudo chown -R onboarding:onboarding /opt/onboarding
```

2. **Database Connection Issues**:
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Verify connection
psql -U onboarding -d onboarding -h localhost
```

3. **Nginx Issues**:
```bash
# Test configuration
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log
```

## Development

### Local Setup
```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Run tests
npm test
```

### Making Changes
1. Create feature branch
2. Make changes
3. Run tests
4. Deploy using deploy script

## Support

For issues and support:
1. Check logs: `pm2 logs onboarding`
2. Check system logs: `sudo journalctl -u onboarding`
3. Contact system administrator

## License

[Your License]
