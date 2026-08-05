import { Star } from "lucide-react";

const professionals = [
  { id: 1, name: "Juliana Almeida", specialty: "Estetica e Limpeza de Pele", rating: 5.0, reviews: 127 },
  { id: 2, name: "Carla Santos", specialty: "Massagem e Drenagem Linfatica", rating: 4.9, reviews: 98 },
  { id: 3, name: "Fernanda Rocha", specialty: "Fisioterapia e Reabilitacao", rating: 5.0, reviews: 156 },
  { id: 4, name: "Patricia Lima", specialty: "Acupuntura e Terapias Oriental", rating: 4.8, reviews: 89 },
];

export default function Team() {
  return (
    <section id="equipe" className="py-24 bg-creme">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-widest text-dourado font-medium">Nossa Equipe</span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-marrom mt-3 tracking-tight">
            Profissionais que cuidam de voce
          </h2>
          <p className="text-marrom/60 mt-4 leading-relaxed">
            Cada membro da nossa equipe e certificado e apaixonado por fazer voce se sentir incrivel.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {professionals.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-border p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-dourado to-dourado-500 flex items-center justify-center text-white font-display font-bold text-2xl mx-auto mb-4">
                {p.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <h3 className="font-display font-semibold text-marrom">{p.name}</h3>
              <p className="text-xs text-dourado font-medium mt-1">{p.specialty}</p>
              <div className="flex items-center justify-center gap-1 mt-3">
                <Star size={14} className="fill-dourado text-dourado" />
                <span className="text-xs text-marrom/70 font-medium">{p.rating.toFixed(1)}</span>
                <span className="text-xs text-marrom/40">({p.reviews} avaliacoes)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}