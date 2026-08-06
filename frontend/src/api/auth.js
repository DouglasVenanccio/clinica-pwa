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
    const res = await fetch('/api/auth/callback/credentials?redirect=false&json=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        csrfToken,
        email,
        password,
      }),
      credentials: 'include',
    });
    if (!res.ok && res.status !== 302) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Email ou senha invalidos');
    }
    const data = await res.json().catch(() => ({ ok: true }));
    if (data?.error) throw new Error(data.error);
    return data;
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

  async logout() {
    const csrfToken = await getCsrfToken();
    await fetch(`/api/auth/signout?csrfToken=${encodeURIComponent(csrfToken)}`, {
      method: 'GET',
      credentials: 'include',
    });
  },
};
