import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const horario = await prisma.horarioDisponivel.update({
      where: { id },
      data: {
        profissionalId: body.profissionalId,
        diaSemana: body.diaSemana,
        horaInicio: body.horaInicio,
        horaFim: body.horaFim,
        ativo: body.ativo,
      },
    });

    return NextResponse.json({ horario });
  } catch (error) {
    console.error("Erro ao atualizar horario:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar horario." },
      { status: 500 }
    );
  }
}
