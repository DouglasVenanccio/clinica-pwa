import { Star, Quote } from "lucide-react";

const reviews = [
  { client_name: "Mariana Costa", rating: 5, comment: "Atendimento impecavel! Sai me sentindo renovada. Profissional excepcional e ambiente acolhedor.", service_name: "Limpeza de Pele" },
  { client_name: "Patricia Almeida", rating: 5, comment: "Resultados incriveis ja nas primeiras sessoes. Reduzi muito a retencao de liquidos.", service_name: "Drenagem Linfatica" },
  { client_name: "Fernanda Rocha", rating: 5, comment: "A acupuntura mudou minha relacao com a dor cronica. Cuidado real em cada sessao.", service_name: "Acupuntura" },
];

export default function Reviews() {
  return (
    <section id="depoimentos" className="py-24 bg-creme-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-widest text-dourado font-medium">Depoimentos</span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-marrom mt-3 tracking-tight">
            O que nossos clientes dizem
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-7 border border-border relative">
              <Quote className="absolute top-6 right-6 text-dourado/15" size={40} />
              <div className="flex gap-1 mb-4">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} size={15} className={s < t.rating ? "fill-dourado text-dourado" : "text-border"} />
                ))}
              </div>
              <p className="text-marrom/75 leading-relaxed text-sm relative z-10">{t.comment}</p>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border">
                <div className="w-11 h-11 rounded-full bg-dourado flex items-center justify-center text-white font-display font-semibold text-sm">
                  {t.client_name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-medium text-marrom text-sm">{t.client_name}</p>
                  <p className="text-xs text-marrom/50">{t.service_name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}