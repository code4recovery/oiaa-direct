#!/bin/bash

# Fix MAMP PRO Apache duplicate listener issue

echo "🔧 MAMP PRO Apache Configuration Fixer"
echo "======================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Find Apache config
APACHE_CONF="/Applications/MAMP/conf/apache/httpd.conf"
APACHE_SSL_CONF="/Applications/MAMP/conf/apache/extra/httpd-ssl.conf"

if [ ! -f "$APACHE_CONF" ]; then
    echo -e "${RED}❌ Apache config not found at $APACHE_CONF${NC}"
    exit 1
fi

echo "📋 Checking Apache configuration..."
echo ""

# Backup configs
echo "💾 Creating backups..."
cp "$APACHE_CONF" "$APACHE_CONF.backup.$(date +%Y%m%d_%H%M%S)"
if [ -f "$APACHE_SSL_CONF" ]; then
    cp "$APACHE_SSL_CONF" "$APACHE_SSL_CONF.backup.$(date +%Y%m%d_%H%M%S)"
fi
echo -e "${GREEN}✓ Backups created${NC}"
echo ""

# Check for duplicate Listen directives
echo "🔍 Looking for duplicate Listen directives..."
echo ""

LISTEN_COUNT=$(grep -c "^Listen" "$APACHE_CONF" 2>/dev/null || echo 0)
echo "Found $LISTEN_COUNT Listen directives in httpd.conf"

if [ "$LISTEN_COUNT" -gt 1 ]; then
    echo -e "${YELLOW}⚠ Multiple Listen directives found!${NC}"
    echo ""
    echo "Current Listen directives:"
    grep -n "^Listen" "$APACHE_CONF"
    echo ""

    # Show the fix
    echo -e "${YELLOW}To fix this manually:${NC}"
    echo "1. Open: /Applications/MAMP/conf/apache/httpd.conf"
    echo "2. Find all lines starting with 'Listen'"
    echo "3. Keep only ONE: Listen 8280"
    echo "4. Comment out or delete the others"
    echo ""
else
    echo -e "${GREEN}✓ No duplicate Listen directives found in httpd.conf${NC}"
    echo ""
fi

# Check httpd-ssl.conf
if [ -f "$APACHE_SSL_CONF" ]; then
    SSL_LISTEN_COUNT=$(grep -c "^Listen" "$APACHE_SSL_CONF" 2>/dev/null || echo 0)
    echo "Found $SSL_LISTEN_COUNT Listen directives in httpd-ssl.conf"

    if [ "$SSL_LISTEN_COUNT" -gt 0 ]; then
        echo "SSL Listen directives:"
        grep -n "^Listen" "$APACHE_SSL_CONF"
        echo ""
    fi
fi

# Check for port conflicts in VirtualHost definitions
echo "🔍 Checking VirtualHost definitions..."
VHOST_PORTS=$(grep -h "VirtualHost.*:[0-9]" "$APACHE_CONF" /Applications/MAMP/conf/apache/extra/*.conf 2>/dev/null | grep -o ":[0-9]*" | sort -u)

if [ -n "$VHOST_PORTS" ]; then
    echo "VirtualHost ports found:"
    echo "$VHOST_PORTS"
    echo ""
fi

# Suggest fix
echo ""
echo "🔧 Recommended Actions:"
echo "----------------------"
echo ""
echo "1. In MAMP PRO, go to: File → Edit Template → Apache → httpd.conf"
echo "2. Search for: 'Listen' (use Cmd+F)"
echo "3. You should see lines like:"
echo "   Listen 8280"
echo "   Listen 8280  <-- DUPLICATE (remove this)"
echo ""
echo "4. Keep ONLY the first 'Listen 8280' line"
echo "5. Save the file (Cmd+S)"
echo "6. Restart Apache in MAMP PRO"
echo ""
echo "Alternatively, MAMP PRO might be including multiple config files."
echo "Check for 'Include' directives that might load duplicate listeners."
echo ""

# Check Include directives
echo "📁 Checking Include directives..."
INCLUDES=$(grep "^Include" "$APACHE_CONF" | grep -v "^#")
if [ -n "$INCLUDES" ]; then
    echo "Active Include directives:"
    echo "$INCLUDES"
    echo ""
    echo -e "${YELLOW}⚠ Check these included files for duplicate Listen directives${NC}"
fi

echo ""
echo "✅ Check complete!"
echo ""
echo "📝 Note: Backups saved with .backup.TIMESTAMP extension"
