#!/bin/bash
set -e

echo "=== Instalando Docker ==="
sudo apt-get update -qq
sudo apt-get install -y -qq ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update -qq
sudo apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker ubuntu
sudo systemctl enable docker
sudo systemctl start docker

echo "=== Docker instalado ==="
docker --version
docker compose version

echo "=== Instalando Node.js 22 LTS ==="
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y -qq nodejs
node --version
npm --version

echo "=== Configurando diretorio do projeto ==="
cd /home/ubuntu
if [ -d "clinica" ]; then
  cd clinica
  git pull origin main
else
  git clone https://github.com/DouglasVenanccio/clinica-pwa.git clinica
  cd clinica
fi

echo "=== Criando .env ==="
cat > .env << 'ENVEOF'
DATABASE_URL="postgresql://clinica:clinica123@db:5432/clinica_pwa?schema=public"
NEXTAUTH_SECRET="super-secret-key-change-in-production-2024"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="production"
ENVEOF

echo "=== Setup concluido ==="
