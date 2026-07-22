import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { WarningCircle } from "@phosphor-icons/react";
import { Input } from "@cloudflare/kumo";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui";
import { useSetHeader } from "~/components/layout-context";
import { EmptyState } from "~/components/empty-state";
import { api } from "~/lib/api";
import { ListSkeleton } from "~/components/loading-skeleton";

interface Incident {
  id: string;
  title: string;
  status: string;
  isAutomatic: boolean;
  startedAt: string;
  resolvedAt: string | null;
}

const statusBadge: Record<string, { color: "orange" | "blue" | "gray" | "green"; variant: "light" | "stroke" }> = {
  investigating: { color: "orange", variant: "light" },
  identified: { color: "blue", variant: "light" },
  monitoring: { color: "gray", variant: "stroke" },
  resolved: { color: "green", variant: "light" },
};

export const Route = createFileRoute("/_dashboard/incidents")({
  component: IncidentsPage,
});

function IncidentsPage() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useSetHeader({
    title: "Incidents",
    description: "Track and manage incidents across your monitors",
    actions: (
      <div className="flex items-center gap-2">
        <Input
          aria-label="Search incidents"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search incidents..."
          className="w-64"
        />
      </div>
    ),
  });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api("/api/incidents");
      if (!res.ok) throw new Error("Failed to load incidents");
      setIncidents(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = incidents.filter((inc) =>
    inc.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      {loading ? (
        <ListSkeleton count={4} />
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-stroke-soft bg-bg-white px-6 py-12">
          <div className="flex size-12 items-center justify-center rounded-lg bg-error-light">
            <WarningCircle className="size-6 text-error" weight="regular" />
          </div>
          <p className="text-sm font-medium text-text-strong">{error}</p>
          <Button variant="neutral" onClick={load}>Retry</Button>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={incidents.length === 0 ? "No incidents" : "No matching incidents"}
          description={
            incidents.length === 0
              ? "All monitors are running smoothly."
              : "Try a different search term."
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((inc) => {
            const badge = statusBadge[inc.status] ?? { color: "gray", variant: "stroke" };
            return (
              <div
                key={inc.id}
                onClick={() => navigate({ to: "/incidents/$id", params: { id: inc.id } })}
                className="cursor-pointer rounded-lg border border-stroke-soft bg-bg-white px-4 py-3.5 transition hover:border-stroke-sub"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-strong">{inc.title}</span>
                    {inc.isAutomatic && (
                      <Badge variant="stroke" color="gray" size="sm">auto</Badge>
                    )}
                    <Badge variant={badge.variant} color={badge.color} size="sm">{inc.status}</Badge>
                  </div>
                </div>
                <p className="mt-1 text-sm text-text-sub">
                  {new Date(inc.startedAt).toLocaleString()}
                  {inc.resolvedAt && <> &mdash; resolved {new Date(inc.resolvedAt).toLocaleString()}</>}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
