import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { MonitorCard } from "../components/monitor-card";
import { IncidentUpdates } from "../components/incident-updates";

const DAYS_TO_SHOW = 30;

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
    const successRate = total > 0 ? Math.round((successCount / total) * 100) : 0;
    return {
      key, date, label: formatDayLabel(date),
      total, successCount, failedCount, successRate,
      isComplete: total > 0,
      checks: dayChecks.map((c) => c.status),
    };
  });
}

export const Route = createFileRoute("/status/$slug")({
  component: PublicStatusPage,
});

function PublicStatusPage() {
  const { slug } = useParams({ from: "/status/$slug" });
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/public/status/${slug}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-sm text-gray-400">Loading...</p></div>;
  if (error || !data) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-sm text-gray-400">Status page not found.</p></div>;

  const { page, monitors, checks, incidents, incidentUpdates: incidentUpdatesMap } = data;

  const monitorsList = monitors ?? [];
  const checksList = checks ?? [];
  const incidentsList = incidents ?? [];
  const updatesMap: Record<string, any[]> = incidentUpdatesMap ?? {};

  const dailyHealthByMonitor = new Map<string, ReturnType<typeof buildDailyHealth>>();
  for (const monitor of monitorsList) {
    const monitorChecks = checksList.filter((c: any) => c.monitorId === monitor.id);
    dailyHealthByMonitor.set(monitor.id, buildDailyHealth(monitorChecks));
  }

  const allHealthy = monitorsList.every((m: any) => m.currentStatus === "up");
  const activeIncidents = incidentsList.filter((inc: any) => inc.status !== "resolved");

  const BORDER_COLORS: Record<string, string> = { investigating: "border-l-red-500", identified: "border-l-amber-500" };
  const BG_COLORS: Record<string, string> = { investigating: "bg-red-50", identified: "bg-amber-50" };
  const TEXT_COLORS: Record<string, string> = { investigating: "text-red-700", identified: "text-amber-700" };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <img src={page.logoUrl || "/images/logo.svg"} alt="" className="mb-5 h-10 rounded-xl" />
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{page.name}</h1>
              <p className="mt-1.5 text-sm text-gray-500">Current status of all monitored services.</p>
            </div>
            <OverallStatusBadge status={allHealthy ? "up" : "down"} />
          </div>
        </div>

        {activeIncidents.length > 0 && (
          <div className="mt-8 space-y-3">
            {activeIncidents.map((inc: any) => {
              const updates = updatesMap[inc.id] ?? [];
              return (
                <div key={inc.id} className={`rounded-xl border border-l-4 ${BORDER_COLORS[inc.status] ?? "border-l-red-500"} border-gray-200 bg-white p-5 shadow-sm`}>
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${BG_COLORS[inc.status] ?? "bg-red-50"}`}>
                      <span className={`text-sm font-bold ${TEXT_COLORS[inc.status] ?? "text-red-700"}`}>!</span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-gray-900">{inc.title}</span>
                        <span className={`inline-flex items-center rounded-full ${BG_COLORS[inc.status] ?? "bg-red-50"} px-2 py-0.5 text-xs font-medium ${TEXT_COLORS[inc.status] ?? "text-red-700"}`}>
                          {inc.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(inc.startedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                      </p>
                      {updates.length > 0 && <p className="mt-2 text-sm text-gray-700">{updates[0].message}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Services</h2>
          {monitorsList.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-400">
              No monitors configured for this page.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {monitorsList.map((monitor: any) => {
                const dailyHealth = dailyHealthByMonitor.get(monitor.id) ?? [];
                const daysWithData = dailyHealth.filter((d: any) => d.isComplete);
                const avgUptime = daysWithData.reduce((sum: number, d: any) => sum + d.successRate, 0);
                const avgPct = daysWithData.length > 0 ? Math.round(avgUptime / daysWithData.length) : 0;
                return (
                  <MonitorCard
                    key={monitor.id}
                    name={monitor.name}
                    url={monitor.url}
                    status={monitor.currentStatus}
                    avgPct={avgPct}
                    daysTracked={daysWithData.length}
                    dailyHealth={daysWithData}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900">Incident History</h2>
          {incidentsList.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-400">
              No incidents reported in the last 30 days.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {incidentsList.map((inc: any) => {
                const updates = updatesMap[inc.id] ?? [];
                return (
                  <div key={inc.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-block size-2 shrink-0 rounded-full ${
                            inc.status === "resolved" ? "bg-green-500" :
                            inc.status === "investigating" ? "bg-orange-500" :
                            inc.status === "identified" ? "bg-blue-500" : "bg-gray-400"
                          }`} />
                          <span className="font-medium text-gray-900">{inc.title}</span>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            inc.status === "resolved" ? "bg-green-50 text-green-700" :
                            inc.status === "investigating" ? "bg-orange-50 text-orange-700" :
                            inc.status === "identified" ? "bg-blue-50 text-blue-700" : "bg-gray-50 text-gray-600"
                          }`}>{inc.status}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-400">
                          {new Date(inc.startedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          {inc.resolvedAt && <> &rarr; {new Date(inc.resolvedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</>}
                        </p>
                      </div>
                    </div>
                    {updates.length > 0 && (
                      <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                        <IncidentUpdates updates={updates} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <SubscribeSection statusPageId={page.id} />
      </div>
    </div>
  );
}

function OverallStatusBadge({ status }: { status: string }) {
  if (status === "up") {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-1.5 text-sm font-semibold text-green-700 ring-1 ring-green-200">
        <span className="size-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
        All Operational
      </div>
    );
  }
  if (status === "down") {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-700 ring-1 ring-red-200">
        <span className="size-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
        Degraded Performance
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-1.5 text-sm font-semibold text-orange-700 ring-1 ring-orange-200">
      <span className="size-2 rounded-full bg-orange-400" />
      Pending Checks
    </div>
  );
}

function SubscribeSection({ statusPageId }: { statusPageId: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch(`/api/public/status/${statusPageId}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) { setSubscribed(true); setEmail(""); setMessage("You're subscribed!"); }
    else { setMessage(data.message ?? "Something went wrong."); }
  }

  return (
    <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h3 className="text-base font-semibold text-gray-900">Get notified</h3>
      <p className="mt-1 text-sm text-gray-500">Receive email updates when service status changes.</p>
      <div className="mt-4">
        {subscribed ? (
          <p className="text-sm font-medium text-green-600">You're subscribed! We'll notify you of any status changes.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required
              className="h-10 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-300 focus:ring-2 focus:ring-gray-200" />
            <button type="submit"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800">
              Subscribe
            </button>
            {message && <p className="text-sm text-gray-500 sm:ml-2">{message}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
