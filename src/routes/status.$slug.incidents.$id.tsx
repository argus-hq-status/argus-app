import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { api } from "~/lib/api";
import { StatusPageLogo } from "~/components/status-page-logo";
import { IncidentUpdates, StatusBadge } from "../components/incident-updates";
import { MonitorCard } from "../components/monitor-card";
import { ArrowLeft, CaretDown, Megaphone, WarningOctagon, Wrench } from "@phosphor-icons/react";

export const Route = createFileRoute("/status/$slug/incidents/$id")({
  component: PublicIncidentPage,
});

type CheckData = {
  monitorId: string;
  status: string;
  checkedAt: string;
  responseTimeMs?: number | null;
};

type DailyHealth = {
  key: string;
  label: string;
  total: number;
  successCount: number;
  failedCount: number;
  successRate: number;
  isComplete: boolean;
  dayStatus: string;
  checks: string[];
};

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

function getIncidentTimeWindow(incident: any) {
  const startedAt = new Date(incident.scheduledStartAt ?? incident.startedAt);
  const endedAt = incident.scheduledEndAt
    ? new Date(incident.scheduledEndAt)
    : incident.resolvedAt
      ? new Date(incident.resolvedAt)
      : new Date();

  const windowStart = new Date(startedAt.getTime() - 24 * 60 * 60 * 1000);
  const windowEnd = new Date(endedAt.getTime() + 24 * 60 * 60 * 1000);

  return { startedAt, endedAt, windowStart, windowEnd };
}

function buildIncidentHealth(checks: CheckData[], windowStart: Date, windowEnd: Date): DailyHealth[] {
  const start = new Date(windowStart);
  start.setHours(0, 0, 0, 0);
  const end = new Date(windowEnd);
  end.setHours(0, 0, 0, 0);

  const days = Math.max(1, Math.min(14, Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1));
  const dayBuckets = new Map<string, CheckData[]>();

  for (const check of checks) {
    const checkedAt = new Date(check.checkedAt);
    const key = getDayKey(checkedAt);
    const bucket = dayBuckets.get(key) ?? [];
    bucket.push(check);
    dayBuckets.set(key, bucket);
  }

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = getDayKey(date);
    const dayChecks = dayBuckets.get(key) ?? [];
    const successCount = dayChecks.filter((check) => check.status === "up").length;
    const failedCount = dayChecks.filter((check) => check.status === "down").length;
    const total = dayChecks.length;
    const successRate = total > 0 ? (successCount / total) * 100 : 0;

    let dayStatus = "nodata";
    if (total > 0) {
      dayStatus = successRate >= 99 ? "up" : successRate >= 50 ? "degraded" : "down";
    }

    return {
      key,
      label: formatDayLabel(date),
      total,
      successCount,
      failedCount,
      successRate,
      isComplete: total > 0,
      dayStatus,
      checks: dayChecks.map((check) => check.status),
    };
  });
}

function getStatusAtIncident(checks: CheckData[], incidentStartedAt: Date, fallback: string) {
  if (checks.length === 0) return fallback;

  const sorted = [...checks].sort((a, b) => new Date(a.checkedAt).getTime() - new Date(b.checkedAt).getTime());
  const latestBeforeIncident = [...sorted].reverse().find((check) => new Date(check.checkedAt).getTime() <= incidentStartedAt.getTime());
  return latestBeforeIncident?.status ?? sorted[0]?.status ?? fallback;
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
    case "reported": return "User Reported";
    default: return "Service Incident";
  }
}

