import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { base44 } from '@/api/base44Client';
import {
  ArrowLeft, UserPlus, Trash2, Loader2, Mail, Shield, User as UserIcon, Briefcase,
} from 'lucide-react';

const ROLE_OPTIONS = [
  { value: 'user', label: 'Cliente', icon: UserIcon },
  { value: 'colaborador', label: 'Colaborador', icon: Briefcase },
  { value: 'admin', label: 'Administrador', icon: Shield },
];

const ROLE_BADGE = {
  admin: 'bg-red-50 text-red-700',
  colaborador: 'bg-[#B67D35]/10 text-[#B67D35]',
  user: 'bg-blue-50 text-blue-700',
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('user');
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.User.list();
      setUsers(data || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setInviting(true);
    setError('');
    try {
      await base44.users.inviteUser(inviteEmail, inviteRole === 'colaborador' ? 'user' : inviteRole);
      setInviteEmail('');
      await load();
      // If colaborador, find the newly invited user and update role
      if (inviteRole === 'colaborador') {
        const refreshed = await base44.entities.User.list();
        const target = (refreshed || []).find((u) => u.email === inviteEmail);
        if (target) {
          await base44.entities.User.update(target.id, { role: 'colaborador' });
        }
        load();
      }
    } catch (e) {
      setError(e.message || 'Falha ao enviar convite.');
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await base44.entities.User.update(userId, { role: newRole });
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (targetUser) => {
    if (!window.confirm(`Remover ${targetUser.full_name || targetUser.email}?`)) return;
    try {
      await base44.entities.User.delete(targetUser.id);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex bg-[#fcf9f6] min-h-screen">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-[#E0DCD6] px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3 ml-10 lg:ml-0">
            <Link to="/admin" className="w-9 h-9 rounded-full hover:bg-[#F5EFE6] flex items-center justify-center text-[#2b2622]/60">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="font-display font-bold text-xl text-[#2b2622]">Usuários & Acessos</h1>
              <p className="text-xs text-[#2b2622]/50">{users.length} usuários cadastrados</p>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 space-y-6">
          {/* Invite form */}
          <div className="bg-white border border-[#E0DCD6] rounded-2xl p-5">
            <h2 className="text-xs uppercase tracking-widest text-[#2b2622]/50 font-medium mb-4 flex items-center gap-2">
              <UserPlus size={15} className="text-[#B67D35]" /> Convidar novo usuário
            </h2>
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[220px]">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2622]/40" />
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="E-mail do convidado"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-[#E0DCD6] rounded-lg text-[#2b2622] placeholder:text-[#2b2622]/30 focus:outline-none focus:border-[#B67D35]"
                />
              </div>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="px-3.5 py-2 text-sm border border-[#E0DCD6] rounded-lg text-[#2b2622] focus:outline-none focus:border-[#B67D35]"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <button
                onClick={handleInvite}
                disabled={!inviteEmail || inviting}
                className="px-5 py-2 bg-[#B67D35] hover:bg-[#9c6829] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                {inviting ? <Loader2 className="animate-spin" size={15} /> : <UserPlus size={15} />}
                Enviar convite
              </button>
            </div>
            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            <p className="text-[11px] text-[#2b2622]/40 mt-2">
              O convite será enviado por e-mail. Para colaboradores, o nível de acesso é ajustado após o cadastro.
            </p>
          </div>

          {/* Users table */}
          <div className="bg-white border border-[#E0DCD6] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#fcf9f6] text-[10px] uppercase tracking-widest text-[#2b2622]/50">
                    <th className="text-left font-medium px-5 py-3">Nome</th>
                    <th className="text-left font-medium px-3 py-3">E-mail</th>
                    <th className="text-left font-medium px-3 py-3">Nível de acesso</th>
                    <th className="text-right font-medium px-5 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0DCD6]">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-16 text-center text-[#2b2622]/40">
                        <Loader2 className="animate-spin mx-auto mb-2" size={20} /> Carregando usuários...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-16 text-center">
                        <UserIcon className="mx-auto mb-3 text-[#2b2622]/20" size={32} />
                        <p className="text-sm text-[#2b2622]/50">Nenhum usuário cadastrado.</p>
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-[#fcf9f6] transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#B67D35]/15 flex items-center justify-center text-[#B67D35] font-display font-semibold text-xs">
                              {(u.full_name || u.email || '?').charAt(0).toUpperCase()}
                            </div>
                            <span className="text-[#2b2622] font-medium">{u.full_name || '—'}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3.5 text-[#2b2622]/70">{u.email}</td>
                        <td className="px-3 py-3.5">
                          <select
                            value={u.role || 'user'}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none ${ROLE_BADGE[u.role || 'user']}`}
                          >
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => handleDelete(u)}
                              className="p-1.5 text-[#2b2622]/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remover usuário"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}