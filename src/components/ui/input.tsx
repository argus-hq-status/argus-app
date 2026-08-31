import * as React from "react";
import { cn } from "~/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-8 w-full rounded-lg border-0 bg-control px-3 py-1.5 text-[0.8125rem] text-foreground shadow-[inset_0_0_0_1px_var(--border)] transition-[background-color,box-shadow] duration-150 placeholder:text-text-soft file:border-0 file:bg-transparent file:text-sm file:font-medium hover:bg-control-hover focus-visible:bg-control focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_1px_var(--primary),0_0_0_3px_color-mix(in_srgb,var(--primary)_16%,transparent)] disabled:cursor-not-allowed disabled:opacity-50",
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
