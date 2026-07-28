import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Plus, Trash, WarningCircle, Bell } from "@phosphor-icons/react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { PageHeader } from "~/components/page-header";
import { EmptyState } from "~/components/empty-state";
import { api } from "~/lib/api";
import { ListSkeleton } from "~/components/loading-skeleton";

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

const listCardClass = "flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3.5 dark:border-[#2a2a2a] dark:bg-[#1a1a1a]";

export const Route = createFileRoute("/_dashboard/alert-channels")({
  component: AlertChannelsPage,
});

function AlertChannelsPage() {
  const [channels, setChannels] = useState<AlertChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [type, setType] = useState("email");
  const [target, setTarget] = useState("");
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api("/api/alert-channels");
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
      const res = await api("/api/alert-channels", {
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
    await api(`/api/alert-channels/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Bell}
        title="Alert Channels"
        description="Get notified when monitors go down"
      />

      <Card className="p-5">
        <h2 className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-50">Add alert channel</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2 sm:w-48">
            <Label htmlFor="type" className="text-gray-700 dark:text-gray-300">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="slack">Slack</SelectItem>
                <SelectItem value="discord">Discord</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="target" className="text-gray-700 dark:text-gray-300">Target</Label>
            <Input id="target" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="email or webhook URL" required className="h-11" />
          </div>
          <Button type="submit" variant="primary" icon={Plus} loading={adding} className="font-normal">
            Add
          </Button>
        </form>
      </Card>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-error-light bg-error-light px-3 py-2 text-sm text-error">
          <WarningCircle className="size-4" weight="fill" />
          {error}
        </div>
      )}

      {loading ? (
        <ListSkeleton count={3} />
      ) : channels.length === 0 ? (
        <EmptyState title="No alert channels" description="Add an email, Slack, or Discord channel to get notified." />
      ) : (
        <div className="space-y-2">
          {channels.map((ch) => {
            const badge = typeBadge[ch.type] ?? { color: "blue" };
            return (
              <div key={ch.id} className={listCardClass}>
                <div className="flex items-center gap-3">
                  <Badge variant="light" color={badge.color} size="sm">{ch.type}</Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{ch.target}</span>
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
