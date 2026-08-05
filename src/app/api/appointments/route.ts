import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatTime(time: Date): string {
  return time.toISOString().split("T")[1].substring(0, 5);
}

const statusMap: Record<string, string> = {
  pending: "PENDENTE",
  confirmed: "CONFIRMADO",
  completed: "CONCLUIDO",
  cancelled: "CANCELADO",
  no_show: "NAO_COMPARECEU",
};

const statusReverseMap: Record<string, string> = {
  PENDENTE: "pending",
  CONFIRMADO: "confirmed",
  CONCLUIDO: "completed",
  CANCELADO: "cancelled",
  NAO_COMPARECEU: "no_show",
};

const paymentMap: Record<string, string> = {
  pix: "PIX",
  credit: "CARTAO_CREDITO",
  debit: "CARTAO_DEBITO",
};

const paymentReverseMap: Record<string, string> = {
  PIX: "pix",
  CARTAO_CREDITO: "credit",
  CARTAO_DEBITO: "debit",
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const data = searchParams.get("data");
    const status = searchParams.get("status");
    const profissionalNome = searchParams.get("profissionalNome");
    const sort = searchParams.get("sort") || "desc";
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (data) {
      where.data = new Date(data);
    }

    if (status) {
      const prismaStatus = statusMap[status.toUpperCase()] || status;
      where.status = prismaStatus;
    }

    if (profissionalNome) {
      where.profissional = {
        usuario: {
          nome: { contains: profissionalNome, mode: "insensitive" },
        },
      };
    }

    const agendamentos = await prisma.agendamento.findMany({
      where,
      include: {
        cliente: { include: { usuario: true } },
        profissional: { include: { usuario: true } },
        servico: true,
      },
      orderBy: { criadoEm: sort as "asc" | "desc" },
      take: limit,
    });

    const result = agendamentos.map((a) => ({
      id: a.id,
      clienteNome: a.cliente.usuario.nome,
      clienteEmail: a.cliente.usuario.email,
      clienteTelefone: a.cliente.telefone || a.cliente.usuario.telefone,
      servicoNome: a.servico.nome,
      profissionalNome: a.profissional.usuario.nome,
      data: formatDate(a.data),
      horaInicio: formatTime(a.horaInicio),
      status: statusReverseMap[a.status] || a.status.toLowerCase(),
      formaPagamento: a.formaPagamento ? paymentReverseMap[a.formaPagamento] || a.formaPagamento.toLowerCase() : "pix",
      valorTotal: Number(a.valorTotal),
      createdAt: a.criadoEm,
    }));

    return NextResponse.json({ appointments: result });
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar agendamentos." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const serviceName = body.serviceName || body.service_name;
    const professionalName = body.professionalName || body.professional_name;
    const clientName = body.clientName || body.client_name;
    const clientEmail = body.clientEmail || body.client_email;
    const clientPhone = body.clientPhone || body.client_phone;
    const paymentMethod = body.paymentMethod || body.payment_method || "pix";
    const totalPrice = body.totalPrice || body.total_price;
    const dateStr = body.date;
    const timeStr = body.time;

    const servico = await prisma.servico.findFirst({
      where: { nome: { contains: serviceName, mode: "insensitive" } },
    });
    if (!servico) {
      return NextResponse.json({ error: "Servico nao encontrado." }, { status: 404 });
    }

    let profissional = null;
    if (professionalName && professionalName !== "Indiferente") {
      profissional = await prisma.profissional.findFirst({
        where: {
          usuario: { nome: { contains: professionalName, mode: "insensitive" } },
          ativo: true,
        },
        include: { usuario: true },
      });
    }
    if (!profissional) {
      profissional = await prisma.profissional.findFirst({
        where: { ativo: true },
        include: { usuario: true },
      });
    }
    if (!profissional) {
      return NextResponse.json({ error: "Profissional nao encontrado." }, { status: 404 });
    }

    let cliente = await prisma.cliente.findFirst({
      where: { usuario: { email: clientEmail } },
      include: { usuario: true },
    });

    if (!cliente) {
      const usuario = await prisma.usuario.create({
        data: {
          email: clientEmail,
          senha: "temp_" + Date.now(),
          nome: clientName,
          telefone: clientPhone,
          role: "CLIENTE",
        },
      });
      cliente = await prisma.cliente.create({
        data: { usuarioId: usuario.id },
        include: { usuario: true },
      });
    }

    const horaInicio = new Date(`2000-01-01T${timeStr}:00`);
    const duracaoMin = body.durationMin || servico.duracaoMinutos;
    const horaFim = new Date(horaInicio.getTime() + duracaoMin * 60000);

    const prismaStatus = statusMap[body.status] || "PENDENTE";
    const prismaPayment = paymentMap[paymentMethod] || "PIX";

    const agendamento = await prisma.agendamento.create({
      data: {
        clienteId: cliente.id,
        profissionalId: profissional.id,
        servicoId: servico.id,
        data: new Date(dateStr),
        horaInicio: horaInicio,
        horaFim: horaFim,
        status: prismaStatus,
        formaPagamento: prismaPayment,
        valorTotal: totalPrice,
      },
      include: {
        cliente: { include: { usuario: true } },
        profissional: { include: { usuario: true } },
        servico: true,
      },
    });

    const mapped = {
      id: agendamento.id,
      clienteNome: agendamento.cliente.usuario.nome,
      clienteEmail: agendamento.cliente.usuario.email,
      servicoNome: agendamento.servico.nome,
      profissionalNome: agendamento.profissional.usuario.nome,
      data: formatDate(agendamento.data),
      horaInicio: formatTime(agendamento.horaInicio),
      status: statusReverseMap[agendamento.status] || agendamento.status.toLowerCase(),
      formaPagamento: paymentReverseMap[agendamento.formaPagamento] || agendamento.formaPagamento.toLowerCase(),
      valorTotal: Number(agendamento.valorTotal),
    };

    return NextResponse.json({ appointment: mapped }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao criar agendamento." },
      { status: 500 }
    );
  }
}
