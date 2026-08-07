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
      select: {
        id: true,
        usuarioId: true,
        especialidade: true,
        bio: true,
        ativo: true,
        rating: true,
        criadoEm: true,
        usuario: { select: { id: true, nome: true, email: true, telefone: true, avatar: true, role: true } },
      },
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

    // Limpar dados dependentes antes de deletar
    const agendamentoIds = (await prisma.agendamento.findMany({
      where: { profissionalId: id },
      select: { id: true },
    })).map((a) => a.id);

    if (agendamentoIds.length > 0) {
      await prisma.avaliacao.deleteMany({ where: { agendamentoId: { in: agendamentoIds } } });
      await prisma.pagamento.deleteMany({ where: { agendamentoId: { in: agendamentoIds } } });
      await prisma.agendamento.deleteMany({ where: { profissionalId: id } });
    }

    await prisma.profissionalServico.deleteMany({ where: { profissionalId: id } });
    await prisma.horarioDisponivel.deleteMany({ where: { profissionalId: id } });
    await prisma.bloqueioHorario.deleteMany({ where: { profissionalId: id } });
    await prisma.avaliacao.deleteMany({ where: { profissionalId: id } });

    // Buscar e deletar usuario associado
    const prof = await prisma.profissional.findUnique({ where: { id }, select: { usuarioId: true } });
    await prisma.profissional.delete({ where: { id } });
    if (prof) {
      await prisma.usuario.delete({ where: { id: prof.usuarioId } });
    }

    return NextResponse.json({ message: "Profissional removido com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar profissional:", error);
    return NextResponse.json(
      { error: "Erro ao deletar profissional." },
      { status: 500 }
    );
  }
}
