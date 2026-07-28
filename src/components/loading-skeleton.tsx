import { cn } from "~/lib/utils";

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
      <div className="mb-3 h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mb-2 h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
          <div className="mb-2 h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={cn("animate-pulse flex items-center gap-4 rounded-lg px-4 py-3", i === 0 ? "bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-[#1a1a1a]")}>
          <div className="h-3 flex-1 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      ))}
    </div>
  );
}
