import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback, type FormEvent } from "react";
import { WarningCircle, MagnifyingGlass, Plus, X } from "@phosphor-icons/react";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui";
import { Button } from "~/components/ui/button";
import { PageHeader } from "~/components/page-header";
import { EmptyState } from "~/components/empty-state";
import { DataTable } from "~/components/ui/data-table";
import type { DataTableColumn } from "~/components/ui/data-table";
import { Label } from "~/components/ui/label";
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
  incidentType: string;
  isAutomatic: boolean;
  startedAt: string;
  resolvedAt: string | null;
}

const STATUS_STYLES: Record<string, { color: "orange" | "blue" | "gray" | "green"; variant: "light" | "stroke"; label: string }> = {
  investigating: { color: "orange", variant: "light", label: "Investigating" },
  identified: { color: "blue", variant: "light", label: "Identified" },
  monitoring: { color: "gray", variant: "stroke", label: "Monitoring" },
  resolved: { color: "green", variant: "light", label: "Resolved" },
  planned: { color: "gray", variant: "stroke", label: "Planned" },
  in_progress: { color: "blue", variant: "light", label: "In Progress" },
  completed: { color: "green", variant: "light", label: "Completed" },
};

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "investigating", label: "Investigating" },
  { value: "identified", label: "Identified" },
  { value: "monitoring", label: "Monitoring" },
  { value: "resolved", label: "Resolved" },
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const INCIDENT_STATUS_OPTIONS = ["investigating", "identified", "monitoring", "resolved"] as const;
const MAINTENANCE_STATUS_OPTIONS = ["planned", "in_progress", "completed"] as const;

type IncidentType = "incident" | "scheduled";
type IncidentStatus = typeof INCIDENT_STATUS_OPTIONS[number] | typeof MAINTENANCE_STATUS_OPTIONS[number];

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
  const [modalOpen, setModalOpen] = useState(false);
  const [incidentType, setIncidentType] = useState<IncidentType>("incident");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<IncidentStatus>("investigating");
  const [scheduledStartAt, setScheduledStartAt] = useState("");
  const [scheduledEndAt, setScheduledEndAt] = useState("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

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

  function resetForm(nextType: IncidentType = "incident") {
    setIncidentType(nextType);
    setTitle("");
    setStatus(nextType === "scheduled" ? "planned" : "investigating");
    setScheduledStartAt("");
    setScheduledEndAt("");
    setFormError("");
  }

  function openCreateModal(nextType: IncidentType) {
    resetForm(nextType);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    resetForm();
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    setFormError("");

    const payload: Record<string, unknown> = {
      title,
      incidentType,
      status,
    };

    if (incidentType === "scheduled") {
      payload.scheduledStartAt = scheduledStartAt ? new Date(scheduledStartAt).toISOString() : undefined;
      payload.scheduledEndAt = scheduledEndAt ? new Date(scheduledEndAt).toISOString() : undefined;
    }

    try {
      const res = await api("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({} as { error?: string }));
        throw new Error(body.error ?? "Failed to create entry");
      }

      const created = await res.json();
      closeModal();
      load();
      navigate({ to: "/incidents/$id", params: { id: created.id } });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setCreating(false);
    }
  }

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
          <p className="font-medium text-foreground">{inc.title}</p>
          {inc.isAutomatic && (
            <Badge variant="stroke" color="gray" size="sm" className="mt-0.5">auto</Badge>
          )}
        </>
      ),
    },
    {
      id: "incidentType",
      header: "Type",
      sortable: true,
      sortValue: (inc) => inc.incidentType,
      cell: (inc) => (
        <Badge variant="stroke" color={inc.incidentType === "scheduled" ? "blue" : "gray"} size="sm">
          {inc.incidentType === "scheduled" ? "Maintenance" : "Incident"}
        </Badge>
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
      cellClassName: "text-muted-foreground",
      cell: (inc) => formatDate(inc.startedAt),
    },
    {
      id: "resolvedAt",
      header: "Resolved",
      sortable: true,
      sortValue: (inc) => inc.resolvedAt ? new Date(inc.resolvedAt).getTime() : 0,
      cellClassName: "text-muted-foreground",
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
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="neutral" mode="stroke" icon={Plus} onClick={() => openCreateModal("incident")}>
                New incident
              </Button>
              <Button variant="primary" icon={Plus} onClick={() => openCreateModal("scheduled")}>
                Schedule maintenance
              </Button>
            </div>
          }
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
            <MagnifyingGlass className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-text-soft" />
            <Input
              aria-label="Search incidents"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search incidents…"
              className="w-full pl-8 font-sans text-sm sm:w-60"
            />
          </div>
        }
        toolbar={
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-40">
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="create-incident-title">
          <div className="w-full max-w-lg rounded-2xl bg-surface-raised shadow-[0_20px_60px_rgba(0,0,0,0.28),0_0_0_1px_var(--border)]">
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
              <div>
                <h2 id="create-incident-title" className="text-base font-semibold text-foreground">
                  {incidentType === "scheduled" ? "Schedule maintenance" : "Create incident"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {incidentType === "scheduled"
                    ? "Create a planned maintenance window that will appear on the public status page."
                    : "Create an incident to track an outage or degradation."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5 px-5 py-5">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder={incidentType === "scheduled" ? "Database maintenance" : "API outage"} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={incidentType} onValueChange={(value) => {
                    const nextType = value as IncidentType;
                    setIncidentType(nextType);
                    setStatus(nextType === "scheduled" ? "planned" : "investigating");
                  }}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="incident">Incident</SelectItem>
                      <SelectItem value="scheduled">Scheduled maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(value) => setStatus(value as IncidentStatus)}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(incidentType === "scheduled" ? MAINTENANCE_STATUS_OPTIONS : INCIDENT_STATUS_OPTIONS).map((option) => (
                        <SelectItem key={option} value={option}>
                          {STATUS_STYLES[option]?.label ?? option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {incidentType === "scheduled" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="scheduledStartAt">Scheduled start</Label>
                    <Input id="scheduledStartAt" type="datetime-local" value={scheduledStartAt} onChange={(e) => setScheduledStartAt(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledEndAt">Scheduled end</Label>
                    <Input id="scheduledEndAt" type="datetime-local" value={scheduledEndAt} onChange={(e) => setScheduledEndAt(e.target.value)} required />
                  </div>
                </div>
              )}

              {formError && <p className="text-sm text-red-500" role="alert">{formError}</p>}

              <div className="flex items-center justify-end gap-2 border-t border-border pt-5">
                <Button type="button" variant="neutral" mode="ghost" onClick={closeModal}>Cancel</Button>
                <Button type="submit" variant="primary" loading={creating} className="font-normal">
                  {incidentType === "scheduled" ? "Schedule" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
