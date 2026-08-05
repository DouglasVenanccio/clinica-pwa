# 07 - Segurança

## Visão Geral

O sistema implementa múltiplas camadas de segurança para proteger dados dos clientes e da clínica.

## Autenticação

### Auth.js (NextAuth v5)

```typescript
// lib/auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        senha: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email }
        })

        if (!user) return null

        const validPassword = await bcrypt.compare(
          credentials.senha,
          user.senhaHash
        )

        if (!validPassword) return null

        return {
          id: user.id,
          email: user.email,
          name: user.nome,
          role: user.role
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      return session
    }
  },
  pages: {
    signIn: "/login"
  }
})
```

### Senhas

```typescript
// Hash de senhas
import bcrypt from "bcryptjs"

const SALT_ROUNDS = 12

export async function hashSenha(senha: string): Promise<string> {
  return bcrypt.hash(senha, SALT_ROUNDS)
}

export async function verificarSenha(
  senha: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(senha, hash)
}
```

## Autorização

### Middleware de Proteção

```typescript
// middleware.ts
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const userRole = req.auth?.user?.role

  // Rotas admin
  if (pathname.startsWith("/admin")) {
    if (!userRole || userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  // Rotas do cliente
  if (pathname.startsWith("/agendar") ||
      pathname.startsWith("/meus-agendamentos") ||
      pathname.startsWith("/perfil")) {
    if (!userRole) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/admin/:path*",
    "/agendar/:path*",
    "/meus-agendamentos/:path*",
    "/perfil/:path*"
  ]
}
```

### Role-Based Access Control

```typescript
// lib/auth.ts
export type Role = "ADMIN" | "CLIENTE" | "PROFISSIONAL"

export function isAdmin(role: Role): boolean {
  return role === "ADMIN"
}

export function isCliente(role: Role): boolean {
  return role === "CLIENTE"
}

export function isProfissional(role: Role): boolean {
  return role === "PROFISSIONAL"
}
```

## Validação de Entrada

### Schemas Zod

```typescript
// lib/validations.ts
import { z } from "zod"

// Validação de login
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres")
})

// Validação de agendamento
export const agendamentoSchema = z.object({
  servicoId: z.string().cuid(),
  profissionalId: z.string().cuid().optional(),
  data: z.string().refine((date) => {
    const selected = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return selected >= today
  }, "Data não pode ser no passado"),
  horario: z.string().regex(/^\d{2}:\d{2}$/, "Horário inválido")
})

// Validação de pagamento
export const pagamentoSchema = z.object({
  agendamentoId: z.string().cuid(),
  metodo: z.enum(["PIX", "CARTAO_CREDITO", "CARTAO_DEBITO"])
})
```

## Proteção CSRF

Next.js fornece proteção CSRF nativa para Server Actions:

```typescript
// Formulário seguro
<form action={serverAction}>
  {/* Next.js adiciona token CSRF automaticamente */}
  <input type="text" name="nome" />
  <button type="submit">Enviar</button>
</form>
```

## Rate Limiting

```typescript
// lib/rate-limit.ts
import { RateLimiterMemory } from "rate-limiter-flexible"

const limiter = new RateLimiterMemory({
  points: 10,        // 10 requisições
  duration: 60       // por minuto
})

export async function rateLimit(key: string): Promise<boolean> {
  try {
    await limiter.consume(key)
    return true
  } catch {
    return false
  }
}

// Uso em API routes
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown"

  if (!await rateLimit(ip)) {
    return NextResponse.json(
      { error: "Muitas requisições" },
      { status: 429 }
    )
  }

  // Processar requisição...
}
```

## Headers de Segurança

```typescript
// next.config.ts
import type { NextConfig } from "next"

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY"
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin"
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block"
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload"
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()"
  }
]

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: "/:path*",
      headers: securityHeaders
    }
  ]
}

export default nextConfig
```

## Proteção de Dados

### Variáveis de Ambiente

```env
# .env.local (NUNCA versionar)
DATABASE_URL="postgresql://..."
AUTH_SECRET="seu-secreto-aqui"
NEXTAUTH_URL="https://seudominio.com"

# Chaves de API
MERCADO_PAGO_ACCESS_TOKEN="..."
RESEND_API_KEY="..."

# Chave de encriptação (Fase 2)
ENCRYPTION_KEY="..."
```

### Exemplo .env.example

```env
# Banco de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/clinica"

# Auth
AUTH_SECRET="generate-a-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Pagamento
MERCADO_PAGO_ACCESS_TOKEN=""

# E-mail
RESEND_API_KEY=""

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""
```

## Backup e Recuperação

### Backup Diário

```bash
#!/bin/bash
# scripts/backup.sh

DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/backups"
DB_NAME="clinica"

# Criar backup
pg_dump $DB_NAME | gzip > "$BACKUP_DIR/backup-$DATE.sql.gz"

# Manter apenas últimos 30 dias
find $BACKUP_DIR -name "backup-*.sql.gz" -mtime +30 -delete

# Enviar para storage externo (opcional)
# aws s3 cp "$BACKUP_DIR/backup-$DATE.sql.gz" s3://bucket/backups/
```

### Cron Job

```bash
# Adicionar ao crontab
0 2 * * * /path/to/scripts/backup.sh
```

## Logs de Auditoria

```typescript
// lib/audit.ts
import { prisma } from "./prisma"

export async function logAudit({
  userId,
  action,
  entity,
  entityId,
  details
}: {
  userId: string
  action: "CREATE" | "UPDATE" | "DELETE"
  entity: string
  entityId: string
  details?: Record<string, unknown>
}) {
  // Implementar tabela de auditoria na Fase 2
  console.log("Audit:", {
    userId,
    action,
    entity,
    entityId,
    details,
    timestamp: new Date().toISOString()
  })
}
```

## Checklist de Segurança

### Infraestrutura
- [ ] HTTPS habilitado (Cloudflare)
- [ ] Firewall configurado
- [ ] SSH com chave (não senha)
- [ ] Portas desnecessárias fechadas
- [ ] Sistema atualizado

### Aplicação
- [ ] Variáveis de ambiente protegidas
- [ ] Rate limiting habilitado
- [ ] Headers de segurança configurados
- [ ] Validação de entrada em todas as rotas
- [ ] Autenticação em todas as rotas protegidas
- [ ] Senhas com hash bcrypt
- [ ] Sessões HttpOnly

### Banco de Dados
- [ ] Backup automático diário
- [ ] Acesso restrito por IP
- [ ] Senha forte
- [ ] Credenciais não versionadas

### Monitoramento
- [ ] Logs de erro habilitados
- [ ] Alertas de segurança
- [ ] Monitoramento de performance
- [ ] Auditoria de ações (Fase 2)
