import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripSensitiveMany } from "@/lib/api-helpers";

/**
 * GET /api/appointments
 * Lista agendamentos com joins de cliente/servico/profissional.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const data = searchParams.get("data");
    const status = searchParams.get("status");
    const profissionalNome = searchParams.get("profissionalNome");
    const limit = Number(searchParams.get("limit") || "200");

    const where: Record<string, unknown> = {};
    if (data) {
      const start = new Date(`${data}T00:00:00Z`);
      const end = new Date(`${data}T23:59:59Z`);
      where.data = { gte: start, lte: end };
    }
    if (status) {
      where.status = status.toUpperCase();
    }
    if (profissionalNome) {
      where.profissional = {
        usuario: { nome: { contains: profissionalNome, mode: "insensitive" } },
      };
    }

    const agendamentos = await prisma.agendamento.findMany({
      where,
      select: {
        id: true,
        data: true,
        horaInicio: true,
        horaFim: true,
        valorTotal: true,
        status: true,
        formaPagamento: true,
        criadoEm: true,
        cliente: {
          select: {
            id: true,
            pontosFidelidade: true,
            telefone: true,
            usuario: { select: { id: true, nome: true, email: true, telefone: true, avatar: true, role: true } },
          },
        },
        profissional: {
          select: {
            id: true,
            especialidade: true,
            bio: true,
            ativo: true,
            rating: true,
            usuario: { select: { id: true, nome: true, email: true, telefone: true, avatar: true, role: true } },
          },
        },
        servico: true,
      },
      orderBy: [{ data: "desc" }, { horaInicio: "desc" }],
      take: limit,
    });

    const appointments = agendamentos.map((a) => ({
      id: a.id,
      clienteNome: a.cliente?.usuario?.nome || "",
      clienteEmail: a.cliente?.usuario?.email || "",
      clienteTelefone: a.cliente?.usuario?.telefone || "",
      servicoNome: a.servico?.nome || "",
      profissionalNome: a.profissional?.usuario?.nome || "",
      data: a.data,
      horaInicio: a.horaInicio,
      horaFim: a.horaFim,
      valorTotal: a.valorTotal,
      status: a.status,
      formaPagamento: a.formaPagamento,
      criadoEm: a.criadoEm,
      cliente: a.cliente,
      profissional: a.profissional,
      servico: a.servico,
    }));

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return NextResponse.json({ error: "Erro ao buscar agendamentos." }, { status: 500 });
  }
}

/**
 * POST /api/appointments
 * Cria um novo agendamento.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Buscar cliente por email
    let clienteId: string | null = null;
    if (body.clientEmail) {
      const usuario = await prisma.usuario.findUnique({
        where: { email: body.clientEmail },
        include: { cliente: true },
      });
      clienteId = usuario?.cliente?.id || null;
    }

    // Buscar profissional por nome
    let profissionalId: string | null = null;
    if (body.professionalName) {
      const prof = await prisma.profissional.findFirst({
        where: { usuario: { nome: { contains: body.professionalName, mode: "insensitive" } } },
      });
      profissionalId = prof?.id || null;
    }

    // Buscar servico por nome
    let servicoId: string | null = null;
    if (body.serviceName) {
      const serv = await prisma.servico.findFirst({
        where: { nome: { contains: body.serviceName, mode: "insensitive" } },
      });
      servicoId = serv?.id || null;
    }

    const time = body.time || "09:00";
    const [h, m] = time.split(":").map(Number);

    const agendamento = await prisma.agendamento.create({
      data: {
        clienteId: clienteId || "",
        profissionalId: profissionalId || "",
        servicoId: servicoId || "",
        data: new Date(body.date || new Date()),
        horaInicio: new Date(`1970-01-01T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00Z`),
        horaFim: new Date(`1970-01-01T${String(h + 1).padStart(2, "0")}:${String(m).padStart(2, "0")}:00Z`),
        status: (body.status?.toUpperCase() || "PENDENTE") as any,
        formaPagamento: body.paymentMethod?.toUpperCase() || "PIX" as any,
        valorTotal: body.totalPrice || 0,
        observacoes: "",
      },
      select: {
        id: true,
        data: true,
        horaInicio: true,
        horaFim: true,
        valorTotal: true,
        status: true,
        formaPagamento: true,
        criadoEm: true,
        cliente: {
          select: {
            id: true,
            pontosFidelidade: true,
            telefone: true,
            usuario: { select: { id: true, nome: true, email: true, telefone: true, avatar: true, role: true } },
          },
        },
        profissional: {
          select: {
            id: true,
            especialidade: true,
            bio: true,
            ativo: true,
            rating: true,
            usuario: { select: { id: true, nome: true, email: true, telefone: true, avatar: true, role: true } },
          },
        },
        servico: true,
      },
    });

    return NextResponse.json({ appointment: agendamento }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return NextResponse.json({ error: "Erro ao criar agendamento." }, { status: 500 });
  }
}
