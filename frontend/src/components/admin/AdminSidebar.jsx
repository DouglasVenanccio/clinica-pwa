import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useConfig } from '@/lib/ConfigContext';
import {
  LayoutDashboard, CalendarDays, Users, Scissors, Wallet, Settings,
  CalendarClock, BarChart3, LogOut, UserCog, Menu, X
} from 'lucide-react';

const adminGroups = [
  {
    label: 'Agendamentos',
    items: [{ icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' }, { icon: CalendarDays, label: 'Agendamentos', href: '/dashboard/agendamentos' }],
  },
  {
    label: 'Equipe',
    items: [
      { icon: Scissors, label: 'Servicos', href: '/dashboard/servicos' },
      { icon: Users, label: 'Profissionais', href: '/dashboard/profissionais' },
      { icon: CalendarClock, label: 'Disponibilidade', href: '/dashboard/disponibilidade' },
    ],
  },
  {
    label: 'Analises',
    items: [{ icon: BarChart3, label: 'Metricas', href: '/dashboard/analise' }],
  },
  {
    label: 'Financeiro',
    items: [{ icon: Wallet, label: 'Financeiro', href: '/dashboard/financeiro' }],
  },
  {
    label: 'Administracao',
    items: [
      { icon: UserCog, label: 'Usuarios', href: '/dashboard/usuarios' },
      { icon: Settings, label: 'Configuracoes', href: '/dashboard/configuracoes' },
    ],
  },
];

const profissionalGroups = [
  {
    label: 'Meu Painel',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
      { icon: CalendarDays, label: 'Meus Agendamentos', href: '/dashboard/agendamentos' },
      { icon: CalendarClock, label: 'Meus Horários', href: '/dashboard/disponibilidade' },
    ],
  },
];

function SidebarContent({ pathname, user, logout, clinicName, onItemClick }) {
  const groups = user?.role === 'ADMIN' ? adminGroups : profissionalGroups;
  const initials = user?.nome ? user.nome.split(' ').filter(Boolean).map((n) => n[0]).join('').substring(0, 2).toUpperCase() : '?';
  return (
    <>
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#B67D35] flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">{clinicName?.[0] || 'B'}</span>
          </div>
          <div className="min-w-0">
            <p className="font-display font-semibold text-sm leading-tight truncate">{clinicName || 'Beleza & Bem-Estar'}</p>
            <p className="text-[10px] text-[#FDFBF7]/40">Painel Administrativo</p>
          </div>
        </div>
      </div>

      <nav aria-label="Menu de navegação" className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {groups.map((g) => (
          <div key={g.label}>
            <p className="px-3 text-[10px] uppercase tracking-widest text-[#FDFBF7]/35 font-medium mb-2">{g.label}</p>
            <ul className="space-y-0.5">
              {g.items.map((item, idx) => {
                const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <li key={item.label + idx}>
                    <Link
                      to={item.href}
                      onClick={onItemClick}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        active ? 'bg-[#B67D35] text-white' : 'text-[#FDFBF7]/70 hover:bg-white/5 hover:text-[#FDFBF7]'
                      }`}
                    >
                      <item.icon size={17} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-3 space-y-3 border-t border-white/10">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[#B67D35] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#FDFBF7] truncate">{user?.nome || 'Usuario'}</p>
            <p className="text-[10px] text-[#FDFBF7]/40 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[#FDFBF7]/70 hover:bg-white/5 hover:text-[#FDFBF7] transition-colors"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </>
  );
}

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const { config } = useConfig();
  const [mobileOpen, setMobileOpen] = useState(false);
  const clinicName = config?.nome_clinica || 'Beleza & Bem-Estar';

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-[#2b2622] text-white rounded-lg shadow-lg"
        aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`lg:hidden fixed inset-y-0 left-0 z-40 w-[260px] bg-[#2b2622] text-[#FDFBF7] flex flex-col transform transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent pathname={pathname} user={user} logout={logout} clinicName={clinicName} onItemClick={() => setMobileOpen(false)} />
      </aside>

      <aside className="hidden lg:flex w-[260px] shrink-0 bg-[#2b2622] text-[#FDFBF7] flex-col h-screen sticky top-0">
        <SidebarContent pathname={pathname} user={user} logout={logout} clinicName={clinicName} />
      </aside>
    </>
  );
}
