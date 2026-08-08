import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useConfig } from '@/lib/ConfigContext';
import { Menu, X, LogOut, User, LayoutDashboard, CalendarDays, Phone } from 'lucide-react';

const navLinks = [
  { label: 'Inicio', href: '/#inicio' },
  { label: 'Sobre Nós', href: '/#sobre' },
  { label: 'Servicos', href: '/#servicos' },
  { label: 'Pacotes', href: '/#pacotes' },
  { label: 'Depoimentos', href: '/#depoimentos' },
  { label: 'Contato', href: '/#contato' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { config } = useConfig();
  const clinicName = config?.nome_clinica || 'Beleza & Bem-Estar';
  const corPrimaria = config?.cor_primaria || '#B67D35';
  const telefone = config?.telefone || '(11) 4002-8922';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setUserMenu(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setUserMenu(false);
    setOpen(false);
  }, [location]);

  const initials = user?.nome
    ? user.nome.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  useEffect(() => {
    const t = setTimeout(() => {
      const inner = document.querySelector('header .max-w-7xl');
      const row = document.querySelector('header .max-w-7xl > div');
      const ir = inner ? inner.getBoundingClientRect() : null;
      const rr = row ? row.getBoundingClientRect() : null;
      const els = Array.from(document.querySelectorAll('header a, header button')).map((el) => {
        const r = el.getBoundingClientRect();
        return `${el.tagName}:${el.getAttribute('aria-label') || el.textContent.trim().substring(0, 12)||el.className.substring(0,10)}@${Math.round(r.left)},${Math.round(r.width)}`;
      });
      document.title = 'MEASURE|vw=' + window.innerWidth + '|bodyW=' + document.body.scrollWidth + '|htmlW=' + document.documentElement.scrollWidth + '|inner=' + (ir ? Math.round(ir.left) + ',' + Math.round(ir.width) : 'x') + '|row=' + (rr ? Math.round(rr.left) + ',' + Math.round(rr.width) : 'x') + '|' + els.join('|');
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md shadow-[0_1px_0_rgba(224,220,214,0.8)]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            {config?.logo_url ? (
              <img src={config.logo_url} alt={clinicName} className="h-11 w-auto object-contain shrink-0" />
            ) : (
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: corPrimaria }}>
                <span className="text-white font-display font-bold text-base">B</span>
              </div>
            )}
            <span className="font-display font-semibold text-[17px] text-[#2b2622] tracking-tight leading-none min-w-0">
              <span className="block truncate">{clinicName}</span>
              <span className="block lg:hidden font-corpo text-[10px] text-[#2b2622]/50 font-medium mt-1 truncate">
                Estética &amp; Fisioterapia
              </span>
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

          <div className="flex items-center gap-3 shrink-0">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#F5EFE6] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-display font-semibold text-xs" style={{ backgroundColor: corPrimaria }}>
                    {initials}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-[#2b2622] max-w-[100px] truncate">
                    {user?.nome || 'Usuario'}
                  </span>
                </button>

                {userMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E0DCD6] rounded-xl shadow-lg z-50 py-2">
                      <div className="px-4 py-2 border-b border-[#E0DCD6]">
                        <p className="text-sm font-medium text-[#2b2622] truncate">{user?.nome}</p>
                        <p className="text-xs text-[#2b2622]/50 truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/agendamento"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#2b2622]/70 hover:bg-[#F5EFE6] hover:text-[#2b2622]"
                        >
                          <CalendarDays size={15} />
                          Agendar
                        </Link>
                        <Link
                          to="/meus-agendamentos"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#2b2622]/70 hover:bg-[#F5EFE6] hover:text-[#2b2622]"
                        >
                          <User size={15} />
                          Meus Agendamentos
                        </Link>
                        {(user?.role === 'ADMIN' || user?.role === 'PROFISSIONAL') && (
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-[#2b2622]/70 hover:bg-[#F5EFE6] hover:text-[#2b2622]"
                          >
                            <LayoutDashboard size={15} />
                            Painel
                          </Link>
                        )}
                        {user?.role === 'PROFISSIONAL' && (
                          <Link
                            to="/painel-colaborador"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-[#2b2622]/70 hover:bg-[#F5EFE6] hover:text-[#2b2622]"
                          >
                            <User size={15} />
                            Painel do Colaborador
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-[#E0DCD6] pt-1">
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut size={15} />
                          Sair da conta
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center px-5 py-2.5 border border-[#B67D35] text-[#B67D35] hover:bg-[#B67D35] hover:text-white text-sm font-medium rounded-full transition-colors"
              >
                Entrar
              </Link>
            )}

            <Link
              to="/agendamento"
              className="hidden sm:inline-flex items-center px-5 py-2.5 text-white text-sm font-medium rounded-full transition-colors hover:opacity-90"
              style={{ backgroundColor: corPrimaria }}
            >
              AGENDAR AGORA
            </Link>

            <a
              href={`tel:${telefone.replace(/[^0-9+]/g, '')}`}
              aria-label="Ligar para a clínica"
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: corPrimaria }}
            >
              <Phone size={18} />
            </a>

            <button
              className="lg:hidden p-2 text-[#2b2622]"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={open}
            >
              {open ? <X size={22} aria-label="Fechar menu" /> : <Menu size={22} />}
            </button>          </div>
        </div>

        {open && (
          <div className="lg:hidden fixed inset-x-0 top-20 bottom-0 bg-white z-40 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-1">
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
            {isAuthenticated ? (
              <>
                <Link to="/meus-agendamentos" onClick={() => setOpen(false)} className="px-4 py-2.5 text-sm text-[#2b2622]/80 hover:bg-[#F5EFE6] rounded-lg">
                  Meus Agendamentos
                </Link>
                {(user?.role === 'ADMIN' || user?.role === 'PROFISSIONAL') && (
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="px-4 py-2.5 text-sm text-[#2b2622]/80 hover:bg-[#F5EFE6] rounded-lg">
                    Painel
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setOpen(false); }}
                  className="px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg text-left"
                >
                  Sair da conta
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex justify-center items-center px-5 py-2.5 border border-[#B67D35] text-[#B67D35] text-sm font-medium rounded-full"
              >
                Entrar
              </Link>
            )}
            <Link
              to="/agendamento"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex justify-center items-center px-5 py-2.5 text-white text-sm font-medium rounded-full"
              style={{ backgroundColor: corPrimaria }}
            >
              AGENDAR AGORA
            </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}