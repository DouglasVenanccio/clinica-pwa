# 04 - Fluxos de Uso

## Fluxo do Cliente (Público)

### 1. Acesso à Landing Page
```
Home
├── Header: Logo + Nav + CTA "AGENDAR AGORA"
├── Hero: Título + Diferenciais + CTA + Oferta
├── Serviços: 4 cards com serviços principais
├── Widget de Agendamento Rápido
├── Benefícios: 4 ícones
├── Vale-Presente
├── Depoimentos: 3 cards
└── Footer: Contato + Horário + Newsletter
```

### 2. Fluxo de Agendamento (3 Passos)

#### Passo 1: Escolha do Serviço
```
┌─────────────────────────────────────────────────────────────┐
│  SERVIÇO > DATA E HORÁRIO > CONFIRMAÇÃO                   │
│  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━○  │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐  ┌──────────────────────────────┐
│  1. ESCOLHA SEU SERVIÇO     │  │  RESUMO DO AGENDAMENTO      │
│                              │  │                              │
│  ┌─────────┐ ┌─────────┐    │  │  [Imagem]                    │
│  │ Limpeza │ │ Massagem│    │  │                              │
│  │  Pele ✓ │ │Relaxante│    │  │  Serviço: Limpeza de Pele   │
│  │ 60min   │ │ 60min   │    │  │  Duração: 60 minutos        │
│  │ R$150   │ │ R$150   │    │  │                              │
│  └─────────┘ └─────────┘    │  │  Profissional: Juliana A.   │
│                              │  │                              │
│  ┌─────────┐ ┌─────────┐    │  │  Preço: R$ 150,00           │
│  │Ventosa- │ │Fisio-   │    │  │                              │
│  │terapia  │ │terapia  │    │  │  💳 Pague via PIX e ganhe   │
│  │ 45min   │ │ 50min   │    │  │     5% de desconto!         │
│  │ R$150   │ │ R$150   │    │  │                              │
│  └─────────┘ └─────────┘    │  │  Subtotal:    R$ 150,00     │
│                              │  │  Desconto PIX: - R$ 7,50    │
│  ┌─────────┐                │  │  Total:       R$ 142,50     │
│  │ Outros  │                │  │                              │
│  │Serviços │                │  │  🔒 Seus dados estão         │
│  │VER TODOS│                │  │     protegidos               │
│  └─────────┘                │  └──────────────────────────────┘
└──────────────────────────────┘
```

#### Passo 2: Escolha do Profissional + Data/Horário
```
┌──────────────────────────────┐
│  2. ESCOLHA A PROCIÃO       │
│  (OPCIONAL)                  │
│                              │
│  ┌─────┐ ┌─────┐ ┌─────┐   │
│  │Julia│ │Carla│ │Indif│   │
│  │na A.│ │ S.  │ │erente│  │
│  │⭐⭐⭐⭐│ │⭐⭐⭐⭐⭐│ │     │   │
│  │(32) │ │(28) │ │     │   │
│  └─────┘ └─────┘ └─────┘   │
└──────────────────────────────┘

┌──────────────────────────────┐
│  3. ESCOLHA A DATA E HORÁRIO│
│                              │
│  ┌─────────────────────┐    │
│  │ < AGOSTO 2025 >     │    │
│  │ DOM SEG TER QUA QUI │    │
│  │     1   2   3   4   │    │
│  │ 5   6   7   8   9   │    │
│  │ 10  11  12  13  14  │    │
│  └─────────────────────┘    │
│                              │
│  HORÁRIOS DISPONÍVEIS       │
│  ┌───┐ ┌───┐ ┌───┐        │
│  │08:│ │09:│ │10:│        │
│  │00 │ │00 │ │00 │        │
│  └───┘ └───┘ └───┘        │
│  ┌───┐ ┌───┐ ┌───┐        │
│  │14:│ │15:│ │16:│        │
│  │00✓│ │00 │ │00 │        │
│  └───┘ └───┘ └───┘        │
└──────────────────────────────┘
```

#### Passo 3: Confirmação e Pagamento
```
┌──────────────────────────────┐
│  CONFIRME SEUS DADOS        │
│                              │
│  Serviço: Limpeza de Pele   │
│  Profissional: Juliana A.   │
│  Data: 06/08/2025           │
│  Horário: 14:00             │
│  Duração: 60 minutos        │
│                              │
│  [← VOLTAR E EDITAR]        │
└──────────────────────────────┘

┌──────────────────────────────┐
│  ESCOLHA A FORMA DE PAGAMENTO│
│                              │
│  ┌────────────────────────┐ │
│  │ 💳 PIX - 5% desconto  │ │
│  │    R$ 142,50           │ │
│  └────────────────────────┘ │
│  ┌────────────────────────┐ │
│  │ 💳 Cartão de Crédito  │ │
│  │    R$ 150,00           │ │
│  └────────────────────────┘ │
│  ┌────────────────────────┐ │
│  │ 💳 Cartão de Débito   │ │
│  │    R$ 150,00           │ │
│  └────────────────────────┘ │
│                              │
│  🔒 Ambiente 100% seguro    │
│                              │
│  [CONFIRMAR AGENDAMENTO]    │
└──────────────────────────────┘
```

