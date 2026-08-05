import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/servicos
 * Retorna todos os servicos ativos com categoria.
 */
export async function GET() {
  try {
    const servicos = await prisma.servico.findMany({
      where: { ativo: true },
      include: { categoria: true },
      orderBy: { nome: "asc" },
    });

    return NextResponse.json({ servicos });
  } catch (error) {
    console.error("Erro ao buscar servicos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar servicos." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/servicos
 * Cria um novo servico.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const servico = await prisma.servico.create({
      data: {
        nome: body.nome,
        descricao: body.descricao,
        duracaoMinutos: body.duracaoMinutos,
        preco: body.preco,
        imagem: body.imagem,
        categoriaId: body.categoriaId,
      },
      include: { categoria: true },
    });

    return NextResponse.json({ servico }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar servico:", error);
    return NextResponse.json(
      { error: "Erro ao criar servico." },
      { status: 500 }
    );
  }
}
