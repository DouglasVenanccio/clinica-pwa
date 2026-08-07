import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") || "50");

    const avaliacoes = await prisma.avaliacao.findMany({
      include: {
        cliente: { include: { usuario: true } },
        profissional: { include: { usuario: true } },
        agendamento: { include: { servico: true } },
      },
      orderBy: { criadoEm: "desc" },
      take: limit,
    });

    const reviews = avaliacoes.map((a) => ({
      id: a.id,
      clienteNome: a.cliente?.usuario?.nome || "",
      nota: a.nota,
      comentario: a.comentario,
      servicoNome: a.agendamento?.servico?.nome || "",
      criadoEm: a.criadoEm,
      cliente: a.cliente,
      servico: a.agendamento?.servico,
    }));

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Erro ao buscar avaliacoes:", error);
    return NextResponse.json({ error: "Erro ao buscar avaliacoes." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const review = await prisma.avaliacao.create({
      data: {
        agendamentoId: body.agendamentoId || "",
        clienteId: body.clienteId || "",
        profissionalId: body.profissionalId || "",
        nota: body.rating || body.nota,
        comentario: body.comment || body.comentario || "",
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar avaliacao:", error);
    return NextResponse.json({ error: "Erro ao criar avaliacao." }, { status: 500 });
  }
}