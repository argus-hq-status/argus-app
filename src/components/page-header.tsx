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
    <div className={cn("mb-8 flex items-start justify-between gap-4", className)}>
      <div className="flex gap-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-500 dark:border-blue-400/20 dark:bg-blue-500/15 dark:text-blue-400">
          <Icon className="size-4.5 text-blue-500 dark:text-blue-400" weight="fill" />
        </div>
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-gray-900 dark:text-gray-50">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
