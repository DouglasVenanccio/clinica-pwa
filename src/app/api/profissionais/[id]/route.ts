import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const profissional = await prisma.profissional.update({
      where: { id },
      data: {
        especialidade: body.especialidade,
        bio: body.bio,
        ativo: body.ativo,
        usuario: {
          update: {
            nome: body.nome,
            email: body.email,
            telefone: body.telefone,
            avatar: body.avatar,
          },
        },
      },
      include: { usuario: true },
    });

    return NextResponse.json({ profissional });
  } catch (error) {
    console.error("Erro ao atualizar profissional:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar profissional." },
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

    await prisma.profissional.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Profissional removido com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar profissional:", error);
    return NextResponse.json(
      { error: "Erro ao deletar profissional." },
      { status: 500 }
    );
  }
}
