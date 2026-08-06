#!/bin/bash
echo "=== AUTH FLOW TEST ==="

# Step 1: Get CSRF token
CSRF_RESP=$(curl -s -c /tmp/c.txt http://localhost:80/api/auth/csrf)
CSRF_TOKEN=$(echo "$CSRF_RESP" | python3 -c 'import sys,json;print(json.load(sys.stdin)["csrfToken"])')
echo "CSRF Token: $CSRF_TOKEN"

echo "=== CSRF Cookie ==="
cat /tmp/c.txt

# Step 2: Login
echo ""
echo "=== Login POST ==="
curl -s -b /tmp/c.txt \
  -X POST "http://localhost:80/api/auth/callback/credentials" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "csrfToken=${CSRF_TOKEN}&email=admin@clinica.com&password=Admin@123" \
  -D /tmp/headers.txt \
  -o /tmp/login_resp.html \
  -w "HTTP_CODE:%{http_code}" 2>&1
echo ""

echo "=== Response Headers ==="
cat /tmp/headers.txt | head -20

# Step 3: Check session
echo ""
echo "=== Session Check ==="
curl -s -b /tmp/c.txt http://localhost:80/api/auth/session | python3 -m json.tool 2>/dev/null || echo "No session"

# Step 4: Check DB for users
echo ""
echo "=== Users in DB ==="
docker exec clinica-db psql -U clinica -d clinica_pwa -c "SELECT id, email, nome, role FROM usuarios LIMIT 5;" 2>/dev/null
