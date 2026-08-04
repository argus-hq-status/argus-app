import { createFileRoute, useParams, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { api } from "~/lib/api";
import { StatusPageLogo } from "~/components/status-page-logo";
import { MonitorCard } from "../components/monitor-card";
import { StatusBadge } from "../components/incident-updates";
import {
  CheckCircle, XCircle, Warning, CaretLeft, CaretRight,
  Wrench, WarningOctagon, Megaphone,
} from "@phosphor-icons/react";

const DAYS_TO_SHOW = 90;

function getDayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short", month: "short", day: "numeric",
  }).format(date);
}

function buildDailyHealth(checks: { monitorId: string; status: string; checkedAt: string }[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayBuckets = new Map<string, { monitorId: string; status: string; checkedAt: Date }[]>();
  for (const check of checks) {
    const checkedAt = new Date(check.checkedAt);
    const key = getDayKey(checkedAt);
    const bucket = dayBuckets.get(key) ?? [];
    bucket.push({ ...check, checkedAt });
    dayBuckets.set(key, bucket);
  }

  return Array.from({ length: DAYS_TO_SHOW }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (DAYS_TO_SHOW - 1 - index));
    const key = getDayKey(date);
    const dayChecks = dayBuckets.get(key) ?? [];
    const successCount = dayChecks.filter((c) => c.status === "up").length;
    const failedCount = dayChecks.filter((c) => c.status === "down").length;
    const total = dayChecks.length;
    const successRate = total > 0 ? (successCount / total) * 100 : 0;

    let dayStatus = "nodata";
    if (total > 0) {
      dayStatus = successRate >= 99 ? "up" : successRate >= 50 ? "degraded" : "down";
    }

    return {
      key, date, label: formatDayLabel(date),
      total, successCount, failedCount, successRate,
      isComplete: total > 0,
      dayStatus,
      checks: dayChecks.map((c) => c.status),
    };
  });
}

function IncidentTypeIcon({ type, className = "size-4" }: { type: string; className?: string }) {
  switch (type) {
    case "scheduled":
      return <Wrench weight="fill" className={`${className} text-blue-400`} />;
    case "reported":
      return <Megaphone weight="fill" className={`${className} text-[#d29922]`} />;
    default:
      return <WarningOctagon weight="fill" className={`${className} text-[#f85149]`} />;
  }
}

function incidentTypeLabel(type: string) {
  switch (type) {
    case "scheduled": return "Scheduled Maintenance";
    case "reported": return "Reported Issue";
    default: return "Incident";
  }
}

export const Route = createFileRoute("/status/$slug")({
  component: PublicStatusRoute,
});

function PublicStatusRoute() {
  const isIncidentDetailRoute = useRouterState({
    select: (state) => state.matches.some((match) => match.routeId === "/status/$slug/incidents/$id"),
  });

  if (isIncidentDetailRoute) {
    return <Outlet />;
  }

  return <PublicStatusPage />;
}

