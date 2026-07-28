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
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="size-5 text-primary" weight="fill" />
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
