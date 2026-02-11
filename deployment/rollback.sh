#!/bin/bash

# CP2B Website Rollback Script
# Restores the website to a previous backup

set -e  # Exit on error

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Configuration
BACKUP_DIR="/var/www/cp2b/backups"
FRONTEND_DIR="/var/www/cp2b/frontend"
BACKEND_DIR="/var/www/cp2b/backend"
DB_NAME="cp2b"

print_info "========================================="
print_info "CP2B Website Rollback Script"
print_info "========================================="
print_info ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "This script must be run as root or with sudo"
    exit 1
fi

# Function to list available backups
list_backups() {
    print_info "Available backups:"
    echo ""

    if [ ! -d "$BACKUP_DIR" ]; then
        print_error "Backup directory not found: $BACKUP_DIR"
        exit 1
    fi

    cd "$BACKUP_DIR"

    # Get unique timestamps from backup files
    TIMESTAMPS=$(ls -1 database_*.sql.gz 2>/dev/null | sed 's/database_//;s/.sql.gz//' | sort -r)

    if [ -z "$TIMESTAMPS" ]; then
        print_error "No backups found in $BACKUP_DIR"
        exit 1
    fi

    echo "  Timestamp           Database    Uploads     Config"
    echo "  ─────────────────── ─────────── ─────────── ──────"

    for ts in $TIMESTAMPS; do
        DB_EXISTS=""
        UPLOAD_EXISTS=""
        ENV_EXISTS=""

        [ -f "database_${ts}.sql.gz" ] && DB_EXISTS="✓" || DB_EXISTS="✗"
        [ -f "uploads_${ts}.tar.gz" ] && UPLOAD_EXISTS="✓" || UPLOAD_EXISTS="✗"
        [ -f "env_${ts}.backup" ] && ENV_EXISTS="✓" || ENV_EXISTS="✓"

        printf "  %-19s %-11s %-11s %-6s\n" "$ts" "$DB_EXISTS" "$UPLOAD_EXISTS" "$ENV_EXISTS"
    done

    echo ""
}

# Function to confirm action
confirm_rollback() {
    local timestamp=$1

    print_warning "========================================="
    print_warning "WARNING: Rollback Operation"
    print_warning "========================================="
    print_warning "This will:"
    print_warning "  1. Stop the backend service"
    print_warning "  2. Restore database to backup: $timestamp"
    print_warning "  3. Restore uploaded files to backup: $timestamp"
    print_warning "  4. Restart services"
    print_warning ""
    print_warning "Current data will be OVERWRITTEN!"
    print_warning ""

    read -p "Are you sure you want to proceed? (yes/no): " -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        print_info "Rollback cancelled by user"
        exit 0
    fi
}

# Function to create pre-rollback backup
create_pre_rollback_backup() {
    print_info "Creating pre-rollback backup (safety measure)..."

    local pre_timestamp=$(date +%Y%m%d_%H%M%S)_pre_rollback

    # Backup database
    sudo -u postgres pg_dump "$DB_NAME" | gzip > "$BACKUP_DIR/database_${pre_timestamp}.sql.gz"

    # Backup uploads
    if [ -d "$BACKEND_DIR/uploads" ]; then
        tar -czf "$BACKUP_DIR/uploads_${pre_timestamp}.tar.gz" \
            -C "$BACKEND_DIR" uploads 2>/dev/null || true
    fi

    print_success "Pre-rollback backup created: $pre_timestamp"
}

# Function to restore database
restore_database() {
    local timestamp=$1
    local db_file="$BACKUP_DIR/database_${timestamp}.sql.gz"

    if [ ! -f "$db_file" ]; then
        print_error "Database backup not found: $db_file"
        return 1
    fi

    print_info "Restoring database from: $db_file"

    # Drop existing connections
    sudo -u postgres psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();" > /dev/null 2>&1 || true

    # Restore database
    gunzip -c "$db_file" | sudo -u postgres psql "$DB_NAME"

    print_success "Database restored successfully"
}

# Function to restore uploads
restore_uploads() {
    local timestamp=$1
    local upload_file="$BACKUP_DIR/uploads_${timestamp}.tar.gz"

    if [ ! -f "$upload_file" ]; then
        print_warning "Uploads backup not found: $upload_file"
        print_info "Skipping uploads restore..."
        return 0
    fi

    print_info "Restoring uploads from: $upload_file"

    # Backup current uploads (if any)
    if [ -d "$BACKEND_DIR/uploads" ]; then
        mv "$BACKEND_DIR/uploads" "$BACKEND_DIR/uploads.old.$(date +%Y%m%d_%H%M%S)"
    fi

    # Extract uploads
    tar -xzf "$upload_file" -C "$BACKEND_DIR"

    # Set permissions
    chown -R www-data:www-data "$BACKEND_DIR/uploads"
    chmod 755 "$BACKEND_DIR/uploads"

    print_success "Uploads restored successfully"
}

