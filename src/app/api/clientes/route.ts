import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/clientes
 * Lista todos os clientes com dados do usuario, agendamentos e pontos de fidelidade.
 * Suporta busca por nome/email e filtro por status.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { usuario: { nome: { contains: search, mode: "insensitive" } } },
        { usuario: { email: { contains: search, mode: "insensitive" } } },
        { usuario: { telefone: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [clientes, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        select: {
          id: true,
          pontosFidelidade: true,
          usuario: {
            select: { id: true, nome: true, email: true, telefone: true, avatar: true, role: true, criadoEm: true },
          },
          agendamentos: {
            select: { id: true, valorTotal: true, status: true, data: true },
          },
        },
        skip,
        take: limit,
        orderBy: { usuario: { criadoEm: "desc" } },
      }),
      prisma.cliente.count({ where }),
    ]);

    const result = clientes.map((c) => {
      const totalGasto = c.agendamentos.reduce(
        (sum, a) => sum + Number(a.valorTotal || 0),
        0
      );
      const agendamentosConcluidos = c.agendamentos.filter(
        (a) => a.status === "CONCLUIDO"
      ).length;

      return {
        id: c.id,
        nome: c.usuario.nome,
        email: c.usuario.email,
        telefone: c.usuario.telefone || "",
        pontosFidelidade: c.pontosFidelidade,
        totalGasto,
        totalAgendamentos: c.agendamentos.length,
        agendamentosConcluidos,
        criadoEm: c.usuario.criadoEm,
      };
    });

    return NextResponse.json({ clientes: result, total, page, limit });
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar clientes." },
      { status: 500 }
    );
  }
}
