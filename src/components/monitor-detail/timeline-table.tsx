import { useMemo } from "react";
import { CheckCircle, MinusCircle } from "@phosphor-icons/react";
import { regionLabel } from "./overview-tab";

interface CheckData {
  id: string;
  status: string;
  region: string;
  responseTimeMs: number | null;
  statusCode: number | null;
  checkedAt: string;
}

function formatTimestamp(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) + " " + d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatLatency(ms: number | null): string {
  if (ms == null) return "—";
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)} sec`;
  return `${ms} ms`;
}

function InlineBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 font-sans text-xs font-medium ring-1 ring-inset ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

export function TimelineTable({ checks }: { checks: CheckData[] }) {
  // Derive timeline events: transitions between up/down
  const events = useMemo(() => {
    // Show all checks as events (like the screenshot shows each individual check)
    return checks.slice(0, 200).map((c) => ({
      id: c.id,
      action: c.status === "up" ? "Monitor Recovered" : "Monitor Failed",
      isUp: c.status === "up",
      region: c.region,
      statusCode: c.statusCode,
      latency: c.responseTimeMs,
      timestamp: c.checkedAt,
    }));
  }, [checks]);

  if (events.length === 0) {
    return (
      <div className="rounded-xl bg-card px-4 py-12 text-center shadow-[0_0_0_1px_var(--border)]">
        <p className="text-sm text-muted-foreground">No check events recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-scrollbar overflow-x-auto rounded-xl shadow-[0_0_0_1px_var(--border)]">
      {/* Table header */}
      <div className="grid min-w-[640px] grid-cols-[180px_1fr_200px] border-b border-border bg-surface-sunken px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Information</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Timestamp</span>
      </div>

      {/* Scrollable body */}
      <div className="dashboard-scrollbar min-w-[640px] max-h-[480px] overflow-y-auto bg-card">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="grid grid-cols-[180px_1fr_200px] items-center border-b border-border/70 px-4 py-3 last:border-0"
          >
            {/* Action */}
            <div className="flex items-center gap-2">
              {ev.isUp ? (
                <CheckCircle className="size-4 shrink-0 text-emerald-500" weight="fill" />
              ) : (
                <MinusCircle className="size-4 shrink-0 text-red-500" weight="fill" />
              )}
              <span className="text-sm font-medium text-foreground">
                {ev.action}
              </span>
            </div>

            {/* Information badges */}
            <div className="flex flex-wrap items-center gap-2">
              <InlineBadge className="bg-gray-50 text-gray-600 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
                region
              </InlineBadge>
              <span className="text-xs text-muted-foreground">
                {regionLabel(ev.region)}
              </span>
              {ev.statusCode != null && (
                <>
                  <InlineBadge className="bg-gray-50 text-gray-600 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
                    status
                  </InlineBadge>
                  <span className="text-xs font-medium text-foreground">
                    {ev.statusCode}
                  </span>
                </>
              )}
              <InlineBadge className="bg-gray-50 text-gray-600 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
                latency
              </InlineBadge>
              <span className="text-xs font-medium text-foreground">
                {formatLatency(ev.latency)}
              </span>
            </div>

            {/* Timestamp */}
            <span className="text-xs tabular-nums text-muted-foreground">
              {formatTimestamp(ev.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
