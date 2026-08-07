const http = require('http');

function req(path, method, headers, body) {
  return new Promise((resolve, reject) => {
    const r = http.request({ hostname: 'localhost', port: 3000, path, method, headers }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    r.on('error', reject);
    if (body) r.write(body);
    r.end();
  });
}

async function main() {
  // 1. Get CSRF
  const csrf = await req('/api/auth/csrf', 'GET');
  const { csrfToken } = JSON.parse(csrf.body);
  console.log('CSRF OK');

  // 2. Login
  const loginBody = new URLSearchParams({ csrfToken, email: 'admin@clinica.com', password: '12345678' }).toString();
  const login = await req('/api/auth/callback/credentials?redirect=false&json=true', 'POST', {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(loginBody),
  }, loginBody);
  console.log('LOGIN STATUS:', login.status);
  console.log('SET-COOKIE:', JSON.stringify(login.headers['set-cookie']));

  // 3. Session with cookies
  const cookies = (login.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ');
  console.log('COOKIES:', cookies);

  const session = await req('/api/auth/session', 'GET', { Cookie: cookies });
  console.log('SESSION:', session.body);
}

main().catch(console.error);
