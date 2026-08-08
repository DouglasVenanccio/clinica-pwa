import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Loader2 } from 'lucide-react';

const STATUSES = [
  { value: 'pending', label: 'Pendente' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'completed', label: 'Concluído' },
  { value: 'cancelled', label: 'Cancelado' },
];
const PAYMENTS = [
  { value: 'pix', label: 'PIX' },
  { value: 'credit', label: 'Cartão de Crédito' },
  { value: 'debit', label: 'Cartão de Débito' },
];
const TIMES = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];

export default function EditAppointmentDialog({ open, appointment, onClose, onSaved }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (appointment) setForm({ ...appointment });
  }, [appointment]);

  if (!appointment) return null;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.Appointment.update(appointment.id, {
        client_name: form.client_name,
        client_phone: form.client_phone,
        professional_name: form.professional_name,
        date: form.date,
        time: form.time,
        status: form.status,
        payment_method: form.payment_method,
        total_price: Number(form.total_price),
      });
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Agendamento</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-2">
          <Input label="Cliente" value={form.client_name || ''} onChange={(v) => set('client_name', v)} />
          <Input label="Telefone" value={form.client_phone || ''} onChange={(v) => set('client_phone', v)} />
          <Input label="Serviço" value={form.service_name || ''} onChange={() => {}} disabled />
          <Input label="Profissional" value={form.professional_name || ''} onChange={(v) => set('professional_name', v)} />
          <Input label="Data" type="date" value={form.date || ''} onChange={(v) => set('date', v)} />
          <Select label="Horário" value={form.time || ''} options={TIMES} onChange={(v) => set('time', v)} />
          <Select label="Status" value={form.status || 'pending'} options={STATUSES} onChange={(v) => set('status', v)} />
          <Select label="Pagamento" value={form.payment_method || 'pix'} options={PAYMENTS} onChange={(v) => set('payment_method', v)} />
          <Input label="Total (R$)" type="number" value={form.total_price || ''} onChange={(v) => set('total_price', v)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving} className="bg-[#B67D35] hover:bg-[#9c6829]">
            {saving ? <Loader2 className="animate-spin" size={16} /> : 'Salvar alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Input({ label, value, onChange, type = 'text', disabled }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-[#2b2622]/50 font-medium mb-1.5 block">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 bg-white border border-[#E0DCD6] rounded-lg text-sm text-[#2b2622] focus:outline-none focus:border-[#B67D35] disabled:bg-[#fcf9f6] disabled:text-[#2b2622]/50"
      />
    </div>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-[#2b2622]/50 font-medium mb-1.5 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 bg-white border border-[#E0DCD6] rounded-lg text-sm text-[#2b2622] focus:outline-none focus:border-[#B67D35]"
      >
        {options.map((o) => {
          const val = typeof o === 'string' ? o : o.value;
          const lbl = typeof o === 'string' ? o : o.label;
          return <option key={val} value={val}>{lbl}</option>;
        })}
      </select>
    </div>
  );
}