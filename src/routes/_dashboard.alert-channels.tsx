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
    dotColor: "bg-success",
  },
  slack: {
    icon: Chats,
    label: "Slack",
    description: "Alerts posted to a Slack channel",
    color: "gray",
    dotColor: "bg-success",
  },
  discord: {
    icon: Headset,
    label: "Discord",
    description: "Alerts sent via Discord webhook",
    color: "green",
    dotColor: "bg-success",
  },
};

const listCardClass = "flex items-center gap-4 rounded-xl bg-card px-5 py-4 shadow-[0_0_0_1px_var(--border),0_1px_2px_rgba(0,0,0,0.04)] transition-[box-shadow] duration-150 hover:shadow-[0_0_0_1px_var(--stroke-sub),0_4px_12px_rgba(0,0,0,0.06)]";

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
        <div className="border-b border-border bg-surface-sunken/60 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-md bg-primary-muted text-primary">
              <Plus className="size-3" weight="bold" />
            </span>
            <h2 className="text-sm font-semibold text-foreground">Add alert channel</h2>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end">
          <div className="space-y-2 sm:w-44">
            <Label htmlFor="type">Type</Label>
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
            <Label htmlFor="target">
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
          <Button type="submit" variant="primary" icon={Plus} loading={adding} className="shrink-0">
            Add channel
          </Button>
        </form>
      </Card>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-lg bg-error-light px-4 py-3 text-sm font-medium text-error shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--error)_20%,transparent)]">
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
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-muted text-primary">
                  <Icon className="size-5" weight="bold" />
                </div>

                {/* Middle content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="light" color={meta.color} size="sm">{meta.label}</Badge>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className={`size-1.5 rounded-full ${meta.dotColor}`} />
                      Active
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm font-medium text-foreground">
                    {ch.target}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {meta.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    onClick={() => handleDelete(ch.id)}
                    variant="error"
                    mode="ghost"
                    size="sm"
                    icon={Trash}
                    className="size-8 px-0"
                    aria-label="Remove channel"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer summary */}
      {channels.length > 0 && (
        <div className="flex items-center justify-center gap-6 pt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" />
            {channels.length} channel{channels.length !== 1 ? "s" : ""} configured
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="size-3.5 text-success" weight="fill" />
            All active
          </span>
        </div>
      )}
    </div>
  );
}
