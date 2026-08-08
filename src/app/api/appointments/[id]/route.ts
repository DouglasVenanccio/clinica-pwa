import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { mapProfissional } from "@/lib/api-helpers";

/**
 * Converte um campo Time do Prisma (Date) para string "HH:MM".
 */
function timeToString(d: Date | string | null | undefined): string {
  if (!d) return "";
  if (typeof d === "string") return d.substring(11, 16);
  return d.toISOString().substring(11, 16);
}

/**
 * Mapeia o status enviado pelo frontend (ingles/minusculo) para o enum Prisma.
 */
const STATUS_MAP: Record<string, string> = {
  pending: "PENDENTE",
  confirmed: "CONFIRMADO",
  cancelled: "CANCELADO",
  completed: "CONCLUIDO",
  no_show: "NAO_COMPARECEU",
  "no-show": "NAO_COMPARECEU",
  PENDENTE: "PENDENTE",
  CONFIRMADO: "CONFIRMADO",
  CANCELADO: "CANCELADO",
  CONCLUIDO: "CONCLUIDO",
  NAO_COMPARECEU: "NAO_COMPARECEU",
};

/**
 * Mapeia a forma de pagamento do frontend para o enum Prisma.
 */
const PAGAMENTO_MAP: Record<string, string> = {
  pix: "PIX",
  credit: "CARTAO_CREDITO",
  debit: "CARTAO_DEBITO",
  PIX: "PIX",
  CARTAO_CREDITO: "CARTAO_CREDITO",
  CARTAO_DEBITO: "CARTAO_DEBITO",
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data: Record<string, unknown> = {};
    if (body.status) data.status = STATUS_MAP[body.status] || body.status;
    if (body.paymentMethod) data.formaPagamento = PAGAMENTO_MAP[body.paymentMethod] || body.paymentMethod;
    if (body.totalPrice !== undefined) data.valorTotal = body.totalPrice;
    if (body.date) data.data = new Date(body.date);
    if (body.time) {
      const [h, m] = body.time.split(":").map(Number);
      data.horaInicio = new Date(`1970-01-01T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00Z`);
      data.horaFim = new Date(`1970-01-01T${String(h + 1).padStart(2, "0")}:${String(m).padStart(2, "0")}:00Z`);
    }

    const agendamento = await prisma.agendamento.update({
      where: { id },
      data,
      select: {
        id: true,
        data: true,
        horaInicio: true,
        horaFim: true,
        valorTotal: true,
        status: true,
        formaPagamento: true,
        criadoEm: true,
        cliente: {
          select: {
            id: true,
            pontosFidelidade: true,
            usuario: { select: { id: true, nome: true, email: true, telefone: true, avatar: true, role: true } },
          },
        },
        profissional: {
          select: {
            id: true,
            especialidade: true,
            bio: true,
            ativo: true,
            avaliacaoMedia: true,
            totalAvaliacoes: true,
            usuario: { select: { id: true, nome: true, email: true, telefone: true, avatar: true, role: true } },
          },
        },
        servico: true,
      },
    });

    return NextResponse.json({ appointment: { ...agendamento, horaInicio: timeToString(agendamento.horaInicio), horaFim: timeToString(agendamento.horaFim), profissional: mapProfissional(agendamento.profissional) } });
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    return NextResponse.json({ error: "Erro ao atualizar agendamento." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.avaliacao.deleteMany({ where: { agendamentoId: id } });
    await prisma.pagamento.deleteMany({ where: { agendamentoId: id } });
    await prisma.agendamento.delete({ where: { id } });

    return NextResponse.json({ message: "Agendamento removido com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar agendamento:", error);
    return NextResponse.json({ error: "Erro ao deletar agendamento." }, { status: 500 });
  }
}
