"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Plus, Trash, WarningCircle } from "@phosphor-icons/react";
import { Input, Select } from "@cloudflare/kumo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui";
import { useSetHeader } from "@/components/layout-context";
import { EmptyState } from "@/components/empty-state";
import { ListSkeleton } from "@/components/loading-skeleton";
import { apiUrl } from "@/lib/api";

interface AlertChannel {
  id: string;
  type: string;
  target: string;
}

const typeBadge: Record<string, { color: "blue" | "gray" | "green" }> = {
  email: { color: "blue" },
  slack: { color: "gray" },
  discord: { color: "green" },
};

export default function AlertChannelsPage() {
  const [channels, setChannels] = useState<AlertChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [type, setType] = useState("email");
  const [target, setTarget] = useState("");
  const [adding, setAdding] = useState(false);

  useSetHeader({
    title: "Alert Channels",
    description: "Get notified when monitors go down",
  });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl("/api/alert-channels"));
      setChannels(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAdding(true);
    try {
      const res = await fetch(apiUrl("/api/alert-channels"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, target }),
      });
      if (!res.ok) { setError("Failed to add channel"); return; }
      setTarget("");
      load();
    } catch { setError("Network error"); }
    finally { setAdding(false); }
  }

  async function handleDelete(id: string) {
    await fetch(apiUrl(`/api/alert-channels/${id}`), { method: "DELETE" });
    load();
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8 flex items-end gap-3">
        <Select label="Type" value={type} onValueChange={(v) => setType(v ?? "email")} items={{ email: "Email", slack: "Slack", discord: "Discord" }} />
        <Input label="Target" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="email or webhook URL" required className="flex-1" />
        <Button type="submit" variant="primary" icon={Plus} loading={adding}>Add</Button>
      </form>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-error-light bg-error-light px-3 py-2 text-sm text-error">
          <WarningCircle className="size-4" weight="fill" />{error}
        </div>
      )}

      {loading ? <ListSkeleton count={3} /> : channels.length === 0 ? (
        <EmptyState icon={Bell} title="No alert channels" description="Add an email, Slack, or Discord channel to get notified." />
      ) : (
        <div className="space-y-2">
          {channels.map((ch) => {
            const badge = typeBadge[ch.type] ?? { color: "blue" };
            return (
              <div key={ch.id} className="flex items-center justify-between rounded-lg border border-stroke-soft bg-bg-white px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <Badge variant="light" color={badge.color} size="sm">{ch.type}</Badge>
                  <span className="text-sm text-text-sub">{ch.target}</span>
                </div>
                <Button variant="neutral" mode="ghost" size="sm" icon={Trash} onClick={() => handleDelete(ch.id)} aria-label="Remove" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
