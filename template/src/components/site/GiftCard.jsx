import { Link } from 'react-router-dom';
import { Gift } from 'lucide-react';

export default function GiftCard() {
  return (
    <section id="pacotes" className="py-24 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2b2622] to-[#3d342d] px-8 py-16 lg:p-16">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#B67D35]/20 blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#B67D35] flex items-center justify-center mb-6">
                <Gift size={26} className="text-white" />
              </div>
              <h2 className="font-display font-bold text-3xl lg:text-5xl text-[#FDFBF7] tracking-tight leading-tight">
                Presenteie quem<br />você ama!
              </h2>
              <p className="text-[#FDFBF7]/70 mt-5 max-w-md leading-relaxed">
                Oferte momentos de cuidado, relaxamento e bem-estar. Vale-presente válido para todos os serviços da clínica.
              </p>
              <Link
                to="/agendamento"
                className="inline-flex items-center mt-8 px-7 py-3.5 bg-[#B67D35] hover:bg-[#9c6829] text-white font-medium rounded-full transition-colors"
              >
                Adquirir Vale-Presente
              </Link>
            </div>
            <div className="hidden lg:flex justify-end">
              <div className="w-72 h-44 rounded-2xl bg-[#B67D35] p-6 rotate-3 shadow-2xl flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-white/80 text-xs uppercase tracking-widest">Vale-Presente</span>
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <Gift size={16} className="text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-white text-3xl font-display font-bold">R$ 150,00</p>
                  <p className="text-white/70 text-xs mt-1">Clínica Calii</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}