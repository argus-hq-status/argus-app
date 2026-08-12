import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Plus, Trash, Bell, Envelope, Chats, Headset, CheckCircle, ShieldCheck } from "@phosphor-icons/react";
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

const channelMeta: Record<string, { icon: typeof Envelope; label: string; description: string; color: "blue" | "gray" | "green"; dotColor: string }> = {
  email: {
    icon: Envelope,
    label: "Email",
    description: "Receive alerts in your inbox",
    color: "blue",
    dotColor: "bg-blue-500",
  },
  slack: {
    icon: Chats,
    label: "Slack",
    description: "Alerts posted to a Slack channel",
    color: "gray",
    dotColor: "bg-violet-400",
  },
  discord: {
    icon: Headset,
    label: "Discord",
    description: "Alerts sent via Discord webhook",
    color: "green",
    dotColor: "bg-indigo-400",
  },
};

const listCardClass = "flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] transition hover:border-gray-300 dark:hover:border-[#3a3a3a]";

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

      {/* Add Channel Form */}
      <Card className="overflow-hidden p-0">
        <div className="border-b border-gray-200 bg-gray-50/50 px-5 py-3.5 dark:border-[#2a2a2a] dark:bg-[#141414]">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded bg-blue-500/15">
              <Plus className="size-3 text-blue-400" weight="bold" />
            </span>
            <h2 className="text-sm font-medium text-gray-900 dark:text-gray-50">Add alert channel</h2>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end">
          <div className="space-y-2 sm:w-44">
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
            <Label htmlFor="target" className="text-gray-700 dark:text-gray-300">
              {type === "email" ? "Email address" : "Webhook URL"}
            </Label>
            <Input
              id="target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder={
                type === "email"
                  ? "you@example.com"
                  : type === "slack"
                    ? "https://hooks.slack.com/services/..."
                    : "https://discord.com/api/webhooks/..."
              }
              required
            />
          </div>
          <Button type="submit" variant="primary" icon={Plus} loading={adding} className="shrink-0 font-normal">
            Add channel
          </Button>
        </form>
      </Card>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <Bell className="size-4 shrink-0" weight="fill" />
          {error}
        </div>
      )}

      {/* Channel List */}
      {loading ? (
        <ListSkeleton count={3} />
      ) : channels.length === 0 ? (
        <EmptyState
          title="No alert channels"
          description="Add an email, Slack, or Discord channel to start receiving alerts when your monitors detect issues."
        />
      ) : (
        <div className="space-y-1.5">
          {channels.map((ch) => {
            const meta = channelMeta[ch.type] ?? channelMeta.email;
            const Icon = meta.icon;
            return (
              <div key={ch.id} className={listCardClass}>
                {/* Icon */}
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${ch.type === "email" ? "bg-blue-500/15 text-blue-400" : ch.type === "slack" ? "bg-violet-500/15 text-violet-400" : "bg-indigo-500/15 text-indigo-400"}`}>
                  <Icon className="size-5" weight="bold" />
                </div>

                {/* Middle content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="light" color={meta.color} size="sm">{meta.label}</Badge>
                    <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                      <span className={`size-1.5 rounded-full ${meta.dotColor}`} />
                      Active
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                    {ch.target}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                    {meta.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDelete(ch.id)}
                    className="flex size-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                    aria-label="Remove channel"
                  >
                    <Trash className="size-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer summary */}
      {channels.length > 0 && (
        <div className="flex items-center justify-center gap-6 pt-2 text-xs text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" />
            {channels.length} channel{channels.length !== 1 ? "s" : ""} configured
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="size-3.5 text-[#2ea043]" weight="fill" />
            All active
          </span>
        </div>
      )}
    </div>
  );
}