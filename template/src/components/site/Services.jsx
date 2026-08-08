import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Sparkles, Droplets, Waves, Activity, PersonStanding, Sun, Clock, ArrowRight } from 'lucide-react';

const ICONS = { Sparkles, Droplets, Waves, Activity, PersonStanding, Sun };

const benefits = [
  { icon: '🧘', title: 'Relaxe e Desconte' },
  { icon: '⚖️', title: 'Harmonize Corpo e Mente' },
  { icon: '✨', title: 'Autoestima e Confiança' },
  { icon: '📊', title: 'Resultados Comprovados' },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Service.list().then((s) => {
      setServices(s);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <section id="servicos" className="py-16 lg:py-24 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] uppercase tracking-widest text-[#B67D35] font-medium">O que oferecemos</span>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-[#2b2622] mt-3 tracking-tight">Nossos Serviços</h2>
            <p className="text-[#2b2622]/60 mt-4">Tratamentos pensados para o seu bem-estar integral.</p>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-[#F5EFE6] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.slice(0, 4).map((s) => {
                const Icon = ICONS[s.icon] || Sparkles;
                return (
                  <div
                    key={s.id}
                    className="group bg-white border border-[#E0DCD6] rounded-2xl p-6 hover:border-[#B67D35] hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#F5EFE6] flex items-center justify-center mb-5 group-hover:bg-[#B67D35]/10 transition-colors">
                      <Icon size={22} className="text-[#B67D35]" />
                    </div>
                    <h3 className="font-display font-semibold text-[#2b2622] mb-2">{s.name}</h3>
                    <p className="text-sm text-[#2b2622]/60 leading-relaxed flex-1">{s.description}</p>
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#E0DCD6]">
                      <span className="flex items-center gap-1.5 text-xs text-[#2b2622]/60">
                        <Clock size={13} /> {s.duration_min} min
                      </span>
                      <span className="font-display font-semibold text-[#B67D35]">R$ {s.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <Link to="/agendamento" className="mt-4 inline-flex items-center gap-1 text-sm text-[#2b2622] hover:text-[#B67D35] font-medium">
                      Saiba mais <ArrowRight size={14} />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-[#2b2622]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="text-center text-[#FDFBF7]">
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