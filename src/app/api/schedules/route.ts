import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profissionalNome = searchParams.get("profissionalNome");

    const where: Record<string, unknown> = {};
    if (profissionalNome) {
      where.profissional = {
        usuario: { nome: { contains: profissionalNome, mode: "insensitive" } },
      };
    }

    const horarios = await prisma.horarioDisponivel.findMany({
      where,
      include: { profissional: { include: { usuario: true } } },
      orderBy: { diaSemana: "asc" },
    });

    // Agrupar por profissional
    const byProf = new Map<string, unknown[]>();
    for (const h of horarios) {
      const key = h.profissionalId;
      if (!byProf.has(key)) byProf.set(key, []);
      byProf.get(key)!.push(h);
    }

    const days = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
    const schedules: unknown[] = [];

    for (const [profId, horariosProf] of byProf) {
      const prof = (horariosProf as any)[0]?.profissional;
      if (!prof) continue;

      const slots: Record<string, string> = {};
      const diasComHorario = new Set<number>();
      for (const h of horariosProf as any[]) {
        const dayName = days[h.diaSemana] || "";
        const ini = new Date(h.horaInicio).toISOString().substring(11, 16);
        const fim = new Date(h.horaFim).toISOString().substring(11, 16);
        slots[dayName] = `${ini}-${fim}`;
        diasComHorario.add(h.diaSemana);
      }

      // Dias folga = dias sem horario (1-6)
      const diasFolga = [1,2,3,4,5,6].filter(d => !diasComHorario.has(d)).map(d => days[d]).join(", ");

      schedules.push({
        id: profId,
        profissionalNome: prof.usuario?.nome || "",
        profissional: prof,
        diasFolga,
        domingo: slots["domingo"] || "",
        segunda: slots["segunda"] || "",
        terca: slots["terca"] || "",
        quarta: slots["quarta"] || "",
        quinta: slots["quinta"] || "",
        sexta: slots["sexta"] || "",
        sabado: slots["sabado"] || "",
      });
    }

    return NextResponse.json({ schedules });
  } catch (error) {
    console.error("Erro ao buscar horarios:", error);
    return NextResponse.json({ error: "Erro ao buscar horarios." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ schedule: body }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar horario." }, { status: 500 });
  }
}