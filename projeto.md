# Projeto PWA - Clínica de Estética e Fisioterapia

## Objetivo
Construir um PWA moderno inspirado nos mockups produzidos anteriormente, com foco em agendamento online, pagamentos, painel administrativo e futura evolução para SaaS.

## Stack
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma ORM
- PostgreSQL
- Auth.js
- Docker
- Nginx
- Cloudflare (DNS/CDN/SSL)
- Mercado Pago ou Asaas (PIX, cartão)

## Arquitetura

Cliente (PWA)
↓
Next.js
↓
API (Route Handlers / Server Actions)
↓
Prisma
↓
PostgreSQL

Serviços externos:
- WhatsApp
- E-mail
- Gateway de pagamento

## Fluxo do Cliente

Home
→ Serviços
→ Escolha do tratamento
→ Profissional
→ Data
→ Horário
→ Pagamento (5% OFF no PIX)
→ Confirmação
→ Lembretes

## Fluxo do Administrador

Login
→ Dashboard
→ Agenda
→ Serviços
→ Profissionais
→ Clientes
→ Horários
→ Promoções
→ Pagamentos
→ Configurações

## Estrutura de Pastas

app/
components/
lib/
prisma/
public/
styles/
types/

## Banco de Dados

usuarios
clientes
profissionais
servicos
categorias
agendamentos
horarios
pagamentos
promocoes
avaliacoes
configuracoes

## Funcionalidades

- Landing Page
- PWA instalável
- Agendamento online
- Calendário
- Bloqueio de horários
- Cadastro de profissionais
- Cadastro de serviços
- PIX com desconto automático
- Painel administrativo
- Histórico de atendimentos
- Notificações

## Segurança

- HTTPS
- JWT/Auth.js
- Hash de senhas
- Rate limit
- Backup diário
- Logs

## Roadmap

Fase 1
- Site
- Agendamento
- Painel Admin
- Pagamentos

Fase 2
- Programa de fidelidade
- Cupons
- Relatórios

Fase 3
- Multi-tenant

# Prompt para IA

Você é um desenvolvedor sênior.

Crie um sistema completo em Next.js utilizando App Router, TypeScript, Tailwind CSS, shadcn/ui e Prisma.

Objetivo:
Desenvolver um PWA para uma clínica de estética e fisioterapia inspirado nos mockups aprovados.

Requisitos:
- Não criar um protótipo; criar código de produção.
- Criar interface premium em tons creme e dourado.
- Responsividade total.
- Landing page, área do cliente e painel administrativo.
- Agendamento com seleção de serviço, profissional, data e horário.
- Pagamento via PIX (5% de desconto) e cartão.
- Dashboard administrativo com gestão de clientes, horários, profissionais e serviços.
- Utilizar componentes reutilizáveis.
- Código limpo, tipado e documentado.
- Sempre mostrar o plano antes de implementar e visualizar cada etapa durante o desenvolvimento.
