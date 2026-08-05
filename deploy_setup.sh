#!/bin/bash
set -e

echo "=== Criando swap 2GB ==="
if [ ! -f /swapfile ]; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
  echo "Swap criado"
else
  echo "Swap ja existe"
fi
sudo swapon --show
free -h

echo "=== Clonando repositorio ==="
cd /home/ubuntu
if [ -d "clinica" ]; then
  rm -rf clinica
fi
git clone https://github.com/DouglasVenanccio/clinica-pwa.git clinica
cd clinica

echo "=== Criando .env ==="
cat > .env << 'ENVEOF'
DATABASE_URL="postgresql://clinica:clinica123@db:5432/clinica_pwa?schema=public"
NEXTAUTH_SECRET="clinica-beleza-bem-estar-secret-2024-prod"
NEXTAUTH_URL="http://136.248.114.169"
NODE_ENV="production"
ENVEOF

echo "=== Instalando dependencias ==="
npm install --production=false

echo "=== Gerando Prisma Client ==="
npx prisma generate

echo "=== Build da aplicacao ==="
npm run build

echo "=== Setup concluido com sucesso ==="
