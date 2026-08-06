import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import { CalendarDays, Clock, ArrowLeft, Loader2, X, RefreshCw } from 'lucide-react';

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d + 'T00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmado', color: 'bg-green-100 text-green-700' },
  pending: { label: 'Pendente', color: 'bg-amber-100 text-amber-700' },
  completed: { label: 'Concluido', color: 'bg-blue-100 text-blue-700' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700' },
};

export default function MeusAgendamentos() {
  const { user } = useAuth();
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.Appointment.filter({ client_email: user?.email });
      setAppts(data || []);
    } catch {
      setAppts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) load();
  }, [user?.email]);

  const handleCancel = async (id) => {
    if (!window.confirm('Tem certeza que deseja cancelar este agendamento?')) return;
    setCancelling(id);
    try {
      await api.Appointment.update(id, { status: 'cancelled' });
      setAppts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)));
    } catch {
      alert('Erro ao cancelar agendamento.');
    } finally {
      setCancelling(null);
    }
  };

  const upcoming = appts.filter((a) => ['confirmed', 'pending'].includes(a.status));
  const past = appts.filter((a) => ['completed', 'cancelled'].includes(a.status));

  return (
    <div className="bg-[#FDFBF7] pt-20 min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#2b2622]/50 hover:text-[#B67D35] mb-6 transition-colors">
          <ArrowLeft size={16} /> Voltar
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-[#B67D35]/10 flex items-center justify-center">
            <CalendarDays size={22} className="text-[#B67D35]" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-[#2b2622]">Meus Agendamentos</h1>
            <p className="text-sm text-[#2b2622]/50">Acompanhe seus horarios</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-[#B67D35]" size={28} />
          </div>
        ) : appts.length === 0 ? (
          <div className="text-center py-16">
            <CalendarDays className="mx-auto mb-3 text-[#2b2622]/20" size={40} />
            <p className="text-[#2b2622]/50 mb-4">Voce ainda nao tem agendamentos.</p>
            <Link to="/agendamento" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B67D35] hover:bg-[#9c6829] text-white rounded-xl text-sm font-medium transition-colors">
              Agendar agora
            </Link>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-[#2b2622]/60 uppercase tracking-wider mb-3">Proximos</h2>
                <div className="space-y-3">
                  {upcoming.map((a) => {
                    const st = STATUS_CONFIG[a.status] || STATUS_CONFIG.pending;
                    return (
                      <div key={a.id} className="bg-white border border-[#E0DCD6] rounded-xl p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-display font-semibold text-[#2b2622]">{a.service_name}</p>
                            <p className="text-sm text-[#2b2622]/60 mt-1">{a.professional_name}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-[#2b2622]/50">
                              <span className="flex items-center gap-1"><CalendarDays size={12} /> {fmtDate(a.date)}</span>
                              <span className="flex items-center gap-1"><Clock size={12} /> {a.time}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                            {a.status !== 'cancelled' && (
                              <button
                                onClick={() => handleCancel(a.id)}
                                disabled={cancelling === a.id}
                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Cancelar"
                              >
                                {cancelling === a.id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm font-bold text-[#B67D35]">R$ {Number(a.total_price || 0).toFixed(2).replace('.', ',')}</span>
                          {a.status !== 'cancelled' && (
                            <Link to="/agendamento" className="text-xs text-[#B67D35] hover:underline flex items-center gap-1">
                              <RefreshCw size={12} /> Reagendar
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-[#2b2622]/60 uppercase tracking-wider mb-3">Historico</h2>
                <div className="space-y-3">
                  {past.map((a) => {
                    const st = STATUS_CONFIG[a.status] || STATUS_CONFIG.pending;
                    return (
                      <div key={a.id} className="bg-white border border-[#E0DCD6] rounded-xl p-5 opacity-70">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-display font-semibold text-[#2b2622]">{a.service_name}</p>
                            <p className="text-sm text-[#2b2622]/60 mt-1">{a.professional_name}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-[#2b2622]/50">
                              <span className="flex items-center gap-1"><CalendarDays size={12} /> {fmtDate(a.date)}</span>
                              <span className="flex items-center gap-1"><Clock size={12} /> {a.time}</span>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                        </div>
                        <div className="mt-3">
                          <span className="text-sm font-bold text-[#2b2622]/60">R$ {Number(a.total_price || 0).toFixed(2).replace('.', ',')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
