#!/bin/bash
# Test login with password fix
CSRF_RESP=$(curl -s -c /tmp/c2.txt http://localhost:80/api/auth/csrf)
CSRF_TOKEN=$(echo "$CSRF_RESP" | python3 -c 'import sys,json;print(json.load(sys.stdin)["csrfToken"])')

echo "=== CSRF ==="
echo "$CSRF_TOKEN"

echo ""
echo "=== LOGIN COM PASSWORD ==="
curl -s -b /tmp/c2.txt \
  -X POST "http://localhost:80/api/auth/callback/credentials?redirect=false" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "csrfToken=${CSRF_TOKEN}&email=admin@clinica.com&password=Admin@123" \
  -D /tmp/h2.txt \
  -o /tmp/r2.txt \
  -w "HTTP:%{http_code}" 2>&1
echo ""
echo "=== HEADERS ==="
cat /tmp/h2.txt | head -20
echo ""
echo "=== BODY ==="
cat /tmp/r2.txt | head -5

echo ""
echo "=== SESSION CHECK ==="
curl -s -b /tmp/c2.txt http://localhost:80/api/auth/session | python3 -m json.tool 2>/dev/null || echo "No session"
