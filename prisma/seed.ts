import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

/**
 * Seed do banco de dados.
 * Cria dados iniciais para desenvolvimento e teste.
 *
 * Run: npx tsx prisma/seed.ts
 */
async function main() {
  console.log("Iniciando seed...");

  const senhaHash = await bcrypt.hash("12345678", 12);

  // ========== USUARIOS ==========
  console.log("Criando usuarios...");

  const admin = await prisma.usuario.upsert({
    where: { email: "admin@clinica.com" },
    update: {},
    create: {
      email: "admin@clinica.com",
      senha: senhaHash,
      nome: "Administrador",
      telefone: "(21) 99999-0000",
      role: "ADMIN",
    },
  });

  const cliente1 = await prisma.usuario.upsert({
    where: { email: "juliana@email.com" },
    update: {},
    create: {
      email: "juliana@email.com",
      senha: senhaHash,
      nome: "Juliana Silva",
      telefone: "(21) 99999-1111",
      role: "CLIENTE",
    },
  });

  const cliente2 = await prisma.usuario.upsert({
    where: { email: "carlos@email.com" },
    update: {},
    create: {
      email: "carlos@email.com",
      senha: senhaHash,
      nome: "Carlos Mendes",
      telefone: "(21) 99999-2222",
      role: "CLIENTE",
    },
  });

  const cliente3 = await prisma.usuario.upsert({
    where: { email: "fernanda@email.com" },
    update: {},
    create: {
      email: "fernanda@email.com",
      senha: senhaHash,
      nome: "Fernanda Alves",
      telefone: "(21) 99999-3333",
      role: "CLIENTE",
    },
  });

  const prof1 = await prisma.usuario.upsert({
    where: { email: "ana@clinica.com" },
    update: {},
    create: {
      email: "ana@clinica.com",
      senha: senhaHash,
      nome: "Dra. Ana Beatriz",
      telefone: "(21) 99999-4444",
      role: "PROFISSIONAL",
    },
  });

  const prof2 = await prisma.usuario.upsert({
    where: { email: "pedro@clinica.com" },
    update: {},
    create: {
      email: "pedro@clinica.com",
      senha: senhaHash,
      nome: "Dr. Pedro Santos",
      telefone: "(21) 99999-5555",
      role: "PROFISSIONAL",
    },
  });

  const prof3 = await prisma.usuario.upsert({
    where: { email: "joao@clinica.com" },
    update: {},
    create: {
      email: "joao@clinica.com",
      senha: senhaHash,
      nome: "Joao Oliveira",
      telefone: "(21) 99999-6666",
      role: "PROFISSIONAL",
    },
  });

  // ========== CLIENTES ==========
  console.log("Criando clientes...");

  for (const userId of [cliente1.id, cliente2.id, cliente3.id]) {
    await prisma.cliente.upsert({
      where: { usuarioId: userId },
      update: {},
      create: { usuarioId: userId },
    });
  }

  // ========== PROFISSIONAIS ==========
  console.log("Criando profissionais...");

  const profDb1 = await prisma.profissional.upsert({
    where: { usuarioId: prof1.id },
    update: {},
    create: {
      usuarioId: prof1.id,
      especialidade: "Estetica Facial e Corporal",
      biografia: "Especialista em tratamentos faciais e corporais com 10 anos de experiencia.",
      tempoServicoMin: 60,
    },
  });

  const profDb2 = await prisma.profissional.upsert({
    where: { usuarioId: prof2.id },
    update: {},
    create: {
      usuarioId: prof2.id,
      especialidade: "Fisioterapia Ortopedica",
      biografia: "Fisioterapeuta especializado em reabilitacao ortopedica e esportiva.",
      tempoServicoMin: 50,
    },
  });

  const profDb3 = await prisma.profissional.upsert({
    where: { usuarioId: prof3.id },
    update: {},
    create: {
      usuarioId: prof3.id,
      especialidade: "Massagem Terapeutica",
      biografia: "Terapeuta especializado em massagens relaxantes e terapeuticas.",
      tempoServicoMin: 60,
    },
  });

  // ========== CATEGORIAS ==========
  console.log("Criando categorias...");

  const catEstetica = await prisma.categoria.upsert({
    where: { id: "cat-estetica" },
    update: {},
    create: {
      id: "cat-estetica",
      nome: "Estetica",
      descricao: "Tratamentos esteticos faciais e corporais",
      ativo: true,
    },
  });

  const catFisio = await prisma.categoria.upsert({
    where: { id: "cat-fisioterapia" },
    update: {},
    create: {
      id: "cat-fisioterapia",
      nome: "Fisioterapia",
      descricao: "Tratamentos fisioterapeuticos",
      ativo: true,
    },
  });

  const catMassagem = await prisma.categoria.upsert({
    where: { id: "cat-massagem" },
    update: {},
    create: {
      id: "cat-massagem",
      nome: "Massagens",
      descricao: "Massagens relaxantes e terapeuticas",
      ativo: true,
    },
  });

  // ========== SERVICOS ==========
  console.log("Criando servicos...");

  const servicoLimpeza = await prisma.servico.upsert({
    where: { id: "srv-limpeza" },
    update: {},
    create: {
      id: "srv-limpeza",
      nome: "Limpeza de Pele",
      descricao: "Remove impurezas e celulas mortas, promovendo uma pele renovada e luminosa.",
      duracaoMinutos: 60,
      preco: 150.0,
      categoriaId: catEstetica.id,
      ativo: true,
    },
  });

  const servicoMassagem = await prisma.servico.upsert({
    where: { id: "srv-massagem" },
    update: {},
    create: {
      id: "srv-massagem",
      nome: "Massagem Relaxante",
      descricao: "Alivio de tensao e relaxamento profundo dos musculos.",
      duracaoMinutos: 60,
      preco: 150.0,
      categoriaId: catMassagem.id,
      ativo: true,
    },
  });

  const servicoVentosa = await prisma.servico.upsert({
    where: { id: "srv-ventosa" },
    update: {},
    create: {
      id: "srv-ventosa",
      nome: "Ventosaterapia",
      descricao: "Terapia que auxilia na circulacao sanguinea e eliminacao de toxinas.",
      duracaoMinutos: 45,
      preco: 150.0,
      categoriaId: catEstetica.id,
      ativo: true,
    },
  });

  const servicoFisio = await prisma.servico.upsert({
    where: { id: "srv-fisioterapia" },
    update: {},
    create: {
      id: "srv-fisioterapia",
      nome: "Fisioterapia",
      descricao: "Tratamentos personalizados para reabilitacao e alivio de dores.",
      duracaoMinutos: 50,
      preco: 150.0,
      categoriaId: catFisio.id,
      ativo: true,
    },
  });

  // ========== HORARIOS DOS PROFISSIONAIS ==========
  console.log("Criando horarios...");

  // HorarioDisponivel: unique em [profissionalId, diaSemana]
  // horaInicio/horaFim sao DateTime @db.Time()
  const horariosBase = [
    { dia: 1, ini: "08:00", fim: "12:00" },
    { dia: 1, ini: "14:00", fim: "18:00" },
    { dia: 2, ini: "08:00", fim: "12:00" },
    { dia: 2, ini: "14:00", fim: "18:00" },
    { dia: 3, ini: "08:00", fim: "12:00" },
    { dia: 3, ini: "14:00", fim: "18:00" },
    { dia: 4, ini: "08:00", fim: "12:00" },
    { dia: 4, ini: "14:00", fim: "18:00" },
    { dia: 5, ini: "08:00", fim: "12:00" },
    { dia: 5, ini: "14:00", fim: "18:00" },
    { dia: 6, ini: "08:00", fim: "12:00" },
  ];

  for (const prof of [profDb1, profDb2, profDb3]) {
    for (const h of horariosBase) {
      await prisma.horarioDisponivel.upsert({
        where: {
          profissionalId_diaSemana: {
            profissionalId: prof.id,
            diaSemana: h.dia,
          },
        },
        update: {},
        create: {
          profissionalId: prof.id,
          diaSemana: h.dia,
          horaInicio: new Date(`1970-01-01T${h.ini}:00Z`),
          horaFim: new Date(`1970-01-01T${h.fim}:00Z`),
          ativo: true,
        },
      });
    }
  }

  // ========== SERVICOS DOS PROFISSIONAIS ==========
  console.log("Vinculando servicos aos profissionais...");

  const vinculos = [
    { profId: profDb1.id, servId: servicoLimpeza.id },
    { profId: profDb1.id, servId: servicoVentosa.id },
    { profId: profDb2.id, servId: servicoFisio.id },
    { profId: profDb3.id, servId: servicoMassagem.id },
  ];

  for (const v of vinculos) {
    await prisma.profissionalServico.upsert({
      where: {
        profissionalId_servicoId: {
          profissionalId: v.profId,
          servicoId: v.servId,
        },
      },
      update: {},
      create: {
        profissionalId: v.profId,
        servicoId: v.servId,
      },
    });
  }

  console.log("Seed concluido com sucesso!");
  console.log("Dados criados:");
  console.log("- Admin: admin@clinica.com / 12345678");
  console.log("- Clientes: juliana@email.com, carlos@email.com, fernanda@email.com / 12345678");
  console.log("- Profissionais: ana@clinica.com, pedro@clinica.com, joao@clinica.com / 12345678");
  console.log("- 4 servicos, 3 categorias, horarios configurados");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
