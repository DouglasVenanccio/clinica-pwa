import { Star, Quote } from 'lucide-react';

const testimonials = [
  { name: 'Mariana Costa', service: 'Limpeza de Pele', text: 'Atendimento impecável! Saí me sentindo renovada. A Juliana é uma profissional excepcional e o ambiente é super acolhedor.', initials: 'MC' },
  { name: 'Patrícia Almeida', service: 'Drenagem Linfática', text: 'Resultados incríveis já nas primeiras sessões. Reduzi muito a retenção de líquidos e me sinto muito mais leve.', initials: 'PA' },
  { name: 'Fernanda Rocha', service: 'Acupuntura', text: 'A acupuntura mudou minha relação com a dor crônica. Profissionais qualificados e cuidado real em cada sessão.', initials: 'FR' },
];

export default function Testimonials() {
  return (
    <section id="depoimentos" className="py-24 bg-[#F5EFE6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-widest text-[#B67D35] font-medium">Depoimentos</span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-[#2b2622] mt-3 tracking-tight">
            O que nossos clientes dizem
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-7 border border-[#E0DCD6] relative">
              <Quote className="absolute top-6 right-6 text-[#B67D35]/15" size={40} />
              <div className="flex gap-1 mb-4">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={15} className="fill-[#B67D35] text-[#B67D35]" />
                ))}
              </div>
              <p className="text-[#2b2622]/75 leading-relaxed text-sm relative z-10">{t.text}</p>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-[#E0DCD6]">
                <div className="w-11 h-11 rounded-full bg-[#B67D35] flex items-center justify-center text-white font-display font-semibold text-sm">
                  {t.initials}
                </div>
                <div>
                  <p className="font-medium text-[#2b2622] text-sm">{t.name}</p>
                  <p className="text-xs text-[#2b2622]/50">{t.service}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}