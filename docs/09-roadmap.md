# 09 - Roadmap

## Visão Geral

O projeto será desenvolvido em 2 fases principais, com foco em entregar valor progressivamente.

---

## Fase 1 — MVP (4-6 semanas)

### Objetivo
Lançar o sistema básico funcionando com agendamento, pagamentos e painel administrativo.

### Semana 1-2: Infraestrutura e Configuração
| Tarefa | Status |
|--------|--------|
| Configurar servidor (Docker, Nginx) | ⬜ |
| Criar projeto Next.js | ⬜ |
| Configurar Prisma + PostgreSQL | ⬜ |
| Configurar Auth.js | ⬜ |
| Configurar Tailwind + shadcn/ui | ⬜ |
| Definir paleta de cores | ⬜ |
| Criar componentes base (Button, Card, Input) | ⬜ |
| Configurar ESLint + Prettier | ⬜ |

### Semana 3-4: Landing Page e Fluxo do Cliente
| Tarefa | Status |
|--------|--------|
| Criar layout público (header + footer) | ⬜ |
| Implementar Landing Page completa | ⬜ |
| Criar página de serviços | ⬜ |
| Criar página de profissionais | ⬜ |
| Implementar fluxo de agendamento (3 passos) | ⬜ |
| Criar calendário de seleção | ⬜ |
| Criar grid de horários | ⬜ |
| Implementar resumo do agendamento | ⬜ |
| Integrar formulário de pagamento | ⬜ |
| Criar página de confirmação | ⬜ |

### Semana 5-6: Painel Administrativo
| Tarefa | Status |
|--------|--------|
| Criar layout admin (sidebar) | ⬜ |
| Implementar Dashboard com KPIs | ⬜ |
| Criar CRUD de serviços | ⬜ |
| Criar CRUD de categorias | ⬜ |
| Criar CRUD de profissionais | ⬜ |
| Criar lista de clientes | ⬜ |
| Implementar gerenciamento de horários | ⬜ |
| Criar calendário de agendamentos | ⬜ |
| Implementar bloqueios e feriados | ⬜ |
| Criar lista de pagamentos | ⬜ |

### Semana 6: Integrações e Deploy
| Tarefa | Status |
|--------|--------|
| Integrar Mercado Pago (PIX + Cartão) | ⬜ |
| Configurar webhook de pagamento | ⬜ |
| Implementar notificações por e-mail | ⬜ |
| Configurar PWA (manifest + service worker) | ⬜ |
| Testes finais | ⬜ |
| Deploy em produção | ⬜ |

---

## Fase 2 — Expansão (2-3 semanas)

### Objetivo
Adicionar funcionalidades de marketing e fidelização.

### Semana 7-8: Promoções e Fidelidade
| Tarefa | Status |
|--------|--------|
| Criar CRUD de promoções | ⬜ |
| Criar sistema de cupons | ⬜ |
| Implementar desconto automático | ⬜ |
| Criar programa de fidelidade | ⬜ |
| Implementar vale-presente | ⬜ |

### Semana 9: Relatórios e Notificações
| Tarefa | Status |
|--------|--------|
| Criar relatórios financeiros | ⬜ |
| Implementar notificações push | ⬜ |
| Criar central de notificações | ⬜ |
| Melhorar Dashboard com gráficos | ⬜ |

---

## Dependências

### Fase 1
```
Infraestrutura
    ↓
Projeto Next.js
    ↓
Componentes Base
    ↓
Landing Page ─┬─ Fluxo Agendamento
              └─ Painel Admin
    ↓
Integrações
    ↓
Deploy
```

### Fase 2
```
Fase 1 Concluída
    ↓
Promoções ─┬─ Cupons
           └─ Fidelidade
    ↓
Relatórios
    ↓
Notificações
```

## Marcos

| Marco | Data Estimada | Descrição |
|-------|---------------|-----------|
| M1 | Semana 2 | Infraestrutura pronta |
| M2 | Semana 4 | Landing Page + Agendamento |
| M3 | Semana 6 | MVP completo em produção |
| M4 | Semana 8 | Promoções implementadas |
| M5 | Semana 9 | Fase 2 concluída |

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Atraso no deploy | Média | Alto | Configurar infraestrutura desde cedo |
| Integração pagamento | Média | Alto | Testar com sandbox primeiro |
| Design incompatível | Baixa | Médio | Seguir mockups fielmente |
| Performance | Baixa | Médio | Otimizar queries e cache |
| Segurança | Baixa | Alto | Seguir checklist de segurança

## Critérios de Aceite

### Fase 1
- [ ] Landing Page responsiva e funcionando
- [ ] Fluxo de agendamento completo (3 passos)
- [ ] Pagamento via PIX e cartão funcionando
- [ ] Painel admin com todas as funcionalidades
- [ ] Autenticação funcionando (admin + cliente)
- [ ] PWA instalável
- [ ] Deploy em produção com SSL
- [ ] Performance aceitável (LCP < 2.5s)

### Fase 2
- [ ] Promoções e cupons funcionando
- [ ] Programa de fidelidade operacional
- [ ] Relatórios financeiros disponíveis
- [ ] Notificações push enviadas

## Próximos Passos (Após Fase 2)

### Fase 3 — SaaS (futuro, não incluído)
- Multi-tenant
- Sistema de assinatura
- Dashboard para múltiplas clínicas
- API pública
