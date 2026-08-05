# 05 - Estrutura de Pastas

## Árvore de Diretórios

```
clinica/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Rotas públicas (sem auth)
│   │   ├── layout.tsx            # Layout público (header + footer)
│   │   ├── page.tsx              # Landing Page
│   │   ├── servicos/
│   │   │   └── page.tsx          # Lista de serviços
│   │   ├── profissionais/
│   │   │   └── page.tsx          # Lista de profissionais
│   │   ├── sobre/
│   │   │   └── page.tsx          # Sobre nós
│   │   └── contato/
│   │       └── page.tsx          # Contato
│   │
│   ├── (cliente)/                # Área do cliente (autenticado)
│   │   ├── layout.tsx            # Layout do cliente
│   │   ├── agendar/
│   │   │   └── page.tsx          # Fluxo de agendamento (3 passos)
│   │   ├── meus-agendamentos/
│   │   │   └── page.tsx          # Lista de agendamentos
│   │   ├── perfil/
│   │   │   └── page.tsx          # Dados pessoais
│   │   └── avaliar/
│   │       └── [id]/
│   │           └── page.tsx      # Avaliar atendimento
│   │
│   ├── (admin)/                  # Painel administrativo
│   │   ├── layout.tsx            # Layout admin (sidebar)
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard com KPIs
│   │   ├── agenda/
│   │   │   └── page.tsx          # Calendário de agendamentos
│   │   ├── servicos/
│   │   │   ├── page.tsx          # Lista de serviços
│   │   │   ├── novo/
│   │   │   │   └── page.tsx      # Criar serviço
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Editar serviço
│   │   ├── categorias/
│   │   │   └── page.tsx          # Gerenciar categorias
│   │   ├── profissionais/
│   │   │   ├── page.tsx          # Lista de profissionais
│   │   │   ├── novo/
│   │   │   │   └── page.tsx      # Criar profissional
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Editar profissional
│   │   ├── clientes/
│   │   │   ├── page.tsx          # Lista de clientes
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Detalhes do cliente
│   │   ├── horarios/
│   │   │   └── page.tsx          # Gerenciar horários
│   │   ├── bloqueios/
│   │   │   └── page.tsx          # Bloqueios e feriados
│   │   ├── pagamentos/
│   │   │   └── page.tsx          # Lista de pagamentos
│   │   ├── promocoes/            # Fase 2
│   │   │   ├── page.tsx          # Lista de promoções
│   │   │   └── nova/
│   │   │       └── page.tsx      # Criar promoção
│   │   ├── cupons/               # Fase 2
│   │   │   └── page.tsx          # Gerenciar cupons
│   │   ├── relatorios/           # Fase 2
│   │   │   └── page.tsx          # Relatórios financeiros
│   │   ├── configuracoes/
│   │   │   ├── page.tsx          # Configurações gerais
│   │   │   └── perfil/
│   │   │       └── page.tsx      # Perfil da clínica
│   │   └── notificacoes/
│   │       └── page.tsx          # Central de notificações
│   │
│   ├── (auth)/                   # Autenticação
│   │   ├── layout.tsx            # Layout de auth
│   │   ├── login/
│   │   │   └── page.tsx          # Login
│   │   ├── cadastro/
│   │   │   └── page.tsx          # Cadastro de cliente
│   │   └── esqueci-senha/
│   │       └── page.tsx          # Recuperação de senha
│   │
│   ├── api/                      # Route Handlers
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts      # Auth.js
│   │   ├── agendamentos/
│   │   │   ├── route.ts          # GET/POST agendamentos
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET/PUT/DELETE agendamento
│   │   ├── servicos/
│   │   │   └── route.ts          # CRUD serviços
│   │   ├── profissionais/
│   │   │   └── route.ts          # CRUD profissionais
│   │   ├── clientes/
│   │   │   └── route.ts          # CRUD clientes
│   │   ├── pagamentos/
│   │   │   ├── route.ts          # CRUD pagamentos
│   │   │   └── webhook/
│   │   │       └── route.ts      # Webhook pagamento
│   │   ├── horarios/
│   │   │   └── route.ts          # CRUD horários
│   │   └── upload/
│   │       └── route.ts          # Upload de arquivos
│   │
│   ├── layout.tsx                # Layout raiz
│   ├── page.tsx                  # Redirect para home
│   ├── manifest.ts               # PWA manifest
│   ├── sitemap.ts                # Sitemap
│   └── globals.css               # Estilos globais
│
├── components/                   # Componentes React
│   ├── ui/                       # shadcn/ui (base)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── calendar.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── separator.tsx
│   │   └── ...
│   │
│   ├── landing/                  # Componentes da Landing Page
│   │   ├── header.tsx
│   │   ├── hero.tsx
│   │   ├── servicos.tsx
│   │   ├── beneficios.tsx
│   │   ├── depoimentos.tsx
│   │   ├── vale-presente.tsx
│   │   ├── widget-agendamento.tsx
│   │   └── footer.tsx
│   │
│   ├── agendamento/              # Componentes do Agendamento
│   │   ├── stepper.tsx           # Indicador de progresso
│   │   ├── servico-card.tsx      # Card de serviço
│   │   ├── profissional-card.tsx # Card de profissional
│   │   ├── calendario.tsx        # Calendário de seleção
│   │   ├── horarios.tsx          # Grid de horários
│   │   ├── resumo.tsx            # Resumo do agendamento
│   │   └── pagamento.tsx         # Formas de pagamento
│   │
│   ├── admin/                    # Componentes do Admin
│   │   ├── sidebar.tsx           # Menu lateral
│   │   ├── header.tsx            # Header do admin
│   │   ├── kpi-card.tsx          # Card de KPI
│   │   ├── tabela-agendamentos.tsx
│   │   ├── calendario-admin.tsx
│   │   ├── gerenciar-horarios.tsx
│   │   ├── acoes-rapidas.tsx
│   │   └── atividade-recente.tsx
│   │
│   └── shared/                   # Componentes compartilhados
│       ├── logo.tsx              # Logo da marca
│       ├── theme-toggle.tsx      # Dark/Light mode
│       ├── notification-bell.tsx
│       ├── user-menu.tsx
│       ├── loading.tsx
│       ├── empty-state.tsx
│       └── error-boundary.tsx
│
├── lib/                          # Utilitários e configs
│   ├── prisma.ts                 # Cliente Prisma
│   ├── auth.ts                   # Config Auth.js
│   ├── utils.ts                  # Funções utilitárias
│   ├── validations.ts            # Schemas Zod
│   ├── constants.ts              # Constantes
│   ├── payments.ts               # Integração pagamento
│   ├── notifications.ts          # Notificações
│   └── email.ts                  # Envio de e-mail
│
├── prisma/                       # Banco de dados
│   ├── schema.prisma             # Schema do banco
│   ├── migrations/               # Migrations
│   └── seed.ts                   # Dados iniciais
│
├── public/                       # Assets estáticos
│   ├── icons/                    # Ícones PWA
│   │   ├── icon-192x192.png
│   │   ├── icon-512x512.png
│   │   └── maskable-icon.png
│   ├── images/                   # Imagens
│   │   ├── logo.svg
│   │   ├── hero.jpg
│   │   └── servicos/
│   └── fonts/                    # Fontes
│
├── styles/                       # Estilos (se necessário)
│
├── types/                        # Tipos TypeScript
│   ├── index.ts                  # Tipos gerais
│   ├── agendamento.ts            # Tipos de agendamento
│   ├── pagamento.ts              # Tipos de pagamento
│   └── api.ts                    # Tipos de API
│
├── hooks/                        # Custom hooks
│   ├── use-agendamento.ts
│   ├── use-horarios.ts
│   └── use-auth.ts
│
├── middleware.ts                  # Middleware Next.js
├── next.config.ts                # Configuração Next.js
├── tailwind.config.ts            # Configuração Tailwind
├── tsconfig.json                 # Configuração TypeScript
├── .env.local                    # Variáveis de ambiente
├── .env.example                  # Exemplo de .env
├── docker-compose.yml            # Docker Compose
├── Dockerfile                    # Dockerfile
├── nginx.conf                    # Configuração Nginx
└── package.json                  # Dependências
```

