import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl bg-card p-8 shadow-sm ring-1 ring-inset ring-border",
        className,
      )}
    >
      <div className="mb-5 flex size-[108px] items-center justify-center rounded-full bg-muted">
        {Icon && <Icon className="size-10 text-muted-foreground" />}
      </div>
      <h3 className="mb-1 text-center text-sm font-medium text-card-foreground">
        {title}
      </h3>
      {description && (
        <p className="mb-5 text-center text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
