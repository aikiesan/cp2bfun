# 🚀 CP2B Website - SSH Deployment Quick Start Guide

**Step-by-step guide for connecting to your VM and deploying the website**

---

## Prerequisites

Before you begin, make sure you have:

- ✅ Debian 12 x64 VM with SSH access
- ✅ VM IP address or hostname
- ✅ SSH username and password (or SSH key)
- ✅ Sudo privileges on the VM
- ✅ VM has internet access

---

## Part 1: First-Time Connection & Setup

### Step 1: Connect to Your VM via SSH

**From Windows (PowerShell or Command Prompt):**

```bash
ssh username@your-vm-ip-address
# Example: ssh admin@192.168.1.100
```

**From Linux/Mac (Terminal):**

```bash
ssh username@your-vm-ip-address
# Example: ssh admin@192.168.1.100
```

**If using SSH key:**

```bash
ssh -i path/to/your-key.pem username@your-vm-ip-address
```

**First connection prompt:**
- You'll see: "Are you sure you want to continue connecting (yes/no)?"
- Type: `yes` and press Enter

### Step 2: Update System Packages

Once connected to the VM:

```bash
# Update package lists
sudo apt-get update

# Upgrade installed packages
sudo apt-get upgrade -y
```

This may take a few minutes. Wait for it to complete.

### Step 3: Install Required Software

**Install Node.js 20.x:**

```bash
# Download and install Node.js from NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

**Install PostgreSQL 15:**

```bash
# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version  # Should show 15.x
```

**Install Apache2:**

```bash
# Install Apache2
sudo apt-get install -y apache2

# Start Apache2 service
sudo systemctl start apache2
sudo systemctl enable apache2

# Verify installation
apache2 -v  # Should show Apache/2.4.x
```

**Install Git and other tools:**

```bash
# Install Git and utilities
sudo apt-get install -y git build-essential curl wget rsync openssl

# Verify Git installation
git --version
```

### Step 4: Create Application Directory Structure

```bash
# Create main application directory
sudo mkdir -p /var/www/cp2b

# Change ownership to your user (replace 'youruser' with your actual username)
sudo chown -R $USER:$USER /var/www/cp2b

# Create subdirectories
mkdir -p /var/www/cp2b/{repo,frontend,backend,backups}
```

### Step 5: Clone the Repository

```bash
# Navigate to the cp2b directory
cd /var/www/cp2b

# Clone the repository
git clone https://github.com/aikiesan/cp2bfun.git repo

# Navigate to the repository
cd repo

# Check current branch
git branch

# Switch to main branch if not already there
git checkout main

# Verify the repository is cloned
ls -la
```

You should see the `cp2b_web/`, `deployment/`, and other directories.

---

## Part 2: Initial Database Setup

### Step 6: Set Up PostgreSQL Database

```bash
# Navigate to deployment directory
cd /var/www/cp2b/repo/deployment/db

# Make the setup script executable
chmod +x setup-postgres.sh

# Run the database setup script
sudo ./setup-postgres.sh
```

**What this script does:**
- Creates PostgreSQL user `cp2b`
- Creates database `cp2b`
- Generates a secure password
- Initializes database schema
- Loads seed data
- Saves credentials to `/var/www/cp2b/db-credentials.txt`

**Important:** The script will display the database password. **COPY AND SAVE IT!**

**View the credentials again:**

```bash
sudo cat /var/www/cp2b/db-credentials.txt
```

**Test database connection:**

```bash
# Connect to the database (you'll be prompted for the password)
psql -U cp2b -d cp2b -W

# Once connected, try:
\dt          # List tables
\q           # Quit
```

---

## Part 3: Backend Configuration

### Step 7: Configure Backend Environment

```bash
# Navigate to backend directory
cd /var/www/cp2b/repo/cp2b_web/backend

# Copy the production environment template
cp ../../deployment/.env.production .env

# Edit the .env file
nano .env
```

**Required changes in the .env file:**

1. **Update DATABASE_URL** with the password from step 6:
   ```
   DATABASE_URL=postgres://cp2b:YOUR_PASSWORD_HERE@localhost:5432/cp2b
   ```

2. **Generate SESSION_SECRET** (open a new SSH terminal or use screen/tmux):
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and paste it as SESSION_SECRET value.

3. **Generate JWT_SECRET**:
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and paste it as JWT_SECRET value.

4. **Update FRONTEND_URL** with your domain or IP:
   ```
   # For testing with IP:
   FRONTEND_URL=http://192.168.1.100

   # For production with domain:
   FRONTEND_URL=https://your-domain.com
   ```

5. **Save the file:**
   - Press `Ctrl + X`
   - Press `Y` to confirm
   - Press `Enter` to save

**Secure the .env file:**

```bash
chmod 600 .env
```

### Step 8: Install Backend Dependencies

```bash
# Make sure you're in the backend directory
cd /var/www/cp2b/repo/cp2b_web/backend

