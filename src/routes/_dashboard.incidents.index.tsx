import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { WarningCircle } from "@phosphor-icons/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui";
import { PageHeader } from "~/components/page-header";
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

const listCardClass = "cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-3.5 transition hover:border-gray-300 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:hover:border-gray-600";

export const Route = createFileRoute("/_dashboard/incidents/")({
  component: IncidentsPage,
});

function IncidentsPage() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

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
      <PageHeader
        icon={WarningCircle}
        title="Incidents"
        description="Track and manage incidents across your monitors"
      />

      <div className="mb-4">
        <Input
          aria-label="Search incidents"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search incidents..."
          className="h-10 w-full font-mono text-sm sm:max-w-md"
        />
      </div>

      {loading ? (
        <ListSkeleton count={4} />
      ) : error ? (
        <EmptyState
          title="Something went wrong"
          description={error}
          action={<Button variant="primary" onClick={load}>Retry</Button>}
        />
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
                className={listCardClass}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-50">{inc.title}</span>
                    {inc.isAutomatic && (
                      <Badge variant="stroke" color="gray" size="sm">auto</Badge>
                    )}
                    <Badge variant={badge.variant} color={badge.color} size="sm">{inc.status}</Badge>
                  </div>
                </div>
                <p className="mt-1 font-mono text-xs text-gray-500 dark:text-gray-400">
                  {new Date(inc.startedAt).toLocaleString()}
                  {inc.resolvedAt && <> — resolved {new Date(inc.resolvedAt).toLocaleString()}</>}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
