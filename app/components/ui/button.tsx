import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-extrabold uppercase tracking-wide select-none transition-all active:translate-y-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none rounded-2xl",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white border-b-4 border-primary-dark hover:brightness-105 active:border-b-0",
        secondary:
          "bg-streak text-white border-b-4 border-streak-edge hover:brightness-105 active:border-b-0",
        danger:
          "bg-ruby text-white border-b-4 border-ruby-edge hover:brightness-105 active:border-b-0",
        outline:
          "bg-white text-ink border-2 border-b-4 border-line hover:bg-surface-low active:border-b-2",
        ghost:
          "bg-transparent text-ink-muted hover:bg-surface-low hover:text-ink active:translate-y-0",
        super:
          "bg-gem text-white border-b-4 border-gem-edge hover:brightness-105 active:border-b-0",
      },
      size: {
        sm: "h-9 px-3 text-xs gap-1.5",
        md: "h-12 px-6 text-sm gap-2",
        lg: "h-14 px-8 text-base gap-2.5",
        icon: "h-12 w-12 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
