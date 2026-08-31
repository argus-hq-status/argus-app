import type { ComponentType, ReactNode } from "react";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";

const toneStyles = {
  primary: "bg-primary-muted text-primary",
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  error: "bg-error-light text-error",
  neutral: "bg-muted text-muted-foreground",
} as const;

type MetricCardProps = {
  label: string;
  value: ReactNode;
  icon: ComponentType<{ className?: string; weight?: "regular" | "bold" | "fill" }>;
  tone?: keyof typeof toneStyles;
  detail?: ReactNode;
  className?: string;
};

export function MetricCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  detail,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("flex min-h-28 flex-col justify-between p-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className={cn("flex size-7 items-center justify-center rounded-lg", toneStyles[tone])}>
          <Icon className="size-4" weight={tone === "neutral" ? "regular" : "bold"} />
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="text-2xl font-semibold leading-none tracking-[-0.025em] text-foreground tabular-nums">
          {value}
        </div>
        {detail ? <div className="pb-0.5 text-xs text-muted-foreground">{detail}</div> : null}
      </div>
    </Card>
  );
}
