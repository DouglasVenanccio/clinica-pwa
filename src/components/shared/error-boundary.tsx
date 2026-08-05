"use client";

import React from "react";
import { Button } from "@/components/ui/button";

/**
 * Props do componente ErrorBoundary.
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Mensagem de erro personalizada */
  mensagem?: string;
  /** Callback para quando o erro ocorre */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Props do estado de erro.
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Componente ErrorBoundary.
 * Captura erros de renderizacao e exibe fallback amigavel.
 *
 * @example
 * <ErrorBoundary>
 *   <MeuComponente />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary capturou um erro:", error, errorInfo);
    
    // Callback personalizado
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
          <div className="rounded-card bg-erro/10 p-6">
            <svg
              className="mx-auto h-12 w-12 text-erro"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h2 className="mt-6 font-titulo text-2xl font-bold text-marrom">
            Algo deu errado
          </h2>

          <p className="mt-2 text-marrom/70">
            {this.props.mensagem || "Ocorreu um erro inesperado. Tente novamente."}
          </p>

          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="mt-4 max-w-lg text-left">
              <summary className="cursor-pointer text-sm text-marrom/60">
                Detalhes do erro (desenvolvimento)
              </summary>
              <pre className="mt-2 overflow-auto rounded-card bg-marrom/5 p-4 text-xs text-marrom">
                {this.state.error.message}
                {"\n\n"}
                {this.state.error.stack}
              </pre>
            </details>
          )}

          <div className="mt-6 flex gap-4">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Recarregar Pagina
            </Button>
            <Button
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Tentar Novamente
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
