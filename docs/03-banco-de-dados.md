# 03 - Banco de Dados

## Visão Geral

Banco de dados PostgreSQL com 11 tabelas principais, gerenciado via Prisma ORM.

## Schema Prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// AUTENTICAÇÃO
// ============================================

model Usuario {
  id            String    @id @default(cuid())
  email         String    @unique
  senhaHash     String    @map("senha_hash")
  nome          String
  role          Role      @default(CLIENTE)
  avatar        String?
  telefone      String?
  ativo         Boolean   @default(true)
  criadoEm      DateTime  @default(now()) @map("criado_em")
  atualizadoEm  DateTime  @updatedAt @map("atualizado_em")

  // Relações
  cliente       Cliente?
  profissional  Profissional?

  @@map("usuarios")
}

enum Role {
  ADMIN
  CLIENTE
  PROFISSIONAL
}

// ============================================
// CLIENTES
// ============================================

model Cliente {
  id            String    @id @default(cuid())
  usuarioId     String    @unique @map("usuario_id")
  cpf           String?   @unique
  dataNasc      DateTime? @map("data_nasc")
  endereco      String?
  cidade        String?
  estado        String?
  cep           String?

  // Relações
  usuario       Usuario   @relation(fields: [usuarioId], references: [id])
  agendamentos  Agendamento[]
  avaliacoes    Avaliacao[]

  @@map("clientes")
}

// ============================================
// PROFISSIONAIS
// ============================================

model Profissional {
  id            String    @id @default(cuid())
  usuarioId     String    @unique @map("usuario_id")
  especialidade String
  bio           String?
  foto          String?
  ativo         Boolean   @default(true)
  criadoEm      DateTime  @default(now()) @map("criado_em")

  // Relações
  usuario       Usuario   @relation(fields: [usuarioId], references: [id])
  servicos      ProfissionalServico[]
  agendamentos  Agendamento[]
  horarios      Horario[]

  @@map("profissionais")
}

// ============================================
// SERVIÇOS
// ============================================

model Servico {
  id            String    @id @default(cuid())
  nome          String
  descricao     String?
  duracaoMin    Int       @map("duracao_min")
  preco         Decimal   @db.Decimal(10, 2)
  imagem        String?
  ativo         Boolean   @default(true)
  categoriaId   String    @map("categoria_id")
  criadoEm      DateTime  @default(now()) @map("criado_em")

  // Relações
  categoria     Categoria @relation(fields: [categoriaId], references: [id])
  profissionais ProfissionalServico[]
  agendamentos  Agendamento[]
  promocoes     Promocao[]

  @@map("servicos")
}

model Categoria {
  id            String    @id @default(cuid())
  nome          String
  icone         String?
  ordem         Int       @default(0)
  ativo         Boolean   @default(true)

  // Relações
  servicos      Servico[]

  @@map("categorias")
}

// Relação N:N Profissional-Serviço
model ProfissionalServico {
  id              String      @id @default(cuid())
  profissionalId  String      @map("profissional_id")
  servicoId       String      @map("servico_id")

  profissional    Profissional @relation(fields: [profissionalId], references: [id])
  servico         Servico      @relation(fields: [servicoId], references: [id])

  @@unique([profissionalId, servicoId])
  @@map("profissionais_servicos")
}

// ============================================
// AGENDAMENTOS
// ============================================

model Agendamento {
  id              String    @id @default(cuid())
  clienteId       String    @map("cliente_id")
  profissionalId  String    @map("profissional_id")
  servicoId       String    @map("servico_id")
  pagamentoId     String?   @map("pagamento_id")
  data            DateTime  @db.Date
  horario         String    // "14:00"
  status          StatusAgendamento @default(PENDENTE)
  observacao      String?
  criadoEm        DateTime  @default(now()) @map("criado_em")
  atualizadoEm    DateTime  @updatedAt @map("atualizado_em")

  // Relações
  cliente         Cliente     @relation(fields: [clienteId], references: [id])
  profissional    Profissional @relation(fields: [profissionalId], references: [id])
  servico         Servico      @relation(fields: [servicoId], references: [id])
  pagamento       Pagamento?
  avaliacao       Avaliacao?

  @@unique([profissionalId, data, horario, status])
  @@map("agendamentos")
}

enum StatusAgendamento {
  PENDENTE
  CONFIRMADO
  CANCELADO
  CONCLUIDO
  NAO_COMPARECEU
}

// ============================================
// HORÁRIOS
// ============================================

model Horario {
  id              String    @id @default(cuid())
  profissionalId  String    @map("profissional_id")
  diaSemana       Int       @map("dia_semana") // 0=Domingo, 6=Sábado
  horaInicio      String    @map("hora_inicio") // "08:00"
  horaFim         String    @map("hora_fim") // "18:00"
  ativo           Boolean   @default(true)

  // Relações
  profissional    Profissional @relation(fields: [profissionalId], references: [id])

  @@unique([profissionalId, diaSemana, horaInicio])
  @@map("horarios")
}

// ============================================
// PAGAMENTOS
// ============================================

