"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Star, Loader2, Users } from "lucide-react";

interface Profissional {
  id: string;
  usuario: { nome: string };
  especialidade: string;
  bio?: string | null;
  avaliacaoMedia: number;
}

export default function ProfissionaisPage() {
  const [items, setItems] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Profissional | null>(null);
  const [form, setForm] = useState({ nome: "", especialidade: "", bio: "" });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profissionais");
      if (res.ok) {
        const data = await res.json();
        setItems(data.profissionais || data);
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

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const openNew = () => {
    setEditing(null);
    setForm({ nome: "", especialidade: "", bio: "" });
    setOpen(true);
  };

  const openEdit = (p: Profissional) => {
    setEditing(p);
    setForm({ nome: p.usuario.nome, especialidade: p.especialidade, bio: p.bio || "" });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.nome) return;
    // TODO: Implement server action for create/update
    setOpen(false);
    load();
  };

  const handleDelete = async (p: Profissional) => {
    if (!window.confirm(`Excluir a profissional "${p.usuario.nome}"?`)) return;
    // TODO: Implement server action for delete
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl text-marrom">Profissionais</h1>
          <p className="text-xs text-marrom/50">{items.length} cadastradas</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-dourado hover:bg-dourado-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Nova Profissional
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full flex justify-center py-16">
            <Loader2 className="animate-spin text-dourado" size={24} />
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <Users className="mx-auto mb-3 text-marrom/20" size={32} />
            <p className="text-sm text-marrom/50">Nenhuma profissional cadastrada ainda.</p>
          </div>
        ) : (
          items.map((p) => (
            <div key={p.id} className="bg-white border border-border rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-dourado to-dourado-500 flex items-center justify-center text-white font-display font-bold">
                  {getInitials(p.usuario.nome)}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(p)} className="p-1.5 text-marrom/40 hover:text-dourado hover:bg-dourado/10 rounded-lg transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(p)} className="p-1.5 text-marrom/40 hover:text-erro hover:bg-erro/10 rounded-lg transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <h3 className="font-display font-semibold text-marrom">{p.usuario.nome}</h3>
              <p className="text-xs text-dourado font-medium mt-1">{p.especialidade}</p>
              <div className="flex items-center gap-1 mt-3">
                <Star size={13} className="fill-dourado text-dourado" />
                <span className="text-xs text-marrom/70">
                  {Number(p.avaliacaoMedia || 5).toFixed(1)}
                </span>
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
              {editing ? "Editar Profissional" : "Nova Profissional"}
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
                <label className="text-xs uppercase tracking-widest text-marrom/50 font-medium mb-2 block">Especialidade</label>
                <input
                  type="text"
                  value={form.especialidade}
                  onChange={(e) => setForm({ ...form, especialidade: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm text-marrom focus:outline-none focus:border-dourado"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-marrom/50 font-medium mb-2 block">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm text-marrom focus:outline-none focus:border-dourado"
                />
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