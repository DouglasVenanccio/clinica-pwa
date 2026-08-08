import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import EditAppointmentDialog from '@/components/admin/EditAppointmentDialog';
import {
  ArrowLeft, Clock, CalendarDays, X, Pencil, Loader2, Plus,
  Award, Wallet, ChevronRight,
} from 'lucide-react';

const TIERS = [
  { name: 'Bronze', min: 0 },
  { name: 'Prata', min: 500 },
  { name: 'Ouro', min: 2000 },
  { name: 'Diamante', min: 5000 },
];

const fmt = (v) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`;
const fmtDate = (d) => new Date(d + 'T00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
const fmtDateShort = (d) => new Date(d + 'T00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

const STATUS_MAP = {
  confirmed: { cls: 'bg-emerald-50 text-emerald-700', label: 'Confirmado' },
  pending: { cls: 'bg-orange-50 text-orange-700', label: 'Pendente' },
  cancelled: { cls: 'bg-red-50 text-red-700', label: 'Cancelado' },
  completed: { cls: 'bg-blue-50 text-blue-700', label: 'Concluído' },
};

export default function MinhaConta() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loyalty, setLoyalty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const load = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const [appts, cards] = await Promise.all([
        base44.entities.Appointment.filter({ client_email: user.email }, '-date', 50),
        base44.entities.LoyaltyCard.filter({ client_email: user.email }),
      ]);
      setAppointments(appts || []);
      setLoyalty(cards && cards.length ? cards[0] : null);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user?.email]);

  const handleCancel = async (appt) => {
    if (!window.confirm('Deseja cancelar este agendamento?')) return;
    try {
      await base44.entities.Appointment.update(appt.id, { status: 'cancelled' });
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const openEdit = (appt) => {
    setEditing(appt);
    setEditOpen(true);
  };

  const today = new Date().toISOString().split('T')[0];
  const upcoming = appointments.filter((a) => a.date >= today && a.status !== 'cancelled');
  const history = appointments.filter((a) => a.date < today || a.status === 'cancelled');

  const points = loyalty?.points || 0;
  const currentTier = [...TIERS].reverse().find((t) => points >= t.min) || TIERS[0];
  const nextTier = TIERS.find((t) => t.min > points);
  const progress = nextTier ? ((points - currentTier.min) / (nextTier.min - currentTier.min)) * 100 : 100;

  if (loading) {
    return (
      <div className="bg-[#FDFBF7] pt-20 min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#B67D35]" size={28} />
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] pt-20 min-h-screen pb-8">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#2b2622]/50 hover:text-[#B67D35] mb-6">
          <ArrowLeft size={16} /> Voltar ao início
        </Link>

        {/* User header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-[#B67D35] flex items-center justify-center text-white font-display font-semibold text-xl">
            {(user?.full_name || user?.email || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-[#2b2622]">
              Olá, {user?.full_name?.split(' ')[0] || 'Cliente'}!
            </h1>
            <p className="text-sm text-[#2b2622]/50">{user?.email}</p>
          </div>
        </div>

        {/* Loyalty summary */}
        <div className="bg-gradient-to-br from-[#2b2622] to-[#3d3530] text-[#FDFBF7] rounded-2xl p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#B67D35]/10 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="relative flex items-start justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#FDFBF7]/50 mb-1">Programa de Fidelidade</p>
              <p className="font-display font-bold text-2xl">{points.toLocaleString('pt-BR')} pontos</p>
              <p className="text-sm text-[#FDFBF7]/60">Nível {currentTier.name}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#B67D35]/20 flex items-center justify-center shrink-0">
              <Award size={24} className="text-[#B67D35]" />
            </div>
          </div>
          {nextTier ? (
            <div className="relative">
              <div className="flex justify-between text-xs text-[#FDFBF7]/60 mb-1.5">
                <span>Progresso para {nextTier.name}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#B67D35] rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-[11px] text-[#FDFBF7]/40 mt-1.5">
                Faltam {(nextTier.min - points).toLocaleString('pt-BR')} pontos para {nextTier.name}
              </p>
            </div>
          ) : (
            <p className="relative text-sm text-[#B67D35] font-medium">Você está no nível máximo! 🎉</p>
          )}
          <Link to="/fidelidade" className="relative inline-flex items-center gap-1 text-xs text-[#B67D35] font-medium mt-4 hover:underline">
            Ver todos os benefícios <ChevronRight size={14} />
          </Link>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard icon={CalendarDays} label="Visitas" value={String(loyalty?.visits || 0)} />
          <StatCard icon={Wallet} label="Investido" value={fmt(loyalty?.total_spent || 0)} />
          <StatCard icon={Award} label="Nível" value={currentTier.name} />
        </div>

        {/* Upcoming appointments */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-[#2b2622]">Próximos Agendamentos</h2>
            <Link to="/agendamento" className="text-sm text-[#B67D35] font-medium hover:underline flex items-center gap-1">
              <Plus size={14} /> Novo
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="bg-white border border-[#E0DCD6] rounded-2xl p-8 text-center">
              <CalendarDays className="mx-auto mb-3 text-[#2b2622]/20" size={32} />
              <p className="text-sm text-[#2b2622]/50 mb-4">Você não tem agendamentos futuros.</p>
              <Link
                to="/agendamento"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B67D35] hover:bg-[#9c6829] rounded-full text-sm text-white font-medium transition-colors"
              >
                <Plus size={16} /> Agendar agora
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((a) => (
                <AppointmentCard key={a.id} appt={a} onCancel={handleCancel} onEdit={openEdit} />
              ))}
            </div>
          )}
        </section>

        {/* Visit history */}
        <section>
          <h2 className="font-display font-semibold text-lg text-[#2b2622] mb-4">Histórico de Visitas</h2>
          {history.length === 0 ? (
            <div className="bg-white border border-[#E0DCD6] rounded-2xl p-8 text-center">
              <Clock className="mx-auto mb-3 text-[#2b2622]/20" size={32} />
              <p className="text-sm text-[#2b2622]/50">Nenhuma visita registrada ainda.</p>
            </div>
          ) : (
            <div className="bg-white border border-[#E0DCD6] rounded-2xl overflow-hidden">
              {history.map((a, i) => (
                <div
                  key={a.id}
                  className={`flex items-center gap-4 px-5 py-3.5 ${
                    i !== history.length - 1 ? 'border-b border-[#E0DCD6]' : ''
                  }`}
                >
                  <div className="text-center shrink-0 w-12">
                    <p className="font-display font-bold text-sm text-[#2b2622]">
                      {fmtDateShort(a.date).split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-[#2b2622]/50 uppercase">
                      {fmtDateShort(a.date).split(' ')[1]}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2b2622] truncate">{a.service_name}</p>
                    <p className="text-xs text-[#2b2622]/50">
                      {a.professional_name} • {a.time}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <EditAppointmentDialog
        open={editOpen}
        appointment={editing}
        onClose={() => setEditOpen(false)}
        onSaved={load}
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white border border-[#E0DCD6] rounded-2xl p-4 text-center">
      <div className="w-9 h-9 rounded-full bg-[#B67D35]/10 flex items-center justify-center mx-auto mb-2">
        <Icon size={16} className="text-[#B67D35]" />
      </div>
      <p className="font-display font-bold text-lg text-[#2b2622] truncate">{value}</p>
      <p className="text-[10px] text-[#2b2622]/50 uppercase tracking-wide">{label}</p>
    </div>
  );
}

function AppointmentCard({ appt, onCancel, onEdit }) {
  const status = STATUS_MAP[appt.status] || STATUS_MAP.pending;
  const canManage = appt.status !== 'cancelled' && appt.status !== 'completed';
  return (
    <div className="bg-white border border-[#E0DCD6] rounded-2xl p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-[#B67D35]/10 flex items-center justify-center shrink-0">
        <Clock size={20} className="text-[#B67D35]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[#2b2622] text-sm">{appt.service_name}</p>
        <p className="text-xs text-[#2b2622]/50">
          {fmtDate(appt.date)} • {appt.time} • {appt.professional_name}
        </p>
      </div>
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.cls} shrink-0`}>{status.label}</span>
      {canManage && (
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(appt)}
            className="p-1.5 text-[#2b2622]/40 hover:text-[#B67D35] hover:bg-[#B67D35]/10 rounded-lg transition-colors"
            title="Remarcar"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onCancel(appt)}
            className="p-1.5 text-[#2b2622]/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Cancelar"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.pending;
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.cls} shrink-0`}>{s.label}</span>;
}