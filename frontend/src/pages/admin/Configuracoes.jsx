import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { api } from '@/api/apiClient';
import { useConfig } from '@/lib/ConfigContext';
import { ArrowLeft, Settings, Save, Loader2, Upload, Image } from 'lucide-react';

const DEFAULTS = {
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
  logo_url: '',
  favicon_url: '',
  site_title: 'Beleza & Bem-Estar',
};

export default function Configuracoes() {
  const [config, setConfig] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const logoInput = useRef(null);
  const faviconInput = useRef(null);
  const { refreshConfig } = useConfig();

  useEffect(() => {
    api.Config.get()
      .then((data) => setConfig((prev) => ({ ...prev, ...data })))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (key, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Imagem deve ter no maximo 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      handleChange(key, ev.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.Config.save(config);
      await refreshConfig();
      alert('Configuracoes salvas com sucesso!');
    } catch {
      alert('Erro ao salvar configuracoes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F5EFE6]">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#B67D35]" size={32} />
        </main>
      </div>
    );
  }

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
            <h1 className="text-2xl font-display font-bold text-[#2b2622]">Configuracoes</h1>
            <p className="text-sm text-[#2b2622]/50">Preferencias gerais da clinica</p>
          </div>
        </div>

        <div className="space-y-6 max-w-2xl">
          {/* Aparencia */}
          <div className="bg-white rounded-xl p-6 border border-[#E0DCD6]">
            <h3 className="text-sm font-semibold text-[#2b2622] mb-4 flex items-center gap-2">
              <Image size={16} className="text-[#B67D35]" /> Aparencia do Site
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">Titulo do Site</label>
                <input
                  type="text"
                  value={config.site_title}
                  onChange={(e) => handleChange('site_title', e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0DCD6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B67D35]/30 focus:border-[#B67D35]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">Logo do Site</label>
                  <input type="file" ref={logoInput} accept="image/*" className="hidden" onChange={(e) => handleImageUpload('logo_url', e)} />
                  <button onClick={() => logoInput.current?.click()} className="w-full flex items-center gap-2 px-3 py-8 border-2 border-dashed border-[#E0DCD6] rounded-lg text-sm text-[#2b2622]/40 hover:border-[#B67D35] hover:text-[#B67D35] transition-colors">
                    {config.logo_url ? (
                      <img src={config.logo_url} alt="Logo" className="h-12 object-contain" />
                    ) : (
                      <>
                        <Upload size={18} />
                        Carregar logo (max 2MB)
                      </>
                    )}
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">Favicon</label>
                  <input type="file" ref={faviconInput} accept="image/*" className="hidden" onChange={(e) => handleImageUpload('favicon_url', e)} />
                  <button onClick={() => faviconInput.current?.click()} className="w-full flex items-center gap-2 px-3 py-8 border-2 border-dashed border-[#E0DCD6] rounded-lg text-sm text-[#2b2622]/40 hover:border-[#B67D35] hover:text-[#B67D35] transition-colors">
                    {config.favicon_url ? (
                      <img src={config.favicon_url} alt="Favicon" className="h-12 object-contain" />
                    ) : (
                      <>
                        <Upload size={18} />
                        Carregar favicon (max 2MB)
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dados da Clinica */}
          <div className="bg-white rounded-xl p-6 border border-[#E0DCD6]">
            <h3 className="text-sm font-semibold text-[#2b2622] mb-4">Dados da Clinica</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">Nome</label>
                <input type="text" value={config.nome_clinica} onChange={(e) => handleChange('nome_clinica', e.target.value)} className="w-full px-3 py-2 border border-[#E0DCD6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B67D35]/30 focus:border-[#B67D35]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">Telefone</label>
                  <input type="text" value={config.telefone} onChange={(e) => handleChange('telefone', e.target.value)} className="w-full px-3 py-2 border border-[#E0DCD6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B67D35]/30 focus:border-[#B67D35]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">E-mail</label>
                  <input type="email" value={config.email_contato} onChange={(e) => handleChange('email_contato', e.target.value)} className="w-full px-3 py-2 border border-[#E0DCD6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B67D35]/30 focus:border-[#B67D35]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">Endereco</label>
                <input type="text" value={config.endereco} onChange={(e) => handleChange('endereco', e.target.value)} className="w-full px-3 py-2 border border-[#E0DCD6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B67D35]/30 focus:border-[#B67D35]" />
              </div>
            </div>
          </div>

          {/* Horario de Funcionamento */}
          <div className="bg-white rounded-xl p-6 border border-[#E0DCD6]">
            <h3 className="text-sm font-semibold text-[#2b2622] mb-4">Horario de Funcionamento</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">Abertura</label>
                <input type="time" value={config.horario_abertura} onChange={(e) => handleChange('horario_abertura', e.target.value)} className="w-full px-3 py-2 border border-[#E0DCD6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B67D35]/30 focus:border-[#B67D35]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">Fechamento</label>
                <input type="time" value={config.horario_fechamento} onChange={(e) => handleChange('horario_fechamento', e.target.value)} className="w-full px-3 py-2 border border-[#E0DCD6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B67D35]/30 focus:border-[#B67D35]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">Duracao do slot (min)</label>
                <input type="number" value={config.slot_duration_min} onChange={(e) => handleChange('slot_duration_min', Number(e.target.value))} className="w-full px-3 py-2 border border-[#E0DCD6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B67D35]/30 focus:border-[#B67D35]" />
              </div>
            </div>
          </div>

          {/* Regras */}
          <div className="bg-white rounded-xl p-6 border border-[#E0DCD6]">
            <h3 className="text-sm font-semibold text-[#2b2622] mb-4">Regras</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">Antecedencia minima para cancelamento (horas)</label>
                <input type="number" value={config.antecedencia_cancelamento_h} onChange={(e) => handleChange('antecedencia_cancelamento_h', Number(e.target.value))} className="w-full px-3 py-2 border border-[#E0DCD6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B67D35]/30 focus:border-[#B67D35]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">Desconto PIX (%)</label>
                <input type="number" value={config.desconto_pix} onChange={(e) => handleChange('desconto_pix', Number(e.target.value))} className="w-full px-3 py-2 border border-[#E0DCD6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B67D35]/30 focus:border-[#B67D35]" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={config.lembrete_whatsapp} onChange={(e) => handleChange('lembrete_whatsapp', e.target.checked)} className="w-4 h-4 text-[#B67D35] border-[#E0DCD6] rounded focus:ring-[#B67D35]" />
                <label className="text-sm text-[#2b2622]">Enviar lembrete por WhatsApp</label>
              </div>
              {config.lembrete_whatsapp && (
                <div>
                  <label className="block text-xs font-medium text-[#2b2622]/60 mb-1">Enviar lembrete (horas antes)</label>
                  <input type="number" value={config.lembrete_horas_antes} onChange={(e) => handleChange('lembrete_horas_antes', Number(e.target.value))} className="w-full px-3 py-2 border border-[#E0DCD6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B67D35]/30 focus:border-[#B67D35]" />
                </div>
              )}
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#B67D35] hover:bg-[#9c6829] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Salvar Configuracoes
          </button>
        </div>
      </main>
    </div>
  );
}
