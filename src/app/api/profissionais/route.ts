import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { stripSensitiveMany } from "@/lib/api-helpers";

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
      const profServicos = await prisma.profissionalServico.findMany({
        where: { servicoId },
        select: {
          profissional: {
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
          },
        },
      });

      profissionais = profServicos
        .map((ps) => ps.profissional)
        .filter((p) => p.ativo);
    } else {
      const allProf = await prisma.profissional.findMany({
        where: { ativo: true },
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

/**
 * POST /api/profissionais
 * Cria um novo profissional com usuario.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const hashedPassword = await bcrypt.hash(body.senha || "12345678", 12);

    const usuario = await prisma.usuario.create({
      data: {
        nome: body.nome,
        email: body.email,
        senha: hashedPassword,
        telefone: body.telefone,
        avatar: body.avatar,
        role: "PROFISSIONAL",
      },
    });

    const profissional = await prisma.profissional.create({
      data: {
        usuarioId: usuario.id,
        especialidade: body.especialidade,
        bio: body.bio,
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

    return NextResponse.json({ profissional }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar profissional:", error);
    return NextResponse.json(
      { error: "Erro ao criar profissional." },
      { status: 500 }
    );
  }
}
