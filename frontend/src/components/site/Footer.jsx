import { Link } from 'react-router-dom';
import { Phone, MapPin, Instagram, Facebook, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contato" className="bg-[#2b2622] text-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-full bg-[#B67D35] flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">B</span>
              </div>
              <span className="font-display font-semibold tracking-tight">Beleza & Bem-Estar</span>
            </div>
            <p className="text-sm text-[#FDFBF7]/70 leading-relaxed mb-5">
              Estética e fisioterapia para realçar sua beleza e bem-estar.
            </p>
            <div className="space-y-3 text-sm text-[#FDFBF7]/80">
              <p className="flex items-center gap-2"><Phone size={15} className="text-[#B67D35]" /> (11) 4002-8922</p>
              <p className="flex items-center gap-2"><MapPin size={15} className="text-[#B67D35]" /> Av. Paulista, 1500 — São Paulo</p>
            </div>
            <div className="flex gap-3 mt-5">
              <a href="#" className="w-9 h-9 rounded-full border border-[#FDFBF7]/20 flex items-center justify-center hover:bg-[#B67D35] hover:border-[#B67D35] transition-colors"><Instagram size={16} /></a>
              <a href="#" className="w-9 h-9 rounded-full border border-[#FDFBF7]/20 flex items-center justify-center hover:bg-[#B67D35] hover:border-[#B67D35] transition-colors"><Facebook size={16} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#FDFBF7]/50 mb-5">Horários</h4>
            <ul className="space-y-3 text-sm text-[#FDFBF7]/80">
              <li className="flex justify-between"><span>Seg — Sex</span><span>08h — 20h</span></li>
              <li className="flex justify-between"><span>Sábado</span><span>08h — 18h</span></li>
              <li className="flex justify-between"><span>Domingo</span><span>Fechado</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#FDFBF7]/50 mb-5">Navegação</h4>
            <ul className="space-y-3 text-sm text-[#FDFBF7]/80">
              <li><Link to="/" className="hover:text-[#B67D35]">Início</Link></li>
              <li><a href="/#servicos" className="hover:text-[#B67D35]">Serviços</a></li>
              <li><a href="/#pacotes" className="hover:text-[#B67D35]">Pacotes</a></li>
              <li><a href="/#depoimentos" className="hover:text-[#B67D35]">Depoimentos</a></li>
              <li><Link to="/agendamento" className="hover:text-[#B67D35]">Agendar</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#FDFBF7]/50 mb-5">Newsletter</h4>
            <p className="text-sm text-[#FDFBF7]/70 mb-4">Receba novidades e promoções.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-1 px-4 py-2.5 bg-[#FDFBF7]/5 border border-[#FDFBF7]/15 rounded-full text-sm text-[#FDFBF7] placeholder:text-[#FDFBF7]/40 focus:outline-none focus:border-[#B67D35]"
              />
              <button className="w-11 h-11 shrink-0 rounded-full bg-[#B67D35] hover:bg-[#9c6829] flex items-center justify-center transition-colors">
                <Send size={16} className="text-white" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-[#FDFBF7]/10 text-center text-xs text-[#FDFBF7]/50">
          © 2025 Beleza & Bem-Estar. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}