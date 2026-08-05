"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { confirmarAgendamento, cancelarAgendamento, concluirAgendamento } from "@/lib/actions/agendamentos";
import { STATUS_AGENDAMENTO } from "@/lib/constants";
import { Loader2, Check, X, CheckCircle } from "lucide-react";

/**
 * Botoes de acao do admin para agendamentos.
 */
export function AdminAgendamentosActions({
  agendamentoId,
  status,
}: {
  agendamentoId: string;
  status: string;
}) {
  const router = useRouter();
  const [carregando, setCarregando] = useState<string | null>(null);

  async function handleAcao(acao: "confirmar" | "cancelar" | "concluir") {
    setCarregando(acao);
    let result;

    switch (acao) {
      case "confirmar":
        result = await confirmarAgendamento(agendamentoId);
        break;
      case "cancelar":
        result = await cancelarAgendamento(agendamentoId);
        break;
      case "concluir":
        result = await concluirAgendamento(agendamentoId);
        break;
    }

    if (result?.success) {
      router.refresh();
    } else {
      alert(result?.error || "Erro ao executar acao.");
    }
    setCarregando(null);
  }

  return (
    <div className="flex items-center gap-1">
      {status === STATUS_AGENDAMENTO.PENDENTE && (
        <>
          <button
            onClick={() => handleAcao("confirmar")}
            disabled={!!carregando}
            className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50"
            title="Confirmar"
          >
            {carregando === "confirmar" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => handleAcao("cancelar")}
            disabled={!!carregando}
            className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50"
            title="Cancelar"
          >
            {carregando === "cancelar" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </button>
        </>
      )}
      {status === STATUS_AGENDAMENTO.CONFIRMADO && (
        <>
          <button
            onClick={() => handleAcao("concluir")}
            disabled={!!carregando}
            className="p-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"
            title="Concluir"
          >
            {carregando === "concluir" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => handleAcao("cancelar")}
            disabled={!!carregando}
            className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50"
            title="Cancelar"
          >
            {carregando === "cancelar" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </button>
        </>
      )}
    </div>
  );
}