function PublicStatusPage() {
  const { slug } = useParams({ from: "/status/$slug" });
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Timeline pagination state
  const [pageIndex, setPageIndex] = useState(0);
  const monthsPerPage = 2;

  useEffect(() => {
    api(`/api/public/status/${slug}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-[#0d1117] flex items-center justify-center"><p className="text-sm text-[#8b949e]">Loading...</p></div>;
  if (error || !data) return <div className="min-h-screen bg-[#0d1117] flex items-center justify-center"><p className="text-sm text-[#8b949e]">Status page not found.</p></div>;

  const { page, monitors, checks, incidents, incidentUpdates: incidentUpdatesMap } = data;
  const pageTheme: "light" | "dark" = page.defaultTheme === "light" ? "light" : "dark";
  const isLight = pageTheme === "light";
  const theme = {
    root: isLight ? "bg-gray-50 text-gray-700" : "bg-[#0d1117] text-gray-300",
    headerBg: isLight ? "bg-gray-50" : "bg-[#0d1117]",
    heading: isLight ? "text-gray-950" : "text-white",
    muted: isLight ? "text-gray-500" : "text-[#8b949e]",
    card: isLight ? "border-gray-200 bg-white" : "border-[#30363d] bg-[#161b22]",
    divider: isLight ? "border-gray-200" : "border-[#30363d]",
    navActive: isLight ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200" : "bg-[#21262d] text-gray-200",
    navMuted: isLight ? "text-gray-500 hover:text-gray-900" : "text-[#8b949e] hover:text-gray-200",
    button: isLight ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-100" : "bg-[#21262d] border-[#30363d] text-gray-200 hover:bg-[#30363d]",
  };

  const monitorsList = monitors ?? [];
  const checksList = checks ?? [];
  const incidentsList = incidents ?? [];
  const updatesMap: Record<string, any[]> = incidentUpdatesMap ?? {};
  const activeIncidents = incidentsList.filter((inc: any) => inc.incidentType !== "scheduled" && inc.status !== "resolved" && inc.status !== "completed");
  const maintenanceEntries = incidentsList.filter((inc: any) => inc.incidentType === "scheduled");
  const activeMaintenance = maintenanceEntries.filter((inc: any) => inc.status !== "completed");

  const dailyHealthByMonitor = new Map<string, ReturnType<typeof buildDailyHealth>>();
  for (const monitor of monitorsList) {
    const monitorChecks = checksList.filter((c: any) => c.monitorId === monitor.id);
    dailyHealthByMonitor.set(monitor.id, buildDailyHealth(monitorChecks));
  }

  const allHealthy = monitorsList.every((m: any) => m.currentStatus === "up");
  const allDown = monitorsList.length > 0 && monitorsList.every((m: any) => m.currentStatus === "down");

  let heroIcon = <CheckCircle weight="fill" className="size-8 text-[#238636]" />;
  let heroBg = "bg-[#1e2a22]";
  let heroText = "All services are online";

  if (monitorsList.length > 0) {
    if (allDown) {
      heroIcon = <XCircle weight="fill" className="size-8 text-[#f85149]" />;
      heroBg = "bg-[#f85149]/20";
      heroText = "All services are down";
    } else if (!allHealthy || activeIncidents.length > 0 || activeMaintenance.length > 0) {
      heroIcon = <Warning weight="fill" className="size-8 text-[#d29922]" />;
      heroBg = "bg-[#d29922]/20";
      heroText = "Some services are degraded";
    }
  }

  // Generate 12 months history
  const allMonths = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return {
      label: d.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      year: d.getFullYear(),
      month: d.getMonth()
    };
  });

  const displayedMonths = allMonths.slice(pageIndex * monthsPerPage, (pageIndex + 1) * monthsPerPage);
  const canGoBack = pageIndex < Math.floor((allMonths.length - 1) / monthsPerPage);
  const canGoForward = pageIndex > 0;

  // Group incidents by month key
  const incidentsByMonth: Record<string, any[]> = {};
  for (const inc of incidentsList) {
    const started = new Date(inc.startedAt);
    const key = `${started.getFullYear()}-${String(started.getMonth() + 1).padStart(2, '0')}`;
    if (!incidentsByMonth[key]) incidentsByMonth[key] = [];
    incidentsByMonth[key].push(inc);
  }

  // Format the current date/time for the header
  const now = new Date();
  const lastUpdatedFormatted = new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric"
  }).format(now);

  return (
    <div id="top" className={`min-h-screen font-sans selection:bg-gray-700 ${theme.root}`}> 
      {/* Top Nav */}
      <header className="flex items-center justify-between px-6 py-4 mx-auto max-w-5xl">
        <div className="flex items-center gap-4">
          <StatusPageLogo src={page.logoUrl} name={page.name} className="size-8" />
        </div>
        <nav className={`flex items-center gap-2 ${theme.headerBg}`}>
          <a href="#incidents" className={`px-4 py-1.5 rounded-md text-sm font-medium ${theme.navActive}`}>Status</a>
          <a href="#maintenance" className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${theme.navMuted}`}>Maintenance</a>
          <a href="#history" className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${theme.navMuted}`}>Previous incidents</a>
        </nav>
        <div>
          <button className={`px-4 py-1.5 rounded-md border text-sm font-medium transition ${theme.button}`}>
            Get in touch
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-16 mt-8">
          <div className={`mb-6 flex size-14 items-center justify-center rounded-full ${heroBg}`}>
            {heroIcon}
          </div>
          <h1 className={`text-4xl font-bold tracking-tight mb-3 ${theme.heading}`}> 
            {heroText}
          </h1>
          <p className={`text-sm font-medium ${theme.muted}`}> 
            Last updated on {lastUpdatedFormatted}
          </p>
        </div>

        {/* Incidents */}
        {activeIncidents.length > 0 && (
          <div id="incidents" className="mb-10 space-y-4 scroll-mt-8">
            {activeIncidents.map((inc: any) => {
              const updates = updatesMap[inc.id] ?? [];
              const incType = inc.incidentType || "incident";
              return (
                <Link
                  key={inc.id}
                  to="/status/$slug/incidents/$id"
	                  params={{ slug, id: inc.id }}
	                  className="block rounded-xl border border-red-500/30 bg-red-950/20 p-5 shadow-sm hover:border-red-500/50 transition group"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-red-500/20">
                      <IncidentTypeIcon type={incType} className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-white group-hover:text-blue-400 transition">{inc.title}</span>
                        <StatusBadge status={inc.status} />
                        {incType !== "incident" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#21262d] border border-[#30363d] px-2 py-0.5 text-xs font-medium text-[#8b949e]">
                            <IncidentTypeIcon type={incType} className="size-3" />
                            {incidentTypeLabel(incType)}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-[#8b949e]">
                        {new Date(inc.startedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                      </p>
                      {inc.scheduledStartAt && inc.scheduledEndAt && (
                        <p className="mt-1 text-xs text-[#8b949e]">
                          Scheduled for {new Date(inc.scheduledStartAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })} – {new Date(inc.scheduledEndAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        </p>
                      )}
                      {updates.length > 0 && <p className="mt-2 text-sm text-gray-300">{updates[0].message}</p>}
                    </div>
                    <CaretRight weight="bold" className="size-5 text-[#8b949e] group-hover:text-white transition shrink-0 mt-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Maintenance */}
        {maintenanceEntries.length > 0 && (
          <div id="maintenance" className="mb-16 scroll-mt-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className={`text-2xl font-bold ${theme.heading}`}>Maintenance</h2>
              <div className={`text-sm ${theme.muted}`}>Scheduled work and planned updates</div>
            </div>

            <div className="space-y-4">
              {maintenanceEntries.map((inc: any) => {
                const updates = updatesMap[inc.id] ?? [];
                const incType = inc.incidentType || "scheduled";
                return (
                  <Link
                    key={inc.id}
                    to="/status/$slug/incidents/$id"
	                  params={{ slug, id: inc.id }}
	                  className="block rounded-xl border border-blue-500/25 bg-blue-950/15 p-5 shadow-sm hover:border-blue-500/45 transition group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                        <IncidentTypeIcon type={incType} className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-white group-hover:text-blue-400 transition">{inc.title}</span>
                          <StatusBadge status={inc.status} />
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#21262d] border border-[#30363d] px-2 py-0.5 text-xs font-medium text-[#8b949e]">
                            <IncidentTypeIcon type={incType} className="size-3" />
                            {incidentTypeLabel(incType)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[#8b949e]">
                          {new Date(inc.startedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                        </p>
                        {inc.scheduledStartAt && inc.scheduledEndAt && (
                          <p className="mt-1 text-xs text-[#8b949e]">
                            Scheduled for {new Date(inc.scheduledStartAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })} – {new Date(inc.scheduledEndAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                          </p>
                        )}
                        {updates.length > 0 && <p className="mt-2 text-sm text-gray-300">{updates[0].message}</p>}
                      </div>
                      <CaretRight weight="bold" className="size-5 text-[#8b949e] group-hover:text-white transition shrink-0 mt-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Services Section */}
        <div className={`rounded-xl border overflow-hidden ${theme.card}`}> 
          <div className={`flex items-center justify-between p-5 border-b ${theme.divider}`}> 
            <h2 className={`text-base font-semibold ${theme.heading}`}>Services</h2>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#238636]/30 bg-[#238636]/10 px-3 py-1 text-xs font-medium text-[#2ea043]">
              <CheckCircle weight="fill" className="size-4" />
              Operational
            </div>
          </div>

          <div className="p-4 space-y-6">
            {monitorsList.length === 0 ? (
              <p className={`py-10 text-center text-sm ${theme.muted}`}> 
                No monitors configured for this page.
              </p>
            ) : (
              <div className="flex flex-col gap-6">
                {monitorsList.map((monitor: any) => {
                  const monitorChecks = checksList.filter((c: any) => c.monitorId === monitor.id);
                  const dailyHealth = dailyHealthByMonitor.get(monitor.id) ?? [];
                  const daysWithData = dailyHealth.filter((d: any) => d.isComplete);
                  const avgUptime = daysWithData.reduce((sum: number, d: any) => sum + d.successRate, 0);
                  const avgPct = daysWithData.length > 0 ? (avgUptime / daysWithData.length) : 100;
                  return (
                    <MonitorCard
                      key={monitor.id}
                      name={monitor.name}
                      url={monitor.url}
                      status={monitor.currentStatus}
                      avgPct={Number(avgPct.toFixed(3))}
                      daysTracked={daysWithData.length}
                      dailyHealth={dailyHealth}
                      recentChecks={monitorChecks}
                      theme={pageTheme}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Previous Incidents */}
        <div id="history" className="mt-16 scroll-mt-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-2xl font-bold ${theme.heading}`}>Previous incidents</h2>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 text-sm font-medium ${theme.muted}`}>
                <button
                  onClick={() => setPageIndex(p => p + 1)}
                  disabled={!canGoBack}
                  className={isLight ? "flex size-7 items-center justify-center rounded-full bg-white ring-1 ring-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition" : "flex size-7 items-center justify-center rounded-full bg-[#21262d] hover:bg-[#30363d] disabled:opacity-30 disabled:cursor-not-allowed transition"}
                >
                  <CaretLeft weight="bold" className="size-3.5" />
                </button>
                <span className="min-w-45 text-center text-xs">
                  {displayedMonths.length > 1
                    ? `${displayedMonths[displayedMonths.length - 1].label} – ${displayedMonths[0].label}`
                    : displayedMonths[0]?.label}
                </span>
                <button
                  onClick={() => setPageIndex(p => p - 1)}
                  disabled={!canGoForward}
                  className={isLight ? "flex size-7 items-center justify-center rounded-full bg-white ring-1 ring-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition" : "flex size-7 items-center justify-center rounded-full bg-[#21262d] hover:bg-[#30363d] disabled:opacity-30 disabled:cursor-not-allowed transition"}
                >
                  <CaretRight weight="bold" className="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {displayedMonths.map(month => {
              const monthIncidents = incidentsByMonth[month.key] ?? [];

              return (
                <div key={month.key} className={`rounded-xl border p-6 ${theme.card}`}>
                  <h3 className={`text-sm font-bold mb-6 ${theme.heading}`}>{month.label}</h3>

                  {monthIncidents.length === 0 ? (
                    <div className="flex items-center justify-center py-4">
                      <p className={`flex items-center gap-2 text-sm font-medium ${theme.muted}`}> 
                        <CheckCircle weight="fill" className="size-4 text-[#238636]" />
                        No incidents reported
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-0">
                      {monthIncidents.map((inc: any, idx: number) => {
                        const updates = updatesMap[inc.id] ?? [];
                        const incType = inc.incidentType || "incident";
                        const isLast = idx === monthIncidents.length - 1;
                        return (
                          <Link
                            key={inc.id}
                            to="/status/$slug/incidents/$id"
	                            params={{ slug, id: inc.id }}
	className={`flex items-start gap-4 p-4 -mx-2 rounded-lg transition group ${isLight ? "hover:bg-gray-50" : "hover:bg-[#21262d]/60"} ${!isLast ? isLight ? 'border-b border-gray-200' : 'border-b border-[#30363d]/40' : ''}`}
                          >
                            {/* Type icon */}
                            <div className={isLight ? "flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100 mt-0.5" : "flex size-8 shrink-0 items-center justify-center rounded-full bg-[#21262d] mt-0.5"}> 
                              <IncidentTypeIcon type={incType} className="size-4" />
                            </div>
                            {/* Content */}
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className={`font-semibold text-sm transition group-hover:text-[#58a6ff] ${theme.heading}`}>{inc.title}</span>
                                <StatusBadge status={inc.status} />
                                {incType !== "incident" && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#8b949e] uppercase tracking-wider">
                                    {incidentTypeLabel(incType)}
                                  </span>
                                )}
                              </div>
                              <p className={`text-xs ${theme.muted}`}> 
                                {new Date(inc.startedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                                {inc.scheduledStartAt && inc.scheduledEndAt && (
                                  <span className="ml-2">
                                    · Scheduled {new Date(inc.scheduledStartAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} – {new Date(inc.scheduledEndAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                                  </span>
                                )}
                              </p>
                              {updates.length > 0 && (
                                <p className={isLight ? "mt-1.5 text-xs text-gray-500 line-clamp-2" : "mt-1.5 text-xs text-gray-400 line-clamp-2"}>{updates[0].message}</p>
                              )}
                            </div>
                            {/* Arrow */}
                            <CaretRight weight="bold" className="size-4 text-[#8b949e] group-hover:text-white transition shrink-0 mt-1.5" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-[#30363d] py-6 text-center text-xs text-[#8b949e] flex justify-center items-center gap-8">
        <div>powered by <span className="text-white font-medium">Strauz</span></div>
        <div className="flex items-center gap-1">
          <span className="size-3 rounded-full border border-[#8b949e] flex items-center justify-center text-[8px]">L</span>
          Atlantic/Reykjavik
        </div>
      </footer>
    </div>
  );
}
