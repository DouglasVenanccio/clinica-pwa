import { Sparkles } from "lucide-react";

const items = [
  { title: "Limpeza de Pele Profunda", before: "https://images.unsplash.com/photo-1616394584738-fc67039e13af?w=600&q=80", after: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80", desc: "Pele renovada e radiante apos 3 sessoes." },
  { title: "Drenagem Linfatica", before: "https://images.unsplash.com/photo-1601737487795-dab272f52420?w=600&q=80", after: "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=600&q=80", desc: "Reducao visivel de retencao de liquidos." },
  { title: "Massagem Modeladora", before: "https://images.unsplash.com/photo-1544161515-4ab6ce6db829?w=600&q=80", after: "https://images.unsplash.com/photo-1548931870507-cef625e9e5cc?w=600&q=80", desc: "Contorno definido e firmeza em 5 sessoes." },
];

export default function BeforeAfter() {
  return (
    <section id="antes-depois" className="py-24 bg-creme-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-widest text-dourado font-medium">Resultados Reais</span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-marrom mt-3 tracking-tight">
            Antes & Depois
          </h2>
          <p className="text-marrom/60 mt-4 leading-relaxed">
            Veja a transformacao que nossos tratamentos proporcionam.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.title} className="bg-white rounded-2xl overflow-hidden border border-border group">
              <div className="grid grid-cols-2">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={item.before} alt="Antes" className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full">Antes</span>
                </div>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={item.after} alt="Depois" className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-dourado text-white text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full">Depois</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={14} className="text-dourado" />
                  <h3 className="font-display font-semibold text-sm text-marrom">{item.title}</h3>
                </div>
                <p className="text-xs text-marrom/60 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}