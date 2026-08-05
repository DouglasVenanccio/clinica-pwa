import { Tag, Clock, User, ShieldCheck, MessageCircle } from "lucide-react";

const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

interface SummaryPanelProps {
  service: { name: string; price: number; duration_min: number } | null;
  professional: { name: string } | null;
  date: Date | null;
  time: string;
  paymentMethod: string;
}

export default function SummaryPanel({ service, professional, date, time, paymentMethod }: SummaryPanelProps) {
  const subtotal = service?.price || 0;
  const discount = paymentMethod === "pix" ? subtotal * 0.05 : 0;
  const total = subtotal - discount;

  const dateStr = date
    ? date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })
    : "—";

  return (
    <div className="space-y-5">
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-display font-semibold text-marrom">Resumo do Agendamento</h3>
        </div>
        <div className="p-5">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-xl bg-creme-200 flex items-center justify-center shrink-0">
              <span className="text-2xl">💆</span>
            </div>
            <div className="min-w-0">
              <p className="font-medium text-marrom truncate">{service?.name || "Selecione um servico"}</p>
              <div className="flex flex-col gap-1 mt-1.5 text-xs text-marrom/60">
                <span className="flex items-center gap-1.5"><Clock size={12} /> {service ? `${service.duration_min} min` : "—"}</span>
                <span className="flex items-center gap-1.5"><User size={12} /> {professional?.name || "Indiferente"}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-dourado/8 rounded-lg flex items-center gap-2">
            <Tag size={14} className="text-dourado" />
            <p className="text-xs text-dourado-500 font-medium">Pague via PIX e ganhe 5% de desconto!</p>
          </div>

          <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
            <div className="flex justify-between text-marrom/70">
              <span>Subtotal</span><span>{fmt(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-dourado">
                <span>Desconto PIX</span><span>- {fmt(discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-display font-bold text-marrom text-base pt-2 border-t border-border">
              <span>Total</span><span>{fmt(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl p-5">
        <h4 className="text-xs uppercase tracking-widest text-marrom/50 font-medium mb-4">Informacoes Importantes</h4>
        <ul className="space-y-3 text-sm text-marrom/70">
          <li className="flex gap-2.5"><span className="text-dourado mt-0.5">•</span> Chegue 10 minutos antes do horario agendado.</li>
          <li className="flex gap-2.5"><span className="text-dourado mt-0.5">•</span> Cancelamentos com ate 24h de antecedencia sao gratuitos.</li>
          <li className="flex gap-2.5"><span className="text-dourado mt-0.5">•</span> Confirmacao por e-mail apos o agendamento.</li>
        </ul>
        <div className="mt-5 pt-4 border-t border-border">
          <a
            href="https://wa.me/551140028922"
            className="flex items-center gap-2 text-sm text-marrom hover:text-dourado font-medium"
          >
            <MessageCircle size={16} className="text-dourado" />
            Precisa de ajuda?
            <span className="text-marrom/50 ml-auto">(11) 4002-8922</span>
          </a>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-marrom/40">
          <ShieldCheck size={12} /> Pagamento seguro e dados protegidos.
        </div>
      </div>
    </div>
  );
}