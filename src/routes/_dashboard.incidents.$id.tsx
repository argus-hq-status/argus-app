import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { WarningCircle, Trash } from "@phosphor-icons/react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui";
import { useSetHeader } from "~/components/layout-context";
import { ListSkeleton } from "~/components/loading-skeleton";

const statusConfig: Record<string, { color: "orange" | "blue" | "gray" | "green"; label: string }> = {
  investigating: { color: "orange", label: "Investigating" },
  identified: { color: "blue", label: "Identified" },
  monitoring: { color: "gray", label: "Monitoring" },
  resolved: { color: "green", label: "Resolved" },
};

interface IncidentData {
  id: string;
  title: string;
  status: string;
  isAutomatic: boolean;
  startedAt: string;
  resolvedAt: string | null;
}

interface UpdateData {
  id: string;
  message: string;
  status: string;
  createdAt: string;
}

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

  useSetHeader({
    title: incident?.title ?? "Incident",
    breadcrumb: [
      { label: "Incidents", href: "/incidents" },
      { label: incident?.title ?? "Loading..." },
    ],
    actions: incident ? (
      <Button variant="error" mode="ghost" size="sm" icon={Trash} loading={deleting} onClick={handleDelete}>
        Delete
      </Button>
    ) : undefined,
  });

  async function handleDelete() {
    if (!confirm("Delete this incident permanently?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/incidents/${params.id}`, { method: "DELETE" });
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
      const res = await fetch(`/api/incidents/${params.id}`);
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
      const res = await fetch(`/api/incidents/${params.id}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to add update");
      setMessage("");
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
      <div className="flex flex-col items-center gap-3 rounded-lg border border-stroke-soft bg-bg-white px-6 py-12">
        <WarningCircle className="size-8 text-error" weight="regular" />
        <p className="text-sm font-medium text-text-strong">{error ?? "Not found"}</p>
      </div>
    );
  }

  const cfg = statusConfig[incident.status] ?? { color: "gray" as const, label: incident.status };

  return (
    <div>
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-stroke-soft bg-bg-white p-4">
          <p className="text-xs text-text-soft">Status</p>
          <div className="mt-0.5">
            <Badge variant="light" color={cfg.color}>{cfg.label}</Badge>
          </div>
        </div>
        <div className="rounded-lg border border-stroke-soft bg-bg-white p-4">
          <p className="text-xs text-text-soft">Type</p>
          <p className="mt-0.5 text-sm font-medium text-text-strong">
            {incident.isAutomatic ? "Automatic" : "Manual"}
          </p>
        </div>
        <div className="rounded-lg border border-stroke-soft bg-bg-white p-4">
          <p className="text-xs text-text-soft">Started</p>
          <p className="mt-0.5 text-sm font-medium text-text-strong">
            {new Date(incident.startedAt).toLocaleString()}
          </p>
        </div>
        {incident.resolvedAt && (
          <div className="rounded-lg border border-stroke-soft bg-bg-white p-4">
            <p className="text-xs text-text-soft">Resolved</p>
            <p className="mt-0.5 text-sm font-medium text-text-strong">
              {new Date(incident.resolvedAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      <h2 className="mb-3 text-sm font-medium text-text-strong">Timeline</h2>
      <div className="mb-6 space-y-0">
        {updates.length === 0 ? (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-stroke-soft bg-bg-white px-6 py-10">
            <div className="text-center">
              <WarningCircle className="mx-auto mb-2 size-6 text-text-soft" />
              <p className="text-sm text-text-sub">No updates yet.</p>
            </div>
          </div>
        ) : (
          <div className="relative ml-3 space-y-0">
            <div className="absolute bottom-0 left-[7px] top-0 w-px bg-stroke-soft" />
            {updates.map((u) => {
              const uc = statusConfig[u.status] ?? { color: "gray" as const, label: u.status };
              return (
                <div key={u.id} className="relative flex gap-4 pb-6 last:pb-0">
                  <div className={`relative z-10 mt-1.5 size-3.5 shrink-0 rounded-full border-2 ${
                    u.status === "resolved"
                      ? "border-success bg-success-light"
                      : u.status === "investigating"
                        ? "border-warning bg-warning-light"
                        : "border-info bg-info-light"
                  }`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="light" color={uc.color} size="sm">{uc.label}</Badge>
                      <span className="text-xs text-text-soft">
                        {new Date(u.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-text-strong">{u.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-stroke-soft bg-bg-white p-4">
        <h3 className="mb-3 text-sm font-medium text-text-strong">Add Update</h3>
        <div className="space-y-3">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="block w-full rounded-lg border border-stroke-soft bg-bg-white px-3 py-2 text-sm text-text-strong outline-none focus:border-primary"
          >
            <option value="investigating">Investigating</option>
            <option value="identified">Identified</option>
            <option value="monitoring">Monitoring</option>
            <option value="resolved">Resolved</option>
          </select>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the current status..."
            rows={3}
            className="block w-full rounded-lg border border-stroke-soft bg-bg-white px-3 py-2 text-sm text-text-strong outline-none placeholder:text-text-soft focus:border-primary"
          />
          <div className="flex justify-end">
            <Button variant="primary" size="sm" loading={submitting} disabled={!message.trim()} onClick={handleAddUpdate}>
              Post Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
