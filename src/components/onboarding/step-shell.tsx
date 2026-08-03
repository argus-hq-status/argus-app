import type { ReactNode } from "react";
import { Check } from "@phosphor-icons/react";
import { cn } from "~/lib/utils";

export function StepShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-[1.75rem]">
          {title}
        </h1>
        {description && (
          <p className="mx-auto max-w-md text-sm leading-6 text-zinc-400">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

export function StepProgress({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  return (
    <div
      className="flex items-center justify-center gap-1.5"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current + 1}
      aria-label={`Step ${current + 1} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i === current
              ? "w-6 bg-white"
              : i < current
                ? "w-1.5 bg-zinc-500"
                : "w-1.5 bg-zinc-800",
          )}
        />
      ))}
    </div>
  );
}

export function OptionCard({
  selected,
  onSelect,
  icon: Icon,
  title,
  description,
}: {
  selected: boolean;
  onSelect: () => void;
  icon?: React.ComponentType<{ className?: string; weight?: "regular" | "bold" | "fill" }>;
  title: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group flex w-full cursor-pointer items-start gap-3 rounded-xl bg-zinc-900/80 p-4 text-left ring-1 ring-inset transition-all",
        "hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        selected
          ? "bg-zinc-800 ring-2 ring-primary"
          : "ring-zinc-800",
      )}
    >
      {Icon && (
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
            selected
              ? "bg-primary/10 text-primary"
              : "bg-zinc-800 text-zinc-400",
          )}
        >
          <Icon className="size-4.5" weight="bold" />
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm font-medium text-white">{title}</span>
        {description && (
          <span className="text-xs leading-5 text-zinc-400">
            {description}
          </span>
        )}
      </span>
      <span
        className={cn(
          "mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full transition-all",
          selected
            ? "bg-primary text-primary-foreground"
            : "ring-1 ring-inset ring-zinc-700",
        )}
      >
        {selected && <Check className="size-3" weight="bold" />}
      </span>
    </button>
  );
}

export function ChoiceChip({
  selected,
  onSelect,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "cursor-pointer rounded-lg px-3.5 py-2 text-sm transition-all ring-1 ring-inset",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        selected
          ? "bg-primary/15 text-primary ring-primary"
          : "bg-zinc-900/80 text-zinc-300 ring-zinc-800 hover:bg-zinc-800 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}
