import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatarMoeda, formatarDataCompleta, formatarHorario } from "@/lib/utils";
import { CheckCircle, Calendar, Clock, ArrowRight } from "lucide-react";

/**
 * Pagina de confirmacao apos agendamento bem-sucedido.
 */
export default async function ConfirmacaoPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (!params.id) {
    redirect("/meus-agendamentos");
  }

  const agendamento = await prisma.agendamento.findUnique({
    where: { id: params.id },
    include: {
      servico: true,
      profissional: {
        include: { usuario: true },
      },
      cliente: {
        include: { usuario: true },
      },
    },
  });

  if (!agendamento || agendamento.cliente.usuarioId !== session.user.id) {
    redirect("/meus-agendamentos");
  }

  return (
    <main className="min-h-screen bg-[#F5F0E8]">
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-[#4CAF50] mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-[#5C4A3A] font-[family-name:var(--font-playfair)]">
            Agendamento Confirmado!
          </h1>
          <p className="text-gray-600 mt-2">
            Seu agendamento foi realizado com sucesso.
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">Servico</span>
              <span className="font-medium text-[#5C4A3A]">{agendamento.servico.nome}</span>
            </div>

            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500">Profissional</span>
              <span className="font-medium text-[#5C4A3A]">
                {agendamento.profissional.usuario.nome}
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Data
              </span>
              <span className="font-medium text-[#5C4A3A]">
                {formatarDataCompleta(agendamento.data)}
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-500 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Horario
              </span>
              <span className="font-medium text-[#5C4A3A]">
                {formatarHorario(agendamento.horaInicio)} - {formatarHorario(agendamento.horaFim)}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-500">Valor pago</span>
              <span className="text-xl font-bold text-[#5C4A3A]">
                {formatarMoeda(Number(agendamento.valorTotal))}
              </span>
            </div>

            {Number(agendamento.descontoPix) > 0 && (
              <p className="text-sm text-green-600 text-right">
                Economia de {formatarMoeda(Number(agendamento.descontoPix))} no PIX!
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-6">
          <Link href="/meus-agendamentos" className="flex-1">
            <Button className="w-full bg-[#5C4A3A] hover:bg-[#4A3A2A] text-white">
              Meus Agendamentos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full">
              Voltar ao Inicio
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
