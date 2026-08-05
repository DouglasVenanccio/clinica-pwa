import Link from "next/link";
import { Users, BadgeCheck, HeartHandshake, Cpu, ArrowRight, Lock } from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&q=80";

const features = [
  { icon: Users, label: "Atendimento Personalizado" },
  { icon: BadgeCheck, label: "Profissionais Qualificados" },
  { icon: HeartHandshake, label: "Ambiente Acolhedor" },
  { icon: Cpu, label: "Tecnologias Modernas" },
];

export default function Hero() {
  return (
    <section id="inicio" className="relative min-h-[760px] flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={HERO_IMG}
          alt="Clinica de estetica e bem-estar"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-marrom/85 via-marrom/55 to-marrom/20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 w-full grid lg:grid-cols-2 gap-12 items-center py-20">
        <div className="text-creme">
          <span className="inline-block px-3 py-1 text-[11px] uppercase tracking-widest bg-dourado/20 text-dourado-300 border border-dourado/30 rounded-full mb-6">
            Estetica & Fisioterapia
          </span>
          <h1 className="font-display font-bold text-5xl lg:text-7xl leading-[1.05] tracking-tight">
            Cuidado que <span className="text-dourado-300">Transforma</span>
          </h1>
          <p className="mt-6 text-lg text-creme/80 max-w-md leading-relaxed">
            Estetica e fisioterapia para realcar sua beleza e bem-estar.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-10 max-w-lg">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-creme/25 flex items-center justify-center shrink-0">
                  <f.icon size={16} className="text-dourado-300" />
                </div>
                <span className="text-sm text-creme/85">{f.label}</span>
              </div>
            ))}
          </div>

          <Link
            href="/agendar"
            className="inline-flex items-center gap-2 mt-10 px-7 py-3.5 bg-dourado hover:bg-dourado-500 text-white font-medium rounded-full transition-colors group"
          >
            Agendar Seu Horario
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="flex flex-col items-end gap-5">
          <div className="bg-creme rounded-2xl p-6 shadow-2xl border border-border max-w-xs">
            <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-widest bg-dourado text-white rounded-full font-semibold">
              Oferta Especial
            </span>
            <p className="mt-4 text-sm text-marrom/60">Pacote Bem-Estar Completo</p>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-lg text-marrom/40 line-through">De R$ 300,00</span>
            </div>
            <div className="text-4xl font-display font-bold text-dourado">R$ 150,00</div>
            <p className="text-sm text-marrom/70 mt-3 leading-relaxed">
              Um presente de autocuidado, bem-estar e relaxamento.
            </p>
            <Link
              href="/agendar"
              className="mt-5 inline-flex w-full justify-center items-center px-5 py-3 bg-marrom hover:bg-marrom-500 text-creme text-sm font-medium rounded-full transition-colors"
            >
              Aproveitar Oferta
            </Link>
          </div>

          <BookingWidget />
        </div>
      </div>
    </section>
  );
}

function BookingWidget() {
  return (
    <div className="bg-creme/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-border w-full max-w-xs">
      <h3 className="font-display font-semibold text-marrom mb-1">Agendar Horario</h3>
      <p className="text-xs text-marrom/60 mb-4">Reserve em segundos</p>
      <div className="space-y-3">
        <select className="w-full px-4 py-2.5 bg-white border border-border rounded-full text-sm text-marrom focus:outline-none focus:border-dourado">
          <option value="">Selecione um servico</option>
          <option>Limpeza de Pele</option>
          <option>Drenagem Linfatica</option>
          <option>Massagem Modeladora</option>
          <option>Acupuntura</option>
        </select>
        <select className="w-full px-4 py-2.5 bg-white border border-border rounded-full text-sm text-marrom focus:outline-none focus:border-dourado">
          <option value="">Qual profissional?</option>
          <option>Juliana A.</option>
          <option>Carla S.</option>
          <option>Indiferente</option>
        </select>
        <input
          type="date"
          className="w-full px-4 py-2.5 bg-white border border-border rounded-full text-sm text-marrom focus:outline-none focus:border-dourado"
        />
        <select className="w-full px-4 py-2.5 bg-white border border-border rounded-full text-sm text-marrom focus:outline-none focus:border-dourado">
          <option value="">Escolha o horario</option>
          <option>08:00</option>
          <option>10:00</option>
          <option>14:00</option>
        </select>
      </div>
      <Link
        href="/agendar"
        className="mt-4 inline-flex w-full justify-center items-center px-5 py-3 bg-dourado hover:bg-dourado-500 text-white text-sm font-medium rounded-full transition-colors"
      >
        Ver Disponibilidade
      </Link>
      <p className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-marrom/50">
        <Lock size={12} /> Seus dados sao protegidos
      </p>
    </div>
  );
}