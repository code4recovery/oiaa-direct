#!/bin/bash

# Update MAMP Apache ports to 8200s range

echo "🔧 Updating MAMP Apache Ports"
echo "=============================="
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

APACHE_CONF="/Applications/MAMP/conf/apache/httpd.conf"
APACHE_SSL_CONF="/Applications/MAMP/conf/apache/extra/httpd-ssl.conf"

# Check if files are writable
if [ ! -w "$APACHE_CONF" ]; then
    echo -e "${RED}❌ Cannot write to $APACHE_CONF${NC}"
    echo "Please run: sudo chmod 666 $APACHE_CONF"
    exit 1
fi

echo "📝 Current configuration:"
echo "------------------------"
grep "^Listen" "$APACHE_CONF"
grep "^Listen" "$APACHE_SSL_CONF" 2>/dev/null
echo ""

# Backup
echo "💾 Creating backups..."
cp "$APACHE_CONF" "$APACHE_CONF.pre-port-change.$(date +%Y%m%d_%H%M%S)"
cp "$APACHE_SSL_CONF" "$APACHE_SSL_CONF.pre-port-change.$(date +%Y%m%d_%H%M%S)" 2>/dev/null
echo -e "${GREEN}✓ Backups created${NC}"
echo ""

# Update httpd.conf
echo "🔄 Updating $APACHE_CONF..."
sed -i '' 's/^Listen 8888/Listen 8280/' "$APACHE_CONF"
sed -i '' 's/^Listen 80$/Listen 8280/' "$APACHE_CONF"
echo -e "${GREEN}✓ Updated Listen directive to 8280${NC}"

# Update httpd-ssl.conf
if [ -f "$APACHE_SSL_CONF" ]; then
    echo "🔄 Updating $APACHE_SSL_CONF..."
    sed -i '' 's/^Listen 443/Listen 8290/' "$APACHE_SSL_CONF"
    sed -i '' 's/<VirtualHost _default_:443>/<VirtualHost _default_:8290>/' "$APACHE_SSL_CONF"
    echo -e "${GREEN}✓ Updated SSL Listen directive to 8290${NC}"
fi

echo ""
echo "📝 New configuration:"
echo "--------------------"
grep "^Listen" "$APACHE_CONF"
grep "^Listen" "$APACHE_SSL_CONF" 2>/dev/null
echo ""

echo -e "${GREEN}✅ Port configuration updated!${NC}"
echo ""
echo "Next steps:"
echo "1. In MAMP PRO, click 'Restart' to apply changes"
echo "2. Access your sites at: http://sitename.test:8280"
echo ""
