import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const servico = await prisma.servico.update({
      where: { id },
      data: {
        nome: body.nome,
        descricao: body.descricao,
        duracaoMinutos: body.duracaoMinutos,
        preco: body.preco,
        imagem: body.imagem,
        categoriaId: body.categoriaId,
        ativo: body.ativo,
      },
    });

    return NextResponse.json({ servico });
  } catch (error) {
    console.error("Erro ao atualizar servico:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar servico." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.servico.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Servico removido com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar servico:", error);
    return NextResponse.json(
      { error: "Erro ao deletar servico." },
      { status: 500 }
    );
  }
}
