import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Star, Quote, Loader2 } from 'lucide-react';

const fallback = [
  { client_name: 'Mariana Costa', rating: 5, comment: 'Atendimento impecável! Saí me sentindo renovada. Profissional excepcional e ambiente acolhedor.', service_name: 'Limpeza de Pele' },
  { client_name: 'Patrícia Almeida', rating: 5, comment: 'Resultados incríveis já nas primeiras sessões. Reduzi muito a retenção de líquidos.', service_name: 'Drenagem Linfática' },
  { client_name: 'Fernanda Rocha', rating: 5, comment: 'A acupuntura mudou minha relação com a dor crônica. Cuidado real em cada sessão.', service_name: 'Acupuntura' },
];

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Review.list('-created_date', 6)
      .then((r) => setReviews(r && r.length ? r : fallback))
      .catch(() => setReviews(fallback))
      .finally(() => setLoading(false));
  }, []);

  const list = reviews.length ? reviews : fallback;

  return (
    <section id="depoimentos" className="py-24 bg-[#F5EFE6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-widest text-[#B67D35] font-medium">Depoimentos</span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-[#2b2622] mt-3 tracking-tight">
            O que nossos clientes dizem
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center"><Loader2 className="animate-spin text-[#B67D35]" size={24} /></div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {list.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 border border-[#E0DCD6] relative">
                <Quote className="absolute top-6 right-6 text-[#B67D35]/15" size={40} />
                <div className="flex gap-1 mb-4">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} size={15} className={s < (t.rating || 5) ? 'fill-[#B67D35] text-[#B67D35]' : 'text-[#E0DCD6]'} />
                  ))}
                </div>
                <p className="text-[#2b2622]/75 leading-relaxed text-sm relative z-10">{t.comment}</p>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-[#E0DCD6]">
                  <div className="w-11 h-11 rounded-full bg-[#B67D35] flex items-center justify-center text-white font-display font-semibold text-sm">
                    {(t.client_name || '').split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-[#2b2622] text-sm">{t.client_name}</p>
                    <p className="text-xs text-[#2b2622]/50">{t.service_name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}