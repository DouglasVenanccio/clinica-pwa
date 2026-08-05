"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Wallet, TrendingUp, Users, Scissors, CalendarDays, Loader2 } from "lucide-react";

const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

interface DashboardStats {
  agendamentosHoje: number;
  receitaMes: number;
  clientesAtivos: number;
  taxaCancelamento: number;
}

interface Agendamento {
  id: string;
  cliente: { usuario: { nome: string } };
  servico: { nome: string };
  profissional: { usuario: { nome: string } };
  data: string;
  horaInicio: string;
  status: string;
}

const statusColors: Record<string, string> = {
  CONFIRMADO: "bg-sucesso/10 text-sucesso",
  PENDENTE: "bg-alerta/10 text-alerta",
  CANCELADO: "bg-erro/10 text-erro",
  CONCLUIDO: "bg-info/10 text-info",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    agendamentosHoje: 12,
    receitaMes: 18500,
    clientesAtivos: 248,
    taxaCancelamento: 3.2,
  });
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/agendamentos?limit=5");
        if (res.ok) {
          const data = await res.json();
          setAgendamentos(data.agendamentos || []);
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const kpis = [
    {
      label: "Agendamentos Hoje",
      value: String(stats.agendamentosHoje),
      change: "+3 vs ontem",
      positive: true,
      icon: <CalendarDays className="h-6 w-6" />,
    },
    {
      label: "Receita do Mes",
      value: fmt(stats.receitaMes),
      change: "+12% vs mes anterior",
      positive: true,
      icon: <Wallet className="h-6 w-6" />,
    },
    {
      label: "Clientes Ativos",
      value: String(stats.clientesAtivos),
      change: "+8 novos",
      positive: true,
      icon: <Users className="h-6 w-6" />,
    },
    {
      label: "Taxa de Cancelamento",
      value: `${stats.taxaCancelamento}%`,
      change: "-0.5% vs mes anterior",
      positive: true,
      icon: <Scissors className="h-6 w-6" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-xl text-marrom">Dashboard</h1>
        <p className="text-xs text-marrom/50">Visao geral da clinica</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-marrom/50">{kpi.label}</p>
                <p className="mt-1 text-2xl font-display font-bold text-marrom">{kpi.value}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-dourado/10 text-dourado">
                {kpi.icon}
              </div>
            </div>
            <p className={`mt-2 text-xs ${kpi.positive ? "text-sucesso" : "text-erro"}`}>
              {kpi.change}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-display font-semibold text-marrom">Proximos Agendamentos</h2>
          <Link href="/dashboard/agendamentos" className="text-sm font-medium text-dourado hover:text-dourado-500">
            Ver todos
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-creme-200">
                <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-marrom/50 font-medium">Cliente</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-marrom/50 font-medium">Servico</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-marrom/50 font-medium">Profissional</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-marrom/50 font-medium">Horario</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-marrom/50 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center">
                    <Loader2 className="animate-spin mx-auto text-dourado" size={20} />
                  </td>
                </tr>
              ) : agendamentos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-marrom/50">
                    Nenhum agendamento encontrado.
                  </td>
                </tr>
              ) : (
                agendamentos.map((ag) => (
                  <tr key={ag.id} className="hover:bg-creme-200/50 transition-colors">
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dourado/20">
                          <span className="text-xs font-semibold text-dourado">
                            {ag.cliente.usuario.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-marrom">{ag.cliente.usuario.nome}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">{ag.servico.nome}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">{ag.profissional.usuario.nome}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">{ag.horaInicio}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[ag.status] || ""}`}>
                        {ag.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}