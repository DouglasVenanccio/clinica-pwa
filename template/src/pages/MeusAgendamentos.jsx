import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import EditAppointmentDialog from '@/components/admin/EditAppointmentDialog';
import { CalendarDays, Clock, X, Pencil, Loader2, Plus } from 'lucide-react';

const fmtDate = (d) =>
  new Date(d + 'T00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

const STATUS_MAP = {
  confirmed: { cls: 'bg-emerald-50 text-emerald-700', label: 'Confirmado' },
  pending: { cls: 'bg-orange-50 text-orange-700', label: 'Pendente' },
  cancelled: { cls: 'bg-red-50 text-red-700', label: 'Cancelado' },
  completed: { cls: 'bg-blue-50 text-blue-700', label: 'Concluído' },
};

export default function MeusAgendamentos() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const load = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const data = await base44.entities.Appointment.filter({ client_email: user.email }, '-date', 50);
      setAppointments(data || []);
    } catch {
      setAppointments([]);
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
  const past = appointments.filter((a) => a.date < today || a.status === 'cancelled');

  return (
    <div className="bg-[#FDFBF7] pt-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#2b2622]/50 hover:text-[#B67D35] mb-6">
          ← Voltar
        </Link>
        <h1 className="font-display font-bold text-3xl text-[#2b2622]">Meus Agendamentos</h1>
        <p className="text-[#2b2622]/60 mt-2">Gerencie seus horários agendados.</p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#B67D35]" size={28} />
          </div>
        ) : upcoming.length === 0 && past.length === 0 ? (
          <div className="bg-white border border-[#E0DCD6] rounded-2xl p-12 mt-6 text-center">
            <CalendarDays className="mx-auto mb-3 text-[#2b2622]/20" size={40} />
            <p className="text-sm text-[#2b2622]/60">Você ainda não tem agendamentos.</p>
            <Link
              to="/agendamento"
              className="inline-flex items-center gap-2 mt-5 px-6 py-2.5 bg-[#B67D35] hover:bg-[#9c6829] rounded-full text-sm text-white font-medium transition-colors"
            >
              <Plus size={16} /> Agendar agora
            </Link>
          </div>
        ) : (
          <div className="space-y-8 mt-6">
            {upcoming.length > 0 && (
              <div>
                <h2 className="text-xs uppercase tracking-widest text-[#2b2622]/50 font-medium mb-4">Próximos</h2>
                <div className="space-y-3">
                  {upcoming.map((a) => (
                    <AppointmentCard key={a.id} appt={a} onCancel={handleCancel} onEdit={openEdit} />
                  ))}
                </div>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <h2 className="text-xs uppercase tracking-widest text-[#2b2622]/50 font-medium mb-4">Histórico</h2>
                <div className="space-y-3">
                  {past.map((a) => (
                    <AppointmentCard key={a.id} appt={a} onCancel={handleCancel} onEdit={openEdit} readonly />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
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

function AppointmentCard({ appt, onCancel, onEdit, readonly }) {
  const status = STATUS_MAP[appt.status] || STATUS_MAP.pending;
  const canManage = !readonly && appt.status !== 'cancelled' && appt.status !== 'completed';
  return (
    <div className="bg-white border border-[#E0DCD6] rounded-2xl p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-[#B67D35]/10 flex items-center justify-center shrink-0">
        <Clock size={20} className="text-[#B67D35]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[#2b2622]">{appt.service_name}</p>
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