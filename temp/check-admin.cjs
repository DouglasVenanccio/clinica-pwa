const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.usuario.findUnique({
    where: { email: 'admin@clinica.com' },
    select: { id: true, email: true, nome: true, role: true, senha: true }
  });
  console.log('USER:', JSON.stringify(user, null, 2));

  if (user && user.senha) {
    const match = await bcrypt.compare('12345678', user.senha);
    console.log('PASSWORD MATCH:', match);
  } else {
    console.log('NO USER OR NO PASSWORD');
  }

  // Also test login via API
  const fetch = globalThis.fetch || (await import('node-fetch')).default;
  const csrfRes = await fetch('http://localhost:3000/api/auth/csrf');
  const csrfData = await csrfRes.json();
  console.log('CSRF:', csrfData.csrfToken);

  const loginRes = await fetch('http://localhost:3000/api/auth/callback/credentials?redirect=false&json=true', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      csrfToken: csrfData.csrfToken,
      email: 'admin@clinica.com',
      password: '12345678',
    }),
    redirect: 'manual',
  });
  console.log('LOGIN STATUS:', loginRes.status);
  const cookies = loginRes.headers.getSetCookie?.() || loginRes.headers.raw?.()['set-cookie'] || [];
  console.log('SET-COOKIE:', JSON.stringify(cookies));

  const sessionRes = await fetch('http://localhost:3000/api/auth/session', {
    headers: { Cookie: cookies.map(c => c.split(';')[0]).join('; ') }
  });
  const sessionData = await sessionRes.json();
  console.log('SESSION:', JSON.stringify(sessionData, null, 2));

  await prisma.$disconnect();
}

main().catch(console.error);
