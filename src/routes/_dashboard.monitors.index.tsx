import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Monitor, Plus, MagnifyingGlass } from "@phosphor-icons/react";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui";
import { Button, getButtonClassName } from "~/components/ui/button";
import { EmptyState } from "~/components/empty-state";
import { DataTable } from "~/components/ui/data-table";
import type { DataTableColumn } from "~/components/ui/data-table";
import { PageHeader } from "~/components/page-header";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/lib/api";
import { ListSkeleton } from "~/components/loading-skeleton";

interface MonitorData {
  id: string;
  name: string;
  url: string;
  currentStatus: string;
  isActive: boolean;
}

const STATUS_STYLES: Record<string, { color: "green" | "red" | "gray"; variant: "light" | "stroke"; label: string }> = {
  up: { color: "green", variant: "light", label: "Up" },
  down: { color: "red", variant: "light", label: "Down" },
  unknown: { color: "gray", variant: "stroke", label: "Unknown" },
};

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "up", label: "Up" },
  { value: "down", label: "Down" },
  { value: "unknown", label: "Unknown" },
];

export const Route = createFileRoute("/_dashboard/monitors/")({
  component: MonitorsPage,
});

function MonitorsPage() {
  const navigate = useNavigate();
  const [monitors, setMonitors] = useState<MonitorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const filtered = monitors.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.url.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: DataTableColumn<MonitorData>[] = [
    {
      id: "name",
      header: "Monitor",
      sortable: true,
      sortValue: (m) => m.name,
      cell: (m) => (
        <Link
          to="/monitors/$id"
          params={{ id: m.id }}
          className="font-medium text-foreground transition-colors duration-150 hover:text-primary"
        >
          {m.name}
        </Link>
      ),
    },
    {
      id: "url",
      header: "Endpoint",
      sortable: true,
      sortValue: (m) => m.url,
      cellClassName: "text-muted-foreground",
      cell: (m) => (
        <span className="max-w-[280px] truncate block">{m.url}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      sortValue: (m) => m.currentStatus,
      cell: (m) => {
        const style = STATUS_STYLES[m.currentStatus] ?? STATUS_STYLES.unknown;
        return (
          <Badge variant={style.variant} color={style.color} size="sm">
            {style.label}
          </Badge>
        );
      },
    },
    {
      id: "active",
      header: "Active",
      sortable: true,
      sortValue: (m) => (m.isActive ? 1 : 0),
      cell: (m) => (
        <span className={m.isActive ? "text-success" : "text-text-soft"}>
          {m.isActive ? "Yes" : "No"}
        </span>
      ),
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
        height={520}
        defaultSort={{ columnId: "name", direction: "asc" }}
        onRowClick={(m) => navigate({ to: "/monitors/$id", params: { id: m.id } })}
        title={
          <div className="relative">
            <MagnifyingGlass className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-text-soft" />
            <Input
              aria-label="Search monitors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search monitors…"
              className="w-full pl-8 font-sans text-sm sm:w-[240px]"
            />
          </div>
        }
        toolbar={
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-[160px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_FILTER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        }
        emptyState={{
          title: monitors.length === 0 ? "No monitors yet" : "No matching monitors",
          description: monitors.length === 0
            ? "Create your first monitor to start tracking uptime."
            : "Try a different search term or adjust your filters.",
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
