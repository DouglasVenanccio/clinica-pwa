"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Clock, Loader2, Sparkles } from "lucide-react";

const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

interface Servico {
  id: string;
  nome: string;
  descricao?: string | null;
  duracaoMinutos: number;
  preco: number;
  categoria?: { nome: string } | null;
}

export default function ServicosPage() {
  const [items, setItems] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Servico | null>(null);
  const [form, setForm] = useState({ nome: "", descricao: "", duracaoMinutos: 60, preco: 0 });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/servicos");
      if (res.ok) {
        const data = await res.json();
        setItems(data.servicos || data);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ nome: "", descricao: "", duracaoMinutos: 60, preco: 0 });
    setOpen(true);
  };

  const openEdit = (s: Servico) => {
    setEditing(s);
    setForm({ nome: s.nome, descricao: s.descricao || "", duracaoMinutos: s.duracaoMinutos, preco: s.preco });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.nome || !form.preco) return;
    // TODO: Implement server action for create/update
    setOpen(false);
    load();
  };

  const handleDelete = async (s: Servico) => {
    if (!window.confirm(`Excluir o servico "${s.nome}"?`)) return;
    // TODO: Implement server action for delete
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl text-marrom">Servicos</h1>
          <p className="text-xs text-marrom/50">{items.length} cadastrados</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-dourado hover:bg-dourado-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Novo Servico
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full flex justify-center py-16">
            <Loader2 className="animate-spin text-dourado" size={24} />
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <Sparkles className="mx-auto mb-3 text-marrom/20" size={32} />
            <p className="text-sm text-marrom/50">Nenhum servico cadastrado ainda.</p>
          </div>
        ) : (
          items.map((s) => (
            <div key={s.id} className="bg-white border border-border rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-dourado/10 flex items-center justify-center">
                  <Sparkles size={18} className="text-dourado" />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(s)} className="p-1.5 text-marrom/40 hover:text-dourado hover:bg-dourado/10 rounded-lg transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(s)} className="p-1.5 text-marrom/40 hover:text-erro hover:bg-erro/10 rounded-lg transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <h3 className="font-display font-semibold text-marrom">{s.nome}</h3>
              <p className="text-xs text-marrom/60 mt-1 leading-relaxed line-clamp-2">{s.descricao}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <span className="flex items-center gap-1 text-xs text-marrom/50">
                  <Clock size={12} /> {s.duracaoMinutos} min
                </span>
                <span className="font-display font-bold text-dourado">{fmt(s.preco)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dialog for create/edit */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="font-display font-semibold text-lg text-marrom mb-4">
              {editing ? "Editar Servico" : "Novo Servico"}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs uppercase tracking-widest text-marrom/50 font-medium mb-2 block">Nome</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm text-marrom focus:outline-none focus:border-dourado"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-marrom/50 font-medium mb-2 block">Descricao</label>
                <textarea
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm text-marrom focus:outline-none focus:border-dourado"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs uppercase tracking-widest text-marrom/50 font-medium mb-2 block">Duracao (min)</label>
                  <input
                    type="number"
                    value={form.duracaoMinutos}
                    onChange={(e) => setForm({ ...form, duracaoMinutos: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm text-marrom focus:outline-none focus:border-dourado"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-marrom/50 font-medium mb-2 block">Preco (R$)</label>
                  <input
                    type="number"
                    value={form.preco}
                    onChange={(e) => setForm({ ...form, preco: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm text-marrom focus:outline-none focus:border-dourado"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-marrom hover:bg-creme-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2.5 bg-dourado hover:bg-dourado-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {editing ? "Salvar" : "Cadastrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}