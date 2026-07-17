"use client";

import { useState, useEffect } from "react";
import { X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { apiUrl } from "@/lib/api";

interface Monitor {
  id: string;
  name: string;
}

export function CreateIncidentModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [monitorId, setMonitorId] = useState("");
  const [status, setStatus] = useState("investigating");
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(apiUrl("/api/monitors"))
      .then((r) => r.json())
      .then(setMonitors)
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(apiUrl("/api/incidents"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          monitorId: monitorId || undefined,
          status,
        }),
      });
      if (!res.ok) throw new Error("Failed to create incident");
      onCreated();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-strong">Create Incident</h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-bg-weak">
            <X className="size-5 text-text-sub" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-strong">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of the incident"
              className="block w-full rounded-lg border border-stroke-soft bg-bg-white px-3 py-2 text-sm text-text-strong outline-none placeholder:text-text-soft focus:border-primary"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-strong">Monitor (optional)</label>
            <select
              value={monitorId}
              onChange={(e) => setMonitorId(e.target.value)}
              className="block w-full rounded-lg border border-stroke-soft bg-bg-white px-3 py-2 text-sm text-text-strong outline-none focus:border-primary"
            >
              <option value="">No monitor</option>
              {monitors.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-strong">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="block w-full rounded-lg border border-stroke-soft bg-bg-white px-3 py-2 text-sm text-text-strong outline-none focus:border-primary"
            >
              <option value="investigating">Investigating</option>
              <option value="identified">Identified</option>
              <option value="monitoring">Monitoring</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="neutral" mode="stroke" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm" loading={submitting} disabled={!title.trim()}>Create</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
