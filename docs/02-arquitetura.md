# 02 - Arquitetura do Sistema

## Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (PWA)                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Landing   │  │ Agendamento │  │   Cliente   │            │
│  │    Page     │  │   (3 passos)│  │  (Perfil)   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS (App Router)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Server    │  │   Server    │  │   Route     │            │
│  │  Components │  │   Actions   │  │  Handlers   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        PRISMA ORM                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Schema    │  │  Migrations │  │   Client    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      POSTGRESQL                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Tables    │  │   Indexes   │  │   RLS       │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

## Serviços Externos

```
┌─────────────────────────────────────────────────────────────────┐
│                    SERVIÇOS EXTERNOS                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  WhatsApp   │  │   E-mail    │  │  Pagamento  │            │
│  │  (Twilio)   │  │  (Resend)   │  │ (Mercado    │            │
│  │             │  │             │  │   Pago)     │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

## Camadas da Aplicação

### 1. Apresentação (Frontend)
- **Componentes React** com Server Components
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes base
- **PWA** com service worker

### 2. Lógica de Negócio (Backend)
- **Server Actions** para mutações
- **Route Handlers** para APIs externas
- **Validação** com Zod
- **Autenticação** com Auth.js

### 3. Persistência (Database)
- **Prisma ORM** para queries
- **PostgreSQL** para armazenamento
- **Migrations** para versionamento do schema

### 4. Infraestrutura
- **Docker** para containerização
- **Nginx** como proxy reverso
- **Cloudflare** para CDN/SSL

## Fluxo de Requisição

```
1. Cliente faz requisição (fetch/form)
         │
2. Next.js Router analisa rota
         │
3. Middleware verifica auth (se necessário)
         │
4. Server Component ou Server Action processa
         │
5. Prisma executa query no PostgreSQL
         │
6. Resposta retornada ao cliente
         │
7. React atualiza DOM (se Client Component)
```

## Fluxo de Pagamento

```
1. Cliente seleciona serviço → profissional → data/horário
         │
2. Escolhe forma de pagamento (PIX ou Cartão)
         │
3. Server Action cria registro "pendente"
         │
4. Redireciona para gateway de pagamento
         │
5. Webhook confirma pagamento
         │
6. Atualiza status do agendamento
         │
7. Envia confirmação (WhatsApp/E-mail)
```

## Segurança

### Autenticação
- JWT tokens via Auth.js
- Sessões HttpOnly
- CSRF protection nativa do Next.js

### Autorização
- Middleware protege rotas
- Server-side validation
- Role-based access (admin/cliente)

### Dados
- HTTPS obrigatório (Cloudflare)
- Rate limiting nas APIs
- Validação de entrada com Zod
- Hash de senhas (bcrypt)

## Escalabilidade

### Fase 1 (Atual)
- Servidor único (Oracle Cloud)
- PostgreSQL local
- Docker Compose

### Fase 2 (Futuro)
- Load balancer (Nginx)
- Database replication
- CDN para assets estáticos

### Fase 3 (SaaS - não incluído)
- Multi-tenant
- Kubernetes
- Database per tenant
