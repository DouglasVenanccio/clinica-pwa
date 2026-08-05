import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promocoes | Beleza & Bem-Estar",
  description: "Gerencie promocoes e cupons de desconto.",
};

export default function PromocoesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-titulo text-2xl font-bold text-marrom">Promocoes</h1>
          <p className="text-sm text-muted-foreground">Gerencie cupons e promocoes</p>
        </div>
        <button className="btn-primary">+ Nova Promocao</button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[
          { nome: "DESCONTO10", tipo: "Percentual", valor: "10%", validade: "Ate 31/12/2026", uso: "15/100" },
          { nome: "BOASVINDAS", tipo: "Valor Fixo", valor: "R$ 20,00", validade: "Ate 30/09/2026", uso: "8/50" },
        ].map((p) => (
          <div key={p.nome} className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-lg font-bold text-dourado">{p.nome}</h3>
              <span className="inline-flex rounded-full bg-dourado/10 px-2 py-1 text-xs font-medium text-dourado">
                {p.tipo}
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-marrom">{p.valor}</p>
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <p>Validade: {p.validade}</p>
              <p>Usos: {p.uso}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
