import { createFileRoute, useParams, Link, redirect } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { WarningCircle } from "@phosphor-icons/react";
import { Badge } from "~/components/ui";
import { Card } from "~/components/ui/card";
import { LogViewer } from "~/components/log-viewer";
import { api } from "~/lib/api";
import { ListSkeleton } from "~/components/loading-skeleton";

interface MonitorData {
  id: string;
  name: string;
  url: string;
  currentStatus: string;
  method: string;
  expectedStatus: number;
  intervalSeconds: number;
  regions: string[];
  consecutiveFails: number;
  isActive: boolean;
}

interface CheckData {
  id: string;
  status: string;
  region: string;
  responseTimeMs: number | null;
  statusCode: number | null;
  checkedAt: string;
}

interface IncidentData {
  id: string;
  title: string;
  status: string;
  monitorId?: string;
  isAutomatic: boolean;
  startedAt: string;
  resolvedAt: string | null;
}

const statCardClass = "rounded-xl border border-gray-200 bg-white p-4 dark:border-[#2a2a2a] dark:bg-[#1a1a1a]";
const listCardClass = "rounded-xl border border-gray-200 bg-white px-4 py-3 transition hover:border-gray-300 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:hover:border-gray-600";

export const Route = createFileRoute("/_dashboard/monitors/$id")({
  beforeLoad: ({ params }) => {
    if (params.id === "new") {
      throw redirect({ to: "/monitors/new" });
    }
  },
  component: MonitorDetailPage,
});
function MonitorDetailPage() {
  const params = useParams({ from: "/_dashboard/monitors/$id" });
  const [monitor, setMonitor] = useState<MonitorData | null>(null);
  const [checks, setChecks] = useState<CheckData[]>([]);
  const [incidents, setIncidents] = useState<IncidentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [monRes, checksRes, incRes] = await Promise.all([
        api(`/api/monitors/${params.id}`),
        api(`/api/monitors/${params.id}/checks`),
        api(`/api/incidents`),
      ]);
      if (!monRes.ok) throw new Error("Not found");
      setMonitor(await monRes.json());
      setChecks(await checksRes.json());
      const allIncidents: IncidentData[] = await incRes.json();
      setIncidents(allIncidents.filter((i) => i.monitorId === params.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <ListSkeleton count={6} />;
  if (error || !monitor) {
    return (
      <Card className="flex flex-col items-center gap-3 px-6 py-12">
        <WarningCircle className="size-8 text-error" weight="regular" />
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{error ?? "Not found"}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-medium tracking-tight text-gray-900 dark:text-gray-50">
        {monitor.name}
      </h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { label: "Method", value: monitor.method },
          { label: "Expected Status", value: String(monitor.expectedStatus) },
          { label: "Interval", value: `${monitor.intervalSeconds}s` },
          { label: "Regions", value: monitor.regions.join(", ") },
          { label: "Consecutive Fails", value: String(monitor.consecutiveFails) },
          { label: "Active", value: monitor.isActive ? "Yes" : "No" },
        ].map(({ label, value }) => (
          <div key={label} className={statCardClass}>
            <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</p>
            <p className="mt-1 font-mono text-sm font-medium text-gray-900 dark:text-gray-50">{value}</p>
          </div>
        ))}
      </div>
      {incidents.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-50">Incidents</h2>
          <div className="space-y-2">
            {incidents.map((inc) => (
              <Link
                key={inc.id}
                to="/incidents/$id"
                params={{ id: inc.id }}
                className={`block ${listCardClass}`}
              >
                <div className="flex items-center gap-2">
                  <WarningCircle className="size-4 text-warning" weight="regular" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-50">{inc.title}</span>
                  <Badge variant="light" color={inc.status === "resolved" ? "green" : "orange"} size="sm">{inc.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(inc.startedAt).toLocaleString()}
                  {inc.resolvedAt && <> &mdash; resolved {new Date(inc.resolvedAt).toLocaleString()}</>}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Check logs
        </h2>
        <LogViewer entries={checks} />
      </section>    </div>
  );
}
