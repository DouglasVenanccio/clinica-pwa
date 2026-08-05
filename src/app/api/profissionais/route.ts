import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/profissionais?servicoId=xxx
 * Retorna profissionais que oferecem o servico especificado.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const servicoId = searchParams.get("servicoId");

    let profissionais;

    if (servicoId) {
      // Busca profissionais que oferecem este servico
      const profServicos = await prisma.profissionalServico.findMany({
        where: { servicoId },
        include: {
          profissional: {
            include: { usuario: true },
          },
        },
      });

      profissionais = profServicos
        .map((ps) => ps.profissional)
        .filter((p) => p.ativo);
    } else {
      // Retorna todos os profissionais ativos
      const allProf = await prisma.profissional.findMany({
        where: { ativo: true },
        include: { usuario: true },
      });
      profissionais = allProf;
    }

    return NextResponse.json({ profissionais });
  } catch (error) {
    console.error("Erro ao buscar profissionais:", error);
    return NextResponse.json(
      { error: "Erro ao buscar profissionais." },
      { status: 500 }
    );
  }
}
