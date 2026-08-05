import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agendamentos | Beleza & Bem-Estar",
  description: "Gerencie os agendamentos da clinica.",
};

/**
 * Pagina de agendamentos do admin.
 * Lista todos os agendamentos com filtros.
 */
export default function AgendamentosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-titulo text-2xl font-bold text-marrom">
            Agendamentos
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie todos os agendamentos da clinica
          </p>
        </div>
        <button className="btn-primary">
          + Novo Agendamento
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex-1">
          <label className="block text-xs font-medium text-muted-foreground">
            Status
          </label>
          <select className="input-clinica mt-1">
            <option value="">Todos</option>
            <option value="PENDENTE">Pendente</option>
            <option value="CONFIRMADO">Confirmado</option>
            <option value="CONCLUIDO">Concluido</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-muted-foreground">
            Profissional
          </label>
          <select className="input-clinica mt-1">
            <option value="">Todos</option>
            <option value="1">Dra. Ana Beatriz</option>
            <option value="2">Dr. Pedro Santos</option>
            <option value="3">Joao Oliveira</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-muted-foreground">
            Data
          </label>
          <input type="date" className="input-clinica mt-1" />
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-xl bg-white shadow-sm">
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
                  Data/Horario
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Pagamento
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Acoes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-creme/30">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-marrom">
                  Juliana Silva
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">
                  Limpeza de Pele
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">
                  Dra. Ana Beatriz
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">
                  05/08/2026 14:00
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">
                  PIX - R$ 142,50
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="inline-flex rounded-full bg-sucesso/10 px-2 py-1 text-xs font-medium text-sucesso">
                    CONFIRMADO
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <button className="text-xs text-dourado hover:text-dourado-500">
                    Detalhes
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-creme/30">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-marrom">
                  Carlos Mendes
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">
                  Massagem Relaxante
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">
                  Joao Oliveira
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">
                  05/08/2026 15:30
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">
                  Cartao - R$ 150,00
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="inline-flex rounded-full bg-alerta/10 px-2 py-1 text-xs font-medium text-alerta">
                    PENDENTE
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <button className="text-xs text-dourado hover:text-dourado-500">
                    Detalhes
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
