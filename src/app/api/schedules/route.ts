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

      // O frontend espera slots de hora em hora separados por virgula
      // (ex: "08:00,09:00,10:00,11:00"). O schema guarda ranges por dia
      // (horaInicio/horaFim), entao expandimos o range em slots de 1h.
      const slots: Record<string, string> = {};
      const diasComHorario = new Set<number>();
      for (const h of horariosProf as any[]) {
        const dayName = days[h.diaSemana] || "";
        const iniStr = new Date(h.horaInicio).toISOString().substring(11, 16);
        const fimStr = new Date(h.horaFim).toISOString().substring(11, 16);
        const [hi, mi] = iniStr.split(":").map(Number);
        const [hf, mf] = fimStr.split(":").map(Number);
        const iniMin = hi * 60 + mi;
        const fimMin = hf * 60 + mf;
        const lista: string[] = [];
        for (let m = iniMin; m < fimMin; m += 60) {
          lista.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
        }
        slots[dayName] = lista.join(",");
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