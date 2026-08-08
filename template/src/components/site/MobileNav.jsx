import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Scissors, Plus, Gift, MoreHorizontal, Calendar, Star,
  UserCog, LogOut, Shield,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);

  const scrollToSection = (id) => {
    setSheetOpen(false);
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 200);
    }
  };

  const isActive = (path) => (path === '/' ? location.pathname === '/' : location.pathname === path);

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#E0DCD6]">
        <div className="flex items-center justify-around h-16 px-2 pb-[env(safe-area-inset-bottom)]">
          <NavItem icon={Home} label="Início" active={isActive('/')} onClick={() => navigate('/')} />
          <NavItem icon={Scissors} label="Serviços" active={false} onClick={() => scrollToSection('servicos')} />

          <Link to="/agendamento" className="flex flex-col items-center -mt-6">
            <div className="w-14 h-14 rounded-full bg-[#B67D35] flex items-center justify-center shadow-lg shadow-[#B67D35]/30">
              <Plus size={24} className="text-white" />
            </div>
            <span className="text-[9px] text-[#2b2622]/60 font-medium mt-0.5">Agendar</span>
          </Link>

          <NavItem icon={Gift} label="Fidelidade" active={isActive('/fidelidade')} onClick={() => navigate('/fidelidade')} />
          <NavItem icon={MoreHorizontal} label="Mais" active={sheetOpen} onClick={() => setSheetOpen(true)} />
        </div>
      </nav>

      {sheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50" onClick={() => setSheetOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl p-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-[#E0DCD6] rounded-full mx-auto mb-5" />
            <div className="space-y-1">
              {isAuthenticated ? (
                <>
                  <SheetLink to="/minha-conta" icon={Calendar} label="Minha Conta" onClick={() => setSheetOpen(false)} />
                  {(user?.role === 'colaborador' || user?.role === 'admin') && (
                    <SheetLink to="/painel" icon={UserCog} label="Painel do Colaborador" onClick={() => setSheetOpen(false)} />
                  )}
                  {user?.role === 'admin' && (
                    <SheetLink to="/admin" icon={Shield} label="Painel Administrativo" onClick={() => setSheetOpen(false)} />
                  )}
                  <SheetLink to="/avaliacao" icon={Star} label="Avaliar Atendimento" onClick={() => setSheetOpen(false)} />
                  <button
                    onClick={() => { setSheetOpen(false); logout(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut size={18} /> Sair
                  </button>
                </>
              ) : (
                <>
                  <SheetLink to="/login" icon={UserCog} label="Entrar / Criar conta" onClick={() => setSheetOpen(false)} />
                  <SheetLink to="/avaliacao" icon={Star} label="Avaliar Atendimento" onClick={() => setSheetOpen(false)} />
                  <SheetLink to="/fidelidade" icon={Gift} label="Programa de Fidelidade" onClick={() => setSheetOpen(false)} />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center gap-0.5 px-2 py-1">
      <Icon size={20} className={active ? 'text-[#B67D35]' : 'text-[#2b2622]/50'} />
      <span className={`text-[9px] font-medium ${active ? 'text-[#B67D35]' : 'text-[#2b2622]/50'}`}>{label}</span>
    </button>
  );
}

function SheetLink({ to, icon: Icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 text-sm text-[#2b2622] hover:bg-[#F5EFE6] rounded-xl transition-colors"
    >
      <Icon size={18} className="text-[#B67D35]" />
      {label}
    </Link>
  );
}