import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { STATUS_AGENDAMENTO } from "@/lib/constants";

function timeToString(d: Date): string {
  return d.toISOString().substring(11, 16);
}

function horaParaMinutos(h: string): number {
  const [horas, mins] = h.split(":").map(Number);
  return horas * 60 + mins;
}

/**
 * GET /api/horarios-disponiveis?profissionalId=xxx&data=2025-08-06&servicoId=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profissionalId = searchParams.get("profissionalId");
    const data = searchParams.get("data");
    const servicoId = searchParams.get("servicoId");

    if (!profissionalId || !data || !servicoId) {
      return NextResponse.json(
        { error: "profissionalId, data e servicoId sao obrigatorios." },
        { status: 400 }
      );
    }

    const servico = await prisma.servico.findUnique({
      where: { id: servicoId },
    });
    if (!servico) {
      return NextResponse.json(
        { error: "Servico nao encontrado." },
        { status: 404 }
      );
    }

    const dataObj = new Date(data + "T12:00:00");
    const diaSemana = dataObj.getDay();

    const horarioDisponivel = await prisma.horarioDisponivel.findUnique({
      where: {
        profissionalId_diaSemana: {
          profissionalId,
          diaSemana,
        },
      },
    });

    if (!horarioDisponivel || !horarioDisponivel.ativo) {
      return NextResponse.json({ horarios: [] });
    }

    const agendamentos = await prisma.agendamento.findMany({
      where: {
        profissionalId,
        data: dataObj,
        status: { notIn: [STATUS_AGENDAMENTO.CANCELADO] },
      },
      select: {
        horaInicio: true,
        horaFim: true,
      },
    });

    const bloqueios = await prisma.bloqueioHorario.findMany({
      where: {
        profissionalId,
        dataInicio: { lte: dataObj },
        OR: [
          { dataFim: null },
          { dataFim: { gte: dataObj } },
        ],
      },
      select: {
        horaInicio: true,
        horaFim: true,
      },
    });

    const strAbertura = timeToString(horarioDisponivel.horaInicio);
    const strFechamento = timeToString(horarioDisponivel.horaFim);
    const minAbertura = horaParaMinutos(strAbertura);
    const minFechamento = horaParaMinutos(strFechamento);

    const minutosDuracao = servico.duracaoMinutos;
    const horarios: string[] = [];
    const agora = new Date();
    const isToday = dataObj.toDateString() === agora.toDateString();

    let minAtual = minAbertura;

    while (minAtual + minutosDuracao <= minFechamento) {
      const h = Math.floor(minAtual / 60);
      const m = minAtual % 60;
      const horaInicio = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

      const dataInicioSlot = new Date(dataObj);
      dataInicioSlot.setHours(h, m, 0, 0);

      const dataFimSlot = new Date(dataInicioSlot.getTime() + minutosDuracao * 60 * 1000);
      const horaFim = `${String(dataFimSlot.getHours()).padStart(2, "0")}:${String(dataFimSlot.getMinutes()).padStart(2, "0")}`;

      if (isToday && dataInicioSlot <= agora) {
        minAtual += 30;
        continue;
      }

      const temConflitoAgendamento = agendamentos.some((ag) => {
        const agInicio = timeToString(ag.horaInicio);
        const agFim = timeToString(ag.horaFim);
        return agInicio < horaFim && agFim > horaInicio;
      });

      const temConflitoBloqueio = bloqueios.some((bl) => {
        const blInicio = bl.horaInicio ? timeToString(bl.horaInicio) : "00:00";
        const blFim = bl.horaFim ? timeToString(bl.horaFim) : "23:59";
        return blInicio < horaFim && blFim > horaInicio;
      });

      if (!temConflitoAgendamento && !temConflitoBloqueio) {
        horarios.push(horaInicio);
      }

      minAtual += 30;
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
