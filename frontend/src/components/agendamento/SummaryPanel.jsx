import { Tag, Clock, User, ShieldCheck, MessageCircle } from 'lucide-react';

const fmt = (v) => `R$ ${v.toFixed(2).replace('.', ',')}`;

export default function SummaryPanel({ service, professional, date, time, paymentMethod }) {
  const subtotal = service?.price || 0;
  const discount = paymentMethod === 'pix' ? subtotal * 0.05 : 0;
  const total = subtotal - discount;

  const dateStr = date
    ? date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })
    : '—';

  return (
    <div className="space-y-5">
      <div className="bg-white border border-[#E0DCD6] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E0DCD6]">
          <h3 className="font-display font-semibold text-[#2b2622]">Resumo do Agendamento</h3>
        </div>
        <div className="p-5">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#F5EFE6] flex items-center justify-center shrink-0">
              <span className="text-2xl">💆</span>
            </div>
            <div className="min-w-0">
              <p className="font-medium text-[#2b2622] truncate">{service?.name || 'Selecione um serviço'}</p>
              <div className="flex flex-col gap-1 mt-1.5 text-xs text-[#2b2622]/60">
                <span className="flex items-center gap-1.5"><Clock size={12} /> {service ? `${service.duration_min} min` : '—'}</span>
                <span className="flex items-center gap-1.5"><User size={12} /> {professional?.name || 'Indiferente'}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-[#B67D35]/8 rounded-lg flex items-center gap-2">
            <Tag size={14} className="text-[#B67D35]" />
            <p className="text-xs text-[#9c6829] font-medium">Pague via PIX e ganhe 5% de desconto!</p>
          </div>

          <div className="mt-4 pt-4 border-t border-[#E0DCD6] space-y-2 text-sm">
            <div className="flex justify-between text-[#2b2622]/70">
              <span>Subtotal</span><span>{fmt(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#B67D35]">
                <span>Desconto PIX</span><span>- {fmt(discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-display font-bold text-[#2b2622] text-base pt-2 border-t border-[#E0DCD6]">
              <span>Total</span><span>{fmt(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E0DCD6] rounded-2xl p-5">
        <h4 className="text-xs uppercase tracking-widest text-[#2b2622]/50 font-medium mb-4">Informações Importantes</h4>
        <ul className="space-y-3 text-sm text-[#2b2622]/70">
          <li className="flex gap-2.5"><span className="text-[#B67D35] mt-0.5">•</span> Chegue 10 minutos antes do horário agendado.</li>
          <li className="flex gap-2.5"><span className="text-[#B67D35] mt-0.5">•</span> Cancelamentos com até 24h de antecedência são gratuitos.</li>
          <li className="flex gap-2.5"><span className="text-[#B67D35] mt-0.5">•</span> Confirmação por e-mail após o agendamento.</li>
        </ul>
        <div className="mt-5 pt-4 border-t border-[#E0DCD6]">
          <a
            href="https://wa.me/551140028922"
            className="flex items-center gap-2 text-sm text-[#2b2622] hover:text-[#B67D35] font-medium"
          >
            <MessageCircle size={16} className="text-[#B67D35]" />
            Precisa de ajuda?
            <span className="text-[#2b2622]/50 ml-auto">(11) 4002-8922</span>
          </a>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#2b2622]/40">
          <ShieldCheck size={12} /> Pagamento seguro e dados protegidos.
        </div>
      </div>
    </div>
  );
}