const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('12345678', 12);
  console.log('NEW HASH:', hash);

  const match = await bcrypt.compare('12345678', hash);
  console.log('VERIFY:', match);

  await prisma.usuario.update({
    where: { email: 'admin@clinica.com' },
    data: { senha: hash },
  });
  console.log('UPDATED');

  // Verify
  const user = await prisma.usuario.findUnique({
    where: { email: 'admin@clinica.com' },
    select: { senha: true }
  });
  const verify = await bcrypt.compare('12345678', user.senha);
  console.log('FINAL VERIFY:', verify);

  await prisma.$disconnect();
}

main().catch(console.error);