---

## Fluxo do Administrador

### 1. Login
```
┌──────────────────────────────┐
│  LOGIN ADMIN                 │
│                              │
│  E-mail: _______________    │
│  Senha:  _______________    │
│                              │
│  [ENTRAR]                    │
│                              │
│  Esqueceu a senha?           │
└──────────────────────────────┘
```

### 2. Dashboard
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                         │
│  │48    │ │162   │ │R$7.842│ │56    │                         │
│  │Agend.│ │Client│ │Fat.  │ │Serviç│                         │
│  │+12%  │ │+8%   │ │+18%  │ │+10%  │                         │
│  └──────┘ └──────┘ └──────┘ └──────┘                         │
├─────────────────────────────────────────────────────────────────┤
│  AGENDAMENTOS RECENTES                                         │
│  Todos | Confirmados | Pendentes | Cancelados                  │
│  ┌──────┬──────┬─────────┬─────────┬──────────┬──────┐       │
│  │ Data │ Hora │ Serviço │ Cliente │Prof.     │Status│       │
│  ├──────┼──────┼─────────┼─────────┼──────────┼──────┤       │
│  │06/08 │14:00 │Limpeza  │Juliana  │Juliana A.│ ✅   │       │
│  │06/08 │15:30 │Massagem │Carlos   │Carla S.  │ ✅   │       │
│  └──────┴──────┴─────────┴─────────┴──────────┴──────┘       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐                     │
│  │ CALENDÁRIO GERAL│  │ GERENCIAR       │                     │
│  │                 │  │ HORÁRIOS        │                     │
│  │  AGOSTO 2025    │  │ 06/08/2025      │                     │
│  │  [Calendário]   │  │ [Grid horários] │                     │
│  └─────────────────┘  └─────────────────┘                     │
├─────────────────────────────────────────────────────────────────┤
│  PRÓXIMOS AGENDAMENTOS  │  AÇÕES RÁPIDAS                      │
│  ┌──────────────────┐   │  ┌─────┐ ┌─────┐ ┌─────┐          │
│  │ 08:00 Limpeza    │   │  │Novo │ │Bloq.│ │Cadastr│         │
│  │ 09:30 Massagem   │   │  │Agend│ │Horár│ │Serv.  │         │
│  │ 11:00 Fisio      │   │  └─────┘ └─────┘ └─────┘          │
│  └──────────────────┘   │  ┌─────┐ ┌─────┐ ┌─────┐          │
│                          │  │Cadastr│ │Adic.│ │Enviar│         │
│                          │  │Prof.  │ │Prom.│ │Notif.│         │
│                          │  └─────┘ └─────┘ └─────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Sub-Seções do Admin

#### Agenda
- Calendário mensal/semanal/diário
- Visualização por profissional
- Bloqueio de horários
- Feriados

#### Serviços
- CRUD de serviços
- Categorias
- Preços e durações
- Imagens

#### Profissionais
- CRUD de profissionais
- Especialidade
- Horários de funcionamento
- Serviços que realiza

#### Clientes
- Lista de clientes
- Detalhes e histórico
- Bloqueio de usuários

#### Pagamentos
- Lista de transações
- Filtros por status
- Detalhes do pagamento

#### Promoções (Fase 2)
- CRUD de promoções
- Cupons de desconto
- Regras de uso

---

## Fluxo de Pagamento

### PIX
```
1. Cliente escolhe PIX
2. Desconto 5% aplicado automaticamente
3. QR Code gerado
4. Cliente paga
5. Webhook confirma
6. Agendamento confirmado
7. Confirmação enviada
```

### Cartão
```
1. Cliente escolhe Cartão
2. Redirecionado para gateway
3. Dados do cartão coletados
4. Pagamento processado
5. Webhook confirma
6. Agendamento confirmado
7. Confirmação enviada
```

---

## Fluxo de Notificações

### Lembrete de Agendamento
```
24h antes:
  → WhatsApp: "Olá! Lembre-se do seu agendamento amanhã..."
  → E-mail: "Lembrete: Agendamento confirmado"

1h antes:
  → WhatsApp: "Seu agendamento é em 1 hora..."
```

### Confirmação
```
Ao agendar:
  → WhatsApp: "Agendamento confirmado! Serviço: X, Data: Y..."
  → E-mail: "Confirmação do agendamento"
```

### Cancelamento
```
Ao cancelar:
  → WhatsApp: "Seu agendamento foi cancelado..."
  → E-mail: "Cancelamento confirmado"
```
