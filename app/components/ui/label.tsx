import * as React from "react";
import { cn } from "../../lib/utils";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-xs font-black uppercase tracking-wider text-ink-muted select-none",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";
