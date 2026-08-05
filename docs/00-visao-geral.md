# 00 - Visão Geral do Projeto

## Nome do Projeto
**Clínica de Estética e Fisioterapia - PWA**

## Marca
**Beleza & Bem-Estar** — Estética e Fisioterapia

## Objetivo
Desenvolver um Progressive Web App (PWA) completo para clínicas de estética e fisioterapia, permitindo agendamento online, pagamentos e gestão administrativa. Interface premium inspirada nos mockups aprovados, com paleta em tons creme e dourado.

## Público-Alvo
- **Clientes:** Pessoas que buscam serviços de estética e fisioterapia
- **Administradores:** Gestores de clínicas que precisam gerenciar agendamentos, profissionais e serviços

## Diferenciais
- **PWA instalável:** Experiência nativa sem necessidade de app store
- **Agendamento simplificado:** Fluxo em 3 passos (Serviço → Data/Horário → Pagamento)
- **PIX com desconto:** 5% de desconto automático no pagamento via PIX
- **Interface premium:** Design elegante em tons creme e dourado
- **Dashboard completo:** Painel administrativo com KPIs e gestão completa
- **Notificações:** Lembretes automáticos via WhatsApp e e-mail

## Escopo (Fases 1 e 2)

### Fase 1 — MVP
- Landing Page completa
- Fluxo de agendamento (3 passos)
- Área do cliente (histórico, perfil)
- Painel administrativo completo
- Integração pagamento (PIX + Cartão)
- PWA instalável
- Autenticação (Admin + Cliente)

### Fase 2 — Expansão
- Programa de fidelidade
- Cupons de desconto
- Relatórios financeiros
- Notificações push
- Vale-presente

## Stack Tecnológica
| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 15+ (App Router) |
| UI | shadcn/ui + Tailwind CSS |
| Backend | Server Actions + Route Handlers |
| Banco | PostgreSQL + Prisma ORM |
| Auth | Auth.js (NextAuth) |
| Pagamento | Mercado Pago ou Asaas |
| Deploy | Docker + Nginx |
| CDN/SSL | Cloudflare |

## Referências Visuais
- Mockup Landing Page: `imgs/landing page.png`
- Mockup Agendamento: `imgs/agendamento.png`
- Mockup Painel Admin: `imgs/painel adm.png`

## Status
- [ ] Projeto Book — Concluído
- [ ] Inicialização do Projeto
- [ ] Fase 1 — Em desenvolvimento
- [ ] Fase 2 — Pendente
