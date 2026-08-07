import { Link } from 'react-router-dom';
import { Gift, Crown, Star, Gem, ArrowRight } from 'lucide-react';
import { useConfig } from '@/lib/ConfigContext';

const tiers = [
  { icon: Star, name: 'Bronze', min: '0 pts', color: 'text-amber-700 bg-amber-50', desc: '1 ponto a cada R$1' },
  { icon: Crown, name: 'Prata', min: '500 pts', color: 'text-slate-600 bg-slate-100', desc: 'Desconto de 5% em serviços' },
  { icon: Gem, name: 'Ouro', min: '2.000 pts', color: 'text-yellow-700 bg-yellow-50', desc: 'Desconto de 10% + brinde' },
  { icon: Gift, name: 'Diamante', min: '5.000 pts', color: 'text-[#B67D35] bg-[#B67D35]/10', desc: '15% off + sessão grátis anual' },
];

export default function Loyalty() {
  const { config } = useConfig();
  const corPrimaria = config?.cor_primaria || '#B67D35';
  return (
    <section id="fidelidade" className="py-24 bg-[#2b2622] text-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-widest text-[#B67D35] font-medium">Programa de Fidelidade</span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl mt-3 tracking-tight">
            Quanto mais você cuida de si, mais você ganha
          </h2>
          <p className="text-[#FDFBF7]/60 mt-4 leading-relaxed">
            A cada agendamento você acumula pontos e sobe de nível, desbloqueando benefícios exclusivos.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map((t) => (
            <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors">
              <div className={`w-14 h-14 rounded-full ${t.color} flex items-center justify-center mx-auto mb-4`}>
                <t.icon size={24} />
              </div>
              <h3 className="font-display font-bold text-lg">{t.name}</h3>
              <p className="text-[11px] text-[#B67D35] font-medium mt-1">{t.min}</p>
              <p className="text-xs text-[#FDFBF7]/50 mt-2 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/fidelidade" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium transition-colors text-white" style={{ backgroundColor: corPrimaria }}>
            Consultar meus pontos <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}