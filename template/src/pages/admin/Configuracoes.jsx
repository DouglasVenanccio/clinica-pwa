import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/lib/AuthContext';
import {
  Download, FileArchive, Settings as SettingsIcon, User, Bell, Shield, HelpCircle,
} from 'lucide-react';

export default function Configuracoes() {
  const { user } = useAuth();

  return (
    <div className="flex bg-[#fcf9f6] min-h-screen">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-[#E0DCD6] px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="ml-10 lg:ml-0">
            <h1 className="font-display font-bold text-xl text-[#2b2622]">Configurações</h1>
            <p className="text-xs text-[#2b2622]/50">Gerencie as configurações da clínica</p>
          </div>
        </header>

        <div className="p-4 lg:p-8 space-y-6 max-w-3xl">
          <SettingsCard icon={User} title="Perfil do Administrador" desc="Suas informações de conta">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#B67D35] flex items-center justify-center text-white font-display font-semibold">
                {(user?.full_name || 'A').charAt(0)}
              </div>
              <div>
                <p className="font-medium text-[#2b2622]">{user?.full_name || 'Administrador'}</p>
                <p className="text-sm text-[#2b2622]/50">{user?.email}</p>
              </div>
            </div>
          </SettingsCard>

          <SettingsCard icon={Bell} title="Notificações" desc="Configure seus alertas">
            <div className="space-y-3">
              <Toggle label="Novos agendamentos" defaultOn />
              <Toggle label="Cancelamentos" defaultOn />
              <Toggle label="Novos clientes" />
            </div>
          </SettingsCard>

          <SettingsCard icon={Shield} title="Segurança" desc="Configurações de segurança e acesso">
            <Link to="/admin/usuarios" className="text-sm text-[#B67D35] font-medium hover:underline">
              Gerenciar usuários e permissões →
            </Link>
          </SettingsCard>

          <SettingsCard icon={FileArchive} title="Arquivos do Site" desc="Baixe um ZIP com todos os arquivos do site">
            <a
              href="/clinicacalii-site.zip"
              download="clinicacalii-site.zip"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#B67D35] hover:bg-[#9c6829] text-white text-sm font-medium rounded-full transition-colors"
            >
              <Download size={18} /> Baixar ZIP do site
            </a>
            <p className="text-xs text-[#2b2622]/40 mt-2">
              O arquivo contém o código-fonte completo do projeto (130+ arquivos).
            </p>
          </SettingsCard>

          <SettingsCard icon={HelpCircle} title="Ajuda e Suporte" desc="Central de suporte e documentação">
            <a
              href="https://www.instagram.com/clinicacalii/"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-[#B67D35] font-medium hover:underline"
            >
              Contatar suporte →
            </a>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}

function SettingsCard({ icon: Icon, title, desc, children }) {
  return (
    <div className="bg-white border border-[#E0DCD6] rounded-2xl p-5 lg:p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#B67D35]/10 flex items-center justify-center shrink-0">
          <Icon size={18} className="text-[#B67D35]" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-[#2b2622]">{title}</h2>
          <p className="text-sm text-[#2b2622]/50">{desc}</p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Toggle({ label, defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[#2b2622]/70">{label}</span>
      <button
        onClick={() => setOn(!on)}
        className={`w-11 h-6 rounded-full transition-colors relative ${on ? 'bg-[#B67D35]' : 'bg-[#E0DCD6]'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}