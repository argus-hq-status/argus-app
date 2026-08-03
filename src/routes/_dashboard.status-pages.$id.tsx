import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { CaretRight, ArrowUpRight } from "@phosphor-icons/react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
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

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api(`/api/status-pages/${params.id}`);
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
    await api(`/api/status-pages/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });
    setSaving(false);
    navigate({ to: "/status-pages" });
  }

  if (loading) return <ListSkeleton count={3} />;
  if (!page) return <p className="text-sm text-gray-500 dark:text-gray-400">Not found</p>;

  return (
    <div className="mx-auto max-w-lg">
      <Card className="p-6 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium tracking-tight text-gray-900 dark:text-gray-50">
              Edit status page
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Update the name and public URL slug
            </p>
          </div>
          {page && (
            <a href={`/status/${page.slug}`} target="_blank" rel="noopener noreferrer">
              <Button variant="neutral" mode="ghost" size="sm" icon={ArrowUpRight}>View</Button>
            </a>
          )}
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-gray-700 dark:text-gray-300">Slug</Label>
            <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <Button variant="primary" loading={saving} onClick={handleSave} className="w-full font-normal">
            Save changes <CaretRight className="size-3.5" weight="bold" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
