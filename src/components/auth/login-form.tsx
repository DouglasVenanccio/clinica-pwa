"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { loginAction } from "@/lib/actions/auth";

/**
 * Formulario de login com server action.
 * Usa useActionState para gerenciar estado e useRouter para redirect.
 */
export function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    loginAction,
    { error: "", success: false }
  );

  // Redireciona apos login bem-sucedido
  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
    }
  }, [state, router]);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      {state?.error && (
        <div className="rounded-lg bg-erro/10 p-3 text-sm text-erro">
          {state.error}
        </div>
      )}

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
          className="input-clinica mt-1"
          placeholder="Sua senha"
          disabled={isPending}
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-dourado text-dourado focus:ring-dourado"
          />
          <span className="text-sm text-marrom/70">Lembrar-me</span>
        </label>
      </div>

      <button
        type="submit"
        className="btn-primary w-full"
        disabled={isPending}
      >
        {isPending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
