import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { WarningCircle } from "@phosphor-icons/react";
import { Badge } from "~/components/ui";
import { useSetHeader } from "~/components/layout-context";
import { api } from "~/lib/api";
import { ListSkeleton } from "~/components/loading-skeleton";
import { MonitorLight } from "../components/monitor-icons";

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

export const Route = createFileRoute("/_dashboard/monitors/$id")({
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
        api(\`/api/monitors/${params.id}`),
        api(\`/api/monitors/${params.id}/checks`),
        api(\`/api/incidents`),
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

  useSetHeader({
    title: monitor?.name ?? "Monitor",
    breadcrumb: [
      { label: "Monitors", href: "/monitors" },
      { label: monitor?.name ?? "Loading..." },
    ],
  });

  if (loading) return <ListSkeleton count={6} />;
  if (error || !monitor) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-stroke-soft bg-bg-white px-6 py-12">
        <WarningCircle className="size-8 text-error" weight="regular" />
        <p className="text-sm font-medium text-text-strong">{error ?? "Not found"}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { label: "Method", value: monitor.method },
          { label: "Expected Status", value: String(monitor.expectedStatus) },
          { label: "Interval", value: `${monitor.intervalSeconds}s` },
          { label: "Regions", value: monitor.regions.join(", ") },
          { label: "Consecutive Fails", value: String(monitor.consecutiveFails) },
          { label: "Active", value: monitor.isActive ? "Yes" : "No" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-stroke-soft bg-bg-white p-4">
            <p className="text-xs text-text-soft">{label}</p>
            <p className="mt-0.5 text-sm font-medium text-text-strong">{value}</p>
          </div>
        ))}
      </div>

      {incidents.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-medium text-text-strong">Incidents</h2>
          <div className="space-y-2">
            {incidents.map((inc) => (
              <div key={inc.id} className="rounded-lg border border-stroke-soft bg-bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <WarningCircle className="size-4 text-warning" weight="regular" />
                  <span className="text-sm font-medium text-text-strong">{inc.title}</span>
                  <Badge variant="light" color={inc.status === "resolved" ? "green" : "orange"} size="sm">{inc.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-text-sub">
                  {new Date(inc.startedAt).toLocaleString()}
                  {inc.resolvedAt && <> &mdash; resolved {new Date(inc.resolvedAt).toLocaleString()}</>}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="mb-3 text-sm font-medium text-text-strong">Recent Checks</h2>
      {checks.length === 0 ? (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-stroke-soft bg-bg-white px-6 py-10">
          <div className="text-center">
            <MonitorLight className="mx-auto mb-2 size-6 text-text-soft" />
            <p className="text-sm text-text-sub">No checks recorded yet.</p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-stroke-soft">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-weak">
                {["Status", "Region", "Response Time", "Status Code", "Checked At"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-text-sub">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {checks.map((c) => (
                <tr key={c.id} className="border-t border-stroke-soft transition hover:bg-bg-weak">
                  <td className="px-4 py-3">
                    <Badge variant="light" color={c.status === "up" ? "green" : "red"} size="sm">{c.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-sub">{c.region}</td>
                  <td className="px-4 py-3 text-sm text-text-sub">{c.responseTimeMs ? `${c.responseTimeMs}ms` : "-"}</td>
                  <td className="px-4 py-3 text-sm text-text-sub">{c.statusCode ?? "-"}</td>
                  <td className="px-4 py-3 text-sm text-text-soft">{new Date(c.checkedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
