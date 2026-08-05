import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "desc";
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const avaliacoes = await prisma.avaliacao.findMany({
      include: {
        cliente: { include: { usuario: true } },
        profissional: { include: { usuario: true } },
        agendamento: { include: { servico: true } },
      },
      orderBy: { criadoEm: sort as "asc" | "desc" },
      take: limit,
    });

    const result = avaliacoes.map((a) => ({
      id: a.id,
      clienteNome: a.cliente.usuario.nome,
      nota: a.nota,
      comentario: a.comentario,
      servicoNome: a.agendamento?.servico?.nome || "",
      createdAt: a.criadoEm,
    }));

    return NextResponse.json({ reviews: result });
  } catch (error) {
    console.error("Erro ao buscar avaliacoes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar avaliacoes." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const clientName = body.clientName || body.client_name;
    const nota = body.rating || body.nota || 5;
    const comentario = body.comment || body.comentario || "";
    const serviceName = body.serviceName || body.service_name;

    const servico = serviceName
      ? await prisma.servico.findFirst({
          where: { nome: { contains: serviceName, mode: "insensitive" } },
        })
      : null;

    const profissional = await prisma.profissional.findFirst({
      where: { ativo: true },
    });

    const cliente = clientName
      ? await prisma.cliente.findFirst({
          where: { usuario: { nome: { contains: clientName, mode: "insensitive" } } },
          include: { usuario: true },
        })
      : null;

    let clienteId = cliente?.id;
    let usuarioId = cliente?.usuarioId;

    if (!clienteId) {
      const usuario = await prisma.usuario.create({
        data: {
          email: `anonimo_${Date.now()}@temp.com`,
          senha: "temp",
          nome: clientName || "Anonimo",
          role: "CLIENTE",
        },
      });
      const c = await prisma.cliente.create({
        data: { usuarioId: usuario.id },
      });
      clienteId = c.id;
      usuarioId = usuario.id;
    }

    const agendamento = await prisma.agendamento.findFirst({
      where: { clienteId: clienteId },
      orderBy: { criadoEm: "desc" },
    });

    if (!agendamento) {
      return NextResponse.json(
        { error: "Nenhum agendamento encontrado para criar avaliacao." },
        { status: 400 }
      );
    }

    const avaliacao = await prisma.avaliacao.create({
      data: {
        agendamentoId: agendamento.id,
        clienteId: clienteId,
        profissionalId: agendamento.profissionalId,
        nota,
        comentario,
      },
    });

    return NextResponse.json({ review: avaliacao }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar avaliacao:", error);
    return NextResponse.json(
      { error: "Erro ao criar avaliacao." },
      { status: 500 }
    );
  }
}
