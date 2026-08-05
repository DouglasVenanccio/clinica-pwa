import type { Metadata } from "next";
import { AgendamentoWizard } from "@/components/agendamento/agendamento-wizard";

export const metadata: Metadata = {
  title: "Agendar Horario | Beleza & Bem-Estar",
  description: "Agende seu horario de estetica ou fisioterapia online.",
};

/**
 * Pagina publica de agendamento.
 * Exibe o wizard de 4 etapas para o cliente agendar um servico.
 */
export default function AgendarPage() {
  return (
    <main className="min-h-screen bg-[#F5F0E8]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#5C4A3A] font-[family-name:var(--font-playfair)]">
            Agendar Horario
          </h1>
          <p className="text-gray-600 mt-2">
            Escolha o servico, profissional e horario que melhor se encaixa na sua rotina.
          </p>
        </div>

        <AgendamentoWizard />
      </div>
    </main>
  );
}
