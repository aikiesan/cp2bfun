# CP2B Website - Production VM Setup Guide

Complete guide for deploying the CP2B website on a Debian 12 x64 virtual machine with Apache2.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Server Setup](#initial-server-setup)
3. [Install Required Software](#install-required-software)
4. [Database Configuration](#database-configuration)
5. [Application Installation](#application-installation)
6. [Backend Setup](#backend-setup)
7. [Frontend Build](#frontend-build)
8. [Apache2 Configuration](#apache2-configuration)
9. [SSL/HTTPS Setup](#sslhttps-setup-optional)
10. [Deployment Workflow](#deployment-workflow)
11. [Monitoring & Logs](#monitoring--logs)
12. [Backup Strategy](#backup-strategy)
13. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Minimum Server Requirements

- **OS**: Debian 12 (Bookworm) x64
- **RAM**: 2GB minimum, 4GB recommended
- **Disk**: 20GB minimum, 40GB recommended
- **CPU**: 2 cores minimum
- **Network**: Static IP address recommended
- **Access**: SSH access with sudo privileges

### Required Ports

- **22**: SSH (for remote access)
- **80**: HTTP (for web traffic)
- **443**: HTTPS (for secure web traffic)
- **3001**: Backend API (internal only, not exposed publicly)
- **5432**: PostgreSQL (internal only, localhost connections)

---

## Initial Server Setup

### 1. Update System Packages

```bash
sudo apt-get update
sudo apt-get upgrade -y
```

### 2. Set Hostname

```bash
sudo hostnamectl set-hostname cp2b
```

### 3. Configure Timezone

```bash
sudo timedatectl set-timezone America/Sao_Paulo
```

### 4. Create Application User (Optional)

For enhanced security, you can create a dedicated user instead of using `www-data`:

```bash
sudo adduser --system --group --home /var/www/cp2b cp2b
```

For simplicity, this guide uses `www-data` (Apache's default user).

### 5. Configure Firewall

```bash
# Install UFW if not already installed
sudo apt-get install -y ufw

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (IMPORTANT: Do this first!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

---

## Install Required Software

### 1. Install Node.js 20.x

```bash
# Install Node.js from NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x or higher
```

### 2. Install PostgreSQL 15

```bash
# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Verify installation
psql --version  # Should show 15.x

# Start and enable service
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo systemctl status postgresql
```

### 3. Install Apache2

```bash
# Install Apache2
sudo apt-get install -y apache2

# Verify installation
apache2 -v  # Should show Apache/2.4.x

# Start and enable service
sudo systemctl start apache2
sudo systemctl enable apache2
sudo systemctl status apache2
```

### 4. Install Git

```bash
sudo apt-get install -y git
git --version
```

### 5. Install Additional Tools

```bash
# Install build tools and utilities
sudo apt-get install -y build-essential curl wget rsync openssl
```

---

## Database Configuration

### 1. Run PostgreSQL Setup Script

```bash
# Create application directory
sudo mkdir -p /var/www/cp2b

# Clone repository
cd /var/www/cp2b
sudo git clone https://github.com/aikiesan/cp2bfun.git repo

# Run database setup
cd /var/www/cp2b/repo/deployment/db
sudo chmod +x setup-postgres.sh
sudo ./setup-postgres.sh
```

This script will:
- Create database user `cp2b`
- Create database `cp2b`
- Initialize schema from `schema.sql`
- Load seed data from `seed.sql`
- Run migrations
- Generate secure password
- Save credentials to `/var/www/cp2b/db-credentials.txt`

### 2. Save Database Credentials

```bash
# View generated credentials
sudo cat /var/www/cp2b/db-credentials.txt

# Copy the DATABASE_URL - you'll need it for the .env file
```

**⚠️ IMPORTANT**: Save these credentials securely! They are needed for the backend configuration.

### 3. Verify Database

```bash
# Connect to database (use password from db-credentials.txt)
psql -U cp2b -d cp2b -W

# List tables
\dt

# Check a table
SELECT COUNT(*) FROM team;

# Exit
\q
```

---

## Application Installation

### 1. Set Up Directory Structure

```bash
# Create directories
sudo mkdir -p /var/www/cp2b/{frontend,backend,backups}

# Set ownership
sudo chown -R www-data:www-data /var/www/cp2b
```

### 2. Pull Latest Code

The repository should already be cloned to `/var/www/cp2b/repo` from the database setup step. If not:

```bash
cd /var/www/cp2b
sudo git clone https://github.com/aikiesan/cp2bfun.git repo
```

### 3. Verify Repository

```bash
cd /var/www/cp2b/repo
git branch
git log --oneline -5
```

---

## Backend Setup

### 1. Install Backend Dependencies

```bash
cd /var/www/cp2b/repo/cp2b_web/backend
sudo npm install --production
```

### 2. Copy Backend Files

```bash
sudo rsync -av --exclude='node_modules' \
    /var/www/cp2b/repo/cp2b_web/backend/ \
    /var/www/cp2b/backend/
```

### 3. Configure Environment Variables

```bash
# Copy production template
sudo cp /var/www/cp2b/repo/deployment/.env.production \
    /var/www/cp2b/backend/.env

# Edit configuration
sudo nano /var/www/cp2b/backend/.env
```

**Required changes**:

1. **DATABASE_URL**: Paste the connection string from `/var/www/cp2b/db-credentials.txt`
   ```
   DATABASE_URL=postgres://cp2b:YOUR_PASSWORD@localhost:5432/cp2b
   ```

2. **SESSION_SECRET**: Generate a random secret
   ```bash
   openssl rand -base64 32
   ```
   Paste the output as SESSION_SECRET value.

3. **JWT_SECRET**: Generate another random secret
   ```bash
   openssl rand -base64 32
   ```

4. **FRONTEND_URL**: Set to your domain
   ```
   FRONTEND_URL=https://your-domain.com
   ```
   (Or `http://your-server-ip` for testing)

5. Save and exit (Ctrl+X, Y, Enter)

### 4. Secure Environment File

```bash
sudo chmod 600 /var/www/cp2b/backend/.env
sudo chown www-data:www-data /var/www/cp2b/backend/.env
```

### 5. Create Uploads Directory

```bash
sudo mkdir -p /var/www/cp2b/backend/uploads
sudo chown -R www-data:www-data /var/www/cp2b/backend/uploads
sudo chmod 755 /var/www/cp2b/backend/uploads
```

### 6. Test Backend (Optional)

```bash
# Test database connection
cd /var/www/cp2b/backend
sudo -u www-data node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"

# Test backend start (press Ctrl+C to stop)
sudo -u www-data node src/index.js
```

### 7. Install Systemd Service

```bash
# Copy service file
sudo cp /var/www/cp2b/repo/deployment/systemd/cp2b-backend.service \
    /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Start backend service
sudo systemctl start cp2b-backend

# Enable on boot
sudo systemctl enable cp2b-backend

# Check status
sudo systemctl status cp2b-backend
```

### 8. Verify Backend is Running

```bash
# Check service
sudo systemctl status cp2b-backend

# Check logs
sudo journalctl -u cp2b-backend -n 50

# Test health endpoint
curl http://localhost:3001/api/health
```

Expected response: `{"status":"ok","database":"connected"}`

---

## Frontend Build

### 1. Install Frontend Dependencies

```bash
cd /var/www/cp2b/repo/cp2b_web
sudo npm install
```

### 2. Build Production Bundle

```bash
sudo npm run build
```

This creates an optimized production build in `dist/` directory.

### 3. Deploy Frontend Files

```bash
# Copy build to web root
sudo cp -r /var/www/cp2b/repo/cp2b_web/dist \
    /var/www/cp2b/frontend/

# Set permissions
sudo chown -R www-data:www-data /var/www/cp2b/frontend
sudo chmod -R 755 /var/www/cp2b/frontend
```

### 4. Verify Build

```bash
ls -lah /var/www/cp2b/frontend/dist/
```

You should see `index.html`, `assets/`, and other build files.

---

## Apache2 Configuration

### 1. Enable Required Apache Modules

```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod deflate
sudo a2enmod ssl
```

### 2. Copy Virtual Host Configuration

```bash
sudo cp /var/www/cp2b/repo/deployment/apache2/cp2b.conf \
    /etc/apache2/sites-available/
```

### 3. Edit Virtual Host Configuration

```bash
sudo nano /etc/apache2/sites-available/cp2b.conf
```

**Update these lines**:
- `ServerName your-domain.com` → Your actual domain
- `ServerAlias www.your-domain.com` → Add www subdomain
- `ServerAdmin admin@your-domain.com` → Your email

For testing without a domain, you can use the server's IP address:
```apache
ServerName 192.168.1.100
```

### 4. Test Apache Configuration

```bash
sudo apache2ctl configtest
```

Expected output: `Syntax OK`

### 5. Disable Default Site (Optional)

```bash
sudo a2dissite 000-default.conf
```

### 6. Enable CP2B Site

```bash
sudo a2ensite cp2b.conf
```

### 7. Reload Apache

```bash
sudo systemctl reload apache2
```

### 8. Check Apache Status

```bash
sudo systemctl status apache2
```

### 9. Test Website

Open your browser and navigate to:
- `http://your-server-ip` or
- `http://your-domain.com`

You should see the CP2B website!

### 10. Verify API Proxy

```bash
# Test API through Apache
curl http://localhost/api/health
```

Should return: `{"status":"ok","database":"connected"}`

---

## SSL/HTTPS Setup (Optional)

### 1. Install Certbot

```bash
sudo apt-get install -y certbot python3-certbot-apache
```

### 2. Obtain SSL Certificate

```bash
sudo certbot --apache -d your-domain.com -d www.your-domain.com
```

Follow the prompts:
- Enter email address
- Agree to terms
- Choose whether to redirect HTTP to HTTPS (recommended: Yes)

### 3. Verify Auto-Renewal

```bash
sudo certbot renew --dry-run
```

### 4. Update Apache Config for HTTPS

Certbot automatically modifies your Apache configuration. Verify:

```bash
sudo nano /etc/apache2/sites-available/cp2b-le-ssl.conf
```

Or manually uncomment the HTTPS section in `cp2b.conf`.

### 5. Test HTTPS

Visit `https://your-domain.com` in your browser.

---

## Deployment Workflow

### Automated Deployment Script

For future updates, use the automated deployment script:

```bash
# Make script executable
sudo chmod +x /var/www/cp2b/repo/deployment/deploy.sh

# Run deployment
cd /var/www/cp2b/repo/deployment
sudo ./deploy.sh
```

The script automatically:
1. Creates backup of current deployment
2. Pulls latest code from GitHub
3. Builds frontend
4. Deploys frontend files
5. Updates backend
6. Restarts backend service
7. Reloads Apache
8. Runs health checks
9. Provides rollback option if deployment fails

### Manual Deployment Steps

If you prefer manual deployment:

```bash
# 1. Pull latest code
cd /var/www/cp2b/repo
sudo git pull origin main

# 2. Build frontend
cd /var/www/cp2b/repo/cp2b_web
sudo npm install
sudo npm run build
sudo cp -r dist/* /var/www/cp2b/frontend/dist/

# 3. Update backend
cd /var/www/cp2b/repo/cp2b_web/backend
sudo npm install --production
sudo rsync -av --exclude='node_modules' --exclude='uploads' \
    ./ /var/www/cp2b/backend/

# 4. Restart services
sudo systemctl restart cp2b-backend
sudo systemctl reload apache2
```

---

## Monitoring & Logs

### Backend Logs

```bash
# View real-time logs
sudo journalctl -u cp2b-backend -f

# View last 100 lines
sudo journalctl -u cp2b-backend -n 100

# View logs from today
sudo journalctl -u cp2b-backend --since today

# View error logs only
sudo journalctl -u cp2b-backend -p err
```

### Apache Logs

```bash
# Access logs
sudo tail -f /var/log/apache2/cp2b-access.log

# Error logs
sudo tail -f /var/log/apache2/cp2b-error.log

# Combined view
sudo tail -f /var/log/apache2/cp2b-*.log
```

### PostgreSQL Logs

```bash
# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

### Service Status

```bash
# Check all services
sudo systemctl status cp2b-backend
sudo systemctl status apache2
sudo systemctl status postgresql

# Quick health check
curl http://localhost:3001/api/health
curl http://localhost/api/health
```

### Resource Monitoring

```bash
# CPU and memory usage
htop

# Disk usage
df -h

# Check specific directory size
du -sh /var/www/cp2b/*
```

---

## Backup Strategy

### 1. Create Backup Script

```bash
sudo chmod +x /var/www/cp2b/repo/deployment/backup.sh
```

### 2. Manual Backup

```bash
cd /var/www/cp2b/repo/deployment
sudo ./backup.sh
```

This backs up:
- PostgreSQL database
- Uploaded files
- Application configuration

Backups are stored in `/var/www/cp2b/backups/`

### 3. Automated Backups with Cron

```bash
# Edit crontab
sudo crontab -e

# Add daily backup at 2 AM
0 2 * * * /var/www/cp2b/repo/deployment/backup.sh >> /var/log/cp2b-backup.log 2>&1

# Save and exit
```

### 4. Backup Retention

The backup script automatically keeps only the last 7 backups to save disk space.

### 5. Test Restore

Periodically test restore procedures:

```bash
cd /var/www/cp2b/repo/deployment
sudo ./rollback.sh
```

---

## Troubleshooting

### Backend Service Won't Start

**Check logs:**
```bash
sudo journalctl -u cp2b-backend -n 50
```

**Common issues:**

1. **Database connection error**
   - Verify DATABASE_URL in `/var/www/cp2b/backend/.env`
   - Test connection: `psql -U cp2b -d cp2b -W`
   - Check PostgreSQL is running: `sudo systemctl status postgresql`

2. **Port 3001 already in use**
   ```bash
   sudo lsof -i :3001
   sudo kill -9 <PID>
   sudo systemctl restart cp2b-backend
   ```

3. **Permission denied on uploads directory**
   ```bash
   sudo chown -R www-data:www-data /var/www/cp2b/backend/uploads
   sudo chmod 755 /var/www/cp2b/backend/uploads
   ```

### Frontend Not Loading

**Check Apache:**
```bash
sudo systemctl status apache2
sudo apache2ctl configtest
```

**Check file permissions:**
```bash
ls -lah /var/www/cp2b/frontend/dist/
sudo chown -R www-data:www-data /var/www/cp2b/frontend
```

**Check Apache logs:**
```bash
sudo tail -f /var/log/apache2/cp2b-error.log
```

### API Requests Failing (CORS Errors)

**Update FRONTEND_URL in backend .env:**
```bash
sudo nano /var/www/cp2b/backend/.env
```

Set `FRONTEND_URL` to match your domain exactly:
```
FRONTEND_URL=https://your-domain.com
```

**Restart backend:**
```bash
sudo systemctl restart cp2b-backend
```

### 502 Bad Gateway Error

This means Apache can't reach the backend.

**Check backend is running:**
```bash
sudo systemctl status cp2b-backend
curl http://localhost:3001/api/health
```

**Check Apache proxy configuration:**
```bash
sudo apache2ctl -M | grep proxy
```

Should show:
- proxy_module
- proxy_http_module

### SSL Certificate Issues

**Renew certificate manually:**
```bash
sudo certbot renew
```

**Check certificate expiry:**
```bash
sudo certbot certificates
```

### Database Performance Issues

**Check connection count:**
```bash
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"
```

**View active connections:**
```bash
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity WHERE state = 'active';"
```

**Optimize database:**
```bash
sudo -u postgres psql -d cp2b -c "VACUUM ANALYZE;"
```

### Disk Space Full

**Check disk usage:**
```bash
df -h
du -sh /var/www/cp2b/*
```

**Clean old logs:**
```bash
sudo journalctl --vacuum-time=7d
sudo rm -f /var/log/apache2/*.log.*.gz
```

**Clean old backups:**
```bash
cd /var/www/cp2b/backups
sudo ls -lt
sudo rm -f <old-backup-files>
```

---

## Post-Deployment Checklist

- [ ] All services running (backend, Apache, PostgreSQL)
- [ ] Website accessible via HTTP
- [ ] SSL certificate installed (if using HTTPS)
- [ ] API endpoints responding correctly
- [ ] Database connection working
- [ ] Admin panel accessible
- [ ] File uploads working
- [ ] Contact form functional (if configured)
- [ ] Backups configured and tested
- [ ] Firewall configured correctly
- [ ] Logs being collected
- [ ] Health check endpoints responding
- [ ] Performance acceptable (test with multiple concurrent users)

---

## Quick Reference

### Service Management

```bash
# Restart backend
sudo systemctl restart cp2b-backend

# Restart Apache
sudo systemctl restart apache2

# Restart PostgreSQL
sudo systemctl restart postgresql

# View backend logs
sudo journalctl -u cp2b-backend -f

# View Apache logs
sudo tail -f /var/log/apache2/cp2b-error.log
```

### Health Checks

```bash
# Backend direct
curl http://localhost:3001/api/health

# Backend via Apache
curl http://localhost/api/health

# Website
curl http://localhost/
```

### Deployment

```bash
# Automated
cd /var/www/cp2b/repo/deployment
sudo ./deploy.sh

# Rollback
sudo ./rollback.sh <timestamp>
```

---

## Getting Help

- **GitHub Issues**: https://github.com/aikiesan/cp2bfun/issues
- **Check logs first**: Most issues are visible in logs
- **Test locally**: Use Docker for local testing before deploying

---

## Estimated Deployment Time

For an experienced administrator:
- Initial setup: **30-45 minutes**
- SSL configuration: **5-10 minutes**
- Future deployments: **2-5 minutes** (automated)

---

**🎉 Congratulations!** Your CP2B website should now be running in production!
