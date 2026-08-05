import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Início', href: '/#inicio' },
  { label: 'Sobre Nós', href: '/#sobre' },
  { label: 'Serviços', href: '/#servicos' },
  { label: 'Pacotes', href: '/#pacotes' },
  { label: 'Depoimentos', href: '/#depoimentos' },
  { label: 'Contato', href: '/#contato' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#FDFBF7]/95 backdrop-blur-md shadow-[0_1px_0_rgba(224,220,214,0.8)]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#B67D35] flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">B</span>
            </div>
            <span className="font-display font-semibold text-[#2b2622] tracking-tight">
              Beleza <span className="text-[#B67D35]">&</span> Bem-Estar
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="px-4 py-2 text-sm text-[#2b2622]/80 hover:text-[#B67D35] rounded-full transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/agendamento"
              className="hidden sm:inline-flex items-center px-5 py-2.5 bg-[#B67D35] hover:bg-[#9c6829] text-white text-sm font-medium rounded-full transition-colors"
            >
              AGENDAR AGORA
            </Link>
            <button
              className="lg:hidden p-2 text-[#2b2622]"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden pb-6 flex flex-col gap-1 border-t border-[#E0DCD6] pt-4">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 text-sm text-[#2b2622]/80 hover:bg-[#F5EFE6] rounded-lg"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/agendamento"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex justify-center items-center px-5 py-2.5 bg-[#B67D35] text-white text-sm font-medium rounded-full"
            >
              AGENDAR AGORA
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}