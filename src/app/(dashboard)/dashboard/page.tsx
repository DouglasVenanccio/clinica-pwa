import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Beleza & Bem-Estar",
  description: "Painel administrativo da clinica.",
};

/**
 * KPI cards do dashboard.
 */
const kpis = [
  {
    label: "Agendamentos Hoje",
    value: "12",
    change: "+3 vs ontem",
    positive: true,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Receita do Mes",
    value: "R$ 18.500",
    change: "+12% vs mes anterior",
    positive: true,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Clientes Ativos",
    value: "248",
    change: "+8 novos",
    positive: true,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    label: "Taxa de Cancelamento",
    value: "3.2%",
    change: "-0.5% vs mes anterior",
    positive: true,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

/**
 * Proximos agendamentos (mock).
 */
const proximosAgendamentos = [
  {
    id: "1",
    cliente: "Juliana Silva",
    servico: "Limpeza de Pele",
    profissional: "Dra. Ana",
    data: "2026-08-05",
    horario: "14:00",
    status: "CONFIRMADO",
  },
  {
    id: "2",
    cliente: "Carlos Mendes",
    servico: "Massagem Relaxante",
    profissional: "Joao",
    data: "2026-08-05",
    horario: "15:30",
    status: "PENDENTE",
  },
  {
    id: "3",
    cliente: "Fernanda Alves",
    servico: "Fisioterapia",
    profissional: "Dr. Pedro",
    data: "2026-08-05",
    horario: "16:00",
    status: "CONFIRMADO",
  },
  {
    id: "4",
    cliente: "Mariana Costa",
    servico: "Ventosaterapia",
    profissional: "Joao",
    data: "2026-08-05",
    horario: "17:00",
    status: "PENDENTE",
  },
  {
    id: "5",
    cliente: "Lucas Ferreira",
    servico: "Massagem Relaxante",
    profissional: "Dra. Ana",
    data: "2026-08-05",
    horario: "18:30",
    status: "CONFIRMADO",
  },
];

/**
 * Cores dos status.
 */
const statusColors: Record<string, string> = {
  CONFIRMADO: "bg-sucesso/10 text-sucesso",
  PENDENTE: "bg-alerta/10 text-alerta",
  CANCELADO: "bg-erro/10 text-erro",
  CONCLUIDO: "bg-info/10 text-info",
};

/**
 * Dashboard principal do admin.
 * Exibe KPIs, proximos agendamentos e resumo.
 */
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Titulo */}
      <div>
        <h1 className="font-titulo text-2xl font-bold text-marrom">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Visao geral da clinica - Hoje, 05 de Agosto de 2026
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="mt-1 text-2xl font-bold text-marrom">
                  {kpi.value}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-dourado/10 text-dourado">
                {kpi.icon}
              </div>
            </div>
            <p
              className={`mt-2 text-xs ${
                kpi.positive ? "text-sucesso" : "text-erro"
              }`}
            >
              {kpi.change}
            </p>
          </div>
        ))}
      </div>

      {/* Tabela de agendamentos */}
      <div className="rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-titulo text-lg font-semibold text-marrom">
            Proximos Agendamentos
          </h2>
          <a
            href="/dashboard/agendamentos"
            className="text-sm font-medium text-dourado hover:text-dourado-500"
          >
            Ver todos
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-creme/50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Servico
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Profissional
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Horario
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {proximosAgendamentos.map((agendamento) => (
                <tr key={agendamento.id} className="hover:bg-creme/30">
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dourado/20">
                        <span className="text-xs font-semibold text-dourado">
                          {agendamento.cliente
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-marrom">
                        {agendamento.cliente}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">
                    {agendamento.servico}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">
                    {agendamento.profissional}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">
                    {agendamento.horario}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        statusColors[agendamento.status] || ""
                      }`}
                    >
                      {agendamento.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
