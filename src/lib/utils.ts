import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes CSS com suporte a Tailwind CSS.
 * Resolve conflitos de classes e merge intelligente.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata um valor numerico para o formato de moeda brasileira.
 * @param valor - Valor a ser formatado
 * @returns String formatada (ex: "R$ 150,00")
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

/**
 * Formata uma data para o formato brasileiro.
 * @param data - Data a ser formatada
 * @returns String formatada (ex: "06/08/2025")
 */
export function formatarData(data: Date | string): string {
  const dataObj = typeof data === "string" ? new Date(data) : data;
  return new Intl.DateTimeFormat("pt-BR").format(dataObj);
}

/**
 * Formata uma data com dia da semana.
 * @param data - Data a ser formatada
 * @returns String formatada (ex: "Quarta-feira, 06/08/2025")
 */
export function formatarDataCompleta(data: Date | string): string {
  const dataObj = typeof data === "string" ? new Date(data) : data;
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dataObj);
}

/**
 * Formata um horario para o formato brasileiro.
 * @param horario - Horario a ser formatado (Date ou string HH:mm)
 * @returns String formatada (ex: "14:00")
 */
export function formatarHorario(horario: Date | string): string {
  if (typeof horario === "string") {
    return horario;
  }
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(horario);
}

/**
 * Calcula a duracao entre dois horarios em minutos.
 * @param inicio - Horario de inicio
 * @param fim - Horario de fim
 * @returns Duracao em minutos
 */
export function calcularDuracao(inicio: Date, fim: Date): number {
  return Math.round((fim.getTime() - inicio.getTime()) / (1000 * 60));
}

/**
 * Gera um ID unico simples.
 * Util para IDs temporarios no frontend.
 */
export function gerarIdTemporario(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Valida se um CPF e valido.
 * @param cpf - CPF a ser validado
 * @returns true se valido, false caso contrario
 */
export function validarCPF(cpf: string): boolean {
  const cpfLimpo = cpf.replace(/\D/g, "");

  if (cpfLimpo.length !== 11) return false;

  // Verifica se todos os digitos sao iguais
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

  // Valida os digitos verificadores
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }

  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }

  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(10))) return false;

  return true;
}

/**
 * Valida se um telefone e valido.
 * @param telefone - Telefone a ser validado
 * @returns true se valido, false caso contrario
 */
export function validarTelefone(telefone: string): boolean {
  const telefoneLimpo = telefone.replace(/\D/g, "");
  return telefoneLimpo.length >= 10 && telefoneLimpo.length <= 11;
}

/**
 * Aplica desconto PIX a um valor.
 * @param valor - Valor original
 * @param percentualDesconto - Percentual de desconto (padrao: 5%)
 * @returns Valor com desconto
 */
export function aplicarDescontoPIX(
  valor: number,
  percentualDesconto: number = 5
): number {
  const desconto = valor * (percentualDesconto / 100);
  return valor - desconto;
}

/**
 * Calcula o valor da parcela sem juros.
 * @param valor - Valor total
 * @param parcelas - Numero de parcelas
 * @returns Valor de cada parcela
 */
export function calcularParcela(valor: number, parcelas: number): number {
  if (parcelas <= 0) return valor;
  return valor / parcelas;
}
