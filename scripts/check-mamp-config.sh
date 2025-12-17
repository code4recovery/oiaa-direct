#!/bin/bash

# MAMP PRO Configuration Checker
# Verifies ports are set to 8200s range and checks for conflicts

echo "🔍 MAMP PRO Configuration Checker"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if MAMP PRO is installed
if [ ! -d "/Applications/MAMP PRO.app" ] && [ ! -d "/Applications/MAMP" ]; then
    echo -e "${RED}❌ MAMP PRO not found${NC}"
    exit 1
fi

echo "✅ MAMP PRO installation found"
echo ""

# MAMP PRO settings location
MAMP_SETTINGS="$HOME/Library/Application Support/appsolute/MAMP PRO/settings.json"
MAMP_CONF="/Library/Application Support/appsolute/MAMP PRO"

# Check current port settings
echo "📊 Current Port Configuration:"
echo "------------------------------"

if [ -f "$MAMP_SETTINGS" ]; then
    # Extract ports from settings.json
    APACHE_PORT=$(grep -o '"apache_port":[^,]*' "$MAMP_SETTINGS" | grep -o '[0-9]*')
    MYSQL_PORT=$(grep -o '"mysql_port":[^,]*' "$MAMP_SETTINGS" | grep -o '[0-9]*')

    if [ -n "$APACHE_PORT" ]; then
        if [ "$APACHE_PORT" -ge 8200 ] && [ "$APACHE_PORT" -le 8299 ]; then
            echo -e "${GREEN}✓ Apache Port: $APACHE_PORT (in 8200s range)${NC}"
        else
            echo -e "${YELLOW}⚠ Apache Port: $APACHE_PORT (NOT in 8200s range)${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ Apache Port: Not found in settings${NC}"
    fi

    if [ -n "$MYSQL_PORT" ]; then
        if [ "$MYSQL_PORT" -ge 8200 ] && [ "$MYSQL_PORT" -le 8299 ]; then
            echo -e "${GREEN}✓ MySQL Port: $MYSQL_PORT (in 8200s range)${NC}"
        else
            echo -e "${YELLOW}⚠ MySQL Port: $MYSQL_PORT (NOT in 8200s range)${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ MySQL Port: Not found in settings${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Settings file not found: $MAMP_SETTINGS${NC}"
fi

echo ""

# Check for port conflicts
echo "🔍 Checking for Port Conflicts:"
echo "--------------------------------"

check_port() {
    local port=$1
    local service=$2

    if lsof -iTCP:$port -sTCP:LISTEN -n -P > /dev/null 2>&1; then
        local process=$(lsof -iTCP:$port -sTCP:LISTEN -n -P | tail -1 | awk '{print $1}')
        echo -e "${RED}❌ Port $port ($service): IN USE by $process${NC}"
        return 1
    else
        echo -e "${GREEN}✓ Port $port ($service): Available${NC}"
        return 0
    fi
}

# Check recommended ports
check_port 8280 "Apache HTTP"
check_port 8243 "Apache HTTPS"
check_port 8206 "MySQL"

echo ""

# Check if conflicting services are running
echo "🔍 Checking Existing Services:"
echo "-------------------------------"

if lsof -iTCP:80 -sTCP:LISTEN -n -P > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠ Port 80: nginx is running (this is OK - we're avoiding this)${NC}"
fi

if lsof -iTCP:443 -sTCP:LISTEN -n -P > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠ Port 443: nginx is running (this is OK - we're avoiding this)${NC}"
fi

if lsof -iTCP:3306 -sTCP:LISTEN -n -P > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠ Port 3306: MySQL is running (this is OK - we're avoiding this)${NC}"
fi

echo ""

# Check for oiaa-beta virtual host
echo "🔍 Checking for 'oiaa-beta' Virtual Host:"
echo "------------------------------------------"

# MAMP PRO stores vhost configs in multiple places
VHOST_FOUND=false

# Check Apache vhosts
if [ -f "/Applications/MAMP/conf/apache/extra/httpd-vhosts.conf" ]; then
    if grep -q "oiaa-beta" "/Applications/MAMP/conf/apache/extra/httpd-vhosts.conf"; then
        echo -e "${GREEN}✓ Found 'oiaa-beta' in Apache vhosts config${NC}"
        VHOST_FOUND=true

        # Check what port it's configured for
        VHOST_PORT=$(grep -A 10 "oiaa-beta" "/Applications/MAMP/conf/apache/extra/httpd-vhosts.conf" | grep -o "VirtualHost.*:[0-9]*" | grep -o "[0-9]*$" | head -1)
        if [ -n "$VHOST_PORT" ]; then
            if [ "$VHOST_PORT" -ge 8200 ] && [ "$VHOST_PORT" -le 8299 ]; then
                echo -e "${GREEN}  Port configured: $VHOST_PORT (in 8200s range)${NC}"
            else
                echo -e "${YELLOW}  Port configured: $VHOST_PORT (NOT in 8200s - needs update!)${NC}"
            fi
        fi
    fi
fi

if [ "$VHOST_FOUND" = false ]; then
    echo -e "${YELLOW}⚠ 'oiaa-beta' virtual host not found in Apache config${NC}"
    echo "  (This might be normal if you just created it - restart MAMP PRO)"
fi

echo ""

# Recommendations
echo "📋 Recommendations:"
echo "-------------------"

if [ -z "$APACHE_PORT" ] || [ "$APACHE_PORT" -lt 8200 ] || [ "$APACHE_PORT" -gt 8299 ]; then
    echo -e "${YELLOW}1. Update MAMP PRO Apache port to 8280${NC}"
    echo "   → MAMP PRO → Preferences → Ports → Set Apache to 8280"
fi

if [ -z "$MYSQL_PORT" ] || [ "$MYSQL_PORT" -lt 8200 ] || [ "$MYSQL_PORT" -gt 8299 ]; then
    echo -e "${YELLOW}2. Update MAMP PRO MySQL port to 8206${NC}"
    echo "   → MAMP PRO → Preferences → Ports → Set MySQL to 8206"
fi

if [ "$VHOST_FOUND" = false ]; then
    echo -e "${YELLOW}3. Restart MAMP PRO to apply configuration changes${NC}"
fi

echo ""
echo "✅ Check complete!"
echo ""
echo "After updating ports in MAMP PRO:"
echo "  • Access oiaa-beta at: http://oiaa-beta.test:8280"
echo "  • Or: http://localhost:8280/oiaa-beta"
echo ""