# Install dependencies
npm install --production

# Copy backend files to deployment location
sudo rsync -av --exclude='node_modules' --exclude='.env' \
    /var/www/cp2b/repo/cp2b_web/backend/ \
    /var/www/cp2b/backend/

# Copy your configured .env file
sudo cp .env /var/www/cp2b/backend/.env

# Create uploads directory
sudo mkdir -p /var/www/cp2b/backend/uploads

# Set proper ownership and permissions
sudo chown -R www-data:www-data /var/www/cp2b/backend
sudo chmod 755 /var/www/cp2b/backend/uploads
```

### Step 9: Install Backend as Systemd Service

```bash
# Copy the systemd service file
sudo cp /var/www/cp2b/repo/deployment/systemd/cp2b-backend.service \
    /etc/systemd/system/

# Reload systemd to recognize the new service
sudo systemctl daemon-reload

# Start the backend service
sudo systemctl start cp2b-backend

# Enable the service to start on boot
sudo systemctl enable cp2b-backend

# Check service status
sudo systemctl status cp2b-backend
```

**Expected output:** Service should be "active (running)" in green.

**Test backend API:**

```bash
curl http://localhost:3001/api/health
```

**Expected response:** `{"status":"ok","database":"connected"}`

**If backend fails to start:**

```bash
# View logs
sudo journalctl -u cp2b-backend -n 50

# Common issues:
# - Database connection: Check DATABASE_URL in .env
# - Port 3001 in use: sudo lsof -i :3001
# - Permissions: Check /var/www/cp2b/backend ownership
```

---

## Part 4: Frontend Build & Deployment

### Step 10: Build Frontend

```bash
# Navigate to frontend directory
cd /var/www/cp2b/repo/cp2b_web

# Install dependencies
npm install

# Create production build
npm run build
```

This will take 2-5 minutes. You'll see "✓ built in X seconds" when complete.

**Verify build:**

```bash
ls -lah dist/
```

You should see `index.html`, `assets/` directory, and other files.

### Step 11: Deploy Frontend Files

```bash
# Copy built files to web root
sudo cp -r /var/www/cp2b/repo/cp2b_web/dist \
    /var/www/cp2b/frontend/

# Set proper ownership and permissions
sudo chown -R www-data:www-data /var/www/cp2b/frontend
sudo chmod -R 755 /var/www/cp2b/frontend
```

---

## Part 5: Apache2 Configuration

### Step 12: Enable Required Apache Modules

```bash
# Enable all required modules
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod deflate
sudo a2enmod ssl

# Restart Apache to load modules
sudo systemctl restart apache2
```

### Step 13: Configure Virtual Host

```bash
# Copy the virtual host configuration
sudo cp /var/www/cp2b/repo/deployment/apache2/cp2b.conf \
    /etc/apache2/sites-available/

# Edit the configuration to add your domain/IP
sudo nano /etc/apache2/sites-available/cp2b.conf
```

**Update these lines:**

```apache
ServerName 192.168.1.100          # Replace with your IP or domain
ServerAlias www.your-domain.com   # If using domain, otherwise remove this line
ServerAdmin admin@your-domain.com # Your email address
```

**Save the file:**
- Press `Ctrl + X`, then `Y`, then `Enter`

**Test Apache configuration:**

```bash
sudo apache2ctl configtest
```

**Expected output:** `Syntax OK`

**Enable the site:**

```bash
# Disable default site (optional)
sudo a2dissite 000-default.conf

# Enable CP2B site
sudo a2ensite cp2b.conf

# Reload Apache
sudo systemctl reload apache2
```

### Step 14: Verify Deployment

**Check all services:**

```bash
# Backend service
sudo systemctl status cp2b-backend

# Apache service
sudo systemctl status apache2

# PostgreSQL service
sudo systemctl status postgresql
```

All should show "active (running)" in green.

**Test the website:**

```bash
# Test frontend
curl http://localhost/

# Test API through Apache
curl http://localhost/api/health

# Test from another computer
# Open browser: http://your-vm-ip-address
```

---

## Part 6: Firewall Configuration

### Step 15: Configure UFW Firewall

```bash
# Install UFW if not already installed
sudo apt-get install -y ufw

# Allow SSH (CRITICAL - do this first!)
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

**Expected output:** Rules for ports 22, 80, and 443 should be listed.

---

## Part 7: First Deployment Complete! 🎉

### Step 16: Run Health Check

```bash
# Make health check script executable
cd /var/www/cp2b/repo/deployment
chmod +x health-check.sh

# Run health check
sudo ./health-check.sh
```

