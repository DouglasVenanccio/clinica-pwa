import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { Users, BadgeCheck, HeartHandshake, Cpu, ArrowRight, Lock } from 'lucide-react';

const HERO_IMG = 'https://media.base44.com/images/public/6a73912b262c01040476c9f7/7892385a8_generated_de9cc185.png';

const features = [
  { icon: Users, label: 'Atendimento Personalizado' },
  { icon: BadgeCheck, label: 'Profissionais Qualificados' },
  { icon: HeartHandshake, label: 'Ambiente Acolhedor' },
  { icon: Cpu, label: 'Tecnologias Modernas' },
];

export default function Hero() {
  return (
    <section id="inicio" className="relative min-h-[640px] lg:min-h-[760px] flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0">
        <Image src={HERO_IMG} alt="Clínica de estética e bem-estar" className="w-full h-full object-cover" fittingType="fill" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2b2622]/85 via-[#2b2622]/55 to-[#2b2622]/20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 w-full grid lg:grid-cols-2 gap-12 items-center py-20">
        <div className="text-[#FDFBF7]">
          <span className="inline-block px-3 py-1 text-[11px] uppercase tracking-widest bg-[#B67D35]/20 text-[#E8C9A0] border border-[#B67D35]/30 rounded-full mb-6">
            Estética & Fisioterapia
          </span>
          <h1 className="font-display font-bold text-5xl lg:text-7xl leading-[1.05] tracking-tight">
            Cuidado que <span className="text-[#D9A862]">Transforma</span>
          </h1>
          <p className="mt-6 text-lg text-[#FDFBF7]/80 max-w-md leading-relaxed">
            Estética e fisioterapia para realçar sua beleza e bem-estar.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-10 max-w-lg">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-[#FDFBF7]/25 flex items-center justify-center shrink-0">
                  <f.icon size={16} className="text-[#D9A862]" />
                </div>
                <span className="text-sm text-[#FDFBF7]/85">{f.label}</span>
              </div>
            ))}
          </div>

          <Link
            to="/agendamento"
            className="inline-flex items-center gap-2 mt-10 px-7 py-3.5 bg-[#B67D35] hover:bg-[#9c6829] text-white font-medium rounded-full transition-colors group"
          >
            Agendar Seu Horário
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="flex flex-col items-center lg:items-end gap-5">
          <div className="bg-[#FDFBF7] rounded-2xl p-6 shadow-2xl border border-[#E0DCD6] w-full max-w-sm lg:max-w-xs">
            <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-widest bg-[#B67D35] text-white rounded-full font-semibold">
              Oferta Especial
            </span>
            <p className="mt-4 text-sm text-[#2b2622]/60">Pacote Bem-Estar Completo</p>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-lg text-[#2b2622]/40 line-through">De R$ 300,00</span>
            </div>
            <div className="text-4xl font-display font-bold text-[#B67D35]">R$ 150,00</div>
            <p className="text-sm text-[#2b2622]/70 mt-3 leading-relaxed">
              Um presente de autocuidado, bem-estar e relaxamento.
            </p>
            <Link
              to="/agendamento"
              className="mt-5 inline-flex w-full justify-center items-center px-5 py-3 bg-[#2b2622] hover:bg-[#3d342d] text-[#FDFBF7] text-sm font-medium rounded-full transition-colors"
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
    <div className="bg-[#FDFBF7]/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-[#E0DCD6] w-full w-full max-w-sm lg:max-w-xs">
      <h3 className="font-display font-semibold text-[#2b2622] mb-1">Agendar Horário</h3>
      <p className="text-xs text-[#2b2622]/60 mb-4">Reserve em segundos</p>
      <div className="space-y-3">
        <select className="w-full px-4 py-2.5 bg-white border border-[#E0DCD6] rounded-full text-sm text-[#2b2622] focus:outline-none focus:border-[#B67D35]">
          <option value="">Selecione um serviço</option>
          <option>Limpeza de Pele</option>
          <option>Drenagem Linfática</option>
          <option>Massagem Modeladora</option>
          <option>Acupuntura</option>
        </select>
        <select className="w-full px-4 py-2.5 bg-white border border-[#E0DCD6] rounded-full text-sm text-[#2b2622] focus:outline-none focus:border-[#B67D35]">
          <option value="">Qual profissional?</option>
          <option>Juliana A.</option>
          <option>Carla S.</option>
          <option>Indiferente</option>
        </select>
        <input type="date" className="w-full px-4 py-2.5 bg-white border border-[#E0DCD6] rounded-full text-sm text-[#2b2622] focus:outline-none focus:border-[#B67D35]" />
        <select className="w-full px-4 py-2.5 bg-white border border-[#E0DCD6] rounded-full text-sm text-[#2b2622] focus:outline-none focus:border-[#B67D35]">
          <option value="">Escolha o horário</option>
          <option>08:00</option>
          <option>10:00</option>
          <option>14:00</option>
        </select>
      </div>
      <Link to="/agendamento" className="mt-4 inline-flex w-full justify-center items-center px-5 py-3 bg-[#B67D35] hover:bg-[#9c6829] text-white text-sm font-medium rounded-full transition-colors">
        Ver Disponibilidade
      </Link>
      <p className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-[#2b2622]/50">
        <Lock size={12} /> Seus dados são protegidos
      </p>
    </div>
  );
}