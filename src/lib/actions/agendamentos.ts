"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { agendamentoSchema } from "@/lib/validations";
import { CONFIG, STATUS_AGENDAMENTO } from "@/lib/constants";
import { revalidatePath } from "next/cache";

/**
 * Converte um campo Time do Prisma (Date) para string "HH:MM".
 */
function timeToString(d: Date): string {
  return d.toISOString().substring(11, 16);
}

/**
 * Server actions para gerenciamento de agendamentos.
 * Inclui criar, cancelar, confirmar, listar e buscar horarios disponiveis.
 */

// ==================== CRIAR AGENDAMENTO ====================

export interface CriarAgendamentoResult {
  success: boolean;
  error?: string;
  agendamentoId?: string;
}

/**
 * Cria um novo agendamento para o cliente logado.
 * Valida conflitos de horario, limite diario e antencia minima.
 */
export async function criarAgendamento(
  formData: FormData
): Promise<CriarAgendamentoResult> {
  try {
    // 1. Verifica autenticacao
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Voce precisa estar logado para agendar." };
    }

    // 2. Valida dados do formulario
    const rawData = {
      servicoId: formData.get("servicoId") as string,
      profissionalId: formData.get("profissionalId") as string | undefined,
      data: formData.get("data") as string,
      horaInicio: formData.get("horaInicio") as string,
      formaPagamento: formData.get("formaPagamento") as "PIX" | "CARTAO_CREDITO" | "CARTAO_DEBITO",
      observacoes: formData.get("observacoes") as string | undefined,
    };

    const parsed = agendamentoSchema.safeParse(rawData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const { servicoId, profissionalId, data, horaInicio, formaPagamento, observacoes } = parsed.data;

    // 3. Busca o servico
    const servico = await prisma.servico.findUnique({
      where: { id: servicoId },
      include: { categoria: true },
    });
    if (!servico || !servico.ativo) {
      return { success: false, error: "Servico nao encontrado ou indisponivel." };
    }

    // 4. Busca o profissional (se nao especificado, pega o primeiro disponivel)
    let profissionalIdFinal = profissionalId;
    if (!profissionalIdFinal) {
      const profServico = await prisma.profissionalServico.findFirst({
        where: { servicoId, profissional: { ativo: true } },
        include: { profissional: true },
      });
      if (!profServico) {
        return { success: false, error: "Nenhum profissional disponivel para este servico." };
      }
      profissionalIdFinal = profServico.profissionalId;
    }

    // 5. Verifica se o profissional oferece o servico
    const profServico = await prisma.profissionalServico.findUnique({
      where: {
        profissionalId_servicoId: {
          profissionalId: profissionalIdFinal,
          servicoId,
        },
      },
    });
    if (!profServico) {
      return { success: false, error: "Este profissional nao oferece este servico." };
    }

    // 6. Calcula horaFim baseada na duracao do servico
    const [hora, minuto] = horaInicio.split(":").map(Number);
    const dataInicio = new Date(data);
    dataInicio.setHours(hora, minuto, 0, 0);
    const dataFim = new Date(dataInicio.getTime() + servico.duracaoMinutos * 60 * 1000);
    const horaFim = `${String(dataFim.getHours()).padStart(2, "0")}:${String(dataFim.getMinutes()).padStart(2, "0")}`;

    // 7. Verifica antencia minima (1 hora)
    const agora = new Date();
    const antenciaMinima = CONFIG.ANTENCIA_MINIMA_AGENDAMENTO_MINUTOS * 60 * 1000;
    if (dataInicio.getTime() - agora.getTime() < antenciaMinima) {
      return {
        success: false,
        error: `Agendamento deve ser com pelo menos ${CONFIG.ANTENCIA_MINIMA_AGENDAMENTO_MINUTOS} minutos de antencia.`,
      };
    }

    // 8. Verifica se o profissional esta disponivel neste horario
    const diaSemana = dataInicio.getDay();
    const horarioDisponivel = await prisma.horarioDisponivel.findUnique({
      where: {
        profissionalId_diaSemana: {
          profissionalId: profissionalIdFinal,
          diaSemana,
        },
      },
    });

    if (!horarioDisponivel || !horarioDisponivel.ativo) {
      return { success: false, error: "Profissional nao atende neste dia da semana." };
    }

    // Verifica se o horario esta dentro do horario de atendimento
    const hdInicio = timeToString(horarioDisponivel.horaInicio);
    const hdFim = timeToString(horarioDisponivel.horaFim);
    if (horaInicio < hdInicio || horaFim > hdFim) {
      return {
        success: false,
        error: `Horario de atendimento: ${hdInicio} as ${hdFim}.`,
      };
    }

    // 9. Verifica conflitos com agendamentos existentes
    const conflito = await prisma.agendamento.findFirst({
      where: {
        profissionalId: profissionalIdFinal,
        data: dataInicio,
        status: { notIn: [STATUS_AGENDAMENTO.CANCELADO] },
      },
    });

    // Verifica sobreposicao de horarios (converte Time para string)
    if (conflito) {
      const agInicio = timeToString(conflito.horaInicio);
      const agFim = timeToString(conflito.horaFim);
      if (agInicio < horaFim && agFim > horaInicio) {
        return { success: false, error: "Este horario ja esta ocupado. Escolha outro horario." };
      }
    }

    // 10. Verifica bloqueios do profissional
    const bloqueios = await prisma.bloqueioHorario.findMany({
      where: {
        profissionalId: profissionalIdFinal,
        dataInicio: { lte: dataInicio },
        OR: [
          { dataFim: null },
          { dataFim: { gte: dataInicio } },
        ],
      },
    });

    const temBloqueio = bloqueios.some((bl) => {
      const blInicio = bl.horaInicio ? timeToString(bl.horaInicio) : "00:00";
      const blFim = bl.horaFim ? timeToString(bl.horaFim) : "23:59";
      return blInicio < horaFim && blFim > horaInicio;
    });

    if (temBloqueio) {
      return { success: false, error: "Profissional indisponivel neste periodo." };
    }

    // 11. Verifica limite de agendamentos do cliente por dia
    const agendamentosCliente = await prisma.agendamento.count({
      where: {
        cliente: { usuarioId: session.user.id },
        data: dataInicio,
        status: { notIn: [STATUS_AGENDAMENTO.CANCELADO] },
      },
    });

    if (agendamentosCliente >= CONFIG.LIMITE_AGENDAMENTOS_POR_DIA) {
      return {
        success: false,
        error: `Voce ja atingiu o limite de ${CONFIG.LIMITE_AGENDAMENTOS_POR_DIA} agendamentos por dia.`,
      };
    }

    // 12. Busca o cliente
    const cliente = await prisma.cliente.findUnique({
      where: { usuarioId: session.user.id },
    });
    if (!cliente) {
      return { success: false, error: "Perfil de cliente nao encontrado." };
    }

    // 13. Calcula valor com desconto PIX
    const precoNum = Number(servico.preco);
    const descontoPix = formaPagamento === "PIX"
      ? precoNum * (CONFIG.DESCONTO_PIX_PERCENTUAL / 100)
      : 0;
    const valorTotal = precoNum - descontoPix;

    // 14. Cria o agendamento
    const agendamento = await prisma.agendamento.create({
      data: {
        clienteId: cliente.id,
        profissionalId: profissionalIdFinal,
        servicoId,
        data: dataInicio,
        horaInicio,
        horaFim,
        status: STATUS_AGENDAMENTO.PENDENTE,
        formaPagamento,
        valorTotal,
        descontoPix,
        observacoes: observacoes || undefined,
      },
    });

    revalidatePath("/meus-agendamentos");
    revalidatePath("/dashboard/agendamentos");

    return { success: true, agendamentoId: agendamento.id };
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return { success: false, error: "Erro ao criar agendamento. Tente novamente." };
  }
}

