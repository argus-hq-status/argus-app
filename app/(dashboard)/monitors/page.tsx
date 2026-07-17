"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Monitor, WarningCircle } from "@phosphor-icons/react";
import { Badge } from "@/components/ui";
import { Button, ActionButton } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { ListSkeleton } from "@/components/loading-skeleton";
import { useSetHeader } from "@/components/layout-context";
import { apiUrl } from "@/lib/api";

const statusBadge: Record<string, { color: "green" | "red" | "gray"; variant: "light" | "stroke" }> = {
  up: { color: "green", variant: "light" },
  down: { color: "red", variant: "light" },
  unknown: { color: "gray", variant: "stroke" },
};

interface MonitorData {
  id: string;
  name: string;
  url: string;
  currentStatus: string;
  regions: string[];
  intervalSeconds: number;
}

export default function MonitorsPage() {
  const [monitors, setMonitors] = useState<MonitorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useSetHeader({
    title: "Monitors",
    description: "Monitor your endpoints from multiple regions",
    breadcrumb: [{ label: "Monitors" }],
    actions: (
      <ActionButton href="/monitors/new" icon={Plus}>
        New Monitor
      </ActionButton>
    ),
  });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(apiUrl("/api/monitors"));
      if (!res.ok) throw new Error("Failed to load monitors");
      setMonitors(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <ListSkeleton count={4} />;

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-stroke-soft bg-bg-white px-6 py-12">
        <div className="flex size-12 items-center justify-center rounded-lg bg-error-light">
          <WarningCircle className="size-6 text-error" weight="regular" />
        </div>
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
          <Link href="/monitors/new">
            <Button variant="primary" icon={Plus}>Create Monitor</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-2">
      {monitors.map((m) => {
        const badge = statusBadge[m.currentStatus] ?? { color: "gray", variant: "stroke" };
        return (
          <Link
            key={m.id}
            href={`/monitors/${m.id}`}
            className="flex items-center justify-between rounded-lg border border-stroke-soft bg-bg-white px-4 py-3.5 transition duration-200 ease-out hover:bg-bg-weak"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-text-strong">{m.name}</p>
                <Badge variant={badge.variant} color={badge.color} size="sm">
                  {m.currentStatus}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-sm text-text-sub">{m.url}</p>
            </div>
            <div className="ml-4 flex items-center gap-4 text-xs text-text-soft">
              <span>{m.regions.length} region{(m.regions.length > 1 ? "s" : "")}</span>
              <span>{m.intervalSeconds}s</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
