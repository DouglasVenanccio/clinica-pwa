import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Variantes do componente Button.
 * Baseado no design system do projeto.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-button text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Botao principal (dourado)
        default: "bg-dourado text-white hover:bg-dourado-500",
        // Botao destrutivo (vermelho)
        destructive: "bg-erro text-white hover:bg-erro/90",
        // Botao outline (borda)
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        // Botao secundario
        secondary: "bg-creme text-marrom hover:bg-creme-300",
        // Link
        link: "text-dourado underline-offset-4 hover:underline",
        // Fantasma
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-button px-3",
        lg: "h-11 rounded-button px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Props do componente Button.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Se true, renderiza como Slot (para composicao) */
  asChild?: boolean;
}

/**
 * Componente Button do shadcn/ui.
 * Suporta variantes de cores e tamanhos.
 *
 * @example
 * <Button variant="default" size="lg">Agendar</Button>
 * <Button variant="outline">Cancelar</Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
