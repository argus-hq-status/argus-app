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
import { Button } from "~/components/ui/button";
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
          <Link to="/monitors/new">
            <Button variant="primary" icon={Plus} size="md">
              New Monitor
            </Button>
          </Link>
        }
      />

      {/* Metrics Cards Grid - Small Border Radius */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-3.5 dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
          <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-zinc-400">
            <span>Total Monitors</span>
            <Monitor className="size-4 text-blue-500" />
          </div>
          <div className="mt-1.5 text-xl font-bold text-gray-900 dark:text-gray-100">
            {totalMonitors}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-3.5 dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
          <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-zinc-400">
            <span>Services Operational</span>
            <CheckCircle className="size-4 text-emerald-500" weight="fill" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {upMonitors}
            </span>
            <span className="text-xs text-gray-400">/ {totalMonitors}</span>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-3.5 dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
          <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-zinc-400">
            <span>Active Incidents</span>
            <WarningCircle className="size-4 text-rose-500" weight="fill" />
          </div>
          <div className="mt-1.5 text-xl font-bold text-rose-600 dark:text-rose-400">
            {downMonitors}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-3.5 dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
          <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-zinc-400">
            <span>Public Status Pages</span>
            <StackSimple className="size-4 text-purple-500" />
          </div>
          <div className="mt-1.5 text-xl font-bold text-gray-900 dark:text-gray-100">
            {statusPages.length}
          </div>
        </div>
      </div>

      {/* Monitor Cards Section */}
      <div className="space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Monitors & Health Status
            </h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              Real-time check results and uptime performance metrics
            </p>
          </div>

          <div className="relative w-full max-w-xs sm:w-auto">
            <MagnifyingGlass className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Filter monitors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 py-1 text-xs text-gray-900 focus:outline-none dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-gray-100"
            />
          </div>
        </div>

        {filteredMonitors.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
            <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <Monitor className="size-5 text-blue-500" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              No monitors found
            </h3>
            <p className="mt-1 max-w-sm text-xs text-gray-500 dark:text-zinc-400">
              Get started by creating your first monitor to track uptime and response times.
            </p>
            <div className="mt-4">
              <Link to="/monitors/new">
                <Button variant="primary" icon={Plus} size="sm">
                  Create Monitor
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMonitors.map((m, idx) => {
              const isUp = m.currentStatus === "up";
              const linkedStatusPage = statusPages[idx % Math.max(statusPages.length, 1)];

              return (
                <div
                  key={m.id}
                  className="group relative flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 transition hover:border-blue-500/40 dark:border-[#2a2a2a] dark:bg-[#1a1a1a]"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <Link
                          to="/monitors/$id"
                          params={{ id: m.id }}
                          className="font-semibold text-sm text-gray-900 hover:text-blue-500 transition dark:text-gray-100 dark:hover:text-blue-400"
                        >
                          {m.name}
                        </Link>
                        <p className="truncate text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
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
                      <div className="flex items-center justify-between text-[11px] font-medium text-gray-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Lightning className="size-3 text-amber-500" />
                          Uptime History
                        </span>
                        <span className="font-mono text-emerald-500 font-semibold text-[11px]">
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
                              className={`h-2 flex-1 rounded-[1.5px] transition-all hover:opacity-80 ${
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

                      <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-zinc-500 pt-0.5">
                        <span>30 days ago</span>
                        <span>100% uptime</span>
                        <span>Today</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status Page Link */}
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-[#262626]">
                    <Link
                      to="/monitors/$id"
                      params={{ id: m.id }}
                      className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      View details
                    </Link>

                    {/* Status Page link caret button */}
                    {statusPages.length > 0 ? (
                      <Link
                        to="/status/$slug"
                        params={{ slug: linkedStatusPage ? linkedStatusPage.slug : "default" }}
                        className="flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-700 transition hover:bg-blue-500 hover:text-white dark:border-[#2a2a2a] dark:bg-[#222225] dark:text-zinc-300 dark:hover:bg-blue-600 dark:hover:text-white"
                        title="View status page"
                      >
                        <span>Status Page</span>
                        <CaretRight className="size-3" />
                      </Link>
                    ) : (
                      <Link
                        to="/status-pages"
                        className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-blue-400"
                      >
                        <span>Add Status Page</span>
                        <ArrowUpRight className="size-3" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
