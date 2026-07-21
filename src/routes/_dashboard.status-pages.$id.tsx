import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { Input } from "@cloudflare/kumo";
import { Button } from "~/components/ui/button";
import { useSetHeader } from "~/components/layout-context";
import { api } from "~/lib/api";
import { ListSkeleton } from "~/components/loading-skeleton";

export const Route = createFileRoute("/_dashboard/status-pages/$id")({
  component: EditStatusPage,
});

function EditStatusPage() {
  const params = useParams({ from: "/_dashboard/status-pages/$id" });
  const navigate = useNavigate();
  const [page, setPage] = useState<{ id: string; name: string; slug: string; publicUrl?: string } | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useSetHeader({
    title: page?.name ?? "Status Page",
    breadcrumb: [
      { label: "Status Pages", href: "/status-pages" },
      { label: page?.name ?? "Loading..." },
    ],
    actions: page ? (
      <div className="flex items-center gap-2">
        <a href={`/status/${page.slug}`} target="_blank" rel="noopener noreferrer">
          <Button variant="neutral" mode="ghost" size="sm" icon={ArrowUpRight}>View</Button>
        </a>
      </div>
    ) : undefined,
  });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api(\`/api/status-pages/${params.id}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setPage(data);
      setName(data.name);
      setSlug(data.slug);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { load(); }, [load]);

  async function handleSave() {
    setSaving(true);
    await api(\`/api/status-pages/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });
    setSaving(false);
    navigate({ to: "/status-pages" });
  }

  if (loading) return <ListSkeleton count={3} />;
  if (!page) return <p className="text-sm text-text-sub">Not found</p>;

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
      <Button variant="primary" icon={ArrowRight} loading={saving} onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}
