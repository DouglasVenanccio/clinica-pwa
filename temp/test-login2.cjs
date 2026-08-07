const http = require('http');

function req(path, method, headers, body) {
  return new Promise((resolve, reject) => {
    const r = http.request({ hostname: 'localhost', port: 3000, path, method, headers }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        const setCookies = res.headers['set-cookie'] || [];
        resolve({ status: res.statusCode, headers: res.headers, body: data, setCookies });
      });
    });
    r.on('error', reject);
    if (body) r.write(body);
    r.end();
  });
}

function parseCookies(setCookies) {
  return setCookies.map(c => c.split(';')[0]).join('; ');
}

async function main() {
  // 1. Get CSRF with cookie jar
  const csrf = await req('/api/auth/csrf', 'GET', {});
  const csrfCookies = parseCookies(csrf.setCookies);
  const { csrfToken } = JSON.parse(csrf.body);
  console.log('CSRF OK, cookies:', csrfCookies);

  // 2. Login with cookies
  const loginBody = new URLSearchParams({ csrfToken, email: 'admin@clinica.com', password: '12345678' }).toString();
  const login = await req('/api/auth/callback/credentials?redirect=false&json=true', 'POST', {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(loginBody),
    'Cookie': csrfCookies,
  }, loginBody);
  console.log('LOGIN STATUS:', login.status);
  const loginCookies = parseCookies(login.setCookies);
  console.log('LOGIN COOKIES:', loginCookies);

  // 3. Merge cookies
  const allCookies = [csrfCookies, loginCookies].filter(Boolean).join('; ');
  console.log('ALL COOKIES:', allCookies);

  // 4. Session check
  const session = await req('/api/auth/session', 'GET', { Cookie: allCookies });
  console.log('SESSION:', session.body);
}

main().catch(console.error);
