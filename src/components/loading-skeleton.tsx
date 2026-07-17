import { cn } from "~/lib/utils";

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-stroke-soft bg-bg-white p-4">
      <div className="mb-3 h-4 w-1/3 rounded bg-bg-soft" />
      <div className="mb-2 h-3 w-2/3 rounded bg-bg-soft" />
      <div className="h-3 w-1/2 rounded bg-bg-soft" />
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg border border-stroke-soft bg-bg-white p-4">
          <div className="mb-2 h-4 w-1/4 rounded bg-bg-soft" />
          <div className="h-3 w-1/2 rounded bg-bg-soft" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={cn("animate-pulse flex items-center gap-4 rounded-lg px-4 py-3", i === 0 ? "bg-bg-weak" : "bg-bg-white")}>
          <div className="h-3 flex-1 rounded bg-bg-soft" />
          <div className="h-3 w-20 rounded bg-bg-soft" />
          <div className="h-3 w-16 rounded bg-bg-soft" />
        </div>
      ))}
    </div>
  );
}
