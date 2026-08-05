import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DIA_SEMANA = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];

function formatTime(d: Date): string {
  return d.toISOString().split("T")[1].substring(0, 5);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profissionalNome = searchParams.get("profissionalNome");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

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

    const byPro = new Map<string, typeof horarios>();
    for (const h of horarios) {
      const key = h.profissionalId;
      if (!byPro.has(key)) byPro.set(key, []);
      byPro.get(key)!.push(h);
    }

    const result = Array.from(byPro.entries()).map(([proId, entries]) => {
      const first = entries[0];
      const hasDay = (day: number) => entries.some((h) => h.diaSemana === day);
      const missingDays = DIA_SEMANA.filter((_, i) => !hasDay(i));

      return {
        id: first.id,
        profissionalNome: first.profissional.usuario.nome,
        diasFolga: missingDays.join(", "),
        domingo: hasDay(0),
        segunda: hasDay(1),
        terca: hasDay(2),
        quarta: hasDay(3),
        quinta: hasDay(4),
        sexta: hasDay(5),
        sabado: hasDay(6),
      };
    });

    return NextResponse.json({ schedules: result });
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
    const profissionalNome = body.professionalName || body.profissionalNome;

    const profissional = await prisma.profissional.findFirst({
      where: {
        usuario: { nome: { contains: profissionalNome, mode: "insensitive" } },
      },
    });

    if (!profissional) {
      return NextResponse.json(
        { error: "Profissional nao encontrado." },
        { status: 404 }
      );
    }

    const scheduleFields = [
      { day: 0, val: body.domingo || body.slots_sun },
      { day: 1, val: body.segunda || body.slots_mon },
      { day: 2, val: body.terca || body.slots_tue },
      { day: 3, val: body.quarta || body.slots_wed },
      { day: 4, val: body.quinta || body.slots_thu },
      { day: 5, val: body.sexta || body.slots_fri },
      { day: 6, val: body.sabado || body.slots_sat },
    ];

    for (const { day, val } of scheduleFields) {
      if (val && typeof val === "string") {
        await prisma.horarioDisponivel.upsert({
          where: { profissionalId_diaSemana: { profissionalId: profissional.id, diaSemana: day } },
          update: {
            horaInicio: new Date("2000-01-01T08:00:00"),
            horaFim: new Date("2000-01-01T18:00:00"),
            ativo: true,
          },
          create: {
            profissionalId: profissional.id,
            diaSemana: day,
            horaInicio: new Date("2000-01-01T08:00:00"),
            horaFim: new Date("2000-01-01T18:00:00"),
          },
        });
      }
    }

    return NextResponse.json({ message: "Horarios atualizados." }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar horarios:", error);
    return NextResponse.json(
      { error: "Erro ao criar horarios." },
      { status: 500 }
    );
  }
}