function PublicIncidentPage() {
  const { slug, id } = useParams({ from: "/status/$slug/incidents/$id" });
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [affectsOpen, setAffectsOpen] = useState(false);

  useEffect(() => {
    api(`/api/public/status/${slug}/incidents/${id}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [slug, id]);

  if (loading) return <div className="min-h-screen bg-[#0d1117] flex items-center justify-center"><p className="text-sm text-[#8b949e]">Loading...</p></div>;
  if (error || !data) return <div className="min-h-screen bg-[#0d1117] flex items-center justify-center"><p className="text-sm text-[#8b949e]">Incident not found.</p></div>;

  const { page, incident, updates = [], monitors = [], checks = [] } = data;
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
  const incType = incident.incidentType || "incident";
  const { startedAt, windowStart, windowEnd } = getIncidentTimeWindow(incident);

  return (
    <div className={`min-h-screen font-sans selection:bg-gray-700 pb-24 ${theme.root}`}> 
      {/* Top Nav */}
      <header className="flex items-center justify-between px-6 py-4 mx-auto max-w-5xl">
        <div className="flex items-center gap-4">
          <Link to="/status/$slug" params={{ slug }} className="hover:opacity-80 transition">
            <StatusPageLogo src={page.logoUrl} name={page.name} className="size-8" />
          </Link>
        </div>
        <nav className={`flex items-center gap-2 ${theme.headerBg}`}>
          <Link to="/status/$slug" params={{ slug }} className={`px-4 py-1.5 rounded-md text-sm font-medium ${theme.navActive}`}>Status</Link>
          <Link to="/status/$slug" params={{ slug }} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${theme.navMuted}`}>Maintenance</Link>
          <Link to="/status/$slug" params={{ slug }} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${theme.navMuted}`}>Previous incidents</Link>
        </nav>
        <div>
          <button className={`px-4 py-1.5 rounded-md border text-sm font-medium transition ${theme.button}`}>
            Get in touch
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link to="/status/$slug" params={{ slug }} className={`inline-flex items-center gap-2 text-sm transition mb-8 group ${isLight ? "text-gray-500 hover:text-gray-950" : "text-[#8b949e] hover:text-white"}`}>
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          Back to status page
        </Link>

        {/* Page Header */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h1 className={`text-3xl font-bold tracking-tight ${theme.heading}`}>{incident.title}</h1>
            <StatusBadge status={incident.status} />
          </div>

          <div className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-sm ${theme.muted}`}>
            <div className="flex items-center gap-2">
              <IncidentTypeIcon type={incType} />
              <span>{incidentTypeLabel(incType)}</span>
            </div>

            <div>
              Started {new Date(incident.startedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
            </div>

            {incident.scheduledStartAt && incident.scheduledEndAt && (
              <div className="text-blue-400">
                Scheduled for {new Date(incident.scheduledStartAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })} – {new Date(incident.scheduledEndAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* Affected monitors with incident-window graphs */}
          <section className={`rounded-xl border ${theme.card}`}> 
            <button
              type="button"
              onClick={() => setAffectsOpen((prev) => !prev)}
              className={isLight ? "flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition" : "flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[#21262d]/50 transition"}
              aria-expanded={affectsOpen}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className={`text-sm font-bold uppercase tracking-wider ${theme.heading}`}>Affects</h2>
                  <span className={isLight ? "rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-500" : "rounded-full border border-[#30363d] bg-[#0d1117] px-2 py-0.5 text-xs text-[#8b949e]"}> 
                    {monitors.length} {monitors.length === 1 ? "monitor" : "monitors"}
                  </span>
                </div>
                <p className={`mt-1 text-sm ${theme.muted}`}> 
                  Monitor state and response graph around the incident window.
                </p>
              </div>
              <CaretDown className={`size-4 shrink-0 text-[#8b949e] transition-transform ${affectsOpen ? "rotate-180" : ""}`} weight="bold" />
            </button>

            {affectsOpen && (
              <div className={`border-t p-5 ${theme.divider}`}> 
                {monitors.length === 0 ? (
                  <p className={`text-sm ${theme.muted}`}>No specific services were attached to this incident.</p>
                ) : (
                  <div className="space-y-6">
                    {monitors.map((monitor: any) => {
                      const monitorChecks = (checks as CheckData[]).filter((check) => check.monitorId === monitor.id);
                      const dailyHealth = buildIncidentHealth(monitorChecks, windowStart, windowEnd);
                      const daysWithData = dailyHealth.filter((day) => day.isComplete);
                      const avgUptime = daysWithData.reduce((sum, day) => sum + day.successRate, 0);
                      const avgPct = daysWithData.length > 0 ? avgUptime / daysWithData.length : 100;
                      const statusAtIncident = getStatusAtIncident(monitorChecks, startedAt, monitor.currentStatus);

                      return (
                        <MonitorCard
                          key={monitor.id}
                          name={monitor.name}
                          url={monitor.url}
                          status={statusAtIncident}
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
            )}
          </section>

          {/* Timeline updates */}
          <section>
            <h2 className={`text-sm font-bold uppercase tracking-wider mb-6 ${theme.heading}`}>Updates</h2>
            <div className={`rounded-xl border p-6 ${theme.card}`}> 
              {updates.length === 0 ? (
                <p className={`text-sm ${theme.muted}`}>No updates have been posted yet.</p>
              ) : (
                <IncidentUpdates updates={updates} iconOnly showLegend theme={pageTheme} />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
