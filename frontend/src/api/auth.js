async function getCsrfToken() {
  const res = await fetch('/api/auth/csrf', { credentials: 'include' });
  const data = await res.json();
  return data.csrfToken;
}

export const auth = {
  async me() {
    const res = await fetch('/api/auth/session', { credentials: 'include' });
    const data = await res.json();
    if (!data?.user) throw new Error('Not authenticated');
    return data.user;
  },

  async loginViaEmailPassword(email, password) {
    const csrfToken = await getCsrfToken();

    // Use hidden iframe to submit form - this properly handles cookies
    return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe');
      iframe.name = 'login-frame';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      iframe.onload = async () => {
        await new Promise(r => setTimeout(r, 500));
        document.body.removeChild(iframe);
        try {
          const sessionUser = await auth.me();
          resolve(sessionUser);
        } catch {
          resolve(null);
        }
      };

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/api/auth/callback/credentials';
      form.target = 'login-frame';

      const fields = { csrfToken, email, password };
      for (const [k, v] of Object.entries(fields)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = k;
        input.value = v;
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    });
  },

  async register({ email, password, nome, telefone }) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nome, telefone }),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || 'Registro falhou');
    return data;
  },

  async resetPasswordRequest(email) {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to send reset email');
    return true;
  },

  async resetPassword({ resetToken, newPassword }) {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: resetToken, password: newPassword }),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to reset password');
    return true;
  },

  async loginViaGoogle(returnTo) {
    const callbackUrl = returnTo
      ? `${window.location.origin}${returnTo}`
      : `${window.location.origin}/`;
    const csrfToken = await getCsrfToken();
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/auth/signin/google';
    const fields = { csrfToken, callbackUrl, json: 'true' };
    for (const [k, v] of Object.entries(fields)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = k;
      input.value = v;
      form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
  },

  async logout() {
    const csrfToken = await getCsrfToken();
    const res = await fetch('/api/auth/signout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ csrfToken }),
      credentials: 'include',
    });
    return res;
  },
};
