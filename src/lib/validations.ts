import { z } from "zod";

/**
 * Schemas de validacao com Zod.
 * Utilizados em forms e server actions para garantir dados validos.
 */

// ==================== AUTENTICACAO ====================

/** Schema para login */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email e obrigatorio")
    .email("Email invalido"),
  senha: z
    .string()
    .min(1, "Senha e obrigatoria")
    .min(8, "Senha deve ter no minimo 8 caracteres"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/** Schema para cadastro de cliente */
export const cadastroSchema = z
  .object({
    nome: z
      .string()
      .min(1, "Nome e obrigatorio")
      .min(3, "Nome deve ter no minimo 3 caracteres")
      .max(100, "Nome deve ter no maximo 100 caracteres"),
    email: z
      .string()
      .min(1, "Email e obrigatorio")
      .email("Email invalido"),
    telefone: z
      .string()
      .min(1, "Telefone e obrigatorio")
      .min(10, "Telefone invalido")
      .max(11, "Telefone invalido"),
    cpf: z.string().optional(),
    senha: z
      .string()
      .min(1, "Senha e obrigatoria")
      .min(8, "Senha deve ter no minimo 8 caracteres")
      .regex(/[A-Z]/, "Senha deve conter pelo menos 1 letra maiuscula")
      .regex(/[0-9]/, "Senha deve conter pelo menos 1 numero"),
    confirmarSenha: z.string().min(1, "Confirmacao de senha e obrigatoria"),
    aceitarTermos: z.literal(true, {
      errorMap: () => ({ message: "Voce deve aceitar os termos de uso" }),
    }),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas nao conferem",
    path: ["confirmarSenha"],
  });

export type CadastroInput = z.infer<typeof cadastroSchema>;

// ==================== PERFIL ====================

/** Schema para atualizacao de perfil */
export const perfilSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome e obrigatorio")
    .min(3, "Nome deve ter no minimo 3 caracteres")
    .max(100, "Nome deve ter no maximo 100 caracteres"),
  email: z
    .string()
    .min(1, "Email e obrigatorio")
    .email("Email invalido"),
  telefone: z
    .string()
    .min(1, "Telefone e obrigatorio")
    .min(10, "Telefone invalido")
    .max(11, "Telefone invalido"),
  cpf: z.string().optional(),
  dataNascimento: z.string().optional(),
});

export type PerfilInput = z.infer<typeof perfilSchema>;

/** Schema para alteracao de senha */
export const alterarSenhaSchema = z
  .object({
    senhaAtual: z.string().min(1, "Senha atual e obrigatoria"),
    novaSenha: z
      .string()
      .min(1, "Nova senha e obrigatoria")
      .min(8, "Senha deve ter no minimo 8 caracteres")
      .regex(/[A-Z]/, "Senha deve conter pelo menos 1 letra maiuscula")
      .regex(/[0-9]/, "Senha deve conter pelo menos 1 numero"),
    confirmarNovaSenha: z.string().min(1, "Confirmacao de senha e obrigatoria"),
  })
  .refine((data) => data.novaSenha === data.confirmarNovaSenha, {
    message: "As senhas nao conferem",
    path: ["confirmarNovaSenha"],
  });

export type AlterarSenhaInput = z.infer<typeof alterarSenhaSchema>;

// ==================== SERVICOS ====================

/** Schema para criacao/edicao de servico */
export const servicoSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome e obrigatorio")
    .min(3, "Nome deve ter no minimo 3 caracteres")
    .max(150, "Nome deve ter no maximo 150 caracteres"),
  descricao: z.string().optional(),
  duracaoMinutos: z
    .number()
    .min(15, "Duracao minima de 15 minutos")
    .max(480, "Duracao maxima de 8 horas"),
  preco: z
    .number()
    .min(0.01, "Preco deve ser maior que zero"),
  categoriaId: z.string().min(1, "Categoria e obrigatoria"),
  imagem: z.string().url("URL invalida").optional().or(z.literal("")),
  ativo: z.boolean().default(true),
});

export type ServicoInput = z.infer<typeof servicoSchema>;

// ==================== PROFISSIONAIS ====================

/** Schema para criacao/edicao de profissional */
export const profissionalSchema = z.object({
  usuarioId: z.string().min(1, "Usuario e obrigatorio"),
  especialidade: z
    .string()
    .min(1, "Especialidade e obrigatoria")
    .max(100, "Especialidade deve ter no maximo 100 caracteres"),
  bio: z.string().optional(),
  servicos: z
    .array(z.string())
    .min(1, "Selecione pelo menos 1 servico"),
  ativo: z.boolean().default(true),
});

export type ProfissionalInput = z.infer<typeof profissionalSchema>;

// ==================== AGENDAMENTOS ====================

/** Schema para criacao de agendamento */
export const agendamentoSchema = z.object({
  servicoId: z.string().min(1, "Servico e obrigatorio"),
  profissionalId: z.string().optional(),
  data: z.string().min(1, "Data e obrigatoria"),
  horaInicio: z.string().min(1, "Horario e obrigatorio"),
  formaPagamento: z.enum(["PIX", "CARTAO_CREDITO", "CARTAO_DEBITO"], {
    errorMap: () => ({ message: "Forma de pagamento invalida" }),
  }),
  observacoes: z.string().optional(),
});

export type AgendamentoInput = z.infer<typeof agendamentoSchema>;

// ==================== PAGAMENTOS ====================

/** Schema para criacao de pagamento */
export const pagamentoSchema = z.object({
  agendamentoId: z.string().min(1, "Agendamento e obrigatorio"),
  formaPagamento: z.enum(["PIX", "CARTAO_CREDITO", "CARTAO_DEBITO"]),
  // Dados do cartao (quando aplicavel)
  numeroCartao: z.string().optional(),
  nomePortador: z.string().optional(),
  validadeCartao: z.string().optional(),
  cvvCartao: z.string().optional(),
  parcelas: z.number().min(1).max(3).default(1),
});

export type PagamentoInput = z.infer<typeof pagamentoSchema>;

// ==================== CUPONS ====================

/** Schema para validacao de cupom */
export const cupomSchema = z.object({
  codigo: z
    .string()
    .min(1, "Codigo e obrigatorio")
    .toUpperCase(),
});

export type CupomInput = z.infer<typeof cupomSchema>;

// ==================== AVALIACOES ====================

/** Schema para criacao de avaliacao */
export const avaliacaoSchema = z.object({
  agendamentoId: z.string().min(1, "Agendamento e obrigatorio"),
  nota: z
    .number()
    .min(1, "Nota minima de 1")
    .max(5, "Nota maxima de 5"),
  comentario: z.string().optional(),
});

export type AvaliacaoInput = z.infer<typeof avaliacaoSchema>;

// ==================== CONFIGURACOES ====================

/** Schema para configuracoes do sistema */
export const configuracaoSchema = z.object({
  chave: z.string().min(1, "Chave e obrigatoria"),
  valor: z.string().min(1, "Valor e obrigatorio"),
  descricao: z.string().optional(),
});

export type ConfiguracaoInput = z.infer<typeof configuracaoSchema>;