// ==================== CANCELAR AGENDAMENTO ====================

export interface CancelarAgendamentoResult {
  success: boolean;
  error?: string;
}

/**
 * Cancela um agendamento. Apenas o cliente dono ou um admin podem cancelar.
 * Respeita o prazo minimo de cancelamento (24 horas).
 */
export async function cancelarAgendamento(
  agendamentoId: string
): Promise<CancelarAgendamentoResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Voce precisa estar logado." };
    }

    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
      include: { cliente: true },
    });

    if (!agendamento) {
      return { success: false, error: "Agendamento nao encontrado." };
    }

    // Verifica permissao (dono ou admin)
    const isAdmin = session.user.role === "ADMIN";
    const isDono = agendamento.cliente.usuarioId === session.user.id;
    if (!isAdmin && !isDono) {
      return { success: false, error: "Voce nao tem permissao para cancelar este agendamento." };
    }

    // Verifica se ja esta cancelado
    if (agendamento.status === STATUS_AGENDAMENTO.CANCELADO) {
      return { success: false, error: "Agendamento ja foi cancelado." };
    }

    // Verifica se ja foi concluido
    if (agendamento.status === STATUS_AGENDAMENTO.CONCLUIDO) {
      return { success: false, error: "Nao e possivel cancelar um agendamento concluido." };
    }

    // Verifica prazo de cancelamento (24 horas antes) - apenas para clientes
    if (!isAdmin) {
      const dataAgendamento = new Date(agendamento.data);
      const [h, m] = timeToString(agendamento.horaInicio).split(":").map(Number);
      dataAgendamento.setHours(h, m, 0, 0);
      const prazoCancelamento = new Date(
        dataAgendamento.getTime() - CONFIG.TEMPO_CANCELAMENTO_HORAS * 60 * 60 * 1000
      );

      if (new Date() > prazoCancelamento) {
        return {
          success: false,
          error: `Cancelamento deve ser feito com ${CONFIG.TEMPO_CANCELAMENTO_HORAS} horas de antencia.`,
        };
      }
    }

    await prisma.agendamento.update({
      where: { id: agendamentoId },
      data: { status: STATUS_AGENDAMENTO.CANCELADO },
    });

    revalidatePath("/meus-agendamentos");
    revalidatePath("/dashboard/agendamentos");

    return { success: true };
  } catch (error) {
    console.error("Erro ao cancelar agendamento:", error);
    return { success: false, error: "Erro ao cancelar agendamento." };
  }
}

