import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10.75 w-full min-w-0 px-5 py-3",
        "selection:bg-primary selection:text-primary-foreground placeholder:text-border placeholder:text-sm",
        "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:bg-muted disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "rounded-md border border-transparent bg-transparent text-sm transition-[color,box-shadow] outline-none",
        "focus-visible:border-muted-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:ring-offset-2",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
