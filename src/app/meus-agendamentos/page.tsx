import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { MeusAgendamentosList } from "@/components/agendamento/meus-agendamentos-list";

/**
 * Pagina do cliente com seus agendamentos.
 * Exibe lista de agendamentos ativos e historico.
 */
export default async function MeusAgendamentosPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Busca o cliente
  const cliente = await prisma.cliente.findUnique({
    where: { usuarioId: session.user.id },
  });

  if (!cliente) {
    redirect("/login");
  }

  // Busca agendamentos do cliente
  const agendamentos = await prisma.agendamento.findMany({
    where: { clienteId: cliente.id },
    include: {
      servico: true,
      profissional: {
        include: { usuario: true },
      },
    },
    orderBy: [{ data: "desc" }, { horaInicio: "desc" }],
  });

  return (
    <main className="min-h-screen bg-[#F5F0E8]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#5C4A3A] font-[family-name:var(--font-playfair)] mb-6">
          Meus Agendamentos
        </h1>
        <MeusAgendamentosList
          agendamentos={agendamentos.map((a) => ({
            ...a,
            valorTotal: Number(a.valorTotal),
            data: a.data.toISOString(),
            horaInicio: a.horaInicio.toISOString(),
            horaFim: a.horaFim.toISOString(),
          }))}
        />
      </div>
    </main>
  );
}
