import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, Users, Scissors, Settings,
  LifeBuoy, CalendarClock, BarChart3, UserCog, Menu, X,
} from 'lucide-react';

const groups = [
  {
    label: 'Agendamentos',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
      { icon: CalendarDays, label: 'Agendamentos', href: '/admin/agendamentos' },
    ],
  },
  {
    label: 'Equipe',
    items: [
      { icon: Scissors, label: 'Serviços', href: '/admin/servicos' },
      { icon: Users, label: 'Profissionais', href: '/admin/profissionais' },
      { icon: CalendarClock, label: 'Disponibilidade', href: '/admin/disponibilidade' },
      { icon: UserCog, label: 'Usuários', href: '/admin/usuarios' },
    ],
  },
  {
    label: 'Análises',
    items: [{ icon: BarChart3, label: 'Métricas', href: '/admin/analise' }],
  },
  {
    label: 'Sistema',
    items: [{ icon: Settings, label: 'Configurações', href: '/admin/configuracoes' }],
  },
];

function SidebarContent({ onNavigate }) {
  const { pathname } = useLocation();
  return (
    <>
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#B67D35] flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">C</span>
          </div>
          <div>
            <p className="font-display font-semibold text-sm leading-tight">Clínica Calii</p>
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
                      onClick={onNavigate}
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

      <div className="p-3">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 text-[#FDFBF7]/80 mb-1">
            <LifeBuoy size={15} className="text-[#B67D35]" />
            <span className="text-sm font-medium">Precisa de ajuda?</span>
          </div>
          <p className="text-xs text-[#FDFBF7]/50 leading-relaxed">Consulte nossa central de suporte.</p>
          <a
            href="https://www.instagram.com/clinicacalii/"
            target="_blank"
            rel="noreferrer"
            className="mt-3 block text-center w-full py-2 text-xs bg-[#B67D35] hover:bg-[#9c6829] text-white rounded-lg font-medium transition-colors"
          >
            Suporte
          </a>
        </div>
      </div>
    </>
  );
}

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-[60] w-10 h-10 rounded-full bg-[#2b2622] text-white flex items-center justify-center shadow-lg"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      <aside className="hidden lg:flex w-[260px] shrink-0 bg-[#2b2622] text-[#FDFBF7] flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[70]" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <aside
            className="absolute left-0 top-0 w-[280px] bg-[#2b2622] text-[#FDFBF7] flex flex-col h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-4 text-[#FDFBF7]/60 hover:text-[#FDFBF7] z-10"
              aria-label="Fechar menu"
            >
              <X size={20} />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}