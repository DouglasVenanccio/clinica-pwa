"use client";

import { cn } from "@/lib/utils";

/**
 * Props do componente Loading.
 */
interface LoadingProps {
  /** Tamanho do loading */
  size?: "sm" | "md" | "lg";
  /** Cor do loading */
  color?: "dourado" | "marrom" | "branco";
  /** Texto alternativo */
  texto?: string;
  /** Classe CSS adicional */
  className?: string;
}

/**
 * Mapeamento de tamanhos
 */
const tamanhos = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

/**
 * Mapeamento de cores
 */
const cores = {
  dourado: "border-dourado",
  marrom: "border-marrom",
  branco: "border-white",
};

/**
 * Componente de Loading.
 * Exibe um indicador de carregamento animado.
 *
 * @example
 * <Loading size="md" color="dourado" />
 * <Loading texto="Carregando..." />
 */
export function Loading({
  size = "md",
  color = "dourado",
  texto,
  className,
}: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-t-transparent",
          tamanhos[size],
          cores[color]
        )}
        role="status"
        aria-label="Carregando"
      />
      {texto && (
        <p className="text-sm text-marrom/70">{texto}</p>
      )}
      <span className="sr-only">Carregando...</span>
    </div>
  );
}

/**
 * Componente de Loading Fullscreen.
 * Ocupa toda a tela com loading centralizado.
 */
export function LoadingFullscreen({ texto = "Carregando..." }: { texto?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-creme/80 backdrop-blur-sm">
      <Loading size="lg" texto={texto} />
    </div>
  );
}
