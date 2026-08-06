import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import {
  LayoutDashboard, CalendarDays, Users, Scissors, Wallet, Settings,
  LifeBuoy, CalendarClock, BarChart3, LogOut
} from 'lucide-react';

const adminGroups = [
  {
    label: 'Agendamentos',
    items: [{ icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' }, { icon: CalendarDays, label: 'Agendamentos', href: '/dashboard/agendamentos' }],
  },
  {
    label: 'Equipe',
    items: [
      { icon: Scissors, label: 'Serviços', href: '/dashboard/servicos' },
      { icon: Users, label: 'Profissionais', href: '/dashboard/profissionais' },
      { icon: CalendarClock, label: 'Disponibilidade', href: '/dashboard/disponibilidade' },
    ],
  },
  {
    label: 'Análises',
    items: [{ icon: BarChart3, label: 'Métricas', href: '/dashboard/analise' }],
  },
  {
    label: 'Financeiro',
    items: [{ icon: Wallet, label: 'Financeiro', href: '/dashboard' }],
  },
  {
    label: 'Configurações',
    items: [{ icon: Settings, label: 'Configurações', href: '/dashboard' }],
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

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const groups = user?.role === 'ADMIN' ? adminGroups : profissionalGroups;
  return (
    <aside className="w-[260px] shrink-0 bg-[#2b2622] text-[#FDFBF7] flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#B67D35] flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">B</span>
          </div>
          <div>
            <p className="font-display font-semibold text-sm leading-tight">Beleza & Bem-Estar</p>
            <p className="text-[10px] text-[#FDFBF7]/40">Painel Administrativo</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {groups.map((g) => (
          <div key={g.label}>
            <p className="px-3 text-[10px] uppercase tracking-widest text-[#FDFBF7]/35 font-medium mb-2">{g.label}</p>
            <ul className="space-y-0.5">
              {g.items.map((item, idx) => {
                const active = item.href === pathname;
                return (
                  <li key={item.label + idx}>
                    <Link
                      to={item.href}
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

      <div className="p-3 space-y-3">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 text-[#FDFBF7]/80 mb-1">
            <LifeBuoy size={15} className="text-[#B67D35]" />
            <span className="text-sm font-medium">Precisa de ajuda?</span>
          </div>
          <p className="text-xs text-[#FDFBF7]/50 leading-relaxed">Consulte nossa central de suporte.</p>
          <button className="mt-3 w-full py-2 text-xs bg-[#B67D35] hover:bg-[#9c6829] text-white rounded-lg font-medium transition-colors">
            Suporte
          </button>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[#FDFBF7]/70 hover:bg-white/5 hover:text-[#FDFBF7] transition-colors"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  );
}