**Expected output:** All checks should pass (green checkmarks).

### Step 17: Access Your Website

**From your local computer:**

1. Open web browser
2. Navigate to: `http://your-vm-ip-address`
3. You should see the CP2B website!

**Test the admin panel:**

1. Navigate to: `http://your-vm-ip-address/admin`
2. Login with default credentials:
   - Username: `admin`
   - Password: `admin123`
3. **IMPORTANT:** Change this password in production!

---

## Part 8: Future Updates & Deployments

### Pulling Latest Changes & Deploying

**For future updates, it's much simpler:**

```bash
# 1. SSH into your VM
ssh username@your-vm-ip-address

# 2. Navigate to deployment directory
cd /var/www/cp2b/repo/deployment

# 3. Make deploy script executable (first time only)
chmod +x deploy.sh

# 4. Run automated deployment
sudo ./deploy.sh
```

**That's it!** The deploy script will:
- ✅ Create backup of current version
- ✅ Pull latest code from GitHub
- ✅ Install dependencies
- ✅ Build frontend
- ✅ Deploy files
- ✅ Restart services
- ✅ Run health checks
- ✅ Auto-rollback if anything fails

**Manual deployment steps (if you prefer):**

```bash
# 1. SSH into VM
ssh username@your-vm-ip-address

# 2. Navigate to repository
cd /var/www/cp2b/repo

# 3. Pull latest changes
git pull origin main

# 4. Build frontend
cd cp2b_web
npm install
npm run build
sudo cp -r dist/* /var/www/cp2b/frontend/dist/

# 5. Update backend
cd backend
npm install --production
sudo rsync -av --exclude='node_modules' --exclude='uploads' --exclude='.env' \
    ./ /var/www/cp2b/backend/

# 6. Restart services
sudo systemctl restart cp2b-backend
sudo systemctl reload apache2

# 7. Verify
curl http://localhost/api/health
```

---

## Part 9: Setting Up SSL/HTTPS (Optional but Recommended)

### Step 18: Configure SSL with Let's Encrypt

**Prerequisites:**
- Domain name pointing to your VM's IP address
- DNS records propagated (wait 30 minutes after DNS changes)

**Install Certbot:**

```bash
# Install Certbot for Apache
sudo apt-get install -y certbot python3-certbot-apache
```

**Obtain SSL certificate:**

```bash
# Replace with your actual domain
sudo certbot --apache -d your-domain.com -d www.your-domain.com
```

**Follow the prompts:**
1. Enter your email address
2. Agree to Terms of Service (Y)
3. Choose whether to share email (Y/N)
4. Choose to redirect HTTP to HTTPS (option 2 - recommended)

**Test auto-renewal:**

```bash
sudo certbot renew --dry-run
```

**Update backend .env FRONTEND_URL:**

```bash
sudo nano /var/www/cp2b/backend/.env
```

Change:
```
FRONTEND_URL=https://your-domain.com
```

**Restart backend:**

```bash
sudo systemctl restart cp2b-backend
```

**Test HTTPS:**

```bash
curl https://your-domain.com/api/health
```

---

## Part 10: Setting Up Automated Backups

### Step 19: Configure Daily Backups

```bash
# Make backup script executable
cd /var/www/cp2b/repo/deployment
chmod +x backup.sh

# Test backup manually
sudo ./backup.sh
```

**Schedule daily backups with cron:**

```bash
# Edit root's crontab
sudo crontab -e

# If prompted, choose nano (option 1)

# Add this line at the end of the file:
0 2 * * * /var/www/cp2b/repo/deployment/backup.sh >> /var/log/cp2b-backup.log 2>&1

# Save and exit (Ctrl+X, Y, Enter)
```

**What this does:**
- Runs backup every day at 2:00 AM
- Logs output to `/var/log/cp2b-backup.log`
- Keeps last 7 days of backups

**View backup logs:**

```bash
sudo tail -f /var/log/cp2b-backup.log
```

---

## Quick Reference Commands

### SSH Connection

```bash
ssh username@your-vm-ip-address
```

### Service Management

```bash
# Backend
sudo systemctl status cp2b-backend
sudo systemctl restart cp2b-backend
sudo systemctl stop cp2b-backend
sudo systemctl start cp2b-backend

# Apache
sudo systemctl status apache2
sudo systemctl restart apache2
sudo systemctl reload apache2

# PostgreSQL
sudo systemctl status postgresql
sudo systemctl restart postgresql
```

### Logs

```bash
# Backend logs (real-time)
sudo journalctl -u cp2b-backend -f

# Backend logs (last 100 lines)
sudo journalctl -u cp2b-backend -n 100

# Apache access logs
sudo tail -f /var/log/apache2/cp2b-access.log

# Apache error logs
sudo tail -f /var/log/apache2/cp2b-error.log
```

