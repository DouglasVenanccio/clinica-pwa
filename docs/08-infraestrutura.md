# 08 - Infraestrutura

## Servidor

### Oracle Cloud (Produção)
| Recurso | Valor |
|---------|-------|
| **OS** | Ubuntu 24.04 |
| **RAM** | 1GB |
| **Disco** | 45GB |
| **IP** | 136.248.114.169 |
| **User** | ubuntu |

### Especificações
- Servidor otimizado para aplicações leves
- Docker + Docker Compose para containerização
- Nginx como proxy reverso
- Cloudflare para DNS, CDN e SSL

## Docker

### docker-compose.yml

```yaml
version: "3.8"

services:
  # ============================================
  # Aplicação Next.js
  # ============================================
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: clinica-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://clinica:clinica123@postgres:5432/clinica
      - AUTH_SECRET=${AUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - MERCADO_PAGO_ACCESS_TOKEN=${MERCADO_PAGO_ACCESS_TOKEN}
      - RESEND_API_KEY=${RESEND_API_KEY}
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./public:/app/public
    networks:
      - clinica-network

  # ============================================
  # PostgreSQL
  # ============================================
  postgres:
    image: postgres:16-alpine
    container_name: clinica-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_DB=clinica
      - POSTGRES_USER=clinica
      - POSTGRES_PASSWORD=clinica123
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U clinica"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - clinica-network

  # ============================================
  # Nginx (Proxy Reverso)
  # ============================================
  nginx:
    image: nginx:alpine
    container_name: clinica-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    depends_on:
      - app
    networks:
      - clinica-network

  # ============================================
  # Certbot (SSL Let's Encrypt - opcional)
  # ============================================
  certbot:
    image: certbot/certbot
    container_name: clinica-certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

volumes:
  postgres-data:

networks:
  clinica-network:
    driver: bridge
```

### Dockerfile

```dockerfile
# ============================================
# Stage 1: Build
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependências
COPY package*.json ./
RUN npm ci

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# ============================================
# Stage 2: Production
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

# Variáveis de ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar dependências necessárias
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Criar diretório de uploads
RUN mkdir -p /app/uploads && chown -R nextjs:nodejs /app/uploads

# Usuário não-root
USER nextjs

# Porta
EXPOSE 3000

# Comando
CMD ["node", "server.js"]
```

## Nginx

### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    # Configurações gerais
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logs
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Compressão gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    # Upstream Next.js
    upstream nextjs {
        server app:3000;
    }

    # Servidor HTTP (redireciona para HTTPS)
    server {
        listen 80;
        server_name _;

        # Certbot challenge
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        # Redirecionar para HTTPS
        location / {
            return 301 https://$host$request_uri;
        }
    }

    # Servidor HTTPS
    server {
        listen 443 ssl http2;
        server_name clinica.com.br;

        # SSL (Let's Encrypt)
        ssl_certificate /etc/letsencrypt/live/clinica.com.br/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/clinica.com.br/privkey.pem;

        # Configurações SSL
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;

        # Headers de segurança
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

        # Upload de arquivos
        client_max_body_size 10M;

        # Static files
        location /_next/static/ {
            proxy_pass http://nextjs;
            proxy_cache_valid 200 365d;
            add_header Cache-Control "public, max-age=31536000, immutable";
        }

        # Imagens e ícones
        location /public/ {
            proxy_pass http://nextjs;
            proxy_cache_valid 200 30d;
        }

        # API routes com rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://nextjs;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Tudo o resto
        location / {
            proxy_pass http://nextjs;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
```

## Cloudflare

### Configuração DNS
| Tipo | Nome | Valor | Proxy |
|------|------|-------|-------|
| A | @ | 136.248.114.169 | ✅ |
| CNAME | www | clinica.com.br | ✅ |

### Configurações Recomendadas
- **SSL/TLS:** Full (Strict)
- **Always Use HTTPS:** On
- **Auto Minify:** HTML, CSS, JS
- **Brotli:** On
- **Early Hints:** On
- **Cache Level:** Standard
- **Browser Cache TTL:** 1 month

## Deploy

### Scripts de Deploy

```bash
#!/bin/bash
# scripts/deploy.sh

echo "🚀 Iniciando deploy..."

# Pull das últimas mudanças
git pull origin main

# Build e reiniciar containers
docker compose down
docker compose build --no-cache
docker compose up -d

# Aguardar containers iniciarem
sleep 10

# Executar migrations
docker compose exec app npx prisma migrate deploy

# Verificar status
docker compose ps

echo "✅ Deploy concluído!"
```

### Deploy com GitHub Actions (opcional)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ubuntu
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /home/ubuntu/clinica
            ./scripts/deploy.sh
```

## Comandos Úteis

### Docker
```bash
# Iniciar containers
docker compose up -d

# Parar containers
docker compose down

# Ver logs
docker compose logs -f app

# Reiniciar app
docker compose restart app

# Acessar terminal do app
docker compose exec app sh

# Acessar PostgreSQL
docker compose exec postgres psql -U clinica -d clinica
```

### Prisma
```bash
# Gerar Prisma Client
docker compose exec app npx prisma generate

# Criar migration
docker compose exec app npx prisma migrate dev --name nome_da_migration

# Aplicar migrations
docker compose exec app npx prisma migrate deploy

# Resetar banco
docker compose exec app npx prisma migrate reset

# Abrir Prisma Studio
docker compose exec app npx prisma studio
```

### Monitoramento
```bash
# Ver uso de recursos
docker stats

# Ver status dos containers
docker compose ps

# Ver logs de erro
docker compose logs --tail=100 app
```

## Backup

### Backup Automático

```bash
#!/bin/bash
# scripts/backup-db.sh

DATE=$(date +%Y-%m-%d_%H-%M)
BACKUP_DIR="/home/ubuntu/backups"
CONTAINER="clinica-postgres"

# Criar diretório se não existir
mkdir -p $BACKUP_DIR

# Backup do banco
docker exec $CONTAINER pg_dump -U clinica clinica | gzip > "$BACKUP_DIR/backup_$DATE.sql.gz"

# Manter apenas últimos 7 dias
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup concluído: backup_$DATE.sql.gz"
```

### Cron Job
```bash
# Adicionar ao crontab (todo dia às 2h)
crontab -e
0 2 * * * /home/ubuntu/scripts/backup-db.sh
```
