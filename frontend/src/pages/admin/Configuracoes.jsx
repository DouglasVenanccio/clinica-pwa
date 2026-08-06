import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { ArrowLeft, Settings, Save, Loader2 } from 'lucide-react';

export default function Configuracoes() {
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    nome_clinica: 'Beleza & Bem-Estar',
    telefone: '(11) 99999-9999',
    email_contato: 'contato@belezabem.com.br',
    endereco: 'Rua das Flores, 123 - Jardim Primavera',
    horario_abertura: '08:00',
    horario_fechamento: '20:00',
    slot_duration_min: 60,
    antecedencia_cancelamento_h: 24,
    desconto_pix: 5,
    lembrete_whatsapp: true,
    lembrete_horas_antes: 24,
  });

  const handleChange = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: POST /api/configuracoes when endpoint is created
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="flex min-h-screen bg-[#F5EFE6]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-[#2b2622]/60 hover:text-[#2b2622] mb-6 transition-colors">
          <ArrowLeft size={16} /> Voltar ao Painel
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-[#B67D35]/10 flex items-center justify-center">
            <Settings size={22} className="text-[#B67D35]" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-[#2b2622]">Configurações</h1>
            <p className="text-sm text-[#2b2622]/50">Preferências gerais da clínica</p>
          </div>
        </div>

        <div className="space-y-6 max-w-2xl">
          {/* Dados da Clínica */}
          <div className="bg-white rounded-xl p-6 border border-[#E0DCD6]">
            <h3 className="text-sm font-semibold text-[#2b2622] mb-4">Dados da Clínica</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">Nome</label>
                <input
                  type="text"
                  value={config.nome_clinica}
                  onChange={(e) => handleChange('nome_clinica', e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0DCD6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B67D35]/30 focus:border-[#B67D35]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">Telefone</label>
                  <input
                    type="text"
                    value={config.telefone}
                    onChange={(e) => handleChange('telefone', e.target.value)}
                    className="w-full px-3 py-2 border border-[#E0DCD6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B67D35]/30 focus:border-[#B67D35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={config.email_contato}
                    onChange={(e) => handleChange('email_contato', e.target.value)}
                    className="w-full px-3 py-2 border border-[#E0DCD6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B67D35]/30 focus:border-[#B67D35]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">Endereço</label>
                <input
                  type="text"
                  value={config.endereco}
                  onChange={(e) => handleChange('endereco', e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0DCD6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B67D35]/30 focus:border-[#B67D35]"
                />
              </div>
            </div>
          </div>

          {/* Horário de Funcionamento */}
          <div className="bg-white rounded-xl p-6 border border-[#E0DCD6]">
            <h3 className="text-sm font-semibold text-[#2b2622] mb-4">Horário de Funcionamento</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">Abertura</label>
                <input
                  type="time"
                  value={config.horario_abertura}
                  onChange={(e) => handleChange('horario_abertura', e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0DCD6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B67D35]/30 focus:border-[#B67D35]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">Fechamento</label>
                <input
                  type="time"
                  value={config.horario_fechamento}
                  onChange={(e) => handleChange('horario_fechamento', e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0DCD6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B67D35]/30 focus:border-[#B67D35]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">Duração do slot (min)</label>
                <input
                  type="number"
                  value={config.slot_duration_min}
                  onChange={(e) => handleChange('slot_duration_min', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#E0DCD6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B67D35]/30 focus:border-[#B67D35]"
                />
              </div>
            </div>
          </div>

          {/* Regras */}
          <div className="bg-white rounded-xl p-6 border border-[#E0DCD6]">
            <h3 className="text-sm font-semibold text-[#2b2622] mb-4">Regras</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">Antecedência mínima para cancelamento (horas)</label>
                <input
                  type="number"
                  value={config.antecedencia_cancelamento_h}
                  onChange={(e) => handleChange('antecedencia_cancelamento_h', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#E0DCD6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B67D35]/30 focus:border-[#B67D35]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">Desconto PIX (%)</label>
                <input
                  type="number"
                  value={config.desconto_pix}
                  onChange={(e) => handleChange('desconto_pix', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#E0DCD6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B67D35]/30 focus:border-[#B67D35]"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.lembrete_whatsapp}
                  onChange={(e) => handleChange('lembrete_whatsapp', e.target.checked)}
                  className="w-4 h-4 text-[#B67D35] border-[#E0DCD6] rounded focus:ring-[#B67D35]"
                />
                <label className="text-sm text-[#2b2622]">Enviar lembrete por WhatsApp</label>
              </div>
              {config.lembrete_whatsapp && (
                <div>
                  <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">Enviar lembrete (horas antes)</label>
                  <input
                    type="number"
                    value={config.lembrete_horas_antes}
                    onChange={(e) => handleChange('lembrete_horas_antes', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E0DCD6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B67D35]/30 focus:border-[#B67D35]"
                  />
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#B67D35] hover:bg-[#9c6829] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Salvar Configurações
          </button>
        </div>
      </main>
    </div>
  );
}