model Pagamento {
  id              String    @id @default(cuid())
  agendamentoId   String    @unique @map("agendamento_id")
  metodo          MetodoPagamento
  valor           Decimal   @db.Decimal(10, 2)
  desconto        Decimal   @default(0) @db.Decimal(10, 2)
  valorFinal      Decimal   @map("valor_final") @db.Decimal(10, 2)
  status          StatusPagamento @default(PENDENTE)
  transacaoId     String?   @map("transacao_id")
  criadoEm        DateTime  @default(now()) @map("criado_em")

  // Relações
  agendamento     Agendamento @relation(fields: [agendamentoId], references: [id])

  @@map("pagamentos")
}

enum MetodoPagamento {
  PIX
  CARTAO_CREDITO
  CARTAO_DEBITO
}

enum StatusPagamento {
  PENDENTE
  PAGO
  REEMBOLSADO
  FALHOU
}

// ============================================
// PROMOÇÕES (Fase 2)
// ============================================

model Promocao {
  id            String    @id @default(cuid())
  codigo        String    @unique
  descricao     String?
  descontoPct   Decimal   @map("desconto_pct") @db.Decimal(5, 2)
  descontoFixo  Decimal?  @map("desconto_fixo") @db.Decimal(10, 2)
  dataInicio    DateTime  @map("data_inicio")
  dataFim       DateTime  @map("data_fim")
  ativo         Boolean   @default(true)
  criadoEm      DateTime  @default(now()) @map("criado_em")

  // Relações
  servicos      PromocaoServico[]

  @@map("promocoes")
}

model PromocaoServico {
  id          String    @id @default(cuid())
  promocaoId  String    @map("promocao_id")
  servicoId   String    @map("servico_id")

  promocao    Promocao  @relation(fields: [promocaoId], references: [id])
  servico     Servico   @relation(fields: [servicoId], references: [id])

  @@unique([promocaoId, servicoId])
  @@map("promocoes_servicos")
}

// ============================================
// AVALIAÇÕES
// ============================================

model Avaliacao {
  id              String    @id @default(cuid())
  agendamentoId   String    @unique @map("agendamento_id")
  clienteId       String    @map("cliente_id")
  nota            Int       // 1-5
  comentario      String?
  criadoEm        DateTime  @default(now()) @map("criado_em")

  // Relações
  agendamento     Agendamento @relation(fields: [agendamentoId], references: [id])
  cliente         Cliente     @relation(fields: [clienteId], references: [id])

  @@map("avaliacoes")
}

// ============================================
// CONFIGURAÇÕES
// ============================================

model Configuracao {
  id            String    @id @default(cuid())
  chave         String    @unique
  valor         String
  descricao     String?
  atualizadoEm  DateTime  @updatedAt @map("atualizado_em")

  @@map("configuracoes")
}
```

## Diagrama ER

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  usuarios   │────<│  clientes   │     │profissionais│
└─────────────┘     └─────────────┘     └──────┬──────┘
      │                                         │
      └────────────────>────────────────────────┘
                                │
                         ┌──────┴──────┐
                         │servicos     │
                         │(via N:N)    │
                         └──────┬──────┘
                                │
                         ┌──────┴──────┐
                         │agendamentos │
                         └──────┬──────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
              ┌─────┴─────┐ ┌──┴──┐ ┌──────┴──────┐
              │pagamentos │ │avali│ │  horarios   │
              └───────────┘ └─────┘ └─────────────┘

              ┌───────────┐
              │promocoes  │
              └─────┬─────┘
                    │
              ┌─────┴─────────┐
              │promocoes_     │
              │servicos (N:N) │
              └───────────────┘
```

## Índices Importantes

```sql
-- Performance para agendamentos
CREATE INDEX idx_agendamentos_data ON agendamentos(data);
CREATE INDEX idx_agendamentos_profissional ON agendamentos(profissional_id);
CREATE INDEX idx_agendamentos_cliente ON agendamentos(cliente_id);
CREATE INDEX idx_agendamentos_status ON agendamentos(status);

-- Horários do profissional
CREATE INDEX idx_horarios_profissional ON horarios(profissional_id, dia_semana);

-- Pagamentos
CREATE INDEX idx_pagamentos_status ON pagamentos(status);
CREATE INDEX idx_pagamentos_criado ON pagamentos(criado_em);
```

## Dados Iniciais (Seed)

```sql
-- Categorias
INSERT INTO categorias (id, nome, icone, ordem) VALUES
  ('cat-1', 'Estética Facial', 'sparkles', 1),
  ('cat-2', 'Estética Corporal', 'heart', 2),
  ('cat-3', 'Fisioterapia', 'activity', 3);

-- Configurações padrão
INSERT INTO configuracoes (chave, valor, descricao) VALUES
  ('nome_clinica', 'Beleza & Bem-Estar', 'Nome da clínica'),
  ('horario_abertura', '08:00', 'Horário de abertura'),
  ('horario_fechamento', '20:00', 'Horário de fechamento'),
  ('dias_funcionamento', '1,2,3,4,5,6', 'Dias da semana (0=Dom)'),
  ('desconto_pix', '5', 'Percentual de desconto PIX'),
  ('antecedencia_cancelamento', '24', 'Horas mínimas para cancelamento');
```
