import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const agendamento = await prisma.agendamento.update({
      where: { id },
      data: {
        clienteId: body.clienteId,
        profissionalId: body.profissionalId,
        servicoId: body.servicoId,
        data: body.data ? new Date(body.data) : undefined,
        horaInicio: body.horaInicio,
        horaFim: body.horaFim,
        status: body.status,
        formaPagamento: body.formaPagamento,
        valorTotal: body.valorTotal,
        descontoPix: body.descontoPix,
        observacoes: body.observacoes,
      },
      include: {
        cliente: { include: { usuario: true } },
        profissional: { include: { usuario: true } },
        servico: true,
      },
    });

    return NextResponse.json({ agendamento });
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar agendamento." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.agendamento.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Agendamento removido com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao deletar agendamento." },
      { status: 500 }
    );
  }
}
