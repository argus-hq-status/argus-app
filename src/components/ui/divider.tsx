import { cn } from "~/lib/utils";

export function Divider({ className }: { className?: string }) {
  return (
    <div
      role="separator"
      className={cn(
        "relative flex w-full items-center",
        "h-px bg-stroke-soft",
        className,
      )}
    />
  );
}
