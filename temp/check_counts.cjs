const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const models = [
    ['servico', () => prisma.servico.count()],
    ['categoria', () => prisma.categoria.count()],
    ['profissional', () => prisma.profissional.count()],
    ['cliente', () => prisma.cliente.count()],
    ['usuario', () => prisma.usuario.count()],
    ['agendamento', () => prisma.agendamento.count()],
    ['configuracao', () => prisma.configuracao.count()],
    ['avaliacao', () => prisma.avaliacao.count()],
    ['pagamento', () => prisma.pagamento.count()],
    ['promocao', () => prisma.promocao.count()],
  ];
  for (const [name, fn] of models) {
    try {
      const c = await fn();
      console.log(`${name}: ${c}`);
    } catch(e) { console.log(`${name}: ERROR - ${e.message.substring(0,80)}`); }
  }
}
main().finally(() => prisma.$disconnect());
