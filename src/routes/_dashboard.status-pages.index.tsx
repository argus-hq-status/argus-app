import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, ArrowUpRight, StackSimple } from "@phosphor-icons/react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { PageHeader } from "~/components/page-header";
import { EmptyState } from "~/components/empty-state";
import { api } from "~/lib/api";
import { ListSkeleton } from "~/components/loading-skeleton";

interface StatusPage {
  id: string;
  name: string;
  slug: string;
}

const listCardClass = "flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3.5 dark:border-[#2a2a2a] dark:bg-[#1a1a1a]";

export const Route = createFileRoute("/_dashboard/status-pages/")({
  component: StatusPagesPage,
});

function StatusPagesPage() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<StatusPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api("/api/status-pages");
      setPages(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const res = await api("/api/status-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });
    if (res.ok) { setName(""); setSlug(""); load(); }
    setCreating(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={StackSimple}
        title="Status Pages"
        description="Public-facing status pages for your users"
      />

      <Card className="p-5">
        <h2 className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-50">Create status page</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="My Status Page" />
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="slug" className="text-gray-700 dark:text-gray-300">Slug</Label>
            <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="my-status" className="font-sans" />
          </div>
          <Button type="submit" variant="primary" icon={Plus} loading={creating} className="font-normal">
            Create
          </Button>
        </form>
      </Card>

      {loading ? (
        <ListSkeleton count={3} />
      ) : pages.length === 0 ? (
        <EmptyState title="No status pages" description="Create a status page to share with your users." />
      ) : (
        <div className="space-y-2">
          {pages.map((p) => (
            <div key={p.id} className={listCardClass}>
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-50">{p.name}</span>
                <span className="ml-3 font-sans text-sm text-gray-500 dark:text-gray-400">/{p.slug}</span>
              </div>
              <div className="flex items-center gap-1">
                <a href={`/status/${p.slug}`} target="_blank" rel="noopener noreferrer"
                  className="flex size-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                  aria-label="View public page">
                  <ArrowUpRight className="size-4" weight="bold" />
                </a>
                <Button variant="neutral" mode="ghost" size="sm" icon={Pencil} onClick={() => navigate({ to: "/status-pages/$id", params: { id: p.id } })} aria-label="Edit" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
