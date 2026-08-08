import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import {
  CalendarDays, X, ArrowLeft, Loader2, UserCog, CalendarClock,
} from 'lucide-react';

const WEEKDAYS = [
  { key: 'slots_mon', label: 'Segunda' },
  { key: 'slots_tue', label: 'Terca' },
  { key: 'slots_wed', label: 'Quarta' },
  { key: 'slots_thu', label: 'Quinta' },
  { key: 'slots_fri', label: 'Sexta' },
  { key: 'slots_sat', label: 'Sabado' },
  { key: 'slots_sun', label: 'Domingo' },
];

const DEFAULT_SLOTS = '08:00,09:00,10:00,11:00,13:00,14:00,15:00,16:00,17:00,18:00,19:00';
const fmtDate = (d) => new Date(d + 'T00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

export default function PainelColaborador() {
  const { user } = useAuth();
  const proName = user?.nome || user?.name || '';

  const [appointments, setAppointments] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [isNewSchedule, setIsNewSchedule] = useState(false);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [moveAppt, setMoveAppt] = useState(null);
  const [moveTo, setMoveTo] = useState('');

  const load = async () => {
    if (!proName) return;
    setLoading(true);
    try {
      const [appts, sched, pros] = await Promise.all([
        api.Appointment.filter({ professional_name: proName }),
        api.Schedule.filter({ professional_name: proName }),
        api.Professional.list(),
      ]);
      setAppointments(appts || []);
      setProfessionals(pros || []);
      if (sched && sched.length) {
        setSchedule(sched[0]);
        setIsNewSchedule(false);
      } else {
        const defaults = { professional_name: proName };
        WEEKDAYS.forEach((d) => {
          defaults[d.key] = d.key === 'slots_sun' ? '' : DEFAULT_SLOTS;
        });
        defaults.days_off = '';
        setSchedule(defaults);
        setIsNewSchedule(true);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [proName]);

  const handleSlotChange = (key, value) => {
    setSchedule((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSchedule = async () => {
    if (!schedule) return;
    setSaving(true);
    try {
      const payload = {
        professional_name: proName,
        slots_mon: schedule.slots_mon,
        slots_tue: schedule.slots_tue,
        slots_wed: schedule.slots_wed,
        slots_thu: schedule.slots_thu,
        slots_fri: schedule.slots_fri,
        slots_sat: schedule.slots_sat,
        slots_sun: schedule.slots_sun,
        days_off: schedule.days_off,
      };
      if (isNewSchedule) {
        const created = await api.Schedule.create(payload);
        setSchedule(created);
        setIsNewSchedule(false);
      } else if (schedule.id) {
        await api.Schedule.update(schedule.id, payload);
      } else {
        const created = await api.Schedule.create(payload);
        setSchedule(created);
        setIsNewSchedule(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelAppt = async (appt) => {
    if (!window.confirm(`Cancelar o agendamento de ${appt.client_name}?`)) return;
    try {
      await api.Appointment.update(appt.id, { status: 'cancelled' });
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMoveClient = async () => {
    if (!moveAppt || !moveTo) return;
    try {
      await api.Appointment.update(moveAppt.id, { professional_name: moveTo });
      setMoveAppt(null);
      setMoveTo('');
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter((a) => a.date === today && a.status !== 'cancelled');
  const upcomingAppts = appointments
    .filter((a) => a.date > today && a.status !== 'cancelled')
    .sort((a, b) => a.date.localeCompare(b.date));

  if (loading) {
    return (
      <div className="bg-[#FDFBF7] pt-20 min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#B67D35]" size={28} />
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] pt-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#2b2622]/50 hover:text-[#B67D35] mb-6">
          <ArrowLeft size={16} /> Voltar
        </Link>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-full bg-[#B67D35] flex items-center justify-center text-white font-display font-semibold">
            {proName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-[#2b2622]">{proName}</h1>
            <p className="text-xs text-[#2b2622]/50">Painel do Colaborador</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Appointments */}
          <div className="lg:col-span-2 space-y-6">
            <section>
              <h2 className="text-xs uppercase tracking-widest text-[#2b2622]/50 font-medium mb-4 flex items-center gap-2">
                <CalendarDays size={15} className="text-[#B67D35]" /> Hoje ({todayAppts.length})
              </h2>
              <div className="space-y-3">
                {todayAppts.length === 0 ? (
                  <div className="bg-white border border-[#E0DCD6] rounded-2xl p-6 text-center text-sm text-[#2b2622]/50">
                    Nenhum agendamento para hoje.
                  </div>
                ) : (
                  todayAppts.map((a) => (
                    <ColaboradorApptCard
                      key={a.id}
                      appt={a}
                      onCancel={handleCancelAppt}
                      onMove={setMoveAppt}
                      canMove={professionals.length > 1}
                    />
                  ))
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xs uppercase tracking-widest text-[#2b2622]/50 font-medium mb-4 flex items-center gap-2">
                <CalendarClock size={15} className="text-[#B67D35]" /> Proximos ({upcomingAppts.length})
              </h2>
              <div className="space-y-3">
                {upcomingAppts.length === 0 ? (
                  <div className="bg-white border border-[#E0DCD6] rounded-2xl p-6 text-center text-sm text-[#2b2622]/50">
                    Nenhum agendamento futuro.
                  </div>
                ) : (
                  upcomingAppts.map((a) => (
                    <ColaboradorApptCard
                      key={a.id}
                      appt={a}
                      onCancel={handleCancelAppt}
                      onMove={setMoveAppt}
                      canMove={professionals.length > 1}
                    />
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Schedule management */}
          <aside>
            <div className="bg-white border border-[#E0DCD6] rounded-2xl p-5 lg:sticky lg:top-24">
              <h2 className="text-xs uppercase tracking-widest text-[#2b2622]/50 font-medium mb-4 flex items-center gap-2">
                <UserCog size={15} className="text-[#B67D35]" /> Meus Horarios
              </h2>
              {isNewSchedule && (
                <p className="text-[11px] text-[#B67D35] bg-[#B67D35]/5 rounded-lg px-3 py-2 mb-3">
                  Configure sua grade de horarios. Os clientes so vera estes horarios disponiveis.
                </p>
              )}
              <div className="space-y-3">
                {WEEKDAYS.map((d) => (
                  <div key={d.key}>
                    <label className="text-xs text-[#2b2622]/60 font-medium">{d.label}</label>
                    <input
                      value={schedule?.[d.key] || ''}
                      onChange={(e) => handleSlotChange(d.key, e.target.value)}
                      placeholder="Ex: 08:00,09:00,10:00"
                      className="w-full px-3 py-1.5 bg-[#FDFBF7] border border-[#E0DCD6] rounded-lg text-xs text-[#2b2622] focus:outline-none focus:border-[#B67D35]"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-[#2b2622]/60 font-medium">Folgas (datas AAAA-MM-DD)</label>
                  <input
                    value={schedule?.days_off || ''}
                    onChange={(e) => setSchedule((prev) => ({ ...prev, days_off: e.target.value }))}
                    placeholder="Ex: 2026-08-15,2026-08-16"
                    className="w-full px-3 py-1.5 bg-[#FDFBF7] border border-[#E0DCD6] rounded-lg text-xs text-[#2b2622] focus:outline-none focus:border-[#B67D35]"
                  />
                </div>
                <button
                  onClick={handleSaveSchedule}
                  disabled={saving}
                  className="w-full py-2.5 bg-[#B67D35] hover:bg-[#9c6829] disabled:opacity-50 text-white rounded-full text-sm font-medium transition-colors"
                >
                  {saving ? <Loader2 className="animate-spin mx-auto" size={16} /> : 'Salvar Horarios'}
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Move client dialog */}
        {moveAppt && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={() => setMoveAppt(null)}
          >
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-display font-semibold text-lg text-[#2b2622] mb-2">Mover cliente</h3>
              <p className="text-sm text-[#2b2622]/60 mb-4">
                Transferir <strong>{moveAppt.client_name}</strong> ({moveAppt.service_name}) para outro profissional.
              </p>
              <select
                value={moveTo}
                onChange={(e) => setMoveTo(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E0DCD6] rounded-full text-sm text-[#2b2622] focus:outline-none focus:border-[#B67D35] mb-4"
              >
                <option value="">Selecionar profissional...</option>
                {professionals
                  .filter((p) => p.name !== proName)
                  .map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} - {p.specialty}
                    </option>
                  ))}
              </select>
              <div className="flex gap-3">
                <button
                  onClick={() => setMoveAppt(null)}
                  className="flex-1 py-2.5 border border-[#E0DCD6] rounded-full text-sm text-[#2b2622] hover:bg-[#F5EFE6]"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleMoveClient}
                  disabled={!moveTo}
                  className="flex-1 py-2.5 bg-[#B67D35] hover:bg-[#9c6829] disabled:opacity-50 text-white rounded-full text-sm font-medium"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ColaboradorApptCard({ appt, onCancel, onMove, canMove }) {
  return (
    <div className="bg-white border border-[#E0DCD6] rounded-2xl p-4 flex items-center gap-4">
      <div className="text-center shrink-0 w-14">
        <p className="font-display font-bold text-lg text-[#2b2622]">{appt.time}</p>
        <p className="text-[10px] text-[#2b2622]/50">{fmtDate(appt.date)}</p>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[#2b2622] text-sm">{appt.client_name}</p>
        <p className="text-xs text-[#2b2622]/50">
          {appt.service_name} - {appt.client_phone || 'sem telefone'}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {canMove && (
          <button
            onClick={() => onMove(appt)}
            className="p-1.5 text-[#2b2622]/40 hover:text-[#B67D35] hover:bg-[#B67D35]/10 rounded-lg transition-colors"
            title="Mover para outro profissional"
          >
            <UserCog size={15} />
          </button>
        )}
        <button
          onClick={() => onCancel(appt)}
          className="p-1.5 text-[#2b2622]/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Cancelar"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
