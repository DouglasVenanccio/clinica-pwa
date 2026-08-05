import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profissionais | Beleza & Bem-Estar",
  description: "Gerencie os profissionais da clinica.",
};

export default function ProfissionaisPage() {
  const profissionais = [
    { nome: "Dra. Ana Beatriz", especialidade: "Estetica Facial e Corporal", servicos: 2, status: "Ativo" },
    { nome: "Dr. Pedro Santos", especialidade: "Fisioterapia Ortopedica", servicos: 1, status: "Ativo" },
    { nome: "Joao Oliveira", especialidade: "Massagem Terapeutica", servicos: 1, status: "Ativo" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-titulo text-2xl font-bold text-marrom">Profissionais</h1>
          <p className="text-sm text-muted-foreground">Gerencie a equipe da clinica</p>
        </div>
        <button className="btn-primary">+ Novo Profissional</button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {profissionais.map((p) => (
          <div key={p.nome} className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dourado/20">
                <span className="text-sm font-semibold text-dourado">
                  {p.nome.split(" ").slice(-1)[0][0]}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-marrom">{p.nome}</h3>
                <p className="text-sm text-muted-foreground">{p.especialidade}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">{p.servicos} servicos</span>
              <span className="inline-flex rounded-full bg-sucesso/10 px-2 py-1 text-xs font-medium text-sucesso">
                {p.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
