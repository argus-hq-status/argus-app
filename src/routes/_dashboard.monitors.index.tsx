import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Monitor, Plus } from "@phosphor-icons/react";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui";
import { Button, getButtonClassName } from "~/components/ui/button";
import { EmptyState } from "~/components/empty-state";
import { DataTable } from "~/components/ui/data-table";
import type { DataTableColumn } from "~/components/ui/data-table";
import { PageHeader } from "~/components/page-header";
import { api } from "~/lib/api";
import { ListSkeleton } from "~/components/loading-skeleton";

interface MonitorData {
  id: string;
  name: string;
  url: string;
  currentStatus: string;
  isActive: boolean;
}

const statusBadge: Record<string, { color: "green" | "red" | "gray"; variant: "light" | "stroke" }> = {
  up: { color: "green", variant: "light" },
  down: { color: "red", variant: "light" },
  unknown: { color: "gray", variant: "stroke" },
};

export const Route = createFileRoute("/_dashboard/monitors/")({
  component: MonitorsPage,
});

function MonitorsPage() {
  const navigate = useNavigate();
  const [monitors, setMonitors] = useState<MonitorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api("/api/monitors");
      if (!res.ok) throw new Error("Failed to load monitors");
      setMonitors(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = monitors.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.url.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: DataTableColumn<MonitorData>[] = [
    {
      id: "name",
      header: "NAME",
      sortable: true,
      sortValue: (m) => m.name,
      cellClassName: "font-mono text-xs",
      cell: (m) => (
        <Link
          to="/monitors/$id"
          params={{ id: m.id }}
          className="font-medium text-gray-900 hover:text-primary transition dark:text-gray-50"
        >
          {m.name}
        </Link>
      ),
    },
    {
      id: "url",
      header: "URL",
      sortable: true,
      sortValue: (m) => m.url,
      cellClassName: "font-mono text-xs text-gray-500 dark:text-gray-400",
      cell: (m) => m.url,
    },
    {
      id: "status",
      header: "STATUS",
      sortable: true,
      sortValue: (m) => m.currentStatus,
      cell: (m) => {
        const badge = statusBadge[m.currentStatus] ?? { color: "gray", variant: "stroke" };
        return (
          <Badge variant={badge.variant} color={badge.color} size="sm">
            {m.currentStatus}
          </Badge>
        );
      },
    },
  ];

  if (loading) return <ListSkeleton count={6} />;
  if (error) {
    return (
      <EmptyState
        title="Something went wrong"
        description={error}
        action={<Button variant="primary" onClick={load}>Retry</Button>}
      />
    );
  }

  return (
    <div>
      <PageHeader
        icon={Monitor}
        title="Monitors"
        description="Monitor the uptime of your services"
        actions={
          <Link to="/monitors/new" className={getButtonClassName({ variant: "neutral", mode: "filled", size: "md" })}>
            <Plus className="size-4 shrink-0" />
            New Monitor
          </Link>
        }
      />

      <DataTable
        data={filtered}
        columns={columns}
        getRowKey={(m) => m.id}
        pageSize={10}
        height={480}
        defaultSort={{ columnId: "name", direction: "asc" }}
        onRowClick={(m) => navigate({ to: "/monitors/$id", params: { id: m.id } })}
        toolbar={
          <Input
            aria-label="Search monitors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search monitors..."
            className="h-10 w-full font-mono text-sm sm:w-80"
          />
        }
        footer={
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {filtered.length} monitor{filtered.length === 1 ? "" : "s"}
          </p>
        }
        emptyState={{
          title: monitors.length === 0 ? "No monitors yet" : "No matching monitors",
          description: monitors.length === 0
            ? "Create your first monitor to start tracking uptime."
            : "Try a different search term.",
          action: monitors.length === 0
            ? (
              <Link to="/monitors/new">
                <Button variant="primary" icon={Plus}>New Monitor</Button>
              </Link>
            )
            : undefined,
        }}
      />
    </div>
  );
}
