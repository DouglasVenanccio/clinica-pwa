import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { formatarData, formatarMoeda, formatarHorario } from "@/lib/utils";
import { STATUS_AGENDAMENTO } from "@/lib/constants";
import { AdminAgendamentosActions } from "@/components/admin/admin-agendamentos-actions";

export const metadata: Metadata = {
  title: "Agendamentos | Beleza & Bem-Estar",
  description: "Gerencie os agendamentos da clinica.",
};

/**
 * Pagina de agendamentos do admin.
 * Lista todos os agendamentos com dados reais do banco.
 */
export default async function AgendamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; profissionalId?: string; data?: string }>;
}) {
  const params = await searchParams;

  const where: Record<string, unknown> = {};

  if (params.status && params.status !== "TODOS") {
    where.status = params.status;
  }
  if (params.profissionalId) {
    where.profissionalId = params.profissionalId;
  }
  if (params.data) {
    where.data = new Date(params.data + "T12:00:00");
  }

  const agendamentos = await prisma.agendamento.findMany({
    where,
    include: {
      cliente: { include: { usuario: true } },
      profissional: { include: { usuario: true } },
      servico: true,
    },
    orderBy: [{ data: "desc" }, { horaInicio: "desc" }],
    take: 50,
  });

  const profissionais = await prisma.profissional.findMany({
    where: { ativo: true },
    include: { usuario: true },
  });

  function getStatusStyle(status: string) {
    const styles: Record<string, string> = {
      [STATUS_AGENDAMENTO.PENDENTE]: "bg-yellow-100 text-yellow-800",
      [STATUS_AGENDAMENTO.CONFIRMADO]: "bg-green-100 text-green-800",
      [STATUS_AGENDAMENTO.CONCLUIDO]: "bg-blue-100 text-blue-800",
      [STATUS_AGENDAMENTO.CANCELADO]: "bg-red-100 text-red-800",
      [STATUS_AGENDAMENTO.NAO_COMPARECEU]: "bg-gray-100 text-gray-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  }

  function getFormaPagamentoLabel(fp: string | null) {
    if (!fp) return "-";
    const labels: Record<string, string> = {
      PIX: "PIX",
      CARTAO_CREDITO: "Credito",
      CARTAO_DEBITO: "Debito",
    };
    return labels[fp] || fp;
  }

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
      </div>

      <div className="flex flex-wrap gap-4 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex-1">
          <label className="block text-xs font-medium text-muted-foreground">
            Status
          </label>
          <select className="input-clinica mt-1" defaultValue={params.status || "TODOS"}>
            <option value="TODOS">Todos</option>
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
          <select className="input-clinica mt-1" defaultValue={params.profissionalId || ""}>
            <option value="">Todos</option>
            {profissionais.map((p) => (
              <option key={p.id} value={p.id}>
                {p.usuario.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-muted-foreground">
            Data
          </label>
          <input
            type="date"
            className="input-clinica mt-1"
            defaultValue={params.data || ""}
          />
        </div>
      </div>

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
              {agendamentos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Nenhum agendamento encontrado.
                  </td>
                </tr>
              ) : (
                agendamentos.map((ag) => (
                  <tr key={ag.id} className="hover:bg-creme/30">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-marrom">
                      {ag.cliente.usuario.nome}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">
                      {ag.servico.nome}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">
                      {ag.profissional.usuario.nome}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">
                      {formatarData(ag.data)} {formatarHorario(ag.horaInicio)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">
                      {getFormaPagamentoLabel(ag.formaPagamento)} - {formatarMoeda(Number(ag.valorTotal))}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusStyle(ag.status)}`}>
                        {ag.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <AdminAgendamentosActions
                        agendamentoId={ag.id}
                        status={ag.status}
                      />
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
