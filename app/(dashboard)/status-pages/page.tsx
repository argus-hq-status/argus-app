"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StackSimple, Plus, Pencil, ArrowUpRight } from "@phosphor-icons/react";
import { Input } from "@cloudflare/kumo";
import { Button } from "@/components/ui/button";
import { useSetHeader } from "@/components/layout-context";
import { EmptyState } from "@/components/empty-state";
import { ListSkeleton } from "@/components/loading-skeleton";
import { apiUrl } from "@/lib/api";

interface StatusPage {
  id: string;
  name: string;
  slug: string;
}

export default function StatusPagesPage() {
  const router = useRouter();
  const [pages, setPages] = useState<StatusPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [creating, setCreating] = useState(false);

  useSetHeader({
    title: "Status Pages",
    description: "Public-facing status pages for your users",
  });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl("/api/status-pages"));
      setPages(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const res = await fetch(apiUrl("/api/status-pages"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });
    if (res.ok) {
      setName("");
      setSlug("");
      load();
    }
    setCreating(false);
  }

  return (
    <div>
      <form onSubmit={handleCreate} className="mb-8 flex items-end gap-3">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="My Status Page" />
        <Input label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="my-status" />
        <Button type="submit" variant="primary" icon={Plus} loading={creating}>Create</Button>
      </form>

      {loading ? (
        <ListSkeleton count={3} />
      ) : pages.length === 0 ? (
        <EmptyState icon={StackSimple} title="No status pages" description="Create a status page to share with your users." />
      ) : (
        <div className="space-y-2">
          {pages.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-stroke-soft bg-bg-white px-4 py-3.5">
              <div>
                <span className="text-sm font-medium text-text-strong">{p.name}</span>
                <span className="ml-3 text-sm text-text-soft">/{p.slug}</span>
              </div>
              <div className="flex items-center gap-1">
                <a
                  href={`/status/${p.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-8 items-center justify-center rounded-lg text-text-soft transition hover:bg-muted hover:text-text-strong"
                  aria-label="View public page"
                >
                  <ArrowUpRight className="size-4" weight="bold" />
                </a>
                <Button variant="neutral" mode="ghost" size="sm" icon={Pencil} onClick={() => router.push(`/status-pages/${p.id}`)} aria-label="Edit" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
