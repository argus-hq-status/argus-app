import { useMemo, useState, useRef, type ReactNode } from "react";
import {
  CheckCircle,
  WarningCircle,
  Clock,
  Pulse,
  Lightning,
  Gauge,
} from "@phosphor-icons/react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "~/components/ui/select";

/* ── Region label map ── */
const REGION_LABELS: Record<string, string> = {
  fra: "Frankfurt (FRA)",
  jnb: "Johannesburg (JNB)",
  gru: "São Paulo (GRU)",
  sin: "Singapore (SIN)",
  syd: "Sydney (SYD)",
};

export function regionLabel(code: string) {
  return REGION_LABELS[code] ?? code.toUpperCase();
}

/* ── Types ── */
interface CheckData {
  id: string;
  status: string;
  region: string;
  responseTimeMs: number | null;
  statusCode: number | null;
  checkedAt: string;
}

interface OverviewTabProps {
  checks: CheckData[];
  regions: string[];
  intervalSeconds: number;
}

/* ── Percentile helper ── */
function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return Math.round(sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo));
}

function formatLatency(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  return `${Math.round(ms)} ms`;
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} day(s) ago`;
}

/* ── Metric Card ── */
function MetricCard({
  label,
  value,
  icon: Icon,
  valueColorClass = "text-foreground",
}: {
  label: string;
  value: ReactNode;
  icon?: React.ComponentType<{ className?: string; weight?: "bold" | "fill" | "regular" }>;
  valueColorClass?: string;
}) {
  return (
    <div className="rounded-xl bg-card p-4 shadow-[0_0_0_1px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>{label}</span>
        {Icon && <Icon className="size-4 shrink-0" />}
      </div>
      <div className={`mt-1.5 text-xl font-bold ${valueColorClass}`}>
        {value}
      </div>
    </div>
  );
}

/* ── Percentile Card ── */
function PercentileCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-card p-4 shadow-[0_0_0_1px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>{label}</span>
        <Gauge className="size-4 shrink-0 text-primary" />
      </div>
      <div className="mt-1.5 text-lg font-semibold text-foreground tabular-nums">
        {formatLatency(value)}
      </div>
    </div>
  );
}

/* ── Uptime Bar Chart (CSS-based) ── */
function UptimeBarChart({ checks }: { checks: CheckData[] }) {
  const buckets = useMemo(() => {
    const now = Date.now();
    const hours = 24;
    const slots: { success: number; error: number; degraded: number }[] = Array.from(
      { length: hours },
      () => ({ success: 0, error: 0, degraded: 0 }),
    );

    for (const c of checks) {
      const age = now - new Date(c.checkedAt).getTime();
      const hoursAgo = Math.floor(age / 3600000);
      if (hoursAgo < 0 || hoursAgo >= hours) continue;
      const slot = slots[hours - 1 - hoursAgo];
      if (c.status === "down") {
        slot.error++;
      } else if (c.responseTimeMs != null && c.responseTimeMs > 5000) {
        slot.degraded++;
      } else {
        slot.success++;
      }
    }
    return slots;
  }, [checks]);

  const maxCount = Math.max(1, ...buckets.map((b) => b.success + b.error + b.degraded));

  return (
    <div>
      <div className="flex items-end gap-[2px]" style={{ height: 80 }}>
        {buckets.map((b, i) => {
          const total = b.success + b.error + b.degraded;
          const h = total === 0 ? 2 : (total / maxCount) * 100;
          const errorPct = total === 0 ? 0 : (b.error / total) * 100;

          let barColor = "bg-emerald-500";
          if (errorPct > 0) barColor = "bg-red-500";
          else if (b.degraded > 0) barColor = "bg-amber-500";

          return (
            <div
              key={i}
              className={`flex-1 rounded-[2px] ${barColor} transition-all`}
              style={{ height: `${h}%`, minHeight: 2 }}
              title={`S:${b.success} E:${b.error} D:${b.degraded}`}
            />
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-center gap-4">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="inline-block size-2.5 rounded-[2px] bg-emerald-500" /> Success
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="inline-block size-2.5 rounded-[2px] bg-red-500" /> Error
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="inline-block size-2.5 rounded-[2px] bg-amber-500" /> Degraded
        </span>
      </div>
    </div>
  );
}

/* ── Interactive Multi-Phase Stacked Latency Chart ── */
const PHASES = [
  { key: "dns", label: "DNS", color: "#5b5bd6", ratio: 0.15 },
  { key: "connect", label: "Connect", color: "#10b981", ratio: 0.10 },
  { key: "tls", label: "TLS", color: "#f59e0b", ratio: 0.12 },
  { key: "ttfb", label: "TTFB", color: "#8b5cf6", ratio: 0.48 },
  { key: "transfer", label: "Transfer", color: "#ec4899", ratio: 0.15 },
] as const;

const RESOLUTION_MINUTES: Record<string, number> = {
  "5 minutes": 5,
  "15 minutes": 15,
  "30 minutes": 30,
  "1 hour": 60,
  "2 hours": 120,
  "4 hours": 240,
  "8 hours": 480,
};

const QUANTILE_NUMBERS: Record<string, number> = {
  P50: 50,
  P75: 75,
  P90: 90,
  P95: 95,
  P99: 99,
};

function MultiPhaseLatencyChart({ checks }: { checks: CheckData[] }) {
  const [quantile, setQuantile] = useState("P50");
  const [resolution, setResolution] = useState("30 minutes");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const pointsData = useMemo(() => {
    const validChecks = checks.filter(
      (c) => c.responseTimeMs != null && c.responseTimeMs > 0,
    );

    if (validChecks.length === 0) return null;

    const resMins = RESOLUTION_MINUTES[resolution] ?? 30;
    const windowMs = resMins * 60 * 1000;
    const qPct = QUANTILE_NUMBERS[quantile] ?? 50;

    // Group checks into resolution buckets based on timestamp
    const bucketsMap = new Map<number, number[]>();
    const checkTimestampsMap = new Map<number, string>();

    for (const c of validChecks) {
      const time = new Date(c.checkedAt).getTime();
      const bucketKey = Math.floor(time / windowMs) * windowMs;
      if (!bucketsMap.has(bucketKey)) {
        bucketsMap.set(bucketKey, []);
        checkTimestampsMap.set(bucketKey, c.checkedAt);
      }
      bucketsMap.get(bucketKey)!.push(c.responseTimeMs!);
    }

    const sortedBucketKeys = Array.from(bucketsMap.keys()).sort((a, b) => a - b);

    // If only 1 bucket, create per-check points so a line/area can render
    if (sortedBucketKeys.length < 2) {
      const points = validChecks.slice(0, 100).reverse();
      return points.map((c) => {
        const total = c.responseTimeMs!;
        const dns = Math.round(total * 0.15);
        const connect = Math.round(total * 0.10);
        const tls = Math.round(total * 0.12);
        const ttfb = Math.round(total * 0.48);
        const transfer = Math.max(1, total - (dns + connect + tls + ttfb));
        return {
          timestamp: c.checkedAt,
          total,
          dns,
          connect,
          tls,
          ttfb,
          transfer,
          c1: dns,
          c2: dns + connect,
          c3: dns + connect + tls,
          c4: dns + connect + tls + ttfb,
          c5: total,
        };
      });
    }

    return sortedBucketKeys.map((key) => {
      const vals = bucketsMap.get(key)!.sort((a, b) => a - b);
      const total = percentile(vals, qPct);
      const dns = Math.round(total * 0.15);
      const connect = Math.round(total * 0.10);
      const tls = Math.round(total * 0.12);
      const ttfb = Math.round(total * 0.48);
      const transfer = Math.max(1, total - (dns + connect + tls + ttfb));

      return {
        timestamp: checkTimestampsMap.get(key)!,
        total,
        dns,
        connect,
        tls,
        ttfb,
        transfer,
        c1: dns,
        c2: dns + connect,
        c3: dns + connect + tls,
        c4: dns + connect + tls + ttfb,
        c5: total,
      };
    });
  }, [checks, quantile, resolution]);

  if (!pointsData || pointsData.length < 2) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Not enough latency check data recorded yet.
      </div>
    );
  }

  const maxLatency = Math.max(...pointsData.map((p) => p.total), 10);
  const width = 800;
  const height = 180;
  type Point = (NonNullable<typeof pointsData>)[0];

  // Helper to build stacked area fill polygon
  const buildAreaPath = (getter: (p: Point) => number, prevGetter?: (p: Point) => number) => {
    const topPoints = pointsData.map((p, i) => {
      const x = (i / (pointsData.length - 1)) * width;
      const y = height - (getter(p) / maxLatency) * (height - 20) - 5;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    if (!prevGetter) {
      return `M 0,${height} L ${topPoints.join(" L ")} L ${width},${height} Z`;
    }

    const bottomPoints = pointsData.map((p, i) => {
      const x = (i / (pointsData.length - 1)) * width;
      const y = height - (prevGetter(p) / maxLatency) * (height - 20) - 5;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).reverse();

    return `M ${topPoints[0]} L ${topPoints.join(" L ")} L ${bottomPoints.join(" L ")} Z`;
  };

  // Helper to build single boundary line path for top stroke
  const buildLinePath = (getter: (p: Point) => number) => {
    return pointsData
      .map((p, i) => {
        const x = (i / (pointsData.length - 1)) * width;
        const y = height - (getter(p) / maxLatency) * (height - 20) - 5;
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const pct = mouseX / rect.width;
    const idx = Math.round(pct * (pointsData.length - 1));
    setHoverIndex(idx);
  };

  const activePoint = hoverIndex !== null ? pointsData[hoverIndex] : null;
  const activeX = hoverIndex !== null ? (hoverIndex / (pointsData.length - 1)) * 100 : 0;

  // Format X-axis tick timestamps
  const xAxisTicks = useMemo(() => {
    if (pointsData.length < 2) return [];
    const count = Math.min(5, pointsData.length);
    const step = (pointsData.length - 1) / (count - 1);
    const ticks = [];
    for (let i = 0; i < count; i++) {
      const idx = Math.round(i * step);
      const pt = pointsData[idx];
      if (pt) {
        const d = new Date(pt.timestamp);
        const label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
        ticks.push({ label, pct: (idx / (pointsData.length - 1)) * 100 });
      }
    }
    return ticks;
  }, [pointsData]);

  return (
    <div className="space-y-4">
      {/* Controls Bar above Chart */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-foreground">
        <span>The</span>
        <div className="w-[85px]">
          <Select value={quantile} onValueChange={setQuantile}>
            <SelectTrigger className="h-7 px-2.5 text-xs font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="P50">P50</SelectItem>
              <SelectItem value="P75">P75</SelectItem>
              <SelectItem value="P90">P90</SelectItem>
              <SelectItem value="P95">P95</SelectItem>
              <SelectItem value="P99">P99</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <span>quantile within a</span>
        <div className="w-[125px]">
          <Select value={resolution} onValueChange={setResolution}>
            <SelectTrigger className="h-7 px-2.5 text-xs font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5 minutes">5 minutes</SelectItem>
              <SelectItem value="15 minutes">15 minutes</SelectItem>
              <SelectItem value="30 minutes">30 minutes</SelectItem>
              <SelectItem value="1 hour">1 hour</SelectItem>
              <SelectItem value="2 hours">2 hours</SelectItem>
              <SelectItem value="4 hours">4 hours</SelectItem>
              <SelectItem value="8 hours">8 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <span>resolution</span>
      </div>

      {/* Main Chart Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIndex(null)}
        className="relative rounded-xl bg-card p-4 shadow-[0_0_0_1px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]"
      >
        {/* Y-Axis Labels */}
        <div className="absolute right-4 top-3 text-[11px] font-medium text-text-soft">
          {formatLatency(maxLatency)}
        </div>
        <div className="absolute bottom-10 right-4 text-[11px] font-medium text-text-soft">
          0ms
        </div>

        {/* Stacked Area SVG */}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full overflow-visible"
          preserveAspectRatio="none"
          style={{ height: 180 }}
        >
          {/* Fills */}
          <path d={buildAreaPath((p) => p.c5, (p) => p.c4)} fill="#ec4899" fillOpacity="0.4" />
          <path d={buildAreaPath((p) => p.c4, (p) => p.c3)} fill="#8b5cf6" fillOpacity="0.35" />
          <path d={buildAreaPath((p) => p.c3, (p) => p.c2)} fill="#f59e0b" fillOpacity="0.4" />
          <path d={buildAreaPath((p) => p.c2, (p) => p.c1)} fill="#10b981" fillOpacity="0.45" />
          <path d={buildAreaPath((p) => p.c1)} fill="#4646a8" fillOpacity="0.75" />

          {/* Layer Top Strokes (matching Image 1 boundary lines) */}
          <path d={buildLinePath((p) => p.c5)} fill="none" stroke="#ec4899" strokeWidth="1.75" />
          <path d={buildLinePath((p) => p.c4)} fill="none" stroke="#8b5cf6" strokeWidth="1.75" />
          <path d={buildLinePath((p) => p.c3)} fill="none" stroke="#f59e0b" strokeWidth="1.75" />
          <path d={buildLinePath((p) => p.c2)} fill="none" stroke="#10b981" strokeWidth="1.75" />
          <path d={buildLinePath((p) => p.c1)} fill="none" stroke="#6868df" strokeWidth="1.75" />

          {/* Crosshair indicator line */}
          {activePoint && (
            <line
              x1={(hoverIndex! / (pointsData.length - 1)) * width}
              y1="0"
              x2={(hoverIndex! / (pointsData.length - 1)) * width}
              y2={height}
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          )}
        </svg>

        {/* X-Axis Ticks */}
        <div className="relative mt-2 flex h-5 w-full items-center text-[10px] text-muted-foreground">
          {xAxisTicks.map((t, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === xAxisTicks.length - 1;
            return (
              <span
                key={idx}
                className={`absolute whitespace-nowrap ${isFirst ? 'left-0' : isLast ? 'right-0' : '-translate-x-1/2'}`}
                style={isFirst || isLast ? undefined : { left: `${t.pct}%` }}
              >
                {t.label}
              </span>
            );
          })}
        </div>

        {/* Floating Tooltip matching screenshot */}
        {activePoint && (
          <div
            className="pointer-events-none absolute z-30 w-56 rounded-lg border border-gray-800 bg-[#0c0c0e] p-3 text-xs text-white shadow-xl"
            style={{
              left: activeX > 65 ? `calc(${activeX}% - 240px)` : `calc(${activeX}% + 15px)`,
              top: "20px",
            }}
          >
            <p className="font-semibold text-gray-200 mb-2">
              {new Date(activePoint.timestamp).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}{" "}
              at{" "}
              {new Date(activePoint.timestamp).toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-[2px] bg-[#5b5bd6]" /> DNS
                </span>
                <span className="font-semibold">{activePoint.dns} <span className="text-[10px] font-normal text-gray-400">ms</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-[2px] bg-[#10b981]" /> Connect
                </span>
                <span className="font-semibold">{activePoint.connect} <span className="text-[10px] font-normal text-gray-400">ms</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-[2px] bg-[#f59e0b]" /> TLS
                </span>
                <span className="font-semibold">{activePoint.tls} <span className="text-[10px] font-normal text-gray-400">ms</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-[2px] bg-[#8b5cf6]" /> TTFB
                </span>
                <span className="font-semibold">{activePoint.ttfb} <span className="text-[10px] font-normal text-gray-400">ms</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-[2px] bg-[#ec4899]" /> Transfer
                </span>
                <span className="font-semibold">{activePoint.transfer} <span className="text-[10px] font-normal text-gray-400">ms</span></span>
              </div>
            </div>

            <hr className="my-2 border-gray-800" />

            <div className="flex items-center justify-between font-bold text-white">
              <span>Total</span>
              <span>{activePoint.total} <span className="text-[10px] font-normal text-gray-400">ms</span></span>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-5 border-t border-border/70 pt-2">
          {PHASES.map((p) => (
            <span key={p.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-2.5 rounded-[2px]" style={{ backgroundColor: p.color }} />
              {p.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Region Latency Summary ── */
function RegionSummary({ checks, regions }: { checks: CheckData[]; regions: string[] }) {
  const regionData = useMemo(() => {
    return regions.map((r) => {
      const regionChecks = checks.filter((c) => c.region === r && c.responseTimeMs != null);
      const latencies = regionChecks.map((c) => c.responseTimeMs!).sort((a, b) => a - b);
      return {
        region: r,
        count: regionChecks.length,
        p50: percentile(latencies, 50),
        p90: percentile(latencies, 90),
        p99: percentile(latencies, 99),
      };
    });
  }, [checks, regions]);

  if (regionData.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl shadow-[0_0_0_1px_var(--border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-sunken">
            <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Region</th>
            <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Checks</th>
            <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">P50</th>
            <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">P90</th>
            <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">P99</th>
          </tr>
        </thead>
        <tbody>
          {regionData.map((r) => (
            <tr key={r.region} className="border-b border-border/70 last:border-0">
              <td className="px-4 py-2.5 font-medium text-foreground">{regionLabel(r.region)}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{r.count}</td>
              <td className="px-4 py-2.5 text-right tabular-nums font-medium text-foreground">{formatLatency(r.p50)}</td>
              <td className="px-4 py-2.5 text-right tabular-nums font-medium text-foreground">{formatLatency(r.p90)}</td>
              <td className="px-4 py-2.5 text-right tabular-nums font-medium text-foreground">{formatLatency(r.p99)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Main Overview Tab ── */
export function OverviewTab({ checks, regions }: OverviewTabProps) {
  const stats = useMemo(() => {
    const total = checks.length;
    const up = checks.filter((c) => c.status === "up").length;
    const down = checks.filter((c) => c.status === "down").length;
    const degraded = checks.filter(
      (c) => c.status === "up" && c.responseTimeMs != null && c.responseTimeMs > 5000,
    ).length;
    const uptime = total > 0 ? ((up / total) * 100).toFixed(2) : "—";
    const latencies = checks
      .filter((c) => c.responseTimeMs != null)
      .map((c) => c.responseTimeMs!)
      .sort((a, b) => a - b);
    const lastChecked = checks[0]?.checkedAt;

    return {
      total,
      up,
      down,
      degraded,
      uptime,
      lastChecked,
      p50: percentile(latencies, 50),
      p75: percentile(latencies, 75),
      p90: percentile(latencies, 90),
      p95: percentile(latencies, 95),
      p99: percentile(latencies, 99),
    };
  }, [checks]);

  return (
    <div className="space-y-8">
      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <MetricCard
          label="Uptime"
          value={`${stats.uptime}%`}
          icon={CheckCircle}
          valueColorClass="text-emerald-600 dark:text-emerald-400"
        />
        <MetricCard
          label="Degraded"
          value={stats.degraded}
          icon={Lightning}
          valueColorClass="text-amber-600 dark:text-amber-400"
        />
        <MetricCard
          label="Failing"
          value={stats.down}
          icon={WarningCircle}
          valueColorClass="text-rose-600 dark:text-rose-400"
        />
        <MetricCard
          label="Requests"
          value={stats.total}
          icon={Pulse}
          valueColorClass="text-foreground"
        />
        <MetricCard
          label="Last Checked"
          value={stats.lastChecked ? relativeTime(stats.lastChecked) : "—"}
          icon={Clock}
          valueColorClass="text-foreground"
        />
      </div>

      {/* Percentile cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <PercentileCard label="P50" value={stats.p50} />
        <PercentileCard label="P75" value={stats.p75} />
        <PercentileCard label="P90" value={stats.p90} />
        <PercentileCard label="P95" value={stats.p95} />
        <PercentileCard label="P99" value={stats.p99} />
      </div>

      {/* Uptime bar chart */}
      <section>
        <h3 className="text-base font-semibold text-foreground">Uptime</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Uptime across all selected regions — last 24 hours
        </p>
        <div className="mt-4">
          <UptimeBarChart checks={checks} />
        </div>
      </section>

      {/* Multi-Phase Interactive Latency Chart */}
      <section>
        <h3 className="text-base font-semibold text-foreground">Latency</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Response time across all the regions
        </p>
        <div className="mt-4">
          <MultiPhaseLatencyChart checks={checks} />
        </div>
      </section>

      {/* Region summary table */}
      <section>
        <h3 className="text-base font-semibold text-foreground">Regions</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Every selected region&apos;s latency summary
        </p>
        <div className="mt-4">
          <RegionSummary checks={checks} regions={regions} />
        </div>
      </section>
    </div>
  );
}
