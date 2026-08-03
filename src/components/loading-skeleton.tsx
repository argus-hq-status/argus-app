import { cn } from "~/lib/utils";

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-lg border border-gray-200 bg-white p-3.5 dark:border-[#2a2a2a] dark:bg-[#1a1a1a]", className)}>
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 rounded bg-gray-200 dark:bg-[#282828]" />
        <div className="size-4 rounded-full bg-gray-200 dark:bg-[#282828]" />
      </div>
      <div className="mt-2.5 h-6 w-16 rounded bg-gray-200 dark:bg-[#282828]" />
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {/* Header filter bar shimmer */}
      <div className="flex items-center justify-between gap-4 py-1">
        <div className="h-8 w-60 rounded-lg bg-gray-200 dark:bg-[#222]" />
        <div className="h-8 w-40 rounded-lg bg-gray-200 dark:bg-[#222]" />
      </div>

      {/* Table container shimmer */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-[#2a2a2a] dark:bg-[#141414]">
        {/* Table header */}
        <div className="flex h-10 items-center border-b border-gray-200 bg-gray-50 px-4 dark:border-[#2a2a2a] dark:bg-[#0d0d0d]">
          <div className="h-3 w-24 rounded bg-gray-200 dark:bg-[#282828]" />
          <div className="ml-auto h-3 w-32 rounded bg-gray-200 dark:bg-[#282828]" />
          <div className="ml-12 h-3 w-16 rounded bg-gray-200 dark:bg-[#282828]" />
        </div>

        {/* Rows */}
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5 last:border-0 dark:border-[#222]"
          >
            <div className="space-y-1.5">
              <div className="h-3.5 w-44 rounded bg-gray-200 dark:bg-[#222]" />
              <div className="h-2.5 w-64 rounded bg-gray-100 dark:bg-[#1a1a1a]" />
            </div>
            <div className="flex items-center gap-6">
              <div className="h-5 w-14 rounded-full bg-gray-200 dark:bg-[#222]" />
              <div className="h-3.5 w-10 rounded bg-gray-200 dark:bg-[#222]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-[#2a2a2a] dark:bg-[#141414]">
      {/* Header */}
      <div className="flex h-10 items-center border-b border-gray-200 bg-gray-50 px-4 dark:border-[#2a2a2a] dark:bg-[#0d0d0d]">
        <div className="h-3 w-28 rounded bg-gray-200 dark:bg-[#282828]" />
        <div className="ml-auto h-3 w-20 rounded bg-gray-200 dark:bg-[#282828]" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b border-gray-100 px-4 py-3 last:border-0 dark:border-[#222]"
        >
          <div className="h-3.5 w-40 rounded bg-gray-200 dark:bg-[#222]" />
          <div className="h-3.5 w-24 rounded bg-gray-200 dark:bg-[#222]" />
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
