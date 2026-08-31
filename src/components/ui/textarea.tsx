import * as React from "react";
import { cn } from "~/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-24 w-full resize-y rounded-lg border-0 bg-control px-3 py-2 text-sm leading-5 text-foreground shadow-[inset_0_0_0_1px_var(--border)] transition-[background-color,box-shadow] duration-150 placeholder:text-text-soft hover:bg-control-hover focus-visible:bg-control focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_1px_var(--primary),0_0_0_3px_color-mix(in_srgb,var(--primary)_16%,transparent)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
