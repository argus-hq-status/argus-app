import { createFileRoute, useParams, Link, redirect } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  ChartBar,
  ListBullets,
  WarningCircle,
  Gear,
  ArrowLeft,
  Copy,
} from "@phosphor-icons/react";
import { Badge } from "~/components/ui";
import { Card } from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { DataTable } from "~/components/ui/data-table";
import type { DataTableColumn } from "~/components/ui/data-table";
import { OverviewTab } from "~/components/monitor-detail/overview-tab";
import { TimelineTable } from "~/components/monitor-detail/timeline-table";
import { SettingsTab } from "~/components/monitor-detail/settings-tab";
import { api } from "~/lib/api";
import { ListSkeleton } from "~/components/loading-skeleton";

interface MonitorData {
  id: string;
  name: string;
  url: string;
  currentStatus: string;
  monitorType: "HTTP" | "TCP" | "DNS";
  method: string;
  expectedStatus: number;
  headers: { key: string; value: string }[];
  assertions: { type: string; value: string; operator?: string }[];
  degradedMs: number;
  timeoutMs: number;
  intervalSeconds: number;
  regions: string[];
  tags: string[];
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

const statusBadge: Record<string, { color: "green" | "red" | "gray"; variant: "light" | "stroke"; label: string }> = {
  up: { color: "green", variant: "light", label: "Operational" },
  down: { color: "red", variant: "light", label: "Down" },
  unknown: { color: "gray", variant: "stroke", label: "Unknown" },
};

const incidentStatusBadge: Record<string, { color: "orange" | "blue" | "gray" | "green"; variant: "light" | "stroke" }> = {
  investigating: { color: "orange", variant: "light" },
  identified: { color: "blue", variant: "light" },
  monitoring: { color: "gray", variant: "stroke" },
  resolved: { color: "green", variant: "light" },
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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
        api(`/api/monitors/${params.id}/checks?limit=500`),
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
        <Link to="/monitors" className="text-sm text-primary hover:underline">
          ← Back to monitors
        </Link>
      </Card>
    );
  }

  const badge = statusBadge[monitor.currentStatus] ?? statusBadge.unknown;

  /* Incident columns for the Incidents tab */
  const incidentColumns: DataTableColumn<IncidentData>[] = [
    {
      id: "title",
      header: "Incident",
      sortable: true,
      sortValue: (inc) => inc.title,
      cell: (inc) => (
        <Link
          to="/incidents/$id"
          params={{ id: inc.id }}
          className="font-medium text-gray-900 hover:text-primary transition dark:text-gray-50"
        >
          {inc.title}
        </Link>
      ),
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      sortValue: (inc) => inc.status,
      cell: (inc) => {
        const b = incidentStatusBadge[inc.status] ?? { color: "gray" as const, variant: "stroke" as const };
        return <Badge variant={b.variant} color={b.color} size="sm">{inc.status}</Badge>;
      },
    },
    {
      id: "startedAt",
      header: "Started",
      sortable: true,
      sortValue: (inc) => new Date(inc.startedAt).getTime(),
      cellClassName: "text-gray-500 dark:text-gray-400",
      cell: (inc) => formatDate(inc.startedAt),
    },
    {
      id: "resolvedAt",
      header: "Resolved",
      cell: (inc) => (
        <span className="text-gray-500 dark:text-gray-400">
          {inc.resolvedAt ? formatDate(inc.resolvedAt) : "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/monitors"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
      >
        <ArrowLeft className="size-3.5" weight="bold" />
        Monitors
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
              {monitor.name}
            </h1>
            <Badge variant={badge.variant} color={badge.color} size="sm">
              {badge.label}
            </Badge>
            {!monitor.isActive && (
              <Badge variant="stroke" color="gray" size="sm">Paused</Badge>
            )}
          </div>
          <p className="flex items-center gap-2 font-sans text-sm text-gray-500 dark:text-gray-400">
            {monitor.url}
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(monitor.url)}
              className="text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Copy URL"
            >
              <Copy className="size-3.5" />
            </button>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">
            <ChartBar className="size-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="logs">
            <ListBullets className="size-4" />
            Logs
          </TabsTrigger>
          <TabsTrigger value="incidents">
            <WarningCircle className="size-4" />
            Incidents
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Gear className="size-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <OverviewTab
            checks={checks}
            regions={monitor.regions}
            intervalSeconds={monitor.intervalSeconds}
          />
        </TabsContent>

        {/* Logs / Timeline */}
        <TabsContent value="logs">
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-50">Timeline</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                What happened to your monitor over the last 30 days
              </p>
            </div>
            <TimelineTable checks={checks} />
          </div>
        </TabsContent>

        {/* Incidents */}
        <TabsContent value="incidents">
          <DataTable
            data={incidents}
            columns={incidentColumns}
            getRowKey={(inc) => inc.id}
            pageSize={10}
            height={420}
            defaultSort={{ columnId: "startedAt", direction: "desc" }}
            emptyState={{
              title: "No incidents",
              description: "This monitor has not triggered any incidents yet.",
            }}
          />
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings">
          <SettingsTab monitor={monitor} onUpdated={load} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
