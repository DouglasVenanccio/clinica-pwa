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
    if (body.paymentMethod) data.metodoPagamento = body.paymentMethod.toLowerCase();
    if (body.totalPrice !== undefined) data.valorTotal = body.totalPrice;
    if (body.date) data.data = new Date(body.date);
    if (body.time) data.hora = new Date(`1970-01-01T${body.time}:00Z`);

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

    // Limpar dados dependentes
    await prisma.avaliacao.deleteMany({ where: { agendamentoId: id } });
    await prisma.pagamento.deleteMany({ where: { agendamentoId: id } });
    await prisma.agendamento.delete({ where: { id } });

    return NextResponse.json({ message: "Agendamento removido com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar agendamento:", error);
    return NextResponse.json({ error: "Erro ao deletar agendamento." }, { status: 500 });
  }
}