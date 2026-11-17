"use client";

import { useState, useTransition } from "react";

/** Tombol yang menjalankan server action lalu menampilkan error (jika ada). */
export function ActionButton({
  action,
  children,
  className = "btn btn-primary !py-2 text-sm",
  disabled,
}: {
  action: () => Promise<{ error?: string } | void>;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();

  return (
    <span className="flex flex-col items-end gap-1">
      <button
        className={className}
        disabled={disabled || pending}
        onClick={() =>
          start(async () => {
            const res = await action();
            setError(res?.error);
          })
        }
      >
        {pending ? "…" : children}
      </button>
      {error && <span className="text-xs font-bold text-ruby-edge">{error}</span>}
    </span>
  );
}
