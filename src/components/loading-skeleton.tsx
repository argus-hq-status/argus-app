import { cn } from "~/lib/utils";

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-xl bg-card p-4 shadow-[0_0_0_1px_var(--border)]", className)}>
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="size-4 rounded-full bg-muted" />
      </div>
      <div className="mt-2.5 h-6 w-16 rounded bg-muted" />
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {/* Header filter bar shimmer */}
      <div className="flex items-center justify-between gap-4 py-1">
        <div className="h-8 w-60 rounded-lg bg-muted" />
        <div className="h-8 w-40 rounded-lg bg-muted" />
      </div>

      {/* Table container shimmer */}
      <div className="overflow-hidden rounded-xl bg-card shadow-[0_0_0_1px_var(--border)]">
        {/* Table header */}
        <div className="flex h-10 items-center border-b border-border bg-surface-sunken px-4">
          <div className="h-3 w-24 rounded bg-muted" />
          <div className="ml-auto h-3 w-32 rounded bg-muted" />
          <div className="ml-12 h-3 w-16 rounded bg-muted" />
        </div>

        {/* Rows */}
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-border/70 px-4 py-3.5 last:border-0"
          >
            <div className="space-y-1.5">
              <div className="h-3.5 w-44 rounded bg-muted" />
              <div className="h-2.5 w-64 rounded bg-muted/60" />
            </div>
            <div className="flex items-center gap-6">
              <div className="h-5 w-14 rounded-md bg-muted" />
              <div className="h-3.5 w-10 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-[0_0_0_1px_var(--border)]">
      {/* Header */}
      <div className="flex h-10 items-center border-b border-border bg-surface-sunken px-4">
        <div className="h-3 w-28 rounded bg-muted" />
        <div className="ml-auto h-3 w-20 rounded bg-muted" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b border-border/70 px-4 py-3 last:border-0"
        >
          <div className="h-3.5 w-40 rounded bg-muted" />
          <div className="h-3.5 w-24 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

export function DashboardMetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
