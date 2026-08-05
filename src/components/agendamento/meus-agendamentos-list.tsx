"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cancelarAgendamento } from "@/lib/actions/agendamentos";
import { formatarData, formatarMoeda, formatarHorario } from "@/lib/utils";
import { STATUS_AGENDAMENTO } from "@/lib/constants";
import { Calendar, Clock, X, Loader2, Plus } from "lucide-react";

/**
 * Interface para agendamento com relacionamentos.
 */
interface Agendamento {
  id: string;
  data: Date | string;
  horaInicio: Date | string;
  horaFim: Date | string;
  status: string;
  valorTotal: number;
  formaPagamento?: string | null;
  servico: { nome: string; duracaoMinutos: number };
  profissional: {
    usuario: { nome: string };
    especialidade: string;
  };
}

/**
 * Lista de agendamentos do cliente com acoes.
 */
export function MeusAgendamentosList({
  agendamentos,
}: {
  agendamentos: Agendamento[];
}) {
  const router = useRouter();
  const [cancelando, setCancelando] = useState<string | null>(null);

  // Separa em ativos e historico
  const ativos = agendamentos.filter(
    (a) => a.status === STATUS_AGENDAMENTO.PENDENTE || a.status === STATUS_AGENDAMENTO.CONFIRMADO
  );
  const historico = agendamentos.filter(
    (a) => a.status === STATUS_AGENDAMENTO.CONCLUIDO || a.status === STATUS_AGENDAMENTO.CANCELADO
  );

  async function handleCancelar(id: string) {
    setCancelando(id);
    const result = await cancelarAgendamento(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Erro ao cancelar.");
    }
    setCancelando(null);
  }

  function getStatusBadge(status: string) {
    const variants: Record<string, string> = {
      [STATUS_AGENDAMENTO.PENDENTE]: "bg-yellow-100 text-yellow-800",
      [STATUS_AGENDAMENTO.CONFIRMADO]: "bg-green-100 text-green-800",
      [STATUS_AGENDAMENTO.CONCLUIDO]: "bg-blue-100 text-blue-800",
      [STATUS_AGENDAMENTO.CANCELADO]: "bg-red-100 text-red-800",
      [STATUS_AGENDAMENTO.NAO_COMPARECEU]: "bg-gray-100 text-gray-800",
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  }

  function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
      [STATUS_AGENDAMENTO.PENDENTE]: "Pendente",
      [STATUS_AGENDAMENTO.CONFIRMADO]: "Confirmado",
      [STATUS_AGENDAMENTO.CONCLUIDO]: "Concluido",
      [STATUS_AGENDAMENTO.CANCELADO]: "Cancelado",
      [STATUS_AGENDAMENTO.NAO_COMPARECEU]: "Nao compareceu",
    };
    return labels[status] || status;
  }

  if (agendamentos.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-medium text-gray-600 mb-2">
          Nenhum agendamento encontrado
        </h2>
        <p className="text-gray-500 mb-4">
          Agende seu primeiro servico agora mesmo!
        </p>
        <Link href="/agendar">
          <Button className="bg-[#C9A96E] hover:bg-[#A8893E] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Agendar Agora
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Agendamentos ativos */}
      {ativos.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[#5C4A3A] mb-3">
            Proximos Agendamentos
          </h2>
          <div className="space-y-3">
            {ativos.map((agendamento) => (
              <Card key={agendamento.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-medium text-[#5C4A3A]">
                        {agendamento.servico.nome}
                      </p>
                      <p className="text-sm text-gray-600">
                        {agendamento.profissional.usuario.nome} - {agendamento.profissional.especialidade}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatarData(agendamento.data)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatarHorario(agendamento.horaInicio)} - {formatarHorario(agendamento.horaFim)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className={getStatusBadge(agendamento.status)}>
                        {getStatusLabel(agendamento.status)}
                      </Badge>
                      <p className="text-sm font-medium text-[#5C4A3A]">
                        {formatarMoeda(Number(agendamento.valorTotal))}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelar(agendamento.id)}
                      disabled={cancelando === agendamento.id}
                      className="text-red-500 border-red-200 hover:bg-red-50"
                    >
                      {cancelando === agendamento.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <X className="w-3 h-3 mr-1" />
                      )}
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Historico */}
      {historico.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[#5C4A3A] mb-3">
            Historico
          </h2>
          <div className="space-y-3">
            {historico.map((agendamento) => (
              <Card key={agendamento.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-medium text-[#5C4A3A]">
                        {agendamento.servico.nome}
                      </p>
                      <p className="text-sm text-gray-600">
                        {agendamento.profissional.usuario.nome}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatarData(agendamento.data)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatarHorario(agendamento.horaInicio)}
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusBadge(agendamento.status)}>
                      {getStatusLabel(agendamento.status)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="text-center pt-4">
        <Link href="/agendar">
          <Button className="bg-[#C9A96E] hover:bg-[#A8893E] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
        </Link>
      </div>
    </div>
  );
}
