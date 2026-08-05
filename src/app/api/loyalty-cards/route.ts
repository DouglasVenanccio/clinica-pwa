import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function getNivel(pontos: number): string {
  if (pontos >= 5000) return "diamante";
  if (pontos >= 2000) return "ouro";
  if (pontos >= 500) return "prata";
  return "bronze";
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clienteEmail = searchParams.get("clienteEmail");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (clienteEmail) {
      where.usuario = { email: { contains: clienteEmail, mode: "insensitive" } };
    }

    const clientes = await prisma.cliente.findMany({
      where,
      include: {
        usuario: { select: { email: true, nome: true } },
        agendamentos: { select: { id: true, valorTotal: true } },
      },
    });

    const result = clientes.map((c) => {
      const totalGasto = c.agendamentos.reduce(
        (sum, a) => sum + Number(a.valorTotal || 0),
        0
      );
      const pontos = c.pontosFidelidade;
      return {
        id: c.id,
        clienteEmail: c.usuario.email,
        clienteNome: c.usuario.nome,
        pontos,
        visitas: c.agendamentos.length,
        totalGasto,
        nivel: getNivel(pontos),
      };
    });

    return NextResponse.json({ cards: result });
  } catch (error) {
    console.error("Erro ao buscar cartoes de fidelidade:", error);
    return NextResponse.json(
      { error: "Erro ao buscar cartoes de fidelidade." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.clienteEmail || body.client_email;
    const pontos = body.pontos || body.points || 0;
    const nivel = body.nivel || body.tier || getNivel(pontos);

    const cliente = await prisma.cliente.findFirst({
      where: { usuario: { email } },
      include: { usuario: true },
    });

    if (cliente) {
      const updated = await prisma.cliente.update({
        where: { id: cliente.id },
        data: { pontosFidelidade: { increment: pontos } },
        include: { usuario: true },
      });
      return NextResponse.json({
        card: {
          id: updated.id,
          clienteEmail: updated.usuario.email,
          clienteNome: updated.usuario.nome,
          pontos: updated.pontosFidelidade,
          visitas: 0,
          totalGasto: 0,
          nivel,
        },
      }, { status: 201 });
    }

    return NextResponse.json({ error: "Cliente nao encontrado." }, { status: 404 });
  } catch (error) {
    console.error("Erro ao criar cartao de fidelidade:", error);
    return NextResponse.json(
      { error: "Erro ao criar cartao de fidelidade." },
      { status: 500 }
    );
  }
}
