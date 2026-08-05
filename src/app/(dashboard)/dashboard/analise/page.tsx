"use client";

import { useState, useEffect } from "react";
import { Wallet, TrendingUp, Users, Scissors, CalendarX, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;
const CHART_COLORS = ["#B67D35", "#D4A05A", "#E0DCD6", "#9c6829", "#2b2622"];

interface Agendamento {
  id: string;
  service_name: string;
  status: string;
  total_price: number;
  date: string;
  time: string;
}

export default function AnalisePage() {
  const [appts, setAppts] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use mock data for now - replace with real API call
    const mockData: Agendamento[] = [
      { id: "1", service_name: "Limpeza de Pele", status: "completed", total_price: 150, date: "2026-08-01", time: "10:00" },
      { id: "2", service_name: "Massagem Relaxante", status: "completed", total_price: 150, date: "2026-08-02", time: "14:00" },
      { id: "3", service_name: "Drenagem Linfatica", status: "confirmed", total_price: 150, date: "2026-08-03", time: "09:00" },
      { id: "4", service_name: "Fisioterapia", status: "completed", total_price: 150, date: "2026-08-04", time: "11:00" },
      { id: "5", service_name: "Limpeza de Pele", status: "cancelled", total_price: 150, date: "2026-08-05", time: "15:00" },
    ];
    setAppts(mockData);
    setLoading(false);
  }, []);

  const completed = appts.filter((a) => a.status === "completed");
  const cancelled = appts.filter((a) => a.status === "cancelled");
  const revenue = completed.reduce((s, a) => s + Number(a.total_price || 0), 0);
  const avgTicket = completed.length ? revenue / completed.length : 0;
  const cancelRate = appts.length ? (cancelled.length / appts.length) * 100 : 0;

  const byService: Record<string, number> = {};
  appts.filter((a) => a.status !== "cancelled").forEach((a) => {
    byService[a.service_name] = (byService[a.service_name] || 0) + Number(a.total_price || 0);
  });
  const serviceData = Object.entries(byService).map(([name, value]) => ({ name, value }));

  const byStatus: Record<string, number> = {};
  appts.forEach((a) => { byStatus[a.status] = (byStatus[a.status] || 0) + 1; });
  const statusLabels: Record<string, string> = { confirmed: "Confirmado", pending: "Pendente", completed: "Concluido", cancelled: "Cancelado" };
  const statusData = Object.entries(byStatus).map(([key, value]) => ({ name: statusLabels[key] || key, value }));

  const byWeekday = [0, 0, 0, 0, 0, 0, 0];
  appts.filter((a) => a.status !== "cancelled").forEach((a) => {
    const d = new Date(a.date + "T00:00");
    byWeekday[d.getDay()]++;
  });
  const weekdayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  const weekdayData = weekdayLabels.map((name, i) => ({ name, agendamentos: byWeekday[i] }));

  const byHour: Record<string, number> = {};
  appts.filter((a) => a.status !== "cancelled").forEach((a) => {
    const h = (a.time || "").slice(0, 2);
    if (h) byHour[h] = (byHour[h] || 0) + 1;
  });
  const hourData = Object.entries(byHour).sort().map(([hora, count]) => ({ hora, count }));

  const metrics = [
    { label: "Faturamento Total", value: fmt(revenue), icon: Wallet },
    { label: "Ticket Medio", value: fmt(avgTicket), icon: TrendingUp },
    { label: "Agendamentos", value: String(appts.length), icon: Scissors },
    { label: "Taxa de Cancelamento", value: `${cancelRate.toFixed(1)}%`, icon: CalendarX },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-xl text-marrom">Analises & Metricas</h1>
        <p className="text-xs text-marrom/50">Desempenho da clinica</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-dourado" size={24} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {metrics.map((m) => (
              <div key={m.label} className="bg-white border border-border rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-dourado/10 flex items-center justify-center mb-4">
                  <m.icon size={18} className="text-dourado" />
                </div>
                <p className="font-display font-bold text-2xl text-marrom">{m.value}</p>
                <p className="text-xs text-marrom/50 mt-1">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white border border-border rounded-2xl p-5">
              <h2 className="font-display font-semibold text-marrom mb-4">Faturamento por Servico</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={serviceData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0DCD6" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#9c8b7a" }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#9c8b7a" }} width={90} />
                  <Tooltip formatter={(v) => fmt(Number(v))} contentStyle={{ borderRadius: 12, border: "1px solid #E0DCD6" }} />
                  <Bar dataKey="value" fill="#B67D35" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-border rounded-2xl p-5">
              <h2 className="font-display font-semibold text-marrom mb-4">Status dos Agendamentos</h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(e) => `${e.name}: ${e.value}`}>
                    {statusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E0DCD6" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-border rounded-2xl p-5">
              <h2 className="font-display font-semibold text-marrom mb-4">Ocupacao por Dia da Semana</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={weekdayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0DCD6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9c8b7a" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#9c8b7a" }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E0DCD6" }} />
                  <Bar dataKey="agendamentos" fill="#D4A05A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-border rounded-2xl p-5">
              <h2 className="font-display font-semibold text-marrom mb-4">Horarios de Pico</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={hourData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0DCD6" />
                  <XAxis dataKey="hora" tick={{ fontSize: 11, fill: "#9c8b7a" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#9c8b7a" }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E0DCD6" }} />
                  <Line type="monotone" dataKey="count" stroke="#B67D35" strokeWidth={3} dot={{ fill: "#B67D35" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}