# Function to restore configuration
restore_config() {
    local timestamp=$1
    local env_file="$BACKUP_DIR/env_${timestamp}.backup"

    if [ ! -f "$env_file" ]; then
        print_warning "Configuration backup not found: $env_file"
        print_info "Keeping current .env file..."
        return 0
    fi

    print_info "Configuration backup found"
    read -p "Do you want to restore the .env configuration? (yes/no): " -r
    echo ""

    if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        # Backup current .env
        if [ -f "$BACKEND_DIR/.env" ]; then
            cp "$BACKEND_DIR/.env" "$BACKEND_DIR/.env.old.$(date +%Y%m%d_%H%M%S)"
        fi

        # Restore .env
        cp "$env_file" "$BACKEND_DIR/.env"
        chmod 600 "$BACKEND_DIR/.env"
        chown www-data:www-data "$BACKEND_DIR/.env"

        print_success "Configuration restored"
    else
        print_info "Keeping current configuration"
    fi
}

# Main script

# If timestamp provided as argument
if [ -n "$1" ]; then
    TIMESTAMP=$1
else
    # List backups and prompt for selection
    list_backups

    print_info "Enter the timestamp of the backup to restore:"
    read -p "Timestamp: " TIMESTAMP

    if [ -z "$TIMESTAMP" ]; then
        print_error "No timestamp provided"
        exit 1
    fi
fi

# Validate timestamp format
if [[ ! $TIMESTAMP =~ ^[0-9]{8}_[0-9]{6}.*$ ]]; then
    print_error "Invalid timestamp format. Expected: YYYYMMDD_HHMMSS"
    print_info "Example: 20250211_143000"
    exit 1
fi

# Check if backup exists
if [ ! -f "$BACKUP_DIR/database_${TIMESTAMP}.sql.gz" ]; then
    print_error "Backup not found: database_${TIMESTAMP}.sql.gz"
    list_backups
    exit 1
fi

# Confirm rollback
confirm_rollback "$TIMESTAMP"

# Create pre-rollback backup
create_pre_rollback_backup

# Stop backend service
print_info "Stopping backend service..."
systemctl stop cp2b-backend
print_success "Backend service stopped"

# Perform rollback
print_info ""
print_info "Starting rollback process..."
print_info ""

# Restore database
restore_database "$TIMESTAMP"

# Restore uploads
restore_uploads "$TIMESTAMP"

# Restore configuration
restore_config "$TIMESTAMP"

# Restart services
print_info ""
print_info "Restarting services..."

systemctl start cp2b-backend
sleep 3

if systemctl is-active --quiet cp2b-backend; then
    print_success "Backend service restarted successfully"
else
    print_error "Backend service failed to start!"
    print_error "Check logs: journalctl -u cp2b-backend -n 50"
    exit 1
fi

systemctl reload apache2
print_success "Apache2 reloaded"

# Verify restoration
print_info ""
print_info "Verifying restoration..."

# Check backend health
if curl -f -s http://localhost:3001/api/health > /dev/null 2>&1; then
    print_success "✓ Backend API is responding"
else
    print_warning "✗ Backend API health check failed"
fi

# Check frontend
if curl -f -s http://localhost/ > /dev/null 2>&1; then
    print_success "✓ Frontend is accessible"
else
    print_warning "✗ Frontend accessibility check failed"
fi

# Display manifest if exists
MANIFEST_FILE="$BACKUP_DIR/manifest_${TIMESTAMP}.txt"
if [ -f "$MANIFEST_FILE" ]; then
    print_info ""
    print_info "Backup manifest:"
    echo ""
    cat "$MANIFEST_FILE"
fi

# Summary
print_info ""
print_success "========================================="
print_success "Rollback completed!"
print_success "========================================="
print_info "Restored from backup: $TIMESTAMP"
print_info ""
print_info "Next steps:"
print_info "1. Test the website in your browser"
print_info "2. Verify all functionality is working"
print_info "3. Check logs: journalctl -u cp2b-backend -f"
print_info "4. If issues persist, check: $MANIFEST_FILE"
print_info ""
print_warning "A pre-rollback backup was created and can be used to undo this rollback if needed"
print_info ""
