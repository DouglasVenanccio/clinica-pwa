"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CalendarOff } from "lucide-react";

const DAYS = [
  { key: "slots_mon", label: "Segunda" },
  { key: "slots_tue", label: "Terca" },
  { key: "slots_wed", label: "Quarta" },
  { key: "slots_thu", label: "Quinta" },
  { key: "slots_fri", label: "Sexta" },
  { key: "slots_sat", label: "Sabado" },
  { key: "slots_sun", label: "Domingo" },
];

const DEFAULT_SLOTS = "08:00,09:00,10:00,11:00,13:00,14:00,15:00,16:00,17:00,18:00,19:00";

interface Profissional {
  id: string;
  usuario: { nome: string };
  especialidade: string;
}

interface Schedule {
  id?: string;
  professional_name: string;
  slots_mon?: string;
  slots_tue?: string;
  slots_wed?: string;
  slots_thu?: string;
  slots_fri?: string;
  slots_sat?: string;
  slots_sun?: string;
  days_off?: string;
}

export default function DisponibilidadePage() {
  const [pros, setPros] = useState<Profissional[]>([]);
  const [schedules, setSchedules] = useState<Record<string, Schedule>>({});
  const [selectedPro, setSelectedPro] = useState<Profissional | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Mock data for now
    const mockPros: Profissional[] = [
      { id: "1", usuario: { nome: "Juliana Almeida" }, especialidade: "Estetica" },
      { id: "2", usuario: { nome: "Carla Santos" }, especialidade: "Massagem" },
      { id: "3", usuario: { nome: "Fernanda Rocha" }, especialidade: "Fisioterapia" },
    ];
    setPros(mockPros);
    if (mockPros.length) setSelectedPro(mockPros[0]);
    setLoading(false);
  }, []);

  const current = selectedPro ? schedules[selectedPro.usuario.nome] : null;

  const getSlot = (key: string) => {
    if (!current) return key === "slots_sat" ? "08:00,09:00,10:00,11:00" : key === "slots_sun" ? "" : DEFAULT_SLOTS;
    return (current as unknown as Record<string, string>)[key] || "";
  };

  const setSlot = (key: string, value: string) => {
    setSchedules((prev) => {
      const existing = prev[selectedPro?.usuario.nome || ""];
      const updated = { ...(existing || { professional_name: selectedPro?.usuario.nome || "" }), [key]: value };
      return { ...prev, [selectedPro?.usuario.nome || ""]: updated };
    });
  };

  const handleSave = async () => {
    if (!selectedPro) return;
    setSaving(true);
    // TODO: Implement server action for save
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl text-marrom">Disponibilidade</h1>
          <p className="text-xs text-marrom/50">Horarios e folgas por profissional</p>
        </div>
        {selectedPro && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-dourado hover:bg-dourado-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Salvar
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-dourado" size={24} />
        </div>
      ) : pros.length === 0 ? (
        <div className="text-center py-16">
          <CalendarOff className="mx-auto mb-3 text-marrom/20" size={32} />
          <p className="text-sm text-marrom/50">Cadastre profissionais primeiro para gerenciar disponibilidade.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-marrom/50 font-medium mb-3 px-2">Profissionais</p>
            {pros.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPro(p)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors ${
                  selectedPro?.id === p.id
                    ? "bg-dourado text-white font-medium"
                    : "bg-white border border-border text-marrom hover:bg-creme-200"
                }`}
              >
                {p.usuario.nome}
              </button>
            ))}
          </div>

          <div className="lg:col-span-3 bg-white border border-border rounded-2xl p-6">
            <h2 className="font-display font-semibold text-marrom mb-1">Horarios de {selectedPro?.usuario.nome}</h2>
            <p className="text-xs text-marrom/50 mb-5">Informe os horarios separados por virgula (ex: 08:00,09:00,10:00). Deixe vazio para folga.</p>
            <div className="space-y-4">
              {DAYS.map((day) => (
                <div key={day.key} className="grid grid-cols-[100px_1fr] gap-4 items-center">
                  <span className="text-sm font-medium text-marrom/70">{day.label}</span>
                  <input
                    type="text"
                    value={getSlot(day.key)}
                    onChange={(e) => setSlot(day.key, e.target.value)}
                    placeholder="Folga"
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm text-marrom placeholder:text-marrom/30 focus:outline-none focus:border-dourado font-mono"
                  />
                </div>
              ))}
              <div className="grid grid-cols-[100px_1fr] gap-4 items-center pt-4 border-t border-border">
                <span className="text-sm font-medium text-marrom/70">Folgas</span>
                <input
                  type="text"
                  value={current?.days_off || ""}
                  onChange={(e) => setSlot("days_off", e.target.value)}
                  placeholder="2026-08-15,2026-12-25"
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm text-marrom placeholder:text-marrom/30 focus:outline-none focus:border-dourado font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}