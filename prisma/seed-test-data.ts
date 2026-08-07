import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Script para adicionar dados de teste completos.
 * Pode ser executado multiplas vezes sem duplicar.
 */
async function main() {
  console.log("=== Adicionando dados de teste ===\n");

  // Buscar dados existentes
  const usuarios = await prisma.usuario.findMany({ include: { cliente: true, profissional: true } });
  const servicos = await prisma.servico.findMany({ where: { ativo: true } });

  const clientes = usuarios.filter(u => u.cliente).map(u => ({ userId: u.id, clienteId: u.cliente!.id }));
  const profissionais = usuarios.filter(u => u.profissional).map(u => ({ userId: u.id, profissionalId: u.profissional!.id }));

  if (servicos.length === 0 || profissionais.length === 0) {
    console.error("Execute o seed.ts primeiro para criar dados base!");
    return;
  }

  // ========== CONFIGURACOES ==========
  console.log("1. Criando configuracoes...");
  const configs = [
    { chave: "nome_clinica", valor: "Beleza & Bem-Estar" },
    { chave: "telefone", valor: "(21) 99999-0000" },
    { chave: "email_contato", valor: "contato@belezabem.com.br" },
    { chave: "endereco", valor: "Rua das Flores, 123 - Jardim Primavera, Rio de Janeiro" },
    { chave: "horario_abertura", valor: "08:00" },
    { chave: "horario_fechamento", valor: "20:00" },
    { chave: "slot_duration_min", valor: "60" },
    { chave: "antecedencia_cancelamento_h", valor: "24" },
    { chave: "desconto_pix", valor: "5" },
    { chave: "lembrete_whatsapp", valor: "true" },
    { chave: "lembrete_horas_antes", valor: "24" },
    { chave: "site_title", valor: "Beleza & Bem-Estar" },
  ];

  for (const c of configs) {
    await prisma.configuracao.upsert({
      where: { chave: c.chave },
      update: { valor: c.valor },
      create: c,
    });
  }
  console.log(`  ${configs.length} configuracoes criadas`);

  // ========== PROMOCOES ==========
  console.log("2. Criando promocoes...");
  const now = new Date();
  const promos = [
    {
      titulo: "Pacote Relax 3x",
      descricao: "3 massagens relaxantes com 15% de desconto",
      desconto: 15,
      dataInicio: new Date(now.getFullYear(), now.getMonth(), 1),
      dataFim: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      ativo: true,
    },
    {
      titulo: "Promo de Inverno",
      descricao: "Todos os servicos de estetica com 10% off no PIX",
      desconto: 10,
      dataInicio: new Date(now.getFullYear(), now.getMonth(), 1),
      dataFim: new Date(now.getFullYear(), now.getMonth() + 2, 0),
      ativo: true,
    },
  ];

  for (const p of promos) {
    const existing = await prisma.promocao.findFirst({ where: { titulo: p.titulo } });
    if (!existing) {
      await prisma.promocao.create({ data: p });
    }
  }
  console.log(`  ${promos.length} promocoes criadas`);

  // ========== AGENDAMENTOS ==========
  console.log("3. Criando agendamentos...");
  if (clientes.length === 0) {
    console.log("  Sem clientes, pulando agendamentos");
  } else {
    const today = new Date();
    const agendamentos = [];

    for (let dayOffset = -5; dayOffset <= 7; dayOffset++) {
      const date = new Date(today);
      date.setDate(date.getDate() + dayOffset);
      if (date.getDay() === 0) continue; // skip Sunday

      const clienteIdx = Math.abs(dayOffset) % clientes.length;
      const profIdx = Math.abs(dayOffset + 1) % profissionais.length;
      const servicoIdx = Math.abs(dayOffset) % servicos.length;
      const hours = [9, 10, 11, 14, 15, 16];
      const hour = hours[Math.abs(dayOffset) % hours.length];

      let status: string;
      if (dayOffset < -1) status = "completed";
      else if (dayOffset === -1) status = "completed";
      else if (dayOffset === 0) status = "confirmed";
      else status = "confirmed";

      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const timeStr = `${String(hour).padStart(2, "0")}:00`;

      const existing = await prisma.agendamento.findFirst({
        where: {
          clienteId: clientes[clienteIdx].clienteId,
          profissionalId: profissionais[profIdx].profissionalId,
          data: new Date(`${dateStr}T00:00:00Z`),
          hora: new Date(`1970-01-01T${timeStr}:00Z`),
        },
      });

      if (!existing) {
        agendamentos.push({
          clienteId: clientes[clienteIdx].clienteId,
          profissionalId: profissionais[profIdx].profissionalId,
          servicoId: servicos[servicoIdx].id,
          data: new Date(`${dateStr}T00:00:00Z`),
          hora: new Date(`1970-01-01T${timeStr}:00Z`),
          status: status as any,
          valorTotal: Number(servicos[servicoIdx].preco),
          metodoPagamento: dayOffset % 2 === 0 ? "pix" : "cartao_credito" as any,
          observacoes: dayOffset === 0 ? "Primeira visita" : null,
        });
      }
    }

    for (const a of agendamentos) {
      await prisma.agendamento.create({ data: a });
    }
    console.log(`  ${agendamentos.length} agendamentos criados`);
  }

  // ========== PAGAMENTOS ==========
  console.log("4. Criando pagamentos...");
  const agendamentosPagos = await prisma.agendamento.findMany({
    where: { status: "completed" },
    take: 10,
  });

  let pagamentosCriados = 0;
  for (const ag of agendamentosPagos) {
    const existing = await prisma.pagamento.findFirst({
      where: { agendamentoId: ag.id },
    });
    if (!existing) {
      await prisma.pagamento.create({
        data: {
          agendamentoId: ag.id,
          valor: ag.valorTotal,
          metodo: ag.metodoPagamento || "pix",
          status: "pago",
          dataPagamento: ag.data,
        },
      });
      pagamentosCriados++;
    }
  }
  console.log(`  ${pagamentosCriados} pagamentos criados`);

  // ========== AVALIACOES ==========
  console.log("5. Criando avaliacoes...");
  const agendamentosAvaliacao = await prisma.agendamento.findMany({
    where: { status: "completed" },
    take: 5,
  });

  let avaliacoesCriadas = 0;
  for (let i = 0; i < agendamentosAvaliacao.length; i++) {
    const ag = agendamentosAvaliacao[i];
    const existing = await prisma.avaliacao.findFirst({
      where: { agendamentoId: ag.id },
    });
    if (!existing) {
      const notas = [5, 4, 5, 5, 4];
      const comentarios = [
        "Excelente atendimento! Super recomendo.",
        "Muito bom, profissional atencioso.",
        "Amei! Ambiente relaxante e servico top.",
        "Sempre satisfeita com o atendimento.",
        "Bom atendimento, voltarei com certeza.",
      ];
      await prisma.avaliacao.create({
        data: {
          agendamentoId: ag.id,
          clienteId: ag.clienteId,
          profissionalId: ag.profissionalId,
          nota: notas[i],
          comentario: comentarios[i],
        },
      });
      avaliacoesCriadas++;
    }
  }
  console.log(`  ${avaliacoesCriadas} avaliacoes criadas`);

  // ========== CLIENTE FIDELIDADE ==========
  console.log("6. Atualizando pontos de fidelidade...");
  for (const c of clientes) {
    const totalPagos = await prisma.pagamento.aggregate({
      where: {
        agendamento: { clienteId: c.clienteId },
        status: "pago",
      },
      _sum: { valor: true },
    });
    const pontos = Math.floor(Number(totalPagos._sum.valor || 0));
    await prisma.cliente.update({
      where: { id: c.clienteId },
      data: { pontosFidelidade: pontos },
    });
  }
  console.log("  Pontos de fidelidade atualizados");

  console.log("\n=== Dados de teste adicionados com sucesso! ===");
}

main()
  .catch((e) => {
    console.error("Erro:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
