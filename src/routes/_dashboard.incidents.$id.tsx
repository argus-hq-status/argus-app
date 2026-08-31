import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { WarningCircle, Trash, Plus } from "@phosphor-icons/react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui";
import { Card } from "~/components/ui/card";
import * as Drawer from "~/components/ui/drawer";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/lib/api";
import { ListSkeleton } from "~/components/loading-skeleton";

const statusConfig: Record<string, { color: "orange" | "blue" | "gray" | "green" | "red"; label: string }> = {
  investigating: { color: "orange", label: "Investigating" },
  identified: { color: "blue", label: "Identified" },
  monitoring: { color: "gray", label: "Monitoring" },
  resolved: { color: "green", label: "Resolved" },
  planned: { color: "gray", label: "Planned" },
  in_progress: { color: "blue", label: "In Progress" },
  completed: { color: "green", label: "Completed" },
};

interface IncidentData {
  id: string;
  title: string;
  status: string;
  incidentType: string;
  isAutomatic: boolean;
  startedAt: string;
  resolvedAt: string | null;
  scheduledStartAt: string | null;
  scheduledEndAt: string | null;
}

interface UpdateData {
  id: string;
  message: string;
  status: string;
  createdAt: string;
}

const statCardClass = "rounded-xl bg-card p-4 shadow-[0_0_0_1px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]";

export const Route = createFileRoute("/_dashboard/incidents/$id")({
  component: IncidentDetailPage,
});

function IncidentDetailPage() {
  const params = useParams({ from: "/_dashboard/incidents/$id" });
  const navigate = useNavigate();
  const [incident, setIncident] = useState<IncidentData | null>(null);
  const [updates, setUpdates] = useState<UpdateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [newStatus, setNewStatus] = useState("investigating");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this incident permanently?")) return;
    setDeleting(true);
    try {
      const res = await api(`/api/incidents/${params.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      navigate({ to: "/incidents" });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setDeleting(false);
    }
  }

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api(`/api/incidents/${params.id}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setIncident(data);
      setUpdates(data.updates ?? []);
      setNewStatus(data.status);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { load(); }, [load]);

  async function handleAddUpdate() {
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      const res = await api(`/api/incidents/${params.id}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to add update");
      setMessage("");
      setDrawerOpen(false);
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <ListSkeleton count={4} />;
  if (error || !incident) {
    return (
      <Card className="flex flex-col items-center gap-3 px-6 py-12">
        <WarningCircle className="size-8 text-error" weight="regular" />
        <p className="text-sm font-medium text-foreground">{error ?? "Not found"}</p>
      </Card>
    );
  }

  const cfg = statusConfig[incident.status] ?? { color: "gray" as const, label: incident.status };
  const isScheduled = incident.incidentType === "scheduled";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-[-0.025em] text-foreground">
          {incident.title}
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="neutral" mode="stroke" size="sm" icon={Plus} onClick={() => setDrawerOpen(true)}>
            Add Update
          </Button>
          <Button variant="error" mode="ghost" size="sm" icon={Trash} loading={deleting} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className={statCardClass}>
          <p className="text-xs text-muted-foreground">Status</p>
          <div className="mt-0.5">
            <Badge variant="light" color={cfg.color}>{cfg.label}</Badge>
          </div>
        </div>
        <div className={statCardClass}>
          <p className="text-xs text-muted-foreground">Type</p>
          <p className="mt-0.5 text-sm font-medium text-foreground capitalize">
            {incident.incidentType}
          </p>
        </div>
        <div className={statCardClass}>
          <p className="text-xs text-muted-foreground">Started</p>
          <p className="mt-0.5 text-sm font-medium text-foreground">
            {new Date(incident.startedAt).toLocaleString()}
          </p>
        </div>
        {incident.resolvedAt && (
          <div className={statCardClass}>
            <p className="text-xs text-muted-foreground">Resolved</p>
            <p className="mt-0.5 text-sm font-medium text-foreground">
              {new Date(incident.resolvedAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
      
      {isScheduled && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          <div className={statCardClass}>
            <p className="text-xs text-muted-foreground">Scheduled Start</p>
            <p className="mt-0.5 text-sm font-medium text-foreground">
              {incident.scheduledStartAt ? new Date(incident.scheduledStartAt).toLocaleString() : "-"}
            </p>
          </div>
          <div className={statCardClass}>
            <p className="text-xs text-muted-foreground">Scheduled End</p>
            <p className="mt-0.5 text-sm font-medium text-foreground">
              {incident.scheduledEndAt ? new Date(incident.scheduledEndAt).toLocaleString() : "-"}
            </p>
          </div>
        </div>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Timeline</h2>
        {updates.length === 0 ? (
          <Card className="flex items-center justify-center border-dashed px-6 py-10">
            <div className="text-center">
              <WarningCircle className="mx-auto mb-2 size-6 text-text-soft" />
              <p className="text-sm text-muted-foreground">No updates yet.</p>
            </div>
          </Card>
        ) : (
          <div className="relative ml-3 space-y-0">
            <div className="absolute bottom-0 left-[7px] top-0 w-px bg-border" />
            {updates.map((u) => {
              const uc = statusConfig[u.status] ?? { color: "gray" as const, label: u.status };
              return (
                <div key={u.id} className="relative flex gap-4 pb-6 last:pb-0">
                  <div className={`relative z-10 mt-1.5 size-3.5 shrink-0 rounded-full border-2 ${
                    (u.status === "resolved" || u.status === "completed")
                      ? "border-success bg-success-light"
                      : (u.status === "investigating" || u.status === "planned")
                        ? "border-warning bg-warning-light"
                        : "border-info bg-info-light"
                  }`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="light" color={uc.color} size="sm">{uc.label}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(u.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-foreground">{u.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Drawer.Content>
          <Drawer.Header>
            <div>
              <Drawer.Title className="text-sm font-semibold text-foreground">
                Add Update
              </Drawer.Title>
              <Drawer.Description className="mt-0.5 text-xs text-muted-foreground">
                Post a status update for {incident.title}
              </Drawer.Description>
            </div>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {!isScheduled ? (
                      <>
                        <SelectItem value="investigating">Investigating</SelectItem>
                        <SelectItem value="identified">Identified</SelectItem>
                        <SelectItem value="monitoring">Monitoring</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe the current status..."
                  rows={5}
                />
              </div>
            </div>
          </Drawer.Body>
          <Drawer.Footer>
            <Button variant="neutral" mode="ghost" size="sm" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" loading={submitting} disabled={!message.trim()} onClick={handleAddUpdate}>
              Post Update
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    </div>
  );
}
