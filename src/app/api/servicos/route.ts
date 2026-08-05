import { NextResponse } from "next/server";
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
