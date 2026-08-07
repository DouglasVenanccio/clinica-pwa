import { Link } from 'react-router-dom';
import { Phone, MapPin, Instagram, Facebook, Send } from 'lucide-react';
import { useConfig } from '@/lib/ConfigContext';

export default function Footer() {
  const { config } = useConfig();
  const clinicName = config?.nome_clinica || 'Beleza & Bem-Estar';
  const telefone = config?.telefone || '(11) 4002-8922';
  const endereco = config?.endereco || 'Av. Paulista, 1500 — São Paulo';
  const horarioAbertura = config?.horario_abertura || '08:00';
  const horarioFechamento = config?.horario_fechamento || '20:00';
  const footerTexto = config?.footer_texto || 'Estética e fisioterapia para realçar sua beleza e bem-estar.';
  const socialInstagram = config?.social_instagram || '';
  const socialFacebook = config?.social_facebook || '';
  const socialWhatsapp = config?.social_whatsapp || '';
  const corPrimaria = config?.cor_primaria || '#B67D35';
  return (
    <footer id="contato" className="bg-[#2b2622] text-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-5">
              {config?.logo_url ? (
                <img src={config.logo_url} alt={clinicName} className="h-9 w-auto object-contain" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#B67D35] flex items-center justify-center">
                  <span className="text-white font-display font-bold text-sm">B</span>
                </div>
              )}
              <span className="font-display font-semibold tracking-tight">{clinicName}</span>
            </div>
            <p className="text-sm text-[#FDFBF7]/70 leading-relaxed mb-5">
              {footerTexto}
            </p>
            <div className="space-y-3 text-sm text-[#FDFBF7]/80">
              <p className="flex items-center gap-2"><Phone size={15} className="text-[#B67D35]" /> {telefone}</p>
              <p className="flex items-center gap-2"><MapPin size={15} className="text-[#B67D35]" /> {endereco}</p>
            </div>
            <div className="flex gap-3 mt-5">
              {socialInstagram && (
                <a href={socialInstagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full border border-[#FDFBF7]/20 flex items-center justify-center hover:border-[#B67D35] transition-colors" style={{'--tw-hover-bg': corPrimaria}}><Instagram size={16} /></a>
              )}
              {socialFacebook && (
                <a href={socialFacebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full border border-[#FDFBF7]/20 flex items-center justify-center hover:border-[#B67D35] transition-colors"><Facebook size={16} /></a>
              )}
              {socialWhatsapp && (
                <a href={`https://wa.me/${socialWhatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-9 h-9 rounded-full border border-[#FDFBF7]/20 flex items-center justify-center hover:border-[#B67D35] transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              )}
              {!socialInstagram && !socialFacebook && !socialWhatsapp && (
                <>
                  <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-[#FDFBF7]/20 flex items-center justify-center hover:border-[#B67D35] transition-colors"><Instagram size={16} /></a>
                  <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-[#FDFBF7]/20 flex items-center justify-center hover:border-[#B67D35] transition-colors"><Facebook size={16} /></a>
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#FDFBF7]/50 mb-5">Horários</h4>
            <ul className="space-y-3 text-sm text-[#FDFBF7]/80">
              <li className="flex justify-between"><span>Seg — Sex</span><span>{horarioAbertura} — {horarioFechamento}</span></li>
              <li className="flex justify-between"><span>Sábado</span><span>{horarioAbertura} — 18h</span></li>
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
                aria-label="E-mail para newsletter"
                className="flex-1 px-4 py-2.5 bg-[#FDFBF7]/5 border border-[#FDFBF7]/15 rounded-full text-sm text-[#FDFBF7] placeholder:text-[#FDFBF7]/40 focus:outline-none focus:border-[#B67D35]"
              />
              <button aria-label="Enviar" className="w-11 h-11 shrink-0 rounded-full bg-[#B67D35] hover:bg-[#9c6829] flex items-center justify-center transition-colors">
                <Send size={16} className="text-white" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-[#FDFBF7]/10 text-center text-xs text-[#FDFBF7]/50">
          © 2025 {clinicName}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}