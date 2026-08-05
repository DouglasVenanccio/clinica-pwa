import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Props do componente Input.
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Componente Input do shadcn/ui.
 * Campo de entrada de dados com estilos consistentes.
 *
 * @example
 * <Input type="text" placeholder="Seu nome" />
 * <Input type="email" placeholder="seu@email.com" />
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-input border border-input bg-white px-3 py-2 text-sm text-marrom ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-marrom/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dourado focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
