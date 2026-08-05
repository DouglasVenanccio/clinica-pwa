/**
 * Constantes do projeto Clinica de Estetica e Fisioterapia.
 * Centraliza valores fixos e configuracoes.
 */

// ==================== CORES ====================
export const CORES = {
  // Cores principais
  CREME: "#F5F0E8",
  BRANCO: "#FFFFFF",
  DOURADO: "#C9A96E",
  DOURADO_ESCURO: "#A8893E",
  MARROM: "#5C4A3A",
  SIDEBAR: "#2C2C2C",

  // Cores de status
  SUCESSO: "#4CAF50",
  ALERTA: "#FF9800",
  ERRO: "#E53935",
  INFO: "#2196F3",
} as const;

// ==================== FONTES ====================
export const FONTES = {
  TITULO: "Playfair Display",
  CORPO: "Inter",
} as const;

// ==================== PAPEIS ====================
export const PAPEIS = {
  ADMIN: "ADMIN",
  CLIENTE: "CLIENTE",
  PROFISSIONAL: "PROFISSIONAL",
} as const;

export type Papel = (typeof PAPEIS)[keyof typeof PAPEIS];

// ==================== STATUS ====================
export const STATUS_AGENDAMENTO = {
  PENDENTE: "PENDENTE",
  CONFIRMADO: "CONFIRMADO",
  CANCELADO: "CANCELADO",
  CONCLUIDO: "CONCLUIDO",
  NAO_COMPARECEU: "NAO_COMPARECEU",
} as const;

export const STATUS_PAGAMENTO = {
  PENDENTE: "PENDENTE",
  PAGO: "PAGO",
  FALHOU: "FALHOU",
  ESTORNADO: "ESTORNADO",
} as const;

// ==================== FORMAS DE PAGAMENTO ====================
export const FORMAS_PAGAMENTO = {
  PIX: "PIX",
  CARTAO_CREDITO: "CARTAO_CREDITO",
  CARTAO_DEBITO: "CARTAO_DEBITO",
} as const;

// ==================== CONFIGURACOES ====================
export const CONFIG = {
  // Limites do sistema
  LIMITE_AGENDAMENTOS_POR_DIA: 2,
  LIMITE_TENTATIVAS_PAGAMENTO: 3,
  LIMITE_PONTOS_FIDELIDADE: 100,

  // Descontos
  DESCONTO_PIX_PERCENTUAL: 5,
  MAXIMO_PARCELAS_CARTAO: 3,
  VALOR_MINIMO_PARCELAMENTO: 100,

  // Tempo
  ANTENCIA_MINIMA_AGENDAMENTO_MINUTOS: 60,
  TEMPO_CANCELAMENTO_HORAS: 24,
  DURACAO_QR_CODE_PIX_MINUTOS: 30,
  VALIDADE_PONTOS_MESES: 12,
  VALIDADE_VALE_PRESENTE_DIAS: 90,

  // Horario de funcionamento
  HORA_ABERTURA: 8,
  HORA_FECHAMENTO_SEG_SEX: 20,
  HORA_FECHAMENTO_SABADO: 16,
} as const;

// ==================== NOMES DOS DIAS ====================
export const DIAS_SEMANA = [
  "Domingo",
  "Segunda-feira",
  "Terca-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sabado",
] as const;

// ==================== ROTAS ====================
export const ROTAS = {
  // Publicas
  HOME: "/",
  LOGIN: "/login",
  CADASTRO: "/cadastro",

  // Cliente
  AGENDAR: "/agendar",
  MEUS_AGENDAMENTOS: "/meus-agendamentos",
  PERFIL: "/perfil",

  // Admin
  ADMIN: "/admin",
  ADMIN_AGENDAMENTOS: "/admin/agendamentos",
  ADMIN_CLIENTES: "/admin/clientes",
  ADMIN_SERVICOS: "/admin/servicos",
  ADMIN_PROFISSIONAIS: "/admin/profissionais",
  ADMIN_HORARIOS: "/admin/horarios",
  ADMIN_FINANCEIRO: "/admin/financeiro",
  ADMIN_PROMOCOES: "/admin/promocoes",
  ADMIN_CONFIGURACOES: "/admin/configuracoes",

  // API
  API_AUTH: "/api/auth",
  API_SERVICOS: "/api/servicos",
  API_PROFISSIONAIS: "/api/profissionais",
  API_AGENDAMENTOS: "/api/agendamentos",
  API_PAGAMENTOS: "/api/pagamentos",
  API_CLIENTES: "/api/clientes",
} as const;

// ==================== MENSAGENS ====================
export const MENSAGENS = {
  ERRO_GERAL: "Ocorreu um erro inesperado. Tente novamente.",
  ERRO_AUTENTICACAO: "Email ou senha incorretos.",
  ERRO_PERMISSAO: "Voce nao tem permissao para acessar esta pagina.",
  ERRO_NAO_ENCONTRADO: "Recurso nao encontrado.",
  ERRO_VALIDACAO: "Verifique os dados informados.",
  SUCESSO_CADASTRO: "Cadastro realizado com sucesso!",
  SUCESSO_LOGIN: "Login realizado com sucesso!",
  SUCESSO_AGENDAMENTO: "Agendamento realizado com sucesso!",
  SUCESSO_CANCELAMENTO: "Agendamento cancelado com sucesso!",
  SUCESSO_SALVAR: "Salvo com sucesso!",
  SUCESSO_EXCLUIR: "Excluido com sucesso!",
  CONFIRMACAO_CANCELAMENTO: "Tem certeza que deseja cancelar este agendamento?",
  CONFIRMACAO_EXCLUSAO: "Tem certeza que deseja excluir este item?",
} as const;
