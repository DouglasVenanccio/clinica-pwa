#!/bin/bash
set -e

echo "=== Configurando Nginx ==="
sudo cp /home/ubuntu/clinica/nginx-site.conf /etc/nginx/sites-available/clinica
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/clinica /etc/nginx/sites-enabled/clinica
sudo nginx -t
sudo systemctl reload nginx

echo "=== Configurando systemd ==="
sudo cp /home/ubuntu/clinica/clinica-pwa.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable clinica-pwa

echo "=== Iniciando aplicacao ==="
sudo systemctl start clinica-pwa
sleep 3
sudo systemctl status clinica-pwa --no-pager

echo "=== Verificando porta 3000 ==="
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/ || true
echo ""

echo "=== Verificando Nginx ==="
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:80/ || true
echo ""

echo "=== Setup concluido ==="
