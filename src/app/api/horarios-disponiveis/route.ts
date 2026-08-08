import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CONFIG } from "@/lib/constants";

/**
 * Converte um campo Time do Prisma (Date) para string "HH:MM".
 */
function timeToString(d: Date): string {
  return d.toISOString().substring(11, 16);
}

/**
 * Converte "HH:MM" para minutos desde meia-noite.
 */
function toMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function fmt(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

/**
 * GET /api/horarios-disponiveis?profissionalId=&data=YYYY-MM-DD&servicoId=
 * Lista os horarios livres de um profissional em uma data, respeitando
 * horario de atendimento, duracao do servico, conflitos de agendamento,
 * bloqueios e antecia minima.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profissionalId = searchParams.get("profissionalId");
    const dataStr = searchParams.get("data");
    const servicoId = searchParams.get("servicoId");

    if (!profissionalId || !dataStr) {
      return NextResponse.json(
        { error: "Parametros obrigatorios: profissionalId e data." },
        { status: 400 }
      );
    }

    // Meio-dia UTC para evitar deslocamento de fuso que muda o dia
    const data = new Date(`${dataStr}T12:00:00`);
    if (isNaN(data.getTime())) {
      return NextResponse.json({ error: "Data invalida." }, { status: 400 });
    }

    const diaSemana = data.getDay();

    // Horario de atendimento do profissional naquele dia
    const horario = await prisma.horarioDisponivel.findUnique({
      where: {
        profissionalId_diaSemana: { profissionalId, diaSemana },
      },
    });

    if (!horario || !horario.ativo) {
      return NextResponse.json({ horarios: [] });
    }

    // Duracao do servico (define o passo do slot)
    let duracaoMinutos = 60;
    if (servicoId) {
      const servico = await prisma.servico.findUnique({
        where: { id: servicoId },
        select: { duracaoMinutos: true },
      });
      if (servico) duracaoMinutos = servico.duracaoMinutos;
    }

    const inicio = toMin(timeToString(horario.horaInicio));
    const fim = toMin(timeToString(horario.horaFim));

    // Conflitos: agendamentos nao-cancelados do profissional no dia
    const conflitos = await prisma.agendamento.findMany({
      where: {
        profissionalId,
        data,
        status: { notIn: ["CANCELADO"] },
      },
      select: { horaInicio: true, horaFim: true },
    });
    const ocupados = conflitos.map((c) => ({
      inicio: toMin(timeToString(c.horaInicio)),
      fim: toMin(timeToString(c.horaFim)),
    }));

    // Bloqueios do profissional no periodo
    const bloqueios = await prisma.bloqueioHorario.findMany({
      where: {
        profissionalId,
        dataInicio: { lte: data },
        OR: [{ dataFim: null }, { dataFim: { gte: data } }],
      },
    });
    const bloqueados = bloqueios.map((bl) => ({
      inicio: bl.horaInicio ? toMin(timeToString(bl.horaInicio)) : 0,
      fim: bl.horaFim ? toMin(timeToString(bl.horaFim)) : 24 * 60,
    }));

    // Anteccia minima: no dia de hoje, nao oferecer horarios que ja passaram
    const agora = new Date();
    const hojeStr = agora.toISOString().substring(0, 10);
    const antecciaMinutos = CONFIG.ANTENCIA_MINIMA_AGENDAMENTO_MINUTOS;
    const minAgora =
      dataStr === hojeStr
        ? toMin(timeToString(agora)) + antecciaMinutos
        : 0;

    const horarios: string[] = [];
    for (let t = inicio; t + duracaoMinutos <= fim; t += 30) {
      if (t < minAgora) continue;
      const tFim = t + duracaoMinutos;
      const ocupado = ocupados.some((o) => o.inicio < tFim && o.fim > t);
      const bloqueado = bloqueados.some((b) => b.inicio < tFim && b.fim > t);
      if (!ocupado && !bloqueado) {
        horarios.push(fmt(t));
      }
    }

    return NextResponse.json({ horarios });
  } catch (error) {
    console.error("Erro ao buscar horarios disponiveis:", error);
    return NextResponse.json(
      { error: "Erro ao buscar horarios disponiveis." },
      { status: 500 }
    );
  }
}
