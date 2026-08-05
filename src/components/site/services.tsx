import Link from "next/link";
import { Sparkles, Droplets, Waves, Activity, PersonStanding, Sun, Clock, ArrowRight } from "lucide-react";

const ICONS = { Sparkles, Droplets, Waves, Activity, PersonStanding, Sun };

const services = [
  { id: 1, name: "Limpeza de Pele", description: "Remove impurezas e celulas mortas, promovendo uma pele renovada e radiante.", duration_min: 60, price: 150, icon: "Sparkles" },
  { id: 2, name: "Massagem Relaxante", description: "Alivio de tensões e relaxamento profundo para corpo e mente.", duration_min: 60, price: 150, icon: "Waves" },
  { id: 3, name: "Drenagem Linfatica", description: "Terapia que auxilia na circulacao e eliminacao de toxinas.", duration_min: 45, price: 150, icon: "Droplets" },
  { id: 4, name: "Fisioterapia", description: "Tratamentos personalizados para reabilitacao e alivio de dores.", duration_min: 50, price: 150, icon: "Activity" },
];

const benefits = [
  { icon: "🧘", title: "Relaxe e Desconte" },
  { icon: "⚖️", title: "Harmonize Corpo e Mente" },
  { icon: "✨", title: "Autoestima e Confianca" },
  { icon: "📊", title: "Resultados Comprovados" },
];

export default function Services() {
  return (
    <>
      <section id="servicos" className="py-24 bg-creme">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] uppercase tracking-widest text-dourado font-medium">O que oferecemos</span>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-marrom mt-3 tracking-tight">Nossos Servicos</h2>
            <p className="text-marrom/60 mt-4">Tratamentos pensados para o seu bem-estar integral.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => {
              const Icon = ICONS[s.icon as keyof typeof ICONS] || Sparkles;
              return (
                <div
                  key={s.id}
                  className="group bg-white border border-border rounded-2xl p-6 hover:border-dourado hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="w-12 h-12 rounded-full bg-creme-200 flex items-center justify-center mb-5 group-hover:bg-dourado/10 transition-colors">
                    <Icon size={22} className="text-dourado" />
                  </div>
                  <h3 className="font-display font-semibold text-marrom mb-2">{s.name}</h3>
                  <p className="text-sm text-marrom/60 leading-relaxed flex-1">{s.description}</p>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                    <span className="flex items-center gap-1.5 text-xs text-marrom/60">
                      <Clock size={13} /> {s.duration_min} min
                    </span>
                    <span className="font-display font-semibold text-dourado">R$ {s.price.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <Link href="/agendar" className="mt-4 inline-flex items-center gap-1 text-sm text-marrom hover:text-dourado font-medium">
                    Saiba mais <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-marrom">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="text-center text-creme">
                <div className="text-3xl mb-3">{b.icon}</div>
                <p className="text-sm font-medium tracking-wide">{b.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}