"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { criarAgendamento } from "@/lib/actions/agendamentos";
import { formatarMoeda, formatarData } from "@/lib/utils";
import { CONFIG } from "@/lib/constants";
import { ArrowLeft, ArrowRight, Check, Clock, Calendar, User, CreditCard, Loader2 } from "lucide-react";

/**
 * Interface para servico retornado da API.
 */
interface Servico {
  id: string;
  nome: string;
  descricao?: string | null;
  duracaoMinutos: number;
  preco: number;
  categoria?: { nome: string } | null;
}

/**
 * Interface para profissional retornado da API.
 */
interface Profissional {
  id: string;
  usuario: { nome: string; avatar?: string | null };
  especialidade: string;
  bio?: string | null;
  avaliacaoMedia: number;
}

/**
 * Wizard de agendamento em 4 etapas:
 * 1. Escolher servico
 * 2. Escolher profissional + data
 * 3. Escolher horario
 * 4. Confirmar + pagamento
 */
export function AgendamentoWizard() {
  const router = useRouter();
  const [etapa, setEtapa] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Dados selecionados
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<Profissional | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState<string>("");
  const [horarios, setHorarios] = useState<string[]>([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string>("");
  const [formaPagamento, setFormaPagamento] = useState<"PIX" | "CARTAO_CREDITO" | "CARTAO_DEBITO">("PIX");
  const [observacoes, setObservacoes] = useState("");

  // Carrega servicos ao montar
  useEffect(() => {
    async function carregarServicos() {
      try {
        const res = await fetch("/api/servicos");
        if (res.ok) {
          const data = await res.json();
          setServicos(data.servicos || data);
        }
      } catch {
        // Fallback: servicos hardcoded se API nao existir
      }
    }
    carregarServicos();
  }, []);

  // Carrega profissionais quando servico e selecionado
  useEffect(() => {
    if (!servicoSelecionado) return;

    async function carregarProfissionais() {
      try {
        const res = await fetch(`/api/profissionais?servicoId=${servicoSelecionado!.id}`);
        if (res.ok) {
          const data = await res.json();
          setProfissionais(data.profissionais || data);
        }
      } catch {
        // Fallback
      }
    }
    carregarProfissionais();
  }, [servicoSelecionado]);

  // Carrega horarios quando profissional e data sao selecionados
  const carregarHorarios = useCallback(async () => {
    if (!profissionalSelecionado || !dataSelecionada || !servicoSelecionado) return;

    try {
      const res = await fetch(
        `/api/horarios-disponiveis?profissionalId=${profissionalSelecionado.id}&data=${dataSelecionada}&servicoId=${servicoSelecionado.id}`
      );
      if (res.ok) {
        const data = await res.json();
        setHorarios(data.horarios || []);
      }
    } catch {
      setHorarios([]);
    }
  }, [profissionalSelecionado, dataSelecionada, servicoSelecionado]);

  useEffect(() => {
    carregarHorarios();
  }, [carregarHorarios]);

  // Calcula data minima (hoje + antencia minima)
  const dataMinima = new Date();
  dataMinima.setHours(dataMinima.getHours() + 1);
  const dataMinimaStr = dataMinima.toISOString().split("T")[0];

  // Calcula valor com desconto
  const valorOriginal = servicoSelecionado?.preco || 0;
  const descontoPIX = formaPagamento === "PIX" ? valorOriginal * (CONFIG.DESCONTO_PIX_PERCENTUAL / 100) : 0;
  const valorFinal = valorOriginal - descontoPIX;

  // Envia o agendamento
  async function handleConfirmar() {
    if (!servicoSelecionado || !profissionalSelecionado || !dataSelecionada || !horarioSelecionado) {
      setErro("Preencha todos os campos obrigatorios.");
      return;
    }

    setCarregando(true);
    setErro(null);

    const formData = new FormData();
    formData.append("servicoId", servicoSelecionado.id);
    formData.append("profissionalId", profissionalSelecionado.id);
    formData.append("data", dataSelecionada);
    formData.append("horaInicio", horarioSelecionado);
    formData.append("formaPagamento", formaPagamento);
    if (observacoes) formData.append("observacoes", observacoes);

    const result = await criarAgendamento(formData);

    if (result.success) {
      router.push(`/agendar/confirmacao?id=${result.agendamentoId}`);
    } else {
      setErro(result.error || "Erro ao criar agendamento.");
      setCarregando(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Indicador de etapas */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3, 4].map((e) => (
          <div key={e} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                e < etapa
                  ? "bg-[#C9A96E] text-white"
                  : e === etapa
                    ? "bg-[#5C4A3A] text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {e < etapa ? <Check className="w-4 h-4" /> : e}
            </div>
            {e < 4 && (
              <div
                className={`w-12 h-0.5 mx-1 ${
                  e < etapa ? "bg-[#C9A96E]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Etapa 1: Servico */}
      {etapa === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#C9A96E]" />
              Escolha o servico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {servicos.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Carregando servicos...</p>
            ) : (
              servicos.map((servico) => (
                <button
                  key={servico.id}
                  onClick={() => {
                    setServicoSelecionado(servico);
                    setEtapa(2);
                  }}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:border-[#C9A96E] ${
                    servicoSelecionado?.id === servico.id
                      ? "border-[#C9A96E] bg-[#F5F0E8]"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-[#5C4A3A]">{servico.nome}</p>
                      {servico.descricao && (
                        <p className="text-sm text-gray-500 mt-1">{servico.descricao}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {servico.duracaoMinutos} min
                        </span>
                        {servico.categoria && (
                          <Badge variant="outline" className="text-xs">
                            {servico.categoria.nome}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="font-bold text-[#5C4A3A]">{formatarMoeda(servico.preco)}</p>
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Etapa 2: Profissional + Data */}
      {etapa === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#C9A96E]" />
              Escolha o profissional e a data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profissionais */}
            <div>
              <Label className="text-sm font-medium text-[#5C4A3A]">Profissional</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {profissionais.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhum profissional disponivel para este servico.</p>
                ) : (
                  profissionais.map((prof) => (
                    <button
                      key={prof.id}
                      onClick={() => setProfissionalSelecionado(prof)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        profissionalSelecionado?.id === prof.id
                          ? "border-[#C9A96E] bg-[#F5F0E8]"
                          : "border-gray-200 hover:border-[#C9A96E]"
                      }`}
                    >
                      <p className="font-medium text-[#5C4A3A]">{prof.usuario.nome}</p>
                      <p className="text-sm text-gray-500">{prof.especialidade}</p>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Data */}
            <div>
              <Label htmlFor="data" className="text-sm font-medium text-[#5C4A3A]">
                Data
              </Label>
              <input
                id="data"
                type="date"
                min={dataMinimaStr}
                value={dataSelecionada}
                onChange={(e) => {
                  setDataSelecionada(e.target.value);
                  setHorarioSelecionado("");
                }}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A96E] focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setEtapa(1)}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button
                onClick={() => setEtapa(3)}
                disabled={!profissionalSelecionado || !dataSelecionada}
                className="flex-1 bg-[#5C4A3A] hover:bg-[#4A3A2A] text-white"
              >
                Proximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Etapa 3: Horario */}
      {etapa === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#C9A96E]" />
              Escolha o horario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              {formatarData(dataSelecionada)} com {profissionalSelecionado?.usuario.nome}
            </p>

            {horarios.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhum horario disponivel para esta data. Tente outra data.
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {horarios.map((horario) => (
                  <button
                    key={horario}
                    onClick={() => setHorarioSelecionado(horario)}
                    className={`p-2 rounded-lg border-2 text-center font-medium transition-all ${
                      horarioSelecionado === horario
                        ? "border-[#C9A96E] bg-[#C9A96E] text-white"
                        : "border-gray-200 hover:border-[#C9A96E] text-[#5C4A3A]"
                    }`}
                  >
                    {horario}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setEtapa(2)}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button
                onClick={() => setEtapa(4)}
                disabled={!horarioSelecionado}
                className="flex-1 bg-[#5C4A3A] hover:bg-[#4A3A2A] text-white"
              >
                Proximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Etapa 4: Confirmacao */}
      {etapa === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="w-5 h-5 text-[#C9A96E]" />
              Confirme seu agendamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Resumo */}
            <div className="bg-[#F5F0E8] rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Servico:</span>
                <span className="font-medium text-[#5C4A3A]">{servicoSelecionado?.nome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Profissional:</span>
                <span className="font-medium text-[#5C4A3A]">{profissionalSelecionado?.usuario.nome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data:</span>
                <span className="font-medium text-[#5C4A3A]">{formatarData(dataSelecionada)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Horario:</span>
                <span className="font-medium text-[#5C4A3A]">{horarioSelecionado}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duracao:</span>
                <span className="font-medium text-[#5C4A3A]">{servicoSelecionado?.duracaoMinutos} min</span>
              </div>
            </div>

            {/* Forma de pagamento */}
            <div>
              <Label className="text-sm font-medium text-[#5C4A3A]">Forma de pagamento</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {(["PIX", "CARTAO_CREDITO", "CARTAO_DEBITO"] as const).map((fp) => (
                  <button
                    key={fp}
                    onClick={() => setFormaPagamento(fp)}
                    className={`p-3 rounded-lg border-2 text-center text-sm font-medium transition-all ${
                      formaPagamento === fp
                        ? "border-[#C9A96E] bg-[#C9A96E] text-white"
                        : "border-gray-200 hover:border-[#C9A96E]"
                    }`}
                  >
                    {fp === "PIX" ? "PIX" : fp === "CARTAO_CREDITO" ? "Credito" : "Debito"}
                  </button>
                ))}
              </div>
              {formaPagamento === "PIX" && descontoPIX > 0 && (
                <p className="text-sm text-green-600 mt-1">
                  Desconto de {CONFIG.DESCONTO_PIX_PERCENTUAL}% no PIX!
                </p>
              )}
            </div>

            {/* Observacoes */}
            <div>
              <Label htmlFor="obs" className="text-sm font-medium text-[#5C4A3A]">
                Observacoes (opcional)
              </Label>
              <textarea
                id="obs"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Alguma observacao sobre o agendamento..."
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A96E] focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Valor total */}
            <div className="bg-[#5C4A3A] text-white rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Valor total:</span>
                <div className="text-right">
                  {descontoPIX > 0 && (
                    <span className="text-sm line-through opacity-60">{formatarMoeda(valorOriginal)}</span>
                  )}
                  <p className="text-2xl font-bold">{formatarMoeda(valorFinal)}</p>
                </div>
              </div>
            </div>

            {/* Erro */}
            {erro && (
              <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{erro}</p>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setEtapa(3)}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button
                onClick={handleConfirmar}
                disabled={carregando}
                className="flex-1 bg-[#C9A96E] hover:bg-[#A8893E] text-white"
              >
                {carregando ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Confirmar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
