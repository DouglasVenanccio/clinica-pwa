import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Star, Quote, Loader2 } from 'lucide-react';

export default function Team() {
  const [pros, setPros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Professional.list()
      .then(setPros)
      .catch(() => setPros([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="equipe" className="py-24 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-widest text-[#B67D35] font-medium">Nossa Equipe</span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-[#2b2622] mt-3 tracking-tight">
            Profissionais que cuidam de você
          </h2>
          <p className="text-[#2b2622]/60 mt-4 leading-relaxed">
            Cada membro da nossa equipe é certificado e apaixonado por fazer você se sentir incrível.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center"><Loader2 className="animate-spin text-[#B67D35]" size={24} /></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pros.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-[#E0DCD6] p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#B67D35] to-[#9c6829] flex items-center justify-center text-white font-display font-bold text-2xl mx-auto mb-4">
                  {p.initials || p.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <h3 className="font-display font-semibold text-[#2b2622]">{p.name}</h3>
                <p className="text-xs text-[#B67D35] font-medium mt-1">{p.specialty}</p>
                <div className="flex items-center justify-center gap-1 mt-3">
                  <Star size={14} className="fill-[#B67D35] text-[#B67D35]" />
                  <span className="text-xs text-[#2b2622]/70 font-medium">{Number(p.rating || 5).toFixed(1)}</span>
                  <span className="text-xs text-[#2b2622]/40">({p.reviews || 0} avaliações)</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}