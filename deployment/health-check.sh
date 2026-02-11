#!/bin/bash

# CP2B Website Health Check Script
# Verifies all services are running correctly

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_pass() {
    echo -e "  ${GREEN}✓${NC} $1"
}

print_fail() {
    echo -e "  ${RED}✗${NC} $1"
}

print_warn() {
    echo -e "  ${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "  ${BLUE}ℹ${NC} $1"
}

# Initialize counters
PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

# Timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

print_header "CP2B Website Health Check - $TIMESTAMP"
echo ""

# 1. Check Backend Service
print_header "1. Backend Service Status"
if systemctl is-active --quiet cp2b-backend; then
    print_pass "Backend service is running"
    ((PASS_COUNT++))

    # Check uptime
    UPTIME=$(systemctl show cp2b-backend -p ActiveEnterTimestamp --value)
    print_info "Running since: $UPTIME"

    # Check for recent restarts
    RESTART_COUNT=$(journalctl -u cp2b-backend --since "1 hour ago" | grep -c "Started CP2B" || echo "0")
    if [ "$RESTART_COUNT" -gt 1 ]; then
        print_warn "Service restarted $RESTART_COUNT times in the last hour"
        ((WARN_COUNT++))
    fi
else
    print_fail "Backend service is NOT running"
    ((FAIL_COUNT++))
    systemctl status cp2b-backend --no-pager -l | head -n 10
fi
echo ""

# 2. Check Backend Health Endpoint
print_header "2. Backend API Health"
BACKEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health 2>/dev/null)

if [ "$BACKEND_RESPONSE" = "200" ]; then
    print_pass "Backend API is responding (HTTP 200)"
    ((PASS_COUNT++))

    # Get health details
    HEALTH_DATA=$(curl -s http://localhost:3001/api/health 2>/dev/null)
    print_info "Response: $HEALTH_DATA"
else
    print_fail "Backend API is NOT responding (HTTP $BACKEND_RESPONSE)"
    ((FAIL_COUNT++))
fi
echo ""

# 3. Check Apache Service
print_header "3. Apache Web Server Status"
if systemctl is-active --quiet apache2; then
    print_pass "Apache2 service is running"
    ((PASS_COUNT++))

    # Check Apache configuration
    if apache2ctl configtest > /dev/null 2>&1; then
        print_pass "Apache configuration is valid"
        ((PASS_COUNT++))
    else
        print_fail "Apache configuration has errors"
        ((FAIL_COUNT++))
        apache2ctl configtest 2>&1 | head -n 5
    fi
else
    print_fail "Apache2 service is NOT running"
    ((FAIL_COUNT++))
fi
echo ""

# 4. Check Frontend Accessibility
print_header "4. Frontend Website Status"
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ 2>/dev/null)

if [ "$FRONTEND_RESPONSE" = "200" ]; then
    print_pass "Frontend is accessible (HTTP 200)"
    ((PASS_COUNT++))
else
    print_fail "Frontend is NOT accessible (HTTP $FRONTEND_RESPONSE)"
    ((FAIL_COUNT++))
fi

# Check if index.html exists
if [ -f /var/www/cp2b/frontend/dist/index.html ]; then
    print_pass "Frontend build files present"
    ((PASS_COUNT++))
else
    print_fail "Frontend build files missing"
    ((FAIL_COUNT++))
fi
echo ""

# 5. Check PostgreSQL Service
print_header "5. PostgreSQL Database Status"
if systemctl is-active --quiet postgresql; then
    print_pass "PostgreSQL service is running"
    ((PASS_COUNT++))

    # Check database connection
    if sudo -u postgres psql -d cp2b -c "SELECT 1;" > /dev/null 2>&1; then
        print_pass "Database 'cp2b' is accessible"
        ((PASS_COUNT++))

        # Get connection count
        CONN_COUNT=$(sudo -u postgres psql -d cp2b -t -c "SELECT count(*) FROM pg_stat_activity WHERE datname='cp2b';" 2>/dev/null | tr -d ' ')
        print_info "Active connections: $CONN_COUNT"

        # Get database size
        DB_SIZE=$(sudo -u postgres psql -d cp2b -t -c "SELECT pg_size_pretty(pg_database_size('cp2b'));" 2>/dev/null | tr -d ' ')
        print_info "Database size: $DB_SIZE"
    else
        print_fail "Cannot connect to database 'cp2b'"
        ((FAIL_COUNT++))
    fi
else
    print_fail "PostgreSQL service is NOT running"
    ((FAIL_COUNT++))
fi
echo ""

# 6. Check Disk Space
print_header "6. Disk Space"
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | tr -d '%')

if [ "$DISK_USAGE" -lt 80 ]; then
    print_pass "Disk usage is healthy ($DISK_USAGE%)"
    ((PASS_COUNT++))
elif [ "$DISK_USAGE" -lt 90 ]; then
    print_warn "Disk usage is high ($DISK_USAGE%)"
    ((WARN_COUNT++))
else
    print_fail "Disk usage is critical ($DISK_USAGE%)"
    ((FAIL_COUNT++))
