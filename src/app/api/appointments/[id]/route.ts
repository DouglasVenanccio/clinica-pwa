import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data: Record<string, unknown> = {};
    if (body.status) data.status = body.status.toUpperCase();
    if (body.paymentMethod) data.formaPagamento = body.paymentMethod.toUpperCase();
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
      include: {
        cliente: { include: { usuario: true } },
        profissional: { include: { usuario: true } },
        servico: true,
      },
    });

    return NextResponse.json({ appointment: agendamento });
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
