import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clientes | Beleza & Bem-Estar",
  description: "Gerencie os clientes da clinica.",
};

/**
 * Pagina de clientes do admin.
 * Lista todos os clientes com busca e filtros.
 */
export default function ClientesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-titulo text-2xl font-bold text-marrom">
            Clientes
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os clientes cadastrados
          </p>
        </div>
      </div>

      {/* Busca */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <input
          type="text"
          placeholder="Buscar por nome, email ou telefone..."
          className="input-clinica"
        />
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
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Telefone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Agendamentos
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
              {[
                { nome: "Juliana Silva", email: "juliana@email.com", tel: "(21) 99999-1111", agendamentos: 8, ativo: true },
                { nome: "Carlos Mendes", email: "carlos@email.com", tel: "(21) 99999-2222", agendamentos: 5, ativo: true },
                { nome: "Fernanda Alves", email: "fernanda@email.com", tel: "(21) 99999-3333", agendamentos: 12, ativo: true },
              ].map((cliente) => (
                <tr key={cliente.email} className="hover:bg-creme/30">
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dourado/20">
                        <span className="text-xs font-semibold text-dourado">
                          {cliente.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-marrom">
                        {cliente.nome}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">
                    {cliente.email}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">
                    {cliente.tel}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">
                    {cliente.agendamentos}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="inline-flex rounded-full bg-sucesso/10 px-2 py-1 text-xs font-medium text-sucesso">
                      Ativo
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <button className="text-xs text-dourado hover:text-dourado-500">
                      Detalhes
                    </button>
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
