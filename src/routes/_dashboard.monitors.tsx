import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Plus, Monitor, WarningCircle } from "@phosphor-icons/react";
import { Badge } from "~/components/ui";
import { Button, ActionButton } from "~/components/ui/button";
import { EmptyState } from "~/components/empty-state";
import { api } from "~/lib/api";
import { ListSkeleton } from "~/components/loading-skeleton";
import { useSetHeader } from "~/components/layout-context";

interface MonitorData {
  id: string;
  name: string;
  url: string;
  currentStatus: string;
  isActive: boolean;
}

const statusBadge: Record<string, { color: "green" | "red" | "gray"; variant: "light" | "stroke" }> = {
  up: { color: "green", variant: "light" },
  down: { color: "red", variant: "light" },
  unknown: { color: "gray", variant: "stroke" },
};

export const Route = createFileRoute("/_dashboard/monitors")({
  component: MonitorsPage,
});

function MonitorsPage() {
  const [monitors, setMonitors] = useState<MonitorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useSetHeader({
    title: "Monitors",
    description: "Monitor the uptime of your services",
    actions: (
        <ActionButton href="/monitors/new" icon={Plus}>New Monitor</ActionButton>
    ),
  });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api("/api/monitors");
      if (!res.ok) throw new Error("Failed to load monitors");
      setMonitors(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <ListSkeleton count={6} />;
  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-stroke-soft bg-bg-white px-6 py-12">
        <WarningCircle className="size-8 text-error" weight="regular" />
        <p className="text-sm font-medium text-text-strong">{error}</p>
        <Button variant="neutral" onClick={load}>Retry</Button>
      </div>
    );
  }

  if (monitors.length === 0) {
    return (
      <EmptyState
        icon={Monitor}
        title="No monitors yet"
        description="Create your first monitor to start tracking uptime."
        action={
          <Link to="/monitors/new">
            <Button variant="primary" icon={Plus}>New Monitor</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {monitors.map((m) => {
        const badge = statusBadge[m.currentStatus] ?? { color: "gray", variant: "stroke" };
        return (
          <Link
            key={m.id}
            to={"/monitors/$id"}
            params={{ id: m.id }}
            className="rounded-lg border border-stroke-soft bg-bg-white p-4 transition hover:border-stroke-sub"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-strong">{m.name}</span>
              <Badge variant={badge.variant} color={badge.color} size="sm">{m.currentStatus}</Badge>
            </div>
            <p className="mt-1 truncate text-sm text-text-sub">{m.url}</p>
          </Link>
        );
      })}
    </div>
  );
}
