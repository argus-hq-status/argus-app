import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MonitorForm, MonitorFormData } from "~/components/monitor-form";
import { api } from "~/lib/api";

interface MonitorData extends MonitorFormData {
  id: string;
}

export function SettingsTab({
  monitor,
  onUpdated,
}: {
  monitor: MonitorData;
  onUpdated: () => void;
}) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSave(data: MonitorFormData) {
    if (data.regions.length === 0) {
      setError("Select at least one region.");
      return;
    }
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const res = await api(`/api/monitors/${monitor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to update");
      }
      setSuccess("Monitor updated.");
      onUpdated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this monitor? This action cannot be undone."))
      return;
    setDeleting(true);
    try {
      await api(`/api/monitors/${monitor.id}`, { method: "DELETE" });
      navigate({ to: "/monitors" });
    } catch {
      setError("Failed to delete monitor.");
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-emerald-600">{success}</p>}
      <MonitorForm
        initialData={monitor}
        onSubmit={handleSave}
        onDelete={handleDelete}
        submitLabel="Save changes"
        loading={saving}
        deleting={deleting}
      />
    </div>
  );
}