fi

# Show detailed disk usage
df -h / | tail -n 1
echo ""

# 7. Check Memory Usage
print_header "7. Memory Usage"
MEM_USAGE=$(free | awk '/Mem:/ {printf "%.0f", $3/$2 * 100}')

if [ "$MEM_USAGE" -lt 80 ]; then
    print_pass "Memory usage is healthy ($MEM_USAGE%)"
    ((PASS_COUNT++))
elif [ "$MEM_USAGE" -lt 90 ]; then
    print_warn "Memory usage is high ($MEM_USAGE%)"
    ((WARN_COUNT++))
else
    print_fail "Memory usage is critical ($MEM_USAGE%)"
    ((FAIL_COUNT++))
fi

free -h | grep -E "Mem|Swap"
echo ""

# 8. Check Uploads Directory
print_header "8. Uploads Directory"
if [ -d /var/www/cp2b/backend/uploads ]; then
    print_pass "Uploads directory exists"
    ((PASS_COUNT++))

    # Check permissions
    UPLOAD_PERMS=$(stat -c "%a" /var/www/cp2b/backend/uploads)
    if [ "$UPLOAD_PERMS" = "755" ] || [ "$UPLOAD_PERMS" = "775" ]; then
        print_pass "Uploads directory has correct permissions ($UPLOAD_PERMS)"
        ((PASS_COUNT++))
    else
        print_warn "Uploads directory permissions may be incorrect ($UPLOAD_PERMS)"
        ((WARN_COUNT++))
    fi

    # Check size
    UPLOAD_SIZE=$(du -sh /var/www/cp2b/backend/uploads 2>/dev/null | cut -f1)
    print_info "Uploads directory size: $UPLOAD_SIZE"
else
    print_fail "Uploads directory does not exist"
    ((FAIL_COUNT++))
fi
echo ""

# 9. Check Log Files
print_header "9. Recent Errors in Logs"

# Backend errors
BACKEND_ERRORS=$(journalctl -u cp2b-backend --since "1 hour ago" -p err --no-pager | wc -l)
if [ "$BACKEND_ERRORS" -eq 0 ]; then
    print_pass "No backend errors in the last hour"
    ((PASS_COUNT++))
else
    print_warn "Found $BACKEND_ERRORS error(s) in backend logs"
    ((WARN_COUNT++))
    echo ""
    journalctl -u cp2b-backend --since "1 hour ago" -p err --no-pager | tail -n 5
fi

# Apache errors
if [ -f /var/log/apache2/cp2b-error.log ]; then
    APACHE_ERRORS=$(grep -c "error" /var/log/apache2/cp2b-error.log 2>/dev/null | tail -n 100 || echo "0")
    print_info "Recent Apache errors: check /var/log/apache2/cp2b-error.log"
fi
echo ""

# 10. Check SSL Certificate (if exists)
print_header "10. SSL Certificate Status"
if [ -d /etc/letsencrypt/live ]; then
    CERT_DIR=$(ls -t /etc/letsencrypt/live/ 2>/dev/null | head -n 1)

    if [ -n "$CERT_DIR" ]; then
        CERT_FILE="/etc/letsencrypt/live/$CERT_DIR/cert.pem"

        if [ -f "$CERT_FILE" ]; then
            EXPIRY=$(openssl x509 -enddate -noout -in "$CERT_FILE" | cut -d= -f2)
            EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s)
            NOW_EPOCH=$(date +%s)
            DAYS_UNTIL_EXPIRY=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))

            if [ "$DAYS_UNTIL_EXPIRY" -gt 30 ]; then
                print_pass "SSL certificate valid for $DAYS_UNTIL_EXPIRY days"
                ((PASS_COUNT++))
            elif [ "$DAYS_UNTIL_EXPIRY" -gt 7 ]; then
                print_warn "SSL certificate expires in $DAYS_UNTIL_EXPIRY days"
                ((WARN_COUNT++))
            else
                print_fail "SSL certificate expires in $DAYS_UNTIL_EXPIRY days - RENEW NOW!"
                ((FAIL_COUNT++))
            fi

            print_info "Expires: $EXPIRY"
        fi
    else
        print_info "No SSL certificate found (HTTP only)"
    fi
else
    print_info "No SSL certificate found (HTTP only)"
fi
echo ""

# Summary
print_header "Health Check Summary"
echo ""
echo -e "  ${GREEN}Passed:${NC}  $PASS_COUNT"
echo -e "  ${YELLOW}Warnings:${NC} $WARN_COUNT"
echo -e "  ${RED}Failed:${NC}  $FAIL_COUNT"
echo ""

# Overall status
if [ "$FAIL_COUNT" -eq 0 ]; then
    if [ "$WARN_COUNT" -eq 0 ]; then
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}✓ All systems operational${NC}"
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        exit 0
    else
        echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${YELLOW}⚠ Some warnings detected${NC}"
        echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        exit 1
    fi
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}✗ Critical issues detected - immediate attention required${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 2
fi
