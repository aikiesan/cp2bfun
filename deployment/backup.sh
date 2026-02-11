#!/bin/bash

# CP2B Website Backup Script
# Creates backups of database and uploaded files

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

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
BACKUP_DIR="/var/www/cp2b/backups"
DB_NAME="cp2b"
DB_USER="cp2b"
UPLOAD_DIR="/var/www/cp2b/backend/uploads"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

print_info "========================================="
print_info "CP2B Website Backup"
print_info "========================================="
print_info "Timestamp: $TIMESTAMP"
print_info ""

# 1. Backup PostgreSQL Database
print_info "Backing up PostgreSQL database..."

DB_BACKUP_FILE="$BACKUP_DIR/database_$TIMESTAMP.sql.gz"

sudo -u postgres pg_dump "$DB_NAME" | gzip > "$DB_BACKUP_FILE"

if [ -f "$DB_BACKUP_FILE" ]; then
    DB_SIZE=$(du -h "$DB_BACKUP_FILE" | cut -f1)
    print_success "Database backed up: $DB_BACKUP_FILE ($DB_SIZE)"
else
    print_error "Database backup failed!"
    exit 1
fi

# 2. Backup Uploaded Files
print_info "Backing up uploaded files..."

if [ -d "$UPLOAD_DIR" ]; then
    UPLOAD_BACKUP_FILE="$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz"

    tar -czf "$UPLOAD_BACKUP_FILE" -C "$(dirname $UPLOAD_DIR)" "$(basename $UPLOAD_DIR)" 2>/dev/null || true

    if [ -f "$UPLOAD_BACKUP_FILE" ]; then
        UPLOAD_SIZE=$(du -h "$UPLOAD_BACKUP_FILE" | cut -f1)
        print_success "Uploads backed up: $UPLOAD_BACKUP_FILE ($UPLOAD_SIZE)"
    else
        print_error "Uploads backup failed!"
    fi
else
    print_info "No uploads directory found, skipping..."
fi

# 3. Backup .env file (without exposing secrets in logs)
print_info "Backing up configuration..."

ENV_FILE="/var/www/cp2b/backend/.env"
if [ -f "$ENV_FILE" ]; then
    ENV_BACKUP_FILE="$BACKUP_DIR/env_$TIMESTAMP.backup"
    cp "$ENV_FILE" "$ENV_BACKUP_FILE"
    chmod 600 "$ENV_BACKUP_FILE"
    print_success "Configuration backed up (secured)"
fi

# 4. Create backup manifest
print_info "Creating backup manifest..."

MANIFEST_FILE="$BACKUP_DIR/manifest_$TIMESTAMP.txt"
cat > "$MANIFEST_FILE" <<EOF
CP2B Website Backup Manifest
============================
Backup Date: $(date)
Hostname: $(hostname)

Database Backup:
  File: database_$TIMESTAMP.sql.gz
  Size: $DB_SIZE
  Database: $DB_NAME

Uploads Backup:
  File: uploads_$TIMESTAMP.tar.gz
  Size: ${UPLOAD_SIZE:-N/A}
  Directory: $UPLOAD_DIR

Configuration:
  File: env_$TIMESTAMP.backup
  Source: $ENV_FILE

Restore Instructions:
  Database: gunzip -c database_$TIMESTAMP.sql.gz | sudo -u postgres psql $DB_NAME
  Uploads: tar -xzf uploads_$TIMESTAMP.tar.gz -C /var/www/cp2b/backend/
  Config: cp env_$TIMESTAMP.backup /var/www/cp2b/backend/.env

EOF

print_success "Manifest created: $MANIFEST_FILE"

# 5. Clean up old backups
print_info "Cleaning up old backups (keeping last $RETENTION_DAYS days)..."

find "$BACKUP_DIR" -name "database_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "uploads_*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "env_*.backup" -type f -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "manifest_*.txt" -type f -mtime +$RETENTION_DAYS -delete

BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/database_*.sql.gz 2>/dev/null | wc -l)
print_success "Cleanup complete. $BACKUP_COUNT backup(s) retained."

# 6. Optional: Upload to remote storage
if [ -n "$BACKUP_REMOTE_HOST" ]; then
    print_info "Uploading to remote storage..."

    # Example: rsync to remote server
    # rsync -avz "$DB_BACKUP_FILE" "$BACKUP_REMOTE_HOST:/backups/"
    # rsync -avz "$UPLOAD_BACKUP_FILE" "$BACKUP_REMOTE_HOST:/backups/"

    print_info "Remote upload configured but not implemented. Edit this script to enable."
fi

# 7. Calculate total backup size
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)

print_info ""
print_success "========================================="
print_success "Backup completed successfully!"
print_success "========================================="
print_info "Backup location: $BACKUP_DIR"
print_info "Total backup size: $TOTAL_SIZE"
print_info "Retention period: $RETENTION_DAYS days"
print_info ""
print_info "Files created:"
print_info "  - database_$TIMESTAMP.sql.gz"
print_info "  - uploads_$TIMESTAMP.tar.gz"
print_info "  - env_$TIMESTAMP.backup"
print_info "  - manifest_$TIMESTAMP.txt"
print_info ""
print_info "To restore this backup:"
print_info "  cat $MANIFEST_FILE"
print_info ""
