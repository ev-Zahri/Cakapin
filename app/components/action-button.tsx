"use client";

import { useState, useTransition } from "react";
import { Button, type ButtonProps } from "./ui/button";

interface ActionButtonProps extends ButtonProps {
  action: () => Promise<{ error?: string } | void>;
  children: React.ReactNode;
}

/**
 * Tombol interaktif berbasis komponen UI modular `Button` (CVA + tailwind-merge)
 * yang menjalankan Server Action dengan transisi pending dan pesan kesalahan terintegrasi.
 */
export function ActionButton({
  action,
  children,
  variant = "primary",
  size = "md",
  disabled,
  className,
  ...props
}: ActionButtonProps) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();

  return (
    <span className="flex flex-col items-stretch gap-1 w-full">
      <Button
        variant={variant}
        size={size}
        disabled={disabled || pending}
        className={className}
        onClick={() =>
          start(async () => {
            const res = await action();
            setError(res?.error);
          })
        }
        {...props}
      >
        {pending ? "…" : children}
      </Button>
      {error && <span className="text-center text-xs font-bold text-ruby-edge">{error}</span>}
    </span>
  );
}
