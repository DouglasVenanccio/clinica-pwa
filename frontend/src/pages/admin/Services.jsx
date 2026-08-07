import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { api } from '@/api/apiClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Pencil, Trash2, Clock, Loader2, Sparkles, Droplets, Waves, Activity, PersonStanding, Sun } from 'lucide-react';

const fmt = (v) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`;
const ICON_OPTIONS = ['Sparkles', 'Droplets', 'Waves', 'Activity', 'PersonStanding', 'Sun'];
const ICON_MAP = { Sparkles, Droplets, Waves, Activity, PersonStanding, Sun };

export default function Services() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', duration_min: 60, price: 0, icon: 'Sparkles', category: 'Estetica' });

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.Service.list('-created_date', 100);
      setItems(data || []);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  const loadCategories = async () => {
    try {
      const data = await api.Service.listCategories ? await api.Service.listCategories() : [];
      setCategories(data || []);
    } catch { setCategories([]); }
  };

  useEffect(() => { load(); loadCategories(); }, []);

  const openNew = () => { setEditing(null); setForm({ name: '', description: '', duration_min: 60, price: 0, icon: 'Sparkles', category: categories[0]?.nome || 'Estetica' }); setOpen(true); };
  const openEdit = (s) => { setEditing(s); setForm({ name: s.name, description: s.description || '', duration_min: s.duration_min || 60, price: s.price || 0, icon: s.icon || 'Sparkles', category: s.category || categories[0]?.nome || 'Estetica' }); setOpen(true); };

  const handleSave = async () => {
    if (!form.name || !form.price) return;
    setSaving(true);
    try {
      if (editing) {
        await api.Service.update(editing.id, form);
      } else {
        await api.Service.create(form);
      }
      setOpen(false);
      load();
    } catch (err) {
      alert('Erro ao salvar servico: ' + (err.message || 'Tente novamente.'));
    } finally {
      setSaving(false);
    }
  };    const handleDelete = async (s) => {
    if (!window.confirm(`Excluir o servico "${s.name}"?`)) return;
    try {
      await api.Service.delete(s.id);
      load();
    } catch (err) {
      alert('Erro ao excluir servico: ' + (err.message || 'Tente novamente.'));
    }
  };  return (    <div className="flex bg-[#fcf9f6] min-h-screen">      <AdminSidebar />      <div className="flex-1 min-w-0">        <header className="bg-white border-b border-[#E0DCD6] px-8 py-4 flex items-center justify-between sticky top-0 z-10">          <div className="flex items-center gap-3">            <Link to="/dashboard" className="w-9 h-9 rounded-full hover:bg-[#F5EFE6] flex items-center justify-center text-[#2b2622]/60"><ArrowLeft size={18} /></Link>            <div>              <h1 className="font-display font-bold text-xl text-[#2b2622]">Serviços</h1>              <p className="text-xs text-[#2b2622]/50">{items.length} cadastrados</p>            </div>          </div>          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-[#B67D35] hover:bg-[#9c6829] text-white rounded-lg text-sm font-medium transition-colors">            <Plus size={16} /> Novo Serviço          </button>        </header>        <div className="p-8">          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">            {loading ? (              <div className="col-span-full flex justify-center py-16"><Loader2 className="animate-spin text-[#B67D35]" size={24} /></div>            ) : items.length === 0 ? (              <div className="col-span-full text-center py-16">                <Sparkles className="mx-auto mb-3 text-[#2b2622]/20" size={32} />                <p className="text-sm text-[#2b2622]/50">Nenhum serviço cadastrado ainda.</p>              </div>                        ) : items.map((s) => {
              const IconComponent = ICON_MAP[s.icon] || Sparkles;
              return (
              <div key={s.id} className="bg-white border border-[#E0DCD6] rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#B67D35]/10 flex items-center justify-center"><IconComponent size={18} className="text-[#B67D35]" /></div>                  <div className="flex gap-1">                    <button onClick={() => openEdit(s)} className="p-1.5 text-[#2b2622]/40 hover:text-[#B67D35] hover:bg-[#B67D35]/10 rounded-lg transition-colors"><Pencil size={15} /></button>                    <button onClick={() => handleDelete(s)} className="p-1.5 text-[#2b2622]/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>                  </div>                </div>                <h3 className="font-display font-semibold text-[#2b2622]">{s.name}</h3>                <p className="text-xs text-[#2b2622]/60 mt-1 leading-relaxed line-clamp-2">{s.description}</p>                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E0DCD6]">                  <span className="flex items-center gap-1 text-xs text-[#2b2622]/50"><Clock size={12} /> {s.duration_min} min</span>                  <span className="font-display font-bold text-[#B67D35]">{fmt(s.price)}</span>                </div>                            </div>
              );
            })}
          </div>        </div>      </div>      <Dialog open={open} onOpenChange={setOpen}>        <DialogContent className="sm:max-w-md">          <DialogHeader><DialogTitle>{editing ? 'Editar Serviço' : 'Novo Serviço'}</DialogTitle></DialogHeader>          <div className="space-y-3 py-2">            <Input label="Nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />            <div>              <label className="text-xs uppercase tracking-widest text-[#2b2622]/50 font-medium mb-2 block">Descrição</label>              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-4 py-2.5 bg-white border border-[#E0DCD6] rounded-xl text-sm text-[#2b2622] focus:outline-none focus:border-[#B67D35]" />            </div>            <div className="grid grid-cols-2 gap-3">              <Input label="Duração (min)" type="number" value={form.duration_min} onChange={(v) => setForm({ ...form, duration_min: Number(v) })} />              <Input label="Preço (R$)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: Number(v) })} />            </div>                        <div>
              <label className="text-xs uppercase tracking-widest text-[#2b2622]/50 font-medium mb-2 block">Categoria</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-[#E0DCD6] rounded-xl text-sm text-[#2b2622] focus:outline-none focus:border-[#B67D35]">
                {categories.length > 0 ? (
                  categories.map((c) => <option key={c.id} value={c.nome}>{c.nome}</option>)
                ) : (
                  <option value="Estetica">Estetica</option>
                )}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#2b2622]/50 font-medium mb-2 block">Ícone</label>              <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-[#E0DCD6] rounded-xl text-sm text-[#2b2622] focus:outline-none focus:border-[#B67D35]">                {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}              </select>            </div>          </div>          <DialogFooter>            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>            <Button onClick={handleSave} className="bg-[#B67D35] hover:bg-[#9c6829]">{editing ? 'Salvar' : 'Cadastrar'}</Button>          </DialogFooter>        </DialogContent>      </Dialog>    </div>  );}function Input({ label, value, onChange, type = 'text' }) {  return (    <div>      <label className="text-xs uppercase tracking-widest text-[#2b2622]/50 font-medium mb-2 block">{label}</label>      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-[#E0DCD6] rounded-xl text-sm text-[#2b2622] focus:outline-none focus:border-[#B67D35]" />    </div>  );}