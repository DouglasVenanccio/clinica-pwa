"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CalendarDays, Users, Scissors, Wallet, Settings,
  LifeBuoy, CalendarClock, BarChart3
} from "lucide-react";

const groups = [
  {
    label: "Agendamentos",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
      { icon: CalendarDays, label: "Agendamentos", href: "/dashboard/agendamentos" },
    ],
  },
  {
    label: "Equipe",
    items: [
      { icon: Scissors, label: "Servicos", href: "/dashboard/servicos" },
      { icon: Users, label: "Profissionais", href: "/dashboard/profissionais" },
      { icon: CalendarClock, label: "Disponibilidade", href: "/dashboard/disponibilidade" },
    ],
  },
  {
    label: "Analises",
    items: [
      { icon: BarChart3, label: "Metricas", href: "/dashboard/analise" },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { icon: Wallet, label: "Financeiro", href: "/dashboard" },
    ],
  },
  {
    label: "Configuracoes",
    items: [
      { icon: Settings, label: "Configuracoes", href: "/dashboard" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-[260px] shrink-0 bg-marrom text-creme flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-dourado flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">B</span>
          </div>
          <div>
            <p className="font-display font-semibold text-sm leading-tight">Beleza & Bem-Estar</p>
            <p className="text-[10px] text-creme/40">Painel Administrativo</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {groups.map((g) => (
          <div key={g.label}>
            <p className="px-3 text-[10px] uppercase tracking-widest text-creme/35 font-medium mb-2">{g.label}</p>
            <ul className="space-y-0.5">
              {g.items.map((item, idx) => {
                const active = item.href === pathname;
                return (
                  <li key={item.label + idx}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        active ? "bg-dourado text-white" : "text-creme/70 hover:bg-white/5 hover:text-creme"
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
          <div className="flex items-center gap-2 text-creme/80 mb-1">
            <LifeBuoy size={15} className="text-dourado" />
            <span className="text-sm font-medium">Precisa de ajuda?</span>
          </div>
          <p className="text-xs text-creme/50 leading-relaxed">Consulte nossa central de suporte.</p>
          <button className="mt-3 w-full py-2 text-xs bg-dourado hover:bg-dourado-500 text-white rounded-lg font-medium transition-colors">
            Suporte
          </button>
        </div>
      </div>
    </aside>
  );
}