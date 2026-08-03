import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Monitor } from "@phosphor-icons/react";
import { PageHeader } from "~/components/page-header";
import { MonitorForm, MonitorFormData } from "~/components/monitor-form";
import { api } from "~/lib/api";

export const Route = createFileRoute("/_dashboard/monitors/new")({
  component: NewMonitorPage,
});

function NewMonitorPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(data: MonitorFormData) {
    if (data.regions.length === 0) {
      setError("Select at least one region.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const res = await api("/api/monitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to create monitor");
      }
      navigate({ to: "/monitors" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        icon={Monitor}
        title="New monitor"
        description="Configure uptime checks and assertions for your endpoint."
      />

      <div className="flex-1 mt-6">
        {error && (
          <p className="mb-4 text-sm text-red-600">{error}</p>
        )}
        <MonitorForm
          onSubmit={handleSubmit}
          submitLabel="Create monitor"
          loading={saving}
        />
      </div>
    </div>
  );
}
