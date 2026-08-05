import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicos | Beleza & Bem-Estar",
  description: "Gerencie os servicos da clinica.",
};

export default function ServicosPage() {
  const servicos = [
    { nome: "Limpeza de Pele", categoria: "Estetica", duracao: "60 min", preco: "R$ 150,00", profissionais: 1 },
    { nome: "Massagem Relaxante", categoria: "Massagens", duracao: "60 min", preco: "R$ 150,00", profissionais: 1 },
    { nome: "Ventosaterapia", categoria: "Estetica", duracao: "45 min", preco: "R$ 150,00", profissionais: 1 },
    { nome: "Fisioterapia", categoria: "Fisioterapia", duracao: "50 min", preco: "R$ 150,00", profissionais: 1 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-titulo text-2xl font-bold text-marrom">Servicos</h1>
          <p className="text-sm text-muted-foreground">Gerencie o catalogo de servicos</p>
        </div>
        <button className="btn-primary">+ Novo Servico</button>
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-creme/50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Servico</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Categoria</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Duracao</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Preco</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Profissionais</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {servicos.map((s) => (
                <tr key={s.nome} className="hover:bg-creme/30">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-marrom">{s.nome}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">{s.categoria}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">{s.duracao}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-dourado">{s.preco}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-marrom/70">{s.profissionais}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <button className="text-xs text-dourado hover:text-dourado-500">Editar</button>
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
