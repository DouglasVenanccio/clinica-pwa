import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function getNivel(pontos: number): string {
  if (pontos >= 5000) return "diamante";
  if (pontos >= 2000) return "ouro";
  if (pontos >= 500) return "prata";
  return "bronze";
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const cliente = await prisma.cliente.update({
      where: { id },
      data: {
        pontosFidelidade: body.pontos,
      },
      include: {
        usuario: {
          select: { email: true, nome: true },
        },
      },
    });

    const result = {
      id: cliente.id,
      clienteEmail: cliente.usuario.email,
      clienteNome: cliente.usuario.nome,
      pontos: cliente.pontosFidelidade,
      visitas: 0,
      totalGasto: 0,
      nivel: getNivel(cliente.pontosFidelidade),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao atualizar cartao de fidelidade:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar cartao de fidelidade." },
      { status: 500 }
    );
  }
}
