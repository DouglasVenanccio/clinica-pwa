# Dockerfile multi-stage para o projeto Next.js
# Etapa 1: Instalar dependencias
FROM node:20-alpine AS deps
WORKDIR /app

# Copiar arquivos de dependencias
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci

# Gerar Prisma Client
RUN npx prisma generate

# Etapa 2: Build da aplicacao
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar dependencias da etapa anterior
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copiar codigo fonte
COPY . .

# Gerar Prisma Client novamente (necessario apos copy)
RUN npx prisma generate

# Build da aplicacao Next.js
RUN npm run build

# Etapa 3: Producao
FROM node:20-alpine AS runner
WORKDIR /app

# Configurar ambiente de producao
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Criar usuario nao-root para seguranca
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessarios para producao
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Criar diretorio necessario
RUN mkdir -p /app/tmp

# Mudar para usuario nao-root
USER nextjs

# Expor porta
EXPOSE 3000

# Variavel de ambiente para porta
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando de inicio
CMD ["node", "server.js"]
