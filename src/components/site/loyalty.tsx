import Link from "next/link";
import { Gift, Crown, Star, Gem, ArrowRight } from "lucide-react";

const tiers = [
  { icon: Star, name: "Bronze", min: "0 pts", color: "text-amber-700 bg-amber-50", desc: "1 ponto a cada R$1" },
  { icon: Crown, name: "Prata", min: "500 pts", color: "text-slate-600 bg-slate-100", desc: "Desconto de 5% em servicos" },
  { icon: Gem, name: "Ouro", min: "2.000 pts", color: "text-yellow-700 bg-yellow-50", desc: "Desconto de 10% + brinde" },
  { icon: Gift, name: "Diamante", min: "5.000 pts", color: "text-dourado bg-dourado/10", desc: "15% off + sessao gratis anual" },
];

export default function Loyalty() {
  return (
    <section id="fidelidade" className="py-24 bg-marrom text-creme">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-widest text-dourado font-medium">Programa de Fidelidade</span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl mt-3 tracking-tight">
            Quanto mais voce cuida de si, mais voce ganha
          </h2>
          <p className="text-creme/60 mt-4 leading-relaxed">
            A cada agendamento voce acumula pontos e sobe de nivel, desbloqueando beneficios exclusivos.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map((t) => (
            <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors">
              <div className={`w-14 h-14 rounded-full ${t.color} flex items-center justify-center mx-auto mb-4`}>
                <t.icon size={24} />
              </div>
              <h3 className="font-display font-bold text-lg">{t.name}</h3>
              <p className="text-[11px] text-dourado font-medium mt-1">{t.min}</p>
              <p className="text-xs text-creme/50 mt-2 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/agendar" className="inline-flex items-center gap-2 px-8 py-3.5 bg-dourado hover:bg-dourado-500 rounded-full text-sm font-medium transition-colors">
            Consultar meus pontos <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}