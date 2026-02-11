#!/bin/bash

# PostgreSQL Setup Script for CP2B Website
# This script sets up the PostgreSQL database for the CP2B project

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
DB_NAME="cp2b"
DB_USER="cp2b"
DB_PASSWORD=""
REPO_DIR="/var/www/cp2b/repo"
SCHEMA_FILE="$REPO_DIR/cp2b_web/backend/src/db/schema.sql"
SEED_FILE="$REPO_DIR/cp2b_web/backend/src/db/seed.sql"
MIGRATIONS_DIR="$REPO_DIR/cp2b_web/backend/src/db/migrations"

print_info "========================================="
print_info "PostgreSQL Setup for CP2B Website"
print_info "========================================="
print_info ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "This script must be run as root or with sudo"
    exit 1
fi

# Step 1: Check if PostgreSQL is installed
print_info "Checking PostgreSQL installation..."
if ! command -v psql &> /dev/null; then
    print_warning "PostgreSQL is not installed. Installing..."

    # Install PostgreSQL
    apt-get update
    apt-get install -y postgresql postgresql-contrib

    # Start and enable PostgreSQL service
    systemctl start postgresql
    systemctl enable postgresql

    print_success "PostgreSQL installed successfully"
else
    print_success "PostgreSQL is already installed"
    psql --version
fi

# Step 2: Generate database password if not provided
if [ -z "$DB_PASSWORD" ]; then
    print_info "Generating secure database password..."
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    print_success "Password generated"
fi

# Step 3: Create database user
print_info "Creating database user '$DB_USER'..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_user WHERE usename = '$DB_USER'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
print_success "Database user created/verified"

# Step 4: Create database
print_info "Creating database '$DB_NAME'..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
print_success "Database created/verified"

# Step 5: Grant privileges
print_info "Granting privileges..."
sudo -u postgres psql -d "$DB_NAME" -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
sudo -u postgres psql -d "$DB_NAME" -c "GRANT ALL ON SCHEMA public TO $DB_USER;"
sudo -u postgres psql -d "$DB_NAME" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;"
sudo -u postgres psql -d "$DB_NAME" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;"
print_success "Privileges granted"

# Step 6: Initialize schema
if [ -f "$SCHEMA_FILE" ]; then
    print_info "Initializing database schema..."
    sudo -u postgres psql -d "$DB_NAME" -f "$SCHEMA_FILE"
    print_success "Schema initialized"
else
    print_warning "Schema file not found: $SCHEMA_FILE"
    print_info "You may need to run schema initialization manually"
fi

# Step 7: Load seed data
if [ -f "$SEED_FILE" ]; then
    print_info "Loading seed data..."
    sudo -u postgres psql -d "$DB_NAME" -f "$SEED_FILE"
    print_success "Seed data loaded"
else
    print_warning "Seed file not found: $SEED_FILE"
    print_info "Skipping seed data..."
fi

# Step 8: Run migrations
if [ -d "$MIGRATIONS_DIR" ]; then
    print_info "Running database migrations..."
    for migration in "$MIGRATIONS_DIR"/*.sql; do
        if [ -f "$migration" ]; then
            print_info "Running migration: $(basename $migration)"
            sudo -u postgres psql -d "$DB_NAME" -f "$migration"
        fi
    done
    print_success "Migrations completed"
else
    print_info "No migrations directory found, skipping..."
fi

# Step 9: Verify database setup
print_info "Verifying database setup..."
TABLE_COUNT=$(sudo -u postgres psql -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
print_info "Found $TABLE_COUNT tables in database"

if [ "$TABLE_COUNT" -gt 0 ]; then
    print_success "Database setup verified"
else
    print_warning "No tables found in database. Schema may not have been initialized."
fi

# Step 10: Configure PostgreSQL for production
print_info "Configuring PostgreSQL for production..."

# Backup original config
PG_CONF=$(sudo -u postgres psql -t -P format=unaligned -c 'SHOW config_file;')
if [ ! -f "${PG_CONF}.backup" ]; then
    cp "$PG_CONF" "${PG_CONF}.backup"
    print_info "Original config backed up to ${PG_CONF}.backup"
fi

# Update max_connections (if needed)
print_info "PostgreSQL configuration file: $PG_CONF"
print_info "Review and adjust settings as needed for your server resources"

# Step 11: Restart PostgreSQL
print_info "Restarting PostgreSQL..."
systemctl restart postgresql
print_success "PostgreSQL restarted"

# Step 12: Display connection information
print_info ""
print_success "========================================="
print_success "Database Setup Complete!"
print_success "========================================="
print_info ""
print_info "Database Connection Information:"
print_info "  Database: $DB_NAME"
print_info "  User: $DB_USER"
print_info "  Password: $DB_PASSWORD"
print_info ""
print_warning "IMPORTANT: Save this password securely!"
print_info ""
print_info "Add this to your backend .env file:"
print_info "  DATABASE_URL=postgres://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
print_info ""
print_info "To connect to the database manually:"
print_info "  psql -U $DB_USER -d $DB_NAME -W"
print_info ""
print_info "To view tables:"
print_info "  psql -U $DB_USER -d $DB_NAME -c '\\dt'"
print_info ""

# Step 13: Create a credentials file
CREDENTIALS_FILE="/var/www/cp2b/db-credentials.txt"
cat > "$CREDENTIALS_FILE" <<EOF
CP2B Database Credentials
Generated: $(date)

Database: $DB_NAME
User: $DB_USER
Password: $DB_PASSWORD

Connection String:
DATABASE_URL=postgres://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME

EOF

chmod 600 "$CREDENTIALS_FILE"
chown www-data:www-data "$CREDENTIALS_FILE"

print_success "Credentials saved to: $CREDENTIALS_FILE"
print_warning "Protect this file! chmod 600 has been applied."
print_info ""
