"use client";

import { useActionState } from "react";
import { registerAction } from "@/lib/actions/auth";

/**
 * Formulario de cadastro com server action.
 * Valida dados e cria nova conta de cliente.
 */
export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    null as { error: string; success: boolean } | null
  );

  return (
    <form action={formAction} className="mt-8 space-y-4">
      {state?.error && (
        <div className="rounded-lg bg-erro/10 p-3 text-sm text-erro">
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="nome"
          className="block text-sm font-medium text-marrom"
        >
          Nome completo
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          className="input-clinica mt-1"
          placeholder="Seu nome completo"
          disabled={isPending}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-marrom"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="input-clinica mt-1"
          placeholder="seu@email.com"
          disabled={isPending}
        />
      </div>

      <div>
        <label
          htmlFor="telefone"
          className="block text-sm font-medium text-marrom"
        >
          Telefone
        </label>
        <input
          id="telefone"
          name="telefone"
          type="tel"
          className="input-clinica mt-1"
          placeholder="(21) 99999-9999"
          disabled={isPending}
        />
      </div>

      <div>
        <label
          htmlFor="senha"
          className="block text-sm font-medium text-marrom"
        >
          Senha
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          required
          minLength={8}
          className="input-clinica mt-1"
          placeholder="Minimo 8 caracteres"
          disabled={isPending}
        />
      </div>

      <div>
        <label
          htmlFor="confirmarSenha"
          className="block text-sm font-medium text-marrom"
        >
          Confirmar senha
        </label>
        <input
          id="confirmarSenha"
          name="confirmarSenha"
          type="password"
          required
          minLength={8}
          className="input-clinica mt-1"
          placeholder="Confirme sua senha"
          disabled={isPending}
        />
      </div>

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          required
          className="mt-1 h-4 w-4 rounded border-dourado text-dourado focus:ring-dourado"
        />
        <span className="text-xs text-marrom/60">
          Concordo com os{" "}
          <a href="#" className="text-dourado hover:underline">
            Termos de Uso
          </a>{" "}
          e{" "}
          <a href="#" className="text-dourado hover:underline">
            Politica de Privacidade
          </a>
        </span>
      </div>

      <button
        type="submit"
        className="btn-primary w-full"
        disabled={isPending}
      >
        {isPending ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  );
}
