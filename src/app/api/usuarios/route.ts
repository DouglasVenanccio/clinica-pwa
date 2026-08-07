import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
      include: {
        cliente: { select: { id: true, pontosFidelidade: true } },
        profissional: { select: { id: true, especialidade: true } },
        _count: { select: { agendamentos: true } },
      },
      orderBy: { criadoEm: "desc" },
    });

    const result = usuarios.map((u) => ({
      id: u.id,
      nome: u.nome,
      email: u.email,
      telefone: u.telefone || "",
      role: u.role,
      ativo: u.ativo,
      avatar: u.avatar,
      criadoEm: u.criadoEm,
      totalAgendamentos: u._count.agendamentos,
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID obrigatorio." }, { status: 400 });
    }

    // Excluir dados dependentes primeiro
    await prisma.agendamento.deleteMany({ where: { clienteId: id } });
    await prisma.agendamento.deleteMany({ where: { profissionalId: id } });
    await prisma.cliente.deleteMany({ where: { usuarioId: id } });
    await prisma.profissional.deleteMany({ where: { usuarioId: id } });
    await prisma.usuario.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao excluir usuario:", error);
    return NextResponse.json({ error: "Erro ao excluir usuario." }, { status: 500 });
  }
}