## Convencções de Nomenclatura

### Arquivos
- **Componentes:** `kebab-case.tsx` (ex: `servico-card.tsx`)
- **Utilitários:** `kebab-case.ts` (ex: `validations.ts`)
- **Páginas:** `page.tsx` (padrão Next.js)
- **Layouts:** `layout.tsx` (padrão Next.js)
- **Types:** `camelCase.ts` (ex: `agendamento.ts`)

### Pastas
- **Componentes:** `kebab-case` (ex: `agendamento/`)
- **Rotas:** `kebab-case` (ex: `meus-agendamentos/`)
- **Utilitários:** `kebab-case` (ex: `lib/`)

### Variáveis
- **Variáveis:** `camelCase` (ex: `agendamentoId`)
- **Constantes:** `UPPER_SNAKE_CASE` (ex: `MAX_AGENDAMENTOS`)
- **Types/Interfaces:** `PascalCase` (ex: `Agendamento`)

## Padrões de Importação

```typescript
// 1. React/Next.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 2. Componentes UI
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// 3. Componentes do projeto
import { ServicoCard } from '@/components/agendamento/servico-card'

// 4. Utilitários
import { cn } from '@/lib/utils'
import { agendamentoSchema } from '@/lib/validations'

// 5. Tipos
import type { Agendamento } from '@/types'

// 6. Ícones
import { Calendar, Clock } from 'lucide-react'
```
