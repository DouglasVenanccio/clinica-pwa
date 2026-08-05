import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | Beleza & Bem-Estar",
  description: "Acesse sua conta para agendar servicos.",
};

/**
 * Pagina de Login.
 * Formulario com email e senha, usando server action.
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-creme">
      {/* Lado esquerdo - Branding */}
      <div className="hidden w-1/2 bg-marrom lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div className="text-center">
          <h1 className="font-titulo text-5xl font-bold text-dourado">
            Beleza & Bem-Estar
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Estetica e Fisioterapia
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <div className="h-1 w-16 rounded-full bg-dourado"></div>
            <div className="h-1 w-8 rounded-full bg-dourado/50"></div>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulario */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="mb-8 text-center lg:hidden">
            <h1 className="font-titulo text-3xl font-bold text-marrom">
              Beleza & Bem-Estar
            </h1>
          </div>

          <div className="rounded-xl bg-white p-8 shadow-md">
            <h2 className="font-titulo text-2xl font-bold text-marrom">
              Bem-vindo de volta
            </h2>
            <p className="mt-2 text-sm text-marrom/60">
              Faca login para agendar seus servicos
            </p>

            <LoginForm />

            <div className="mt-6 text-center">
              <p className="text-sm text-marrom/60">
                Nao tem uma conta?{" "}
                <Link
                  href="/cadastro"
                  className="font-medium text-dourado hover:text-dourado-500"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
