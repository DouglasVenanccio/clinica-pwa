import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DIA_SEMANA = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profissionalNome = searchParams.get("profissionalNome");

    const where: Record<string, unknown> = {};

    if (profissionalNome) {
      where.profissional = {
        usuario: {
          nome: { contains: profissionalNome, mode: "insensitive" },
        },
      };
    }

    const horarios = await prisma.horarioDisponivel.findMany({
      where,
      include: {
        profissional: { include: { usuario: true } },
      },
      orderBy: { profissional: { usuario: { nome: "asc" } } },
    });

    const result = horarios.map((h) => {
      const diasFolga = DIA_SEMANA.filter((_, i) => {
        return !horarios.some(
          (hor) =>
            hor.profissionalId === h.profissionalId && hor.diaSemana === i
        );
      });

      return {
        id: h.id,
        profissionalNome: h.profissional.usuario.nome,
        diasFolga,
        domingo: horarios.some(
          (hor) => hor.profissionalId === h.profissionalId && hor.diaSemana === 0
        ),
        segunda: horarios.some(
          (hor) => hor.profissionalId === h.profissionalId && hor.diaSemana === 1
        ),
        terca: horarios.some(
          (hor) => hor.profissionalId === h.profissionalId && hor.diaSemana === 2
        ),
        quarta: horarios.some(
          (hor) => hor.profissionalId === h.profissionalId && hor.diaSemana === 3
        ),
        quinta: horarios.some(
          (hor) => hor.profissionalId === h.profissionalId && hor.diaSemana === 4
        ),
        sexta: horarios.some(
          (hor) => hor.profissionalId === h.profissionalId && hor.diaSemana === 5
        ),
        sabado: horarios.some(
          (hor) => hor.profissionalId === h.profissionalId && hor.diaSemana === 6
        ),
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar horarios:", error);
    return NextResponse.json(
      { error: "Erro ao buscar horarios." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profissionalId, horarios } = body;

    if (!profissionalId || !Array.isArray(horarios)) {
      return NextResponse.json(
        { error: "profissionalId e horarios sao obrigatorios." },
        { status: 400 }
      );
    }

    const created = await prisma.$transaction(
      horarios.map((h: { diaSemana: number; horaInicio: string; horaFim: string }) =>
        prisma.horarioDisponivel.create({
          data: {
            profissionalId,
            diaSemana: h.diaSemana,
            horaInicio: h.horaInicio,
            horaFim: h.horaFim,
          },
        })
      )
    );

    return NextResponse.json({ horarios: created }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar horarios:", error);
    return NextResponse.json(
      { error: "Erro ao criar horarios." },
      { status: 500 }
    );
  }
}
