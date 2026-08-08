import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { api } from '@/api/apiClient';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuRadioGroup, DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import {
  ArrowLeft, Users, Shield, ShieldOff, Trash2, Loader2, Search,
  UserCheck, UserX, ChevronDown, UserPlus, Mail, Loader
} from 'lucide-react';

const ROLES = [
  { value: 'CLIENTE', label: 'Cliente', color: 'bg-blue-100 text-blue-700' },
  { value: 'PROFISSIONAL', label: 'Colaborador', color: 'bg-amber-100 text-amber-700' },
  { value: 'ADMIN', label: 'Administrador', color: 'bg-purple-100 text-purple-700' },
];

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Estado do card de convite
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('CLIENTE');
  const [inviteSaving, setInviteSaving] = useState(false);
  const [inviteMsg, setInviteMsg] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.User.list({ search, role: filterRole });
      setUsers(data || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search, filterRole]);

  const handleChangeRole = async (userId, newRole) => {
    if (!userId) return;
    setUpdatingId(userId);
    try {
      await api.User.update(userId, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch {
      alert('Erro ao alterar papel do usuario.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleActive = async (userId, currentActive) => {
    const action = currentActive ? 'bloquear' : 'desbloquear';
    if (!window.confirm(`Tem certeza que deseja ${action} este usuario?`)) return;
    try {
      await api.User.update(userId, { ativo: !currentActive });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ativo: !currentActive } : u)));
    } catch {
      alert(`Erro ao ${action} usuario.`);
    }
  };

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Excluir o usuario "${name}"? Esta acao nao pode ser desfeita.`)) return;
    try {
      await api.User.delete(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      alert('Erro ao excluir usuario.');
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) {
      setInviteMsg({ type: 'error', text: 'Preencha nome e email.' });
      return;
    }
    setInviteSaving(true);
    setInviteMsg(null);
    try {
      await api.User.create({
        nome: inviteName.trim(),
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      setInviteName('');
      setInviteEmail('');
      setInviteRole('CLIENTE');
      setInviteMsg({ type: 'success', text: 'Usuario convidado com sucesso. Senha padrao: 12345678' });
      load();
    } catch (err) {
      setInviteMsg({ type: 'error', text: err.message || 'Erro ao convidar usuario.' });
    } finally {
      setInviteSaving(false);
    }
  };

  const getRoleInfo = (role) => ROLES.find((r) => r.value === role) || ROLES[0];
  const getInitials = (name) => (name || '').split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="flex bg-[#fcf9f6] min-h-screen">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-[#E0DCD6] px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="w-9 h-9 rounded-full hover:bg-[#F5EFE6] flex items-center justify-center text-[#2b2622]/60"><ArrowLeft size={18} /></Link>
            <div>
              <h1 className="font-display font-bold text-xl text-[#2b2622]">Usuarios &amp; Acessos</h1>
              <p className="text-xs text-[#2b2622]/50">{users.length} cadastrados</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2622]/30" />
              <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-3 py-2 text-sm border border-[#E0DCD6] rounded-lg focus:outline-none focus:border-[#B67D35] w-56" />
            </div>
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="px-3 py-2 text-sm border border-[#E0DCD6] rounded-lg focus:outline-none focus:border-[#B67D35]">
              <option value="">Todos os papeis</option>
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            <Button onClick={() => setInviteOpen(!inviteOpen)} className="bg-[#B67D35] hover:bg-[#9c6829] text-white">
              <UserPlus size={16} className="mr-1" /> Convidar
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* Card de convite */}
          {inviteOpen && (
            <div className="bg-white border border-[#E0DCD6] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#B67D35]/10 flex items-center justify-center">
                  <Mail size={18} className="text-[#B67D35]" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-base text-[#2b2622]">Convidar novo usuario</h2>
                  <p className="text-xs text-[#2b2622]/50">O usuario recebera acesso com a senha padrao 12345678</p>
                </div>
              </div>
              <form onSubmit={handleInvite} className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-[10px] uppercase tracking-widest text-[#2b2622]/50 font-medium mb-1.5">Nome</label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="Nome completo"
                    className="w-full px-3.5 py-2 text-sm border border-[#E0DCD6] rounded-lg focus:outline-none focus:border-[#B67D35]"
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-[10px] uppercase tracking-widest text-[#2b2622]/50 font-medium mb-1.5">Email</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="w-full px-3.5 py-2 text-sm border border-[#E0DCD6] rounded-lg focus:outline-none focus:border-[#B67D35]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#2b2622]/50 font-medium mb-1.5">Nivel de acesso</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="px-3.5 py-2 text-sm border border-[#E0DCD6] rounded-lg focus:outline-none focus:border-[#B67D35]"
                  >
                    {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <Button type="submit" disabled={inviteSaving} className="bg-[#B67D35] hover:bg-[#9c6829] text-white">
                  {inviteSaving ? <Loader size={16} className="animate-spin mr-1" /> : <UserPlus size={16} className="mr-1" />}
                  Convidar
                </Button>
              </form>
              {inviteMsg && (
                <p className={`mt-3 text-sm ${inviteMsg.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {inviteMsg.text}
                </p>
              )}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#B67D35]" size={24} /></div>
          ) : users.length === 0 ? (
            <div className="text-center py-16"><Users className="mx-auto mb-3 text-[#2b2622]/20" size={32} /><p className="text-sm text-[#2b2622]/50">Nenhum usuario encontrado.</p></div>
          ) : (
            <div className="bg-white border border-[#E0DCD6] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#fcf9f6] text-[10px] uppercase tracking-widest text-[#2b2622]/50">
                      <th className="text-left font-medium px-5 py-3">Nome</th>
                      <th className="text-left font-medium px-3 py-3">Email</th>
                      <th className="text-left font-medium px-3 py-3">Nivel de acesso</th>
                      <th className="text-left font-medium px-3 py-3">Agendamentos</th>
                      <th className="text-left font-medium px-3 py-3">Status</th>
                      <th className="text-left font-medium px-3 py-3">Cadastro</th>
                      <th className="text-right font-medium px-5 py-3">Acoes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E0DCD6]">
                    {users.map((u) => {
                      const roleInfo = getRoleInfo(u.role);
                      return (
                        <tr key={u.id} className={`hover:bg-[#fcf9f6] transition-colors ${!u.ativo ? 'opacity-50' : ''}`}>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#B67D35]/15 flex items-center justify-center text-[#B67D35] font-display font-semibold text-xs">
                                {getInitials(u.nome)}
                              </div>
                              <span className="text-[#2b2622] font-medium">{u.nome}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-[#2b2622]/70">{u.email}</td>
                          <td className="px-3 py-3.5">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  disabled={updatingId === u.id}
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50 ${roleInfo.color}`}
                                >
                                  {updatingId === u.id ? <Loader2 size={12} className="animate-spin" /> : roleInfo.label}
                                  <ChevronDown size={12} className="opacity-70" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="w-44">
                                <DropdownMenuRadioGroup value={u.role} onValueChange={(v) => handleChangeRole(u.id, v)}>
                                  {ROLES.map((r) => (
                                    <DropdownMenuRadioItem key={r.value} value={r.value}>
                                      <span className={`w-2 h-2 rounded-full mr-1 ${r.color.split(' ')[0]}`} />
                                      {r.label}
                                    </DropdownMenuRadioItem>
                                  ))}
                                </DropdownMenuRadioGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                          <td className="px-3 py-3.5 text-[#2b2622]/70">{u.totalAgendamentos}</td>
                          <td className="px-3 py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.ativo ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                              {u.ativo ? 'Ativo' : 'Bloqueado'}
                            </span>
                          </td>
                          <td className="px-3 py-3.5 text-[#2b2622]/60 text-xs">{fmtDate(u.criadoEm)}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1 justify-end">
                              <button onClick={() => handleToggleActive(u.id, u.ativo)} title={u.ativo ? 'Bloquear' : 'Desbloquear'} className="p-1.5 text-[#2b2622]/40 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                                {u.ativo ? <UserX size={15} /> : <UserCheck size={15} />}
                              </button>
                              <button onClick={() => handleDelete(u.id, u.nome)} title="Excluir" className="p-1.5 text-[#2b2622]/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
