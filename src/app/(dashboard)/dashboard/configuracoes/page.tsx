import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuracoes | Beleza & Bem-Estar",
  description: "Configuracoes da clinica.",
};

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-titulo text-2xl font-bold text-marrom">Configuracoes</h1>
        <p className="text-sm text-muted-foreground">Gerencie as configuracoes da clinica</p>
      </div>

      {/* Informacoes da Clinica */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="font-titulo text-lg font-semibold text-marrom">Informacoes da Clinica</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-marrom">Nome da Clinica</label>
            <input type="text" defaultValue="Beleza & Bem-Estar" className="input-clinica mt-1" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-marrom">Telefone</label>
              <input type="tel" defaultValue="(21) 99999-9999" className="input-clinica mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-marrom">Email</label>
              <input type="email" defaultValue="contato@belezaebemestar.com.br" className="input-clinica mt-1" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-marrom">Endereco</label>
            <input type="text" defaultValue="Rua das Flores, 123" className="input-clinica mt-1" />
          </div>
        </div>
        <button className="btn-primary mt-4">Salvar Alteracoes</button>
      </div>

      {/* Horarios de Funcionamento */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="font-titulo text-lg font-semibold text-marrom">Horarios de Funcionamento</h2>
        <div className="mt-4 space-y-3">
          {[
            { dia: "Segunda a Sexta", horario: "08:00 - 20:00" },
            { dia: "Sabado", horario: "08:00 - 16:00" },
            { dia: "Domingo", horario: "Fechado" },
          ].map((h) => (
            <div key={h.dia} className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="text-sm font-medium text-marrom">{h.dia}</span>
              <span className="text-sm text-muted-foreground">{h.horario}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notificacoes */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="font-titulo text-lg font-semibold text-marrom">Notificacoes</h2>
        <div className="mt-4 space-y-3">
          {[
            { label: "Email de confirmacao de agendamento", checked: true },
            { label: "Lembrete 24h antes do agendamento", checked: true },
            { label: "Notificacao de novo agendamento (admin)", checked: true },
          ].map((n) => (
            <label key={n.label} className="flex items-center gap-3">
              <input type="checkbox" defaultChecked={n.checked} className="h-4 w-4 rounded border-dourado text-dourado focus:ring-dourado" />
              <span className="text-sm text-marrom">{n.label}</span>
            </label>
          ))}
        </div>
        <button className="btn-primary mt-4">Salvar</button>
      </div>
    </div>
  );
}
