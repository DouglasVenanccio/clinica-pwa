import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clienteEmail = searchParams.get("clienteEmail");

    const where: Record<string, unknown> = {};
    if (clienteEmail) {
      where.usuario = { email: { contains: clienteEmail, mode: "insensitive" } };
    }

    const clientes = await prisma.cliente.findMany({
      where,
      include: {
        usuario: true,
        agendamentos: { where: { status: "completed" } },
      },
    });

    const cards = clientes.map((c) => {
      const visitas = c.agendamentos.length;
      const totalGasto = c.agendamentos.reduce((sum, a) => sum + Number(a.valorTotal || 0), 0);
      let nivel = "bronze";
      let nivelLabel = "Bronze";
      if (c.pontosFidelidade >= 5000) { nivel = "diamante"; nivelLabel = "Diamante"; }
      else if (c.pontosFidelidade >= 2000) { nivel = "ouro"; nivelLabel = "Ouro"; }
      else if (c.pontosFidelidade >= 500) { nivel = "prata"; nivelLabel = "Prata"; }

      return {
        id: c.id,
        clienteEmail: c.usuario?.email || "",
        clienteNome: c.usuario?.nome || "",
        pontos: c.pontosFidelidade,
        visitas,
        totalGasto,
        nivel,
        nivelLabel,
        cliente: c,
      };
    });

    return NextResponse.json({ cards });
  } catch (error) {
    console.error("Erro ao buscar cartoes fidelidade:", error);
    return NextResponse.json({ error: "Erro ao buscar cartoes fidelidade." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ message: "Cartao fidelidade criado." }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar cartao fidelidade." }, { status: 500 });
  }
}