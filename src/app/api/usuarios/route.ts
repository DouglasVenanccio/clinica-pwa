import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-helpers";

/**
 * GET /api/usuarios
 * Lista todos os usuarios com dados de cliente/profissional.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { nome: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    if (role) {
      where.role = role;
    }

    const usuarios = await prisma.usuario.findMany({
      where,
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        avatar: true,
        role: true,
        ativo: true,
        criadoEm: true,
        cliente: { select: { id: true, pontosFidelidade: true } },
        profissional: { select: { id: true, especialidade: true } },
      },
      orderBy: { criadoEm: "desc" },
    });

    // Buscar contagem de agendamentos por usuario (via cliente e profissional)
    const clienteIds = usuarios.filter((u) => u.cliente).map((u) => u.cliente!.id);
    const profIds = usuarios.filter((u) => u.profissional).map((u) => u.profissional!.id);

    const [clienteCounts, profCounts] = await Promise.all([
      clienteIds.length > 0
        ? prisma.agendamento.groupBy({
            by: ["clienteId"],
            where: { clienteId: { in: clienteIds } },
            _count: { id: true },
          })
        : [],
      profIds.length > 0
        ? prisma.agendamento.groupBy({
            by: ["profissionalId"],
            where: { profissionalId: { in: profIds } },
            _count: { id: true },
          })
        : [],
    ]);

    const clienteCountMap = new Map(clienteCounts.map((c) => [c.clienteId, c._count.id]));
    const profCountMap = new Map(profCounts.map((c) => [c.profissionalId, c._count.id]));

    const result = usuarios.map((u) => ({
      id: u.id,
      nome: u.nome,
      email: u.email,
      telefone: u.telefone || "",
      role: u.role,
      ativo: u.ativo,
      avatar: u.avatar,
      criadoEm: u.criadoEm,
      totalAgendamentos:
        (u.cliente ? (clienteCountMap.get(u.cliente.id) || 0) : 0) +
        (u.profissional ? (profCountMap.get(u.profissional.id) || 0) : 0),
      pontosFidelidade: u.cliente?.pontosFidelidade || 0,
      especialidade: u.profissional?.especialidade || null,
    }));

    return NextResponse.json({ usuarios: result });
  } catch (error) {
    console.error("Erro ao buscar usuarios:", error);
    return NextResponse.json({ error: "Erro ao buscar usuarios." }, { status: 500 });
  }
}

/**
 * PUT /api/usuarios
 * Atualiza um usuario (role, ativo, etc).
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { id, role, ativo } = body;

    if (!id) {
      return NextResponse.json({ error: "ID obrigatorio." }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    if (role !== undefined) data.role = role;
    if (ativo !== undefined) data.ativo = ativo;

    const usuario = await prisma.usuario.update({
      where: { id },
      data,
      select: { id: true, nome: true, email: true, role: true, ativo: true },
    });

    return NextResponse.json({ usuario });
  } catch (error) {
    console.error("Erro ao atualizar usuario:", error);
    return NextResponse.json({ error: "Erro ao atualizar usuario." }, { status: 500 });
  }
}

/**
 * DELETE /api/usuarios
 * Exclui um usuario e seus dados relacionados.
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID obrigatorio." }, { status: 400 });
    }

    // Buscar cliente/profissional associados
    const cliente = await prisma.cliente.findUnique({ where: { usuarioId: id } });
    const profissional = await prisma.profissional.findUnique({ where: { usuarioId: id } });

    // Excluir agendamentos onde o usuario e cliente
    if (cliente) {
      // Remover avaliacoes dos agendamentos do cliente primeiro
      const agendamentoIds = (await prisma.agendamento.findMany({
        where: { clienteId: cliente.id },
        select: { id: true },
      })).map((a) => a.id);

      if (agendamentoIds.length > 0) {
        await prisma.avaliacao.deleteMany({ where: { agendamentoId: { in: agendamentoIds } } });
        await prisma.pagamento.deleteMany({ where: { agendamentoId: { in: agendamentoIds } } });
        await prisma.agendamento.deleteMany({ where: { clienteId: cliente.id } });
      }
      await prisma.cliente.delete({ where: { id: cliente.id } });
    }

    // Excluir agendamentos onde o usuario e profissional
    if (profissional) {
      const agendamentoIds = (await prisma.agendamento.findMany({
        where: { profissionalId: profissional.id },
        select: { id: true },
      })).map((a) => a.id);

      if (agendamentoIds.length > 0) {
        await prisma.avaliacao.deleteMany({ where: { agendamentoId: { in: agendamentoIds } } });
        await prisma.pagamento.deleteMany({ where: { agendamentoId: { in: agendamentoIds } } });
        await prisma.agendamento.deleteMany({ where: { profissionalId: profissional.id } });
      }

      // Remover relacoes profissional-servico
      await prisma.profissionalServico.deleteMany({ where: { profissionalId: profissional.id } });
      await prisma.horarioDisponivel.deleteMany({ where: { profissionalId: profissional.id } });
      await prisma.bloqueioHorario.deleteMany({ where: { profissionalId: profissional.id } });
      await prisma.profissional.delete({ where: { id: profissional.id } });
    }

    await prisma.usuario.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao excluir usuario:", error);
    return NextResponse.json({ error: "Erro ao excluir usuario." }, { status: 500 });
  }
}
