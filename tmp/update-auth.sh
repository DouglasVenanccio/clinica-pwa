#!/bin/bash
# Remove old NEXTAUTH_URL and update AUTH_URL
TUNNEL_URL=$(sudo journalctl -u cloudflared-tunnel --no-pager 2>/dev/null | grep 'trycloudflare.com' | tail -1 | awk -F'|' '{print $2}' | xargs)
echo "TUNNEL: $TUNNEL_URL"

# Remove old NEXTAUTH_URL line, keep only AUTH_URL
sed -i '/^NEXTAUTH_URL=/d' /home/ubuntu/clinica/.env

# Update AUTH_URL
sed -i "s|^AUTH_URL=.*|AUTH_URL=$TUNNEL_URL|" /home/ubuntu/clinica/.env

# If AUTH_URL line doesn't exist, add it
grep -q '^AUTH_URL=' /home/ubuntu/clinica/.env || echo "AUTH_URL=$TUNNEL_URL" >> /home/ubuntu/clinica/.env

echo "--- Final .env ---"
cat /home/ubuntu/clinica/.env
