#!/bin/bash

# CP2B Website Deployment Script
# This script deploys the latest version of the CP2B website to production

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_DIR="/var/www/cp2b/repo"
FRONTEND_BUILD_DIR="/var/www/cp2b/frontend"
BACKEND_DIR="/var/www/cp2b/backend"
BACKUP_DIR="/var/www/cp2b/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to create backup
create_backup() {
    print_info "Creating backup of current deployment..."

    mkdir -p "$BACKUP_DIR"

    # Backup frontend
    if [ -d "$FRONTEND_BUILD_DIR/dist" ]; then
        tar -czf "$BACKUP_DIR/frontend_$TIMESTAMP.tar.gz" -C "$FRONTEND_BUILD_DIR" dist
        print_success "Frontend backed up to $BACKUP_DIR/frontend_$TIMESTAMP.tar.gz"
    fi

    # Backup backend (excluding node_modules)
    if [ -d "$BACKEND_DIR" ]; then
        tar -czf "$BACKUP_DIR/backend_$TIMESTAMP.tar.gz" \
            --exclude='node_modules' \
            --exclude='uploads' \
            -C "$BACKEND_DIR" .
        print_success "Backend backed up to $BACKUP_DIR/backend_$TIMESTAMP.tar.gz"
    fi

    # Keep only last 5 backups
    print_info "Cleaning old backups (keeping last 5)..."
    cd "$BACKUP_DIR"
    ls -t frontend_*.tar.gz 2>/dev/null | tail -n +6 | xargs -r rm
    ls -t backend_*.tar.gz 2>/dev/null | tail -n +6 | xargs -r rm
}

# Function to rollback on failure
rollback() {
    print_error "Deployment failed! Rolling back..."

    if [ -f "$BACKUP_DIR/frontend_$TIMESTAMP.tar.gz" ]; then
        print_info "Restoring frontend..."
        rm -rf "$FRONTEND_BUILD_DIR/dist"
        tar -xzf "$BACKUP_DIR/frontend_$TIMESTAMP.tar.gz" -C "$FRONTEND_BUILD_DIR"
    fi

    if [ -f "$BACKUP_DIR/backend_$TIMESTAMP.tar.gz" ]; then
        print_info "Restoring backend..."
        tar -xzf "$BACKUP_DIR/backend_$TIMESTAMP.tar.gz" -C "$BACKEND_DIR"
    fi

    # Restart services
    sudo systemctl restart cp2b-backend
    sudo systemctl reload apache2

    print_error "Rollback complete. Please check the logs for details."
    exit 1
}

# Set trap to rollback on error
trap rollback ERR

# Check if running as root or with sudo for service management
if [ "$EUID" -ne 0 ]; then
    print_warning "This script requires sudo privileges for service management."
    print_info "You may be prompted for your password..."
fi

print_info "========================================="
print_info "CP2B Website Deployment Script"
print_info "========================================="
print_info "Timestamp: $TIMESTAMP"
print_info ""

# Step 1: Create backup
create_backup

# Step 2: Pull latest code
print_info "Pulling latest code from GitHub..."
cd "$REPO_DIR"
git fetch origin
git pull origin main
print_success "Code updated to latest version"

# Get current commit hash
COMMIT_HASH=$(git rev-parse --short HEAD)
print_info "Deploying commit: $COMMIT_HASH"

# Step 3: Build frontend
print_info "Building frontend..."
cd "$REPO_DIR/cp2b_web"

# Install/update dependencies
print_info "Installing frontend dependencies..."
npm install --production=false

# Build production bundle
print_info "Creating production build..."
npm run build

# Copy build to web root
print_info "Deploying frontend files..."
rm -rf "$FRONTEND_BUILD_DIR/dist"
cp -r dist "$FRONTEND_BUILD_DIR/"
print_success "Frontend deployed successfully"

# Step 4: Deploy backend
print_info "Deploying backend..."
cd "$REPO_DIR/cp2b_web/backend"

# Install/update dependencies
print_info "Installing backend dependencies..."
npm install --production

# Copy backend files (excluding node_modules from source)
print_info "Updating backend files..."
rsync -av --exclude='node_modules' --exclude='uploads' --exclude='.env' \
    "$REPO_DIR/cp2b_web/backend/" "$BACKEND_DIR/"

# Ensure uploads directory exists with correct permissions
mkdir -p "$BACKEND_DIR/uploads"
sudo chown -R www-data:www-data "$BACKEND_DIR/uploads"
sudo chmod 755 "$BACKEND_DIR/uploads"

print_success "Backend files updated"

# Step 5: Run database migrations (if any)
if [ -d "$BACKEND_DIR/src/db/migrations" ]; then
    print_info "Checking for database migrations..."
    # Add migration logic here if needed
    # Example: node scripts/migrate.js
    print_info "No new migrations to run"
fi

# Step 6: Restart backend service
print_info "Restarting backend service..."
sudo systemctl restart cp2b-backend

# Wait for service to start
sleep 3

# Check if service started successfully
if sudo systemctl is-active --quiet cp2b-backend; then
    print_success "Backend service restarted successfully"
else
    print_error "Backend service failed to start"
    sudo systemctl status cp2b-backend
    rollback
fi

# Step 7: Reload Apache2
print_info "Reloading Apache2..."
sudo systemctl reload apache2
print_success "Apache2 reloaded"

# Step 8: Health check
print_info "Running health checks..."

# Check backend API
if curl -f -s http://localhost:3001/api/health > /dev/null 2>&1; then
    print_success "✓ Backend API is healthy"
else
    print_warning "✗ Backend API health check failed"
fi

# Check frontend
if curl -f -s http://localhost/ > /dev/null 2>&1; then
    print_success "✓ Frontend is accessible"
else
    print_warning "✗ Frontend accessibility check failed"
fi

# Display service status
print_info ""
print_info "========================================="
print_info "Deployment Status"
print_info "========================================="
sudo systemctl status cp2b-backend --no-pager -l

print_info ""
print_success "========================================="
print_success "Deployment completed successfully!"
print_success "========================================="
print_info "Commit: $COMMIT_HASH"
print_info "Timestamp: $TIMESTAMP"
print_info ""
print_info "Next steps:"
print_info "1. Test the website in your browser"
print_info "2. Check logs: journalctl -u cp2b-backend -f"
print_info "3. Monitor Apache logs: tail -f /var/log/apache2/cp2b-*.log"
print_info ""
print_info "To rollback, run: ./rollback.sh $TIMESTAMP"
print_info ""
