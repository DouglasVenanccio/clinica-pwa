import { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Star, Crown, Gem, Gift, Loader2, ArrowLeft, Search } from 'lucide-react';

const TIERS = [
  { name: 'Bronze', min: 0, icon: Star, color: 'text-amber-700 bg-amber-50', desc: '1 ponto a cada R$1 gasto' },
  { name: 'Prata', min: 500, icon: Crown, color: 'text-slate-600 bg-slate-100', desc: '5% de desconto em serviços' },
  { name: 'Ouro', min: 2000, icon: Gem, color: 'text-yellow-700 bg-yellow-50', desc: '10% de desconto + brinde' },
  { name: 'Diamante', min: 5000, icon: Gift, color: 'text-[#B67D35] bg-[#B67D35]/10', desc: '15% de desconto + sessão grátis anual' },
];

const getTier = (points) => {
  let tier = TIERS[0];
  for (const t of TIERS) if (points >= t.min) tier = t;
  return tier;
};
const getNextTier = (points) => TIERS.find((t) => points < t.min) || null;

export default function Fidelidade() {
  const [email, setEmail] = useState('');
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const data = await base44.entities.LoyaltyCard.filter({ client_email: email });
      setCard(data && data.length ? data[0] : null);
      setSearched(true);
    } catch { setCard(null); }
    finally { setLoading(false); }
  };

  const tier = card ? getTier(card.points || 0) : null;
  const nextTier = card ? getNextTier(card.points || 0) : null;
  const progress = nextTier ? ((card.points - tier.min) / (nextTier.min - tier.min)) * 100 : 100;

  return (
    <div className="bg-[#FDFBF7] pt-20 min-h-screen">
      <div className="max-w-lg mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#2b2622]/50 hover:text-[#B67D35] mb-6"><ArrowLeft size={16} /> Voltar</Link>
        <h1 className="font-display font-bold text-3xl text-[#2b2622]">Programa de Fidelidade</h1>
        <p className="text-[#2b2622]/60 mt-2">Consulte seus pontos e benefícios.</p>

        <div className="bg-white border border-[#E0DCD6] rounded-2xl p-5 mt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2b2622]/40" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="Seu e-mail" className="w-full pl-10 pr-4 py-3 bg-white border border-[#E0DCD6] rounded-full text-sm text-[#2b2622] placeholder:text-[#2b2622]/30 focus:outline-none focus:border-[#B67D35]" />
            </div>
            <button onClick={handleSearch} disabled={loading} className="px-6 py-3 bg-[#B67D35] hover:bg-[#9c6829] disabled:opacity-50 text-white rounded-full text-sm font-medium transition-colors">
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'Consultar'}
            </button>
          </div>
        </div>

        {searched && !card && (
          <div className="bg-white border border-[#E0DCD6] rounded-2xl p-8 mt-6 text-center">
            <Gift className="mx-auto mb-3 text-[#2b2622]/20" size={36} />
            <p className="text-sm text-[#2b2622]/60">Ainda não encontramos um cartão de fidelidade para este e-mail.</p>
            <p className="text-xs text-[#2b2622]/40 mt-1">Faça seu primeiro agendamento para começar a acumular pontos!</p>
            <Link to="/agendamento" className="inline-block mt-5 px-6 py-2.5 bg-[#B67D35] hover:bg-[#9c6829] rounded-full text-sm text-white font-medium transition-colors">Agendar agora</Link>
          </div>
        )}

        {card && tier && (
          <div className="space-y-5 mt-6">
            <div className="bg-gradient-to-br from-[#2b2622] to-[#3d3530] text-[#FDFBF7] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-4 right-4"><tier.icon size={28} className="text-[#B67D35]" /></div>
              <p className="text-xs uppercase tracking-widest text-[#FDFBF7]/50">Cartão</p>
              <p className="font-display font-bold text-xl mt-1">{card.client_name}</p>
              <p className="text-sm text-[#FDFBF7]/60 mt-0.5">{card.client_email}</p>
              <div className="flex items-end justify-between mt-6 pt-4 border-t border-white/10">
                <div>
                  <p className="text-3xl font-display font-bold text-[#B67D35]">{card.points || 0}</p>
                  <p className="text-[11px] text-[#FDFBF7]/50">pontos</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-semibold text-lg">{tier.name}</p>
                  <p className="text-[11px] text-[#FDFBF7]/50">{card.visits || 0} visitas</p>
                </div>
              </div>
            </div>

            {/* Tier Journey */}
            <div className="bg-white border border-[#E0DCD6] rounded-2xl p-5">
              <p className="text-xs uppercase tracking-widest text-[#2b2622]/50 font-medium mb-4">Sua jornada de benefícios</p>
              <div className="flex justify-between">
                {TIERS.map((t, i) => {
                  const reached = (card.points || 0) >= t.min;
                  const isCurrent = tier.name === t.name;
                  return (
                    <div key={t.name} className="flex flex-col items-center flex-1">
                      <div className="flex items-center w-full">
                        {i > 0 && <div className={`flex-1 h-0.5 ${(card.points || 0) >= t.min ? 'bg-[#B67D35]' : 'bg-[#E0DCD6]'}`} />}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all shrink-0 ${
                          isCurrent ? 'bg-[#B67D35] border-[#B67D35] text-white shadow-[0_0_0_4px_rgba(182,125,53,0.15)]' : reached ? 'bg-[#B67D35] border-[#B67D35] text-white' : 'bg-white border-[#E0DCD6] text-[#2b2622]/30'
                        }`}>
                          <t.icon size={16} />
                        </div>
                        {i < TIERS.length - 1 && <div className={`flex-1 h-0.5 ${(card.points || 0) >= TIERS[i + 1].min ? 'bg-[#B67D35]' : 'bg-[#E0DCD6]'}`} />}
                      </div>
                      <p className={`text-[10px] mt-2 font-medium ${isCurrent ? 'text-[#B67D35]' : reached ? 'text-[#2b2622]/70' : 'text-[#2b2622]/40'}`}>{t.name}</p>
                      <p className="text-[9px] text-[#2b2622]/30">{t.min.toLocaleString('pt-BR')} pts</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {nextTier && (
              <div className="bg-white border border-[#E0DCD6] rounded-2xl p-5">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[#2b2622]/70">Faltam <strong className="text-[#B67D35]">{nextTier.min - card.points}</strong> pontos para <strong>{nextTier.name}</strong></span>
                </div>
                <div className="h-2 bg-[#F5EFE6] rounded-full overflow-hidden">
                  <div className="h-full bg-[#B67D35] rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-[#E0DCD6] rounded-2xl p-4 text-center">
                <p className="text-2xl font-display font-bold text-[#2b2622]">{card.visits || 0}</p>
                <p className="text-xs text-[#2b2622]/50">Visitas</p>
              </div>
              <div className="bg-white border border-[#E0DCD6] rounded-2xl p-4 text-center">
                <p className="text-2xl font-display font-bold text-[#2b2622]">R$ {(card.total_spent || 0).toFixed(0)}</p>
                <p className="text-xs text-[#2b2622]/50">Total investido</p>
              </div>
            </div>

            <div className="bg-white border border-[#E0DCD6] rounded-2xl p-5">
              <p className="text-xs uppercase tracking-widest text-[#2b2622]/50 font-medium mb-3">Benefícios atuais</p>
              <p className="text-sm text-[#2b2622]/70">{tier.desc}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}