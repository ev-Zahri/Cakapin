import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-extrabold uppercase tracking-wide select-none transition-all active:translate-y-0.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none rounded-2xl",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white border-b-3 border-primary-edge hover:brightness-105 active:border-b-1",
        secondary:
          "bg-streak text-white border-b-3 border-streak-edge hover:brightness-105 active:border-b-1",
        danger:
          "bg-ruby text-white border-b-3 border-ruby-edge hover:brightness-105 active:border-b-1",
        outline:
          "bg-white text-ink border border-b-3 border-line hover:bg-surface-low active:border-b-1",
        ghost:
          "bg-transparent text-ink-muted hover:bg-surface-low hover:text-ink active:translate-y-0",
        super:
          "bg-gem text-white border-b-3 border-gem-edge hover:brightness-105 active:border-b-1",
      },
      size: {
        sm: "h-9 px-3.5 text-xs gap-1.5",
        md: "h-11 px-5 text-sm gap-2",
        lg: "h-13 px-7 text-base gap-2.5",
        icon: "h-11 w-11 p-0",
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