### Health & Monitoring

```bash
# Run health check
sudo /var/www/cp2b/repo/deployment/health-check.sh

# Test API
curl http://localhost:3001/api/health
curl http://localhost/api/health

# Test frontend
curl http://localhost/
```

### Backup & Restore

```bash
# Create backup
sudo /var/www/cp2b/repo/deployment/backup.sh

# List backups
ls -lth /var/www/cp2b/backups/

# Rollback to previous version
sudo /var/www/cp2b/repo/deployment/rollback.sh
```

### Deployment

```bash
# Quick deployment (automated)
cd /var/www/cp2b/repo/deployment
sudo ./deploy.sh

# Pull latest code only
cd /var/www/cp2b/repo
git pull origin main
```

---

## Troubleshooting Common Issues

### Issue: SSH Connection Refused

**Solution:**

```bash
# From your local machine, verify VM is reachable
ping your-vm-ip-address

# Check if SSH service is running on VM (if you have console access)
sudo systemctl status ssh
sudo systemctl start ssh
```

### Issue: Backend Service Won't Start

**Check logs:**

```bash
sudo journalctl -u cp2b-backend -n 50 --no-pager
```

**Common fixes:**

```bash
# Check database connection
psql -U cp2b -d cp2b -W

# Check .env file
sudo cat /var/www/cp2b/backend/.env

# Check port 3001
sudo lsof -i :3001

# Fix permissions
sudo chown -R www-data:www-data /var/www/cp2b/backend
```

### Issue: Website Not Loading

**Check services:**

```bash
sudo systemctl status apache2
sudo systemctl status cp2b-backend
```

**Check Apache configuration:**

```bash
sudo apache2ctl configtest
```

**Check logs:**

```bash
sudo tail -n 50 /var/log/apache2/cp2b-error.log
```

### Issue: 502 Bad Gateway

**This means Apache can't reach the backend:**

```bash
# Check if backend is running
sudo systemctl status cp2b-backend

# Test backend directly
curl http://localhost:3001/api/health

# Restart backend
sudo systemctl restart cp2b-backend
```

### Issue: Permission Denied Errors

**Fix permissions:**

```bash
# Backend
sudo chown -R www-data:www-data /var/www/cp2b/backend
sudo chmod 755 /var/www/cp2b/backend/uploads

# Frontend
sudo chown -R www-data:www-data /var/www/cp2b/frontend
sudo chmod -R 755 /var/www/cp2b/frontend
```

---

## Security Checklist

After deployment, make sure to:

- [ ] Change default admin password at `/admin`
- [ ] Configure firewall (UFW) - only allow necessary ports
- [ ] Set up SSL/HTTPS with Let's Encrypt
- [ ] Review `.env` file permissions (should be 600)
- [ ] Configure automated backups
- [ ] Update system regularly: `sudo apt-get update && sudo apt-get upgrade`
- [ ] Monitor logs regularly
- [ ] Test backup restoration procedure

---

## Next Steps

1. **Test all functionality:**
   - Browse website pages
   - Test language switching (PT/EN)
   - Test admin panel
   - Upload test images
   - Submit test contact form

2. **Configure SSL** (if you have a domain)

3. **Set up monitoring:**
   - Daily health checks
   - Log monitoring
   - Backup verification

4. **Documentation:**
   - Document your VM credentials
   - Save database password securely
   - Keep SSH keys backed up

---

## Getting Help

**Check logs first:**
- Backend: `sudo journalctl -u cp2b-backend -f`
- Apache: `sudo tail -f /var/log/apache2/cp2b-error.log`

**Run health check:**
```bash
sudo /var/www/cp2b/repo/deployment/health-check.sh
```

**Complete documentation:**
- [deployment/VM_SETUP_GUIDE.md](./deployment/VM_SETUP_GUIDE.md)
- [DEPLOYMENT_READY.md](./DEPLOYMENT_READY.md)
- [README.md](./README.md)

---

## Summary of Key Commands

```bash
# Connect to VM
ssh username@your-vm-ip

# Deploy updates
cd /var/www/cp2b/repo/deployment && sudo ./deploy.sh

# Check status
sudo /var/www/cp2b/repo/deployment/health-check.sh

# View logs
sudo journalctl -u cp2b-backend -f

# Restart services
sudo systemctl restart cp2b-backend
sudo systemctl reload apache2

# Backup
sudo /var/www/cp2b/repo/deployment/backup.sh

# Rollback
sudo /var/www/cp2b/repo/deployment/rollback.sh
```

---

**🎉 Congratulations!** Your CP2B website is now deployed and running on your VM!

Visit: `http://your-vm-ip-address` to see it live.
