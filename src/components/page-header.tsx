import type { ComponentType } from "react";
import { cn } from "~/lib/utils";

type PageHeaderProps = {
  icon: ComponentType<{ className?: string; weight?: "regular" | "bold" | "fill" }>;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({ icon: Icon, title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="flex min-w-0 gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-primary-muted text-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--primary)_18%,transparent)]">
          <Icon className="size-[18px]" weight="bold" />
        </div>
        <div className="min-w-0">
          <h1 className="text-[1.375rem] font-semibold leading-7 tracking-[-0.025em] text-foreground text-balance">
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 max-w-2xl text-[0.8125rem] leading-5 text-muted-foreground text-pretty">{description}</p>
          )}
        </div>
      </div>
      {actions ? <div className="shrink-0 self-start">{actions}</div> : null}
    </div>
  );
}