// ==================== CONFIRMAR AGENDAMENTO ====================

/**
 * Confirma um agendamento. Apenas admins podem confirmar.
 */
export async function confirmarAgendamento(
  agendamentoId: string
): Promise<CancelarAgendamentoResult> {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return { success: false, error: "Apenas administradores podem confirmar agendamentos." };
    }

    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
    });

    if (!agendamento) {
      return { success: false, error: "Agendamento nao encontrado." };
    }

    if (agendamento.status !== STATUS_AGENDAMENTO.PENDENTE) {
      return { success: false, error: "Apenas agendamentos pendentes podem ser confirmados." };
    }

    await prisma.agendamento.update({
      where: { id: agendamentoId },
      data: { status: STATUS_AGENDAMENTO.CONFIRMADO },
    });

    revalidatePath("/dashboard/agendamentos");

    return { success: true };
  } catch (error) {
    console.error("Erro ao confirmar agendamento:", error);
    return { success: false, error: "Erro ao confirmar agendamento." };
  }
}

// ==================== CONCLUIR AGENDAMENTO ====================

/**
 * Marca um agendamento como concluido. Apenas profissional ou admin.
 */
export async function concluirAgendamento(
  agendamentoId: string
): Promise<CancelarAgendamentoResult> {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role === "CLIENTE") {
      return { success: false, error: "Voce nao tem permissao para esta acao." };
    }

    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
    });

    if (!agendamento) {
      return { success: false, error: "Agendamento nao encontrado." };
    }

    if (agendamento.status !== STATUS_AGENDAMENTO.CONFIRMADO) {
      return { success: false, error: "Apenas agendamentos confirmados podem ser concluidos." };
    }

    await prisma.agendamento.update({
      where: { id: agendamentoId },
      data: { status: STATUS_AGENDAMENTO.CONCLUIDO },
    });

    revalidatePath("/meus-agendamentos");
    revalidatePath("/dashboard/agendamentos");

    return { success: true };
  } catch (error) {
    console.error("Erro ao concluir agendamento:", error);
    return { success: false, error: "Erro ao concluir agendamento." };
  }
}
