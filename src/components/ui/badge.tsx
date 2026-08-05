import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Variantes do componente Badge.
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-badge border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Badge padrao (borda)
        default:
          "border-transparent bg-dourado text-white hover:bg-dourado/80",
        // Secundario
        secondary:
          "border-transparent bg-creme text-marrom hover:bg-creme-300",
        // Destruutivo
        destructive:
          "border-transparent bg-erro text-white hover:bg-erro/80",
        // Outline
        outline: "text-marrom",
        // Status de sucesso
        sucesso:
          "border-transparent bg-sucesso/10 text-sucesso",
        // Status de alerta
        alerta:
          "border-transparent bg-alerta/10 text-alerta",
        // Status de erro
        erro:
          "border-transparent bg-erro/10 text-erro",
        // Status de info
        info:
          "border-transparent bg-info/10 text-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Props do componente Badge.
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Componente Badge do shadcn/ui.
 * Exibe etiquetas de status ou categorias.
 *
 * @example
 * <Badge variant="sucesso">Confirmado</Badge>
 * <Badge variant="alerta">Pendente</Badge>
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
