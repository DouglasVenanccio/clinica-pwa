import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pagamentos | Beleza & Bem-Estar",
  description: "Acompanhe os pagamentos da clinica.",
};

export default function PagamentosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-titulo text-2xl font-bold text-marrom">Pagamentos</h1>
        <p className="text-sm text-muted-foreground">Acompanhe todos os pagamentos</p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Receita do Mes</p>
          <p className="mt-1 text-2xl font-bold text-sucesso">R$ 18.500,00</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Pagos</p>
          <p className="mt-1 text-2xl font-bold text-marrom">R$ 16.200,00</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Pendentes</p>
          <p className="mt-1 text-2xl font-bold text-alerta">R$ 2.300,00</p>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-creme/50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Servico</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Valor</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Forma</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { cliente: "Juliana Silva", servico: "Limpeza de Pele", valor: "R$ 142,50", forma: "PIX", status: "Pago" },
                { cliente: "Carlos Mendes", servico: "Massagem Relaxante", valor: "R$ 150,00", forma: "Cartao", status: "Pendente" },
                { cliente: "Fernanda Alves", servico: "Fisioterapia", valor: "R$ 150,00", forma: "PIX", status: "Pago" },
              ].map((p, i) => (
                <tr key={i} className="hover:bg-creme/30">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-marrom">{p.cliente}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">{p.servico}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-marrom">{p.valor}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">{p.forma}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      p.status === "Pago" ? "bg-sucesso/10 text-sucesso" : "bg-alerta/10 text-alerta"
                    }`}>
                      {p.status}
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
