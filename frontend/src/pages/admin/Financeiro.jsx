import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { api } from '@/api/apiClient';
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, DollarSign, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const fmt = (v) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`;

export default function Financeiro() {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.Appointment.list('-created_date', 200)
      .then(setAppts)
      .catch(() => setAppts([]))
      .finally(() => setLoading(false));
  }, []);

  const completed = appts.filter((a) => a.status === 'completed');
  const cancelled = appts.filter((a) => a.status === 'cancelled');
  const pending = appts.filter((a) => a.status === 'pending');
  const confirmed = appts.filter((a) => a.status === 'confirmed');

  const totalReceita = completed.reduce((s, a) => s + Number(a.total_price || 0), 0);
  const totalPendente = pending.reduce((s, a) => s + Number(a.total_price || 0), 0) + confirmed.reduce((s, a) => s + Number(a.total_price || 0), 0);
  const totalCancelado = cancelled.reduce((s, a) => s + Number(a.total_price || 0), 0);

  const byMonth = {};
  completed.forEach((a) => {
    const d = new Date(a.date || a.criadoEm);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    byMonth[key] = (byMonth[key] || 0) + Number(a.total_price || 0);
  });
  const monthData = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => ({ name, value }));

  const byMethod = {};
  completed.forEach((a) => {
    const m = a.payment_method || 'outro';
    byMethod[m] = (byMethod[m] || 0) + Number(a.total_price || 0);
  });
  const methodLabels = { pix: 'PIX', credit: 'Crédito', debit: 'Débito', outro: 'Outro' };
  const methodData = Object.entries(byMethod).map(([key, value]) => ({
    name: methodLabels[key] || key,
    value,
  }));

  return (
    <div className="flex min-h-screen bg-[#F5EFE6]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-[#2b2622]/60 hover:text-[#2b2622] mb-6 transition-colors">
          <ArrowLeft size={16} /> Voltar ao Painel
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-[#B67D35]/10 flex items-center justify-center">
            <Wallet size={22} className="text-[#B67D35]" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-[#2b2622]">Financeiro</h1>
            <p className="text-sm text-[#2b2622]/50">Controle de receitas e pagamentos</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#B67D35]" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-5 border border-[#E0DCD6]">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={18} className="text-green-600" />
                  <span className="text-sm font-medium text-[#2b2622]/60">Receita Confirmada</span>
                </div>
                <p className="text-2xl font-bold text-[#2b2622]">{fmt(totalReceita)}</p>
                <p className="text-xs text-[#2b2622]/40 mt-1">{completed.length} agendamentos concluídos</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-[#E0DCD6]">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={18} className="text-amber-500" />
                  <span className="text-sm font-medium text-[#2b2622]/60">Pendente / Confirmado</span>
                </div>
                <p className="text-2xl font-bold text-[#2b2622]">{fmt(totalPendente)}</p>
                <p className="text-xs text-[#2b2622]/40 mt-1">{pending.length + confirmed.length} agendamentos</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-[#E0DCD6]">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown size={18} className="text-red-500" />
                  <span className="text-sm font-medium text-[#2b2622]/60">Cancelado</span>
                </div>
                <p className="text-2xl font-bold text-[#2b2622]">{fmt(totalCancelado)}</p>
                <p className="text-xs text-[#2b2622]/40 mt-1">{cancelled.length} agendamentos</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-[#E0DCD6]">
                <h3 className="text-sm font-semibold text-[#2b2622] mb-4">Receita por Mês</h3>
                {monthData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E0DCD6" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(v) => fmt(v)} />
                      <Bar dataKey="value" fill="#B67D35" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-[#2b2622]/40 text-center py-10">Sem dados</p>
                )}
              </div>

              <div className="bg-white rounded-xl p-6 border border-[#E0DCD6]">
                <h3 className="text-sm font-semibold text-[#2b2622] mb-4">Receita por Forma de Pagamento</h3>
                {methodData.length > 0 ? (
                  <div className="space-y-3">
                    {methodData.map((m) => (
                      <div key={m.name} className="flex items-center justify-between p-3 bg-[#F5EFE6] rounded-lg">
                        <span className="text-sm font-medium text-[#2b2622]">{m.name}</span>
                        <span className="text-sm font-bold text-[#B67D35]">{fmt(m.value)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#2b2622]/40 text-center py-10">Sem dados</p>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
