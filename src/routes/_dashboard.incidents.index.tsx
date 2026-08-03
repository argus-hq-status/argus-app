import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { WarningCircle, MagnifyingGlass } from "@phosphor-icons/react";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui";
import { Button } from "~/components/ui/button";
import { PageHeader } from "~/components/page-header";
import { EmptyState } from "~/components/empty-state";
import { DataTable } from "~/components/ui/data-table";
import type { DataTableColumn } from "~/components/ui/data-table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/lib/api";
import { ListSkeleton } from "~/components/loading-skeleton";

interface Incident {
  id: string;
  title: string;
  status: string;
  isAutomatic: boolean;
  startedAt: string;
  resolvedAt: string | null;
}

const STATUS_STYLES: Record<string, { color: "orange" | "blue" | "gray" | "green"; variant: "light" | "stroke"; label: string }> = {
  investigating: { color: "orange", variant: "light", label: "Investigating" },
  identified: { color: "blue", variant: "light", label: "Identified" },
  monitoring: { color: "gray", variant: "stroke", label: "Monitoring" },
  resolved: { color: "green", variant: "light", label: "Resolved" },
};

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "investigating", label: "Investigating" },
  { value: "identified", label: "Identified" },
  { value: "monitoring", label: "Monitoring" },
  { value: "resolved", label: "Resolved" },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const Route = createFileRoute("/_dashboard/incidents/")({
  component: IncidentsPage,
});

function IncidentsPage() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api("/api/incidents");
      if (!res.ok) throw new Error("Failed to load incidents");
      setIncidents(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = incidents.filter((inc) => {
    const matchesSearch = inc.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || inc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: DataTableColumn<Incident>[] = [
    {
      id: "title",
      header: "Incident",
      sortable: true,
      sortValue: (inc) => inc.title,
      cell: (inc) => (
        <>
          <p className="font-medium text-gray-900 dark:text-gray-50">{inc.title}</p>
          {inc.isAutomatic && (
            <Badge variant="stroke" color="gray" size="sm" className="mt-0.5">auto</Badge>
          )}
        </>
      ),
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      sortValue: (inc) => inc.status,
      cell: (inc) => {
        const style = STATUS_STYLES[inc.status] ?? { color: "gray" as const, variant: "stroke" as const, label: inc.status };
        return (
          <Badge variant={style.variant} color={style.color} size="sm">
            {style.label}
          </Badge>
        );
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
      sortable: true,
      sortValue: (inc) => inc.resolvedAt ? new Date(inc.resolvedAt).getTime() : 0,
      cellClassName: "text-gray-500 dark:text-gray-400",
      cell: (inc) => inc.resolvedAt ? formatDate(inc.resolvedAt) : "—",
    },
  ];

  if (loading) return <ListSkeleton count={4} />;
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
        icon={WarningCircle}
        title="Incidents"
        description="Track and manage incidents across your monitors"
      />

      <DataTable
        data={filtered}
        columns={columns}
        getRowKey={(inc) => inc.id}
        pageSize={10}
        height={520}
        defaultSort={{ columnId: "startedAt", direction: "desc" }}
        onRowClick={(inc) => navigate({ to: "/incidents/$id", params: { id: inc.id } })}
        title={
          <div className="relative">
            <MagnifyingGlass className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 dark:text-gray-500" />
            <Input
              aria-label="Search incidents"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search incidents…"
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
          title: incidents.length === 0 ? "No incidents" : "No matching incidents",
          description: incidents.length === 0
            ? "All monitors are running smoothly."
            : "Try a different search term or adjust your filters.",
        }}
      />
    </div>
  );
}
