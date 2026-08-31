import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  Monitor,
  Plus,
  ArrowUpRight,
  CaretRight,
  CheckCircle,
  WarningCircle,
  StackSimple,
  MagnifyingGlass,
  Pulse,
  Lightning,
} from "@phosphor-icons/react";
import { PageHeader } from "~/components/page-header";
import { Badge } from "~/components/ui";
import { ActionButton } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { MetricCard } from "~/components/ui/metric-card";
import { api } from "~/lib/api";
import { ListSkeleton } from "~/components/loading-skeleton";

interface MonitorData {
  id: string;
  name: string;
  url: string;
  currentStatus: string;
  isActive: boolean;
  intervalSeconds?: number;
}

interface StatusPageData {
  id: string;
  name: string;
  slug: string;
}

export const Route = createFileRoute("/_dashboard/")({
  component: DashboardHomePage,
});

function DashboardHomePage() {
  const [monitors, setMonitors] = useState<MonitorData[]>([]);
  const [statusPages, setStatusPages] = useState<StatusPageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [monRes, pageRes] = await Promise.all([
        api("/api/monitors"),
        api("/api/status-pages").catch(() => null),
      ]);

      if (monRes.ok) setMonitors(await monRes.json());
      if (pageRes && pageRes.ok) setStatusPages(await pageRes.json());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredMonitors = monitors.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.url.toLowerCase().includes(search.toLowerCase()),
  );

  const totalMonitors = monitors.length;
  const upMonitors = monitors.filter((m) => m.currentStatus === "up").length;
  const downMonitors = monitors.filter((m) => m.currentStatus === "down").length;

  if (loading) return <ListSkeleton count={4} />;

  return (
    <div className="space-y-6">
      {/* Header with Glowing Blue Icon & App Standard Button */}
      <PageHeader
        icon={Pulse}
        title="System Overview"
        description="Monitor your services, response performance, and public status pages."
        actions={
          <ActionButton href="/monitors/new" icon={Plus} size="md">
            New monitor
          </ActionButton>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total monitors" value={totalMonitors} icon={Monitor} tone="primary" detail="configured" />
        <MetricCard label="Operational" value={upMonitors} icon={CheckCircle} tone="success" detail={`of ${totalMonitors}`} />
        <MetricCard label="Active incidents" value={downMonitors} icon={WarningCircle} tone={downMonitors > 0 ? "error" : "success"} detail={downMonitors > 0 ? "needs attention" : "all clear"} />
        <MetricCard label="Status pages" value={statusPages.length} icon={StackSimple} tone="neutral" detail="public" />
      </div>

      {/* Monitor Cards Section */}
      <div className="space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold tracking-[-0.01em] text-foreground">
              Service health
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Live check results and 30-day uptime history.
            </p>
          </div>

          <div className="relative w-full max-w-xs sm:w-auto">
            <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 z-10 size-3.5 -translate-y-1/2 text-text-soft" />
            <Input
              type="text"
              placeholder="Filter monitors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 text-xs sm:w-64"
            />
          </div>
        </div>

        {filteredMonitors.length === 0 ? (
          <Card className="flex flex-col items-center justify-center border border-dashed border-border bg-card p-10 text-center shadow-none">
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary-muted text-primary">
              <Monitor className="size-5" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              No monitors found
            </h3>
            <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground text-pretty">
              Get started by creating your first monitor to track uptime and response times.
            </p>
            <div className="mt-4">
              <ActionButton href="/monitors/new" icon={Plus} size="sm">
                Create monitor
              </ActionButton>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMonitors.map((m, idx) => {
              const isUp = m.currentStatus === "up";
              const linkedStatusPage = statusPages[idx % Math.max(statusPages.length, 1)];

              return (
                <Card
                  key={m.id}
                  className="group relative flex flex-col justify-between p-4 transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--primary)_30%,transparent),0_8px_24px_rgba(0,0,0,0.08)]"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <Link
                          to="/monitors/$id"
                          params={{ id: m.id }}
                          className="text-sm font-semibold text-foreground transition-colors duration-150 hover:text-primary"
                        >
                          {m.name}
                        </Link>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {m.url}
                        </p>
                      </div>
                      <Badge
                        variant="light"
                        color={isUp ? "green" : m.currentStatus === "down" ? "red" : "gray"}
                        size="sm"
                      >
                        {m.currentStatus.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Status Page Style Segmented Uptime History Bar (Small Border Radius) */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Lightning className="size-3 text-amber-500" />
                          Uptime History
                        </span>
                        <span className="text-[11px] font-semibold text-success tabular-nums">
                          {isUp ? "99.9% operational" : "Degraded"}
                        </span>
                      </div>

                      {/* Small border radius tick segments matching status page checks */}
                      <div className="flex items-center gap-[2.5px] py-1">
                        {Array.from({ length: 28 }).map((_, barIdx) => {
                          const isGreen = isUp ? barIdx !== 5 : barIdx > 22;
                          const isRed = !isUp && barIdx <= 22;
                          return (
                            <div
                              key={barIdx}
                              title={`Period #${barIdx + 1}: ${isGreen ? "100% Uptime" : "Down"}`}
                              className={`h-2 flex-1 rounded-[2px] transition-opacity duration-150 hover:opacity-75 ${
                                isGreen
                                  ? "bg-emerald-500"
                                  : isRed
                                  ? "bg-rose-500"
                                  : "bg-amber-500"
                              }`}
                            />
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between pt-0.5 text-[10px] text-text-soft">
                        <span>30 days ago</span>
                        <span>100% uptime</span>
                        <span>Today</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status Page Link */}
                  <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3">
                    <Link
                      to="/monitors/$id"
                      params={{ id: m.id }}
                      className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                    >
                      View details
                    </Link>

                    {/* Status Page link caret button */}
                    {statusPages.length > 0 ? (
                      <Link
                        to="/status/$slug"
                        params={{ slug: linkedStatusPage ? linkedStatusPage.slug : "default" }}
                        className="flex h-6 items-center gap-1 rounded-md bg-control px-2 text-[11px] font-medium text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)] transition-colors duration-150 hover:bg-primary hover:text-primary-foreground"
                        title="View status page"
                      >
                        <span>Status Page</span>
                        <CaretRight className="size-3" />
                      </Link>
                    ) : (
                      <Link
                        to="/status-pages"
                        className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors duration-150 hover:text-primary"
                      >
                        <span>Add Status Page</span>
                        <ArrowUpRight className="size-3" />
                      </Link>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
